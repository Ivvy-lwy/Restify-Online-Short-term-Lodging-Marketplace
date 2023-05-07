import React, { useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useParams } from 'react-router-dom';
import Records from "../reservation/host_record";
import NavBar from "../Header/Header";

const CommentUser = () => {
  const [rating, setRating] = useState('');
  const [text, setComment] = useState('');
  const { id: reservationId } = useParams();
  const token = localStorage.token;

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post(
        `http://127.0.0.1:8000/comments/${reservationId}/user/`,
        {
          rating,
          text,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert('Comment submitted successfully!');
    } catch (error) {
      console.error('Error submitting comment:', error.message);
    }
  };

  return (
    <>
      <main>
        <NavBar token={token}/>
        <div className="container-lg">
          <div className="card border">
            <div className="card-header border-bottom">
              <h3 className="card-header-title">User A</h3>
            </div>

            <div className="card-body">
              <form className="row g-3" onSubmit={handleSubmit}>
                <div className="col-md-12">
                  <label className="form-label">Rating</label>
                  <select
                    className="form-select"
                    style={{ marginTop: 0 }}
                    defaultValue="Rate Your Tenant"
                    onChange={(e) => setRating(e.target.value)}
                  >
                    <option disabled>Rate Your Tenant</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                  </select>
                </div>

                <div className="col-12">
                  <label className="form-label">Your Comment</label>
                  <textarea
                    className="form-control"
                    rows="3"
                    placeholder="Leave Your Comment Here"
                    value={text}
                    onChange={(e) => setComment(e.target.value)}
                  ></textarea>
                </div>

                <div className="col-12 text-end">
                  <button type="submit" className="btn btn-dark w-100">
                    Submit
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default CommentUser;
