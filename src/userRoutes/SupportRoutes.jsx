import { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import axios from "axios";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import "react-toastify/dist/ReactToastify.css";
import { toast, ToastContainer } from "react-toastify";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Box, Modal, TextField } from "@mui/material";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

const SupportRoutes = () => {
  // Get Support user Data
  const [getData, setGetData] = useState([]);

  // modal code
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    formik.resetForm();
  };

  // get updating user ID
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
        `https://qwikit1.pythonanywhere.com/supportProfile/`
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
    },
    validationSchema,
    onSubmit: async (values) => {
      console.log(values);
      try {
        const updatedUserData = {
          name: values.name,
          phonenumber: values.phonenumber,
          password: values.password,
          email: values.email,
          address: values.address,
          experience: values.experience,
        };
        const response = await axios.put(
          `https://qwikit1.pythonanywhere.com/supportProfile/${getUserToUpdate.id}`,
          updatedUserData
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
        `https://qwikit1.pythonanywhere.com/supportProfile/${id}`
      );
      setGetUserToUpdate(response.data);
    } catch (err) {
      console.log(err);
    }
  };

  // Update the state with fields

  useEffect(() => {
    if (getUserToUpdate) {
      formik.setValues({
        name: getUserToUpdate.name || "",
        phonenumber: getUserToUpdate.phonenumber || "",
        password: getUserToUpdate.password || "",
        email: getUserToUpdate.email || "",
        address: getUserToUpdate.address || "",
        experience: getUserToUpdate.experience || "",
      });
    }
  }, [getUserToUpdate]);

  const controlHandleClick = (id) => {
    updatingUserId(id);
    handleOpen();
    console.log(id);
  };

  // delete user

  const deleteUser = async (id) => {
    try {
      try {
        const response = await axios.delete(
          `https://qwikit1.pythonanywhere.com/supportProfile/${id}`
        );
        console.log(response.data);
        fetchAllUserData();
        toast.success("User Deleted successfully", { theme: "colored" });
        console.log(id);
      } catch (err) {
        console.log(err);
      }
    } catch (err) {
      toast.error(err, { theme: "colored" });
    }
  };
  
  return (
    <div>
      <h1>Show Support User List</h1>
      <ToastContainer position="bottom-center" autoClose={2000} theme="colored"/>
      <Modal
        open={open}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <form onSubmit={formik.handleSubmit}>
          <TextField
              id="name"
              name="name"
              variant="outlined"
              value={formik.values.name}
              onChange={formik.handleChange}
              fullWidth
              margin="normal"
            />
            <TextField
              id="phonenumber"
              name="phonenumber"
              variant="outlined"
              value={formik.values.phonenumber}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={
                formik.touched.phonenumber && Boolean(formik.errors.phonenumber)
              }
              helperText={
                formik.touched.phonenumber && formik.errors.phonenumber
              }
              fullWidth
              margin="normal"
            />
            <TextField
              id="password"
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
            />
            <TextField
              id="email"
              name="email"
              variant="outlined"
              type="email"
              value={formik.values.email}
              onChange={formik.handleChange}
              fullWidth
              margin="normal"
            />
            <TextField
              id="address"
              name="address"
              variant="outlined"
              value={formik.values.address}
              onChange={formik.handleChange}
              fullWidth
              margin="normal"
            />
            <TextField
              id="experience"
              name="experience"
              variant="outlined"
              value={formik.values.experience}
              onChange={formik.handleChange}
              fullWidth
              margin="normal"
            />
            <Button variant="outlined" color="secondary" onClick={handleClose}>
              Close
            </Button>{" "}
            <Button
              type="submit"
              variant="contained"
              color="success"
              style={{ marginLeft: "10px" }}
            >
              Update
            </Button>
          </form>
        </Box>
      </Modal>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 850 }} size="small" aria-label="a dense table">
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell align="center">Phone</TableCell>
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
                <TableCell>{item.name}</TableCell>
                <TableCell>{item.phonenumber}</TableCell>
                <TableCell>{item.address}</TableCell>
                <TableCell>{item.experience}</TableCell>
                <TableCell align="center">
                  <Button
                    color="secondary"
                    onClick={() => controlHandleClick(item.id)}
                  >
                    Update user
                  </Button>
                </TableCell>
                <TableCell align="center">
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={() => deleteUser(item.id)}
                  >
                    Delete
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

export default SupportRoutes;
