import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import TokenContext from '../../../contexts/TokenContext';
import Dropdown from 'react-bootstrap/Dropdown';
import '../style.css';
import NavBar from "../../Header/Header";

const PropertyList = () => {
    const [properties, setProperties] = useState([]);
    const { token } = useContext(TokenContext);
    const [propertiesPerPage, setPropertiesPerPage] = useState(6);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalProperties, setTotalProperties] = useState(0);

    useEffect(() => {
        const fetchProperties = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/property/list/?offset=${(currentPage - 1) * propertiesPerPage}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setProperties(response.data.results);
                setTotalProperties(response.data.count);
            } catch (error) {
                console.log(error);
                if (error.response.status === 401) {
                    alert("Please login");
                }
            }
        };

        fetchProperties();
    }, [token, currentPage, propertiesPerPage]);

    const totalPages = Math.ceil(totalProperties / propertiesPerPage);
    let pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
    }

    const changePage = (direction) => {
        if (direction === "prev" && currentPage > 1) {
            setCurrentPage(currentPage - 1);
        } else if (
            direction === "next" &&
            currentPage * propertiesPerPage < totalProperties
        ) {
            setCurrentPage(currentPage + 1);
        }
    };

    return (
        <main>
            <NavBar token = {token}/>
            <div className="container w-100">
                <div className="card holder">
                    <div className="card-header border-bottom mb-4 d-md-flex justify-content-md-between">
                        <h3 className="card-header-title">My Properties</h3>
                        <div className="dropdown mt-2 mt-md-0">
                            <Link to="/property/create" className="btn btn-dark">Create</Link>
                        </div>
                    </div>

                    <div className="card-body">
                        {properties.map((property) => (
                            <div className="card border mb-4" key={property.id}>
                                <div className="card-header border-bottom d-md-flex justify-content-md-between align-items-center">
                                    <div className="d-flex align-items-center">
                                        <div className="ms-2">
                                            <h6 className="card-title mb-0" style={{ fontWeight: 'bold' }}>{property.name}</h6>
                                            <ul className="nav nav-divider small">
                                                <li className="nav-item">{property.address}, {property.city}</li>
                                            </ul>
                                        </div>
                                    </div>

                                    <div className="dropdown mt-2 mt-md-0">
                                        <Dropdown>
                                            <Dropdown.Toggle variant="dark" id="dropdown-basic">
                                            Options
                                            </Dropdown.Toggle>

                                            <Dropdown.Menu>
                                            <Dropdown.Item as={Link} to={`/property/${property.id}/details`}>
                                                Details
                                            </Dropdown.Item>
                                            <Dropdown.Item as={Link} to={`/property/${property.id}/edit`}>
                                                Edit
                                            </Dropdown.Item>
                                            <Dropdown.Item as={Link} to={`/property/${property.id}/delete`}>
                                                Delete
                                            </Dropdown.Item>
                                            </Dropdown.Menu>
                                        </Dropdown>
                                    </div>
                                </div>

                                <div className="card-body">
                                    <div className="row g-3">
                                        <div className="col-sm-6 col-md-4">
                                            <span>General Information</span>
                                            <h6 className="mb-0">{property.guest} Guests • {property.bedroom} Bedrooms • {property.bed} Beds • {property.bathroom} Baths</h6>
                                        </div>

                                        <div className="col-sm-6 col-md-2">
                                            <span>Price</span>
                                            <h6 className="mb-0">
                                                {property.price_periods.length > 0
                                                    ? `$${property.price_periods[0].price}/day`
                                                    : 'No price yet'}
                                            </h6>
                                        </div>

                                        <div className="col-sm-6 col-md-2">
                                            <span>Start Date</span>
                                            <h6 className="mb-0">
                                                {property.price_periods.length > 0
                                                    ? `${property.price_periods[0].start_date}`
                                                    : 'No start date yet'}
                                            </h6>
                                        </div>

                                        <div className="col-sm-6 col-md-2">
                                            <span>End Date</span>
                                            <h6 className="mb-0">
                                                {property.price_periods.length > 0
                                                    ? `${property.price_periods[0].end_date}`
                                                    : 'No end date yet'}
                                            </h6>
                                        </div>

                                        {/* <div className="col-md-2">
                                            <span>Rating</span>
                                            <h6 className="mb-0">&#9733;{' '} {property.rating}</h6>
                                        </div> */}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    
                </div>
                <div className="pagination" style={{ marginTop: '10pt' }}>
                    <button
                        className="btn btn-outline-dark"
                        type="button"
                        aria-expanded="false"
                        style={{ marginRight: '7pt' }}
                        onClick={() => changePage('prev')}
                        disabled={currentPage === 1}
                    >
                        &lt;
                    </button>
                    <button
                        className="btn btn-outline-dark"
                        type="button"
                        aria-expanded="false"
                        onClick={() => changePage('next')}
                        disabled={properties.length < propertiesPerPage}
                    >
                        &gt;
                    </button>
                </div>
            </div>
            
        </main>
    );
};

export default PropertyList;
