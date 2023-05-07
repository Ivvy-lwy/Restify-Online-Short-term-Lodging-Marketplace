import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import TokenContext from '../../contexts/TokenContext';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Button from 'react-bootstrap/Button';
import NavBar from "../Header/Header";


const Notification = () => {
    const [notifications, setNotifications] = useState([]);
    const { token } = useContext(TokenContext);
    const [errors, setErrors] = useState(null);
    const [notificationsPerPage, setNotificationPerPage] = useState(6);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalNotifications, setTotalNotifications] = useState(0);
    const notificationTypeNames = {
        'RATING': 'Rating',
        'COMMENT': 'Comment',
        'RESERVATION_REQUEST': 'Reservation Request',
        'RESERVATION_APPROVAL': 'Reservation Approval',
        'RESERVATION_CANCELLATION': 'Reservation Cancellation',
        'RESERVATION_DENIAL': 'Reservation Denial',
        'UPCOMING_RESERVATION': 'Upcoming Reservation',
        'CANCELING_APPROVAL': 'Canceling Approval',
        'CANCELING_DENIAL': 'Canceling Denial',
        'RESERVATION_TERMINATION': 'Reservation Termination',
    };


    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/notifications/list/?offset=${(currentPage - 1) * notificationsPerPage}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                console.log(response);
                setNotifications(response.data.results);
                setTotalNotifications(response.data.count);
                console.log(notifications.length)
            } catch (error) {
                console.log(error);
                setErrors(error.response);
            }
        };

        fetchNotifications();
    }, [token, currentPage, notificationsPerPage]);


    const totalPages = Math.ceil(totalNotifications / notificationsPerPage);
    let pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
    }

    const changePage = (direction) => {
        if (direction === "prev" && currentPage > 1) {
            setCurrentPage(currentPage - 1);
        } else if (
            direction === "next" &&
            currentPage * notificationsPerPage < totalNotifications
        ) {
            console.log('next')
            setCurrentPage(currentPage + 1);
        }
    };


    return (

        <main>
            <NavBar token={ token } />
            <div className="container-lg">
                <div className="card border">
                    <div className="card-header border-bottom d-flex justify-content-between">
                        <h3 className="card-header-title">Notifications</h3>
                        {notifications.length > 0 && (
                            <Button variant="danger" as={Link} to="/notifications/deleteAll/">
                                Clear All Notifications
                            </Button>
                        )}
                    </div>
                    <div className="card-body">
                        <div className="table-responsive">
                            <table className="table table-striped table-hover">
                                <thead>
                                    <tr>
                                        <th scope="col">Title</th>
                                        <th scope="col">Sender</th>
                                        <th scope="col">Is Read</th>
                                        <th scope="col">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {notifications.map((notification) => (
                                        <tr key={notification.id}>
                                            <td>
                                                {notification.is_read ? (
                                                    notificationTypeNames[notification.type]
                                                ) : (
                                                    <span style={{fontWeight: 'bold', fontStyle: 'italic'}}>
                                                        {notificationTypeNames[notification.type]}
                                                    </span>
                                                )}
                                            </td>
                                            <td>{notification.sender}</td>
                                            <td>{notification.is_read ? 'Yes' : 'No'}</td>
                                            <td>
                                                <DropdownButton id="dropdown-basic-button" title="Actions">
                                                    <Dropdown.Item as={Link} to={`/notifications/view/${notification.id}`}>View</Dropdown.Item>
                                                    <Dropdown.Item as={Link} to={`/notifications/delete/${notification.id}`}>Delete</Dropdown.Item>
                                                </DropdownButton>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/*<div className="pagination">*/}
                        {/*    {pageNumbers.map((pageNumber) => (*/}
                        {/*      <Button*/}
                        {/*        key={pageNumber}*/}
                        {/*        onClick={() => handlePageChange(pageNumber)}*/}
                        {/*        className={currentPage === pageNumber ? 'active' : ''}*/}
                        {/*      >*/}
                        {/*        {pageNumber}*/}
                        {/*      </Button>*/}
                        {/*    ))}*/}
                        {/*</div>*/}


                        <div className="pagination" style={{marginTop: '10pt'}}>
                            <button
                                className="btn btn-outline-dark"
                                type="button"
                                aria-expanded="false"
                                style={{marginRight: '7pt'}}
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
                                disabled={notifications.length < notificationsPerPage}
                            >
                                &gt;
                            </button>
                        </div>
                    </div>

                </div>
            </div>
        </main>
    );
}

export default Notification;
