import React, {useState, useEffect} from 'react';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import {useParams} from 'react-router-dom';

const CreateReservation = () => {
    const [startDate, setStartDate] = useState([]);
    const [endDate, setEndDate] = useState([]);
    const [unavailableDates, setUnavailableDates] = useState([]);
    const [startPrice, setStartPrice] = useState(null);
    const [endPrice, setEndPrice] = useState(null);
    const {id: propertyId} = useParams();
    const [isValidDateRange, setIsValidDateRange] = useState(true);
    const [totalPrice, setTotalPrice] = useState(null);

    const calculateTotalPrice = async (start, end) => {
        if (!start || !end) {
            return;
        }

        let currentDate = new Date(start);
        let priceSum = 0;

        while (currentDate <= end) {
            const price = await fetchPrice(currentDate, propertyId);
            priceSum += price;
            currentDate.setDate(currentDate.getDate() + 1);
        }

        setTotalPrice(priceSum);
    };

    useEffect(() => {
        fetchUnavailableDates();
    }, []);

    useEffect(() => {
        setIsValidDateRange(isStartDateValid());
    }, [startDate, endDate]);

    const isDateWithinRange = (date, rangeStart, rangeEnd) => {
        return rangeStart <= date && date <= rangeEnd;
    };

    const isStartDateValid = () => {
        if (!startDate[0] || !endDate[0]) {
            return true;
        }

        if (startDate[0] > endDate[0]) {
            return false;
        }

        for (const range of unavailableDates) {
            const rangeStart = new Date(range.start);
            const rangeEnd = new Date(range.end);

            rangeStart.setHours(0, 0, 0, 0);
            rangeStart.setDate(rangeStart.getDate() + 1);
            rangeEnd.setHours(0, 0, 0, 0);
            rangeEnd.setDate(rangeEnd.getDate() + 1);

            // Check if the current range overlaps with the selected start and end dates
            if (
                (isDateWithinRange(startDate[0], rangeStart, rangeEnd) ||
                    isDateWithinRange(endDate[0], rangeStart, rangeEnd)) ||
                (startDate[0] <= rangeStart && endDate[0] >= rangeEnd)
            ) {
                return false;
            }
        }

        return true;
    };

    const fetchUnavailableDates = async () => {
        try {
            const response = await axios.get(`http://127.0.0.1:8000/reservations/${propertyId}/`);
            setUnavailableDates(response.data);
        } catch (error) {
            console.error('Error fetching unavailable dates:', error.message);
        }
    };


    const fetchPrice = async (date, propertyId) => {
        try {
            const dateString = date.toISOString().split('T')[0];
            // console.log(dateString)
            const response = await axios.get(`http://127.0.0.1:8000/property/${propertyId}/${dateString}/price_periods/`);
            // console.log(1111)
            // console.log(response.data)
            // console.log(response.data[0].price)
            return response.data[0].price;
        } catch (error) {
            console.error('Error fetching price:', error.message);
        }
    };

    const handleStartDateChange = async (date) => {
        setStartDate([date]);
        const price = await fetchPrice(date, propertyId);
        setStartPrice(price);
        console.log('isValidDateRange:', isValidDateRange);
        calculateTotalPrice(date, endDate[0]);
    };

    const handleEndDateChange = async (date) => {
        setEndDate([date]);
        const price = await fetchPrice(date, propertyId);
        setEndPrice(price);
        console.log('isValidDateRange:', isValidDateRange);
        calculateTotalPrice(startDate[0], date);
    };
    useEffect(() => {
        fetchUnavailableDates();
    }, []);


    const isDateUnavailable = (date) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (date < today) {
            return true;
        }

        // const start = new Date(unavailableDates[7].start);
        // const end = new Date(unavailableDates[7].end);
        // // start.setHours(0, 0, 0, 0);
        // // end.setHours(0, 0, 0, 0);
        // console.log("start: ", start);
        // console.log("end: ", end);
        // console.log(today);
        // const a = (new Date(start) <= date && date <= new Date(end))
        // console.log(a)

        for (const range of unavailableDates) {
            const rangeStart = new Date(range.start);
            const rangeEnd = new Date(range.end);

            rangeStart.setHours(0, 0, 0, 0);
            rangeStart.setDate(rangeStart.getDate() + 1);
            rangeEnd.setHours(0, 0, 0, 0);
            rangeEnd.setDate(rangeEnd.getDate() + 1);

            if (rangeStart <= date && date <= rangeEnd) {
                return true;
            }
        }
        return false;
    };

    const handleCreateReservation = async () => {
        try {
            const token = localStorage.token;

            const formattedStartDate = startDate[0].toLocaleDateString('en-CA');
            const formattedEndDate = endDate[0].toLocaleDateString('en-CA');

            await axios.post(`http://127.0.0.1:8000/reservations/${propertyId}/reserve/`, {
                start: formattedStartDate,
                end: formattedEndDate
            }, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            alert('Reservation created successfully!');
        } catch (error) {
            console.error('Error creating reservation:', error.message);
            console.log(error.response.data);
        }
    };

    return (
        <div className="container">
            <div className="row">
                <div className="col-12 col-md-6">
                    <label style={{fontWeight: 'bold', textAlign: 'center'}}>Start
                        Date:</label>
                    <DatePicker
                        selected={startDate[0]}
                        onChange={(date) => handleStartDateChange(date)} // Use handleStartDateChange here
                        dateFormat="yyyy-MM-dd"
                        filterDate={(date) => !isDateUnavailable(date)}
                    />
                </div>
                <div className="col-12 col-md-6">
                    <label style={{fontWeight: 'bold', textAlign: 'center'}}>End
                        Date:</label>
                    <DatePicker
                        selected={endDate[0]}
                        onChange={(date) => handleEndDateChange(date)} // Use handleEndDateChange here
                        dateFormat="yyyy-MM-dd"
                        filterDate={(date) => !isDateUnavailable(date)}
                    />
                </div>
            </div>

            <div className="row" style={{marginTop: '2rem'}}>
                {startPrice && (
                    <div className="col-12 col-md-6"
                         style={{textAlign: 'center'}}>
                        <p style={{marginBottom: 0}}>Start Price:
                            ${startPrice}</p>
                    </div>
                )}
                {endPrice && (
                    <div className="col-12 col-md-6"
                         style={{textAlign: 'center'}}>
                        <p style={{marginBottom: 0}}>End Price: ${endPrice}</p>
                    </div>
                )}
            </div>
            {totalPrice !== null && (
                <div className="row">
                    <div
                        className="col-12 col-md-12 d-flex justify-content-center"
                        style={{margin: '1rem'}}
                    >
                        <p>Total Price: ${totalPrice}</p>
                    </div>
                </div>
            )}
            {isValidDateRange ? (
                <div className="row">
                    <div
                        className="col-12 col-md-12 d-flex justify-content-center">
                        <button
                            onClick={handleCreateReservation}
                            className="btn btn-dark"
                            style={{margin: '2rem'}}
                        >
                            Reserve
                        </button>
                    </div>
                </div>
            ) : (
                <div className="row">
                    <div
                        className="col-12 col-md-12 d-flex justify-content-center">
                        <p className="text-danger" style={{margin: '2rem'}}>
                            Invalid Dates
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CreateReservation;
