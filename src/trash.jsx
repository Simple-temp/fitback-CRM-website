
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { useEffect, useState } from "react";
import axios from "axios";

const TrashPage = () => {
  const [ getTrash, setTrashData] = useState([])

  useEffect(() => {
    fetchTrashData(); // Fetch deleted users
  }, []);
  
  const fetchTrashData = async () => {
    try {
      const response = await axios.get(
        `https://qwikit1.pythonanywhere.com/deskProfile/`
      );
      const trashedUsers = response.data.filter((user) => user.deleted); // Only deleted users
      setTrashData(trashedUsers);
    } catch (err) {
      console.error("Error fetching trashed users:", err);
    }
  };

  return (
    <div>
      <h1>Trash Page</h1>
      {getTrash.length === 0 ? (
        <p>No users in trash.</p>
      ) : (
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 850 }} size="small" aria-label="a dense table">
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Name</TableCell>
                <TableCell align="center">Phone</TableCell>
                <TableCell align="center">Address</TableCell>
                <TableCell align="center">Experience</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {getTrash.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.id}</TableCell>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{item.phonenumber}</TableCell>
                  <TableCell>{item.address}</TableCell>
                  <TableCell>{item.experience}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </div>
  );
};

export default TrashPage;
