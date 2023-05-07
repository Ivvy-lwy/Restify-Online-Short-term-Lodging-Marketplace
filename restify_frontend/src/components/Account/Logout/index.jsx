import { useEffect, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import TokenContext from '../../../contexts/TokenContext';

const Logout = () => {
    const { token, setToken } = useContext(TokenContext);
    const navigate = useNavigate();

    useEffect(() => {
        const logoutUser = async () => {
            try {
                const config = {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                };
                await axios.post('http://localhost:8000/accounts/logout/', null, config);
            } catch (error) {
                console.log(error);
            } finally {
                setToken(null);
                navigate('/accounts/login', { replace: true });
            }
        };

        logoutUser();
    }, [token, setToken, navigate]);

    return null;
};

export default Logout;
