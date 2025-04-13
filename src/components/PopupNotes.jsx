import { useEffect, useState } from 'react';

export default function PopupNotes({ title, onClose }) {
  const [note, setNote] = useState('');
  const [notesList, setNotesList] = useState([]);

  // Load notes from localStorage when popup mounts
  useEffect(() => {
    const savedNotes = localStorage.getItem('popup_notes');
    if (savedNotes) {
      setNotesList(JSON.parse(savedNotes));
    }
  }, []); // <- runs every time PopupNotes is mounted

  // Save notes to localStorage whenever notesList changes
  useEffect(() => {
    localStorage.setItem('popup_notes', JSON.stringify(notesList));
  }, [notesList]);

  const handleAddNote = () => {
    if (note.trim() === '') return;

    const newNote = {
      text: note,
      timestamp: new Date().toLocaleString(),
    };

    setNotesList((prev) => [...prev, newNote]);
    setNote('');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded shadow-lg w-[400px] max-h-[80vh] overflow-y-auto animate-slide-up">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">{title}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800">
            ✕
          </button>
        </div>

        <div className="mb-4">
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Write your note here..."
            className="w-full p-2 border border-gray-300 rounded"
            rows={3}
          />
          <button
            onClick={handleAddNote}
            className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Add Note
          </button>
        </div>

        <div className="mt-4">
          <h3 className="font-medium mb-2">Notes:</h3>
          <ul className="space-y-3">
            {notesList.map((item, index) => (
              <li key={index} className="bg-gray-100 p-3 rounded">
                <p className="text-sm text-gray-800">{item.text}</p>
                <p className="text-xs text-gray-500 mt-1">{item.timestamp}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
