// import logo from './logo.svg';
import './App.css';
import NavbarComponent from './components/Navbar';
import 'bootstrap/dist/css/bootstrap.min.css';
import Home from './pages/LandingPage';
import Form from './pages/FormDonation';
import Profile from './pages/Profile';
import { Route, Routes, useNavigate } from 'react-router-dom';
import React, { useContext, useEffect, useState } from 'react';
import { UserContext } from './context/UserContext';
import { API, setAuthToken } from './config/api';
import PrivateRoute from './components/PrivateRoute';
import History from './pages/History';
import DetailDonation from './pages/DetailDonation';
function App() {

  let navigate = useNavigate();
  const [state, dispatch] = useContext(UserContext);
  const [isLoading, setIsLoading] = useState(true);

  console.log(state)
  useEffect(() => {
    // Redirect Auth but just when isLoading is false
    if (!isLoading) {
      if (state.isLogin === false) {
        navigate('/');
      }
    }
  }, [isLoading]);

  useEffect(() => {
    if (localStorage.token) {
      setAuthToken(localStorage.token);
      checkUser();
    } else {
      setIsLoading(false)
    }
  }, []);

  const checkUser = async () => {
    try {
      const response = await API.get("/check-auth");

      // Get token from local storage
      console.log("response checkauth", response);

      // If the token incorrect
      if (response.status === 404) {
        return dispatch({
          type: "AUTH_ERROR",
        });
      }

      // Get user data
      let payload = response.data.data;
      // Get token from local storage
      console.log("payload", payload);
      payload.token = localStorage.token;

      // Send data to useContext
      dispatch({
        type: "USER_SUCCESS",
        payload,
      });
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  return (
    <>
      <NavbarComponent />
      {isLoading ? null :
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/form" element={<Form />} />
          <Route path="/history" element={<History />} />
          <Route path="/detail-donation/:id" element={<DetailDonation />} />
        </Routes>
      }
    </>  
  );
}

export default App;
