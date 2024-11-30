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
import PropTypes from "prop-types";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";

import BorderColorIcon from '@mui/icons-material/BorderColor';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';


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

const ShowCreatedUser = ({ getData, fetchAllUserData }) => {
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
  });

  const formik = useFormik({
    initialValues: {
      name: "",
      user_FUId: "",
      phonenumber: "",
      password: "",
      email: "",
      address: "",
      city: "",
      gender: "",
      bloodgroup: "",
      fcoins: "",
      fmoney: "",
      age: "",
      image: "",
      height: "",
      weight: "",
      bloodpressure: "",
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
        formData.append("fmoney", values.fmoney);
        formData.append("fcoins", values.fcoins);
        formData.append("age", values.age);
        // Check if a new file is selected
        if (values.image && values.image instanceof File) {
          formData.append("image", values.image);
        }
        formData.append(
          "height",
          JSON.stringify(
            values.height
              ? [{ value: values.height, timestamp: new Date().toISOString() }]
              : []
          )
        );
        formData.append(
          "weight",
          JSON.stringify(
            values.weight
              ? [{ value: values.weight, timestamp: new Date().toISOString() }]
              : []
          )
        );

        const response = await axios.put(
          `https://qwikit1.pythonanywhere.com/userProfile/${getUserToUpdate.id}`,
          formData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
        console.log("User updated successfully:", response.data);
        toast.success("User updated successfully");
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
        `https://qwikit1.pythonanywhere.com/userProfile/${id}`
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
        user_FUId: getUserToUpdate.user_FUId || "",
        password: getUserToUpdate.password || "",
        email: getUserToUpdate.email || "",
        address: getUserToUpdate.address || "",
        image: getUserToUpdate.image || "",
        city: getUserToUpdate.city || "",
        gender: getUserToUpdate.gender || "",
        bloodgroup: getUserToUpdate.bloodgroup || "",
        fmoney: getUserToUpdate.fmoney || "",
        fcoins: getUserToUpdate.fcoins || "",
        age: getUserToUpdate.age || "",
        height:
          Array.isArray(getUserToUpdate.height) && getUserToUpdate.height[0]
            ? getUserToUpdate.height[0].value
            : "",
        weight:
          Array.isArray(getUserToUpdate.weight) && getUserToUpdate.weight[0]
            ? getUserToUpdate.weight[0].value
            : "",
      });
    }
  }, [getUserToUpdate]);

  // control handle click
  const controlHandleClick = (id) => {
    updatingUserId(id);
    handleOpen();
  };

  // delete user

  const deleteUser = async (id) => {
    try {
      try {
        const response = await axios.delete(
          `https://qwikit1.pythonanywhere.com/userProfile/${id}`
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
      <ToastContainer
        position="top-right"
      />
      <Modal
        open={open}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <form
            onSubmit={formik.handleSubmit}
            className="max-w-[1100px] mx-auto bg-white p-6 rounded-lg shadow-md"
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
                id="user_FUId"
                label="User FUId"
                name="user_FUId"
                variant="outlined"
                value={formik.values.user_FUId}
                onChange={formik.handleChange}
                fullWidth
                margin="normal"
                className="w-full"
              />
              <TextField
                id="phonenumber"
                label="Phone Number"
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
                id="city"
                label="City"
                name="city"
                variant="outlined"
                value={formik.values.city}
                onChange={formik.handleChange}
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
              <TextField
                id="bloodgroup"
                label="Blood Group"
                name="bloodgroup"
                variant="outlined"
                value={formik.values.bloodgroup}
                onChange={formik.handleChange}
                fullWidth
                margin="normal"
                className="w-full"
              />
              <TextField
                id="fmoney"
                label="Family Money"
                name="fmoney"
                variant="outlined"
                value={formik.values.fmoney}
                onChange={formik.handleChange}
                fullWidth
                margin="normal"
                className="w-full"
              />
              <TextField
                id="fcoins"
                label="Family Coins"
                name="fcoins"
                variant="outlined"
                value={formik.values.fcoins}
                onChange={formik.handleChange}
                fullWidth
                margin="normal"
                className="w-full"
              />
              <TextField
                id="age"
                label="Age"
                name="age"
                variant="outlined"
                value={formik.values.age}
                onChange={formik.handleChange}
                fullWidth
                margin="normal"
                className="w-full"
              />
              <TextField
                id="image"
                name="image"
                type="file"
                variant="outlined"
                onChange={(event) => {
                  formik.setFieldValue("image", event.currentTarget.files[0]);
                }}
                fullWidth
                margin="normal"
                className="w-full"
              />
              <TextField
                id="height"
                label="Height (in cm)"
                name="height"
                variant="outlined"
                value={formik.values.height}
                onChange={formik.handleChange}
                fullWidth
                margin="normal"
                className="w-full"
              />
              <TextField
                id="weight"
                label="Weight (in kg)"
                name="weight"
                variant="outlined"
                value={formik.values.weight}
                onChange={formik.handleChange}
                fullWidth
                margin="normal"
                className="w-full"
              />
            </div>
            <div className="flex justify-end mt-4">
              <Button
                variant="outlined"
                color="secondary"
                onClick={handleClose}
              >
                Close
              </Button>{" "}
              <Button
                type="submit"
                variant="contained"
                color="success"
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg"
              >
                Update
              </Button>
            </div>
          </form>
        </Box>
      </Modal>
      <div style={{ overflowX: "auto" }}>
        <TableContainer
          component={Paper}
          sx={{
            width: "100%", // Full width
            overflowX: "auto", // Enable horizontal scrolling on smaller screens
          }}
        >
          <Table
            sx={{
              minWidth: 600, // Adjust minimum width
            }}
            size="small"
            aria-label="a dense table"
          >
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Name</TableCell>
                <TableCell align="center">Image</TableCell>
                <TableCell align="center">User FUId</TableCell>
                <TableCell align="center">Phone Number</TableCell>
                <TableCell align="center">Password</TableCell>
                <TableCell align="center">Email</TableCell>
                <TableCell align="center">Blood Group</TableCell>
                <TableCell align="center">Gender</TableCell>
                <TableCell align="center">Address</TableCell>
                <TableCell align="center">City</TableCell>
                <TableCell align="center">F Money</TableCell>
                <TableCell align="center">F Coins</TableCell>
                <TableCell align="center">Age</TableCell>
                <TableCell align="center">Height</TableCell>
                <TableCell align="center">Weight</TableCell>
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
                  <TableCell>{item.name}</TableCell>
                  <TableCell>
                    <img
                      src={item.image}
                      alt="Avatar"
                      style={{
                        width: "50px",
                        height: "50px",
                        borderRadius: "4px",
                        objectFit: "cover",
                      }}
                    />
                  </TableCell>
                  <TableCell>{item.user_FUId}</TableCell>
                  <TableCell>{item.phonenumber}</TableCell>
                  <TableCell>{item.password}</TableCell>
                  <TableCell>{item.email}</TableCell>
                  <TableCell>{item.bloodgroup}</TableCell>
                  <TableCell>{item.gender}</TableCell>
                  <TableCell>{item.address}</TableCell>
                  <TableCell>{item.city}</TableCell>
                  <TableCell>{item.fmoney}</TableCell>
                  <TableCell>{item.fcoins}</TableCell>
                  <TableCell>{item.age}</TableCell>
                  <TableCell>
                    {Array.isArray(item.height) && item.height.length > 0
                      ? item.height[0].value
                      : "No height data"}
                  </TableCell>
                  <TableCell>
                    {Array.isArray(item.weight) && item.weight.length > 0
                      ? item.weight[0].value
                      : "No weight data"}
                  </TableCell>
                  <TableCell align="center">
                  <Button
                    color="secondary"
                    onClick={() => controlHandleClick(item.id)}
                  >
                    <BorderColorIcon/>
                  </Button>
                </TableCell>
                <TableCell align="center">
                  <Button
                    variant="outlined"
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
        </TableContainer>
      </div>
    </div>
  );
};

ShowCreatedUser.propTypes = {
  getData: PropTypes.array.isRequired,
  fetchAllUserData: PropTypes.func.isRequired,
};

export default ShowCreatedUser;
