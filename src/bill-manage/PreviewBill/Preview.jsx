import PropTypes from "prop-types";
import "../Invoice.css"

const Preview = ({
  setSelectBranch,
  customerData,
  getFilteredNumber,
  newUserByNumber,
  getOrderDataByCUstermerID,
  phoneNumber,
  getOldUserByid,
  getOldUserByNumber,
  handleDownloadPDF,
  dueAmount,
  paid,
  rows,
  setCustomerID,
  subtotal,
  discount,
  totalAmount,
  handleAddRow,
  handleRemoveRow,
  handleProductChange,
  handleQuantityChange,
  selectBranch,
  getDhanmondiPackage,
  getUttaraPackage,
  handlePaymentMethodChange,
  setPaid,
  errorMessage,
  handleChange,
  handleBlur,
  SetSelectAdvisor
}) => {
  return (
    <div>
      <div className="select-branch">
        <label htmlFor="">Branch:</label>
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
                  value={
                    getOldUserByNumber
                      ? getOldUserByNumber.id
                      : setCustomerID ||
                        getFilteredNumber
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
                <th>Value in BDT</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, index) => (
                <tr key={row.id}>
                  <td>{index + 1}</td>
                  <td>
                    <select
                      value={row.itemname || ""}
                      onChange={(e) => handleProductChange(index, e.target.value)}
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
                      onChange={(e) => handleQuantityChange(index, e.target.value)}
                    />
                  </td>
                  <td>{row.total?.toFixed(2) || "0.00"}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="action-icons" style={{ marginTop: "20px" }}>
            <button onClick={handleAddRow}>Add Row</button>
            <button onClick={handleRemoveRow}>Remove Row</button>
          </div>

          <div className="amount-info">
            <div className="payment-section">
              <div className="innter-payment">
                <label>Payment Received By:</label>
                <select onChange={handlePaymentMethodChange}>
                  <option value="Cash">Cash</option>
                  <option value="Card">Card</option>
                  <option value="Bkash">Bkash</option>
                  <option value="Nagad">Nagad</option>
                  <option value="Bank">Bank</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <label>In Words:</label>
              <textarea
                placeholder="Enter amount in words"
                className="text custom-border"
              ></textarea>

              <div className="disclaimer">
                <p>*** We don’t take responsibility unless all guidelines are followed properly.</p>
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
                    className="amount-details amount-border"
                    value={subtotal && subtotal.toFixed(2)}
                    readOnly
                  />
                  <input
                    type="number"
                    placeholder="0.00"
                    className="amount-details amount-border"
                    value={discount && discount.toFixed(2)}
                    readOnly
                  />
                  <input
                    type="number"
                    placeholder="0.00"
                    className="amount-details amount-border"
                    value={totalAmount && totalAmount.toFixed(2)}
                    readOnly
                  />
                  <input
                    type="number"
                    placeholder=""
                    className="amount-details amount-border"
                    value={paid}
                    onChange={(e) => setPaid(Number(e.target.value))}
                  />
                  <input
                    type="number"
                    placeholder="0.00"
                    className="amount-details amount-border"
                    value={dueAmount && dueAmount.toFixed(2)}
                    readOnly
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
            <label>Note:</label>
            <textarea className="custom-border" placeholder="Add any notes"></textarea>
          </div>
        </div>
      </div>

      <button className="download-btn" onClick={handleDownloadPDF}>
        Download PDF
      </button>
    </div>
  );
};

Preview.propTypes = {
  setSelectBranch: PropTypes.func.isRequired,
  customerData: PropTypes.object,
  getFilteredNumber: PropTypes.object,
  newUserByNumber: PropTypes.object,
  getOrderDataByCUstermerID: PropTypes.object,
  phoneNumber: PropTypes.string,
  getOldUserByid: PropTypes.object,
  getOldUserByNumber: PropTypes.object,
  handleDownloadPDF: PropTypes.func.isRequired,
  dueAmount: PropTypes.number.isRequired,
  paid: PropTypes.number.isRequired,
  rows: PropTypes.array.isRequired,
  setCustomerID: PropTypes.func.isRequired,
  subtotal: PropTypes.number,
  discount: PropTypes.number,
  totalAmount: PropTypes.number,
  handleAddRow: PropTypes.func.isRequired,
  handleRemoveRow: PropTypes.func.isRequired,
  handleProductChange: PropTypes.func.isRequired,
  handleQuantityChange: PropTypes.func.isRequired,
  selectBranch: PropTypes.string,
  getDhanmondiPackage: PropTypes.array.isRequired,
  getUttaraPackage: PropTypes.array.isRequired,
  handlePaymentMethodChange: PropTypes.func.isRequired,
  setPaid: PropTypes.func.isRequired,
  errorMessage: PropTypes.string,
  handleChange: PropTypes.func.isRequired,
  handleBlur: PropTypes.func.isRequired,
  SetSelectAdvisor: PropTypes.func.isRequired,
};

export default Preview;
