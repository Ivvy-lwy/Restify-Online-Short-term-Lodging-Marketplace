import React, {useState, useEffect} from 'react';
import HistoricalHost from './historical_host';
import UpcomingHost from './upcoming_host';
import './account.css';
import NavBar from "../Header/Header";
import {useNavigate} from "react-router-dom";

const Records = () => {
    const token = localStorage.token;
    const [upcoming_change, set_upcoming_change] = useState(false);

    const handleReservationDataChanged = () => {
        set_upcoming_change(!upcoming_change);
    };

    return (
        <div>
            <NavBar token={token}/>

            <div className="container w-100">
                <div className="card holder">
                    <div className="card-header border-bottom">
                        <h3 className="card-header-title">My Reservations</h3>
                    </div>
                    <div className="card-body">
                        <UpcomingHost on_change={handleReservationDataChanged}/>
                        <HistoricalHost change={upcoming_change}/>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Records;
