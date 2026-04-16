
import { useEffect, useState } from "react";
import API from "../services/api";
import Layout from "../components/Layout";

export default function Users() {
  const [users, setUsers] = useState([]);

  const fetchUsers = async () => {
    const res = await API.get("/users");
    setUsers(res.data);
  }

  const updateRole = async (id, role) => {
    await API.put(`/users/${id}`, { role });
    fetchUsers();
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <Layout>
      <h1 className="text-2xl font-bold mb-4">User Management</h1>

      {users.map(user => (
        <div key={user._id} className="bg-white p-3 mb-2 flex justify-between">
          <span>{user.name}</span>

          <select
            value={user.role}
            onChange={(e) => updateRole(user._id, e.target.value)}
          >
            <option>admin</option>
            <option>staff</option>
            <option>resident</option>
          </select>
        </div>
      ))}
    </Layout>
  );
}
