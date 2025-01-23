import { Button, TextField } from "@mui/material";
import axios from "axios";
import { useFormik } from "formik";
import { toast, ToastContainer } from "react-toastify";
import * as Yup from "yup";
import { useEffect, useState } from "react";

const Setting = () => {
  const loggedInUser = localStorage.getItem("loggedInUser");
  const userParse = loggedInUser ? JSON.parse(loggedInUser) : null;
  const [getUserToUpdate, setGetUserToUpdate] = useState(null);

  useEffect(() => {
    fetchUserProfile();
  }, []);

  // Helper function to get API endpoints
  const getApiEndpoint = (type, id) => {
    const endpoints = {
      Admin: "adminProfile",
      Dietitian: "dietitianProfile",
      Desk: "deskProfile",
      Support: "supportProfile",
      Doctor: "doctorProfile",
      HR: "hRProfile",
    };
    const endpoint = endpoints[type];
    if (!endpoint) throw new Error("Invalid user type detected.");
    return `https://qwikit1.pythonanywhere.com/${endpoint}/${id}`;
  };

  // Validation schema
  const validationSchema = Yup.object().shape({
    phonenumber: Yup.string()
      .matches(
        /^01[1,3,4,5,6,7,8,9]\d{8}$/,
        "Invalid Bangladeshi phone number."
      )
      .required("Phone number is required")
      .max(11, "Phone number must be 11 digits"),
    oldpassword: Yup.string()
      .min(4, "Password must be at least 4 characters")
      .required("Old password is required"),
    newpassword: Yup.string()
      .min(4, "Password must be at least 4 characters"),
    retypepassword: Yup.string()
      .oneOf([Yup.ref("newpassword")], "Passwords must match")
  });

  const formik = useFormik({
    initialValues: {
      phonenumber: "",
      oldpassword: "",
      newpassword: "",
      retypepassword: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        // Verify old password
        if (getUserToUpdate.password !== values.oldpassword) {
          toast.error("Old password is incorrect", { theme: "colored" });
          return;
        }

        // Prepare form data
        const formData = new FormData();
        formData.append("phonenumber", values.phonenumber);
        formData.append("password", values.newpassword);

        // Update user profile
        const userApiEndpoint = getApiEndpoint(userParse.user_type, userParse.id);
        const response = await axios.put(userApiEndpoint, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        console.log("Password updated successfully:", response.data);
        toast.success("Password updated successfully", { theme: "colored" });
        fetchUserProfile(); // Refresh user data after update
      } catch (error) {
        console.error("Error updating user profile:", error);
        toast.error("Failed to update user profile", { theme: "colored" });
      }
    },
  });

  // Fetch user profile
  const fetchUserProfile = async () => {
    try {
      const userApiUrl = getApiEndpoint(userParse.user_type, userParse.id);
      const response = await axios.get(userApiUrl);
      setGetUserToUpdate(response.data);

      // Populate form with current user data
      formik.setValues({
        phonenumber: response.data.phonenumber || "",
        oldpassword: "",
        newpassword: "",
        retypepassword: "",
      });
    } catch (err) {
      console.error("Error fetching user profile:", err);
    }
  };

  return (
    <div>
      <ToastContainer position="bottom-center" autoClose={2000} theme="colored" />
      <h2>Profile</h2>
      <form
        onSubmit={formik.handleSubmit}
        className="max-w-xxl mx-auto bg-white p-6 rounded-lg shadow-md"
      >
        <div className="grid grid-cols-1 gap-4">
          <TextField
            id="phonenumber"
            label="Phone Number"
            name="phonenumber"
            variant="outlined"
            value={formik.values.phonenumber}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={
              formik.touched.phonenumber && Boolean(formik.errors.phonenumber)
            }
            helperText={formik.touched.phonenumber && formik.errors.phonenumber}
            fullWidth
            margin="normal"
          />
          <TextField
            id="oldpassword"
            label="Old Password"
            name="oldpassword"
            variant="outlined"
            type="password"
            value={formik.values.oldpassword}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={
              formik.touched.oldpassword && Boolean(formik.errors.oldpassword)
            }
            helperText={formik.touched.oldpassword && formik.errors.oldpassword}
            fullWidth
            margin="normal"
          />
          <TextField
            id="newpassword"
            label="New Password"
            name="newpassword"
            variant="outlined"
            type="password"
            value={formik.values.newpassword}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={
              formik.touched.newpassword && Boolean(formik.errors.newpassword)
            }
            helperText={formik.touched.newpassword && formik.errors.newpassword}
            fullWidth
            margin="normal"
          />
          <TextField
            id="retypepassword"
            label="Retype Password"
            name="retypepassword"
            variant="outlined"
            type="password"
            value={formik.values.retypepassword}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={
              formik.touched.retypepassword &&
              Boolean(formik.errors.retypepassword)
            }
            helperText={
              formik.touched.retypepassword && formik.errors.retypepassword
            }
            fullWidth
            margin="normal"
          />
        </div>
        <div className="flex justify-end mt-4">
          <Button variant="outlined" color="error" className="mr-2" style={{marginRight:"10px"}}>
            Close
          </Button>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg custom-btn-all"
          >
            Update
          </Button>
        </div>
      </form>
    </div>
  );
};

export default Setting;
