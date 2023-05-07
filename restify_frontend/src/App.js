import './App.css';
import { BrowserRouter, Route, Routes} from 'react-router-dom';
import Signup from './components/Account/Signup';
import Login from './components/Account/Login';
import Profile from './components/Account/Profile';
import { TokenProvider } from './contexts/TokenContext';
import Logout from './components/Account/Logout';
import Password from './components/Account/Password';
import PropertyCreate from './components/Property/PropertyCreate';
import PropertyDetails from './components/Property/PropertyDetails';
import PropertyEdit from './components/Property/PropertyEdit';
import PropertyList from './components/Property/PropertyList';
import PropertyDelete from './components/Property/PropertyDelete';
import PriceCreate from './components/Property/PriceCreate';
import Reservations from "./components/reservation/reservation";
import Records from "./components/reservation/host_record";
import CreateReservation from "./components/reservation/reserve";
import CommentUser from "./components/Comment/CommentUser";
import CommentUserList from "./components/Comment/CommentUserList";
import Notification from "./components/Notification/Notification";
import NotificationView from "./components/Notification/NotificationView";
import NotificationDelete from "./components/Notification/NotificationDelete";
import NotificationDeleteAll from "./components/Notification/NotificationDeleteAll";
import PropertySearch from "./components/Property/PropertySearch";
import CommentProperty from "./components/Comment/CommentProperty";
import CommentPropertyList from "./components/Comment/CommentPropertyList";
import CommentBack from "./components/Comment/CommentBack";

function App() {
  return (
    <TokenProvider>
      <BrowserRouter>
        <Routes>
          <Route path="accounts/">
            <Route path="signup" element={<Signup />} />
            <Route path="login" element={<Login />} />
            <Route path="logout" element={<Logout />} />
            <Route path="profile" element={<Profile />} />
            <Route path="password" element={<Password />} />
          </Route>
          <Route path="property/">
            <Route path="create" element={<PropertyCreate />} />
            <Route path=":id/details" element={<PropertyDetails />} />
            <Route path=":id/edit" element={<PropertyEdit />} />
            <Route path="list" element={<PropertyList />} />
            <Route path=":id/price/" element={<PriceCreate />} />
            <Route path=":id/delete/" element={<PropertyDelete />} />
            <Route path="result/" element={<PropertySearch />} />
          </Route>
          <Route path="reservation/">
            <Route path="tenant" element={<Reservations />} />
            <Route path="host" element={<Records />} />
            <Route path=":id/reserve" element={<CreateReservation />} />
          </Route>
          <Route path="comment/">
            <Route path=":id/user" element={<CommentUser />} />
            <Route path=":id/user/list" element={<CommentUserList />} />
            <Route path=":propertyId/property/:reservationId" element={<CommentProperty />} />
            <Route path=":propertyId/property/:reservationId/back" element={<CommentBack />} />
          </Route>
          <Route path="notifications/">
              <Route path="list" element={<Notification />} />
              <Route path="view/:id" element={<NotificationView />} />
              <Route path="delete/:id" element={<NotificationDelete />} />
              <Route path="deleteAll" element={<NotificationDeleteAll />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </TokenProvider>
  );
}

export default App;
