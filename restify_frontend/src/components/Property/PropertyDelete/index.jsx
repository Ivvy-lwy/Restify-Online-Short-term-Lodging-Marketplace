import { useParams } from 'react-router-dom';
//import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import TokenContext from '../../../contexts/TokenContext';
import { useContext } from 'react';
import '../style.css';

const PropertyDelete = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { token } = useContext(TokenContext);

  const handleDelete = async () => {
    try {
        const response = await axios.delete(
          `http://localhost:8000/property/${id}/delete/`,
          {
            headers: {Authorization: `Bearer ${token}`},
          }
        );
        navigate('/property/list');
        console.log(response.data.message);
    } catch (error) {
        console.log(error);
        console.log(error.response.data);
    }
  };

  return (
    <div className="d-flex flex-column align-items-center justify-content-center h-100">
    <label style={{ fontSize: '1.5rem' }} className="mb-4" >Are you sure you want to delete this property?</label>
    <div className="d-grid gap-2 d-md-flex justify-content-center">
        <button className="btn btn-dark" type="button" onClick={handleDelete}>Yes, delete</button>
        <button className="btn btn-dark" type="button" onClick={() => navigate(-1)}>Cancel</button>
    </div>
    </div>
  );
};

export default PropertyDelete;
