import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import Basic from './pages/basic';
import Rota from './pages/rota';
import Report from './pages/report';
import Total from './pages/total';

function Routers(){
    return(
        <div className='wrapper'>
            <BrowserRouter>
                <Routes >
                    <Route path='basic' element={<Basic />} />
                    <Route path='rota' element={<Rota />} />
                    <Route path='report' element={<Report />} />
                    <Route path='total' element={<Total />} />
                </Routes>
            </BrowserRouter>
        </div>
    );
}

export default Routers;