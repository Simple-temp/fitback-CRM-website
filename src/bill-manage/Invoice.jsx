import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import "./Invoice.css";
import { useState } from "react";
import axios from "axios";

const Invoice = () => {
  const [customerData, setCustomerData] = useState({});
  const [customerID, setCustomerID] = useState("");

  const handleDownloadPDF = () => {
    const element = document.querySelector(".main-container");
    html2canvas(element, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save("invoice.pdf");
    });
  };

  const handleBlur = async () => {
    if (!customerID.trim()) return; // Ensure the input is not empty

    try {
      const response = await axios.get(
        `https://qwikit1.pythonanywhere.com/orderFitbackProduct/${customerID}`
      );
      setCustomerData(response.data);
    } catch (err) {
      console.log("Error fetching customer data:", err);
    }
  };

  return (
    <div className="main-container invoice-img">
      <div className="invoice-container">
        <div className="invoice-body">
          {/* Invoice Title */}
          <h2 className="invoice-title">Invoice</h2>

          {/* Header Section */}
          <div className="invoice-header">
            <div className="header-col1">
              <div className="header-group1">
                <label>Bill To:</label>
                <input
                  type="text"
                  placeholder=""
                  value={customerData.username}
                />
              </div>
              <div className="header-group1">
                <label>Phone:</label>
                <input
                  type="text"
                  placeholder=""
                  value={customerData.phonenumber}
                />
              </div>
            </div>
            <div className="header-col2">
              <div className="header-group2">
                <label>Date:</label>
                <input
                  type="text"
                  placeholder=""
                  value={customerData.orderdate}
                />
              </div>
              <div className="header-group2">
                <label>Invoice No:</label>
                <input type="text" placeholder="" value={customerData.userid} />
              </div>
              <div className="header-group2">
                <label>Customer ID:</label>
                <input
                  type="text"
                  placeholder=""
                  value={customerID}
                  onChange={(e) => setCustomerID(e.target.value)}
                  onBlur={handleBlur}
                />
              </div>
              <div className="header-group2">
              <label>Advisor:</label>
                <select name="options" id="options">
                <option value="">--Select---</option>
                  <option value="Advisor1">Advisor 1</option>
                  <option value="Advisor2">Advisor 2</option>
                  <option value="Advisor3">Advisor 3</option>
                  <option value="Advisor4">Advisor 4</option>
                </select>
              </div>
            </div>
          </div>

          {/* Table Section */}
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
                    <input type="number" placeholder={index + 1} />
                  </td>
                  <td>
                    <input type="text" placeholder="Enter description" />
                  </td>
                  <td>
                    <input
                      type="number"
                      placeholder="0"
                      value={customerData.totalquantity}
                    />
                  </td>
                  <td>
                    <input type="number" placeholder="0.00" />
                  </td>
                  <td>
                    <input
                      type="number"
                      placeholder="0.00"
                      value={customerData.totalproductamount}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="amount-info">
            {/* Payment Section */}
            <div className="payment-section">
              <div className="innter-payment">
                <label>Payment Received By:</label>
                <div className="payment-methods">
                  <label>
                    <input type="checkbox" /> Cash
                  </label>
                  <label>
                    <input type="checkbox" /> Card
                  </label>
                  <label>
                    <input type="checkbox" /> Bkash
                  </label>
                </div>
              </div>
              <label>In Words:</label> <br />
              <textarea
                placeholder="Enter amount in words"
                className="text"
              ></textarea>
              {/* Disclaimer */}
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
                    value={customerData.vat}
                  /> <br />

                  <input
                    type="number"
                    placeholder="0.00"
                    className="amount-details"
                    value={customerData.deliverycharge}
                  /> <br />
                  <input
                    type="number"
                    placeholder="0.00"
                    className="amount-details"
                    value={customerData.totalprice}
                  /> <br />
                  <input
                    type="number"
                    placeholder="0.00"
                    className="amount-details"
                    value={customerData.totalMRP}
                  /> <br />
                  <input
                    type="number"
                    placeholder="0.00"
                    className="amount-details"
                    value={customerData.suppertotalamount}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Footer Section */}
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

          {/* Notes Section */}
          <div className="note-section">
            <label>Note:</label> <br />
            <textarea
              placeholder="Add any notes"
              value={customerData.orderstatus}
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
