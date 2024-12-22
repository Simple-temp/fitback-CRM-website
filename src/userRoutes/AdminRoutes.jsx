import { useEffect, useState } from "react";
import axios from "axios";
import ShowCreatedUser from "./ShowCreatedUser";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AdminRoutes = () => {
  const [getData, setGetData] = useState([]);
  const [searchNumber, setSearchNumber] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [userType, setUserType] = useState(""); 

  // Fetch all user data
  useEffect(() => {
    fetchAllUserData();
  }, []);

  const fetchAllUserData = async () => {
    try {
      const response = await axios.get(`https://qwikit1.pythonanywhere.com/userProfile/`);
      const sortedData = response.data.sort((a, b) => b.id - a.id);
      setGetData(sortedData);
      setFilteredData(sortedData); // Initially show all users
    } catch (err) {
      console.log(err);
    }
  };

  // const handleInputChange = (e) => {
  //   const input = e.target.value;
  //   setSearchNumber(input);

  //   const filteredByNumber = getData.filter((user) => user.phonenumber?.includes(input));
  //   setFilteredData(filteredByNumber);
  // };

  const handleInputChange = (e) => {
    const input = e.target.value;
    setSearchNumber(input);
  
    if (!input) {
      // Reset to show all users if input is cleared
      setFilteredData(getData);
      return;
    }
  
    const idMatches = getData.filter((user) =>
      user.id?.toString().includes(parseInt(input))
    );
    const nameMatches = getData.filter((user) =>
      user.name?.toLowerCase().includes(input.toLowerCase())
    );
    const phoneMatches = getData.filter((user) =>
      user.phonenumber?.includes(input)
    );
  
    // Merge unique results from all filters
    const mergedResults = [...new Set([...idMatches, ...nameMatches, ...phoneMatches])];
  
    setFilteredData(mergedResults);
  
    // if (!mergedResults.length) {
    //   toast.error("No matching user found");
    // }
  };

  const handleDropdownChange = (e) => {
    const selectedType = e.target.value;
    setUserType(selectedType);

    filterUsers(searchNumber, selectedType); // Update filtering on dropdown change
  };


  const handleKeyPress = (e) => {
    if (e.key === "Enter" && searchNumber.length === 11) {
      // Check if a user with the exact 11-digit number exists
      const match = getData.some((user) => user.phonenumber === searchNumber);

      if (!match) {
        toast.error("User is not found");
      }
    }
  };

  const filterUsers = (number, type) => {
    let filtered = getData;

    if (number) {
      filtered = filtered.filter((user) => user.phonenumber?.includes(number));
    }

    if (type) {
      if (type === "noType") {
        // Filter users with no user_type (blank or explicitly "")
        filtered = filtered.filter((user) => user.usertype === "");
      } else {
        filtered = filtered.filter((user) => user.usertype === type);
      }
    }

    setFilteredData(filtered);

    if (!filtered.length && number.length === 11) {
      toast.error("User is not found");
    }
  };

  const getUserTypeLabel = () => {
    switch (userType) {
      case "Fitback":
        return "Fitback";
      case "Reset":
        return "Reset";
      case "Aesthetic":
        return "Aesthetic";
      case "noType":
        return "General User";
      default:
        return userType;
    }
  };

  return (
    <div>
      <ToastContainer position="bottom-center" autoClose={2000} theme="colored" />
      <h2 style={{ marginLeft: "20px" }}>{filteredData.length > 0
          ? `Showing ${filteredData.length} user(s) for ${getUserTypeLabel()}`
          : `No users to display for ${getUserTypeLabel()}`}</h2>
      <br />
      {/* Search Field */}
      <input
        type="text"
        placeholder="Search"
        value={searchNumber}
        onChange={handleInputChange}
        onKeyDown={handleKeyPress}
        style={{ padding: "10px 10px 10px 30px", width: "250px", marginBottom: "20px", border: "2px solid rgb(251, 37, 115)", borderRadius:"7px", marginLeft: "20px" }}
      />
       <select
          value={userType}
          onChange={handleDropdownChange}
          style={{ padding: "10px", width: "150px" }}
        >
          <option value="">All User Types</option> {/* No filter */}
          <option value="noType">General</option> {/* Blank user type */}
          <option value="Fitback">Fitback</option>
          <option value="Reset">Reset</option>
          <option value="Aesthetic">Aesthetic</option>
        </select>
      <br />
      {/* Display Filtered User List */}
      <ShowCreatedUser getData={filteredData} fetchAllUserData={fetchAllUserData} />
    </div>
  );
};

export default AdminRoutes;
