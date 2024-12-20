import axios from "axios";
import { useEffect, useState } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import * as Yup from "yup";
import { useFormik } from "formik";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import TextField from "@mui/material/TextField";
import { toast } from "react-toastify";
import PropTypes from "prop-types";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";

import BorderColorIcon from "@mui/icons-material/BorderColor";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import avater from "../../public/img/avater.png";

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
        /^01[1,2,3,4,5,6,7,8,9]\d{8}$/,
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
      usertype: "",
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
        formData.append("usertype", values.usertype);
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
        usertype: getUserToUpdate.usertype || "",
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
            <div className="grid grid-cols-3 gap-4  border-color">
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
              <FormControl
                fullWidth
                margin="normal"
                error={
                  formik.touched.usertype && Boolean(formik.errors.usertype)
                }
              >
                <InputLabel id="usertype">User Type</InputLabel>
                <Select
                  labelId="usertype"
                  id="usertype"
                  name="usertype"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  label="usertype"
                >
                  <MenuItem value="">Regular</MenuItem>
                  <MenuItem value="Fitback">Fitback</MenuItem>
                  <MenuItem value="Reset">Reset</MenuItem>
                  <MenuItem value="Reset">Aesthetic</MenuItem>
                </Select>
                {formik.touched.usertype && formik.errors.usertype && (
                  <p className="text-red-500 text-sm">
                    {formik.errors.usertype}
                  </p>
                )}
              </FormControl>
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
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg custom-btn-all"
              >
                Update
              </Button>
            </div>
          </form>
        </Box>
      </Modal>
      {/* <div style={{ overflowX: "auto" }}>
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
              "& thead th": {
                position: "sticky",
                top: 0,
                backgroundColor: "background.paper",
                zIndex: 1,
              },
            }}
            size="small"
            aria-label="a dense table"
          >
            <TableHead>
              <TableRow>
                {[
                  "ID",
                  "Image",
                  "Name",
                  "User Type",
                  "User FUId",
                  "Phone Number",
                  "Password",
                  "Email",
                  "Blood Group",
                  "Gender",
                  "Address",
                  "City",
                  "F Money",
                  "F Coins",
                  "Age",
                  "Height",
                  "Weight",
                  "Update",
                  "Delete",
                ].map((header, index) => (
                  <TableCell
                    key={index}
                    align={index === 1 ? "center" : "left"} // Center align image header
                    style={{
                      fontWeight: "bold", // Bold header text
                      whiteSpace: "nowrap", // Prevents wrapping
                    }}
                  >
                    {header}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {getData.map((item) => (
                <TableRow
                  key={item.id}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell>{item.id}</TableCell>
                  <TableCell align="center">
                    <img
                      src={item.image || avater}
                      alt="Avatar"
                      style={{
                        width: "50px",
                        height: "40px",
                        borderRadius: "50%", // Circular image
                        objectFit: "cover",
                      }}
                    />
                  </TableCell>
                  <TableCell>{item.name || "N/A"}</TableCell>
                  <TableCell>{item.usertype || "Regular"}</TableCell>
                  <TableCell>{item.user_FUId || "N/A"}</TableCell>
                  <TableCell>{item.phonenumber || "N/A"}</TableCell>
                  <TableCell>{item.password || "N/A"}</TableCell>
                  <TableCell>{item.email || "N/A"}</TableCell>
                  <TableCell>{item.bloodgroup || "N/A"}</TableCell>
                  <TableCell>{item.gender || "N/A"}</TableCell>
                  <TableCell>{item.address || "N/A"}</TableCell>
                  <TableCell>{item.city || "N/A"}</TableCell>
                  <TableCell>{item.fmoney || "N/A"}</TableCell>
                  <TableCell>{item.fcoins || "N/A"}</TableCell>
                  <TableCell>{item.age || "N/A"}</TableCell>
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
      </div> */}
      <div style={{ width: "100%", overflowX: "auto" }}>
        <Paper sx={{ width: "100%", overflow: "hidden" }}>
          {/* Set the scrollable container */}
          <div
            style={{
              height: "550px", // Set fixed height for vertical scrolling
              overflowY: "auto", // Enable vertical scrolling
              width: "100%",
              scrollbarWidth: "none", // Hide scrollbar for Firefox
              msOverflowStyle: "none", // Hide scrollbar for Internet Explorer/Edge
            }}
          >
            {/* Hide scrollbar for WebKit browsers (Chrome, Safari) */}
            <style>
              {`
          div::-webkit-scrollbar {
            display: none;
          }
        `}
            </style>
            <Table
              stickyHeader
              sx={{
                minWidth: 600, // Minimum width to ensure horizontal scroll
                borderCollapse: "collapse", // Avoid double borders
              }}
              aria-label="sticky table"
            >
              <TableHead>
                <TableRow>
                  {[
                    "ID",
                    "Image",
                    "Name",
                    "User Type",
                    "User FUId",
                    "Phone Number",
                    "Password",
                    "Email",
                    "Blood Group",
                    "Gender",
                    "Address",
                    "City",
                    "F Money",
                    "F Coins",
                    "Age",
                    "Height",
                    "Weight",
                    "Update",
                    "Delete",
                  ].map((header, index) => (
                    <TableCell
                      key={index}
                      align={index === 1 ? "center" : "left"}
                      sx={{
                        fontWeight: "bold",
                        whiteSpace: "nowrap",
                        backgroundColor: "white", // Sticky header background
                      }}
                    >
                      {header}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>

              <TableBody>
                {getData.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.id}</TableCell>
                    <TableCell align="center">
                      <img
                        src={item.image || avater}
                        alt="Avatar"
                        style={{
                          width: "50px",
                          height: "40px",
                          borderRadius: "50%",
                          objectFit: "cover",
                        }}
                      />
                    </TableCell>
                    <TableCell>{item.name || "N/A"}</TableCell>
                    <TableCell>{item.usertype || "General"}</TableCell>
                    <TableCell>{item.user_FUId || "N/A"}</TableCell>
                    <TableCell>{item.phonenumber || "N/A"}</TableCell>
                    <TableCell>{item.password || "N/A"}</TableCell>
                    <TableCell>{item.email || "N/A"}</TableCell>
                    <TableCell>{item.bloodgroup || "N/A"}</TableCell>
                    <TableCell>{item.gender || "N/A"}</TableCell>
                    <TableCell>{item.address || "N/A"}</TableCell>
                    <TableCell>{item.city || "N/A"}</TableCell>
                    <TableCell>{item.fmoney || "N/A"}</TableCell>
                    <TableCell>{item.fcoins || "N/A"}</TableCell>
                    <TableCell>{item.age || "N/A"}</TableCell>
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
          </div>
        </Paper>
      </div>
    </div>
  );
};

ShowCreatedUser.propTypes = {
  getData: PropTypes.array.isRequired,
  fetchAllUserData: PropTypes.func.isRequired,
};

export default ShowCreatedUser;
