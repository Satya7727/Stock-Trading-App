import React from "react";

function Hero() {
  return (
    <div className="container">
      <div className="text-center border-bottom mt-5 p-3">
        <h1>Techology</h1>
        <h3 className="text-muted mt-3 fs-4">Sleek, modern and intuitive trading platforms</h3>
        <p className="fs-6 mt-3 mb-5">
          Check out for aur{" "}
          <a href="">
            investment offerings
            <i class="fa fa-long-arrow-right" aria-hidden="true"></i>
          </a>
        </p>
      </div>
    </div>
  );
}

export default Hero;
