import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import "./Billing.css";

const BillingDetails = () => {
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
              <p>Date : {new Date(getBillInformation.systemdate).toLocaleDateString()}</p>
              <p>Invoice No : {getBillInformation.id}</p>
              <p>Customer ID : {getBillInformation.userid}</p>
              <p>Advisor : {getBillInformation.dietitian_name}</p>
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
                {getBillInformation.packageItem.map((row, index) => (
                  <tr key={row.id}>
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
              <p>In Words: <p className="wordss">{getBillInformation.billing_notes}</p> </p>
              <div className="disclaimer">
                *** We don’t take responsibility unless all guidelines are
                followed properly. *** All payments are non-refundable.
              </div>
            </div>
            <div className="bill-body-right-part">
              <p>Subtotal : {getBillInformation.subtotal}</p>
              <p>Discount :{getBillInformation.maxservicediscount} </p>
              <p>TotalAmount : {getBillInformation.totalAmount}</p>
              <p>PaidAmount : {getBillInformation.paidAmount}</p>
              <p>DueAmount :{getBillInformation.dueAmount} </p>
            </div>
          </div>
          <div className="bill-footer-section">
            <div className="authorization-section">
              <span>Prepared By: {getBillInformation.preparedBy}</span>
              <span>Customer Sign:{getBillInformation.customerSign}</span>
              <span>Authorized Sign:{getBillInformation.AuthorizedSine}</span>
            </div>
            <div className="note-section">Note: <br /> <p className="notesss">{getBillInformation.note}</p> </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BillingDetails;
