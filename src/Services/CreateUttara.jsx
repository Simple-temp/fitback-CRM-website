import {
    Button,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    TextField,
  } from "@mui/material";
  import axios from "axios";
  import { useFormik } from "formik";
  import { toast } from "react-toastify";
  import { ToastContainer } from "react-toastify";
  import * as Yup from "yup";
  
  const CreateUttara = () => {
    // Formik validation schema
    const validationSchema = Yup.object().shape({
      category: Yup.string().required("Category is required"),
    });
  
    const formik = useFormik({
      initialValues: {
        branch_name : "Uttara",
        category: "",
        itemname: "",
        duration: "",
        quantity: "",
        details: "",
        discount: "",
        image2: "",
        availablestatus: true,
        reviews: "",
        vat: true,
      },
      validationSchema,
      onSubmit: async (values) => {
        try {
          const formData = new FormData();
          formData.append("branch_name", values.branch_name || "Uttara");
          formData.append("category", values.category);
          formData.append("itemname", values.itemname);
          formData.append("duration", values.duration);
          formData.append("quantity", values.quantity);
          formData.append("details", values.details);
          formData.append("discount", values.discount);
          formData.append("reviews", values.reviews);
          if (values.image2 && values.image2 instanceof File) {
            formData.append("image2", values.image2);
          }
  
          const response = await axios.post(
            `https://qwikit1.pythonanywhere.com/ResetPackageUttara/new`,
            formData
          );
  
          console.log("Server response:", response.data);
          toast.success("Service created successfully", { theme: "colored" });
        } catch (err) {
          console.error("Error:", err.response?.data || err.message);
          toast.error(
            `Error creating product: ${err.response?.data?.message || "Unknown error"}`,
            { theme: "colored" }
          );
        }
      },
    });
  
    return (
      <div>
        <ToastContainer
          position="bottom-center"
          autoClose={2000}
          theme="colored"
        />
        <h2>Create a New Product</h2>
        <form
          onSubmit={formik.handleSubmit}
          className="max-w-xxl mx-auto bg-white p-6 rounded-lg shadow-md"
        >
          <div className="grid grid-cols-3 gap-4">
            {/* Category Field */}
            <FormControl
              fullWidth
              margin="normal"
              error={formik.touched.category && Boolean(formik.errors.category)}
            >
              <InputLabel id="category-label">Category</InputLabel>
              <Select
                labelId="category-label"
                id="category"
                name="category"
                value={formik.values.category}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                label="Category"
              >
                <MenuItem value="food">food</MenuItem>
              </Select>
              {formik.touched.category && formik.errors.category && (
                <p className="text-red-500 text-sm">{formik.errors.category}</p>
              )}
            </FormControl>
            <TextField
              label="itemname"
              id="itemname"
              name="itemname"
              variant="outlined"
              value={formik.values.itemname}
              onChange={formik.handleChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="duration"
              id="duration"
              name="duration"
              variant="outlined"
              value={formik.values.duration}
              onChange={formik.handleChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="quantity"
              id="quantity"
              name="quantity"
              variant="outlined"
              value={formik.values.quantity}
              onChange={formik.handleChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="details"
              id="details"
              name="details"
              variant="outlined"
              value={formik.values.details}
              onChange={formik.handleChange}
              fullWidth
              margin="normal"
            />
            <TextField
              id="image2"
              name="image2"
              type="file"
              variant="outlined"
              onChange={(event) => {
                formik.setFieldValue("image2", event.currentTarget.files[0]);
              }}
              fullWidth
              margin="normal"
            />
            <TextField
              label="discount"
              id="discount"
              name="discount"
              variant="outlined"
              value={formik.values.discount}
              onChange={formik.handleChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="reviews"
              id="reviews"
              name="reviews"
              variant="outlined"
              value={formik.values.reviews}
              onChange={formik.handleChange}
              fullWidth
              margin="normal"
            />
          </div>
          <div className="flex justify-end mt-4">
            <Button
              type="submit"
              variant="contained"
              color="primary"
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg custom-btn-all"
            >
              Create
            </Button>
          </div>
        </form>
      </div>
    );
  };
  
  export default CreateUttara;
