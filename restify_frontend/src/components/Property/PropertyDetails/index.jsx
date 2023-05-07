import React, { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import TokenContext from '../../../contexts/TokenContext';
import { useParams } from 'react-router-dom';
import '../style.css';
import CreateReservation from '../../reservation/reserve';
import CommentPropertyList from "../../Comment/CommentPropertyList";
import "../style.css";
import NavBar from "../../Header/Header";

const PropertyDetails = () => {
  const [propertyData, setPropertyData] = useState({
    owner_id: "",
    owner: {},
    owner_username: "",
    rating: "",
    rating_num: "",
    name: "",
    address: "",
    city: "",
    description: "",
    guest: "",
    bedroom: "",
    bed: "",
    bathroom: "",
    images: [],
  });

  const { token } = useContext(TokenContext);
  const { id: propertyId } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/property/${propertyId}/details/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const { owner_username, ...restData } = response.data;

        // Fetch the owner's information
        const ownerResponse = await axios.get(`http://localhost:8000/accounts/profile/${owner_username}/`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        // Update the propertyData state
        setPropertyData({
          owner: ownerResponse.data, // Assuming the response is an array with a single object
          ...restData,
        });

        setIsLoading(false);
      } catch (error) {
        console.log(error);
        console.log(error.response.data);
        if (error.response.status === 401) {
          alert("Please login");
        }
      }
    };

    fetchProperty();
  }, [propertyId, token]);


  const handleModal = () => {
    setShowModal(!showModal);
  };

  return (
    <main>
      <NavBar token={token} />
      {!isLoading && (
        <div style={{ margin: "4rem 6rem" }}>
          <h1>{propertyData.name}</h1>
          <p className="address">
            {propertyData.address}, {propertyData.city}
          </p>

          <div className="container">
            <div className="row">
              {propertyData.images.map((imageObj) => (
                <div
                  className="col-12 col-md-4 col-lg-3 mb-4"
                  key={imageObj.id}
                >
                  <img
                    src={imageObj.image}
                    className="img-fluid adjust_border rounded-4"
                    alt="Property"
                    style={{ width: "100%", height: "auto" }}
                  />
                </div>
              ))}
            </div>
          </div>

          <div style={{ textAlign: "right", marginBottom: "0.5rem" }}>
            <button
              type="button"
              className="btn btn-success"
              onClick={handleModal}
              style={{ marginRight: "1rem" }}
            >
              Check Availability
            </button>
            {/* <a type="button" href="all_photos.html" className="btn btn-dark">
              Show All Photos
            </a> */}
          </div>

          {showModal && (
            <div className="modal" style={{ display: "block" }}>
              <div className="modal-dialog">
                <div className="modal-content">
                  <div className="modal-header">
                    <div className="d-flex justify-content-center w-100">
                      <h5 className="modal-title" style={{ fontWeight: "bold" }}>
                        Create Reservation
                      </h5>
                    </div>
                    <button
                      type="button"
                      className="btn-close"
                      onClick={handleModal}
                    ></button>
                  </div>
                  <div
                    className="modal-body"
                    style={{
                      cssText: "padding-top: 0 !important",
                    }}
                  >
                    <CreateReservation />
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="border_top">
            <p className="detail_title">About This Space</p>
            <p className="subtitle">
              {propertyData.guest} Guests &#x2022; {propertyData.bedroom} Bedrooms &#x2022;{" "}
              {propertyData.bed} Beds &#x2022; {propertyData.bathroom} Baths
            </p>
            <p>{propertyData.description}</p>
          </div>

          <CommentPropertyList propertyId={propertyId} ownerId={propertyData.owner_id} />

          <div className="border_host">
            <div className="container" style={{ margin: "0.5rem 0.5rem" }}>
            <div className="row owner-info align-items-center">
                <div className="col-12 col-md-1">
                    <img className="photo" src={propertyData.owner.avatar || "photo.jpg"} alt="avatar" />
                </div>
                <div className="col-12 col-md-2">

                    <span className="owner-label">Hosted by:</span> {propertyData.owner.user_name}

                </div>
                <div className="col-12 col-md-8">
                    <div className="row align-items-center">
                    <div className="col-12 col-md-4">

                        <span className="owner-label">Name:</span> {propertyData.owner.first_name} {propertyData.owner.last_name}

                    </div>
                    <div className="col-12 col-md-4">

                        <span className="owner-label">Phone:</span> {propertyData.owner.phone_number}

                    </div>
                    <div className="col-12 col-md-4">

                        <span className="owner-label">Email:</span> {propertyData.owner.email}

                    </div>
                    </div>
                </div>


            </div>
            </div>
          </div>
        </div>
        )}
    </main>
    );
};

export default PropertyDetails;
