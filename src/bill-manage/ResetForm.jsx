import "./ResetForm.css";
import reset from "../../public/img/reset.png";
import { useEffect, useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";

const ResetForm = () => {
  const [getAllUser, SetGetAllUser] = useState([]);
  const [number, serGetnumber] = useState("");
  const [filterUserByNumber, SetGetuserByNumber] = useState({});
  const [isNewUser, setIsNewUser] = useState(false);

  // Fetch all users on component mount
  useEffect(() => {
    fetchAllPublicUser();
  }, []);

  // Check for the user when phone number changes
  useEffect(() => {
    if (number && getAllUser.length > 0) {
      const userByNumber = getAllUser.find(
        (user) => user.phonenumber === number
      );
      if (userByNumber) {
        SetGetuserByNumber(userByNumber);
        setIsNewUser(false); // User exists
      } else {
        SetGetuserByNumber({ phonenumber: number }); // Prepare for new user creation
        setIsNewUser(true); // New user
      }
    }
  }, [number, getAllUser]);

  // Fetch all users from API
  const fetchAllPublicUser = async () => {
    try {
      const response = await axios.get(
        `https://qwikit1.pythonanywhere.com/userProfile/`
      );
      SetGetAllUser(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  // Handle form submission for create/update
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isNewUser) {
        // Create a new user
        await axios.post(
          `https://qwikit1.pythonanywhere.com/userProfile/new`,
          filterUserByNumber
        );
        toast.success("User Submit successfully", { theme: "colored" });
      } else {
        // Update existing user
        await axios.put(
          `https://qwikit1.pythonanywhere.com/userProfile/${filterUserByNumber.id}`,
          filterUserByNumber
        );
        toast.success("User Updated successfully", { theme: "colored" });
      }
    } catch (err) {
      console.error(err);
      alert("Failed to submit data.");
    }
  };

  return (
    <div className="main-containerr">
      <ToastContainer
        position="bottom-center"
        autoClose={2000}
        theme="colored"
      />
      <form onSubmit={handleSubmit}>
        <div className="innter-container">
          <div className="header-part-reset">
            <img src={reset} alt="" className="reset-logo" />
          </div>
          <div className="date-div">
            <label>Date : </label>
            <input type="date" className="inner-field date-width" />
          </div>
          <div className="body-part">
            <div className="body-innter">
              <div className="name-field">
                <label>Name:</label>
                <input
                  type="text"
                  className="inner-field name-width"
                  value={filterUserByNumber.name || ""}
                  onChange={(e) =>
                    SetGetuserByNumber({
                      ...filterUserByNumber,
                      name: e.target.value,
                    })
                  }
                />
                <label>Age:</label>
                <input
                  type="text"
                  className="inner-field age-width"
                  value={filterUserByNumber.age || ""}
                  onChange={(e) =>
                    SetGetuserByNumber({
                      ...filterUserByNumber,
                      age: e.target.value,
                    })
                  }
                />
                <label>Sex:</label>
                <input
                  type="text"
                  className="inner-field sex-width"
                  value={filterUserByNumber.gender || ""}
                  onChange={(e) =>
                    SetGetuserByNumber({
                      ...filterUserByNumber,
                      gender: e.target.value,
                    })
                  }
                />
              </div>
            </div>
            <div className="body-innter">
              <div className="name-field">
                <label>Address:</label>
                <input
                  type="text"
                  className="inner-field address-width"
                  value={filterUserByNumber.address || ""}
                  onChange={(e) =>
                    SetGetuserByNumber({
                      ...filterUserByNumber,
                      address: e.target.value,
                    })
                  }
                />
                <label>Height:</label>
                <input
                  type="text"
                  className="inner-field height-width"
                  value={Array.isArray(filterUserByNumber.height) && filterUserByNumber.height.length > 0
                    ? filterUserByNumber.height[0].value
                    : ""}
                  onChange={(e) =>
                    SetGetuserByNumber({
                      ...filterUserByNumber,
                      height: [{value : e.target.value}],
                    })
                  }
                />
              </div>
            </div>
            <div className="body-innter">
              <div className="name-field">
                <label>Birth:</label>
                <input
                  type="text"
                  className="inner-field name-width"
                  value={filterUserByNumber.dateofbirth || ""}
                  onChange={(e) =>
                    SetGetuserByNumber({
                      ...filterUserByNumber,
                      dateofbirth: e.target.value,
                    })
                  }
                />
                <label> Occupation:</label>
                <input
                  type="text"
                  className="inner-field age-width"
                  value={filterUserByNumber.occupation || ""}
                  onChange={(e) =>
                    SetGetuserByNumber({
                      ...filterUserByNumber,
                      occupation: e.target.value,
                    })
                  }
                />
                <label>City:</label>
                <input
                  type="text"
                  className="inner-field sex-width"
                  value={filterUserByNumber.city || ""}
                  onChange={(e) =>
                    SetGetuserByNumber({
                      ...filterUserByNumber,
                      city: e.target.value,
                    })
                  }
                />
              </div>
            </div>
            <div className="body-innter">
              <div className="name-field">
                <label>Email:</label>
                <input
                  type="text"
                  className="inner-field email-width"
                  value={filterUserByNumber.email || ""}
                  onChange={(e) =>
                    SetGetuserByNumber({
                      ...filterUserByNumber,
                      email: e.target.value,
                    })
                  }
                />
                <label>Phone:</label>
                <input
                  type="text"
                  className="inner-field phone-width"
                  onBlur={(e) => serGetnumber(e.target.value)}
                  placeholder="Enter Phone Number"
                />
              </div>
            </div>
            <div className="body-innter">
              <div className="name-field">
                <label> Facebook ID:</label>
                <input
                  type="text"
                  className="inner-field email-width"
                />
                <label>Reference:</label>
                <input
                  type="text"
                  className="inner-field reference-width"
                />
              </div>
            </div>
            <div className="body-innter2">
              <div className="name-field2 aes">
                <label> *How you came to know about FitBack Reset? :</label>
                <input
                  type="text"
                  className="inner-field aesthetic"
                />
              </div>
            </div>

            <div className="cigarettes">
              <label htmlFor="">Do you use cigarettes/tobacco?:</label>
              <input type="checkbox" name="yes" id="" className="yes" />
              yes
              <input type="checkbox" name="no" id="" className="no" />
              No
            </div>

            <div className="conditions">
              <label htmlFor="">
                Check the conditions that apply member of your immediate
                relatives:
              </label>
              <div className="inner-condition">
                <div>
                  <input type="checkbox" name="asthma" />
                  <label htmlFor="">Asthma</label>
                </div>
                <div>
                  <input type="checkbox" name="cardiac" />
                  <label htmlFor="">Cardiac disease</label>
                </div>
                <div>
                  <input type="checkbox" name="hypertension" />
                  <label htmlFor="">Hypertension</label>
                </div>
                <div>
                  <input type="checkbox" name="thyroid" />
                  <label htmlFor="">Thyroid</label>
                </div>
                <div>
                  <input type="checkbox" name="pcos" />
                  <label htmlFor="">PCOS/PCOD</label>
                </div>
                <div>
                  <input type="checkbox" name="diabetes" />
                  <label htmlFor="">Diabetes</label>
                </div>
                <div>
                  <input type="checkbox" name="cancer" />
                  <label htmlFor="">Cancer</label>
                </div>
                <div>
                  <input type="checkbox" name="other" />
                  <label htmlFor="">.....</label>
                </div>
              </div>
            </div>

            <div className="conditions">
              <label htmlFor="">Personal Issues:</label>
              <div className="inner-condition">
                <div>
                  <input type="checkbox" name="asthma" />
                  <label htmlFor="">Asthma</label>
                </div>
                <div>
                  <input type="checkbox" name="cardiac" />
                  <label htmlFor="">Cardiac disease</label>
                </div>
                <div>
                  <input type="checkbox" name="hypertension" />
                  <label htmlFor="">Hypertension</label>
                </div>
                <div>
                  <input type="checkbox" name="thyroid" />
                  <label htmlFor="">Thyroid</label>
                </div>
                <div>
                  <input type="checkbox" name="pcos" />
                  <label htmlFor="">PCOS/PCOD</label>
                </div>
                <div>
                  <input type="checkbox" name="diabetes" />
                  <label htmlFor="">Diabetes</label>
                </div>
                <div>
                  <input type="checkbox" name="cancer" />
                  <label htmlFor="">Cancer</label>
                </div>
                <div>
                  <input type="checkbox" name="other" />
                  <label htmlFor="">.....</label>
                </div>
              </div>
            </div>

            <div className="message">
              <label htmlFor="">
                {" "}
                Are you currently taking any medication?
              </label>
              <textarea name="" id="" className="message-text"></textarea>
            </div>
            <div className="message">
              <label htmlFor="">
                Are you currently taking Other Weight loss
                medicine/Supplement/Services/Injection
              </label>
              <textarea name="" id="" className="message-text"></textarea>
            </div>
            <div className="message">
              <label htmlFor=""> Do you have any medication allergies</label>
              <textarea name="" id="" className="message-text"></textarea>
            </div>
            <div className="message">
              <label htmlFor="">
                Any record of known or unknown skin disease?
              </label>
              <textarea name="" id="" className="message-text"></textarea>
            </div>
          </div>
          <button className="download-btn" type="submit">
            {isNewUser ? "Submit" : "Update"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ResetForm;
