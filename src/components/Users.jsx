import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "user" });
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:3001/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(res.data);
    } catch (err) {
      console.error("Failed to fetch users:", err);
    }
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post("http://localhost:3001/users", form, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setUsers([...users, res.data]); // update frontend immediately
      setForm({ name: "", email: "", password: "", role: "user" }); // reset form
    } catch (err) {
      console.error("Failed to add user:", err);
      alert(err.response?.data?.error || "Error adding user");
    }
  };

  const handleLoginAsUser = async (user) => {
    const password = window.prompt(`Enter password for ${user.email}`);
    if (password === null) return;

    try {
      const res = await axios.post("http://localhost:3001/auth/login", {
        email: user.email,
        password,
      });

      if (res.data?.loginStatus && res.data.token) {
        localStorage.setItem("token", res.data.token);
        navigate("/dashboard");
      } else {
        alert(res.data?.error || "Login failed");
      }
    } catch (err) {
      console.error("Login error:", err);
      alert("Login request failed");
    }
  };

  return (
    <div className="overflow-auto ml-300 h-full p-4">
      <main className="max-w-7xl mx-auto">
        {/* Add User Form */}
        <div className="px-4 py-6 sm:px-0">
          <div className="border-4 border-gray-200 rounded-lg p-6 mb-6">
            <h1 className="text-2xl font-bold mb-4">Add New User</h1>
            <form className="flex gap-3 flex-wrap" onSubmit={handleAddUser}>
              <input
                type="text"
                placeholder="Name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="border p-2 rounded"
                required
              />
              <input
                type="email"
                placeholder="Email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="border p-2 rounded"
                required
              />
              <input
                type="password"
                placeholder="Password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="border p-2 rounded"
                required
              />
              <select
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
                className="border p-2 rounded"
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
              <button type="submit" className="bg-blue-500 text-white px-4 rounded">
                Add User
              </button>
            </form>
          </div>

          {/* Users List */}
          <div className="border-4 border-gray-200 rounded-lg p-6">
            <h1 className="text-2xl font-bold mb-4">System Users</h1>

            <div className="flex flex-col space-y-3">
              {users.map((user) => (
                <div
                  key={user.id}
                  className="flex justify-between items-center p-3 border rounded hover:bg-gray-100 transition"
                >
                  <div>
                    <p className="font-semibold">{user.name}</p>
                    <p className="text-sm text-gray-500">{user.email}</p>
                  </div>

                  <span
                    className={`px-3 py-1 text-xs rounded ${
                      user.role === "admin"
                        ? "bg-red-100 text-red-600"
                        : "bg-blue-100 text-blue-600"
                    }`}
                  >
                    {user.role}
                  </span>

                  {/* Log in as button */}
                  <div className="ml-4">
                    <button
                      onClick={() => handleLoginAsUser(user)}
                      className="bg-green-500 text-white px-3 py-1 rounded text-sm"
                    >
                      Log in as
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}