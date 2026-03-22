
import { useState } from "react";

const G = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,300&display=swap');
    *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
    :root{
      --p:#FF4D00;--pl:#FF6B2B;--pg:rgba(255,77,0,0.2);
      --ac:#FFB800;--ac2:#00D4FF;
      --bg:#0A0C10;--bg2:#0F1218;--bg3:#151A22;
      --card:#13181F;--card2:#1A2030;
      --bd:rgba(255,255,255,0.07);--bd2:rgba(255,77,0,0.2);
      --t:#F0F4FF;--t2:#8A9BB5;--t3:#4A5568;
      --ok:#00D68F;--warn:#FFB800;--err:#FF4060;--info:#00D4FF;--pur:#8B5CF6;
    }
    body{font-family:'DM Sans',sans-serif;background:var(--bg);color:var(--t);overflow-x:hidden}
    ::-webkit-scrollbar{width:5px}::-webkit-scrollbar-track{background:var(--bg2)}::-webkit-scrollbar-thumb{background:var(--p);border-radius:3px}
    .lay{display:flex;min-height:100vh}
    .side{width:255px;min-height:100vh;background:var(--bg2);border-right:1px solid var(--bd);display:flex;flex-direction:column;position:fixed;top:0;left:0;z-index:100}
    .slogo{padding:22px 18px 18px;border-bottom:1px solid var(--bd);display:flex;align-items:center;gap:11px}
    .lic{width:40px;height:40px;background:var(--p);border-radius:11px;display:flex;align-items:center;justify-content:center;font-size:19px;box-shadow:0 4px 14px var(--pg);flex-shrink:0}
    .lname{font-family:'Syne',sans-serif;font-size:15px;font-weight:800;line-height:1.1}
    .ltag{font-size:10px;color:var(--p);font-weight:700;text-transform:uppercase;letter-spacing:1px}
    .snav{flex:1;padding:14px 10px;overflow-y:auto}
    .slbl{font-size:10px;font-weight:700;color:var(--t3);text-transform:uppercase;letter-spacing:1.5px;padding:0 8px 7px;margin-top:4px}
    .ni{display:flex;align-items:center;gap:9px;padding:9px 11px;border-radius:9px;cursor:pointer;transition:all .2s;color:var(--t2);font-size:13.5px;font-weight:500;margin-bottom:2px;user-select:none}
    .ni:hover{background:var(--card2);color:var(--t)}
    .ni.on{background:linear-gradient(135deg,var(--p),var(--pl));color:#fff;box-shadow:0 4px 14px var(--pg)}
    .ni .ico{font-size:17px;width:21px;text-align:center;flex-shrink:0}
    .nbg{margin-left:auto;background:var(--p);color:#fff;font-size:10px;font-weight:700;padding:2px 7px;border-radius:20px}
    .ni.on .nbg{background:rgba(255,255,255,0.25)}
    .sfoot{padding:14px 10px;border-top:1px solid var(--bd)}
    .ucard{display:flex;align-items:center;gap:10px;padding:9px 11px;background:var(--card2);border-radius:11px;cursor:pointer}
    .uav{width:34px;height:34px;border-radius:9px;background:linear-gradient(135deg,var(--p),var(--ac));display:flex;align-items:center;justify-content:center;font-weight:700;font-size:12px;color:#fff;flex-shrink:0}
    .uname{font-size:13px;font-weight:600}.urole{font-size:11px;color:var(--t2)}
    .main{flex:1;margin-left:255px;display:flex;flex-direction:column;min-height:100vh}
    .top{height:65px;background:var(--bg2);border-bottom:1px solid var(--bd);display:flex;align-items:center;padding:0 26px;gap:14px;position:sticky;top:0;z-index:50}
    .ttl{font-family:'Syne',sans-serif;font-size:19px;font-weight:700;flex:1}
    .tsrch{display:flex;align-items:center;background:var(--card);border:1px solid var(--bd);border-radius:9px;padding:8px 13px;gap:8px;width:250px}
    .tsrch input{background:none;border:none;outline:none;color:var(--t);font-size:13px;font-family:'DM Sans',sans-serif;width:100%}
    .tsrch input::placeholder{color:var(--t3)}
    .tacts{display:flex;align-items:center;gap:9px}
    .ibtn{width:37px;height:37px;border-radius:9px;border:1px solid var(--bd);background:var(--card);display:flex;align-items:center;justify-content:center;cursor:pointer;color:var(--t2);font-size:15px;transition:all .2s;position:relative}
    .ibtn:hover{border-color:var(--p);color:var(--p)}
    .ndot{position:absolute;top:6px;right:6px;width:6px;height:6px;background:var(--p);border-radius:50%;border:1.5px solid var(--bg2)}
    .pg{padding:26px;flex:1}
    .ph{display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:26px}
    .ptl{font-family:'Syne',sans-serif;font-size:25px;font-weight:800}
    .pst{font-size:13px;color:var(--t2);margin-top:4px}
    .btn{display:inline-flex;align-items:center;gap:7px;padding:9px 19px;border-radius:9px;font-size:13px;font-weight:600;cursor:pointer;border:none;transition:all .2s;font-family:'DM Sans',sans-serif;white-space:nowrap}
    .btnp{background:linear-gradient(135deg,var(--p),var(--pl));color:#fff;box-shadow:0 4px 14px var(--pg)}
    .btnp:hover{transform:translateY(-1px);box-shadow:0 6px 22px var(--pg)}
    .btng{background:var(--card2);color:var(--t2);border:1px solid var(--bd)}
    .btng:hover{color:var(--t);border-color:var(--bd2)}
    .btnd{background:rgba(255,64,96,.12);color:var(--err);border:1px solid rgba(255,64,96,.2)}
    .btns{background:rgba(0,214,143,.12);color:var(--ok);border:1px solid rgba(0,214,143,.2)}
    .bsm{padding:6px 13px;font-size:12px;border-radius:8px}
    .card{background:var(--card);border:1px solid var(--bd);border-radius:15px;overflow:hidden}
    .ch{padding:17px 20px;border-bottom:1px solid var(--bd);display:flex;align-items:center;justify-content:space-between}
    .ctl{font-family:'Syne',sans-serif;font-size:14px;font-weight:700}
    .cb{padding:20px}
    .sg{display:grid;grid-template-columns:repeat(4,1fr);gap:16px;margin-bottom:24px}
    .sc{background:var(--card);border:1px solid var(--bd);border-radius:15px;padding:20px;position:relative;overflow:hidden;transition:all .3s}
    .sc:hover{border-color:var(--bd2);transform:translateY(-2px);box-shadow:0 0 30px rgba(255,77,0,.12)}
    .sc::before{content:'';position:absolute;top:0;left:0;right:0;height:3px}
    .sc.or::before{background:linear-gradient(90deg,var(--p),var(--ac))}
    .sc.bl::before{background:linear-gradient(90deg,var(--info),#0090FF)}
    .sc.gr::before{background:linear-gradient(90deg,var(--ok),#00A870)}
    .sc.pu::before{background:linear-gradient(90deg,var(--pur),#A855F7)}
    .si{width:42px;height:42px;border-radius:11px;display:flex;align-items:center;justify-content:center;font-size:19px;margin-bottom:14px}
    .si.or{background:rgba(255,77,0,.14)} .si.bl{background:rgba(0,212,255,.11)} .si.gr{background:rgba(0,214,143,.11)} .si.pu{background:rgba(139,92,246,.11)}
    .sv{font-family:'Syne',sans-serif;font-size:30px;font-weight:800;line-height:1;margin-bottom:5px}
    .sl{font-size:12px;color:var(--t2);font-weight:500;text-transform:uppercase;letter-spacing:.5px}
    .sch{font-size:12px;font-weight:600;margin-top:11px;display:flex;align-items:center;gap:4px}
    .sch.up{color:var(--ok)}.sch.dn{color:var(--err)}
    .g2{display:grid;grid-template-columns:1fr 1fr;gap:16px}
    .g3{display:grid;grid-template-columns:repeat(3,1fr);gap:16px}
    .ga{display:grid;grid-template-columns:repeat(auto-fill,minmax(290px,1fr));gap:16px}
    .dt{width:100%;border-collapse:collapse}
    .dt th{padding:11px 15px;text-align:left;font-size:11px;font-weight:700;color:var(--t3);text-transform:uppercase;letter-spacing:1px;border-bottom:1px solid var(--bd)}
    .dt td{padding:13px 15px;font-size:13px;color:var(--t2);border-bottom:1px solid var(--bd)}
    .dt tr:last-child td{border-bottom:none}
    .dt tr:hover td{background:var(--card2);color:var(--t)}
    .cn{display:flex;align-items:center;gap:10px}
    .av{width:35px;height:35px;border-radius:9px;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:12px;flex-shrink:0}
    .avl{width:46px;height:46px;border-radius:13px;font-size:15px}
    .aor{background:rgba(255,77,0,.18);color:var(--p)} .abl{background:rgba(0,212,255,.13);color:var(--info)}
    .agr{background:rgba(0,214,143,.13);color:var(--ok)} .apu{background:rgba(139,92,246,.13);color:var(--pur)}
    .ayl{background:rgba(255,184,0,.13);color:var(--ac)}
    .bdg{display:inline-flex;align-items:center;gap:5px;padding:3px 9px;border-radius:20px;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.5px}
    .bdg::before{content:'';width:5px;height:5px;border-radius:50%;background:currentColor}
    .bok{background:rgba(0,214,143,.11);color:var(--ok)} .bwn{background:rgba(255,184,0,.11);color:var(--warn)}
    .ber{background:rgba(255,64,96,.11);color:var(--err)} .bin{background:rgba(0,212,255,.11);color:var(--info)}
    .bor{background:rgba(255,77,0,.11);color:var(--p)} .bpu{background:rgba(139,92,246,.11);color:var(--pur)}
    .pb{height:6px;background:var(--bg3);border-radius:3px;overflow:hidden}
    .pf{height:100%;border-radius:3px;transition:width .6s}
    .por{background:linear-gradient(90deg,var(--p),var(--ac))} .pbl{background:linear-gradient(90deg,var(--info),#0090FF)}
    .pgr{background:linear-gradient(90deg,var(--ok),#00A870)} .ppu{background:linear-gradient(90deg,var(--pur),#A855F7)}
    .fg{margin-bottom:16px}
    .fl{display:block;font-size:12px;font-weight:600;color:var(--t2);margin-bottom:7px;text-transform:uppercase;letter-spacing:.5px}
    .fi{width:100%;padding:10px 13px;background:var(--bg3);border:1px solid var(--bd);border-radius:9px;color:var(--t);font-size:13.5px;font-family:'DM Sans',sans-serif;outline:none;transition:border-color .2s}
    .fi:focus{border-color:var(--p);box-shadow:0 0 0 3px var(--pg)}
    .fi::placeholder{color:var(--t3)}
    .fgd{display:grid;grid-template-columns:1fr 1fr;gap:14px}
    .ov{position:fixed;inset:0;background:rgba(0,0,0,.72);backdrop-filter:blur(5px);display:flex;align-items:center;justify-content:center;z-index:1000;padding:18px}
    .mdl{background:var(--card);border:1px solid var(--bd);border-radius:18px;width:100%;max-width:540px;max-height:90vh;overflow-y:auto;box-shadow:0 12px 50px rgba(0,0,0,.6)}
    .mh{padding:20px 22px;border-bottom:1px solid var(--bd);display:flex;align-items:center;justify-content:space-between}
    .mt{font-family:'Syne',sans-serif;font-size:17px;font-weight:700}
    .mx{width:30px;height:30px;border-radius:8px;background:var(--card2);border:none;color:var(--t2);cursor:pointer;font-size:17px;display:flex;align-items:center;justify-content:center}
    .mx:hover{color:var(--err)}
    .mb{padding:22px}.mf{padding:16px 22px;border-top:1px solid var(--bd);display:flex;gap:9px;justify-content:flex-end}
    .sfb{display:flex;gap:10px;margin-bottom:18px;flex-wrap:wrap}
    .sb{display:flex;align-items:center;gap:7px;background:var(--card);border:1px solid var(--bd);border-radius:9px;padding:8px 13px;flex:1;min-width:190px}
    .sb input{background:none;border:none;outline:none;color:var(--t);font-size:13px;font-family:'DM Sans',sans-serif;width:100%}
    .sb input::placeholder{color:var(--t3)}
    .mc{background:var(--card);border:1px solid var(--bd);border-radius:15px;padding:20px;transition:all .3s;cursor:pointer}
    .mc:hover{border-color:var(--bd2);transform:translateY(-2px);box-shadow:0 0 28px rgba(255,77,0,.1)}
    .mch{display:flex;align-items:center;gap:13px;margin-bottom:14px}
    .mi .mn{font-family:'Syne',sans-serif;font-size:15px;font-weight:700}
    .mi .mr{font-size:12px;color:var(--p);font-weight:600;margin-top:2px}
    .ms{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-top:14px}
    .msv{font-family:'Syne',sans-serif;font-size:19px;font-weight:700}
    .msl{font-size:10px;color:var(--t3);text-transform:uppercase;letter-spacing:.5px;margin-top:2px}
    .str{color:var(--ac);font-size:12px;letter-spacing:1px}
    .vcard{background:var(--card);border:1px solid var(--bd);border-radius:15px;padding:18px;transition:all .3s}
    .vcard:hover{border-color:var(--bd2)}
    .vimg{width:100%;height:110px;background:var(--bg3);border-radius:9px;display:flex;align-items:center;justify-content:center;font-size:48px;margin-bottom:13px}
    .pm{display:flex;align-items:center;gap:11px;padding:12px 14px;background:var(--card2);border:1px solid var(--bd);border-radius:11px;cursor:pointer;transition:all .2s;margin-bottom:7px}
    .pm:hover,.pm.sel{border-color:var(--p);background:rgba(255,77,0,.05)}
    .ni2{display:flex;gap:12px;padding:13px 0;border-bottom:1px solid var(--bd)}
    .ni2:last-child{border-bottom:none}
    .tic{width:34px;height:34px;border-radius:9px;display:flex;align-items:center;justify-content:center;font-size:15px;flex-shrink:0}
    .tl{display:flex;flex-direction:column;gap:0}
    .ti{display:flex;gap:13px;padding-bottom:18px;position:relative}
    .ti:last-child{padding-bottom:0}
    .ti:not(:last-child)::after{content:'';position:absolute;left:14px;top:30px;bottom:0;width:1px;background:var(--bd)}
    .td2{width:30px;height:30px;border-radius:9px;flex-shrink:0;display:flex;align-items:center;justify-content:center;font-size:13px;z-index:1}
    .ti-c .t1{font-size:13px;font-weight:600;color:var(--t)}
    .ti-c .t2x{font-size:11px;color:var(--t3);margin-top:2px}
    .top3{display:flex;align-items:center;gap:11px;padding:11px 0;border-bottom:1px solid var(--bd)}
    .top3:last-child{border-bottom:none}
    .trk{width:22px;height:22px;border-radius:6px;display:flex;align-items:center;justify-content:center;font-size:10px;font-weight:800;flex-shrink:0}
    .r1{background:rgba(255,184,0,.18);color:var(--ac)} .r2{background:rgba(0,212,255,.13);color:var(--info)}
    .r3{background:rgba(139,92,246,.13);color:var(--pur)} .ro{background:var(--bg3);color:var(--t3)}
    .div2{height:1px;background:var(--bd);margin:13px 0}
    .ml{margin-left:auto}
    @keyframes fi{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
    .fa{animation:fi .32s ease forwards}
    @media(max-width:768px){.side{transform:translateX(-255px)}.main{margin-left:0}.sg{grid-template-columns:repeat(2,1fr)}.g2{grid-template-columns:1fr}}
  `}</style>
);

// DATA
const AC = ["or","bl","gr","pu","yl"];
const gc = (id) => AC[(id-1)%AC.length];
const init = (n,p) => `${(p||"")[0]||""}${(n||"")[0]||""}`.toUpperCase();
const strs = (n) => "★".repeat(Math.floor(n))+"☆".repeat(5-Math.floor(n));
const fmtF = (n) => n?.toLocaleString("fr-FR")+" FCFA";
const fmtD = (d) => d?new Date(d).toLocaleDateString("fr-FR"):"-";

const E0=[
  {id:1,nom:"Mbarga",prenom:"Joël",email:"joel@gmail.com",tel:"699 001 002",ins:"2025-01-10",mid:1,stat:"Actif",h:18,tot:30,solde:45000,permis:"B",ex:"Réussi"},
  {id:2,nom:"Eyenga",prenom:"Sandra",email:"sandra@gmail.com",tel:"677 234 567",ins:"2025-02-05",mid:2,stat:"Actif",h:10,tot:30,solde:120000,permis:"B",ex:"En attente"},
  {id:3,nom:"Nkodo",prenom:"Paul",email:"paul@gmail.com",tel:"655 111 222",ins:"2024-11-20",mid:1,stat:"Diplômé",h:30,tot:30,solde:0,permis:"B",ex:"Réussi"},
  {id:4,nom:"Biya",prenom:"Marie",email:"marie@gmail.com",tel:"690 345 678",ins:"2025-03-01",mid:3,stat:"Actif",h:5,tot:30,solde:150000,permis:"A",ex:"En attente"},
  {id:5,nom:"Ateba",prenom:"Chris",email:"chris@gmail.com",tel:"676 456 789",ins:"2025-01-28",mid:2,stat:"Suspendu",h:12,tot:30,solde:85000,permis:"B",ex:"Échoué"},
  {id:6,nom:"Fouda",prenom:"Aline",email:"aline@gmail.com",tel:"691 789 012",ins:"2025-03-15",mid:1,stat:"Actif",h:22,tot:30,solde:30000,permis:"B",ex:"Réussi"},
  {id:7,nom:"Tamba",prenom:"Léo",email:"leo@gmail.com",tel:"674 321 654",ins:"2025-02-20",mid:3,stat:"Actif",h:8,tot:30,solde:95000,permis:"A",ex:"En attente"},
];
const M0=[
  {id:1,nom:"Essomba",prenom:"Roger",email:"roger@autoecole.cm",tel:"697 001 001",spe:"Permis B",stat:"Actif",note:4.8,sal:180000,exp:"5 ans"},
  {id:2,nom:"Fouda",prenom:"Carine",email:"carine@autoecole.cm",tel:"675 002 002",spe:"Permis B/A",stat:"Actif",note:4.6,sal:165000,exp:"3 ans"},
  {id:3,nom:"Mvondo",prenom:"Jules",email:"jules@autoecole.cm",tel:"654 003 003",spe:"Permis A",stat:"Congé",note:4.3,sal:155000,exp:"2 ans"},
  {id:4,nom:"Ngono",prenom:"Béatrice",email:"bea@autoecole.cm",tel:"698 004 004",spe:"Permis B",stat:"Actif",note:4.7,sal:170000,exp:"4 ans"},
];
const L0=[
  {id:1,eid:1,mid:1,date:"2025-03-22",h:"08:00",dur:2,type:"Conduite",stat:"Confirmée",veh:"Toyota Corolla — LT 234 A"},
  {id:2,eid:2,mid:2,date:"2025-03-22",h:"10:00",dur:1,type:"Code",stat:"Confirmée",veh:"Salle A"},
  {id:3,eid:4,mid:3,date:"2025-03-22",h:"14:00",dur:2,type:"Conduite",stat:"En attente",veh:"Honda CB500 — LT 567 B"},
  {id:4,eid:6,mid:1,date:"2025-03-23",h:"09:00",dur:2,type:"Conduite",stat:"Confirmée",veh:"Renault Logan — LT 890 C"},
  {id:5,eid:7,mid:3,date:"2025-03-23",h:"11:00",dur:1,type:"Code",stat:"Annulée",veh:"Salle B"},
];
const P0=[
  {id:1,eid:1,mt:55000,date:"2025-03-10",mode:"Mobile Money",stat:"Payé",ref:"PAY-4821"},
  {id:2,eid:2,mt:80000,date:"2025-03-12",mode:"Espèces",stat:"Payé",ref:"PAY-4822"},
  {id:3,eid:4,mt:100000,date:"2025-03-15",mode:"Virement",stat:"En attente",ref:"PAY-4823"},
  {id:4,eid:6,mt:70000,date:"2025-03-18",mode:"Mobile Money",stat:"Payé",ref:"PAY-4824"},
  {id:5,eid:7,mt:55000,date:"2025-03-20",mode:"Espèces",stat:"Payé",ref:"PAY-4825"},
];
const X0=[
  {id:1,eid:1,type:"Code",date:"2025-02-14",sc:38,seuil:35,centre:"CENAC Douala",stat:"Réussi"},
  {id:2,eid:1,type:"Conduite",date:"2025-03-05",sc:82,seuil:70,centre:"CENAC Douala",stat:"Réussi"},
  {id:3,eid:3,type:"Code",date:"2024-12-10",sc:40,seuil:35,centre:"CENAC Douala",stat:"Réussi"},
  {id:4,eid:3,type:"Conduite",date:"2025-01-08",sc:78,seuil:70,centre:"CENAC Douala",stat:"Réussi"},
  {id:5,eid:5,type:"Code",date:"2025-02-20",sc:30,seuil:35,centre:"CENAC Douala",stat:"Échoué"},
  {id:6,eid:6,type:"Code",date:"2025-03-01",sc:37,seuil:35,centre:"CENAC Douala",stat:"Réussi"},
];

const Bdg = ({v}) => {
  const m={Actif:"ok",Diplômé:"in",Suspendu:"er",Congé:"wn",Confirmée:"ok","En attente":"wn",Annulée:"er",Payé:"ok",Réussi:"ok",Échoué:"er"};
  return <span className={`bdg b${m[v]||"in"}`}>{v}</span>;
};

const Modal = ({title,onClose,children,footer}) => (
  <div className="ov" onClick={e=>e.target===e.currentTarget&&onClose()}>
    <div className="mdl fa">
      <div className="mh"><div className="mt">{title}</div><button className="mx" onClick={onClose}>×</button></div>
      <div className="mb">{children}</div>
      {footer&&<div className="mf">{footer}</div>}
    </div>
  </div>
);

// DASHBOARD
const DB = ({E,M,L,P,X}) => {
  const actifs=E.filter(e=>e.stat==="Actif").length;
  const ca=P.filter(p=>p.stat==="Payé").reduce((s,p)=>s+p.mt,0);
  const tr=X.length?Math.round(X.filter(x=>x.stat==="Réussi").length/X.length*100):0;
  const top=[...E].sort((a,b)=>b.h-a.h).slice(0,4);
  const acts=[
    {ico:"👤",t:"Nouvel élève inscrit",d:"Marie Biya — Permis A",time:"Il y a 2h",bg:"rgba(255,77,0,.11)"},
    {ico:"📅",t:"Leçon confirmée",d:"Joël Mbarga avec R. Essomba",time:"Il y a 4h",bg:"rgba(0,212,255,.11)"},
    {ico:"💳",t:"Paiement reçu",d:"80 000 FCFA — Sandra Eyenga",time:"Hier 14h30",bg:"rgba(0,214,143,.11)"},
    {ico:"🎓",t:"Examen réussi",d:"Aline Fouda — Code de la route",time:"Il y a 3j",bg:"rgba(255,184,0,.11)"},
  ];
  const today=L.filter(l=>l.date==="2025-03-22");
  return (
    <div className="fa">
      <div className="ph">
        <div><div className="ptl">Tableau de bord 📊</div><div className="pst">Bienvenue ! Aperçu de votre activité en temps réel.</div></div>
        <div style={{display:"flex",gap:9}}><button className="btn btng">📥 Exporter</button><button className="btn btnp">+ Nouvel élève</button></div>
      </div>
      <div className="sg">
        {[{cl:"or",ico:"👥",v:actifs,l:"Élèves actifs",ch:"+8%"},
          {cl:"gr",ico:"🎓",v:`${tr}%`,l:"Taux de réussite",ch:"+3%"},
          {cl:"bl",ico:"📅",v:L.length,l:"Leçons planifiées",ch:"+12%"},
          {cl:"pu",ico:"💰",v:fmtF(ca),l:"Chiffre d'affaires",ch:"+15%"},
        ].map((s,i)=>(
          <div className={`sc ${s.cl}`} key={i}>
            <div className={`si ${s.cl}`}>{s.ico}</div>
            <div className="sv">{s.v}</div>
            <div className="sl">{s.l}</div>
            <div className="sch up">▲ {s.ch} ce mois</div>
          </div>
        ))}
      </div>
      <div className="g2" style={{marginBottom:16}}>
        <div className="card">
          <div className="ch"><div className="ctl">⚡ Activité récente</div><span className="bdg bor">Aujourd'hui</span></div>
          <div style={{padding:"10px 20px"}}>
            <div className="tl">
              {acts.map((a,i)=>(
                <div className="ti" key={i}>
                  <div className="td2" style={{background:a.bg}}>{a.ico}</div>
                  <div className="ti-c"><div className="t1">{a.t}</div><div className="t2x">{a.d} · {a.time}</div></div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="card">
          <div className="ch"><div className="ctl">🏆 Meilleure progression</div><span style={{fontSize:12,color:"var(--t2)"}}>Ce mois</span></div>
          <div style={{padding:"10px 20px"}}>
            {top.map((e,i)=>(
              <div className="top3" key={e.id}>
                <div className={`trk ${i===0?"r1":i===1?"r2":i===2?"r3":"ro"}`}>{i+1}</div>
                <div className={`av a${gc(e.id)}`}>{init(e.nom,e.prenom)}</div>
                <div style={{flex:1}}>
                  <div style={{fontSize:13,fontWeight:600}}>{e.prenom} {e.nom}</div>
                  <div style={{marginTop:4}}><div className="pb"><div className="pf por" style={{width:`${Math.round(e.h/e.tot*100)}%`}}/></div><span style={{fontSize:11,color:"var(--t3)"}}>{e.h}/{e.tot}h</span></div>
                </div>
                <span style={{fontSize:13,fontWeight:700,color:"var(--p)"}}>{Math.round(e.h/e.tot*100)}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="g2">
        <div className="card">
          <div className="ch"><div className="ctl">🚗 Leçons du jour</div><span className="bdg bin">{today.length} séances</span></div>
          <table className="dt">
            <thead><tr><th>Élève</th><th>Heure</th><th>Type</th><th>Statut</th></tr></thead>
            <tbody>{today.slice(0,4).map(l=>{const e=E.find(x=>x.id===l.eid);return(
              <tr key={l.id}><td><div className="cn"><div className={`av a${gc(l.eid)}`}>{init(e?.nom,e?.prenom)}</div><span style={{fontWeight:600,color:"var(--t)"}}>{e?.prenom} {e?.nom}</span></div></td>
              <td style={{fontWeight:700,color:"var(--p)"}}>{l.h}</td><td>{l.type}</td><td><Bdg v={l.stat}/></td></tr>
            );})}</tbody>
          </table>
        </div>
        <div className="card">
          <div className="ch"><div className="ctl">📊 Répartition</div></div>
          <div className="cb">
            {[{l:"Permis B (Voiture)",c:E.filter(e=>e.permis==="B").length,t:E.length,p:"or"},
              {l:"Permis A (Moto)",c:E.filter(e=>e.permis==="A").length,t:E.length,p:"bl"},
              {l:"Diplômés",c:E.filter(e=>e.stat==="Diplômé").length,t:E.length,p:"gr"},
              {l:"Moniteurs actifs",c:M.filter(m=>m.stat==="Actif").length,t:M.length,p:"pu"},
            ].map((r,i)=>(
              <div key={i} style={{marginBottom:14}}>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:5}}>
                  <span style={{fontSize:13,color:"var(--t2)"}}>{r.l}</span>
                  <span style={{fontSize:13,fontWeight:700}}>{r.c}/{r.t}</span>
                </div>
                <div className="pb"><div className={`pf p${r.p}`} style={{width:`${Math.round(r.c/r.t*100)}%`}}/></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// ELEVES
const EL = ({E,setE,M}) => {
  const [srch,setSrch]=useState("");
  const [filt,setFilt]=useState("Tous");
  const [modal,setModal]=useState(false);
  const [form,setForm]=useState({nom:"",prenom:"",email:"",tel:"",permis:"B",mid:1,stat:"Actif",h:0,tot:30,solde:0});
  const [sel,setSel]=useState(null);
  const filtered=E.filter(e=>{
    const m=`${e.nom} ${e.prenom} ${e.email}`.toLowerCase().includes(srch.toLowerCase());
    const s=filt==="Tous"||e.stat===filt;
    return m&&s;
  });
  const save=()=>{
    if(sel)setE(E.map(e=>e.id===sel.id?{...e,...form}:e));
    else setE([...E,{...form,id:Date.now(),ex:"En attente",ins:new Date().toISOString().slice(0,10)}]);
    setModal(false);setSel(null);setForm({nom:"",prenom:"",email:"",tel:"",permis:"B",mid:1,stat:"Actif",h:0,tot:30,solde:0});
  };
  return (
    <div className="fa">
      <div className="ph">
        <div><div className="ptl">Gestion des Élèves 👥</div><div className="pst">{E.length} élèves · {E.filter(e=>e.stat==="Actif").length} actifs</div></div>
        <button className="btn btnp" onClick={()=>setModal(true)}>+ Nouvel élève</button>
      </div>
      <div className="sfb">
        <div className="sb"><span>🔍</span><input placeholder="Rechercher..." value={srch} onChange={e=>setSrch(e.target.value)}/></div>
        {["Tous","Actif","Diplômé","Suspendu"].map(s=><button key={s} className={`btn bsm ${filt===s?"btnp":"btng"}`} onClick={()=>setFilt(s)}>{s}</button>)}
      </div>
      <div className="card">
        <table className="dt">
          <thead><tr><th>Élève</th><th>Téléphone</th><th>Permis</th><th>Progression</th><th>Solde</th><th>Examen</th><th>Statut</th><th></th></tr></thead>
          <tbody>{filtered.map(e=>(
            <tr key={e.id}>
              <td><div className="cn"><div className={`av a${gc(e.id)}`}>{init(e.nom,e.prenom)}</div><div><div style={{fontWeight:700,color:"var(--t)",fontSize:13.5}}>{e.prenom} {e.nom}</div><div style={{fontSize:11,color:"var(--t3)"}}>{e.email}</div></div></div></td>
              <td>{e.tel}</td>
              <td><span className={`bdg b${e.permis==="B"?"or":"in"}`}>Permis {e.permis}</span></td>
              <td style={{minWidth:130}}><div style={{display:"flex",alignItems:"center",gap:7}}><div className="pb" style={{flex:1}}><div className="pf por" style={{width:`${Math.round(e.h/e.tot*100)}%`}}/></div><span style={{fontSize:11,color:"var(--t3)",whiteSpace:"nowrap"}}>{e.h}h/{e.tot}h</span></div></td>
              <td style={{fontWeight:700,color:e.solde>0?"var(--err)":"var(--ok)"}}>{fmtF(e.solde)}</td>
              <td><Bdg v={e.ex}/></td>
              <td><Bdg v={e.stat}/></td>
              <td><div style={{display:"flex",gap:5}}><button className="btn btng bsm" onClick={()=>{setSel(e);setForm(e);setModal(true);}}>✏️</button><button className="btn btnd bsm" onClick={()=>setE(E.filter(x=>x.id!==e.id))}>🗑️</button></div></td>
            </tr>
          ))}</tbody>
        </table>
        {filtered.length===0&&<div style={{textAlign:"center",padding:"50px 20px",color:"var(--t3)"}}>👥 Aucun élève trouvé</div>}
      </div>
      {modal&&<Modal title={sel?"Modifier l'élève":"Nouvel élève"} onClose={()=>{setModal(false);setSel(null);}} footer={<><button className="btn btng" onClick={()=>setModal(false)}>Annuler</button><button className="btn btnp" onClick={save}>💾 Enregistrer</button></>}>
        <div className="fgd"><div className="fg"><label className="fl">Prénom</label><input className="fi" value={form.prenom} onChange={e=>setForm({...form,prenom:e.target.value})} placeholder="Prénom"/></div><div className="fg"><label className="fl">Nom</label><input className="fi" value={form.nom} onChange={e=>setForm({...form,nom:e.target.value})} placeholder="Nom"/></div></div>
        <div className="fg"><label className="fl">Email</label><input className="fi" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} placeholder="email@exemple.com"/></div>
        <div className="fgd"><div className="fg"><label className="fl">Téléphone</label><input className="fi" value={form.tel} onChange={e=>setForm({...form,tel:e.target.value})} placeholder="6XX XXX XXX"/></div><div className="fg"><label className="fl">Type de permis</label><select className="fi" value={form.permis} onChange={e=>setForm({...form,permis:e.target.value})}><option>B</option><option>A</option></select></div></div>
        <div className="fgd"><div className="fg"><label className="fl">Moniteur</label><select className="fi" value={form.mid} onChange={e=>setForm({...form,mid:+e.target.value})}>{M.map(m=><option key={m.id} value={m.id}>{m.prenom} {m.nom}</option>)}</select></div><div className="fg"><label className="fl">Statut</label><select className="fi" value={form.stat} onChange={e=>setForm({...form,stat:e.target.value})}><option>Actif</option><option>Diplômé</option><option>Suspendu</option></select></div></div>
        <div className="fgd"><div className="fg"><label className="fl">Heures effectuées</label><input className="fi" type="number" value={form.h} onChange={e=>setForm({...form,h:+e.target.value})}/></div><div className="fg"><label className="fl">Solde (FCFA)</label><input className="fi" type="number" value={form.solde} onChange={e=>setForm({...form,solde:+e.target.value})}/></div></div>
      </Modal>}
    </div>
  );
};

// MONITEURS
const MN = ({M,setM,E}) => {
  const [modal,setModal]=useState(false);
  const [form,setForm]=useState({nom:"",prenom:"",email:"",tel:"",spe:"Permis B",stat:"Actif",note:4.5,sal:150000,exp:"1 an"});
  const [sel,setSel]=useState(null);
  const save=()=>{
    if(sel)setM(M.map(m=>m.id===sel.id?{...m,...form}:m));
    else setM([...M,{...form,id:Date.now()}]);
    setModal(false);setSel(null);setForm({nom:"",prenom:"",email:"",tel:"",spe:"Permis B",stat:"Actif",note:4.5,sal:150000,exp:"1 an"});
  };
  return (
    <div className="fa">
      <div className="ph"><div><div className="ptl">Moniteurs 🎓</div><div className="pst">{M.length} moniteurs · {M.filter(m=>m.stat==="Actif").length} disponibles</div></div><button className="btn btnp" onClick={()=>setModal(true)}>+ Nouveau moniteur</button></div>
      <div className="ga">
        {M.map(m=>{
          const ne=E.filter(e=>e.mid===m.id).length,c=gc(m.id);
          return(
            <div className="mc" key={m.id}>
              <div className="mch">
                <div className={`av avl a${c}`}>{init(m.nom,m.prenom)}</div>
                <div className="mi"><div className="mn">{m.prenom} {m.nom}</div><div className="mr">{m.spe}</div><div className="str" style={{marginTop:4}}>{strs(m.note)} <span style={{fontSize:11,color:"var(--t3)"}}>{m.note}/5</span></div></div>
                <div className="ml"><Bdg v={m.stat}/></div>
              </div>
              <div className="div2"/>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:7,fontSize:12}}>
                <div style={{color:"var(--t3)"}}>📧</div><div style={{color:"var(--t2)",textAlign:"right"}}>{m.email}</div>
                <div style={{color:"var(--t3)"}}>📱</div><div style={{color:"var(--t2)",textAlign:"right"}}>{m.tel}</div>
                <div style={{color:"var(--t3)"}}>💼</div><div style={{color:"var(--t2)",textAlign:"right"}}>{m.exp}</div>
                <div style={{color:"var(--t3)"}}>💰</div><div style={{color:"var(--p)",fontWeight:700,textAlign:"right"}}>{fmtF(m.sal)}</div>
              </div>
              <div className="ms">
                <div style={{textAlign:"center"}}><div className="msv" style={{color:"var(--p)"}}>{ne}</div><div className="msl">Élèves</div></div>
                <div style={{textAlign:"center"}}><div className="msv" style={{color:"var(--ok)"}}>{m.note}</div><div className="msl">Note</div></div>
                <div style={{textAlign:"center"}}><div className="msv" style={{color:"var(--info)",fontSize:14}}>{m.exp}</div><div className="msl">Exp.</div></div>
              </div>
              <div className="div2"/>
              <div style={{display:"flex",gap:7}}>
                <button className="btn btng bsm" style={{flex:1}} onClick={()=>{setSel(m);setForm(m);setModal(true);}}>✏️ Modifier</button>
                <button className="btn btnd bsm" onClick={()=>setM(M.filter(x=>x.id!==m.id))}>🗑️</button>
              </div>
            </div>
          );
        })}
      </div>
      {modal&&<Modal title={sel?"Modifier":"Nouveau moniteur"} onClose={()=>{setModal(false);setSel(null);}} footer={<><button className="btn btng" onClick={()=>setModal(false)}>Annuler</button><button className="btn btnp" onClick={save}>💾 Enregistrer</button></>}>
        <div className="fgd"><div className="fg"><label className="fl">Prénom</label><input className="fi" value={form.prenom} onChange={e=>setForm({...form,prenom:e.target.value})} placeholder="Prénom"/></div><div className="fg"><label className="fl">Nom</label><input className="fi" value={form.nom} onChange={e=>setForm({...form,nom:e.target.value})} placeholder="Nom"/></div></div>
        <div className="fg"><label className="fl">Email</label><input className="fi" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} placeholder="email@autoecole.cm"/></div>
        <div className="fgd"><div className="fg"><label className="fl">Téléphone</label><input className="fi" value={form.tel} onChange={e=>setForm({...form,tel:e.target.value})} placeholder="6XX XXX XXX"/></div><div className="fg"><label className="fl">Spécialité</label><select className="fi" value={form.spe} onChange={e=>setForm({...form,spe:e.target.value})}><option>Permis B</option><option>Permis A</option><option>Permis B/A</option></select></div></div>
        <div className="fgd"><div className="fg"><label className="fl">Salaire (FCFA)</label><input className="fi" type="number" value={form.sal} onChange={e=>setForm({...form,sal:+e.target.value})}/></div><div className="fg"><label className="fl">Statut</label><select className="fi" value={form.stat} onChange={e=>setForm({...form,stat:e.target.value})}><option>Actif</option><option>Congé</option><option>Inactif</option></select></div></div>
      </Modal>}
    </div>
  );
};

// PLANNING
const PL = ({L,setL,E,M}) => {
  const [modal,setModal]=useState(false);
  const [filt,setFilt]=useState("Tous");
  const [form,setForm]=useState({eid:1,mid:1,date:"",h:"08:00",dur:2,type:"Conduite",stat:"En attente",veh:""});
  const filtered=L.filter(l=>filt==="Tous"||l.type===filt||l.stat===filt);
  const colS={"Confirmée":"var(--ok)","En attente":"var(--warn)","Annulée":"var(--err)"};
  const save=()=>{setL([...L,{...form,id:Date.now(),eid:+form.eid,mid:+form.mid,dur:+form.dur}]);setModal(false);};
  return (
    <div className="fa">
      <div className="ph"><div><div className="ptl">Planning des Leçons 📅</div><div className="pst">{L.length} leçons programmées</div></div><button className="btn btnp" onClick={()=>setModal(true)}>+ Planifier une leçon</button></div>
      <div className="sfb">{["Tous","Conduite","Code","Confirmée","En attente","Annulée"].map(f=><button key={f} className={`btn bsm ${filt===f?"btnp":"btng"}`} onClick={()=>setFilt(f)}>{f}</button>)}</div>
      <div style={{display:"flex",flexDirection:"column",gap:10}}>
        {filtered.map(l=>{
          const e=E.find(x=>x.id===l.eid),m=M.find(x=>x.id===l.mid);
          return(
            <div key={l.id} className="card" style={{padding:0}}>
              <div style={{display:"flex",alignItems:"center"}}>
                <div style={{width:5,background:colS[l.stat]||"var(--bd)",alignSelf:"stretch",borderRadius:"15px 0 0 15px",flexShrink:0}}/>
                <div style={{display:"flex",alignItems:"center",gap:14,padding:"14px 18px",flex:1,flexWrap:"wrap"}}>
                  <div style={{textAlign:"center",minWidth:55}}>
                    <div style={{fontFamily:"'Syne',sans-serif",fontSize:20,fontWeight:800,color:"var(--p)"}}>{l.h}</div>
                    <div style={{fontSize:11,color:"var(--t3)"}}>{l.dur}h</div>
                  </div>
                  <div style={{width:1,height:38,background:"var(--bd)"}}/>
                  <div style={{display:"flex",alignItems:"center",gap:9,flex:1}}>
                    <div className={`av a${gc(l.eid)}`}>{init(e?.nom,e?.prenom)}</div>
                    <div><div style={{fontWeight:700,color:"var(--t)"}}>{e?.prenom} {e?.nom}</div><div style={{fontSize:11,color:"var(--t3)"}}>{m?.prenom} {m?.nom}</div></div>
                  </div>
                  <div style={{display:"flex",gap:7,alignItems:"center",flexWrap:"wrap"}}>
                    <span className={`bdg b${l.type==="Conduite"?"or":"in"}`}>{l.type}</span>
                    <Bdg v={l.stat}/>
                    <span style={{fontSize:12,color:"var(--t2)"}}>📅 {fmtD(l.date)}</span>
                    <span style={{fontSize:12,color:"var(--t2)"}}>🚗 {l.veh}</span>
                  </div>
                  <div style={{display:"flex",gap:6,marginLeft:"auto"}}>
                    <button className="btn btns bsm" onClick={()=>setL(L.map(x=>x.id===l.id?{...x,stat:"Confirmée"}:x))}>✓</button>
                    <button className="btn btnd bsm" onClick={()=>setL(L.filter(x=>x.id!==l.id))}>🗑️</button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
        {filtered.length===0&&<div style={{textAlign:"center",padding:"50px",color:"var(--t3)"}}>📅 Aucune leçon trouvée</div>}
      </div>
      {modal&&<Modal title="Planifier une leçon" onClose={()=>setModal(false)} footer={<><button className="btn btng" onClick={()=>setModal(false)}>Annuler</button><button className="btn btnp" onClick={save}>💾 Enregistrer</button></>}>
        <div className="fgd"><div className="fg"><label className="fl">Élève</label><select className="fi" value={form.eid} onChange={e=>setForm({...form,eid:e.target.value})}>{E.map(e=><option key={e.id} value={e.id}>{e.prenom} {e.nom}</option>)}</select></div><div className="fg"><label className="fl">Moniteur</label><select className="fi" value={form.mid} onChange={e=>setForm({...form,mid:e.target.value})}>{M.map(m=><option key={m.id} value={m.id}>{m.prenom} {m.nom}</option>)}</select></div></div>
        <div className="fgd"><div className="fg"><label className="fl">Date</label><input className="fi" type="date" value={form.date} onChange={e=>setForm({...form,date:e.target.value})}/></div><div className="fg"><label className="fl">Heure</label><input className="fi" type="time" value={form.h} onChange={e=>setForm({...form,h:e.target.value})}/></div></div>
        <div className="fgd"><div className="fg"><label className="fl">Type</label><select className="fi" value={form.type} onChange={e=>setForm({...form,type:e.target.value})}><option>Conduite</option><option>Code</option></select></div><div className="fg"><label className="fl">Durée</label><select className="fi" value={form.dur} onChange={e=>setForm({...form,dur:e.target.value})}><option value={1}>1h</option><option value={2}>2h</option><option value={3}>3h</option></select></div></div>
        <div className="fg"><label className="fl">Véhicule / Salle</label><input className="fi" value={form.veh} onChange={e=>setForm({...form,veh:e.target.value})} placeholder="Ex: Toyota Corolla — LT 234 A"/></div>
      </Modal>}
    </div>
  );
};

// EXAMENS
const XM = ({X,setX,E}) => {
  const [modal,setModal]=useState(false);
  const [form,setForm]=useState({eid:1,type:"Code",date:"",sc:0,seuil:35,centre:"CENAC Douala"});
  const tr=X.length?Math.round(X.filter(x=>x.stat==="Réussi").length/X.length*100):0;
  const save=()=>{const s=+form.sc>=+form.seuil?"Réussi":"Échoué";setX([...X,{...form,id:Date.now(),eid:+form.eid,sc:+form.sc,seuil:+form.seuil,stat:s}]);setModal(false);};
  return (
    <div className="fa">
      <div className="ph"><div><div className="ptl">Examens 🎯</div><div className="pst">Taux de réussite global : <strong style={{color:"var(--ok)"}}>{tr}%</strong></div></div><button className="btn btnp" onClick={()=>setModal(true)}>+ Enregistrer un examen</button></div>
      <div className="g3" style={{marginBottom:22}}>
        {[{l:"Total examens",v:X.length,c:"bl",i:"📋"},{l:"Réussis",v:X.filter(x=>x.stat==="Réussi").length,c:"gr",i:"✅"},{l:"Échoués",v:X.filter(x=>x.stat==="Échoué").length,c:"or",i:"❌"}].map((s,i)=>(
          <div className={`sc ${s.c}`} key={i}><div className={`si ${s.c}`}>{s.i}</div><div className="sv">{s.v}</div><div className="sl">{s.l}</div></div>
        ))}
      </div>
      <div className="card">
        <table className="dt">
          <thead><tr><th>Élève</th><th>Type</th><th>Date</th><th>Score</th><th>Seuil</th><th>Centre</th><th>Résultat</th><th></th></tr></thead>
          <tbody>{X.map(x=>{const e=E.find(el=>el.id===x.eid);return(
            <tr key={x.id}>
              <td><div className="cn"><div className={`av a${gc(x.eid)}`}>{init(e?.nom,e?.prenom)}</div><span style={{fontWeight:600,color:"var(--t)"}}>{e?.prenom} {e?.nom}</span></div></td>
              <td><span className={`bdg b${x.type==="Code"?"in":"or"}`}>{x.type}</span></td>
              <td>{fmtD(x.date)}</td>
              <td><strong style={{fontFamily:"'Syne',sans-serif",fontSize:16,color:x.sc>=x.seuil?"var(--ok)":"var(--err)"}}>{x.sc}</strong></td>
              <td style={{color:"var(--t3)"}}>{x.seuil}</td>
              <td>{x.centre}</td>
              <td><Bdg v={x.stat}/></td>
              <td><button className="btn btnd bsm" onClick={()=>setX(X.filter(y=>y.id!==x.id))}>🗑️</button></td>
            </tr>
          );})}
          </tbody>
        </table>
      </div>
      {modal&&<Modal title="Enregistrer un examen" onClose={()=>setModal(false)} footer={<><button className="btn btng" onClick={()=>setModal(false)}>Annuler</button><button className="btn btnp" onClick={save}>💾 Enregistrer</button></>}>
        <div className="fg"><label className="fl">Élève</label><select className="fi" value={form.eid} onChange={e=>setForm({...form,eid:e.target.value})}>{E.map(e=><option key={e.id} value={e.id}>{e.prenom} {e.nom}</option>)}</select></div>
        <div className="fgd"><div className="fg"><label className="fl">Type</label><select className="fi" value={form.type} onChange={e=>setForm({...form,type:e.target.value,seuil:e.target.value==="Code"?35:70})}><option>Code</option><option>Conduite</option></select></div><div className="fg"><label className="fl">Date</label><input className="fi" type="date" value={form.date} onChange={e=>setForm({...form,date:e.target.value})}/></div></div>
        <div className="fgd"><div className="fg"><label className="fl">Score</label><input className="fi" type="number" value={form.sc} onChange={e=>setForm({...form,sc:e.target.value})} placeholder={`Sur ${form.type==="Code"?40:100}`}/></div><div className="fg"><label className="fl">Seuil</label><input className="fi" type="number" value={form.seuil} onChange={e=>setForm({...form,seuil:e.target.value})}/></div></div>
        <div className="fg"><label className="fl">Centre</label><input className="fi" value={form.centre} onChange={e=>setForm({...form,centre:e.target.value})} placeholder="CENAC Douala"/></div>
        {form.sc>0&&<div style={{padding:"11px 14px",borderRadius:9,background:+form.sc>=+form.seuil?"rgba(0,214,143,.1)":"rgba(255,64,96,.1)",border:`1px solid ${+form.sc>=+form.seuil?"rgba(0,214,143,.2)":"rgba(255,64,96,.2)"}`,fontSize:13,fontWeight:700,color:+form.sc>=+form.seuil?"var(--ok)":"var(--err)"}}>{+form.sc>=+form.seuil?"✅ RÉUSSI":"❌ ÉCHOUÉ"}</div>}
      </Modal>}
    </div>
  );
};

// PAIEMENTS
const PA = ({P,setP,E}) => {
  const [modal,setModal]=useState(false);
  const [form,setForm]=useState({eid:1,mt:"",mode:"Mobile Money",stat:"Payé"});
  const ca=P.filter(p=>p.stat==="Payé").reduce((s,p)=>s+p.mt,0);
  const att=P.filter(p=>p.stat==="En attente").reduce((s,p)=>s+p.mt,0);
  const icons={"Mobile Money":"📱","Espèces":"💵","Virement":"🏦","Carte":"💳"};
  const save=()=>{const ref="PAY-"+(Math.floor(Math.random()*9000)+1000);setP([...P,{...form,id:Date.now(),eid:+form.eid,mt:+form.mt,date:new Date().toISOString().slice(0,10),ref}]);setModal(false);};
  return (
    <div className="fa">
      <div className="ph"><div><div className="ptl">Facturation & Paiements 💰</div><div className="pst">{P.length} transactions</div></div><button className="btn btnp" onClick={()=>setModal(true)}>+ Enregistrer un paiement</button></div>
      <div className="g3" style={{marginBottom:22}}>
        <div className="sc gr"><div className="si gr">💰</div><div className="sv" style={{fontSize:20}}>{fmtF(ca)}</div><div className="sl">Chiffre d'affaires</div></div>
        <div className="sc or"><div className="si or">⏳</div><div className="sv" style={{fontSize:20}}>{fmtF(att)}</div><div className="sl">En attente</div></div>
        <div className="sc bl"><div className="si bl">📊</div><div className="sv">{P.length}</div><div className="sl">Transactions</div></div>
      </div>
      <div className="card">
        <table className="dt">
          <thead><tr><th>Référence</th><th>Élève</th><th>Montant</th><th>Mode</th><th>Date</th><th>Statut</th><th></th></tr></thead>
          <tbody>{P.map(p=>{const e=E.find(x=>x.id===p.eid);return(
            <tr key={p.id}>
              <td style={{fontFamily:"monospace",color:"var(--p)",fontWeight:700}}>{p.ref}</td>
              <td><div className="cn"><div className={`av a${gc(p.eid)}`}>{init(e?.nom,e?.prenom)}</div><span style={{fontWeight:600,color:"var(--t)"}}>{e?.prenom} {e?.nom}</span></div></td>
              <td style={{fontFamily:"'Syne',sans-serif",fontSize:15,fontWeight:800,color:"var(--ok)"}}>{fmtF(p.mt)}</td>
              <td>{icons[p.mode]||"💳"} {p.mode}</td>
              <td>{fmtD(p.date)}</td>
              <td><Bdg v={p.stat}/></td>
              <td><button className="btn btnd bsm" onClick={()=>setP(P.filter(x=>x.id!==p.id))}>🗑️</button></td>
            </tr>
          );})}
          </tbody>
        </table>
      </div>
      {modal&&<Modal title="Enregistrer un paiement" onClose={()=>setModal(false)} footer={<><button className="btn btng" onClick={()=>setModal(false)}>Annuler</button><button className="btn btnp" onClick={save}>💾 Enregistrer</button></>}>
        <div className="fg"><label className="fl">Élève</label><select className="fi" value={form.eid} onChange={e=>setForm({...form,eid:e.target.value})}>{E.map(e=><option key={e.id} value={e.id}>{e.prenom} {e.nom} — Solde: {fmtF(e.solde)}</option>)}</select></div>
        <div className="fg"><label className="fl">Montant (FCFA)</label><input className="fi" type="number" value={form.mt} onChange={e=>setForm({...form,mt:e.target.value})} placeholder="Ex: 50000"/></div>
        <div className="fg"><label className="fl">Mode de paiement</label>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:7,marginTop:4}}>
            {["Mobile Money","Espèces","Virement","Carte"].map(m=><div key={m} className={`pm ${form.mode===m?"sel":""}`} onClick={()=>setForm({...form,mode:m})}><span style={{fontSize:22}}>{icons[m]}</span><span style={{fontSize:13,fontWeight:600}}>{m}</span></div>)}
          </div>
        </div>
        <div className="fg"><label className="fl">Statut</label><select className="fi" value={form.stat} onChange={e=>setForm({...form,stat:e.target.value})}><option>Payé</option><option>En attente</option></select></div>
      </Modal>}
    </div>
  );
};

// NOTIFICATIONS
const NO = ({E}) => {
  const [form,setForm]=useState({to:"all",type:"sms",sujet:"",msg:""});
  const [sent,setSent]=useState([
    {id:1,to:"Joël Mbarga",type:"SMS",sujet:"Rappel leçon",msg:"Votre leçon est prévue demain à 08h00.",date:"2025-03-21"},
    {id:2,to:"Sandra Eyenga",type:"Email",sujet:"Paiement en attente",msg:"Votre solde de 120 000 FCFA est dû.",date:"2025-03-20"},
    {id:3,to:"Tous les élèves",type:"SMS",sujet:"Fermeture exceptionnelle",msg:"L'auto-école sera fermée ce samedi.",date:"2025-03-19"},
  ]);
  const tpls=[
    {l:"📅 Rappel leçon",m:"Votre leçon de conduite est prévue le [DATE] à [HEURE]. N'oubliez pas votre pièce d'identité."},
    {l:"🎓 Convocation examen",m:"Vous êtes convoqué(e) à l'examen [TYPE] le [DATE] au centre CENAC Douala. Bonne chance !"},
    {l:"💰 Rappel paiement",m:"Votre solde impayé est de [MONTANT] FCFA. Merci de régulariser votre situation."},
    {l:"🏆 Félicitations",m:"Félicitations ! Vous avez réussi votre examen. Votre permis sera disponible sous 15 jours."},
  ];
  const send=()=>{
    const t=form.to==="all"?"Tous les élèves":E.find(e=>e.id===+form.to)?.prenom+" "+E.find(e=>e.id===+form.to)?.nom;
    setSent([{id:Date.now(),to:t,type:form.type==="sms"?"SMS":"Email",sujet:form.sujet,msg:form.msg,date:new Date().toISOString().slice(0,10)},...sent]);
    setForm({...form,sujet:"",msg:""});
  };
  return (
    <div className="fa">
      <div className="ph"><div><div className="ptl">Notifications 🔔</div><div className="pst">Envoyez des messages à vos élèves</div></div></div>
      <div className="g2">
        <div className="card">
          <div className="ch"><div className="ctl">✍️ Composer un message</div></div>
          <div className="cb">
            <div className="fg"><label className="fl">Destinataire</label><select className="fi" value={form.to} onChange={e=>setForm({...form,to:e.target.value})}><option value="all">📢 Tous les élèves</option>{E.map(e=><option key={e.id} value={e.id}>{e.prenom} {e.nom}</option>)}</select></div>
            <div className="fg"><label className="fl">Canal</label><div style={{display:"flex",gap:8}}>{[{v:"sms",l:"📱 SMS"},{v:"email",l:"📧 Email"}].map(c=><button key={c.v} className={`btn ${form.type===c.v?"btnp":"btng"}`} style={{flex:1}} onClick={()=>setForm({...form,type:c.v})}>{c.l}</button>)}</div></div>
            <div className="fg"><label className="fl">Templates rapides</label><div style={{display:"flex",flexDirection:"column",gap:5}}>{tpls.map((t,i)=><button key={i} className="btn btng bsm" style={{justifyContent:"flex-start"}} onClick={()=>setForm({...form,sujet:t.l.replace(/^.{2}/,""),msg:t.m})}>{t.l}</button>)}</div></div>
            <div className="fg"><label className="fl">Sujet</label><input className="fi" value={form.sujet} onChange={e=>setForm({...form,sujet:e.target.value})} placeholder="Objet du message"/></div>
            <div className="fg"><label className="fl">Message</label><textarea className="fi" rows={4} value={form.msg} onChange={e=>setForm({...form,msg:e.target.value})} placeholder="Rédigez votre message..." style={{resize:"vertical"}}/></div>
            <button className="btn btnp" style={{width:"100%"}} onClick={send} disabled={!form.msg||!form.sujet}>📤 Envoyer</button>
          </div>
        </div>
        <div className="card">
          <div className="ch"><div className="ctl">📬 Historique</div><span className="bdg bor">{sent.length}</span></div>
          <div style={{padding:"0 20px"}}>
            {sent.map(n=>(
              <div className="ni2" key={n.id}>
                <div className="tic" style={{background:n.type==="SMS"?"rgba(0,212,255,.11)":"rgba(255,77,0,.11)"}}>{n.type==="SMS"?"📱":"📧"}</div>
                <div><div style={{fontSize:13,fontWeight:600,color:"var(--t)"}}>{n.sujet}</div><div style={{fontSize:12,color:"var(--t2)"}}>{n.to}</div><div style={{fontSize:11,color:"var(--t3)",fontStyle:"italic",marginTop:2}}>"{n.msg.slice(0,55)}..."</div><div style={{display:"flex",gap:7,marginTop:4}}><span style={{fontSize:11,color:"var(--t3)"}}>{fmtD(n.date)}</span><span className="bdg bok">Envoyé</span></div></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// VEHICULES
const VH = () => {
  const V=[
    {id:1,marque:"Toyota",modele:"Corolla",immat:"LT 234 A",annee:2020,km:45230,stat:"Disponible",type:"Voiture",ico:"🚗",coul:"Blanc"},
    {id:2,marque:"Renault",modele:"Logan",immat:"LT 890 C",annee:2019,km:62100,stat:"En service",type:"Voiture",ico:"🚗",coul:"Gris"},
    {id:3,marque:"Honda",modele:"CB500",immat:"LT 567 B",annee:2021,km:18500,stat:"Disponible",type:"Moto",ico:"🏍️",coul:"Rouge"},
    {id:4,marque:"Yamaha",modele:"MT-07",immat:"LT 321 D",annee:2022,km:9800,stat:"Maintenance",type:"Moto",ico:"🏍️",coul:"Bleu"},
  ];
  return (
    <div className="fa">
      <div className="ph"><div><div className="ptl">Parc Automobile 🚗</div><div className="pst">{V.length} véhicules</div></div><button className="btn btnp">+ Ajouter un véhicule</button></div>
      <div className="ga">
        {V.map(v=>(
          <div className="vcard" key={v.id}>
            <div className="vimg">{v.ico}</div>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:11}}>
              <div><div style={{fontFamily:"'Syne',sans-serif",fontSize:16,fontWeight:700}}>{v.marque} {v.modele}</div><div style={{fontSize:12,color:"var(--t2)",marginTop:2}}>{v.immat} · {v.coul}</div></div>
              <Bdg v={v.stat}/>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:7,fontSize:12}}>
              <div style={{color:"var(--t3)"}}>📅 Année</div><div style={{color:"var(--t2)",textAlign:"right",fontWeight:600}}>{v.annee}</div>
              <div style={{color:"var(--t3)"}}>🏎️ Kilométrage</div><div style={{color:"var(--t2)",textAlign:"right",fontWeight:600}}>{v.km.toLocaleString()} km</div>
              <div style={{color:"var(--t3)"}}>🚦 Type</div><div style={{color:"var(--t2)",textAlign:"right",fontWeight:600}}>{v.type}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// APP
export default function App() {
  const [page,setPage]=useState("db");
  const [E,setE]=useState(E0);
  const [M,setM]=useState(M0);
  const [L,setL]=useState(L0);
  const [P,setP]=useState(P0);
  const [X,setX]=useState(X0);

  const nav=[
    {id:"db",ico:"⊞",l:"Tableau de bord"},
    {id:"el",ico:"👥",l:"Élèves",bg:E.filter(e=>e.stat==="Actif").length},
    {id:"mn",ico:"🎓",l:"Moniteurs"},
    {id:"pl",ico:"📅",l:"Planning",bg:L.filter(l=>l.stat==="En attente").length||undefined},
    {id:"xm",ico:"🎯",l:"Examens"},
    {id:"pa",ico:"💰",l:"Paiements",bg:P.filter(p=>p.stat==="En attente").length||undefined},
    {id:"vh",ico:"🚗",l:"Véhicules"},
    {id:"no",ico:"🔔",l:"Notifications"},
  ];

  const pages={
    db:<DB E={E} M={M} L={L} P={P} X={X}/>,
    el:<EL E={E} setE={setE} M={M}/>,
    mn:<MN M={M} setM={setM} E={E}/>,
    pl:<PL L={L} setL={setL} E={E} M={M}/>,
    xm:<XM X={X} setX={setX} E={E}/>,
    pa:<PA P={P} setP={setP} E={E}/>,
    vh:<VH/>,
    no:<NO E={E}/>,
  };

  const cur=nav.find(n=>n.id===page);

  return (
    <>
      <G/>
      <div className="lay">
        <nav className="side">
          <div className="slogo">
            <div className="lic">🚗</div>
            <div><div className="lname">AutoGES Pro</div><div className="ltag">Auto-École Excellence</div></div>
          </div>
          <div className="snav">
            <div><div className="slbl">Principal</div>{nav.slice(0,2).map(n=><div key={n.id} className={`ni ${page===n.id?"on":""}`} onClick={()=>setPage(n.id)}><span className="ico">{n.ico}</span>{n.l}{n.bg?<span className="nbg">{n.bg}</span>:null}</div>)}</div>
            <div style={{marginTop:8}}><div className="slbl">Gestion</div>{nav.slice(2,6).map(n=><div key={n.id} className={`ni ${page===n.id?"on":""}`} onClick={()=>setPage(n.id)}><span className="ico">{n.ico}</span>{n.l}{n.bg?<span className="nbg">{n.bg}</span>:null}</div>)}</div>
            <div style={{marginTop:8}}><div className="slbl">Outils</div>{nav.slice(6).map(n=><div key={n.id} className={`ni ${page===n.id?"on":""}`} onClick={()=>setPage(n.id)}><span className="ico">{n.ico}</span>{n.l}</div>)}</div>
          </div>
          <div className="sfoot">
            <div className="ucard"><div className="uav">AD</div><div><div className="uname">Administrateur</div><div className="urole">Super Admin</div></div><span style={{marginLeft:"auto",fontSize:15,color:"var(--t3)"}}>⚙️</span></div>
          </div>
        </nav>
        <div className="main">
          <div className="top">
            <div className="ttl">{cur?.l}</div>
            <div className="tsrch"><span style={{color:"var(--t3)"}}>🔍</span><input placeholder="Recherche globale..."/></div>
            <div className="tacts">
              <div className="ibtn">🌙</div>
              <div className="ibtn">🔔<div className="ndot"/></div>
              <div className="ibtn">❓</div>
              <div className="uav" style={{width:37,height:37,borderRadius:9,cursor:"pointer"}}>AD</div>
            </div>
          </div>
          <div className="pg">{pages[page]}</div>
        </div>
      </div>
    </>
  );
}
