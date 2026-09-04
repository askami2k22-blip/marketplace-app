export const Placeholder = ({vendor, height=160, fontSize=32, title=""}) => (
  <div style={{
    background:`linear-gradient(135deg,${vendor?.color||"#E65100"}EE,${vendor?.color||"#E65100"}66)`,
    height,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",
    position:"relative",overflow:"hidden"
  }}>
    <div style={{position:"absolute",inset:0,opacity:0.08,backgroundImage:`repeating-linear-gradient(45deg,#fff 0,#fff 1px,transparent 0,transparent 50%)`,backgroundSize:"12px 12px"}}/>
    <div style={{position:"relative",textAlign:"center"}}>
      <div style={{fontSize,color:"white",fontWeight:800,letterSpacing:-1}}>{vendor?.initials||"?"}</div>
      {title&&<div style={{fontSize:10,color:"rgba(255,255,255,0.8)",marginTop:4,maxWidth:120,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{title}</div>}
    </div>
  </div>
);
