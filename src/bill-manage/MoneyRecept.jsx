import { useEffect, useRef, useState } from "react";
import jsPDF from "jspdf";
import "jspdf-autotable";
import axios from "axios";

const MoneyRecept = () => {
  const [customerId, setCustomerId] = useState("");
  const [receivedFrom, setReceivedFrom] = useState("");
  const [amount, setAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState([]);
  const [purchasedItems, setPurchasedItems] = useState([{ name: "", quantity: "", price: "" }]);
  const [date, setDate] = useState("");
  const [contactNo, setContactNo] = useState("");
  const receiptRef = useRef();

  const [ GetOrders, SetGetOrders ] = useState([])
  const [ getOderId, SetGetOrderId] = useState()
  console.log(getOderId)

  useEffect(()=>{
    fetchOrder()
  },[])

  const fetchOrder = async () =>{
    try{
      const response = await axios.get(`https://qwikit1.pythonanywhere.com/orderFitbackProduct/${getOderId}`)
      console.log(response.data)
      SetGetOrders(response.data)
    }catch(err){
      console.log(err)
    }
  }

  // Function to add a new purchased item
  const addItem = () => {
    setPurchasedItems([...purchasedItems, { name: "", quantity: "", price: "" }]);
  };

  // Function to handle input changes for purchased items
  const handleItemChange = (index, event) => {
    const updatedItems = [...purchasedItems];
    updatedItems[index][event.target.name] = event.target.value;
    setPurchasedItems(updatedItems);
  };

  // Function to handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "customerId") setCustomerId(value);
    if (name === "receivedFrom") setReceivedFrom(value);
    if (name === "amount") setAmount(value);
    if (name === "paymentMethod") {
      const method = e.target.value;
      setPaymentMethod(
        paymentMethod.includes(method)
          ? paymentMethod.filter((method) => method !== e.target.value)
          : [...paymentMethod, method]
      );
    }
    if (name === "date") setDate(value);
    if (name === "contactNo") setContactNo(value);
  };

  // Function to generate and download the PDF
  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    const currentY = 20;

    // Title
    doc.setFont("Arial", "bold");
    doc.text("Money Receipt", 20, currentY);

    // Customer ID
    doc.setFont("Arial", "normal");
    doc.text(`Customer ID: ${customerId}`, 20, currentY + 10);

    // Received From
    doc.text(`Received from: ${receivedFrom}`, 20, currentY + 20);

    // Total Amount
    doc.text(`Amount: ${amount} Taka`, 20, currentY + 30);

    // Payment Method
    doc.text(`Payment Method: ${paymentMethod.join(", ")}`, 20, currentY + 40);

    // Purchased Items Table
    const tableStartY = currentY + 50;
    const headers = ["Item", "Quantity", "Price"];
    const tableData = purchasedItems.map((item) => [item.name, item.quantity, item.price]);

    // Create table
    doc.autoTable({
      head: [headers],
      body: tableData,
      startY: tableStartY,
      theme: "grid",
      headStyles: {
        fillColor: [241, 85, 130], // Header row color
        textColor: [255, 255, 255], // Header text color
      },
      bodyStyles: {
        fillColor: [255, 255, 255], // Body row color
        textColor: [0, 0, 0], // Body text color
      },
      columnStyles: {
        0: { cellWidth: 60 },
        1: { cellWidth: 40 },
        2: { cellWidth: 40 },
      },
    });

    // Add Date
    doc.text(`Date: ${date}`, 20, doc.lastAutoTable.finalY + 10);

    // Add Contact
    doc.text(`Contact No.: ${contactNo}`, 20, doc.lastAutoTable.finalY + 20);

    // Save the PDF
    doc.save("money_receipt.pdf");
  };

  return (
    <div
      style={{
        fontFamily: "Arial, sans-serif",
        padding: "20px",
        maxWidth: "800px",
        margin: "auto",
      }}
    >
      <style>
        {`
          .receipt-container {
            border: 1px solid #ddd;
            padding: 20px;
            border-radius: 8px;
            margin-top: 20px;
          }
          .form-row {
            margin-bottom: 20px;
          }
          .form-row label {
            font-weight: bold;
          }
          .form-row input[type="text"],
          .form-row input[type="number"],
          .form-row input[type="date"] {
            margin-left: 10px;
            padding: 5px;
            border: 1px solid #ddd;
            border-radius: 4px;
            width: calc(100% - 160px);
            max-width: 300px;
          }
          .form-row input[type="checkbox"] {
            margin-left: 10px;
          }
          .print-button {
            margin-top: 20px;
            padding: 10px 20px;
            background-color: #E91E63;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
          }
        `}
      </style>

      {/* Money Receipt Section */}
      <div ref={receiptRef} className="receipt-container">
        <div className="form-row">
          <label>Customer ID:</label>
          <input type="text" name="customerId" value={customerId} onChange={handleInputChange} onBlur={(e)=>SetGetOrderId(e.target.value)}/>
        </div>
        <div className="form-row">
          <label>Received with thanks from:</label>
          <input type="text" name="receivedFrom" value={receivedFrom || GetOrders.userid }onChange={handleInputChange} />
        </div>
        <div className="form-row">
          <label>Amount of taka:</label>
          <input type="number" name="amount" value={amount} onChange={handleInputChange} />
        </div>
        <div className="form-row checkbox-group">
          <label>
            <input
              type="checkbox"
              value="Cash"
              checked={paymentMethod.includes("Cash")}
              onChange={handleInputChange}
              name="paymentMethod"
            />
            Cash
          </label>
          <label>
            <input
              type="checkbox"
              value="Card"
              checked={paymentMethod.includes("Card")}
              onChange={handleInputChange}
              name="paymentMethod"
            />
            Card
          </label>
          <label>
            <input
              type="checkbox"
              value="Bkash"
              checked={paymentMethod.includes("Bkash")}
              onChange={handleInputChange}
              name="paymentMethod"
            />
            Bkash
          </label>
          <label>
            <input
              type="checkbox"
              value="Cheque"
              checked={paymentMethod.includes("Cheque")}
              onChange={handleInputChange}
              name="paymentMethod"
            />
            Cheque
          </label>
        </div>
        <div className="form-row">
          <label>Date:</label>
          <input type="date" name="date" value={date} onChange={handleInputChange} />
        </div>
        <div className="form-row">
          <label>Contact No.:</label>
          <input type="text" name="contactNo" value={contactNo} onChange={handleInputChange} />
        </div>

        {/* Purchased Items Section */}
        <div>
          <h3>Purchased Items</h3>
          {purchasedItems.map((item, index) => (
            <div className="form-row" key={index}>
              <input
                type="text"
                name="name"
                value={item.name}
                placeholder="Item Name"
                onChange={(e) => handleItemChange(index, e)}
              />
              <input
                type="number"
                name="quantity"
                value={item.quantity}
                placeholder="Quantity"
                onChange={(e) => handleItemChange(index, e)}
              />
              <input
                type="number"
                name="price"
                value={item.price}
                placeholder="Price"
                onChange={(e) => handleItemChange(index, e)}
              />
            </div>
          ))}
          <button onClick={addItem}>Add Item</button>
        </div>
      </div>

      {/* Download Button */}
      <button onClick={handleDownloadPDF} className="print-button">
        Download PDF
      </button>
    </div>
  );
};

export default MoneyRecept;
