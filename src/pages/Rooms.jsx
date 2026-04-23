import { useEffect, useState } from "react";
import API from "../services/api";
import Layout from "../components/Layout";
import { toast } from "react-toastify";
import { getRole } from "../utils/auth";
import {
  FaBed,
  FaUsers,
  FaPlus,
  FaEdit,
  FaTrash,
  FaDoorOpen,
  FaHome,
} from "react-icons/fa";

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

  //  FETCH DATA (FIXED)
  const fetchData = async () => {
    try {
      
        const res = await API.get("/rooms");
        if(role ==="resident"){
          const user = JSON.parse(localStorage.getItem("user"));

          const myRoom = res.data.find(room =>
        room.occupants?.some(u => u._id === user._id)
      );

        setRooms(myRoom ? [myRoom] :[]); //  only my room
      } else {
        
        const usersRes = await API.get("/users");

        setRooms(res.data);
        setUsers(usersRes.data);
      }
    } catch (err) {
      console.log(err);

      //  prevent crash
      if (role === "resident") {
        setRooms([]);
      }
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  //  CREATE ROOM
  const createRoom = async () => {
    try {
      await API.post("/rooms", { roomNumber, capacity });

      toast.success("Room Created ");
      setRoomNumber("");
      setCapacity("");

      
      fetchData();
      
    } catch (err) {
      toast.error(err.response?.data?.message || "Creation failed ");
    }
  };

  //  START EDIT
  const startEdit = (room) => {
    setEditRoomId(room._id);
    setEditCapacity(room.capacity);
  };

  //  UPDATE ROOM
  const updateRoom = async () => {
    try {
      await API.put(`/rooms/${editRoomId}`, {
        capacity: editCapacity,
      });

      toast.success("Room updated ");
      setEditRoomId(null);
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || "Update failed ");
    }
  };

  //  ASSIGN ROOM
  const assignRoom = async () => {
    try {
      if (!selectedUser || !selectedRoom) {
        return toast.warning("Select user and room ");
      }

      await API.post("/rooms/assign", {
        userId: selectedUser,
        roomId: selectedRoom,
      });

      toast.success("Room assigned ");
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || "Assignment failed ");
    }
  };

  //  CHECKOUT
  const checkout = async (userId) => {
    try {
      await API.post("/rooms/checkout", { userId });

      toast.success("Checkout successful ");
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || "Checkout failed ");
    }
  };

  //  DELETE ROOM
  
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
                  err.response?.data?.message || "Delete failed "
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
      <h1 className="text-4xl font-bold text-gray-800 mb-6">
        {role === "resident" ? "🏠 My Room" : "Room Management"}
      </h1>

      {/* ADMIN SECTION */}
      {role === "admin" && (
        <>
          {/* CREATE ROOM */}
          <div className="bg-white rounded-2xl shadow-md p-6 mb-6">
            <h2 className="text-xl font-bold mb-4">Create Room</h2>

            <div className="grid md:grid-cols-3 gap-4">
              <input
                type="text"
                placeholder="Room Number"
                value={roomNumber}
                onChange={(e) => setRoomNumber(e.target.value)}
                className="border p-3 rounded-lg focus:ring-2 focus:ring-blue-400"
              />

              <input
                type="number"
                placeholder="Capacity"
                value={capacity}
                onChange={(e) => setCapacity(e.target.value)}
                className="border p-3 rounded-lg focus:ring-2 focus:ring-blue-400"
              />

              <button
                onClick={createRoom}
                className="bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg font-semibold"
              >
                <FaPlus className="inline mr-2" />
                Add Room
              </button>
            </div>
          </div>

          {/* ASSIGN ROOM */}
          <div className="bg-white rounded-2xl shadow-md p-6 mb-6">
            <h2 className="text-xl font-bold mb-4">Assign Room</h2>

            <div className="grid md:grid-cols-3 gap-4">
              <select
                onChange={(e) => setSelectedUser(e.target.value)}
                className="border p-3 rounded-lg"
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
                className="border p-3 rounded-lg"
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
                className="bg-blue-500 text-white rounded-lg font-semibold"
              >
                Assign
              </button>
            </div>
          </div>
        </>
      )}

      {/* ROOM CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {rooms.map((room) => {
          const isFull =
            (room.occupants?.length || 0) >= room.capacity;

          return (
            <div
              key={room._id}
              className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all p-6"
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-gray-800">
                  <FaHome className="inline mr-2 text-blue-500" />
                  Room {room.roomNumber}
                </h2>

                <span
                  className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    isFull
                      ? "bg-red-100 text-red-600"
                      : "bg-green-100 text-green-600"
                  }`}
                >
                  {isFull ? "Full" : "Available"}
                </span>
              </div>

              <p className="text-gray-600 mb-3">
                <FaUsers className="inline mr-2" />
                Capacity: {room.capacity}
              </p>

              {/* EDIT */}
              {role === "admin" && (
                <>
                  {editRoomId === room._id ? (
                    <div className="flex gap-2 mb-4">
                      <input
                        value={editCapacity}
                        onChange={(e) =>
                          setEditCapacity(e.target.value)
                        }
                        className="border p-2 rounded-lg w-full"
                      />

                      <button
                        onClick={updateRoom}
                        className="bg-blue-500 text-white px-4 rounded-lg"
                      >
                        Save
                      </button>
                    </div>
                  ) : (
                    <div className="flex gap-2 mb-4">
                      <button
                        onClick={() => {
                          setEditRoomId(room._id);
                          setEditCapacity(room.capacity);
                        }}
                        className="bg-yellow-500 text-white px-4 py-2 rounded-lg"
                      >
                        <FaEdit />
                      </button>

                      <button
                        onClick={() => deleteRoom(room._id)}
                        className="bg-red-500 text-white px-4 py-2 rounded-lg"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  )}
                </>
              )}

              {/* OCCUPANTS */}
              <h3 className="font-bold text-lg mb-2">Occupants</h3>

              {room.occupants?.length === 0 ? (
                <p className="text-gray-400">No Occupants</p>
              ) : (
                room.occupants?.map((u) => (
                  <div
                    key={u._id}
                    className="flex justify-between bg-gray-100 rounded-lg p-3 mb-2"
                  >
                    <span>{u.name}</span>

                    {role === "admin" && (
                      <button
                        onClick={() => checkout(u._id)}
                        className="bg-pink-500 text-white px-3 rounded-lg"
                      >
                        <FaDoorOpen />
                      </button>
                    )}
                  </div>
                ))
              )}
            </div>
          );
        })}
      </div>
    </Layout>
  );
}