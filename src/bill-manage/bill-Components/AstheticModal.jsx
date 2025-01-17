import { Alert, Box, Button, FormControl, InputLabel, MenuItem, Modal, Select, TextField } from "@mui/material";
import * as Yup from "yup";
import { useFormik } from "formik";
import { toast } from "react-toastify";
import axios from "axios";
import PropTypes from "prop-types";

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

const AstheticModal = ({openModal,setOpenModal,phoneNumber,showAlert,setShowAlert}) => {

    const handleOpenModal = () => setOpenModal(true);
    const handleCloseModal = () => setOpenModal(false);

    const validationSchema = Yup.object().shape({
        phonenumber: Yup.string()
          .matches(
            /^01[1,2,3,4,5,6,7,8,9]\d{8}$/,
            "Invalid Bangladeshi phone number."
          )
          .required("Phone number is required")
          .max(11, "Phone number must be 11 digits"),
        password: Yup.string()
          .min(4, "Password must be at least 4 characters")
          .required("Password is required"),
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
          fmoney: "",
          fcoins: "",
          age: "",
          image: "",
          bloodpressure: "",
          height: "",
          weight: "",
          usertype:""
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
            formData.append("image", values.image);
            formData.append("usertype", values.usertype || "Aesthetic");
            formData.append(
              "height",
              JSON.stringify([
                { value: values.height, timestamp: new Date().toISOString() },
              ])
            );
            formData.append(
              "weight",
              JSON.stringify([
                { value: values.weight, timestamp: new Date().toISOString() },
              ])
            );
            formData.append(
              "bloodpressure",
              JSON.stringify([{ value: values.bloodpressure }])
            );
    
            const response = await axios.post(
              `https://qwikit1.pythonanywhere.com/userProfile/new`,
              formData
            );
            console.log(response.data);
            toast.success("User Created successfully", { theme: "colored" });
            handleCloseModal();
          } catch (err) {
            console.error(err);
          }
        },
      });

  return (
    <div>
      
      {showAlert && (
        <Alert
          severity="warning"
          onClose={() => setShowAlert(false)}
          action={
            <>
              <Button color="inherit" size="small" onClick={handleOpenModal}>
                Create New User
              </Button>
              <Button
                color="inherit"
                size="small"
                onClick={() => setShowAlert(false)}
              >
                Close
              </Button>
            </>
          }
        >
          No customer data found. Would you like to create a new user?
        </Alert>
      )}

      <Modal open={openModal} onClose={handleCloseModal}>
        <Box sx={style}>
          <h2>Create New User</h2>
          <form
            onSubmit={formik.handleSubmit}
            className="max-w-xxl mx-auto bg-white p-6 rounded-lg shadow-md"
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
                value={formik.values.phonenumber || phoneNumber}
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
                  value={formik.values.gender}
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
                id="bloodpressure"
                label="Blood Pressure"
                name="bloodpressure"
                variant="outlined"
                value={formik.values.bloodpressure}
                onChange={formik.handleChange}
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
                type="submit"
                variant="contained"
                color="success"
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg"
              >
                Create
              </Button>
            </div>
          </form>
        </Box>
      </Modal>

    </div>
  )
}

AstheticModal.propTypes = {
    openModal: PropTypes.bool.isRequired,
    setOpenModal: PropTypes.func.isRequired,
    phoneNumber: PropTypes.string.isRequired,
    showAlert: PropTypes.bool.isRequired,
    setShowAlert: PropTypes.func.isRequired,
};
  

export default AstheticModal;





