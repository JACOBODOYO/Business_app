import React, { useState, useEffect } from "react";
import axios from "axios";
import PropTypes from 'prop-types';

export default function PopupNotes({ leadId, title, onClose,onAddNotes }) {
  const [note, setNote] = useState('');
  const [noteList, setNoteList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch existing notes from DB when modal opens
  useEffect(() => {
    const fetchNotes = async () => {
      if (!leadId) {
        setError("No lead provided for fetching notes");
        return;
      }

      setIsLoading(true);
      setError(null);
      
      try {
        const response = await axios.get(`http://localhost:3001/notes`, {
          params: { lead_id: leadId }  // Using query parameter
        });
        setNoteList(response.data);
      } catch (error) {
        console.error("Failed to fetch notes:", error);
        setError("Failed to load notes. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchNotes();
  }, [leadId]);

  const handleAddNote = async () => {
    if (!note.trim()) return;

    if (!leadId) {
      setError("No lead provided for saving note");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.post("http://localhost:3001/notes", {
        lead_id: leadId,  // Matching backend expectation
        text: note,
      });

      setNoteList(prev => [response.data, ...prev]);  // Newest note first
      setNote('');
    } catch (error) {
      console.error("Failed to save note:", error);
      setError(error.response?.data?.message || "Failed to save note. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (timestamp) => {
    try {
      const date = new Date(timestamp);
      return isNaN(date.getTime()) ? 'Invalid date' : date.toLocaleString();
    } catch {
      return 'Invalid date';
    }
  };

  PopupNotes.propTypes = {
    leadId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    title: PropTypes.string,
    onClose: PropTypes.func.isRequired,
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded shadow-lg w-[400px] max-h-[80vh] overflow-y-auto animate-slide-up">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">{title || 'Notes'}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800">
            ✕
          </button>
        </div>

        {error && (
          <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        )}

        <div className="mb-4">
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Write your note here..."
            className="w-full p-2 border border-gray-300 rounded"
            rows={3}
            disabled={isLoading}
          />
          <button
            onClick={handleAddNote}
            className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-blue-300"
            disabled={!note.trim() || isLoading}
          >
            {isLoading ? 'Adding...' : 'Add Note'}
          </button>
        </div>

        <div className="mt-4">
          <h3 className="text-md font-semibold mb-2">Notes</h3>
          {isLoading && noteList.length === 0 ? (
            <p className="text-gray-500">Loading notes...</p>
          ) : noteList.length === 0 ? (
            <p className="text-gray-500">No notes yet.</p>
          ) : (
            noteList.map((item) => (
              <div key={item.id} className="mb-2 p-3 bg-gray-100 rounded shadow-sm">
                <p className="text-sm">{item.text}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {formatDate(item.created_at)}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}