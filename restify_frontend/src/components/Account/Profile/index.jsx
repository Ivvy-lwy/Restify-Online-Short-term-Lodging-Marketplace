import React, { useState, useEffect, useContext } from 'react';
import '../style.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import TokenContext from '../../../contexts/TokenContext';
import default_photo from './default.jpg';
import NavBar from "../../Header/Header";

const Profile = () => {
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        email: '',
        phone_number: '',
        avatar: default_photo,
    });

    //const [avatar, setAvatar] = useState(null);
    const { token } = useContext(TokenContext);

    // get user profile data
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const config = {
                    headers: { Authorization: `Bearer ${token}` },
                };
                const response = await axios.get('http://localhost:8000/accounts/profile/', config);     
                setFormData(response.data);
            } catch (error) {
                console.log(error);
                if (error.response.status === 401) {
                    alert("Please login");
                }
            }
        };
    
        fetchProfile();
    }, [token]);


    const handleChange = (e) => {
        if (e.target.name === 'avatar') {
            setFormData({ ...formData, [e.target.name]: e.target.files[0] });
            handleImagePreview(e.target.files[0]);
        } else {
            setFormData({ ...formData, [e.target.name]: e.target.value });
        }
    };
    

    const handleImagePreview = (file) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const photoElement = document.getElementById('photo');
            photoElement.src = e.target.result;
        };
        reader.readAsDataURL(file);
    };
    

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${token}`,
                },
            };
    
            const form = new FormData();
            form.append('first_name', formData.first_name);
            form.append('last_name', formData.last_name);
            form.append('email', formData.email);
            form.append('phone_number', formData.phone_number);
    
            if (formData.avatar instanceof File) { // Check if formData.avatar is a File object
                form.append('avatar', formData.avatar);
            }
    
            const response = await axios.put('http://localhost:8000/accounts/profile/', form, config);
            console.log(response);
            alert("Profile updated successfully");
        } catch (error) {
            console.log(error);
            // if 401 error, set error message "Please login"
            if (error.response.status === 401) {
                alert("Please login");
            }
        }
    };
    
    

    return (
        <main>
            <NavBar token={token} />
            <div className="container-md">
                <div className="card border">
                    <div className="card-header border-bottom">
                        <h3 className="card-header-title">Personal Information</h3>
                    </div>
                    <div className="card-body">
                        <form className="mt-4" onSubmit={handleSubmit}>
                            
                            <div className="mb-3">
                                
                                <div className="mb-3 d-flex justify-content-center">
                                    <img src={formData.avatar || default_photo} alt="avatar" id="photo" />
                                </div>
                                
                                <input
                                    type="file"
                                    className='form-control'
                                    id="avatar"
                                    name="avatar"
                                    onChange={handleChange}
                                />

                            </div> 

                            <div className="mb-3">
                                <label htmlFor="first_name" className="form-label">
                                    First Name
                                </label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="first_name"
                                    name="first_name"
                                    value={formData.first_name}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="mb-3">
                                <label htmlFor="last_name" className="form-label">
                                    Last Name
                                </label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="last_name"
                                    name="last_name"
                                    value={formData.last_name}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="mb-3">
                                <label htmlFor="email" className="form-label">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    className="form-control"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                />
                            </div>
                            
                            <div className="mb-3">
                                <label htmlFor="phone_number" className="form-label">
                                    Phone Number
                                </label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="phone_number"
                                    name="phone_number"
                                    value={formData.phone_number}
                                    onChange={handleChange}
                                />
                            </div>

                            <div>
                                <button type="submit" className="w-100 btn btn-dark">
                                    Save Changes
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default Profile;
