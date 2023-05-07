import React, {useState, useEffect, useContext} from 'react';
import axios from 'axios';
import {useParams} from 'react-router-dom';
import TokenContext from "../../contexts/TokenContext";
import Button from "react-bootstrap/Button";
import { Link } from 'react-router-dom';

const CommentPropertyList = (param) => {
    const propertyId = param.propertyId;
    const ownerId = param.ownerId;
    const [comments, setComments] = useState([]);
    const [averageRating, setAverageRating] = useState(0);
    const { token } = useContext(TokenContext);
    const [currentPage, setCurrentPage] = useState(1);
    const reservationsPerPage = 6;
    const [replies, setReplies] = useState({});
    const [currentUser, setCurrentUser] = useState({
        id : '',
        first_name: '',
        last_name: '',
        email: '',
        phone_number: '',
        // avatar: default_photo,
    });

    const fetchReplies = async () => {
        try {
            let reservationId = '';
            let response = '';
            let reply = {};
            for (let i = 0; i < comments.length; i++) {
                reservationId = comments[i].reservation;
                const response = await axios.get(`http://localhost:8000/comments/property/${propertyId}/${reservationId}/`, {
                    headers: {Authorization: `Bearer ${token}`},
                });
                reply[reservationId] = response.data;
            }
            console.log(reply);
            console.log(currentUser.id)
            console.log(ownerId)
            setReplies(reply);
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        fetchReplies();
    } , [comments]);

    const fetchCurrentUser = async () => {
        try {
            if (token) {
                const response = await axios.get(`http://localhost:8000/accounts/profile/`, {
                headers: {Authorization: `Bearer ${token}`},
            });
                setCurrentUser(response.data);
            }

        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        fetchCurrentUser();
    } , []);

    const currentReservations = () => {
        const startIndex = (currentPage - 1) * reservationsPerPage;
        const endIndex = startIndex + reservationsPerPage;
        return comments.slice(startIndex, endIndex);
    };

    const changePage = (direction) => {
        if (direction === "prev" && currentPage > 1) {
            setCurrentPage(currentPage - 1);
        } else if (
            direction === "next" &&
            currentPage * reservationsPerPage < comments.length
        ) {
            setCurrentPage(currentPage + 1);
        }
    };

    const chunkArray = (arr, chunkSize) => {
        const result = [];
        for (let i = 0; i < arr.length; i += chunkSize) {
            result.push(arr.slice(i, i + chunkSize));
        }
        return result;
    };

    useEffect(() => {
        const fetchComments = async () => {
            try {
                const response = await axios.get(`http://127.0.0.1:8000/comments/property/${propertyId}/`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });
                console.log(response.data)
                setComments(response.data.results);
                const sumRatings = response.data.results.reduce((sum, comment) => sum + comment.rating, 0);
                let avgRating = 0;
                if (response.data.results.length > 0) {
                    avgRating = sumRatings / response.data.results.length;
                }
                setAverageRating(avgRating.toFixed(1));
            } catch (error) {
                if (error.response) {
                    console.error(`Error ${error.response.status}: ${error.response.data.detail}`);
                } else {
                    console.error('Error:', error.message);
                }
            }
        };

        fetchComments();
    }, [propertyId, token]);

    const commentRows = chunkArray(currentReservations(), 2);

    return (
        <>
                <div className="border_top">
                    <p className="detail_title" style={{ marginBottom: '0.5rem' }}>Customer Reviews:
                        &nbsp;&nbsp;&nbsp; &#9733;{' '} <span style={{ fontWeight: 500 }}>{averageRating}</span>
                    </p>
                </div>
        <div style={{margin: '3rem 6rem 6rem 6rem'}}>
            <div className="container">

                {commentRows.map((row, rowIndex) => (
                    <div className="row" key={`row-${rowIndex}`}>
                        {row.map((comment) => (
                            <div className="col-6 col-md-6" key={`comment-${rowIndex}-${comment.id}`} style={{marginBottom: '5rem'}}>
                                <div className="row">
                                    <div className="col-12 col-md-12">
                                        <p style={{
                                            marginBottom: 0,
                                            fontWeight: 'bold'
                                        }}>
                                            <span
                                                className="username">{comment.tenant_name} </span> &nbsp;&nbsp;&#9733; {comment.rating}
                                        </p>
                                        <p style={{color: 'darkgray'}}>{new Date(comment.created_at).toLocaleString()}</p>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-12 col-md-12">
                                        <p className="comment">{comment.text}</p>
                                    </div>
                                    {replies[comment.reservation] && replies[comment.reservation].length > 0 &&
                                        <div className="row">
                                            <div className="col-12 col-md-12" style={{marginLeft: '2rem'}}>
                                                <p style={{
                                                    marginBottom: 0,
                                                    fontWeight: 'bold'
                                                }}>
                                                    <span className="username"> {  replies[comment.reservation][0].tenant_name} </span>
                                                </p>
                                                <p style={{color: 'darkgray'}}>{new Date(replies[comment.reservation][0].created_at).toLocaleString()}</p>
                                                <p className="comment">{replies[comment.reservation][0].text}</p>
                                            </div>
                                        </div>
                                    }
                                </div>


                                {currentUser.id === ownerId &&
                                    <div className="row">
                                        <div className="col-12 col-md-12">
                                            <Button className="btn btn-outline-dark" type="button" style={{backgroundColor: 'white', color: 'black', marginRight: '7pt'}}
                                                    as={Link} to={`/comment/${propertyId}/property/${comment.reservation}/back/`}>
                                                Reply
                                            </Button>
                                        </div>
                                    </div>
                                }

                            </div>
                        ))}
                    </div>
                ))}
            </div>
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
                disabled={currentPage * reservationsPerPage >= comments.length}
            >
                &gt;
            </button>
        </div>
            </>
    );
};

export default CommentPropertyList;
