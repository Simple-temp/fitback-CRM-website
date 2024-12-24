import axios from "axios";
import { useEffect, useState } from "react";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import avater from "../../public/img/avater.png";
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
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

const style = {
  maxWidth: "900px",
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

const UttaraServices = () => {
  const [getDhanmondiPackage, setgetDhanmondiPackage] = useState([]);

  useEffect(() => {
    fetchDhanmondipackage();
  }, []);

  const fetchDhanmondipackage = async () => {
    try {
      const response = await axios.get(
        `https://qwikit1.pythonanywhere.com/ResetPackageUttara`
      );
      setgetDhanmondiPackage(response.data);
    } catch (err) {
      console.log(err);
    }
  };

  // get updating user ID
  const [getUserToUpdate, setGetUserToUpdate] = useState(null);

  // modal code
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    formik.resetForm();
  };

  // Formik validation schema
  const validationSchema = Yup.object().shape({
    category: Yup.string().required("Category is required"),
  });

  const formik = useFormik({
    initialValues: {
        category: "",
        itemname: "",
        duration: "",
        quantity:  "",
        details: "",
        discount: "",
        mrp: "",
        reviews: "",
        vat: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        const formData = new FormData();
        formData.append("category", values.category);
        formData.append("itemname", values.itemname);
        formData.append("duration", values.duration);
        formData.append("quantity", values.quantity);
        formData.append("details", values.details);
        formData.append("discount", values.discount);
        formData.append("mrp", values.mrp);
        formData.append("vat", values.vat);
        formData.append("reviews",JSON.stringify(values.reviews));
        // Check if a new file is selected
        if (values.image2 && values.image2 instanceof File) {
          formData.append("image2", values.image2);
        }

        const response = await axios.put(
          `https://qwikit1.pythonanywhere.com/ResetPackageUttara/${getUserToUpdate.id}`,
          formData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
        console.log("Server response:", response.data);
        toast.success("Service Updated successfully", { theme: "colored" });
        handleClose();
        fetchDhanmondipackage();
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
        `https://qwikit1.pythonanywhere.com/ResetPackageUttara/${id}`
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
        itemname: getUserToUpdate.itemname || "",
        duration: getUserToUpdate.duration || "",
        quantity: getUserToUpdate.quantity || "",
        details: getUserToUpdate.details || "",
        discount: getUserToUpdate.discount || "",
        mrp: getUserToUpdate.mrp || "",
        reviews: getUserToUpdate.reviews || "",
        vat: getUserToUpdate.vat || "",
      });
    }
  }, [getUserToUpdate]);

  const controlHandleClick = (id) => {
    updatingUserId(id);
    handleOpen();
    console.log(id);
  };

  const deleteUser = (id) => {
    console.log(id);
  };

  return (
    <div>
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
                label="itemname"
                id="itemname"
                name="itemname"
                variant="outlined"
                value={formik.values.itemname}
                onChange={formik.handleChange}
                fullWidth
                margin="normal"
              />
              <TextField
                label="duration"
                id="duration"
                name="duration"
                variant="outlined"
                value={formik.values.duration}
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
                label="details"
                id="details"
                name="details"
                variant="outlined"
                value={formik.values.details}
                onChange={formik.handleChange}
                fullWidth
                margin="normal"
              />
              <TextField
                id="image2"
                name="image2"
                type="file"
                variant="outlined"
                onChange={(event) => {
                  formik.setFieldValue("image2", event.currentTarget.files[0]);
                }}
                fullWidth
                margin="normal"
              />
              <TextField
                label="discount"
                id="discount"
                name="discount"
                variant="outlined"
                value={formik.values.discount}
                onChange={formik.handleChange}
                fullWidth
                margin="normal"
              />
              <TextField
                label="mrp"
                id="mrp"
                name="mrp"
                variant="outlined"
                value={formik.values.mrp}
                onChange={formik.handleChange}
                fullWidth
                margin="normal"
              />
              <TextField
                label="reviews"
                id="reviews"
                name="reviews"
                variant="outlined"
                value={formik.values.reviews}
                onChange={formik.handleChange}
                fullWidth
                margin="normal"
              />
              <TextField
                label="vat"
                id="vat"
                name="vat"
                variant="outlined"
                multiline
                rows={4}
                value={formik.values.vat}
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
              <TableCell>itemname</TableCell>
              <TableCell>duration</TableCell>
              <TableCell>quantity</TableCell>
              <TableCell>details</TableCell>
              <TableCell>discount</TableCell>
              <TableCell>mrp</TableCell>
              <TableCell>reviews</TableCell>
              <TableCell>vat</TableCell>
              <TableCell>Update</TableCell>
              <TableCell>Delete</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {getDhanmondiPackage.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.id}</TableCell>
                <TableCell>
                  <img
                    src={item.image2 || avater}
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
                <TableCell>{item.itemname || "N/A"}</TableCell>
                <TableCell>{item.duration || "N/A"}</TableCell>
                <TableCell>{item.quantity || "N/A"}</TableCell>
                <TableCell>{item.details || "N/A"}</TableCell>
                <TableCell>{item.discount || "N/A"}</TableCell>
                <TableCell>{item.mrp || "N/A"} (Taka)</TableCell>
                <TableCell>{item.reviews || "N/A"}</TableCell>
                <TableCell>{item.vat || "N/A"}</TableCell>
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

export default UttaraServices;

