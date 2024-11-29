import React, { useState } from "react";
import Sellernavbar from "./Sellernavbar";
import Sellermenu from "./Sellermenu";
import Sellerfooter from "./Sellerfooter";
import axios from 'axios';

export default function Addnewproduct() {
  const [categories, setCategories] = useState([]);
  const [sizes, setSizes] = useState([]);

  const [values, setValues] = useState({
    producttype: "",
    category: "",
    productname: "",
    productdescription: "",
    location: "",
    color: "",
    alteration: "",
    size: "",
    measurements: "",
    material:"",
    worn: "",
    language:"",
    quantity:"",
    price: "",
    accepted_by_admin: "false",
    seller_id: sessionStorage.getItem("user-token"),
  });
  const [selectedAttributes, setSelectedAttributes] = useState([]);
  const [customAttributes, setCustomAttributes] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [files, setFiles] = useState([]);
  const [errors, setErrors] = useState({});
  
  const validateForm = () => {
    const newErrors = {};

    // Validate product name length
    if (values.productname.length > 90) {
      newErrors.productname = "Product name must be less than 90 characters";
    }

     // Validate number of selected images
     if (files.length < 3) {
      newErrors.files = "Please select at least 3 images";
    } else if (files.length > 10) {
      newErrors.files = "Please select a maximum of 10 images";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Return true if there are no errors
  };
  const handleFile = (event) => {
    const selectedFiles = event.target.files;
    setFiles(selectedFiles);
  };
  // console.log(files.length)

  const handleKeyup = (e) => {
    const newErrors = { ...errors };

    // Validate product name length onBlur
    if (e.currentTarget.name === "productname" && e.currentTarget.value.length > 90) {
      newErrors.productname = "Product name must be less than 90 characters";
    } else {
      delete newErrors.productname; 
    }
   
    
    if (e.currentTarget.name === "productimageurl") {
      console.log(e.currentTarget.files)
      if (e.currentTarget.files.length < 3) {
        newErrors.files = "Please select at least 3 images";
      }else {
        delete newErrors.files; // Remove the error if number of images is valid
      }
    }

    setErrors(newErrors);
  };

  const handleInput = (event) => {
    // console.log(event.target.name)
    setValues((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  };
  // const formData = new FormData();

  

  const handleProducttype = (event) => {
    setValues((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
    
    if(event.target.name === "producttype"){
      if(event.target.value === "women"){ 
        setCategories(["highendcouture","sarees","lehenga","dresses","twinning-outfits"])
        setSizes(["XS","S","M","L","XL"])  
      }
      else if(event.target.value === "kids"){
        setCategories(["girl","boy"]);
        setSizes(["0-2 Years","2-4 Years","4-6 Years","6-8 Years","8-10 Years","10-15 Years"])
      }
      else if(event.target.value === "jewellery"){
        setCategories(["necklaces","bangles","earrings","rings"]);
      }
      else if(event.target.value === "books"){
        setCategories(["fantasy","horror","fiction","drama"]); 
      }
    }
  }

  const handleCheckboxChange = (attribute) => {
    if (selectedAttributes.includes(attribute)) {
      setSelectedAttributes(selectedAttributes.filter((item) => item !== attribute));
    } else {
      setSelectedAttributes([...selectedAttributes, attribute]);
    }
  };

  const handleAddAttribute = () => {
    setShowModal(true);
  };

  const handleModalSubmit = () => {
    const newCustomAttributes = selectedAttributes.filter((attribute) => !customAttributes.find((item) => item.name === attribute));
    setCustomAttributes([...customAttributes, ...newCustomAttributes.map((attribute) => ({ name: attribute, value: "" }))]);
    setSelectedAttributes([]);
    setShowModal(false);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
     // Validation logic
     const isValid = validateForm();

     if (!isValid) {
       // If form is not valid, stop submission
       return;
     }
  
// Create a copy of the values object
const updatedValues = { ...values };

// Check if the product type is 'jewellery' or 'books'
if (values.producttype === "jewellery") {
  // Set size to 'NA' for jewellery
  updatedValues.size = "NA";
  updatedValues.material = "NA";
} else if (values.producttype === "books") {
  // Set all fields to 'NA' for books
  updatedValues.color = "NA";
  updatedValues.alteration = "NA";
  updatedValues.size = "NA";
  updatedValues.measurements = "NA";
  updatedValues.material = "NA";
  updatedValues.worn = "NA";
}
    const formData = new FormData();
  
    // Append all files to formData
    for (let i = 0; i < files.length; i++) {
      formData.append('images', files[i]);
    }
  
    // Append other form data
    for (const key in updatedValues) {
      formData.append(key, updatedValues[key]);
    }
  
    // Append custom attributes
    customAttributes.forEach((attribute, index) => {
      formData.append(attribute.name, attribute.value);
    });
  
    try {
      console.log(formData)
      const response = await axios.post(`${process.env.REACT_APP_HOST}${process.env.REACT_APP_PORT}/addproducts`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
  
      if (response.data === "Error") {
        alert("Error while adding product. Please try again filling all the fields");
      } else {
        alert("Product added successfully");
       
        window.location.reload(false);
      }
    } catch (error) {
      console.error("Error:", error);
    
    }
  };
  
  

  const attributeOptions = [
    // "Material",
    "Occasion",
    "Type",
    "Brand",
    "Product_Condition",
    "Style",
    "Season",
    "Fit",
    "Length"
    // Add more attribute options here
  ];
  const placeholderValues = {
    // Material: "Enter Material Name (eg. silk,cotton)",
    Occasion: "Enter Occasion (eg. Function,Party)",
    Type: "Enter Type",
    Brand: "Enter Brand Name",
    Product_Condition: "Enter Product Condition",
    Style: "Enter Style",
    Season: "Enter Season (eg. Summer,Winter)",
    Fit: "Enter Fit",
    Length: "Enter Length",
    // Add more placeholder values here for additional attributes
  };
  

  return (
    <div className="fullscreen">
      <Sellernavbar />
      <div className="d-md-flex">
        <div className="col-md-2 selleraccordion">
          <Sellermenu />
        </div>
        <div className="col-md-10">
          <div className="fullscreen2">
            <main>
              <div className="container">
                <h1 className="mt-2 ms-2 fs-3">Add Product</h1>
                <hr className="ms-4 me-4" />
                <div className="row justify-content-center">
                  <div className="col-xs-12 col-sm-8 col-md-9z col-lg-6">
                    <form className="mb-4" onSubmit={handleSubmit}>
                      <div className="mb-3">
                        <label htmlFor="producttype" className="form-label fw-bolder">
                          Product Type
                        </label>
                        <div className="d-flex">
                        <select
                          id="producttype"
                          name="producttype"
                          className="form-select"
                          onChange={handleProducttype}
                          required
                        >
                          <option value="">Select Product Type</option>
                          <option value="women">Women</option>
                          <option value="kids">Kids</option>
                          <option value="jewellery">Jewellery</option>
                          <option value="books">Books</option>
                        </select>
                        <span className="text-danger fs-4"> &nbsp;*</span>
                        </div>
                      </div>
                      <div className="mb-3">
                        <label htmlFor="category" className="form-label fw-bolder">
                          Product Category
                        </label>
                        <div className="d-flex">
                        <select
                          id="category"
                          value={values.category}
                          className="form-select"
                          name="category"
                          onChange={handleInput}
                          required
                        >
                          <option value="">Select Category</option>
                          {categories.map((item, index)=>{
                            return <option value={item} key={index}>{item}</option>;
                          })}
                        </select>
                        <span className="text-danger fs-4"> &nbsp;*</span>
                        </div>
                      </div>
                      <div className="mb-3">
                        <label
                          htmlFor="productname"
                          className="form-label fw-bolder"
                        >
                          Product Name
                        </label>
                        <div className="d-flex">
                        <input
                          type="text"
                          className="form-control"
                          id="productname"
                          name="productname"
                          placeholder="Product Name"
                          value={values.productname}
                          onChange={(e) => {
                            handleInput(e);
                            handleKeyup(e); 
                          }}  
                          title="Enter product name less than 90 chars"
                          required
                        />
                         <span className="text-danger fs-4"> &nbsp;*</span>
                         </div>
                         {errors.productname && <span className="text-danger fs-6">{errors.productname}</span>}
                      </div>
                      <div className="mb-3">
                        <label
                          htmlFor="productdescription"
                          className="form-label fw-bolder"
                        >
                          Product Description
                        </label>
                        <div className="d-flex">
                        <textarea
                          className="form-control"
                          id="productdescription"
                          name="productdescription"
                          placeholder="Product Description"
                          value={values.productdescription}
                          onChange={handleInput}
                          required
                        ></textarea>
                         <span className="text-danger fs-4"> &nbsp;*</span>
                         </div>
                      </div>
                      <div className="mb-3">
                        <label
                          htmlFor="productimageurl"
                          className="form-label fw-bolder"
                        >
                          Upload Images
                        </label>
                        <div className="d-flex">
                        
                          <input 
                              type="file" 
                              className="form-control" 
                              multiple 
                              onChange={(e) => {
                              handleFile(e);
                              handleKeyup(e); // Trigger validation when files are selected
                            }}   
                            name="productimageurl" 
                            id="productimageurl" 
                            title="Upload minimum 4 to max 10 images" 
                            required
                            />
                          <span className="text-danger fs-4"> &nbsp;*</span>
                          </div>
                          {errors.files && <span className="text-danger">{errors.files}</span>}
                      </div>
                      {values.producttype !== "books" && (
                      <div className="mb-3">
                        <label htmlFor="color"
                         className="form-label fw-bolder">
                         Color
                       </label>
                       <div className="d-flex">
                       <input
                         type="text"
                         className="form-control"
                         id="color"
                         name="color"
                         placeholder="Color"
                         value={values.color}
                         onChange={handleInput}
                         required
                       />
                        <span className="text-danger fs-4"> &nbsp;*</span>
                        </div>
                     </div>
                      )}
                     <div className="mb-3">
                       <label htmlFor="location" className="form-label fw-bolder">
                         Location
                       </label>
                       <div className="d-flex">
                       <input
                         type="text"
                         className="form-control"
                         id="location"
                         name="location"
                         placeholder="Location"
                         value={values.location}
                         onChange={handleInput}
                         required
                       />
                        <span className="text-danger fs-4"> &nbsp;*</span>
                        </div>
                     </div>
                     {values.producttype === "books" && (
                     <div className="mb-3">
                       <label htmlFor="location" className="form-label fw-bolder">
                         Language
                       </label>
                       <div className="d-flex">
                       <input
                         type="text"
                         className="form-control"
                         id="language"
                         name="language"
                         placeholder="Enter Book Language (Eg. English, Hindi, Telugu etc.)"
                         value={values.language}
                         onChange={handleInput}
                         required
                       />
                        <span className="text-danger fs-4"> &nbsp;*</span>
                        </div>
                     </div>
                     )}
                     {values.producttype !== "books" && (
                     <div className="mb-3">
                       <label htmlFor="alteration" className="form-label fw-bolder">
                         Alteration
                       </label>
                       <div className="d-flex">
                       <select
                          id="alteration"
                          name="alteration"
                          className="form-select"
                          onChange={handleInput}
                          required
                        >
                          <option value="">Select Alteration</option>
                          <option value="Yes">Yes</option>
                          <option value="No">No</option>
                         
                        </select>
                       
                        <span className="text-danger fs-4"> &nbsp;*</span>
                        </div>
                     </div>
                     )}
                     {values.producttype !== "jewellery" && values.producttype !== "books"  && (
                     <div className="mb-3">
                       <label htmlFor="size" className="form-label fw-bolder">
                         Size
                       </label>
                       <div className="d-flex">
                       <select
                          id="size"
                          value={values.size}
                          name="size"
                          className="form-select"
                          onChange={handleInput}
                          required
                        >
                          <option value="">Select Size</option>
                          {sizes.map((item, index)=>{
                            return <option value={item} key={index}>{item}</option>;
                          })}
                         
                        </select>
                        <span className="text-danger fs-4"> &nbsp;*</span>
                        </div>
                       
                     </div>
                      )}
                       {values.producttype !== "books" && (
                     <div className="mb-3">
                       <label
                         htmlFor="measurements"
                         className="form-label fw-bolder"
                       >
                         Measurements
                       </label>
                       <div className="d-flex">
                       <input
                         type="text"
                         className="form-control"
                         id="measurements"
                         name="measurements"
                         placeholder="Measurements (eg. 32 to 36)"
                         value={values.measurements}
                         onChange={handleInput}
                         required
                       />
                        <span className="text-danger fs-4"> &nbsp;*</span>
                        </div>
                     </div>
                       )}
                       {values.producttype !== "jewellery" && values.producttype !== "books"  && (
                     <div className="mb-3">
                       <label
                         htmlFor="material"
                         className="form-label fw-bolder"
                       >
                         Material
                       </label>
                       <div className="d-flex">
                       <select
                        //  type="text"
                         className="form-select"
                         id="material"
                         name="material"
                         placeholder="Material (eg. Silk,Cotton etc.)"
                         value={values.material}
                         onChange={handleInput}
                         required
                       >
                         <option value="">Select Material</option>
                          <option value="Silk">Silk</option>
                          <option value="Cotton">Cotton</option>
                          <option value="Crepe">Crepe</option>
                          <option value="Net">Net</option>
                          <option value="Georgette">Georgette</option>
                          <option value="Rayon">Rayon</option>
                          <option value="Polyester">Polyester</option>
                          <option value="Wool">Wool</option>
                          <option value="Linen">Linen</option>
                          <option value="Nylon">Nylon</option>
                          <option value="Denim">Denim</option>
                          <option value="Leather">Leather</option>
                          <option value="Velvet">Velvet</option>
                          <option value="Spandex (Elastane)">Spandex (Elastane)</option>
                       </select>
                        <span className="text-danger fs-4"> &nbsp;*</span>
                        </div>
                     </div>
                       )}
                        {values.producttype !== "books" && (
                     <div className="mb-3">
                       <label htmlFor="worn" className="form-label fw-bolder">
                        Times Worn
                       </label>
                       <div className="d-flex">
                       <input
                         type="text"
                         className="form-control"
                         id="worn"
                         name="worn"
                         placeholder="Worn"
                         value={values.worn}
                         onChange={handleInput}
                         required
                       />
                        <span className="text-danger fs-4"> &nbsp;*</span>
                        </div>
                     </div>
                        )}
                          <div className="mb-3">
                        <label
                          htmlFor="quantity"
                          className="form-label fw-bolder"
                        >
                          Quantity
                        </label>
                        <div className="d-flex">
                         
                          <select
                         className="form-select"
                         id="quantity"
                         name="quantity"
                         placeholder="Enter Quantity"
                         value={values.quantity}
                         onChange={handleInput}
                         required
                       >
                        <option value="">Select Quantity</option>
                         <option value="1">1</option>
                       </select>
                          <span className="text-danger fs-4"> &nbsp;*</span>
                        </div>
                      </div>
                     <div className="mb-3">
                       <label htmlFor="price" className="form-label fw-bolder">
                         Price
                       </label>
                       <div className="d-flex">
                       <input
                         type="number"
                         className="form-control"
                         id="price"
                         name="price"
                         placeholder="Price"
                         value={values.price}
                         onChange={handleInput}
                         min="1"
                         pattern="[0-9]+"
                         title="Price must be positive numbers"
                         required
                       />
                        <span className="text-danger fs-4"> &nbsp;*</span>
                        </div>
                     </div>
                     {customAttributes.map((attr, index) => (
                       <div key={index} className="mb-3">
                         <label htmlFor={attr.name} className="form-label fw-bolder">{attr.name}</label>
                         <input
                           type="text"
                           className="form-control"
                           id={attr.name}
                           name={attr.name}
                           value={attr.value}
                           onChange={(e) => {
                             const updatedAttrs = [...customAttributes];
                             updatedAttrs[index].value = e.target.value;
                             setCustomAttributes(updatedAttrs);
                           }}
                           placeholder={placeholderValues[attr.name]}
                          //  required
                         />
                       </div>
                     ))}
                      {values.producttype !== "books" && (
                     <div className="mb-3">
                       <button
                         type="button"
                         className="btn btn-primary mb-3"
                         onClick={handleAddAttribute}
                       >
                         Add Custom Attribute
                       </button>
                       <div className="modal" style={{ display: showModal ? "block" : "none" }}>
                         <div className="modal-dialog">
                           <div className="modal-content">
                             <div className="modal-header">
                               <h5 className="modal-title">Select Custom Attributes</h5>
                               <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
                             </div>
                             <div className="modal-body">
                               {attributeOptions.map((option) => (
                                 <div key={option} className="form-check">
                                   <input
                                     type="checkbox"
                                     className="form-check-input"
                                     id={option}
                                     checked={selectedAttributes.includes(option)}
                                     onChange={() => handleCheckboxChange(option)}
                                   />
                                   <label className="form-check-label" htmlFor={option}>
                                     {option}
                                   </label>
                                 </div>
                               ))}
                             </div>
                             <div className="modal-footer">
                               <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Close</button>
                               <button type="button" className="btn btn-primary" onClick={handleModalSubmit} disabled={selectedAttributes.length === 0}>Submit</button>
                             </div>
                           </div>
                         </div>
                       </div>
                     </div>
                      )}
                     <div className="text-center">
                       <button
                         type="submit"
                         className="btn btn-success me-2"
                         id="btn-save"
                         name="btn-save"
                     
                       >
                         <i className="bi bi-save2-fill"></i>&nbsp; Save
                       </button>
                       <button className="btn btn-danger" type="reset">
                         <i className="bi bi-trash-fill"></i>&nbsp; Cancel
                       </button>
                     </div>
                   </form>
                 </div>
               </div>
             </div>
           </main>
           <Sellerfooter />
         </div>
       </div>
     </div>
   </div>
 );
}


