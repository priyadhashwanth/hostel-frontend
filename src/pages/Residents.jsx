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

  // 🔄 Fetch Residents
  const fetchUsers = async () => {
    try {
const storedUser=JSON.parse(localStorage.getItem("user"));

      if (storedUser?.role === "resident") {
  setResidents([storedUser]);
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

  // ✏️ Edit Click
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

  // 💾 Update Resident
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

      toast.success("Resident updated ✅");
      setEditId(null);
      fetchUsers();

    } catch (err) {
      toast.error("Update failed ❌");
    }
  };

  return (
    <Layout>
      <h1 className="text-3xl font-bold mb-6">Residents 👨‍🎓</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

        {residents.map((r) => (
          <div key={r._id} className="bg-white p-5 rounded shadow">

            {/* VIEW MODE */}
            {editId !== r._id ? (
              <>
                <h2 className="font-bold text-lg">{r.name}</h2>

                <p>Email: {r.email}</p>
                <p>Phone: {r.phone || "-"}</p>
                <p>Address: {r.address || "-"}</p>

                <p className="mt-2">
                  Room: {r.room?.roomNumber || "Not Assigned"}
                </p>

                <p>
                  Emergency: {r.emergencyContact?.name || "-"} (
                  {r.emergencyContact?.phone || "-"})
                </p>

                {/* ADMIN ONLY */}
                {role === "admin" && (
                  <button
                    onClick={() => handleEdit(r)}
                    className="bg-blue-500 text-white px-3 mt-3"
                  >
                    Edit
                  </button>
                )}
              </>
            ) : (
              <>
                {/* EDIT MODE */}
                <input
                  value={form.name}
                  onChange={(e) =>
                    setForm({ ...form, name: e.target.value })
                  }
                  placeholder="Name"
                  className="border p-2 mb-2 w-full"
                />

                <input
                  value={form.phone}
                  onChange={(e) =>
                    setForm({ ...form, phone: e.target.value })
                  }
                  placeholder="Phone"
                  className="border p-2 mb-2 w-full"
                />

                <input
                  value={form.address}
                  onChange={(e) =>
                    setForm({ ...form, address: e.target.value })
                  }
                  placeholder="Address"
                  className="border p-2 mb-2 w-full"
                />

                <input
                  value={form.emergencyName}
                  onChange={(e) =>
                    setForm({ ...form, emergencyName: e.target.value })
                  }
                  placeholder="Emergency Name"
                  className="border p-2 mb-2 w-full"
                />

                <input
                  value={form.emergencyPhone}
                  onChange={(e) =>
                    setForm({ ...form, emergencyPhone: e.target.value })
                  }
                  placeholder="Emergency Phone"
                  className="border p-2 mb-2 w-full"
                />

                <input
                  value={form.relation}
                  onChange={(e) =>
                    setForm({ ...form, relation: e.target.value })
                  }
                  placeholder="Relation"
                  className="border p-2 mb-2 w-full"
                />

                <button
                  onClick={updateResident}
                  className="bg-green-500 text-white px-3 mr-2"
                >
                  Save
                </button>

                <button
                  onClick={() => setEditId(null)}
                  className="bg-gray-400 text-white px-3"
                >
                  Cancel
                </button>
              </>
            )}
          </div>
        ))}
      </div>
    </Layout>
  );
}