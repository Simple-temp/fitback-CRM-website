import { useEffect, useState } from "react";
import { useParams } from "react-router";
import "./orderdetails.css";
import PersonRemoveAlt1Icon from "@mui/icons-material/PersonRemoveAlt1";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import { Button } from "@mui/material";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";

const OrderDetails = () => {
  const { id } = useParams();
  const [orderData, setOrderData] = useState(null);
  const [dietitians, setDietitians] = useState([]);
  const [selectedDietitian, setSelectedDietitian] = useState(null);
  const [dietitianById, setDietitianById] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const response = await axios.get(
          `https://qwikit1.pythonanywhere.com/orderFitbackProduct/${id}`
        );
        setOrderData(response.data);
        setSelectedDietitian(response.data.dietitian_user_id);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [id]);

  useEffect(() => {
    const fetchDietitians = async () => {
      try {
        const response = await axios.get(
          "https://qwikit1.pythonanywhere.com/dietitianProfile"
        );
        setDietitians(response.data);
      } catch (err) {
        console.error(err.message);
      }
    };

    fetchDietitians();
  }, []);

  useEffect(() => {
    if (!selectedDietitian) {
      setDietitianById(null);
      return;
    }

    const fetchDietitianById = async () => {
      try {
        const response = await axios.get(
          `https://qwikit1.pythonanywhere.com/dietitianProfile/${selectedDietitian}`
        );
        setDietitianById(response.data);
      } catch (err) {
        console.error(err.message);
      }
    };

    fetchDietitianById();
  }, [selectedDietitian]);

  const handleAssignDietitian = async () => {
    if (!selectedDietitian) {
      toast.error("Please select a dietitian.", { theme: "colored" });
      return;
    }

    try {
      const response = await axios.patch(
        `https://qwikit1.pythonanywhere.com/orderFitbackProduct/${id}`,
        { dietitian_user_id: selectedDietitian }
      );
      setOrderData(response.data);
      toast.success("Dietitian assigned successfully.", { theme: "colored" });
    } catch (err) {
      console.error(err.message);
      toast.error("Error assigning dietitian.", { theme: "colored" });
    }
  };

  const handleRemoveDietitian = async () => {
    try {
      const response = await axios.patch(
        `https://qwikit1.pythonanywhere.com/orderFitbackProduct/${id}`,
        { dietitian_user_id: null }
      );
      setOrderData(response.data);
      setSelectedDietitian(null);
      toast.error("Dietitian removed successfully.", { theme: "colored" });
    } catch (err) {
      console.error(err.message);
      toast.error("Error removing dietitian.", { theme: "colored" });
    }
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">Error: {error}</div>;
  if (!orderData) return <div className="no-data">No order data available.</div>;

  const productDetails = orderData.orderproductdata[0] || {};

  return (
    <div className="order-details-container">
      <ToastContainer position="bottom-center" autoClose={2000} theme="colored" />
      {/* Left Section */}
      <div className="order-details-left">
        <div className="order-details-row">
          <h3>Order Information</h3>
          <p>Order ID: {orderData.id}</p>
          <p>Order Status: {orderData.orderstatus}</p>
          <p>Payment Method: {orderData.paymentmethod}</p>
          <p>Order Date: {orderData.orderdate}</p>
          <p>Order Time: {orderData.ordertime}</p>
        </div>
        <div className="order-details-row">
          <h3>Customer Information</h3>
          <p>Address: {orderData.address}</p>
          <p>Total Quantity: {orderData.totalquantity}</p>
          <p>Delivery Charge: {orderData.deliverycharge} BDT</p>
        </div>
        <div className="order-details-row">
          <h3>Product Details</h3>
          <p>Product Name: {productDetails.tytle}</p>
          <p>Quantity: {productDetails.quantity}</p>
          <p>Total Price: {productDetails.totalprice} BDT</p>
          <p>Regular Price: {productDetails.regularPrice} BDT</p>
          <p>Discounted Price: {productDetails.discountPrice} BDT</p>
        </div>
      </div>

      {/* Right Section */}
      <div className="order-details-right">
        <h3>Order Summary</h3>
        <div className="summary-card">
          <p>
            <strong>Total MRP:</strong> {orderData.totalMRP} BDT
          </p>
          <p>
            <strong>Delivery Charge:</strong> {orderData.deliverycharge} BDT
          </p>
          <p>
            <strong>Final Amount:</strong>{" "}
            {parseFloat(orderData.totalMRP) + parseFloat(orderData.deliverycharge)}{" "}
            BDT
          </p>
        </div>

        {/* Dietitian Selection */}
        <div className="summary-card">
          <h3>Assign Dietitian</h3>
          <select
            value={selectedDietitian || ""}
            onChange={(e) => setSelectedDietitian(e.target.value)}
          >
            <option value="" disabled>
              Select a dietitian
            </option>
            {dietitians.map((dietitian) => (
              <option key={dietitian.id} value={dietitian.id}>
                {dietitian.name}
              </option>
            ))}
          </select>
          <Button
            variant="outlined"
            color="success"
            onClick={handleAssignDietitian}
            className="custom"
          >
            <PersonAddIcon /> Assign
          </Button>
          <Button
            variant="outlined"
            color="error"
            onClick={handleRemoveDietitian}
          >
            <PersonRemoveAlt1Icon /> Remove
          </Button>
        </div>

        {/* Additional Information */}
        <div className="info-card">
          <h3>Additional Information</h3>
          <p>
            <strong>Customer name:</strong> {orderData.username || "N/A"}
          </p>
          <p>
            <strong>Dietitian User:</strong>{" "}
            {dietitianById ? dietitianById.name : "Not Assigned"}
          </p>
          <p>
            <strong>Phone Number:</strong> {orderData.phonenumber || "N/A"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
