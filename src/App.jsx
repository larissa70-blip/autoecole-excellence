import { useState, useEffect, useCallback } from "react";

// ─────────────────────────────────────────────
//  STYLES CSS — injectés dans le <head>
//  J'ai préféré mettre tous les styles ici pour
//  éviter d'avoir un fichier CSS séparé à gérer
// ─────────────────────────────────────────────
const GlobalStyle = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=Outfit:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap');

    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    html { font-size: 14px; }
    body {
      font-family: 'Outfit', sans-serif;
      background: #09090B;
      color: #FAFAFA;
      -webkit-font-smoothing: antialiased;
      min-height: 100vh;
    }
    ::-webkit-scrollbar { width: 4px; }
    ::-webkit-scrollbar-track { background: transparent; }
    ::-webkit-scrollbar-thumb { background: #27272A; border-radius: 4px; }

    /* ── Variables couleurs ── */
    :root {
      --bg:        #09090B;
      --bg2:       #111115;
      --bg3:       #18181C;
      --bg4:       #1E1E24;
      --bg5:       #27272A;
      --border:    rgba(255,255,255,0.07);
      --border2:   rgba(255,255,255,0.12);
      --txt:       #FAFAFA;
      --txt2:      #A1A1AA;
      --txt3:      #52525B;
      --gold:      #E8A545;
      --gold2:     #F0B855;
      --gold-bg:   rgba(232,165,69,0.10);
      --green:     #10B981;
      --green-bg:  rgba(16,185,129,0.10);
      --blue:      #38BDF8;
      --blue-bg:   rgba(56,189,248,0.10);
      --amber:     #FBBF24;
      --amber-bg:  rgba(251,191,36,0.10);
      --red:       #F87171;
      --red-bg:    rgba(248,113,113,0.10);
      --purple:    #A78BFA;
      --purple-bg: rgba(167,139,250,0.10);
      --sidebar-w: 240px;
    }

    /* ── Sidebar ── */
    .sidebar {
      position: fixed; top: 0; left: 0;
      width: var(--sidebar-w); height: 100vh;
      background: var(--bg2);
      border-right: 1px solid var(--border);
      display: flex; flex-direction: column;
      z-index: 100;
      transition: transform 0.3s ease;
    }
    .sb-brand {
      padding: 18px 16px 14px;
      border-bottom: 1px solid var(--border);
      display: flex; align-items: center; gap: 10px;
    }
    .sb-logo {
      width: 34px; height: 34px;
      background: var(--gold); border-radius: 9px;
      display: flex; align-items: center; justify-content: center;
      font-size: 17px; flex-shrink: 0;
      box-shadow: 0 0 14px rgba(232,165,69,0.35);
    }
    .sb-brand-name {
      font-family: 'Syne', sans-serif;
      font-size: 15px; font-weight: 800;
      letter-spacing: -0.03em;
    }
    .sb-brand-tag {
      font-family: 'JetBrains Mono', monospace;
      font-size: 9.5px; color: var(--txt3);
    }
    .sb-nav { flex: 1; padding: 12px 10px; overflow-y: auto; }
    .sb-section { margin-bottom: 20px; }
    .sb-section-label {
      font-family: 'Syne', sans-serif;
      font-size: 10px; font-weight: 700; color: var(--txt3);
      text-transform: uppercase; letter-spacing: 0.1em;
      padding: 0 8px 6px; display: block;
    }
    .sb-link {
      display: flex; align-items: center; gap: 9px;
      padding: 8px 10px; border-radius: 7px;
      cursor: pointer; color: var(--txt3);
      font-size: 13.5px; font-weight: 500;
      transition: all 0.12s; margin-bottom: 2px;
      user-select: none;
    }
    .sb-link:hover { background: var(--bg4); color: var(--txt2); }
    .sb-link.active { background: var(--gold-bg); color: var(--gold2); font-weight: 600; }
    .sb-link .icon { font-size: 14px; width: 18px; text-align: center; flex-shrink: 0; }
    .sb-badge {
      margin-left: auto;
      background: var(--gold); color: #000;
      font-family: 'JetBrains Mono', monospace;
      font-size: 9px; font-weight: 700;
      padding: 1.5px 6px; border-radius: 99px;
    }
    .sb-footer {
      padding: 10px; border-top: 1px solid var(--border);
    }
    .sb-user {
      display: flex; align-items: center; gap: 9px;
      padding: 8px 9px; border-radius: 7px;
      cursor: pointer; transition: background 0.12s;
    }
    .sb-user:hover { background: var(--bg4); }
    .sb-av {
      width: 30px; height: 30px; border-radius: 7px;
      background: linear-gradient(135deg, var(--gold), #F59E0B);
      display: flex; align-items: center; justify-content: center;
      font-family: 'JetBrains Mono', monospace;
      font-size: 11px; font-weight: 700; color: #000;
    }
    .sb-user-name { font-size: 13px; font-weight: 600; }
    .sb-user-role { font-size: 11px; color: var(--txt3); }

    /* ── Main / Layout ── */
    .main-wrap { margin-left: var(--sidebar-w); min-height: 100vh; display: flex; flex-direction: column; }

    /* ── Topbar ── */
    .topbar {
      position: sticky; top: 0; z-index: 50;
      height: 52px; background: rgba(9,9,11,0.90);
      backdrop-filter: blur(14px);
      border-bottom: 1px solid var(--border);
      display: flex; align-items: center;
      padding: 0 24px; gap: 14px;
    }
    .topbar-crumb {
      display: flex; align-items: center; gap: 6px;
      font-size: 13px;
    }
    .topbar-crumb .root { color: var(--txt3); }
    .topbar-crumb .sep  { color: var(--txt3); }
    .topbar-crumb .cur  {
      color: var(--txt); font-weight: 700;
      font-family: 'Syne', sans-serif; font-size: 14px;
    }
    .topbar-search {
      flex: 1; max-width: 280px; margin-left: auto;
      display: flex; align-items: center; gap: 8px;
      background: var(--bg4); border: 1px solid var(--border);
      border-radius: 7px; padding: 7px 12px;
    }
    .topbar-search input {
      background: none; border: none; outline: none;
      color: var(--txt); font-size: 13px;
      font-family: 'Outfit', sans-serif; width: 100%;
    }
    .topbar-search input::placeholder { color: var(--txt3); }
    .topbar-actions { display: flex; align-items: center; gap: 8px; }
    .top-btn {
      width: 32px; height: 32px;
      background: var(--bg3); border: 1px solid var(--border2);
      border-radius: 7px; display: flex;
      align-items: center; justify-content: center;
      cursor: pointer; color: var(--txt3); font-size: 14px;
      transition: all 0.12s; position: relative;
    }
    .top-btn:hover { background: var(--bg4); color: var(--txt); }
    .notif-dot {
      position: absolute; top: 6px; right: 6px;
      width: 5px; height: 5px;
      background: var(--gold); border-radius: 50%;
      border: 1.5px solid var(--bg2);
    }
    .user-pill {
      display: flex; align-items: center; gap: 7px;
      padding: 4px 11px 4px 4px;
      background: var(--bg3); border: 1px solid var(--border2);
      border-radius: 99px; cursor: pointer;
      font-size: 13px; font-weight: 500; color: var(--txt2);
      transition: all 0.12s;
    }
    .user-pill:hover { background: var(--bg4); color: var(--txt); }
    .pill-av {
      width: 24px; height: 24px; border-radius: 50%;
      background: linear-gradient(135deg, var(--gold), #F59E0B);
      display: flex; align-items: center; justify-content: center;
      font-family: 'JetBrains Mono', monospace;
      font-size: 10px; font-weight: 700; color: #000;
    }

    /* ── Contenu de page ── */
    .page {
      padding: 28px 32px;
      flex: 1;
    }
    .page-header {
      display: flex; align-items: flex-start;
      justify-content: space-between;
      margin-bottom: 26px; flex-wrap: wrap; gap: 12px;
    }
    .page-title {
      font-family: 'Syne', sans-serif;
      font-size: 22px; font-weight: 800;
      letter-spacing: -0.04em;
    }
    .page-subtitle { font-size: 13px; color: var(--txt3); margin-top: 4px; }
    .page-actions { display: flex; gap: 8px; flex-wrap: wrap; }

    /* ── Boutons ── */
    .btn {
      display: inline-flex; align-items: center; gap: 6px;
      padding: 8px 14px; border-radius: 7px;
      font-size: 13px; font-weight: 600;
      font-family: 'Outfit', sans-serif;
      cursor: pointer; border: none;
      transition: all 0.12s; white-space: nowrap;
    }
    .btn-gold {
      background: var(--gold); color: #000;
      box-shadow: 0 1px 0 rgba(0,0,0,0.3);
    }
    .btn-gold:hover { background: var(--gold2); transform: translateY(-1px); }
    .btn-outline {
      background: var(--bg3); color: var(--txt2);
      border: 1px solid var(--border2);
    }
    .btn-outline:hover { background: var(--bg4); color: var(--txt); }
    .btn-ghost { background: transparent; color: var(--txt3); border: 1px solid var(--border); }
    .btn-ghost:hover { background: var(--bg4); color: var(--txt2); }
    .btn-danger { background: var(--red-bg); color: var(--red); border: 1px solid rgba(248,113,113,0.2); }
    .btn-danger:hover { background: rgba(248,113,113,0.16); }
    .btn-success { background: var(--green-bg); color: var(--green); border: 1px solid rgba(16,185,129,0.2); }
    .btn-sm { padding: 5px 10px; font-size: 12px; border-radius: 6px; }
    .btn-xs { padding: 3px 8px; font-size: 11.5px; border-radius: 5px; }

    /* ── Alertes ── */
    .alert {
      display: flex; align-items: center; gap: 10px;
      padding: 10px 14px; border-radius: 8px;
      margin-bottom: 22px; font-size: 13px; font-weight: 500;
    }
    .alert-warn {
      background: var(--amber-bg);
      border: 1px solid rgba(251,191,36,0.18);
      color: var(--amber);
    }

    /* ── Stats KPI ── */
    .kpi-grid {
      display: grid; grid-template-columns: repeat(4, 1fr);
      gap: 14px; margin-bottom: 24px;
    }
    .kpi-card {
      background: var(--bg3); border: 1px solid var(--border);
      border-radius: 12px; padding: 20px;
      position: relative; overflow: hidden;
      transition: border-color 0.2s, transform 0.2s;
    }
    .kpi-card:hover { border-color: var(--border2); transform: translateY(-1px); }
    .kpi-accent {
      position: absolute; top: 0; left: 0; right: 0; height: 2px;
    }
    .kpi-label {
      font-family: 'Syne', sans-serif;
      font-size: 10.5px; font-weight: 700; color: var(--txt3);
      text-transform: uppercase; letter-spacing: 0.08em;
      margin-bottom: 10px;
    }
    .kpi-value {
      font-family: 'JetBrains Mono', monospace;
      font-size: 26px; font-weight: 600;
      letter-spacing: -0.04em; color: var(--txt);
      line-height: 1;
    }
    .kpi-delta {
      display: flex; align-items: center; gap: 4px;
      font-size: 12px; margin-top: 9px; color: var(--txt3);
    }
    .kpi-delta.up { color: var(--green); }
    .kpi-delta.down { color: var(--red); }

    /* ── Grilles ── */
    .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-bottom: 18px; }
    .grid-3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; margin-bottom: 18px; }
    .grid-auto { display: grid; grid-template-columns: repeat(auto-fill, minmax(278px, 1fr)); gap: 14px; }

    /* ── Cards ── */
    .card { background: var(--bg3); border: 1px solid var(--border); border-radius: 12px; overflow: hidden; }
    .card-head {
      padding: 14px 18px; border-bottom: 1px solid var(--border);
      display: flex; align-items: center; justify-content: space-between;
    }
    .card-head h3 { font-family: 'Syne', sans-serif; font-size: 14px; font-weight: 700; }
    .card-body { padding: 18px; }

    /* ── Tableau ── */
    .tbl-wrap { overflow-x: auto; }
    .tbl { width: 100%; border-collapse: collapse; font-size: 13px; }
    .tbl th {
      padding: 10px 16px; text-align: left;
      font-family: 'Syne', sans-serif;
      font-size: 10.5px; font-weight: 700; color: var(--txt3);
      text-transform: uppercase; letter-spacing: 0.08em;
      border-bottom: 1px solid var(--border);
      background: var(--bg3); white-space: nowrap;
    }
    .tbl td {
      padding: 12px 16px; color: var(--txt2);
      border-bottom: 1px solid rgba(255,255,255,0.03);
      vertical-align: middle;
      transition: background 0.1s;
    }
    .tbl tr:last-child td { border-bottom: none; }
    .tbl tbody tr:hover td { background: var(--bg4); color: var(--txt); }

    /* ── Badges ── */
    .badge {
      display: inline-flex; align-items: center; gap: 5px;
      padding: 2px 8px; border-radius: 99px;
      font-size: 11.5px; font-weight: 600;
    }
    .badge::before { content: ''; width: 5px; height: 5px; border-radius: 50%; background: currentColor; flex-shrink: 0; }
    .badge-green  { background: var(--green-bg);  color: var(--green); }
    .badge-amber  { background: var(--amber-bg);  color: var(--amber); }
    .badge-red    { background: var(--red-bg);     color: var(--red); }
    .badge-blue   { background: var(--blue-bg);    color: var(--blue); }
    .badge-gold   { background: var(--gold-bg);    color: var(--gold2); }
    .badge-purple { background: var(--purple-bg);  color: var(--purple); }

    /* ── Avatar ── */
    .av {
      width: 30px; height: 30px; border-radius: 7px;
      display: flex; align-items: center; justify-content: center;
      font-family: 'JetBrains Mono', monospace;
      font-size: 11px; font-weight: 700; flex-shrink: 0;
    }
    .av-lg { width: 40px; height: 40px; border-radius: 9px; font-size: 14px; }
    .av-0 { background: var(--gold-bg);   color: var(--gold2); }
    .av-1 { background: var(--blue-bg);   color: var(--blue); }
    .av-2 { background: var(--green-bg);  color: var(--green); }
    .av-3 { background: var(--purple-bg); color: var(--purple); }
    .av-4 { background: var(--amber-bg);  color: var(--amber); }
    .av-5 { background: rgba(45,212,191,0.10); color: #2DD4BF; }

    /* ── Progress bar ── */
    .prog { height: 4px; background: var(--bg5); border-radius: 99px; overflow: hidden; }
    .prog-fill { height: 100%; border-radius: 99px; transition: width 0.5s; }
    .pf-gold   { background: var(--gold); }
    .pf-green  { background: var(--green); }
    .pf-blue   { background: var(--blue); }
    .pf-purple { background: var(--purple); }

    /* ── Formulaire ── */
    .form-field { margin-bottom: 14px; }
    .form-field label {
      display: block; font-size: 11.5px; font-weight: 600;
      color: var(--txt2); margin-bottom: 6px;
      font-family: 'Syne', sans-serif;
      text-transform: uppercase; letter-spacing: 0.04em;
    }
    .form-field input, .form-field select, .form-field textarea {
      width: 100%; padding: 9px 12px;
      background: var(--bg4); border: 1px solid var(--border2);
      border-radius: 7px; color: var(--txt);
      font-size: 13.5px; font-family: 'Outfit', sans-serif;
      outline: none; appearance: none;
      transition: border-color 0.15s, box-shadow 0.15s;
    }
    .form-field input:focus, .form-field select:focus, .form-field textarea:focus {
      border-color: var(--gold);
      box-shadow: 0 0 0 3px rgba(232,165,69,0.12);
    }
    .form-field input::placeholder { color: var(--txt3); }
    .form-field textarea { resize: vertical; min-height: 78px; line-height: 1.55; }
    .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }

    /* ── Modal overlay ── */
    .modal-overlay {
      position: fixed; inset: 0;
      background: rgba(0,0,0,0.7);
      backdrop-filter: blur(6px);
      display: flex; align-items: center; justify-content: center;
      z-index: 999; padding: 16px;
      animation: fadeIn 0.15s ease;
    }
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
    .modal-box {
      background: var(--bg3); border: 1px solid var(--border2);
      border-radius: 14px; width: 100%; max-width: 500px;
      max-height: 88vh; overflow-y: auto;
      box-shadow: 0 16px 56px rgba(0,0,0,0.8);
      animation: slideUp 0.2s cubic-bezier(0.16,1,0.3,1);
    }
    .modal-box.wide { max-width: 580px; }
    @keyframes slideUp { from { opacity: 0; transform: scale(0.96) translateY(10px); } to { opacity: 1; transform: none; } }
    .modal-head {
      padding: 18px 20px 16px; border-bottom: 1px solid var(--border);
      display: flex; align-items: center; justify-content: space-between;
      position: sticky; top: 0; background: var(--bg3); z-index: 2;
    }
    .modal-head h2 { font-family: 'Syne', sans-serif; font-size: 16px; font-weight: 800; letter-spacing: -0.03em; }
    .modal-body { padding: 20px; }
    .modal-footer { padding: 14px 20px; border-top: 1px solid var(--border); display: flex; gap: 8px; justify-content: flex-end; }
    .modal-close-btn {
      width: 26px; height: 26px; background: var(--bg4); border: none;
      border-radius: 6px; color: var(--txt3); cursor: pointer;
      display: flex; align-items: center; justify-content: center;
      font-size: 16px; transition: all 0.12s;
    }
    .modal-close-btn:hover { background: var(--red-bg); color: var(--red); }

    /* ── Barre de recherche / filtre ── */
    .filter-bar { display: flex; gap: 8px; margin-bottom: 16px; flex-wrap: wrap; align-items: center; }
    .search-box {
      flex: 1; min-width: 200px;
      display: flex; align-items: center; gap: 8px;
      background: var(--bg3); border: 1px solid var(--border);
      border-radius: 7px; padding: 8px 12px;
      transition: border-color 0.15s;
    }
    .search-box:focus-within { border-color: var(--border2); }
    .search-box input {
      background: none; border: none; outline: none;
      color: var(--txt); font-size: 13px;
      font-family: 'Outfit', sans-serif; width: 100%;
    }
    .search-box input::placeholder { color: var(--txt3); }

    /* ── Panneau latéral (fiche élève etc.) ── */
    .panel-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.45); z-index: 200; }
    .side-panel {
      position: fixed; top: 0; right: 0;
      width: 440px; height: 100vh;
      background: var(--bg3); border-left: 1px solid var(--border2);
      z-index: 201; overflow-y: auto;
      box-shadow: -8px 0 32px rgba(0,0,0,0.5);
      animation: panelIn 0.28s cubic-bezier(0.4,0,0.2,1);
    }
    @keyframes panelIn { from { transform: translateX(440px); } to { transform: translateX(0); } }
    .panel-head {
      padding: 16px 20px; border-bottom: 1px solid var(--border);
      display: flex; align-items: center; justify-content: space-between;
      position: sticky; top: 0; background: var(--bg3); z-index: 2;
    }
    .panel-head h3 { font-family: 'Syne', sans-serif; font-size: 14px; font-weight: 700; }
    .panel-body { padding: 20px; }

    /* ── Timeline ── */
    .tl { display: flex; flex-direction: column; }
    .tl-item { display: flex; gap: 12px; padding-bottom: 16px; position: relative; }
    .tl-item:not(:last-child)::after { content: ''; position: absolute; left: 13px; top: 27px; bottom: 0; width: 1px; background: var(--border); }
    .tl-dot { width: 27px; height: 27px; border-radius: 7px; flex-shrink: 0; display: flex; align-items: center; justify-content: center; font-size: 12px; z-index: 1; }
    .tl-title { font-size: 13px; font-weight: 600; }
    .tl-sub   { font-size: 12px; color: var(--txt3); margin-top: 2px; }

    /* ── Carte moniteur ── */
    .monitor-card { background: var(--bg3); border: 1px solid var(--border); border-radius: 12px; padding: 20px; transition: border-color 0.2s; }
    .monitor-card:hover { border-color: var(--border2); }
    .mon-name  { font-family: 'Syne', sans-serif; font-size: 15px; font-weight: 700; }
    .mon-spec  { font-size: 12px; color: var(--gold2); margin-top: 2px; }
    .stars     { color: var(--amber); font-size: 11px; letter-spacing: 1.5px; margin-top: 3px; }
    .mon-meta  { display: grid; grid-template-columns: 1fr 1fr; gap: 5px 8px; font-size: 12px; margin-bottom: 14px; }
    .m-key { color: var(--txt3); }
    .m-val { color: var(--txt2); text-align: right; font-family: 'JetBrains Mono', monospace; font-size: 11px; }
    .mon-stats { display: grid; grid-template-columns: repeat(3, 1fr); gap: 6px; }
    .ms-item { background: var(--bg4); border-radius: 7px; padding: 9px 5px; text-align: center; }
    .ms-val  { font-family: 'JetBrains Mono', monospace; font-size: 17px; font-weight: 600; }
    .ms-lbl  { font-size: 10px; color: var(--txt3); margin-top: 2px; text-transform: uppercase; letter-spacing: 0.04em; }

    /* ── Ligne de leçon ── */
    .lesson-row { background: var(--bg3); border: 1px solid var(--border); border-radius: 8px; display: flex; overflow: hidden; margin-bottom: 8px; transition: border-color 0.15s; }
    .lesson-row:hover { border-color: var(--border2); }
    .lesson-bar { width: 3px; flex-shrink: 0; }
    .lesson-inner { display: flex; align-items: center; gap: 16px; padding: 12px 16px; flex: 1; flex-wrap: wrap; }
    .lesson-time .lt { font-family: 'JetBrains Mono', monospace; font-size: 19px; font-weight: 500; color: var(--gold2); }
    .lesson-time .ld { font-size: 11px; color: var(--txt3); margin-top: 1px; }
    .vline { width: 1px; height: 34px; background: var(--border); flex-shrink: 0; }

    /* ── Véhicule card ── */
    .veh-card { background: var(--bg3); border: 1px solid var(--border); border-radius: 12px; overflow: hidden; transition: border-color 0.2s; }
    .veh-card:hover { border-color: var(--border2); }
    .veh-thumb { height: 100px; background: var(--bg4); display: flex; align-items: center; justify-content: center; font-size: 50px; }
    .veh-body { padding: 16px; }

    /* ── Info grid (fiche élève) ── */
    .info-grid { display: grid; grid-template-columns: auto 1fr; gap: 6px 16px; font-size: 13px; }
    .info-key { color: var(--txt3); white-space: nowrap; }
    .info-val { color: var(--txt2); text-align: right; }

    /* ── Empty state ── */
    .empty-state { text-align: center; padding: 50px 20px; }
    .empty-state .ei { font-size: 38px; opacity: 0.18; margin-bottom: 12px; }
    .empty-state .et { font-family: 'Syne', sans-serif; font-size: 15px; font-weight: 700; color: var(--txt2); }
    .empty-state .es { font-size: 13px; color: var(--txt3); margin-top: 4px; }

    /* ── Divider ── */
    .divider { height: 1px; background: var(--border); margin: 14px 0; }

    /* ── Toasts ── */
    .toast-wrap { position: fixed; bottom: 22px; right: 22px; z-index: 9999; display: flex; flex-direction: column; gap: 8px; pointer-events: none; }
    .toast {
      padding: 11px 16px; border-radius: 9px;
      font-size: 13px; font-weight: 600;
      min-width: 250px; max-width: 370px;
      display: flex; align-items: center; gap: 9px;
      pointer-events: all; box-shadow: 0 12px 40px rgba(0,0,0,0.7);
      border: 1px solid transparent;
      animation: toastIn 0.22s cubic-bezier(0.16,1,0.3,1);
    }
    @keyframes toastIn { from { opacity: 0; transform: translateX(14px); } to { opacity: 1; transform: none; } }
    .toast-ok   { background: var(--bg3); border-color: rgba(16,185,129,0.25);  color: var(--green); }
    .toast-err  { background: var(--bg3); border-color: rgba(248,113,113,0.25); color: var(--red); }
    .toast-info { background: var(--bg3); border-color: rgba(56,189,248,0.25);  color: var(--blue); }

    /* ── Code block (Base de données) ── */
    .code-block { background: var(--bg); border: 1px solid var(--border); border-radius: 8px; padding: 14px; font-family: 'JetBrains Mono', monospace; font-size: 11.5px; line-height: 1.8; color: var(--txt2); overflow: auto; white-space: pre; max-height: 380px; }

    /* ── Paramètres ── */
    .settings-block { background: var(--bg3); border: 1px solid var(--border); border-radius: 12px; overflow: hidden; margin-bottom: 14px; }
    .settings-head { padding: 12px 18px; border-bottom: 1px solid var(--border); font-family: 'Syne', sans-serif; font-size: 14px; font-weight: 700; display: flex; align-items: center; gap: 8px; }
    .settings-body { padding: 18px; }

    /* ── Responsive ── */
    @media (min-width: 769px) {
      .sidebar { transform: none !important; }
      .main-wrap { margin-left: var(--sidebar-w) !important; }
      .hamburger { display: none !important; }
    }
    @media (max-width: 1280px) { .kpi-grid { grid-template-columns: repeat(2, 1fr); } }
    @media (max-width: 1024px) { .topbar-search { display: none; } .grid-2 { grid-template-columns: 1fr; } }
    @media (max-width: 768px) {
      .sidebar { transform: translateX(-100%); position: fixed; }
      .sidebar.open { transform: translateX(0); }
      .main-wrap { margin-left: 0; }
      .hamburger { display: flex !important; }
      .page { padding: 14px; }
      .topbar { padding: 0 14px; }
      .kpi-grid { grid-template-columns: 1fr 1fr; gap: 10px; }
      .grid-3 { grid-template-columns: 1fr; }
      .form-grid { grid-template-columns: 1fr; }
      .side-panel { width: 100%; }
      .page-header { flex-direction: column; }
    }
    @media (max-width: 480px) {
      .kpi-grid { grid-template-columns: 1fr 1fr; }
      .kpi-value { font-size: 20px; }
    }
  `}</style>
);

// ─────────────────────────────────────────────
//  DONNÉES INITIALES (seed data)
// ─────────────────────────────────────────────
const DONNEES_INITIALES = {
  meta: {
    nom: "Auto-École Excellence",
    slogan: "Votre permis, notre passion",
    adresse: "Avenue Ahmadou Ahidjo, Akwa, Douala",
    telephone: "+237 6 55 12 34 56",
    email: "contact@autoexcellence.cm",
  },
  eleves: [
    { id: 1, nom: "Mbarga", prenom: "Joël", email: "joel.mbarga@gmail.com", telephone: "655 123 456", dateNaissance: "2000-03-12", lieuNaissance: "Yaoundé", cni: "CM-2000-123456", moniteurId: 1, statut: "Actif", heuresEffectuees: 18, heuresTotal: 30, solde: 25000, permis: "B", dateInscription: "2026-01-10", notes: "Élève sérieux, bonne progression" },
    { id: 2, nom: "Nguema", prenom: "Céline", email: "celine.nguema@gmail.com", telephone: "677 234 567", dateNaissance: "2001-07-22", lieuNaissance: "Douala", cni: "CM-2001-234567", moniteurId: 2, statut: "Actif", heuresEffectuees: 22, heuresTotal: 30, solde: 0, permis: "B", dateInscription: "2026-01-15", notes: "" },
    { id: 3, nom: "Nkodo", prenom: "Paul", email: "paul.nkodo@gmail.com", telephone: "699 345 678", dateNaissance: "1999-11-05", lieuNaissance: "Bafoussam", cni: "CM-1999-345678", moniteurId: 1, statut: "Actif", heuresEffectuees: 30, heuresTotal: 30, solde: 0, permis: "B", dateInscription: "2025-11-01", notes: "" },
    { id: 4, nom: "Fouda", prenom: "Aline", email: "aline.fouda@yahoo.fr", telephone: "650 456 789", dateNaissance: "2002-01-18", lieuNaissance: "Douala", cni: "CM-2002-456789", moniteurId: 3, statut: "Actif", heuresEffectuees: 12, heuresTotal: 30, solde: 50000, permis: "B", dateInscription: "2026-02-01", notes: "Difficultés en manœuvre" },
    { id: 5, nom: "Ateba", prenom: "Christophe", email: "chris.ateba@gmail.com", telephone: "671 567 890", dateNaissance: "2003-05-30", lieuNaissance: "Nkongsamba", cni: "CM-2003-567890", moniteurId: 2, statut: "Actif", heuresEffectuees: 8, heuresTotal: 30, solde: 0, permis: "A", dateInscription: "2026-02-10", notes: "" },
    { id: 6, nom: "Biya", prenom: "Marie", email: "marie.biya@gmail.com", telephone: "695 678 901", dateNaissance: "2000-09-14", lieuNaissance: "Kribi", cni: "CM-2000-678901", moniteurId: 4, statut: "Diplômé", heuresEffectuees: 30, heuresTotal: 30, solde: 0, permis: "B", dateInscription: "2025-09-01", notes: "Excellent élève" },
    { id: 7, nom: "Tamba", prenom: "Séverin", email: "severin.tamba@gmail.com", telephone: "661 789 012", dateNaissance: "2001-12-03", lieuNaissance: "Garoua", cni: "CM-2001-789012", moniteurId: 1, statut: "Suspendu", heuresEffectuees: 6, heuresTotal: 30, solde: 75000, permis: "B", dateInscription: "2026-01-20", notes: "Paiements en retard" },
    { id: 8, nom: "Eyenga", prenom: "Rachel", email: "rachel.eyenga@gmail.com", telephone: "683 890 123", dateNaissance: "2002-04-25", lieuNaissance: "Édéa", cni: "CM-2002-890123", moniteurId: 3, statut: "Actif", heuresEffectuees: 16, heuresTotal: 30, solde: 0, permis: "B", dateInscription: "2026-02-15", notes: "" },
  ],
  moniteurs: [
    { id: 1, nom: "Essomba", prenom: "Roger", email: "roger.essomba@gmail.com", telephone: "655 111 222", specialite: "Permis B", noteMoyenne: 4.8, salaire: 180000, experience: "8 ans", statut: "Actif", dateEmbauche: "2018-03-01", adresse: "Bonanjo, Douala", notes: "" },
    { id: 2, nom: "Fouda", prenom: "Carine", email: "carine.fouda@gmail.com", telephone: "677 333 444", specialite: "Permis B/A", noteMoyenne: 4.5, salaire: 165000, experience: "5 ans", statut: "Actif", dateEmbauche: "2021-07-01", adresse: "Akwa, Douala", notes: "" },
    { id: 3, nom: "Mvondo", prenom: "Jules", email: "jules.mvondo@gmail.com", telephone: "699 555 666", specialite: "Permis B", noteMoyenne: 4.2, salaire: 155000, experience: "3 ans", statut: "Actif", dateEmbauche: "2023-01-15", adresse: "Makepe, Douala", notes: "" },
    { id: 4, nom: "Ngono", prenom: "Béatrice", email: "beatrice.ngono@gmail.com", telephone: "650 777 888", specialite: "Permis B", noteMoyenne: 4.7, salaire: 170000, experience: "6 ans", statut: "Congé", dateEmbauche: "2020-04-01", adresse: "Kotto, Douala", notes: "Congé maternité" },
  ],
  lecons: [
    { id: 1, eleveId: 1, moniteurId: 1, date: "2026-04-05", heure: "08:00", duree: 2, type: "Conduite", statut: "Confirmée", vehicule: "Toyota Corolla — LT 234 A", lieu: "Circuit Akwa", notes: "" },
    { id: 2, eleveId: 2, moniteurId: 2, date: "2026-04-05", heure: "10:00", duree: 2, type: "Conduite", statut: "En attente", vehicule: "Hyundai i10 — LT 567 B", lieu: "Boulevard de la Liberté", notes: "" },
    { id: 3, eleveId: 4, moniteurId: 3, date: "2026-04-05", heure: "14:00", duree: 1, type: "Code", statut: "En attente", vehicule: "", lieu: "Salle Code A", notes: "" },
    { id: 4, eleveId: 8, moniteurId: 3, date: "2026-04-06", heure: "08:00", duree: 2, type: "Conduite", statut: "En attente", vehicule: "Toyota Corolla — LT 234 A", lieu: "Circuit Port", notes: "" },
    { id: 5, eleveId: 3, moniteurId: 1, date: "2026-04-04", heure: "09:00", duree: 2, type: "Conduite", statut: "Terminée", vehicule: "Honda Civic — LT 890 C", lieu: "Autoroute Douala", notes: "" },
    { id: 6, eleveId: 5, moniteurId: 2, date: "2026-04-04", heure: "16:00", duree: 1, type: "Code", statut: "Annulée", vehicule: "", lieu: "Salle Code B", notes: "Élève absent" },
    { id: 7, eleveId: 6, moniteurId: 4, date: "2026-03-30", heure: "10:00", duree: 2, type: "Conduite", statut: "Terminée", vehicule: "Toyota Corolla — LT 234 A", lieu: "Circuit Final", notes: "" },
  ],
  paiements: [
    { id: 1, eleveId: 2, reference: "PAY-2026-0001", montant: 150000, mode: "Mobile Money", date: "2026-01-16", statut: "Payé", description: "Frais inscription complète" },
    { id: 2, eleveId: 3, reference: "PAY-2026-0002", montant: 150000, mode: "Espèces", date: "2025-11-05", statut: "Payé", description: "Frais inscription complète" },
    { id: 3, eleveId: 1, reference: "PAY-2026-0003", montant: 75000, mode: "Mobile Money", date: "2026-01-12", statut: "Payé", description: "1ère tranche — Permis B" },
    { id: 4, eleveId: 6, reference: "PAY-2026-0004", montant: 150000, mode: "Virement", date: "2025-09-05", statut: "Payé", description: "Frais inscription complète" },
    { id: 5, eleveId: 5, reference: "PAY-2026-0005", montant: 150000, mode: "Espèces", date: "2026-02-12", statut: "Payé", description: "Frais inscription complète" },
    { id: 6, eleveId: 4, reference: "PAY-2026-0006", montant: 75000, mode: "Mobile Money", date: "2026-02-03", statut: "Payé", description: "1ère tranche — Permis B" },
    { id: 7, eleveId: 8, reference: "PAY-2026-0007", montant: 150000, mode: "Carte", date: "2026-02-17", statut: "Payé", description: "Frais inscription complète" },
    { id: 8, eleveId: 7, reference: "PAY-2026-0008", montant: 75000, mode: "Espèces", date: "2026-01-22", statut: "En attente", description: "1ère tranche — Permis B" },
    { id: 9, eleveId: 4, reference: "PAY-2026-0009", montant: 25000, mode: "Mobile Money", date: "2026-03-01", statut: "En attente", description: "Frais code de la route" },
  ],
  examens: [
    { id: 1, eleveId: 3, type: "Code", date: "2025-12-10", score: 37, seuil: 35, statut: "Réussi", centre: "CENAC Douala", observations: "Bonne maîtrise du code" },
    { id: 2, eleveId: 3, type: "Conduite", date: "2026-01-20", score: 78, seuil: 70, statut: "Réussi", centre: "CENAC Douala", observations: "Conduite souple et sûre" },
    { id: 3, eleveId: 6, type: "Code", date: "2025-11-15", score: 38, seuil: 35, statut: "Réussi", centre: "CENAC Douala", observations: "" },
    { id: 4, eleveId: 6, type: "Conduite", date: "2025-12-20", score: 82, seuil: 70, statut: "Réussi", centre: "CENAC Douala", observations: "Excellent résultat" },
    { id: 5, eleveId: 1, type: "Code", date: "2026-03-05", score: 33, seuil: 35, statut: "Échoué", centre: "CENAC Douala", observations: "Doit réviser signalisation" },
    { id: 6, eleveId: 2, type: "Code", date: "2026-03-15", score: 36, seuil: 35, statut: "Réussi", centre: "CENAC Douala", observations: "" },
    { id: 7, eleveId: 8, type: "Code", date: "2026-03-28", score: 39, seuil: 35, statut: "Réussi", centre: "CENAC Douala", observations: "Très bonne maîtrise" },
  ],
  vehicules: [
    { id: 1, marque: "Toyota", modele: "Corolla", immatriculation: "LT 234 A", annee: 2020, kilometrage: 48000, type: "Voiture", carburant: "Essence", couleur: "Blanc", statut: "Disponible", assurance: "2026-12-31", visite: "2026-06-30", notes: "Véhicule principal école" },
    { id: 2, marque: "Hyundai", modele: "i10", immatriculation: "LT 567 B", annee: 2021, kilometrage: 32000, type: "Voiture", carburant: "Essence", couleur: "Rouge", statut: "En service", assurance: "2026-11-30", visite: "2026-09-15", notes: "" },
    { id: 3, marque: "Honda", modele: "Civic", immatriculation: "LT 890 C", annee: 2019, kilometrage: 61000, type: "Voiture", carburant: "Essence", couleur: "Gris", statut: "Maintenance", assurance: "2026-08-31", visite: "2025-12-01", notes: "Révision moteur en cours" },
    { id: 4, marque: "Yamaha", modele: "YBR 125", immatriculation: "LT 111 D", annee: 2022, kilometrage: 12000, type: "Moto", carburant: "Essence", couleur: "Bleu", statut: "Disponible", assurance: "2026-10-31", visite: "2026-04-30", notes: "Pour permis A" },
  ],
  notifications: [
    { id: 1, to: "Joël Mbarga", eleveId: 1, canal: "SMS", sujet: "Rappel paiement", message: "Votre solde impayé est de 25 000 FCFA.", date: "2026-03-28", statut: "Envoyé" },
    { id: 2, to: "Tous les élèves", eleveId: null, canal: "SMS", sujet: "Rappel leçon", message: "N'oubliez pas votre leçon de demain.", date: "2026-04-01", statut: "Envoyé" },
    { id: 3, to: "Marie Biya", eleveId: 6, canal: "Email", sujet: "Félicitations", message: "Félicitations pour votre permis !", date: "2026-03-22", statut: "Envoyé" },
  ],
  depenses: [
    { id: 1, categorie: "Carburant", montant: 45000, date: "2026-03-31", description: "Plein véhicules LT 234 A et LT 567 B", validePar: "Admin" },
    { id: 2, categorie: "Salaires", montant: 670000, date: "2026-03-31", description: "Salaires moniteurs — Mars 2026", validePar: "Admin" },
    { id: 3, categorie: "Entretien", montant: 85000, date: "2026-03-25", description: "Révision Honda Civic LT 890 C", validePar: "Admin" },
    { id: 4, categorie: "Communication", montant: 12000, date: "2026-03-15", description: "Crédit SMS groupé élèves", validePar: "Admin" },
  ],
};

// ─────────────────────────────────────────────
//  FONCTIONS UTILITAIRES
// ─────────────────────────────────────────────
// Formater les montants en FCFA
const formatFCFA = (n) => (n ?? 0).toLocaleString("fr-FR") + " FCFA";

// Formater les dates en français
const formatDate = (d) =>
  d ? new Date(d + "T00:00:00").toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" }) : "—";

// Date du jour au format ISO
const aujourdhui = () => new Date().toISOString().slice(0, 10);

// Initiales depuis prénom + nom
const getInitiales = (prenom, nom) =>
  `${(prenom || "")[0] || ""}${(nom || "")[0] || ""}`.toUpperCase();

// Classe CSS de couleur avatar selon l'id
const getAvClass = (id) =>
  ["av-0", "av-1", "av-2", "av-3", "av-4", "av-5"][(id - 1) % 6];

// Étoiles pour la note des moniteurs
const afficherEtoiles = (n) =>
  "★".repeat(Math.floor(n)) + "☆".repeat(5 - Math.floor(n));

// Générer une référence de paiement unique
const genererRef = () =>
  `PAY-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 9000) + 1000).padStart(4, "0")}`;

// Prochain ID disponible dans un tableau
const prochainId = (arr) =>
  arr.length > 0 ? Math.max(...arr.map((x) => x.id)) + 1 : 1;

// ─────────────────────────────────────────────
//  GESTION LOCALSTORAGE
// ─────────────────────────────────────────────
const CLE_STORAGE = "autoges_data_v1";

function chargerDB() {
  try {
    const data = localStorage.getItem(CLE_STORAGE);
    if (data) return JSON.parse(data);
  } catch (e) {
    console.error("Erreur chargement localStorage:", e);
  }
  return DONNEES_INITIALES;
}

function sauvegarderDB(data) {
  try {
    localStorage.setItem(CLE_STORAGE, JSON.stringify(data));
  } catch (e) {
    console.error("Erreur sauvegarde localStorage:", e);
  }
}

// ─────────────────────────────────────────────
//  FONCTIONS D'EXPORT
// ─────────────────────────────────────────────
function genererSQL(data) {
  let sql = `-- AutoGES Pro | Export SQL\n-- Auto-École Excellence, Douala\n-- Généré le ${new Date().toLocaleDateString("fr-FR")}\n\n`;
  const tables = ["eleves", "moniteurs", "lecons", "paiements", "examens", "vehicules", "notifications", "depenses"];
  tables.forEach((table) => {
    const rows = data[table];
    if (!rows || !rows.length) return;
    const cols = Object.keys(rows[0]);
    sql += `-- Table : ${table}\n`;
    rows.forEach((row) => {
      const vals = cols.map((c) => (row[c] === null ? "NULL" : `'${String(row[c]).replace(/'/g, "''")}'`));
      sql += `INSERT INTO \`${table}\` (${cols.map((c) => `\`${c}\``).join(", ")}) VALUES (${vals.join(", ")});\n`;
    });
    sql += "\n";
  });
  return sql;
}

function genererCSV(rows) {
  if (!rows || !rows.length) return "";
  const cols = Object.keys(rows[0]);
  const header = cols.join(",");
  const lignes = rows.map((r) => cols.map((c) => `"${String(r[c] || "").replace(/"/g, '""')}"`).join(","));
  return [header, ...lignes].join("\n");
}

function telechargerFichier(contenu, nom, type = "text/plain") {
  const a = document.createElement("a");
  a.href = URL.createObjectURL(new Blob([contenu], { type }));
  a.download = nom;
  a.click();
}

// ─────────────────────────────────────────────
//  COMPOSANTS RÉUTILISABLES
// ─────────────────────────────────────────────

// Badge de statut
function Badge({ valeur }) {
  const classes = {
    Actif: "badge-green", Diplômé: "badge-blue", Suspendu: "badge-red",
    Congé: "badge-amber", Inactif: "badge-red",
    Confirmée: "badge-green", "En attente": "badge-amber", Annulée: "badge-red", Terminée: "badge-blue",
    Payé: "badge-green", Réussi: "badge-green", Échoué: "badge-red",
    Disponible: "badge-green", "En service": "badge-blue", Maintenance: "badge-amber", "Hors service": "badge-red",
    Code: "badge-blue", Conduite: "badge-gold",
    "Permis B": "badge-gold", "Permis A": "badge-purple",
  };
  return <span className={`badge ${classes[valeur] || "badge-blue"}`}>{valeur}</span>;
}

// Avatar avec initiales
function Avatar({ prenom, nom, id, large }) {
  return (
    <div className={`av ${large ? "av-lg" : ""} ${getAvClass(id)}`}>
      {getInitiales(prenom, nom)}
    </div>
  );
}

// Cellule personne (avatar + nom + sous-titre)
function PersonneCell({ prenom, nom, sub, id }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <Avatar prenom={prenom} nom={nom} id={id} />
      <div>
        <div style={{ fontWeight: 600, fontSize: 13.5, color: "var(--txt)" }}>
          {prenom} {nom}
        </div>
        {sub && <div style={{ fontSize: 12, color: "var(--txt3)" }}>{sub}</div>}
      </div>
    </div>
  );
}

// Barre de progression
function ProgBar({ pct, color = "pf-gold" }) {
  return (
    <div className="prog">
      <div className={`prog-fill ${color}`} style={{ width: `${pct}%` }} />
    </div>
  );
}

// ─────────────────────────────────────────────
//  TOASTS (notifications en bas à droite)
// ─────────────────────────────────────────────
function Toasts({ liste }) {
  const icones = { ok: "✓", err: "✕", info: "·" };
  return (
    <div className="toast-wrap">
      {liste.map((t) => (
        <div key={t.id} className={`toast toast-${t.type}`}>
          <span>{icones[t.type]}</span>
          {t.message}
        </div>
      ))}
    </div>
  );
}

function useToasts() {
  const [liste, setListe] = useState([]);
  const ajouter = useCallback((message, type = "ok") => {
    const id = Date.now();
    setListe((prev) => [...prev, { id, message, type }]);
    setTimeout(() => setListe((prev) => prev.filter((t) => t.id !== id)), 3200);
  }, []);
  return { liste, ajouter };
}

// ─────────────────────────────────────────────
//  MODAL (boîte de dialogue)
// ─────────────────────────────────────────────
function Modal({ titre, onClose, footer, large, children }) {
  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className={`modal-box ${large ? "wide" : ""}`}>
        <div className="modal-head">
          <h2>{titre}</h2>
          <button className="modal-close-btn" onClick={onClose}>×</button>
        </div>
        <div className="modal-body">{children}</div>
        {footer && <div className="modal-footer">{footer}</div>}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
//  PANNEAU LATÉRAL (fiche détail)
// ─────────────────────────────────────────────
function PanneauLateral({ titre, onClose, children }) {
  return (
    <>
      <div className="panel-overlay" onClick={onClose} />
      <div className="side-panel">
        <div className="panel-head">
          <h3>{titre}</h3>
          <button className="modal-close-btn" onClick={onClose}>×</button>
        </div>
        <div className="panel-body">{children}</div>
      </div>
    </>
  );
}

// ─────────────────────────────────────────────
//  PAGE CONNEXION
// ─────────────────────────────────────────────
function PageConnexion({ onConnexion }) {
  const [email, setEmail] = useState("admin@autoexcellence.cm");
  const [pass, setPass] = useState("admin123");
  const [chargement, setChargement] = useState(false);

  function handleLogin() {
    if (!email || !pass) return;
    setChargement(true);
    // Simulation d'un délai de connexion
    setTimeout(() => {
      onConnexion();
    }, 600);
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "var(--bg)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Grille de fond */}
      <div
        style={{
          position: "absolute", inset: 0,
          backgroundImage: "linear-gradient(rgba(255,255,255,.018) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.018) 1px, transparent 1px)",
          backgroundSize: "52px 52px",
          pointerEvents: "none",
        }}
      />
      {/* Halo lumineux */}
      <div
        style={{
          position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)",
          width: 900, height: 450,
          background: "radial-gradient(ellipse at top, rgba(232,165,69,0.11) 0%, transparent 65%)",
          pointerEvents: "none",
        }}
      />

      {/* Formulaire */}
      <div style={{ position: "relative", zIndex: 1, width: "100%", maxWidth: 420, padding: 20 }}>
        {/* En-tête */}
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <div
            style={{
              display: "inline-flex", alignItems: "center", justifyContent: "center",
              width: 62, height: 62, background: "var(--gold)",
              borderRadius: 16, fontSize: 30, marginBottom: 18,
              boxShadow: "0 0 0 8px rgba(232,165,69,.12), 0 8px 40px rgba(232,165,69,.28)",
            }}
          >
            🚗
          </div>
          <h1
            style={{
              fontFamily: "Syne, sans-serif",
              fontSize: 30, fontWeight: 800,
              letterSpacing: "-0.04em", color: "var(--txt)",
            }}
          >
            Auto<span style={{ color: "var(--gold)" }}>GES</span> Pro
          </h1>
          <p style={{ fontSize: 13.5, color: "var(--txt3)", marginTop: 6 }}>
            Système de gestion d'auto-école · Douala, Cameroun
          </p>
        </div>

        {/* Carte de connexion */}
        <div
          style={{
            background: "var(--bg3)",
            border: "1px solid rgba(255,255,255,.09)",
            borderRadius: 16, padding: 32,
            boxShadow: "0 16px 56px rgba(0,0,0,.8)",
            position: "relative", overflow: "hidden",
          }}
        >
          {/* Ligne lumineuse en haut de la carte */}
          <div
            style={{
              position: "absolute", top: 0, left: 0, right: 0, height: 1,
              background: "linear-gradient(90deg, transparent, rgba(232,165,69,.45), transparent)",
            }}
          />

          <h2 style={{ fontFamily: "Syne, sans-serif", fontSize: 17, fontWeight: 800, letterSpacing: "-.03em", marginBottom: 5 }}>
            Connexion au tableau de bord
          </h2>
          <p style={{ fontSize: 13, color: "var(--txt3)", marginBottom: 26, lineHeight: 1.55 }}>
            Entrez vos identifiants pour accéder à la plateforme.
          </p>

          <div className="form-field">
            <label>Adresse email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@autoexcellence.cm"
            />
          </div>

          <div className="form-field" style={{ marginBottom: 24 }}>
            <label>Mot de passe</label>
            <input
              type="password"
              value={pass}
              onChange={(e) => setPass(e.target.value)}
              placeholder="••••••••"
              onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            />
          </div>

          <button
            onClick={handleLogin}
            className="btn btn-gold"
            style={{ width: "100%", justifyContent: "center", fontSize: 15, padding: 11 }}
            disabled={chargement}
          >
            {chargement ? "Connexion en cours…" : "Accéder au tableau de bord →"}
          </button>

          <div style={{ fontSize: 12, color: "var(--txt3)", textAlign: "center", marginTop: 20, lineHeight: 1.7 }}>
            Identifiants de démonstration :<br />
            <code style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 11, background: "var(--bg4)", padding: "2px 7px", borderRadius: 5, color: "var(--txt2)" }}>
              admin@autoexcellence.cm
            </code>
            {" · "}
            <code style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 11, background: "var(--bg4)", padding: "2px 7px", borderRadius: 5, color: "var(--txt2)" }}>
              admin123
            </code>
          </div>
        </div>

        {/* Statut système */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 7, marginTop: 22, fontSize: 12, color: "var(--txt3)" }}>
          <div
            style={{
              width: 6, height: 6, background: "var(--green)",
              borderRadius: "50%", boxShadow: "0 0 6px var(--green)",
              animation: "pls 2s ease-in-out infinite",
            }}
          />
          <style>{`@keyframes pls { 0%,100%{opacity:1} 50%{opacity:.4} }`}</style>
          Tous les systèmes opérationnels · Auto-École Excellence
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
//  SIDEBAR
// ─────────────────────────────────────────────
function Sidebar({ pageActive, onNaviguer, onDeconnexion, db, ouvert }) {
  const nbActifs = db.eleves.filter((e) => e.statut === "Actif").length;
  const nbAttentePay = db.paiements.filter((p) => p.statut === "En attente").length;
  const nbAttenteLecon = db.lecons.filter((l) => l.statut === "En attente").length;

  const lienNav = (page, icone, label, badge) => (
    <div
      className={`sb-link ${pageActive === page ? "active" : ""}`}
      onClick={() => onNaviguer(page)}
    >
      <span className="icon">{icone}</span>
      {label}
      {badge > 0 && <span className="sb-badge">{badge}</span>}
    </div>
  );

  return (
    <nav className={`sidebar ${ouvert ? "open" : ""}`}>
      <div className="sb-brand">
        <div className="sb-logo">🚗</div>
        <div>
          <div className="sb-brand-name">AutoGES Pro</div>
          <div className="sb-brand-tag">v1.0 · Excellence</div>
        </div>
      </div>

      <div className="sb-nav">
        <div className="sb-section">
          <span className="sb-section-label">Principal</span>
          {lienNav("home", "⊞", "Vue d'ensemble")}
          {lienNav("eleves", "◉", "Élèves", nbActifs)}
        </div>

        <div className="sb-section">
          <span className="sb-section-label">Gestion</span>
          {lienNav("moniteurs", "◈", "Moniteurs")}
          {lienNav("planning", "◷", "Planning", nbAttenteLecon)}
          {lienNav("examens", "◎", "Examens")}
          {lienNav("paiements", "◆", "Paiements", nbAttentePay)}
          {lienNav("vehicules", "◻", "Véhicules")}
          {lienNav("depenses", "◐", "Dépenses")}
        </div>

        <div className="sb-section">
          <span className="sb-section-label">Outils</span>
          {lienNav("notifications", "◑", "Notifications")}
          {lienNav("bdd", "⊟", "Base de données")}
          {lienNav("parametres", "◧", "Paramètres")}
        </div>
      </div>

      <div className="sb-footer">
        <div className="sb-user" onClick={() => onNaviguer("parametres")}>
          <div className="sb-av">AD</div>
          <div>
            <div className="sb-user-name">Administrateur</div>
            <div className="sb-user-role">Super Admin · Excellence</div>
          </div>
        </div>
      </div>
    </nav>
  );
}

// ─────────────────────────────────────────────
//  TOPBAR
// ─────────────────────────────────────────────
const TITRES_PAGES = {
  home: "Vue d'ensemble", eleves: "Élèves", moniteurs: "Moniteurs",
  planning: "Planning", examens: "Examens", paiements: "Paiements",
  vehicules: "Véhicules", depenses: "Dépenses",
  notifications: "Notifications", bdd: "Base de données", parametres: "Paramètres",
};

function Topbar({ page, onNaviguer, onDeconnexion, onToggleSidebar }) {
  return (
    <div className="topbar">
      <button
        className="top-btn hamburger"
        onClick={onToggleSidebar}
        style={{ display: "none" }}
      >
        ☰
      </button>

      <div className="topbar-crumb">
        <span className="root">Excellence</span>
        <span className="sep">/</span>
        <span className="cur">{TITRES_PAGES[page] || page}</span>
      </div>

      <div className="topbar-search">
        <span style={{ color: "var(--txt3)", fontSize: 13 }}>⌕</span>
        <input
          placeholder="Rechercher un élève…"
          onChange={(e) => {
            if (e.target.value.length > 1) onNaviguer("eleves");
          }}
        />
        <span style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 10, color: "var(--txt3)", background: "var(--bg5)", padding: "1px 5px", borderRadius: 4 }}>⌘K</span>
      </div>

      <div className="topbar-actions">
        <div className="top-btn" onClick={() => onNaviguer("notifications")} title="Notifications">
          ◑<div className="notif-dot" />
        </div>
        <div className="top-btn" onClick={() => onNaviguer("bdd")} title="Base de données">⊟</div>
        <div className="user-pill" onClick={() => onNaviguer("parametres")}>
          <div className="pill-av">AD</div>
          Administrateur
        </div>
        <div className="top-btn" onClick={onDeconnexion} title="Déconnexion" style={{ fontSize: 13 }}>
          ⏻
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
//  PAGE TABLEAU DE BORD
// ─────────────────────────────────────────────
function PageDashboard({ db, toast, onNaviguer }) {
  const el = db.eleves, pa = db.paiements, ex = db.examens, le = db.lecons;
  const nbActifs = el.filter((e) => e.statut === "Actif").length;
  const ca = pa.filter((p) => p.statut === "Payé").reduce((s, p) => s + p.montant, 0);
  const taux = ex.length ? Math.round(ex.filter((x) => x.statut === "Réussi").length / ex.length * 100) : 0;
  const leconsDuJour = le.filter((l) => l.date === aujourdhui());
  const elevesImpay = el.filter((e) => e.solde > 0);
  const top4 = [...el].sort((a, b) => b.heuresEffectuees - a.heuresEffectuees).slice(0, 4);

  return (
    <div>
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Vue d'ensemble</h1>
          <p className="page-subtitle">
            {new Date().toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
            {" · "}Auto-École Excellence, Douala
          </p>
        </div>
        <div className="page-actions">
          <button className="btn btn-ghost btn-sm" onClick={() => { telechargerFichier(genererSQL(db), "autoges.sql"); toast("Export SQL téléchargé", "info"); }}>
            ⬇ SQL
          </button>
          <button className="btn btn-outline btn-sm" onClick={() => { telechargerFichier(JSON.stringify(db, null, 2), "backup.json", "application/json"); toast("Backup téléchargé", "info"); }}>
            ⬇ Backup
          </button>
          <button className="btn btn-gold btn-sm" onClick={() => onNaviguer("eleves")}>
            + Nouvel élève
          </button>
        </div>
      </div>

      {/* Alerte impayés */}
      {elevesImpay.length > 0 && (
        <div className="alert alert-warn">
          ⚠ {elevesImpay.length} élève{elevesImpay.length > 1 ? "s" : ""} avec solde impayé —{" "}
          {formatFCFA(elevesImpay.reduce((s, e) => s + e.solde, 0))} à régulariser
          <button className="btn btn-ghost btn-sm" style={{ marginLeft: "auto" }} onClick={() => onNaviguer("paiements")}>
            Voir →
          </button>
        </div>
      )}

      {/* KPIs */}
      <div className="kpi-grid">
        <div className="kpi-card">
          <div className="kpi-accent" style={{ background: "var(--gold)" }} />
          <div className="kpi-label">Élèves actifs</div>
          <div className="kpi-value">{nbActifs}</div>
          <div className="kpi-delta up">↑ +8% ce mois</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-accent" style={{ background: "var(--green)" }} />
          <div className="kpi-label">Taux de réussite</div>
          <div className="kpi-value">{taux}%</div>
          <div className="kpi-delta up">↑ +3pts</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-accent" style={{ background: "var(--blue)" }} />
          <div className="kpi-label">Leçons planifiées</div>
          <div className="kpi-value">{le.length}</div>
          <div className="kpi-delta">{leconsDuJour.length} aujourd'hui</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-accent" style={{ background: "var(--purple)" }} />
          <div className="kpi-label">Chiffre d'affaires</div>
          <div className="kpi-value" style={{ fontSize: "clamp(14px,1.7vw,20px)" }}>
            {formatFCFA(ca)}
          </div>
          <div className="kpi-delta up">↑ +15% ce mois</div>
        </div>
      </div>

      {/* Grille principale */}
      <div className="grid-2">
        {/* Activité récente */}
        <div className="card">
          <div className="card-head">
            <h3>Activité récente</h3>
            <Badge valeur="Actif" />
          </div>
          <div className="card-body">
            <div className="tl">
              {[
                { bg: "var(--gold-bg)", t: "Dernier élève inscrit", s: `${el[el.length - 1]?.prenom} ${el[el.length - 1]?.nom}` },
                { bg: "var(--blue-bg)", t: "Leçons confirmées", s: `${le.filter((l) => l.statut === "Confirmée").length} confirmées` },
                { bg: "var(--green-bg)", t: "Paiements reçus", s: `${pa.filter((p) => p.statut === "Payé").length} validés · ${formatFCFA(ca)}` },
                { bg: "var(--purple-bg)", t: "Taux de réussite", s: `${taux}% sur ${ex.length} examens` },
              ].map((a, i) => (
                <div key={i} className="tl-item">
                  <div className="tl-dot" style={{ background: a.bg }}>·</div>
                  <div>
                    <div className="tl-title">{a.t}</div>
                    <div className="tl-sub">{a.s}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Meilleure progression */}
        <div className="card">
          <div className="card-head">
            <h3>Meilleure progression</h3>
            <span style={{ fontSize: 12, color: "var(--txt3)" }}>Ce mois</span>
          </div>
          <div className="card-body">
            {top4.map((e, i) => {
              const pct = Math.round((e.heuresEffectuees / e.heuresTotal) * 100);
              const rkClass = ["rk1", "rk2", "rk3", "rkn"][i] || "rkn";
              return (
                <div key={e.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 0", borderBottom: i < 3 ? "1px solid rgba(255,255,255,.03)" : "none" }}>
                  <div style={{ width: 21, height: 21, borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "JetBrains Mono, monospace", fontSize: 10, fontWeight: 700, background: ["rgba(251,191,36,.12)", "rgba(56,189,248,.12)", "rgba(167,139,250,.12)", "var(--bg5)"][i] || "var(--bg5)", color: ["var(--amber)", "var(--blue)", "var(--purple)", "var(--txt3)"][i] || "var(--txt3)", flexShrink: 0 }}>
                    {i + 1}
                  </div>
                  <Avatar prenom={e.prenom} nom={e.nom} id={e.id} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 600, fontSize: 13 }}>{e.prenom} {e.nom}</div>
                    <ProgBar pct={pct} />
                    <div style={{ fontSize: 12, color: "var(--txt3)", marginTop: 4 }}>
                      {e.heuresEffectuees}h / {e.heuresTotal}h
                    </div>
                  </div>
                  <div style={{ fontFamily: "JetBrains Mono, monospace", fontWeight: 700, color: "var(--gold2)", fontSize: 13, flexShrink: 0 }}>
                    {pct}%
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Leçons du jour + Répartition */}
      <div className="grid-2">
        <div className="card">
          <div className="card-head">
            <h3>Leçons du jour</h3>
            <span className="badge badge-blue">{leconsDuJour.length} séance{leconsDuJour.length !== 1 ? "s" : ""}</span>
          </div>
          {leconsDuJour.length === 0 ? (
            <div className="empty-state">
              <div className="ei">◷</div>
              <div className="et">Aucune leçon aujourd'hui</div>
            </div>
          ) : (
            <div className="tbl-wrap">
              <table className="tbl">
                <thead>
                  <tr>
                    <th>Élève</th><th>Heure</th><th>Type</th><th>Statut</th>
                  </tr>
                </thead>
                <tbody>
                  {leconsDuJour.map((l) => {
                    const e = el.find((x) => x.id === l.eleveId);
                    return (
                      <tr key={l.id}>
                        <td><PersonneCell prenom={e?.prenom} nom={e?.nom} id={l.eleveId} /></td>
                        <td><span style={{ fontFamily: "JetBrains Mono, monospace", fontWeight: 700, color: "var(--gold2)", fontSize: 15 }}>{l.heure}</span></td>
                        <td><Badge valeur={l.type} /></td>
                        <td><Badge valeur={l.statut} /></td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="card">
          <div className="card-head"><h3>Répartition des effectifs</h3></div>
          <div className="card-body">
            {[
              ["Permis B — Voiture", el.filter((e) => e.permis === "B").length, el.length, "pf-gold"],
              ["Permis A — Moto", el.filter((e) => e.permis === "A").length, el.length, "pf-purple"],
              ["Diplômés", el.filter((e) => e.statut === "Diplômé").length, el.length, "pf-green"],
              ["Moniteurs actifs", db.moniteurs.filter((m) => m.statut === "Actif").length, db.moniteurs.length, "pf-blue"],
            ].map(([label, count, total, cls]) => (
              <div key={label} style={{ marginBottom: 16 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 7, fontSize: 13 }}>
                  <span style={{ color: "var(--txt2)" }}>{label}</span>
                  <span style={{ fontFamily: "JetBrains Mono, monospace", fontWeight: 700, fontSize: 12 }}>{count} / {total}</span>
                </div>
                <ProgBar pct={Math.round((count / Math.max(total, 1)) * 100)} color={cls} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
//  PAGE ÉLÈVES
// ─────────────────────────────────────────────
function PageEleves({ db, onMajDB, toast }) {
  const [recherche, setRecherche] = useState("");
  const [filtre, setFiltre] = useState("Tous");
  const [modalOuvert, setModalOuvert] = useState(false);
  const [eleveSelectionne, setEleveSelectionne] = useState(null); // pour edit
  const [panneauEleve, setPanneauEleve] = useState(null); // pour fiche détail
  const [form, setForm] = useState({});

  // Données du formulaire par défaut (nouvel élève)
  const formVide = {
    prenom: "", nom: "", email: "", telephone: "",
    dateNaissance: "", lieuNaissance: "", cni: "",
    moniteurId: db.moniteurs[0]?.id || 1,
    statut: "Actif", heuresEffectuees: 0, heuresTotal: 30,
    solde: 0, permis: "B", notes: "",
  };

  const ouvrir = (eleve = null) => {
    setEleveSelectionne(eleve);
    setForm(eleve ? { ...eleve } : formVide);
    setModalOuvert(true);
  };

  const enregistrer = () => {
    if (!form.prenom || !form.nom) {
      toast("Prénom et nom sont obligatoires", "err");
      return;
    }

    const data = { ...db };
    if (eleveSelectionne) {
      // Modifier
      const idx = data.eleves.findIndex((e) => e.id === eleveSelectionne.id);
      data.eleves[idx] = { ...form, id: eleveSelectionne.id };
    } else {
      // Ajouter
      data.eleves.push({
        ...form,
        id: prochainId(data.eleves),
        dateInscription: aujourdhui(),
        moniteurId: Number(form.moniteurId),
        heuresEffectuees: Number(form.heuresEffectuees),
        solde: Number(form.solde),
      });
    }
    sauvegarderDB(data);
    onMajDB(data);
    setModalOuvert(false);
    toast(eleveSelectionne ? "Élève modifié avec succès" : "Élève inscrit avec succès");
  };

  const supprimer = (id) => {
    if (!window.confirm("Supprimer cet élève ?")) return;
    const data = { ...db, eleves: db.eleves.filter((e) => e.id !== id) };
    sauvegarderDB(data);
    onMajDB(data);
    setPanneauEleve(null);
    toast("Élève supprimé", "info");
  };

  // Filtrage
  let liste = db.eleves;
  if (filtre !== "Tous") liste = liste.filter((e) => e.statut === filtre);
  if (recherche) {
    const q = recherche.toLowerCase();
    liste = liste.filter((e) =>
      `${e.nom}${e.prenom}${e.email}${e.telephone}${e.cni}`.toLowerCase().includes(q)
    );
  }

  const eleve = panneauEleve ? db.eleves.find((e) => e.id === panneauEleve) : null;

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Élèves</h1>
          <p className="page-subtitle">
            {db.eleves.length} inscrits · {db.eleves.filter((e) => e.statut === "Actif").length} actifs ·{" "}
            {db.eleves.filter((e) => e.statut === "Diplômé").length} diplômés
          </p>
        </div>
        <div className="page-actions">
          <button className="btn btn-ghost btn-sm" onClick={() => { telechargerFichier(genererCSV(db.eleves), "eleves.csv", "text/csv"); toast("Export CSV téléchargé", "info"); }}>
            ⬇ CSV
          </button>
          <button className="btn btn-gold btn-sm" onClick={() => ouvrir()}>
            + Inscrire un élève
          </button>
        </div>
      </div>

      {/* Filtres */}
      <div className="filter-bar">
        <div className="search-box">
          <span style={{ color: "var(--txt3)" }}>⌕</span>
          <input
            placeholder="Rechercher par nom, email, CNI…"
            value={recherche}
            onChange={(e) => setRecherche(e.target.value)}
          />
        </div>
        {["Tous", "Actif", "Diplômé", "Suspendu"].map((s) => (
          <button
            key={s}
            className={`btn btn-sm ${filtre === s ? "btn-gold" : "btn-ghost"}`}
            onClick={() => setFiltre(s)}
          >
            {s}{s !== "Tous" && ` (${db.eleves.filter((e) => e.statut === s).length})`}
          </button>
        ))}
      </div>

      {/* Tableau */}
      <div className="card">
        <div className="tbl-wrap">
          <table className="tbl">
            <thead>
              <tr>
                <th>Élève</th><th>Contact</th><th>Permis</th>
                <th>Progression</th><th>Solde</th><th>Moniteur</th>
                <th>Statut</th><th></th>
              </tr>
            </thead>
            <tbody>
              {liste.map((e) => {
                const mon = db.moniteurs.find((m) => m.id === e.moniteurId);
                const pct = Math.round((e.heuresEffectuees / e.heuresTotal) * 100);
                return (
                  <tr key={e.id}>
                    <td style={{ cursor: "pointer" }} onClick={() => setPanneauEleve(e.id)}>
                      <PersonneCell prenom={e.prenom} nom={e.nom} sub={e.email} id={e.id} />
                    </td>
                    <td style={{ fontSize: 13, color: "var(--txt2)" }}>{e.telephone}</td>
                    <td><Badge valeur={`Permis ${e.permis}`} /></td>
                    <td style={{ minWidth: 140 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "var(--txt3)", marginBottom: 5 }}>
                        <span>{e.heuresEffectuees}h / {e.heuresTotal}h</span>
                        <span>{pct}%</span>
                      </div>
                      <ProgBar pct={pct} />
                    </td>
                    <td style={{ fontFamily: "JetBrains Mono, monospace", fontWeight: 700, color: e.solde > 0 ? "var(--red)" : "var(--green)" }}>
                      {formatFCFA(e.solde)}
                    </td>
                    <td>
                      {mon ? <PersonneCell prenom={mon.prenom} nom={mon.nom} id={mon.id} /> : <span style={{ color: "var(--txt3)" }}>—</span>}
                    </td>
                    <td><Badge valeur={e.statut} /></td>
                    <td>
                      <div style={{ display: "flex", gap: 4 }}>
                        <button className="btn btn-ghost btn-xs" onClick={() => setPanneauEleve(e.id)}>↗</button>
                        <button className="btn btn-ghost btn-xs" onClick={() => ouvrir(e)}>✎</button>
                        <button className="btn btn-danger btn-xs" onClick={() => supprimer(e.id)}>✕</button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {liste.length === 0 && (
          <div className="empty-state">
            <div className="ei">◉</div>
            <div className="et">Aucun élève trouvé</div>
            <div className="es">Modifiez vos filtres ou inscrivez un nouvel élève</div>
          </div>
        )}
      </div>

      {/* Panneau fiche élève */}
      {eleve && (
        <PanneauLateral titre="Fiche Élève" onClose={() => setPanneauEleve(null)}>
          <div style={{ display: "flex", gap: 12, marginBottom: 16 }}>
            <Avatar prenom={eleve.prenom} nom={eleve.nom} id={eleve.id} large />
            <div>
              <div style={{ fontFamily: "Syne, sans-serif", fontWeight: 800, fontSize: 18, letterSpacing: "-.03em" }}>
                {eleve.prenom} {eleve.nom}
              </div>
              <div style={{ fontSize: 13, color: "var(--txt3)", marginTop: 4 }}>{eleve.email}</div>
              <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                <Badge valeur={eleve.statut} />
                <Badge valeur={`Permis ${eleve.permis}`} />
              </div>
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 8 }}>
            <span style={{ color: "var(--txt2)" }}>Progression formation</span>
            <span style={{ fontFamily: "JetBrains Mono, monospace", fontWeight: 700, color: "var(--gold2)" }}>
              {Math.round((eleve.heuresEffectuees / eleve.heuresTotal) * 100)}%
            </span>
          </div>
          <div className="prog" style={{ height: 6 }}>
            <div className="prog-fill pf-gold" style={{ width: `${Math.round((eleve.heuresEffectuees / eleve.heuresTotal) * 100)}%` }} />
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "var(--txt3)", marginTop: 6 }}>
            <span>{eleve.heuresEffectuees}h effectuées</span>
            <span>{eleve.heuresTotal - eleve.heuresEffectuees}h restantes</span>
          </div>

          <div className="divider" />

          <div className="info-grid">
            <span className="info-key">Téléphone</span><span className="info-val">{eleve.telephone}</span>
            <span className="info-key">Naissance</span><span className="info-val">{formatDate(eleve.dateNaissance)}</span>
            <span className="info-key">Lieu</span><span className="info-val">{eleve.lieuNaissance}</span>
            <span className="info-key">CNI</span><span className="info-val" style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 12 }}>{eleve.cni}</span>
            <span className="info-key">Inscription</span><span className="info-val">{formatDate(eleve.dateInscription)}</span>
            <span className="info-key">Solde</span>
            <span className="info-val" style={{ fontWeight: 700, color: eleve.solde > 0 ? "var(--red)" : "var(--green)" }}>
              {formatFCFA(eleve.solde)}
            </span>
            <span className="info-key">Moniteur</span>
            <span className="info-val">
              {db.moniteurs.find((m) => m.id === eleve.moniteurId)?.prenom}{" "}
              {db.moniteurs.find((m) => m.id === eleve.moniteurId)?.nom}
            </span>
          </div>

          {eleve.notes && (
            <>
              <div className="divider" />
              <div style={{ fontSize: 12, fontWeight: 600, color: "var(--txt2)", marginBottom: 8 }}>Notes internes</div>
              <div style={{ fontSize: 13, color: "var(--txt2)", background: "var(--bg4)", borderRadius: 7, padding: "10px 12px", lineHeight: 1.55 }}>
                {eleve.notes}
              </div>
            </>
          )}

          <div className="divider" />
          <div style={{ display: "flex", gap: 8 }}>
            <button className="btn btn-gold btn-sm" style={{ flex: 1 }} onClick={() => { ouvrir(eleve); setPanneauEleve(null); }}>
              Modifier la fiche
            </button>
            <button className="btn btn-danger btn-sm" onClick={() => supprimer(eleve.id)}>
              Supprimer
            </button>
          </div>
        </PanneauLateral>
      )}

      {/* Modal ajout / modification */}
      {modalOuvert && (
        <Modal
          titre={eleveSelectionne ? `Modifier — ${eleveSelectionne.prenom} ${eleveSelectionne.nom}` : "Inscrire un nouvel élève"}
          onClose={() => setModalOuvert(false)}
          large
          footer={
            <>
              <button className="btn btn-ghost btn-sm" onClick={() => setModalOuvert(false)}>Annuler</button>
              <button className="btn btn-gold btn-sm" onClick={enregistrer}>Enregistrer</button>
            </>
          }
        >
          <div className="form-grid">
            <div className="form-field">
              <label>Prénom *</label>
              <input value={form.prenom || ""} onChange={(e) => setForm({ ...form, prenom: e.target.value })} placeholder="Prénom" />
            </div>
            <div className="form-field">
              <label>Nom *</label>
              <input value={form.nom || ""} onChange={(e) => setForm({ ...form, nom: e.target.value })} placeholder="Nom de famille" />
            </div>
          </div>
          <div className="form-grid">
            <div className="form-field">
              <label>Email</label>
              <input type="email" value={form.email || ""} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="email@exemple.com" />
            </div>
            <div className="form-field">
              <label>Téléphone</label>
              <input value={form.telephone || ""} onChange={(e) => setForm({ ...form, telephone: e.target.value })} placeholder="6XX XXX XXX" />
            </div>
          </div>
          <div className="form-grid">
            <div className="form-field">
              <label>Date de naissance</label>
              <input type="date" value={form.dateNaissance || ""} onChange={(e) => setForm({ ...form, dateNaissance: e.target.value })} />
            </div>
            <div className="form-field">
              <label>Lieu de naissance</label>
              <input value={form.lieuNaissance || ""} onChange={(e) => setForm({ ...form, lieuNaissance: e.target.value })} placeholder="Ville" />
            </div>
          </div>
          <div className="form-grid">
            <div className="form-field">
              <label>N° CNI / Passeport</label>
              <input value={form.cni || ""} onChange={(e) => setForm({ ...form, cni: e.target.value })} placeholder="CM-XXXX-XXXXXX" />
            </div>
            <div className="form-field">
              <label>Permis visé</label>
              <select value={form.permis || "B"} onChange={(e) => setForm({ ...form, permis: e.target.value })}>
                <option>B</option><option>A</option><option>C</option>
              </select>
            </div>
          </div>
          <div className="form-grid">
            <div className="form-field">
              <label>Moniteur assigné</label>
              <select value={form.moniteurId || ""} onChange={(e) => setForm({ ...form, moniteurId: Number(e.target.value) })}>
                {db.moniteurs.map((m) => (
                  <option key={m.id} value={m.id}>{m.prenom} {m.nom}</option>
                ))}
              </select>
            </div>
            <div className="form-field">
              <label>Statut</label>
              <select value={form.statut || "Actif"} onChange={(e) => setForm({ ...form, statut: e.target.value })}>
                <option>Actif</option><option>Diplômé</option><option>Suspendu</option>
              </select>
            </div>
          </div>
          <div className="form-grid">
            <div className="form-field">
              <label>Heures effectuées</label>
              <input type="number" min="0" value={form.heuresEffectuees || 0} onChange={(e) => setForm({ ...form, heuresEffectuees: Number(e.target.value) })} />
            </div>
            <div className="form-field">
              <label>Solde impayé (FCFA)</label>
              <input type="number" min="0" value={form.solde || 0} onChange={(e) => setForm({ ...form, solde: Number(e.target.value) })} />
            </div>
          </div>
          <div className="form-field">
            <label>Notes internes</label>
            <textarea value={form.notes || ""} onChange={(e) => setForm({ ...form, notes: e.target.value })} placeholder="Observations, remarques…" />
          </div>
        </Modal>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
//  PAGE MONITEURS
// ─────────────────────────────────────────────
function PageMoniteurs({ db, onMajDB, toast }) {
  const [modalOuvert, setModalOuvert] = useState(false);
  const [moniteurSel, setMoniteurSel] = useState(null);
  const [form, setForm] = useState({});

  const formVide = {
    prenom: "", nom: "", email: "", telephone: "",
    specialite: "Permis B", noteMoyenne: 4.5,
    salaire: 150000, experience: "", statut: "Actif",
    dateEmbauche: aujourdhui(), adresse: "", notes: "",
  };

  const ouvrir = (m = null) => {
    setMoniteurSel(m);
    setForm(m ? { ...m } : formVide);
    setModalOuvert(true);
  };

  const enregistrer = () => {
    if (!form.prenom || !form.nom) { toast("Prénom et nom requis", "err"); return; }
    const data = { ...db };
    if (moniteurSel) {
      const idx = data.moniteurs.findIndex((m) => m.id === moniteurSel.id);
      data.moniteurs[idx] = { ...form, id: moniteurSel.id };
    } else {
      data.moniteurs.push({ ...form, id: prochainId(data.moniteurs) });
    }
    sauvegarderDB(data);
    onMajDB(data);
    setModalOuvert(false);
    toast(moniteurSel ? "Moniteur modifié" : "Moniteur ajouté");
  };

  const supprimer = (id) => {
    if (!window.confirm("Supprimer ce moniteur ?")) return;
    const data = { ...db, moniteurs: db.moniteurs.filter((m) => m.id !== id) };
    sauvegarderDB(data); onMajDB(data);
    toast("Moniteur supprimé", "info");
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Moniteurs</h1>
          <p className="page-subtitle">{db.moniteurs.length} moniteurs · {db.moniteurs.filter((m) => m.statut === "Actif").length} disponibles</p>
        </div>
        <button className="btn btn-gold btn-sm" onClick={() => ouvrir()}>+ Ajouter un moniteur</button>
      </div>

      <div className="grid-auto">
        {db.moniteurs.map((m) => {
          const nbEleves = db.eleves.filter((e) => e.moniteurId === m.id).length;
          return (
            <div key={m.id} className="monitor-card">
              <div style={{ display: "flex", alignItems: "flex-start", gap: 12, marginBottom: 14 }}>
                <Avatar prenom={m.prenom} nom={m.nom} id={m.id} large />
                <div style={{ flex: 1 }}>
                  <div className="mon-name">{m.prenom} {m.nom}</div>
                  <div className="mon-spec">{m.specialite}</div>
                  <div className="stars">{afficherEtoiles(m.noteMoyenne)} <span style={{ color: "var(--txt3)", letterSpacing: 0 }}>{m.noteMoyenne}</span></div>
                </div>
                <Badge valeur={m.statut} />
              </div>
              <div className="divider" />
              <div className="mon-meta">
                <span className="m-key">Email</span><span className="m-val">{m.email}</span>
                <span className="m-key">Téléphone</span><span className="m-val">{m.telephone}</span>
                <span className="m-key">Expérience</span><span className="m-val">{m.experience}</span>
                <span className="m-key">Salaire</span><span className="m-val" style={{ color: "var(--gold2)" }}>{formatFCFA(m.salaire)}</span>
              </div>
              <div className="mon-stats">
                <div className="ms-item"><div className="ms-val" style={{ color: "var(--gold2)" }}>{nbEleves}</div><div className="ms-lbl">Élèves</div></div>
                <div className="ms-item"><div className="ms-val" style={{ color: "var(--green)" }}>{m.noteMoyenne}</div><div className="ms-lbl">Note</div></div>
                <div className="ms-item"><div className="ms-val" style={{ color: "var(--blue)", fontSize: 12 }}>{m.experience}</div><div className="ms-lbl">Exp.</div></div>
              </div>
              <div className="divider" />
              <div style={{ display: "flex", gap: 8 }}>
                <button className="btn btn-outline btn-sm" style={{ flex: 1 }} onClick={() => ouvrir(m)}>Modifier</button>
                <button className="btn btn-danger btn-sm" onClick={() => supprimer(m.id)}>✕</button>
              </div>
            </div>
          );
        })}
      </div>

      {modalOuvert && (
        <Modal titre={moniteurSel ? "Modifier le moniteur" : "Nouveau moniteur"} onClose={() => setModalOuvert(false)}
          footer={<><button className="btn btn-ghost btn-sm" onClick={() => setModalOuvert(false)}>Annuler</button><button className="btn btn-gold btn-sm" onClick={enregistrer}>Enregistrer</button></>}>
          <div className="form-grid">
            <div className="form-field"><label>Prénom *</label><input value={form.prenom || ""} onChange={(e) => setForm({ ...form, prenom: e.target.value })} /></div>
            <div className="form-field"><label>Nom *</label><input value={form.nom || ""} onChange={(e) => setForm({ ...form, nom: e.target.value })} /></div>
          </div>
          <div className="form-field"><label>Email</label><input type="email" value={form.email || ""} onChange={(e) => setForm({ ...form, email: e.target.value })} /></div>
          <div className="form-grid">
            <div className="form-field"><label>Téléphone</label><input value={form.telephone || ""} onChange={(e) => setForm({ ...form, telephone: e.target.value })} /></div>
            <div className="form-field"><label>Spécialité</label>
              <select value={form.specialite || "Permis B"} onChange={(e) => setForm({ ...form, specialite: e.target.value })}>
                <option>Permis B</option><option>Permis A</option><option>Permis B/A</option><option>Permis C</option>
              </select>
            </div>
          </div>
          <div className="form-grid">
            <div className="form-field"><label>Salaire (FCFA)</label><input type="number" value={form.salaire || 150000} onChange={(e) => setForm({ ...form, salaire: Number(e.target.value) })} /></div>
            <div className="form-field"><label>Expérience</label><input value={form.experience || ""} onChange={(e) => setForm({ ...form, experience: e.target.value })} placeholder="Ex: 3 ans" /></div>
          </div>
          <div className="form-grid">
            <div className="form-field"><label>Statut</label>
              <select value={form.statut || "Actif"} onChange={(e) => setForm({ ...form, statut: e.target.value })}>
                <option>Actif</option><option>Congé</option><option>Inactif</option>
              </select>
            </div>
            <div className="form-field"><label>Date d'embauche</label><input type="date" value={form.dateEmbauche || ""} onChange={(e) => setForm({ ...form, dateEmbauche: e.target.value })} /></div>
          </div>
          <div className="form-field"><label>Adresse</label><input value={form.adresse || ""} onChange={(e) => setForm({ ...form, adresse: e.target.value })} /></div>
        </Modal>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
//  PAGE PLANNING
// ─────────────────────────────────────────────
function PagePlanning({ db, onMajDB, toast }) {
  const [filtre, setFiltre] = useState("Tous");
  const [dateFiltree, setDateFiltree] = useState("");
  const [modalOuvert, setModalOuvert] = useState(false);
  const [form, setForm] = useState({
    eleveId: db.eleves[0]?.id || 1,
    moniteurId: db.moniteurs[0]?.id || 1,
    date: aujourdhui(), heure: "08:00", duree: 2,
    type: "Conduite", vehicule: "", lieu: "",
  });

  const majStatut = (id, statut) => {
    const data = { ...db, lecons: db.lecons.map((l) => l.id === id ? { ...l, statut } : l) };
    sauvegarderDB(data); onMajDB(data);
    toast(`Leçon ${statut.toLowerCase()}`);
  };

  const supprimerLecon = (id) => {
    if (!window.confirm("Supprimer cette leçon ?")) return;
    const data = { ...db, lecons: db.lecons.filter((l) => l.id !== id) };
    sauvegarderDB(data); onMajDB(data);
    toast("Leçon supprimée", "info");
  };

  const ajouterLecon = () => {
    const data = { ...db };
    data.lecons.push({ ...form, id: prochainId(data.lecons), statut: "En attente", notes: "", eleveId: Number(form.eleveId), moniteurId: Number(form.moniteurId), duree: Number(form.duree) });
    sauvegarderDB(data); onMajDB(data);
    setModalOuvert(false);
    toast("Leçon planifiée");
  };

  // Filtrage et tri
  let liste = db.lecons;
  if (filtre !== "Tous") liste = liste.filter((l) => l.type === filtre || l.statut === filtre);
  if (dateFiltree) liste = liste.filter((l) => l.date === dateFiltree);
  liste = [...liste].sort((a, b) => a.date.localeCompare(b.date) || a.heure.localeCompare(b.heure));

  const barColor = { Confirmée: "var(--green)", "En attente": "var(--amber)", Annulée: "var(--red)", Terminée: "var(--blue)" };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Planning</h1>
          <p className="page-subtitle">{db.lecons.length} leçons · {db.lecons.filter((l) => l.statut === "En attente").length} en attente de confirmation</p>
        </div>
        <button className="btn btn-gold btn-sm" onClick={() => setModalOuvert(true)}>+ Planifier une leçon</button>
      </div>

      <div className="filter-bar">
        {["Tous", "Conduite", "Code", "Confirmée", "En attente", "Annulée", "Terminée"].map((f) => (
          <button key={f} className={`btn btn-sm ${filtre === f ? "btn-gold" : "btn-ghost"}`} onClick={() => setFiltre(f)}>{f}</button>
        ))}
        <input
          type="date" value={dateFiltree}
          onChange={(e) => setDateFiltree(e.target.value)}
          style={{ background: "var(--bg3)", border: "1px solid var(--border)", borderRadius: 7, padding: "7px 11px", color: "var(--txt)", fontFamily: "Outfit, sans-serif", fontSize: 13, outline: "none" }}
        />
        {dateFiltree && <button className="btn btn-ghost btn-sm" onClick={() => setDateFiltree("")}>✕</button>}
      </div>

      <div>
        {liste.map((l) => {
          const e = db.eleves.find((x) => x.id === l.eleveId);
          const m = db.moniteurs.find((x) => x.id === l.moniteurId);
          return (
            <div key={l.id} className="lesson-row">
              <div className="lesson-bar" style={{ background: barColor[l.statut] || "var(--border)" }} />
              <div className="lesson-inner">
                <div className="lesson-time">
                  <div className="lt">{l.heure}</div>
                  <div className="ld">{l.duree}h · {formatDate(l.date)}</div>
                </div>
                <div className="vline" />
                <div style={{ display: "flex", alignItems: "center", gap: 10, flex: 1, minWidth: 140 }}>
                  <Avatar prenom={e?.prenom} nom={e?.nom} id={l.eleveId} />
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 13 }}>{e?.prenom} {e?.nom}</div>
                    <div style={{ fontSize: 12, color: "var(--txt3)" }}>avec {m?.prenom} {m?.nom}</div>
                  </div>
                </div>
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap", alignItems: "center" }}>
                  <Badge valeur={l.type} />
                  <Badge valeur={l.statut} />
                  {l.vehicule && <span style={{ fontSize: 12, color: "var(--txt3)" }}>{l.vehicule}</span>}
                </div>
                <div style={{ display: "flex", gap: 6, marginLeft: "auto", flexWrap: "wrap", flexShrink: 0 }}>
                  {l.statut === "En attente" && <button className="btn btn-success btn-xs" onClick={() => majStatut(l.id, "Confirmée")}>Confirmer</button>}
                  {l.statut === "Confirmée" && <button className="btn btn-ghost btn-xs" onClick={() => majStatut(l.id, "Terminée")}>Terminer</button>}
                  {["En attente", "Confirmée"].includes(l.statut) && <button className="btn btn-ghost btn-xs" onClick={() => majStatut(l.id, "Annulée")}>Annuler</button>}
                  <button className="btn btn-danger btn-xs" onClick={() => supprimerLecon(l.id)}>✕</button>
                </div>
              </div>
            </div>
          );
        })}
        {liste.length === 0 && (
          <div className="empty-state"><div className="ei">◷</div><div className="et">Aucune leçon trouvée</div></div>
        )}
      </div>

      {modalOuvert && (
        <Modal titre="Planifier une leçon" onClose={() => setModalOuvert(false)}
          footer={<><button className="btn btn-ghost btn-sm" onClick={() => setModalOuvert(false)}>Annuler</button><button className="btn btn-gold btn-sm" onClick={ajouterLecon}>Enregistrer</button></>}>
          <div className="form-grid">
            <div className="form-field"><label>Élève</label>
              <select value={form.eleveId} onChange={(e) => setForm({ ...form, eleveId: Number(e.target.value) })}>
                {db.eleves.map((e) => <option key={e.id} value={e.id}>{e.prenom} {e.nom}</option>)}
              </select>
            </div>
            <div className="form-field"><label>Moniteur</label>
              <select value={form.moniteurId} onChange={(e) => setForm({ ...form, moniteurId: Number(e.target.value) })}>
                {db.moniteurs.map((m) => <option key={m.id} value={m.id}>{m.prenom} {m.nom}</option>)}
              </select>
            </div>
          </div>
          <div className="form-grid">
            <div className="form-field"><label>Date</label><input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} /></div>
            <div className="form-field"><label>Heure</label><input type="time" value={form.heure} onChange={(e) => setForm({ ...form, heure: e.target.value })} /></div>
          </div>
          <div className="form-grid">
            <div className="form-field"><label>Type</label>
              <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
                <option>Conduite</option><option>Code</option>
              </select>
            </div>
            <div className="form-field"><label>Durée</label>
              <select value={form.duree} onChange={(e) => setForm({ ...form, duree: Number(e.target.value) })}>
                <option value={1}>1h</option><option value={2}>2h</option><option value={3}>3h</option>
              </select>
            </div>
          </div>
          <div className="form-field"><label>Véhicule / Salle</label><input value={form.vehicule} onChange={(e) => setForm({ ...form, vehicule: e.target.value })} placeholder="Ex: Toyota Corolla — LT 234 A" /></div>
          <div className="form-field"><label>Lieu</label><input value={form.lieu} onChange={(e) => setForm({ ...form, lieu: e.target.value })} placeholder="Ex: Circuit Akwa" /></div>
        </Modal>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
//  PAGE EXAMENS
// ─────────────────────────────────────────────
function PageExamens({ db, onMajDB, toast }) {
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({ eleveId: db.eleves[0]?.id || 1, type: "Code", date: aujourdhui(), score: "", seuil: 35, centre: "CENAC Douala", observations: "" });

  const ex = db.examens;
  const taux = ex.length ? Math.round(ex.filter((x) => x.statut === "Réussi").length / ex.length * 100) : 0;

  const enregistrer = () => {
    const sc = Number(form.score), se = Number(form.seuil);
    const statut = sc >= se ? "Réussi" : "Échoué";
    const data = { ...db };
    data.examens.push({ ...form, id: prochainId(data.examens), eleveId: Number(form.eleveId), score: sc, seuil: se, statut });
    sauvegarderDB(data); onMajDB(data);
    setModal(false);
    toast(`Examen enregistré — ${statut}`, statut === "Réussi" ? "ok" : "err");
  };

  const supprimer = (id) => {
    if (!window.confirm("Supprimer ?")) return;
    const data = { ...db, examens: db.examens.filter((x) => x.id !== id) };
    sauvegarderDB(data); onMajDB(data);
    toast("Supprimé", "info");
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Examens</h1>
          <p className="page-subtitle">Taux de réussite : <strong style={{ color: "var(--green)" }}>{taux}%</strong> sur {ex.length} examens</p>
        </div>
        <button className="btn btn-gold btn-sm" onClick={() => setModal(true)}>+ Enregistrer un examen</button>
      </div>

      <div className="grid-3">
        {[
          { label: "Total", val: ex.length, color: "var(--blue)" },
          { label: "Réussis", val: ex.filter((x) => x.statut === "Réussi").length, color: "var(--green)" },
          { label: "Échoués", val: ex.filter((x) => x.statut === "Échoué").length, color: "var(--red)" },
        ].map((s) => (
          <div key={s.label} className="kpi-card">
            <div className="kpi-label">{s.label}</div>
            <div className="kpi-value" style={{ color: s.color }}>{s.val}</div>
          </div>
        ))}
      </div>

      <div className="card">
        <div className="tbl-wrap">
          <table className="tbl">
            <thead>
              <tr><th>Élève</th><th>Type</th><th>Date</th><th>Score</th><th>Seuil</th><th>Centre</th><th>Résultat</th><th>Observations</th><th></th></tr>
            </thead>
            <tbody>
              {ex.map((x) => {
                const e = db.eleves.find((el) => el.id === x.eleveId);
                return (
                  <tr key={x.id}>
                    <td><PersonneCell prenom={e?.prenom} nom={e?.nom} id={x.eleveId} /></td>
                    <td><Badge valeur={x.type} /></td>
                    <td style={{ fontSize: 13 }}>{formatDate(x.date)}</td>
                    <td><span style={{ fontFamily: "JetBrains Mono, monospace", fontWeight: 700, fontSize: 15, color: x.score >= x.seuil ? "var(--green)" : "var(--red)" }}>{x.score}</span></td>
                    <td style={{ fontFamily: "JetBrains Mono, monospace", color: "var(--txt3)" }}>{x.seuil}</td>
                    <td style={{ fontSize: 13 }}>{x.centre}</td>
                    <td><Badge valeur={x.statut} /></td>
                    <td style={{ maxWidth: 150, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontSize: 12, color: "var(--txt3)" }}>{x.observations || "—"}</td>
                    <td><button className="btn btn-danger btn-xs" onClick={() => supprimer(x.id)}>✕</button></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {ex.length === 0 && <div className="empty-state"><div className="ei">◎</div><div className="et">Aucun examen enregistré</div></div>}
      </div>

      {modal && (
        <Modal titre="Enregistrer un examen" onClose={() => setModal(false)}
          footer={<><button className="btn btn-ghost btn-sm" onClick={() => setModal(false)}>Annuler</button><button className="btn btn-gold btn-sm" onClick={enregistrer}>Enregistrer</button></>}>
          <div className="form-field"><label>Élève</label>
            <select value={form.eleveId} onChange={(e) => setForm({ ...form, eleveId: Number(e.target.value) })}>
              {db.eleves.map((e) => <option key={e.id} value={e.id}>{e.prenom} {e.nom}</option>)}
            </select>
          </div>
          <div className="form-grid">
            <div className="form-field"><label>Type</label>
              <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value, seuil: e.target.value === "Code" ? 35 : 70 })}>
                <option>Code</option><option>Conduite</option>
              </select>
            </div>
            <div className="form-field"><label>Date</label><input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} /></div>
          </div>
          <div className="form-grid">
            <div className="form-field"><label>Score obtenu</label><input type="number" min="0" value={form.score} onChange={(e) => setForm({ ...form, score: e.target.value })} placeholder={`Max: ${form.type === "Code" ? 40 : 100}`} /></div>
            <div className="form-field"><label>Seuil de réussite</label><input type="number" value={form.seuil} onChange={(e) => setForm({ ...form, seuil: Number(e.target.value) })} /></div>
          </div>
          {form.score !== "" && (
            <div style={{ padding: "10px 14px", borderRadius: 7, marginBottom: 14, fontSize: 13, fontWeight: 600, background: Number(form.score) >= form.seuil ? "var(--green-bg)" : "var(--red-bg)", color: Number(form.score) >= form.seuil ? "var(--green)" : "var(--red)", border: `1px solid ${Number(form.score) >= form.seuil ? "rgba(16,185,129,.2)" : "rgba(248,113,113,.2)"}` }}>
              {Number(form.score) >= form.seuil ? "✓ Résultat estimé : RÉUSSI" : "✕ Résultat estimé : ÉCHOUÉ"}
            </div>
          )}
          <div className="form-field"><label>Centre d'examen</label><input value={form.centre} onChange={(e) => setForm({ ...form, centre: e.target.value })} /></div>
          <div className="form-field"><label>Observations</label><textarea value={form.observations} onChange={(e) => setForm({ ...form, observations: e.target.value })} placeholder="Notes post-examen…" /></div>
        </Modal>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
//  PAGE PAIEMENTS
// ─────────────────────────────────────────────
function PagePaiements({ db, onMajDB, toast }) {
  const [filtre, setFiltre] = useState("Tous");
  const [modal, setModal] = useState(false);
  const [modeSelectionne, setModeSelectionne] = useState("Mobile Money");
  const [form, setForm] = useState({ eleveId: db.eleves[0]?.id || 1, montant: "", date: aujourdhui(), description: "" });

  const pa = db.paiements;
  const ca  = pa.filter((p) => p.statut === "Payé").reduce((s, p) => s + p.montant, 0);
  const att = pa.filter((p) => p.statut === "En attente").reduce((s, p) => s + p.montant, 0);
  const modesIcones = { "Mobile Money": "📱", Espèces: "💵", Virement: "🏦", Carte: "💳" };

  const valider = (id) => {
    const data = { ...db, paiements: db.paiements.map((p) => p.id === id ? { ...p, statut: "Payé" } : p) };
    sauvegarderDB(data); onMajDB(data);
    toast("Paiement validé");
  };

  const supprimer = (id) => {
    if (!window.confirm("Supprimer ce paiement ?")) return;
    const data = { ...db, paiements: db.paiements.filter((p) => p.id !== id) };
    sauvegarderDB(data); onMajDB(data);
    toast("Supprimé", "info");
  };

  const enregistrer = () => {
    const m = Number(form.montant);
    if (!m || m <= 0) { toast("Montant invalide", "err"); return; }
    const eId = Number(form.eleveId);
    const data = { ...db };
    data.paiements.push({
      id: prochainId(data.paiements),
      eleveId: eId,
      reference: genererRef(),
      montant: m,
      mode: modeSelectionne,
      date: form.date,
      statut: "Payé",
      description: form.description,
    });
    // Mettre à jour le solde de l'élève
    const idxEleve = data.eleves.findIndex((e) => e.id === eId);
    if (idxEleve >= 0) {
      data.eleves[idxEleve] = {
        ...data.eleves[idxEleve],
        solde: Math.max(0, data.eleves[idxEleve].solde - m),
      };
    }
    sauvegarderDB(data); onMajDB(data);
    setModal(false);
    toast("Paiement enregistré avec succès");
  };

  let liste = pa;
  if (filtre !== "Tous") liste = liste.filter((p) => p.statut === filtre);

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Paiements</h1>
          <p className="page-subtitle">{pa.length} transactions enregistrées</p>
        </div>
        <div className="page-actions">
          <button className="btn btn-ghost btn-sm" onClick={() => { telechargerFichier(genererCSV(pa), "paiements.csv", "text/csv"); toast("Export CSV téléchargé", "info"); }}>⬇ CSV</button>
          <button className="btn btn-gold btn-sm" onClick={() => setModal(true)}>+ Enregistrer</button>
        </div>
      </div>

      <div className="grid-3">
        <div className="kpi-card"><div className="kpi-label">Chiffre d'affaires</div><div className="kpi-value" style={{ fontSize: "clamp(14px,1.6vw,20px)", color: "var(--green)" }}>{formatFCFA(ca)}</div></div>
        <div className="kpi-card"><div className="kpi-label">En attente</div><div className="kpi-value" style={{ fontSize: "clamp(14px,1.6vw,20px)", color: "var(--amber)" }}>{formatFCFA(att)}</div></div>
        <div className="kpi-card"><div className="kpi-label">Transactions</div><div className="kpi-value">{pa.length}</div></div>
      </div>

      <div className="filter-bar">
        {["Tous", "Payé", "En attente"].map((f) => (
          <button key={f} className={`btn btn-sm ${filtre === f ? "btn-gold" : "btn-ghost"}`} onClick={() => setFiltre(f)}>{f}</button>
        ))}
      </div>

      <div className="card">
        <div className="tbl-wrap">
          <table className="tbl">
            <thead>
              <tr><th>Référence</th><th>Élève</th><th>Montant</th><th>Mode</th><th>Description</th><th>Date</th><th>Statut</th><th></th></tr>
            </thead>
            <tbody>
              {liste.map((p) => {
                const e = db.eleves.find((x) => x.id === p.eleveId);
                return (
                  <tr key={p.id}>
                    <td><span style={{ fontFamily: "JetBrains Mono, monospace", fontWeight: 700, color: "var(--gold2)", fontSize: 12.5 }}>{p.reference}</span></td>
                    <td><PersonneCell prenom={e?.prenom} nom={e?.nom} id={p.eleveId} /></td>
                    <td><span style={{ fontFamily: "JetBrains Mono, monospace", fontWeight: 700, color: "var(--green)", fontSize: 14 }}>{formatFCFA(p.montant)}</span></td>
                    <td style={{ fontSize: 13 }}>{modesIcones[p.mode]} {p.mode}</td>
                    <td style={{ maxWidth: 150, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontSize: 12, color: "var(--txt3)" }}>{p.description || "—"}</td>
                    <td style={{ fontSize: 13 }}>{formatDate(p.date)}</td>
                    <td><Badge valeur={p.statut} /></td>
                    <td>
                      <div style={{ display: "flex", gap: 4 }}>
                        {p.statut === "En attente" && <button className="btn btn-success btn-xs" onClick={() => valider(p.id)}>Valider</button>}
                        {p.statut === "Payé" && (
                          <button className="btn btn-ghost btn-xs" onClick={() => {
                            const contenu = `REÇU DE PAIEMENT\nAutoGES Pro — Auto-École Excellence\n${"─".repeat(40)}\nRéf: ${p.reference}\nÉlève: ${e?.prenom} ${e?.nom}\nMontant: ${formatFCFA(p.montant)}\nDate: ${formatDate(p.date)}\nMode: ${p.mode}\nStatut: ${p.statut}\n${"─".repeat(40)}`;
                            telechargerFichier(contenu, `recu_${p.reference}.txt`);
                            toast("Reçu téléchargé", "info");
                          }}>Reçu</button>
                        )}
                        <button className="btn btn-danger btn-xs" onClick={() => supprimer(p.id)}>✕</button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {liste.length === 0 && <div className="empty-state"><div className="ei">◆</div><div className="et">Aucun paiement trouvé</div></div>}
      </div>

      {modal && (
        <Modal titre="Enregistrer un paiement" onClose={() => setModal(false)} large
          footer={<><button className="btn btn-ghost btn-sm" onClick={() => setModal(false)}>Annuler</button><button className="btn btn-gold btn-sm" onClick={enregistrer}>Enregistrer</button></>}>
          <div className="form-field"><label>Élève</label>
            <select value={form.eleveId} onChange={(e) => setForm({ ...form, eleveId: Number(e.target.value) })}>
              {db.eleves.map((e) => <option key={e.id} value={e.id}>{e.prenom} {e.nom} — Solde: {formatFCFA(e.solde)}</option>)}
            </select>
          </div>
          <div className="form-grid">
            <div className="form-field"><label>Montant (FCFA) *</label><input type="number" min="1" value={form.montant} onChange={(e) => setForm({ ...form, montant: e.target.value })} placeholder="Ex: 150 000" /></div>
            <div className="form-field"><label>Date</label><input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} /></div>
          </div>
          <div className="form-field">
            <label>Mode de paiement</label>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginTop: 6 }}>
              {["Mobile Money", "Espèces", "Virement", "Carte"].map((mode) => (
                <div
                  key={mode}
                  onClick={() => setModeSelectionne(mode)}
                  style={{
                    display: "flex", alignItems: "center", gap: 9,
                    padding: "10px 13px",
                    background: "var(--bg4)",
                    border: `1.5px solid ${modeSelectionne === mode ? "var(--gold)" : "var(--border)"}`,
                    borderRadius: 7, cursor: "pointer", transition: "all .12s",
                  }}
                >
                  <span style={{ fontSize: 18 }}>{modesIcones[mode]}</span>
                  <span style={{ fontSize: 13, fontWeight: 600, color: modeSelectionne === mode ? "var(--gold2)" : "var(--txt2)" }}>{mode}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="form-field"><label>Description</label><input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Ex: 1ère tranche — Permis B" /></div>
        </Modal>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
//  PAGE VÉHICULES
// ─────────────────────────────────────────────
function PageVehicules({ db, onMajDB, toast }) {
  const [modal, setModal] = useState(false);
  const [vehSel, setVehSel] = useState(null);
  const formVide = { marque: "", modele: "", immatriculation: "", annee: 2024, kilometrage: 0, type: "Voiture", carburant: "Essence", couleur: "", statut: "Disponible", assurance: "", visite: "", notes: "" };
  const [form, setForm] = useState(formVide);
  const icones = { Voiture: "🚗", Moto: "🏍️", Camion: "🚛", Bus: "🚌" };

  const ouvrir = (v = null) => { setVehSel(v); setForm(v ? { ...v } : formVide); setModal(true); };
  const enregistrer = () => {
    if (!form.marque || !form.modele || !form.immatriculation) { toast("Champs obligatoires manquants", "err"); return; }
    const data = { ...db };
    if (vehSel) {
      const idx = data.vehicules.findIndex((v) => v.id === vehSel.id);
      data.vehicules[idx] = { ...form, id: vehSel.id, annee: Number(form.annee), kilometrage: Number(form.kilometrage) };
    } else {
      data.vehicules.push({ ...form, id: prochainId(data.vehicules), annee: Number(form.annee), kilometrage: Number(form.kilometrage) });
    }
    sauvegarderDB(data); onMajDB(data);
    setModal(false);
    toast(vehSel ? "Véhicule modifié" : "Véhicule ajouté");
  };
  const supprimer = (id) => {
    if (!window.confirm("Supprimer ce véhicule ?")) return;
    const data = { ...db, vehicules: db.vehicules.filter((v) => v.id !== id) };
    sauvegarderDB(data); onMajDB(data);
    toast("Véhicule supprimé", "info");
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Parc automobile</h1>
          <p className="page-subtitle">{db.vehicules.length} véhicules · {db.vehicules.filter((v) => v.statut === "Disponible").length} disponibles</p>
        </div>
        <button className="btn btn-gold btn-sm" onClick={() => ouvrir()}>+ Ajouter un véhicule</button>
      </div>

      <div className="grid-auto">
        {db.vehicules.map((v) => (
          <div key={v.id} className="veh-card">
            <div className="veh-thumb">{icones[v.type] || "🚗"}</div>
            <div className="veh-body">
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
                <div>
                  <div style={{ fontFamily: "Syne, sans-serif", fontWeight: 700, fontSize: 14.5 }}>{v.marque} {v.modele}</div>
                  <div style={{ fontSize: 12, color: "var(--txt3)", marginTop: 4 }}>{v.immatriculation} · {v.couleur}</div>
                </div>
                <Badge valeur={v.statut} />
              </div>
              <div className="info-grid" style={{ fontSize: 12, marginBottom: 12 }}>
                <span className="info-key">Année</span><span className="info-val" style={{ fontFamily: "JetBrains Mono, monospace" }}>{v.annee}</span>
                <span className="info-key">Kilométrage</span><span className="info-val" style={{ fontFamily: "JetBrains Mono, monospace" }}>{v.kilometrage.toLocaleString()} km</span>
                <span className="info-key">Assurance</span><span className="info-val">{formatDate(v.assurance)}</span>
                <span className="info-key">Visite tech.</span><span className="info-val">{formatDate(v.visite)}</span>
              </div>
              {v.notes && <div style={{ fontSize: 12, color: "var(--txt2)", background: "var(--bg4)", borderRadius: 6, padding: "7px 10px", marginBottom: 12, fontStyle: "italic" }}>{v.notes}</div>}
              <div style={{ display: "flex", gap: 8 }}>
                <button className="btn btn-outline btn-sm" style={{ flex: 1 }} onClick={() => ouvrir(v)}>Modifier</button>
                <button className="btn btn-danger btn-sm" onClick={() => supprimer(v.id)}>✕</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {modal && (
        <Modal titre={vehSel ? "Modifier le véhicule" : "Ajouter un véhicule"} onClose={() => setModal(false)} large
          footer={<><button className="btn btn-ghost btn-sm" onClick={() => setModal(false)}>Annuler</button><button className="btn btn-gold btn-sm" onClick={enregistrer}>Enregistrer</button></>}>
          <div className="form-grid">
            <div className="form-field"><label>Marque *</label><input value={form.marque} onChange={(e) => setForm({ ...form, marque: e.target.value })} placeholder="Ex: Toyota" /></div>
            <div className="form-field"><label>Modèle *</label><input value={form.modele} onChange={(e) => setForm({ ...form, modele: e.target.value })} placeholder="Ex: Corolla" /></div>
          </div>
          <div className="form-grid">
            <div className="form-field"><label>Immatriculation *</label><input value={form.immatriculation} onChange={(e) => setForm({ ...form, immatriculation: e.target.value })} placeholder="LT 234 A" /></div>
            <div className="form-field"><label>Type</label>
              <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
                <option>Voiture</option><option>Moto</option><option>Camion</option>
              </select>
            </div>
          </div>
          <div className="form-grid">
            <div className="form-field"><label>Année</label><input type="number" value={form.annee} onChange={(e) => setForm({ ...form, annee: Number(e.target.value) })} /></div>
            <div className="form-field"><label>Kilométrage</label><input type="number" value={form.kilometrage} onChange={(e) => setForm({ ...form, kilometrage: Number(e.target.value) })} /></div>
          </div>
          <div className="form-grid">
            <div className="form-field"><label>Couleur</label><input value={form.couleur} onChange={(e) => setForm({ ...form, couleur: e.target.value })} /></div>
            <div className="form-field"><label>Statut</label>
              <select value={form.statut} onChange={(e) => setForm({ ...form, statut: e.target.value })}>
                <option>Disponible</option><option>En service</option><option>Maintenance</option><option>Hors service</option>
              </select>
            </div>
          </div>
          <div className="form-grid">
            <div className="form-field"><label>Assurance (expire le)</label><input type="date" value={form.assurance} onChange={(e) => setForm({ ...form, assurance: e.target.value })} /></div>
            <div className="form-field"><label>Visite technique</label><input type="date" value={form.visite} onChange={(e) => setForm({ ...form, visite: e.target.value })} /></div>
          </div>
          <div className="form-field"><label>Notes</label><textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} /></div>
        </Modal>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
//  PAGE DÉPENSES
// ─────────────────────────────────────────────
function PageDepenses({ db, onMajDB, toast }) {
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({ categorie: "Carburant", montant: "", date: aujourdhui(), description: "", validePar: "Admin" });
  const cats = ["Carburant", "Entretien", "Salaires", "Fournitures", "Loyer", "Taxes", "Communication", "Autre"];
  const total = db.depenses.reduce((s, d) => s + d.montant, 0);

  const enregistrer = () => {
    const m = Number(form.montant);
    if (!m || m <= 0) { toast("Montant invalide", "err"); return; }
    const data = { ...db };
    data.depenses.push({ ...form, id: prochainId(data.depenses), montant: m });
    sauvegarderDB(data); onMajDB(data);
    setModal(false);
    toast("Dépense enregistrée");
  };
  const supprimer = (id) => {
    if (!window.confirm("Supprimer ?")) return;
    const data = { ...db, depenses: db.depenses.filter((d) => d.id !== id) };
    sauvegarderDB(data); onMajDB(data);
    toast("Supprimé", "info");
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Dépenses</h1>
          <p className="page-subtitle">{db.depenses.length} dépenses · Total : <strong style={{ color: "var(--red)" }}>{formatFCFA(total)}</strong></p>
        </div>
        <button className="btn btn-gold btn-sm" onClick={() => setModal(true)}>+ Enregistrer</button>
      </div>

      {/* Résumé par catégorie */}
      <div className="grid-auto" style={{ marginBottom: 20 }}>
        {cats.filter((c) => db.depenses.some((d) => d.categorie === c)).map((c) => {
          const t = db.depenses.filter((d) => d.categorie === c).reduce((s, d) => s + d.montant, 0);
          return (
            <div key={c} className="kpi-card">
              <div className="kpi-label">{c}</div>
              <div className="kpi-value" style={{ fontSize: "clamp(14px,1.6vw,20px)", color: "var(--red)" }}>{formatFCFA(t)}</div>
            </div>
          );
        })}
      </div>

      <div className="card">
        <div className="tbl-wrap">
          <table className="tbl">
            <thead>
              <tr><th>Catégorie</th><th>Montant</th><th>Description</th><th>Date</th><th>Validé par</th><th></th></tr>
            </thead>
            <tbody>
              {[...db.depenses].reverse().map((d) => (
                <tr key={d.id}>
                  <td><Badge valeur={d.categorie} /></td>
                  <td><span style={{ fontFamily: "JetBrains Mono, monospace", fontWeight: 700, color: "var(--red)" }}>{formatFCFA(d.montant)}</span></td>
                  <td style={{ fontSize: 13 }}>{d.description}</td>
                  <td style={{ fontSize: 13 }}>{formatDate(d.date)}</td>
                  <td style={{ fontSize: 13 }}>{d.validePar}</td>
                  <td><button className="btn btn-danger btn-xs" onClick={() => supprimer(d.id)}>✕</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {db.depenses.length === 0 && <div className="empty-state"><div className="ei">◐</div><div className="et">Aucune dépense enregistrée</div></div>}
      </div>

      {modal && (
        <Modal titre="Enregistrer une dépense" onClose={() => setModal(false)}
          footer={<><button className="btn btn-ghost btn-sm" onClick={() => setModal(false)}>Annuler</button><button className="btn btn-gold btn-sm" onClick={enregistrer}>Enregistrer</button></>}>
          <div className="form-grid">
            <div className="form-field"><label>Catégorie</label>
              <select value={form.categorie} onChange={(e) => setForm({ ...form, categorie: e.target.value })}>
                {cats.map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div className="form-field"><label>Montant (FCFA) *</label><input type="number" min="1" value={form.montant} onChange={(e) => setForm({ ...form, montant: e.target.value })} /></div>
          </div>
          <div className="form-grid">
            <div className="form-field"><label>Date</label><input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} /></div>
            <div className="form-field"><label>Validé par</label><input value={form.validePar} onChange={(e) => setForm({ ...form, validePar: e.target.value })} /></div>
          </div>
          <div className="form-field"><label>Description</label><input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Description de la dépense" /></div>
        </Modal>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
//  PAGE NOTIFICATIONS
// ─────────────────────────────────────────────
function PageNotifications({ db, onMajDB, toast }) {
  const [form, setForm] = useState({ destinataire: "all", canal: "SMS", sujet: "", message: "" });
  const modeles = [
    { label: "Rappel leçon", message: "Votre leçon de conduite est prévue le [DATE] à [HEURE]. N'oubliez pas votre pièce d'identité." },
    { label: "Convocation examen", message: "Vous êtes convoqué(e) à l'examen [TYPE] le [DATE] au centre CENAC Douala." },
    { label: "Rappel paiement", message: "Votre solde impayé est de [MONTANT] FCFA. Merci de régulariser votre situation." },
    { label: "Félicitations", message: "Félicitations ! Vous avez obtenu votre permis de conduire. Bonne route !" },
    { label: "Séance annulée", message: "Votre séance du [DATE] est annulée. Nous vous recontacterons rapidement." },
  ];

  const envoyer = () => {
    if (!form.sujet || !form.message) { toast("Sujet et message requis", "err"); return; }
    const nomDest = form.destinataire === "all"
      ? "Tous les élèves"
      : (() => { const e = db.eleves.find((x) => x.id === Number(form.destinataire)); return e ? `${e.prenom} ${e.nom}` : "?"; })();
    const data = { ...db };
    data.notifications.push({
      id: prochainId(data.notifications),
      to: nomDest,
      eleveId: form.destinataire === "all" ? null : Number(form.destinataire),
      canal: form.canal,
      sujet: form.sujet,
      message: form.message,
      date: aujourdhui(),
      statut: "Envoyé",
    });
    sauvegarderDB(data); onMajDB(data);
    setForm({ ...form, sujet: "", message: "" });
    toast(`Message envoyé à ${nomDest}`);
  };

  const relanceImpay = () => {
    const impay = db.eleves.filter((e) => e.solde > 0);
    const data = { ...db };
    impay.forEach((e) => {
      data.notifications.push({
        id: prochainId(data.notifications),
        to: `${e.prenom} ${e.nom}`,
        eleveId: e.id,
        canal: "SMS",
        sujet: "Rappel paiement",
        message: `Votre solde impayé est de ${formatFCFA(e.solde)}. Merci de régulariser votre situation.`,
        date: aujourdhui(),
        statut: "Envoyé",
      });
    });
    sauvegarderDB(data); onMajDB(data);
    toast(`${impay.length} relance(s) envoyée(s)`);
  };

  const supprimer = (id) => {
    const data = { ...db, notifications: db.notifications.filter((n) => n.id !== id) };
    sauvegarderDB(data); onMajDB(data);
  };

  return (
    <div>
      <div className="page-header">
        <div><h1 className="page-title">Notifications</h1><p className="page-subtitle">Envoi de SMS et emails aux élèves</p></div>
        <button className="btn btn-outline btn-sm" onClick={relanceImpay}>
          Relance impayés ({db.eleves.filter((e) => e.solde > 0).length})
        </button>
      </div>

      <div className="grid-2">
        {/* Formulaire */}
        <div className="card">
          <div className="card-head"><h3>Composer un message</h3></div>
          <div className="card-body">
            <div className="form-field">
              <label>Destinataire</label>
              <select value={form.destinataire} onChange={(e) => setForm({ ...form, destinataire: e.target.value })}>
                <option value="all">Tous les élèves ({db.eleves.length})</option>
                {db.eleves.map((e) => (
                  <option key={e.id} value={e.id}>{e.prenom} {e.nom}{e.solde > 0 ? ` — ${formatFCFA(e.solde)}` : ""}</option>
                ))}
              </select>
            </div>
            <div className="form-field">
              <label>Canal</label>
              <div style={{ display: "flex", gap: 8 }}>
                {["SMS", "Email"].map((c) => (
                  <button key={c} className={`btn btn-sm ${form.canal === c ? "btn-gold" : "btn-ghost"}`} style={{ flex: 1 }} onClick={() => setForm({ ...form, canal: c })}>
                    {c}
                  </button>
                ))}
              </div>
            </div>
            <div className="form-field">
              <label>Modèles rapides</label>
              <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                {modeles.map((m) => (
                  <button key={m.label} className="btn btn-ghost btn-sm" style={{ justifyContent: "flex-start", textAlign: "left" }} onClick={() => setForm({ ...form, sujet: m.label, message: m.message })}>
                    {m.label}
                  </button>
                ))}
              </div>
            </div>
            <div className="form-field"><label>Sujet *</label><input value={form.sujet} onChange={(e) => setForm({ ...form, sujet: e.target.value })} placeholder="Objet du message" /></div>
            <div className="form-field"><label>Message *</label><textarea rows={3} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} placeholder="Rédigez votre message…" /></div>
            <button className="btn btn-gold" style={{ width: "100%", justifyContent: "center" }} onClick={envoyer} disabled={!form.sujet || !form.message}>
              Envoyer le message
            </button>
          </div>
        </div>

        {/* Historique */}
        <div className="card">
          <div className="card-head">
            <h3>Historique des envois</h3>
            <span style={{ fontFamily: "JetBrains Mono, monospace", color: "var(--txt3)", fontSize: 12 }}>{db.notifications.length}</span>
          </div>
          <div style={{ padding: "0 18px", maxHeight: 520, overflowY: "auto" }}>
            {[...db.notifications].reverse().map((n) => (
              <div key={n.id} style={{ display: "flex", gap: 11, padding: "12px 0", borderBottom: "1px solid rgba(255,255,255,.03)" }}>
                <div style={{ width: 32, height: 32, borderRadius: 8, background: n.canal === "SMS" ? "var(--blue-bg)" : "var(--gold-bg)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, flexShrink: 0 }}>
                  {n.canal === "SMS" ? "◈" : "✉"}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 600, fontSize: 13 }}>{n.sujet}</div>
                  <div style={{ fontSize: 12, color: "var(--txt3)", marginTop: 4 }}>À : {n.to}</div>
                  <div style={{ fontSize: 11.5, color: "var(--txt3)", marginTop: 3, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontStyle: "italic" }}>"{n.message}"</div>
                  <div style={{ display: "flex", gap: 8, marginTop: 6 }}>
                    <span style={{ fontSize: 12, color: "var(--txt3)" }}>{formatDate(n.date)}</span>
                    <Badge valeur="Actif" />
                  </div>
                </div>
                <button className="btn btn-danger btn-xs" style={{ alignSelf: "center" }} onClick={() => supprimer(n.id)}>✕</button>
              </div>
            ))}
            {db.notifications.length === 0 && (
              <div className="empty-state"><div className="ei">◑</div><div className="et">Aucun message envoyé</div></div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
//  PAGE BASE DE DONNÉES
// ─────────────────────────────────────────────
function PageBDD({ db, onMajDB, toast }) {
  const [tableActive, setTableActive] = useState("eleves");
  const [vue, setVue] = useState("table");
  const tables = ["eleves", "moniteurs", "lecons", "paiements", "examens", "vehicules", "notifications", "depenses"];
  const rows = db[tableActive] || [];
  const cols = rows.length ? Object.keys(rows[0]) : [];

  const reinitialiser = () => {
    if (!window.confirm("Réinitialiser toute la base de données ? Cette action est irréversible.")) return;
    sauvegarderDB(DONNEES_INITIALES);
    onMajDB(DONNEES_INITIALES);
    toast("Base de données réinitialisée", "info");
  };

  return (
    <div>
      <div className="page-header">
        <div><h1 className="page-title">Base de données</h1><p className="page-subtitle">Visualisation, export et gestion de toutes les données</p></div>
        <div className="page-actions">
          <button className="btn btn-ghost btn-sm" onClick={() => { telechargerFichier(genererSQL(db), `autoges_${aujourdhui()}.sql`); toast("Export SQL téléchargé", "info"); }}>⬇ SQL</button>
          <button className="btn btn-ghost btn-sm" onClick={() => { telechargerFichier(JSON.stringify(db, null, 2), "backup.json", "application/json"); toast("Backup JSON téléchargé", "info"); }}>⬇ JSON</button>
          <button className="btn btn-ghost btn-sm" onClick={() => { telechargerFichier(genererCSV(db[tableActive] || []), `${tableActive}.csv`, "text/csv"); toast("CSV exporté", "info"); }}>⬇ CSV</button>
          <button className="btn btn-danger btn-sm" onClick={reinitialiser}>Réinitialiser</button>
        </div>
      </div>

      {/* Sélecteur de tables */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(108px, 1fr))", gap: 10, marginBottom: 22 }}>
        {tables.map((t) => (
          <div key={t} className="kpi-card" style={{ cursor: "pointer", borderColor: t === tableActive ? "var(--gold)" : "var(--border)", padding: 14 }} onClick={() => setTableActive(t)}>
            <div className="kpi-label">{t}</div>
            <div className="kpi-value">{(db[t] || []).length}</div>
          </div>
        ))}
      </div>

      {/* Visualiseur */}
      <div className="card">
        <div className="card-head">
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <h3>Table</h3>
            <code style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 13, color: "var(--gold2)" }}>{tableActive}</code>
            <span className="badge badge-gold" style={{ fontFamily: "JetBrains Mono, monospace" }}>{rows.length} lignes</span>
          </div>
          <div style={{ display: "flex", gap: 6 }}>
            {["table", "sql", "json"].map((v) => (
              <button key={v} className={`btn btn-xs ${vue === v ? "btn-gold" : "btn-ghost"}`} onClick={() => setVue(v)}>
                {v.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
        <div style={{ padding: 18 }}>
          {vue === "table" && (
            <div className="tbl-wrap">
              <table className="tbl">
                <thead><tr>{cols.map((c) => <th key={c}>{c}</th>)}</tr></thead>
                <tbody>
                  {rows.map((r, i) => (
                    <tr key={i}>
                      {cols.map((c) => (
                        <td key={c} style={{ maxWidth: 160, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {r[c] === null || r[c] === "" ? <span style={{ color: "var(--txt3)" }}>null</span> : String(r[c])}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          {vue === "sql" && <pre className="code-block">{genererSQL(db)}</pre>}
          {vue === "json" && <pre className="code-block">{JSON.stringify(rows, null, 2)}</pre>}
          {rows.length === 0 && <div className="empty-state"><div className="ei">⊟</div><div className="et">Table vide</div></div>}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
//  PAGE PARAMÈTRES
// ─────────────────────────────────────────────
function PageParametres({ db, onMajDB, toast }) {
  const [metaForm, setMetaForm] = useState({ ...db.meta });

  const enregistrerMeta = () => {
    const data = { ...db, meta: { ...metaForm } };
    sauvegarderDB(data); onMajDB(data);
    toast("Paramètres enregistrés avec succès");
  };

  const reinitialiser = () => {
    if (!window.confirm("Réinitialiser toute la base de données ? Cette action est irréversible.")) return;
    sauvegarderDB(DONNEES_INITIALES);
    onMajDB(DONNEES_INITIALES);
    setMetaForm({ ...DONNEES_INITIALES.meta });
    toast("Base de données réinitialisée", "info");
  };

  return (
    <div>
      <div className="page-header">
        <div><h1 className="page-title">Paramètres</h1><p className="page-subtitle">Configuration de l'application AutoGES Pro</p></div>
      </div>

      {/* Infos structure */}
      <div className="settings-block">
        <div className="settings-head">◉ Informations de la structure</div>
        <div className="settings-body">
          <div className="form-grid">
            <div className="form-field"><label>Nom de la structure</label><input value={metaForm.nom} onChange={(e) => setMetaForm({ ...metaForm, nom: e.target.value })} /></div>
            <div className="form-field"><label>Slogan</label><input value={metaForm.slogan} onChange={(e) => setMetaForm({ ...metaForm, slogan: e.target.value })} /></div>
          </div>
          <div className="form-grid">
            <div className="form-field"><label>Adresse</label><input value={metaForm.adresse} onChange={(e) => setMetaForm({ ...metaForm, adresse: e.target.value })} /></div>
            <div className="form-field"><label>Téléphone</label><input value={metaForm.telephone} onChange={(e) => setMetaForm({ ...metaForm, telephone: e.target.value })} /></div>
          </div>
          <div className="form-field"><label>Email</label><input type="email" value={metaForm.email} onChange={(e) => setMetaForm({ ...metaForm, email: e.target.value })} /></div>
          <button className="btn btn-gold btn-sm" onClick={enregistrerMeta}>Enregistrer les modifications</button>
        </div>
      </div>

      {/* Exports */}
      <div className="settings-block">
        <div className="settings-head">⬇ Exports de données</div>
        <div className="settings-body">
          <p style={{ fontSize: 13, color: "var(--txt2)", marginBottom: 16, lineHeight: 1.65 }}>
            Exportez vos données dans différents formats. Le format SQL est compatible MySQL / phpMyAdmin.
          </p>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <button className="btn btn-outline btn-sm" onClick={() => { telechargerFichier(genererSQL(db), `autoges_${aujourdhui()}.sql`); toast("Export SQL téléchargé", "info"); }}>⬇ Export SQL (MySQL)</button>
            <button className="btn btn-outline btn-sm" onClick={() => { telechargerFichier(JSON.stringify(db, null, 2), "backup.json", "application/json"); toast("Backup JSON", "info"); }}>⬇ Backup JSON complet</button>
            <button className="btn btn-outline btn-sm" onClick={() => { telechargerFichier(genererCSV(db.eleves), "eleves.csv", "text/csv"); toast("Élèves CSV", "info"); }}>⬇ Élèves CSV</button>
            <button className="btn btn-outline btn-sm" onClick={() => { telechargerFichier(genererCSV(db.paiements), "paiements.csv", "text/csv"); toast("Paiements CSV", "info"); }}>⬇ Paiements CSV</button>
          </div>
        </div>
      </div>

      {/* Zone danger */}
      <div className="settings-block" style={{ borderColor: "rgba(248,113,113,0.2)" }}>
        <div className="settings-head" style={{ color: "var(--red)" }}>⚠ Zone de danger</div>
        <div className="settings-body">
          <p style={{ fontSize: 13, color: "var(--txt2)", marginBottom: 16, lineHeight: 1.65 }}>
            La réinitialisation supprimera toutes les données et restaurera les données de démonstration. Cette action est irréversible.
          </p>
          <button className="btn btn-danger btn-sm" onClick={reinitialiser}>
            Réinitialiser la base de données
          </button>
        </div>
      </div>

      {/* Infos système */}
      <div style={{ marginTop: 16, padding: "16px 20px", background: "var(--bg3)", border: "1px solid var(--border)", borderRadius: 12 }}>
        {[
          ["Application", "AutoGES Pro v1.0.0"],
          ["Développé pour", "BTS SIO option SLAM — IUG Douala, Cameroun"],
          ["Architecture", "React · localStorage · Export SQL/JSON/CSV"],
          ["Statut système", "✓ Opérationnel"],
        ].map(([k, v]) => (
          <div key={k} style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 8 }}>
            <span style={{ color: "var(--txt3)" }}>{k}</span>
            <span style={{ color: k === "Statut système" ? "var(--green)" : "var(--txt2)", fontWeight: k === "Statut système" ? 600 : 400 }}>{v}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
//  COMPOSANT PRINCIPAL — App
// ─────────────────────────────────────────────
export default function App() {
  const [connecte, setConnecte] = useState(false);
  const [page, setPage] = useState("home");
  const [sidebarOuverte, setSidebarOuverte] = useState(false);
  const [db, setDB] = useState(() => chargerDB());
  const { liste: toasts, ajouter: toast } = useToasts();

  // Mise à jour de la DB depuis n'importe quel enfant
  const majDB = useCallback((nouvellesData) => {
    setDB(nouvellesData);
  }, []);

  // Navigation
  const naviguer = useCallback((nouvellePage) => {
    setPage(nouvellePage);
    setSidebarOuverte(false);
  }, []);

  // Page de connexion
  if (!connecte) {
    return (
      <>
        <GlobalStyle />
        <PageConnexion onConnexion={() => setConnecte(true)} />
        <Toasts liste={toasts} />
      </>
    );
  }

  // Rendu des pages
  const props = { db, onMajDB: majDB, toast };
  const pageComponents = {
    home:          <PageDashboard {...props} onNaviguer={naviguer} />,
    eleves:        <PageEleves {...props} />,
    moniteurs:     <PageMoniteurs {...props} />,
    planning:      <PagePlanning {...props} />,
    examens:       <PageExamens {...props} />,
    paiements:     <PagePaiements {...props} />,
    vehicules:     <PageVehicules {...props} />,
    depenses:      <PageDepenses {...props} />,
    notifications: <PageNotifications {...props} />,
    bdd:           <PageBDD {...props} />,
    parametres:    <PageParametres {...props} />,
  };

  return (
    <>
      <GlobalStyle />
      {/* Overlay mobile sidebar */}
      {sidebarOuverte && (
        <div
          style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 99, backdropFilter: "blur(4px)" }}
          onClick={() => setSidebarOuverte(false)}
        />
      )}

      <Sidebar
        pageActive={page}
        onNaviguer={naviguer}
        onDeconnexion={() => setConnecte(false)}
        db={db}
        ouvert={sidebarOuverte}
      />

      <div className="main-wrap">
        <Topbar
          page={page}
          onNaviguer={naviguer}
          onDeconnexion={() => setConnecte(false)}
          onToggleSidebar={() => setSidebarOuverte(!sidebarOuverte)}
        />
        <div className="page" key={page}>
          {pageComponents[page] || <div style={{ padding: 32, color: "var(--txt3)" }}>Page introuvable</div>}
        </div>
      </div>

      <Toasts liste={toasts} />
    </>
  );
}
