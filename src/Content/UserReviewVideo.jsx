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
  
  const UserReviewVideo = () => {
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
          `https://qwikit1.pythonanywhere.com/userReviewVideo`
        );
        setgetExcercise(response.data);
      } catch (err) {
        console.log(err);
      }
    };
  
    const handleOpenVideo = (url) => {
      setVideoUrl(url);
      setOpen(true);
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
        formData.append("user_image", currentExercise.user_image);
        formData.append("review_video", currentExercise.review_video);
        formData.append("youtubelink", currentExercise.youtubelink);
        formData.append("review_details", currentExercise.review_details);
        formData.append("systemdate", currentExercise.systemdate);
  
        const response = await axios.put(
          `https://qwikit1.pythonanywhere.com/userReviewVideo/${currentExercise.id}`,
          currentExercise
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
                      "Review Video",
                      "Youtube Link",
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
                          src={item.user_image || avater}
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
                      <TableCell>{item.review_video || "General"}</TableCell>
                      <TableCell>
                        {item.youtubelink ? (
                          <Button
                            color="primary"
                            onClick={() => handleOpenVideo(item.youtubelink)}
                          >
                            Play Video
                          </Button>
                        ) : (
                          "N/A"
                        )}
                      </TableCell>
                      <TableCell>{item.review_details || "N/A"}</TableCell>
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
                handleChange("user_image", e.currentTarget.files[0])
              }
            />
            <TextField
              fullWidth
              margin="normal"
              label="Video URL"
              value={currentExercise?.review_video || ""}
              onChange={(e) => handleChange("review_video", e.target.value)}
            />
            <TextField
              fullWidth
              margin="normal"
              label="YouTube Link"
              value={currentExercise?.youtubelink || ""}
              onChange={(e) => handleChange("youtubelink", e.target.value)}
            />
            <TextField
              fullWidth
              margin="normal"
              label="Review Details"
              value={currentExercise?.review_details || ""}
              onChange={(e) => handleChange("review_details", e.target.value)}
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
  
  export default UserReviewVideo;

