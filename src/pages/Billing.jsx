import { useEffect, useState } from "react";
import API from "../services/api";
import Layout from "../components/Layout";
import { toast } from "react-toastify";
import { getRole } from "../utils/auth";

export default function Billing() {
  const [bills, setBills] = useState([]);
  const [users, setUsers] = useState([]);

  const role = getRole();

  // CREATE STATES
  const [userId, setUserId] = useState("");
  const [rent, setRent] = useState("");
  const [utilities, setUtilities] = useState("");
  const [extraCharges, setExtraCharges] = useState("");
  const [discount, setDiscount] = useState("");
  const [lateFee, setLateFee] = useState("");

  // ✅ FETCH DATA
  const fetchData = async () => {
    try {
      if (role === "resident") {
        const res = await API.get("/bills/my"); // ✅ correct
        setBills(res.data);
      } else {
        const billsRes = await API.get("/bills"); // admin
        const usersRes = await API.get("/users");

        setBills(billsRes.data);
        setUsers(usersRes.data);
      }
    } catch (err) {
      console.log(err);

      if (role === "resident") {
        setBills([]);
      }
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // ➕ CREATE BILL (ADMIN)
  const createBill = async () => {
    try {
      await API.post("/bills", {
        userId,
        rent,
        utilities,
        extraCharges,
        discount,
        lateFee,
      });

      toast.success("Bill created 💰");

      // reset
      setUserId("");
      setRent("");
      setUtilities("");
      setExtraCharges("");
      setDiscount("");
      setLateFee("");

      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed ❌");
    }
  };

  // 💳 PAY BILL (RESIDENT)
  const payBill = async (id) => {
  try {
    const res = await API.put(`/bills/pay/${id}`,{});

    // ✅ only show success if backend responds
    
      toast.success(res.data.message || "Payment successful 💳");
    

    fetchData();
  } catch (err) {
    console.log(err);
    toast.error(err.response?.data?.message || "Payment failed ❌");
  }
};

  // 🗑 DELETE BILL (ADMIN)
  const deleteBill = async (id) => {
    if (!window.confirm("Delete this bill?")) return;

    try {
      await API.delete(`/bills/${id}`);
      toast.success("Bill deleted 🗑️");
      fetchData();
    } catch (err) {
      toast.error("Delete failed ❌");
    }
  };

  return (
    <Layout>
      <h1 className="text-3xl font-bold mb-6">
        {role === "resident" ? "My Bills" : "Billing Management"}
      </h1>

      {/* NO DATA */}
      {bills.length === 0 && role === "resident" && (
        <p className="text-gray-500">No bills available</p>
      )}

      {/* 🔴 ADMIN CREATE */}
      {role === "admin" && (
        <div className="bg-white p-6 rounded-xl shadow mb-6">
          <h2 className="text-xl font-semibold mb-4">Create Bill</h2>

          <div className="grid grid-cols-2 gap-4">
            <select
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              className="border p-3 rounded"
            >
              <option>Select User</option>
              {users.map((u) => (
                <option key={u._id} value={u._id}>
                  {u.name}
                </option>
              ))}
            </select>

            <input
              placeholder="Rent"
              value={rent}
              onChange={(e) => setRent(e.target.value)}
              className="border p-3 rounded"
            />

            <input
              placeholder="Utilities"
              value={utilities}
              onChange={(e) => setUtilities(e.target.value)}
              className="border p-3 rounded"
            />

            <input
              placeholder="Extra Charges"
              value={extraCharges}
              onChange={(e) => setExtraCharges(e.target.value)}
              className="border p-3 rounded"
            />

            <input
              placeholder="Discount"
              value={discount}
              onChange={(e) => setDiscount(e.target.value)}
              className="border p-3 rounded"
            />

            <input
              placeholder="Late Fee"
              value={lateFee}
              onChange={(e) => setLateFee(e.target.value)}
              className="border p-3 rounded"
            />
          </div>

          <button
            onClick={createBill}
            className="bg-green-500 text-white px-6 py-2 rounded mt-4"
          >
            Create Bill
          </button>
        </div>
      )}

      {/* 🧾 BILL GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {bills.map((bill) => {
          const total =
            (bill.rent || 0) +
            (bill.utilities || 0) +
            (bill.extraCharges || 0) -
            (bill.discount || 0) +
            (bill.lateFee || 0);

          return (
            <div key={bill._id} className="bg-white p-5 rounded-xl shadow">
              <h2 className="text-lg font-bold">
                {bill.user?.name || "User"}
              </h2>

              <p>Rent: ₹{bill.rent}</p>
              <p>Utilities: ₹{bill.utilities}</p>
              <p>Extra: ₹{bill.extraCharges}</p>
              <p>Discount: ₹{bill.discount}</p>
              <p>Late Fee: ₹{bill.lateFee}</p>

              <p className="font-semibold mt-2">
                Total: ₹{total}
              </p>

              <p
                className={`mt-2 ${
                  bill.status === "paid"
                    ? "text-green-500"
                    : "text-red-500"
                }`}
              >
                {bill.status}
              </p>

              {/* RESIDENT */}
              {role === "resident" && bill.status !== "paid" && (
                <button
                  onClick={() => payBill(bill._id)}
                  className="bg-blue-500 text-white px-4 py-1 mt-2 rounded"
                >
                  Pay
                </button>
              )}

              {/* ADMIN */}
              {role === "admin" && (
                <button
                  onClick={() => deleteBill(bill._id)}
                  className="bg-red-500 text-white px-4 py-1 mt-2 rounded"
                >
                  Delete
                </button>
              )}
            </div>
          );
        })}
      </div>
    </Layout>
  );
}