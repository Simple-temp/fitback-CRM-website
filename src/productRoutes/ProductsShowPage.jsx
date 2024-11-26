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
import "./Product.css";

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
const ProductsShowPage = () => {
  // Get products
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
        `https://qwikit1.pythonanywhere.com/product/`
      );
      setGetData(response.data);
    } catch (err) {
      console.log(err);
    }
  };

  // Formik validation schema
  const validationSchema = Yup.object().shape({
    category: Yup.string().required("Category is required"),
  });

  const formik = useFormik({
    initialValues: {
      category: "",
      productbrand: "",
      productname: "",
      quantity: "",
      discount: "",
      image1: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        const formData = new FormData();
        formData.append("category", values.category);
        formData.append("productbrand", values.productbrand);
        formData.append("productname", values.productname);
        formData.append("quantity", values.quantity);
        formData.append("discount", values.discount);
        formData.append("image1", values.image1);

        const response = await axios.put(
          `https://qwikit1.pythonanywhere.com/product/${getUserToUpdate.id}`,
          formData
        );
        console.log("Server response:", response.data);
        toast.success("Product Updated successfully", { theme: "colored" });
        handleClose();
        fetchAllUserData();
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
        `https://qwikit1.pythonanywhere.com/product/${id}`
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
        category: getUserToUpdate.category || "",
        productbrand: getUserToUpdate.productbrand || "",
        productname: getUserToUpdate.productname || "",
        quantity: getUserToUpdate.quantity || "",
        discount: getUserToUpdate.discount || "",
        image1: getUserToUpdate.image1 || "",
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
          `https://qwikit1.pythonanywhere.com/product/${id}`
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
      <h3>Product List</h3>
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
          <form onSubmit={formik.handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={4}>
                <label htmlFor="category">Category</label>
                <TextField
                  id="category"
                  name="category"
                  variant="outlined"
                  value={formik.values.category}
                  onChange={formik.handleChange}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <label htmlFor="productbrand">Product Brand</label>
                <TextField
                  id="productbrand"
                  name="productbrand"
                  variant="outlined"
                  value={formik.values.productbrand}
                  onChange={formik.handleChange}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <label htmlFor="productname">Product Name</label>
                <TextField
                  id="productname"
                  name="productname"
                  variant="outlined"
                  value={formik.values.productname}
                  onChange={formik.handleChange}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <label htmlFor="quantity">Quantity</label>
                <TextField
                  id="quantity"
                  name="quantity"
                  variant="outlined"
                  value={formik.values.quantity}
                  onChange={formik.handleChange}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <label htmlFor="discount">Discount</label>
                <TextField
                  id="discount"
                  name="discount"
                  variant="outlined"
                  value={formik.values.discount}
                  onChange={formik.handleChange}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <label htmlFor="image1">Image Link</label>
                <TextField
                  id="image1"
                  name="image1"
                  type="file"
                  onChange={(event) => {
                    formik.setFieldValue("image1", event.currentTarget.files[0]);
                  }}
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
          maxHeight: "90vh", // Add a max height for better responsiveness
        }}
      >
        <Table
          sx={{
            minWidth: 850,
            "@media (max-width: 768px)": {
              minWidth: "100%", // Allow shrinkage on smaller screens
            },
          }}
          size="small"
          aria-label="a dense table"
        >
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Product Brand</TableCell>
              <TableCell>Product Name</TableCell>
              <TableCell>Discount (Taka)</TableCell>
              <TableCell>Image</TableCell>
              <TableCell>Quantity</TableCell>
              <TableCell>Update</TableCell>
              <TableCell>Delete</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {getData.map((item) => (
              <TableRow
                key={item.id}
                sx={{
                  "&:last-child td, &:last-child th": { border: 0 },
                  "@media (max-width: 768px)": {
                    fontSize: "0.85rem", // Smaller font for mobile screens
                  },
                }}
              >
                <TableCell>{item.id}</TableCell>
                <TableCell>{item.category}</TableCell>
                <TableCell>{item.productbrand}</TableCell>
                <TableCell>{item.productname}</TableCell>
                <TableCell>{item.discount}</TableCell>
                <TableCell>
                  <img src={item.image1} alt="Product" style={{ width: "150px", height: "100px", borderRadius: "4px", }} />
                </TableCell>
                <TableCell>{item.quantity}</TableCell>
                <TableCell>
                  <Button
                    color="secondary"
                    onClick={() => controlHandleClick(item.id)}
                  >
                    Update Product
                  </Button>
                </TableCell>
                <TableCell>
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

export default ProductsShowPage;
