import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import  {toast} from "react-toastify";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role,setRole]=useState("resident");
  const [phone, setPhone] = useState("");
const [address, setAddress] = useState("");

const [emergencyName, setEmergencyName] = useState("");
const [emergencyPhone, setEmergencyPhone] = useState("");
const [relation, setRelation] = useState("");
  const navigate = useNavigate();

  console.log("Register button clicked");

  const handleRegister = async () => {
    try {
      
      await API.post("/auth/register", {
      
        name,
        email,
        password,
        role,
        phone:phone||undefined,
        address:address||undefined,
        emergencyContact:emergencyName
          ?{
            name:emergencyName,
          phone:emergencyPhone,
          relation:relation
          }
          :undefined
        
      });

      toast.success("Registered successfully");

      // go to login
      setTimeout(()=>{
        navigate("/login");
      },1000);

    } catch (error) {
      toast.error(error.response?.data?.message || "Error");
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "100px" }}>
      <h2>Register</h2>

      <input
        placeholder="Name"
        onChange={(e) => setName(e.target.value)}
      /><br /><br />

      <input
        placeholder="Email"
        onChange={(e) => setEmail(e.target.value)}
      /><br /><br />

      <input
        type="password"
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
      /><br /><br />

      {role==="resident"&&(
        <>

      <input
  placeholder="Phone"
  onChange={(e) => setPhone(e.target.value)}
/><br /><br />

<input
  placeholder="Address"
  onChange={(e) => setAddress(e.target.value)}
/><br /><br />

<h4>Emergency Contact</h4>

<input
  placeholder="Emergency Name"
  onChange={(e) => setEmergencyName(e.target.value)}
/><br /><br />

<input
  placeholder="Emergency Phone"
  onChange={(e) => setEmergencyPhone(e.target.value)}
/><br /><br />

<input
  placeholder="Relation"
  onChange={(e) => setRelation(e.target.value)}
/><br /><br />

</>
      )}

      <select
  value={role}
  onChange={(e) => setRole(e.target.value)}
  className="border p-2 mb-2"
>
  <option value="resident">Resident</option>
  <option value="staff">Staff</option>
  <option value="admin">Admin</option>
</select>

      <button onClick={handleRegister}>Register</button>

      <p
        style={{ cursor: "pointer", color: "blue" }}
        onClick={() => navigate("/")}
      >
        Already have account? Login
      </p>
    </div>
  );
}
