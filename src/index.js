import React from 'react';
import ReactDOM from 'react-dom';
//import './index.css';
import App from './App';
import Login from './Login';
import {BrowserRouter, Route, Routes} from 'react-router-dom';

//Määritellään routtaukset login-sivulle ja pääsivulle
ReactDOM.render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App/>} />
      <Route path="/login" element={<Login/>} />
    </Routes>
  </BrowserRouter>,
  document.getElementById('root')
);

