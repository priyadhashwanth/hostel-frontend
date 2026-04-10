import { useEffect, useState } from "react";
import API from "../services/api";
import Layout from "../components/Layout";
import { getUser } from "../utils/auth";

export default function Maintenance() {
  const user = getUser();
  const role = (user?.role ||"").toLowerCase();

  const [requests, setRequests] = useState([]);
  const [users, setUsers] = useState([]);

  // Create
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("low");

  // Assign
  const [selectedStaff, setSelectedStaff] = useState("");

  // 🔄 Fetch Data
  const fetchData = async () => {
  try {
    let res;

    if (role === "resident") {
      res = await API.get("/maintenance/my");
    } else {
      res = await API.get("/maintenance");
    }

    console.log("DATA:", res.data);

    setRequests(res.data);

  } catch (err) {
    console.log(err);
  }
};

  useEffect(() => {
    fetchData();
  }, []);

  // ➕ CREATE REQUEST (Resident)
  const createRequest = async () => {
    try {
      await API.post("/maintenance", {
        title,
        description,
        priority
      });

      alert("Request created ✅");
      setTitle("");
      setDescription("");
      fetchData();

    } catch (err) {
      alert("Error creating request");
    }
  };

  // 🗑️ DELETE
  const deleteRequest = async (id) => {
    await API.delete(`/maintenance/${id}`);
    fetchData();
  };

  // 👨‍🔧 ASSIGN STAFF
  const assignTask = async (id) => {
    await API.put(`/maintenance/assign/${id}`, {
      staffId: selectedStaff
    });

    alert("Assigned ✅");
    fetchData();
  };

  // 🔄 UPDATE STATUS
  const updateStatus = async (id, status) => {
    await API.put(`/maintenance/status/${id}`, { status });
    fetchData();
  };

  return (
    <Layout>
      <h1 className="text-3xl font-bold mb-6">Maintenance</h1>

      {/* 🧾 CREATE REQUEST (Resident only) */}
      {role === "resident" && (
        <div className="bg-white p-6 rounded shadow mb-6">
          <h2 className="font-semibold mb-3">Create Request</h2>

          <input
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="border p-2 mr-2"
          />

          <input
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="border p-2 mr-2"
          />

          <select
            onChange={(e) => setPriority(e.target.value)}
            className="border p-2 mr-2"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>

          <button
            onClick={createRequest}
            className="bg-green-500 text-white px-4"
          >
            Submit
          </button>
        </div>
      )}

      {/* 📋 REQUEST LIST */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

        {requests.map((req) => (
          <div key={req._id} className="bg-white p-5 rounded shadow">

            <h2 className="font-bold">{req.title}</h2>
            <p>{req.description}</p>

            <p className="mt-2">
              Priority: <b>{req.priority}</b>
            </p>

            <p>Status: {req.status}</p>

            <p>
              Assigned To: {req.assignedTo?.name || "Not Assigned"}
            </p>

            {/* ADMIN CONTROLS */}
            {(role === "admin" || role === "staff") && (
              <>
                {/* Assign */}
                {role === "admin" && (
                  <div className="mt-2">
                    <select
                      onChange={(e) => setSelectedStaff(e.target.value)}
                      className="border p-1"
                    >
                      <option>Select Staff</option>
                      {users
                        .filter(u => u.role === "staff")
                        .map(u => (
                          <option key={u._id} value={u._id}>
                            {u.name}
                          </option>
                        ))}
                    </select>

                    <button
                      onClick={() => assignTask(req._id)}
                      className="bg-blue-500 text-white px-2 ml-2"
                    >
                      Assign
                    </button>
                  </div>
                )}

                {/* Status */}
                <div className="mt-2">
                  <button
                    onClick={() => updateStatus(req._id, "in-progress")}
                    className="bg-yellow-500 text-white px-2 mr-2"
                  >
                    In Progress
                  </button>

                  <button
                    onClick={() => updateStatus(req._id, "completed")}
                    className="bg-green-500 text-white px-2"
                  >
                    Completed
                  </button>
                </div>

                {/* Delete */}
                <button
                  onClick={() => deleteRequest(req._id)}
                  className="bg-red-500 text-white px-2 mt-2"
                >
                  Delete
                </button>
              </>
            )}

          </div>
        ))}

      </div>
    </Layout>
  );
}