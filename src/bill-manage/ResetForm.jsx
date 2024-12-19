import "./ResetForm.css";
import reset from "../../public/img/reset.png";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { useEffect, useState } from "react";
import axios from "axios";


const ResetForm = () => {
  //===================
  const [getAllUser, SetGetAllUser] = useState([]);
  const [ number, serGetnumber ] = useState("")
  const [ filterUserByNumber, SetGetuserByNumber ] = useState({})

  useEffect(() => {
    fetchAllPublicUser();
  }, [getAllUser]);
  const fetchAllPublicUser = async () => {
    try {
      const response = await axios.get( `https://qwikit1.pythonanywhere.com/userProfile/` );
      SetGetAllUser(response.data);
      if(number){
        const UserByNumber = getAllUser.find((user) =>  user.phonenumber === number)
        SetGetuserByNumber(UserByNumber)
      }
    } catch (err) {
      console.error(err);
    }
  };


  const handleDownloadPDF = () => {

    const element = document.querySelector(".innter-container");
    html2canvas(element, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save("reset-form.pdf");
    });
  };

  return (
    <div className="main-containerr">
      <div className="innter-container">
        <div className="header-part-reset">
          <img src={reset} alt="" className="reset-logo" />
        </div>
        <div className="date-div">
          <label>Date</label> <input type="text" className="inner-field" />
        </div>
        <div className="body-part">
          <div className="body-innter">
            <div className="name-field">
              <label>Name:</label>
              <input type="text" className="inner-field name-width" value={filterUserByNumber.name || ""} />
              <label>Age:</label>
              <input type="text" className="inner-field" value={filterUserByNumber.age || ""}/>
              <label>Sex:</label>
              <input type="text" className="inner-field sex-width" value={filterUserByNumber.gender || ""}/>
            </div>
          </div>
          <div className="body-innter2">
            <div className="name-field2">
              <label>Address:</label>
              <input type="text" className="inner-field full-width" value={filterUserByNumber.address || ""}/>
              <label>Height:</label>
              <input type="text" className="inner-field" value={Array.isArray(filterUserByNumber.height) && filterUserByNumber.height.length > 0
                ? filterUserByNumber.height[0].value
                : ""}/>
            </div>
          </div>
          <div className="body-innter">
            <div className="name-field">
              <label>Birth date:</label>
              <input type="text" className="inner-field" value={filterUserByNumber.dateofbirth || ""}/>
              <label> Occupation:</label>
              <input type="text" className="inner-field" value={filterUserByNumber.occupation || ""}/>
              <label>City:</label>
              <input type="text" className="inner-field width-city" value={filterUserByNumber.city || ""}/>
            </div>
          </div>
          <div className="body-innter2">
            <div className="name-field2">
              <label>E-mail address :</label>
              <input type="text" className="inner-field email-width" value={filterUserByNumber.email || ""}/>
              <label>Phone:</label>
              <input type="text" className="inner-field" onBlur={(e)=> serGetnumber(e.target.value)}/>
            </div>
          </div>
          <div className="body-innter2">
            <div className="name-field2">
              <label> Facebook ID:</label>
              <input type="text" className="inner-field email-width" value={""}/>
              <label>Reference:</label>
              <input type="text" className="inner-field"/>
            </div>
          </div>
          <div className="body-innter2">
            <div className="name-field2 aes">
              <label> *How you came to know about FitBack Aesthetic? :</label>
              <input type="text" className="inner-field aesthetic" />
            </div>
          </div>

          <div className="cigarettes">
            <label htmlFor="">Do you use cigarettes/tobacco?:</label>
            <input type="checkbox" name="yes" id="" className="yes" /> yes
            <input type="checkbox" name="no" id="" className="no" /> No
          </div>

          <div className="conditions">
            <label htmlFor="">
              {" "}
              Check the conditions that apply member of your immediate
              relatives:
            </label>
            <div className="inner-condition">
              <div>
                <input type="checkbox" name="yes" id="" />
                <label htmlFor="">Asthma</label>
              </div>
              <div>
                <input type="checkbox" name="yes" id="" />
                <label htmlFor="">Cardiac disease</label>
              </div>
              <div>
                <input type="checkbox" name="yes" id="" />
                <label htmlFor="">Hypertension</label>
              </div>
              <div>
                <input type="checkbox" name="yes" id="" />
                <label htmlFor="">Thyroid</label>
              </div>
              <div>
                <input type="checkbox" name="yes" id="" />
                <label htmlFor="">PCOS/PCOD</label>
              </div>
              <div>
                <input type="checkbox" name="yes" id="" />
                <label htmlFor="">Diabetes</label>
              </div>
              <div>
                <input type="checkbox" name="yes" id="" />
                <label htmlFor="">Cancer</label>
              </div>
              <div>
                <input type="checkbox" name="yes" id="" />
                <label htmlFor="">.....</label>
              </div>
            </div>
          </div>

          <div className="conditions">
            <label htmlFor=""> Personal Issues:</label>
            <div className="inner-condition">
              <div>
                <input type="checkbox" name="yes" id="" />
                <label htmlFor="">Asthma</label>
              </div>
              <div>
                <input type="checkbox" name="yes" id="" />
                <label htmlFor="">Cardiac disease</label>
              </div>
              <div>
                <input type="checkbox" name="yes" id="" />
                <label htmlFor="">Hypertension</label>
              </div>
              <div>
                <input type="checkbox" name="yes" id="" />
                <label htmlFor="">Thyroid</label>
              </div>
              <div>
                <input type="checkbox" name="yes" id="" />
                <label htmlFor="">PCOS/PCOD</label>
              </div>
              <div>
                <input type="checkbox" name="yes" id="" />
                <label htmlFor="">Diabetes</label>
              </div>
              <div>
                <input type="checkbox" name="yes" id="" />
                <label htmlFor="">Cancer</label>
              </div>
              <div>
                <input type="checkbox" name="yes" id="" />
                <label htmlFor="">.....</label>
              </div>
            </div>
          </div>

          <div className="message">
            <label htmlFor=""> Are you currently taking any medication?</label>
            <textarea name="" id="" className="message-text"></textarea>
          </div>
          <div className="message">
            <label htmlFor="">
              {" "}
              Are you currently taking Other Weight loss
              medicine/Supplement/Services/Injection{" "}
            </label>
            <textarea name="" id="" className="message-text"></textarea>
          </div>
          <div className="message">
            <label htmlFor=""> Do you have any medication allergies</label>
            <textarea name="" id="" className="message-text"></textarea>
          </div>
          <div className="message">
            <label htmlFor="">
              {" "}
              Any record of known or unknown skin disease?
            </label>
            <textarea name="" id="" className="message-text"></textarea>
          </div>
        </div>
        <button className="download-btn" onClick={handleDownloadPDF}>
          Download PDF
        </button>
      </div>
    </div>
  );
};

export default ResetForm;
