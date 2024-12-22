import {
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  TextField,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import axios from "axios";
import { useEffect, useState } from "react";
import avater from "../../public/img/avater.png";

const UserReview = () => {
  const [getExcercise, setgetExcercise] = useState([]);
  const [open, setOpen] = useState(false);
  const [videoUrl, setVideoUrl] = useState("");
  const [updateOpen, setUpdateOpen] = useState(false);
  const [currentExercise, setCurrentExercise] = useState(null);

  useEffect(() => {
    fetchExcercise();
  }, []);

  const fetchExcercise = async () => {
    try {
      const response = await axios.get(
        `https://qwikit1.pythonanywhere.com/userReviews`
      );
      setgetExcercise(response.data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleCloseVideo = () => {
    setVideoUrl("");
    setOpen(false);
  };

  const handleOpenUpdate = (exercise) => {
    setCurrentExercise(exercise);
    setUpdateOpen(true);
  };

  const handleCloseUpdate = () => {
    setCurrentExercise(null);
    setUpdateOpen(false);
  };

  const handleUpdateSubmit = async () => {
    if (!currentExercise) return;

    try {
      const formData = new FormData();
      formData.append("user_name", currentExercise.user_name);
      if (currentExercise.user_image_upload && currentExercise.user_image_upload instanceof File) {
        formData.append("user_image_upload", currentExercise.user_image_upload);
      }
      formData.append("review_text", currentExercise.review_text);
      formData.append("rating", currentExercise.rating);
      
      if (currentExercise.review_image && currentExercise.review_image instanceof File) {
        formData.append("review_image", currentExercise.review_image);
      }
      formData.append("systemdate", currentExercise.systemdate ? currentExercise.systemdate : new Date().toISOString() );  

      const response = await axios.put(
        `https://qwikit1.pythonanywhere.com/userReviews/${currentExercise.id}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      console.log("Updated:", response.data);

      // Refresh the data after update
      fetchExcercise();
      handleCloseUpdate();
    } catch (err) {
      console.error(err);
    }
  };

  const handleChange = (field, value) => {
    setCurrentExercise({ ...currentExercise, [field]: value });
  };

  const deleteUser = (id) => {
    // Add functionality for delete
    console.log(id);
  };

  return (
    <div>
      <div style={{ width: "100%", overflowX: "auto" }}>
        <Paper sx={{ width: "100%", overflow: "hidden" }}>
          <div
            style={{
              height: "550px",
              overflowY: "auto",
              width: "100%",
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
          >
            <style>
              {`
                  div::-webkit-scrollbar {
                    display: none;
                  }
                `}
            </style>
            <Table
              stickyHeader
              sx={{
                minWidth: 600,
                borderCollapse: "collapse",
              }}
              aria-label="sticky table"
            >
              <TableHead>
                <TableRow>
                  {[
                    "ID",
                    "User ID",
                    "Image",
                    "User Name",
                    "Rating",
                    "Review Details",
                    "Date",
                    "Update",
                    "Delete",
                  ].map((header, index) => (
                    <TableCell
                      key={index}
                      align={index === 1 ? "center" : "left"}
                      sx={{
                        fontWeight: "bold",
                        whiteSpace: "nowrap",
                        backgroundColor: "white",
                      }}
                    >
                      {header}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>

              <TableBody>
                {getExcercise.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.id}</TableCell>
                    <TableCell>{item.user_id || "N/A"}</TableCell>
                    <TableCell>
                      {" "}
                      <img
                        src={item.user_image_upload || avater}
                        alt="Avatar"
                        style={{
                          width: "50px",
                          height: "50px",
                          borderRadius: "50%",
                          objectFit: "cover",
                        }}
                      />{" "}
                    </TableCell>
                    <TableCell>{item.user_name || "N/A"}</TableCell>
                    <TableCell>{item.rating || "N/A"}</TableCell>
                    <TableCell>{item.review_text || "N/A"}</TableCell>
                    <TableCell>
                      {new Date(item.systemdate).toLocaleString()}
                    </TableCell>
                    <TableCell align="left">
                      <Button
                        color="primary"
                        onClick={() => handleOpenUpdate(item)}
                      >
                        <BorderColorIcon />
                      </Button>
                    </TableCell>
                    <TableCell align="left">
                      <Button color="error" onClick={() => deleteUser(item.id)}>
                        <DeleteForeverIcon />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Paper>
      </div>

      {/* Video Popup */}
      <Dialog open={open} onClose={handleCloseVideo} maxWidth="md" fullWidth>
        <DialogContent>
          <IconButton
            aria-label="close"
            onClick={handleCloseVideo}
            style={{ position: "absolute", right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
          {videoUrl && (
            <iframe
              width="100%"
              height="400"
              src={videoUrl.replace("watch?v=", "embed/")}
              title="YouTube video"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          )}
        </DialogContent>
      </Dialog>

      {/* Update Popup */}
      <Dialog open={updateOpen} onClose={handleCloseUpdate} maxWidth="sm">
        <DialogTitle>Update Review</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            margin="normal"
            label="Review User Name"
            value={currentExercise?.user_name || ""}
            onChange={(e) => handleChange("user_name", e.target.value)}
          />
          <TextField
            fullWidth
            type="file"
            margin="normal"
            onChange={(e) =>
              handleChange("user_image_upload", e.currentTarget.files[0])
            }
          />
          <TextField
            fullWidth
            margin="normal"
            label="Rating"
            value={currentExercise?.rating || ""}
            onChange={(e) => handleChange("rating", e.target.value)}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Review Details"
            value={currentExercise?.review_text || ""}
            onChange={(e) => handleChange("review_text", e.target.value)}
          />
          <TextField
            fullWidth
            margin="normal"
            type="date"
            value={currentExercise?.systemdate || ""}
            onChange={(e) => handleChange("systemdate", e.target.value)}
          />
          <Button
            variant="contained"
            className="custom-btn-all"
            onClick={handleUpdateSubmit}
            sx={{ mt: 2 }}
          >
            Update
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UserReview;
