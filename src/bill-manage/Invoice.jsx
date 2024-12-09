import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { useEffect, useState } from "react";
import axios from "axios";
import "./Invoice.css";
import { ToastContainer } from "react-toastify";
import BillModal from "./bill-Components/BillModal";
import LibraryAddIcon from '@mui/icons-material/LibraryAdd';
import DoDisturbIcon from '@mui/icons-material/DoDisturb';

const Invoice = () => {
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

  const handlePaymentMethodChange = (e) => {
    setSelectedPaymentMethod(e.target.value);
  };

  // get the products===========

  const [getAllProduct, setGetAllProduct] = useState([]);
  const [selectedPackages, setSelectedPackages] = useState("");

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

  const [rows, setRows] = useState([{ id: 1 }]);
  const handleAddRow = () => {
    setRows((prevRows) => [...prevRows, { id: prevRows.length + 1 }]);
  };
  const handleRemoveRow = () => {
    if (rows.length > 1) {
      setRows((prevRows) => prevRows.slice(0, -1));
    }
  };
  //================================================
  const [selectBranch, setSelectBranch] = useState("");
  const [getDhanmondiPackage, setgetDhanmondiPackage] = useState([]);
  const [getUttaraPackage, setgetUttaraPackage] = useState([]);

  useEffect(() => {
    fetchDhanmondi();
    fetchUttara();
  }, []);

  const fetchDhanmondi = async () => {
    try {
      const response = await axios.get(
        `https://qwikit1.pythonanywhere.com/resetPackageDhanmondi/`
      );
      setgetDhanmondiPackage(response.data);
      console.log(response.data)
    } catch (err) {
      console.error(err);
    }
  };
  const fetchUttara = async () => {
    try {
      const response = await axios.get(
        `https://qwikit1.pythonanywhere.com/ResetPackageUttara/`
      );
      setgetUttaraPackage(response.data);
      console.log(response.data)
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="main-container invoice-img">
      <ToastContainer
        position="bottom-center"
        autoClose={2000}
        theme="colored"
      />
      <BillModal
        openModal={openModal}
        setOpenModal={setOpenModal}
        phoneNumber={phoneNumber}
        showAlert={showAlert}
        setShowAlert={setShowAlert}
      />
      <div className="select-branch">
        <select onChange={(e) => setSelectBranch(e.target.value)}>
           <option value="">--Select Branch--</option>
          <option value="Dhanmondi">Dhanmondi</option>
          <option value="Uttara">Uttara</option>
        </select>
      </div>
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
              {rows.map((row, index) => (
                <tr key={row.id}>
                  <td>
                    <input type="number" value={index + 1} readOnly />
                  </td>
                  <td>
                    {customerData?.address ||
                    getFilteredNumber?.address ||
                    getOrderDataByCUstermerID?.address ? (
                      <input
                        type="text"
                        placeholder="0"
                        value={
                          customerData?.address ||
                          getFilteredNumber?.address ||
                          getOrderDataByCUstermerID?.address
                        }
                        className="custom-border"
                      />
                    ) : (
                      <select
                        onChange={(e) => setSelectedPackages(e.target.value)}
                      >
                        <option value="">Select a Product</option>
                        {selectBranch 
                          && selectBranch === "Dhanmondi" 
                          && getDhanmondiPackage.map((product) => (
                              <option key={product.id} value={product.id}>
                                {product.itemname}
                              </option>
                            )) 
                        }
                        {
                          selectBranch 
                            && selectBranch === "Uttara" 
                            && getUttaraPackage.map((product) => (
                            <option key={product.id} value={product.id}>
                                {product.itemname}
                            </option>
                          ))
                        }
                      </select>
                    )}
                  </td>
                  <td>
                    <input
                      type="number"
                      placeholder="0"
                      value={
                        customerData?.totalquantity ||
                        getFilteredNumber?.totalquantity ||
                        getOrderDataByCUstermerID?.totalquantity ||
                        ""
                      }
                    />
                  </td>
                  <td>
                    <input type="number" placeholder="0.00" readOnly />
                  </td>
                  <td>
                    <input
                      type="number"
                      placeholder="0.00"
                      value={
                        customerData?.totalproductamount ||
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
          <div style={{ marginTop: "10px" }}>
            <LibraryAddIcon onClick={handleAddRow} style={{ marginRight: "10px" }}/>
            <DoDisturbIcon onClick={handleRemoveRow} disabled={rows.length <= 1}/>
          </div>

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

export default Invoice;
