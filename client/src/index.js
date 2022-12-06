import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './style/index.css';
import Header from './component/header';
import Main from './page/main';
import Result from './page/result';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <div >
    <Header />
    <Router>
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/result" element={<Result />} />
      </Routes>
    </Router>
  </div>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
