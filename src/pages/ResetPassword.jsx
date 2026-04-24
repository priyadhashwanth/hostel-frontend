import { useState } from "react";
import { useParams } from "react-router-dom";
import API from "../services/api";
import { toast } from "react-toastify";

export default function ResetPassword() {
  const { token } = useParams();

  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await API.post(`/auth/reset-password/${token}`, {
        password
      });

      toast.success("Password reset successful");
    } catch (err) {
      toast.error("Reset failed");
    }
  };

  return (
    <div className="p-10">
      <h1 className="text-2xl font-bold mb-4">Reset Password</h1>

      <form onSubmit={handleSubmit}>
        <input
          type="password"
          placeholder="New Password"
          className="border p-3 w-full mb-4"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button className="bg-blue-500 text-white px-4 py-2 rounded">
          Reset Password
        </button>
      </form>
    </div>
  );
}