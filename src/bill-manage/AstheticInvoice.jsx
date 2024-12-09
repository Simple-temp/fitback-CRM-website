import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { useEffect, useState } from "react";
import axios from "axios";
import "./Invoice.css";
import {
  Alert,
  Modal,
  TextField,
  Button,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import * as Yup from "yup";
import { useFormik } from "formik";
import { toast, ToastContainer } from "react-toastify";

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

const AstheticInvoice = () => {
  const [customerData, setCustomerData] = useState([]);
  const [getOrderDataByCUstermerID, setgetOrderDataByCUstermerID] = useState(
    {}
  );
  const [customerID, setCustomerID] = useState("");
  //===================
  const [openModal, setOpenModal] = useState(false);
  //===================
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("");
  //===================
  const [phoneNumber, setPhoneNumber] = useState("");
  const [filterData, setFilterData] = useState([]);
  const [getFilteredNumber, setGetFilterredNumber] = useState({});
  //===================
  const [getNewUser, SetGetNewUser] = useState([]);
  const [newUserByNumber, setNewUserByNumber] = useState({});
  //===================
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
      SetGetNewUser(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  // Function to generate PDF
  const handleDownloadPDF = () => {
    const paymentMethods = document.querySelector(".payment-methods");
    const originalContent = paymentMethods.innerHTML;

    // Temporarily replace the payment methods with the selected one
    paymentMethods.innerHTML = `<label>${selectedPaymentMethod}</label>`;

    const element = document.querySelector(".main-container");
    html2canvas(element, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save("invoice.pdf");

      // Restore original content
      paymentMethods.innerHTML = originalContent;
    });
  };

  useEffect(() => {
    fetchAllOder();
  }, []);

  const fetchAllOder = async () => {
    const response = await axios.get(
      `https://qwikit1.pythonanywhere.com/orderFitbackProduct`
    );
    setFilterData(response.data);
    setCustomerData(response.data);
  };

  // Handle blur event to fetch customer data

  const handleChange = (e) => {
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
        console.log(customerData);
        const GetOrderByCustomerID = customerData.find(
          (order) => order.userid === customerID
        );
        setgetOrderDataByCUstermerID(GetOrderByCustomerID);
        console.log(customerID, GetOrderByCustomerID);
        fetchAllOder();
        if (!GetOrderByCustomerID) {
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

  // get the products===========

  const [selectedProducts, setSelectedProducts] = useState([]); // To store selected products for each row
  const [getAllProduct, setGetAllProduct] = useState([]);

  const handleProductChange = (index, selectedProductId) => {
    const updatedSelectedProducts = [...selectedProducts];
    updatedSelectedProducts[index] = selectedProductId; // Set selected product for that row
    setSelectedProducts(updatedSelectedProducts);
    console.log(selectedProductId);
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // Replace with your actual API endpoint
        const response = await fetch(
          `https://qwikit1.pythonanywhere.com/product`
        );
        const data = await response.json();
        setGetAllProduct(data); // Set products to state
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="main-container invoice-img">
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

      <div className="invoice-container">
        <div className="invoice-body">
          <h2 className="invoice-title">Invoice</h2>

          <div className="invoice-header">
            <div className="header-col1">
              <div className="header-group1">
                <label>Bill To:</label>
                <input
                  type="text"
                  placeholder=""
                  value={
                    customerData?.username ||
                    getFilteredNumber?.username ||
                    newUserByNumber?.name ||
                    getOrderDataByCUstermerID?.username ||
                    ""
                  }
                  className="custom-border"
                />
              </div>
              <div className="header-group1">
                <label>Phone:</label>
                <input
                  type="text"
                  placeholder=""
                  value={
                    phoneNumber ||
                    customerData?.phonenumber ||
                    getOrderDataByCUstermerID?.phonenumber ||
                    ""
                  }
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className="custom-border"
                />
                {errorMessage && (
                  <p className="error-message">{errorMessage}</p>
                )}
              </div>
            </div>
            <div className="header-col2">
              <div className="header-group2">
                <label>Date:</label>
                <input
                  className="custom-border"
                  type="text"
                  placeholder=""
                  value={
                    customerData?.orderdate ||
                    getFilteredNumber?.orderdate ||
                    getOrderDataByCUstermerID?.orderdate ||
                    ""
                  }
                />
              </div>
              <div className="header-group2">
                <label>Invoice No:</label>
                <input
                  className="custom-border"
                  type="text"
                  placeholder=""
                  value={
                    customerData.userid ||
                    getFilteredNumber?.userid ||
                    newUserByNumber?.userid ||
                    getOrderDataByCUstermerID?.userid ||
                    ""
                  }
                />
              </div>
              <div className="header-group2">
                <label>Customer ID:</label>
                <input
                  className="custom-border"
                  type="text"
                  placeholder=""
                  value={
                    customerID || getFilteredNumber
                      ? getFilteredNumber.id
                      : "N/A"
                  }
                  onChange={(e) => setCustomerID(e.target.value)}
                  onBlur={handleBlur}
                />
              </div>
              <div className="header-group2">
                <label>Advisor:</label>
                <select name="options" id="options" className="custom-select">
                  <option value="">--Select---</option>
                  <option value="Advisor1">Advisor 1</option>
                  <option value="Advisor2">Advisor 2</option>
                  <option value="Advisor3">Advisor 3</option>
                  <option value="Advisor4">Advisor 4</option>
                </select>
              </div>
            </div>
          </div>

          <table className="invoice-table">
            <thead>
              <tr>
                <th>Sl. No.</th>
                <th>Description</th>
                <th>Qty.</th>
                <th>Rate</th>
                <th>Value in BDT</th>
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: 5 }).map((_, index) => (
                <tr key={index}>
                  <td>
                    <input type="number" placeholder={index + 1} readOnly />
                  </td>
                  <td>
                  {
                    customerData?.address || getFilteredNumber?.address || getOrderDataByCUstermerID?.address ?
                    <input type="text" placeholder="0"  
                    value={customerData?.address || getFilteredNumber?.address || getOrderDataByCUstermerID?.address}
                     className="custom-border"
                    /> :
                    <select
                      value={selectedProducts[index] || ""}
                      onChange={(e) =>
                        handleProductChange(index, e.target.value)
                      }
                    >
                      <option value="" disabled>
                        Select a Product
                      </option>
                      {getAllProduct.map((product) => (
                        <option key={product.id} value={product.id}>
                          {product.productname}
                        </option>
                      ))}
                    </select>
                  }
                  </td>
                  <td>
                  <input
                      type="number"
                      placeholder="0"
                      value={
                        customerData.totalquantity ||
                        getFilteredNumber?.totalquantity ||
                        getOrderDataByCUstermerID?.totalquantity ||
                        ""
                      }
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      placeholder="0.00"
                      readOnly
                    />
                  </td>
                  <td>
                  <input
                      type="number"
                      placeholder="0.00"
                      value={
                        customerData.totalproductamount ||
                        getFilteredNumber?.totalproductamount ||
                        getOrderDataByCUstermerID?.totalproductamount ||
                        ""
                      }
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="amount-info">
            <div className="payment-section">
              <div className="innter-payment">
                <label>Payment Received By:</label>
                <div className="payment-methods">
                  <label>
                    <input
                      type="radio"
                      name="payment"
                      value="Cash"
                      onChange={handlePaymentMethodChange}
                    />{" "}
                    Cash
                  </label>
                  <label>
                    <input
                      type="radio"
                      name="payment"
                      value="Card"
                      onChange={handlePaymentMethodChange}
                    />{" "}
                    Card
                  </label>
                  <label>
                    <input
                      type="radio"
                      name="payment"
                      value="Bkash"
                      onChange={handlePaymentMethodChange}
                    />{" "}
                    Bkash
                  </label>
                </div>
              </div>
              <label>In Words:</label> <br />
              <textarea
                placeholder="Enter amount in words"
                 className="text custom-border"
              ></textarea>
              <div className="disclaimer">
                <p>
                  *** We don’t take responsibility unless all guidelines are
                  followed properly.
                </p>
                <p>*** All payments are non-refundable.</p>
              </div>
            </div>
            <div className="amount-section">
              <div className="amount-row">
                <div className="left">
                  <label>Subtotal:</label>
                  <label>Discount:</label>
                  <label>TotalAmount:</label>
                  <label>PaidAmount: </label>
                  <label>DueAmount: </label>
                </div>
                <div className="right">
                  <input
                    type="number"
                    placeholder="0.00"
                    className="amount-details"
                    value={
                      customerData.vat ||
                      getOrderDataByCUstermerID?.vat ||
                      getFilteredNumber?.vat ||
                      ""
                    }
                  />{" "}
                  <br />
                  <input
                    type="number"
                    placeholder="0.00"
                    className="amount-details"
                    value={
                      customerData.deliverycharge ||
                      getFilteredNumber?.deliverycharge ||
                      getOrderDataByCUstermerID?.deliverycharge ||
                      ""
                    }
                  />{" "}
                  <br />
                  <input
                    type="number"
                    placeholder="0.00"
                    className="amount-details"
                    value={
                      customerData.totalprice ||
                      getFilteredNumber?.totalprice ||
                      getOrderDataByCUstermerID?.totalprice ||
                      ""
                    }
                  />{" "}
                  <br />
                  <input
                    type="number"
                    placeholder="0.00"
                    className="amount-details"
                    value={
                      customerData.totalMRP ||
                      getFilteredNumber?.totalMRP ||
                      getOrderDataByCUstermerID?.totalMRP ||
                      ""
                    }
                  />{" "}
                  <br />
                  <input
                    type="number"
                    placeholder="0.00"
                    className="amount-details"
                    value={
                      customerData.suppertotalamount ||
                      getFilteredNumber?.suppertotalamount ||
                      getOrderDataByCUstermerID?.suppertotalamount ||
                      ""
                    }
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="footer-section">
            <div className="signature-section">
              <div>
                <label>Prepared By:</label>
                <input type="text" placeholder="" />
              </div>
              <div>
                <label>Customer Sign:</label>
                <input type="text" placeholder="" />
              </div>
              <div>
                <label>Authorized Sign:</label>
                <input type="text" placeholder="" />
              </div>
            </div>
          </div>

          <div className="note-section">
            <label>Note:</label> <br />
            <textarea
              className="custom-border"
              placeholder="Add any notes"
              value={
                customerData.orderstatus ||
                getFilteredNumber?.orderstatus ||
                getOrderDataByCUstermerID?.orderstatus ||
                ""
              }
            ></textarea>
          </div>
        </div>
      </div>
      <button className="download-btn" onClick={handleDownloadPDF}>
        Download PDF
      </button>
    </div>
  );
};

export default AstheticInvoice;




