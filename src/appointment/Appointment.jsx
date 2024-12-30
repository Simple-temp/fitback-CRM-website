import axios from "axios";
import { useEffect, useState } from "react";
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

const Appointment = () => {
  const [getData, setGetData] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setGetData((prevData) =>
        prevData.map((item) => {
          const now = new Date();
          const startTime = new Date(item.starTime);
          const endTime = new Date(item.endTime);

          if (now < startTime) {
            item.status = "upcoming";
            item.remainingTime = formatTimeDifference(startTime - now);
          } else if (now >= startTime && now <= endTime) {
            item.status = "ongoing";
            item.remainingTime = formatTimeDifference(endTime - now);
          } else {
            item.status = "expired";
            item.remainingTime = "Time over";
          }
          return item;
        })
      );
    }, 1000);

    return () => clearInterval(interval);
  }, [getData]);

  const fetchData = async () => {
    try {
      const response = await axios.get(
        `https://qwikit1.pythonanywhere.com/appointment`
      );
      setGetData(
        response.data.map((item) => ({
          ...item,
          status: "upcoming",
          remainingTime: "",
        }))
      );
    } catch (err) {
      console.log(err);
    }
  };

  const formatTimeDifference = (milliseconds) => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  const deleteUser = async (id) => {
    try {
      await axios.delete(
        `https://qwikit1.pythonanywhere.com/appointment/${id}`
      );
      toast.success("User Deleted successfully", { theme: "colored" });
      fetchData();
    } catch (err) {
      console.log(err);
      toast.error("Failed to delete user", { theme: "colored" });
    }
  };

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    })}`;
  };

  return (
    <div>
      <h1>Appointment Section</h1>
      <ToastContainer
        position="bottom-center"
        autoClose={2000}
        theme="colored"
      />
      <div style={{ overflowX: "auto" }}>
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
                <TableCell>userId</TableCell>
                <TableCell>userName</TableCell>
                <TableCell>supportUserId</TableCell>
                <TableCell>email</TableCell>
                <TableCell>phonenumber</TableCell>
                <TableCell>appointmentDate</TableCell>
                <TableCell>starTime</TableCell>
                <TableCell>endTime</TableCell>
                <TableCell>runningtime</TableCell>
                <TableCell>Delete</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {getData.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.id}</TableCell>
                  <TableCell>{item.userId || "N/A"}</TableCell>
                  <TableCell>{item.userName || "N/A"}</TableCell>
                  <TableCell>{item.supportUserId || "N/A"}</TableCell>
                  <TableCell>{item.email || "N/A"}</TableCell>
                  <TableCell>{item.phonenumber || "N/A"}</TableCell>
                  <TableCell>{item.appointmentDate || "N/A"}</TableCell>
                  <TableCell>
                    {formatDateTime(item.starTime) || "N/A"}
                  </TableCell>
                  <TableCell>{formatDateTime(item.endTime) || "N/A"}</TableCell>
                  <TableCell
                    style={{
                      color: item.status === "expired" ? "#fff" : "#fff",
                      backgroundColor:
                        item.status === "expired"
                          ? "red"
                          : item.status === "ongoing"
                            ? "green"
                            : "transparent",
                    }}
                  >
                    {item.remainingTime}
                  </TableCell>
                  <TableCell>
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
    </div>
  );
};

export default Appointment;
