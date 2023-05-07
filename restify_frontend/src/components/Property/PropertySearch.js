import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import TokenContext from '../../contexts/TokenContext';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Card from 'react-bootstrap/Card';
import NavBar from "../Header/Header";
import Button from "react-bootstrap/Button";
import { Image } from 'react-bootstrap';


const PropertySearch = () => {
    const [searchResults, setSearchResults] = useState([]);
    const [filteredResults, setFilteredResults] = useState([]);
    const [searchCity, setSearchCity] = useState('');
    const [searchGuests, setSearchGuests] = useState('');
    const PropertyPerPage = 6;
    const [currentPage, setCurrentPage] = useState(1);
    const [totalProperty, settotalProperty] = useState(0);
    const { token } = useContext(TokenContext);
    const currentResults = () => {
        const startIndex = (currentPage - 1) * PropertyPerPage;
        const endIndex = startIndex + PropertyPerPage;
        console.log(filteredResults.slice(startIndex, endIndex));
        return filteredResults.slice(startIndex, endIndex);
    };

    const filterResults = (searchCity, searchGuests) => {
        const filteredData = searchResults.filter((property) => {
            return property.city.toLowerCase().includes(searchCity.toLowerCase()) && property.guest >= searchGuests;
        });
        setFilteredResults(filteredData);
        console.log(filteredResults)
    }

    const handleSearch = (event) => {
        event.preventDefault();
        filterResults(searchCity, searchGuests);
        handlePageNumber();
    }

    const sortResults = (sortType) => {
        const sortedData = [...filteredResults];
        sortedData .sort((a, b) => {
            if (sortType === 'price') {
                return a.price - b.price;
            }
            if (sortType === 'rating') {
                return b.rating - a.rating;
            }
            return 0;
        });
        setFilteredResults(sortedData);
        console.log(filteredResults)
    }

    useEffect(() => {
        const fetchProperties = async () => {
            try {
                  const results = [];
                  let count = 0;
                  let nextPage = 1;
                  let response;

                  do {
                    response = await axios.get(`http://localhost:8000/property/result/?offset=${(nextPage - 1) * PropertyPerPage}`);
                    results.push(...response.data.results);
                    count = response.data.count;
                    nextPage += 1;
                  } while (results.length < count);

                  // fetch property details for each property to get the image data
                  const resultsWithImages = await Promise.all(results.map(async (property) => {
                    const detailResponse = await axios.get(`http://localhost:8000/property/${property.id}/details/`, {
                        headers: { Authorization: `Bearer ${token}` },
                    });
                    return {
                      ...property,
                      image: detailResponse.data.images[0], // assuming imageData is the property where image data is stored
                    };
                  }));

                  setSearchResults(resultsWithImages);
                  console.log(searchResults);
                  settotalProperty(count);

                if (searchCity === '' && searchGuests === '') {
                    setFilteredResults(resultsWithImages);
                    console.log(filteredResults);
                }
            } catch (error) {
                console.log(error);
                console.log(error.response);
            }
        };
        fetchProperties();
    }, [currentPage, PropertyPerPage]);


    let totalPages = Math.ceil(totalProperty / PropertyPerPage);
    let pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
    }

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const handlePageNumber = () => {
        if (filteredResults.length !== totalProperty) {
            totalPages = Math.ceil(filteredResults.length / PropertyPerPage);
            pageNumbers = [];
            for (let i = 1; i <= totalPages; i++) {
                pageNumbers.push(i);
            }
            console.log(pageNumbers);
        }
    }

    const changePage = (direction) => {
        if (direction === "prev" && currentPage > 1) {
            setCurrentPage(currentPage - 1);
        } else if (
            direction === "next" &&
            currentPage * PropertyPerPage < searchResults.length
        ) {
            setCurrentPage(currentPage + 1);
        }
    };


  return (
    <main>
        <NavBar token={ token } />

        <div className="container">
            <div className="row">
                <div className="col-xl-12 position-relative mt-n3 mt-xl-n9">
                    <form className="bg-mode shadow rounded-3 position-relative p-4 pe-md-5 pb-5 pb-md-4">
                        <div className="row g-4 align-items-center">
                            <div className="col-lg-4">
                                <div className="form-control-border form-control-transparent form-fs-md d-flex">
                                    <i className="bi bi-geo-alt fs-3 me-2 mt-2"></i>
                                    <div className="flex-grow-1">
                                        <label className="form-label">Location</label>
                                        <input
                                          type="text"
                                          className="form-control"
                                          placeholder="Type your destination"
                                          value={searchCity}
                                          onChange={(event) => setSearchCity(event.target.value)}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="col-lg-4">
                                <div className="form-control-border form-control-transparent form-fs-md d-flex">
                                    <i className="bi bi-calendar fs-3 me-2 mt-2"></i>
                                    <div className="flex-grow-1">
                                        <label className="form-label">Guest</label>
                                        <input
                                          type="text"
                                          className="form-control"
                                          placeholder="Number of guests"
                                          value={searchGuests}
                                          onChange={(event) => setSearchGuests(event.target.value)}
                                        />

                                    </div>
                                </div>
                            </div>

                            <Button type="submit" className="btn btn-primary col-lg-1" onClick={handleSearch}>
                                Search
                            </Button>


                            <div className="col-lg-3">
                                <div className="d-flex">
                                    <div className="vr"></div>
                                    <div className="form-control-border form-control-transparent form-fs-md">
                                        <DropdownButton id="dropdown-basic-button" title="Sort By">
                                            <Dropdown.Item onClick={() => sortResults('price')}>Price</Dropdown.Item>
                                            <Dropdown.Item onClick={() => sortResults('rating')}>Rating</Dropdown.Item>
                                        </DropdownButton>

                                    </div>
                                </div>
                            </div>

                        </div>

                    </form>


                    <h2>Search Results</h2>
                    {/*<div className="pagination">*/}
                    {/*        {pageNumbers.map((pageNumber) => (*/}
                    {/*          <Button*/}
                    {/*            key={pageNumber}*/}
                    {/*            onClick={() => handlePageChange(pageNumber)}*/}
                    {/*            className={currentPage === pageNumber ? 'active' : ''}*/}
                    {/*          >*/}
                    {/*            {pageNumber}*/}
                    {/*          </Button>*/}
                    {/*        ))}*/}
                    {/*</div>*/}
                    <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                        {currentResults().map((search) => (
                            <div className="col-md-4" key={search.id}>
                                <Card style={{ width: '18rem', marginBottom: '1rem' }} as={Link} to={`/property/${search.id}/details`}>
                                    {/* <Card.Img variant="top" as={ Image } src={search.image} alt={search.name} style={{ width: '18rem', height: '12rem' }} /> */}
                                    <Card.Body>
                                        <Card.Title>{search.name}</Card.Title>
                                        <Card.Text>
                                            {search.address}
                                        </Card.Text>
                                        <Card.Text>
                                            &#9733; {Number(search.rating).toFixed(1)}
                                        </Card.Text>
                                        <Card.Text>
                                            $ {search.price}
                                        </Card.Text>
                                    </Card.Body>
                                </Card>
                            </div>
                            ))
                        }
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
                        disabled={currentResults().length < PropertyPerPage}
                    >
                        &gt;
                    </button>
                </div>
            </div>
        </div>

        </main>
  );
};

export default PropertySearch;