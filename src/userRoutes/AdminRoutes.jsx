import { useEffect, useState } from "react";
import axios from "axios";
import ShowCreatedUser from "./ShowCreatedUser";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AdminRoutes = () => {
  const [getData, setGetData] = useState([]);

  // Get All user Data
  useEffect(() => {
      fetchAllUserData();
  }, []);

  const fetchAllUserData = async () => {
      try {
          const response = await axios.get(`https://qwikit1.pythonanywhere.com/userProfile/`);
          const sortedData = response.data.sort((a, b) => b.id - a.id); 
          setGetData(sortedData);
      } catch (err) {
          console.log(err);
      }
  };

  // Get user from LocalStorage
  const [userData, setUserData] = useState(null);
  console.log(userData)

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = () => {
    try {
      const loggedInUser = localStorage.getItem("loggedInUser");
      if (loggedInUser) {
        setUserData(JSON.parse(loggedInUser));
      } else {
        console.error("No logged-in user data found");
      }
    } catch (error) {
      console.error("Error retrieving user data:", error);
    }
  };

  return (
    <div>
      <ToastContainer position="bottom-center" autoClose={2000} theme="colored"/>
      <h2>Show user List</h2>
      <br />
      <ShowCreatedUser getData={getData} fetchAllUserData={fetchAllUserData}/>
    </div>
  );
};

export default AdminRoutes;
