import { useState } from "react";
import API from "../services/api";
import { toast } from "react-toastify";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");

  const sendLink = async () => {
    try {
      await API.post("/auth/forgot-password", { email });
      toast.success("Reset link sent to email");
    } catch (err) {
      toast.error("Failed");
    }
  };

  return (
    <div className="p-10">
      <h1 className="text-2xl font-bold mb-4">Forgot Password</h1>

      <input
        type="email"
        placeholder="Enter email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="border p-3 rounded w-full mb-4"
      />

      <button
        onClick={sendLink}
        className="bg-blue-500 text-white px-5 py-2 rounded"
      >
        Send Reset Link
      </button>
    </div>
  );
}