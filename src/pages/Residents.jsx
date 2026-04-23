import { useEffect, useState } from "react";
import API from "../services/api";
import Layout from "../components/Layout";
import { getUser } from "../utils/auth";
import { toast } from "react-toastify";

export default function Residents() {
  const user = getUser();
  const role = user?.role?.toLowerCase();

  const [residents, setResidents] = useState([]);
  const [editId, setEditId] = useState(null);

  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: "",
    emergencyName: "",
    emergencyPhone: "",
    relation: ""
  });

  //  Fetch Residents
  const fetchUsers = async () => {
    try {
const storedUser=JSON.parse(localStorage.getItem("user"));

      if (storedUser?.role === "resident") {
      
        //  FETCH FROM BACKEND
      const res = await API.get("auth/me");
  
        setResidents([res.data]);
} else {
  const res = await API.get("/users");

  const residentsOnly = res.data.filter(
    (user) => user.role === "resident"
  );

  setResidents(residentsOnly);
}
    } catch (err) {
      toast.error("Failed to load residents");
    }
  };

  useEffect(() => {

    fetchUsers();
  }, []);

  //  Edit Click
  const handleEdit = (r) => {
    setEditId(r._id);

    setForm({
      name: r.name || "",
      phone: r.phone || "",
      address: r.address || "",
      emergencyName: r.emergencyContact?.name || "",
      emergencyPhone: r.emergencyContact?.phone || "",
      relation: r.emergencyContact?.relation || ""
    });
  };

  //  Update Resident
  const updateResident = async () => {
    try {
      await API.put(`/users/${editId}`, {
        name: form.name,
        phone: form.phone,
        address: form.address,
        emergencyContact: {
          name: form.emergencyName,
          phone: form.emergencyPhone,
          relation: form.relation
        }
      });

      toast.success("Resident updated ");
      setEditId(null);
      fetchUsers();

    } catch (err) {
      toast.error("Update failed ");
    }
  };

  return (
  <Layout>
    <h1 className="text-4xl font-bold text-gray-800 mb-2">
      Residents 👨‍🎓
    </h1>

    <p className="text-gray-500 mb-6">
      Manage all hostel residents easily
    </p>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {residents.map((r) => (
        <div
          key={r._id}
          className="bg-white p-6 rounded-2xl shadow hover:shadow-xl transition"
        >
          {editId !== r._id ? (
            <>
              <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xl font-bold">
                  {r.name?.charAt(0)}
                </div>

                <div>
                  <h2 className="text-xl font-bold text-gray-800">
                    {r.name}
                  </h2>
                  <p className="text-sm text-gray-500">
                    {r.email}
                  </p>
                </div>
              </div>

              <div className="space-y-2 text-gray-600">
                <p>📞 {r.phone || "-"}</p>
                <p>📍 {r.address || "-"}</p>
                <p>🏠 Room: {r.room?.roomNumber || "Not Assigned"}</p>
                <p>
                  🚨 Emergency:{" "}
                  {r.emergencyContact?.name || "-"} (
                  {r.emergencyContact?.phone || "-"})
                </p>
              </div>

              {role === "admin" && (
                <button
                  onClick={() => handleEdit(r)}
                  className="mt-5 bg-blue-500 hover:bg-blue-600 text-white px-5 py-2 rounded-lg"
                >
                  Edit Resident
                </button>
              )}
            </>
          ) : (
            <>
              <input
                value={form.name}
                onChange={(e) =>
                  setForm({ ...form, name: e.target.value })
                }
                placeholder="Name"
                className="border p-3 rounded-lg mb-3 w-full"
              />

              <input
                value={form.phone}
                onChange={(e) =>
                  setForm({ ...form, phone: e.target.value })
                }
                placeholder="Phone"
                className="border p-3 rounded-lg mb-3 w-full"
              />

              <input
                value={form.address}
                onChange={(e) =>
                  setForm({ ...form, address: e.target.value })
                }
                placeholder="Address"
                className="border p-3 rounded-lg mb-3 w-full"
              />

              <input
                value={form.emergencyName}
                onChange={(e) =>
                  setForm({
                    ...form,
                    emergencyName: e.target.value,
                  })
                }
                placeholder="Emergency Name"
                className="border p-3 rounded-lg mb-3 w-full"
              />

              <input
                value={form.emergencyPhone}
                onChange={(e) =>
                  setForm({
                    ...form,
                    emergencyPhone: e.target.value,
                  })
                }
                placeholder="Emergency Phone"
                className="border p-3 rounded-lg mb-3 w-full"
              />

              <input
                value={form.relation}
                onChange={(e) =>
                  setForm({
                    ...form,
                    relation: e.target.value,
                  })
                }
                placeholder="Relation"
                className="border p-3 rounded-lg mb-4 w-full"
              />

              <div className="flex gap-3">
                <button
                  onClick={updateResident}
                  className="bg-green-500 hover:bg-green-600 text-white px-5 py-2 rounded-lg"
                >
                  Save
                </button>

                <button
                  onClick={() => setEditId(null)}
                  className="bg-gray-400 hover:bg-gray-500 text-white px-5 py-2 rounded-lg"
                >
                  Cancel
                </button>
              </div>
            </>
          )}
        </div>
      ))}
    </div>
  </Layout>
);
  
}