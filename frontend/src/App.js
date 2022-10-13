import './css/App.css';
import './css/sidebar.css';

import React from 'react';
import { Route, Routes } from 'react-router-dom';

import {Navbar,Sidebar} from './components';
import DashBoard from './pages/dashboard';
import Basic from './pages/basic';
import WorkingDays from './pages/working';
import LeaveDays from './pages/leave';
import Roaster from './pages/roaster';
import Total from './pages/total';
import PayRoll from './pages/payroll';
import Revenue from './pages/revenue';
import PNL from './pages/pnl';
import Login from './pages/login';
import NotFound from './pages/404page';
import { createBrowserHistory  } from 'history';

import Layout from './layout';

function getToken(){
  const tokenString = sessionStorage.getItem('token');
  if(tokenString == 'undefined'){
    return false;
  }else{
    const userToken = JSON.parse(tokenString);
    return userToken;
  }
}

// function setToken(userToken){
//   sessionStorage.setItem('token', JSON.stringify(userToken));
// }

function App() {
  const token = getToken();
  const history = createBrowserHistory();

  if(!token) {
    history.push('login');
    return <Login />
  }

  return (
    <div className="App">
      <header className="App-header">
        {/* <Navbar /> */}
        {/* <Sidebar /> */}
        <Routes history={history}>
          {/* {
            token && <Route path='/login' element={<Login />} />
          } */}
          {/* <Route path='/' element={<DashBoard />} />
          <Route path='basic' element={<Basic />} />
          <Route path='working' element={<WorkingDays />} />
          <Route path='leave' element={<LeaveDays />} />
          <Route path='roaster' element={<Roaster />} />
          <Route path='total' element={<Total />} />
          <Route path='payroll' element={<PayRoll />} />
          <Route path='revenue' element={<Revenue />} />
          <Route path='pnl' element={<PNL />} /> */}
          {/* <Route path="*" element={<NotFound />} /> */}
          <Route path="*" element={<Layout />} />
        </Routes>
      </header>
    </div>
  );
}

export default App;
