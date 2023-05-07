import React, { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import TokenContext from '../../../contexts/TokenContext';
import '../style.css';
import NavBar from "../../Header/Header";

const PriceCreate = () => {
  const [priceData, setPriceData] = useState({
    price: '',
    start_date: '',
    end_date: '',
  });
  const { id: propertyId } = useParams();
  const { token } = useContext(TokenContext);
  const [errors, setErrors] = useState({});
  const [durationList, setDurationList] = useState([]);

  useEffect(() => {
    const fetchPropertyData = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/property/${propertyId}/details/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setDurationList(response.data.price_periods);
      } catch (error) {
        console.log(error);
        if (error.response.status === 401) {
          alert("Please login");
        }
      }
    };
    fetchPropertyData();
  }, [propertyId, token]);

  const handleChange = (e) => {
    setPriceData({ ...priceData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        `http://localhost:8000/property/${propertyId}/price/`,
        priceData, {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setDurationList([...durationList, response.data]);
      setErrors({});
      setPriceData({ price: '', start_date: '', end_date: '' });
    } catch (error) {
      console.log(error);
      console.log(error.response.data);
      setErrors(error.response.data);
    }
  };

  const handleDelete = async (priceId) => {
    try {
      await axios.delete(
        `http://localhost:8000/property/${propertyId}/price/${priceId}/`, {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setDurationList(durationList.filter((duration) => duration.id !== priceId));
    } catch (error) {
      console.log(error);
      alert('Failed to delete');
    }
  };

  return (
    <main>
      <NavBar token={token} />
        <div className="container-lg">
            <div className="card border">
                <div className="card-header border-bottom">
                    <h3 className="card-header-title">Price Information</h3>
                </div>
                <div className="card-body">
                  <form onSubmit={handleSubmit}>
                    <div className="row g-3">
                      {durationList.map((duration) => (
                        <React.Fragment key={duration.id}>
                          <div className="col-md-3">
                            <label className="form-label">Price</label>
                            <input
                              type="text"
                              className="form-control"
                              value={duration.price}
                              readOnly
                            />
                          </div>
                          <div className="col-md-4">
                            <label className="form-label">Start Date</label>
                            <input
                              type="date"
                              className="form-control"
                              value={duration.start_date}
                              readOnly
                            />
                          </div>
                          <div className="col-md-4">
                            <label className="form-label">End Date</label>
                            <input
                              type="date"
                              className="form-control"
                              value={duration.end_date}
                              readOnly
                            />
                          </div>
                          <div className="col-md-1">
                            <label className="form-label">Delete</label>
                            <button
                              type="button"
                              className="btn btn-danger float-end"
                              onClick={() => handleDelete(duration.id)}
                            >
                              Delete
                            </button>
                          </div>
                        </React.Fragment>
                      ))}
                      <div className="col-md-3">
                        <label className="form-label">Price</label>
                        <input
                          type="text"
                          className="form-control"
                          name="price"
                          placeholder="$"
                          value={priceData.price}
                          onChange={handleChange}
                          />
                          <p style={{color:"red"}}>{errors.price}</p>
                        </div>
                        <div className="col-md-4">
                          <label className="form-label">Start Date</label>
                          <input
                            type="date"
                            className="form-control"
                            name="start_date"
                            value={priceData.start_date}
                            onChange={handleChange}
                          />
                          <p style={{color:"red"}}>{errors.start_date}</p>
                        </div>
                        <div className="col-md-4">
                          <label className="form-label">End Date</label>
                          <input
                            type="date"
                            className="form-control"
                            name="end_date"
                            value={priceData.end_date}
                            onChange={handleChange}
                          />
                          <p style={{color:"red"}}>{errors.end_date}</p>
                        </div>
                        <p style={{color:"red"}}>{errors.non_field_errors}</p>
                        <button type="submit" className="btn btn-dark">
                          Create Duration
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </main>

  );
};

export default PriceCreate;

 