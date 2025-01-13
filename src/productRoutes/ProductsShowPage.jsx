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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import "./Product.css";

import BorderColorIcon from "@mui/icons-material/BorderColor";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import avater from "../../public/img/avater.png";

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

  // const fetchAllUserData = async () => {
  //   try {
  //     const response = await axios.get(
  //       `https://qwikit1.pythonanywhere.com/product/`
  //     );
  //     setGetData(response.data);
  //   } catch (err) {
  //     console.log(err);
  //   }
  // };

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
      size: "",
      details: "",
      origin: "",
      reviews: "",
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
        formData.append("size", values.size);
        formData.append("details", values.details);
        formData.append("origin", values.origin);
        formData.append("reviews", values.reviews);
        formData.append(
          "reviews",
          JSON.stringify(values.reviews ? [values.reviews] : [])
        );
        // Check if a new file is selected
        if (values.image1 && values.image1 instanceof File) {
          formData.append("image1", values.image1);
        }

        const response = await axios.put(
          `https://qwikit1.pythonanywhere.com/product/${getUserToUpdate.id}`,
          formData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
        console.log("Server response:", response.data);
        toast.success("Product Updated successfully", { theme: "colored" });
        handleClose();
        fetchAllUserData();
      } catch (err) {
        console.error("Error:", err.response?.data || err.message);
        toast.error(
          `Error product updating: ${err.response?.data?.message || "Unknown error"}`,
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
        size: getUserToUpdate.size || "",
        details: getUserToUpdate.details || "",
        origin: getUserToUpdate.origin || "",
        reviews: getUserToUpdate.reviews || "",
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

  const [filteredData, setFilteredData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchAllUserData();
  }, []);

  const fetchAllUserData = async () => {
    try {
      const response = await axios.get(`https://qwikit1.pythonanywhere.com/product/`);
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
        <Box sx={style}>
          <form
            onSubmit={formik.handleSubmit}
            className="max-w-xxl mx-auto bg-white p-6 rounded-lg shadow-md"
          >
            <div className="grid grid-cols-3 gap-4">
              {/* Category Field */}
              <FormControl
                fullWidth
                margin="normal"
                error={
                  formik.touched.category && Boolean(formik.errors.category)
                }
              >
                <InputLabel id="category-label">Category</InputLabel>
                <Select
                  labelId="category-label"
                  id="category"
                  name="category"
                  value={formik.values.category}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  label="Category"
                >
                  <MenuItem value="car">Car</MenuItem>
                  <MenuItem value="bike">Bike</MenuItem>
                  <MenuItem value="bicycle">Bicycle</MenuItem>
                  <MenuItem value="bag">Bag</MenuItem>
                  <MenuItem value="food">Food</MenuItem>
                </Select>
                {formik.touched.category && formik.errors.category && (
                  <p className="text-red-500 text-sm">
                    {formik.errors.category}
                  </p>
                )}
              </FormControl>
              <TextField
                label="Product Brand"
                id="productbrand"
                name="productbrand"
                variant="outlined"
                value={formik.values.productbrand}
                onChange={formik.handleChange}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Product Name"
                id="productname"
                name="productname"
                variant="outlined"
                value={formik.values.productname}
                onChange={formik.handleChange}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Quantity"
                id="quantity"
                name="quantity"
                variant="outlined"
                value={formik.values.quantity}
                onChange={formik.handleChange}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Discount"
                id="discount"
                name="discount"
                variant="outlined"
                value={formik.values.discount}
                onChange={formik.handleChange}
                fullWidth
                margin="normal"
              />
              <TextField
                id="image1"
                name="image1"
                type="file"
                variant="outlined"
                onChange={(event) => {
                  formik.setFieldValue("image1", event.currentTarget.files[0]);
                }}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Size"
                id="size"
                name="size"
                variant="outlined"
                value={formik.values.size}
                onChange={formik.handleChange}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Origin"
                id="origin"
                name="origin"
                variant="outlined"
                value={formik.values.origin}
                onChange={formik.handleChange}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Reviews"
                id="reviews"
                name="reviews"
                variant="outlined"
                value={formik.values.reviews}
                onChange={formik.handleChange}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Details"
                id="details"
                name="details"
                variant="outlined"
                multiline
                rows={4}
                value={formik.values.details}
                onChange={formik.handleChange}
                fullWidth
                margin="normal"
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
      {/* <TableContainer
        component={Paper}
        sx={{
          overflowX: "auto",
          maxHeight: "90vh",
        }}
      >
        <Table
          sx={{
            minWidth: 850,
            "@media (max-width: 768px)": {
              minWidth: "100%",
            },
          }}
          size="small"
          aria-label="a dense table"
        >
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Image</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Product Brand</TableCell>
              <TableCell>Product Name</TableCell>
              <TableCell>Size</TableCell>
              <TableCell>Origin</TableCell>
              <TableCell>Details</TableCell>
              <TableCell>Discount</TableCell>
              <TableCell>Quantity</TableCell>
              <TableCell>Reviews</TableCell>
              <TableCell>Update</TableCell>
              <TableCell>Delete</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {getData.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.id}</TableCell>
                <TableCell>
                    <img
                      src={item.image1 || avater}
                      alt="Avatar"
                      style={{
                        width: "60px",
                        height: "60px",
                        // borderRadius: "50%", // Makes the image completely circular
                        objectFit: "cover",
                      }}
                    />
                  </TableCell>
                <TableCell>{item.category || "N/A"}</TableCell>
                <TableCell>{item.productbrand || "N/A"}</TableCell>
                <TableCell>{item.productname || "N/A"}</TableCell>
                <TableCell>{item.size || "N/A"}</TableCell>
                <TableCell>{item.origin || "N/A"}</TableCell>
                <TableCell>{item.details || "N/A"}</TableCell>
                <TableCell>{item.discount || "N/A"} (Taka)</TableCell>
                <TableCell>{item.quantity || "N/A"}</TableCell>
                <TableCell>{item.reviews || "N/A"}</TableCell>
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
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer> */}
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
          '@media (max-width: 768px)': {
            minWidth: '100%',
          },
        }}
        size="small"
        aria-label="a dense table"
      >
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Image</TableCell>
            <TableCell>Category</TableCell>
            <TableCell>Product</TableCell>
            <TableCell>Product Name</TableCell>
            <TableCell>Size</TableCell>
            <TableCell>Origin</TableCell>
            <TableCell>Details</TableCell>
            <TableCell>Discount</TableCell>
            <TableCell>Quantity</TableCell>
            <TableCell>Reviews</TableCell>
            <TableCell>Update</TableCell>
            <TableCell>Delete</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {getData.map((item) => (
            <TableRow key={item.id}>
              <TableCell>{item.id}</TableCell>
              <TableCell>
                <img
                  src={item.image1 || avater}
                  alt="Avatar"
                  style={{
                    width: '60px',
                    height: '60px',
                    objectFit: 'cover',
                  }}
                />
              </TableCell>
              <TableCell>{item.category || 'N/A'}</TableCell>
              <TableCell>{item.productbrand || 'N/A'}</TableCell>
              <TableCell>{item.productname || 'N/A'}</TableCell>
              <TableCell>{item.size || 'N/A'}</TableCell>
              <TableCell>{item.origin || 'N/A'}</TableCell>
              <TableCell>{item.details || 'N/A'}</TableCell>
              <TableCell>{item.discount || 'N/A'} (Taka)</TableCell>
              <TableCell>{item.quantity || 'N/A'}</TableCell>
              <TableCell>{item.reviews || 'N/A'}</TableCell>
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
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
       */}
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
            minWidth: "100%", // Full width on small screens
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
              minWidth: "100%", // Full width for small screens
            },
          }}
          size="small"
          aria-label="a dense table"
        >
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Image</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Product</TableCell>
              <TableCell>Product Name</TableCell>
              <TableCell>Size</TableCell>
              <TableCell>Origin</TableCell>
              <TableCell>Details</TableCell>
              <TableCell>Discount</TableCell>
              <TableCell>Quantity</TableCell>
              <TableCell>Reviews</TableCell>
              <TableCell>Update</TableCell>
              <TableCell>Delete</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredData.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.id}</TableCell>
                <TableCell>
                  <img
                    src={item.image1 || avater}
                    alt="Avatar"
                    style={{
                      width: "60px",
                      height: "60px",
                      borderRadius: "50%", // Circular image
                      objectFit: "cover",
                    }}
                  />
                </TableCell>
                <TableCell>{item.category || "N/A"}</TableCell>
                <TableCell>{item.productbrand || "N/A"}</TableCell>
                <TableCell>{item.productname || "N/A"}</TableCell>
                <TableCell>{item.size || "N/A"}</TableCell>
                <TableCell>{item.origin || "N/A"}</TableCell>
                <TableCell>{item.details || "N/A"}</TableCell>
                <TableCell>{item.discount || "N/A"} (Taka)</TableCell>
                <TableCell>{item.quantity || "N/A"}</TableCell>
                <TableCell>{item.reviews || "N/A"}</TableCell>
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

export default ProductsShowPage;
