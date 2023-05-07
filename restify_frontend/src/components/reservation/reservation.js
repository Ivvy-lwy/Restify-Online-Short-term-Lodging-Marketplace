import React, {useState, useEffect} from 'react';
import Upcoming_tenant from './upcoming_tenant';
import HistoricalReservations from './historical_tenant';
import './account.css';
import NavBar from "../Header/Header";

const Reservations = () => {
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
                        <Upcoming_tenant
                            on_change={handleReservationDataChanged}/>
                        <HistoricalReservations change={upcoming_change}/>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Reservations;
