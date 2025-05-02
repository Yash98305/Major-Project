import React, { useEffect, useState } from 'react';
import { useAuth } from "../../Context/auth.jsx";
import {
  Avatar,
  Fab,
  TextField,
} from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import axios from 'axios';
import avatar from "../../Assets/avatar.jpg";
import {toast} from "react-toastify";
const Profile = () => {
  const { api, auth } = useAuth();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setemail] = useState("");
  const [phone, setphone] = useState("");
  const [photo, setPhoto] = useState("");
  const [preview, setPreview] = useState(""); // for preview
  const [ebutton, setebutton] = useState(false);

  const getProfile = async () => {
    try {
      const res = await axios.get(`${api}/auth/profile`, {
        headers: {
          Authorization: auth?.token,
        },
      });
      if (res) {
        const split = res.data.user.name.split(" ");
        setFirstName(split[0] || "");
        setLastName(split[1] || "");
        setemail(res.data.user.email);
        setphone(res.data.user.phone);
        setPhoto(res.data.user?.photo);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    if (auth?.token) getProfile();
  }, [auth]);

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    setPhoto(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleUpdate = async () => {
    try {
      const fullName = `${firstName} ${lastName}`;
      const formData = new FormData();
      formData.append("name", fullName);
      formData.append("email", email);
      formData.append("phone", phone);
      if (photo && typeof photo !== "string") {
        formData.append("photo", photo);
      }

      const res = await axios.put(`${api}/auth/update`, formData, {
        headers: {
          Authorization: auth?.token,
          "Content-Type": "multipart/form-data",
        },
      });

      if (res.data.success) {
        toast.success("Profile updated!");
        setebutton(false);
        getProfile(); // refresh profile info
      }
    } catch (err) {
      console.error(err);
      toast.error("Update failed.");
      
    }
  };

  return (
    <div style={{ padding: "0px 100px", minHeight: "84.8vh", display: "flex" }}>
      <div style={{ 
  width: "30%", 
  display: "flex", 
  flexDirection: "column", 
  alignItems: "center" 
}}>
  <Avatar
    alt="U"
    src={
      preview
        ? preview
        : photo
        ? `${api}/auth/photo/${auth?.userId}`
        : avatar
    }
    sx={{
      width: "250px",
      padding: 1,
      boxShadow:
        "rgba(0, 0, 0, 0.3) 0px 19px 38px, rgba(0, 0, 0, 0.22) 0px 15px 12px",
      height: "250px",
      backgroundColor: "white",
      borderRadius: "20px",
      marginTop: "60px",
    }}
  />
  {ebutton && (
    <label
      htmlFor="upload-photo"
      style={{
        marginTop: "20px", // NOW this will apply correctly
        padding: "10px 20px",
        backgroundColor: "#1976d2",
        color: "#fff",
        borderRadius: "5px",
        cursor: "pointer",
        fontSize: "14px",
        textAlign: "center",
      }}
    >
      {photo && typeof photo !== "string" ? "Change Photo" : "Choose Photo"}
      <input
        type="file"
        id="upload-photo"
        accept="image/*"
        onChange={handlePhotoChange}
        style={{ display: "none" }}
      />
    </label>
  )}
</div>
      <div style={{ width: "70%", display: "flex", justifyContent: "center" }}>
        <form style={{ width: "80%" }}>
          <h1 style={{ textAlign: "center", marginBottom: 0 }}>Your Profile</h1>
          <div style={{ display: "flex", justifyContent: "end", marginBottom: 30 }}>
            <Fab variant="extended" onClick={() => setebutton(!ebutton)} sx={{ height: 35 }}>
              <EditIcon sx={{ mr: 1 }} />
              {ebutton ? "Cancel" : "Edit"}
            </Fab>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <TextField
              label="First Name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              style={{ width: "45%", marginBottom: "40px" }}
              InputProps={{ readOnly: !ebutton }}
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              label="Last Name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              style={{ width: "45%", marginBottom: "40px" }}
              InputProps={{ readOnly: !ebutton }}
              InputLabelProps={{ shrink: true }}
            />
          </div>

          <TextField
            label="Email"
            value={email}
            onChange={(e) => setemail(e.target.value)}
            style={{ width: "100%", marginBottom: "40px" }}
            InputProps={{ readOnly: !ebutton }}
            InputLabelProps={{ shrink: true }}
          />

          <TextField
            label="Phone"
            value={phone}
            onChange={(e) => setphone(e.target.value)}
            style={{ width: "100%", marginBottom: "40px" }}
            InputProps={{ readOnly: !ebutton }}
            InputLabelProps={{ shrink: true }}
          />

          {ebutton && (
            <div style={{ textAlign: "center" }}>
              <button
                type="button"
                onClick={handleUpdate}
                style={{
                  padding: "10px 30px",
                  fontSize: "16px",
                  backgroundColor: "#1976d2",
                  color: "white",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                }}
              >
                Save Changes
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default Profile;
