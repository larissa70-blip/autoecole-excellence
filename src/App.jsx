import { useState, useEffect, useCallback } from "react";
import {
  initDB, getDB, saveDB, resetDB,
  getAll, insert, update, remove,
  getDashboardStats, enregistrerPaiement, genererReference,
  getMeta, updateMeta,
  exportSQL, exportJSON, exportCSV, downloadFile,
} from "./db.js";

/* ══════════════════════════════════════════════════════════════════
   STYLES GLOBAUX
══════════════════════════════════════════════════════════════════ */
const CSS = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,400&family=Space+Grotesk:wght@400;500;600;700&display=swap');

    *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}

    :root{
      --p:#E8470A;--pl:#FF6B35;--ps:rgba(232,71,10,.10);--pg:rgba(232,71,10,.22);
      --ac:#F59E0B;--info:#0EA5E9;--ok:#10B981;--er:#EF4444;--pu:#8B5CF6;
      --bg:#0C1015;--bg2:#111820;--bg3:#18212F;
      --card:#172030;--card2:#1F2D40;
      --bd:rgba(255,255,255,.09);--bds:rgba(255,255,255,.04);--bda:rgba(232,71,10,.3);
      --t:#F0F6FF;--t2:#8FA8C8;--t3:#45607A;
      --side:260px;
      --topbar:64px;
      --radius:16px;
      --gap:20px;
    }

    html{font-size:16px;scroll-behavior:smooth}
    body{
      font-family:'Plus Jakarta Sans',sans-serif;
      background:var(--bg);color:var(--t);
      overflow-x:hidden;
      -webkit-font-smoothing:antialiased;
      text-rendering:optimizeLegibility;
    }

    ::-webkit-scrollbar{width:5px;height:5px}
    ::-webkit-scrollbar-track{background:transparent}
    ::-webkit-scrollbar-thumb{background:rgba(255,255,255,.1);border-radius:10px}
    ::-webkit-scrollbar-thumb:hover{background:var(--p)}

    /* ── LAYOUT PRINCIPAL ─────────────────────────────────── */
    .app{display:flex;min-height:100vh;width:100%}
    .overlay{display:none;position:fixed;inset:0;background:rgba(0,0,0,.65);z-index:99;backdrop-filter:blur(3px)}
    .overlay.show{display:block}

    /* ── SIDEBAR ─────────────────────────────────────────── */
    .sidebar{
      width:var(--side);
      min-height:100vh;
      background:var(--bg2);
      border-right:1px solid var(--bd);
      display:flex;flex-direction:column;
      position:fixed;top:0;left:0;
      z-index:100;
      transition:transform .28s cubic-bezier(.4,0,.2,1);
      overflow-y:auto;
    }

    .s-logo{
      padding:22px 20px 18px;
      border-bottom:1px solid var(--bd);
      display:flex;align-items:center;gap:13px;
      flex-shrink:0;
    }
    .s-icon{
      width:42px;height:42px;
      background:linear-gradient(135deg,var(--p),var(--pl));
      border-radius:12px;
      display:flex;align-items:center;justify-content:center;
      font-size:20px;flex-shrink:0;
      box-shadow:0 4px 16px var(--pg);
    }
    .s-name{
      font-family:'Space Grotesk',sans-serif;
      font-size:15px;font-weight:700;
      color:var(--t);line-height:1.2;
    }
    .s-tag{
      font-size:10px;font-weight:600;
      color:var(--p);
      text-transform:uppercase;letter-spacing:1.2px;
      margin-top:2px;
    }

    .s-nav{flex:1;padding:16px 12px;overflow-y:auto}
    .s-sec{margin-bottom:24px}
    .s-lbl{
      font-size:10px;font-weight:700;
      color:var(--t3);
      text-transform:uppercase;letter-spacing:1.5px;
      padding:0 10px 9px;
      display:block;
    }
    .ni{
      display:flex;align-items:center;gap:11px;
      padding:10px 12px;
      border-radius:11px;
      cursor:pointer;
      transition:all .2s;
      color:var(--t2);
      font-size:14px;font-weight:500;
      margin-bottom:3px;
      user-select:none;
      line-height:1.3;
    }
    .ni:hover{background:var(--bg3);color:var(--t)}
    .ni.on{
      background:linear-gradient(130deg,var(--p),var(--pl));
      color:#fff;
      box-shadow:0 4px 16px var(--pg);
    }
    .ni .ico{font-size:17px;width:22px;text-align:center;flex-shrink:0}
    .nbg{
      margin-left:auto;
      background:var(--p);color:#fff;
      font-size:10px;font-weight:700;
      padding:2px 8px;border-radius:20px;
      min-width:20px;text-align:center;
      flex-shrink:0;
    }
    .ni.on .nbg{background:rgba(255,255,255,.28)}

    .s-foot{padding:14px 12px;border-top:1px solid var(--bd);flex-shrink:0}
    .u-card{
      display:flex;align-items:center;gap:11px;
      padding:10px 12px;
      background:var(--bg3);border-radius:12px;
      cursor:pointer;transition:background .2s;
    }
    .u-card:hover{background:var(--card2)}
    .u-av{
      width:36px;height:36px;border-radius:10px;
      background:linear-gradient(130deg,var(--p),var(--ac));
      display:flex;align-items:center;justify-content:center;
      font-weight:700;font-size:13px;color:#fff;flex-shrink:0;
    }
    .u-name{font-size:13.5px;font-weight:600;color:var(--t);line-height:1.25}
    .u-role{font-size:11.5px;color:var(--t2);margin-top:1px}

    /* ── MAIN ─────────────────────────────────────────────── */
    .main{
      flex:1;
      margin-left:var(--side);
      display:flex;flex-direction:column;
      min-height:100vh;
      min-width:0;
    }

    /* ── TOPBAR ───────────────────────────────────────────── */
    .topbar{
      height:var(--topbar);
      background:var(--bg2);
      border-bottom:1px solid var(--bd);
      display:flex;align-items:center;
      padding:0 28px;gap:14px;
      position:sticky;top:0;z-index:50;
      flex-shrink:0;
    }
    .ham{
      display:none;
      width:38px;height:38px;border-radius:10px;
      border:1px solid var(--bd);background:var(--bg3);
      align-items:center;justify-content:center;
      cursor:pointer;font-size:17px;color:var(--t2);
      flex-shrink:0;transition:all .2s;
    }
    .ham:hover{border-color:var(--p);color:var(--p)}
    .t-ttl{
      font-family:'Space Grotesk',sans-serif;
      font-size:18px;font-weight:700;
      flex:1;
      white-space:nowrap;overflow:hidden;text-overflow:ellipsis;
    }
    .t-srch{
      display:flex;align-items:center;gap:9px;
      background:var(--bg3);border:1px solid var(--bd);
      border-radius:11px;padding:9px 14px;
      width:280px;flex-shrink:0;
      transition:border-color .2s;
    }
    .t-srch:focus-within{border-color:var(--p)}
    .t-srch input{
      background:none;border:none;outline:none;
      color:var(--t);font-size:13.5px;
      font-family:'Plus Jakarta Sans',sans-serif;width:100%;
    }
    .t-srch input::placeholder{color:var(--t3)}
    .t-acts{display:flex;align-items:center;gap:9px}
    .ibtn{
      width:38px;height:38px;border-radius:10px;
      border:1px solid var(--bd);background:var(--bg3);
      display:flex;align-items:center;justify-content:center;
      cursor:pointer;color:var(--t2);font-size:15px;
      transition:all .2s;position:relative;flex-shrink:0;
    }
    .ibtn:hover{border-color:var(--p);color:var(--p)}
    .ndot{
      position:absolute;top:7px;right:7px;
      width:7px;height:7px;
      background:var(--p);border-radius:50%;
      border:2px solid var(--bg2);
    }

    /* ── PAGE ─────────────────────────────────────────────── */
    .pg{
      padding:28px 32px;
      flex:1;
      max-width:100%;
      overflow-x:hidden;
    }
    .ph{
      display:flex;align-items:flex-start;
      justify-content:space-between;
      margin-bottom:26px;
      flex-wrap:wrap;gap:14px;
    }
    .ptl{
      font-family:'Space Grotesk',sans-serif;
      font-size:clamp(20px,2.5vw,26px);
      font-weight:700;line-height:1.2;
    }
    .pst{font-size:14px;color:var(--t2);margin-top:5px;line-height:1.5}
    .p-acts{display:flex;gap:9px;flex-wrap:wrap;align-items:center}

    /* ── BUTTONS ──────────────────────────────────────────── */
    .btn{
      display:inline-flex;align-items:center;gap:7px;
      padding:9px 18px;border-radius:10px;
      font-size:13.5px;font-weight:600;
      cursor:pointer;border:none;
      transition:all .2s;
      font-family:'Plus Jakarta Sans',sans-serif;
      white-space:nowrap;flex-shrink:0;
      line-height:1.3;
    }
    .btn-p{background:linear-gradient(130deg,var(--p),var(--pl));color:#fff;box-shadow:0 3px 14px var(--pg)}
    .btn-p:hover{transform:translateY(-1px);box-shadow:0 5px 20px var(--pg)}
    .btn-p:disabled{opacity:.5;cursor:not-allowed;transform:none}
    .btn-g{background:var(--card2);color:var(--t2);border:1px solid var(--bd)}
    .btn-g:hover{color:var(--t);border-color:var(--bda);background:var(--bg3)}
    .btn-d{background:rgba(239,68,68,.12);color:var(--er);border:1px solid rgba(239,68,68,.2)}
    .btn-d:hover{background:rgba(239,68,68,.22)}
    .btn-ok{background:rgba(16,185,129,.12);color:var(--ok);border:1px solid rgba(16,185,129,.2)}
    .btn-ok:hover{background:rgba(16,185,129,.22)}
    .btn-info{background:rgba(14,165,233,.12);color:var(--info);border:1px solid rgba(14,165,233,.2)}
    .sm{padding:6px 13px;font-size:12.5px;border-radius:8px}
    .full{width:100%;justify-content:center}

    /* ── CARDS ────────────────────────────────────────────── */
    .card{
      background:var(--card);
      border:1px solid var(--bd);
      border-radius:var(--radius);
      overflow:hidden;
    }
    .ch{
      padding:18px 22px;
      border-bottom:1px solid var(--bd);
      display:flex;align-items:center;justify-content:space-between;
    }
    .ctl{font-family:'Space Grotesk',sans-serif;font-size:15px;font-weight:700}
    .cb{padding:22px}

    /* ── STAT GRID ────────────────────────────────────────── */
    .sg{
      display:grid;
      grid-template-columns:repeat(4,1fr);
      gap:var(--gap);
      margin-bottom:var(--gap);
    }
    .sc{
      background:var(--card);border:1px solid var(--bd);
      border-radius:var(--radius);
      padding:24px;
      position:relative;overflow:hidden;
      transition:all .28s;cursor:default;
    }
    .sc::before{content:'';position:absolute;top:0;left:0;right:0;height:4px}
    .sc.or::before{background:linear-gradient(90deg,var(--p),var(--ac))}
    .sc.bl::before{background:linear-gradient(90deg,var(--info),#38BDF8)}
    .sc.gr::before{background:linear-gradient(90deg,var(--ok),#34D399)}
    .sc.pu::before{background:linear-gradient(90deg,var(--pu),#A78BFA)}
    .sc:hover{transform:translateY(-3px);border-color:var(--bda);box-shadow:0 8px 32px rgba(0,0,0,.2)}
    .si{
      width:46px;height:46px;border-radius:13px;
      display:flex;align-items:center;justify-content:center;
      font-size:20px;margin-bottom:18px;
    }
    .si.or{background:rgba(232,71,10,.14)}.si.bl{background:rgba(14,165,233,.14)}
    .si.gr{background:rgba(16,185,129,.14)}.si.pu{background:rgba(139,92,246,.14)}
    .sv{
      font-family:'Space Grotesk',sans-serif;
      font-size:clamp(22px,2.5vw,30px);
      font-weight:700;line-height:1;
      margin-bottom:6px;letter-spacing:-.5px;
    }
    .sl{font-size:12px;color:var(--t2);font-weight:500;text-transform:uppercase;letter-spacing:.8px}
    .str2{font-size:12px;font-weight:600;margin-top:12px;display:flex;align-items:center;gap:5px}
    .str2.up{color:var(--ok)}.str2.dn{color:var(--er)}

    /* ── GRIDS ────────────────────────────────────────────── */
    .g2{display:grid;grid-template-columns:1fr 1fr;gap:var(--gap)}
    .g3{display:grid;grid-template-columns:repeat(3,1fr);gap:var(--gap)}
    .ga{display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:var(--gap)}

    /* ── TABLE ────────────────────────────────────────────── */
    .tw{overflow-x:auto;-webkit-overflow-scrolling:touch}
    .tbl{width:100%;border-collapse:collapse;font-size:13.5px}
    .tbl th{
      padding:12px 18px;text-align:left;
      font-size:11px;font-weight:700;
      color:var(--t3);text-transform:uppercase;letter-spacing:1px;
      border-bottom:1px solid var(--bd);
      white-space:nowrap;background:var(--card);
    }
    .tbl td{
      padding:13px 18px;color:var(--t2);
      border-bottom:1px solid var(--bds);
      vertical-align:middle;
      white-space:nowrap;
    }
    .tbl tr:last-child td{border-bottom:none}
    .tbl tr:hover td{background:var(--bg3);color:var(--t)}
    .cn{display:flex;align-items:center;gap:11px}

    /* ── AVATARS ──────────────────────────────────────────── */
    .av{width:36px;height:36px;border-radius:10px;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:13px;flex-shrink:0}
    .avl{width:48px;height:48px;border-radius:14px;font-size:16px}
    .aor{background:rgba(232,71,10,.18);color:var(--p)}.abl{background:rgba(14,165,233,.16);color:var(--info)}
    .agr{background:rgba(16,185,129,.16);color:var(--ok)}.apu{background:rgba(139,92,246,.16);color:var(--pu)}
    .ayl{background:rgba(245,158,11,.16);color:var(--ac)}

    /* ── BADGES ───────────────────────────────────────────── */
    .bdg{
      display:inline-flex;align-items:center;gap:6px;
      padding:4px 11px;border-radius:20px;
      font-size:11.5px;font-weight:700;
      letter-spacing:.3px;white-space:nowrap;
    }
    .bdg::before{content:'';width:6px;height:6px;border-radius:50%;background:currentColor;flex-shrink:0}
    .bok{background:rgba(16,185,129,.13);color:var(--ok)}.bwn{background:rgba(245,158,11,.13);color:var(--ac)}
    .ber{background:rgba(239,68,68,.13);color:var(--er)}.bin{background:rgba(14,165,233,.13);color:var(--info)}
    .bor{background:rgba(232,71,10,.13);color:var(--p)}.bpu{background:rgba(139,92,246,.13);color:var(--pu)}

    /* ── PROGRESS ─────────────────────────────────────────── */
    .pb{height:6px;background:var(--bg3);border-radius:4px;overflow:hidden}
    .pf{height:100%;border-radius:4px;transition:width .6s ease}
    .por{background:linear-gradient(90deg,var(--p),var(--ac))}.pbl{background:linear-gradient(90deg,var(--info),#38BDF8)}
    .pgr{background:linear-gradient(90deg,var(--ok),#34D399)}.ppu{background:linear-gradient(90deg,var(--pu),#A78BFA)}

    /* ── FORMS ────────────────────────────────────────────── */
    .fg{margin-bottom:16px}
    .fl{
      display:block;font-size:12px;font-weight:600;
      color:var(--t2);margin-bottom:7px;
      text-transform:uppercase;letter-spacing:.6px;
    }
    .fi{
      width:100%;padding:10px 14px;
      background:var(--bg3);border:1px solid var(--bd);
      border-radius:10px;color:var(--t);
      font-size:14px;font-family:'Plus Jakarta Sans',sans-serif;
      outline:none;transition:all .2s;
      -webkit-appearance:none;appearance:none;
      line-height:1.4;
    }
    .fi:focus{border-color:var(--p);box-shadow:0 0 0 3px var(--ps)}
    .fi::placeholder{color:var(--t3)}
    textarea.fi{resize:vertical;min-height:88px}
    .fgd{display:grid;grid-template-columns:1fr 1fr;gap:14px}

    /* ── MODAL ────────────────────────────────────────────── */
    .ov{
      position:fixed;inset:0;
      background:rgba(0,0,0,.72);backdrop-filter:blur(6px);
      display:flex;align-items:center;justify-content:center;
      z-index:999;padding:20px;
    }
    .mdl{
      background:var(--card);border:1px solid var(--bd);
      border-radius:20px;width:100%;max-width:580px;
      max-height:92vh;overflow-y:auto;
      box-shadow:0 24px 70px rgba(0,0,0,.55);
      animation:fup .25s ease;
    }
    .mh{
      padding:20px 24px;border-bottom:1px solid var(--bd);
      display:flex;align-items:center;justify-content:space-between;
      position:sticky;top:0;background:var(--card);z-index:2;
    }
    .mt{font-family:'Space Grotesk',sans-serif;font-size:17px;font-weight:700}
    .mx{
      width:30px;height:30px;border-radius:8px;
      background:var(--bg3);border:none;
      color:var(--t2);cursor:pointer;font-size:18px;
      display:flex;align-items:center;justify-content:center;
      transition:color .18s;
    }
    .mx:hover{color:var(--er)}
    .mb{padding:24px}.mf{padding:16px 24px;border-top:1px solid var(--bd);display:flex;gap:9px;justify-content:flex-end}

    /* ── FILTER BAR ───────────────────────────────────────── */
    .fb{display:flex;gap:10px;margin-bottom:18px;flex-wrap:wrap;align-items:center}
    .sw{
      display:flex;align-items:center;gap:9px;
      background:var(--card);border:1px solid var(--bd);
      border-radius:10px;padding:9px 14px;
      flex:1;min-width:220px;transition:border-color .2s;
    }
    .sw:focus-within{border-color:var(--p)}
    .sw input{
      background:none;border:none;outline:none;
      color:var(--t);font-size:13.5px;
      font-family:'Plus Jakarta Sans',sans-serif;width:100%;
    }
    .sw input::placeholder{color:var(--t3)}

    /* ── DETAIL PANEL ─────────────────────────────────────── */
    .detail-panel{
      position:fixed;top:0;right:-460px;width:460px;
      height:100vh;background:var(--card);
      border-left:1px solid var(--bd);
      z-index:200;overflow-y:auto;
      transition:right .32s ease;
      box-shadow:-12px 0 48px rgba(0,0,0,.45);
    }
    .detail-panel.open{right:0}
    .dp-head{
      padding:20px 24px;border-bottom:1px solid var(--bd);
      display:flex;align-items:center;justify-content:space-between;
      position:sticky;top:0;background:var(--card);z-index:2;
    }
    .dp-body{padding:24px}

    /* ── MONITOR CARD ─────────────────────────────────────── */
    .mc{
      background:var(--card);border:1px solid var(--bd);
      border-radius:var(--radius);padding:22px;
      transition:all .28s;cursor:pointer;
    }
    .mc:hover{border-color:var(--bda);transform:translateY(-3px);box-shadow:0 8px 32px var(--ps)}
    .mch{display:flex;align-items:flex-start;gap:14px;margin-bottom:16px}
    .mname{font-family:'Space Grotesk',sans-serif;font-size:16px;font-weight:700}
    .mrole{font-size:12.5px;color:var(--p);font-weight:600;margin-top:3px}
    .mstars{color:var(--ac);font-size:13px;letter-spacing:.8px;margin-top:4px}
    .mstats{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-top:16px;text-align:center}
    .msv{font-family:'Space Grotesk',sans-serif;font-size:20px;font-weight:700}
    .msl{font-size:10.5px;color:var(--t3);text-transform:uppercase;letter-spacing:.5px;margin-top:3px}

    /* ── VEHICLE CARD ─────────────────────────────────────── */
    .vc{
      background:var(--card);border:1px solid var(--bd);
      border-radius:var(--radius);padding:20px;transition:all .28s;
    }
    .vc:hover{border-color:var(--bda);box-shadow:0 4px 20px rgba(0,0,0,.2)}
    .vimg{
      width:100%;height:120px;background:var(--bg3);
      border-radius:12px;display:flex;align-items:center;
      justify-content:center;font-size:52px;margin-bottom:16px;
    }

    /* ── PAYMENT METHOD ───────────────────────────────────── */
    .pm{
      display:flex;align-items:center;gap:12px;
      padding:12px 15px;background:var(--bg3);
      border:1.5px solid var(--bd);border-radius:11px;
      cursor:pointer;transition:all .2s;margin-bottom:8px;
    }
    .pm:hover,.pm.sel{border-color:var(--p);background:var(--ps)}

    /* ── TOAST ────────────────────────────────────────────── */
    .toast{position:fixed;bottom:28px;right:28px;z-index:9999;display:flex;flex-direction:column;gap:9px;pointer-events:none}
    .toast-item{
      padding:13px 20px;border-radius:13px;
      font-size:14px;font-weight:600;
      min-width:280px;max-width:400px;
      animation:slideIn .3s ease;
      pointer-events:all;
      box-shadow:0 8px 28px rgba(0,0,0,.5);
      display:flex;align-items:center;gap:11px;
      line-height:1.4;
    }
    .toast-ok{background:rgba(16,185,129,.16);border:1px solid rgba(16,185,129,.35);color:var(--ok)}
    .toast-er{background:rgba(239,68,68,.16);border:1px solid rgba(239,68,68,.35);color:var(--er)}
    .toast-in{background:rgba(14,165,233,.16);border:1px solid rgba(14,165,233,.35);color:var(--info)}

    /* ── TIMELINE ─────────────────────────────────────────── */
    .tl{display:flex;flex-direction:column}
    .tli{display:flex;gap:14px;padding-bottom:18px;position:relative}
    .tli:last-child{padding-bottom:0}
    .tli:not(:last-child)::after{content:'';position:absolute;left:14px;top:30px;bottom:0;width:1px;background:var(--bd)}
    .tld{width:30px;height:30px;border-radius:9px;flex-shrink:0;display:flex;align-items:center;justify-content:center;font-size:14px;z-index:1}
    .tlt{font-size:13.5px;font-weight:600;color:var(--t);line-height:1.3}
    .tls{font-size:12px;color:var(--t3);margin-top:3px}

    /* ── TOP ITEMS ────────────────────────────────────────── */
    .tpi{display:flex;align-items:center;gap:12px;padding:12px 0;border-bottom:1px solid var(--bds)}
    .tpi:last-child{border-bottom:none}
    .rnk{width:24px;height:24px;border-radius:7px;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:800;flex-shrink:0}
    .r1{background:rgba(245,158,11,.18);color:var(--ac)}.r2{background:rgba(14,165,233,.14);color:var(--info)}
    .r3{background:rgba(139,92,246,.14);color:var(--pu)}.r0{background:var(--bg3);color:var(--t3)}

    /* ── INFO ROW ─────────────────────────────────────────── */
    .irow{display:grid;grid-template-columns:auto 1fr;gap:8px 16px;font-size:13px;align-items:start}
    .ik{color:var(--t3);white-space:nowrap}.iv{color:var(--t2);text-align:right;word-break:break-word}

    /* ── DIVIDER ──────────────────────────────────────────── */
    .dv{height:1px;background:var(--bd);margin:15px 0}

    /* ── UTILS ────────────────────────────────────────────── */
    .row{display:flex;align-items:center}
    .btw{justify-content:space-between}
    .ml{margin-left:auto}
    .gap6{gap:6px}.gap8{gap:8px}.gap10{gap:10px}.gap12{gap:12px}
    .mt4{margin-top:4px}.mt8{margin-top:8px}.mt12{margin-top:12px}.mt16{margin-top:16px}
    .mb8{margin-bottom:8px}.mb12{margin-bottom:12px}.mb16{margin-bottom:16px}
    .tm{color:var(--t2);font-size:13.5px}
    .txs{font-size:12px;color:var(--t3)}
    .fw6{font-weight:600}.fw7{font-weight:700}
    .fn{font-family:'Space Grotesk',sans-serif}
    .empty{text-align:center;padding:56px 20px;color:var(--t3)}
    .eico{font-size:44px;margin-bottom:14px;opacity:.35}
    .etxt{font-size:15px;font-weight:600;color:var(--t2);margin-top:10px}

    /* ── DB VIEWER ────────────────────────────────────────── */
    .db-code{
      background:var(--bg3);border:1px solid var(--bd);border-radius:12px;
      padding:16px;font-family:'Courier New',monospace;
      font-size:12.5px;line-height:1.7;color:var(--t2);
      overflow-x:auto;white-space:pre;max-height:420px;overflow-y:auto;
    }

    /* ── SETTINGS ─────────────────────────────────────────── */
    .settings-section{background:var(--card);border:1px solid var(--bd);border-radius:var(--radius);overflow:hidden;margin-bottom:18px}
    .settings-head{
      padding:16px 22px;border-bottom:1px solid var(--bd);
      font-family:'Space Grotesk',sans-serif;font-size:15px;font-weight:700;
      display:flex;align-items:center;gap:9px;
    }
    .settings-body{padding:22px}

    /* ── ALERT BANNER ─────────────────────────────────────── */
    .alert-banner{
      display:flex;align-items:center;gap:12px;
      background:rgba(239,68,68,.08);
      border:1px solid rgba(239,68,68,.2);
      border-radius:12px;
      padding:13px 18px;
      margin-bottom:20px;
    }

    /* ── ANIMATIONS ───────────────────────────────────────── */
    @keyframes fup{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
    @keyframes fin{from{opacity:0}to{opacity:1}}
    @keyframes slideIn{from{opacity:0;transform:translateX(24px)}to{opacity:1;transform:translateX(0)}}
    .fa{animation:fup .32s ease}

    /* ══ RESPONSIVE ════════════════════════════════════════ */

    /* Large desktop → 5 colonnes stats si très large */
    @media(min-width:1600px){
      .sg{grid-template-columns:repeat(4,1fr);gap:24px}
      .pg{padding:32px 40px}
      .ga{grid-template-columns:repeat(auto-fill,minmax(320px,1fr))}
    }

    /* Desktop standard 1024–1280px */
    @media(max-width:1280px){
      :root{--side:240px}
      .pg{padding:24px 28px}
      .t-srch{width:240px}
    }

    /* Tablette large 1024px */
    @media(max-width:1100px){
      .sg{grid-template-columns:repeat(2,1fr)}
      .g2{grid-template-columns:1fr}
      .t-srch{display:none}
      .pg{padding:22px 24px}
    }

    /* Tablette portrait 768px */
    @media(max-width:768px){
      :root{--side:260px}
      .sidebar{transform:translateX(-100%)}
      .sidebar.open{transform:translateX(0)}
      .main{margin-left:0}
      .ham{display:flex}
      .sg{grid-template-columns:repeat(2,1fr);gap:14px}
      .g3{grid-template-columns:1fr 1fr}
      .pg{padding:18px 16px}
      .topbar{padding:0 16px;height:58px}
      .fgd{grid-template-columns:1fr}
      .ga{grid-template-columns:1fr 1fr}
      .detail-panel{width:100%;right:-100%}
      .detail-panel.open{right:0}
      .tbl{font-size:13px}
      .tbl th,.tbl td{padding:10px 12px}
    }

    /* Mobile 480px */
    @media(max-width:520px){
      .sg{grid-template-columns:1fr 1fr;gap:12px}
      .sc{padding:16px}
      .sv{font-size:22px}
      .sl{font-size:10.5px}
      .btn{padding:8px 14px;font-size:12.5px}
      .ph{flex-direction:column;align-items:flex-start;gap:10px}
      .g3{grid-template-columns:1fr}
      .ga{grid-template-columns:1fr}
      .fb{gap:7px}
      .topbar{height:54px}
      .pg{padding:14px 12px}
      .p-acts{flex-wrap:wrap;gap:7px}
    }

    /* Mobile très petit 360px */
    @media(max-width:380px){
      .sg{grid-template-columns:1fr}
      .tbl th,.tbl td{padding:8px 10px;font-size:12px}
    }
  `}</style>
);

/* ══════════════════════════════════════════════════════════════════
   HELPERS
══════════════════════════════════════════════════════════════════ */
const AVC = ["or","bl","gr","pu","yl"];
const avc  = (id) => AVC[(id - 1) % AVC.length];
const ini  = (n, p) => `${(p||"")[0]||""}${(n||"")[0]||""}`.toUpperCase();
const strs = (n) => "★".repeat(Math.floor(n)) + "☆".repeat(5 - Math.floor(n));
const fF   = (n) => (n ?? 0).toLocaleString("fr-FR") + " FCFA";
const fD   = (d) => d ? new Date(d + "T00:00:00").toLocaleDateString("fr-FR") : "—";
const today = () => new Date().toISOString().slice(0, 10);

function Bdg({ v }) {
  const m = {
    Actif:"ok", Diplômé:"in", Suspendu:"er", Congé:"wn", Inactif:"er",
    Confirmée:"ok", "En attente":"wn", Annulée:"er", Terminée:"in",
    Payé:"ok", Réussi:"ok", Échoué:"er",
    Disponible:"ok", "En service":"in", Maintenance:"wn", "Hors service":"er",
  };
  return <span className={`bdg b${m[v]||"in"}`}>{v}</span>;
}

function Modal({ title, onClose, footer, children, wide }) {
  return (
    <div className="ov" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="mdl" style={wide ? { maxWidth: 680 } : {}}>
        <div className="mh">
          <div className="mt">{title}</div>
          <button className="mx" onClick={onClose}>×</button>
        </div>
        <div className="mb">{children}</div>
        {footer && <div className="mf">{footer}</div>}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
   TOAST SYSTEM
══════════════════════════════════════════════════════════════════ */
function useToast() {
  const [toasts, setToasts] = useState([]);
  const add = useCallback((msg, type = "ok") => {
    const id = Date.now();
    setToasts(t => [...t, { id, msg, type }]);
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 3000);
  }, []);
  return { toasts, add };
}

function Toasts({ toasts }) {
  const icons = { ok: "✅", er: "❌", in: "ℹ️" };
  return (
    <div className="toast">
      {toasts.map(t => (
        <div key={t.id} className={`toast-item toast-${t.type}`}>
          {icons[t.type]} {t.msg}
        </div>
      ))}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
   DASHBOARD
══════════════════════════════════════════════════════════════════ */
function Dashboard({ data, setPage, toast }) {
  const { eleves, moniteurs, lecons, paiements, examens } = data;
  const actifs = eleves.filter(e => e.statut === "Actif").length;
  const ca     = paiements.filter(p => p.statut === "Payé").reduce((s, p) => s + p.montant, 0);
  const tr     = examens.length ? Math.round(examens.filter(x => x.statut === "Réussi").length / examens.length * 100) : 0;
  const todayL = lecons.filter(l => l.date === today());
  const top4   = [...eleves].sort((a, b) => b.heuresEffectuees - a.heuresEffectuees).slice(0, 4);
  const impay  = paiements.filter(p => p.statut === "En attente");

  const acts = [
    { ico: "👤", t: "Nouvel élève inscrit", d: `${eleves[eleves.length - 1]?.prenom} ${eleves[eleves.length - 1]?.nom}`, bg: "rgba(232,71,10,.1)", time: "récemment" },
    { ico: "📅", t: "Leçon confirmée", d: `${lecons.filter(l => l.statut === "Confirmée").length} leçons confirmées`, bg: "rgba(14,165,233,.1)", time: "ce jour" },
    { ico: "💳", t: "Paiements reçus", d: `${paiements.filter(p => p.statut === "Payé").length} paiements — ${fF(ca)}`, bg: "rgba(16,185,129,.1)", time: "total" },
    { ico: "🎓", t: "Taux de réussite", d: `${tr}% sur ${examens.length} examens passés`, bg: "rgba(245,158,11,.1)", time: "global" },
  ];

  return (
    <div className="fa">
      <div className="ph">
        <div>
          <div className="ptl">Tableau de bord 📊</div>
          <div className="pst">Bienvenue ! Vue d'ensemble de votre auto-école.</div>
        </div>
        <div className="p-acts">
          <button className="btn btn-g sm" onClick={() => { downloadFile(exportSQL(), "autoges_export.sql"); toast("Export SQL téléchargé", "ok"); }}>📥 Export SQL</button>
          <button className="btn btn-g sm" onClick={() => { downloadFile(exportJSON(), "autoges_backup.json", "application/json"); toast("Backup JSON téléchargé", "ok"); }}>💾 Backup</button>
          <button className="btn btn-p" onClick={() => setPage("el")}>+ Nouvel élève</button>
        </div>
      </div>

      {/* Alertes */}
      {impay.length > 0 && (
        <div className="alert-banner">
          <span style={{ fontSize: 20 }}>⚠️</span>
          <span style={{ fontSize: 13.5, color: "var(--er)", fontWeight: 600, flex: 1 }}>
            {impay.length} paiement(s) en attente — {fF(impay.reduce((s, p) => s + p.montant, 0))} à recouvrer
          </span>
          <button className="btn btn-d sm" onClick={() => setPage("pa")}>Voir →</button>
        </div>
      )}

      {/* KPIs */}
      <div className="sg">
        {[
          { c: "or", ico: "👥", v: actifs, l: "Élèves actifs", tr: "+8%", up: true },
          { c: "gr", ico: "🎓", v: `${tr}%`, l: "Taux de réussite", tr: "+3%", up: true },
          { c: "bl", ico: "📅", v: lecons.length, l: "Leçons planifiées", tr: `${todayL.length} auj.`, up: true },
          { c: "pu", ico: "💰", v: fF(ca), l: "Chiffre d'affaires", tr: "+15%", up: true },
        ].map((s, i) => (
          <div className={`sc ${s.c}`} key={i}>
            <div className={`si ${s.c}`}>{s.ico}</div>
            <div className="sv fn">{s.v}</div>
            <div className="sl">{s.l}</div>
            <div className={`str2 ${s.up ? "up" : "dn"}`}>▲ {s.tr} ce mois</div>
          </div>
        ))}
      </div>

      <div className="g2 mb12">
        {/* Activité */}
        <div className="card">
          <div className="ch"><div className="ctl">⚡ Activité récente</div><span className="bdg bor">Live</span></div>
          <div className="cb" style={{ paddingTop: 10, paddingBottom: 10 }}>
            <div className="tl">
              {acts.map((a, i) => (
                <div className="tli" key={i}>
                  <div className="tld" style={{ background: a.bg }}>{a.ico}</div>
                  <div><div className="tlt">{a.t}</div><div className="tls">{a.d} · {a.time}</div></div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Top élèves */}
        <div className="card">
          <div className="ch"><div className="ctl">🏆 Meilleure progression</div><span className="txs">Ce mois</span></div>
          <div className="cb" style={{ paddingTop: 8, paddingBottom: 8 }}>
            {top4.map((e, i) => (
              <div className="tpi" key={e.id}>
                <div className={`rnk ${["r1","r2","r3","r0"][i]}`}>{i + 1}</div>
                <div className={`av a${avc(e.id)}`}>{ini(e.nom, e.prenom)}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>{e.prenom} {e.nom}</div>
                  <div className="mt4">
                    <div className="pb"><div className="pf por" style={{ width: `${Math.round(e.heuresEffectuees / e.heuresTotal * 100)}%` }} /></div>
                    <span className="txs">{e.heuresEffectuees}h / {e.heuresTotal}h</span>
                  </div>
                </div>
                <span className="fn fw7" style={{ color: "var(--p)", fontSize: 13 }}>{Math.round(e.heuresEffectuees / e.heuresTotal * 100)}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Leçons du jour + Répartition */}
      <div className="g2">
        <div className="card">
          <div className="ch"><div className="ctl">🚗 Leçons du jour</div><span className="bdg bin">{todayL.length} séances</span></div>
          {todayL.length === 0 ? (
            <div className="empty"><div className="eico">📅</div><div className="etxt">Aucune leçon aujourd'hui</div></div>
          ) : (
            <div className="tw">
              <table className="tbl">
                <thead><tr><th>Élève</th><th>Heure</th><th>Type</th><th>Statut</th></tr></thead>
                <tbody>
                  {todayL.slice(0, 5).map(l => {
                    const e = eleves.find(x => x.id === l.eleveId);
                    return (
                      <tr key={l.id}>
                        <td><div className="cn"><div className={`av a${avc(l.eleveId)}`}>{ini(e?.nom, e?.prenom)}</div><span className="fw7" style={{ color: "var(--t)", fontSize: 13 }}>{e?.prenom} {e?.nom}</span></div></td>
                        <td className="fn fw7" style={{ color: "var(--p)" }}>{l.heure}</td>
                        <td>{l.type}</td>
                        <td><Bdg v={l.statut} /></td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="card">
          <div className="ch"><div className="ctl">📊 Répartition</div></div>
          <div className="cb">
            {[
              { l: "Permis B (Voiture)", c: eleves.filter(e => e.permis === "B").length, t: eleves.length, p: "por" },
              { l: "Permis A (Moto)", c: eleves.filter(e => e.permis === "A").length, t: eleves.length, p: "pbl" },
              { l: "Diplômés", c: eleves.filter(e => e.statut === "Diplômé").length, t: eleves.length, p: "pgr" },
              { l: "Moniteurs actifs", c: moniteurs.filter(m => m.statut === "Actif").length, t: moniteurs.length, p: "ppu" },
            ].map((r, i) => (
              <div key={i} style={{ marginBottom: 14 }}>
                <div className="row btw mb4">
                  <span className="tm">{r.l}</span>
                  <span className="fn fw7" style={{ fontSize: 13 }}>{r.c} / {r.t}</span>
                </div>
                <div className="pb"><div className={`pf ${r.p}`} style={{ width: `${Math.round(r.c / Math.max(r.t, 1) * 100)}%` }} /></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
   ÉLÈVES
══════════════════════════════════════════════════════════════════ */
function Eleves({ data, refresh, toast }) {
  const { eleves, moniteurs } = data;
  const [srch, setSrch]   = useState("");
  const [filt, setFilt]   = useState("Tous");
  const [modal, setModal] = useState(false);
  const [detail, setDetail] = useState(null);
  const [sel, setSel]     = useState(null);
  const empty = { nom: "", prenom: "", email: "", telephone: "", dateNaissance: "", lieuNaissance: "", cni: "", moniteurId: 1, statut: "Actif", heuresEffectuees: 0, heuresTotal: 30, solde: 0, permis: "B", notes: "" };
  const [form, setForm]   = useState(empty);

  const filtered = eleves.filter(e => {
    const m = `${e.nom} ${e.prenom} ${e.email} ${e.telephone} ${e.cni}`.toLowerCase().includes(srch.toLowerCase());
    const s = filt === "Tous" || e.statut === filt;
    return m && s;
  });

  const open = (e = null) => { setSel(e); setForm(e ? { ...e } : empty); setModal(true); };

  const save = () => {
    if (!form.nom || !form.prenom) { toast("Nom et prénom requis", "er"); return; }
    if (sel) { update("eleves", sel.id, form); toast("Élève modifié avec succès", "ok"); }
    else { insert("eleves", { ...form, dateInscription: today() }); toast("Élève inscrit avec succès", "ok"); }
    refresh(); setModal(false);
  };

  const del = (id) => {
    if (!window.confirm("Supprimer cet élève ?")) return;
    remove("eleves", id); refresh(); toast("Élève supprimé", "in");
  };

  const exportEleves = () => {
    downloadFile(exportCSV("eleves"), "eleves.csv", "text/csv");
    toast("Export CSV téléchargé", "ok");
  };

  const getMoniteur = (id) => moniteurs.find(m => m.id === id);

  return (
    <div className="fa">
      <div className="ph">
        <div>
          <div className="ptl">Gestion des Élèves</div>
          <div className="pst">{eleves.length} élèves · {eleves.filter(e => e.statut === "Actif").length} actifs</div>
        </div>
        <div className="p-acts">
          <button className="btn btn-g sm" onClick={exportEleves}>📤 Export CSV</button>
          <button className="btn btn-p" onClick={() => open()}>+ Nouvel élève</button>
        </div>
      </div>

      <div className="fb">
        <div className="sw"><span style={{ color: "var(--t3)" }}>🔍</span><input placeholder="Rechercher par nom, email, CNI..." value={srch} onChange={e => setSrch(e.target.value)} /></div>
        {["Tous", "Actif", "Diplômé", "Suspendu"].map(s => (
          <button key={s} className={`btn sm ${filt === s ? "btn-p" : "btn-g"}`} onClick={() => setFilt(s)}>{s} {s !== "Tous" && `(${eleves.filter(e => e.statut === s).length})`}</button>
        ))}
      </div>

      <div className="card">
        <div className="tw">
          <table className="tbl">
            <thead><tr><th>Élève</th><th>Contact</th><th>Permis</th><th>Progression</th><th>Solde</th><th>Moniteur</th><th>Statut</th><th>Actions</th></tr></thead>
            <tbody>
              {filtered.map(e => {
                const mon = getMoniteur(e.moniteurId);
                return (
                  <tr key={e.id}>
                    <td>
                      <div className="cn" style={{ cursor: "pointer" }} onClick={() => setDetail(e)}>
                        <div className={`av a${avc(e.id)}`}>{ini(e.nom, e.prenom)}</div>
                        <div>
                          <div className="fw7" style={{ color: "var(--t)", fontSize: 13.5 }}>{e.prenom} {e.nom}</div>
                          <div className="txs">{e.email}</div>
                        </div>
                      </div>
                    </td>
                    <td>{e.telephone}</td>
                    <td><span className={`bdg ${e.permis === "B" ? "bor" : "bin"}`}>Permis {e.permis}</span></td>
                    <td style={{ minWidth: 130 }}>
                      <div className="row gap8">
                        <div className="pb" style={{ flex: 1 }}><div className="pf por" style={{ width: `${Math.round(e.heuresEffectuees / e.heuresTotal * 100)}%` }} /></div>
                        <span className="txs fn">{e.heuresEffectuees}/{e.heuresTotal}h</span>
                      </div>
                    </td>
                    <td className="fn fw7" style={{ color: e.solde > 0 ? "var(--er)" : "var(--ok)", fontSize: 13 }}>{fF(e.solde)}</td>
                    <td>
                      {mon ? (
                        <div className="cn">
                          <div className={`av a${avc(mon.id)}`} style={{ width: 26, height: 26, fontSize: 10 }}>{ini(mon.nom, mon.prenom)}</div>
                          <span className="txs">{mon.prenom} {mon.nom}</span>
                        </div>
                      ) : "—"}
                    </td>
                    <td><Bdg v={e.statut} /></td>
                    <td>
                      <div className="row gap6">
                        <button className="btn btn-g sm" onClick={() => setDetail(e)}>👁</button>
                        <button className="btn btn-g sm" onClick={() => open(e)}>✏️</button>
                        <button className="btn btn-d sm" onClick={() => del(e.id)}>🗑️</button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && <div className="empty"><div className="eico">👥</div><div className="etxt">Aucun élève trouvé</div></div>}
      </div>

      {/* Panneau détail */}
      {detail && (
        <div className={`detail-panel ${detail ? "open" : ""}`}>
          <div className="dp-head">
            <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, fontSize: 16 }}>Fiche élève</div>
            <button className="mx" onClick={() => setDetail(null)}>×</button>
          </div>
          <div className="dp-body">
            <div className="row gap12 mb12">
              <div className={`av avl a${avc(detail.id)}`} style={{ width: 56, height: 56, borderRadius: 14, fontSize: 18 }}>{ini(detail.nom, detail.prenom)}</div>
              <div>
                <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 17, fontWeight: 700 }}>{detail.prenom} {detail.nom}</div>
                <div className="txs mt4">{detail.email}</div>
                <div className="mt8"><Bdg v={detail.statut} /> <span className={`bdg ${detail.permis === "B" ? "bor" : "bin"}`} style={{ marginLeft: 4 }}>Permis {detail.permis}</span></div>
              </div>
            </div>
            <div className="dv" />
            <div style={{ marginBottom: 14 }}>
              <div className="row btw mb4"><span className="tm">Progression</span><span className="fn fw7" style={{ fontSize: 14, color: "var(--p)" }}>{Math.round(detail.heuresEffectuees / detail.heuresTotal * 100)}%</span></div>
              <div className="pb" style={{ height: 8 }}><div className="pf por" style={{ width: `${Math.round(detail.heuresEffectuees / detail.heuresTotal * 100)}%` }} /></div>
              <div className="row btw mt4"><span className="txs">{detail.heuresEffectuees}h effectuées</span><span className="txs">{detail.heuresTotal - detail.heuresEffectuees}h restantes</span></div>
            </div>
            <div className="dv" />
            <div className="irow">
              <span className="ik">📱 Téléphone</span><span className="iv">{detail.telephone}</span>
              <span className="ik">🎂 Naissance</span><span className="iv">{fD(detail.dateNaissance)}</span>
              <span className="ik">📍 Lieu</span><span className="iv">{detail.lieuNaissance}</span>
              <span className="ik">🪪 CNI</span><span className="iv">{detail.cni}</span>
              <span className="ik">📅 Inscription</span><span className="iv">{fD(detail.dateInscription)}</span>
              <span className="ik">💰 Solde</span><span className="iv" style={{ color: detail.solde > 0 ? "var(--er)" : "var(--ok)", fontWeight: 700 }}>{fF(detail.solde)}</span>
            </div>
            {detail.notes && (
              <>
                <div className="dv" />
                <div className="txs fw6" style={{ marginBottom: 6 }}>Notes</div>
                <div style={{ fontSize: 13, color: "var(--t2)", background: "var(--bg3)", borderRadius: 8, padding: "10px 12px" }}>{detail.notes}</div>
              </>
            )}
            <div className="dv" />
            <div className="row gap8">
              <button className="btn btn-p sm" style={{ flex: 1 }} onClick={() => { open(detail); setDetail(null); }}>✏️ Modifier</button>
              <button className="btn btn-d sm" onClick={() => { del(detail.id); setDetail(null); }}>🗑️ Supprimer</button>
            </div>
          </div>
        </div>
      )}

      {modal && (
        <Modal title={sel ? "Modifier l'élève" : "Nouvel élève"} onClose={() => setModal(false)} wide
          footer={<><button className="btn btn-g" onClick={() => setModal(false)}>Annuler</button><button className="btn btn-p" onClick={save}>💾 Enregistrer</button></>}>
          <div className="fgd">
            <div className="fg"><label className="fl">Prénom *</label><input className="fi" value={form.prenom} onChange={e => setForm({ ...form, prenom: e.target.value })} placeholder="Prénom" /></div>
            <div className="fg"><label className="fl">Nom *</label><input className="fi" value={form.nom} onChange={e => setForm({ ...form, nom: e.target.value })} placeholder="Nom" /></div>
          </div>
          <div className="fgd">
            <div className="fg"><label className="fl">Email</label><input className="fi" type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="email@exemple.com" /></div>
            <div className="fg"><label className="fl">Téléphone</label><input className="fi" value={form.telephone} onChange={e => setForm({ ...form, telephone: e.target.value })} placeholder="6XX XXX XXX" /></div>
          </div>
          <div className="fgd">
            <div className="fg"><label className="fl">Date de naissance</label><input className="fi" type="date" value={form.dateNaissance} onChange={e => setForm({ ...form, dateNaissance: e.target.value })} /></div>
            <div className="fg"><label className="fl">Lieu de naissance</label><input className="fi" value={form.lieuNaissance} onChange={e => setForm({ ...form, lieuNaissance: e.target.value })} placeholder="Ville" /></div>
          </div>
          <div className="fgd">
            <div className="fg"><label className="fl">N° CNI / Passeport</label><input className="fi" value={form.cni} onChange={e => setForm({ ...form, cni: e.target.value })} placeholder="Numéro pièce d'identité" /></div>
            <div className="fg"><label className="fl">Type de permis</label>
              <select className="fi" value={form.permis} onChange={e => setForm({ ...form, permis: e.target.value })}><option>B</option><option>A</option><option>C</option></select>
            </div>
          </div>
          <div className="fgd">
            <div className="fg"><label className="fl">Moniteur assigné</label>
              <select className="fi" value={form.moniteurId} onChange={e => setForm({ ...form, moniteurId: +e.target.value })}>
                {data.moniteurs.map(m => <option key={m.id} value={m.id}>{m.prenom} {m.nom}</option>)}
              </select>
            </div>
            <div className="fg"><label className="fl">Statut</label>
              <select className="fi" value={form.statut} onChange={e => setForm({ ...form, statut: e.target.value })}><option>Actif</option><option>Diplômé</option><option>Suspendu</option></select>
            </div>
          </div>
          <div className="fgd">
            <div className="fg"><label className="fl">Heures effectuées</label><input className="fi" type="number" min="0" value={form.heuresEffectuees} onChange={e => setForm({ ...form, heuresEffectuees: +e.target.value })} /></div>
            <div className="fg"><label className="fl">Solde impayé (FCFA)</label><input className="fi" type="number" min="0" value={form.solde} onChange={e => setForm({ ...form, solde: +e.target.value })} /></div>
          </div>
          <div className="fg"><label className="fl">Notes internes</label><textarea className="fi" value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} placeholder="Observations..." /></div>
        </Modal>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
   MONITEURS
══════════════════════════════════════════════════════════════════ */
function Moniteurs({ data, refresh, toast }) {
  const { moniteurs, eleves } = data;
  const [modal, setModal] = useState(false);
  const [sel, setSel]     = useState(null);
  const empty = { nom: "", prenom: "", email: "", telephone: "", specialite: "Permis B", statut: "Actif", noteMoyenne: 4.5, dateEmbauche: today(), salaire: 150000, experience: "1 an", cin: "", adresse: "", notes: "" };
  const [form, setForm]   = useState(empty);

  const open = (m = null) => { setSel(m); setForm(m ? { ...m } : empty); setModal(true); };
  const save = () => {
    if (!form.nom || !form.prenom) { toast("Nom et prénom requis", "er"); return; }
    if (sel) { update("moniteurs", sel.id, form); toast("Moniteur modifié", "ok"); }
    else { insert("moniteurs", form); toast("Moniteur ajouté", "ok"); }
    refresh(); setModal(false);
  };
  const del = (id) => { if (!window.confirm("Supprimer ce moniteur ?")) return; remove("moniteurs", id); refresh(); toast("Moniteur supprimé", "in"); };

  return (
    <div className="fa">
      <div className="ph">
        <div><div className="ptl">Moniteurs</div><div className="pst">{moniteurs.length} moniteurs · {moniteurs.filter(m => m.statut === "Actif").length} disponibles</div></div>
        <button className="btn btn-p" onClick={() => open()}>+ Nouveau moniteur</button>
      </div>
      <div className="ga">
        {moniteurs.map(m => {
          const nb = eleves.filter(e => e.moniteurId === m.id).length;
          return (
            <div className="mc" key={m.id}>
              <div className="mch">
                <div className={`av avl a${avc(m.id)}`}>{ini(m.nom, m.prenom)}</div>
                <div style={{ flex: 1 }}>
                  <div className="mname">{m.prenom} {m.nom}</div>
                  <div className="mrole">{m.specialite}</div>
                  <div className="mstars mt4">{strs(m.noteMoyenne)} <span style={{ fontSize: 11, color: "var(--t3)" }}>{m.noteMoyenne}/5</span></div>
                </div>
                <div className="ml"><Bdg v={m.statut} /></div>
              </div>
              <div className="dv" />
              <div className="irow">
                <span className="ik">📧</span><span className="iv">{m.email}</span>
                <span className="ik">📱</span><span className="iv">{m.telephone}</span>
                <span className="ik">💼</span><span className="iv">{m.experience}</span>
                <span className="ik">💰</span><span className="iv fn fw7" style={{ color: "var(--p)" }}>{fF(m.salaire)}</span>
                <span className="ik">📍</span><span className="iv">{m.adresse}</span>
              </div>
              <div className="mstats">
                <div><div className="msv fn" style={{ color: "var(--p)" }}>{nb}</div><div className="msl">Élèves</div></div>
                <div><div className="msv fn" style={{ color: "var(--ok)" }}>{m.noteMoyenne}</div><div className="msl">Note</div></div>
                <div><div className="msv" style={{ color: "var(--info)", fontSize: 13 }}>{m.experience}</div><div className="msl">Exp.</div></div>
              </div>
              <div className="dv" />
              <div className="row gap8">
                <button className="btn btn-g sm" style={{ flex: 1 }} onClick={() => open(m)}>✏️ Modifier</button>
                <button className="btn btn-d sm" onClick={() => del(m.id)}>🗑️</button>
              </div>
            </div>
          );
        })}
      </div>

      {modal && (
        <Modal title={sel ? "Modifier le moniteur" : "Nouveau moniteur"} onClose={() => setModal(false)} wide
          footer={<><button className="btn btn-g" onClick={() => setModal(false)}>Annuler</button><button className="btn btn-p" onClick={save}>💾 Enregistrer</button></>}>
          <div className="fgd">
            <div className="fg"><label className="fl">Prénom *</label><input className="fi" value={form.prenom} onChange={e => setForm({ ...form, prenom: e.target.value })} /></div>
            <div className="fg"><label className="fl">Nom *</label><input className="fi" value={form.nom} onChange={e => setForm({ ...form, nom: e.target.value })} /></div>
          </div>
          <div className="fgd">
            <div className="fg"><label className="fl">Email</label><input className="fi" type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} /></div>
            <div className="fg"><label className="fl">Téléphone</label><input className="fi" value={form.telephone} onChange={e => setForm({ ...form, telephone: e.target.value })} /></div>
          </div>
          <div className="fgd">
            <div className="fg"><label className="fl">Spécialité</label>
              <select className="fi" value={form.specialite} onChange={e => setForm({ ...form, specialite: e.target.value })}><option>Permis B</option><option>Permis A</option><option>Permis B/A</option><option>Permis C</option></select>
            </div>
            <div className="fg"><label className="fl">Statut</label>
              <select className="fi" value={form.statut} onChange={e => setForm({ ...form, statut: e.target.value })}><option>Actif</option><option>Congé</option><option>Inactif</option></select>
            </div>
          </div>
          <div className="fgd">
            <div className="fg"><label className="fl">Salaire (FCFA)</label><input className="fi" type="number" value={form.salaire} onChange={e => setForm({ ...form, salaire: +e.target.value })} /></div>
            <div className="fg"><label className="fl">Expérience</label><input className="fi" value={form.experience} onChange={e => setForm({ ...form, experience: e.target.value })} placeholder="Ex: 3 ans" /></div>
          </div>
          <div className="fgd">
            <div className="fg"><label className="fl">Date d'embauche</label><input className="fi" type="date" value={form.dateEmbauche} onChange={e => setForm({ ...form, dateEmbauche: e.target.value })} /></div>
            <div className="fg"><label className="fl">N° CIN</label><input className="fi" value={form.cin} onChange={e => setForm({ ...form, cin: e.target.value })} /></div>
          </div>
          <div className="fg"><label className="fl">Adresse</label><input className="fi" value={form.adresse} onChange={e => setForm({ ...form, adresse: e.target.value })} /></div>
          <div className="fg"><label className="fl">Notes</label><textarea className="fi" value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} placeholder="Observations..." /></div>
        </Modal>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
   PLANNING
══════════════════════════════════════════════════════════════════ */
function Planning({ data, refresh, toast }) {
  const { lecons, eleves, moniteurs } = data;
  const [modal, setModal] = useState(false);
  const [filt, setFilt]   = useState("Tous");
  const [dateFilt, setDateFilt] = useState("");
  const empty = { eleveId: data.eleves[0]?.id || 1, moniteurId: data.moniteurs[0]?.id || 1, date: today(), heure: "08:00", duree: 2, type: "Conduite", statut: "En attente", vehicule: "", lieu: "", notes: "" };
  const [form, setForm]   = useState(empty);

  const filtered = lecons.filter(l => {
    const ft = filt === "Tous" || l.type === filt || l.statut === filt;
    const fd = !dateFilt || l.date === dateFilt;
    return ft && fd;
  }).sort((a, b) => a.date.localeCompare(b.date) || a.heure.localeCompare(b.heure));

  const save = () => {
    if (!form.date || !form.heure) { toast("Date et heure requises", "er"); return; }
    insert("lecons", { ...form, eleveId: +form.eleveId, moniteurId: +form.moniteurId, duree: +form.duree });
    refresh(); setModal(false); toast("Leçon planifiée", "ok");
  };
  const confirm = (id) => { update("lecons", id, { statut: "Confirmée" }); refresh(); toast("Leçon confirmée", "ok"); };
  const cancel  = (id) => { update("lecons", id, { statut: "Annulée" }); refresh(); toast("Leçon annulée", "in"); };
  const finish  = (id) => { update("lecons", id, { statut: "Terminée" }); refresh(); toast("Leçon marquée terminée", "ok"); };
  const del     = (id) => { if (!window.confirm("Supprimer cette leçon ?")) return; remove("lecons", id); refresh(); toast("Leçon supprimée", "in"); };

  const colS = { Confirmée: "var(--ok)", "En attente": "var(--ac)", Annulée: "var(--er)", Terminée: "var(--info)" };

  return (
    <div className="fa">
      <div className="ph">
        <div><div className="ptl">Planning des Leçons</div><div className="pst">{lecons.length} leçons · {lecons.filter(l => l.statut === "En attente").length} en attente</div></div>
        <button className="btn btn-p" onClick={() => { setForm(empty); setModal(true); }}>+ Planifier une leçon</button>
      </div>
      <div className="fb">
        {["Tous", "Conduite", "Code", "Confirmée", "En attente", "Annulée", "Terminée"].map(f => (
          <button key={f} className={`btn sm ${filt === f ? "btn-p" : "btn-g"}`} onClick={() => setFilt(f)}>{f}</button>
        ))}
        <input className="fi" type="date" value={dateFilt} onChange={e => setDateFilt(e.target.value)} style={{ width: 160, padding: "7px 12px" }} />
        {dateFilt && <button className="btn btn-g sm" onClick={() => setDateFilt("")}>✕ Effacer date</button>}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {filtered.map(l => {
          const e = eleves.find(x => x.id === l.eleveId);
          const m = moniteurs.find(x => x.id === l.moniteurId);
          return (
            <div key={l.id} className="card" style={{ overflow: "hidden" }}>
              <div style={{ display: "flex", alignItems: "stretch" }}>
                <div style={{ width: 4, background: colS[l.statut] || "var(--bd)", flexShrink: 0 }} />
                <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "13px 16px", flex: 1, flexWrap: "wrap" }}>
                  <div style={{ minWidth: 55, textAlign: "center" }}>
                    <div className="fn fw7" style={{ fontSize: 18, color: "var(--p)" }}>{l.heure}</div>
                    <div className="txs">{l.duree}h</div>
                    <div className="txs">{fD(l.date)}</div>
                  </div>
                  <div style={{ width: 1, height: 40, background: "var(--bd)", flexShrink: 0 }} />
                  <div className="row gap10" style={{ flex: 1, minWidth: 160 }}>
                    <div className={`av a${avc(l.eleveId)}`}>{ini(e?.nom, e?.prenom)}</div>
                    <div>
                      <div className="fw7" style={{ fontSize: 13.5, color: "var(--t)" }}>{e?.prenom} {e?.nom}</div>
                      <div className="txs">avec {m?.prenom} {m?.nom}</div>
                    </div>
                  </div>
                  <div className="row gap8" style={{ flexWrap: "wrap" }}>
                    <span className={`bdg ${l.type === "Conduite" ? "bor" : "bin"}`}>{l.type}</span>
                    <Bdg v={l.statut} />
                    <span className="txs" style={{ maxWidth: 180, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>🚗 {l.vehicule}</span>
                  </div>
                  <div className="row gap6" style={{ marginLeft: "auto", flexWrap: "wrap" }}>
                    {l.statut === "En attente" && <button className="btn btn-ok sm" onClick={() => confirm(l.id)}>✓ Confirmer</button>}
                    {l.statut === "Confirmée"  && <button className="btn btn-info sm" onClick={() => finish(l.id)}>✓ Terminée</button>}
                    {(l.statut === "En attente" || l.statut === "Confirmée") && <button className="btn btn-g sm" onClick={() => cancel(l.id)}>✕ Annuler</button>}
                    <button className="btn btn-d sm" onClick={() => del(l.id)}>🗑️</button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
        {filtered.length === 0 && <div className="empty"><div className="eico">📅</div><div className="etxt">Aucune leçon trouvée</div></div>}
      </div>

      {modal && (
        <Modal title="Planifier une leçon" onClose={() => setModal(false)}
          footer={<><button className="btn btn-g" onClick={() => setModal(false)}>Annuler</button><button className="btn btn-p" onClick={save}>💾 Enregistrer</button></>}>
          <div className="fgd">
            <div className="fg"><label className="fl">Élève</label>
              <select className="fi" value={form.eleveId} onChange={e => setForm({ ...form, eleveId: +e.target.value })}>
                {eleves.map(e => <option key={e.id} value={e.id}>{e.prenom} {e.nom}</option>)}
              </select>
            </div>
            <div className="fg"><label className="fl">Moniteur</label>
              <select className="fi" value={form.moniteurId} onChange={e => setForm({ ...form, moniteurId: +e.target.value })}>
                {moniteurs.map(m => <option key={m.id} value={m.id}>{m.prenom} {m.nom}</option>)}
              </select>
            </div>
          </div>
          <div className="fgd">
            <div className="fg"><label className="fl">Date</label><input className="fi" type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} /></div>
            <div className="fg"><label className="fl">Heure</label><input className="fi" type="time" value={form.heure} onChange={e => setForm({ ...form, heure: e.target.value })} /></div>
          </div>
          <div className="fgd">
            <div className="fg"><label className="fl">Type</label>
              <select className="fi" value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}><option>Conduite</option><option>Code</option></select>
            </div>
            <div className="fg"><label className="fl">Durée</label>
              <select className="fi" value={form.duree} onChange={e => setForm({ ...form, duree: +e.target.value })}><option value={1}>1h</option><option value={2}>2h</option><option value={3}>3h</option></select>
            </div>
          </div>
          <div className="fg"><label className="fl">Véhicule / Salle</label><input className="fi" value={form.vehicule} onChange={e => setForm({ ...form, vehicule: e.target.value })} placeholder="Ex: Toyota Corolla — LT 234 A" /></div>
          <div className="fg"><label className="fl">Lieu</label><input className="fi" value={form.lieu} onChange={e => setForm({ ...form, lieu: e.target.value })} placeholder="Ex: Circuit Akwa" /></div>
          <div className="fg"><label className="fl">Notes</label><textarea className="fi" value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} placeholder="Observations..." /></div>
        </Modal>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
   EXAMENS
══════════════════════════════════════════════════════════════════ */
function Examens({ data, refresh, toast }) {
  const { examens, eleves } = data;
  const [modal, setModal] = useState(false);
  const empty = { eleveId: data.eleves[0]?.id || 1, type: "Code", date: today(), score: 0, seuil: 35, centre: "CENAC Douala", observations: "" };
  const [form, setForm]   = useState(empty);
  const tr = examens.length ? Math.round(examens.filter(x => x.statut === "Réussi").length / examens.length * 100) : 0;

  const save = () => {
    const statut = +form.score >= +form.seuil ? "Réussi" : "Échoué";
    insert("examens", { ...form, eleveId: +form.eleveId, score: +form.score, seuil: +form.seuil, statut });
    refresh(); setModal(false); toast(`Examen enregistré — ${statut}`, statut === "Réussi" ? "ok" : "er");
  };

  return (
    <div className="fa">
      <div className="ph">
        <div><div className="ptl">Examens</div><div className="pst">Taux de réussite : <strong style={{ color: "var(--ok)" }}>{tr}%</strong> sur {examens.length} examens</div></div>
        <button className="btn btn-p" onClick={() => { setForm(empty); setModal(true); }}>+ Enregistrer un examen</button>
      </div>
      <div className="g3 mb12">
        {[{ l: "Total examens", v: examens.length, c: "bl", i: "📋" },
          { l: "Réussis", v: examens.filter(x => x.statut === "Réussi").length, c: "gr", i: "✅" },
          { l: "Échoués", v: examens.filter(x => x.statut === "Échoué").length, c: "or", i: "❌" },
        ].map((s, i) => (
          <div className={`sc ${s.c}`} key={i}><div className={`si ${s.c}`}>{s.i}</div><div className="sv fn">{s.v}</div><div className="sl">{s.l}</div></div>
        ))}
      </div>
      <div className="card">
        <div className="tw">
          <table className="tbl">
            <thead><tr><th>Élève</th><th>Type</th><th>Date</th><th>Score / Seuil</th><th>Centre</th><th>Résultat</th><th>Observations</th><th></th></tr></thead>
            <tbody>
              {examens.map(x => {
                const e = eleves.find(el => el.id === x.eleveId);
                return (
                  <tr key={x.id}>
                    <td><div className="cn"><div className={`av a${avc(x.eleveId)}`}>{ini(e?.nom, e?.prenom)}</div><span className="fw7" style={{ color: "var(--t)" }}>{e?.prenom} {e?.nom}</span></div></td>
                    <td><span className={`bdg ${x.type === "Code" ? "bin" : "bor"}`}>{x.type}</span></td>
                    <td>{fD(x.date)}</td>
                    <td>
                      <span className="fn fw7" style={{ fontSize: 15, color: x.score >= x.seuil ? "var(--ok)" : "var(--er)" }}>{x.score}</span>
                      <span className="txs"> / {x.seuil}</span>
                    </td>
                    <td>{x.centre}</td>
                    <td><Bdg v={x.statut} /></td>
                    <td style={{ maxWidth: 200, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{x.observations || "—"}</td>
                    <td><button className="btn btn-d sm" onClick={() => { if (window.confirm("Supprimer ?")) { remove("examens", x.id); refresh(); toast("Examen supprimé", "in"); } }}>🗑️</button></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {examens.length === 0 && <div className="empty"><div className="eico">🎯</div><div className="etxt">Aucun examen enregistré</div></div>}
      </div>

      {modal && (
        <Modal title="Enregistrer un examen" onClose={() => setModal(false)}
          footer={<><button className="btn btn-g" onClick={() => setModal(false)}>Annuler</button><button className="btn btn-p" onClick={save}>💾 Enregistrer</button></>}>
          <div className="fg"><label className="fl">Élève</label>
            <select className="fi" value={form.eleveId} onChange={e => setForm({ ...form, eleveId: +e.target.value })}>
              {eleves.map(e => <option key={e.id} value={e.id}>{e.prenom} {e.nom}</option>)}
            </select>
          </div>
          <div className="fgd">
            <div className="fg"><label className="fl">Type d'examen</label>
              <select className="fi" value={form.type} onChange={e => setForm({ ...form, type: e.target.value, seuil: e.target.value === "Code" ? 35 : 70 })}><option>Code</option><option>Conduite</option></select>
            </div>
            <div className="fg"><label className="fl">Date</label><input className="fi" type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} /></div>
          </div>
          <div className="fgd">
            <div className="fg"><label className="fl">Score obtenu</label><input className="fi" type="number" min="0" value={form.score} onChange={e => setForm({ ...form, score: e.target.value })} placeholder={`Sur ${form.type === "Code" ? 40 : 100}`} /></div>
            <div className="fg"><label className="fl">Seuil de réussite</label><input className="fi" type="number" value={form.seuil} onChange={e => setForm({ ...form, seuil: e.target.value })} /></div>
          </div>
          <div className="fg"><label className="fl">Centre d'examen</label><input className="fi" value={form.centre} onChange={e => setForm({ ...form, centre: e.target.value })} /></div>
          <div className="fg"><label className="fl">Observations</label><textarea className="fi" value={form.observations} onChange={e => setForm({ ...form, observations: e.target.value })} placeholder="Observations post-examen..." /></div>
          {+form.score > 0 && (
            <div style={{ padding: "10px 13px", borderRadius: 9, background: +form.score >= +form.seuil ? "rgba(16,185,129,.1)" : "rgba(239,68,68,.1)", border: `1px solid ${+form.score >= +form.seuil ? "rgba(16,185,129,.2)" : "rgba(239,68,68,.2)"}`, fontSize: 13, fontWeight: 700, color: +form.score >= +form.seuil ? "var(--ok)" : "var(--er)" }}>
              {+form.score >= +form.seuil ? "✅ Résultat prévu : RÉUSSI" : "❌ Résultat prévu : ÉCHOUÉ"}
            </div>
          )}
        </Modal>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
   PAIEMENTS
══════════════════════════════════════════════════════════════════ */
function Paiements({ data, refresh, toast }) {
  const { paiements, eleves } = data;
  const [modal, setModal] = useState(false);
  const [filt, setFilt]   = useState("Tous");
  const [modeP, setModeP] = useState("Mobile Money");
  const empty = { eleveId: data.eleves[0]?.id || 1, montant: "", description: "", date: today() };
  const [form, setForm]   = useState(empty);

  const ca  = paiements.filter(p => p.statut === "Payé").reduce((s, p) => s + p.montant, 0);
  const att = paiements.filter(p => p.statut === "En attente").reduce((s, p) => s + p.montant, 0);
  const icons = { "Mobile Money": "📱", "Espèces": "💵", "Virement": "🏦", "Carte": "💳" };

  const filtered = filt === "Tous" ? paiements : paiements.filter(p => p.statut === filt || p.mode === filt);

  const save = () => {
    if (!form.montant || +form.montant <= 0) { toast("Montant invalide", "er"); return; }
    enregistrerPaiement({ ...form, eleveId: +form.eleveId, montant: +form.montant, mode: modeP, statut: "Payé" });
    refresh(); setModal(false); toast(`Paiement enregistré — Réf: ${genererReference()}`, "ok");
  };

  const markAttente = (id) => { update("paiements", id, { statut: "En attente" }); refresh(); };
  const markPaye    = (id) => { update("paiements", id, { statut: "Payé" }); refresh(); toast("Paiement validé", "ok"); };
  const exportPay   = () => { downloadFile(exportCSV("paiements"), "paiements.csv", "text/csv"); toast("Export CSV téléchargé", "ok"); };

  return (
    <div className="fa">
      <div className="ph">
        <div><div className="ptl">Facturation & Paiements</div><div className="pst">{paiements.length} transactions · {paiements.filter(p => p.statut === "Payé").length} payés</div></div>
        <div className="p-acts">
          <button className="btn btn-g sm" onClick={exportPay}>📤 Export CSV</button>
          <button className="btn btn-p" onClick={() => { setForm(empty); setModeP("Mobile Money"); setModal(true); }}>+ Enregistrer un paiement</button>
        </div>
      </div>

      <div className="g3 mb12">
        <div className="sc gr"><div className="si gr">💰</div><div className="sv fn" style={{ fontSize: 20 }}>{fF(ca)}</div><div className="sl">Chiffre d'affaires</div></div>
        <div className="sc or"><div className="si or">⏳</div><div className="sv fn" style={{ fontSize: 20 }}>{fF(att)}</div><div className="sl">En attente</div></div>
        <div className="sc bl"><div className="si bl">📊</div><div className="sv fn">{paiements.length}</div><div className="sl">Transactions</div></div>
      </div>

      <div className="fb">
        {["Tous", "Payé", "En attente"].map(f => (
          <button key={f} className={`btn sm ${filt === f ? "btn-p" : "btn-g"}`} onClick={() => setFilt(f)}>{f}</button>
        ))}
      </div>

      <div className="card">
        <div className="tw">
          <table className="tbl">
            <thead><tr><th>Référence</th><th>Élève</th><th>Montant</th><th>Mode</th><th>Description</th><th>Date</th><th>Statut</th><th>Actions</th></tr></thead>
            <tbody>
              {filtered.map(p => {
                const e = eleves.find(x => x.id === p.eleveId);
                return (
                  <tr key={p.id}>
                    <td><span className="fn fw7" style={{ color: "var(--p)", fontSize: 13 }}>{p.reference}</span></td>
                    <td><div className="cn"><div className={`av a${avc(p.eleveId)}`}>{ini(e?.nom, e?.prenom)}</div><span className="fw7" style={{ color: "var(--t)" }}>{e?.prenom} {e?.nom}</span></div></td>
                    <td><span className="fn fw7" style={{ color: "var(--ok)", fontSize: 14 }}>{fF(p.montant)}</span></td>
                    <td>{icons[p.mode] || "💳"} {p.mode}</td>
                    <td style={{ maxWidth: 160, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.description || "—"}</td>
                    <td>{fD(p.date)}</td>
                    <td><Bdg v={p.statut} /></td>
                    <td>
                      <div className="row gap6">
                        {p.statut === "En attente" && <button className="btn btn-ok sm" onClick={() => markPaye(p.id)}>✓ Valider</button>}
                        {p.statut === "Payé" && <button className="btn btn-g sm" onClick={() => { downloadFile(`Reçu paiement\nRéf: ${p.reference}\nÉlève: ${e?.prenom} ${e?.nom}\nMontant: ${fF(p.montant)}\nDate: ${fD(p.date)}\nMode: ${p.mode}\nStatut: ${p.statut}`, `recu_${p.reference}.txt`); toast("Reçu téléchargé", "ok"); }}>🧾 Reçu</button>}
                        <button className="btn btn-d sm" onClick={() => { if (window.confirm("Supprimer ce paiement ?")) { remove("paiements", p.id); refresh(); toast("Paiement supprimé", "in"); } }}>🗑️</button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && <div className="empty"><div className="eico">💰</div><div className="etxt">Aucun paiement trouvé</div></div>}
      </div>

      {modal && (
        <Modal title="Enregistrer un paiement" onClose={() => setModal(false)}
          footer={<><button className="btn btn-g" onClick={() => setModal(false)}>Annuler</button><button className="btn btn-p" onClick={save}>💾 Enregistrer</button></>}>
          <div className="fg"><label className="fl">Élève</label>
            <select className="fi" value={form.eleveId} onChange={e => setForm({ ...form, eleveId: +e.target.value })}>
              {eleves.map(e => <option key={e.id} value={e.id}>{e.prenom} {e.nom} — Solde: {fF(e.solde)}</option>)}
            </select>
          </div>
          <div className="fgd">
            <div className="fg"><label className="fl">Montant (FCFA) *</label><input className="fi" type="number" min="1" value={form.montant} onChange={e => setForm({ ...form, montant: e.target.value })} placeholder="Ex: 50000" /></div>
            <div className="fg"><label className="fl">Date</label><input className="fi" type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} /></div>
          </div>
          <div className="fg"><label className="fl">Mode de paiement</label>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 7, marginTop: 4 }}>
              {["Mobile Money", "Espèces", "Virement", "Carte"].map(m => (
                <div key={m} className={`pm ${modeP === m ? "sel" : ""}`} onClick={() => setModeP(m)}>
                  <span style={{ fontSize: 20 }}>{icons[m]}</span>
                  <span style={{ fontSize: 13, fontWeight: 600 }}>{m}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="fg"><label className="fl">Description</label><input className="fi" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Ex: 1ère tranche formation permis B" /></div>
        </Modal>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
   VÉHICULES
══════════════════════════════════════════════════════════════════ */
function Vehicules({ data, refresh, toast }) {
  const { vehicules } = data;
  const [modal, setModal] = useState(false);
  const [sel, setSel]     = useState(null);
  const empty = { marque: "", modele: "", immatriculation: "", annee: 2024, kilometrage: 0, statut: "Disponible", type: "Voiture", carburant: "Essence", couleur: "", assurance: "", visite: "", notes: "" };
  const [form, setForm]   = useState(empty);

  const open = (v = null) => { setSel(v); setForm(v ? { ...v } : empty); setModal(true); };
  const save = () => {
    if (!form.marque || !form.modele || !form.immatriculation) { toast("Marque, modèle et immatriculation requis", "er"); return; }
    if (sel) { update("vehicules", sel.id, form); toast("Véhicule modifié", "ok"); }
    else { insert("vehicules", { ...form, annee: +form.annee, kilometrage: +form.kilometrage }); toast("Véhicule ajouté", "ok"); }
    refresh(); setModal(false);
  };
  const del = (id) => { if (!window.confirm("Supprimer ce véhicule ?")) return; remove("vehicules", id); refresh(); toast("Véhicule supprimé", "in"); };

  const icos = { Voiture: "🚗", Moto: "🏍️", Camion: "🚛", Bus: "🚌" };

  return (
    <div className="fa">
      <div className="ph">
        <div><div className="ptl">Parc Automobile</div><div className="pst">{vehicules.length} véhicules · {vehicules.filter(v => v.statut === "Disponible").length} disponibles</div></div>
        <button className="btn btn-p" onClick={() => open()}>+ Ajouter un véhicule</button>
      </div>
      <div className="ga">
        {vehicules.map(v => (
          <div className="vc" key={v.id}>
            <div className="vimg">{icos[v.type] || "🚗"}</div>
            <div className="row btw mb12">
              <div>
                <div className="fw7 fn" style={{ fontSize: 15 }}>{v.marque} {v.modele}</div>
                <div className="txs mt4">{v.immatriculation} · {v.couleur}</div>
              </div>
              <Bdg v={v.statut} />
            </div>
            <div className="irow" style={{ marginBottom: 12 }}>
              <span className="ik">📅 Année</span><span className="iv fn fw7">{v.annee}</span>
              <span className="ik">🏎️ Km</span><span className="iv fn fw7">{v.kilometrage.toLocaleString()} km</span>
              <span className="ik">⛽ Carburant</span><span className="iv fw7">{v.carburant}</span>
              <span className="ik">🛡️ Assurance</span><span className="iv">{fD(v.assurance)}</span>
              <span className="ik">🔧 Visite tech.</span><span className="iv">{fD(v.visite)}</span>
            </div>
            {v.notes && <div style={{ fontSize: 12, color: "var(--t3)", background: "var(--bg3)", borderRadius: 8, padding: "8px 10px", marginBottom: 12 }}>{v.notes}</div>}
            <div className="row gap8">
              <button className="btn btn-g sm" style={{ flex: 1 }} onClick={() => open(v)}>✏️ Modifier</button>
              <button className="btn btn-d sm" onClick={() => del(v.id)}>🗑️</button>
            </div>
          </div>
        ))}
        {vehicules.length === 0 && <div className="empty" style={{ gridColumn: "1/-1" }}><div className="eico">🚗</div><div className="etxt">Aucun véhicule enregistré</div></div>}
      </div>

      {modal && (
        <Modal title={sel ? "Modifier le véhicule" : "Ajouter un véhicule"} onClose={() => setModal(false)}
          footer={<><button className="btn btn-g" onClick={() => setModal(false)}>Annuler</button><button className="btn btn-p" onClick={save}>💾 Enregistrer</button></>}>
          <div className="fgd">
            <div className="fg"><label className="fl">Marque *</label><input className="fi" value={form.marque} onChange={e => setForm({ ...form, marque: e.target.value })} placeholder="Ex: Toyota" /></div>
            <div className="fg"><label className="fl">Modèle *</label><input className="fi" value={form.modele} onChange={e => setForm({ ...form, modele: e.target.value })} placeholder="Ex: Corolla" /></div>
          </div>
          <div className="fgd">
            <div className="fg"><label className="fl">Immatriculation *</label><input className="fi" value={form.immatriculation} onChange={e => setForm({ ...form, immatriculation: e.target.value })} placeholder="Ex: LT 234 A" /></div>
            <div className="fg"><label className="fl">Type</label>
              <select className="fi" value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}><option>Voiture</option><option>Moto</option><option>Camion</option><option>Bus</option></select>
            </div>
          </div>
          <div className="fgd">
            <div className="fg"><label className="fl">Année</label><input className="fi" type="number" value={form.annee} onChange={e => setForm({ ...form, annee: +e.target.value })} /></div>
            <div className="fg"><label className="fl">Kilométrage</label><input className="fi" type="number" value={form.kilometrage} onChange={e => setForm({ ...form, kilometrage: +e.target.value })} /></div>
          </div>
          <div className="fgd">
            <div className="fg"><label className="fl">Couleur</label><input className="fi" value={form.couleur} onChange={e => setForm({ ...form, couleur: e.target.value })} /></div>
            <div className="fg"><label className="fl">Statut</label>
              <select className="fi" value={form.statut} onChange={e => setForm({ ...form, statut: e.target.value })}><option>Disponible</option><option>En service</option><option>Maintenance</option><option>Hors service</option></select>
            </div>
          </div>
          <div className="fgd">
            <div className="fg"><label className="fl">Assurance (expire le)</label><input className="fi" type="date" value={form.assurance} onChange={e => setForm({ ...form, assurance: e.target.value })} /></div>
            <div className="fg"><label className="fl">Visite technique</label><input className="fi" type="date" value={form.visite} onChange={e => setForm({ ...form, visite: e.target.value })} /></div>
          </div>
          <div className="fg"><label className="fl">Notes</label><textarea className="fi" value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} placeholder="Observations sur le véhicule..." /></div>
        </Modal>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
   NOTIFICATIONS
══════════════════════════════════════════════════════════════════ */
function Notifications({ data, refresh, toast }) {
  const { notifications, eleves } = data;
  const [form, setForm] = useState({ to: "all", canal: "sms", sujet: "", message: "" });
  const tpls = [
    { l: "📅 Rappel leçon", m: "Votre leçon de conduite est prévue le [DATE] à [HEURE]. N'oubliez pas votre pièce d'identité." },
    { l: "🎓 Convocation examen", m: "Vous êtes convoqué(e) à l'examen [TYPE] le [DATE] au centre CENAC Douala. Bonne chance !" },
    { l: "💰 Rappel paiement", m: "Votre solde impayé est de [MONTANT] FCFA. Merci de régulariser votre situation." },
    { l: "🏆 Félicitations permis", m: "Félicitations ! Vous avez obtenu votre permis de conduire. Bonne route !" },
    { l: "⚠️ Séance annulée", m: "Votre séance prévue le [DATE] est annulée. Nous vous recontacterons pour reprogrammer." },
  ];

  const send = () => {
    if (!form.sujet || !form.message) { toast("Sujet et message requis", "er"); return; }
    const target = form.to === "all" ? "Tous les élèves" : (() => { const e = eleves.find(x => x.id === +form.to); return e ? `${e.prenom} ${e.nom}` : "Inconnu"; })();
    insert("notifications", { to: target, eleveId: form.to === "all" ? null : +form.to, canal: form.canal === "sms" ? "SMS" : "Email", sujet: form.sujet, message: form.message, date: today(), statut: "Envoyé" });
    refresh(); toast(`Message envoyé à ${target}`, "ok");
    setForm({ ...form, sujet: "", message: "" });
  };

  const bulkSend = (type) => {
    const map = { impaye: eleves.filter(e => e.solde > 0), actif: eleves.filter(e => e.statut === "Actif") };
    const targets = map[type] || [];
    targets.forEach(e => {
      insert("notifications", { to: `${e.prenom} ${e.nom}`, eleveId: e.id, canal: "SMS", sujet: type === "impaye" ? "Rappel paiement" : "Information", message: type === "impaye" ? `Votre solde impayé est de ${fF(e.solde)}. Merci de régulariser.` : "Bonjour, nous avons une information importante pour vous.", date: today(), statut: "Envoyé" });
    });
    refresh(); toast(`${targets.length} message(s) envoyé(s)`, "ok");
  };

  return (
    <div className="fa">
      <div className="ph">
        <div><div className="ptl">Notifications</div><div className="pst">Envoi de SMS et emails aux élèves</div></div>
        <div className="p-acts">
          <button className="btn btn-g sm" onClick={() => bulkSend("impaye")}>📢 Relance impayés ({eleves.filter(e => e.solde > 0).length})</button>
        </div>
      </div>
      <div className="g2">
        <div className="card">
          <div className="ch"><div className="ctl">✍️ Composer un message</div></div>
          <div className="cb">
            <div className="fg"><label className="fl">Destinataire</label>
              <select className="fi" value={form.to} onChange={e => setForm({ ...form, to: e.target.value })}>
                <option value="all">📢 Tous les élèves ({eleves.length})</option>
                {eleves.map(e => <option key={e.id} value={e.id}>{e.prenom} {e.nom} {e.solde > 0 ? `— Solde: ${fF(e.solde)}` : ""}</option>)}
              </select>
            </div>
            <div className="fg"><label className="fl">Canal d'envoi</label>
              <div className="row gap8">
                {[{ v: "sms", l: "📱 SMS" }, { v: "email", l: "📧 Email" }].map(c => (
                  <button key={c.v} className={`btn ${form.canal === c.v ? "btn-p" : "btn-g"}`} style={{ flex: 1 }} onClick={() => setForm({ ...form, canal: c.v })}>{c.l}</button>
                ))}
              </div>
            </div>
            <div className="fg"><label className="fl">Templates rapides</label>
              <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                {tpls.map((t, i) => <button key={i} className="btn btn-g sm" style={{ justifyContent: "flex-start", textAlign: "left" }} onClick={() => setForm({ ...form, sujet: t.l.slice(3), message: t.m })}>{t.l}</button>)}
              </div>
            </div>
            <div className="fg"><label className="fl">Sujet *</label><input className="fi" value={form.sujet} onChange={e => setForm({ ...form, sujet: e.target.value })} placeholder="Objet du message" /></div>
            <div className="fg"><label className="fl">Message *</label><textarea className="fi" rows={3} value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} placeholder="Rédigez votre message..." /></div>
            <button className="btn btn-p full" onClick={send} disabled={!form.message || !form.sujet}>📤 Envoyer le message</button>
          </div>
        </div>
        <div className="card">
          <div className="ch"><div className="ctl">📬 Historique des envois</div><span className="bdg bor">{notifications.length}</span></div>
          <div style={{ padding: "0 18px", maxHeight: 480, overflowY: "auto" }}>
            {notifications.length === 0 && <div className="empty"><div className="eico">📬</div><div className="etxt">Aucun message envoyé</div></div>}
            {[...notifications].reverse().map(n => (
              <div key={n.id} style={{ display: "flex", gap: 11, padding: "12px 0", borderBottom: "1px solid var(--bds)" }}>
                <div style={{ width: 33, height: 33, borderRadius: 9, background: n.canal === "SMS" ? "rgba(14,165,233,.1)" : "rgba(232,71,10,.1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, flexShrink: 0 }}>{n.canal === "SMS" ? "📱" : "📧"}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div className="fw7" style={{ fontSize: 13, color: "var(--t)" }}>{n.sujet}</div>
                  <div className="tm" style={{ marginTop: 2 }}>À : {n.to}</div>
                  <div style={{ fontSize: 11, color: "var(--t3)", fontStyle: "italic", marginTop: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>"{n.message}"</div>
                  <div className="row gap8 mt4"><span className="txs">{fD(n.date)}</span><span className="bdg bok">Envoyé</span></div>
                </div>
                <button className="btn btn-d sm" style={{ alignSelf: "center" }} onClick={() => { remove("notifications", n.id); refresh(); }}>🗑️</button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
   BASE DE DONNÉES (VIEWER)
══════════════════════════════════════════════════════════════════ */
function BasesDonnees({ toast }) {
  const [table, setTable] = useState("eleves");
  const [view, setView]   = useState("table");
  const db = getDB();
  const tables = ["eleves", "moniteurs", "lecons", "paiements", "examens", "vehicules", "notifications", "depenses"];
  const tableIcons = { eleves: "👥", moniteurs: "🎓", lecons: "📅", paiements: "💰", examens: "🎯", vehicules: "🚗", notifications: "🔔", depenses: "📊" };
  const rows   = db[table] || [];
  const cols   = rows.length ? Object.keys(rows[0]) : [];

  return (
    <div className="fa">
      <div className="ph">
        <div><div className="ptl">Base de Données 🗄️</div><div className="pst">Visualisez et exportez toutes les données de votre système</div></div>
        <div className="p-acts">
          <button className="btn btn-g sm" onClick={() => { downloadFile(exportSQL(), `autoges_${new Date().toISOString().slice(0,10)}.sql`); toast("Export SQL téléchargé", "ok"); }}>📥 Export SQL</button>
          <button className="btn btn-g sm" onClick={() => { downloadFile(exportJSON(), "autoges_backup.json", "application/json"); toast("Backup JSON téléchargé", "ok"); }}>💾 Backup JSON</button>
          <button className="btn btn-g sm" onClick={() => { downloadFile(exportCSV(table), `${table}.csv`, "text/csv"); toast(`Export ${table}.csv téléchargé`, "ok"); }}>📊 Export CSV</button>
          <button className="btn btn-d sm" onClick={() => { if (window.confirm("Réinitialiser la BDD aux données initiales ?")) { resetDB(); window.location.reload(); } }}>🔄 Réinitialiser</button>
        </div>
      </div>

      {/* Résumé */}
      <div className="g3 mb12" style={{ gridTemplateColumns: "repeat(auto-fill,minmax(160px,1fr))" }}>
        {tables.map(t => (
          <div key={t} className={`sc bl`} style={{ padding: 14, cursor: "pointer", border: table === t ? "1px solid var(--p)" : "1px solid var(--bd)" }} onClick={() => setTable(t)}>
            <div style={{ fontSize: 22, marginBottom: 8 }}>{tableIcons[t]}</div>
            <div className="sv fn" style={{ fontSize: 20 }}>{(db[t] || []).length}</div>
            <div className="sl">{t}</div>
          </div>
        ))}
      </div>

      <div className="card">
        <div className="ch">
          <div className="ctl" style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span>{tableIcons[table]}</span>
            <span>Table : <strong>{table}</strong></span>
            <span className="bdg bor">{rows.length} enregistrements</span>
          </div>
          <div className="row gap8">
            <button className={`btn sm ${view === "table" ? "btn-p" : "btn-g"}`} onClick={() => setView("table")}>📋 Table</button>
            <button className={`btn sm ${view === "sql" ? "btn-p" : "btn-g"}`} onClick={() => setView("sql")}>🧾 SQL</button>
            <button className={`btn sm ${view === "json" ? "btn-p" : "btn-g"}`} onClick={() => setView("json")}>{ } JSON</button>
          </div>
        </div>
        <div style={{ padding: 18 }}>
          {view === "table" && (
            <div className="tw">
              <table className="tbl">
                <thead><tr>{cols.map(c => <th key={c}>{c}</th>)}</tr></thead>
                <tbody>
                  {rows.map((r, i) => (
                    <tr key={i}>
                      {cols.map(c => (
                        <td key={c} style={{ maxWidth: 180, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {r[c] === null || r[c] === "" ? <span style={{ color: "var(--t3)" }}>NULL</span> : String(r[c])}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
              {rows.length === 0 && <div className="empty"><div className="eico">🗄️</div><div className="etxt">Table vide</div></div>}
            </div>
          )}
          {view === "sql" && (
            <pre className="db-code">{exportSQL()}</pre>
          )}
          {view === "json" && (
            <pre className="db-code">{JSON.stringify(rows, null, 2)}</pre>
          )}
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
   DÉPENSES
══════════════════════════════════════════════════════════════════ */
function Depenses({ data, refresh, toast }) {
  const { depenses } = data;
  const [modal, setModal] = useState(false);
  const empty = { categorie: "Carburant", montant: "", date: today(), description: "", validePar: "Admin" };
  const [form, setForm]   = useState(empty);

  const total = depenses.reduce((s, d) => s + d.montant, 0);
  const save  = () => {
    if (!form.montant || +form.montant <= 0) { toast("Montant invalide", "er"); return; }
    insert("depenses", { ...form, montant: +form.montant });
    refresh(); setModal(false); toast("Dépense enregistrée", "ok");
  };

  const cats = ["Carburant", "Entretien", "Salaires", "Fournitures", "Loyer", "Taxes", "Communication", "Autre"];
  const catColor = { Carburant: "or", Entretien: "wn", Salaires: "pu", Fournitures: "bl", Loyer: "in", Taxes: "er", Communication: "gr", Autre: "in" };

  return (
    <div className="fa">
      <div className="ph">
        <div><div className="ptl">Dépenses</div><div className="pst">{depenses.length} dépenses · Total : <strong style={{ color: "var(--er)" }}>{fF(total)}</strong></div></div>
        <button className="btn btn-p" onClick={() => { setForm(empty); setModal(true); }}>+ Enregistrer une dépense</button>
      </div>

      {/* Résumé par catégorie */}
      <div className="ga mb12">
        {cats.filter(c => depenses.some(d => d.categorie === c)).map(c => {
          const catTotal = depenses.filter(d => d.categorie === c).reduce((s, d) => s + d.montant, 0);
          return (
            <div className={`sc ${catColor[c] || "bl"}`} key={c}>
              <div className="sv fn" style={{ fontSize: 16 }}>{fF(catTotal)}</div>
              <div className="sl">{c}</div>
            </div>
          );
        })}
      </div>

      <div className="card">
        <div className="tw">
          <table className="tbl">
            <thead><tr><th>Catégorie</th><th>Montant</th><th>Description</th><th>Date</th><th>Validé par</th><th></th></tr></thead>
            <tbody>
              {[...depenses].reverse().map(d => (
                <tr key={d.id}>
                  <td><span className={`bdg b${catColor[d.categorie] || "in"}`}>{d.categorie}</span></td>
                  <td className="fn fw7" style={{ color: "var(--er)" }}>{fF(d.montant)}</td>
                  <td>{d.description}</td>
                  <td>{fD(d.date)}</td>
                  <td>{d.validePar}</td>
                  <td><button className="btn btn-d sm" onClick={() => { if (window.confirm("Supprimer ?")) { remove("depenses", d.id); refresh(); toast("Dépense supprimée", "in"); } }}>🗑️</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {depenses.length === 0 && <div className="empty"><div className="eico">📊</div><div className="etxt">Aucune dépense enregistrée</div></div>}
      </div>

      {modal && (
        <Modal title="Enregistrer une dépense" onClose={() => setModal(false)}
          footer={<><button className="btn btn-g" onClick={() => setModal(false)}>Annuler</button><button className="btn btn-p" onClick={save}>💾 Enregistrer</button></>}>
          <div className="fgd">
            <div className="fg"><label className="fl">Catégorie</label>
              <select className="fi" value={form.categorie} onChange={e => setForm({ ...form, categorie: e.target.value })}>
                {cats.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div className="fg"><label className="fl">Montant (FCFA) *</label><input className="fi" type="number" min="1" value={form.montant} onChange={e => setForm({ ...form, montant: e.target.value })} /></div>
          </div>
          <div className="fgd">
            <div className="fg"><label className="fl">Date</label><input className="fi" type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} /></div>
            <div className="fg"><label className="fl">Validé par</label><input className="fi" value={form.validePar} onChange={e => setForm({ ...form, validePar: e.target.value })} /></div>
          </div>
          <div className="fg"><label className="fl">Description</label><input className="fi" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Description de la dépense" /></div>
        </Modal>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
   PARAMÈTRES
══════════════════════════════════════════════════════════════════ */
function Parametres({ toast }) {
  const [meta, setMeta] = useState(getMeta());
  const [form, setForm] = useState({ ...meta });

  const saveMeta = () => { updateMeta(form); setMeta(form); toast("Paramètres sauvegardés", "ok"); };

  return (
    <div className="fa">
      <div className="ph"><div><div className="ptl">Paramètres</div><div className="pst">Configuration générale de l'application</div></div></div>

      <div className="settings-section">
        <div className="settings-head">🏫 Informations de la structure</div>
        <div className="settings-body">
          <div className="fgd">
            <div className="fg"><label className="fl">Nom de la structure</label><input className="fi" value={form.nom_structure} onChange={e => setForm({ ...form, nom_structure: e.target.value })} /></div>
            <div className="fg"><label className="fl">Slogan</label><input className="fi" value={form.slogan} onChange={e => setForm({ ...form, slogan: e.target.value })} /></div>
          </div>
          <div className="fgd">
            <div className="fg"><label className="fl">Adresse</label><input className="fi" value={form.adresse} onChange={e => setForm({ ...form, adresse: e.target.value })} /></div>
            <div className="fg"><label className="fl">Téléphone</label><input className="fi" value={form.telephone} onChange={e => setForm({ ...form, telephone: e.target.value })} /></div>
          </div>
          <div className="fg"><label className="fl">Email</label><input className="fi" type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} /></div>
          <button className="btn btn-p" onClick={saveMeta}>💾 Enregistrer les paramètres</button>
        </div>
      </div>

      <div className="settings-section">
        <div className="settings-head">🗄️ Gestion des données</div>
        <div className="settings-body">
          <p style={{ fontSize: 13, color: "var(--t2)", marginBottom: 16 }}>Exportez ou sauvegardez toutes vos données. Le format SQL est compatible avec MySQL/phpMyAdmin pour une migration vers un serveur.</p>
          <div className="row gap8" style={{ flexWrap: "wrap" }}>
            <button className="btn btn-g" onClick={() => { downloadFile(exportSQL(), `autoges_${new Date().toISOString().slice(0,10)}.sql`); toast("Export SQL téléchargé", "ok"); }}>📥 Exporter en SQL</button>
            <button className="btn btn-g" onClick={() => { downloadFile(exportJSON(), "autoges_backup.json", "application/json"); toast("Backup JSON téléchargé", "ok"); }}>💾 Backup JSON</button>
            <button className="btn btn-g" onClick={() => { downloadFile(exportCSV("eleves"), "eleves.csv", "text/csv"); toast("Export élèves CSV", "ok"); }}>📊 Élèves CSV</button>
            <button className="btn btn-g" onClick={() => { downloadFile(exportCSV("paiements"), "paiements.csv", "text/csv"); toast("Export paiements CSV", "ok"); }}>📊 Paiements CSV</button>
          </div>
        </div>
      </div>

      <div className="settings-section" style={{ borderColor: "rgba(239,68,68,.2)" }}>
        <div className="settings-head" style={{ color: "var(--er)" }}>⚠️ Zone dangereuse</div>
        <div className="settings-body">
          <p style={{ fontSize: 13, color: "var(--t2)", marginBottom: 16 }}>La réinitialisation supprimera toutes vos données et restaurera les données initiales de démonstration.</p>
          <button className="btn btn-d" onClick={() => { if (window.confirm("⚠️ Réinitialiser toute la base de données ? Cette action est irréversible.")) { resetDB(); window.location.reload(); } }}>🔄 Réinitialiser la base de données</button>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
   APPLICATION PRINCIPALE
══════════════════════════════════════════════════════════════════ */
export default function App() {
  const [page, setPage]   = useState("db_home");
  const [sideOpen, setSideOpen] = useState(false);
  const [data, setData]   = useState(null);
  const { toasts, add: toast } = useToast();

  // Chargement initial de la BDD
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

  // Recharge les données depuis localStorage
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
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh", background: "#0E1117", flexDirection: "column", gap: 16 }}>
      <div style={{ fontSize: 48 }}>🚗</div>
      <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 20, color: "#EFF3FF", fontWeight: 700 }}>AutoGES Pro</div>
      <div style={{ color: "#94A3B8", fontSize: 14 }}>Chargement...</div>
    </div>
  );

  const nav = [
    { id: "db_home",  ico: "⊞",  l: "Tableau de bord",  section: "principal" },
    { id: "el",       ico: "👥",  l: "Élèves",           section: "principal",  badge: data.eleves.filter(e => e.statut === "Actif").length },
    { id: "mn",       ico: "🎓",  l: "Moniteurs",        section: "gestion" },
    { id: "pl",       ico: "📅",  l: "Planning",         section: "gestion",    badge: data.lecons.filter(l => l.statut === "En attente").length || undefined },
    { id: "xm",       ico: "🎯",  l: "Examens",          section: "gestion" },
    { id: "pa",       ico: "💰",  l: "Paiements",        section: "gestion",    badge: data.paiements.filter(p => p.statut === "En attente").length || undefined },
    { id: "vh",       ico: "🚗",  l: "Véhicules",        section: "gestion" },
    { id: "dp",       ico: "📊",  l: "Dépenses",         section: "gestion" },
    { id: "no",       ico: "🔔",  l: "Notifications",    section: "outils" },
    { id: "bdd",      ico: "🗄️",  l: "Base de données",  section: "outils" },
    { id: "set",      ico: "⚙️",  l: "Paramètres",       section: "outils" },
  ];

  const sections = [
    { key: "principal", label: "Principal" },
    { key: "gestion",   label: "Gestion" },
    { key: "outils",    label: "Outils" },
  ];

  const go = (id) => { setPage(id); setSideOpen(false); };

  const renderPage = () => {
    const props = { data, refresh, toast, setPage };
    switch (page) {
      case "db_home": return <Dashboard {...props} />;
      case "el":      return <Eleves {...props} />;
      case "mn":      return <Moniteurs {...props} />;
      case "pl":      return <Planning {...props} />;
      case "xm":      return <Examens {...props} />;
      case "pa":      return <Paiements {...props} />;
      case "vh":      return <Vehicules {...props} />;
      case "dp":      return <Depenses {...props} />;
      case "no":      return <Notifications {...props} />;
      case "bdd":     return <BasesDonnees {...props} />;
      case "set":     return <Parametres {...props} />;
      default:        return <Dashboard {...props} />;
    }
  };

  const meta = getMeta();
  const cur  = nav.find(n => n.id === page);

  return (
    <>
      <CSS />
      <div className="app">
        {/* Overlay mobile */}
        <div className={`overlay${sideOpen ? " show" : ""}`} onClick={() => setSideOpen(false)} />

        {/* SIDEBAR */}
        <nav className={`sidebar${sideOpen ? " open" : ""}`}>
          <div className="s-logo">
            <div className="s-icon">🚗</div>
            <div>
              <div className="s-name">{meta.nom_structure?.split(" ").slice(0, 2).join(" ") || "AutoGES Pro"}</div>
              <div className="s-tag">AutoGES Pro v1.0</div>
            </div>
          </div>

          <div className="s-nav">
            {sections.map(sec => (
              <div className="s-sec" key={sec.key}>
                <div className="s-lbl">{sec.label}</div>
                {nav.filter(n => n.section === sec.key).map(n => (
                  <div key={n.id} className={`ni${page === n.id ? " on" : ""}`} onClick={() => go(n.id)}>
                    <span className="ico">{n.ico}</span>
                    {n.l}
                    {n.badge ? <span className="nbg">{n.badge}</span> : null}
                  </div>
                ))}
              </div>
            ))}
          </div>

          <div className="s-foot">
            <div className="u-card">
              <div className="u-av">AD</div>
              <div>
                <div className="u-name">Administrateur</div>
                <div className="u-role">Super Admin</div>
              </div>
              <span style={{ marginLeft: "auto", fontSize: 13, color: "var(--t3)", cursor: "pointer" }} onClick={() => go("set")}>⚙️</span>
            </div>
          </div>
        </nav>

        {/* MAIN */}
        <div className="main">
          <div className="topbar">
            <div className="ham" onClick={() => setSideOpen(!sideOpen)}>☰</div>
            <div className="t-ttl">{cur?.l || "AutoGES Pro"}</div>
            <div className="t-srch">
              <span style={{ color: "var(--t3)", fontSize: 14 }}>🔍</span>
              <input placeholder="Recherche globale..." onChange={e => {
                if (e.target.value.length < 2) return;
                const q = e.target.value.toLowerCase();
                const found = data.eleves.find(el => `${el.nom} ${el.prenom} ${el.email}`.toLowerCase().includes(q));
                if (found) { go("el"); }
              }} />
            </div>
            <div className="t-acts">
              <div className="ibtn" title="Notifications" onClick={() => go("no")}>🔔<div className="ndot" /></div>
              <div className="ibtn" title="Base de données" onClick={() => go("bdd")}>🗄️</div>
              <div className="u-av" style={{ width: 34, height: 34, borderRadius: 9, cursor: "pointer", fontSize: 12 }} onClick={() => go("set")}>AD</div>
            </div>
          </div>

          <div className="pg">{renderPage()}</div>
        </div>
      </div>
      <Toasts toasts={toasts} />
    </>
  );
}
