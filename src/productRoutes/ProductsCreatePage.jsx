import { Button, FormControl, InputLabel, MenuItem, Select, TextField } from "@mui/material";
import axios from "axios";
import { useFormik } from "formik";
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";
import * as Yup from "yup";

const ProductsCreatePage = () => {
  // Formik validation schema
  const validationSchema = Yup.object().shape({
    category: Yup.string().required("Category is required"),
  });

  const formik = useFormik({
    initialValues: {
      category: "",
      productbrand: "",
      productname: "",
      quantity: "",
      discount: "",
      image1: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        const formData = new FormData();
        formData.append("category", values.category);
        formData.append("productbrand", values.productbrand);
        formData.append("productname", values.productname);
        formData.append("quantity", values.quantity);
        formData.append("discount", values.discount);
        formData.append("image1", values.image1);

        const response = await axios.post(
          `https://qwikit1.pythonanywhere.com/product/new`,
          formData
        );

        console.log("Server response:", response.data);
        toast.success("Product created successfully", { theme: "colored" });
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
        <div className="grid grid-cols-2 gap-4">
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
              <MenuItem value="car">Car</MenuItem>
              <MenuItem value="bike">Bike</MenuItem>
              <MenuItem value="bicycle">Bicycle</MenuItem>
              <MenuItem value="bag">Bag</MenuItem>
            </Select>
            {formik.touched.category && formik.errors.category && (
              <p className="text-red-500 text-sm">{formik.errors.category}</p>
            )}
          </FormControl>
          <TextField
            label="Product Brand"
            id="productbrand"
            name="productbrand"
            variant="outlined"
            value={formik.values.productbrand}
            onChange={formik.handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Product Name"
            id="productname"
            name="productname"
            variant="outlined"
            value={formik.values.productname}
            onChange={formik.handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Quantity"
            id="quantity"
            name="quantity"
            variant="outlined"
            value={formik.values.quantity}
            onChange={formik.handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Discount"
            id="discount"
            name="discount"
            variant="outlined"
            value={formik.values.discount}
            onChange={formik.handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            id="image1"
            name="image1"
            type="file"
            variant="outlined"
            onChange={(event) => {
              formik.setFieldValue("image1", event.currentTarget.files[0]);
            }}
            fullWidth
            margin="normal"
          />
        </div>
        <div className="flex justify-end mt-4">
          <Button
            type="submit"
            variant="contained"
            color="success"
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg"
          >
            Create
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ProductsCreatePage;
