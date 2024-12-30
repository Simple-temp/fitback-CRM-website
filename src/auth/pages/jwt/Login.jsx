import { useEffect, useState } from "react";
import { useNavigate, } from "react-router-dom";
import clsx from "clsx";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
// import { useLayout } from "@/providers";
import { Alert } from "@/components";

const loginSchema = Yup.object().shape({
  phonenumber: Yup.string()
    .min(3, "Minimum 3 symbols")
    .max(50, "Maximum 50 symbols")
    .required("Phone number is required"),
  password: Yup.string()
    .min(3, "Minimum 3 symbols")
    .max(50, "Maximum 50 symbols")
    .required("Password is required"),
});

const Login = () => {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [selectedValue, setSelectedValue] = useState("");
  const [allUsers, setAllUsers] = useState([]);
  const navigate = useNavigate();
  // const { currentLayout } = useLayout();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [adminRes, dietitianRes, deskRes, supportRes, doctorRes, hrRes] = await Promise.all(
          [
            axios.get("https://qwikit1.pythonanywhere.com/adminProfile/"),
            axios.get("https://qwikit1.pythonanywhere.com/dietitianProfile/"),
            axios.get("https://qwikit1.pythonanywhere.com/deskProfile/"),
            axios.get("https://qwikit1.pythonanywhere.com/supportProfile/"),
            axios.get("https://qwikit1.pythonanywhere.com/doctorProfile/"),
            axios.get("https://qwikit1.pythonanywhere.com/hRProfile/"),
          ]
        );

        setAllUsers([
          ...adminRes.data.map((user) => ({ ...user, user_type: "Admin" })),
          ...dietitianRes.data.map((user) => ({ ...user, user_type: "Dietitian", })),
          ...deskRes.data.map((user) => ({ ...user, user_type: "Desk" })),
          ...supportRes.data.map((user) => ({ ...user, user_type: "Support" })),
          ...doctorRes.data.map((user) => ({ ...user, user_type: "Doctor" })),
          ...hrRes.data.map((user) => ({ ...user, user_type: "HR" })),
        ]);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    fetchData();
  }, []);

  const togglePassword = (event) => {
    event.preventDefault();
    setShowPassword(!showPassword);
  };

  const handleRoleChange = (event) => {
    setSelectedValue(event.target.value);
  };

  const formik = useFormik({
    initialValues: {
      phonenumber: "",
      password: "",
    },
    validationSchema: loginSchema,
    onSubmit: async (values, { setStatus, setSubmitting }) => {
      setLoading(true);
      try {
        const matchedUser = allUsers.find(
          (user) =>
            user.user_type === selectedValue &&
            user.phonenumber === values.phonenumber &&
            user.password === values.password
        );

        if (matchedUser) {
          // fetch full data
          if(selectedValue?.user_type === "HR"){
            const userAPIhR = `https://qwikit1.pythonanywhere.com/hRProfile/${matchedUser.id}`
            return userAPIhR        
          }
          const userApiUrl = `https://qwikit1.pythonanywhere.com/${selectedValue.toLowerCase()}Profile/${matchedUser.id}`;
          const userDetailsResponse = await axios.get(userApiUrl);
          const userFullData = userDetailsResponse.data;
          // Store in localStorage
          localStorage.setItem("loggedInUser", JSON.stringify(userFullData));
          if (localStorage) {
            // Navigate to the specific route
            navigate(`/`);
            window.location.reload();
          }
        } else {
          setStatus("Invalid credentials");
        }
      } catch (error) {
        console.error("Login error:", error);
        setStatus("An error occurred during login.");
      }
      setLoading(false);
      setSubmitting(false);
    },
  });

  return (
    // <div className="card max-w-[390px] w-full">
    //   <form className="card-body flex flex-col gap-5 p-10" onSubmit={formik.handleSubmit} noValidate>
    //     <div className="text-center mb-2.5">
    //       <h3 className="text-lg font-semibold text-gray-900 leading-none mb-2.5">Sign in</h3>
    //       <div className="flex items-center justify-center font-medium">
    //         {/* <span className="text-2sm text-gray-600 me-1.5">Need an account?</span>
    //         <Link to={currentLayout?.name === 'auth-branded' ? '/auth/signup' : '/auth/classic/signup'} className="text-2sm link">
    //           Sign up
    //         </Link> */}
    //       </div>
    //     </div>

    //     {formik.status && <Alert variant="danger">{formik.status}</Alert>}

    //     <div className="flex flex-col gap-1">
    //       <label htmlFor="dropdown" className="form-label text-gray-900">Choose a Role:</label>
    //       <select
    //         id="dropdown"
    //         value={selectedValue}
    //         onChange={handleRoleChange}
    //         className="form-control border-gray-300 rounded-md px-3 py-2 text-gray-900"
    //       >
    //         <option value="">--Select an option--</option>
    //         <option value="Admin">Admin</option>
    //         <option value="Dietitian">Dietitian</option>
    //         <option value="Desk">Desk</option>
    //         <option value="Support">Support</option>
    //       </select>
    //     </div>

    //     <div className="flex flex-col gap-1">
    //       <label className="form-label text-gray-900">Phonenumber</label>
    //       <input
    //         type="text"
    //         className="custom-input"
    //         placeholder="Enter Phonenumber"
    //         {...formik.getFieldProps("phonenumber")}
    //         className={clsx("form-control", { "is-invalid": formik.touched.phonenumber && formik.errors.phonenumber })}
    //       />
    //       {formik.touched.phonenumber && formik.errors.phonenumber && (
    //         <span className="text-danger text-xs mt-1">{formik.errors.phonenumber}</span>
    //       )}
    //     </div>

    //     <div className="flex flex-col gap-1">
    //       <label className="form-label text-gray-900">Password</label>
    //       <div className="input-group">
    //         <input
    //           className="custom-input"
    //           type={showPassword ? "text" : "password"}
    //           placeholder="Enter password"
    //           {...formik.getFieldProps("password")}
    //           className={clsx("form-control", { "is-invalid": formik.touched.password && formik.errors.password })}
    //         />
    //         <button className="btn btn-icon" onClick={togglePassword}>
    //           {showPassword ? "Hide" : "Show"}
    //         </button>
    //       </div>
    //       {formik.touched.password && formik.errors.password && (
    //         <span className="text-danger text-xs mt-1">{formik.errors.password}</span>
    //       )}
    //     </div>

    //     <button type="submit" className="btn btn-primary-custom" disabled={loading || formik.isSubmitting || !selectedValue}>
    //       {loading ? "Please wait..." : "Sign In"}
    //     </button>
    //   </form>
    // </div>
    <div className="card max-w-[390px] w-full border border-gray-300 rounded-lg shadow-lg p-6">
      <form
        className="card-body flex flex-col gap-5"
        onSubmit={formik.handleSubmit}
        noValidate
      >
        <div className="text-center mb-4">
          <h3 className="text-xl font-semibold text-gray-800 leading-tight mb-2">
            Sign in
          </h3>
        </div>

        {formik.status && <Alert variant="danger">{formik.status}</Alert>}

        <div className="flex flex-col gap-2">
          <label
            htmlFor="dropdown"
            className="form-label text-gray-700 font-medium"
          >
            Choose a Role:
          </label>
          <select
            id="dropdown"
            value={selectedValue}
            onChange={handleRoleChange}
            className="form-control border border-gray-300 rounded-md px-4 py-2 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
          >
            <option value="">--Select an option--</option>
            <option value="Admin">Admin</option>
            <option value="Dietitian">Dietitian</option>
            <option value="Desk">Desk</option>
            <option value="Support">Support</option>
            <option value="Doctor">Doctor</option>
            <option value="HR">HR</option>
          </select>
        </div>

        <div className="flex flex-col gap-2">
          <label className="form-label text-gray-700 font-medium">
            Phonenumber
          </label>
          <input
            type="text"
            placeholder="Enter Phonenumber"
            {...formik.getFieldProps("phonenumber")}
            className={clsx(
              "form-control border border-gray-300 rounded-md px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition",
              {
                "is-invalid":
                  formik.touched.phonenumber && formik.errors.phonenumber,
              }
            )}
          />
          {formik.touched.phonenumber && formik.errors.phonenumber && (
            <span className="text-danger text-xs mt-1">
              {formik.errors.phonenumber}
            </span>
          )}
        </div>

        {/* <div className="flex flex-col gap-2">
          <label className="form-label text-gray-700 font-medium">
            Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter password"
              {...formik.getFieldProps("password")}
              className={clsx(
                "form-control border border-gray-300 rounded-md px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition",
                {
                  "is-invalid":
                    formik.touched.password && formik.errors.password,
                }
              )}
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-600"
              onClick={togglePassword}
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
          {formik.touched.password && formik.errors.password && (
            <span className="text-danger text-xs mt-1">
              {formik.errors.password}
            </span>
          )}
        </div> */}
        <div className="flex flex-col gap-2">
          <label className="form-label text-gray-700 font-medium">
            Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter password"
              {...formik.getFieldProps("password")}
              className={clsx(
                "form-control border border-gray-300 rounded-md px-4 py-2 pr-12 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition",
                {
                  "is-invalid":
                    formik.touched.password && formik.errors.password,
                }
              )}
            />
            <button
              type="button"
              className="absolute inset-y-0 right-3 flex items-center text-gray-600 hover:text-gray-800 focus:outline-none"
              onClick={togglePassword}
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
          {formik.touched.password && formik.errors.password && (
            <span className="text-danger text-xs mt-1">
              {formik.errors.password}
            </span>
          )}
        </div>

        <button
          type="submit"
          className="btn btn-primary-custom bg-blue-500 text-white font-medium rounded-md px-6 py-2 mt-4 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          disabled={loading || formik.isSubmitting || !selectedValue}
        >
          {loading ? "Please wait..." : "Sign In"}
        </button>
      </form>
    </div>
  );
};

export { Login };
