import { useState, useEffect, useCallback } from "react";
import {
  initDB, getDB, resetDB,
  getAll, insert, update, remove,
  enregistrerPaiement, genererReference,
  getMeta, updateMeta,
  exportSQL, exportJSON, exportCSV, downloadFile,
} from "./db.js";

const CSS = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Geist:wght@300;400;500;600;700&family=Geist+Mono:wght@400;500;600&display=swap');
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    :root {
      --w-side: 228px;
      --h-top:  52px;

      --bg:        #090D14;
      --bg-side:   #0D1520;
      --bg-card:   #111E30;
      --bg-input:  #162030;
      --bg-hover:  #1A2840;
      --bg-muted:  #1E2D42;

      --border:    rgba(255,255,255,0.08);
      --border-hi: rgba(241,130,66,0.45);

      --t1: #EEF4FF;
      --t2: #8BA3C0;
      --t3: #4A6280;
      --t4: #2A3F58;

      --accent: #F18242;
      --acc-lo: rgba(241,130,66,0.12);
      --acc-gl: rgba(241,130,66,0.22);

      --green:  #3DBF8A; --green-lo: rgba(61,191,138,0.10);
      --blue:   #4A9EF5; --blue-lo:  rgba(74,158,245,0.10);
      --amber:  #E8A84C; --amber-lo: rgba(232,168,76,0.10);
      --red:    #E05858; --red-lo:   rgba(224,88,88,0.10);
      --purple: #9B7FE8; --purple-lo:rgba(155,127,232,0.10);

      --r1: 5px; --r2: 8px; --r3: 12px; --r4: 16px; --r5: 20px;
    }

    html, body { width: 100%; height: 100%; overflow-x: hidden; }
    html { font-size: 15px; }
    body {
      font-family: 'Geist', -apple-system, BlinkMacSystemFont, sans-serif;
      background: var(--bg);
      color: var(--t1);
      -webkit-font-smoothing: antialiased;
    }
    ::-webkit-scrollbar { width: 4px; height: 4px; }
    ::-webkit-scrollbar-track { background: transparent; }
    ::-webkit-scrollbar-thumb { background: var(--t4); border-radius: 99px; }
    ::-webkit-scrollbar-thumb:hover { background: var(--t3); }

    /* ── LAYOUT ─────────────────────────────────────────────────── */
    .app {
      display: flex;
      min-height: 100vh;
      width: 100%;
      overflow-x: hidden;
    }

    /* ── SIDEBAR ────────────────────────────────────────────────── */
    .sidebar {
      position: sticky;
      top: 0;
      width: var(--w-side);
      min-width: var(--w-side);
      height: 100vh;
      background: var(--bg-side);
      border-right: 1px solid var(--border);
      display: flex;
      flex-direction: column;
      flex-shrink: 0;
      overflow-y: auto;
      overflow-x: hidden;
      z-index: 100;
    }
    .s-brand {
      padding: 18px 16px 15px;
      border-bottom: 1px solid var(--border);
      display: flex;
      align-items: center;
      gap: 11px;
      flex-shrink: 0;
    }
    .s-logo {
      width: 32px; height: 32px;
      background: var(--accent);
      border-radius: var(--r2);
      display: flex; align-items: center; justify-content: center;
      font-size: 16px; flex-shrink: 0;
      box-shadow: 0 2px 10px var(--acc-gl);
    }
    .s-appname {
      font-size: 13.5px; font-weight: 700;
      color: var(--t1); letter-spacing: -0.02em; line-height: 1.2;
    }
    .s-version {
      font-size: 10px; color: var(--accent);
      font-family: 'Geist Mono', monospace;
      letter-spacing: 0.04em; margin-top: 2px;
    }
    .s-nav { flex: 1; padding: 12px 10px; overflow-y: auto; }
    .s-section { margin-bottom: 22px; }
    .s-label {
      font-size: 10px; font-weight: 600; color: var(--t3);
      text-transform: uppercase; letter-spacing: 0.09em;
      padding: 0 8px 7px; display: block;
    }
    .nav-item {
      display: flex; align-items: center; justify-content: space-between;
      padding: 7px 10px; border-radius: var(--r2);
      cursor: pointer; transition: all .15s;
      color: var(--t2); font-size: 13px; font-weight: 500;
      margin-bottom: 2px; user-select: none;
      white-space: nowrap;
    }
    .nav-item:hover { background: var(--bg-hover); color: var(--t1); }
    .nav-item.active {
      background: var(--acc-lo); color: var(--accent);
      font-weight: 600; border-left: 2px solid var(--accent);
      padding-left: 8px;
    }
    .nav-badge {
      background: var(--accent); color: #fff;
      font-size: 10px; font-weight: 700;
      font-family: 'Geist Mono', monospace;
      padding: 1px 6px; border-radius: 99px; flex-shrink: 0;
    }
    .nav-item.active .nav-badge { background: var(--accent); }
    .s-footer { padding: 10px; border-top: 1px solid var(--border); flex-shrink: 0; }
    .user-row {
      display: flex; align-items: center; gap: 10px;
      padding: 8px 10px; border-radius: var(--r2);
      cursor: pointer; transition: background .15s;
    }
    .user-row:hover { background: var(--bg-hover); }
    .u-av {
      width: 28px; height: 28px; border-radius: var(--r1);
      background: linear-gradient(135deg, var(--accent), var(--amber));
      display: flex; align-items: center; justify-content: center;
      font-size: 10.5px; font-weight: 700; color: #fff;
      font-family: 'Geist Mono', monospace; flex-shrink: 0;
    }
    .u-name { font-size: 13px; font-weight: 600; color: var(--t1); line-height: 1.2; }
    .u-role { font-size: 10.5px; color: var(--t3); margin-top: 1px; }

    /* ── MAIN ───────────────────────────────────────────────────── */
    .main {
      flex: 1;
      min-width: 0;
      display: flex;
      flex-direction: column;
      min-height: 100vh;
      background: var(--bg);
    }

    /* ── TOPBAR ─────────────────────────────────────────────────── */
    .topbar {
      height: var(--h-top);
      background: var(--bg-side);
      border-bottom: 1px solid var(--border);
      display: flex; align-items: center;
      padding: 0 26px; gap: 12px;
      position: sticky; top: 0; z-index: 50;
      flex-shrink: 0;
    }
    .ham {
      display: none;
      width: 32px; height: 32px; border-radius: var(--r2);
      border: 1px solid var(--border); background: transparent;
      align-items: center; justify-content: center;
      cursor: pointer; color: var(--t2); font-size: 15px;
      transition: all .15s;
    }
    .ham:hover { background: var(--bg-hover); color: var(--t1); }
    .top-title {
      font-size: 14px; font-weight: 600; color: var(--t1);
      flex: 1; letter-spacing: -0.01em;
    }
    .top-search {
      display: flex; align-items: center; gap: 8px;
      background: var(--bg-muted); border: 1px solid var(--border);
      border-radius: var(--r2); padding: 6px 12px;
      width: 260px; transition: border-color .15s;
    }
    .top-search:focus-within { border-color: var(--border-hi); }
    .top-search input {
      background: none; border: none; outline: none;
      color: var(--t1); font-size: 13px;
      font-family: 'Geist', sans-serif; width: 100%;
    }
    .top-search input::placeholder { color: var(--t3); }
    .kbd {
      font-family: 'Geist Mono', monospace; font-size: 10px;
      color: var(--t3); background: var(--bg);
      border: 1px solid var(--border); border-radius: var(--r1);
      padding: 1px 5px; flex-shrink: 0;
    }
    .top-actions { display: flex; align-items: center; gap: 7px; }
    .top-btn {
      width: 32px; height: 32px; border-radius: var(--r2);
      border: 1px solid var(--border); background: transparent;
      display: flex; align-items: center; justify-content: center;
      cursor: pointer; color: var(--t2); font-size: 14px;
      transition: all .15s; position: relative;
    }
    .top-btn:hover { background: var(--bg-hover); color: var(--t1); }
    .top-btn .dot {
      position: absolute; top: 6px; right: 6px;
      width: 5px; height: 5px; background: var(--accent);
      border-radius: 50%; border: 1.5px solid var(--bg-side);
    }

    /* ── PAGE ───────────────────────────────────────────────────── */
    .page {
      padding: 28px 32px;
      flex: 1; width: 100%;
      box-sizing: border-box;
      animation: fadeUp .22s ease;
    }
    @keyframes fadeUp {
      from { opacity: 0; transform: translateY(5px); }
      to   { opacity: 1; transform: translateY(0); }
    }

    /* ── PAGE HEADER ────────────────────────────────────────────── */
    .page-head {
      display: flex; align-items: flex-start;
      justify-content: space-between;
      margin-bottom: 28px; flex-wrap: wrap; gap: 14px;
    }
    .page-title {
      font-size: 22px; font-weight: 700;
      color: var(--t1); letter-spacing: -0.03em; line-height: 1.2;
    }
    .page-sub { font-size: 13px; color: var(--t2); margin-top: 4px; line-height: 1.5; }
    .page-actions { display: flex; gap: 8px; flex-wrap: wrap; align-items: center; }

    /* ── BUTTONS ────────────────────────────────────────────────── */
    .btn {
      display: inline-flex; align-items: center; gap: 6px;
      padding: 7px 14px; border-radius: var(--r2);
      font-size: 13px; font-weight: 500;
      font-family: 'Geist', sans-serif;
      cursor: pointer; border: none;
      transition: all .15s; white-space: nowrap; flex-shrink: 0;
      letter-spacing: -0.01em; line-height: 1.3;
    }
    .btn-primary { background: var(--accent); color: #fff; box-shadow: 0 1px 6px var(--acc-gl); }
    .btn-primary:hover { filter: brightness(1.08); }
    .btn-primary:active { transform: scale(.98); }
    .btn-primary:disabled { opacity: .4; cursor: not-allowed; }
    .btn-ghost { background: var(--bg-card); color: var(--t2); border: 1px solid var(--border); }
    .btn-ghost:hover { background: var(--bg-hover); color: var(--t1); }
    .btn-danger { background: var(--red-lo); color: var(--red); border: 1px solid rgba(224,88,88,.2); }
    .btn-danger:hover { background: rgba(224,88,88,.18); }
    .btn-success { background: var(--green-lo); color: var(--green); border: 1px solid rgba(61,191,138,.2); }
    .btn-success:hover { background: rgba(61,191,138,.18); }
    .btn-sm { padding: 5px 11px; font-size: 12px; border-radius: var(--r1); }
    .btn-full { width: 100%; justify-content: center; }

    /* ── CARDS ──────────────────────────────────────────────────── */
    .card { background: var(--bg-card); border: 1px solid var(--border); border-radius: var(--r4); overflow: hidden; }
    .card-head { padding: 14px 18px; border-bottom: 1px solid var(--border); display: flex; align-items: center; justify-content: space-between; }
    .card-title { font-size: 13.5px; font-weight: 600; color: var(--t1); letter-spacing: -0.01em; }
    .card-body { padding: 18px; }

    /* ── STAT CARDS ─────────────────────────────────────────────── */
    .kpi-grid {
      display: grid;
      grid-template-columns: repeat(4, minmax(0, 1fr));
      gap: 14px; margin-bottom: 24px;
    }
    .kpi {
      background: var(--bg-card); border: 1px solid var(--border);
      border-radius: var(--r4); padding: 20px 22px;
      position: relative; overflow: hidden;
      transition: border-color .2s, transform .2s; cursor: default;
    }
    .kpi::after {
      content: ''; position: absolute; bottom: 0; left: 0; right: 0; height: 2px;
      opacity: 0; transition: opacity .2s;
    }
    .kpi:hover { border-color: var(--border-hi); transform: translateY(-1px); }
    .kpi:hover::after { opacity: 1; }
    .kpi.k-or::after { background: var(--accent); }
    .kpi.k-gr::after { background: var(--green); }
    .kpi.k-bl::after { background: var(--blue); }
    .kpi.k-pu::after { background: var(--purple); }

    .kpi-label { font-size: 11px; font-weight: 600; color: var(--t3); text-transform: uppercase; letter-spacing: .09em; margin-bottom: 10px; }
    .kpi-value { font-family: 'Geist Mono', monospace; font-size: clamp(19px,2.2vw,27px); font-weight: 600; color: var(--t1); letter-spacing: -.04em; line-height: 1; }
    .kpi-trend { font-size: 11.5px; font-weight: 500; margin-top: 10px; display: flex; align-items: center; gap: 4px; color: var(--t3); }
    .kpi-trend.up { color: var(--green); }
    .kpi-trend.dn { color: var(--red); }

    /* ── GRIDS ──────────────────────────────────────────────────── */
    .grid-2 { display: grid; grid-template-columns: repeat(2, minmax(0,1fr)); gap: 14px; width: 100%; }
    .grid-3 { display: grid; grid-template-columns: repeat(3, minmax(0,1fr)); gap: 14px; width: 100%; }
    .grid-auto { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px,1fr)); gap: 14px; width: 100%; }

    /* ── TABLE ──────────────────────────────────────────────────── */
    .t-wrap { overflow-x: auto; width: 100%; display: block; }
    .t {
      width: 100%; border-collapse: collapse;
      font-size: 13px; white-space: nowrap;
      min-width: 700px;
    }
    .t th {
      padding: 10px 16px; text-align: left;
      font-size: 10.5px; font-weight: 600; color: var(--t3);
      text-transform: uppercase; letter-spacing: .07em;
      border-bottom: 1px solid var(--border);
      background: var(--bg-card);
      position: sticky; top: 0;
    }
    .t td {
      padding: 13px 16px; color: var(--t2);
      border-bottom: 1px solid rgba(255,255,255,.04);
      vertical-align: middle;
      max-width: 200px;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .t tr:last-child td { border-bottom: none; }
    .t tbody tr:hover td { background: var(--bg-hover); color: var(--t1); }
    .cell-name { display: flex; align-items: center; gap: 10px; }

    /* ── AVATAR ─────────────────────────────────────────────────── */
    .av {
      width: 32px; height: 32px; border-radius: var(--r2);
      display: flex; align-items: center; justify-content: center;
      font-family: 'Geist Mono', monospace;
      font-size: 11px; font-weight: 600;
      flex-shrink: 0; overflow: hidden; line-height: 1;
    }
    .av-lg { width: 40px; height: 40px; border-radius: var(--r3); font-size: 13px; }
    .av-or { background: rgba(241,130,66,.15); color: var(--accent); }
    .av-bl { background: rgba(74,158,245,.15); color: var(--blue); }
    .av-gr { background: rgba(61,191,138,.15); color: var(--green); }
    .av-pu { background: rgba(155,127,232,.15); color: var(--purple); }
    .av-am { background: rgba(232,168,76,.15); color: var(--amber); }

    /* ── BADGE ──────────────────────────────────────────────────── */
    .tag {
      display: inline-flex; align-items: center; gap: 5px;
      padding: 3px 9px; border-radius: 99px;
      font-size: 11px; font-weight: 600;
      white-space: nowrap; letter-spacing: .01em;
    }
    .tag::before { content: ''; width: 5px; height: 5px; border-radius: 50%; background: currentColor; flex-shrink: 0; }
    .tag-green  { background: var(--green-lo);  color: var(--green); }
    .tag-amber  { background: var(--amber-lo);  color: var(--amber); }
    .tag-red    { background: var(--red-lo);    color: var(--red); }
    .tag-blue   { background: var(--blue-lo);   color: var(--blue); }
    .tag-orange { background: var(--acc-lo);    color: var(--accent); }
    .tag-purple { background: var(--purple-lo); color: var(--purple); }

    /* ── PROGRESS ───────────────────────────────────────────────── */
    .bar { height: 5px; background: var(--bg-muted); border-radius: 99px; overflow: hidden; flex: 1; }
    .bar-fill { height: 100%; border-radius: 99px; transition: width .5s ease; }
    .bf-or { background: var(--accent); }
    .bf-gr { background: var(--green); }
    .bf-bl { background: var(--blue); }
    .bf-pu { background: var(--purple); }

    /* ── FORMS ──────────────────────────────────────────────────── */
    .field { margin-bottom: 13px; }
    .field-lbl { display: block; font-size: 11.5px; font-weight: 500; color: var(--t2); margin-bottom: 5px; }
    .field-inp {
      width: 100%; padding: 8px 12px;
      background: var(--bg-input); border: 1px solid var(--border);
      border-radius: var(--r2); color: var(--t1);
      font-size: 13.5px; font-family: 'Geist', sans-serif;
      outline: none; transition: border-color .15s;
      appearance: none; line-height: 1.4;
    }
    .field-inp:focus { border-color: var(--border-hi); box-shadow: 0 0 0 3px var(--acc-lo); }
    .field-inp::placeholder { color: var(--t3); }
    textarea.field-inp { resize: vertical; min-height: 80px; }
    .fgrid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }

    /* ── FILTER BAR ─────────────────────────────────────────────── */
    .filter-bar { display: flex; gap: 8px; margin-bottom: 16px; flex-wrap: wrap; align-items: center; }
    .search-input {
      display: flex; align-items: center; gap: 8px;
      background: var(--bg-card); border: 1px solid var(--border);
      border-radius: var(--r2); padding: 7px 13px;
      flex: 1; min-width: 220px; transition: border-color .15s;
    }
    .search-input:focus-within { border-color: var(--border-hi); }
    .search-input input {
      background: none; border: none; outline: none;
      color: var(--t1); font-size: 13px;
      font-family: 'Geist', sans-serif; width: 100%;
    }
    .search-input input::placeholder { color: var(--t3); }

    /* ── MODAL ──────────────────────────────────────────────────── */
    .modal-bg {
      position: fixed; inset: 0;
      background: rgba(0,0,0,.65); backdrop-filter: blur(5px);
      display: flex; align-items: center; justify-content: center;
      z-index: 999; padding: 20px;
      animation: fadeIn .15s ease;
    }
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
    .modal {
      background: var(--bg-card); border: 1px solid var(--border);
      border-radius: var(--r5); width: 100%;
      max-width: 540px; max-height: 88vh; overflow-y: auto;
      box-shadow: 0 24px 70px rgba(0,0,0,.55);
      animation: modalIn .2s cubic-bezier(.16,1,.3,1);
    }
    .modal-wide { max-width: 620px; }
    @keyframes modalIn {
      from { opacity: 0; transform: scale(.96) translateY(8px); }
      to   { opacity: 1; transform: none; }
    }
    .modal-head {
      padding: 16px 20px; border-bottom: 1px solid var(--border);
      display: flex; align-items: center; justify-content: space-between;
      position: sticky; top: 0; background: var(--bg-card); z-index: 2;
    }
    .modal-title { font-size: 15px; font-weight: 600; letter-spacing: -.02em; }
    .modal-x {
      width: 26px; height: 26px; border-radius: var(--r1);
      background: var(--bg-muted); border: none;
      color: var(--t2); cursor: pointer; font-size: 16px;
      display: flex; align-items: center; justify-content: center;
      transition: all .15s;
    }
    .modal-x:hover { background: var(--red-lo); color: var(--red); }
    .modal-body { padding: 20px; }
    .modal-foot { padding: 14px 20px; border-top: 1px solid var(--border); display: flex; gap: 8px; justify-content: flex-end; }

    /* ── TIMELINE ───────────────────────────────────────────────── */
    .tl { display: flex; flex-direction: column; }
    .tl-row { display: flex; gap: 12px; padding-bottom: 16px; position: relative; }
    .tl-row:last-child { padding-bottom: 0; }
    .tl-row:not(:last-child)::after { content: ''; position: absolute; left: 12px; top: 26px; bottom: 0; width: 1px; background: var(--border); }
    .tl-dot { width: 26px; height: 26px; border-radius: var(--r2); flex-shrink: 0; display: flex; align-items: center; justify-content: center; font-size: 11px; z-index: 1; }
    .tl-main { font-size: 13px; font-weight: 500; color: var(--t1); }
    .tl-sub  { font-size: 12px; color: var(--t3); margin-top: 2px; }

    /* ── TOP LIST ───────────────────────────────────────────────── */
    .top-row { display: flex; align-items: center; gap: 10px; padding: 10px 0; border-bottom: 1px solid rgba(255,255,255,.04); }
    .top-row:last-child { border-bottom: none; }
    .rank {
      width: 20px; height: 20px; border-radius: var(--r1);
      display: flex; align-items: center; justify-content: center;
      font-size: 10px; font-weight: 700;
      font-family: 'Geist Mono', monospace; flex-shrink: 0;
    }
    .rk1 { background: rgba(232,168,76,.18); color: var(--amber); }
    .rk2 { background: rgba(74,158,245,.14); color: var(--blue); }
    .rk3 { background: rgba(155,127,232,.14); color: var(--purple); }
    .rkn { background: var(--bg-muted); color: var(--t3); }

    /* ── INFO GRID ──────────────────────────────────────────────── */
    .info-g { display: grid; grid-template-columns: auto 1fr; gap: 7px 16px; font-size: 12.5px; align-items: start; }
    .ik { color: var(--t3); white-space: nowrap; }
    .iv { color: var(--t2); text-align: right; word-break: break-word; }

    /* ── DETAIL PANEL ───────────────────────────────────────────── */
    .detail {
      position: fixed; top: 0; right: -440px;
      width: 440px; height: 100vh;
      background: var(--bg-card); border-left: 1px solid var(--border);
      z-index: 200; overflow-y: auto;
      transition: right .3s cubic-bezier(.4,0,.2,1);
      box-shadow: -12px 0 40px rgba(0,0,0,.4);
    }
    .detail.open { right: 0; }
    .detail-head {
      padding: 16px 20px; border-bottom: 1px solid var(--border);
      display: flex; align-items: center; justify-content: space-between;
      position: sticky; top: 0; background: var(--bg-card); z-index: 2;
    }
    .detail-body { padding: 20px; }

    /* ── MONITOR CARD ───────────────────────────────────────────── */
    .m-card {
      background: var(--bg-card); border: 1px solid var(--border);
      border-radius: var(--r4); padding: 20px;
      transition: border-color .2s, transform .2s;
    }
    .m-card:hover { border-color: var(--border-hi); transform: translateY(-1px); }
    .m-head { display: flex; align-items: flex-start; gap: 13px; margin-bottom: 16px; }
    .m-name { font-size: 14.5px; font-weight: 600; letter-spacing: -.02em; }
    .m-role { font-size: 12px; color: var(--accent); margin-top: 2px; }
    .stars  { color: var(--amber); font-size: 11px; letter-spacing: 2px; margin-top: 4px; }
    .m-meta { display: grid; grid-template-columns: auto 1fr; gap: 6px 12px; font-size: 12px; margin-bottom: 14px; }
    .mk { color: var(--t3); } .mv { color: var(--t2); text-align: right; font-family: 'Geist Mono', monospace; font-size: 11.5px; }
    .m-stats { display: grid; grid-template-columns: repeat(3,1fr); gap: 8px; }
    .mstat { text-align: center; background: var(--bg-muted); border-radius: var(--r2); padding: 11px 6px; }
    .mstat-v { font-family: 'Geist Mono', monospace; font-size: 17px; font-weight: 600; letter-spacing: -.03em; }
    .mstat-l { font-size: 9.5px; color: var(--t3); margin-top: 3px; text-transform: uppercase; letter-spacing: .06em; }

    /* ── VEHICLE CARD ───────────────────────────────────────────── */
    .v-card { background: var(--bg-card); border: 1px solid var(--border); border-radius: var(--r4); overflow: hidden; transition: border-color .2s; }
    .v-card:hover { border-color: var(--border-hi); }
    .v-thumb { height: 100px; background: var(--bg-muted); display: flex; align-items: center; justify-content: center; font-size: 46px; }
    .v-body { padding: 16px; }

    /* ── PAYMENT OPTIONS ────────────────────────────────────────── */
    .pay-opt {
      display: flex; align-items: center; gap: 10px;
      padding: 10px 13px; background: var(--bg-muted);
      border: 1.5px solid var(--border); border-radius: var(--r2);
      cursor: pointer; transition: all .15s; margin-bottom: 7px;
    }
    .pay-opt:hover,.pay-opt.sel { border-color: var(--accent); background: var(--acc-lo); }

    /* ── ALERT ──────────────────────────────────────────────────── */
    .alert {
      display: flex; align-items: center; gap: 10px;
      padding: 10px 14px; border-radius: var(--r2);
      margin-bottom: 20px; font-size: 13px; font-weight: 500;
    }
    .alert-warn { background: var(--amber-lo); border: 1px solid rgba(232,168,76,.25); color: var(--amber); }
    .alert-err  { background: var(--red-lo);   border: 1px solid rgba(224,88,88,.25);  color: var(--red); }

    /* ── TOAST ──────────────────────────────────────────────────── */
    .toasts { position: fixed; bottom: 24px; right: 24px; z-index: 9999; display: flex; flex-direction: column; gap: 8px; pointer-events: none; }
    .toast {
      padding: 11px 16px; border-radius: var(--r3);
      font-size: 13px; font-weight: 500;
      min-width: 260px; max-width: 380px;
      display: flex; align-items: center; gap: 10px;
      box-shadow: 0 8px 28px rgba(0,0,0,.5);
      pointer-events: all;
      animation: toastIn .25s cubic-bezier(.16,1,.3,1);
      border: 1px solid transparent;
    }
    @keyframes toastIn { from { opacity: 0; transform: translateX(16px); } to { opacity: 1; transform: none; } }
    .t-ok  { background: var(--bg-card); border-color: rgba(61,191,138,.3);  color: var(--green); }
    .t-err { background: var(--bg-card); border-color: rgba(224,88,88,.3);   color: var(--red); }
    .t-inf { background: var(--bg-card); border-color: rgba(74,158,245,.3);  color: var(--blue); }

    /* ── CODE BLOCK ─────────────────────────────────────────────── */
    .code {
      background: var(--bg); border: 1px solid var(--border);
      border-radius: var(--r3); padding: 14px 16px;
      font-family: 'Geist Mono', monospace;
      font-size: 12px; line-height: 1.75; color: var(--t2);
      overflow: auto; white-space: pre; max-height: 420px;
    }

    /* ── SETTINGS ───────────────────────────────────────────────── */
    .s-block { background: var(--bg-card); border: 1px solid var(--border); border-radius: var(--r4); overflow: hidden; margin-bottom: 14px; }
    .s-block-head { padding: 13px 18px; border-bottom: 1px solid var(--border); font-size: 13.5px; font-weight: 600; display: flex; align-items: center; gap: 8px; }
    .s-block-body { padding: 18px; }

    /* ── DIVIDER ────────────────────────────────────────────────── */
    .div { height: 1px; background: var(--border); margin: 14px 0; }

    /* ── UTILS ──────────────────────────────────────────────────── */
    .row    { display: flex; align-items: center; }
    .rbtw   { display: flex; align-items: center; justify-content: space-between; }
    .ml     { margin-left: auto; }
    .g4     { gap: 4px; }  .g6  { gap: 6px; }  .g8  { gap: 8px; }
    .g10    { gap: 10px; } .g12 { gap: 12px; }
    .mt4    { margin-top: 4px; }   .mt8 { margin-top: 8px; }   .mt12 { margin-top: 12px; } .mt16 { margin-top: 16px; }
    .mb8    { margin-bottom: 8px; } .mb12 { margin-bottom: 12px; } .mb16 { margin-bottom: 16px; } .mb24 { margin-bottom: 24px; }
    .f600   { font-weight: 600; }
    .mono   { font-family: 'Geist Mono', monospace; }
    .t-acc  { color: var(--accent); }
    .t-grn  { color: var(--green); }
    .t-red  { color: var(--red); }
    .t-mut  { color: var(--t3); font-size: 12px; }
    .t-sec  { color: var(--t2); }
    .t-pri  { color: var(--t1); }
    .t-sm   { font-size: 12px; color: var(--t2); }
    .nowrap { white-space: nowrap; }
    .empty  { text-align: center; padding: 52px 20px; }
    .empty-ico  { font-size: 36px; opacity: .25; margin-bottom: 12px; }
    .empty-txt  { font-size: 14px; font-weight: 500; color: var(--t2); }
    .empty-sub  { font-size: 12.5px; color: var(--t3); margin-top: 4px; }

    /* ── RESPONSIVE ─────────────────────────────────────────────── */
    @media (min-width: 769px) {
      .sidebar { position: sticky !important; transform: none !important; }
    }
    @media (max-width: 1400px) { :root { --w-side: 215px; } .page { padding: 24px 28px; } }
    @media (max-width: 1200px) { :root { --w-side: 200px; } .top-search { width: 200px; } }
    @media (max-width: 1024px) { .top-search { display: none; } .kpi-grid { grid-template-columns: repeat(2,1fr); } }
    @media (max-width: 768px) {
      .app { display: block; }
      .sidebar { position: fixed !important; transform: translateX(-100%) !important; width: 240px; z-index: 200; }
      .sidebar.open { transform: translateX(0) !important; }
      .ham { display: flex !important; }
      .main { width: 100%; }
      .page { padding: 16px; }
      .kpi-grid { grid-template-columns: repeat(2,1fr); gap: 10px; }
      .grid-2, .grid-3 { grid-template-columns: 1fr; }
      .fgrid { grid-template-columns: 1fr; }
      .grid-auto { grid-template-columns: 1fr; }
      .detail { width: 100%; right: -100%; }
      .topbar { padding: 0 16px; }
    }
    @media (max-width: 480px) {
      .kpi-grid { grid-template-columns: 1fr 1fr; gap: 8px; }
      .kpi { padding: 14px 16px; }
      .kpi-value { font-size: 18px; }
      .page-head { flex-direction: column; gap: 10px; }
      .grid-3 { grid-template-columns: 1fr; }
    }
  `}</style>
);


/* ─── HELPERS ───────────────────────────────────────────────────── */
const AV_COLORS = ["or","bl","gr","pu","am"];
const avColor = (id) => AV_COLORS[(id - 1) % AV_COLORS.length];
const initials = (nom, prenom) => `${(prenom||"")[0]||""}${(nom||"")[0]||""}`.toUpperCase();
const starsStr = (n) => "★".repeat(Math.floor(n)) + "☆".repeat(5 - Math.floor(n));
const formatFCFA = (n) => (n ?? 0).toLocaleString("fr-FR").replace(/\s/g, "\u202F") + " FCFA";
const formatDate = (d) => d ? new Date(d + "T00:00:00").toLocaleDateString("fr-FR", { day:"numeric", month:"short", year:"numeric" }) : "—";
const todayStr   = () => new Date().toISOString().slice(0, 10);

function Tag({ v }) {
  const map = {
    Actif:"green", Diplômé:"blue", Suspendu:"red", Congé:"amber", Inactif:"red",
    Confirmée:"green","En attente":"amber",Annulée:"red",Terminée:"blue",
    Payé:"green",Réussi:"green",Échoué:"red",
    Disponible:"green","En service":"blue",Maintenance:"amber","Hors service":"red",
  };
  return <span className={`tag tag-${map[v]||"blue"}`}>{v}</span>;
}

function Av({ nom, prenom, id, lg }) {
  const c = avColor(id || 1);
  return <div className={`av${lg?" av-lg":""} av-${c}`} translate="no">{initials(nom,prenom)}</div>;
}

function Modal({ title, onClose, footer, children, wide }) {
  return (
    <div className="modal-bg" onClick={e => e.target===e.currentTarget && onClose()}>
      <div className={`modal${wide?" modal-wide":""}`}>
        <div className="modal-head">
          <div className="modal-title">{title}</div>
          <button className="modal-x" onClick={onClose}>×</button>
        </div>
        <div className="modal-body">{children}</div>
        {footer && <div className="modal-foot">{footer}</div>}
      </div>
    </div>
  );
}

/* ─── TOAST ─────────────────────────────────────────────────────── */
function useToast() {
  const [toasts, setToasts] = useState([]);
  const add = useCallback((msg, type="success") => {
    const id = Date.now();
    setToasts(t => [...t, { id, msg, type }]);
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 3200);
  }, []);
  return { toasts, add };
}

function Toasts({ items }) {
  return (
    <div className="toasts">
      {items.map(t => (
        <div key={t.id} className={`toast ${t.type==="success"?"t-ok":t.type==="error"?"t-err":"t-inf"}`}>
          <span>{t.type==="success"?"✓":t.type==="error"?"✕":"·"}</span> {t.msg}
        </div>
      ))}
    </div>
  );
}

/* ─── DASHBOARD ─────────────────────────────────────────────────── */
function Dashboard({ data, setPage, toast }) {
  const { eleves, moniteurs, lecons, paiements, examens } = data;
  const actifs = eleves.filter(e => e.statut === "Actif").length;
  const ca     = paiements.filter(p => p.statut === "Payé").reduce((s, p) => s + p.montant, 0);
  const tr     = examens.length ? Math.round(examens.filter(x => x.statut === "Réussi").length / examens.length * 100) : 0;
  const todayL = lecons.filter(l => l.date === todayStr());
  const impay  = paiements.filter(p => p.statut === "En attente");
  const top4   = [...eleves].sort((a, b) => b.heuresEffectuees - a.heuresEffectuees).slice(0, 4);

  const acts = [
    { icon:"·", bg: "var(--accent-dim)", title:"Élève inscrit", sub:`${eleves[eleves.length-1]?.prenom} ${eleves[eleves.length-1]?.nom}`, time:"Récemment" },
    { icon:"·", bg: "var(--blue-dim)",   title:"Leçons confirmées", sub:`${lecons.filter(l=>l.statut==="Confirmée").length} confirmées ce jour`, time:"Aujourd'hui" },
    { icon:"·", bg: "var(--green-dim)",  title:"Paiements reçus", sub:`${paiements.filter(p=>p.statut==="Payé").length} paiements — ${formatFCFA(ca)}`, time:"Total" },
    { icon:"·", bg: "var(--purple-dim)", title:"Taux de réussite", sub:`${tr}% sur ${examens.length} examens passés`, time:"Global" },
  ];

  return (
    <div>
      <div className="page-head">
        <div>
          <div className="page-title">Vue d'ensemble</div>
          <div className="page-sub">Auto-École Excellence · {new Date().toLocaleDateString("fr-FR", { weekday:"long", day:"numeric", month:"long", year:"numeric" })}</div>
        </div>
        <div className="page-actions">
          <button className="btn btn-ghost btn-sm" onClick={() => { downloadFile(exportSQL(), "autoges.sql"); toast("Export SQL téléchargé","info"); }} translate="no">↓ SQL</button>
          <button className="btn btn-ghost btn-sm" onClick={() => { downloadFile(exportJSON(), "backup.json","application/json"); toast("Backup JSON téléchargé","info"); }} translate="no">↓ Backup</button>
          <button className="btn btn-primary" onClick={() => setPage("el")}>+ Nouvel élève</button>
        </div>
      </div>

      {impay.length > 0 && (
        <div className="alert alert-warn">
          <span>⚠</span>
          <span>{impay.length} paiement{impay.length > 1 ? "s" : ""} en attente — {formatFCFA(impay.reduce((s,p)=>s+p.montant,0))} à régulariser</span>
          <button className="btn btn-ghost btn-sm ml-auto" onClick={() => setPage("pa")}>Voir →</button>
        </div>
      )}

      <div className="kpi-grid">
        {[
          { c:"s-orange", ic:"si-orange", emoji:"👤", v:actifs,       l:"Élèves actifs",      ch:"+8%", up:true  },
          { c:"s-green",  ic:"si-green",  emoji:"✓",  v:`${tr}%`,    l:"Taux de réussite",   ch:"+3%", up:true  },
          { c:"s-blue",   ic:"si-blue",   emoji:"◈",  v:lecons.length, l:"Leçons planifiées", ch:`${todayL.length} auj.`, up:true },
          { c:"s-purple", ic:"si-purple", emoji:"◎",  v:formatFCFA(ca), l:"Chiffre d'affaires", ch:"+15%", up:true },
        ].map((s, i) => (
          <div className={`stat-card ${s.c}`} key={i}>
            <div className="kpi-label">{s.l}</div>
            <div className="kpi-value">{s.v}</div>
            <div className={`stat-change ${s.up ? "up" : "dn"}`}>
              {s.up ? "↑" : "↓"} {s.ch} ce mois
            </div>
          </div>
        ))}
      </div>

      <div className="grid-2 mb-16">
        {/* Activité */}
        <div className="card">
          <div className="card-head">
            <div className="card-title">Activité</div>
            <span className="tag tag-green">En direct</span>
          </div>
          <div className="card-body" style={{paddingTop:12, paddingBottom:12}}>
            <div className="tl">
              {acts.map((a, i) => (
                <div className="tl-row" key={i}>
                  <div className="tl-dot" style={{background: a.bg}}>
                    <span style={{fontSize:10, color:"var(--t2)"}}>●</span>
                  </div>
                  <div>
                    <div className="tl-main">{a.title}</div>
                    <div className="tl-sub">{a.sub} · {a.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Top élèves */}
        <div className="card">
          <div className="card-head">
            <div className="card-title">Meilleure progression</div>
            <span className="t-mut">Ce mois</span>
          </div>
          <div className="card-body" style={{paddingTop:8, paddingBottom:8}}>
            {top4.map((e, i) => (
              <div className="top-row" key={e.id}>
                <div className={`rank-badge rank-${i < 3 ? i+1 : "n"}`}>{i+1}</div>
                <Av nom={e.nom} prenom={e.prenom} id={e.id}/>
                <div style={{flex:1, minWidth:0}}>
                  <div className="fw-500" style={{fontSize:13}}>{e.prenom} {e.nom}</div>
                  <div style={{marginTop:4}}>
                    <div className="bar">
                      <div className="bar-fill bf-or" style={{width:`${Math.round(e.heuresEffectuees/e.heuresTotal*100)}%`}}/>
                    </div>
                    <div className="text-muted mt-4">{e.heuresEffectuees}h / {e.heuresTotal}h</div>
                  </div>
                </div>
                <div className="text-mono fw-600" style={{fontSize:13, color:"var(--accent)", flexShrink:0}}>
                  {Math.round(e.heuresEffectuees/e.heuresTotal*100)}%
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid-2">
        {/* Leçons du jour */}
        <div className="card">
          <div className="card-head">
            <div className="card-title">Leçons du jour</div>
            <span className="tag tag-blue">{todayL.length} séances</span>
          </div>
          {todayL.length === 0 ? (
            <div className="empty">
              <div className="empty-ico">◻</div>
              <div className="empty-txt">Aucune leçon aujourd'hui</div>
            </div>
          ) : (
            <div className="t-wrap">
              <table className="t">
                <thead><tr><th>Élève</th><th>Heure</th><th>Type</th><th>Statut</th></tr></thead>
                <tbody>
                  {todayL.slice(0,5).map(l => {
                    const e = eleves.find(x => x.id === l.eleveId);
                    return (
                      <tr key={l.id}>
                        <td>
                          <div className="cell-name">
                            <Av nom={e?.nom} prenom={e?.prenom} id={l.eleveId}/>
                            <span className="fw-500 text-primary">{e?.prenom} {e?.nom}</span>
                          </div>
                        </td>
                        <td className="text-mono fw-600 text-accent">{l.heure}</td>
                        <td>{l.type}</td>
                        <td><Tag v={l.statut}/></td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Répartition */}
        <div className="card">
          <div className="card-head"><div className="card-title">Répartition</div></div>
          <div className="card-body">
            {[
              { l:"Permis B — Voiture", c:eleves.filter(e=>e.permis==="B").length, t:eleves.length, p:"pf-orange" },
              { l:"Permis A — Moto",    c:eleves.filter(e=>e.permis==="A").length, t:eleves.length, p:"pf-blue" },
              { l:"Diplômés",           c:eleves.filter(e=>e.statut==="Diplômé").length, t:eleves.length, p:"pf-green" },
              { l:"Moniteurs actifs",   c:moniteurs.filter(m=>m.statut==="Actif").length, t:moniteurs.length, p:"pf-purple" },
            ].map((r, i) => (
              <div key={i} style={{marginBottom:16}}>
                <div className="row-between mb-8">
                  <span className="t-sm">{r.l}</span>
                  <span className="text-mono fw-600" style={{fontSize:12}}>{r.c} / {r.t}</span>
                </div>
                <div className="bar">
                  <div className={`progress-fill ${r.p}`} style={{width:`${Math.round(r.c/Math.max(r.t,1)*100)}%`}}/>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── ÉLÈVES ────────────────────────────────────────────────────── */
function Eleves({ data, refresh, toast }) {
  const { eleves, moniteurs } = data;
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("Tous");
  const [modal, setModal]   = useState(false);
  const [detail, setDetail] = useState(null);
  const [sel, setSel]       = useState(null);
  const blank = { nom:"",prenom:"",email:"",telephone:"",dateNaissance:"",lieuNaissance:"",cni:"",moniteurId:moniteurs[0]?.id||1,statut:"Actif",heuresEffectuees:0,heuresTotal:30,solde:0,permis:"B",notes:"" };
  const [form, setForm] = useState(blank);

  const filtered = eleves.filter(e => {
    const m = `${e.nom} ${e.prenom} ${e.email} ${e.telephone} ${e.cni}`.toLowerCase().includes(search.toLowerCase());
    const f = filter === "Tous" || e.statut === filter;
    return m && f;
  });

  const openForm = (e=null) => { setSel(e); setForm(e ? {...e} : blank); setModal(true); };
  const save = () => {
    if (!form.nom || !form.prenom) { toast("Nom et prénom requis","error"); return; }
    sel ? update("eleves", sel.id, form) : insert("eleves", {...form, dateInscription: todayStr()});
    refresh(); setModal(false);
    toast(sel ? "Élève modifié" : "Élève inscrit");
  };
  const del = (id) => { if (!window.confirm("Supprimer cet élève ?")) return; remove("eleves", id); refresh(); toast("Élève supprimé","info"); };

  return (
    <div>
      <div className="page-head">
        <div>
          <div className="page-title">Élèves</div>
          <div className="page-sub">{eleves.length} inscrits · {eleves.filter(e=>e.statut==="Actif").length} actifs · {eleves.filter(e=>e.statut==="Diplômé").length} diplômés</div>
        </div>
        <div className="page-actions">
          <button className="btn btn-ghost btn-sm" translate="no" onClick={() => { downloadFile(exportCSV("eleves"),"eleves.csv","text/csv"); toast("Export CSV téléchargé","info"); }}>↓ CSV</button>
          <button className="btn btn-primary" onClick={() => openForm()}>+ Inscrire un élève</button>
        </div>
      </div>

      <div className="filter-bar">
        <div className="search-input">
          <span style={{color:"var(--t3)", fontSize:13}}>⌕</span>
          <input placeholder="Rechercher par nom, email, CNI…" value={search} onChange={e=>setSearch(e.target.value)}/>
        </div>
        {["Tous","Actif","Diplômé","Suspendu"].map(s => (
          <button key={s} className={`btn btn-sm ${filter===s?"btn-primary":"btn-ghost"}`} onClick={() => setFilter(s)}>
            {s} {s!=="Tous" && <span style={{opacity:.65, marginLeft:3}}>({eleves.filter(e=>e.statut===s).length})</span>}
          </button>
        ))}
      </div>

      <div className="card">
        <div className="t-wrap">
          <table className="t">
            <thead>
              <tr>
                <th style={{minWidth:180}}>Élève</th>
                <th style={{width:120}}>Téléphone</th>
                <th style={{width:90}}>Permis</th>
                <th style={{minWidth:170}}>Progression</th>
                <th style={{width:140}}>Solde dû</th>
                <th style={{width:140}}>Moniteur</th>
                <th style={{width:90}}>Statut</th>
                <th style={{width:80}}></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(e => {
                const mon = moniteurs.find(m => m.id === e.moniteurId);
                const pct = Math.round(e.heuresEffectuees / e.heuresTotal * 100);
                return (
                  <tr key={e.id}>
                    <td style={{minWidth:200}}>
                      <div className="cell-name" style={{cursor:"pointer", gap:10}} onClick={() => setDetail(e)}>
                        <Av nom={e.nom} prenom={e.prenom} id={e.id}/>
                        <div style={{minWidth:0}}>
                          <div className="fw-600 text-primary" style={{fontSize:13.5, whiteSpace:"nowrap"}}>{e.prenom} {e.nom}</div>
                          <div style={{fontSize:12, color:"var(--t3)", overflow:"hidden", textOverflow:"ellipsis", maxWidth:150, whiteSpace:"nowrap"}}>{e.email}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{fontFamily:"'Geist Mono',monospace", fontSize:12.5}}>{e.telephone}</td>
                    <td><span className={`tag tag-${e.permis==="B"?"orange":"blue"}`}>Permis {e.permis}</span></td>
                    <td>
                      <div style={{display:"flex", alignItems:"center", gap:10}}>
                        <div className="bar" style={{flex:1, minWidth:80}}>
                          <div className="bar-fill bf-or" style={{width:`${pct}%`}}/>
                        </div>
                        <span style={{fontSize:12, color:"var(--t3)", fontFamily:"'Geist Mono',monospace", whiteSpace:"nowrap", minWidth:52}}>{e.heuresEffectuees}/{e.heuresTotal}h</span>
                      </div>
                    </td>
                    <td style={{fontFamily:"'Geist Mono',monospace", fontSize:13, fontWeight:600, color: e.solde>0?"var(--red)":"var(--green)", whiteSpace:"nowrap"}}>{e.solde>0 ? formatFCFA(e.solde) : "—"}</td>
                    <td>
                      {mon ? (
                        <div style={{display:"flex", alignItems:"center", gap:8}}>
                          <Av nom={mon.nom} prenom={mon.prenom} id={mon.id}/>
                          <span style={{fontSize:12.5, whiteSpace:"nowrap"}}>{mon.prenom} {mon.nom[0]}.</span>
                        </div>
                      ) : <span style={{color:"var(--t3)"}}>—</span>}
                    </td>
                    <td><Tag v={e.statut}/></td>
                    <td>
                      <div style={{display:"flex", gap:4}}>
                        <button className="btn btn-ghost btn-sm" onClick={() => setDetail(e)} title="Voir détails" translate="no">↗</button>
                        <button className="btn btn-ghost btn-sm" onClick={() => openForm(e)} title="Modifier" translate="no">✎</button>
                        <button className="btn btn-danger btn-sm" onClick={() => del(e.id)} title="Supprimer" translate="no">✕</button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="empty">
            <div className="empty-ico">◻</div>
            <div className="empty-txt">Aucun élève trouvé</div>
            <div className="empty-sub">Modifiez vos filtres ou inscrivez un nouvel élève</div>
          </div>
        )}
      </div>

      {/* Panneau détail */}
      {detail && (
        <div className="detail open">
          <div className="detail-head">
            <div className="f600" style={{fontSize:14}}>Fiche élève</div>
            <button className="modal-close" onClick={() => setDetail(null)}>×</button>
          </div>
          <div className="detail-body">
            <div className="row gap-12 mb-12">
              <Av nom={detail.nom} prenom={detail.prenom} id={detail.id} lg/>
              <div>
                <div className="fw-600 text-primary" style={{fontSize:16, letterSpacing:"-0.02em"}}>{detail.prenom} {detail.nom}</div>
                <div className="text-sm mt-4">{detail.email}</div>
                <div className="row gap-4 mt-8">
                  <Tag v={detail.statut}/>
                  <span className={`badge badge-${detail.permis==="B"?"orange":"blue"}`}>Permis {detail.permis}</span>
                </div>
              </div>
            </div>
            <div className="div"/>
            <div style={{marginBottom:14}}>
              <div className="row-between mb-8">
                <span className="t-sm">Progression formation</span>
                <span className="text-mono fw-600 text-accent" style={{fontSize:13}}>{Math.round(detail.heuresEffectuees/detail.heuresTotal*100)}%</span>
              </div>
              <div className="bar" style={{height:6}}>
                <div className="bar-fill bf-or" style={{width:`${Math.round(detail.heuresEffectuees/detail.heuresTotal*100)}%`}}/>
              </div>
              <div className="row-between mt-4">
                <span className="t-mut">{detail.heuresEffectuees}h effectuées</span>
                <span className="t-mut">{detail.heuresTotal - detail.heuresEffectuees}h restantes</span>
              </div>
            </div>
            <div className="div"/>
            <div className="info-g">
              <span className="ik">Téléphone</span><span className="iv">{detail.telephone}</span>
              <span className="ik">Naissance</span><span className="iv">{formatDate(detail.dateNaissance)}</span>
              <span className="ik">Lieu</span><span className="iv">{detail.lieuNaissance}</span>
              <span className="ik">CNI</span><span className="info-val text-mono">{detail.cni}</span>
              <span className="ik">Inscription</span><span className="iv">{formatDate(detail.dateInscription)}</span>
              <span className="ik">Solde</span>
              <span className="info-val fw-600" style={{color:detail.solde>0?"var(--red)":"var(--green)"}}>{formatFCFA(detail.solde)}</span>
            </div>
            {detail.notes && <>
              <div className="div"/>
              <div className="text-sm fw-600 mb-8">Notes</div>
              <div style={{fontSize:13, color:"var(--t2)", background:"var(--bg-muted)", borderRadius:"var(--r2)", padding:"10px 12px", lineHeight:1.5}}>{detail.notes}</div>
            </>}
            <div className="div"/>
            <div className="row gap-8">
              <button className="btn btn-primary btn-sm" style={{flex:1}} onClick={() => { openForm(detail); setDetail(null); }}>Modifier</button>
              <button className="btn btn-danger btn-sm" onClick={() => { del(detail.id); setDetail(null); }}>Supprimer</button>
            </div>
          </div>
        </div>
      )}

      {modal && (
        <Modal title={sel?"Modifier l'élève":"Inscrire un élève"} onClose={() => setModal(false)} wide
          footer={<><button className="btn btn-ghost" onClick={() => setModal(false)}>Annuler</button><button className="btn btn-primary" onClick={save}>Enregistrer</button></>}>
          <div className="fgrid">
            <div className="field"><label className="field-lbl">Prénom *</label><input className="field-inp" value={form.prenom} onChange={e=>setForm({...form,prenom:e.target.value})} placeholder="Prénom"/></div>
            <div className="field"><label className="field-lbl">Nom *</label><input className="field-inp" value={form.nom} onChange={e=>setForm({...form,nom:e.target.value})} placeholder="Nom de famille"/></div>
          </div>
          <div className="fgrid">
            <div className="field"><label className="field-lbl">Email</label><input className="field-inp" type="email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} placeholder="email@exemple.com"/></div>
            <div className="field"><label className="field-lbl">Téléphone</label><input className="field-inp" value={form.telephone} onChange={e=>setForm({...form,telephone:e.target.value})} placeholder="6XX XXX XXX"/></div>
          </div>
          <div className="fgrid">
            <div className="field"><label className="field-lbl">Date de naissance</label><input className="field-inp" type="date" value={form.dateNaissance} onChange={e=>setForm({...form,dateNaissance:e.target.value})}/></div>
            <div className="field"><label className="field-lbl">Lieu de naissance</label><input className="field-inp" value={form.lieuNaissance} onChange={e=>setForm({...form,lieuNaissance:e.target.value})} placeholder="Ville"/></div>
          </div>
          <div className="fgrid">
            <div className="field"><label className="field-lbl">N° Pièce d'identité</label><input className="field-inp" value={form.cni} onChange={e=>setForm({...form,cni:e.target.value})} placeholder="CNI / Passeport"/></div>
            <div className="field"><label className="field-lbl">Permis visé</label>
              <select className="field-inp" value={form.permis} onChange={e=>setForm({...form,permis:e.target.value})}><option>B</option><option>A</option><option>C</option></select>
            </div>
          </div>
          <div className="fgrid">
            <div className="field"><label className="field-lbl">Moniteur assigné</label>
              <select className="field-inp" value={form.moniteurId} onChange={e=>setForm({...form,moniteurId:+e.target.value})}>
                {moniteurs.map(m=><option key={m.id} value={m.id}>{m.prenom} {m.nom}</option>)}
              </select>
            </div>
            <div className="field"><label className="field-lbl">Statut</label>
              <select className="field-inp" value={form.statut} onChange={e=>setForm({...form,statut:e.target.value})}><option>Actif</option><option>Diplômé</option><option>Suspendu</option></select>
            </div>
          </div>
          <div className="fgrid">
            <div className="field"><label className="field-lbl">Heures effectuées</label><input className="field-inp" type="number" min="0" value={form.heuresEffectuees} onChange={e=>setForm({...form,heuresEffectuees:+e.target.value})}/></div>
            <div className="field"><label className="field-lbl">Solde impayé (FCFA)</label><input className="field-inp" type="number" min="0" value={form.solde} onChange={e=>setForm({...form,solde:+e.target.value})}/></div>
          </div>
          <div className="field"><label className="field-lbl">Notes internes</label><textarea className="field-inp" value={form.notes} onChange={e=>setForm({...form,notes:e.target.value})} placeholder="Observations, remarques…"/></div>
        </Modal>
      )}
    </div>
  );
}

/* ─── MONITEURS ─────────────────────────────────────────────────── */
function Moniteurs({ data, refresh, toast }) {
  const { moniteurs, eleves } = data;
  const [modal, setModal] = useState(false);
  const [sel, setSel]     = useState(null);
  const blank = { nom:"",prenom:"",email:"",telephone:"",specialite:"Permis B",statut:"Actif",noteMoyenne:4.5,dateEmbauche:todayStr(),salaire:150000,experience:"1 an",cin:"",adresse:"",notes:"" };
  const [form, setForm] = useState(blank);

  const openForm = (m=null) => { setSel(m); setForm(m?{...m}:blank); setModal(true); };
  const save = () => {
    if (!form.nom||!form.prenom) { toast("Nom et prénom requis","error"); return; }
    sel ? update("moniteurs",sel.id,form) : insert("moniteurs",form);
    refresh(); setModal(false); toast(sel?"Moniteur modifié":"Moniteur ajouté");
  };
  const del = (id) => { if(!window.confirm("Supprimer ce moniteur ?")) return; remove("moniteurs",id); refresh(); toast("Moniteur supprimé","info"); };

  return (
    <div>
      <div className="page-head">
        <div>
          <div className="page-title">Moniteurs</div>
          <div className="page-sub">{moniteurs.length} moniteurs · {moniteurs.filter(m=>m.statut==="Actif").length} disponibles</div>
        </div>
        <button className="btn btn-primary" onClick={() => openForm()}>+ Ajouter un moniteur</button>
      </div>
      <div className="grid-auto">
        {moniteurs.map(m => {
          const nb = eleves.filter(e=>e.moniteurId===m.id).length;
          return (
            <div className="m-card" key={m.id}>
              <div className="m-head">
                <Av nom={m.nom} prenom={m.prenom} id={m.id} lg/>
                <div style={{flex:1}}>
                  <div className="m-name">{m.prenom} {m.nom}</div>
                  <div className="m-role">{m.specialite}</div>
                  <div className="stars mt-4">{starsStr(m.noteMoyenne)} <span className="t-mut" style={{letterSpacing:0}}>{m.noteMoyenne}</span></div>
                </div>
                <Tag v={m.statut}/>
              </div>
              <div className="div"/>
              <div className="m-meta">
                <span className="mk">Email</span><span className="mv">{m.email}</span>
                <span className="mk">Téléphone</span><span className="mv">{m.telephone}</span>
                <span className="mk">Expérience</span><span className="mv">{m.experience}</span>
                <span className="mk">Salaire</span><span className="meta-val text-accent">{formatFCFA(m.salaire)}</span>
              </div>
              <div className="m-stats">
                <div className="mstat"><div className="mstat-v text-mono" style={{color:"var(--accent)"}}>{nb}</div><div className="mstat-l">Élèves</div></div>
                <div className="mstat"><div className="mstat-v text-mono" style={{color:"var(--green)"}}>{m.noteMoyenne}</div><div className="mstat-l">Note</div></div>
                <div className="mstat"><div className="mstat-v" style={{color:"var(--blue)",fontSize:12}}>{m.experience}</div><div className="mstat-l">Exp.</div></div>
              </div>
              <div className="div"/>
              <div className="row gap-8">
                <button className="btn btn-ghost btn-sm" style={{flex:1}} onClick={() => openForm(m)}>Modifier</button>
                <button className="btn btn-danger btn-sm" onClick={() => del(m.id)}>✕</button>
              </div>
            </div>
          );
        })}
      </div>
      {modal && (
        <Modal title={sel?"Modifier le moniteur":"Nouveau moniteur"} onClose={() => setModal(false)} wide
          footer={<><button className="btn btn-ghost" onClick={() => setModal(false)}>Annuler</button><button className="btn btn-primary" onClick={save}>Enregistrer</button></>}>
          <div className="fgrid">
            <div className="field"><label className="field-lbl">Prénom *</label><input className="field-inp" value={form.prenom} onChange={e=>setForm({...form,prenom:e.target.value})}/></div>
            <div className="field"><label className="field-lbl">Nom *</label><input className="field-inp" value={form.nom} onChange={e=>setForm({...form,nom:e.target.value})}/></div>
          </div>
          <div className="field"><label className="field-lbl">Email</label><input className="field-inp" type="email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})}/></div>
          <div className="fgrid">
            <div className="field"><label className="field-lbl">Téléphone</label><input className="field-inp" value={form.telephone} onChange={e=>setForm({...form,telephone:e.target.value})}/></div>
            <div className="field"><label className="field-lbl">Spécialité</label>
              <select className="field-inp" value={form.specialite} onChange={e=>setForm({...form,specialite:e.target.value})}><option>Permis B</option><option>Permis A</option><option>Permis B/A</option><option>Permis C</option></select>
            </div>
          </div>
          <div className="fgrid">
            <div className="field"><label className="field-lbl">Salaire (FCFA)</label><input className="field-inp" type="number" value={form.salaire} onChange={e=>setForm({...form,salaire:+e.target.value})}/></div>
            <div className="field"><label className="field-lbl">Expérience</label><input className="field-inp" value={form.experience} onChange={e=>setForm({...form,experience:e.target.value})} placeholder="Ex: 3 ans"/></div>
          </div>
          <div className="fgrid">
            <div className="field"><label className="field-lbl">Statut</label>
              <select className="field-inp" value={form.statut} onChange={e=>setForm({...form,statut:e.target.value})}><option>Actif</option><option>Congé</option><option>Inactif</option></select>
            </div>
            <div className="field"><label className="field-lbl">Date d'embauche</label><input className="field-inp" type="date" value={form.dateEmbauche} onChange={e=>setForm({...form,dateEmbauche:e.target.value})}/></div>
          </div>
          <div className="field"><label className="field-lbl">Adresse</label><input className="field-inp" value={form.adresse} onChange={e=>setForm({...form,adresse:e.target.value})}/></div>
          <div className="field"><label className="field-lbl">Notes</label><textarea className="field-inp" value={form.notes} onChange={e=>setForm({...form,notes:e.target.value})} placeholder="Observations…"/></div>
        </Modal>
      )}
    </div>
  );
}

/* ─── PLANNING ──────────────────────────────────────────────────── */
function Planning({ data, refresh, toast }) {
  const { lecons, eleves, moniteurs } = data;
  const [modal, setModal] = useState(false);
  const [filter, setFilter] = useState("Tous");
  const [dateFilter, setDateFilter] = useState("");
  const blank = { eleveId:data.eleves[0]?.id||1, moniteurId:data.moniteurs[0]?.id||1, date:todayStr(), heure:"08:00", duree:2, type:"Conduite", statut:"En attente", vehicule:"", lieu:"", notes:"" };
  const [form, setForm] = useState(blank);

  const colMap = { Confirmée:"var(--green)", "En attente":"var(--amber)", Annulée:"var(--red)", Terminée:"var(--blue)" };
  const filtered = lecons.filter(l => {
    const ft = filter === "Tous" || l.type === filter || l.statut === filter;
    const fd = !dateFilter || l.date === dateFilter;
    return ft && fd;
  }).sort((a,b) => a.date.localeCompare(b.date)||a.heure.localeCompare(b.heure));

  const save = () => {
    if (!form.date||!form.heure) { toast("Date et heure requises","error"); return; }
    insert("lecons", {...form, eleveId:+form.eleveId, moniteurId:+form.moniteurId, duree:+form.duree});
    refresh(); setModal(false); toast("Leçon planifiée");
  };

  return (
    <div>
      <div className="page-head">
        <div>
          <div className="page-title">Planning</div>
          <div className="page-sub">{lecons.length} leçons · {lecons.filter(l=>l.statut==="En attente").length} en attente de confirmation</div>
        </div>
        <button className="btn btn-primary" onClick={() => { setForm(blank); setModal(true); }}>+ Planifier une leçon</button>
      </div>
      <div className="filter-bar">
        {["Tous","Conduite","Code","Confirmée","En attente","Annulée","Terminée"].map(f => (
          <button key={f} className={`btn btn-sm ${filter===f?"btn-primary":"btn-ghost"}`} onClick={() => setFilter(f)}>{f}</button>
        ))}
        <input className="field-inp" type="date" value={dateFilter} onChange={e => setDateFilter(e.target.value)} style={{width:160, padding:"6px 10px"}}/>
        {dateFilter && <button className="btn btn-ghost btn-sm" onClick={() => setDateFilter("")}>✕ Date</button>}
      </div>
      <div style={{display:"flex", flexDirection:"column", gap:8}}>
        {filtered.map(l => {
          const e = eleves.find(x => x.id === l.eleveId);
          const m = moniteurs.find(x => x.id === l.moniteurId);
          return (
            <div key={l.id} className="card" style={{overflow:"hidden"}}>
              <div style={{display:"flex", alignItems:"stretch"}}>
                <div style={{width:3, background:colMap[l.statut]||"var(--border)", flexShrink:0}}/>
                <div style={{display:"flex", alignItems:"center", gap:14, padding:"13px 18px", flex:1, flexWrap:"wrap"}}>
                  <div style={{minWidth:54, textAlign:"center", flexShrink:0}}>
                    <div className="text-mono fw-600 text-accent" style={{fontSize:17}}>{l.heure}</div>
                    <div className="t-mut" style={{fontSize:11}}>{l.duree}h · {formatDate(l.date)}</div>
                  </div>
                  <div style={{width:1, height:34, background:"var(--border)", flexShrink:0}}/>
                  <div className="cell-name" style={{flex:1, minWidth:140}}>
                    <Av nom={e?.nom} prenom={e?.prenom} id={l.eleveId}/>
                    <div>
                      <div className="f600" style={{fontSize:13.5}}>{e?.prenom} {e?.nom}</div>
                      <div className="t-sm">avec {m?.prenom} {m?.nom}</div>
                    </div>
                  </div>
                  <div className="row gap-8" style={{flexWrap:"wrap"}}>
                    <span className={`badge badge-${l.type==="Conduite"?"orange":"blue"}`}>{l.type}</span>
                    <Tag v={l.statut}/>
                    <span className="t-mut" style={{fontSize:12}}>🚗 {l.vehicule||"—"}</span>
                  </div>
                  <div className="row gap-6" style={{marginLeft:"auto", flexWrap:"wrap"}}>
                    {l.statut==="En attente" && <button className="btn btn-success btn-sm" onClick={() => { update("lecons",l.id,{statut:"Confirmée"}); refresh(); toast("Leçon confirmée"); }}>Confirmer</button>}
                    {l.statut==="Confirmée"  && <button className="btn btn-ghost btn-sm"   onClick={() => { update("lecons",l.id,{statut:"Terminée"}); refresh(); toast("Leçon terminée","info"); }}>Terminer</button>}
                    {["En attente","Confirmée"].includes(l.statut) && <button className="btn btn-ghost btn-sm" onClick={() => { update("lecons",l.id,{statut:"Annulée"}); refresh(); toast("Leçon annulée","info"); }}>Annuler</button>}
                    <button className="btn btn-danger btn-sm" onClick={() => { if(window.confirm("Supprimer ?")) { remove("lecons",l.id); refresh(); toast("Supprimé","info"); } }}>✕</button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
        {filtered.length===0 && <div className="empty"><div className="empty-ico">◻</div><div className="empty-txt">Aucune leçon trouvée</div></div>}
      </div>
      {modal && (
        <Modal title="Planifier une leçon" onClose={() => setModal(false)}
          footer={<><button className="btn btn-ghost" onClick={() => setModal(false)}>Annuler</button><button className="btn btn-primary" onClick={save}>Enregistrer</button></>}>
          <div className="fgrid">
            <div className="field"><label className="field-lbl">Élève</label>
              <select className="field-inp" value={form.eleveId} onChange={e=>setForm({...form,eleveId:+e.target.value})}>
                {eleves.map(e=><option key={e.id} value={e.id}>{e.prenom} {e.nom}</option>)}
              </select>
            </div>
            <div className="field"><label className="field-lbl">Moniteur</label>
              <select className="field-inp" value={form.moniteurId} onChange={e=>setForm({...form,moniteurId:+e.target.value})}>
                {moniteurs.map(m=><option key={m.id} value={m.id}>{m.prenom} {m.nom}</option>)}
              </select>
            </div>
          </div>
          <div className="fgrid">
            <div className="field"><label className="field-lbl">Date</label><input className="field-inp" type="date" value={form.date} onChange={e=>setForm({...form,date:e.target.value})}/></div>
            <div className="field"><label className="field-lbl">Heure</label><input className="field-inp" type="time" value={form.heure} onChange={e=>setForm({...form,heure:e.target.value})}/></div>
          </div>
          <div className="fgrid">
            <div className="field"><label className="field-lbl">Type</label>
              <select className="field-inp" value={form.type} onChange={e=>setForm({...form,type:e.target.value})}><option>Conduite</option><option>Code</option></select>
            </div>
            <div className="field"><label className="field-lbl">Durée</label>
              <select className="field-inp" value={form.duree} onChange={e=>setForm({...form,duree:+e.target.value})}><option value={1}>1h</option><option value={2}>2h</option><option value={3}>3h</option></select>
            </div>
          </div>
          <div className="field"><label className="field-lbl">Véhicule / Salle</label><input className="field-inp" value={form.vehicule} onChange={e=>setForm({...form,vehicule:e.target.value})} placeholder="Ex: Toyota Corolla — LT 234 A"/></div>
          <div className="field"><label className="field-lbl">Lieu</label><input className="field-inp" value={form.lieu} onChange={e=>setForm({...form,lieu:e.target.value})} placeholder="Ex: Circuit Akwa"/></div>
          <div className="field"><label className="field-lbl">Notes</label><textarea className="field-inp" value={form.notes} onChange={e=>setForm({...form,notes:e.target.value})} placeholder="Observations…"/></div>
        </Modal>
      )}
    </div>
  );
}

/* ─── EXAMENS ───────────────────────────────────────────────────── */
function Examens({ data, refresh, toast }) {
  const { examens, eleves } = data;
  const [modal, setModal] = useState(false);
  const blank = { eleveId:data.eleves[0]?.id||1, type:"Code", date:todayStr(), score:0, seuil:35, centre:"CENAC Douala", observations:"" };
  const [form, setForm] = useState(blank);
  const tr = examens.length ? Math.round(examens.filter(x=>x.statut==="Réussi").length/examens.length*100) : 0;

  const save = () => {
    const statut = +form.score >= +form.seuil ? "Réussi" : "Échoué";
    insert("examens", {...form, eleveId:+form.eleveId, score:+form.score, seuil:+form.seuil, statut});
    refresh(); setModal(false);
    toast(`Examen enregistré — ${statut}`, statut==="Réussi"?"success":"error");
  };

  return (
    <div>
      <div className="page-head">
        <div>
          <div className="page-title">Examens</div>
          <div className="page-sub">Taux de réussite global : <strong style={{color:"var(--green)"}}>{tr}%</strong> sur {examens.length} examens</div>
        </div>
        <button className="btn btn-primary" onClick={() => { setForm(blank); setModal(true); }}>+ Enregistrer un examen</button>
      </div>
      <div className="grid-3 mb-16">
        {[{l:"Total",v:examens.length,c:"blue"},{l:"Réussis",v:examens.filter(x=>x.statut==="Réussi").length,c:"green"},{l:"Échoués",v:examens.filter(x=>x.statut==="Échoué").length,c:"red"}].map((s,i)=>(
          <div className="kpi" key={i}>
            <div className="kpi-label">{s.l}</div>
            <div className="kpi-value" style={{color:`var(--${s.c})`}}>{s.v}</div>
          </div>
        ))}
      </div>
      <div className="card">
        <div className="t-wrap">
          <table className="t">
            <thead><tr><th>Élève</th><th>Type</th><th>Date</th><th>Score</th><th>Seuil</th><th>Centre</th><th>Résultat</th><th>Observations</th><th></th></tr></thead>
            <tbody>
              {examens.map(x => {
                const e = eleves.find(el=>el.id===x.eleveId);
                return (
                  <tr key={x.id}>
                    <td><div className="cell-name"><Av nom={e?.nom} prenom={e?.prenom} id={x.eleveId}/><span className="fw-600 text-primary">{e?.prenom} {e?.nom}</span></div></td>
                    <td><span className={`badge badge-${x.type==="Code"?"blue":"orange"}`}>{x.type}</span></td>
                    <td>{formatDate(x.date)}</td>
                    <td><span className="text-mono fw-600" style={{fontSize:15,color:x.score>=x.seuil?"var(--green)":"var(--red)"}}>{x.score}</span></td>
                    <td className="text-muted text-mono">{x.seuil}</td>
                    <td>{x.centre}</td>
                    <td><Tag v={x.statut}/></td>
                    <td style={{maxWidth:160,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",color:"var(--t3)",fontSize:12}}>{x.observations||"—"}</td>
                    <td><button className="btn btn-danger btn-sm" onClick={() => { if(window.confirm("Supprimer ?")) { remove("examens",x.id); refresh(); toast("Supprimé","info"); } }}>✕</button></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {examens.length===0 && <div className="empty"><div className="empty-ico">◻</div><div className="empty-txt">Aucun examen enregistré</div></div>}
      </div>
      {modal && (
        <Modal title="Enregistrer un examen" onClose={() => setModal(false)}
          footer={<><button className="btn btn-ghost" onClick={() => setModal(false)}>Annuler</button><button className="btn btn-primary" onClick={save}>Enregistrer</button></>}>
          <div className="field"><label className="field-lbl">Élève</label>
            <select className="field-inp" value={form.eleveId} onChange={e=>setForm({...form,eleveId:+e.target.value})}>
              {eleves.map(e=><option key={e.id} value={e.id}>{e.prenom} {e.nom}</option>)}
            </select>
          </div>
          <div className="fgrid">
            <div className="field"><label className="field-lbl">Type</label>
              <select className="field-inp" value={form.type} onChange={e=>setForm({...form,type:e.target.value,seuil:e.target.value==="Code"?35:70})}><option>Code</option><option>Conduite</option></select>
            </div>
            <div className="field"><label className="field-lbl">Date</label><input className="field-inp" type="date" value={form.date} onChange={e=>setForm({...form,date:e.target.value})}/></div>
          </div>
          <div className="fgrid">
            <div className="field"><label className="field-lbl">Score obtenu</label><input className="field-inp" type="number" min="0" value={form.score} onChange={e=>setForm({...form,score:e.target.value})} placeholder={`Sur ${form.type==="Code"?40:100}`}/></div>
            <div className="field"><label className="field-lbl">Seuil de réussite</label><input className="field-inp" type="number" value={form.seuil} onChange={e=>setForm({...form,seuil:e.target.value})}/></div>
          </div>
          <div className="field"><label className="field-lbl">Centre d'examen</label><input className="field-inp" value={form.centre} onChange={e=>setForm({...form,centre:e.target.value})}/></div>
          <div className="field"><label className="field-lbl">Observations</label><textarea className="field-inp" value={form.observations} onChange={e=>setForm({...form,observations:e.target.value})} placeholder="Notes post-examen…"/></div>
          {+form.score > 0 && (
            <div className={`alert alert-${+form.score>=+form.seuil?"":"danger"}`} style={{background:+form.score>=+form.seuil?"var(--green-dim)":"var(--red-dim)", borderColor:+form.score>=+form.seuil?"rgba(63,185,132,.25)":"rgba(224,92,92,.25)", color:+form.score>=+form.seuil?"var(--green)":"var(--red)"}}>
              {+form.score>=+form.seuil ? "✓ Résultat estimé : RÉUSSI" : "✕ Résultat estimé : ÉCHOUÉ"}
            </div>
          )}
        </Modal>
      )}
    </div>
  );
}

/* ─── PAIEMENTS ─────────────────────────────────────────────────── */
function Paiements({ data, refresh, toast }) {
  const { paiements, eleves } = data;
  const [modal, setModal] = useState(false);
  const [filter, setFilter] = useState("Tous");
  const [modeP, setModeP]   = useState("Mobile Money");
  const blank = { eleveId:data.eleves[0]?.id||1, montant:"", description:"", date:todayStr() };
  const [form, setForm] = useState(blank);

  const ca  = paiements.filter(p=>p.statut==="Payé").reduce((s,p)=>s+p.montant,0);
  const att = paiements.filter(p=>p.statut==="En attente").reduce((s,p)=>s+p.montant,0);
  const modeIcons = { "Mobile Money":"📱", "Espèces":"💵", "Virement":"🏦", "Carte":"💳" };
  const filtered  = filter==="Tous" ? paiements : paiements.filter(p=>p.statut===filter||p.mode===filter);

  const save = () => {
    if (!form.montant||+form.montant<=0) { toast("Montant invalide","error"); return; }
    enregistrerPaiement({...form, eleveId:+form.eleveId, montant:+form.montant, mode:modeP, statut:"Payé"});
    refresh(); setModal(false); toast("Paiement enregistré");
  };

  return (
    <div>
      <div className="page-head">
        <div>
          <div className="page-title">Paiements</div>
          <div className="page-sub">{paiements.length} transactions · {paiements.filter(p=>p.statut==="Payé").length} validés</div>
        </div>
        <div className="page-actions">
          <button className="btn btn-ghost btn-sm" onClick={() => { downloadFile(exportCSV("paiements"),"paiements.csv","text/csv"); toast("Export CSV téléchargé","info"); }}>Exporter</button>
          <button className="btn btn-primary" onClick={() => { setForm(blank); setModeP("Mobile Money"); setModal(true); }}>+ Enregistrer un paiement</button>
        </div>
      </div>

      <div className="grid-3 mb-16">
        <div className="kpi k-gr"><div className="kpi-label">Chiffre d'affaires</div><div className="kpi-value" style={{fontSize:18}}>{formatFCFA(ca)}</div></div>
        <div className="kpi k-or"><div className="kpi-label">En attente</div><div className="kpi-value" style={{fontSize:18}}>{formatFCFA(att)}</div></div>
        <div className="kpi k-bl"><div className="kpi-label">Transactions</div><div className="kpi-value">{paiements.length}</div></div>
      </div>

      <div className="filter-bar">
        {["Tous","Payé","En attente"].map(f => (
          <button key={f} className={`btn btn-sm ${filter===f?"btn-primary":"btn-ghost"}`} onClick={() => setFilter(f)}>{f}</button>
        ))}
      </div>

      <div className="card">
        <div className="t-wrap">
          <table className="t">
            <thead><tr><th style={{width:100}}>Référence</th><th style={{minWidth:160}}>Élève</th><th style={{width:140}}>Montant</th><th style={{width:130}}>Mode</th><th>Description</th><th style={{width:130}}>Date</th><th style={{width:90}}>Statut</th><th style={{width:130}}>Actions</th></tr></thead>
            <tbody>
              {filtered.map(p => {
                const e = eleves.find(x=>x.id===p.eleveId);
                return (
                  <tr key={p.id}>
                    <td><span className="text-mono text-accent fw-600" style={{fontSize:12.5}}>{p.reference}</span></td>
                    <td><div className="cell-name"><Av nom={e?.nom} prenom={e?.prenom} id={p.eleveId}/><span className="fw-600 text-primary">{e?.prenom} {e?.nom}</span></div></td>
                    <td><span className="text-mono fw-600 text-green" style={{fontSize:14}}>{formatFCFA(p.montant)}</span></td>
                    <td><span className="t-sm">{modeIcons[p.mode]} {p.mode}</span></td>
                    <td style={{maxWidth:160,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",fontSize:12,color:"var(--t3)"}}>{p.description||"—"}</td>
                    <td className="t-sm">{formatDate(p.date)}</td>
                    <td><Tag v={p.statut}/></td>
                    <td>
                      <div className="row gap-4">
                        {p.statut==="En attente" && <button className="btn btn-success btn-sm" onClick={() => { update("paiements",p.id,{statut:"Payé"}); refresh(); toast("Paiement validé"); }}>Valider</button>}
                        {p.statut==="Payé" && <button className="btn btn-ghost btn-sm" onClick={() => { const e=eleves.find(x=>x.id===p.eleveId); downloadFile(`REÇU DE PAIEMENT\n—————————————————\nRéf: ${p.reference}\nÉlève: ${e?.prenom} ${e?.nom}\nMontant: ${formatFCFA(p.montant)}\nDate: ${formatDate(p.date)}\nMode: ${p.mode}\nStatut: ${p.statut}\n—————————————————\nAuto-École Excellence`,`recu_${p.reference}.txt`); toast("Reçu téléchargé","info"); }}>Reçu</button>}
                        <button className="btn btn-danger btn-sm" onClick={() => { if(window.confirm("Supprimer ?")) { remove("paiements",p.id); refresh(); toast("Supprimé","info"); } }}>✕</button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {filtered.length===0 && <div className="empty"><div className="empty-ico">◻</div><div className="empty-txt">Aucun paiement trouvé</div></div>}
      </div>

      {modal && (
        <Modal title="Enregistrer un paiement" onClose={() => setModal(false)}
          footer={<><button className="btn btn-ghost" onClick={() => setModal(false)}>Annuler</button><button className="btn btn-primary" onClick={save}>Enregistrer</button></>}>
          <div className="field"><label className="field-lbl">Élève</label>
            <select className="field-inp" value={form.eleveId} onChange={e=>setForm({...form,eleveId:+e.target.value})}>
              {eleves.map(e=><option key={e.id} value={e.id}>{e.prenom} {e.nom} — Solde: {formatFCFA(e.solde)}</option>)}
            </select>
          </div>
          <div className="fgrid">
            <div className="field"><label className="field-lbl">Montant (FCFA) *</label><input className="field-inp" type="number" min="1" value={form.montant} onChange={e=>setForm({...form,montant:e.target.value})} placeholder="Ex: 50 000"/></div>
            <div className="field"><label className="field-lbl">Date</label><input className="field-inp" type="date" value={form.date} onChange={e=>setForm({...form,date:e.target.value})}/></div>
          </div>
          <div className="field">
            <label className="field-lbl">Mode de paiement</label>
            <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:7, marginTop:4}}>
              {["Mobile Money","Espèces","Virement","Carte"].map(m => (
                <div key={m} className={`pay-opt ${modeP===m?"sel":""}`} onClick={() => setModeP(m)}>
                  <span style={{fontSize:18}}>{modeIcons[m]}</span>
                  <span className="pay-name">{m}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="field"><label className="field-lbl">Description</label><input className="field-inp" value={form.description} onChange={e=>setForm({...form,description:e.target.value})} placeholder="Ex: 1ère tranche — Permis B"/></div>
        </Modal>
      )}
    </div>
  );
}

/* ─── VÉHICULES ─────────────────────────────────────────────────── */
function Vehicules({ data, refresh, toast }) {
  const { vehicules } = data;
  const [modal, setModal] = useState(false);
  const [sel, setSel]     = useState(null);
  const blank = { marque:"",modele:"",immatriculation:"",annee:2024,kilometrage:0,statut:"Disponible",type:"Voiture",carburant:"Essence",couleur:"",assurance:"",visite:"",notes:"" };
  const [form, setForm] = useState(blank);
  const typeIcons = { Voiture:"🚗", Moto:"🏍️", Camion:"🚛", Bus:"🚌" };

  const openForm = (v=null) => { setSel(v); setForm(v?{...v}:blank); setModal(true); };
  const save = () => {
    if (!form.marque||!form.modele||!form.immatriculation) { toast("Marque, modèle et immatriculation requis","error"); return; }
    sel ? update("vehicules",sel.id,{...form,annee:+form.annee,kilometrage:+form.kilometrage}) : insert("vehicules",{...form,annee:+form.annee,kilometrage:+form.kilometrage});
    refresh(); setModal(false); toast(sel?"Véhicule modifié":"Véhicule ajouté");
  };
  const del = (id) => { if(!window.confirm("Supprimer ce véhicule ?")) return; remove("vehicules",id); refresh(); toast("Véhicule supprimé","info"); };

  return (
    <div>
      <div className="page-head">
        <div>
          <div className="page-title">Parc automobile</div>
          <div className="page-sub">{vehicules.length} véhicules · {vehicules.filter(v=>v.statut==="Disponible").length} disponibles</div>
        </div>
        <button className="btn btn-primary" onClick={() => openForm()}>+ Ajouter un véhicule</button>
      </div>
      <div className="grid-auto">
        {vehicules.map(v => (
          <div className="v-card" key={v.id}>
            <div className="v-thumb">{typeIcons[v.type]||"🚗"}</div>
            <div className="v-body">
              <div className="row-between mb-12">
                <div>
                  <div className="fw-600 text-primary" style={{fontSize:14, letterSpacing:"-0.01em"}}>{v.marque} {v.modele}</div>
                  <div className="text-sm mt-4">{v.immatriculation} · {v.couleur}</div>
                </div>
                <Tag v={v.statut}/>
              </div>
              <div className="info-g" style={{marginBottom:14, fontSize:12.5}}>
                <span className="ik">Année</span><span className="info-val text-mono">{v.annee}</span>
                <span className="ik">Kilométrage</span><span className="info-val text-mono">{v.kilometrage.toLocaleString()} km</span>
                <span className="ik">Carburant</span><span className="iv">{v.carburant}</span>
                <span className="ik">Assurance</span><span className="iv">{formatDate(v.assurance)}</span>
                <span className="ik">Visite tech.</span><span className="iv">{formatDate(v.visite)}</span>
              </div>
              {v.notes && <div className="t-sm" style={{background:"var(--bg-muted)", borderRadius:"var(--r2)", padding:"8px 10px", marginBottom:12, fontStyle:"italic"}}>{v.notes}</div>}
              <div className="row gap-8">
                <button className="btn btn-ghost btn-sm" style={{flex:1}} onClick={() => openForm(v)}>Modifier</button>
                <button className="btn btn-danger btn-sm" onClick={() => del(v.id)}>✕</button>
              </div>
            </div>
          </div>
        ))}
        {vehicules.length===0 && <div className="empty"><div className="empty-ico">◻</div><div className="empty-txt">Aucun véhicule</div></div>}
      </div>
      {modal && (
        <Modal title={sel?"Modifier le véhicule":"Ajouter un véhicule"} onClose={() => setModal(false)} wide
          footer={<><button className="btn btn-ghost" onClick={() => setModal(false)}>Annuler</button><button className="btn btn-primary" onClick={save}>Enregistrer</button></>}>
          <div className="fgrid">
            <div className="field"><label className="field-lbl">Marque *</label><input className="field-inp" value={form.marque} onChange={e=>setForm({...form,marque:e.target.value})} placeholder="Ex: Toyota"/></div>
            <div className="field"><label className="field-lbl">Modèle *</label><input className="field-inp" value={form.modele} onChange={e=>setForm({...form,modele:e.target.value})} placeholder="Ex: Corolla"/></div>
          </div>
          <div className="fgrid">
            <div className="field"><label className="field-lbl">Immatriculation *</label><input className="field-inp" value={form.immatriculation} onChange={e=>setForm({...form,immatriculation:e.target.value})} placeholder="Ex: LT 234 A"/></div>
            <div className="field"><label className="field-lbl">Type</label>
              <select className="field-inp" value={form.type} onChange={e=>setForm({...form,type:e.target.value})}><option>Voiture</option><option>Moto</option><option>Camion</option><option>Bus</option></select>
            </div>
          </div>
          <div className="fgrid">
            <div className="field"><label className="field-lbl">Année</label><input className="field-inp" type="number" value={form.annee} onChange={e=>setForm({...form,annee:+e.target.value})}/></div>
            <div className="field"><label className="field-lbl">Kilométrage</label><input className="field-inp" type="number" value={form.kilometrage} onChange={e=>setForm({...form,kilometrage:+e.target.value})}/></div>
          </div>
          <div className="fgrid">
            <div className="field"><label className="field-lbl">Couleur</label><input className="field-inp" value={form.couleur} onChange={e=>setForm({...form,couleur:e.target.value})}/></div>
            <div className="field"><label className="field-lbl">Statut</label>
              <select className="field-inp" value={form.statut} onChange={e=>setForm({...form,statut:e.target.value})}><option>Disponible</option><option>En service</option><option>Maintenance</option><option>Hors service</option></select>
            </div>
          </div>
          <div className="fgrid">
            <div className="field"><label className="field-lbl">Assurance expire le</label><input className="field-inp" type="date" value={form.assurance} onChange={e=>setForm({...form,assurance:e.target.value})}/></div>
            <div className="field"><label className="field-lbl">Visite technique</label><input className="field-inp" type="date" value={form.visite} onChange={e=>setForm({...form,visite:e.target.value})}/></div>
          </div>
          <div className="field"><label className="field-lbl">Notes</label><textarea className="field-inp" value={form.notes} onChange={e=>setForm({...form,notes:e.target.value})} placeholder="Observations…"/></div>
        </Modal>
      )}
    </div>
  );
}

/* ─── DÉPENSES ──────────────────────────────────────────────────── */
function Depenses({ data, refresh, toast }) {
  const { depenses } = data;
  const [modal, setModal] = useState(false);
  const blank = { categorie:"Carburant", montant:"", date:todayStr(), description:"", validePar:"Admin" };
  const [form, setForm] = useState(blank);
  const total = depenses.reduce((s,d)=>s+d.montant,0);
  const cats  = ["Carburant","Entretien","Salaires","Fournitures","Loyer","Taxes","Communication","Autre"];
  const catColors = { Carburant:"orange",Entretien:"amber",Salaires:"purple",Fournitures:"blue",Loyer:"green",Taxes:"red",Communication:"blue",Autre:"blue" };

  const save = () => {
    if (!form.montant||+form.montant<=0) { toast("Montant invalide","error"); return; }
    insert("depenses",{...form,montant:+form.montant});
    refresh(); setModal(false); toast("Dépense enregistrée");
  };

  return (
    <div>
      <div className="page-head">
        <div>
          <div className="page-title">Dépenses</div>
          <div className="page-sub">{depenses.length} dépenses · Total : <strong style={{color:"var(--red)"}}>{formatFCFA(total)}</strong></div>
        </div>
        <button className="btn btn-primary" onClick={() => { setForm(blank); setModal(true); }}>+ Enregistrer une dépense</button>
      </div>
      <div className="grid-auto mb-16">
        {cats.filter(c=>depenses.some(d=>d.categorie===c)).map(c => {
          const catTotal = depenses.filter(d=>d.categorie===c).reduce((s,d)=>s+d.montant,0);
          return (
            <div className="kpi" key={c}>
              <div className="kpi-label">{c}</div>
              <div className="kpi-value" style={{fontSize:18, color:`var(--${catColors[c]||"blue"})`}}>{formatFCFA(catTotal)}</div>
            </div>
          );
        })}
      </div>
      <div className="card">
        <div className="t-wrap">
          <table className="t">
            <thead><tr><th>Catégorie</th><th>Montant</th><th>Description</th><th>Date</th><th>Validé par</th><th></th></tr></thead>
            <tbody>
              {[...depenses].reverse().map(d => (
                <tr key={d.id}>
                  <td><span className={`badge badge-${catColors[d.categorie]||"blue"}`}>{d.categorie}</span></td>
                  <td><span className="text-mono fw-600 text-red">{formatFCFA(d.montant)}</span></td>
                  <td>{d.description}</td>
                  <td className="t-sm">{formatDate(d.date)}</td>
                  <td className="t-sm">{d.validePar}</td>
                  <td><button className="btn btn-danger btn-sm" onClick={() => { if(window.confirm("Supprimer ?")) { remove("depenses",d.id); refresh(); toast("Supprimé","info"); } }}>✕</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {depenses.length===0 && <div className="empty"><div className="empty-ico">◻</div><div className="empty-txt">Aucune dépense enregistrée</div></div>}
      </div>
      {modal && (
        <Modal title="Enregistrer une dépense" onClose={() => setModal(false)}
          footer={<><button className="btn btn-ghost" onClick={() => setModal(false)}>Annuler</button><button className="btn btn-primary" onClick={save}>Enregistrer</button></>}>
          <div className="fgrid">
            <div className="field"><label className="field-lbl">Catégorie</label>
              <select className="field-inp" value={form.categorie} onChange={e=>setForm({...form,categorie:e.target.value})}>
                {cats.map(c=><option key={c}>{c}</option>)}
              </select>
            </div>
            <div className="field"><label className="field-lbl">Montant (FCFA) *</label><input className="field-inp" type="number" min="1" value={form.montant} onChange={e=>setForm({...form,montant:e.target.value})}/></div>
          </div>
          <div className="fgrid">
            <div className="field"><label className="field-lbl">Date</label><input className="field-inp" type="date" value={form.date} onChange={e=>setForm({...form,date:e.target.value})}/></div>
            <div className="field"><label className="field-lbl">Validé par</label><input className="field-inp" value={form.validePar} onChange={e=>setForm({...form,validePar:e.target.value})}/></div>
          </div>
          <div className="field"><label className="field-lbl">Description</label><input className="field-inp" value={form.description} onChange={e=>setForm({...form,description:e.target.value})} placeholder="Description de la dépense"/></div>
        </Modal>
      )}
    </div>
  );
}

/* ─── NOTIFICATIONS ─────────────────────────────────────────────── */
function Notifications({ data, refresh, toast }) {
  const { notifications, eleves } = data;
  const [form, setForm] = useState({ to:"all", canal:"sms", sujet:"", message:"" });
  const templates = [
    { l:"Rappel leçon",        m:"Votre leçon de conduite est prévue le [DATE] à [HEURE]. N'oubliez pas votre pièce d'identité." },
    { l:"Convocation examen",  m:"Vous êtes convoqué(e) à l'examen [TYPE] le [DATE] au centre CENAC Douala." },
    { l:"Rappel paiement",     m:"Votre solde impayé est de [MONTANT] FCFA. Merci de régulariser votre situation." },
    { l:"Félicitations",       m:"Félicitations ! Vous avez obtenu votre permis de conduire. Bonne route !" },
    { l:"Séance annulée",      m:"Votre séance prévue le [DATE] est annulée. Nous vous recontacterons." },
  ];

  const send = () => {
    if (!form.sujet||!form.message) { toast("Sujet et message requis","error"); return; }
    const target = form.to==="all" ? "Tous les élèves" : (() => { const e=eleves.find(x=>x.id===+form.to); return e?`${e.prenom} ${e.nom}`:"Inconnu"; })();
    insert("notifications",{ to:target, eleveId:form.to==="all"?null:+form.to, canal:form.canal==="sms"?"SMS":"Email", sujet:form.sujet, message:form.message, date:todayStr(), statut:"Envoyé" });
    refresh(); toast(`Message envoyé à ${target}`);
    setForm({...form, sujet:"", message:""});
  };

  const bulkSend = () => {
    const targets = eleves.filter(e=>e.solde>0);
    targets.forEach(e => {
      insert("notifications",{ to:`${e.prenom} ${e.nom}`, eleveId:e.id, canal:"SMS", sujet:"Rappel paiement", message:`Votre solde impayé est de ${formatFCFA(e.solde)}. Merci de régulariser votre situation.`, date:todayStr(), statut:"Envoyé" });
    });
    refresh(); toast(`${targets.length} message(s) envoyé(s)`);
  };

  return (
    <div>
      <div className="page-head">
        <div>
          <div className="page-title">Notifications</div>
          <div className="page-sub">Envoi de SMS et emails aux élèves</div>
        </div>
        <button className="btn btn-ghost btn-sm" onClick={bulkSend}>
          Relance impayés ({eleves.filter(e=>e.solde>0).length})
        </button>
      </div>
      <div className="grid-2">
        <div className="card">
          <div className="card-head"><div className="card-title">Composer un message</div></div>
          <div className="card-body">
            <div className="field"><label className="field-lbl">Destinataire</label>
              <select className="field-inp" value={form.to} onChange={e=>setForm({...form,to:e.target.value})}>
                <option value="all">Tous les élèves ({eleves.length})</option>
                {eleves.map(e=><option key={e.id} value={e.id}>{e.prenom} {e.nom}{e.solde>0?` — Solde: ${formatFCFA(e.solde)}`:""}</option>)}
              </select>
            </div>
            <div className="field">
              <label className="field-lbl">Canal</label>
              <div className="row gap-8">
                {[{v:"sms",l:"SMS"},{v:"email",l:"Email"}].map(c => (
                  <button key={c.v} className={`btn btn-sm ${form.canal===c.v?"btn-primary":"btn-ghost"}`} style={{flex:1}} onClick={() => setForm({...form,canal:c.v})}>{c.l}</button>
                ))}
              </div>
            </div>
            <div className="field">
              <label className="field-lbl">Modèles</label>
              <div style={{display:"flex", flexDirection:"column", gap:5}}>
                {templates.map((t,i) => (
                  <button key={i} className="btn btn-ghost btn-sm" style={{justifyContent:"flex-start", textAlign:"left"}} onClick={() => setForm({...form,sujet:t.l,message:t.m})}>{t.l}</button>
                ))}
              </div>
            </div>
            <div className="field"><label className="field-lbl">Sujet *</label><input className="field-inp" value={form.sujet} onChange={e=>setForm({...form,sujet:e.target.value})} placeholder="Objet du message"/></div>
            <div className="field"><label className="field-lbl">Message *</label><textarea className="field-inp" rows={3} value={form.message} onChange={e=>setForm({...form,message:e.target.value})} placeholder="Rédigez votre message…"/></div>
            <button className="btn btn-primary btn-full" onClick={send} disabled={!form.message||!form.sujet}>Envoyer</button>
          </div>
        </div>
        <div className="card">
          <div className="card-head"><div className="card-title">Historique des envois</div><span className="text-mono text-muted" style={{fontSize:12}}>{notifications.length}</span></div>
          <div style={{padding:"0 18px", maxHeight:520, overflowY:"auto"}}>
            {[...notifications].reverse().map(n => (
              <div key={n.id} style={{display:"flex", gap:11, padding:"12px 0", borderBottom:"1px solid var(--border-muted)"}}>
                <div style={{width:30, height:30, borderRadius:"var(--r2)", background:n.canal==="SMS"?"var(--blue-dim)":"var(--accent-dim)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:13, flexShrink:0}}>{n.canal==="SMS"?"◈":"✉"}</div>
                <div style={{flex:1, minWidth:0}}>
                  <div className="fw-600 text-primary" style={{fontSize:13}}>{n.sujet}</div>
                  <div className="text-sm mt-4">À : {n.to}</div>
                  <div style={{fontSize:11.5, color:"var(--t3)", marginTop:3, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap", fontStyle:"italic"}}>"{n.message}"</div>
                  <div className="row gap-8" style={{marginTop:6}}>
                    <span className="t-mut" style={{fontSize:11}}>{formatDate(n.date)}</span>
                    <Tag v="Envoyé"/>
                  </div>
                </div>
                <button className="btn btn-danger btn-sm" style={{alignSelf:"center"}} onClick={() => { remove("notifications",n.id); refresh(); }}>✕</button>
              </div>
            ))}
            {notifications.length===0 && <div className="empty"><div className="empty-ico">◻</div><div className="empty-txt">Aucun message envoyé</div></div>}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── BASE DE DONNÉES ────────────────────────────────────────────── */
function BaseDeDonnees({ toast }) {
  const [table, setTable] = useState("eleves");
  const [view,  setView]  = useState("table");
  const db     = getDB();
  const tables = ["eleves","moniteurs","lecons","paiements","examens","vehicules","notifications","depenses"];
  const rows   = db[table] || [];
  const cols   = rows.length ? Object.keys(rows[0]) : [];

  return (
    <div>
      <div className="page-head">
        <div>
          <div className="page-title">Base de données</div>
          <div className="page-sub">Visualisez, exportez et gérez toutes les données du système</div>
        </div>
        <div className="page-actions">
          <button className="btn btn-ghost btn-sm" onClick={() => { downloadFile(exportSQL(),`autoges_${todayStr()}.sql`); toast("Export SQL téléchargé","info"); }} translate="no">↓ SQL</button>
          <button className="btn btn-ghost btn-sm" onClick={() => { downloadFile(exportJSON(),"backup.json","application/json"); toast("Backup JSON","info"); }} translate="no">↓ JSON</button>
          <button className="btn btn-ghost btn-sm" onClick={() => { downloadFile(exportCSV(table),`${table}.csv`,"text/csv"); toast(`${table}.csv exporté`,"info"); }}>Export CSV</button>
          <button className="btn btn-danger btn-sm" onClick={() => { if(window.confirm("Réinitialiser la base de données ?")) { resetDB(); window.location.reload(); } }}>Réinitialiser</button>
        </div>
      </div>

      <div style={{display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(130px,1fr))", gap:10, marginBottom:24}}>
        {tables.map(t => (
          <div key={t} className="kpi" style={{cursor:"pointer", borderColor:table===t?"var(--border-focus)":"var(--border)", padding:14}} onClick={() => setTable(t)}>
            <div className="kpi-label" style={{marginBottom:6}}>{t}</div>
            <div className="kpi-value" style={{fontSize:22}}>{(db[t]||[]).length}</div>
          </div>
        ))}
      </div>

      <div className="card">
        <div className="card-head">
          <div className="row gap-10">
            <div className="card-title">Table :</div>
            <code style={{fontFamily:"var(--mono,'Geist Mono')", fontSize:13, color:"var(--accent)"}}>{table}</code>
            <span className="tag tag-orange mono">{rows.length} lignes</span>
          </div>
          <div className="row gap-6">
            {["table","sql","json"].map(v => (
              <button key={v} className={`btn btn-sm ${view===v?"btn-primary":"btn-ghost"}`} onClick={() => setView(v)}>{v.toUpperCase()}</button>
            ))}
          </div>
        </div>
        <div style={{padding:18}}>
          {view==="table" && (
            <div className="t-wrap">
              <table className="t">
                <thead><tr>{cols.map(c => <th key={c}>{c}</th>)}</tr></thead>
                <tbody>
                  {rows.map((r,i) => (
                    <tr key={i}>
                      {cols.map(c => (
                        <td key={c} style={{maxWidth:180, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap"}}>
                          {r[c]===null||r[c]==="" ? <span style={{color:"var(--t3)"}}>null</span> : String(r[c])}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
              {rows.length===0 && <div className="empty"><div className="empty-ico">◻</div><div className="empty-txt">Table vide</div></div>}
            </div>
          )}
          {view==="sql" && <pre className="code">{exportSQL()}</pre>}
          {view==="json" && <pre className="code">{JSON.stringify(rows,null,2)}</pre>}
        </div>
      </div>
    </div>
  );
}

/* ─── PARAMÈTRES ────────────────────────────────────────────────── */
function Parametres({ toast }) {
  const [meta, setMeta] = useState(getMeta());
  const save = () => { updateMeta(meta); toast("Paramètres enregistrés"); };

  return (
    <div>
      <div className="page-head">
        <div><div className="page-title">Paramètres</div><div className="page-sub">Configuration générale de l'application</div></div>
      </div>
      <div className="s-block">
        <div className="s-block-head">Informations de la structure</div>
        <div className="s-block-body">
          <div className="fgrid">
            <div className="field"><label className="field-lbl">Nom de la structure</label><input className="field-inp" value={meta.nom_structure||""} onChange={e=>setMeta({...meta,nom_structure:e.target.value})}/></div>
            <div className="field"><label className="field-lbl">Slogan</label><input className="field-inp" value={meta.slogan||""} onChange={e=>setMeta({...meta,slogan:e.target.value})}/></div>
          </div>
          <div className="fgrid">
            <div className="field"><label className="field-lbl">Adresse</label><input className="field-inp" value={meta.adresse||""} onChange={e=>setMeta({...meta,adresse:e.target.value})}/></div>
            <div className="field"><label className="field-lbl">Téléphone</label><input className="field-inp" value={meta.telephone||""} onChange={e=>setMeta({...meta,telephone:e.target.value})}/></div>
          </div>
          <div className="field"><label className="field-lbl">Email</label><input className="field-inp" type="email" value={meta.email||""} onChange={e=>setMeta({...meta,email:e.target.value})}/></div>
          <button className="btn btn-primary" onClick={save}>Enregistrer</button>
        </div>
      </div>
      <div className="s-block">
        <div className="s-block-head">Gestion des données</div>
        <div className="s-block-body">
          <p className="t-sm" style={{marginBottom:14, lineHeight:1.6}}>Exportez vos données dans différents formats. Le format SQL est compatible MySQL/phpMyAdmin pour une migration en production.</p>
          <div className="row gap-8" style={{flexWrap:"wrap"}}>
            <button className="btn btn-ghost btn-sm" onClick={() => { downloadFile(exportSQL(),`autoges_${todayStr()}.sql`); toast("Export SQL téléchargé","info"); }}>Exporter en SQL</button>
            <button className="btn btn-ghost btn-sm" onClick={() => { downloadFile(exportJSON(),"backup.json","application/json"); toast("Backup JSON téléchargé","info"); }} translate="no">↓ JSON</button>
            <button className="btn btn-ghost btn-sm" onClick={() => { downloadFile(exportCSV("eleves"),"eleves.csv","text/csv"); toast("Élèves CSV","info"); }} translate="no">↓ Élèves</button>
            <button className="btn btn-ghost btn-sm" onClick={() => { downloadFile(exportCSV("paiements"),"paiements.csv","text/csv"); toast("Paiements CSV","info"); }} translate="no">↓ Paiements</button>
          </div>
        </div>
      </div>
      <div className="s-block" style={{borderColor:"rgba(224,92,92,.2)"}}>
        <div className="s-block-head" style={{color:"var(--red)"}}>Zone de danger</div>
        <div className="s-block-body">
          <p className="t-sm" style={{marginBottom:14, lineHeight:1.6}}>La réinitialisation supprimera toutes les données et restaurera les données de démonstration initiales.</p>
          <button className="btn btn-danger btn-sm" onClick={() => { if(window.confirm("Réinitialiser toute la base de données ? Cette action est irréversible.")) { resetDB(); window.location.reload(); } }}>Réinitialiser la base de données</button>
        </div>
      </div>
    </div>
  );
}

/* ─── APP ROOT ──────────────────────────────────────────────────── */
export default function App() {
  const [page, setPage]       = useState("home");
  const [sideOpen, setSideOpen] = useState(false);
  const [data, setData]       = useState(null);
  const { toasts, add: toast }  = useToast();

  useEffect(() => {
    const db = initDB();
    setData({
      eleves:        db.eleves        || [],
      moniteurs:     db.moniteurs     || [],
      lecons:        db.lecons        || [],
      paiements:     db.paiements     || [],
      examens:       db.examens       || [],
      vehicules:     db.vehicules     || [],
      notifications: db.notifications || [],
      depenses:      db.depenses      || [],
    });
  }, []);

  const refresh = useCallback(() => {
    const db = getDB();
    setData({
      eleves:        db.eleves        || [],
      moniteurs:     db.moniteurs     || [],
      lecons:        db.lecons        || [],
      paiements:     db.paiements     || [],
      examens:       db.examens       || [],
      vehicules:     db.vehicules     || [],
      notifications: db.notifications || [],
      depenses:      db.depenses      || [],
    });
  }, []);

  if (!data) return (
    <div style={{display:"flex", alignItems:"center", justifyContent:"center", height:"100vh", background:"#0F1117", flexDirection:"column", gap:16}}>
      <div style={{width:36, height:36, background:"#F18242", borderRadius:8, display:"flex", alignItems:"center", justifyContent:"center", fontSize:18}}>🚗</div>
      <div style={{fontFamily:"'Geist',sans-serif", fontSize:15, color:"#F1F5FB", fontWeight:600, letterSpacing:"-0.02em"}}>AutoGES Pro</div>
      <div style={{fontFamily:"'Geist Mono',monospace", fontSize:12, color:"#4E6280"}}>Chargement…</div>
    </div>
  );

  const meta = getMeta();
  const nav = [
    { id:"home", l:"Vue d'ensemble", section:"main" },
    { id:"el",   l:"Élèves",  section:"main", badge:data.eleves.filter(e=>e.statut==="Actif").length },
    { id:"mn",   l:"Moniteurs", section:"ops" },
    { id:"pl",   l:"Planning",  section:"ops", badge:data.lecons.filter(l=>l.statut==="En attente").length||undefined },
    { id:"xm",   l:"Examens",   section:"ops" },
    { id:"pa",   l:"Paiements", section:"ops", badge:data.paiements.filter(p=>p.statut==="En attente").length||undefined },
    { id:"vh",   l:"Véhicules", section:"ops" },
    { id:"dp",   l:"Dépenses",  section:"ops" },
    { id:"no",   l:"Notifications", section:"tools" },
    { id:"bdd",  l:"Base de données", section:"tools" },
    { id:"set",  l:"Paramètres",    section:"tools" },
  ];
  const sections = [
    { key:"main",  label:"Principal" },
    { key:"ops",   label:"Gestion" },
    { key:"tools", label:"Outils" },
  ];

  const go = (id) => { setPage(id); setSideOpen(false); };
  const cur = nav.find(n=>n.id===page);

  const pages = {
    home: <Dashboard  data={data} setPage={setPage} toast={toast}/>,
    el:   <Eleves     data={data} refresh={refresh} toast={toast}/>,
    mn:   <Moniteurs  data={data} refresh={refresh} toast={toast}/>,
    pl:   <Planning   data={data} refresh={refresh} toast={toast}/>,
    xm:   <Examens    data={data} refresh={refresh} toast={toast}/>,
    pa:   <Paiements  data={data} refresh={refresh} toast={toast}/>,
    vh:   <Vehicules  data={data} refresh={refresh} toast={toast}/>,
    dp:   <Depenses   data={data} refresh={refresh} toast={toast}/>,
    no:   <Notifications data={data} refresh={refresh} toast={toast}/>,
    bdd:  <BaseDeDonnees toast={toast}/>,
    set:  <Parametres toast={toast}/>,
  };

  return (
    <>
      <CSS/>
      <div className="app">
        {/* Overlay mobile */}
        {sideOpen && <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.6)",zIndex:99,backdropFilter:"blur(3px)"}} onClick={() => setSideOpen(false)}/>}

        {/* SIDEBAR */}
        <nav className={`sidebar${sideOpen ? " open" : ""}`}>
          <div className="s-brand">
            <div className="s-logo">🚗</div>
            <div>
              <div className="s-appname">{(meta.nom_structure||"AutoGES Pro").split(" ").slice(0,2).join(" ")}</div>
              <div className="s-version">v1.0</div>
            </div>
          </div>
          <div className="s-nav">
            {sections.map(sec => (
              <div className="s-section" key={sec.key}>
                <span className="s-label">{sec.label}</span>
                {nav.filter(n=>n.section===sec.key).map(n => (
                  <div key={n.id} className={`nav-item${page===n.id?" active":""}`} onClick={() => go(n.id)}>
                    {n.l}
                    {n.badge ? <span className="nav-badge">{n.badge}</span> : null}
                  </div>
                ))}
              </div>
            ))}
          </div>
          <div className="s-footer">
            <div className="user-row" onClick={() => go("set")}>
              <div className="u-av">AD</div>
              <div className="user-info">
                <div className="u-name">Administrateur</div>
                <div className="u-role">Super Admin</div>
              </div>
            </div>
          </div>
        </nav>

        {/* MAIN */}
        <div className="main">
          <div className="topbar">
            <div className="ham" onClick={() => setSideOpen(!sideOpen)}>☰</div>
            <div className="top-title">{cur?.l}</div>
            <div className="top-search">
              <span style={{color:"var(--t3)", fontSize:13, flexShrink:0}}>⌕</span>
              <input placeholder="Rechercher…" onChange={e => {
                if (e.target.value.length < 2) return;
                const q = e.target.value.toLowerCase();
                if (data.eleves.some(el=>`${el.nom}${el.prenom}${el.email}`.toLowerCase().includes(q))) go("el");
              }}/>
              <span className="search-kbd">⌘K</span>
            </div>
            <div className="top-actions">
              <div className="top-btn" onClick={() => go("no")}>◈<div className="dot"/></div>
              <div className="top-btn" onClick={() => go("bdd")} title="Base de données">⊟</div>
              <div className="u-av" style={{cursor:"pointer"}} onClick={() => go("set")}>AD</div>
            </div>
          </div>
          <div className="page">{pages[page]}</div>
        </div>
      </div>
      <Toasts items={toasts}/>
    </>
  );
}
