// ═══════════════════════════════════════════════════════════════════
//  AutoGES Pro — Base de données locale (localStorage)
//  Simule un SGBD complet : CRUD, relations, export SQL/JSON/CSV
// ═══════════════════════════════════════════════════════════════════

const DB_KEY = "autoges_db_v1";

// ─── DONNÉES INITIALES ──────────────────────────────────────────────
const SEED = {
  meta: {
    version: "1.0.0",
    created: new Date().toISOString(),
    nom_structure: "Auto-École Excellence",
    adresse: "Douala, Akwa, Cameroun",
    telephone: "699 000 001",
    email: "contact@autoecole-excellence.cm",
    slogan: "Votre succès, notre priorité",
  },

  users: [
    { id: 1, nom: "Admin", prenom: "Super", email: "admin@autoecole.cm", password: "admin123", role: "admin", actif: true, created: "2024-01-01" },
    { id: 2, nom: "Secrétaire", prenom: "Marie", email: "secretaire@autoecole.cm", password: "secret123", role: "secretaire", actif: true, created: "2024-01-15" },
  ],

  eleves: [
    { id: 1, nom: "Mbarga", prenom: "Joël", email: "joel.mbarga@gmail.com", telephone: "699 001 002", dateNaissance: "1998-05-14", lieuNaissance: "Douala", cni: "12345678", dateInscription: "2025-01-10", moniteurId: 1, statut: "Actif", heuresEffectuees: 18, heuresTotal: 30, solde: 45000, permis: "B", photo: null, notes: "Élève sérieux, progrès rapides" },
    { id: 2, nom: "Eyenga", prenom: "Sandra", email: "sandra.eyenga@gmail.com", telephone: "677 234 567", dateNaissance: "2000-11-22", lieuNaissance: "Yaoundé", cni: "23456789", dateInscription: "2025-02-05", moniteurId: 2, statut: "Actif", heuresEffectuees: 10, heuresTotal: 30, solde: 120000, permis: "B", photo: null, notes: "" },
    { id: 3, nom: "Nkodo", prenom: "Paul", email: "paul.nkodo@gmail.com", telephone: "655 111 222", dateNaissance: "1995-03-08", lieuNaissance: "Douala", cni: "34567890", dateInscription: "2024-11-20", moniteurId: 1, statut: "Diplômé", heuresEffectuees: 30, heuresTotal: 30, solde: 0, permis: "B", photo: null, notes: "A obtenu son permis le 08/01/2025" },
    { id: 4, nom: "Biya", prenom: "Marie", email: "marie.biya@gmail.com", telephone: "690 345 678", dateNaissance: "2001-07-19", lieuNaissance: "Bafoussam", cni: "45678901", dateInscription: "2025-03-01", moniteurId: 3, statut: "Actif", heuresEffectuees: 5, heuresTotal: 30, solde: 150000, permis: "A", photo: null, notes: "" },
    { id: 5, nom: "Ateba", prenom: "Christophe", email: "christophe.ateba@gmail.com", telephone: "676 456 789", dateNaissance: "1997-09-30", lieuNaissance: "Edéa", cni: "56789012", dateInscription: "2025-01-28", moniteurId: 2, statut: "Suspendu", heuresEffectuees: 12, heuresTotal: 30, solde: 85000, permis: "B", photo: null, notes: "Suspendu pour impayés" },
    { id: 6, nom: "Fouda", prenom: "Aline", email: "aline.fouda@gmail.com", telephone: "691 789 012", dateNaissance: "1999-12-05", lieuNaissance: "Douala", cni: "67890123", dateInscription: "2025-03-15", moniteurId: 1, statut: "Actif", heuresEffectuees: 22, heuresTotal: 30, solde: 30000, permis: "B", photo: null, notes: "" },
    { id: 7, nom: "Tamba", prenom: "Léonard", email: "leo.tamba@gmail.com", telephone: "674 321 654", dateNaissance: "2002-04-17", lieuNaissance: "Douala", cni: "78901234", dateInscription: "2025-02-20", moniteurId: 3, statut: "Actif", heuresEffectuees: 8, heuresTotal: 30, solde: 95000, permis: "A", photo: null, notes: "" },
    { id: 8, nom: "Nguema", prenom: "Céline", email: "celine@gmail.com", telephone: "698 765 432", dateNaissance: "2003-08-11", lieuNaissance: "Limbé", cni: "89012345", dateInscription: "2025-03-20", moniteurId: 4, statut: "Actif", heuresEffectuees: 3, heuresTotal: 30, solde: 175000, permis: "B", photo: null, notes: "" },
  ],

  moniteurs: [
    { id: 1, nom: "Essomba", prenom: "Roger", email: "roger.essomba@autoecole.cm", telephone: "697 001 001", specialite: "Permis B", statut: "Actif", noteMoyenne: 4.8, dateEmbauche: "2020-03-15", salaire: 180000, experience: "5 ans", cin: "MON001", adresse: "Douala, Akwa", notes: "Moniteur principal" },
    { id: 2, nom: "Fouda", prenom: "Carine", email: "carine.fouda@autoecole.cm", telephone: "675 002 002", specialite: "Permis B/A", statut: "Actif", noteMoyenne: 4.6, dateEmbauche: "2021-07-01", salaire: 165000, experience: "3 ans", cin: "MON002", adresse: "Douala, Bonanjo", notes: "" },
    { id: 3, nom: "Mvondo", prenom: "Jules", email: "jules.mvondo@autoecole.cm", telephone: "654 003 003", specialite: "Permis A", statut: "Congé", noteMoyenne: 4.3, dateEmbauche: "2022-01-10", salaire: 155000, experience: "2 ans", cin: "MON003", adresse: "Douala, Makepe", notes: "En congé du 01/03 au 01/04" },
    { id: 4, nom: "Ngono", prenom: "Béatrice", email: "bea.ngono@autoecole.cm", telephone: "698 004 004", specialite: "Permis B", statut: "Actif", noteMoyenne: 4.7, dateEmbauche: "2021-09-01", salaire: 170000, experience: "4 ans", cin: "MON004", adresse: "Douala, Bali", notes: "" },
  ],

  lecons: [
    { id: 1, eleveId: 1, moniteurId: 1, date: "2025-03-22", heure: "08:00", duree: 2, type: "Conduite", statut: "Confirmée", vehicule: "Toyota Corolla — LT 234 A", lieu: "Circuit Akwa", notes: "" },
    { id: 2, eleveId: 2, moniteurId: 2, date: "2025-03-22", heure: "10:00", duree: 1, type: "Code", statut: "Confirmée", vehicule: "Salle A", lieu: "Auto-École", notes: "" },
    { id: 3, eleveId: 4, moniteurId: 3, date: "2025-03-22", heure: "14:00", duree: 2, type: "Conduite", statut: "En attente", vehicule: "Honda CB500 — LT 567 B", lieu: "Boulevard de la Liberté", notes: "" },
    { id: 4, eleveId: 6, moniteurId: 1, date: "2025-03-23", heure: "09:00", duree: 2, type: "Conduite", statut: "Confirmée", vehicule: "Renault Logan — LT 890 C", lieu: "Circuit Bonanjo", notes: "" },
    { id: 5, eleveId: 7, moniteurId: 3, date: "2025-03-23", heure: "11:00", duree: 1, type: "Code", statut: "Annulée", vehicule: "Salle B", lieu: "Auto-École", notes: "Élève absent" },
    { id: 6, eleveId: 8, moniteurId: 4, date: "2025-03-24", heure: "08:00", duree: 2, type: "Conduite", statut: "En attente", vehicule: "Toyota Corolla — LT 234 A", lieu: "Circuit Akwa", notes: "" },
    { id: 7, eleveId: 5, moniteurId: 2, date: "2025-03-24", heure: "15:00", duree: 1, type: "Code", statut: "En attente", vehicule: "Salle A", lieu: "Auto-École", notes: "" },
  ],

  examens: [
    { id: 1, eleveId: 1, type: "Code", date: "2025-02-14", score: 38, seuil: 35, centre: "CENAC Douala", statut: "Réussi", observations: "Excellent résultat" },
    { id: 2, eleveId: 1, type: "Conduite", date: "2025-03-05", score: 82, seuil: 70, centre: "CENAC Douala", statut: "Réussi", observations: "" },
    { id: 3, eleveId: 3, type: "Code", date: "2024-12-10", score: 40, seuil: 35, centre: "CENAC Douala", statut: "Réussi", observations: "" },
    { id: 4, eleveId: 3, type: "Conduite", date: "2025-01-08", score: 78, seuil: 70, centre: "CENAC Douala", statut: "Réussi", observations: "" },
    { id: 5, eleveId: 5, type: "Code", date: "2025-02-20", score: 30, seuil: 35, centre: "CENAC Douala", statut: "Échoué", observations: "Doit réviser le code de la route" },
    { id: 6, eleveId: 6, type: "Code", date: "2025-03-01", score: 37, seuil: 35, centre: "CENAC Douala", statut: "Réussi", observations: "" },
    { id: 7, eleveId: 2, type: "Code", date: "2025-03-18", score: 33, seuil: 35, centre: "CENAC Douala", statut: "Échoué", observations: "Reprogrammer dans 2 semaines" },
  ],

  paiements: [
    { id: 1, eleveId: 1, montant: 55000, date: "2025-01-10", mode: "Mobile Money", statut: "Payé", reference: "PAY-4821", description: "Inscription + 1ère tranche", recu: true },
    { id: 2, eleveId: 2, montant: 80000, date: "2025-02-06", mode: "Espèces", statut: "Payé", reference: "PAY-4822", description: "Frais d'inscription", recu: true },
    { id: 3, eleveId: 4, montant: 100000, date: "2025-03-02", mode: "Virement", statut: "En attente", reference: "PAY-4823", description: "Inscription permis A", recu: false },
    { id: 4, eleveId: 6, montant: 70000, date: "2025-03-16", mode: "Mobile Money", statut: "Payé", reference: "PAY-4824", description: "2ème tranche", recu: true },
    { id: 5, eleveId: 7, montant: 55000, date: "2025-02-21", mode: "Espèces", statut: "Payé", reference: "PAY-4825", description: "Inscription permis A", recu: true },
    { id: 6, eleveId: 8, montant: 25000, date: "2025-03-21", mode: "Mobile Money", statut: "Payé", reference: "PAY-4826", description: "Acompte inscription", recu: true },
    { id: 7, eleveId: 3, montant: 180000, date: "2024-11-20", mode: "Espèces", statut: "Payé", reference: "PAY-4818", description: "Paiement complet", recu: true },
  ],

  vehicules: [
    { id: 1, marque: "Toyota", modele: "Corolla", immatriculation: "LT 234 A", annee: 2020, kilometrage: 45230, statut: "Disponible", type: "Voiture", carburant: "Essence", couleur: "Blanc", assurance: "2025-12-31", visite: "2025-06-30", notes: "" },
    { id: 2, marque: "Renault", modele: "Logan", immatriculation: "LT 890 C", annee: 2019, kilometrage: 62100, statut: "En service", type: "Voiture", carburant: "Essence", couleur: "Gris", assurance: "2025-08-15", visite: "2025-04-30", notes: "" },
    { id: 3, marque: "Honda", modele: "CB500", immatriculation: "LT 567 B", annee: 2021, kilometrage: 18500, statut: "Disponible", type: "Moto", carburant: "Essence", couleur: "Rouge", assurance: "2025-11-20", visite: "2025-09-15", notes: "" },
    { id: 4, marque: "Yamaha", modele: "MT-07", immatriculation: "LT 321 D", annee: 2022, kilometrage: 9800, statut: "Maintenance", type: "Moto", carburant: "Essence", couleur: "Bleu", assurance: "2025-10-05", visite: "2026-01-20", notes: "Révision moteur en cours" },
  ],

  notifications: [
    { id: 1, to: "Joël Mbarga", eleveId: 1, canal: "SMS", sujet: "Rappel leçon", message: "Votre leçon de conduite est prévue demain à 08h00.", date: "2025-03-21", statut: "Envoyé" },
    { id: 2, to: "Sandra Eyenga", eleveId: 2, canal: "Email", sujet: "Paiement en attente", message: "Votre solde impayé est de 120 000 FCFA. Merci de régulariser.", date: "2025-03-20", statut: "Envoyé" },
    { id: 3, to: "Tous les élèves", eleveId: null, canal: "SMS", sujet: "Fermeture exceptionnelle", message: "L'auto-école sera fermée le samedi 22 mars.", date: "2025-03-19", statut: "Envoyé" },
  ],

  depenses: [
    { id: 1, categorie: "Carburant", montant: 35000, date: "2025-03-20", description: "Carburant — Toyota Corolla", validePar: "Admin" },
    { id: 2, categorie: "Entretien", montant: 85000, date: "2025-03-15", description: "Révision Yamaha MT-07", validePar: "Admin" },
    { id: 3, categorie: "Fournitures", montant: 12000, date: "2025-03-10", description: "Matériel pédagogique code", validePar: "Admin" },
    { id: 4, categorie: "Salaires", montant: 670000, date: "2025-03-01", description: "Salaires moniteurs — Mars 2025", validePar: "Admin" },
  ],
};

// ─── MOTEUR DB ──────────────────────────────────────────────────────
export function initDB() {
  const existing = localStorage.getItem(DB_KEY);
  if (!existing) {
    localStorage.setItem(DB_KEY, JSON.stringify(SEED));
  }
  return getDB();
}

export function getDB() {
  const raw = localStorage.getItem(DB_KEY);
  return raw ? JSON.parse(raw) : { ...SEED };
}

export function saveDB(db) {
  localStorage.setItem(DB_KEY, JSON.stringify(db));
}

export function resetDB() {
  localStorage.setItem(DB_KEY, JSON.stringify(SEED));
  return SEED;
}

// ─── CRUD GÉNÉRIQUE ─────────────────────────────────────────────────
export function getAll(table) {
  return getDB()[table] || [];
}

export function getById(table, id) {
  return getAll(table).find(r => r.id === id) || null;
}

export function insert(table, data) {
  const db = getDB();
  const id = Date.now();
  const record = { ...data, id };
  db[table] = [...(db[table] || []), record];
  saveDB(db);
  return record;
}

export function update(table, id, data) {
  const db = getDB();
  db[table] = db[table].map(r => r.id === id ? { ...r, ...data } : r);
  saveDB(db);
  return db[table].find(r => r.id === id);
}

export function remove(table, id) {
  const db = getDB();
  db[table] = db[table].filter(r => r.id !== id);
  saveDB(db);
}

// ─── FONCTIONS MÉTIER ───────────────────────────────────────────────
export function getDashboardStats() {
  const db = getDB();
  const paiements = db.paiements || [];
  const examens   = db.examens   || [];
  const eleves    = db.eleves    || [];
  const lecons    = db.lecons    || [];

  const ca   = paiements.filter(p => p.statut === "Payé").reduce((s, p) => s + p.montant, 0);
  const att  = paiements.filter(p => p.statut === "En attente").reduce((s, p) => s + p.montant, 0);
  const tr   = examens.length ? Math.round(examens.filter(e => e.statut === "Réussi").length / examens.length * 100) : 0;
  const actifs = eleves.filter(e => e.statut === "Actif").length;

  const today = new Date().toISOString().slice(0, 10);
  const leconsDuJour = lecons.filter(l => l.date === today).length;

  return { ca, att, tr, actifs, total: eleves.length, leconsDuJour, lecons: lecons.length };
}

export function genererReference() {
  const db  = getDB();
  const ids = (db.paiements || []).map(p => parseInt(p.reference?.replace("PAY-", "") || 0));
  const max = ids.length ? Math.max(...ids) : 4800;
  return `PAY-${max + 1}`;
}

export function getSoldeEleve(eleveId) {
  const db = getDB();
  return (db.eleves || []).find(e => e.id === eleveId)?.solde || 0;
}

export function enregistrerPaiement(data) {
  const db  = getDB();
  const ref = genererReference();
  const paiement = { ...data, reference: ref, recu: true };
  const record   = insert("paiements", paiement);

  // Mise à jour solde élève
  const eleve = db.eleves.find(e => e.id === data.eleveId);
  if (eleve) {
    const newSolde = Math.max(0, eleve.solde - data.montant);
    update("eleves", data.eleveId, { solde: newSolde });
  }
  return record;
}

export function getMeta() {
  return getDB().meta || SEED.meta;
}

export function updateMeta(data) {
  const db = getDB();
  db.meta = { ...db.meta, ...data };
  saveDB(db);
  return db.meta;
}

// ─── EXPORT SQL ─────────────────────────────────────────────────────
export function exportSQL() {
  const db   = getDB();
  const meta = db.meta;
  let sql = `-- =====================================================\n`;
  sql += `-- AutoGES Pro — Export SQL\n`;
  sql += `-- Structure : ${meta.nom_structure}\n`;
  sql += `-- Export le : ${new Date().toLocaleString("fr-FR")}\n`;
  sql += `-- =====================================================\n\n`;

  // CREATE TABLE eleves
  sql += `CREATE TABLE IF NOT EXISTS eleves (\n`;
  sql += `  id INT PRIMARY KEY AUTO_INCREMENT,\n`;
  sql += `  nom VARCHAR(100) NOT NULL,\n`;
  sql += `  prenom VARCHAR(100) NOT NULL,\n`;
  sql += `  email VARCHAR(200),\n`;
  sql += `  telephone VARCHAR(20),\n`;
  sql += `  dateNaissance DATE,\n`;
  sql += `  lieuNaissance VARCHAR(100),\n`;
  sql += `  cni VARCHAR(20),\n`;
  sql += `  dateInscription DATE,\n`;
  sql += `  moniteurId INT,\n`;
  sql += `  statut ENUM('Actif','Diplômé','Suspendu') DEFAULT 'Actif',\n`;
  sql += `  heuresEffectuees INT DEFAULT 0,\n`;
  sql += `  heuresTotal INT DEFAULT 30,\n`;
  sql += `  solde DECIMAL(12,0) DEFAULT 0,\n`;
  sql += `  permis ENUM('A','B','C') DEFAULT 'B',\n`;
  sql += `  notes TEXT,\n`;
  sql += `  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP\n`;
  sql += `);\n\n`;

  // INSERT eleves
  (db.eleves || []).forEach(e => {
    sql += `INSERT INTO eleves (id,nom,prenom,email,telephone,dateNaissance,lieuNaissance,cni,dateInscription,moniteurId,statut,heuresEffectuees,heuresTotal,solde,permis,notes) VALUES `;
    sql += `(${e.id},'${e.nom}','${e.prenom}','${e.email}','${e.telephone}','${e.dateNaissance}','${e.lieuNaissance}','${e.cni}','${e.dateInscription}',${e.moniteurId},'${e.statut}',${e.heuresEffectuees},${e.heuresTotal},${e.solde},'${e.permis}','${e.notes}');\n`;
  });

  sql += `\nCREATE TABLE IF NOT EXISTS moniteurs (\n`;
  sql += `  id INT PRIMARY KEY AUTO_INCREMENT,\n`;
  sql += `  nom VARCHAR(100) NOT NULL,\n`;
  sql += `  prenom VARCHAR(100) NOT NULL,\n`;
  sql += `  email VARCHAR(200),\n`;
  sql += `  telephone VARCHAR(20),\n`;
  sql += `  specialite VARCHAR(50),\n`;
  sql += `  statut ENUM('Actif','Congé','Inactif') DEFAULT 'Actif',\n`;
  sql += `  noteMoyenne DECIMAL(3,1) DEFAULT 4.0,\n`;
  sql += `  dateEmbauche DATE,\n`;
  sql += `  salaire DECIMAL(12,0),\n`;
  sql += `  experience VARCHAR(20),\n`;
  sql += `  adresse TEXT\n`;
  sql += `);\n\n`;

  (db.moniteurs || []).forEach(m => {
    sql += `INSERT INTO moniteurs (id,nom,prenom,email,telephone,specialite,statut,noteMoyenne,dateEmbauche,salaire,experience,adresse) VALUES `;
    sql += `(${m.id},'${m.nom}','${m.prenom}','${m.email}','${m.telephone}','${m.specialite}','${m.statut}',${m.noteMoyenne},'${m.dateEmbauche}',${m.salaire},'${m.experience}','${m.adresse}');\n`;
  });

  sql += `\nCREATE TABLE IF NOT EXISTS lecons (\n`;
  sql += `  id INT PRIMARY KEY AUTO_INCREMENT,\n`;
  sql += `  eleveId INT, moniteurId INT,\n`;
  sql += `  date DATE, heure TIME, duree INT DEFAULT 1,\n`;
  sql += `  type ENUM('Conduite','Code'), statut ENUM('Confirmée','En attente','Annulée','Terminée'),\n`;
  sql += `  vehicule VARCHAR(100), lieu VARCHAR(100), notes TEXT\n`;
  sql += `);\n\n`;

  (db.lecons || []).forEach(l => {
    sql += `INSERT INTO lecons (id,eleveId,moniteurId,date,heure,duree,type,statut,vehicule,lieu,notes) VALUES `;
    sql += `(${l.id},${l.eleveId},${l.moniteurId},'${l.date}','${l.heure}',${l.duree},'${l.type}','${l.statut}','${l.vehicule}','${l.lieu}','${l.notes}');\n`;
  });

  sql += `\nCREATE TABLE IF NOT EXISTS paiements (\n`;
  sql += `  id INT PRIMARY KEY AUTO_INCREMENT,\n`;
  sql += `  eleveId INT, montant DECIMAL(12,0),\n`;
  sql += `  date DATE, mode VARCHAR(50),\n`;
  sql += `  statut ENUM('Payé','En attente','Annulé'),\n`;
  sql += `  reference VARCHAR(20), description TEXT\n`;
  sql += `);\n\n`;

  (db.paiements || []).forEach(p => {
    sql += `INSERT INTO paiements (id,eleveId,montant,date,mode,statut,reference,description) VALUES `;
    sql += `(${p.id},${p.eleveId},${p.montant},'${p.date}','${p.mode}','${p.statut}','${p.reference}','${p.description}');\n`;
  });

  sql += `\nCREATE TABLE IF NOT EXISTS examens (\n`;
  sql += `  id INT PRIMARY KEY AUTO_INCREMENT,\n`;
  sql += `  eleveId INT, type ENUM('Code','Conduite'),\n`;
  sql += `  date DATE, score INT, seuil INT,\n`;
  sql += `  centre VARCHAR(100), statut ENUM('Réussi','Échoué'), observations TEXT\n`;
  sql += `);\n\n`;

  (db.examens || []).forEach(x => {
    sql += `INSERT INTO examens (id,eleveId,type,date,score,seuil,centre,statut,observations) VALUES `;
    sql += `(${x.id},${x.eleveId},'${x.type}','${x.date}',${x.score},${x.seuil},'${x.centre}','${x.statut}','${x.observations}');\n`;
  });

  sql += `\nCREATE TABLE IF NOT EXISTS vehicules (\n`;
  sql += `  id INT PRIMARY KEY AUTO_INCREMENT,\n`;
  sql += `  marque VARCHAR(50), modele VARCHAR(50),\n`;
  sql += `  immatriculation VARCHAR(20), annee INT,\n`;
  sql += `  kilometrage INT, statut ENUM('Disponible','En service','Maintenance','Hors service'),\n`;
  sql += `  type ENUM('Voiture','Moto'), carburant VARCHAR(20),\n`;
  sql += `  couleur VARCHAR(30), assurance DATE, visite DATE, notes TEXT\n`;
  sql += `);\n\n`;

  (db.vehicules || []).forEach(v => {
    sql += `INSERT INTO vehicules (id,marque,modele,immatriculation,annee,kilometrage,statut,type,carburant,couleur,assurance,visite,notes) VALUES `;
    sql += `(${v.id},'${v.marque}','${v.modele}','${v.immatriculation}',${v.annee},${v.kilometrage},'${v.statut}','${v.type}','${v.carburant}','${v.couleur}','${v.assurance}','${v.visite}','${v.notes}');\n`;
  });

  return sql;
}

// ─── EXPORT JSON ────────────────────────────────────────────────────
export function exportJSON() {
  return JSON.stringify(getDB(), null, 2);
}

// ─── EXPORT CSV ─────────────────────────────────────────────────────
export function exportCSV(table) {
  const data = getAll(table);
  if (!data.length) return "";
  const keys = Object.keys(data[0]);
  const rows = data.map(r => keys.map(k => `"${r[k] ?? ""}"`).join(","));
  return [keys.join(","), ...rows].join("\n");
}

// ─── IMPORT JSON ────────────────────────────────────────────────────
export function importJSON(jsonStr) {
  try {
    const data = JSON.parse(jsonStr);
    saveDB(data);
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e.message };
  }
}

// ─── TÉLÉCHARGER FICHIER ────────────────────────────────────────────
export function downloadFile(content, filename, type = "text/plain") {
  const blob = new Blob([content], { type });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement("a");
  a.href = url; a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
