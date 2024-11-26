import { Button, TextField } from "@mui/material";
import axios from "axios";
import { useFormik } from "formik";
import { toast } from "react-toastify";
import * as Yup from "yup";
import { ToastContainer } from 'react-toastify';

const CreateHrUser = () => {

// Validation Schema
  const validationSchema = Yup.object().shape({
    phonenumber: Yup.string()
      .matches(
        /^01[1,3,4,5,6,7,8,9]\d{8}$/,
        "Invalid Bangladeshi phone number."
      )
      .required("Phone number is required")
      .max(11, "Phone number must be 11 digits"),
    password: Yup.string()
      .min(4, "Password must be at least 4 characters")
      .required("Password is required"),
  });

  const formik = useFormik({
    initialValues: {
      name: "",
      phonenumber: "",
      password: "",
      email: "",
      address: "",
      experience: "",
      user_type : ""
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        const { ...otherValues } = values;

        const dataToSubmit = {
          ...otherValues,
          user_type : "HR"
        };

        console.log(dataToSubmit)

        const response = await axios.post(
          `https://qwikit1.pythonanywhere.com/hRProfile/new`,
          dataToSubmit
        );
        console.log(response.data);
        toast.success("User Created successfully", { theme: "colored" });
      } catch (err) {
        console.error(err);
      }
    },
  });



  return (
    <div>
      <ToastContainer position="bottom-center" autoClose={2000} theme="colored"/>
      <h2>Create a new HR user</h2>
      <form
        onSubmit={formik.handleSubmit}
        className="max-w-xxl mx-auto bg-white p-6 rounded-lg shadow-md"
      >
        <div className="grid grid-cols-2 gap-4">
          <TextField
            id="name"
            label="Name"
            name="name"
            variant="outlined"
            value={formik.values.name}
            onChange={formik.handleChange}
            fullWidth
            margin="normal"
            className="w-full"
          />
          <TextField
            id="phonenumber"
            label="Phonenumber"
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
            className="w-full"
          />
          <TextField
            id="password"
            label="Password"
            name="password"
            variant="outlined"
            type="password"
            value={formik.values.password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.password && Boolean(formik.errors.password)}
            helperText={formik.touched.password && formik.errors.password}
            fullWidth
            margin="normal"
            className="w-full"
          />
          <TextField
            id="email"
            label="Email"
            name="email"
            variant="outlined"
            type="email"
            value={formik.values.email}
            onChange={formik.handleChange}
            fullWidth
            margin="normal"
            className="w-full"
          />
          <TextField
            id="experience"
            label="Experience"
            name="experience"
            variant="outlined"
            value={formik.values.experience}
            onChange={formik.handleChange}
            fullWidth
            margin="normal"
            className="w-full"
          />
          <TextField
            id="address"
            label="Address"
            name="address"
            variant="outlined"
            value={formik.values.address}
            onChange={formik.handleChange}
            fullWidth
            margin="normal"
            className="w-full"
          />
        </div>
        <div className="flex justify-end mt-4">
          <Button
            type="submit"
            variant="contained"
            color="success"
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg"
          >
            Create
          </Button>
        </div>
      </form>
    </div>
  )
}

export default CreateHrUser
