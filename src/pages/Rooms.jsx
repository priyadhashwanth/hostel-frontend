import { useEffect, useState } from "react";
import API from "../services/api";
import Layout from "../components/Layout";

export default function Rooms() {
  const [rooms, setRooms] = useState([]);
  const [users, setUsers] = useState([]);

  // Create
  const [roomNumber, setRoomNumber] = useState("");
  const [capacity, setCapacity] = useState("");

  // Assign
  const [selectedUser, setSelectedUser] = useState("");
  const [selectedRoom, setSelectedRoom] = useState("");

  // Edit
  const [editRoomId, setEditRoomId] = useState(null);
  const [editCapacity, setEditCapacity] = useState("");

  // 🔄 Fetch data
  const fetchData = async () => {
    try {
      const roomsRes = await API.get("/rooms");
      const usersRes = await API.get("/users");

      setRooms(roomsRes.data);
      setUsers(usersRes.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // ➕ CREATE ROOM
  const createRoom = async () => {
    try {
      await API.post("/rooms", {
        roomNumber,
        capacity
      });

      alert("Room Created ✅");
      setRoomNumber("");
      setCapacity("");
      fetchData();

    } catch (err) {
      alert(err.response?.data?.message);
    }
  };

  // 🗑️ DELETE ROOM
  const deleteRoom = async (id) => {
    if (!window.confirm("Delete this room?")) return;

    await API.delete(`/rooms/${id}`);
    fetchData();
  };

  // ✏️ START EDIT
  const startEdit = (room) => {
    setEditRoomId(room._id);
    setEditCapacity(room.capacity);
  };

  // 💾 UPDATE ROOM
  const updateRoom = async () => {
    await API.put(`/rooms/${editRoomId}`, {
      capacity: editCapacity
    });

    setEditRoomId(null);
    fetchData();
  };

  // 🏠 ASSIGN ROOM
  const assignRoom = async () => {
    if (!selectedUser || !selectedRoom) {
      return alert("Select user and room");
    }

    await API.post("/rooms/assign", {
      userId: selectedUser,
      roomId: selectedRoom
    });

    alert("Room Assigned ✅");
    fetchData();
  };

  // 🚪 CHECKOUT
  const checkout = async (userId) => {
    await API.post("/rooms/checkout", { userId });
    fetchData();
  };

  return (
    <Layout>
      <h1 className="text-3xl font-bold mb-6">Room Management</h1>

      {/* ➕ CREATE ROOM */}
      <div className="bg-white p-6 rounded-xl shadow mb-6">
  <h2 className="text-xl font-semibold mb-4">Create Room</h2>

  <div className="flex gap-4">
    <input
      placeholder="Room Number"
      value={roomNumber}
      onChange={(e) => setRoomNumber(e.target.value)}
      className="border p-3 rounded w-1/3"
    />

    <input
      placeholder="Capacity"
      value={capacity}
      onChange={(e) => setCapacity(e.target.value)}
      className="border p-3 rounded w-1/3"
    />

    <button
      onClick={createRoom}
      className="bg-green-500 hover:bg-green-600 text-white px-6 rounded"
    >
      Add Room
    </button>
  </div>
</div>


      {/* 🏠 ASSIGN ROOM */}
      
      <div className="bg-white p-6 rounded-xl shadow mb-6">
  <h2 className="text-xl font-semibold mb-4">Assign Room</h2>

  <div className="flex gap-4">
    <select
      onChange={(e) => setSelectedUser(e.target.value)}
      className="border p-3 rounded w-1/3"
    >
      <option>Select User</option>
      {users.map((u) => (
        <option key={u._id} value={u._id}>
          {u.name}
        </option>
      ))}
    </select>

    <select
      onChange={(e) => setSelectedRoom(e.target.value)}
      className="border p-3 rounded w-1/3"
    >
      <option>Select Room</option>
      {rooms.map((r) => (
        <option key={r._id} value={r._id}>
          Room {r.roomNumber} (Available: {r.capacity - r.occupants.length})
        </option>
      ))}
    </select>

    <button
      onClick={assignRoom}
      className="bg-blue-500 hover:bg-blue-600 text-white px-6 rounded"
    >
      Assign
    </button>
  </div>
</div>

      {/* 🧾 ROOMS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {rooms.map((room) => {
    const isFull = room.occupants.length >= room.capacity;

    return (
      <div key={room._id} className="bg-white p-5 rounded-xl shadow">

        <div className="flex justify-between items-center">
          <h2 className="text-lg font-bold">
            Room {room.roomNumber}
          </h2>

          <span className={`text-sm px-2 py-1 rounded ${
            isFull ? "bg-red-100 text-red-600" : "bg-green-100 text-green-600"
          }`}>
            {isFull ? "Full" : "Available"}
          </span>
        </div>

        <p className="text-gray-600 mt-2">
          Capacity: {room.capacity}
        </p>

        {/* Edit */}
        {editRoomId === room._id ? (
          <div className="mt-3 flex gap-2">
            <input
              value={editCapacity}
              onChange={(e) => setEditCapacity(e.target.value)}
              className="border p-2 rounded w-full"
            />

            <button
              onClick={updateRoom}
              className="bg-blue-500 text-white px-3 rounded"
            >
              Save
            </button>
          </div>
        ) : (
          <button
            onClick={() => startEdit(room)}
            className="bg-yellow-500 text-white px-3 py-1 mt-3 rounded"
          >
            Edit
          </button>
        )}

        {/* Delete */}
        <button
          onClick={() => deleteRoom(room._id)}
          className="bg-red-500 text-white px-3 py-1 mt-3 ml-2 rounded"
        >
          Delete
        </button>

        {/* Occupants */}
        <div className="mt-4">
          <h3 className="font-semibold">Occupants</h3>

          {room.occupants.length === 0 && (
            <p className="text-gray-400">No occupants</p>
          )}

          {room.occupants.map((u) => (
            <div key={u._id} className="flex justify-between mt-2 bg-gray-100 p-2 rounded">
              <span>{u.name}</span>

              <button
                onClick={() => checkout(u._id)}
                className="bg-red-500 text-white px-2 rounded"
              >
                Checkout
              </button>
            </div>
          ))}
        </div>

      </div>
    );
  })}
</div>
</Layout>
  );
}