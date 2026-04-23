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
  const [errors,setErrors]=useState({});

  // Assign
  const [selectedStaff, setSelectedStaff] = useState("");

  //  EDIT STATE
const [editId, setEditId] = useState(null);

  //  Fetch Data
  const fetchData = async () => {
  try {
    let res;

    const role =getUser()?.role;

    if (role?.toLowerCase()==="resident") {
      res = await API.get("/maintenance/my");
    } else {
      res = await API.get("/maintenance");
    }
      
      console.log("REQUESTS:",res.data);

      //  users 
      if(role!=="resident"){
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

  //  CREATE REQUEST (Resident)
  const createRequest = async () => {

    let newErrors = {};

  if (!title.trim()) {
    newErrors.title = "Title required";
  } else if (title.trim().length < 3) {
    newErrors.title = "Minimum 3 characters";
  }

  if (!issue.trim()) {
    newErrors.issue = "Issue required";
  } else if (issue.trim().length < 5) {
    newErrors.issue = "Minimum 5 characters";
  }

  if (!priority) {
    newErrors.priority = "Select priority";
  }

  if (Object.keys(newErrors).length > 0) {
    setErrors(newErrors);
    toast.error(Object.values(newErrors)[0]);
    return;
  }

    try {
      await API.post("/maintenance", {
        title,
        issue,
        priority
      });

      toast.success("Request created ");

      setTitle("");
      setIssue("");
      setPriority("low");
      setErrors({});

      await fetchData(); 

    } catch (err) {
      toast.error(err.response?.data?.message || "Creation failed");
      
    }
};


  //  DELETE
  const deleteRequest = (id) => {
  toast.info(
    <div>
      <p>Are you sure you want to delete this request?</p>

      <button
        onClick={async () => {
          try {
            await API.delete(`/maintenance/${id}`);
            toast.success("Deleted successfully ");
            fetchData();
            toast.dismiss(); // close confirm toast
          } catch (err) {
            console.log(err.response?.data);
            toast.error(err.response?.data?.message || "Delete failed ");
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
  

  //  ASSIGN STAFF
  const assignTask = async (id) => {
  try {
    if (!selectedStaff) {
      return toast.warning("Select a staff member ");
    }

    await API.put(`/maintenance/assign/${id}`, {
      staffId: selectedStaff
    });

    toast.success("Task assigned 👨‍🔧");

    fetchData();

  } catch (err) {
    toast.error(err.response?.data?.message || "Assign failed ");
  }
};
  //  UPDATE STATUS
  
  const updateStatus = async (id, status) => {
  try {
    await API.put(`/maintenance/status/${id}`, { status});

    toast.success(`Status updated to ${status}` );

    fetchData();

  } catch (err) {
    console.error(err);
    toast.error(err.response?.data?.message || "Status update failed ");
  }
};

  //  UPDATE REQUEST
const updateRequest = async () => {
  try {
    await API.put(`/maintenance/${editId}`, {
      title,
      issue,
      priority
    });

    toast.success(" Request Updated ");

    setEditId(null);
    setTitle("");
    setIssue("");
    setPriority("low");

    fetchData();

  } catch (err) {
    toast.error(err.response?.data?.message || "Update failed ");
};
}

  return (
  <Layout>
    <h1 className="text-4xl font-bold text-gray-800 mb-6">
      🛠 Maintenance Requests
    </h1>

    {/* Create Form */}
    {role === "resident" && (
      <div className="bg-white p-6 rounded-2xl shadow-md mb-8">
        <h2 className="text-xl font-semibold mb-4">
          {editId ? "Edit Request" : "Create Request"}
        </h2>

        <div className="grid md:grid-cols-4 gap-4">
          <input
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="border p-3 rounded-lg"
          />

          <input
            placeholder="Issue Description"
            value={issue}
            onChange={(e) => setIssue(e.target.value)}
            className="border p-3 rounded-lg"
          />

          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            className="border p-3 rounded-lg"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>

          <button
            onClick={editId ? updateRequest : createRequest}
            className="bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg font-semibold"
          >
            {editId ? "Update" : "Submit"}
          </button>
        </div>
      </div>
    )}

    {/* Cards */}
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {requests.map((req) => (
        <div
          key={req._id}
          className="bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition"
        >
          <h2 className="text-xl font-bold text-gray-800 mb-2">
            {req.title}
          </h2>

          <p className="text-gray-600 mb-4">{req.issue}</p>

          {/* Priority */}
          <p className="mb-2">
            Priority:{" "}
            <span
              className={`px-3 py-1 rounded-full text-sm font-semibold ${
                req.priority === "high"
                  ? "bg-red-100 text-red-600"
                  : req.priority === "medium"
                  ? "bg-yellow-100 text-yellow-700"
                  : "bg-green-100 text-green-600"
              }`}
            >
              {req.priority}
            </span>
          </p>

          {/* Status */}
          <p className="mb-2">
            Status:{" "}
            <span
              className={`font-semibold ${
                req.status === "completed"
                  ? "text-green-600"
                  : req.status === "in-progress"
                  ? "text-yellow-600"
                  : "text-gray-500"
              }`}
            >
              {req.status}
            </span>
          </p>

          <p className="mb-4 text-sm text-gray-500">
            Assigned To: {req.assignedTo?.name || "Not Assigned"}
          </p>

          {/* Admin / Staff */}
          {(role === "admin" || role === "staff") && (
            <>
              {role === "admin" && (
                <div className="mb-3">
                  <select
                    onChange={(e) => setSelectedStaff(e.target.value)}
                    className="border p-2 rounded-lg w-full mb-2"
                  >
                    <option>Select Staff</option>

                    {users
                      .filter((u) => u.role === "staff")
                      .map((u) => (
                        <option key={u._id} value={u._id}>
                          {u.name}
                        </option>
                      ))}
                  </select>

                  <button
                    onClick={() => assignTask(req._id)}
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg w-full"
                  >
                    Assign Staff
                  </button>
                </div>
              )}

              <div className="grid grid-cols-2 gap-2 mb-2">
                <button
                  onClick={() =>
                    updateStatus(req._id, "in-progress")
                  }
                  className="bg-yellow-500 text-white py-2 rounded-lg"
                >
                  In Progress
                </button>

                <button
                  onClick={() =>
                    updateStatus(req._id, "completed")
                  }
                  className="bg-green-500 text-white py-2 rounded-lg"
                >
                  Completed
                </button>
              </div>

              <button
                onClick={() => deleteRequest(req._id)}
                className="bg-red-500 text-white py-2 rounded-lg w-full"
              >
                Delete
              </button>
            </>
          )}

          {/* Resident Controls */}
          {role === "resident" && (
            <div className="grid grid-cols-2 gap-2">
              {req.status === "pending" && (
                <button
                  onClick={() => {
                    setEditId(req._id);
                    setTitle(req.title);
                    setIssue(req.issue);
                    setPriority(req.priority);
                  }}
                  className="bg-blue-500 text-white py-2 rounded-lg"
                >
                  Edit
                </button>
              )}

              <button
                onClick={() => deleteRequest(req._id)}
                className="bg-red-500 text-white py-2 rounded-lg"
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