import React from 'react';
import {Link} from 'react-router-dom';
import HomePage from '../home/HomePage'
function Team() {
  return (
     <div className="container">
      <div className="row p-3 border-top">
        <h1 className="text-center mt-4">People</h1>
      </div>

      <div
        className="row p-3 text-muted"
        style={{ lineHeight: "1.8", fontSize: "1.2em" }}
      >
        <div className="col-6 p-5 text-center">
          <img
            src="media/images/prince.jpg"
            style={{ borderRadius: "100%", width: "50%" }}
          />
          <h4 className="mt-5">Satya Yadav</h4>
          <h6>Founder, CEO</h6>
        </div>
        <div className="col-6 p-5">
          <p>
            Satya Yadav, a MERN stack web developer, built this Zerodha clone to overcome the challenges faced while learning and experimenting with trading platforms. This project showcases modern web development practices and aims to provide a seamless and user-friendly trading experience.
          </p>
          <p>
            SEBI Secondary Market Advisory Committee
            (SMAC) and the Market Data Advisory Committee (MDAC).
          </p>
          <p>
            Connect on <Link to={"/"} element={<HomePage/>}>Homepage</Link> / <Link to={"/"} element={<HomePage/>}>TradingQnA</Link>/
            <Link to={"/"} element={<HomePage/>}>Twitter</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Team;