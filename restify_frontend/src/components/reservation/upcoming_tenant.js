import React, {useState, useEffect} from 'react';
import axios from 'axios';
import './account.css';
import TokenContext from '../../contexts/TokenContext';
import {useContext} from 'react';
import {Link} from "react-router-dom";

const Upcoming_tenant = ({on_change}) => {
        const [reservations, set_reservations] = useState([]);
        const [filteredReservations, setFilteredReservations] = useState([]);
        // const {token} = useContext(TokenContext);
        const token = localStorage.token;
        const [currentPage, setCurrentPage] = useState(1);
        const reservationsPerPage = 3;
        const currentReservations = () => {
            const startIndex = (currentPage - 1) * reservationsPerPage;
            const endIndex = startIndex + reservationsPerPage;
            return filteredReservations.slice(startIndex, endIndex);
        };

        const changePage = (direction) => {
            if (direction === "prev" && currentPage > 1) {
                setCurrentPage(currentPage - 1);
            } else if (
                direction === "next" &&
                currentPage * reservationsPerPage < filteredReservations.length
            ) {
                setCurrentPage(currentPage + 1);
            }
        };


        useEffect(() => {
            if (token) {
                fetch_data();
            }
        }, [token]);

        useEffect(() => {
            if (reservations.length > 0) {
                applyFilter("All");
            }
        }, [reservations]);

        const applyFilter = (filter) => {
            if (filter === "All") {
                setFilteredReservations(reservations);
            } else {
                const filtered = reservations.filter((reservation) => reservation.state === filter);
                setFilteredReservations(filtered);
            }
        };

        const confirmAction = (message) => {
            return window.confirm(message);
        };
        const cancel_booking = async (reservation_id) => {


            if (confirmAction("Are you sure you want to cancel your reservation? If your Booking Status is approved, you need to wait for the host to approve your canceling. You will directly cancel your reservation if the status is Pending")) {
                try {
                    await axios.post(`http://127.0.0.1:8000/reservations/${reservation_id}/cancel/`, {}, {
                        headers: {
                            'Authorization': `Bearer ${token}`,
                        },
                    });
                    fetch_data();
                    on_change();
                } catch (error) {
                    if (error.response) {
                        console.error(`Error ${error.response.status}: ${error.response.data.detail}`);
                    } else {
                        console.error('Error:', error.message);
                    }
                }
            }
        };

        const fetch_data = async () => {
            try {
                const pending = await axios.get('http://127.0.0.1:8000/reservations/list/pending/tenant/', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });

                const approved = await axios.get('http://127.0.0.1:8000/reservations/list/approved/tenant/', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });

                const canceling = await axios.get('http://127.0.0.1:8000/reservations/list/canceling/tenant/', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });


                const combined = [
                    ...pending.data.results,
                    ...approved.data.results,
                    ...canceling.data.results,
                ];
                set_reservations(combined);
            } catch (error) {
                if (error.response) {
                    console.error(`Error ${error.response.status}: ${error.response.data.detail}`);
                } else {
                    console.error('Error:', error.message);
                }
            }

        };

        return (
            <div>
                <div className="d-flex align-items-center justify-content-between">
                    <h4 className="mb-4 mt-4">Upcoming Bookings</h4>
                    <div className="dropdown mt-2 mt-md-0">
                        <button className="btn btn-outline-dark dropdown-toggle"
                                type="button" data-bs-toggle="dropdown"
                                aria-expanded="false">
                            Sort By
                        </button>
                        <ul className="dropdown-menu">
                            <li>
                                <a className="dropdown-item" href="#"
                                   onClick={(e) => {
                                       e.preventDefault();
                                       applyFilter("All");
                                   }}>
                                    All
                                </a>
                            </li>
                            <li>
                                <a className="dropdown-item" href="#"
                                   onClick={(e) => {
                                       e.preventDefault();
                                       applyFilter("Pending");
                                   }}>
                                    Pending
                                </a>
                            </li>
                            <li>
                                <a className="dropdown-item" href="#"
                                   onClick={(e) => {
                                       e.preventDefault();
                                       applyFilter("Approved");
                                   }}>
                                    Approved
                                </a>
                            </li>
                            <li>
                                <a className="dropdown-item" href="#"
                                   onClick={(e) => {
                                       e.preventDefault();
                                       applyFilter("Canceling");
                                   }}>
                                    Canceling
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
                {currentReservations().map((reservation) => (
                    <div className="card border mb-4" key={reservation.id}>
                        <div
                            className="card-header border-bottom d-md-flex justify-content-md-between align-items-center">
                            <div className="d-flex align-items-center">
                                <div className="ms-2">
                                    <h6 className="card-title mb-0"
                                        style={{fontWeight: 'bold'}}>{reservation.property_name}</h6>
                                    <ul className="nav nav-divider small">
                                        <li className="nav-item">{reservation.start} - {reservation.end}
                                        </li>
                                    </ul>
                                </div>
                            </div>
                            <div className="dropdown mt-2 mt-md-0">
                                <button className="btn btn-dark dropdown-toggle"
                                        type="button" data-bs-toggle="dropdown"
                                        aria-expanded="false">
                                    Options
                                </button>
                                <ul className="dropdown-menu">
                                    <li>
                                        <Link className="dropdown-item"
                                              to={`/property/${reservation.property_id}/details/`}>
                                            View Property
                                        </Link>
                                    </li>
                                    {reservation.state !== "Canceling" && (
                                        <li>
                                            <a className="dropdown-item" href="#"
                                               onClick={(e) => {
                                                   e.preventDefault();
                                                   cancel_booking(reservation.id);
                                               }}>
                                                Cancel Booking
                                            </a>
                                        </li>
                                    )}
                                </ul>
                            </div>
                        </div>
                        <div className="card-body">
                            <div className="row g-3">
                                <div className="col-md-3">
                                    <span>Booking ID</span>
                                    <h6 className="mb-0">{reservation.id}</h6>
                                </div>
                                <div className="col-md-3">
                                    <span>Booking Time</span>
                                    <h6 className="mb-0">{new Date(reservation.creation_time).toLocaleString()}</h6>
                                </div>
                                <div className="col-md-3">
                                    <span>Address</span>
                                    <h6 className="mb-0">{reservation.property_address}</h6>
                                </div>
                                <div className="col-md-3">
                                    <span>Booking Status</span>
                                    <h6 className="mb-0">{reservation.state}</h6>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
                <button
                    className="btn btn-outline-dark"
                    type="button"
                    aria-expanded="false"
                    style={{marginRight: '7pt'}}
                    onClick={() => changePage("prev")}
                    disabled={currentPage === 1}
                >
                    &lt;
                </button>
                <button
                    className="btn btn-outline-dark"
                    type="button"
                    aria-expanded="false"
                    onClick={() => changePage("next")}
                    disabled={currentPage * reservationsPerPage >= filteredReservations.length}
                >
                    &gt;
                </button>
            </div>
        );
    }
;

export default Upcoming_tenant;
