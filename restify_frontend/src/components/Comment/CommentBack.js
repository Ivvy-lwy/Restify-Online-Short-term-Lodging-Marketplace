import React, {useContext, useEffect, useState} from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useParams } from 'react-router-dom';
import TokenContext from "../../contexts/TokenContext";
import NavBar from "../Header/Header";
import Button from "react-bootstrap/Button";
import { Link } from 'react-router-dom';

const CommentBack = () => {
    const [text, setComment] = useState('');
    const { propertyId: propertyId, reservationId: reservationId } = useParams();
    const { token } = useContext(TokenContext);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            console.log(reservationId);
            await axios.post(
                `http://127.0.0.1:8000/comments/${reservationId}/`,{
                    text: text,
                    property: propertyId,
                },
                {headers: { Authorization: `Bearer ${token}` },
            });
            alert('Comment submitted successfully!');
        } catch (error) {
            console.error('Error submitting comment:', error.message);
        }
    };

    return (
    <>
      <main>
          <NavBar token={ token } />
        <div className="container-lg">
          <div className="card border">
            <div className="card-header border-bottom">
              <h3 className="card-header-title"> Comment back </h3>
            </div>

            <div className="card-body">
              <form className="row g-3" onSubmit={handleSubmit}>
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
                  <div className={"col-12 text-end"}>
                      <Button variant="dark" type="submit" className="w-100" as={Link} to={`/property/${propertyId}/details/`}>
                        Back
                    </Button>
                  </div>
              </form>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default CommentBack;