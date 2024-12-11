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

const ShowAllUsers = () => {
  const [getData, setgetData] = useState([]);

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
            width: "100%", // Full width
            overflowX: "auto", // Enable horizontal scrolling on smaller screens
          }}
        >
          <Table
            sx={{
              minWidth: 600, // Adjust minimum width
            }}
            size="small"
            aria-label="a dense table"
          >
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell align="center">Image</TableCell>
                <TableCell>Name</TableCell>
                <TableCell align="center">Phone Number</TableCell>
                <TableCell align="center">Email</TableCell>
                <TableCell align="center">Gender</TableCell>
                <TableCell align="center">Address</TableCell>
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
