import React, { useState, useContext } from 'react';
import '../style.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import {Link, useNavigate} from 'react-router-dom';
import TokenContext from '../../../contexts/TokenContext';
import Button from "react-bootstrap/Button";
import NavBar from "../../Header/Header";

const Login = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: '',
        password: '',
    });

    const [errors, setErrors] = useState({});
    const { setToken } = useContext(TokenContext);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post('http://localhost:8000/accounts/login/', formData);
            console.log(response);
            setErrors({});
            setToken(response.data.access);
            navigate('/property/result', { replace: true });
        }
        catch (error) {
            console.log(error);
            setErrors(error.response.data);
            // if 401 error, set error message "Invalid username or password"
            if (error.response.status === 401) {
                setErrors({username: "Invalid username or password"});
            }
        }
    };

    return (
        <main>
        <NavBar token={null} />
        <div className="container-md">
            <div className="card border">
            <div className="card-header border-bottom">
                <h3 className="card-title mb-2">Welcome back</h3>
                <p className="mb-0">
                New here? <Link to="/accounts/signup">Create an account</Link>
                </p>
            </div>

            <div className="card-body">
                <form className="mt-4" onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="username" className="form-label">
                        Username
                    </label>
                    <input
                        type="username"
                        className="form-control"
                        id="username"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                    />
                    <p style={{color:"red"}}>{errors.username}</p>
                </div>

                <div className="mb-3">
                    <label htmlFor="password" className="form-label">
                        Password
                    </label>
                    <input
                        type="password"
                        className="form-control"
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                    />
                    <p style={{color:"red"}}>{errors.password}</p>
                </div>

                <div>
                    <Button type="submit" className="w-100 btn btn-dark">
                        Login
                    </Button>
                </div>
                </form>
            </div>
            </div>
        </div>
        </main>
    );
};

export default Login;
