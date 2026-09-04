import { useState } from "react";

export const StarRating = ({rating, size=16, interactive=false, onRate=null}) => {
  const [hover, setHover] = useState(0);
  return (
    <div style={{display:"flex",gap:2}}>
      {[1,2,3,4,5].map(star=>(
        <span key={star}
          style={{cursor:interactive?"pointer":"default",fontSize:size,color:star<=(hover||rating)?"#FFA000":"#E0E0E0",transition:"color 0.1s"}}
          onMouseEnter={()=>interactive&&setHover(star)}
          onMouseLeave={()=>interactive&&setHover(0)}
          onClick={()=>interactive&&onRate&&onRate(star)}>
          ★
        </span>
      ))}
    </div>
  );
};
