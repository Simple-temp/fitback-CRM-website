import {
  Box,
  Button,
  Modal,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  TextField,

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

const SignUpBonus = () => {
  const [getBonus, SetGetBonus] = useState([]);

  useEffect(() => {
    fetchBonus();
  }, []);

  const fetchBonus = async () => {
    try {
      const response = await axios.get(
        `https://qwikit1.pythonanywhere.com/rewardsSystemManagement`
      );
      SetGetBonus(response.data);
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
    signupReward: Yup.string().required("Category is required"),
  });

  const formik = useFormik({
    initialValues: {
      signupReward: "",
      quizReward: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        const formData = new FormData();
        formData.append("signupReward", values.signupReward);
        formData.append("quizReward", values.quizReward);

        const response = await axios.put(
          `https://qwikit1.pythonanywhere.com/rewardsSystemManagement/${getUserToUpdate.id}`,
          formData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
        console.log("Server response:", response.data);
        toast.success("Reword Updated successfully", { theme: "colored" });
        handleClose();
        fetchBonus();
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
        `https://qwikit1.pythonanywhere.com/rewardsSystemManagement/${id}`
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
        signupReward: getUserToUpdate.signupReward || "",
        quizReward: getUserToUpdate.quizReward || "",
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
              <TextField
                label="signupReward"
                id="signupReward"
                name="signupReward"
                variant="outlined"
                value={formik.values.signupReward}
                onChange={formik.handleChange}
                fullWidth
                margin="normal"
              />
              <TextField
                label="quizReward"
                id="quizReward"
                name="quizReward"
                variant="outlined"
                value={formik.values.quizReward}
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
              <TableCell>signupReward</TableCell>
              <TableCell>quizReward</TableCell>
              <TableCell align="center">Update</TableCell>
              <TableCell align="center">Delete</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {getBonus.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.id}</TableCell>
                <TableCell>{item.signupReward || "N/A"}</TableCell>
                <TableCell>{item.quizReward || "N/A"}</TableCell>
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

export default SignUpBonus;
