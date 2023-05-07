import React, { useState } from 'react';
import '../style.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import NavBar from "../../Header/Header";

const Signup = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    password2: '',
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const navigate = useNavigate();

  // https://stackoverflow.com/questions/63480176/how-to-link-django-and-react-urls-to-perform-actions
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await axios.post('http://localhost:8000/accounts/signup/', formData);
      console.log(response);
      setErrors({});
      // when signup is successful, redirect to login page
      navigate('/accounts/login');
    }
    catch (error) {
      console.log(error);
      setErrors(error.response.data);
    }
  };

  return (
    <main>
      <NavBar token={null} />
      <div className="container-md">
        <div className="card border">
          <div className="card-header border-bottom">
            <h3 className="mb-2">Create new account</h3>
            <p className="mb-0">
              Already a member? <Link to="/accounts/login">Log in</Link>
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
                <label htmlFor="password1" className="form-label">
                  Password
                </label>
                <input
                  type="password"
                  className="form-control"
                  id="password1"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                />
                <p style={{color:"red"}}>{errors.password}</p>
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
                  value={formData.password2}
                  onChange={handleChange}
                />
                <p style={{color:"red"}}>{errors.password2}</p>
              </div>

              {/* <div className="mb-3 form-check">
                <input
                  type="checkbox"
                  className="form-check-input"
                  id="checkbox"
                />
                <label className="form-check-label" htmlFor="checkbox">
                  You agree to our Terms & Policy.
                </label>
              </div> */}

              <div>
                <button type="submit" className="w-100 btn btn-dark">
                  Sign up
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Signup;
