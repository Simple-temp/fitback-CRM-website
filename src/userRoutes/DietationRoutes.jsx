import axios from "axios";
import { useEffect, useState } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import * as Yup from "yup";
import { useFormik } from "formik";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import TextField from "@mui/material/TextField";
import { ToastContainer, toast } from "react-toastify";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";

import BorderColorIcon from '@mui/icons-material/BorderColor';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import avater from "../../public/img/avater.png"

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 900,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

const DietationRoutes = () => {
  const [getData, setGetData] = useState([]);

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    formik.resetForm();
  };

  const [getUserToUpdate, setGetUserToUpdate] = useState(null);

  // Formik validation schema
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

  useEffect(() => {
    fetchAllUserData();
  }, []);

  const fetchAllUserData = async () => {
    try {
      const response = await axios.get(
        `https://qwikit1.pythonanywhere.com/dietitianProfile/`
      );
      setGetData(response.data);
    } catch (err) {
      console.log(err);
    }
  };

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
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        const updatedUserData = {
          name: values.name,
          phonenumber: values.phonenumber,
          password: values.password,
          email: values.email,
          address: values.address,
          experience: values.experience,
        };
        console.log(updatedUserData)

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
        formData.append("postcode", values.postcode);
        formData.append("user_type", values.user_type || "Dietitian");
        formData.append("nickname", values.nickname);
        formData.append("about", values.about);
        // Check if a new file is selected
          if(values.image && values.image instanceof File) {
             formData.append("image", values.image);
        }

        const response = await axios.put(
          `https://qwikit1.pythonanywhere.com/dietitianProfile/${getUserToUpdate.id}`,
          formData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
        console.log("User updated successfully:", response.data);
        toast.success("User updated successfully", { theme: "colored" });
        fetchAllUserData();
        handleClose();
      } catch (error) {
        console.error(error);
      }
    },
  });

  // get updating user ID
  const updatingUserId = async (id) => {
    try {
      const response = await axios.get(
        `https://qwikit1.pythonanywhere.com/dietitianProfile/${id}`
      );
      setGetUserToUpdate(response.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (getUserToUpdate) {
      formik.setValues({
        name: getUserToUpdate.name || "",
        phonenumber: getUserToUpdate.phonenumber || "",
        password: getUserToUpdate.password || "",
        email: getUserToUpdate.email || "",
        address: getUserToUpdate.address || "",
        experience: getUserToUpdate.experience || "",
        user_type:  getUserToUpdate.user_type || "",
      });
    }
  }, [getUserToUpdate]);

  // control handle click
  const controlHandleClick = (id) => {
    updatingUserId(id);
    handleOpen();
  };

  const deleteUser = async (id) => {
    try {
      try {
        const response = await axios.delete(
          `https://qwikit1.pythonanywhere.com/dietitianProfile/${id}`
        );
        console.log(response.data);
        toast.success("User Deleted successfully", { theme: "colored" });
        fetchAllUserData();
        handleClose();
      } catch (err) {
        console.log(err);
      }
    } catch (err) {
      toast.error(err, { theme: "colored" });
    }
  };

  return (
    <div>
      <h1>Show user list</h1>
      <ToastContainer
        position="bottom-center"
        autoClose={2000}
        theme="colored"
      />
      <Modal
        open={open}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
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
                  formik.touched.phonenumber &&
                  Boolean(formik.errors.phonenumber)
                }
                helperText={
                  formik.touched.phonenumber && formik.errors.phonenumber
                }
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
                error={
                  formik.touched.password && Boolean(formik.errors.password)
                }
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
                variant="outlined"
                color="error"
                onClick={handleClose}
                className="custom-right-botton"
              >
                Close
              </Button>{" "}
              <Button
                type="submit"
                variant="contained"
                color="primary"
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg"
              >
                Update
              </Button>
            </div>
          </form>
        </Box>
      </Modal>
      {/* <TableContainer component={Paper}>
        <Table sx={{ minWidth: 850 }} size="small" aria-label="a dense table">
          <TableHead 
           style={{
            fontWeight: "bold", // Bold header text
            whiteSpace: "nowrap", // Prevents wrapping
          }}
          >
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Image</TableCell>
              <TableCell>Account Type</TableCell>
              <TableCell>Name</TableCell>
              <TableCell align="center">Phone</TableCell>
              <TableCell align="center">Email</TableCell>
              <TableCell align="center">Address</TableCell>
              <TableCell align="center">Experience</TableCell>
              <TableCell align="center">Update</TableCell>
              <TableCell align="center">Delete</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {getData.map((item) => (
              <TableRow
                key={item.id}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell>{item.id}</TableCell>
                <TableCell>
                    <img
                      src={item.image || avater}
                      alt="Avatar"
                      style={{
                        width: "50px",
                        height: "50px",
                        borderRadius: "50%", // Makes the image completely circular
                        objectFit: "cover",
                      }}
                    />
                  </TableCell>
                <TableCell>{item.user_type || "N/A"}</TableCell>
                <TableCell>{item.name || "N/A"}</TableCell>
                <TableCell>{item.phonenumber || "N/A"}</TableCell>
                <TableCell>{item.email || "N/A"}</TableCell>
                <TableCell>{item.address || "N/A"}</TableCell>
                <TableCell>{item.experience || "N/A"}</TableCell>
                <TableCell align="center">
                  <Button
                    color="primary"
                    onClick={() => controlHandleClick(item.id)}
                  >
                    <BorderColorIcon/>
                  </Button>
                </TableCell>
                <TableCell align="center">
                  <Button
                    color="error"
                    onClick={() => deleteUser(item.id)}
                  >
                    <DeleteForeverIcon/>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer> */}
       <TableContainer component={Paper}>
      <Table
        sx={{
          minWidth: 850, // Adjusted min width
          "& thead th": {
            position: "sticky",
            top: 0,
            backgroundColor: "background.paper",
            zIndex: 1,
            fontWeight: "bold", // Apply bold to headers
          },
        }}
        size="small"
        aria-label="a dense table"
      >
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Image</TableCell>
            <TableCell>Account Type</TableCell>
            <TableCell>Name</TableCell>
            <TableCell align="center">Phone</TableCell>
            <TableCell align="center">Email</TableCell>
            <TableCell align="center">Address</TableCell>
            <TableCell align="center">Experience</TableCell>
            <TableCell align="center">Update</TableCell>
            <TableCell align="center">Delete</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {getData.map((item) => (
            <TableRow
              key={item.id}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell>{item.id}</TableCell>
              <TableCell>
                <img
                  src={item.image || avater}
                  alt="Avatar"
                  style={{
                    width: "50px",
                    height: "50px",
                    borderRadius: "50%", // Circular image
                    objectFit: "cover",
                  }}
                />
              </TableCell>
              <TableCell>{item.user_type || "N/A"}</TableCell>
              <TableCell>{item.name || "N/A"}</TableCell>
              <TableCell align="center">{item.phonenumber || "N/A"}</TableCell>
              <TableCell align="center">{item.email || "N/A"}</TableCell>
              <TableCell align="center">{item.address || "N/A"}</TableCell>
              <TableCell align="center">{item.experience || "N/A"}</TableCell>
              <TableCell align="center">
                <Button
                  color="primary"
                  onClick={() => controlHandleClick(item.id)}
                >
                  <BorderColorIcon />
                </Button>
              </TableCell>
              <TableCell align="center">
                <Button color="error" onClick={() => deleteUser(item.id)}>
                  <DeleteForeverIcon />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
    </div>
  );
};

export default DietationRoutes;
