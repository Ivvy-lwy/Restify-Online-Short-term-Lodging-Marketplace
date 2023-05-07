import React from 'react';
import { Link } from 'react-router-dom';
// import axios from 'axios';
// import TokenContext from '../../contexts/TokenContext';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Container from 'react-bootstrap/Container';
import logo from './logo.png';

const Header = ({token}) => {
    const loggedIn = token !== null;
    // const [currentUser, setCurrentUser] = useState({
    //     id : '',
    //     first_name: '',
    //     last_name: '',
    //     email: '',
    //     phone_number: '',
    //     // avatar: default_photo,
    // });

    // const fetchCurrentUser = async () => {
    //     try {
    //         if (loggedIn) {
    //             const response = await axios.get(`http://localhost:8000/accounts/profile/`, {
    //             headers: {Authorization: `Bearer ${token}`},
    //         });
    //             setCurrentUser(response.data);
    //         }
    //
    //
    //     } catch (error) {
    //         console.log(error);
    //     }
    // }

    // useEffect(() => {
    //     fetchCurrentUser();
    // } , []);

    return (
    <Navbar bg="light" >
      <Container>
        <Navbar.Brand as={Link} to="/property/result">
            <img
              src={logo}
              width="30"
              height="30"
              className="d-inline-block align-top"
              alt="Restify logo"
            />
            Restify</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">

          <Nav className="me-auto">
            {loggedIn ? (
                <>
                <Nav.Link as={Link} to="/notifications/list">Notifications</Nav.Link>

              <NavDropdown title="Profile" id="basic-nav-dropdown">
                <NavDropdown.Item as={Link} to="/accounts/profile">
                    Profile
                </NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/accounts/password">
                    Change Password
                </NavDropdown.Item>
                <NavDropdown.Item as={Link} to={`/reservation/tenant`}>
                  My Bookings
                </NavDropdown.Item>
                <NavDropdown.Item as={Link} to={`/property/list`}>
                   My Properties
                </NavDropdown.Item>
                  <NavDropdown.Item as={Link} to={`/reservation/host`}>
                   Host Records
                </NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item as={Link} to="/accounts/logout">
                  Log Out
                </NavDropdown.Item>
              </NavDropdown>
                </>
            ) : (
                <>
                <Nav.Link as={Link} to="/accounts/login">Log In</Nav.Link>
                <Nav.Link as={Link} to="/accounts/signup">Register</Nav.Link>
                </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
    );
}

export default Header;