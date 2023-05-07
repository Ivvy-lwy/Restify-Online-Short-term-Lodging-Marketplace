import React, { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import TokenContext from '../../../contexts/TokenContext';
import { useParams, Link } from 'react-router-dom';
import '../style.css';
import NavBar from "../../Header/Header";

const PropertyEdit = () => {
    const [propertyData, setPropertyData] = useState({
        owner_username: '',
        // rating: '',
        // rating_num: '',
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
    const { id: propertyId } = useParams();
    const [isLoading, setIsLoading] = useState(true);
    const [images, setImages] = useState([]); 

    useEffect(() => {
        const fetchProperty = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/property/${propertyId}/details/`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setPropertyData(response.data);
                setImages(response.data.images || []); 
                setIsLoading(false);
            } catch (error) {
                console.log(error);
                console.log(error.response.data);
                setErrors(error.response.data);
                if (error.response.status === 401) {
                    alert("Please login");
                }
            }
        };
        fetchProperty();
    }, [propertyId, token]);
    
    

    const handleChange = (e) => {
        const value = e.target.type === 'file' ? e.target.files[0] : e.target.value;
        setPropertyData({ ...propertyData, [e.target.name]: value });
    };

    const handleImageRemove = async (imageId) => {
        try {
            await axios.delete(`http://localhost:8000/property/${propertyId}/details/`, {
                headers: { Authorization: `Bearer ${token}` },
                data: { image_id: imageId },
            });
            setImages(images.filter((img) => img.id !== imageId));
        } catch (error) {
            console.log(error);
            console.log(error.response.data);
            setErrors(error.response.data);
        }
    };
    
    const handleImageAdd = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('image', file);

        try {
            const response = await axios.put(`http://localhost:8000/property/${propertyId}/details/`, formData, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setImages([...images, response.data]);
        } catch (error) {
            console.log(error);
            console.log(error.response.data);
            setErrors(error.response.data);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        // Clone the propertyData object
        const editablePropertyData = { ...propertyData };
    
        // Remove read-only fields
        // delete editablePropertyData.owner_username;
        // delete editablePropertyData.rating;
        // delete editablePropertyData.rating_num;
        // delete editablePropertyData.price_periods;
        // delete editablePropertyData.id;
        // delete editablePropertyData.image;
    
        const formData = new FormData();
        for (const key in editablePropertyData) {
            formData.append(key, editablePropertyData[key]);
        }
    
        try {
            const response = await axios.put(`http://localhost:8000/property/${propertyId}/details/`, formData, {
                headers: { Authorization: `Bearer ${token}` },
            });
            console.log(response.data);
            alert('Property updated successfully');
        } catch (error) {
            console.log(error);
            console.log(error.response.data);
            setErrors(error.response.data);
        }
    };

    return (
    <main>
        <NavBar token = {token}/>
        <div className="container-lg">
            <div className="card border">
                <div className="card-header border-bottom">
                    <h3 className="card-header-title">Property Information</h3>
                </div>

                <div className="card-body">
                    {isLoading ? (
                        <p>Loading...</p>
                    ) : (
                        <form className="row g-3" onSubmit={handleSubmit}>
                            <div className="col-12">
                                <label className="form-label">Edit your property photos</label>
                                <div className="d-flex flex-wrap">
                                    {images.map((img) => (
                                        <div key={img.id} className="position-relative me-2 mb-2">
                                            <img src={img.image} alt="property" style={{ width: '100px', height: '100px', objectFit: 'cover' }} />
                                            <button
                                                type="button"
                                                className="btn btn-danger btn-sm position-absolute"
                                                style={{ top: '0', right: '0' }}
                                                onClick={() => handleImageRemove(img.id)}
                                            >
                                                &times;
                                            </button>
                                        </div>
                                    ))}
                                </div>
                                <div className="d-flex align-items-center">
                                    <label className="btn btn-sm btn-dark" htmlFor="image">Add Photos</label>
                                    <input id="image" className="form-control d-none" type="file" name="image" onChange={handleImageAdd} />
                                </div>
                            </div>
                            <div className="col-md-12">
                                <label className="form-label">Owner</label>
                                <input type="text" className="form-control" name="owner_username" value={propertyData.owner_username} readOnly />
                            </div>
                            {/* <div className="col-md-12">
                                <label className="form-label">Rating</label>
                                <input type="text" className="form-control" name="rating" value={propertyData.rating} readOnly />
                            </div>
                            <div className="col-md-12">
                                <label className="form-label">Number of Ratings</label>
                                <input type="text" className="form-control" name="rating_num" value={propertyData.rating_num} readOnly />
                            </div> */}

                            <div className="col-12">
                                {/* <label className="form-label">Edit your property photos</label>
                                <div className="d-flex align-items-center">
                                <label className="btn btn-sm btn-dark" htmlFor="change">Add Photos</label>
                                <input id="image" className="form-control d-none" type="file" name="image" onChange={handleChange} />
                                </div> */}
                            </div>
                            <div className="col-md-12">
                                <label className="form-label">Name</label>
                                <input type="text" className="form-control" name="name" id="name" value={propertyData.name} onChange={handleChange} />
                                <p style={{color:"red"}}>{errors.name}</p>
                            </div>
                            <div className="col-md-12">
                                <label className="form-label">Address</label>
                                <input type="text" className="form-control" name="address" id='address' value={propertyData.address} onChange={handleChange} />
                                <p style={{color:"red"}}>{errors.address}</p>
                            </div>
                            <div className="col-md-12">
                                <label className="form-label">City</label>
                                <input type="text" className="form-control" name="city" id="city" value={propertyData.city} onChange={handleChange} />
                                <p style={{color:"red"}}>{errors.city}</p>
                            </div>
                            <div className="col-md-3">
                                <label className="form-label">Number of Guests</label>
                                <input type="text" className="form-control" name="guest" id='guest' value={propertyData.guest} onChange={handleChange} />
                                <p style={{color:"red"}}>{errors.guest}</p>
                            </div>
                            <div className="col-md-3">
                                <label className="form-label">Number of Bedrooms</label>
                                <input type="text" className="form-control" name="bedroom" id='bedroom' value={propertyData.bedroom} onChange={handleChange} />
                                <p style={{color:"red"}}>{errors.bedroom}</p>
                            </div>
                            <div className="col-md-3">
                                <label className="form-label">Number of Beds</label>
                                <input type="text" className="form-control" name="bed" id='bed' value={propertyData.bed} onChange={handleChange} />
                                <p style={{color:"red"}}>{errors.bed}</p>
                            </div>
                            <div className="col-md-3">
                                <label className="form-label">Number of Baths</label>
                                <input type="text" className="form-control" name="bathroom" id='bathroom' value={propertyData.bathroom} onChange={handleChange} />
                                <p style={{color:"red"}}>{errors.bathroom}</p>
                            </div>
                            <div className="col-md-12">
                                <label className="form-label">Description</label>
                                <textarea className="form-control" rows="4" name="description" id='description' value={propertyData.description} onChange={handleChange} />
                                <p style={{color:"red"}}>{errors.description}</p>
                            </div>
                            <div className="col-md-12">
                                <label className="form-label">Price</label>
                                <input type="text" className="form-control" name="price" id='price' value={propertyData.price} onChange={handleChange} />
                                <p style={{color:"red"}}>{errors.price}</p>
                            </div>
                            <div className="col-12 text-end">
                                <Link to={`/property/${propertyId}/price/`} className="btn btn-dark me-2 w-100">Edit Prices</Link>
                            </div>

                            <div className="col-12 text-end">
                                <button type="submit" className="btn btn-dark w-100">Save Changes</button>
                            </div>
                        </form>
                        )}
                    </div>
                </div>
            </div>
        </main>
    );
}


export default PropertyEdit;
  