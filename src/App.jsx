import { useState } from "react";

/* ─── STYLES GLOBAUX ─────────────────────────────────────────────── */
const CSS = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Space+Grotesk:wght@400;500;600;700&display=swap');

    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    :root {
      /* Couleurs principales — plus claires et équilibrées */
      --primary:       #E8470A;
      --primary-light: #FF6B35;
      --primary-soft:  rgba(232,71,10,0.10);
      --primary-glow:  rgba(232,71,10,0.20);

      --accent:  #F59E0B;
      --info:    #0EA5E9;
      --success: #10B981;
      --danger:  #EF4444;
      --purple:  #8B5CF6;

      /* Fond — plus clair que la version précédente */
      --bg:    #0E1117;
      --bg2:   #141920;
      --bg3:   #1C2333;
      --card:  #1A2130;
      --card2: #222D3E;

      /* Bordures */
      --border:      rgba(255,255,255,0.08);
      --border-soft: rgba(255,255,255,0.04);
      --border-acc:  rgba(232,71,10,0.25);

      /* Texte — hiérarchie claire */
      --text:   #EFF3FF;
      --text2:  #94A3B8;
      --text3:  #4B5A72;

      /* Espacements */
      --r:    14px;
      --r-sm: 9px;
      --r-lg: 20px;
    }

    html { font-size: 16px; }

    body {
      font-family: 'Plus Jakarta Sans', sans-serif;
      background: var(--bg);
      color: var(--text);
      overflow-x: hidden;
      -webkit-font-smoothing: antialiased;
    }

    ::-webkit-scrollbar { width: 5px; height: 5px; }
    ::-webkit-scrollbar-track { background: transparent; }
    ::-webkit-scrollbar-thumb { background: var(--border); border-radius: 10px; }

    /* ── LAYOUT ── */
    .app { display: flex; min-height: 100vh; }

    /* ── OVERLAY mobile ── */
    .overlay {
      display: none;
      position: fixed; inset: 0;
      background: rgba(0,0,0,.55);
      z-index: 99;
    }
    .overlay.show { display: block; }

    /* ── SIDEBAR ── */
    .sidebar {
      width: 240px;
      min-height: 100vh;
      background: var(--bg2);
      border-right: 1px solid var(--border);
      display: flex;
      flex-direction: column;
      position: fixed;
      top: 0; left: 0;
      z-index: 100;
      transition: transform .28s cubic-bezier(.4,0,.2,1);
    }

    .s-logo {
      padding: 20px 16px;
      border-bottom: 1px solid var(--border);
      display: flex; align-items: center; gap: 11px;
    }
    .s-icon {
      width: 38px; height: 38px;
      background: var(--primary);
      border-radius: 10px;
      display: flex; align-items: center; justify-content: center;
      font-size: 18px; flex-shrink: 0;
      box-shadow: 0 4px 12px var(--primary-glow);
    }
    .s-name {
      font-family: 'Space Grotesk', sans-serif;
      font-size: 15px; font-weight: 700;
      color: var(--text); line-height: 1.15;
    }
    .s-tag {
      font-size: 10px; font-weight: 600;
      color: var(--primary);
      text-transform: uppercase; letter-spacing: 1px;
    }

    .s-nav { flex: 1; padding: 12px 10px; overflow-y: auto; }
    .s-section { margin-bottom: 20px; }
    .s-label {
      font-size: 9.5px; font-weight: 700;
      color: var(--text3);
      text-transform: uppercase; letter-spacing: 1.5px;
      padding: 0 8px 8px;
    }
    .nav-item {
      display: flex; align-items: center; gap: 9px;
      padding: 9px 10px; border-radius: 9px;
      cursor: pointer; transition: all .18s;
      color: var(--text2); font-size: 13.5px; font-weight: 500;
      margin-bottom: 2px; user-select: none;
    }
    .nav-item:hover { background: var(--bg3); color: var(--text); }
    .nav-item.active {
      background: linear-gradient(130deg, var(--primary), var(--primary-light));
      color: #fff;
      box-shadow: 0 4px 14px var(--primary-glow);
    }
    .nav-item .n-ico { font-size: 16px; width: 20px; text-align: center; flex-shrink: 0; }
    .n-badge {
      margin-left: auto;
      background: var(--primary); color: #fff;
      font-size: 10px; font-weight: 700;
      padding: 1px 7px; border-radius: 20px; min-width: 18px; text-align: center;
    }
    .nav-item.active .n-badge { background: rgba(255,255,255,.25); }

    .s-footer {
      padding: 12px 10px;
      border-top: 1px solid var(--border);
    }
    .u-card {
      display: flex; align-items: center; gap: 10px;
      padding: 9px 10px; background: var(--bg3); border-radius: 10px; cursor: pointer;
    }
    .u-av {
      width: 33px; height: 33px; border-radius: 9px;
      background: linear-gradient(130deg,var(--primary),var(--accent));
      display: flex; align-items: center; justify-content: center;
      font-weight: 700; font-size: 12px; color: #fff; flex-shrink: 0;
    }
    .u-name { font-size: 13px; font-weight: 600; color: var(--text); line-height: 1.2; }
    .u-role { font-size: 11px; color: var(--text2); }

    /* ── MAIN ── */
    .main { flex: 1; margin-left: 240px; display: flex; flex-direction: column; min-height: 100vh; }

    /* ── TOPBAR ── */
    .topbar {
      height: 60px;
      background: var(--bg2);
      border-bottom: 1px solid var(--border);
      display: flex; align-items: center;
      padding: 0 22px; gap: 12px;
      position: sticky; top: 0; z-index: 50;
    }
    .hamburger {
      display: none;
      width: 34px; height: 34px; border-radius: 8px;
      border: 1px solid var(--border); background: var(--bg3);
      align-items: center; justify-content: center;
      cursor: pointer; font-size: 16px; color: var(--text2);
      flex-shrink: 0;
    }
    .t-title {
      font-family: 'Space Grotesk', sans-serif;
      font-size: 17px; font-weight: 700; flex: 1;
      white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
    }
    .t-search {
      display: flex; align-items: center; gap: 8px;
      background: var(--bg3); border: 1px solid var(--border);
      border-radius: 9px; padding: 7px 12px; width: 230px;
      transition: border-color .2s;
    }
    .t-search:focus-within { border-color: var(--primary); }
    .t-search input {
      background: none; border: none; outline: none;
      color: var(--text); font-size: 13px;
      font-family: 'Plus Jakarta Sans', sans-serif; width: 100%;
    }
    .t-search input::placeholder { color: var(--text3); }
    .t-actions { display: flex; align-items: center; gap: 8px; }
    .icon-btn {
      width: 34px; height: 34px; border-radius: 8px;
      border: 1px solid var(--border); background: var(--bg3);
      display: flex; align-items: center; justify-content: center;
      cursor: pointer; color: var(--text2); font-size: 14px;
      transition: all .18s; position: relative; flex-shrink: 0;
    }
    .icon-btn:hover { border-color: var(--primary); color: var(--primary); }
    .notif-dot {
      position: absolute; top: 5px; right: 5px;
      width: 6px; height: 6px;
      background: var(--primary); border-radius: 50%;
      border: 1.5px solid var(--bg2);
    }

    /* ── PAGE ── */
    .page { padding: 22px; flex: 1; }
    .p-header {
      display: flex; align-items: flex-start;
      justify-content: space-between; margin-bottom: 22px;
      flex-wrap: wrap; gap: 12px;
    }
    .p-title {
      font-family: 'Space Grotesk', sans-serif;
      font-size: clamp(18px, 3vw, 23px);
      font-weight: 700; line-height: 1.2;
    }
    .p-sub { font-size: 13px; color: var(--text2); margin-top: 4px; }
    .p-actions { display: flex; gap: 8px; flex-wrap: wrap; }

    /* ── BUTTONS ── */
    .btn {
      display: inline-flex; align-items: center; gap: 6px;
      padding: 8px 16px; border-radius: 9px;
      font-size: 13px; font-weight: 600;
      cursor: pointer; border: none;
      transition: all .18s;
      font-family: 'Plus Jakarta Sans', sans-serif;
      white-space: nowrap; flex-shrink: 0;
    }
    .btn-primary {
      background: linear-gradient(130deg, var(--primary), var(--primary-light));
      color: #fff; box-shadow: 0 3px 12px var(--primary-glow);
    }
    .btn-primary:hover { transform: translateY(-1px); box-shadow: 0 5px 18px var(--primary-glow); }
    .btn-ghost { background: var(--card2); color: var(--text2); border: 1px solid var(--border); }
    .btn-ghost:hover { color: var(--text); border-color: var(--border-acc); }
    .btn-danger { background: rgba(239,68,68,.12); color: var(--danger); border: 1px solid rgba(239,68,68,.2); }
    .btn-success { background: rgba(16,185,129,.12); color: var(--success); border: 1px solid rgba(16,185,129,.2); }
    .btn-sm { padding: 5px 12px; font-size: 12px; border-radius: 7px; }

    /* ── CARDS ── */
    .card {
      background: var(--card); border: 1px solid var(--border);
      border-radius: var(--r-lg); overflow: hidden;
    }
    .card-header {
      padding: 15px 18px; border-bottom: 1px solid var(--border);
      display: flex; align-items: center; justify-content: space-between;
    }
    .card-title {
      font-family: 'Space Grotesk', sans-serif;
      font-size: 14px; font-weight: 700;
    }
    .card-body { padding: 18px; }

    /* ── STAT CARDS ── */
    .stat-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 14px; margin-bottom: 20px;
    }
    .stat-card {
      background: var(--card); border: 1px solid var(--border);
      border-radius: var(--r-lg); padding: 18px;
      position: relative; overflow: hidden;
      transition: all .25s;
    }
    .stat-card::before {
      content: ''; position: absolute;
      top: 0; left: 0; right: 0; height: 3px;
    }
    .stat-card.c-orange::before { background: linear-gradient(90deg,var(--primary),var(--accent)); }
    .stat-card.c-blue::before   { background: linear-gradient(90deg,var(--info),#38BDF8); }
    .stat-card.c-green::before  { background: linear-gradient(90deg,var(--success),#34D399); }
    .stat-card.c-purple::before { background: linear-gradient(90deg,var(--purple),#A78BFA); }
    .stat-card:hover { transform: translateY(-2px); border-color: var(--border-acc); }

    .stat-icon {
      width: 40px; height: 40px; border-radius: 10px;
      display: flex; align-items: center; justify-content: center;
      font-size: 18px; margin-bottom: 14px;
    }
    .stat-icon.c-orange { background: rgba(232,71,10,.12); }
    .stat-icon.c-blue   { background: rgba(14,165,233,.12); }
    .stat-icon.c-green  { background: rgba(16,185,129,.12); }
    .stat-icon.c-purple { background: rgba(139,92,246,.12); }

    .stat-value {
      font-family: 'Space Grotesk', sans-serif;
      font-size: clamp(22px, 3vw, 28px);
      font-weight: 700; line-height: 1;
      margin-bottom: 5px; letter-spacing: -.5px;
    }
    .stat-label {
      font-size: 11.5px; color: var(--text2);
      font-weight: 500; text-transform: uppercase; letter-spacing: .6px;
    }
    .stat-trend {
      font-size: 11.5px; font-weight: 600;
      margin-top: 10px; display: flex; align-items: center; gap: 4px;
    }
    .stat-trend.up { color: var(--success); }
    .stat-trend.dn { color: var(--danger); }

    /* ── GRID ── */
    .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
    .grid-3 { display: grid; grid-template-columns: repeat(3,1fr); gap: 14px; }
    .grid-auto { display: grid; grid-template-columns: repeat(auto-fill,minmax(270px,1fr)); gap: 14px; }

    /* ── TABLE ── */
    .tbl-wrap { overflow-x: auto; }
    .tbl {
      width: 100%; border-collapse: collapse;
      font-size: 13px; min-width: 500px;
    }
    .tbl th {
      padding: 10px 14px; text-align: left;
      font-size: 10.5px; font-weight: 700;
      color: var(--text3); text-transform: uppercase;
      letter-spacing: 1px; border-bottom: 1px solid var(--border);
      white-space: nowrap; background: var(--card);
      position: sticky; top: 0;
    }
    .tbl td {
      padding: 11px 14px; color: var(--text2);
      border-bottom: 1px solid var(--border-soft);
      vertical-align: middle;
    }
    .tbl tr:last-child td { border-bottom: none; }
    .tbl tr:hover td { background: var(--bg3); }
    .cell-name { display: flex; align-items: center; gap: 9px; }

    /* ── AVATARS ── */
    .av {
      width: 33px; height: 33px; border-radius: 9px;
      display: flex; align-items: center; justify-content: center;
      font-weight: 700; font-size: 12px; flex-shrink: 0;
      letter-spacing: .3px;
    }
    .av-lg { width: 44px; height: 44px; border-radius: 12px; font-size: 14px; }
    .av-or { background: rgba(232,71,10,.18); color: var(--primary); }
    .av-bl { background: rgba(14,165,233,.15); color: var(--info); }
    .av-gr { background: rgba(16,185,129,.15); color: var(--success); }
    .av-pu { background: rgba(139,92,246,.15); color: var(--purple); }
    .av-yl { background: rgba(245,158,11,.15); color: var(--accent); }

    /* ── BADGES ── */
    .badge {
      display: inline-flex; align-items: center; gap: 5px;
      padding: 3px 9px; border-radius: 20px;
      font-size: 11px; font-weight: 700;
      letter-spacing: .3px; white-space: nowrap;
    }
    .badge::before {
      content: ''; width: 5px; height: 5px;
      border-radius: 50%; background: currentColor; flex-shrink: 0;
    }
    .b-ok { background: rgba(16,185,129,.12); color: var(--success); }
    .b-wn { background: rgba(245,158,11,.12); color: var(--accent); }
    .b-er { background: rgba(239,68,68,.12); color: var(--danger); }
    .b-in { background: rgba(14,165,233,.12); color: var(--info); }
    .b-or { background: rgba(232,71,10,.12); color: var(--primary); }
    .b-pu { background: rgba(139,92,246,.12); color: var(--purple); }

    /* ── PROGRESS ── */
    .prog { height: 5px; background: var(--bg3); border-radius: 3px; overflow: hidden; }
    .prog-fill { height: 100%; border-radius: 3px; transition: width .5s ease; }
    .prog-or { background: linear-gradient(90deg,var(--primary),var(--accent)); }
    .prog-bl { background: linear-gradient(90deg,var(--info),#38BDF8); }
    .prog-gr { background: linear-gradient(90deg,var(--success),#34D399); }
    .prog-pu { background: linear-gradient(90deg,var(--purple),#A78BFA); }

    /* ── FORMS ── */
    .fg { margin-bottom: 15px; }
    .fl {
      display: block; font-size: 11.5px; font-weight: 600;
      color: var(--text2); margin-bottom: 6px;
      text-transform: uppercase; letter-spacing: .5px;
    }
    .fi {
      width: 100%; padding: 9px 13px;
      background: var(--bg3); border: 1px solid var(--border);
      border-radius: 9px; color: var(--text);
      font-size: 13.5px; font-family: 'Plus Jakarta Sans', sans-serif;
      outline: none; transition: border-color .2s;
      appearance: none;
    }
    .fi:focus { border-color: var(--primary); box-shadow: 0 0 0 3px var(--primary-soft); }
    .fi::placeholder { color: var(--text3); }
    .fgrid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }

    /* ── MODAL ── */
    .modal-bg {
      position: fixed; inset: 0;
      background: rgba(0,0,0,.65); backdrop-filter: blur(5px);
      display: flex; align-items: center; justify-content: center;
      z-index: 999; padding: 16px;
    }
    .modal-box {
      background: var(--card); border: 1px solid var(--border);
      border-radius: 18px; width: 100%; max-width: 520px;
      max-height: 90vh; overflow-y: auto;
      box-shadow: 0 20px 60px rgba(0,0,0,.5);
      animation: fadeUp .25s ease;
    }
    .modal-head {
      padding: 18px 20px; border-bottom: 1px solid var(--border);
      display: flex; align-items: center; justify-content: space-between;
      position: sticky; top: 0; background: var(--card); z-index: 2;
    }
    .modal-title {
      font-family: 'Space Grotesk', sans-serif;
      font-size: 16px; font-weight: 700;
    }
    .modal-close {
      width: 28px; height: 28px; border-radius: 7px;
      background: var(--bg3); border: none;
      color: var(--text2); cursor: pointer; font-size: 16px;
      display: flex; align-items: center; justify-content: center;
      transition: color .18s;
    }
    .modal-close:hover { color: var(--danger); }
    .modal-body { padding: 20px; }
    .modal-foot {
      padding: 14px 20px; border-top: 1px solid var(--border);
      display: flex; gap: 8px; justify-content: flex-end;
    }

    /* ── SEARCH BAR ── */
    .filter-bar { display: flex; gap: 9px; margin-bottom: 16px; flex-wrap: wrap; }
    .search-wrap {
      display: flex; align-items: center; gap: 7px;
      background: var(--card); border: 1px solid var(--border);
      border-radius: 9px; padding: 7px 12px; flex: 1; min-width: 180px;
    }
    .search-wrap input {
      background: none; border: none; outline: none;
      color: var(--text); font-size: 13px;
      font-family: 'Plus Jakarta Sans', sans-serif; width: 100%;
    }
    .search-wrap input::placeholder { color: var(--text3); }

    /* ── MONITOR CARD ── */
    .m-card {
      background: var(--card); border: 1px solid var(--border);
      border-radius: var(--r-lg); padding: 18px;
      transition: all .25s;
    }
    .m-card:hover { border-color: var(--border-acc); transform: translateY(-2px); box-shadow: 0 6px 24px var(--primary-soft); }
    .m-head { display: flex; align-items: center; gap: 12px; margin-bottom: 14px; }
    .m-name { font-family:'Space Grotesk',sans-serif; font-size:15px; font-weight:700; }
    .m-role { font-size:12px; color:var(--primary); font-weight:600; margin-top:2px; }
    .stars { color:var(--accent); font-size:12px; letter-spacing:.5px; }
    .m-stats { display:grid; grid-template-columns:repeat(3,1fr); gap:10px; margin-top:14px; text-align:center; }
    .m-stat-v { font-family:'Space Grotesk',sans-serif; font-size:18px; font-weight:700; }
    .m-stat-l { font-size:10px; color:var(--text3); text-transform:uppercase; letter-spacing:.5px; margin-top:2px; }

    /* ── VEHICLE CARD ── */
    .v-card {
      background:var(--card); border:1px solid var(--border);
      border-radius:var(--r-lg); padding:16px; transition:all .25s;
    }
    .v-card:hover { border-color:var(--border-acc); }
    .v-img {
      width:100%; height:100px; background:var(--bg3);
      border-radius:10px; display:flex; align-items:center;
      justify-content:center; font-size:44px; margin-bottom:13px;
    }

    /* ── NOTIF ITEM ── */
    .notif-item {
      display:flex; gap:11px; padding:12px 0;
      border-bottom:1px solid var(--border-soft);
    }
    .notif-item:last-child { border-bottom:none; }
    .notif-ico {
      width:33px; height:33px; border-radius:9px;
      display:flex; align-items:center; justify-content:center;
      font-size:14px; flex-shrink:0;
    }

    /* ── PAYMENT METHOD ── */
    .pay-method {
      display:flex; align-items:center; gap:10px;
      padding:11px 13px; background:var(--bg3);
      border:1px solid var(--border); border-radius:10px;
      cursor:pointer; transition:all .18s; margin-bottom:7px;
    }
    .pay-method:hover, .pay-method.sel { border-color:var(--primary); background:var(--primary-soft); }

    /* ── TIMELINE ── */
    .tl { display:flex; flex-direction:column; }
    .tl-item { display:flex; gap:12px; padding-bottom:16px; position:relative; }
    .tl-item:last-child { padding-bottom:0; }
    .tl-item:not(:last-child)::after {
      content:''; position:absolute; left:13px; top:28px; bottom:0;
      width:1px; background:var(--border);
    }
    .tl-dot {
      width:28px; height:28px; border-radius:8px; flex-shrink:0;
      display:flex; align-items:center; justify-content:center; font-size:13px; z-index:1;
    }
    .tl-t { font-size:13px; font-weight:600; color:var(--text); }
    .tl-s { font-size:11.5px; color:var(--text3); margin-top:2px; }

    /* ── TOP ITEM ── */
    .top-item { display:flex; align-items:center; gap:10px; padding:10px 0; border-bottom:1px solid var(--border-soft); }
    .top-item:last-child { border-bottom:none; }
    .rank { width:22px; height:22px; border-radius:6px; display:flex; align-items:center; justify-content:center; font-size:10px; font-weight:800; flex-shrink:0; }
    .r1 { background:rgba(245,158,11,.18); color:var(--accent); }
    .r2 { background:rgba(14,165,233,.14); color:var(--info); }
    .r3 { background:rgba(139,92,246,.14); color:var(--purple); }
    .r0 { background:var(--bg3); color:var(--text3); }

    /* ── MISC ── */
    .divider { height:1px; background:var(--border); margin:13px 0; }
    .row { display:flex; align-items:center; }
    .between { justify-content:space-between; }
    .ml-auto { margin-left:auto; }
    .gap-6 { gap:6px; } .gap-8 { gap:8px; } .gap-10 { gap:10px; }
    .mt-4 { margin-top:4px; } .mt-8 { margin-top:8px; } .mt-12 { margin-top:12px; }
    .mb-12 { margin-bottom:12px; } .mb-16 { margin-bottom:16px; }
    .text-muted { color:var(--text2); font-size:13px; }
    .text-xs { font-size:11px; color:var(--text3); }
    .fw7 { font-weight:700; }
    .font-num { font-family:'Space Grotesk',sans-serif; }
    .empty { text-align:center; padding:48px 20px; color:var(--text3); }
    .empty .e-ico { font-size:40px; margin-bottom:12px; opacity:.4; }
    .empty .e-txt { font-size:14px; font-weight:600; color:var(--text2); }

    /* ── ANIMATIONS ── */
    @keyframes fadeUp { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:translateY(0); } }
    @keyframes fadeIn { from { opacity:0; } to { opacity:1; } }
    .fade-up { animation: fadeUp .3s ease; }

    /* ── RESPONSIVE ── */
    @media (max-width: 1024px) {
      .stat-grid { grid-template-columns: repeat(2,1fr); }
      .grid-2 { grid-template-columns: 1fr; }
      .t-search { display: none; }
    }

    @media (max-width: 768px) {
      .sidebar {
        transform: translateX(-100%);
        width: 220px;
      }
      .sidebar.open { transform: translateX(0); }
      .main { margin-left: 0; }
      .hamburger { display: flex; }
      .stat-grid { grid-template-columns: repeat(2,1fr); }
      .grid-3 { grid-template-columns: repeat(2,1fr); }
      .page { padding: 14px; }
      .topbar { padding: 0 14px; }
      .p-title { font-size: 18px; }
      .fgrid { grid-template-columns: 1fr; }
      .grid-auto { grid-template-columns: 1fr; }
      .tbl { font-size: 12px; }
      .tbl th, .tbl td { padding: 9px 10px; }
    }

    @media (max-width: 480px) {
      .stat-grid { grid-template-columns: 1fr 1fr; gap: 10px; }
      .stat-card { padding: 14px; }
      .stat-value { font-size: 20px; }
      .stat-label { font-size: 10px; }
      .btn { padding: 7px 13px; font-size: 12px; }
      .p-header { flex-direction: column; align-items: flex-start; }
      .grid-3 { grid-template-columns: 1fr; }
      .filter-bar { gap: 6px; }
      .topbar { height: 54px; }
    }
  `}</style>
);

/* ─── DONNÉES ─────────────────────────────────────────────────────── */
const AVC = ["or","bl","gr","pu","yl"];
const avc = (id) => AVC[(id-1) % AVC.length];
const ini = (n,p) => `${(p||"")[0]||""}${(n||"")[0]||""}`.toUpperCase();
const fF  = (n) => n?.toLocaleString("fr-FR") + " FCFA";
const fD  = (d) => d ? new Date(d).toLocaleDateString("fr-FR") : "—";
const strs = (n) => "★".repeat(Math.floor(n)) + "☆".repeat(5-Math.floor(n));

const E0 = [
  {id:1,nom:"Mbarga",prenom:"Joël",email:"joel@gmail.com",tel:"699 001 002",ins:"2025-01-10",mid:1,stat:"Actif",h:18,tot:30,solde:45000,permis:"B",ex:"Réussi"},
  {id:2,nom:"Eyenga",prenom:"Sandra",email:"sandra@gmail.com",tel:"677 234 567",ins:"2025-02-05",mid:2,stat:"Actif",h:10,tot:30,solde:120000,permis:"B",ex:"En attente"},
  {id:3,nom:"Nkodo",prenom:"Paul",email:"paul@gmail.com",tel:"655 111 222",ins:"2024-11-20",mid:1,stat:"Diplômé",h:30,tot:30,solde:0,permis:"B",ex:"Réussi"},
  {id:4,nom:"Biya",prenom:"Marie",email:"marie@gmail.com",tel:"690 345 678",ins:"2025-03-01",mid:3,stat:"Actif",h:5,tot:30,solde:150000,permis:"A",ex:"En attente"},
  {id:5,nom:"Ateba",prenom:"Chris",email:"chris@gmail.com",tel:"676 456 789",ins:"2025-01-28",mid:2,stat:"Suspendu",h:12,tot:30,solde:85000,permis:"B",ex:"Échoué"},
  {id:6,nom:"Fouda",prenom:"Aline",email:"aline@gmail.com",tel:"691 789 012",ins:"2025-03-15",mid:1,stat:"Actif",h:22,tot:30,solde:30000,permis:"B",ex:"Réussi"},
  {id:7,nom:"Tamba",prenom:"Léo",email:"leo@gmail.com",tel:"674 321 654",ins:"2025-02-20",mid:3,stat:"Actif",h:8,tot:30,solde:95000,permis:"A",ex:"En attente"},
];
const M0 = [
  {id:1,nom:"Essomba",prenom:"Roger",email:"roger@autoecole.cm",tel:"697 001 001",spe:"Permis B",stat:"Actif",note:4.8,sal:180000,exp:"5 ans"},
  {id:2,nom:"Fouda",prenom:"Carine",email:"carine@autoecole.cm",tel:"675 002 002",spe:"Permis B/A",stat:"Actif",note:4.6,sal:165000,exp:"3 ans"},
  {id:3,nom:"Mvondo",prenom:"Jules",email:"jules@autoecole.cm",tel:"654 003 003",spe:"Permis A",stat:"Congé",note:4.3,sal:155000,exp:"2 ans"},
  {id:4,nom:"Ngono",prenom:"Béatrice",email:"bea@autoecole.cm",tel:"698 004 004",spe:"Permis B",stat:"Actif",note:4.7,sal:170000,exp:"4 ans"},
];
const L0 = [
  {id:1,eid:1,mid:1,date:"2025-03-22",h:"08:00",dur:2,type:"Conduite",stat:"Confirmée",veh:"Toyota Corolla — LT 234 A"},
  {id:2,eid:2,mid:2,date:"2025-03-22",h:"10:00",dur:1,type:"Code",stat:"Confirmée",veh:"Salle A"},
  {id:3,eid:4,mid:3,date:"2025-03-22",h:"14:00",dur:2,type:"Conduite",stat:"En attente",veh:"Honda CB500 — LT 567 B"},
  {id:4,eid:6,mid:1,date:"2025-03-23",h:"09:00",dur:2,type:"Conduite",stat:"Confirmée",veh:"Renault Logan — LT 890 C"},
  {id:5,eid:7,mid:3,date:"2025-03-23",h:"11:00",dur:1,type:"Code",stat:"Annulée",veh:"Salle B"},
];
const P0 = [
  {id:1,eid:1,mt:55000,date:"2025-03-10",mode:"Mobile Money",stat:"Payé",ref:"PAY-4821"},
  {id:2,eid:2,mt:80000,date:"2025-03-12",mode:"Espèces",stat:"Payé",ref:"PAY-4822"},
  {id:3,eid:4,mt:100000,date:"2025-03-15",mode:"Virement",stat:"En attente",ref:"PAY-4823"},
  {id:4,eid:6,mt:70000,date:"2025-03-18",mode:"Mobile Money",stat:"Payé",ref:"PAY-4824"},
  {id:5,eid:7,mt:55000,date:"2025-03-20",mode:"Espèces",stat:"Payé",ref:"PAY-4825"},
];
const X0 = [
  {id:1,eid:1,type:"Code",date:"2025-02-14",sc:38,seuil:35,centre:"CENAC Douala",stat:"Réussi"},
  {id:2,eid:1,type:"Conduite",date:"2025-03-05",sc:82,seuil:70,centre:"CENAC Douala",stat:"Réussi"},
  {id:3,eid:3,type:"Code",date:"2024-12-10",sc:40,seuil:35,centre:"CENAC Douala",stat:"Réussi"},
  {id:4,eid:3,type:"Conduite",date:"2025-01-08",sc:78,seuil:70,centre:"CENAC Douala",stat:"Réussi"},
  {id:5,eid:5,type:"Code",date:"2025-02-20",sc:30,seuil:35,centre:"CENAC Douala",stat:"Échoué"},
  {id:6,eid:6,type:"Code",date:"2025-03-01",sc:37,seuil:35,centre:"CENAC Douala",stat:"Réussi"},
];

/* ─── BADGE ──────────────────────────────────────────────────────── */
const Bdg = ({v}) => {
  const m = {Actif:"ok",Diplômé:"in",Suspendu:"er",Congé:"wn",
             Confirmée:"ok","En attente":"wn",Annulée:"er",
             Payé:"ok",Réussi:"ok",Échoué:"er"};
  return <span className={`badge b-${m[v]||"in"}`}>{v}</span>;
};

/* ─── MODAL ──────────────────────────────────────────────────────── */
const Modal = ({title,onClose,footer,children}) => (
  <div className="modal-bg" onClick={e=>e.target===e.currentTarget&&onClose()}>
    <div className="modal-box">
      <div className="modal-head">
        <div className="modal-title">{title}</div>
        <button className="modal-close" onClick={onClose}>×</button>
      </div>
      <div className="modal-body">{children}</div>
      {footer && <div className="modal-foot">{footer}</div>}
    </div>
  </div>
);

/* ─── DASHBOARD ──────────────────────────────────────────────────── */
const Dashboard = ({E,M,L,P,X}) => {
  const actifs = E.filter(e=>e.stat==="Actif").length;
  const ca     = P.filter(p=>p.stat==="Payé").reduce((s,p)=>s+p.mt,0);
  const tr     = X.length ? Math.round(X.filter(x=>x.stat==="Réussi").length/X.length*100) : 0;
  const today  = L.filter(l=>l.date==="2025-03-22");
  const top    = [...E].sort((a,b)=>b.h-a.h).slice(0,4);

  const acts = [
    {ico:"👤",t:"Nouvel élève inscrit",d:"Marie Biya — Permis A",time:"2h",bg:"rgba(232,71,10,.1)"},
    {ico:"📅",t:"Leçon confirmée",d:"Joël Mbarga · Roger Essomba",time:"4h",bg:"rgba(14,165,233,.1)"},
    {ico:"💳",t:"Paiement reçu",d:"80 000 FCFA — Sandra Eyenga",time:"14h30",bg:"rgba(16,185,129,.1)"},
    {ico:"🎓",t:"Examen réussi",d:"Aline Fouda — Code de la route",time:"3j",bg:"rgba(245,158,11,.1)"},
  ];

  return (
    <div className="fade-up">
      <div className="p-header">
        <div>
          <div className="p-title">Tableau de bord</div>
          <div className="p-sub">Bienvenue ! Aperçu de votre activité en temps réel.</div>
        </div>
        <div className="p-actions">
          <button className="btn btn-ghost">📥 Exporter</button>
          <button className="btn btn-primary">+ Nouvel élève</button>
        </div>
      </div>

      {/* KPI */}
      <div className="stat-grid">
        {[
          {c:"c-orange",ico:"👥",v:actifs,l:"Élèves actifs",tr:"+8%",up:true},
          {c:"c-green", ico:"🎓",v:`${tr}%`,l:"Taux de réussite",tr:"+3%",up:true},
          {c:"c-blue",  ico:"📅",v:L.length,l:"Leçons planifiées",tr:"+12%",up:true},
          {c:"c-purple",ico:"💰",v:fF(ca),l:"Chiffre d'affaires",tr:"+15%",up:true},
        ].map((s,i)=>(
          <div className={`stat-card ${s.c}`} key={i}>
            <div className={`stat-icon ${s.c}`}>{s.ico}</div>
            <div className="stat-value font-num">{s.v}</div>
            <div className="stat-label">{s.l}</div>
            <div className={`stat-trend ${s.up?"up":"dn"}`}>
              {s.up?"▲":"▼"} {s.tr} ce mois
            </div>
          </div>
        ))}
      </div>

      <div className="grid-2 mb-12">
        {/* Activité */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">⚡ Activité récente</div>
            <span className="badge b-or">Aujourd'hui</span>
          </div>
          <div className="card-body" style={{paddingTop:10,paddingBottom:10}}>
            <div className="tl">
              {acts.map((a,i)=>(
                <div className="tl-item" key={i}>
                  <div className="tl-dot" style={{background:a.bg}}>{a.ico}</div>
                  <div>
                    <div className="tl-t">{a.t}</div>
                    <div className="tl-s">{a.d} · il y a {a.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Top progression */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">🏆 Meilleure progression</div>
            <span className="text-xs">Ce mois</span>
          </div>
          <div className="card-body" style={{paddingTop:8,paddingBottom:8}}>
            {top.map((e,i)=>(
              <div className="top-item" key={e.id}>
                <div className={`rank ${["r1","r2","r3","r0"][i]}`}>{i+1}</div>
                <div className={`av av-${avc(e.id)}`}>{ini(e.nom,e.prenom)}</div>
                <div style={{flex:1}}>
                  <div style={{fontSize:13,fontWeight:600}}>{e.prenom} {e.nom}</div>
                  <div style={{marginTop:4}}>
                    <div className="prog">
                      <div className="prog-fill prog-or" style={{width:`${Math.round(e.h/e.tot*100)}%`}}/>
                    </div>
                    <span className="text-xs" style={{marginTop:2,display:"block"}}>{e.h}h / {e.tot}h</span>
                  </div>
                </div>
                <span className="font-num fw7" style={{color:"var(--primary)",fontSize:13}}>{Math.round(e.h/e.tot*100)}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid-2">
        {/* Leçons du jour */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">🚗 Leçons du jour</div>
            <span className="badge b-in">{today.length} séances</span>
          </div>
          <div className="tbl-wrap">
            <table className="tbl">
              <thead><tr><th>Élève</th><th>Heure</th><th>Type</th><th>Statut</th></tr></thead>
              <tbody>
                {today.slice(0,4).map(l=>{
                  const e=E.find(x=>x.id===l.eid);
                  return (
                    <tr key={l.id}>
                      <td>
                        <div className="cell-name">
                          <div className={`av av-${avc(l.eid)}`}>{ini(e?.nom,e?.prenom)}</div>
                          <span className="fw7" style={{color:"var(--text)",fontSize:13}}>{e?.prenom} {e?.nom}</span>
                        </div>
                      </td>
                      <td className="font-num fw7" style={{color:"var(--primary)"}}>{l.h}</td>
                      <td>{l.type}</td>
                      <td><Bdg v={l.stat}/></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Répartition */}
        <div className="card">
          <div className="card-header"><div className="card-title">📊 Répartition</div></div>
          <div className="card-body">
            {[
              {l:"Permis B (Voiture)",c:E.filter(e=>e.permis==="B").length,t:E.length,p:"prog-or"},
              {l:"Permis A (Moto)",c:E.filter(e=>e.permis==="A").length,t:E.length,p:"prog-bl"},
              {l:"Diplômés",c:E.filter(e=>e.stat==="Diplômé").length,t:E.length,p:"prog-gr"},
              {l:"Moniteurs actifs",c:M.filter(m=>m.stat==="Actif").length,t:M.length,p:"prog-pu"},
            ].map((r,i)=>(
              <div key={i} style={{marginBottom:14}}>
                <div className="row between mb-4">
                  <span className="text-muted">{r.l}</span>
                  <span className="font-num fw7" style={{fontSize:13}}>{r.c} / {r.t}</span>
                </div>
                <div className="prog">
                  <div className={`prog-fill ${r.p}`} style={{width:`${Math.round(r.c/r.t*100)}%`}}/>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

/* ─── ÉLÈVES ─────────────────────────────────────────────────────── */
const Eleves = ({E,setE,M}) => {
  const [srch,setSrch]=useState("");
  const [filt,setFilt]=useState("Tous");
  const [modal,setModal]=useState(false);
  const [sel,setSel]=useState(null);
  const [form,setForm]=useState({nom:"",prenom:"",email:"",tel:"",permis:"B",mid:1,stat:"Actif",h:0,tot:30,solde:0});

  const filtered = E.filter(e=>{
    const m = `${e.nom} ${e.prenom} ${e.email}`.toLowerCase().includes(srch.toLowerCase());
    const s = filt==="Tous" || e.stat===filt;
    return m && s;
  });

  const open = (e=null) => {
    setSel(e);
    setForm(e || {nom:"",prenom:"",email:"",tel:"",permis:"B",mid:1,stat:"Actif",h:0,tot:30,solde:0});
    setModal(true);
  };
  const save = () => {
    if(sel) setE(E.map(x=>x.id===sel.id?{...x,...form}:x));
    else setE([...E,{...form,id:Date.now(),ex:"En attente",ins:new Date().toISOString().slice(0,10)}]);
    setModal(false);
  };

  return (
    <div className="fade-up">
      <div className="p-header">
        <div>
          <div className="p-title">Gestion des Élèves</div>
          <div className="p-sub">{E.length} élèves · {E.filter(e=>e.stat==="Actif").length} actifs</div>
        </div>
        <button className="btn btn-primary" onClick={()=>open()}>+ Nouvel élève</button>
      </div>

      <div className="filter-bar">
        <div className="search-wrap">
          <span style={{color:"var(--text3)"}}>🔍</span>
          <input placeholder="Rechercher un élève..." value={srch} onChange={e=>setSrch(e.target.value)}/>
        </div>
        {["Tous","Actif","Diplômé","Suspendu"].map(s=>(
          <button key={s} className={`btn btn-sm ${filt===s?"btn-primary":"btn-ghost"}`} onClick={()=>setFilt(s)}>{s}</button>
        ))}
      </div>

      <div className="card">
        <div className="tbl-wrap">
          <table className="tbl">
            <thead>
              <tr><th>Élève</th><th>Téléphone</th><th>Permis</th><th>Progression</th><th>Solde</th><th>Statut</th><th></th></tr>
            </thead>
            <tbody>
              {filtered.map(e=>(
                <tr key={e.id}>
                  <td>
                    <div className="cell-name">
                      <div className={`av av-${avc(e.id)}`}>{ini(e.nom,e.prenom)}</div>
                      <div>
                        <div className="fw7" style={{color:"var(--text)",fontSize:13.5}}>{e.prenom} {e.nom}</div>
                        <div className="text-xs">{e.email}</div>
                      </div>
                    </div>
                  </td>
                  <td>{e.tel}</td>
                  <td><span className={`badge ${e.permis==="B"?"b-or":"b-in"}`}>Permis {e.permis}</span></td>
                  <td style={{minWidth:130}}>
                    <div className="row gap-8">
                      <div className="prog" style={{flex:1}}>
                        <div className="prog-fill prog-or" style={{width:`${Math.round(e.h/e.tot*100)}%`}}/>
                      </div>
                      <span className="text-xs font-num">{e.h}/{e.tot}h</span>
                    </div>
                  </td>
                  <td className="font-num fw7" style={{color:e.solde>0?"var(--danger)":"var(--success)",fontSize:13}}>{fF(e.solde)}</td>
                  <td><Bdg v={e.stat}/></td>
                  <td>
                    <div className="row gap-6">
                      <button className="btn btn-ghost btn-sm" onClick={()=>open(e)}>✏️</button>
                      <button className="btn btn-danger btn-sm" onClick={()=>setE(E.filter(x=>x.id!==e.id))}>🗑️</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length===0 && <div className="empty"><div className="e-ico">👥</div><div className="e-txt">Aucun élève trouvé</div></div>}
      </div>

      {modal && (
        <Modal title={sel?"Modifier l'élève":"Nouvel élève"} onClose={()=>setModal(false)}
          footer={<><button className="btn btn-ghost" onClick={()=>setModal(false)}>Annuler</button><button className="btn btn-primary" onClick={save}>💾 Enregistrer</button></>}>
          <div className="fgrid">
            <div className="fg"><label className="fl">Prénom</label><input className="fi" value={form.prenom} onChange={e=>setForm({...form,prenom:e.target.value})} placeholder="Prénom"/></div>
            <div className="fg"><label className="fl">Nom</label><input className="fi" value={form.nom} onChange={e=>setForm({...form,nom:e.target.value})} placeholder="Nom"/></div>
          </div>
          <div className="fg"><label className="fl">Email</label><input className="fi" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} placeholder="email@exemple.com"/></div>
          <div className="fgrid">
            <div className="fg"><label className="fl">Téléphone</label><input className="fi" value={form.tel} onChange={e=>setForm({...form,tel:e.target.value})} placeholder="6XX XXX XXX"/></div>
            <div className="fg"><label className="fl">Permis</label>
              <select className="fi" value={form.permis} onChange={e=>setForm({...form,permis:e.target.value})}><option>B</option><option>A</option></select>
            </div>
          </div>
          <div className="fgrid">
            <div className="fg"><label className="fl">Moniteur</label>
              <select className="fi" value={form.mid} onChange={e=>setForm({...form,mid:+e.target.value})}>
                {M.map(m=><option key={m.id} value={m.id}>{m.prenom} {m.nom}</option>)}
              </select>
            </div>
            <div className="fg"><label className="fl">Statut</label>
              <select className="fi" value={form.stat} onChange={e=>setForm({...form,stat:e.target.value})}><option>Actif</option><option>Diplômé</option><option>Suspendu</option></select>
            </div>
          </div>
          <div className="fgrid">
            <div className="fg"><label className="fl">Heures effectuées</label><input className="fi" type="number" value={form.h} onChange={e=>setForm({...form,h:+e.target.value})}/></div>
            <div className="fg"><label className="fl">Solde (FCFA)</label><input className="fi" type="number" value={form.solde} onChange={e=>setForm({...form,solde:+e.target.value})}/></div>
          </div>
        </Modal>
      )}
    </div>
  );
};

/* ─── MONITEURS ──────────────────────────────────────────────────── */
const Moniteurs = ({M,setM,E}) => {
  const [modal,setModal]=useState(false);
  const [sel,setSel]=useState(null);
  const [form,setForm]=useState({nom:"",prenom:"",email:"",tel:"",spe:"Permis B",stat:"Actif",note:4.5,sal:150000,exp:"1 an"});

  const open=(m=null)=>{setSel(m);setForm(m||{nom:"",prenom:"",email:"",tel:"",spe:"Permis B",stat:"Actif",note:4.5,sal:150000,exp:"1 an"});setModal(true);};
  const save=()=>{
    if(sel)setM(M.map(x=>x.id===sel.id?{...x,...form}:x));
    else setM([...M,{...form,id:Date.now()}]);
    setModal(false);
  };

  return (
    <div className="fade-up">
      <div className="p-header">
        <div>
          <div className="p-title">Moniteurs</div>
          <div className="p-sub">{M.length} moniteurs · {M.filter(m=>m.stat==="Actif").length} disponibles</div>
        </div>
        <button className="btn btn-primary" onClick={()=>open()}>+ Nouveau moniteur</button>
      </div>

      <div className="grid-auto">
        {M.map(m=>{
          const ne=E.filter(e=>e.mid===m.id).length;
          return (
            <div className="m-card" key={m.id}>
              <div className="m-head">
                <div className={`av av-lg av-${avc(m.id)}`}>{ini(m.nom,m.prenom)}</div>
                <div>
                  <div className="m-name">{m.prenom} {m.nom}</div>
                  <div className="m-role">{m.spe}</div>
                  <div className="stars mt-4">{strs(m.note)} <span style={{fontSize:11,color:"var(--text3)"}}>{m.note}/5</span></div>
                </div>
                <div className="ml-auto"><Bdg v={m.stat}/></div>
              </div>

              <div className="divider"/>

              <div style={{display:"grid",gridTemplateColumns:"auto 1fr",gap:"6px 12px",fontSize:12.5,alignItems:"center"}}>
                <span className="text-xs">📧</span><span style={{color:"var(--text2)",textAlign:"right"}}>{m.email}</span>
                <span className="text-xs">📱</span><span style={{color:"var(--text2)",textAlign:"right"}}>{m.tel}</span>
                <span className="text-xs">💼</span><span style={{color:"var(--text2)",textAlign:"right"}}>{m.exp}</span>
                <span className="text-xs">💰</span><span className="font-num fw7" style={{color:"var(--primary)",textAlign:"right"}}>{fF(m.sal)}</span>
              </div>

              <div className="m-stats">
                <div><div className="m-stat-v font-num" style={{color:"var(--primary)"}}>{ne}</div><div className="m-stat-l">Élèves</div></div>
                <div><div className="m-stat-v font-num" style={{color:"var(--success)"}}>{m.note}</div><div className="m-stat-l">Note</div></div>
                <div><div className="m-stat-v" style={{color:"var(--info)",fontSize:13}}>{m.exp}</div><div className="m-stat-l">Exp.</div></div>
              </div>

              <div className="divider"/>
              <div className="row gap-8">
                <button className="btn btn-ghost btn-sm" style={{flex:1}} onClick={()=>open(m)}>✏️ Modifier</button>
                <button className="btn btn-danger btn-sm" onClick={()=>setM(M.filter(x=>x.id!==m.id))}>🗑️</button>
              </div>
            </div>
          );
        })}
      </div>

      {modal && (
        <Modal title={sel?"Modifier le moniteur":"Nouveau moniteur"} onClose={()=>setModal(false)}
          footer={<><button className="btn btn-ghost" onClick={()=>setModal(false)}>Annuler</button><button className="btn btn-primary" onClick={save}>💾 Enregistrer</button></>}>
          <div className="fgrid">
            <div className="fg"><label className="fl">Prénom</label><input className="fi" value={form.prenom} onChange={e=>setForm({...form,prenom:e.target.value})} placeholder="Prénom"/></div>
            <div className="fg"><label className="fl">Nom</label><input className="fi" value={form.nom} onChange={e=>setForm({...form,nom:e.target.value})} placeholder="Nom"/></div>
          </div>
          <div className="fg"><label className="fl">Email</label><input className="fi" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} placeholder="email@autoecole.cm"/></div>
          <div className="fgrid">
            <div className="fg"><label className="fl">Téléphone</label><input className="fi" value={form.tel} onChange={e=>setForm({...form,tel:e.target.value})} placeholder="6XX XXX XXX"/></div>
            <div className="fg"><label className="fl">Spécialité</label>
              <select className="fi" value={form.spe} onChange={e=>setForm({...form,spe:e.target.value})}><option>Permis B</option><option>Permis A</option><option>Permis B/A</option></select>
            </div>
          </div>
          <div className="fgrid">
            <div className="fg"><label className="fl">Salaire (FCFA)</label><input className="fi" type="number" value={form.sal} onChange={e=>setForm({...form,sal:+e.target.value})}/></div>
            <div className="fg"><label className="fl">Statut</label>
              <select className="fi" value={form.stat} onChange={e=>setForm({...form,stat:e.target.value})}><option>Actif</option><option>Congé</option><option>Inactif</option></select>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

/* ─── PLANNING ───────────────────────────────────────────────────── */
const Planning = ({L,setL,E,M}) => {
  const [modal,setModal]=useState(false);
  const [filt,setFilt]=useState("Tous");
  const [form,setForm]=useState({eid:1,mid:1,date:"",h:"08:00",dur:2,type:"Conduite",stat:"En attente",veh:""});

  const colS = {"Confirmée":"var(--success)","En attente":"var(--accent)","Annulée":"var(--danger)"};
  const filtered = L.filter(l=>filt==="Tous"||l.type===filt||l.stat===filt);
  const save = () => {setL([...L,{...form,id:Date.now(),eid:+form.eid,mid:+form.mid,dur:+form.dur}]);setModal(false);};

  return (
    <div className="fade-up">
      <div className="p-header">
        <div>
          <div className="p-title">Planning des Leçons</div>
          <div className="p-sub">{L.length} leçons programmées</div>
        </div>
        <button className="btn btn-primary" onClick={()=>setModal(true)}>+ Planifier</button>
      </div>

      <div className="filter-bar">
        {["Tous","Conduite","Code","Confirmée","En attente","Annulée"].map(f=>(
          <button key={f} className={`btn btn-sm ${filt===f?"btn-primary":"btn-ghost"}`} onClick={()=>setFilt(f)}>{f}</button>
        ))}
      </div>

      <div style={{display:"flex",flexDirection:"column",gap:10}}>
        {filtered.map(l=>{
          const e=E.find(x=>x.id===l.eid), m=M.find(x=>x.id===l.mid);
          return (
            <div key={l.id} className="card" style={{overflow:"hidden"}}>
              <div style={{display:"flex",alignItems:"stretch"}}>
                <div style={{width:4,background:colS[l.stat],flexShrink:0}}/>
                <div style={{display:"flex",alignItems:"center",gap:12,padding:"13px 16px",flex:1,flexWrap:"wrap"}}>
                  <div style={{minWidth:52,textAlign:"center"}}>
                    <div className="font-num fw7" style={{fontSize:18,color:"var(--primary)"}}>{l.h}</div>
                    <div className="text-xs">{l.dur}h</div>
                  </div>
                  <div style={{width:1,height:36,background:"var(--border)",flexShrink:0}}/>
                  <div className="row gap-10" style={{flex:1}}>
                    <div className={`av av-${avc(l.eid)}`}>{ini(e?.nom,e?.prenom)}</div>
                    <div>
                      <div className="fw7" style={{fontSize:13.5,color:"var(--text)"}}>{e?.prenom} {e?.nom}</div>
                      <div className="text-xs">avec {m?.prenom} {m?.nom}</div>
                    </div>
                  </div>
                  <div className="row gap-8" style={{flexWrap:"wrap"}}>
                    <span className={`badge ${l.type==="Conduite"?"b-or":"b-in"}`}>{l.type}</span>
                    <Bdg v={l.stat}/>
                    <span className="text-xs">📅 {fD(l.date)}</span>
                    <span className="text-xs" style={{maxWidth:160,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>🚗 {l.veh}</span>
                  </div>
                  <div className="row gap-6" style={{marginLeft:"auto"}}>
                    <button className="btn btn-success btn-sm" onClick={()=>setL(L.map(x=>x.id===l.id?{...x,stat:"Confirmée"}:x))}>✓</button>
                    <button className="btn btn-danger btn-sm" onClick={()=>setL(L.filter(x=>x.id!==l.id))}>🗑️</button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
        {filtered.length===0&&<div className="empty"><div className="e-ico">📅</div><div className="e-txt">Aucune leçon trouvée</div></div>}
      </div>

      {modal && (
        <Modal title="Planifier une leçon" onClose={()=>setModal(false)}
          footer={<><button className="btn btn-ghost" onClick={()=>setModal(false)}>Annuler</button><button className="btn btn-primary" onClick={save}>💾 Enregistrer</button></>}>
          <div className="fgrid">
            <div className="fg"><label className="fl">Élève</label>
              <select className="fi" value={form.eid} onChange={e=>setForm({...form,eid:e.target.value})}>
                {E.map(e=><option key={e.id} value={e.id}>{e.prenom} {e.nom}</option>)}
              </select>
            </div>
            <div className="fg"><label className="fl">Moniteur</label>
              <select className="fi" value={form.mid} onChange={e=>setForm({...form,mid:e.target.value})}>
                {M.map(m=><option key={m.id} value={m.id}>{m.prenom} {m.nom}</option>)}
              </select>
            </div>
          </div>
          <div className="fgrid">
            <div className="fg"><label className="fl">Date</label><input className="fi" type="date" value={form.date} onChange={e=>setForm({...form,date:e.target.value})}/></div>
            <div className="fg"><label className="fl">Heure</label><input className="fi" type="time" value={form.h} onChange={e=>setForm({...form,h:e.target.value})}/></div>
          </div>
          <div className="fgrid">
            <div className="fg"><label className="fl">Type</label>
              <select className="fi" value={form.type} onChange={e=>setForm({...form,type:e.target.value})}><option>Conduite</option><option>Code</option></select>
            </div>
            <div className="fg"><label className="fl">Durée</label>
              <select className="fi" value={form.dur} onChange={e=>setForm({...form,dur:e.target.value})}><option value={1}>1h</option><option value={2}>2h</option><option value={3}>3h</option></select>
            </div>
          </div>
          <div className="fg"><label className="fl">Véhicule / Salle</label><input className="fi" value={form.veh} onChange={e=>setForm({...form,veh:e.target.value})} placeholder="Ex: Toyota Corolla — LT 234 A"/></div>
        </Modal>
      )}
    </div>
  );
};

/* ─── EXAMENS ────────────────────────────────────────────────────── */
const Examens = ({X,setX,E}) => {
  const [modal,setModal]=useState(false);
  const [form,setForm]=useState({eid:1,type:"Code",date:"",sc:0,seuil:35,centre:"CENAC Douala"});
  const tr = X.length ? Math.round(X.filter(x=>x.stat==="Réussi").length/X.length*100) : 0;
  const save = () => {
    const stat=+form.sc>=+form.seuil?"Réussi":"Échoué";
    setX([...X,{...form,id:Date.now(),eid:+form.eid,sc:+form.sc,seuil:+form.seuil,stat}]);
    setModal(false);
  };
  return (
    <div className="fade-up">
      <div className="p-header">
        <div>
          <div className="p-title">Examens</div>
          <div className="p-sub">Taux de réussite global : <strong style={{color:"var(--success)"}}>{tr}%</strong></div>
        </div>
        <button className="btn btn-primary" onClick={()=>setModal(true)}>+ Enregistrer</button>
      </div>

      <div className="grid-3 mb-12">
        {[{l:"Total examens",v:X.length,c:"c-blue",i:"📋"},
          {l:"Réussis",v:X.filter(x=>x.stat==="Réussi").length,c:"c-green",i:"✅"},
          {l:"Échoués",v:X.filter(x=>x.stat==="Échoué").length,c:"c-orange",i:"❌"},
        ].map((s,i)=>(
          <div className={`stat-card ${s.c}`} key={i}>
            <div className={`stat-icon ${s.c}`}>{s.i}</div>
            <div className="stat-value font-num">{s.v}</div>
            <div className="stat-label">{s.l}</div>
          </div>
        ))}
      </div>

      <div className="card">
        <div className="tbl-wrap">
          <table className="tbl">
            <thead><tr><th>Élève</th><th>Type</th><th>Date</th><th>Score</th><th>Seuil</th><th>Centre</th><th>Résultat</th><th></th></tr></thead>
            <tbody>
              {X.map(x=>{
                const e=E.find(el=>el.id===x.eid);
                return (
                  <tr key={x.id}>
                    <td><div className="cell-name"><div className={`av av-${avc(x.eid)}`}>{ini(e?.nom,e?.prenom)}</div><span className="fw7" style={{color:"var(--text)"}}>{e?.prenom} {e?.nom}</span></div></td>
                    <td><span className={`badge ${x.type==="Code"?"b-in":"b-or"}`}>{x.type}</span></td>
                    <td>{fD(x.date)}</td>
                    <td><span className="font-num fw7" style={{fontSize:15,color:x.sc>=x.seuil?"var(--success)":"var(--danger)"}}>{x.sc}</span></td>
                    <td className="text-xs font-num">{x.seuil}</td>
                    <td>{x.centre}</td>
                    <td><Bdg v={x.stat}/></td>
                    <td><button className="btn btn-danger btn-sm" onClick={()=>setX(X.filter(y=>y.id!==x.id))}>🗑️</button></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {modal && (
        <Modal title="Enregistrer un examen" onClose={()=>setModal(false)}
          footer={<><button className="btn btn-ghost" onClick={()=>setModal(false)}>Annuler</button><button className="btn btn-primary" onClick={save}>💾 Enregistrer</button></>}>
          <div className="fg"><label className="fl">Élève</label>
            <select className="fi" value={form.eid} onChange={e=>setForm({...form,eid:e.target.value})}>
              {E.map(e=><option key={e.id} value={e.id}>{e.prenom} {e.nom}</option>)}
            </select>
          </div>
          <div className="fgrid">
            <div className="fg"><label className="fl">Type</label>
              <select className="fi" value={form.type} onChange={e=>setForm({...form,type:e.target.value,seuil:e.target.value==="Code"?35:70})}><option>Code</option><option>Conduite</option></select>
            </div>
            <div className="fg"><label className="fl">Date</label><input className="fi" type="date" value={form.date} onChange={e=>setForm({...form,date:e.target.value})}/></div>
          </div>
          <div className="fgrid">
            <div className="fg"><label className="fl">Score obtenu</label><input className="fi" type="number" value={form.sc} onChange={e=>setForm({...form,sc:e.target.value})} placeholder={`Sur ${form.type==="Code"?40:100}`}/></div>
            <div className="fg"><label className="fl">Seuil de réussite</label><input className="fi" type="number" value={form.seuil} onChange={e=>setForm({...form,seuil:e.target.value})}/></div>
          </div>
          <div className="fg"><label className="fl">Centre d'examen</label><input className="fi" value={form.centre} onChange={e=>setForm({...form,centre:e.target.value})} placeholder="CENAC Douala"/></div>
          {+form.sc>0 && (
            <div style={{padding:"10px 13px",borderRadius:9,background:+form.sc>=+form.seuil?"rgba(16,185,129,.1)":"rgba(239,68,68,.1)",border:`1px solid ${+form.sc>=+form.seuil?"rgba(16,185,129,.2)":"rgba(239,68,68,.2)"}`,fontSize:13,fontWeight:700,color:+form.sc>=+form.seuil?"var(--success)":"var(--danger)"}}>
              {+form.sc>=+form.seuil?"✅ Résultat : RÉUSSI":"❌ Résultat : ÉCHOUÉ"}
            </div>
          )}
        </Modal>
      )}
    </div>
  );
};

/* ─── PAIEMENTS ──────────────────────────────────────────────────── */
const Paiements = ({P,setP,E}) => {
  const [modal,setModal]=useState(false);
  const [form,setForm]=useState({eid:1,mt:"",mode:"Mobile Money",stat:"Payé"});
  const ca  = P.filter(p=>p.stat==="Payé").reduce((s,p)=>s+p.mt,0);
  const att = P.filter(p=>p.stat==="En attente").reduce((s,p)=>s+p.mt,0);
  const icons = {"Mobile Money":"📱","Espèces":"💵","Virement":"🏦","Carte":"💳"};
  const save = () => {
    const ref="PAY-"+(Math.floor(Math.random()*9000)+1000);
    setP([...P,{...form,id:Date.now(),eid:+form.eid,mt:+form.mt,date:new Date().toISOString().slice(0,10),ref}]);
    setModal(false);
  };
  return (
    <div className="fade-up">
      <div className="p-header">
        <div>
          <div className="p-title">Facturation & Paiements</div>
          <div className="p-sub">{P.length} transactions enregistrées</div>
        </div>
        <button className="btn btn-primary" onClick={()=>setModal(true)}>+ Enregistrer</button>
      </div>

      <div className="grid-3 mb-12">
        <div className="stat-card c-green"><div className="stat-icon c-green">💰</div><div className="stat-value font-num" style={{fontSize:20}}>{fF(ca)}</div><div className="stat-label">Chiffre d'affaires</div></div>
        <div className="stat-card c-orange"><div className="stat-icon c-orange">⏳</div><div className="stat-value font-num" style={{fontSize:20}}>{fF(att)}</div><div className="stat-label">En attente</div></div>
        <div className="stat-card c-blue"><div className="stat-icon c-blue">📊</div><div className="stat-value font-num">{P.length}</div><div className="stat-label">Transactions</div></div>
      </div>

      <div className="card">
        <div className="tbl-wrap">
          <table className="tbl">
            <thead><tr><th>Référence</th><th>Élève</th><th>Montant</th><th>Mode</th><th>Date</th><th>Statut</th><th></th></tr></thead>
            <tbody>
              {P.map(p=>{
                const e=E.find(x=>x.id===p.eid);
                return (
                  <tr key={p.id}>
                    <td><span className="font-num fw7" style={{color:"var(--primary)",fontSize:13}}>{p.ref}</span></td>
                    <td><div className="cell-name"><div className={`av av-${avc(p.eid)}`}>{ini(e?.nom,e?.prenom)}</div><span className="fw7" style={{color:"var(--text)"}}>{e?.prenom} {e?.nom}</span></div></td>
                    <td><span className="font-num fw7" style={{color:"var(--success)",fontSize:14}}>{fF(p.mt)}</span></td>
                    <td><span style={{fontSize:13}}>{icons[p.mode]||"💳"} {p.mode}</span></td>
                    <td>{fD(p.date)}</td>
                    <td><Bdg v={p.stat}/></td>
                    <td><button className="btn btn-danger btn-sm" onClick={()=>setP(P.filter(x=>x.id!==p.id))}>🗑️</button></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {modal && (
        <Modal title="Enregistrer un paiement" onClose={()=>setModal(false)}
          footer={<><button className="btn btn-ghost" onClick={()=>setModal(false)}>Annuler</button><button className="btn btn-primary" onClick={save}>💾 Enregistrer</button></>}>
          <div className="fg"><label className="fl">Élève</label>
            <select className="fi" value={form.eid} onChange={e=>setForm({...form,eid:e.target.value})}>
              {E.map(e=><option key={e.id} value={e.id}>{e.prenom} {e.nom} — Solde: {fF(e.solde)}</option>)}
            </select>
          </div>
          <div className="fg"><label className="fl">Montant (FCFA)</label><input className="fi" type="number" value={form.mt} onChange={e=>setForm({...form,mt:e.target.value})} placeholder="Ex: 50 000"/></div>
          <div className="fg">
            <label className="fl">Mode de paiement</label>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:7,marginTop:4}}>
              {["Mobile Money","Espèces","Virement","Carte"].map(m=>(
                <div key={m} className={`pay-method ${form.mode===m?"sel":""}`} onClick={()=>setForm({...form,mode:m})}>
                  <span style={{fontSize:20}}>{icons[m]}</span>
                  <span style={{fontSize:13,fontWeight:600}}>{m}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="fg"><label className="fl">Statut</label>
            <select className="fi" value={form.stat} onChange={e=>setForm({...form,stat:e.target.value})}><option>Payé</option><option>En attente</option></select>
          </div>
        </Modal>
      )}
    </div>
  );
};

/* ─── NOTIFICATIONS ──────────────────────────────────────────────── */
const Notifications = ({E}) => {
  const [form,setForm]=useState({to:"all",canal:"sms",sujet:"",msg:""});
  const [sent,setSent]=useState([
    {id:1,to:"Joël Mbarga",canal:"SMS",sujet:"Rappel leçon",msg:"Votre leçon est prévue demain à 08h00.",date:"2025-03-21"},
    {id:2,to:"Sandra Eyenga",canal:"Email",sujet:"Paiement en attente",msg:"Votre solde de 120 000 FCFA est dû.",date:"2025-03-20"},
    {id:3,to:"Tous les élèves",canal:"SMS",sujet:"Fermeture exceptionnelle",msg:"L'auto-école sera fermée ce samedi.",date:"2025-03-19"},
  ]);
  const tpls=[
    {l:"📅 Rappel leçon",m:"Votre leçon de conduite est prévue le [DATE] à [HEURE]. N'oubliez pas votre pièce d'identité."},
    {l:"🎓 Convocation examen",m:"Vous êtes convoqué(e) à l'examen [TYPE] le [DATE] au centre CENAC Douala. Bonne chance !"},
    {l:"💰 Rappel paiement",m:"Votre solde impayé est de [MONTANT] FCFA. Merci de régulariser votre situation."},
    {l:"🏆 Félicitations",m:"Félicitations ! Vous avez réussi votre examen. Votre permis sera disponible dans 15 jours."},
  ];
  const send=()=>{
    const t=form.to==="all"?"Tous les élèves":E.find(e=>e.id===+form.to)?.prenom+" "+E.find(e=>e.id===+form.to)?.nom;
    setSent([{id:Date.now(),to:t,canal:form.canal==="sms"?"SMS":"Email",sujet:form.sujet,msg:form.msg,date:new Date().toISOString().slice(0,10)},...sent]);
    setForm({...form,sujet:"",msg:""});
  };
  return (
    <div className="fade-up">
      <div className="p-header">
        <div><div className="p-title">Notifications</div><div className="p-sub">Envoyez des SMS et emails à vos élèves</div></div>
      </div>
      <div className="grid-2">
        <div className="card">
          <div className="card-header"><div className="card-title">✍️ Composer</div></div>
          <div className="card-body">
            <div className="fg"><label className="fl">Destinataire</label>
              <select className="fi" value={form.to} onChange={e=>setForm({...form,to:e.target.value})}>
                <option value="all">📢 Tous les élèves</option>
                {E.map(e=><option key={e.id} value={e.id}>{e.prenom} {e.nom}</option>)}
              </select>
            </div>
            <div className="fg">
              <label className="fl">Canal</label>
              <div className="row gap-8">
                {[{v:"sms",l:"📱 SMS"},{v:"email",l:"📧 Email"}].map(c=>(
                  <button key={c.v} className={`btn ${form.canal===c.v?"btn-primary":"btn-ghost"}`} style={{flex:1}} onClick={()=>setForm({...form,canal:c.v})}>{c.l}</button>
                ))}
              </div>
            </div>
            <div className="fg">
              <label className="fl">Templates rapides</label>
              <div style={{display:"flex",flexDirection:"column",gap:5}}>
                {tpls.map((t,i)=>(
                  <button key={i} className="btn btn-ghost btn-sm" style={{justifyContent:"flex-start",textAlign:"left"}} onClick={()=>setForm({...form,sujet:t.l.replace(/^\S+\s/,""),msg:t.m})}>{t.l}</button>
                ))}
              </div>
            </div>
            <div className="fg"><label className="fl">Sujet</label><input className="fi" value={form.sujet} onChange={e=>setForm({...form,sujet:e.target.value})} placeholder="Objet du message"/></div>
            <div className="fg"><label className="fl">Message</label><textarea className="fi" rows={3} value={form.msg} onChange={e=>setForm({...form,msg:e.target.value})} placeholder="Rédigez votre message..." style={{resize:"vertical"}}/></div>
            <button className="btn btn-primary" style={{width:"100%"}} onClick={send} disabled={!form.msg||!form.sujet}>📤 Envoyer le message</button>
          </div>
        </div>
        <div className="card">
          <div className="card-header"><div className="card-title">📬 Historique</div><span className="badge b-or">{sent.length}</span></div>
          <div style={{padding:"0 18px"}}>
            {sent.map(n=>(
              <div className="notif-item" key={n.id}>
                <div className="notif-ico" style={{background:n.canal==="SMS"?"rgba(14,165,233,.1)":"rgba(232,71,10,.1)"}}>{n.canal==="SMS"?"📱":"📧"}</div>
                <div style={{flex:1,minWidth:0}}>
                  <div className="fw7" style={{fontSize:13,color:"var(--text)"}}>{n.sujet}</div>
                  <div className="text-muted" style={{marginTop:2}}>À : {n.to}</div>
                  <div style={{fontSize:11,color:"var(--text3)",fontStyle:"italic",marginTop:2,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>"{n.msg}"</div>
                  <div className="row gap-8" style={{marginTop:5}}>
                    <span className="text-xs">{fD(n.date)}</span>
                    <span className="badge b-ok">Envoyé</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

/* ─── VÉHICULES ──────────────────────────────────────────────────── */
const Vehicules = () => {
  const V=[
    {id:1,marque:"Toyota",modele:"Corolla",immat:"LT 234 A",annee:2020,km:45230,stat:"Disponible",type:"Voiture",ico:"🚗",coul:"Blanc"},
    {id:2,marque:"Renault",modele:"Logan",immat:"LT 890 C",annee:2019,km:62100,stat:"En service",type:"Voiture",ico:"🚗",coul:"Gris"},
    {id:3,marque:"Honda",modele:"CB500",immat:"LT 567 B",annee:2021,km:18500,stat:"Disponible",type:"Moto",ico:"🏍️",coul:"Rouge"},
    {id:4,marque:"Yamaha",modele:"MT-07",immat:"LT 321 D",annee:2022,km:9800,stat:"Maintenance",type:"Moto",ico:"🏍️",coul:"Bleu"},
  ];
  return (
    <div className="fade-up">
      <div className="p-header">
        <div><div className="p-title">Parc Automobile</div><div className="p-sub">{V.length} véhicules enregistrés</div></div>
        <button className="btn btn-primary">+ Ajouter un véhicule</button>
      </div>
      <div className="grid-auto">
        {V.map(v=>(
          <div className="v-card" key={v.id}>
            <div className="v-img">{v.ico}</div>
            <div className="row between mb-12">
              <div>
                <div className="fw7" style={{fontFamily:"'Space Grotesk',sans-serif",fontSize:15}}>{v.marque} {v.modele}</div>
                <div className="text-xs" style={{marginTop:2}}>{v.immat} · {v.coul}</div>
              </div>
              <Bdg v={v.stat}/>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"auto 1fr",gap:"6px 12px",fontSize:12.5,alignItems:"center"}}>
              <span className="text-xs">📅 Année</span><span className="font-num fw7" style={{textAlign:"right"}}>{v.annee}</span>
              <span className="text-xs">🏎️ Kilométrage</span><span className="font-num fw7" style={{textAlign:"right"}}>{v.km.toLocaleString()} km</span>
              <span className="text-xs">🚦 Type</span><span className="fw7" style={{textAlign:"right"}}>{v.type}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ─── APP ────────────────────────────────────────────────────────── */
export default function App() {
  const [page,setPage]  = useState("db");
  const [open,setOpen]  = useState(false);
  const [E,setE] = useState(E0);
  const [M,setM] = useState(M0);
  const [L,setL] = useState(L0);
  const [P,setP] = useState(P0);
  const [X,setX] = useState(X0);

  const nav = [
    {id:"db", ico:"⊞",  label:"Tableau de bord"},
    {id:"el", ico:"👥",  label:"Élèves",    badge:E.filter(e=>e.stat==="Actif").length},
    {id:"mn", ico:"🎓",  label:"Moniteurs"},
    {id:"pl", ico:"📅",  label:"Planning",   badge:L.filter(l=>l.stat==="En attente").length||undefined},
    {id:"xm", ico:"🎯",  label:"Examens"},
    {id:"pa", ico:"💰",  label:"Paiements",  badge:P.filter(p=>p.stat==="En attente").length||undefined},
    {id:"vh", ico:"🚗",  label:"Véhicules"},
    {id:"no", ico:"🔔",  label:"Notifications"},
  ];

  const pages = {
    db:<Dashboard E={E} M={M} L={L} P={P} X={X}/>,
    el:<Eleves E={E} setE={setE} M={M}/>,
    mn:<Moniteurs M={M} setM={setM} E={E}/>,
    pl:<Planning L={L} setL={setL} E={E} M={M}/>,
    xm:<Examens X={X} setX={setX} E={E}/>,
    pa:<Paiements P={P} setP={setP} E={E}/>,
    vh:<Vehicules/>,
    no:<Notifications E={E}/>,
  };

  const cur = nav.find(n=>n.id===page);
  const go  = (id) => { setPage(id); setOpen(false); };

  return (
    <>
      <CSS/>
      <div className="app">

        {/* Overlay mobile */}
        <div className={`overlay${open?" show":""}`} onClick={()=>setOpen(false)}/>

        {/* SIDEBAR */}
        <nav className={`sidebar${open?" open":""}`}>
          <div className="s-logo">
            <div className="s-icon">🚗</div>
            <div>
              <div className="s-name">AutoGES Pro</div>
              <div className="s-tag">Auto-École Excellence</div>
            </div>
          </div>

          <div className="s-nav">
            <div className="s-section">
              <div className="s-label">Principal</div>
              {nav.slice(0,2).map(n=>(
                <div key={n.id} className={`nav-item${page===n.id?" active":""}`} onClick={()=>go(n.id)}>
                  <span className="n-ico">{n.ico}</span>
                  {n.label}
                  {n.badge?<span className="n-badge">{n.badge}</span>:null}
                </div>
              ))}
            </div>
            <div className="s-section">
              <div className="s-label">Gestion</div>
              {nav.slice(2,6).map(n=>(
                <div key={n.id} className={`nav-item${page===n.id?" active":""}`} onClick={()=>go(n.id)}>
                  <span className="n-ico">{n.ico}</span>
                  {n.label}
                  {n.badge?<span className="n-badge">{n.badge}</span>:null}
                </div>
              ))}
            </div>
            <div className="s-section">
              <div className="s-label">Outils</div>
              {nav.slice(6).map(n=>(
                <div key={n.id} className={`nav-item${page===n.id?" active":""}`} onClick={()=>go(n.id)}>
                  <span className="n-ico">{n.ico}</span>
                  {n.label}
                </div>
              ))}
            </div>
          </div>

          <div className="s-footer">
            <div className="u-card">
              <div className="u-av">AD</div>
              <div>
                <div className="u-name">Administrateur</div>
                <div className="u-role">Super Admin</div>
              </div>
              <span style={{marginLeft:"auto",fontSize:14,color:"var(--text3)"}}>⚙️</span>
            </div>
          </div>
        </nav>

        {/* MAIN */}
        <div className="main">
          <div className="topbar">
            <div className="hamburger" onClick={()=>setOpen(!open)}>☰</div>
            <div className="t-title">{cur?.label}</div>
            <div className="t-search">
              <span style={{color:"var(--text3)",fontSize:14}}>🔍</span>
              <input placeholder="Recherche..."/>
            </div>
            <div className="t-actions">
              <div className="icon-btn" title="Mode clair">🌙</div>
              <div className="icon-btn" title="Notifications">
                🔔<div className="notif-dot"/>
              </div>
              <div className="u-av" style={{width:34,height:34,borderRadius:9,cursor:"pointer",fontSize:12}}>AD</div>
            </div>
          </div>

          <div className="page">
            {pages[page]}
          </div>
        </div>
      </div>
    </>
  );
}
