import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { toast, ToastContainer } from "react-toastify";

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "100vh",
    backgroundColor: "#f8f9fa",
    padding: "20px",
  },
  heading: {
    fontSize: "2.5rem",
    fontWeight: "bold",
    marginBottom: "30px",
    color: "#343a40",
  },
  formContainer: {
    backgroundColor: "#fff",
    borderRadius: "10px",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    padding: "30px",
    width: "100%",
    maxWidth: "500px",
    textAlign: "center",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
    marginTop: "20px",
  },
  label: {
    fontWeight: "bold",
    color: "#495057",
    textAlign: "left",
    marginBottom: "5px",
  },
  input: {
    width: "100%",
    padding: "10px",
    border: "1px solid #ced4da",
    borderRadius: "5px",
    fontSize: "1rem",
    backgroundColor: "#f8f9fa",
  },
  button: {
    padding: "10px 15px",
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "1rem",
    fontWeight: "bold",
    transition: "background-color 0.3s",
  },
  buttonHover: {
    backgroundColor: "#0056b3",
  },
  info: {
    margin: "5px 0",
    fontSize: "1rem",
    color: "#495057",
  },
};

const AppintmentList = () => {
  const { id } = useParams();

  const [getData, setGetData] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [existingAppointments, setExistingAppointments] = useState([]);

  useEffect(() => {
    fetchData();
    fetchAppointments();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get(
        `https://qwikit1.pythonanywhere.com/userProfile/${id}`
      );
      setGetData(response.data);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchAppointments = async () => {
    try {
      const response = await axios.get(
        `https://qwikit1.pythonanywhere.com/appointment`
      );
      setExistingAppointments(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  const loggedInUser = localStorage.getItem("loggedInUser");
  const userParse = loggedInUser ? JSON.parse(loggedInUser) : null;

  const isAppointmentOverlapping = () => {
    const newStart = new Date(startDate).getTime();
    const newEnd = new Date(endDate).getTime();

    return existingAppointments.some((appointment) => {
      const existingStart = new Date(appointment.starTime).getTime();
      const existingEnd = new Date(appointment.endTime).getTime();

      return (
        (newStart >= existingStart && newStart < existingEnd) ||
        (newEnd > existingStart && newEnd <= existingEnd) ||
        (newStart <= existingStart && newEnd >= existingEnd)
      );
    });
  };

  const handleSubmitAppointment = async () => {
    if (!startDate || !endDate) {
      alert("Please select both start and end times.");
      return;
    }

    if (new Date(startDate) >= new Date(endDate)) {
      alert("End time must be after the start time.");
      return;
    }

    if (isAppointmentOverlapping()) {

      toast.error("Already Selected Please choose a different time.", { theme: "colored" });
      return ;

    }

    try {
      const appointmentDate = new Date().toISOString().split("T")[0]; // Current date in YYYY-MM-DD format

      const AppointmentData = {
        userId: getData.id,
        userName: getData.name,
        supportUserId: userParse?.id,
        phonenumber: getData.phonenumber,
        email: userParse?.email,
        expire: false,
        available: false,
        appointmentDate,
        starTime: startDate,
        endTime: endDate,
      };

      const response = await axios.post(
        `https://qwikit1.pythonanywhere.com/appointment/new`,
        AppointmentData
      );

      console.log("Appointment Submitted:", response.data);
      toast.success("Appointment successfully submitted!", { theme: "colored" });
    } catch (err) {
      console.log(err);
      alert("Failed to submit appointment.");
    }
  };

  return (
    <div>
      <ToastContainer
        position="bottom-center"
        autoClose={2000}
        theme="colored"
      />
      <div style={styles.container}>
        <h1 style={styles.heading}>Appointment Form</h1>
        <div style={styles.formContainer}>
          <p style={styles.info}>
            <strong>User ID:</strong> {getData.id}
          </p>
          <p style={styles.info}>
            <strong>User Name:</strong> {getData.name}
          </p>
          <p style={styles.info}>
            <strong>Support User ID:</strong> {userParse?.id}
          </p>
          <p style={styles.info}>
            <strong>Phone Number:</strong> {getData.phonenumber}
          </p>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmitAppointment();
              isAppointmentOverlapping();
            }}
            style={styles.form}
          >
            <label style={styles.label}>
              Start Date & Time:
              <input
                type="datetime-local"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                required
                style={styles.input}
              />
            </label>
            <label style={styles.label}>
              End Date & Time:
              <input
                type="datetime-local"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                required
                style={styles.input}
              />
            </label>
            <button
              type="submit"
              style={styles.button}
              className="custom-btn-all"
            >
              Submit Appointment
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AppintmentList;
