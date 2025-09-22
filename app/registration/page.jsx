import { useState } from "react";
import { registerUser } from "../lib/api";

export default function Register() {
  const [form, setForm] = useState({
    name: "",
    mobile_no: "",
    email: "",
    pin_code: "",
    delivery_address: ""
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await registerUser(form);
      console.log("Decrypted Response:", result);
      alert("Registration successful!");
    } catch (err) {
      alert("Registration failed!");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="name" placeholder="Name" onChange={handleChange} />
      <input name="mobile_no" placeholder="Mobile No" onChange={handleChange} />
      <input name="email" placeholder="Email" onChange={handleChange} />
      <input name="pin_code" placeholder="Pin Code" onChange={handleChange} />
      <input name="delivery_address" placeholder="Address" onChange={handleChange} />
      <button type="submit">Register</button>
    </form>
  );
}
