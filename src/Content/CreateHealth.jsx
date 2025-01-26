import axios from "axios";
import { useState } from "react";
import { toast, ToastContainer } from "react-toastify";

const CreateHealth = () => {
  const [exerciseName, setExerciseName] = useState("");
  const [video1, setVideo1] = useState(null);
  const [youtubeLink, setYoutubeLink] = useState("");
  const [responseMessage, setResponseMessage] = useState("");

  const createExercise = async () => {
    try {
      const formData = new FormData();
      formData.append("healthtips_name", exerciseName);
      if (video1) {
        formData.append("video1", video1);
      } else {
        formData.append("video1", "");
      }
      formData.append("youtubelink", youtubeLink);

      const response = await axios.post(
        "https://qwikit1.pythonanywhere.com/healthTipsVideos/new",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log(response);
      toast.success("Exercise created successfully!", { theme: "colored" });
    } catch (err) {
      console.error(err);
      setResponseMessage("Error creating exercise.");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    createExercise();
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Create New Health Tips</h1>
      <ToastContainer
        position="bottom-center"
        autoClose={2000}
        theme="colored"
      />
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">
            Exercise Name:
          </label>
          <input
            type="text"
            value={exerciseName}
            onChange={(e) => setExerciseName(e.target.value)}
            className="border rounded p-2 w-full"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">
            Video 1 (File):
          </label>
          <input
            type="file"
            onChange={(e) => setVideo1(e.target.files[0])}
            className="border rounded p-2 w-full"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">
            YouTube Link:
          </label>
          <input
            type="text"
            value={youtubeLink}
            onChange={(e) => setYoutubeLink(e.target.value)}
            className="border rounded p-2 w-full"
            required
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 custom-btn-all"
        >
          Create Heath Tips
        </button>
      </form>
      {responseMessage && (
        <p className="mt-4 text-green-600">{responseMessage}</p>
      )}
    </div>
  );
};

export default CreateHealth;

