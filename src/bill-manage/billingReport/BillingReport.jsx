import axios from "axios";
import { useEffect, useState } from "react";

// import BorderColorIcon from "@mui/icons-material/BorderColor";
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

const BillingReport = () => {
  const [BillReport, BillReportsetGet] = useState([]);

  const GetsubmitBillReport = async () => {
    try {
      const response = await axios.get(
        `https://qwikit1.pythonanywhere.com/billingReport`
      );
      BillReportsetGet(response.data);
      console.log("Get :", response.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    GetsubmitBillReport();
    console.log(BillReport);
  }, []);

  //   const controlHandleClick = (id) => {
  //     console.log(id);
  //   };

  // delete user

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

  //   const deleteAllUsers = async () => {
  //     try {
  //       // Fetch all data
  //       const response = await axios.get(
  //         "https://qwikit1.pythonanywhere.com/billingReport/"
  //       );
  //       const allData = response.data;

  //       console.log("Fetched Data for Deletion:", allData); // Debug log

  //       // Ensure there is data to delete
  //       if (!allData || allData.length === 0) {
  //         toast.info("No data available to delete", { theme: "colored" });
  //         return;
  //       }

  //       // Loop through and delete each record
  //       for (const record of allData) {
  //         try {
  //           console.log(`Deleting record with id: ${record.id}`); // Debug log
  //           await axios.delete(
  //             `https://qwikit1.pythonanywhere.com/billingReport/${record.id}`
  //           );
  //         } catch (err) {
  //           console.error(`Failed to delete record with id: ${record.id}`, err);
  //         }
  //       }

  //       // Notify and refresh data
  //       GetsubmitBillReport();
  //       toast.success("All records deleted successfully", { theme: "colored" });
  //     } catch (err) {
  //       console.error("Error fetching or deleting data", err);
  //       toast.error("Failed to delete all records", { theme: "colored" });
  //     }
  //   };

  return (
    <div>
      <h1>Billing report</h1>
      {/* <Button
          color="error"
          onClick={() => {
            if (
              window.confirm("Are you sure you want to delete all records?")
            ) {
              deleteAllUsers();
            }
          }}
        >
          <DeleteForeverIcon />
        </Button> */}
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
              <TableCell>user_phonenumber</TableCell>
              <TableCell>biller_name</TableCell>
              <TableCell>biller_id</TableCell>
              <TableCell>branchName</TableCell>
              <TableCell>billing_notes</TableCell>
              <TableCell>dueAmount</TableCell>
              <TableCell>paidAmount</TableCell>
              <TableCell>totalAmount</TableCell>
              {/* <TableCell>discount</TableCell> */}
              <TableCell>Delete</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {BillReport.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.id}</TableCell>
                <TableCell>{item.userid || "N/A"}</TableCell>
                <TableCell>{item.user_name || "N/A"}</TableCell>
                <TableCell>{item.user_phonenumber || "N/A"}</TableCell>
                <TableCell>{item.biller_name || "N/A"}</TableCell>
                <TableCell>{item.biller_id || "N/A"}</TableCell>
                <TableCell>{item.branchName || "N/A"}</TableCell>
                <TableCell>{item.billing_notes || "N/A"} </TableCell>
                <TableCell>{item.dueAmount || "N/A"}</TableCell>
                <TableCell>{item.paidAmount || "N/A"}</TableCell>
                <TableCell>{item.totalAmount || "N/A"}</TableCell>
                {/* <TableCell>{item.discount || "N/A"}(Taka)</TableCell> */}
                {/* <TableCell align="center">
                  <Button
                    color="primary"
                    onClick={() => controlHandleClick(item.id)}
                  >
                    <BorderColorIcon />
                  </Button>
                </TableCell> */}
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

export default BillingReport;
