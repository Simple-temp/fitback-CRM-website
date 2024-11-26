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
import { Modal, Box, TextField, Grid } from "@mui/material";

const style = {
  maxWidth: "800px",
  maxHeight: "90vh",
  overflowY: "auto",
  margin: "auto",
  padding: "20px",
  backgroundColor: "white",
  borderRadius: "8px",
  boxShadow: "0 2px 10px rgba(0, 0, 0, 0.2)",
};

const OrderShowPage = () => {
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

  useEffect(() => {
    fetchAllUserData();
  }, []);

  const fetchAllUserData = async () => {
    try {
      const response = await axios.get(
        `https://qwikit1.pythonanywhere.com/orderFitbackProduct/`
      );
      setGetData(response.data);
    } catch (err) {
      console.log(err);
    }
  };

  // Formik validation schema
  const validationSchema = Yup.object().shape({
    username: Yup.string().required("Category is required"),
  });

  const formik = useFormik({
    initialValues: {
      username: "",
      phonenumber: "",
      address: "",
      totalquantity: "",
      totalprice: "",
      paymentmethod: "",
      ordertime: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        const dataToSubmit = {
          username: values.username,
          phonenumber: values.phonenumber,
          address: values.address,
          totalquantity: values.totalquantity,
          totalprice: values.totalprice,
          paymentmethod: values.paymentmethod,
        };

        const response = await axios.put(
          `https://qwikit1.pythonanywhere.com/orderFitbackProduct/${getUserToUpdate.id}`,
          dataToSubmit
        );

        console.log("Server response:", response.data);
        toast.success("Product Updated successfully", { theme: "colored" });
        handleClose();
        fetchAllUserData();
        console.log(dataToSubmit);
      } catch (err) {
        console.error("Error:", err.response?.data || err.message);
        toast.error(
          `Error creating product: ${err.response?.data?.message || "Unknown error"}`,
          { theme: "colored" }
        );
      }
    },
  });

  // get updating user ID

  const updatingUserId = async (id) => {
    try {
      const response = await axios.get(
        `https://qwikit1.pythonanywhere.com/orderFitbackProduct/${id}`
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
        order_codeid: getUserToUpdate.order_codeid || "",
        userid: getUserToUpdate.userid || "",
        username: getUserToUpdate.username || "",
        phonenumber: getUserToUpdate.phonenumber || "",
        address: getUserToUpdate.address || "",
        totalquantity: getUserToUpdate.totalquantity || "",
        totalprice: getUserToUpdate.totalprice || "",
        paymentmethod: getUserToUpdate.paymentmethod || "",
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
          `https://qwikit1.pythonanywhere.com/orderFitbackProduct/${id}`
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
      <h1>Total Order {getData.length} </h1>
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
        <Box
          sx={style}
          className="max-w-xxl mx-auto bg-white p-6 rounded-lg shadow-md"
        >
          <form onSubmit={formik.handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={4}>
                <label htmlFor="username">Username</label>
                <TextField
                  id="username"
                  name="username"
                  variant="outlined"
                  value={formik.values.username}
                  onChange={formik.handleChange}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <label htmlFor="phonenumber">Phone Number</label>
                <TextField
                  id="phonenumber"
                  name="phonenumber"
                  variant="outlined"
                  value={formik.values.phonenumber}
                  onChange={formik.handleChange}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <label htmlFor="address">Address</label>
                <TextField
                  id="address"
                  name="address"
                  variant="outlined"
                  value={formik.values.address}
                  onChange={formik.handleChange}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <label htmlFor="totalquantity">Total Quantity</label>
                <TextField
                  id="totalquantity"
                  name="totalquantity"
                  variant="outlined"
                  value={formik.values.totalquantity}
                  onChange={formik.handleChange}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <label htmlFor="totalprice">Total Price</label>
                <TextField
                  id="totalprice"
                  name="totalprice"
                  variant="outlined"
                  value={formik.values.totalprice}
                  onChange={formik.handleChange}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <label htmlFor="paymentmethod">Payment Method</label>
                <TextField
                  id="paymentmethod"
                  name="paymentmethod"
                  variant="outlined"
                  value={formik.values.paymentmethod}
                  onChange={formik.handleChange}
                  fullWidth
                />
              </Grid>
            </Grid>
            <Box mt={2} textAlign="right">
              <Button
                variant="outlined"
                color="secondary"
                onClick={handleClose}
              >
                Close
              </Button>
              <Button
                type="submit"
                variant="contained"
                color="success"
                sx={{ marginLeft: "10px" }}
              >
                Update
              </Button>
            </Box>
          </form>
        </Box>
      </Modal>
      <TableContainer
        component={Paper}
        sx={{
          overflowX: "auto", // Enable horizontal scrolling
          maxHeight: "90vh", // Prevent vertical overflow on smaller screens
        }}
      >
        <Table
          sx={{
            minWidth: 850,
            "@media (max-width: 768px)": {
              minWidth: "100%", // Adjust table width for small screens
            },
          }}
          size="small"
          aria-label="a dense table"
        >
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Order Code ID</TableCell>
              <TableCell>User ID</TableCell>
              <TableCell align="center">Username</TableCell>
              <TableCell align="center">Phone Number</TableCell>
              <TableCell align="center">Address</TableCell>
              <TableCell align="center">Total Quantity</TableCell>
              <TableCell align="left">Total Price</TableCell>
              <TableCell align="left">Payment Method</TableCell>
              <TableCell align="center">Update</TableCell>
              <TableCell align="center">Delete</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {getData.map((item) => (
              <TableRow
                key={item.id}
                sx={{
                  "&:last-child td, &:last-child th": { border: 0 },
                  "@media (max-width: 768px)": {
                    fontSize: "0.85rem", // Reduce font size for small screens
                  },
                }}
              >
                <TableCell>{item.id}</TableCell>
                <TableCell>{item.order_codeid}</TableCell>
                <TableCell>{item.userid}</TableCell>
                <TableCell align="center">{item.username}</TableCell>
                <TableCell align="center">{item.phonenumber}</TableCell>
                <TableCell align="center">{item.address}</TableCell>
                <TableCell align="center">{item.totalquantity}</TableCell>
                <TableCell align="left">{item.totalprice}</TableCell>
                <TableCell align="left">{item.paymentmethod}</TableCell>
                <TableCell align="center">
                  <Button
                    color="secondary"
                    onClick={() => controlHandleClick(item.id)}
                  >
                    Update Product
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
      ;
    </div>
  );
};

export default OrderShowPage;
