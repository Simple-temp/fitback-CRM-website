import { useParams } from "react-router";
import logo from "../../public/img/logo.png";
import "./Doctors.css";
import { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "@mui/material";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const CreatePrescription = () => {
  const { id } = useParams();
  const [getuser, setGetuser] = useState({});

  const loggedInUser = localStorage.getItem("loggedInUser");
  const userParse = loggedInUser ? JSON.parse(loggedInUser) : null;

  const fetchuser = async () => {
    try {
      const response = await axios.get(
        `https://qwikit1.pythonanywhere.com/userProfile/${id}`
      );
      setGetuser(response.data);
      console(response.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchuser();
  }, []);

  const handleDownloadPDF = () => {

    const actionNote = document.querySelector(".doctor-field-border");
    const originalNote = actionNote.innerHTML;
    actionNote.style.paddingBottom = "10px";

    const input = document.querySelector(".inner-doctor-container"); // Target the main container
    html2canvas(input, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
  
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
  
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`Precription${id}.pdf`);

      actionNote.style.marginTop = originalNote;
    });

  };


  return (
    <div className="main-doctor-container">
      <h1>Create prescription</h1>
      <h3>ID : {id}</h3>
      <div className="container-doctor">
        <div className="inner-doctor-container">
          <div className="doctor-Header">
            <div className="left-part-doctor">
              <div className="logo-fitback">
                <img src={logo} alt="" className="doc-header-logo" />
              </div>
            </div>
            <div className="right-part-doctor">
              <div className="doctor-information">
                <h2>{userParse?.name}</h2>
                <p>Phone : {userParse?.phonenumber}</p>
                <p>Experience : {userParse?.experience} years</p>
                <p>Email : {userParse?.email}</p>
                <p>City : {userParse?.city}</p>
              </div>
            </div>
          </div>
          <div className="inner-clinet-info">
            <p className="doctor-field-border">Name : {getuser?.name}</p>
            <p className="doctor-field-border">Age : {getuser?.age}</p>
            <p className="doctor-field-border">Sex : {getuser?.gender}</p>
            <p className="doctor-field-border">
              {" "}
              Weight :{" "}
              {Array.isArray(getuser.weight) && getuser.weight.length > 0
                ? getuser.weight[0].value
                : "No weight data"}
            </p>
            <p className="doctor-field-border">
              Date : {/* {new Date(getuser.systemdate).toLocaleString()} */}
            </p>
          </div>
          <div className="doctor-body-part">
            <div className="left-doctor-body-part">
              <p className="doctor-advice">Advice1 : </p>
              <p className="doctor-advice">Advice2 : </p>
              <p className="doctor-advice">Advice3 : </p>
              <p className="doctor-advice">Advice4 : </p>
            </div>
            <div className="right-doctor-body-part">
              <p className="doctor-medechine">Medichin-1 : </p>
              <p className="doctor-medechine">Medichin-1 : </p>
              <p className="doctor-medechine">Medichin-1 : </p>
              <p className="doctor-medechine">Medichin-1 : </p>
            </div>
          </div>
        </div>
        <Button
        onClick={handleDownloadPDF}
          style={{margin:"auto", display:"block"}}
          type="submit"
          variant="contained"
          color="primary"
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg custom-btn-all"
        >
          Download Prescription
        </Button>
      </div>
    </div>
  );
};

export default CreatePrescription;
