import { useState, useEffect } from "react";

// ============================================================
// DONNÉES INITIALES
// ============================================================
const initialEleves = [
  { id: 1, nom: "Mbarga", prenom: "Joël", email: "joel.mbarga@gmail.com", telephone: "699 001 002", dateInscription: "2025-01-10", moniteurId: 1, statut: "En cours", heuresEffectuees: 18, heuresTotal: 30, solde: 45000, examens: ["Code: Réussi"], permis: "B", photo: "JM" },
  { id: 2, nom: "Eyenga", prenom: "Sandra", email: "sandra.eyenga@gmail.com", telephone: "677 234 567", dateInscription: "2025-02-05", moniteurId: 2, statut: "En cours", heuresEffectuees: 10, heuresTotal: 30, solde: 120000, examens: [], permis: "B", photo: "SE" },
  { id: 3, nom: "Nkodo", prenom: "Paul", email: "paul.nkodo@gmail.com", telephone: "655 111 222", dateInscription: "2024-11-20", moniteurId: 1, statut: "Diplômé", heuresEffectuees: 30, heuresTotal: 30, solde: 0, examens: ["Code: Réussi", "Conduite: Réussi"], permis: "B", photo: "PN" },
  { id: 4, nom: "Biya", prenom: "Marie", email: "marie.biya@gmail.com", telephone: "690 345 678", dateInscription: "2025-03-01", moniteurId: 3, statut: "En cours", heuresEffectuees: 5, heuresTotal: 30, solde: 150000, examens: [], permis: "A", photo: "MB" },
  { id: 5, nom: "Ateba", prenom: "Christophe", email: "christophe.ateba@gmail.com", telephone: "676 456 789", dateInscription: "2025-01-28", moniteurId: 2, statut: "Suspendu", heuresEffectuees: 12, heuresTotal: 30, solde: 85000, examens: ["Code: Échoué"], permis: "B", photo: "CA" },
];

const initialMoniteurs = [
  { id: 1, nom: "Essomba", prenom: "Roger", email: "roger.essomba@autoecole.cm", telephone: "697 001 001", specialite: "Permis B", statut: "Actif", elevesSuivis: 12, noteMoyenne: 4.7, dateEmbauche: "2020-03-15", photo: "RE", salaire: 180000 },
  { id: 2, nom: "Fouda", prenom: "Carine", email: "carine.fouda@autoecole.cm", telephone: "675 002 002", specialite: "Permis B/A", statut: "Actif", elevesSuivis: 9, noteMoyenne: 4.5, dateEmbauche: "2021-07-01", photo: "CF", salaire: 165000 },
  { id: 3, nom: "Mvondo", prenom: "Jules", email: "jules.mvondo@autoecole.cm", telephone: "654 003 003", specialite: "Permis A", statut: "Congé", elevesSuivis: 6, noteMoyenne: 4.2, dateEmbauche: "2022-01-10", photo: "JM", salaire: 155000 },
];

const initialLecons = [
  { id: 1, eleveId: 1, moniteurId: 1, date: "2025-03-10", heure: "08:00", duree: 2, type: "Conduite", statut: "Confirmée", vehicule: "Toyota Corolla - LT 123 DL", notes: "" },
  { id: 2, eleveId: 2, moniteurId: 2, date: "2025-03-10", heure: "10:00", duree: 1.5, type: "Code", statut: "En attente", vehicule: "Salle A", notes: "" },
  { id: 3, eleveId: 4, moniteurId: 3, date: "2025-03-11", heure: "07:00", duree: 2, type: "Conduite", statut: "Confirmée", vehicule: "Honda CB - LT 456 DL", notes: "" },
  { id: 4, eleveId: 1, moniteurId: 1, date: "2025-03-12", heure: "09:00", duree: 2, type: "Conduite", statut: "Confirmée", vehicule: "Toyota Corolla - LT 123 DL", notes: "" },
  { id: 5, eleveId: 5, moniteurId: 2, date: "2025-03-13", heure: "15:00", duree: 1, type: "Code", statut: "Annulée", vehicule: "Salle B", notes: "Élève absent" },
];

const initialExamens = [
  { id: 1, eleveId: 1, type: "Code", date: "2025-02-20", resultat: "Réussi", score: 38, seuil: 35, centre: "CENAC Douala", notes: "" },
  { id: 2, eleveId: 3, type: "Code", date: "2024-12-15", resultat: "Réussi", score: 40, seuil: 35, centre: "CENAC Douala", notes: "" },
  { id: 3, eleveId: 3, type: "Conduite", date: "2025-01-10", resultat: "Réussi", score: 17, seuil: 14, centre: "CENAC Douala", notes: "" },
  { id: 4, eleveId: 5, type: "Code", date: "2025-02-28", resultat: "Échoué", score: 30, seuil: 35, centre: "CENAC Douala", notes: "Réviser signalisation" },
];

const initialPaiements = [
  { id: 1, eleveId: 1, montant: 75000, date: "2025-01-10", type: "Inscription", mode: "Mobile Money", statut: "Payé", reference: "PAY-2025-001" },
  { id: 2, eleveId: 2, montant: 30000, date: "2025-02-05", type: "Inscription", mode: "Espèces", statut: "Payé", reference: "PAY-2025-002" },
  { id: 3, eleveId: 4, montant: 50000, date: "2025-03-01", type: "Acompte", mode: "Virement", statut: "Payé", reference: "PAY-2025-003" },
  { id: 4, eleveId: 3, montant: 200000, date: "2024-11-20", type: "Paiement complet", mode: "Mobile Money", statut: "Payé", reference: "PAY-2024-050" },
];

const initialNotifications = [
  { id: 1, eleveId: 1, type: "SMS", sujet: "Rappel leçon", message: "Rappel: Leçon de conduite demain 10/03 à 08h00 avec M. Essomba.", date: "2025-03-09", statut: "Envoyé" },
  { id: 2, eleveId: 2, type: "Email", sujet: "Convocation examen code", message: "Vous êtes convoqué pour l'examen du code le 15/03/2025 au CENAC Douala.", date: "2025-03-05", statut: "Envoyé" },
  { id: 3, eleveId: 5, type: "SMS", sujet: "Leçon annulée", message: "Votre leçon du 13/03 à 15h00 a été annulée. Veuillez contacter l'école.", date: "2025-03-12", statut: "Envoyé" },
];

// ============================================================
// COMPOSANTS UTILITAIRES
// ============================================================
const Avatar = ({ initials, color = "#FF6B35", size = 40 }) => (
  <div style={{ width: size, height: size, borderRadius: "50%", background: `linear-gradient(135deg, ${color}, ${color}99)`, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, color: "#fff", fontSize: size * 0.35, flexShrink: 0, boxShadow: `0 4px 15px ${color}44` }}>
    {initials}
  </div>
);

const Badge = ({ label }) => {
  const colors = {
    "En cours": { bg: "#1a3a2a", text: "#4ade80", border: "#4ade8044" },
    "Diplômé": { bg: "#1a2a4a", text: "#60a5fa", border: "#60a5fa44" },
    "Suspendu": { bg: "#3a1a1a", text: "#f87171", border: "#f8717144" },
    "Actif": { bg: "#1a3a2a", text: "#4ade80", border: "#4ade8044" },
    "Congé": { bg: "#3a2a1a", text: "#fb923c", border: "#fb923c44" },
    "Confirmée": { bg: "#1a3a2a", text: "#4ade80", border: "#4ade8044" },
    "En attente": { bg: "#3a2a1a", text: "#fb923c", border: "#fb923c44" },
    "Annulée": { bg: "#3a1a1a", text: "#f87171", border: "#f8717144" },
    "Réussi": { bg: "#1a3a2a", text: "#4ade80", border: "#4ade8044" },
    "Échoué": { bg: "#3a1a1a", text: "#f87171", border: "#f8717144" },
    "Payé": { bg: "#1a3a2a", text: "#4ade80", border: "#4ade8044" },
    "Envoyé": { bg: "#1a2a4a", text: "#60a5fa", border: "#60a5fa44" },
  };
  const c = colors[label] || { bg: "#2a2a3a", text: "#a0a0c0", border: "#a0a0c044" };
  return (
    <span style={{ padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 700, background: c.bg, color: c.text, border: `1px solid ${c.border}`, letterSpacing: 0.5, whiteSpace: "nowrap" }}>
      {label}
    </span>
  );
};

const StatCard = ({ icon, label, value, sub, color, trend }) => (
  <div style={{ background: "linear-gradient(135deg, #1a1a2e, #16213e)", border: `1px solid ${color}33`, borderRadius: 16, padding: "20px 24px", position: "relative", overflow: "hidden", transition: "transform 0.2s, box-shadow 0.2s", cursor: "default" }}
    onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = `0 12px 40px ${color}33`; }}
    onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}>
    <div style={{ position: "absolute", top: -20, right: -20, width: 80, height: 80, borderRadius: "50%", background: `${color}15` }} />
    <div style={{ fontSize: 28, marginBottom: 8 }}>{icon}</div>
    <div style={{ fontSize: 30, fontWeight: 800, color: "#fff" }}>{value}</div>
    <div style={{ fontSize: 13, color: "#888", marginTop: 2 }}>{label}</div>
    {sub && <div style={{ fontSize: 12, color: color, marginTop: 6, fontWeight: 600 }}>{trend} {sub}</div>}
  </div>
);

const Modal = ({ title, onClose, children }) => (
  <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.75)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", backdropFilter: "blur(6px)" }}
    onClick={e => e.target === e.currentTarget && onClose()}>
    <div style={{ background: "#0f0f1a", border: "1px solid #2a2a4a", borderRadius: 20, padding: 32, width: "min(90vw, 560px)", maxHeight: "85vh", overflowY: "auto", boxShadow: "0 40px 80px rgba(0,0,0,0.8)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <h3 style={{ margin: 0, color: "#fff", fontSize: 20, fontWeight: 800 }}>{title}</h3>
        <button onClick={onClose} style={{ background: "#2a2a4a", border: "none", color: "#fff", width: 32, height: 32, borderRadius: 8, cursor: "pointer", fontSize: 16 }}>✕</button>
      </div>
      {children}
    </div>
  </div>
);

const InputField = ({ label, value, onChange, type = "text", placeholder, options, required }) => (
  <div style={{ marginBottom: 16 }}>
    <label style={{ display: "block", color: "#aaa", fontSize: 12, marginBottom: 6, fontWeight: 600, textTransform: "uppercase", letterSpacing: 1 }}>{label}{required && " *"}</label>
    {options ? (
      <select value={value} onChange={e => onChange(e.target.value)} style={{ width: "100%", padding: "10px 14px", background: "#1a1a2e", border: "1px solid #2a2a4a", borderRadius: 10, color: "#fff", fontSize: 14, outline: "none" }}>
        {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    ) : (
      <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
        style={{ width: "100%", padding: "10px 14px", background: "#1a1a2e", border: "1px solid #2a2a4a", borderRadius: 10, color: "#fff", fontSize: 14, outline: "none", boxSizing: "border-box" }} />
    )}
  </div>
);

const ProgressBar = ({ value, max, color = "#FF6B35" }) => (
  <div style={{ background: "#1a1a2e", borderRadius: 100, height: 6, overflow: "hidden", width: "100%" }}>
    <div style={{ width: `${Math.min(100, (value / max) * 100)}%`, height: "100%", background: `linear-gradient(90deg, ${color}, ${color}bb)`, borderRadius: 100, transition: "width 0.5s ease" }} />
  </div>
);

// ============================================================
// PAGE: DASHBOARD
// ============================================================
const Dashboard = ({ eleves, moniteurs, lecons, examens, paiements }) => {
  const totalCA = paiements.reduce((s, p) => s + p.montant, 0);
  const tauxReussite = examens.length ? Math.round((examens.filter(e => e.resultat === "Réussi").length / examens.length) * 100) : 0;
  const elevesActifs = eleves.filter(e => e.statut === "En cours").length;

  return (
    <div>
      <div style={{ marginBottom: 32 }}>
        <h2 style={{ fontSize: 28, fontWeight: 800, color: "#fff", margin: 0 }}>🏠 Tableau de bord</h2>
        <p style={{ color: "#888", margin: "4px 0 0" }}>Vue d'ensemble — Auto-École Excellence, Douala</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 16, marginBottom: 28 }}>
        <StatCard icon="👨‍🎓" label="Élèves actifs" value={elevesActifs} sub="+2 ce mois" trend="▲" color="#FF6B35" />
        <StatCard icon="🏆" label="Taux de réussite" value={`${tauxReussite}%`} sub="aux examens" trend="✓" color="#4ade80" />
        <StatCard icon="📅" label="Leçons planifiées" value={lecons.filter(l => l.statut !== "Annulée").length} sub="cette semaine" trend="📌" color="#6C63FF" />
        <StatCard icon="💰" label="Chiffre d'affaires" value={`${(totalCA/1000).toFixed(0)}K`} sub="FCFA total" trend="▲" color="#f59e0b" />
        <StatCard icon="👨‍🏫" label="Moniteurs actifs" value={moniteurs.filter(m => m.statut === "Actif").length} sub="en activité" trend="✓" color="#38bdf8" />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 20 }}>
        <div style={{ background: "linear-gradient(135deg, #1a1a2e, #16213e)", border: "1px solid #2a2a4a", borderRadius: 16, padding: 24 }}>
          <h3 style={{ color: "#fff", margin: "0 0 20px", fontSize: 16 }}>📊 Performance des moniteurs</h3>
          {moniteurs.map((m, i) => (
            <div key={m.id} style={{ marginBottom: 18 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                <span style={{ color: "#ccc", fontSize: 14 }}>{m.prenom} {m.nom}</span>
                <span style={{ color: "#FF6B35", fontWeight: 700, fontSize: 13 }}>⭐ {m.noteMoyenne} ({m.elevesSuivis} élèves)</span>
              </div>
              <ProgressBar value={m.noteMoyenne} max={5} color={["#FF6B35","#6C63FF","#4ade80"][i % 3]} />
            </div>
          ))}
        </div>

        <div style={{ background: "linear-gradient(135deg, #1a1a2e, #16213e)", border: "1px solid #2a2a4a", borderRadius: 16, padding: 24 }}>
          <h3 style={{ color: "#fff", margin: "0 0 20px", fontSize: 16 }}>🎯 Répartition par permis</h3>
          {[{ label: "Permis B (Voiture)", count: eleves.filter(e => e.permis === "B").length, color: "#FF6B35" }, { label: "Permis A (Moto)", count: eleves.filter(e => e.permis === "A").length, color: "#6C63FF" }].map((r, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 20 }}>
              <div style={{ width: 52, height: 52, borderRadius: 14, background: `${r.color}22`, border: `2px solid ${r.color}55`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, fontWeight: 800, color: r.color }}>{r.count}</div>
              <div style={{ flex: 1 }}>
                <div style={{ color: "#ccc", fontSize: 14, marginBottom: 6 }}>{r.label}</div>
                <ProgressBar value={r.count} max={eleves.length} color={r.color} />
              </div>
            </div>
          ))}
          <div style={{ padding: "14px 18px", background: "#0a0a18", borderRadius: 12, display: "flex", justifyContent: "space-between" }}>
            <span style={{ color: "#888", fontSize: 13 }}>Total inscrits</span>
            <span style={{ color: "#fff", fontWeight: 800, fontSize: 18 }}>{eleves.length}</span>
          </div>
        </div>
      </div>

      <div style={{ background: "linear-gradient(135deg, #1a1a2e, #16213e)", border: "1px solid #2a2a4a", borderRadius: 16, padding: 24 }}>
        <h3 style={{ color: "#fff", margin: "0 0 20px", fontSize: 16 }}>🕒 Prochaines leçons</h3>
        <div style={{ display: "grid", gap: 10 }}>
          {lecons.filter(l => l.statut !== "Annulée").slice(0, 4).map(l => {
            const eleve = eleves.find(e => e.id === l.eleveId);
            const moniteur = moniteurs.find(m => m.id === l.moniteurId);
            return (
              <div key={l.id} style={{ display: "flex", alignItems: "center", gap: 14, padding: "12px 16px", background: "#0a0a18", borderRadius: 12 }}>
                <Avatar initials={eleve?.photo || "?"} color="#FF6B35" size={38} />
                <div style={{ flex: 1 }}>
                  <div style={{ color: "#fff", fontSize: 14, fontWeight: 600 }}>{eleve?.prenom} {eleve?.nom}</div>
                  <div style={{ color: "#888", fontSize: 12 }}>avec {moniteur?.prenom} {moniteur?.nom} • {l.vehicule}</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ color: "#FF6B35", fontWeight: 700, fontSize: 13 }}>{l.date} à {l.heure}</div>
                  <Badge label={l.statut} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// ============================================================
// PAGE: ÉLÈVES
// ============================================================
const GestionEleves = ({ eleves, setEleves, moniteurs }) => {
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState({ nom: "", prenom: "", email: "", telephone: "", moniteurId: moniteurs[0]?.id || 1, permis: "B", heuresTotal: 30 });

  const filtered = eleves.filter(e => `${e.nom} ${e.prenom} ${e.email}`.toLowerCase().includes(search.toLowerCase()));

  const openEdit = (e) => { setSelected(e); setForm({ ...e }); setShowModal(true); };
  const openNew = () => { setSelected(null); setForm({ nom: "", prenom: "", email: "", telephone: "", moniteurId: moniteurs[0]?.id || 1, permis: "B", heuresTotal: 30 }); setShowModal(true); };
  const save = () => {
    if (!form.nom || !form.prenom) return;
    if (selected) {
      setEleves(prev => prev.map(e => e.id === selected.id ? { ...e, ...form } : e));
    } else {
      setEleves(prev => [...prev, { ...form, id: Date.now(), statut: "En cours", heuresEffectuees: 0, solde: 200000, examens: [], dateInscription: new Date().toISOString().split("T")[0], photo: ((form.prenom[0] || "") + (form.nom[0] || "")).toUpperCase() }]);
    }
    setShowModal(false);
  };
  const del = (id) => { if (window.confirm("Supprimer cet élève ?")) setEleves(prev => prev.filter(e => e.id !== id)); };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <div>
          <h2 style={{ fontSize: 26, fontWeight: 800, color: "#fff", margin: 0 }}>👨‍🎓 Gestion des Élèves</h2>
          <p style={{ color: "#888", margin: "4px 0 0", fontSize: 14 }}>{eleves.length} élèves inscrits</p>
        </div>
        <button onClick={openNew} style={{ background: "linear-gradient(135deg, #FF6B35, #FF8C5A)", border: "none", color: "#fff", padding: "12px 24px", borderRadius: 12, cursor: "pointer", fontWeight: 700, fontSize: 14, boxShadow: "0 4px 20px #FF6B3566" }}>
          + Nouvel élève
        </button>
      </div>

      <input value={search} onChange={e => setSearch(e.target.value)} placeholder="🔍 Rechercher un élève..."
        style={{ width: "100%", padding: "12px 16px", background: "#1a1a2e", border: "1px solid #2a2a4a", borderRadius: 12, color: "#fff", fontSize: 14, marginBottom: 20, boxSizing: "border-box", outline: "none" }} />

      <div style={{ display: "grid", gap: 12 }}>
        {filtered.map(e => {
          const moniteur = moniteurs.find(m => m.id === e.moniteurId);
          const colors = ["#FF6B35","#6C63FF","#4ade80","#f59e0b","#38bdf8"];
          return (
            <div key={e.id} style={{ background: "linear-gradient(135deg, #1a1a2e, #16213e)", border: "1px solid #2a2a4a", borderRadius: 16, padding: 20, display: "flex", alignItems: "center", gap: 16, transition: "border-color 0.2s" }}
              onMouseEnter={el => el.currentTarget.style.borderColor = "#FF6B3566"}
              onMouseLeave={el => el.currentTarget.style.borderColor = "#2a2a4a"}>
              <Avatar initials={e.photo} color={colors[e.id % 5]} size={52} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4, flexWrap: "wrap" }}>
                  <span style={{ color: "#fff", fontWeight: 700, fontSize: 16 }}>{e.prenom} {e.nom}</span>
                  <Badge label={e.statut} />
                  <span style={{ fontSize: 11, color: "#888", background: "#2a2a4a", padding: "2px 8px", borderRadius: 20 }}>Permis {e.permis}</span>
                </div>
                <div style={{ color: "#888", fontSize: 12, marginBottom: 10 }}>📧 {e.email} • 📱 {e.telephone} • 👨‍🏫 {moniteur?.prenom} {moniteur?.nom}</div>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <ProgressBar value={e.heuresEffectuees} max={e.heuresTotal} color="#FF6B35" />
                  <span style={{ color: "#FF6B35", fontSize: 12, fontWeight: 700, whiteSpace: "nowrap" }}>{e.heuresEffectuees}h/{e.heuresTotal}h</span>
                </div>
              </div>
              <div style={{ textAlign: "right", flexShrink: 0 }}>
                <div style={{ color: e.solde > 0 ? "#f87171" : "#4ade80", fontWeight: 700, fontSize: 14, marginBottom: 8 }}>
                  {e.solde > 0 ? `${e.solde.toLocaleString()} FCFA` : "✓ Soldé"}
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <button onClick={() => openEdit(e)} style={{ background: "#2a2a4a", border: "none", color: "#fff", padding: "8px 14px", borderRadius: 8, cursor: "pointer", fontSize: 13 }}>✏️</button>
                  <button onClick={() => del(e.id)} style={{ background: "#3a1a1a", border: "none", color: "#f87171", padding: "8px 12px", borderRadius: 8, cursor: "pointer", fontSize: 13 }}>🗑️</button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {showModal && (
        <Modal title={selected ? "Modifier l'élève" : "Nouvel élève"} onClose={() => setShowModal(false)}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <InputField label="Prénom" value={form.prenom} onChange={v => setForm({...form, prenom: v})} required />
            <InputField label="Nom" value={form.nom} onChange={v => setForm({...form, nom: v})} required />
          </div>
          <InputField label="Email" type="email" value={form.email} onChange={v => setForm({...form, email: v})} />
          <InputField label="Téléphone" value={form.telephone} onChange={v => setForm({...form, telephone: v})} />
          <InputField label="Moniteur" value={form.moniteurId} onChange={v => setForm({...form, moniteurId: Number(v)})}
            options={moniteurs.map(m => ({ value: m.id, label: `${m.prenom} ${m.nom}` }))} />
          <InputField label="Type de permis" value={form.permis} onChange={v => setForm({...form, permis: v})}
            options={[{ value: "B", label: "Permis B (Voiture)" }, { value: "A", label: "Permis A (Moto)" }]} />
          <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
            <button onClick={() => setShowModal(false)} style={{ flex: 1, padding: "12px", background: "#2a2a4a", border: "none", color: "#fff", borderRadius: 12, cursor: "pointer", fontWeight: 600 }}>Annuler</button>
            <button onClick={save} style={{ flex: 1, padding: "12px", background: "linear-gradient(135deg, #FF6B35, #FF8C5A)", border: "none", color: "#fff", borderRadius: 12, cursor: "pointer", fontWeight: 700 }}>Enregistrer</button>
          </div>
        </Modal>
      )}
    </div>
  );
};

// ============================================================
// PAGE: MONITEURS
// ============================================================
const GestionMoniteurs = ({ moniteurs, setMoniteurs }) => {
  const [showModal, setShowModal] = useState(false);
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState({ nom: "", prenom: "", email: "", telephone: "", specialite: "Permis B", salaire: 150000 });

  const openEdit = (m) => { setSelected(m); setForm({ ...m }); setShowModal(true); };
  const openNew = () => { setSelected(null); setForm({ nom: "", prenom: "", email: "", telephone: "", specialite: "Permis B", salaire: 150000 }); setShowModal(true); };
  const save = () => {
    if (!form.nom || !form.prenom) return;
    if (selected) {
      setMoniteurs(prev => prev.map(m => m.id === selected.id ? { ...m, ...form } : m));
    } else {
      setMoniteurs(prev => [...prev, { ...form, id: Date.now(), statut: "Actif", elevesSuivis: 0, noteMoyenne: 0, dateEmbauche: new Date().toISOString().split("T")[0], photo: ((form.prenom[0] || "") + (form.nom[0] || "")).toUpperCase() }]);
    }
    setShowModal(false);
  };
  const del = (id) => { if (window.confirm("Supprimer ce moniteur ?")) setMoniteurs(prev => prev.filter(m => m.id !== id)); };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <div>
          <h2 style={{ fontSize: 26, fontWeight: 800, color: "#fff", margin: 0 }}>👨‍🏫 Gestion des Moniteurs</h2>
          <p style={{ color: "#888", margin: "4px 0 0", fontSize: 14 }}>{moniteurs.length} moniteurs enregistrés</p>
        </div>
        <button onClick={openNew} style={{ background: "linear-gradient(135deg, #6C63FF, #8B83FF)", border: "none", color: "#fff", padding: "12px 24px", borderRadius: 12, cursor: "pointer", fontWeight: 700, fontSize: 14, boxShadow: "0 4px 20px #6C63FF66" }}>
          + Nouveau moniteur
        </button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16 }}>
        {moniteurs.map(m => {
          const colors = ["#6C63FF","#FF6B35","#4ade80"];
          const c = colors[m.id % 3];
          return (
            <div key={m.id} style={{ background: "linear-gradient(135deg, #1a1a2e, #16213e)", border: "1px solid #2a2a4a", borderRadius: 20, padding: 24, transition: "border-color 0.2s, transform 0.2s" }}
              onMouseEnter={el => { el.currentTarget.style.borderColor = "#6C63FF66"; el.currentTarget.style.transform = "translateY(-2px)"; }}
              onMouseLeave={el => { el.currentTarget.style.borderColor = "#2a2a4a"; el.currentTarget.style.transform = "translateY(0)"; }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
                <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
                  <Avatar initials={m.photo} color={c} size={52} />
                  <div>
                    <div style={{ color: "#fff", fontWeight: 700, fontSize: 16 }}>{m.prenom} {m.nom}</div>
                    <div style={{ color: "#888", fontSize: 13 }}>{m.specialite}</div>
                  </div>
                </div>
                <Badge label={m.statut} />
              </div>
              <div style={{ display: "grid", gap: 6, fontSize: 13, marginBottom: 16 }}>
                <div style={{ color: "#888" }}>📧 {m.email}</div>
                <div style={{ color: "#888" }}>📱 {m.telephone}</div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "#888" }}>📅 Depuis {m.dateEmbauche}</span>
                  <span style={{ color: "#f59e0b", fontWeight: 700 }}>💰 {m.salaire.toLocaleString()} FCFA</span>
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 16 }}>
                <div style={{ background: "#0a0a18", borderRadius: 12, padding: "12px", textAlign: "center" }}>
                  <div style={{ fontSize: 22, fontWeight: 800, color: c }}>{m.elevesSuivis}</div>
                  <div style={{ fontSize: 11, color: "#888" }}>Élèves suivis</div>
                </div>
                <div style={{ background: "#0a0a18", borderRadius: 12, padding: "12px", textAlign: "center" }}>
                  <div style={{ fontSize: 22, fontWeight: 800, color: "#f59e0b" }}>⭐ {m.noteMoyenne}</div>
                  <div style={{ fontSize: 11, color: "#888" }}>Note moyenne</div>
                </div>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <button onClick={() => openEdit(m)} style={{ flex: 1, background: "#2a2a4a", border: "none", color: "#fff", padding: "10px", borderRadius: 10, cursor: "pointer", fontWeight: 600, fontSize: 13 }}>✏️ Modifier</button>
                <button onClick={() => del(m.id)} style={{ background: "#3a1a1a", border: "none", color: "#f87171", padding: "10px 14px", borderRadius: 10, cursor: "pointer", fontSize: 13 }}>🗑️</button>
              </div>
            </div>
          );
        })}
      </div>

      {showModal && (
        <Modal title={selected ? "Modifier le moniteur" : "Nouveau moniteur"} onClose={() => setShowModal(false)}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <InputField label="Prénom" value={form.prenom} onChange={v => setForm({...form, prenom: v})} required />
            <InputField label="Nom" value={form.nom} onChange={v => setForm({...form, nom: v})} required />
          </div>
          <InputField label="Email" value={form.email} onChange={v => setForm({...form, email: v})} />
          <InputField label="Téléphone" value={form.telephone} onChange={v => setForm({...form, telephone: v})} />
          <InputField label="Spécialité" value={form.specialite} onChange={v => setForm({...form, specialite: v})}
            options={[{ value: "Permis B", label: "Permis B" }, { value: "Permis A", label: "Permis A" }, { value: "Permis B/A", label: "Permis B & A" }]} />
          <InputField label="Salaire mensuel (FCFA)" type="number" value={form.salaire} onChange={v => setForm({...form, salaire: Number(v)})} />
          <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
            <button onClick={() => setShowModal(false)} style={{ flex: 1, padding: "12px", background: "#2a2a4a", border: "none", color: "#fff", borderRadius: 12, cursor: "pointer", fontWeight: 600 }}>Annuler</button>
            <button onClick={save} style={{ flex: 1, padding: "12px", background: "linear-gradient(135deg, #6C63FF, #8B83FF)", border: "none", color: "#fff", borderRadius: 12, cursor: "pointer", fontWeight: 700 }}>Enregistrer</button>
          </div>
        </Modal>
      )}
    </div>
  );
};

// ============================================================
// PAGE: PLANNING
// ============================================================
const Planning = ({ lecons, setLecons, eleves, moniteurs }) => {
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ eleveId: eleves[0]?.id || 1, moniteurId: moniteurs[0]?.id || 1, date: "", heure: "08:00", duree: 2, type: "Conduite", vehicule: "", statut: "En attente" });

  const save = () => {
    setLecons(prev => [...prev, { ...form, id: Date.now(), eleveId: Number(form.eleveId), moniteurId: Number(form.moniteurId), duree: Number(form.duree), notes: "" }]);
    setShowModal(false);
  };

  const statusColor = { "Confirmée": "#4ade80", "En attente": "#fb923c", "Annulée": "#f87171" };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <div>
          <h2 style={{ fontSize: 26, fontWeight: 800, color: "#fff", margin: 0 }}>📅 Planning des Leçons</h2>
          <p style={{ color: "#888", margin: "4px 0 0", fontSize: 14 }}>Semaine du 10 au 14 Mars 2025</p>
        </div>
        <button onClick={() => setShowModal(true)} style={{ background: "linear-gradient(135deg, #4ade80, #22c55e)", border: "none", color: "#000", padding: "12px 24px", borderRadius: 12, cursor: "pointer", fontWeight: 700, fontSize: 14, boxShadow: "0 4px 20px #4ade8066" }}>
          + Planifier une leçon
        </button>
      </div>

      <div style={{ display: "grid", gap: 12 }}>
        {lecons.map(l => {
          const eleve = eleves.find(e => e.id === l.eleveId);
          const moniteur = moniteurs.find(m => m.id === l.moniteurId);
          const sc = statusColor[l.statut] || "#888";
          return (
            <div key={l.id} style={{ background: "linear-gradient(135deg, #1a1a2e, #16213e)", border: `1px solid ${sc}33`, borderRadius: 14, padding: 20, display: "flex", alignItems: "center", gap: 16 }}>
              <div style={{ width: 4, height: 52, borderRadius: 4, background: sc, flexShrink: 0 }} />
              <Avatar initials={eleve?.photo || "?"} color={sc} size={44} />
              <div style={{ flex: 1 }}>
                <div style={{ color: "#fff", fontWeight: 700, fontSize: 15, marginBottom: 4 }}>{eleve?.prenom} {eleve?.nom} — {l.type}</div>
                <div style={{ color: "#888", fontSize: 13 }}>👨‍🏫 {moniteur?.prenom} {moniteur?.nom} • 🚗 {l.vehicule} • ⏱️ {l.duree}h</div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ color: sc, fontWeight: 700, fontSize: 14, marginBottom: 6 }}>{l.date} à {l.heure}</div>
                <Badge label={l.statut} />
              </div>
            </div>
          );
        })}
      </div>

      {showModal && (
        <Modal title="Planifier une leçon" onClose={() => setShowModal(false)}>
          <InputField label="Élève" value={form.eleveId} onChange={v => setForm({...form, eleveId: Number(v)})}
            options={eleves.map(e => ({ value: e.id, label: `${e.prenom} ${e.nom}` }))} />
          <InputField label="Moniteur" value={form.moniteurId} onChange={v => setForm({...form, moniteurId: Number(v)})}
            options={moniteurs.map(m => ({ value: m.id, label: `${m.prenom} ${m.nom}` }))} />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <InputField label="Date" type="date" value={form.date} onChange={v => setForm({...form, date: v})} />
            <InputField label="Heure" type="time" value={form.heure} onChange={v => setForm({...form, heure: v})} />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <InputField label="Durée (h)" type="number" value={form.duree} onChange={v => setForm({...form, duree: v})} />
            <InputField label="Type" value={form.type} onChange={v => setForm({...form, type: v})}
              options={[{ value: "Conduite", label: "Conduite" }, { value: "Code", label: "Code" }]} />
          </div>
          <InputField label="Véhicule / Salle" value={form.vehicule} onChange={v => setForm({...form, vehicule: v})} placeholder="Ex: Toyota Corolla - LT 123 DL" />
          <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
            <button onClick={() => setShowModal(false)} style={{ flex: 1, padding: "12px", background: "#2a2a4a", border: "none", color: "#fff", borderRadius: 12, cursor: "pointer", fontWeight: 600 }}>Annuler</button>
            <button onClick={save} style={{ flex: 1, padding: "12px", background: "linear-gradient(135deg, #4ade80, #22c55e)", border: "none", color: "#000", borderRadius: 12, cursor: "pointer", fontWeight: 700 }}>Enregistrer</button>
          </div>
        </Modal>
      )}
    </div>
  );
};

// ============================================================
// PAGE: EXAMENS
// ============================================================
const GestionExamens = ({ examens, setExamens, eleves }) => {
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ eleveId: eleves[0]?.id || 1, type: "Code", date: "", resultat: "Réussi", score: 0, seuil: 35, centre: "CENAC Douala", notes: "" });

  const save = () => {
    setExamens(prev => [...prev, { ...form, id: Date.now(), eleveId: Number(form.eleveId), score: Number(form.score), seuil: Number(form.seuil) }]);
    setShowModal(false);
  };

  const stats = { total: examens.length, reussis: examens.filter(e => e.resultat === "Réussi").length, echoues: examens.filter(e => e.resultat === "Échoué").length };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <div>
          <h2 style={{ fontSize: 26, fontWeight: 800, color: "#fff", margin: 0 }}>🏆 Gestion des Examens</h2>
          <p style={{ color: "#888", margin: "4px 0 0", fontSize: 14 }}>{stats.total} examens enregistrés</p>
        </div>
        <button onClick={() => setShowModal(true)} style={{ background: "linear-gradient(135deg, #f59e0b, #fbbf24)", border: "none", color: "#000", padding: "12px 24px", borderRadius: 12, cursor: "pointer", fontWeight: 700, fontSize: 14, boxShadow: "0 4px 20px #f59e0b66" }}>
          + Enregistrer un examen
        </button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 24 }}>
        {[{ label: "Total examens", value: stats.total, color: "#60a5fa", bg: "#1a2a4a", border: "#2a3a6a" },
          { label: "Réussis ✓", value: stats.reussis, color: "#4ade80", bg: "#1a3a2a", border: "#2a5a3a" },
          { label: "Échoués ✗", value: stats.echoues, color: "#f87171", bg: "#3a1a1a", border: "#5a2a2a" }].map((s, i) => (
          <div key={i} style={{ background: s.bg, border: `1px solid ${s.border}`, borderRadius: 16, padding: 20, textAlign: "center" }}>
            <div style={{ fontSize: 36, fontWeight: 800, color: s.color }}>{s.value}</div>
            <div style={{ color: "#888", fontSize: 13 }}>{s.label}</div>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gap: 12 }}>
        {examens.map(ex => {
          const eleve = eleves.find(e => e.id === ex.eleveId);
          const maxScore = ex.type === "Code" ? 40 : 20;
          const c = ex.resultat === "Réussi" ? "#4ade80" : "#f87171";
          return (
            <div key={ex.id} style={{ background: "linear-gradient(135deg, #1a1a2e, #16213e)", border: "1px solid #2a2a4a", borderRadius: 14, padding: 20, display: "flex", alignItems: "center", gap: 16 }}>
              <Avatar initials={eleve?.photo || "?"} color={c} size={48} />
              <div style={{ flex: 1 }}>
                <div style={{ color: "#fff", fontWeight: 700, fontSize: 15, marginBottom: 4 }}>{eleve?.prenom} {eleve?.nom} — Examen {ex.type}</div>
                <div style={{ color: "#888", fontSize: 13, marginBottom: 10 }}>📍 {ex.centre} • 📅 {ex.date}</div>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <ProgressBar value={ex.score} max={maxScore} color={c} />
                  <span style={{ color: c, fontWeight: 700, fontSize: 12, whiteSpace: "nowrap" }}>{ex.score}/{maxScore} pts</span>
                </div>
                {ex.notes && <div style={{ color: "#f59e0b", fontSize: 12, marginTop: 6 }}>💬 {ex.notes}</div>}
              </div>
              <Badge label={ex.resultat} />
            </div>
          );
        })}
      </div>

      {showModal && (
        <Modal title="Enregistrer un examen" onClose={() => setShowModal(false)}>
          <InputField label="Élève" value={form.eleveId} onChange={v => setForm({...form, eleveId: Number(v)})}
            options={eleves.map(e => ({ value: e.id, label: `${e.prenom} ${e.nom}` }))} />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <InputField label="Type" value={form.type} onChange={v => setForm({...form, type: v, seuil: v === "Code" ? 35 : 14})}
              options={[{ value: "Code", label: "Examen de code" }, { value: "Conduite", label: "Examen de conduite" }]} />
            <InputField label="Date" type="date" value={form.date} onChange={v => setForm({...form, date: v})} />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <InputField label="Score obtenu" type="number" value={form.score} onChange={v => setForm({...form, score: v})} />
            <InputField label="Résultat" value={form.resultat} onChange={v => setForm({...form, resultat: v})}
              options={[{ value: "Réussi", label: "✓ Réussi" }, { value: "Échoué", label: "✗ Échoué" }]} />
          </div>
          <InputField label="Centre d'examen" value={form.centre} onChange={v => setForm({...form, centre: v})} />
          <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
            <button onClick={() => setShowModal(false)} style={{ flex: 1, padding: "12px", background: "#2a2a4a", border: "none", color: "#fff", borderRadius: 12, cursor: "pointer", fontWeight: 600 }}>Annuler</button>
            <button onClick={save} style={{ flex: 1, padding: "12px", background: "linear-gradient(135deg, #f59e0b, #fbbf24)", border: "none", color: "#000", borderRadius: 12, cursor: "pointer", fontWeight: 700 }}>Enregistrer</button>
          </div>
        </Modal>
      )}
    </div>
  );
};

// ============================================================
// PAGE: FACTURATION
// ============================================================
const Facturation = ({ paiements, setPaiements, eleves }) => {
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ eleveId: eleves[0]?.id || 1, montant: 0, type: "Inscription", mode: "Mobile Money", statut: "Payé" });

  const totalCA = paiements.reduce((s, p) => s + p.montant, 0);
  const save = () => {
    const ref = `PAY-${new Date().getFullYear()}-${String(paiements.length + 1).padStart(3, "0")}`;
    setPaiements(prev => [...prev, { ...form, id: Date.now(), date: new Date().toISOString().split("T")[0], reference: ref, montant: Number(form.montant), eleveId: Number(form.eleveId) }]);
    setShowModal(false);
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <div>
          <h2 style={{ fontSize: 26, fontWeight: 800, color: "#fff", margin: 0 }}>💰 Facturation & Paiements</h2>
          <p style={{ color: "#888", margin: "4px 0 0", fontSize: 14 }}>CA total: {totalCA.toLocaleString()} FCFA</p>
        </div>
        <button onClick={() => setShowModal(true)} style={{ background: "linear-gradient(135deg, #38bdf8, #0ea5e9)", border: "none", color: "#fff", padding: "12px 24px", borderRadius: 12, cursor: "pointer", fontWeight: 700, fontSize: 14, boxShadow: "0 4px 20px #38bdf866" }}>
          + Enregistrer paiement
        </button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 24 }}>
        <div style={{ background: "#1a3a2a", border: "1px solid #2a5a3a", borderRadius: 16, padding: 20 }}>
          <div style={{ fontSize: 22, fontWeight: 800, color: "#4ade80" }}>{totalCA.toLocaleString()} FCFA</div>
          <div style={{ color: "#888", fontSize: 13 }}>Chiffre d'affaires total</div>
        </div>
        <div style={{ background: "#1a2a4a", border: "1px solid #2a3a6a", borderRadius: 16, padding: 20 }}>
          <div style={{ fontSize: 22, fontWeight: 800, color: "#60a5fa" }}>{paiements.length}</div>
          <div style={{ color: "#888", fontSize: 13 }}>Paiements enregistrés</div>
        </div>
        <div style={{ background: "#2a1a3a", border: "1px solid #4a2a5a", borderRadius: 16, padding: 20 }}>
          <div style={{ fontSize: 22, fontWeight: 800, color: "#c084fc" }}>{Math.round(totalCA / (eleves.length || 1)).toLocaleString()} FCFA</div>
          <div style={{ color: "#888", fontSize: 13 }}>Revenu moyen / élève</div>
        </div>
      </div>

      <div style={{ background: "linear-gradient(135deg, #1a1a2e, #16213e)", border: "1px solid #2a2a4a", borderRadius: 16, overflow: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 600 }}>
          <thead>
            <tr style={{ background: "#0a0a18" }}>
              {["Référence","Élève","Type","Montant","Mode","Date","Statut"].map(h => (
                <th key={h} style={{ padding: "14px 16px", textAlign: "left", color: "#888", fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, borderBottom: "1px solid #2a2a4a" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paiements.map((p, i) => {
              const eleve = eleves.find(e => e.id === p.eleveId);
              return (
                <tr key={p.id} style={{ borderBottom: "1px solid #1a1a2e", background: i % 2 === 0 ? "transparent" : "#0a0a1022" }}>
                  <td style={{ padding: "12px 16px", color: "#60a5fa", fontSize: 12, fontFamily: "monospace" }}>{p.reference}</td>
                  <td style={{ padding: "12px 16px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <Avatar initials={eleve?.photo || "?"} color="#38bdf8" size={28} />
                      <span style={{ color: "#fff", fontSize: 13 }}>{eleve?.prenom} {eleve?.nom}</span>
                    </div>
                  </td>
                  <td style={{ padding: "12px 16px", color: "#ccc", fontSize: 13 }}>{p.type}</td>
                  <td style={{ padding: "12px 16px", color: "#4ade80", fontWeight: 700 }}>{p.montant.toLocaleString()} FCFA</td>
                  <td style={{ padding: "12px 16px", color: "#ccc", fontSize: 13 }}>{p.mode}</td>
                  <td style={{ padding: "12px 16px", color: "#888", fontSize: 13 }}>{p.date}</td>
                  <td style={{ padding: "12px 16px" }}><Badge label={p.statut} /></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {showModal && (
        <Modal title="Enregistrer un paiement" onClose={() => setShowModal(false)}>
          <InputField label="Élève" value={form.eleveId} onChange={v => setForm({...form, eleveId: Number(v)})}
            options={eleves.map(e => ({ value: e.id, label: `${e.prenom} ${e.nom}` }))} />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <InputField label="Montant (FCFA)" type="number" value={form.montant} onChange={v => setForm({...form, montant: v})} />
            <InputField label="Type" value={form.type} onChange={v => setForm({...form, type: v})}
              options={[{ value: "Inscription", label: "Inscription" }, { value: "Acompte", label: "Acompte" }, { value: "Paiement complet", label: "Paiement complet" }]} />
          </div>
          <InputField label="Mode de paiement" value={form.mode} onChange={v => setForm({...form, mode: v})}
            options={[{ value: "Mobile Money", label: "📱 Mobile Money" }, { value: "Espèces", label: "💵 Espèces" }, { value: "Virement", label: "🏦 Virement bancaire" }]} />
          <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
            <button onClick={() => setShowModal(false)} style={{ flex: 1, padding: "12px", background: "#2a2a4a", border: "none", color: "#fff", borderRadius: 12, cursor: "pointer", fontWeight: 600 }}>Annuler</button>
            <button onClick={save} style={{ flex: 1, padding: "12px", background: "linear-gradient(135deg, #38bdf8, #0ea5e9)", border: "none", color: "#fff", borderRadius: 12, cursor: "pointer", fontWeight: 700 }}>Enregistrer</button>
          </div>
        </Modal>
      )}
    </div>
  );
};

// ============================================================
// PAGE: NOTIFICATIONS
// ============================================================
const Notifications = ({ notifications, setNotifications, eleves }) => {
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ eleveId: eleves[0]?.id || 1, type: "SMS", sujet: "", message: "" });
  const [sending, setSending] = useState(false);

  const send = () => {
    setSending(true);
    setTimeout(() => {
      setNotifications(prev => [...prev, { ...form, id: Date.now(), date: new Date().toISOString().split("T")[0], statut: "Envoyé", eleveId: Number(form.eleveId) }]);
      setSending(false);
      setShowModal(false);
    }, 1500);
  };

  const templates = [
    { label: "📅 Rappel leçon", sujet: "Rappel leçon", message: "Rappel: Vous avez une leçon planifiée demain. Veuillez vous présenter à l'heure." },
    { label: "🏆 Convocation examen", sujet: "Convocation examen", message: "Vous êtes convoqué pour votre examen au CENAC Douala. Munissez-vous de votre convocation et d'une pièce d'identité." },
    { label: "💰 Rappel paiement", sujet: "Rappel de paiement", message: "Vous avez un solde impayé. Veuillez régulariser votre situation auprès de notre secrétariat." },
    { label: "✅ Félicitations", sujet: "Félicitations!", message: "Toutes nos félicitations pour votre succès à l'examen! Votre permis sera disponible sous 48h." },
  ];

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <div>
          <h2 style={{ fontSize: 26, fontWeight: 800, color: "#fff", margin: 0 }}>🔔 Notifications</h2>
          <p style={{ color: "#888", margin: "4px 0 0", fontSize: 14 }}>Envoi Email & SMS aux élèves</p>
        </div>
        <button onClick={() => setShowModal(true)} style={{ background: "linear-gradient(135deg, #c084fc, #a855f7)", border: "none", color: "#fff", padding: "12px 24px", borderRadius: 12, cursor: "pointer", fontWeight: 700, fontSize: 14, boxShadow: "0 4px 20px #c084fc66" }}>
          + Envoyer notification
        </button>
      </div>

      <div style={{ marginBottom: 24 }}>
        <div style={{ color: "#888", fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, marginBottom: 12 }}>Messages rapides</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 10 }}>
          {templates.map((t, i) => (
            <button key={i} onClick={() => { setForm(f => ({...f, sujet: t.sujet, message: t.message})); setShowModal(true); }}
              style={{ background: "#1a1a2e", border: "1px solid #2a2a4a", borderRadius: 12, padding: "12px 16px", cursor: "pointer", color: "#ccc", fontSize: 13, textAlign: "left", transition: "border-color 0.2s" }}
              onMouseEnter={e => e.currentTarget.style.borderColor = "#c084fc66"}
              onMouseLeave={e => e.currentTarget.style.borderColor = "#2a2a4a"}>
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div style={{ display: "grid", gap: 12 }}>
        {notifications.map(n => {
          const eleve = eleves.find(e => e.id === n.eleveId);
          return (
            <div key={n.id} style={{ background: "linear-gradient(135deg, #1a1a2e, #16213e)", border: "1px solid #2a2a4a", borderRadius: 14, padding: 20 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <Avatar initials={eleve?.photo || "?"} color="#c084fc" size={40} />
                  <div>
                    <div style={{ color: "#fff", fontWeight: 700, fontSize: 14 }}>{eleve?.prenom} {eleve?.nom}</div>
                    <div style={{ color: "#888", fontSize: 12 }}>{n.type === "SMS" ? "📱" : "📧"} {n.type} • {n.date}</div>
                  </div>
                </div>
                <Badge label={n.statut} />
              </div>
              <div style={{ color: "#c084fc", fontWeight: 600, fontSize: 14, marginBottom: 6 }}>{n.sujet}</div>
              <div style={{ color: "#aaa", fontSize: 13, lineHeight: 1.6 }}>{n.message}</div>
            </div>
          );
        })}
      </div>

      {showModal && (
        <Modal title="Envoyer une notification" onClose={() => setShowModal(false)}>
          <InputField label="Élève destinataire" value={form.eleveId} onChange={v => setForm({...form, eleveId: Number(v)})}
            options={eleves.map(e => ({ value: e.id, label: `${e.prenom} ${e.nom}` }))} />
          <InputField label="Canal" value={form.type} onChange={v => setForm({...form, type: v})}
            options={[{ value: "SMS", label: "📱 SMS" }, { value: "Email", label: "📧 Email" }]} />
          <InputField label="Sujet" value={form.sujet} onChange={v => setForm({...form, sujet: v})} placeholder="Ex: Rappel de leçon" />
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: "block", color: "#aaa", fontSize: 12, marginBottom: 6, fontWeight: 600, textTransform: "uppercase", letterSpacing: 1 }}>Message</label>
            <textarea value={form.message} onChange={e => setForm({...form, message: e.target.value})} rows={4} placeholder="Rédigez votre message..."
              style={{ width: "100%", padding: "10px 14px", background: "#1a1a2e", border: "1px solid #2a2a4a", borderRadius: 10, color: "#fff", fontSize: 14, outline: "none", resize: "vertical", boxSizing: "border-box" }} />
          </div>
          <div style={{ display: "flex", gap: 12 }}>
            <button onClick={() => setShowModal(false)} style={{ flex: 1, padding: "12px", background: "#2a2a4a", border: "none", color: "#fff", borderRadius: 12, cursor: "pointer", fontWeight: 600 }}>Annuler</button>
            <button onClick={send} disabled={sending} style={{ flex: 1, padding: "12px", background: "linear-gradient(135deg, #c084fc, #a855f7)", border: "none", color: "#fff", borderRadius: 12, cursor: "pointer", fontWeight: 700, opacity: sending ? 0.7 : 1 }}>
              {sending ? "⏳ Envoi en cours..." : "📤 Envoyer"}
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
};

// ============================================================
// APP PRINCIPALE
// ============================================================
export default function App() {
  const [page, setPage] = useState("dashboard");
  const [eleves, setEleves] = useState(initialEleves);
  const [moniteurs, setMoniteurs] = useState(initialMoniteurs);
  const [lecons, setLecons] = useState(initialLecons);
  const [examens, setExamens] = useState(initialExamens);
  const [paiements, setPaiements] = useState(initialPaiements);
  const [notifications, setNotifications] = useState(initialNotifications);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const nav = [
    { id: "dashboard", icon: "🏠", label: "Dashboard" },
    { id: "eleves", icon: "👨‍🎓", label: "Élèves" },
    { id: "moniteurs", icon: "👨‍🏫", label: "Moniteurs" },
    { id: "planning", icon: "📅", label: "Planning" },
    { id: "examens", icon: "🏆", label: "Examens" },
    { id: "facturation", icon: "💰", label: "Facturation" },
    { id: "notifications", icon: "🔔", label: "Notifications" },
  ];

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#080812", fontFamily: "'Inter', 'Segoe UI', sans-serif", color: "#fff" }}>
      {/* Sidebar */}
      <div style={{ width: sidebarOpen ? 230 : 66, background: "linear-gradient(180deg, #0d0d1f 0%, #080812 100%)", borderRight: "1px solid #1a1a2e", display: "flex", flexDirection: "column", transition: "width 0.3s ease", flexShrink: 0, position: "sticky", top: 0, height: "100vh", overflowY: "auto", overflowX: "hidden" }}>
        <div style={{ padding: sidebarOpen ? "24px 18px 20px" : "24px 10px 20px", borderBottom: "1px solid #1a1a2e", display: "flex", alignItems: "center", gap: 12, cursor: "pointer" }}
          onClick={() => setSidebarOpen(!sidebarOpen)}>
          <div style={{ width: 40, height: 40, borderRadius: 12, background: "linear-gradient(135deg, #FF6B35, #FF8C5A)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>🚗</div>
          {sidebarOpen && (
            <div>
              <div style={{ color: "#fff", fontWeight: 800, fontSize: 15, lineHeight: 1.1 }}>AutoÉcole</div>
              <div style={{ color: "#FF6B35", fontSize: 10, fontWeight: 700, letterSpacing: 2 }}>EXCELLENCE</div>
            </div>
          )}
        </div>

        <nav style={{ padding: "14px 8px", flex: 1 }}>
          {nav.map(item => (
            <button key={item.id} onClick={() => setPage(item.id)}
              style={{ width: "100%", display: "flex", alignItems: "center", gap: 12, padding: sidebarOpen ? "11px 12px" : "11px", borderRadius: 11, border: "none", cursor: "pointer", marginBottom: 3, background: page === item.id ? "#FF6B3518" : "transparent", color: page === item.id ? "#FF6B35" : "#777", fontWeight: page === item.id ? 700 : 400, fontSize: 14, transition: "all 0.15s", borderLeft: page === item.id ? "3px solid #FF6B35" : "3px solid transparent", justifyContent: sidebarOpen ? "flex-start" : "center" }}>
              <span style={{ fontSize: 17, flexShrink: 0 }}>{item.icon}</span>
              {sidebarOpen && <span>{item.label}</span>}
            </button>
          ))}
        </nav>

        <div style={{ padding: "14px 10px", borderTop: "1px solid #1a1a2e" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <Avatar initials="AD" color="#6C63FF" size={34} />
            {sidebarOpen && (
              <div>
                <div style={{ color: "#fff", fontSize: 12, fontWeight: 600 }}>Administrateur</div>
                <div style={{ color: "#888", fontSize: 10 }}>admin@excellence.cm</div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main content */}
      <div style={{ flex: 1, padding: "28px 32px", overflowY: "auto" }}>
        {page === "dashboard" && <Dashboard eleves={eleves} moniteurs={moniteurs} lecons={lecons} examens={examens} paiements={paiements} />}
        {page === "eleves" && <GestionEleves eleves={eleves} setEleves={setEleves} moniteurs={moniteurs} />}
        {page === "moniteurs" && <GestionMoniteurs moniteurs={moniteurs} setMoniteurs={setMoniteurs} />}
        {page === "planning" && <Planning lecons={lecons} setLecons={setLecons} eleves={eleves} moniteurs={moniteurs} />}
        {page === "examens" && <GestionExamens examens={examens} setExamens={setExamens} eleves={eleves} />}
        {page === "facturation" && <Facturation paiements={paiements} setPaiements={setPaiements} eleves={eleves} />}
        {page === "notifications" && <Notifications notifications={notifications} setNotifications={setNotifications} eleves={eleves} />}
      </div>
    </div>
  );
}
