import React from 'react';

function Hero() {
  return ( 
    <section className="container-fluid" id="supportHero">
      <div className="p-4" id="supportWrapper">
        <h4>Support Portal</h4>
        <h4><a style={{color:"white"}} href="">Track Tickets</a></h4>
      </div>
      <div className="row p-5 m-3">
        <div className="col-6 p-3">
          <h1 className="fs-3">
            Search for an answer or browse help topics to create a ticket
          </h1>
          < input placeholder="Eg. how do I activate F&O" className="mb-3"/>
          <br />
          <a href="">Track account opening</a>
          <a href="">Track segment activation</a>
          <a href="">Intraday margins</a><br/>
          <a href="">Kite user manual</a>
        </div>
        <div className="col-2 "></div>
        <div className="col-4 p-2">
          <h1 className="fs-3">Featured</h1>
          <ol>
            <li>
              <a href="">Current Takeovers and Delisting - January 2024</a>
            </li>
            <li>
              <a href="">Latest Intraday leverages - MIS & CO</a>
            </li>
          </ol>
        </div>
      </div>
    </section>
   );
}

export default Hero;