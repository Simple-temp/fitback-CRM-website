import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import "./Billing.css";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const BillingDetails = () => {

  const handleDownloadPDF = () => {
    const input = document.querySelector(".billing-container"); // Target the main container
    html2canvas(input, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
  
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
  
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`Billing_Details_${id}.pdf`);
    });

  };


  const { id } = useParams();
  console.log(id);

  const [getBillInformation, setGetbillingInformation] = useState({});

  useEffect(() => {
    fetchBillingDetails();
  }, []);

  const fetchBillingDetails = async () => {
    try {
      const response = await axios.get(
        `https://qwikit1.pythonanywhere.com/billingReport/${id}`
      );
      setGetbillingInformation(response.data);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div>
      <h1 style={{ textAlign: "center", marginBottom: "29px" }}>
        Billing details
      </h1>
      <div className="billing-container">
        <div className="billing-inner-container">
          <div className="bill-branch-section">
            <h3>
              <b>{getBillInformation.branchName}</b>{" "}
            </h3>
          </div>
          <div className="bill-header-section">
            <h2 style={{ textAlign: "center" }}>Invoice</h2>
            <div className="bill-header-section-inner">
            <div className="bill-header-section-left">
              <p>Name : <span className="bill-border">{getBillInformation.user_name}</span></p>
              <p>Address : <span className="bill-border">{getBillInformation.address || "N/A"}</span></p>
              <p>Phone : <span className="bill-border">{getBillInformation.user_phonenumber}</span></p>
            </div>
            <div className="bill-header-section-right">
              <p>Date : <span className="bill-border">{new Date(getBillInformation.systemdate).toLocaleDateString()}</span> </p>
              <p>Invoice No : <span className="bill-border">{getBillInformation.id}</span> </p>
              <p>Customer ID : <span className="bill-border">{getBillInformation.userid}</span> </p>
              <p>Advisor : <span className="bill-border">{getBillInformation.dietitian_name}</span> </p>
            </div>
            </div>
          </div>
          <div className="bill-table-section">
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
                {getBillInformation?.packageItem?.map((row, index) => (
                  <tr key={row.id} className="bill-table">
                    <td>{index + 1}</td>
                    <td>{row.name} </td>
                    <td>{row.quantity}</td>
                    <td>{row.price}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="bill-body-part">
            <div className="bill-body-left-part">
              <p style={{marginBottom:"10px"}}>Payment Received By : {getBillInformation.paymentmethod}</p>
              <p>In Words: <p className="wordss bill-table">{getBillInformation.billing_notes}</p> </p>
              <div className="disclaimer">
                *** We don’t take responsibility unless all guidelines are
                followed properly. *** All payments are non-refundable.
              </div>
            </div>
            <div className="bill-body-right-part">
              <p className="billing-payment-details">Subtotal : {getBillInformation.subtotal}</p>
              <p className="billing-payment-details">Discount :{getBillInformation.maxservicediscount} </p>
              <p className="billing-payment-details">TotalAmount : {getBillInformation.totalAmount}</p>
              <p className="billing-payment-details">PaidAmount : {getBillInformation.paidAmount}</p>
              <p className="billing-payment-details" style={{color:"red"}}>DueAmount :{getBillInformation.dueAmount} </p>
            </div>
          </div>
          <div className="bill-footer-section">
            <div className="authorization-section">
              <span>Prepared By: {getBillInformation.preparedBy}</span>
              <span>Customer Sign:{getBillInformation.customerSign}</span>
              <span>Authorized Sign:{getBillInformation.AuthorizedSine}</span>
            </div>
            <div className="note-section">Note: <br /> <p className="notesss bill-table">{getBillInformation.note}</p> </div>
          </div>
        </div>
      </div>
      <button onClick={handleDownloadPDF}>Download</button>
    </div>
  );
};

export default BillingDetails;
