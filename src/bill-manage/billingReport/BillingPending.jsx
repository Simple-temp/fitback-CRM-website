import axios from "axios";
import { useEffect, useState } from "react";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import {
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { toast, ToastContainer } from "react-toastify";
import Switch from "@mui/material/Switch";

const BillingPending = () => {
  const [BillReport, BillReportsetGet] = useState([]);

  const GetsubmitBillReport = async () => {
    try {
      const response = await axios.get(
        `https://qwikit1.pythonanywhere.com/billingReport`
      );
      const filteredData = response.data.filter(
        (item) => item.dicountapprovestatus === false
      );

      BillReportsetGet(filteredData);
      console.log("Filtered Data:", filteredData);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    GetsubmitBillReport();
    console.log(BillReport);
  }, []);

  const deleteUser = async (id) => {
    try {
      try {
        const response = await axios.delete(
          `https://qwikit1.pythonanywhere.com/billingReport/${id}`
        );
        console.log(response.data);
        GetsubmitBillReport();
        toast.success("Bill Deleted successfully", { theme: "colored" });
        console.log(id);
      } catch (err) {
        console.log(err);
      }
    } catch (err) {
      toast.error(err, { theme: "colored" });
    }
  };

  const handleToggleDiscountStatus = async (id, currentStatus) => {
    try {
      const updatedStatus = !currentStatus; // Toggle status value
      await axios.put(`https://qwikit1.pythonanywhere.com/billingReport/${id}`, {
        dicountapprovestatus: updatedStatus,
      });
  
      // Update the local state after successful API call
      BillReportsetGet(prevState =>
        prevState.map(item =>
          item.id === id ? { ...item, dicountapprovestatus: updatedStatus } : item
        )
      );
      GetsubmitBillReport()
      toast.success("Discount approval status updated", { theme: "colored" });
    } catch (err) {
      console.error("Error updating status:", err);
      toast.error("Failed to update discount status", { theme: "colored" });
    }
  };

  return (
    <div>
      <h1>Pending Billing report</h1>
      <ToastContainer
        position="bottom-center"
        autoClose={2000}
        theme="colored"
      />
      <TableContainer
        component={Paper}
        sx={{
          minWidth: 850, // Adjusted min width
          "& thead th": {
            position: "sticky",
            top: 0,
            backgroundColor: "background.paper",
            zIndex: 1,
            fontWeight: "bold", // Apply bold to headers
          },
          "@media (max-width: 768px)": {
            minWidth: "100%", // Full width on small screens
          },
          maxHeight: "600px", // Set max height for vertical scroll
          overflowY: "auto", // Enable vertical scrolling
          overflowX: "hidden", // Hide horizontal scrollbar
          scrollbarWidth: "none", // Hide scrollbar for Firefox
          msOverflowStyle: "none", // Hide scrollbar for IE/Edge
        }}
      >
        {/* Hide scrollbar for WebKit browsers */}
        <style>
          {`
      div::-webkit-scrollbar {
        display: none;
      }
    `}
        </style>
        <Table
          sx={{
            minWidth: 850,
            "@media (max-width: 768px)": {
              minWidth: "100%", // Full width for small screens
            },
          }}
          size="small"
          aria-label="a dense table"
        >
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>userid</TableCell>
              <TableCell>user_name</TableCell>
              <TableCell>dietitian_id</TableCell>
              <TableCell>dietitian_name</TableCell>
              <TableCell>user_phonenumber</TableCell>
              <TableCell>biller_name</TableCell>
              <TableCell>biller_id</TableCell>
              <TableCell>branchName</TableCell>
              <TableCell>billing_notes</TableCell>
              <TableCell>discount</TableCell>
              <TableCell>dueAmount</TableCell>
              <TableCell>paidAmount</TableCell>
              <TableCell>totalAmount</TableCell>
              <TableCell>dicountapprovestatus</TableCell>
              <TableCell>view</TableCell>
              <TableCell>Delete</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {BillReport.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.id}</TableCell>
                <TableCell>{item.userid || "N/A"}</TableCell>
                <TableCell>{item.user_name || "N/A"}</TableCell>
                <TableCell>{item.dietitian_id || "N/A"}</TableCell>
                <TableCell>{item.dietitian_name || "N/A"}</TableCell>
                <TableCell>{item.user_phonenumber || "N/A"}</TableCell>
                <TableCell>{item.biller_name || "N/A"}</TableCell>
                <TableCell>{item.biller_id || "N/A"}</TableCell>
                <TableCell>{item.branchName || "N/A"}</TableCell>
                <TableCell>{item.billing_notes || "N/A"} </TableCell>
                <TableCell>{item.maxservicediscount || "N/A"}%</TableCell>
                <TableCell>{item.dueAmount || "N/A"}</TableCell>
                <TableCell>{item.paidAmount || "N/A"}</TableCell>
                <TableCell>{item.totalAmount || "N/A"}</TableCell>
                <TableCell>
                  <Switch
                    checked={item.dicountapprovestatus}
                    onChange={() =>
                      handleToggleDiscountStatus(
                        item.id,
                        item.dicountapprovestatus
                      )
                    }
                    color="primary"
                  />
                </TableCell>
                <TableCell>
                  <VisibilityIcon className="eye-icon" />
                </TableCell>
                <TableCell align="center">
                  <Button color="error" onClick={() => deleteUser(item.id)}>
                    <DeleteForeverIcon />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default BillingPending;
