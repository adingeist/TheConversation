import React, { useEffect, useState } from 'react';
import './App.css';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import Home from './pages/Home';
import Register from './pages/Register';
import ResetPassword from './pages/ResetPassword';
import Login from './pages/Login';
import AuthHome from './pages/AuthHome';
import NavBar from './components/NavBar';
import ForgotPassword from './pages/ForgotPassword';
import { AuthContext } from './api/AuthContext';
import AuthStorage from './api/AuthStorage';
import jwtDecode from 'jwt-decode';

function App() {
  const [user, setUser] = useState();

  useEffect(() => {
    const token = AuthStorage.getAccessToken();
    if (token) {
      const user = jwtDecode(token);
      if (user) {
        setUser(user);
      }
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      <Router>
        <NavBar />
        <Routes>
          <Route exact path='/' element={user ? <AuthHome /> : <Home />} />
          <Route
            path='/register'
            element={user ? <Navigate to='/' /> : <Register />}
          />
          <Route
            path='/login'
            element={user ? <Navigate to='/' /> : <Login />}
          />
          <Route
            path='/forgotpassword'
            element={user ? <Navigate to='/' /> : <ForgotPassword />}
          />
          <Route
            path='/resetpassword'
            element={user ? <Navigate to='/' /> : <ResetPassword />}
          />
        </Routes>
      </Router>
    </AuthContext.Provider>
  );
}

export default App;
