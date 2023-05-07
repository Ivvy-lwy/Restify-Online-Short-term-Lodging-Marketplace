import React, {useState, useEffect} from 'react';
import axios from 'axios';
import {Link} from 'react-router-dom';

const HistoricalHost = ({change}) => {

        const [reservations, set_reservations] = useState([]);
        const [filteredReservations, setFilteredReservations] = useState([]);
        // const {token} = useContext(TokenContext);
        const token = localStorage.token;
        const [currentPage, setCurrentPage] = useState(1);
        const reservationsPerPage = 3;
        const [commentExists, setCommentExists] = useState({});

        const fetchCommentExists = async (completedReservations) => {
            const commentExistsData = {};

            for (const reservation of completedReservations) {
                try {
                    const response = await axios.get(`http://127.0.0.1:8000/comments/${reservation.id}/exists/`, {
                        headers: {
                            'Authorization': `Bearer ${token}`,
                        },
                    });

                    commentExistsData[reservation.id] = response.data.length > 0;
                } catch (error) {
                    if (error.response) {
                        console.error(`Error ${error.response.status}: ${error.response.data.detail}`);
                    } else {
                        console.error('Error:', error.message);
                    }
                }
            }

            setCommentExists(commentExistsData);
        };

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
        }, [token, change]);

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

        const fetch_data = async () => {
            try {
                const denied = await axios.get('http://127.0.0.1:8000/reservations/list/denied/host/', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });

                const expired = await axios.get('http://127.0.0.1:8000/reservations/list/Expired/host/', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });

                const canceled = await axios.get('http://127.0.0.1:8000/reservations/list/Canceled/host/', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });

                const terminated = await axios.get('http://127.0.0.1:8000/reservations/list/Terminated/host/', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });

                const completed = await axios.get('http://127.0.0.1:8000/reservations/list/Completed/host/', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });

                fetchCommentExists(completed.data.results);

                const combined = [
                    ...denied.data.results,
                    ...expired.data.results,
                    ...canceled.data.results,
                    ...terminated.data.results,
                    ...completed.data.results,
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
                    <h4 className="mb-4 mt-4">Historical Bookings</h4>
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
                                       applyFilter("Denied");
                                   }}>
                                    Denied
                                </a>
                            </li>
                            <li>
                                <a className="dropdown-item" href="#"
                                   onClick={(e) => {
                                       e.preventDefault();
                                       applyFilter("Expired");
                                   }}>
                                    Expired
                                </a>
                            </li>
                            <li>
                                <a className="dropdown-item" href="#"
                                   onClick={(e) => {
                                       e.preventDefault();
                                       applyFilter("Canceled");
                                   }}>
                                    Canceled
                                </a>
                            </li>
                            <li>
                                <a className="dropdown-item" href="#"
                                   onClick={(e) => {
                                       e.preventDefault();
                                       applyFilter("Terminated");
                                   }}>
                                    Terminated
                                </a>
                            </li>
                            <li>
                                <a className="dropdown-item" href="#"
                                   onClick={(e) => {
                                       e.preventDefault();
                                       applyFilter("Completed");
                                   }}>
                                    Completed
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
                                    <li>
                                        <Link className="dropdown-item"
                                              to={`/comment/${reservation.tenant_id}/user/list/`}>
                                            Comments on User
                                        </Link>
                                    </li>
                                    {reservation.state === "Completed" && !commentExists[reservation.id] && (
                                        <li>
                                            <Link className="dropdown-item"
                                                  to={`/comment/${reservation.id}/user/`}>
                                                Comment User
                                            </Link>
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

export default HistoricalHost;
