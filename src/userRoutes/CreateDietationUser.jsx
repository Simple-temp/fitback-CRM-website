import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import axios from "axios";
import { useFormik } from "formik";
import { toast } from "react-toastify";
import * as Yup from "yup";
import { ToastContainer } from "react-toastify";

const CreateDietationUser = () => {
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
      user_FUId: "",
      nickname: "",
      city: "",
      gender: "",
      postcode: "",
      bloodgroup: "",
      image: "",
      age: "",
      digrees: "",
      about: "",
      user_type: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        const formData = new FormData();
        formData.append("name", values.name);
        formData.append("user_FUId", values.user_FUId);
        formData.append("phonenumber", values.phonenumber);
        formData.append("password", values.password);
        formData.append("email", values.email);
        formData.append("address", values.address);
        formData.append("city", values.city);
        formData.append("gender", values.gender);
        formData.append("bloodgroup", values.bloodgroup);
        formData.append("experience", values.experience);
        formData.append("digrees", values.digrees);
        formData.append("age", values.age);
        formData.append("image", values.image);
        formData.append("postcode", values.postcode);
        formData.append("user_type", values.user_type || "Dietitian");
        formData.append("nickname", values.nickname);
        formData.append("about", values.about);

        const response = await axios.post(
          `https://qwikit1.pythonanywhere.com/dietitianProfile/new`,
          formData
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
      <ToastContainer
        position="bottom-center"
        autoClose={2000}
        theme="colored"
      />
      <h2>Create a new Dietation user</h2>
      <form
        onSubmit={formik.handleSubmit}
        className="max-w-xxl mx-auto bg-white p-6 rounded-lg shadow-md"
      >
        <div className="grid grid-cols-3 gap-4">
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

          <TextField
            id="user_FUId"
            label="user_FUId"
            name="user_FUId"
            variant="outlined"
            value={formik.values.user_FUId}
            onChange={formik.handleChange}
            fullWidth
            margin="normal"
            className="w-full"
          />
          <TextField
            id="nickname"
            label="nickname"
            name="nickname"
            variant="outlined"
            value={formik.values.nickname}
            onChange={formik.handleChange}
            fullWidth
            margin="normal"
            className="w-full"
          />
          <TextField
            id="city"
            label="city"
            name="city"
            variant="outlined"
            value={formik.values.city}
            onChange={formik.handleChange}
            fullWidth
            margin="normal"
            className="w-full"
          />
          <TextField
            id="postcode"
            label="postcode"
            name="postcode"
            variant="outlined"
            value={formik.values.postcode}
            onChange={formik.handleChange}
            fullWidth
            margin="normal"
            className="w-full"
          />
          <TextField
            id="bloodgroup"
            label="bloodgroup"
            name="bloodgroup"
            variant="outlined"
            value={formik.values.bloodgroup}
            onChange={formik.handleChange}
            fullWidth
            margin="normal"
            className="w-full"
          />
          <TextField
            id="age"
            label="age"
            name="age"
            variant="outlined"
            value={formik.values.age}
            onChange={formik.handleChange}
            fullWidth
            margin="normal"
            className="w-full"
          />
          <TextField
            id="digrees"
            label="digrees"
            name="digrees"
            variant="outlined"
            value={formik.values.digrees}
            onChange={formik.handleChange}
            fullWidth
            margin="normal"
            className="w-full"
          />
          <TextField
            id="about"
            label="about"
            name="about"
            variant="outlined"
            value={formik.values.about}
            onChange={formik.handleChange}
            fullWidth
            margin="normal"
            className="w-full"
          />
          <TextField
            id="image"
            name="image"
            variant="outlined"
            type="file"
            onChange={(event) => {
              formik.setFieldValue("image", event.currentTarget.files[0]);
            }}
            fullWidth
            margin="normal"
            className="w-full"
          />
          <FormControl
            fullWidth
            margin="normal"
            error={formik.touched.gender && Boolean(formik.errors.gender)}
          >
            <InputLabel id="gender">Gender</InputLabel>
            <Select
              labelId="gender"
              id="gender"
              name="gender"
              value={formik.values.gender}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              label="gender"
            >
              <MenuItem value="Female">Female</MenuItem>
              <MenuItem value="Male">Male</MenuItem>
            </Select>
            {formik.touched.gender && formik.errors.gender && (
              <p className="text-red-500 text-sm">{formik.errors.gender}</p>
            )}
          </FormControl>
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
  );
};

export default CreateDietationUser;
