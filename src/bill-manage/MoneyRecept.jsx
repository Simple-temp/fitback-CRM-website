import { useState } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import "./MoneyReceipt.css";

function MoneyRecept() {
  const [formData, setFormData] = useState({
    receivedFrom: "",
    amount: "",
    bank: "",
    cash: false,
    card: false,
    bkash: false,
    chequeNo: "",
    purpose: "",
    contactNo: "",
    payableAmount: "",
    paidAmount: "",
    balanceAmount: "",
    receivedBy: "",
    date: "",
    customerId: "",
  });

  const handleDownloadPDF = () => {
    const receiptElement = document.querySelector(".receipt-container");
    html2canvas(receiptElement, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save("money-receipt.pdf");
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
      <div className="receipt-container">
        <h2 className="title">MONEY RECEIPT</h2>

        <div className="header-part">
          <div className="form-row-date">
            <label>Date:</label>
            {/* <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
            /> */}
          </div>

          <div className="form-row-header">
            <label>Customer ID:</label>
            <input
              type="text"
              name="customerId"
              value={formData.customerId}
              onChange={handleChange}
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
                name="receivedFrom"
                value={formData.receivedFrom}
                onChange={handleChange}
                className="full border-for-input"
              />
            </div>

            <div className="form-row-full">
              <label>Amount of Taka:</label>
              <input
                type="text"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
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
                checked={formData.cash}
                onChange={handleChange}
              />
              Cash
            </label>
            <label>
              <input
                type="checkbox"
                name="card"
                checked={formData.card}
                onChange={handleChange}
              />
              Card
            </label>
            <label>
              <input
                type="checkbox"
                name="bkash"
                checked={formData.bkash}
                onChange={handleChange}
              />
              Bkash
            </label>
            <label>
              <input
                type="text"
                name="chequeNo"
                placeholder="Cheque No."
                value={formData.chequeNo}
                onChange={handleChange}
                className="border-for-input"
              />
            </label>
          </div>
          <div className="form-row">
            <label className="another">For the purpose of:</label>
            <input
              type="text"
              name="purpose"
              value={formData.purpose}
              className="border-for-input"
              onChange={handleChange}
            />
          </div>

          <div className="form-row">
            <label  className="another">Contact No:</label>
            <input
              type="text"
              name="contactNo"
              value={formData.contactNo}
              onChange={handleChange}
              className="border-for-input"
            />
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
              name="payableAmount"
              value={formData.payableAmount}
              onChange={handleChange}
              className="border-for-input"
            /> <br />
            <input
              type="text"
              name="paidAmount"
              value={formData.paidAmount}
              onChange={handleChange}
              className="border-for-input"
            /> <br />
            <input
              type="text"
              name="balanceAmount"
              value={formData.balanceAmount}
              onChange={handleChange}
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

        <button className="download-btn" onClick={handleDownloadPDF}>
          Download Receipt
        </button>
      </div>
    </div>
  );
}

export default MoneyRecept;
