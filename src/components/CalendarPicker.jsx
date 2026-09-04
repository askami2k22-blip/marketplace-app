import { useState } from "react";

export const CalendarPicker = ({selectedDay, onSelect, T}) => {
  const today = new Date();
  const [month, setMonth] = useState(today.getMonth());
  const [year, setYear] = useState(today.getFullYear());

  const monthNames = ["Janvier","Février","Mars","Avril","Mai","Juin","Juillet","Août","Septembre","Octobre","Novembre","Décembre"];
  const dayNames = ["Dim","Lun","Mar","Mer","Jeu","Ven","Sam"];
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month+1, 0).getDate();

  const prevMonth = () => { if(month===0){setMonth(11);setYear(y=>y-1);}else setMonth(m=>m-1); };
  const nextMonth = () => { if(month===11){setMonth(0);setYear(y=>y+1);}else setMonth(m=>m+1); };
  const formatDay = (d) => `${String(d).padStart(2,"0")}/${String(month+1).padStart(2,"0")}/${year}`;
  const isPast = (d) => new Date(year,month,d) < new Date(today.getFullYear(),today.getMonth(),today.getDate());

  return (
    <div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:12,padding:12,marginBottom:8}}>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:10}}>
        <button style={{background:T.tag,border:"none",borderRadius:8,padding:"6px 10px",cursor:"pointer",fontSize:16,color:T.text}} onClick={prevMonth}>‹</button>
        <span style={{fontWeight:700,fontSize:14,color:T.text}}>{monthNames[month]} {year}</span>
        <button style={{background:T.tag,border:"none",borderRadius:8,padding:"6px 10px",cursor:"pointer",fontSize:16,color:T.text}} onClick={nextMonth}>›</button>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:2,marginBottom:4}}>
        {dayNames.map(d=><div key={d} style={{textAlign:"center",fontSize:10,color:T.muted,fontWeight:600,padding:"2px 0"}}>{d}</div>)}
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:2}}>
        {Array(firstDay).fill(null).map((_,i)=><div key={"e"+i}/>)}
        {Array(daysInMonth).fill(null).map((_,i)=>{
          const d=i+1;
          const key=formatDay(d);
          const past=isPast(d);
          const selected=selectedDay===key;
          const isToday=d===today.getDate()&&month===today.getMonth()&&year===today.getFullYear();
          return (
            <button key={d} disabled={past}
              style={{background:selected?T.orange:isToday?T.indigoBg:"transparent",color:selected?"#fff":past?T.muted:isToday?T.orange:T.text,border:`1px solid ${selected?T.orange:isToday?T.orange:"transparent"}`,borderRadius:8,padding:"6px 2px",cursor:past?"not-allowed":"pointer",fontSize:13,fontWeight:selected||isToday?700:400,opacity:past?0.4:1}}
              onClick={()=>!past&&onSelect(key)}>
              {d}
            </button>
          );
        })}
      </div>
    </div>
  );
};
