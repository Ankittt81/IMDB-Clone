import React, { useState } from 'react'

function Pagination({PageNumber,Nextfn,Previousfn}) {
    
  return (
    <div
      className="bg-gray-400 h-[50px] w-fullMore actions
    mt-8 flex justify-center gap-4"
    >
      <div onClick={Previousfn} className="px-8">
        <i className="fa-solid fa-arrow-left"></i>
      </div>
      <div>{PageNumber}</div>
      <div onClick={Nextfn} className="px-8">
        <i className="fa-solid fa-arrow-right"></i>
      </div>
    </div>
  );
}

export default Pagination