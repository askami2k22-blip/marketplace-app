export const LIGHT = {
  bg:"#F5F5F5",card:"#FFFFFF",border:"#E0E0E0",text:"#1A1A1A",sub:"#757575",
  orange:"#E65100",indigoBg:"#FFF3E0",green:"#2E7D32",greenBg:"#E8F5E9",
  muted:"#9E9E9E",headerTop:"#E65100",navBg:"#FFFFFF",sectionBg:"#FFFFFF",tag:"#F5F5F5"
};

export const DARK = {
  bg:"#121212",card:"#1E1E1E",border:"#2C2C2C",text:"#F0F0F0",sub:"#9E9E9E",
  orange:"#FF7043",indigoBg:"#2C1810",green:"#66BB6A",greenBg:"#1B5E2033",
  muted:"#616161",headerTop:"#BF360C",navBg:"#1A1A1A",sectionBg:"#1E1E1E",tag:"#2A2A2A"
};

export const money = n => Number(n).toLocaleString("fr-FR") + " FCFA";

export const CATEGORIES = [
  {id:"all",label:"Tout"},{id:"mode",label:"Mode & Textile"},
  {id:"elec",label:"Électronique"},{id:"resto",label:"Restauration"},
  {id:"beaute",label:"Beauté & Bien-être"},{id:"artisan",label:"Artisanat"},
  {id:"service",label:"Services à domicile"},
];

export const ZONES = [
  {id:"centre",label:"Bamako Centre",fee:500},
  {id:"peripherie",label:"Bamako Périphérie",fee:1000},
  {id:"interieur",label:"Intérieur Mali",fee:2500},
];

export const PAYMENTS = [
  {id:"orange",label:"Orange Money",color:"#FF6600"},
  {id:"moov",label:"Moov Money",color:"#0057B8"},
  {id:"wave",label:"Wave",color:"#1DC9E0"},
];

export const DAYS = ["Lun 24","Mar 25","Mer 26","Jeu 27","Ven 28","Sam 29"];
export const SLOTS = ["09:00","10:00","11:00","14:00","15:00","16:00"];
