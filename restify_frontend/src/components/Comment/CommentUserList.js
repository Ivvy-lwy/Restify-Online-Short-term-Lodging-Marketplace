import React, {useState, useEffect} from 'react';
import axios from 'axios';
import {useParams} from 'react-router-dom';
import NavBar from "../Header/Header";

const CommentUserList = () => {
    const {id: userId} = useParams();
    const [comments, setComments] = useState([]);
    const [averageRating, setAverageRating] = useState(0);
    const token = localStorage.token;
    const [currentPage, setCurrentPage] = useState(1);
    const reservationsPerPage = 6;

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
                console.log(userId)
                const response = await axios.get(`http://127.0.0.1:8000/comments/c_user/${userId}/`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });

                setComments(response.data);
                const sumRatings = response.data.reduce((sum, comment) => sum + comment.rating, 0);
                const avgRating = sumRatings / response.data.length;
                setAverageRating(avgRating.toFixed(2));
            } catch (error) {
                if (error.response) {
                    console.error(`Error ${error.response.status}: ${error.response.data.detail}`);
                } else {
                    console.error('Error:', error.message);
                }
            }
        };

        fetchComments();
    }, [userId]);

    const commentRows = chunkArray(currentReservations(), 2);

    return (
        <div>
            <NavBar token={token}/>
            <div style={{margin: '3rem 6rem 6rem 6rem'}}>
                <div className="container">
                    <div className="row">
                        <div className="col-12" style={{textAlign: 'center'}}>
                            <h1>Tenant Ratings &#9733; {averageRating}</h1>
                        </div>
                    </div>
                    {commentRows.map((row, rowIndex) => (
                        <div className="row" key={`row-${rowIndex}`}>
                            {row.map((comment) => (
                                <div className="col-6 col-md-6"
                                     key={comment.id}>
                                    <div className="row">
                                        <div className="col-12 col-md-12">
                                            <p style={{
                                                marginBottom: 0,
                                                fontWeight: 'bold'
                                            }}>
                                            <span
                                                className="username">{comment.host_name} </span>&nbsp;&nbsp;&#9733; {comment.rating}
                                            </p>
                                            <p style={{color: 'darkgray'}}>{new Date(comment.created_at).toLocaleString()}</p>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-12 col-md-12">
                                            <p className="comment">{comment.text}</p>
                                        </div>
                                    </div>
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
        </div>
    );
};

export default CommentUserList;
