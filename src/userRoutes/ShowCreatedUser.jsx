import axios from "axios";
import { useEffect, useState } from "react";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Button from "@mui/material/Button";
import * as Yup from "yup";
import { useFormik } from "formik";
import Box from "@mui/material/Box";
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';
import { ToastContainer, toast } from 'react-toastify';
import PropTypes from 'prop-types';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

const ShowCreatedUser = ({getData,fetchAllUserData}) => {

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
            .matches(/^01[1,3,4,5,6,7,8,9]\d{8}$/, "Invalid Bangladeshi phone number.")
            .required("Phone number is required")
            .max(11, "Phone number must be 11 digits"),
        password: Yup.string()
            .min(4, "Password must be at least 4 characters")
            .required("Password is required"),
    });

    const formik = useFormik({
        initialValues: {
          name: "",
          phonenumber: "",
          password: "",
          email: "",
          address: "",
          height: "",
          weight: "",
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
                height: values.height ? [{ value: values.height, timestamp:  new Date().toISOString() }] : [], 
                weight: values.weight ? [{ value: values.weight, timestamp:  new Date().toISOString() }] : [], 
            };
            const response = await axios.put(`https://qwikit1.pythonanywhere.com/userProfile/${getUserToUpdate.id}`, updatedUserData);
            console.log("User updated successfully:", response.data);
            toast.success('User updated successfully', {theme: "colored",});
            fetchAllUserData()
            handleClose();
          } catch (error) {
            console.error(error);
          }
        },
    });

    // get updating user ID
    const updatingUserId = async (id) => {
        try {
            const response = await axios.get(`https://qwikit1.pythonanywhere.com/userProfile/${id}`);
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
        try{
            try {
                const response = await axios.delete(`https://qwikit1.pythonanywhere.com/userProfile/${id}`);
                console.log(response.data);
                toast.success('User Deleted successfully', {theme: "colored"});
                fetchAllUserData()
                handleClose();
            } catch (err) {
                console.log(err);
            }
        }catch(err){
            toast.error(err, {theme: "colored",});
        }
    };

    return (
        <div>
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
                            error={formik.touched.phonenumber && Boolean(formik.errors.phonenumber)}
                            helperText={formik.touched.phonenumber && formik.errors.phonenumber}
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
                            id="height"
                            name="height"
                            variant="outlined"
                            value={formik.values.height}
                            onChange={formik.handleChange}
                            fullWidth
                            margin="normal"
                        />
                        <TextField
                            id="weight"
                            name="weight"
                            variant="outlined"
                            value={formik.values.weight}
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
                            <TableCell align="center">Number Length</TableCell>
                            <TableCell align="center">Height</TableCell>
                            <TableCell align="center">Weight</TableCell>
                            <TableCell align="center">Update</TableCell>
                            <TableCell align="center">Delete</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {getData.map((item) => (
                            <TableRow key={item.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                <TableCell>{item.id}</TableCell>
                                <TableCell>{item.name}</TableCell>
                                <TableCell>{item.phonenumber}</TableCell>
                                <TableCell>{item.phonenumber.length}</TableCell>
                                <TableCell component="th" scope="row">
                                    {Array.isArray(item.height) && item.height.length > 0 ? (
                                        <>
                                            <div>
                                                <p><strong>Height:</strong> {item.height[0].value}</p>
                                                <p><strong>Time:</strong> {new Date(item.height[0].timestamp).toLocaleString()}</p>
                                            </div>
                                        </>
                                    ) : (
                                        <p>No height data available</p>
                                    )}
                                </TableCell>
                                <TableCell component="th" scope="row">
                                    {Array.isArray(item.weight) && item.weight.length > 0 ? (
                                        <div>
                                            <p><strong>Weight:</strong> {item.weight[0].value}</p>
                                            <p><strong>Time:</strong> {new Date(item.weight[0].timestamp).toLocaleString()}</p>
                                        </div>
                                    ) : (
                                        <p>No weight data available</p>
                                    )}
                                </TableCell>
                                <TableCell align="center">
                                    <Button color="secondary" onClick={() => controlHandleClick (item.id)}>Update user</Button>
                                </TableCell>
                                <TableCell align="center">
                                    <Button variant="outlined" color="error" onClick={() => deleteUser(item.id)}>Delete</Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
};

ShowCreatedUser.propTypes = {
    getData: PropTypes.array.isRequired, 
    fetchAllUserData: PropTypes.func.isRequired,
};

export default ShowCreatedUser;
