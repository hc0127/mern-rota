import './App.css';

import React from 'react';
import { Route, Routes } from 'react-router-dom';

import Navbar from './pages/components/Navbar';
import Basic from './pages/basic';
import Assign from './pages/assign';
import Total from './pages/total';
import DashBoard from './pages/dashboard';
import Login from './pages/login';
import NotFound from './pages/404page';
import { createBrowserHistory  } from 'history';

function getToken(){
  const tokenString = sessionStorage.getItem('token');
  if(!tokenString || tokenString == null || tokenString == undefined){
    return false;
  }
  const userToken = JSON.parse(tokenString);
  return userToken;
}

// function setToken(userToken){
//   sessionStorage.setItem('token', JSON.stringify(userToken));
// }

function App() {
  const token = getToken();
  const history = createBrowserHistory();
  console.log(token);

  if(!token) {
    history.push('login');
    return <Login />
  }

  return (
    <div className="App">
      <header className="App-header">
        <Navbar />
        <Routes history={history}>
          {
            token && <Route path='/login' element={<Login />} />
          }
          <Route path='/' element={<DashBoard />} />
          <Route path='basic' element={<Basic />} />
          <Route path='assign' element={<Assign />} />
          <Route path='total' element={<Total />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </header>
    </div>
  );
}

export default App;
