import React from 'react';
 function Education() {
  return ( 
        <div className='container p-5 mt-5'>
      <div className='row'>
        <div className='col-6'>
          <img  className="mb-2" style={{width:"70%"}} src='media/images/education.svg'/>
        </div>
        <div className='col-6'>
          <h1 className='mb-3 fs-2'>Free and open market education</h1>
          <p>Varsity, the largest online stock market education book in the world coberiing everything from the basics to advanced training.</p>
          <a href='' style={{textDecoration:"none"}}>Varsity<i class="fa fa-long-arrow-right" aria-hidden="true"></i></a>

          <p className='mt-5'>Trading Q&A, the most active trading and investment community in India for all your market related queries.</p>
          <a href='' style={{textDecoration:"none"}}>Trading Q&A<i class="fa fa-long-arrow-right" aria-hidden="true"></i></a>
        </div>
      </div>
    </div>
  );
 }
 
 export default Education;