import { useEffect, useState } from "react";
import API from "../services/api";
import Layout from "../components/Layout";
import { toast } from "react-toastify";
import { getRole } from "../utils/auth";

export default function Rooms() {
  const [rooms, setRooms] = useState([]);
  const [users, setUsers] = useState([]);

  const role = getRole();

  // Create
  const [roomNumber, setRoomNumber] = useState("");
  const [capacity, setCapacity] = useState("");

  // Assign
  const [selectedUser, setSelectedUser] = useState("");
  const [selectedRoom, setSelectedRoom] = useState("");

  // Edit
  const [editRoomId, setEditRoomId] = useState(null);
  const [editCapacity, setEditCapacity] = useState("");

  // ✅ FETCH DATA (FIXED)
  const fetchData = async () => {
    try {
      
        const res = await API.get("/rooms");
        if(role ==="resident"){
          const user = JSON.parse(localStorage.getItem("user"));

          const myRoom = res.data.find(room =>
        room.occupants?.some(u => u._id === user._id)
      );

        setRooms(myRoom ? [myRoom] :[]); // ✅ only my room
      } else {
        
        const usersRes = await API.get("/users");

        setRooms(res.data);
        setUsers(usersRes.data);
      }
    } catch (err) {
      console.log(err);

      // ✅ prevent crash
      if (role === "resident") {
        setRooms([]);
      }
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // ➕ CREATE ROOM
  const createRoom = async () => {
    try {
      await API.post("/rooms", { roomNumber, capacity });

      toast.success("Room Created ✅");
      setRoomNumber("");
      setCapacity("");
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || "Creation failed ❌");
    }
  };

  // ✏️ START EDIT
  const startEdit = (room) => {
    setEditRoomId(room._id);
    setEditCapacity(room.capacity);
  };

  // 💾 UPDATE ROOM
  const updateRoom = async () => {
    try {
      await API.put(`/rooms/${editRoomId}`, {
        capacity: editCapacity,
      });

      toast.success("Room updated ✏️");
      setEditRoomId(null);
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || "Update failed ❌");
    }
  };

  // 🏠 ASSIGN ROOM
  const assignRoom = async () => {
    try {
      if (!selectedUser || !selectedRoom) {
        return toast.warning("Select user and room ⚠️");
      }

      await API.post("/rooms/assign", {
        userId: selectedUser,
        roomId: selectedRoom,
      });

      toast.success("Room assigned 🏠");
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || "Assignment failed ❌");
    }
  };

  // 🚪 CHECKOUT
  const checkout = async (userId) => {
    try {
      await API.post("/rooms/checkout", { userId });

      toast.success("Checkout successful 🚪");
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || "Checkout failed ❌");
    }
  };

  // 🗑 DELETE ROOM
  
  const deleteRoom = (id) => {
  toast(
    ({ closeToast }) => (
      <div>
        <p className="mb-2 font-semibold">Delete this room?</p>

        <div className="flex gap-2">
          <button
            onClick={async () => {
              try {
                await API.delete(`/rooms/${id}`);
                toast.success("Room deleted 🗑️");
                fetchData();
              } catch (err) {
                toast.error(
                  err.response?.data?.message || "Delete failed ❌"
                );
              }
              closeToast();
            }}
            className="bg-red-500 text-white px-3 py-1 rounded"
          >
            Yes
          </button>

          <button
            onClick={closeToast}
            className="bg-gray-300 px-3 py-1 rounded"
          >
            Cancel
          </button>
        </div>
      </div>
    ),
    {
      position: "top-center",
      autoClose: false,
      closeOnClick: false,
    }
  );
};

  return (
    <Layout>
      <h1 className="text-3xl font-bold mb-6">
        {role === "resident" ? "My Room" : "Room Management"}
      </h1>

      {/* 🔴 SHOW MESSAGE IF NO ROOM */}
      {rooms.length === 0 && role === "resident" && (
        <p className="text-gray-500">No room assigned yet</p>
      )}

      {/* 🔴 ADMIN ONLY */}
      {role === "admin" && (
        <>
          {/* CREATE */}
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
                className="bg-green-500 text-white px-6 rounded"
              >
                Add Room
              </button>
            </div>
          </div>

          {/* ASSIGN */}
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
                    Room {r.roomNumber}
                  </option>
                ))}
              </select>

              <button
                onClick={assignRoom}
                className="bg-blue-500 text-white px-6 rounded"
              >
                Assign
              </button>
            </div>
          </div>
        </>
      )}

      {/* 🧾 ROOMS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {rooms.map((room) => {
          const isFull =
            (room.occupants?.length || 0) >= room.capacity;

          return (
            <div key={room._id} className="bg-white p-5 rounded-xl shadow">
              <h2 className="text-lg font-bold">
                Room {room.roomNumber}
              </h2>

              <p>Capacity: {room.capacity}</p>

              <p
                className={`mt-2 ${
                  isFull ? "text-red-500" : "text-green-500"
                }`}
              >
                {isFull ? "Full" : "Available"}
              </p>

              {/* 🔴 ADMIN ONLY */}
              {role === "admin" && (
                <>
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
      <>
                  <button
                    onClick={() => startEdit(room)}
                    className="bg-yellow-500 text-white px-3 py-1 mt-2 rounded"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => deleteRoom(room._id)}
                    className="bg-red-500 text-white px-3 py-1 mt-2 ml-2 rounded"
                  >
                    Delete
                  </button>
                </>
              )}
              </>
              )}

              {/* OCCUPANTS */}
              <div className="mt-4">
                <h3 className="font-semibold">Occupants</h3>

                {(!room.occupants || room.occupants.length === 0) && (
                  <p className="text-gray-400">No occupants</p>
                )}

                {room.occupants?.map((u) => (
                  <div
                    key={u._id}
                    className="flex justify-between mt-2 bg-gray-100 p-2 rounded"
                  >
                    <span>{u.name}</span>

                    {role === "admin" && (
                      <button
                        onClick={() => checkout(u._id)}
                        className="bg-red-500 text-white px-2 rounded"
                      >
                        Checkout
                      </button>
                    )}
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
  
