import { useEffect, useState } from "react";
import API from "../services/api";
import Layout from "../components/Layout";
import { toast } from "react-toastify";
import { getRole } from "../utils/auth";

export default function Billing() {
  const [bills, setBills] = useState([]);
  const [users, setUsers] = useState([]);

  const role = getRole();

  //razor pay

  const handlePayment = async (billId, amount) => {
  try {

    const { data } = await API.post(
      `/bills/${billId}/create-order`,
      {
        amount
      }
    );

    const options = {
      key: data.key,
      amount: data.amount,
      currency: "INR",
      name: "Hostel Payment",
      description: "Bill Payment",
      order_id: data.orderId,

      handler: async function (response) {

        await API.post("/bills/verify-payment", {
          ...response,
          billId,
          amount
        });

        toast.success("Payment Successful 🎉");

        fetchData();
      },

      theme: {
        color: "#3399cc"
      }
    };

    const rzp = new window.Razorpay(options);
    rzp.open();

  } catch (err) {
    console.log(err);
    toast.error("Payment failed ");
  }
};

  // CREATE STATES
  const [userId, setUserId] = useState("");
  const [rent, setRent] = useState("");
  const [utilities, setUtilities] = useState("");
  const [extraCharges, setExtraCharges] = useState("");
  const [discount, setDiscount] = useState("");
  const [lateFee, setLateFee] = useState("");
  const [errors,setErrors]=useState({});

  //  INSTALLMENT STATE
  const [amounts, setAmounts] = useState({});

  // 🔄 FETCH DATA
  const fetchData = async () => {
    try {
      if (role === "resident") {
        const res = await API.get("/bills/my");
        setBills(res.data);
      } else {
        const billsRes = await API.get("/bills");
        const usersRes = await API.get("/users");

        setBills(billsRes.data);
        setUsers(usersRes.data);
      }
    } catch (err) {
      console.log(err);
      if (role === "resident") setBills([]);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  //  CREATE BILL
  const createBill = async () => {
    let newErrors = {};

  // User required
  if (!userId) {
    newErrors.userId = "Select resident";
  }

  // Rent required
  if (!rent.toString().trim()) {
    newErrors.rent = "Rent required";
  } else if (isNaN(rent) || Number(rent) <= 0) {
    newErrors.rent = "Rent must be greater than 0";
  }

  // Utilities optional
  if (utilities && (isNaN(utilities) || Number(utilities) < 0)) {
    newErrors.utilities = "Invalid utilities";
  }

  // Extra Charges optional
  if (extraCharges && (isNaN(extraCharges) || Number(extraCharges) < 0)) {
    newErrors.extraCharges = "Invalid extra charges";
  }

  // Discount optional
  if (discount && (isNaN(discount) || Number(discount) < 0)) {
    newErrors.discount = "Invalid discount";
  }

  // Late Fee optional
  if (lateFee && (isNaN(lateFee) || Number(lateFee) < 0)) {
    newErrors.lateFee = "Invalid late fee";
  }

  if (Object.keys(newErrors).length > 0) {
    setErrors(newErrors); // useState({})
    toast.error(Object.values(newErrors)[0]);
    return;
  }

    try {
      await API.post("/bills", {
        userId,
        rent,
        utilities,
        extraCharges,
        discount,
        lateFee,
      });

      toast.success("Bill created ");

      setUserId("");
      setRent("");
      setUtilities("");
      setExtraCharges("");
      setDiscount("");
      setLateFee("");

      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed ");
    }
  };

  // PAY FULL
  const payBill = async (id) => {
    try {
      await API.put(`/bills/pay/${id}`);

      toast.success("Payment successful ");
       await fetchData();
       return;

    } catch (err) {
      toast.error(err.response?.data?.message || "Payment failed ");
      return;
    }
  };

  //  PAY INSTALLMENT
  
  const payInstallment = async (id) => {
  try {
    const payAmount = Number(amounts[id]);

    if (!payAmount || payAmount <= 0) {
      toast.error("Enter valid amount ");
      return;
    }

    await API.put(`/bills/installment/${id}`, {
      amount: payAmount
    });

    toast.success("Partial payment done ");

    setAmounts({
      ...amounts,
      [id]:""
    });
    fetchData();

  } catch (err) {
    toast.error(
      err.response?.data?.message || "Payment failed "
    );
  }
};

  // 🗑 DELETE BILL
  
  const deleteBill = (id) => {
  toast(
    ({ closeToast }) => (
      <div>
        <p className="mb-2 font-semibold">Delete this bill?</p>

        <div className="flex gap-2">
          <button
            onClick={async () => {
              try {
                const res = await API.delete(`/bills/${id}`);

                if (res.status === 200) {
                  toast.success("Bill deleted 🗑️");
                  fetchData();
                }

              } catch (err) {
                console.log(err);
                toast.error("Delete failed ");
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
    { autoClose: false }
  );
};

  return (
    <Layout>
      <h1 className="text-3xl font-bold mb-6">
        {role === "resident" ? "My Bills" : "Billing Management"}
      </h1>

      

{/* RESIDENT SECTION */}
{role === "resident" && (
  <>
    {bills.length === 0 ? (

      <div className="bg-yellow-100 text-yellow-700 p-4 rounded-lg mb-6">
        ⚠️ No bills generated yet.
      </div>

    ) : (

      <div className="space-y-4 mb-6">
        {bills.map((bill) => (
          <div
            key={bill._id}
            className="bg-white shadow-md rounded-xl p-5"
          >
            <p>
              <strong>Amount:</strong> ₹{bill.totalAmount}
            </p>

            <p>
              <strong>Status:</strong> {bill.status}
            </p>

            <p>
              <strong>Due Date:</strong>{" "}
              {bill.dueDate
  ? new Date(bill.dueDate).toLocaleDateString()
  : "Not Assigned"}
            </p>
          </div>
        ))}
      </div>

    )}
  </>
)}

      {/* ADMIN CREATE */}
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
  type="number"
  min="0"
  step="1"
  placeholder="Rent"
  value={rent}
  onChange={(e) => setRent(e.target.value)}
  onKeyDown={(e) => {
    if (["e", "E", "+", "-"].includes(e.key)) {
      e.preventDefault();
    }
  }}
  className="border p-3 rounded-lg"
/>

<input
  type="number"
  min="0"
  step="1"
  placeholder="Utilities"
  value={utilities}
  onChange={(e) => setUtilities(e.target.value)}
  onKeyDown={(e) => {
    if (["e", "E", "+", "-"].includes(e.key)) {
      e.preventDefault();
    }
  }}
  className="border p-3 rounded-lg"
/>

<input
  type="number"
  min="0"
  step="1"
  placeholder="Extra Charges"
  value={extraCharges}
  onChange={(e) => setExtraCharges(e.target.value)}
  onKeyDown={(e) => {
    if (["e", "E", "+", "-"].includes(e.key)) {
      e.preventDefault();
    }
  }}
  className="border p-3 rounded-lg"
/>

<input
  type="number"
  min="0"
  step="1"
  placeholder="Discount"
  value={discount}
  onChange={(e) => setDiscount(e.target.value)}
  onKeyDown={(e) => {
    if (["e", "E", "+", "-"].includes(e.key)) {
      e.preventDefault();
    }
  }}
  className="border p-3 rounded-lg"
/>

<input
  type="number"
  min="0"
  step="1"
  placeholder="Late Fee"
  value={lateFee}
  onChange={(e) => setLateFee(e.target.value)}
  onKeyDown={(e) => {
    if (["e", "E", "+", "-"].includes(e.key)) {
      e.preventDefault();
    }
  }}
  className="border p-3 rounded-lg"
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

      {/* BILL GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {bills.map((bill) => {
          const totalAmount =
            (bill.rent || 0) +
            (bill.utilities || 0) +
            (bill.extraCharges || 0) -
            (bill.discount || 0) +
            (bill.lateFee || 0);

          const paidAmount =
            bill.paymentHistory?.reduce((sum, p) => sum + p.amount, 0) || 0;

          const remainingAmount = bill.remainingAmount;

          return (
           <div
  key={bill._id}
  className="bg-white p-6 rounded-2xl shadow hover:shadow-xl transition"
>
  <div className="flex justify-between items-center mb-4">
    <h2 className="text-xl font-bold text-gray-800">
      {bill.user?.name || "My Bill"}
    </h2>

    <span
      className={`px-3 py-1 rounded-full text-sm font-semibold ${
        bill.status === "paid"
          ? "bg-green-100 text-green-600"
          : "bg-red-100 text-red-600"
      }`}
    >
      {bill.status}
    </span>
  </div>

  <div className="space-y-1 text-gray-600 text-sm">
    <p>🏠 Rent: ₹{bill.rent}</p>
    <p>💡 Utilities: ₹{bill.utilities}</p>
    <p>➕ Extra Charges: ₹{bill.extraCharges}</p>
    <p>🎁 Discount: ₹{bill.discount}</p>
    {bill.lateFee > 0 && (
    <p>⚠️ Late Fee: ₹{bill.lateFee}</p>
    )}
  </div>

  <div className="border-t mt-4 pt-4">
    <p className="text-lg font-bold text-gray-800">
      Total: ₹{totalAmount}
    </p>

    <p className="text-red-500 font-bold">
      Remaining: ₹{bill.remainingAmount}
    </p>

    {/* Payment History */}
  {bill.paymentHistory?.length > 0 && (
    <div className="mt-4 border-t pt-3">
      <h3 className="font-semibold text-gray-700 mb-2">
        Payment History
      </h3>

      <div className="space-y-2">
        {bill.paymentHistory.map((payment, index) => (
          <div
            key={index}
            className="bg-gray-100 rounded-lg p-2 text-sm"
          >
            <p>
              💰 Amount: ₹{payment.amount}
            </p>

            <p>
              📅 Date:
              {new Date(payment.date).toLocaleString()}
            </p>

            <p className="truncate">
              🧾 Transaction:
              {payment.transactionId}
            </p>
          </div>
        ))}
      </div>
    </div>
  )}

  </div>

  {/* Payment Buttons */}
  {/* Payment Buttons */}
{role === "resident" && bill.status !== "paid" && (
  <div className="grid grid-cols-1 gap-2 mt-3">

    {/* Pay Full */}
    <button
      onClick={() => handlePayment(bill._id,bill.remainingAmount)}
      className="bg-blue-500 text-white py-2 rounded-lg w-full mb-3"
    >
      Pay Full
    </button>

    {/* Partial Payment */}
    <div className="space-y-2">
      <input
        type="number"
        min="1"
        placeholder="Enter partial amount"
        value={amounts[bill._id] || ""}
        onChange={(e) =>
          setAmounts({
            ...amounts,
            [bill._id]: e.target.value,
          })
        }
        className="border p-2 rounded-lg w-full"
      />

      <button
        onClick={() => {
          const amount = Number(amounts[bill._id]);

          if (!amount || amount <= 0) {
            return toast.error("Enter valid amount");
          }

          if (amount > bill.remainingAmount) {
            return toast.error("Amount exceeds remaining balance");
          }

          handlePayment(bill._id, amount);
        }}
        className="bg-green-500 text-white py-2 rounded-lg w-full"
      >
        Pay Partial
      </button>
    </div>

  </div>
)}

  {role === "admin" && (
    <button
      onClick={() => deleteBill(bill._id)}
      className="bg-red-500 hover:bg-red-600 text-white w-full mt-4 py-2 rounded-lg"
    >
      Delete Bill
    </button>
  )}
</div>
          );
        })}
      </div>
    </Layout>
  );
}
