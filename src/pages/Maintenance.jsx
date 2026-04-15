import { useEffect, useState } from "react";
import API from "../services/api";
import Layout from "../components/Layout";
import { getUser } from "../utils/auth";
import {toast} from "react-toastify";

export default function Maintenance() {
  const user = getUser();
  const role = (user?.role ||"").toLowerCase();

  const [requests, setRequests] = useState([]);
  const [users, setUsers] = useState([]);

  // Create
  const [title, setTitle] = useState("");
  const [issue, setIssue] = useState("");
  const [priority, setPriority] = useState("low");

  // Assign
  const [selectedStaff, setSelectedStaff] = useState("");

  // ✏️ EDIT STATE
const [editId, setEditId] = useState(null);

  // 🔄 Fetch Data
  const fetchData = async () => {
  try {
    let res;

    const role =getUser()?.role;

    if (role?.toLowerCase()==="resident") {
      res = await API.get("/maintenance/my");
    } else {
      res = await API.get("/maintenance");
      
      console.log("REQUESTS:",res.data);

      // 👇 ADD THIS (VERY IMPORTANT)
      const usersRes = await API.get("/users");
      console.log("USERS:", usersRes.data);
      setUsers(usersRes.data);
    }

    
    setRequests(res.data);

  } catch (err) {
    toast.error("Failed to load data");
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
        issue,
        priority
      });

      toast.success("Request created ✅");

      setTitle("");
      setIssue("");
      setPriority("low");

      fetchData();

    } catch (err) {
      toast.error(err.response?.data?.message || "Creation failed");
    }
  };

  // 🗑️ DELETE
  const deleteRequest = (id) => {
  toast.info(
    <div>
      <p>Are you sure you want to delete this request?</p>

      <button
        onClick={async () => {
          try {
            await API.delete(`/maintenance/${id}`);
            toast.success("Deleted successfully ✅");
            fetchData();
            toast.dismiss(); // close confirm toast
          } catch (err) {
            console.log(err.response?.data);
            toast.error(err.response?.data?.message || "Delete failed ❌");
          }
        }}
        style={{ marginRight: "10px" }}
      >
        Yes
      </button>

      <button onClick={() => toast.dismiss()}>
        Cancel
      </button>
    </div>,
    { autoClose: false }
  );
};
  

  // 👨‍🔧 ASSIGN STAFF
  const assignTask = async (id) => {
  try {
    if (!selectedStaff) {
      return toast.warning("Select a staff member ⚠️");
    }

    await API.put(`/maintenance/assign/${id}`, {
      staffId: selectedStaff
    });

    toast.success("Task assigned 👨‍🔧");

    fetchData();

  } catch (err) {
    toast.error(err.response?.data?.message || "Assign failed ❌");
  }
};
  // 🔄 UPDATE STATUS
  
  const updateStatus = async (id, status) => {
  try {
    await API.put(`/maintenance/status/${id}`, { status});

    toast.success(`Status updated to ${status}` );

    fetchData();

  } catch (err) {
    console.error(err);
    toast.error(err.response?.data?.message || "Status update failed ❌");
  }
};

  // ✏️ UPDATE REQUEST
const updateRequest = async () => {
  try {
    await API.put(`/maintenance/${editId}`, {
      title,
      issue,
      priority
    });

    toast.success(" Request Updated ✅");

    setEditId(null);
    setTitle("");
    setIssue("");
    setPriority("low");

    fetchData();

  } catch (err) {
    toast.error(err.response?.data?.message || "Update failed ❌");
};
}

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
            placeholder="issue Description"
            value={issue}
            onChange={(e) => setIssue(e.target.value)}
            className="border p-2 mr-2"
          />

          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            className="border p-2 mr-2"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>

          <button
           onClick={editId ? updateRequest : createRequest}
  className="bg-green-500 text-white px-4"
>
  {editId ? "Update" : "Submit"}
          </button>
        </div>
      )}

      {/* 📋 REQUEST LIST */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

        {requests.map((req) => (
          <div key={req._id} className="bg-white p-5 rounded shadow">

            <h2 className="font-bold">{req.title || "No Title"}</h2>
<p>{req.issue || "No Issue Description"}</p>

            <p className="mt-2">
              Priority: <b>{req.priority}</b>
            </p>

            <p>Status: {req.status}</p>

            <p>
              
  Assigned To: {req.assignedTo?.name || "Not Assigned"}
</p>


            {/* ADMIN / STAFF */}
            {(role === "admin" || role === "staff") && (
              <>
                {/* Assign */}
                {role === "admin" && (
                  <div className="mt-2">
                    <select
  onChange={(e) => setSelectedStaff(e.target.value)}
  className="border p-2"
>
  <option value="">Select Staff</option>

  {users
    .filter(u => u.role?.toLowerCase() === "staff") // 👈 HERE
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

                <button
        onClick={() => deleteRequest(req._id)}
        className="bg-red-500 text-white px-2 mt-2"
      >
        Delete
      </button>
    </>
  )}

                {/* 👨‍🎓 RESIDENT CONTROLS */}
{role === "resident" && (
  <div className="mt-2">

    {/* EDIT (only if pending) */}
    {req.status === "pending" && (
      <button
        onClick={() => {
          setEditId(req._id);
          setTitle(req.title);
          setIssue(req.issue);
          setPriority(req.priority);
        }}
        className="bg-blue-500 text-white px-2 mr-2"
      >
        Edit
      </button>
    )}
    

                    {/* Delete */}
                <button
                  onClick={() => deleteRequest(req._id)}
                  className="bg-red-500 text-white px-2 mt-2"
                >
                  Delete
                </button>
                </div>
)}
</div>
        ))}
        </div>
                
    </Layout>
  );
}