import { useEffect, useState } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import "./MoneyReceipt.css";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import * as Yup from "yup";
import { useFormik } from "formik";
import {
  Alert,
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Modal,
  Select,
  TextField,
} from "@mui/material";
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

function ResetMoneyRecipt() {
  const [customerData, setCustomerData] = useState({});
  const [customerID, setCustomerID] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("");
  const [filterData, setFilterData] = useState([]);
  const [getFilteredNumber, setGetFilterredNumber] = useState({});
  const [getNewUser, SetGetNewUser] = useState([]);
  const [newUserByNumber, setNewUserByNumber] = useState({});
  const [errorMessage, setErrorMessage] = useState("");
  const [showAlert, setShowAlert] = useState(false);

  // fetch the new user data
  useEffect(() => {
    fetchAllPublicUser();
  }, [getNewUser]);
  const fetchAllPublicUser = async () => {
    try {
      const response = await axios.get(
        `https://qwikit1.pythonanywhere.com/userProfile/`
      );
      console.log(response.data);
      SetGetNewUser(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  // get all order
  useEffect(() => {
    fetchAllOder();
  }, []);

  const fetchAllOder = async () => {
    const response = await axios.get(
      `https://qwikit1.pythonanywhere.com/orderFitbackProduct`
    );
    setFilterData(response.data);
  };

  // Handle blur event to fetch customer data

  const handleChangeInput = (e) => {
    const input = e.target.value;
    setPhoneNumber(input);

    // Remove error message if the input is valid
    if (/^01\d{9}$/.test(input)) {
      setErrorMessage("");
    } else if (input.length !== 11) {
      setErrorMessage(
        "Invalid phone number. It must start with '01' and contain 11 digits in total."
      );
    }
  };

  const handleBlur = async () => {
    try {
      setErrorMessage("");

      if (customerID) {
        const filterOrderByCustomerID = filterData.find((order)=> order.userid === customerID)
        const filterUserByCustomerID = getNewUser.find((order)=> order.id === parseInt(customerID))
        setCustomerData(filterOrderByCustomerID || filterUserByCustomerID);
        fetchAllOder();
        if (!filterOrderByCustomerID && !filterUserByCustomerID) {
          setShowAlert(true);
          return;
        }
      }
      if (phoneNumber) {
        const phoneRegex = /^01\d{9}$/;
        if (!phoneRegex.test(phoneNumber)) {
          setErrorMessage(
            "Invalid phone number. It must start with '01' and contain 11 digits in total."
          );
          return;
        }
        console.log(phoneNumber);
        const filteredProducts = filterData.find(
          (order) => order.phonenumber === phoneNumber
        );
        const filtereNewUserByNumber = getNewUser.find(
          (user) => user.phonenumber === phoneNumber
        );
        setGetFilterredNumber(filteredProducts); // Set the filtered data
        setNewUserByNumber(filtereNewUserByNumber); // Set the filtered data
        fetchAllPublicUser();
        if (!filteredProducts && !filtereNewUserByNumber) {
          setShowAlert(true);
          return;
        }
        console.log(JSON.stringify(filteredProducts));
      }
    } catch (err) {
      console.log("Error fetching customer data:", err);
    }
  };

  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => setOpenModal(false);

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
        formData.append("usertype", values.usertype || "Reset");
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

  const handlePaymentMethodChange = (e) => {
    setSelectedPaymentMethod(e.target.value);
  };

  const [formData, setFormData] = useState({
    receivedFrom: "",
    bank: "",
    cash: false,
    card: false,
    bkash: false,
  });

  const handleDownloadPDF = () => {
    const paymentMethods = document.querySelector(".payment-methods");
    const originalContent = paymentMethods.innerHTML;

    // Temporarily replace the payment methods with the selected one
    paymentMethods.innerHTML = `<label>Payment Method : ${selectedPaymentMethod}</label>`;

    const element = document.querySelector(".container");
    html2canvas(element, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save("Fitback-Money-Receipt.pdf");

      // Restore original content
      paymentMethods.innerHTML = originalContent;
    });
  };


  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  return (
    <div className="container">
      <ToastContainer
        position="bottom-center"
        autoClose={2000}
        theme="colored"
      />
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
      <div className="receipt-container">
        <h2 className="title">MONEY RECEIPT</h2>

        <div className="header-part">
          <div className="form-row-date">
            <label style={{ marginRight :"10px"}}>Date:</label>
            <input type="date" />
          </div>

          <div className="form-row-header">
            <label>Customer ID:</label>
            <input
              placeholder=""
              type="text"
              value={ newUserByNumber ? newUserByNumber.id : customerID || getFilteredNumber ? getFilteredNumber.id : "" }
              onChange={(e) => setCustomerID(e.target.value)}
              onBlur={handleBlur}
            />
          </div>
        </div>

        {/* =================body section==================== */}

        <div className="recipt-body">
          <div className="full-width-row">
            <div className="form-row-full">
              <label>Received with thanks from:</label>
              <input
                type="text"
                placeholder="Name"
                value={customerData?.username|| getFilteredNumber?.username || newUserByNumber?.name || ""}
                readOnly
                className="full border-for-input"
              />
            </div>

            <div className="form-row-full">
              <label>Amount of Taka:</label>
              <input
                type="number"
                placeholder="0.00"
                value={customerData.totalproductamount || getFilteredNumber?.totalproductamount || ""}
                readOnly
                className="full border-for-input"
              />
            </div>
          </div>

          <div className="form-row payment-methods">
            <label>Payment Method:</label>
            <label>
              <input
                type="checkbox"
                name="cash"
                value="Cash"
                onChange={handlePaymentMethodChange}
              />
              Cash
            </label>
            <label>
              <input
                type="checkbox"
                name="card"
                value="Card"
                onChange={handlePaymentMethodChange}
              />
              Card
            </label>
            <label>
              <input
                type="checkbox"
                name="bkash"
                value="Bkash"
                onChange={handlePaymentMethodChange}
              />
              Bkash
            </label>
            <label>
              <input
                  type="text"
                  placeholder="00"
                  value={customerData.userid || getFilteredNumber?.userid || newUserByNumber?.userid || ""}
                className="border-for-input"
              />
            </label>
          </div>
          <div className="form-row">
            <label className="another">For the purpose of:</label>
            <input
              type="text"
              placeholder="Username"
              value={  customerData?.username ||  getFilteredNumber?.username || newUserByNumber?.name || "" }
              readOnly
            />
          </div>

          <div className="form-row">
            <label className="another">Contact No:</label>
            <input
              type="text"
              placeholder="01XX"
              value={phoneNumber || customerData?.phonenumber || ""}
              onChange={handleChangeInput}
              onBlur={handleBlur}
              className="border-for-input"
            />
                            {errorMessage && (
                  <p className="error-message">{errorMessage}</p>
                )}
          </div>
        </div>

        <div className="footer-part">
          <div className="form-row1">
            <label>Payable Amount:</label> <br /> <br />
            <label>Paid Amount:</label> <br /> <br />
            <label>Balance Amount:</label> <br />
          </div>

          <div className="form-row2">
            <input
              type="text"
              value={customerData.totalMRP || getFilteredNumber?.totalMRP || ""}
              placeholder="0.00"
              className="border-for-input"
            />{" "}
            <br />
            <input
              type="text"
              value={customerData.totalprice || getFilteredNumber?.totalprice || ""}
              placeholder="0.00"
              className="border-for-input"
            />{" "}
            <br />
            <input
              type="text"
               placeholder="0.00"
              value={customerData.suppertotalamount || getFilteredNumber?.suppertotalamount || ""}
              className="border-for-input"
            />
          </div>
        </div>

        <div className="footer-row">
          <div className="form-row-footer">
            <label>Received By:</label>
            <input
              type="text"
              name="receivedBy"
              value={formData.receivedBy}
              onChange={handleChange}
            />
          </div>

          <div className="form-row-footer2">
            <label> Authorized Signatured </label>
            <input
              type="text"
              name=" Authorized Signatured"
              value={formData.receivedBy}
              onChange={handleChange}
            />
          </div>
        </div>
      </div>
      
      <button className="download-btn" onClick={handleDownloadPDF}>
          Download Receipt
        </button>
    </div>
  );
}

export default ResetMoneyRecipt;









