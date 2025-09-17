import React from "react";

function LeftSection({
  imageURL,
  productName,
  productDescription,
  tryDemo,
  learnMore,
  googlePlay,
  appStore,
}) {
  return(
    <div className="container mt-5 mb-5">
      <div className="row">
        <div className="col-6">
          <img style={{height:"90%"}} src={imageURL} />
        </div>
        <div className="col-6 ml-5 p-5">
          <h1 className="mb-4">{productName}</h1>
          <p>{productDescription}</p>
          <div>
            <a href={tryDemo}>Try demo<i class="fa fa-long-arrow-right" aria-hidden="true"></i></a>
          <a href={learnMore} style={{marginLeft:"6.5rem"}}>Learn More<i class="fa fa-long-arrow-right" aria-hidden="true"></i></a>
          </div>
          <div className="mt-3">
            <a href={googlePlay}><img src="media/images/googlePlayBadge.svg"/></a>
          <a href={appStore} style={{marginLeft:"50px"}}>
            <img src="media/images/appstoreBadge.svg"/></a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LeftSection;
