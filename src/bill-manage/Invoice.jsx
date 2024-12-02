
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import "./Invoice.css";

const Invoice = () => {
  const handleDownloadPDF = () => {
    const element = document.querySelector(".invoice-container");
    html2canvas(element, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save("invoice.pdf");
    });
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
                <input type="text" placeholder="" />
              </div>
              <div className="header-group1">
                <label>Phone:</label>
                <input type="text" placeholder="" />
              </div>
            </div>
            <div className="header-col2">
              <div className="header-group2">
                <label>Date:</label>
              </div>
              <div className="header-group2">
                <label>Invoice No:</label>
                <input type="text" placeholder="" />
              </div>
              <div className="header-group2">
                <label>Customer ID:</label>
                <input type="text" placeholder="" />
              </div>
              <div className="header-group2">
                <label>Advisor:</label>
                <input type="text" placeholder="" />
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
                    <input type="number" placeholder="0" />
                  </td>
                  <td>
                    <input type="number" placeholder="0.00" />
                  </td>
                  <td>
                    <input type="number" placeholder="0.00" />
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
              <textarea placeholder="Enter amount in words" className="text"></textarea>
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
                <label>Subtotal:</label>
                <input type="number" placeholder="0.00" className="amount-details" />
              </div>
              <div className="amount-row">
                <label>Discount:</label>
                <input type="number" placeholder="0.00" className="amount-details" />
              </div>
              <div className="amount-row">
                <label>TotalAmount:</label>
                <input type="number" placeholder="0.00" className="amount-details" />
              </div>
              <div className="amount-row">
                <label>Paid Amount: </label>
                <input type="number" placeholder="0.00" className="amount-details" />
              </div>
              <div className="amount-row">
                <label>Due Amount: </label>
                <input type="number" placeholder="0.00" className="amount-details" />
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
            <textarea placeholder="Add any notes"></textarea>
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
