import React, { useState, useContext } from 'react';
import TokenContext from '../../../contexts/TokenContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../style.css';
import NavBar from "../../Header/Header";

const Password= () => {
    const [passwordData, setPasswordData] = useState({
        password1: '',
        password2: '',
    });

    const { token } = useContext(TokenContext);
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    const handleChange = (e) => {
        setPasswordData({
        ...passwordData,
        [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.put('http://localhost:8000/accounts/password/', passwordData, {
                headers: { Authorization: `Bearer ${token}` },});
        console.log(response.data.message);
        navigate('/accounts/login');
        
        } catch (error) {
            console.log(error);
            setErrors(error.response.data);
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
                <h3 className="card-header-title">Change Password</h3>
            </div>
            <div className="card-body">
                <form className="mt-4" onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="password1" className="form-label">
                    New Password
                    </label>
                    <input
                    type="password"
                    className="form-control"
                    id="password1"
                    name="password1"
                    value={passwordData.password1}
                    onChange={handleChange}
                    />
                    <p style={{color:"red"}}>{errors.password1}</p>
                </div>
                <div className="mb-3">
                    <label htmlFor="password2" className="form-label">
                    Confirm Password
                    </label>
                    <input
                    type="password"
                    className="form-control"
                    id="password2"
                    name="password2"
                    value={passwordData.password2}
                    onChange={handleChange}
                    />
                    <p style={{color:"red"}}>{errors.password2}</p>
                </div>
                <div>
                    <button type="submit" className="w-100 btn btn-dark">
                    Change Password
                    </button>
                </div>
                </form>
            </div>
            </div>
        </div>
        </main>
    );
};

export default Password;
