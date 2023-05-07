import React, { useState, useContext } from 'react';
import axios from 'axios';
import TokenContext from '../../../contexts/TokenContext';
import NavBar from "../../Header/Header";
import { useNavigate } from 'react-router-dom';


const PropertyCreate = () => {
    const [propertyData, setPropertyData] = useState({
        name: '',
        address: '',
        city: '',
        description: '',
        guest: '',
        bedroom: '',
        bed: '',
        bathroom: '',
        price: '',
        // image: null,
        images: [],
    });

    const { token } = useContext(TokenContext);
    const [errors, setErrors] = useState({});
    const [imagePreviews, setImagePreviews] = useState([]);
    const navigate = useNavigate();

    // const handleChange = (e) => {
    //     const value = e.target.type === 'file' ? e.target.files[0] : e.target.value;
    //     setPropertyData({ ...propertyData, [e.target.name]: value });
    // };

    const handleChange = (e) => {
        if (e.target.type === 'file') {
            const newFiles = e.target.files;
            const newPreviews = Array.from(newFiles).map((file) =>
                URL.createObjectURL(file)
            );
    
            // Append new images to the existing ones
            setPropertyData((prevState) => ({
                ...prevState,
                images: [...prevState.images, ...newFiles],
            }));
            setImagePreviews((prevState) => [...prevState, ...newPreviews]);
        } else {
            setPropertyData({ ...propertyData, [e.target.name]: e.target.value });
        }
    };

    const removeImage = (index) => {
        setPropertyData((prevState) => {
            const updatedImages = [...prevState.images];
            updatedImages.splice(index, 1);
            return { ...prevState, images: updatedImages };
        });
    
        setImagePreviews((prevState) => {
            const updatedPreviews = [...prevState];
            updatedPreviews.splice(index, 1);
            return updatedPreviews;
        });
    };
    

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        // for (const key in propertyData) {
        // formData.append(key, propertyData[key]);
        // }
        for (const key in propertyData) {
            if (key === 'images') {
                Array.from(propertyData[key]).forEach((image) => {
                    formData.append('images', image);
                });
            } else {
                formData.append(key, propertyData[key]);
            }
        }

        try {
        const response = await axios.post('http://localhost:8000/property/create/', formData, {
            headers: { Authorization: `Bearer ${token}` },
        });
        console.log(response.data);
            setErrors({});
            alert('Property created successfully');
            
            navigate('/property/list');

        } catch (error) {
            console.log(error);
            console.log(error.response.data);
            setErrors(error.response.data);
        }
    };

    return (
        <main>
            <NavBar token={token} />
            <div className="container-lg">
                <div className="card border">
                    <div className="card-header border-bottom">
                        <h3 className="card-header-title">Create Property</h3>
                    </div>
                    <div className="card-body">
                        <form className="row g-3" onSubmit={handleSubmit}>
                            <div className="col-12">
                                <label className="form-label">Edit your property photos</label>
                                <div className="row mt-3">
                                    {imagePreviews.map((preview, index) => (
                                        <div className="col-md-3 mb-3" key={index}>
                                            <div
                                                className="position-relative"
                                                style={{
                                                    width: '100%',
                                                    height: '0',
                                                    paddingBottom: '100%',
                                                    overflow: 'hidden',
                                                    backgroundSize: 'cover',
                                                    backgroundRepeat: 'no-repeat',
                                                    backgroundPosition: 'center',
                                                    backgroundImage: `url(${preview})`,
                                                }}
                                            >   
                                                <button
                                                    type="button"
                                                    className="btn btn-danger position-absolute top-0 end-0 btn-sm"
                                                    onClick={() => removeImage(index)}
                                                >
                                                    &times;
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="d-flex align-items-center">
                                    <label className="btn btn-sm btn-dark" htmlFor="image">Add Photos</label>
                                    <input id="image" className="form-control d-none" type="file" name="image" onChange={handleChange} />
                                </div>
                            </div>
    
                            <div className="col-md-12">
                                <label className="form-label">Name</label>
                                <input type="text" className="form-control" name="name" id="name" onChange={handleChange} />
                                <p style={{ color: "red" }}>{errors.name}</p>
                            </div>
                            <div className="col-md-12">
                                <label className="form-label">Address</label>
                                <input type="text" className="form-control" name="address" id='address' onChange={handleChange} />
                                <p style={{ color: "red" }}>{errors.address}</p>
                            </div>
                            <div className="col-md-12">
                                <label className="form-label">City</label>
                                <input type="text" className="form-control" name="city" id="city" onChange={handleChange} />
                                <p style={{ color: "red" }}>{errors.city}</p>
                            </div>
                            <div className="col-md-3">
                                <label className="form-label">Number of Guests</label>
                                <input type="text" className="form-control" name="guest" id='guest' onChange={handleChange} />
                                <p style={{ color: "red" }}>{errors.guest}</p>
                            </div>
                            <div className="col-md-3">
                                <label className="form-label">Number of Bedrooms</label>
                                <input type="text" className="form-control" name="bedroom" id='bedroom' onChange={handleChange} />
                                <p style={{ color: "red" }}>{errors.bedroom}</p>
                            </div>
                            <div className="col-md-3">
                                <label className="form-label">Number of Beds</label>
                                <input type="text" className="form-control" name="bed" id='bed' onChange={handleChange} />
                                <p style={{ color: "red" }}>{errors.bed}</p>
                            </div>
                            <div className="col-md-3">
                                <label className="form-label">Number of Baths</label>
                                <input type="text" className="form-control" name="bathroom" id='bathroom' onChange={handleChange} />
                                <p style={{ color: "red" }}>{errors.bathroom}</p>
                            </div>
                            <div className="col-md-12">
                                <label className="form-label">Description</label>
                                <textarea className="form-control" rows="4" name="description" id='description' onChange={handleChange} />
                                <p style={{color:"red"}}>{errors.description}</p>
                            </div>
                            <div className="col-md-12">
                                <label className="form-label">Price</label>
                                <input type="text" className="form-control" name="price" id='price' onChange={handleChange} />
                                <p style={{color:"red"}}>{errors.price}</p>
                            </div>
                            <div className="col-12 text-end">
                                <button type="submit" className="btn btn-dark w-100">Save Changes</button>
                            </div>
                    </form>
                </div>
            </div>
        </div>
    </main>
);
    
};
  
export default PropertyCreate;
  