import React, { useState, useEffect, useContext } from 'react';
import {Link, useParams} from 'react-router-dom';
import axios from 'axios';
import TokenContext from '../../contexts/TokenContext';
import Header from '../Header/Header';

// View single notification
const NotificationView = () => {
    const [notification, setNotification] = useState({
        type: '',
        sender: '',
        receiver: '',
        message: '',
        is_read: false,
        timestamp: '',
    });
    const { id } = useParams();
    const { token } = useContext(TokenContext);
    const [errors, setErrors] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);

    const handleInputChange = async (event) => {

        setNotification({...notification, is_read: !notification.is_read});
    }

    const handleSubmit = async (event) => {
        try {
                console.log(notification)
                const response = await axios.put(`http://localhost:8000/notifications/view/${id}/`,
                    notification,
                    { headers: { Authorization: `Bearer ${token}` }

                });
            } catch (error) {
                console.log(error);
            }
    }

    useEffect(() => {
        const getNotification = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/notifications/view/${id}/`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                console.log(response);
                setNotification(response.data);
                setIsLoaded(true);
            } catch (error) {
                console.log(error);
            }
        }
        getNotification().then(r => console.log(r));
    }, [id, token]);

  return (
    isLoaded && (
      <main>
          <Header token={token} />
        <div className="container-lg">
          <div className="card border">
            <div className="card-header border-bottom">
              <h3 className="card-header-title">View Notification</h3>
            </div>
            <div className="card-body">
              <form className="row g-3" onSubmit={handleSubmit}>
                <div className="col-md-12">
                  <label className="form-label">Message</label>
                  <input type="text" className="form-control" name="message" id="message" value={notification.message} readOnly />
                  <p style={{ color: 'red' }}>{errors?.message}</p>
                </div>

                <div className="col-md-6">
                  <label className="form-label">Type</label>
                  <input type="text" className="form-control" name="type" id="type" value={notification.type} readOnly />
                  <p style={{ color: 'red' }}>{errors?.type}</p>
                </div>

                <div className="col-md-6">
                  <label className="form-label">Timestamp</label>
                  <input type="text" className="form-control" name="timestamp" id="timestamp" value={notification.timestamp} readOnly />
                  <p style={{ color: 'red' }}>{errors?.timestamp}</p>
                </div>

                <div className="col-md-6">
                    <label className="form-label" style={{marginRight: '10px'}}>Mark as read</label>
                    <input type="checkbox" name="is_read" id="is_read" checked={notification.is_read} style={{ width: '15px', height: '15px' }}
                           onChange={handleInputChange } />
                    <p style={{ color: 'red' }}>{errors?.is_read}</p>
                </div>

                <div className="d-flex justify-content-between">

                    <div >
                      <Link to="/notifications/list/" className="btn btn-secondary">Back</Link>
                    </div>

                      <div >
                          <button type="submit" className="btn btn-primary">Update</button>
                        </div>
                </div>

                  {notification.type === 'RESERVATION_REQUEST' &&
                        <div className="col-12">
                            <Link to={`/reservation/host/`} className="btn btn-primary">View User Booking </Link>
                        </div>
                  }



              </form>
            </div>
          </div>
        </div>
      </main>
    )
  );
};

export default NotificationView;