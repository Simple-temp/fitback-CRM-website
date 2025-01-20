import { useEffect, useState } from "react";
import axios from "axios";
import "./Invoice.css";
import { toast, ToastContainer } from "react-toastify";
import BillModal from "./bill-Components/BillModal";
import LibraryAddIcon from "@mui/icons-material/LibraryAdd";
import DoDisturbIcon from "@mui/icons-material/DoDisturb";

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
  const [note, setNote] = useState("");
  const [words, setwords ] = useState("")
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
  //===================
  const [selectAdvisor, SetSelectAdvisor] = useState("");

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

  const [getOldUserByid, SetGetOldUserByid] = useState({});
  const [getOldUserByNumber, SetGetOldUserByNumber] = useState({});

  const handleBlur = async () => {
    try {
      setErrorMessage("");

      if (customerID) {
        console.log(customerData);
        const GetOrderByCustomerID = customerData.find(
          (order) => order.userid === customerID
        );
        const filtereOldUserByID = getNewUser.find(
          (user) => user.id === parseInt(customerID)
        );
        SetGetOldUserByid(filtereOldUserByID);

        setgetOrderDataByCUstermerID(GetOrderByCustomerID);
        console.log(customerID, GetOrderByCustomerID);
        fetchAllOder();
        if (!GetOrderByCustomerID && !filtereOldUserByID) {
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

        const filterOldUserByNumber = getNewUser.find(
          (user) => user.phonenumber === phoneNumber
        );
        SetGetOldUserByNumber(filterOldUserByNumber);

        setGetFilterredNumber(filteredProducts); // Set the filtered data
        setNewUserByNumber(filtereNewUserByNumber); // Set the filtered data
        fetchAllPublicUser();
        if (
          !filteredProducts &&
          !filtereNewUserByNumber &&
          !filterOldUserByNumber
        ) {
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
  //===============================================================================================
  const [selectBranch, setSelectBranch] = useState("");
  const [getDhanmondiPackage, setgetDhanmondiPackage] = useState([]);
  const [getUttaraPackage, setgetUttaraPackage] = useState([]);
  const [rows, setRows] = useState([]);

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
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddRow = () => {
    setRows((prevRows) => [
      ...prevRows,
      {
        id: prevRows.length + 1,
        selectedItem: null,
        quantity: 1,
        mrp: 0,
        total: 0,
      },
    ]);
  };

  const handleRemoveRow = () => {
    if (rows.length > 0) {
      setRows((prevRows) => prevRows.slice(0, -1));
    }
  };
  //=========================================================================================

  const [paid, setPaid] = useState(); // Paid amount input
  const [subtotal, setSubtotal] = useState(0); // Subtotal (sum of all MRP)
  const [discountPercent, setDiscountPercent] = useState(); // Discount percentage
  const [totalAmount, setTotalAmount] = useState(0); // Sum of all row.total
  const [dueAmount, setDueAmount] = useState(null); // Due amount

  const maxDiscountPercent = 60;

  useEffect(() => {
    const calcSubtotal = rows.reduce(
      (sum, row) => sum + (row.mrp ? Number(row.mrp) : 0),
      0
    );

    const appliedDiscount = (totalAmount * discountPercent) / 100;
    const calcTotalAmount = totalAmount - appliedDiscount;
    const calcDueAmount = calcTotalAmount - (paid || 0);

    setSubtotal(calcSubtotal);
    setTotalAmount(calcTotalAmount);
    setDueAmount(calcDueAmount);
  }, [rows, discountPercent, paid]);

  const handleDiscountChange = (e) => {
    let inputPercent = Number(e.target.value);
    if (inputPercent > maxDiscountPercent) {
      inputPercent = maxDiscountPercent;
    }
    setDiscountPercent(inputPercent);
  };

  useEffect(() => {
    let runningSum = 0;

    // Calculate each row's total and running subtotal
    const updatedRows = rows.map((row) => {
      const rowTotal = (Number(row.mrp) || 0) * (Number(row.quantity) || 1);
      runningSum += rowTotal; // Add to running total (sequential sum)
      return {
        ...row,
        total: rowTotal,
        runningTotal: runningSum, // Save running subtotal
      };
    });

    setRows(updatedRows); // Update rows with calculated totals
    setTotalAmount(runningSum); // Update overall total amount
  }, [rows]);

  const handleQuantityChange = (index, value) => {
    setRows((prevRows) =>
      prevRows.map((row, i) =>
        i === index ? { ...row, quantity: Number(value) || 1 } : row
      )
    );
  };

  const handleProductChange = (index, itemname) => {
    const product = [...getDhanmondiPackage, ...getUttaraPackage].find(
      (p) => p.itemname === itemname
    );

    if (product) {
      setRows((prevRows) =>
        prevRows.map((row, i) =>
          i === index
            ? {
                ...row,
                itemname,
                mrp: Number(product.mrp),
                discount: product.discount,
              }
            : row
        )
      );
    }
  };

  //=================== Submit Bill report

  const loggedInUser = localStorage.getItem("loggedInUser");
  const userParse = loggedInUser ? JSON.parse(loggedInUser) : null;

  // Example usage

  const submitBillReport = async () => {
    try {

      const packageItem = rows.map(row => ({
        name: row.itemname || "",
        quantity: row.quantity || 0,
        price: row.total || 0,  // Assuming row.total represents the item price
      }));

      const billData = {
        dietitian_id: selectAdvisor,
        dietitian_name: selectAdvisor,
        maxservicediscount : discountPercent,
        totalAmount: totalAmount && totalAmount.toFixed(2),
        paidAmount: paid || 0,
        dueAmount: dueAmount && dueAmount.toFixed(2),
        billing_notes: words,
        branchName: selectBranch,
        biller_id: JSON.stringify(userParse?.id),
        biller_name: userParse?.name,
        user_phonenumber:
          phoneNumber ||
          customerData?.phonenumber ||
          getOrderDataByCUstermerID?.phonenumber ||
          getOldUserByid?.phonenumber ||
          "",
        user_name:
          customerData?.username ||
          getFilteredNumber?.username ||
          newUserByNumber?.name ||
          getOrderDataByCUstermerID?.username ||
          "",
        userid: parseInt(
          customerID ||
            getOldUserByNumber?.id ||
            customerData?.userid ||
            getFilteredNumber?.userid ||
            newUserByNumber?.userid ||
            getOrderDataByCUstermerID?.userid
        ),
        packageItem,
        dicountapprovestatus : discountPercent && parseInt(discountPercent) <= 40 ? true : false,
        note: note,
        subtotal: subtotal,
        paymentmethod: selectedPaymentMethod,
        preparedBy: "",
        customerSign: "",
        AuthorizedSine: "",
      };
      const response = await axios.post(
        `https://qwikit1.pythonanywhere.com/billingReport/new`,
        billData
      );
      toast.success("Bill Added successfully", { theme: "colored" });
      console.log("Bill Report Submitted:", billData, response.data);
    } catch (err) {
      console.error("Error submitting bill report:", err.message);
    }
  };

  return (
    <div className="outside">
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
          <label htmlFor=""></label>
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
                  <label>Name:</label>
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
                  <label>Address:</label>
                  <input
                    type="text"
                    placeholder=""
                    value={
                      customerData?.address ||
                      getFilteredNumber?.address ||
                      newUserByNumber?.address ||
                      getOrderDataByCUstermerID?.address ||
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
                      getOldUserByid?.phonenumber ||
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
                      getOldUserByNumber
                        ? getOldUserByNumber.id
                        : customerID || getFilteredNumber
                          ? getFilteredNumber.id
                          : ""
                    }
                    onChange={(e) => setCustomerID(e.target.value)}
                    onBlur={handleBlur}
                  />
                </div>
                <div className="header-group2 advisor-group">
                  <label>Advisor:</label>
                  <select
                    name="options"
                    id="options"
                    className="custom-select"
                    onChange={(e) => SetSelectAdvisor(e.target.value)}
                  >
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
                  <th>Name</th>
                  <th>Qty.</th>
                  {/* <th>Rate</th> */}
                  <th>Value in BDT</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row, index) => (
                  <tr key={row.id}>
                    <td>{index + 1}</td> {/* Row number */}
                    <td>
                      <select
                        value={row.itemname || ""}
                        onChange={(e) =>
                          handleProductChange(index, e.target.value)
                        }
                        className="select-package"
                      >
                        <option value="">Select Product</option>
                        {selectBranch === "Dhanmondi" &&
                          getDhanmondiPackage.map((product) => (
                            <option key={product.id} value={product.itemname}>
                              {product.itemname}
                            </option>
                          ))}
                        {selectBranch === "Uttara" &&
                          getUttaraPackage.map((product) => (
                            <option key={product.id} value={product.itemname}>
                              {product.itemname}
                            </option>
                          ))}
                      </select>
                    </td>
                    <td>
                      <input
                        type="number"
                        value={row.quantity || 1}
                        onChange={(e) =>
                          handleQuantityChange(index, e.target.value)
                        }
                      />
                    </td>
                    {/* <td>{row.mrp || 0}</td>  */}
                    <td>{row.total?.toFixed(2) || "0.00"}</td> {/* Row total */}
                    {/* <td>{row.runningTotal?.toFixed(2) || "0.00"}</td> */}
                  </tr>
                ))}
              </tbody>
            </table>
            <div style={{ marginTop: "20px" }} className="control">
              <LibraryAddIcon
                onClick={handleAddRow}
                style={{ marginRight: "10px" }}
              />
              <DoDisturbIcon onClick={handleRemoveRow} />
            </div>

            <div className="amount-info">
              <div className="payment-section">
                <div className="innter-payment">
                  <label>Payment Received By:</label>
                  <div className="payment-methods">
                    <select
                      name=""
                      id=""
                      onChange={handlePaymentMethodChange}
                      className="select-border"
                    >
                      <option value="Cash">Cash</option>
                      <option value="Card">Card</option>
                      <option value="Bkash">Bkash</option>
                      <option value="Nagad">Nagad</option>
                      <option value="Bank">Bank</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>
                <div className="in-words">
                  <label>In Words:</label>
                  <textarea
                    placeholder="Enter amount in words"
                    className="text custom-border"
                    onChange={(e)=> setwords(e.target.value)}
                  ></textarea>
                </div>
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
                    <div className="input-div">
                      <input
                        type="number"
                        placeholder="0.00"
                        className="amount-details amount-border"
                        value={subtotal.toFixed(2)} // Subtotal
                        readOnly
                      />
                    </div>
                    <div className="input-div">
                      <input
                        type="number"
                        placeholder="Discount %"
                        className="amount-details amount-border"
                        value={discountPercent}
                        onChange={handleDiscountChange}
                      />
                    </div>
                    <div className="input-div">
                      <input
                        type="number"
                        placeholder="0.00"
                        className="amount-details amount-border"
                        value={totalAmount && totalAmount.toFixed(2)} // Total from the running subtotal
                        readOnly
                      />
                    </div>
                    <div className="input-div">
                      <input
                        type="number"
                        placeholder=""
                        className="amount-details amount-border"
                        value={paid}
                        onChange={(e) => setPaid(Number(e.target.value))} // Paid Amount
                      />
                    </div>
                    <div className="input-div">
                      <input
                        type="number"
                        placeholder="0.00"
                        className="amount-details amount-border"
                        value={dueAmount !== null ? dueAmount.toFixed(2) : ''} // Due Amount
                        readOnly
                      />
                    </div>
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
                className="note custom-border"
                placeholder="Add any notes"
                onChange={(e)=> setNote(e.target.value)}
              ></textarea>
            </div>
          </div>
        </div>
      </div>
      <button
        className="download-btn"
        style={{ display: "block", margin: "auto" }}
        onClick={submitBillReport}
      >
        Submit
      </button>
      {/* <button className="download-btn" onClick={handleReset} style={{ marginLeft :"13px"}}>
        Reset
      </button> */}
    </div>
  );
};

export default Invoice;
