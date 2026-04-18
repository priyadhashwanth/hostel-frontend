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

   const handlePayment = async (billId) => {
  try {
    console.log("STEP1:Clicked", billId);

    const { data } = await API.post(`/bills/${billId}/create-order`);
    console.log("STEP2:Order response", data);

    const options = {
      key: data.key,
      amount: data.amount,
      currency: "INR",
      name: "Hostel Payment",
      description: "Bill Payment",
      order_id: data.orderId,

      handler: async function (response) {
        console.log("STEP 3:Payment success", response);

        await API.post("/bills/verify-payment", {
          ...response,
          billId
        });

        alert("Payment Successful ");
        fetchData();
      },

      theme: {
        color: "#3399cc"
      }
    };

    console.log("STEP 4: Opening Razorpay");

    const rzp = new window.Razorpay(options);
    rzp.open();

  } catch (err) {
    console.error(err);
    alert("Payment failed ");
  }
};

  // CREATE STATES
  const [userId, setUserId] = useState("");
  const [rent, setRent] = useState("");
  const [utilities, setUtilities] = useState("");
  const [extraCharges, setExtraCharges] = useState("");
  const [discount, setDiscount] = useState("");
  const [lateFee, setLateFee] = useState("");

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
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || "Payment failed ");
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

            <input placeholder="Rent" value={rent} onChange={(e) => setRent(Number(e.target.value))} className="border p-3 rounded" />
            <input placeholder="Utilities" value={utilities} onChange={(e) => setUtilities(e.target.value)} className="border p-3 rounded" />
            <input placeholder="Extra Charges" value={extraCharges} onChange={(e) => setExtraCharges(e.target.value)} className="border p-3 rounded" />
            <input placeholder="Discount" value={discount} onChange={(e) => setDiscount(e.target.value)} className="border p-3 rounded" />
            <input placeholder="Late Fee" value={lateFee} onChange={(e) => setLateFee(e.target.value)} className="border p-3 rounded" />
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
          const total =
            (bill.rent || 0) +
            (bill.utilities || 0) +
            (bill.extraCharges || 0) -
            (bill.discount || 0) +
            (bill.lateFee || 0);

          const paidAmount =
            bill.paymentHistory?.reduce((sum, p) => sum + p.amount, 0) || 0;

          const remainingAmount = bill.remainingAmount;

          return (
            <div key={bill._id} className="bg-white p-5 rounded-xl shadow">
              <h2 className="text-lg font-bold">{bill.user?.name}</h2>

              <p>Rent: ₹{bill.rent}</p>
              <p>Utilities: ₹{bill.utilities}</p>
              <p>Extra: ₹{bill.extraCharges}</p>
              <p>Discount: ₹{bill.discount}</p>
              <p>Late Fee: ₹{bill.lateFee}</p>

              <p className="font-semibold mt-2">Total: ₹{total}</p>
              <p className="font-bold text-red-500">
                Remaining: ₹{bill.remainingAmount}</p>

              <p className={`mt-2 ${bill.status === "paid" ? "text-green-500" : "text-red-500"}`}>
                {bill.status}
              </p>

              {/* PAYMENT HISTORY */}
              <div className="mt-3">
                <h3 className="font-semibold">Payment History</h3>

                {bill.paymentHistory?.length === 0 ? (
                  <p className="text-gray-400">No payments yet</p>
                ) : (
                  bill.paymentHistory.map((p, i) => (
                    <div key={i} className="bg-gray-100 p-2 mt-2 rounded">
                      <p>₹{p.amount}</p>
                      <p className="text-sm text-gray-500">
                        {new Date(p.date).toLocaleString()}
                      </p>
                      <p className="text-xs text-blue-500">
                        {p.transactionId}
                      </p>
                    </div>
                  ))
                )}
              </div>

              {/* RESIDENT ACTIONS */}
              {role === "resident" && bill.status !== "paid" && (
                <>
                  <input
                    type="number"
                    placeholder="Enter amount"
                    value={amounts[bill._id]||""}
                    onChange={(e) => 
                      setAmounts({
                      ...amounts,
                      [bill._id]:e.target.value

                    })
                  }
                    className="border p-2 mt-2 rounded w-full"
                  />

                  <div className="flex gap-2 mt-2">
                    <button
                      onClick={() => payBill(bill._id)}
                      className="bg-blue-500 text-white px-4 py-1 rounded"
                    >
                      Pay Full
                    </button>

                    <button
                      onClick={() => payInstallment(bill._id)}
                      className="bg-green-500 text-white px-4 py-1 rounded"
                    >
                      Pay Partial
                    </button>

                    {/* NEW RAZORPAY BUTTON */}
      <button
        onClick={() => handlePayment(bill._id)}
        className="bg-purple-600 text-white px-4 py-1 rounded"
      >
        Pay Online 
      </button>

                  </div>
                </>
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
