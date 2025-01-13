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
import {
  Modal,
  Box,
  TextField,
  Grid,
  InputLabel,
  Select,
  MenuItem,
  FormControl,
} from "@mui/material";

import BorderColorIcon from "@mui/icons-material/BorderColor";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import DetailsIcon from "@mui/icons-material/Details";
import { useNavigate } from "react-router-dom";

const style = {
  maxWidth: "800px",
  maxHeight: "90vh",
  overflowY: "auto",
  margin: "auto",
  padding: "20px",
  backgroundColor: "white",
  borderRadius: "8px",
  boxShadow: "0 2px 10px rgba(0, 0, 0, 0.2)",
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
};

const OrderShowPage = () => {
  const navigate = useNavigate();
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

  // const fetchAllUserData = async () => {
  //   try {
  //     const response = await axios.get(
  //       `https://qwikit1.pythonanywhere.com/orderFitbackProduct/`
  //     );
  //     setGetData(response.data);
  //   } catch (err) {
  //     console.log(err);
  //   }
  // };

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

  const [filteredData, setFilteredData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchAllUserData();
  }, []);

  const fetchAllUserData = async () => {
    try {
      const response = await axios.get(`https://qwikit1.pythonanywhere.com/orderFitbackProduct/`);
      const sortedData = response.data.sort((a, b) => b.id - a.id);
      setGetData(sortedData);
      setFilteredData(sortedData);
    } catch (err) {
      console.error(err);
    }
  };

  const handleInputChange = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    const filteredResults = getData.filter(
      user =>
        user.phonenumber.toString().includes(query) ||
        user.name.toLowerCase().includes(query)
    );

    setFilteredData(filteredResults);
  };

  return (
    <div>
      <h2>
        {filteredData.length > 0
          ? `Showing ${filteredData.length} user(s)`
          : `No users to display`}
      </h2>

      <input
        type="text"
        placeholder="Search by name or phone number"
        value={searchQuery}
        onChange={handleInputChange}
        style={{
          padding: "10px 10px 10px 30px",
          width: "250px",
          marginBottom: "20px",
          border: "2px solid rgb(251, 37, 115)",
          borderRadius: "7px"
        }}
      />
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
                <FormControl
                  fullWidth
                  margin="normal"
                  error={
                    formik.touched.paymentmethod &&
                    Boolean(formik.errors.paymentmethod)
                  }
                >
                  <InputLabel id="paymentmethod">Payment Method</InputLabel>
                  <Select
                    labelId="paymentmethod"
                    id="paymentmethod"
                    name="paymentmethod"
                    value={formik.values.paymentmethod}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    label="paymentmethod"
                  >
                    <MenuItem value="Cash_on_delivery">
                      Cash on Delivery
                    </MenuItem>
                    <MenuItem value="Stripe">Stripe</MenuItem>
                    <MenuItem value="Paypal">Paypal</MenuItem>
                    <MenuItem value="Bkash">Bkash</MenuItem>
                  </Select>
                  {formik.touched.paymentmethod && formik.errors.category && (
                    <p className="text-red-500 text-sm">
                      {formik.errors.paymentmethod}
                    </p>
                  )}
                </FormControl>
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
                color="primary"
                sx={{ marginLeft: "10px" }}
                className="custom-btn-all"
              >
                Update
              </Button>
            </Box>
          </form>
        </Box>
      </Modal>
      {/* <TableContainer
        component={Paper}
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
              <TableCell> Code ID</TableCell>
              <TableCell>User ID</TableCell>
              <TableCell align="center">Username</TableCell>
              <TableCell align="center">Phone </TableCell>
              <TableCell align="center">Address</TableCell>
              <TableCell align="center"> Quantity</TableCell>
              <TableCell align="left"> Price</TableCell>
              <TableCell align="left">Payment Method</TableCell>
              <TableCell align="center">Update</TableCell>
              <TableCell align="center">Delete</TableCell>
              <TableCell align="center">Details</TableCell>
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
                <TableCell>{item.order_codeid  || "N/A"}</TableCell>
                <TableCell>{item.userid || "N/A"}</TableCell>
                <TableCell align="center">{item.username || "N/A"}</TableCell>
                <TableCell align="center">{item.phonenumber || "N/A"}</TableCell>
                <TableCell align="center">{item.address || "N/A"}</TableCell>
                <TableCell align="center">{item.totalquantity || "N/A"}</TableCell>
                <TableCell align="left">{item.totalprice || "N/A"}</TableCell>
                <TableCell align="left">{item.paymentmethod || "N/A"}</TableCell>
                <TableCell align="center">
                  <Button
                    color="primary"
                    onClick={() => controlHandleClick(item.id)}
                  >
                    <BorderColorIcon />
                  </Button>
                </TableCell>
                <TableCell align="center">
                  <Button
                    color="error"
                    onClick={() => deleteUser(item.id)}
                  >
                    <DeleteForeverIcon />
                  </Button>
                </TableCell>
                <TableCell align="center">
                    <Button color="error" onClick={()=>navigate(`${item.id}`)}>
                      <DetailsIcon />
                    </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer> */}
      <TableContainer
        component={Paper}
        sx={{
          minWidth: 850, // Adjusted min width
          "& thead th": {
            position: "sticky",
            top: 0,
            backgroundColor: "background.paper",
            zIndex: 1,
            fontWeight: "bold", // Apply bold to headers
          },
          "@media (max-width: 768px)": {
            minWidth: "100%", // Adjust table width for small screens
          },
          maxHeight: "600px", // Set max height for vertical scroll
          overflowY: "auto", // Enable vertical scrolling
          overflowX: "hidden", // Hide horizontal scrollbar
          scrollbarWidth: "none", // Hide scrollbar for Firefox
          msOverflowStyle: "none", // Hide scrollbar for IE/Edge
        }}
      >
        {/* Hide scrollbar for WebKit browsers */}
        <style>
          {`
      div::-webkit-scrollbar {
        display: none;
      }
    `}
        </style>
        <Table
          sx={{
            minWidth: 850,
            "@media (max-width: 768px)": {
              minWidth: "100%", // Full width on small screens
            },
          }}
          size="small"
          aria-label="a dense table"
        >
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Code ID</TableCell>
              <TableCell>User ID</TableCell>
              <TableCell align="center">Username</TableCell>
              <TableCell align="center">Phone</TableCell>
              <TableCell align="center">Address</TableCell>
              <TableCell align="center">Quantity</TableCell>
              <TableCell align="left">Price</TableCell>
              <TableCell align="left">Payment Method</TableCell>
              <TableCell align="center">Update</TableCell>
              <TableCell align="center">Delete</TableCell>
              <TableCell align="center">Details</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredData.map((item) => (
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
                <TableCell>{item.order_codeid || "N/A"}</TableCell>
                <TableCell>{item.userid || "N/A"}</TableCell>
                <TableCell align="center">{item.username || "N/A"}</TableCell>
                <TableCell align="center">
                  {item.phonenumber || "N/A"}
                </TableCell>
                <TableCell align="center">{item.address || "N/A"}</TableCell>
                <TableCell align="center">
                  {item.totalquantity || "N/A"}
                </TableCell>
                <TableCell align="left">{item.totalprice || "N/A"}</TableCell>
                <TableCell align="left">
                  {item.paymentmethod || "N/A"}
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
                <TableCell align="center">
                  <Button color="error" onClick={() => navigate(`${item.id}`)}>
                    <DetailsIcon />
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

export default OrderShowPage;
