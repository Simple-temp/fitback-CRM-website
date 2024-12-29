import axios from "axios";
import { useEffect, useState } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import avater from "../../public/img/avater.png"
import { Button } from "@mui/material";
import DetailsIcon from "@mui/icons-material/Details";
import { useNavigate } from "react-router";

const ShowAllUsers = () => {
  const [getData, setgetData] = useState([]);
  const navigate = useNavigate()

  useEffect(() => {
    fetchAllUser();
  }, []);
  
  const fetchAllUser = async () => {
    try {
      const response = await axios.get(`https://qwikit1.pythonanywhere.com/userProfile/`);
      const sortedData = response.data.sort((a, b) => b.id - a.id); // Sort by id (higher to lower)
      setgetData(sortedData);
    } catch (err) {
      console.log(err);
    }
  };
  

  return (
    <div>
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
                <TableCell align="left">Image</TableCell>
                <TableCell>Name</TableCell>
                <TableCell align="left">Phone Number</TableCell>
                <TableCell align="left">Email</TableCell>
                <TableCell align="left">Gender</TableCell>
                <TableCell align="left">Address</TableCell>
                <TableCell align="left">Get Appointment</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {getData.map((item) => (
                <TableRow
                  key={item.id}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell>{item.id}</TableCell>
                  <TableCell>
                    <img
                      src={item.image1 || avater}
                      alt="Avatar"
                      style={{
                        width: "50px",
                        height: "50px",
                        borderRadius: "50%", // Makes the image completely circular
                        objectFit: "cover",
                      }}
                    />
                  </TableCell>
                  <TableCell>{item.name || "N/A"}</TableCell>
                  <TableCell>{item.phonenumber|| "N/A"}</TableCell>
                  <TableCell>{item.email|| "N/A"}</TableCell>
                  <TableCell>{item.gender|| "N/A"}</TableCell>
                  <TableCell>{item.address|| "N/A"}</TableCell>
                  {/* <TableCell>
                    {Array.isArray(item.height) && item.height.length > 0
                      ? item.height[0].value
                      : "No height data"}
                  </TableCell>
                  <TableCell>
                    {Array.isArray(item.weight) && item.weight.length > 0
                      ? item.weight[0].value
                      : "No weight data"}
                  </TableCell> */}
                                  <TableCell align="center">
                  <Button color="error" onClick={() => navigate(`${item.id}`)}>
                    <DetailsIcon />
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

export default ShowAllUsers;
