import { useState, useRef, useCallback } from "react";

// ─── Design tokens ────────────────────────────────────────────────────────────
const G = {
  900: "#0d1f13",
  800: "#14532d",
  700: "#15803d",
  600: "#16a34a",
  500: "#22c55e",
  400: "#4ade80",
  300: "#86efac",
  200: "#bbf7d0",
  100: "#dcfce7",
  50:  "#f0fdf4",
};

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,300;12..96,400;12..96,500;12..96,600;12..96,700;12..96,800&family=Instrument+Serif:ital@0;1&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --ff-sans: 'Bricolage Grotesque', sans-serif;
    --ff-serif: 'Instrument Serif', serif;
    --g50:  #f0fdf4;
    --g100: #dcfce7;
    --g200: #bbf7d0;
    --g300: #86efac;
    --g400: #4ade80;
    --g500: #22c55e;
    --g600: #16a34a;
    --g700: #15803d;
    --g800: #14532d;
    --g900: #0d1f13;
    --ink:  #0a1a10;
    --muted: #3d5a47;
    --surface: #f7fdf9;
    --card: #ffffff;
    --border: #d1fae5;
    --radius: 14px;
    --radius-sm: 8px;
    --shadow: 0 4px 24px rgba(22,163,74,0.10);
    --shadow-lg: 0 12px 48px rgba(22,163,74,0.18);
  }

  html { scroll-behavior: smooth; font-size: 16px; }

  body {
    font-family: var(--ff-sans);
    background: var(--surface);
    color: var(--ink);
    min-height: 100vh;
    overflow-x: hidden;
    line-height: 1.5;
  }

  /* ─── NAV ─── */
  .nav {
    position: sticky; top: 0; z-index: 200;
    background: rgba(247,253,249,0.88);
    backdrop-filter: blur(20px);
    border-bottom: 1px solid var(--border);
    height: 64px;
    padding: 0 5%;
    display: flex; align-items: center; justify-content: space-between;
  }
  .nav-logo {
    font-family: var(--ff-serif);
    font-size: 1.55rem;
    color: var(--g800);
    cursor: pointer;
    user-select: none;
  }
  .nav-logo span { color: var(--g500); font-style: italic; }
  .nav-links { display: flex; gap: 2rem; list-style: none; }
  .nav-links a {
    font-size: 0.875rem; font-weight: 500; color: var(--muted);
    text-decoration: none; transition: color .2s; cursor: pointer;
  }
  .nav-links a:hover { color: var(--g600); }
  .nav-btns { display: flex; gap: .75rem; align-items: center; }

  /* ─── BUTTONS ─── */
  .btn {
    font-family: var(--ff-sans); cursor: pointer;
    border-radius: var(--radius-sm); font-weight: 600;
    font-size: 0.875rem; transition: all .2s; display: inline-flex;
    align-items: center; gap: .5rem; text-decoration: none;
    border: none; outline: none;
  }
  .btn-outline {
    padding: .45rem 1.1rem;
    border: 1.5px solid var(--g400) !important;
    background: transparent; color: var(--g700);
  }
  .btn-outline:hover { background: var(--g100); }
  .btn-primary {
    padding: .5rem 1.3rem;
    background: var(--g500); color: #fff;
    border: none;
  }
  .btn-primary:hover { background: var(--g600); transform: translateY(-1px); }
  .btn-primary:active { transform: translateY(0); }
  .btn-lg {
    padding: 1rem 2.4rem;
    font-size: 1.05rem;
    border-radius: 14px;
    font-weight: 700;
    box-shadow: 0 8px 30px rgba(34,197,94,.3);
  }
  .btn-lg:hover { transform: translateY(-3px); box-shadow: 0 14px 40px rgba(34,197,94,.4); }
  .btn-ghost-sm {
    background: none; border: none; cursor: pointer;
    color: var(--muted); font-size: 1.2rem; padding: .25rem;
    line-height: 1;
  }

  /* ─── HERO ─── */
  .hero {
    min-height: 88vh;
    display: flex; flex-direction: column;
    align-items: center; justify-content: center;
    text-align: center;
    padding: 5rem 5% 4rem;
    position: relative; overflow: hidden;
  }
  .hero-blob1 {
    position: absolute; border-radius: 50%;
    filter: blur(80px); opacity: .3; pointer-events: none;
    width: 600px; height: 600px;
    background: radial-gradient(circle, #86efac, #4ade80);
    top: -150px; left: -150px;
  }
  .hero-blob2 {
    position: absolute; border-radius: 50%;
    filter: blur(80px); opacity: .25; pointer-events: none;
    width: 500px; height: 500px;
    background: radial-gradient(circle, #bbf7d0, #22c55e);
    bottom: -100px; right: -100px;
  }
  .hero-content { position: relative; z-index: 1; }

  .badge {
    display: inline-flex; align-items: center; gap: .4rem;
    background: var(--g100); border: 1px solid var(--g300);
    border-radius: 100px; padding: .3rem .9rem;
    font-size: .78rem; font-weight: 600; color: var(--g700);
    margin-bottom: 1.5rem;
  }
  .badge-dot {
    width: 7px; height: 7px;
    background: var(--g500); border-radius: 50%;
    animation: pulse 1.8s infinite;
  }

  @keyframes pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.5;transform:scale(1.4)} }
  @keyframes fadeUp { from{opacity:0;transform:translateY(22px)} to{opacity:1;transform:translateY(0)} }
  @keyframes fadeIn { from{opacity:0} to{opacity:1} }
  @keyframes scaleIn { from{opacity:0;transform:scale(.95)} to{opacity:1;transform:scale(1)} }
  @keyframes slideUp { from{opacity:0;transform:translateY(40px)} to{opacity:1;transform:translateY(0)} }

  .anim-1 { animation: fadeUp .6s ease both; }
  .anim-2 { animation: fadeUp .6s .1s ease both; }
  .anim-3 { animation: fadeUp .6s .2s ease both; }
  .anim-4 { animation: fadeUp .6s .3s ease both; }

  .hero h1 {
    font-family: var(--ff-serif);
    font-size: clamp(2.8rem, 6vw, 5rem);
    line-height: 1.08; color: var(--ink);
    max-width: 780px; margin-bottom: 1.5rem;
  }
  .hero h1 em { font-style: italic; color: var(--g600); }
  .hero p {
    font-size: 1.1rem; color: var(--muted);
    max-width: 500px; line-height: 1.7; margin-bottom: 2.5rem;
  }

  /* ─── FEATURES SECTION ─── */
  .features {
    padding: 5rem 5%;
    background: var(--g50);
    border-top: 1px solid var(--border);
    border-bottom: 1px solid var(--border);
  }
  .section-label {
    text-align: center; font-size: .78rem; font-weight: 700;
    letter-spacing: .12em; text-transform: uppercase;
    color: var(--g600); margin-bottom: .5rem;
  }
  .section-title {
    text-align: center;
    font-family: var(--ff-serif);
    font-size: clamp(1.8rem, 3.5vw, 2.6rem);
    color: var(--ink); margin-bottom: 3rem;
  }
  .cards-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
    gap: 1.5rem; max-width: 1000px; margin: 0 auto;
  }
  .feat-card {
    background: var(--card); border: 1.5px solid var(--border);
    border-radius: 20px; padding: 2rem 1.8rem;
    transition: transform .25s, box-shadow .25s, border-color .25s;
    cursor: default;
  }
  .feat-card:hover {
    transform: translateY(-6px);
    box-shadow: var(--shadow-lg);
    border-color: var(--g300);
  }
  .feat-icon { font-size: 2.4rem; margin-bottom: 1rem; display: block; }
  .feat-card h3 { font-size: 1.1rem; font-weight: 700; margin-bottom: .5rem; }
  .feat-card p { font-size: .9rem; color: var(--muted); line-height: 1.65; }
  .feat-tag {
    display: inline-block; margin-top: 1.2rem;
    font-size: .72rem; font-weight: 700;
    text-transform: uppercase; letter-spacing: .08em;
    color: var(--g700); background: var(--g100);
    border-radius: 6px; padding: .25rem .6rem;
  }

  /* ─── HOW IT WORKS ─── */
  .hiw { padding: 5rem 5%; }
  .hiw-inner {
    max-width: 1100px; margin: 0 auto;
    display: grid; grid-template-columns: 1fr 1fr; gap: 4rem;
    align-items: center;
  }
  .hiw-left .section-label,
  .hiw-left .section-title { text-align: left; }
  .steps { display: flex; flex-direction: column; gap: 1.6rem; margin-top: 2rem; }
  .step { display: flex; align-items: flex-start; gap: 1.1rem; }
  .step-num {
    min-width: 42px; height: 42px; border-radius: 12px;
    background: var(--g500); color: #fff;
    font-weight: 800; font-size: 1rem;
    display: flex; align-items: center; justify-content: center;
    box-shadow: 0 4px 14px rgba(34,197,94,.3);
    flex-shrink: 0;
  }
  .step-content h4 { font-size: 1rem; font-weight: 700; margin-bottom: .2rem; }
  .step-content p { font-size: .875rem; color: var(--muted); line-height: 1.6; }
  .video-box {
    background: var(--g100); border: 2px dashed var(--g300);
    border-radius: 22px; aspect-ratio: 16/9;
    display: flex; flex-direction: column;
    align-items: center; justify-content: center; gap: 1rem;
  }
  .play-btn {
    width: 72px; height: 72px; background: var(--g500);
    border-radius: 50%; display: flex; align-items: center; justify-content: center;
    box-shadow: 0 8px 28px rgba(34,197,94,.4);
    cursor: pointer; transition: transform .2s, box-shadow .2s; border: none;
  }
  .play-btn:hover { transform: scale(1.08); box-shadow: 0 12px 36px rgba(34,197,94,.5); }
  .play-btn svg { width: 28px; height: 28px; fill: white; margin-left: 4px; }
  .video-box span { font-size: .85rem; font-weight: 600; color: var(--g600); }

  /* ─── FOOTER ─── */
  footer {
    background: var(--g900); color: var(--g300);
    text-align: center; padding: 1.8rem 5%;
    font-size: .85rem; font-weight: 500;
  }
  footer span { color: var(--g400); }

  /* ─── AUTH MODAL ─── */
  .overlay {
    position: fixed; inset: 0; z-index: 500;
    background: rgba(10,26,16,.6);
    backdrop-filter: blur(8px);
    display: flex; align-items: center; justify-content: center;
    padding: 1rem;
    animation: fadeIn .2s ease;
  }
  .auth-card {
    background: var(--card); border-radius: 24px;
    padding: 2.5rem 2.8rem;
    width: 100%; max-width: 440px;
    box-shadow: var(--shadow-lg);
    animation: scaleIn .25s ease;
    position: relative;
  }
  .auth-logo {
    font-family: var(--ff-serif);
    font-size: 1.6rem; color: var(--g800);
    text-align: center; margin-bottom: .25rem;
  }
  .auth-logo span { color: var(--g500); font-style: italic; }
  .auth-subtitle { text-align: center; color: var(--muted); font-size: .9rem; margin-bottom: 2rem; }
  .auth-tabs { display: flex; border: 1.5px solid var(--border); border-radius: 10px; margin-bottom: 2rem; overflow: hidden; }
  .auth-tab {
    flex: 1; padding: .65rem 1rem; background: none;
    border: none; cursor: pointer; font-family: var(--ff-sans);
    font-size: .875rem; font-weight: 600; color: var(--muted);
    transition: all .2s;
  }
  .auth-tab.active { background: var(--g500); color: #fff; }
  .form-group { margin-bottom: 1.2rem; }
  .form-label { display: block; font-size: .8rem; font-weight: 600; color: var(--muted); margin-bottom: .4rem; }
  .form-input {
    width: 100%; padding: .7rem 1rem;
    border: 1.5px solid var(--border); border-radius: 10px;
    font-family: var(--ff-sans); font-size: .9rem; color: var(--ink);
    background: var(--g50); outline: none;
    transition: border-color .2s, background .2s;
  }
  .form-input:focus { border-color: var(--g400); background: #fff; }
  .form-input::placeholder { color: #aac4b5; }
  .auth-submit {
    width: 100%; padding: .85rem;
    background: var(--g500); color: #fff;
    border: none; border-radius: 12px;
    font-family: var(--ff-sans); font-size: 1rem; font-weight: 700;
    cursor: pointer; transition: all .2s; margin-top: .5rem;
  }
  .auth-submit:hover { background: var(--g600); transform: translateY(-1px); }
  .auth-submit:active { transform: translateY(0); }
  .auth-divider { text-align: center; color: var(--muted); font-size: .82rem; margin: 1.2rem 0; }
  .auth-close {
    position: absolute; top: 1.1rem; right: 1.1rem;
    background: var(--g100); border: none; border-radius: 8px;
    width: 32px; height: 32px; cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    color: var(--g700); font-size: 1.1rem; transition: background .2s;
  }
  .auth-close:hover { background: var(--g200); }

  /* ─── UPLOAD DIALOG ─── */
  .upload-card {
    background: var(--card); border-radius: 28px;
    padding: 2.8rem 3rem;
    width: 100%; max-width: 520px;
    box-shadow: var(--shadow-lg);
    animation: slideUp .3s ease;
    position: relative;
  }
  .upload-card h2 {
    font-family: var(--ff-serif);
    font-size: 1.8rem; color: var(--ink); margin-bottom: .4rem;
  }
  .upload-card .sub { color: var(--muted); font-size: .9rem; margin-bottom: 2rem; }
  .drop-zone {
    border: 2.5px dashed var(--g300); border-radius: 18px;
    background: var(--g50); padding: 3rem 2rem;
    text-align: center; cursor: pointer;
    transition: all .25s; position: relative;
  }
  .drop-zone.over {
    border-color: var(--g500); background: var(--g100);
    transform: scale(1.01);
  }
  .drop-zone:hover { border-color: var(--g400); background: var(--g100); }
  .drop-icon {
    width: 64px; height: 64px; margin: 0 auto 1rem;
    background: var(--g100); border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    transition: background .25s;
  }
  .drop-zone:hover .drop-icon, .drop-zone.over .drop-icon { background: var(--g200); }
  .drop-icon svg { width: 28px; height: 28px; stroke: var(--g600); }
  .drop-zone h4 { font-size: 1rem; font-weight: 700; margin-bottom: .35rem; }
  .drop-zone p { font-size: .85rem; color: var(--muted); line-height: 1.6; }
  .drop-formats { display: flex; gap: .5rem; justify-content: center; margin-top: 1rem; flex-wrap: wrap; }
  .drop-format {
    font-size: .72rem; font-weight: 700; text-transform: uppercase;
    background: var(--g100); color: var(--g700);
    border-radius: 6px; padding: .25rem .6rem; letter-spacing: .04em;
  }
  .upload-progress { margin-top: 1.5rem; }
  .progress-label { display: flex; justify-content: space-between; align-items: center; margin-bottom: .5rem; }
  .progress-label span { font-size: .85rem; font-weight: 600; color: var(--ink); }
  .progress-label .pct { color: var(--g600); }
  .progress-bar { height: 6px; background: var(--g100); border-radius: 10px; overflow: hidden; }
  .progress-fill { height: 100%; background: var(--g500); border-radius: 10px; transition: width .25s; }
  .file-preview {
    background: var(--g50); border: 1.5px solid var(--border);
    border-radius: 14px; padding: 1rem 1.2rem;
    display: flex; align-items: center; gap: 1rem; margin-top: 1.5rem;
  }
  .file-ico {
    width: 44px; height: 44px; background: var(--g200); border-radius: 10px;
    display: flex; align-items: center; justify-content: center;
    font-size: 1.4rem; flex-shrink: 0;
  }
  .file-info p { font-size: .9rem; font-weight: 700; color: var(--ink); margin-bottom: .1rem; }
  .file-info span { font-size: .78rem; color: var(--muted); }
  .file-remove {
    margin-left: auto; background: none; border: none;
    color: var(--muted); cursor: pointer; font-size: 1.2rem;
    transition: color .2s;
  }
  .file-remove:hover { color: #e53e3e; }
  .upload-actions { display: flex; gap: .75rem; margin-top: 1.5rem; }
  .upload-actions .btn { flex: 1; justify-content: center; padding: .8rem; font-size: .95rem; }

  /* ─── DASHBOARD ─── */
  .dash-layout { display: flex; min-height: calc(100vh - 64px); }
  .sidebar {
    width: 260px; flex-shrink: 0;
    background: var(--card); border-right: 1px solid var(--border);
    padding: 2rem 1.2rem;
    display: flex; flex-direction: column; gap: .5rem;
  }
  .sidebar-section { font-size: .72rem; font-weight: 700; text-transform: uppercase;
    letter-spacing: .1em; color: var(--muted); padding: .25rem .8rem; margin-top: 1rem; }
  .sidebar-item {
    display: flex; align-items: center; gap: .75rem;
    padding: .6rem .8rem; border-radius: 10px; cursor: pointer;
    font-size: .875rem; font-weight: 500; color: var(--muted);
    transition: all .18s;
  }
  .sidebar-item:hover { background: var(--g50); color: var(--g700); }
  .sidebar-item.active { background: var(--g100); color: var(--g700); font-weight: 700; }
  .sidebar-item .si-icon { font-size: 1.1rem; flex-shrink: 0; }
  .dash-main { flex: 1; overflow-y: auto; padding: 2.5rem 3rem; }
  .dash-header { margin-bottom: 2rem; }
  .dash-header h2 {
    font-family: var(--ff-serif);
    font-size: 1.9rem; color: var(--ink); margin-bottom: .25rem;
  }
  .dash-header p { color: var(--muted); font-size: .9rem; }

  /* ─── SCORE HERO ─── */
  .score-row {
    display: grid;
    grid-template-columns: auto 1fr;
    gap: 2.5rem; align-items: center;
    background: linear-gradient(135deg, var(--g900) 0%, var(--g800) 100%);
    border-radius: 22px; padding: 2.5rem;
    margin-bottom: 2rem; position: relative; overflow: hidden;
  }
  .score-row::before {
    content: '';
    position: absolute; top: -60px; right: -60px;
    width: 220px; height: 220px;
    background: radial-gradient(circle, rgba(74,222,128,.2), transparent 70%);
    border-radius: 50%;
  }
  .score-circle {
    width: 130px; height: 130px; border-radius: 50%;
    background: conic-gradient(var(--g400) 0deg, var(--g400) calc(var(--pct)*3.6deg), rgba(255,255,255,.1) calc(var(--pct)*3.6deg));
    display: flex; align-items: center; justify-content: center;
    position: relative; flex-shrink: 0;
  }
  .score-inner {
    width: 100px; height: 100px; background: var(--g900);
    border-radius: 50%; display: flex; flex-direction: column;
    align-items: center; justify-content: center;
  }
  .score-num { font-size: 2rem; font-weight: 800; color: var(--g400); line-height: 1; }
  .score-of { font-size: .7rem; color: var(--g300); margin-top: .15rem; }
  .score-info h3 { font-family: var(--ff-serif); font-size: 1.5rem; color: #fff; margin-bottom: .4rem; }
  .score-info p { font-size: .9rem; color: var(--g200); line-height: 1.6; max-width: 440px; }
  .score-grade {
    display: inline-block; margin-top: 1rem;
    background: rgba(74,222,128,.15); color: var(--g300);
    border: 1px solid rgba(74,222,128,.3); border-radius: 8px;
    padding: .35rem .9rem; font-size: .8rem; font-weight: 700;
    letter-spacing: .05em; text-transform: uppercase;
  }

  /* ─── SECTION CARDS ─── */
  .analysis-grid {
    display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 1.5rem; margin-bottom: 2rem;
  }
  .a-card {
    background: var(--card); border: 1.5px solid var(--border);
    border-radius: 18px; padding: 1.5rem 1.8rem;
  }
  .a-card-header {
    display: flex; align-items: center; gap: .75rem;
    margin-bottom: 1.2rem;
  }
  .a-card-icon {
    width: 38px; height: 38px; border-radius: 10px;
    background: var(--g100); display: flex; align-items: center; justify-content: center;
    font-size: 1.2rem; flex-shrink: 0;
  }
  .a-card h4 { font-size: 1rem; font-weight: 700; }
  .a-card .a-sub { font-size: .78rem; color: var(--muted); }

  /* keyword pills */
  .pill-list { display: flex; flex-wrap: wrap; gap: .5rem; }
  .pill {
    font-size: .78rem; font-weight: 600; border-radius: 20px;
    padding: .3rem .8rem; display: flex; align-items: center; gap: .3rem;
  }
  .pill-found { background: var(--g100); color: var(--g700); }
  .pill-miss { background: #fef2f2; color: #b91c1c; }
  .pill-dot { width: 6px; height: 6px; border-radius: 50%; flex-shrink: 0; }
  .pill-found .pill-dot { background: var(--g500); }
  .pill-miss .pill-dot { background: #ef4444; }

  /* bullet suggestions */
  .bullet-list { display: flex; flex-direction: column; gap: 1rem; }
  .bullet-item { background: var(--g50); border-radius: 12px; padding: 1rem 1.2rem; }
  .bullet-original { font-size: .82rem; color: var(--muted); text-decoration: line-through; margin-bottom: .4rem; }
  .bullet-new { font-size: .88rem; color: var(--ink); font-weight: 500; line-height: 1.5; }
  .bullet-arrow { font-size: .75rem; color: var(--g600); font-weight: 700; margin-bottom: .2rem; }

  /* skills */
  .skill-row { display: flex; align-items: center; gap .75rem; margin-bottom: .75rem; }
  .skill-name { font-size: .85rem; font-weight: 600; width: 120px; flex-shrink: 0; }
  .skill-bar-bg { flex: 1; height: 8px; background: var(--g100); border-radius: 10px; overflow: hidden; }
  .skill-bar-fill { height: 100%; background: var(--g400); border-radius: 10px; }
  .skill-pct { font-size: .78rem; color: var(--muted); width: 36px; text-align: right; flex-shrink: 0; }

  /* contact info */
  .contact-row {
    display: flex; align-items: center; gap: .75rem;
    padding: .6rem .8rem; background: var(--g50);
    border-radius: 10px; margin-bottom: .5rem;
  }
  .contact-ico { font-size: 1rem; flex-shrink: 0; }
  .contact-val { font-size: .875rem; color: var(--ink); }
  .contact-label { font-size: .72rem; color: var(--muted); }

  /* suggestions list */
  .sugg-list { display: flex; flex-direction: column; gap: .75rem; }
  .sugg-item { display: flex; align-items: flex-start; gap: .75rem; }
  .sugg-num {
    min-width: 26px; height: 26px; border-radius: 8px;
    background: var(--g100); color: var(--g700);
    font-size: .75rem; font-weight: 800;
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0; margin-top: .1rem;
  }
  .sugg-text { font-size: .875rem; color: var(--ink); line-height: 1.55; }
  .sugg-text strong { color: var(--g700); }

  /* loading */
  .loading-state { text-align: center; padding: 4rem 2rem; }
  .spinner {
    width: 48px; height: 48px; border: 4px solid var(--g100);
    border-top-color: var(--g500); border-radius: 50%;
    animation: spin 0.8s linear infinite; margin: 0 auto 1.5rem;
  }
  @keyframes spin { to { transform: rotate(360deg); } }
  .loading-state h3 { font-family: var(--ff-serif); font-size: 1.5rem; margin-bottom: .5rem; }
  .loading-state p { color: var(--muted); font-size: .9rem; }

  /* toast */
  .toast {
    position: fixed; bottom: 2rem; right: 2rem; z-index: 999;
    background: var(--g900); color: var(--g200);
    border-radius: 12px; padding: .85rem 1.4rem;
    font-size: .875rem; font-weight: 600;
    box-shadow: var(--shadow-lg); animation: slideUp .3s ease;
    display: flex; align-items: center; gap: .5rem;
  }

  @media (max-width: 768px) {
    .hiw-inner { grid-template-columns: 1fr; }
    .nav-links { display: none; }
    .sidebar { width: 200px; }
    .dash-main { padding: 1.5rem; }
    .score-row { grid-template-columns: 1fr; text-align: center; }
    .score-circle { margin: 0 auto; }
  }
`;

// ── helpers ──────────────────────────────────────────────────────────────────
function fmtSize(b) {
  if (b < 1024) return b + " B";
  if (b < 1048576) return (b / 1024).toFixed(1) + " KB";
  return (b / 1048576).toFixed(1) + " MB";
}

// ── mock analysis data ────────────────────────────────────────────────────────
function mockAnalysis(filename) {
  return {
    filename,
    name: "Alex Johnson",
    email: "alex.johnson@email.com",
    phone: "+1 (415) 555-0198",
    location: "San Francisco, CA",
    linkedin: "linkedin.com/in/alexjohnson",
    title: "Senior Frontend Developer",
    experience: "5 years",
    education: "B.Sc. Computer Science, UC Berkeley",
    atsScore: 74,
    keywordsFound: ["React", "TypeScript", "Node.js", "REST API", "Git", "CSS", "Agile"],
    keywordsMissing: ["GraphQL", "Docker", "CI/CD", "Testing", "AWS"],
    skills: [
      { name: "React", pct: 95 },
      { name: "TypeScript", pct: 88 },
      { name: "Node.js", pct: 72 },
      { name: "CSS/Tailwind", pct: 90 },
      { name: "Git", pct: 85 },
    ],
    bullets: [
      {
        original: "Worked on making the website faster.",
        improved: "Optimized core web vitals by 38%, reducing LCP from 3.2s to 1.9s through code-splitting and image lazy-loading.",
      },
      {
        original: "Built new features for the dashboard.",
        improved: "Architected and shipped 12 dashboard features using React + TypeScript, directly supporting a 22% increase in user retention.",
      },
      {
        original: "Helped the team with tasks.",
        improved: "Led cross-functional sprint planning for a 6-engineer team, reducing ticket backlog by 45% over two quarters.",
      },
    ],
    suggestions: [
      { text: "Add a <strong>professional summary</strong> at the top — recruiters spend ~6 seconds on first pass." },
      { text: "Quantify all achievements — your role at TechCorp lacks numbers. Add metrics like revenue impact or user count." },
      { text: "Include <strong>GraphQL</strong> and <strong>Docker</strong> in your skills section — they appear in 80%+ of matching job descriptions." },
      { text: "Move education below experience — with 5+ years, experience should lead." },
      { text: "Add a <strong>projects section</strong> — it adds 22% more keyword coverage for ATS systems." },
    ],
  };
}

// ═══════════════════════════════════════════════════════════════════════════════
// COMPONENTS
// ═══════════════════════════════════════════════════════════════════════════════

function Navbar({ onLogin, onSignup, page, onLogo }) {
  return (
    <nav className="nav">
      <div className="nav-logo" onClick={onLogo}>
        Resume<span>AI</span>
      </div>
      {page === "home" && (
        <ul className="nav-links">
          <li><a onClick={() => document.getElementById("features")?.scrollIntoView({ behavior: "smooth" })}>Features</a></li>
          <li><a onClick={() => document.getElementById("how")?.scrollIntoView({ behavior: "smooth" })}>How it Works</a></li>
        </ul>
      )}
      <div className="nav-btns">
        <button className="btn btn-outline" onClick={onLogin}>Login</button>
        <button className="btn btn-primary" onClick={onSignup}>Sign Up</button>
      </div>
    </nav>
  );
}

// ── Auth Modal ────────────────────────────────────────────────────────────────
function AuthModal({ mode, onClose, onSuccess }) {
  const [tab, setTab] = useState(mode);
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });
  const [error, setError] = useState("");

  function handle(e) { setForm(f => ({ ...f, [e.target.name]: e.target.value })); }

  function submit(e) {
    e.preventDefault();
    setError("");
    if (tab === "signup") {
      if (!form.name.trim()) return setError("Name is required.");
      if (form.password !== form.confirm) return setError("Passwords don't match.");
      if (form.password.length < 6) return setError("Password must be at least 6 characters.");
    }
    if (!form.email.includes("@")) return setError("Enter a valid email.");
    if (!form.password) return setError("Password is required.");
    onSuccess({ name: form.name || form.email.split("@")[0], email: form.email });
  }

  return (
    <div className="overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="auth-card">
        <button className="auth-close" onClick={onClose}>✕</button>
        <div className="auth-logo">Resume<span>AI</span></div>
        <p className="auth-subtitle">{tab === "login" ? "Welcome back 👋" : "Create your account"}</p>

        <div className="auth-tabs">
          <button className={`auth-tab ${tab === "login" ? "active" : ""}`} onClick={() => setTab("login")}>Login</button>
          <button className={`auth-tab ${tab === "signup" ? "active" : ""}`} onClick={() => setTab("signup")}>Sign Up</button>
        </div>

        <form onSubmit={submit}>
          {tab === "signup" && (
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input className="form-input" name="name" value={form.name} onChange={handle} placeholder="Alex Johnson" />
            </div>
          )}
          <div className="form-group">
            <label className="form-label">Email</label>
            <input className="form-input" type="email" name="email" value={form.email} onChange={handle} placeholder="you@email.com" />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input className="form-input" type="password" name="password" value={form.password} onChange={handle} placeholder="••••••••" />
          </div>
          {tab === "signup" && (
            <div className="form-group">
              <label className="form-label">Confirm Password</label>
              <input className="form-input" type="password" name="confirm" value={form.confirm} onChange={handle} placeholder="••••••••" />
            </div>
          )}
          {error && <p style={{ color: "#ef4444", fontSize: ".82rem", marginBottom: ".75rem" }}>{error}</p>}
          <button type="submit" className="auth-submit">
            {tab === "login" ? "Login →" : "Create Account →"}
          </button>
        </form>

        <p className="auth-divider">{tab === "login" ? "Don't have an account? " : "Already have an account? "}
          <span style={{ color: "var(--g600)", cursor: "pointer", fontWeight: 600 }}
            onClick={() => setTab(tab === "login" ? "signup" : "login")}>
            {tab === "login" ? "Sign up" : "Login"}
          </span>
        </p>
      </div>
    </div>
  );
}

// ── Upload Dialog ─────────────────────────────────────────────────────────────
function UploadDialog({ onClose, onAnalyse }) {
  const [file, setFile] = useState(null);
  const [over, setOver] = useState(false);
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef();

  function pick(f) {
    if (!f) return;
    setFile(f);
    setProgress(0);
  }

  function onDrop(e) {
    e.preventDefault(); setOver(false);
    pick(e.dataTransfer.files[0]);
  }

  function simulate() {
    if (!file) return;
    setUploading(true);
    let p = 0;
    const t = setInterval(() => {
      p += Math.random() * 18;
      if (p >= 100) { p = 100; clearInterval(t); setTimeout(() => onAnalyse(file), 400); }
      setProgress(Math.min(Math.round(p), 100));
    }, 130);
  }

  return (
    <div className="overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="upload-card">
        <button className="auth-close" onClick={onClose}>✕</button>
        <h2>Upload your Resume</h2>
        <p className="sub">We'll extract and analyse every section.</p>

        <div
          className={`drop-zone ${over ? "over" : ""}`}
          onDragOver={e => { e.preventDefault(); setOver(true); }}
          onDragLeave={() => setOver(false)}
          onDrop={onDrop}
          onClick={() => !file && inputRef.current.click()}
        >
          <input ref={inputRef} type="file" accept=".pdf,.doc,.docx" style={{ display: "none" }}
            onChange={e => pick(e.target.files[0])} />

          {!file ? (
            <>
              <div className="drop-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
                  <polyline points="17 8 12 3 7 8"/>
                  <line x1="12" y1="3" x2="12" y2="15"/>
                </svg>
              </div>
              <h4>Drag & drop your resume here</h4>
              <p>or click to browse your files</p>
              <div className="drop-formats">
                <span className="drop-format">PDF</span>
                <span className="drop-format">DOC</span>
                <span className="drop-format">DOCX</span>
              </div>
            </>
          ) : (
            <div style={{ textAlign: "center" }}>
              <div className="drop-icon" style={{ background: "var(--g200)" }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="var(--g700)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 28, height: 28 }}>
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              </div>
              <h4 style={{ color: "var(--g700)" }}>File selected!</h4>
              <p style={{ color: "var(--muted)" }}>Click analyse to start</p>
            </div>
          )}
        </div>

        {file && (
          <div className="file-preview">
            <div className="file-ico">📄</div>
            <div className="file-info" style={{ flex: 1 }}>
              <p>{file.name}</p>
              <span>{fmtSize(file.size)}</span>
            </div>
            <button className="file-remove" onClick={() => { setFile(null); setProgress(0); setUploading(false); }}>✕</button>
          </div>
        )}

        {uploading && (
          <div className="upload-progress">
            <div className="progress-label">
              <span>Uploading…</span>
              <span className="pct">{progress}%</span>
            </div>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${progress}%` }} />
            </div>
          </div>
        )}

        {!uploading && (
          <div className="upload-actions">
            <button className="btn btn-outline" onClick={onClose} style={{ flex: 1, justifyContent: "center" }}>Cancel</button>
            <button
              className="btn btn-primary"
              style={{ flex: 2, justifyContent: "center", padding: ".8rem", fontSize: ".95rem" }}
              disabled={!file}
              onClick={simulate}
            >
              {file ? "Analyse Resume →" : "Select a file first"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Home Page ─────────────────────────────────────────────────────────────────
function HomePage({ onUploadClick }) {
  return (
    <>
      <section className="hero">
        <div className="hero-blob1" />
        <div className="hero-blob2" />
        <div className="hero-content">
          <div className="badge anim-1">
            <span className="badge-dot" />
            Smart Resume Analysis
          </div>
          <h1 className="anim-2">Land Your Dream Job<br />with <em>Smarter</em> Resumes</h1>
          <p className="anim-3">Get ATS scores, keyword insights, and bullet-point rewrites in seconds.</p>
          <button className="btn btn-primary btn-lg anim-4" onClick={onUploadClick}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
              <polyline points="17 8 12 3 7 8"/>
              <line x1="12" y1="3" x2="12" y2="15"/>
            </svg>
            Upload Resume
          </button>
        </div>
      </section>

      <section className="features" id="features">
        <p className="section-label">Core Features</p>
        <h2 className="section-title">Everything You Need to Stand Out</h2>
        <div className="cards-grid">
          {[
            { icon: "📊", title: "ATS Score", desc: "Instantly check how well your resume passes Applicant Tracking Systems. See exactly what recruiters see.", tag: "Compatibility" },
            { icon: "🎯", title: "Keyword Match", desc: "Find the missing keywords compared to any job description. Never miss a critical term again.", tag: "Gap Analysis" },
            { icon: "✨", title: "AI Rewrites", desc: "Transform weak bullet points into powerful, quantified achievements that get you interviews.", tag: "Smart Rewrites" },
            { icon: "🧠", title: "Skills Radar", desc: "Visualize your skill coverage and spot gaps before a recruiter does.", tag: "Skill Insights" },
          ].map(f => (
            <div className="feat-card" key={f.title}>
              <span className="feat-icon">{f.icon}</span>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
              <span className="feat-tag">{f.tag}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="hiw" id="how">
        <div className="hiw-inner">
          <div className="hiw-left">
            <p className="section-label">Process</p>
            <h2 className="section-title">How It Works</h2>
            <div className="steps">
              {[
                ["Upload Resume", "Drop your PDF or Word resume — our parser extracts every detail intelligently."],
                ["Paste Job Description", "Copy the job posting. We align your profile against the role requirements."],
                ["Get Analysis", "Receive your ATS score, missing keywords, and AI-generated rewrites within seconds."],
              ].map(([title, desc], i) => (
                <div className="step" key={i}>
                  <div className="step-num">{i + 1}</div>
                  <div className="step-content">
                    <h4>{title}</h4>
                    <p>{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="video-box">
            <button className="play-btn" onClick={onUploadClick}>
              <svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
            </button>
            <span>Try it now — Upload Resume</span>
          </div>
        </div>
      </section>

      <footer>© <span>2026 ResumeAI</span> — Built to help you land that job.</footer>
    </>
  );
}

// ── Dashboard ─────────────────────────────────────────────────────────────────
function Dashboard({ user, data, onBack, onNewUpload }) {
  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(true);

  useState(() => {
    const t = setTimeout(() => setLoading(false), 2200);
    return () => clearTimeout(t);
  });

  const pct = data.atsScore;

  const tabs = [
    { id: "overview", icon: "📊", label: "Overview" },
    { id: "keywords", icon: "🎯", label: "Keywords" },
    { id: "bullets", icon: "✨", label: "Rewrites" },
    { id: "skills", icon: "🧠", label: "Skills" },
    { id: "contact", icon: "👤", label: "Profile" },
    { id: "tips", icon: "💡", label: "Suggestions" },
  ];

  return (
    <div className="dash-layout">
      {/* Sidebar */}
      <aside className="sidebar">
        <div style={{ marginBottom: "1.5rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: ".75rem", padding: ".5rem .8rem" }}>
            <div style={{ width: 36, height: 36, borderRadius: "50%", background: "var(--g200)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: ".9rem", color: "var(--g800)", flexShrink: 0 }}>
              {user.name[0].toUpperCase()}
            </div>
            <div>
              <p style={{ fontSize: ".875rem", fontWeight: 700 }}>{user.name}</p>
              <p style={{ fontSize: ".72rem", color: "var(--muted)" }}>{user.email}</p>
            </div>
          </div>
        </div>

        <p className="sidebar-section">Analysis</p>
        {tabs.map(t => (
          <div key={t.id} className={`sidebar-item ${activeTab === t.id ? "active" : ""}`}
            onClick={() => setActiveTab(t.id)}>
            <span className="si-icon">{t.icon}</span>
            {t.label}
          </div>
        ))}

        <p className="sidebar-section">Actions</p>
        <div className="sidebar-item" onClick={onNewUpload}>
          <span className="si-icon">📤</span> New Upload
        </div>
        <div className="sidebar-item" onClick={onBack}>
          <span className="si-icon">←</span> Home
        </div>
      </aside>

      {/* Main */}
      <main className="dash-main">
        {loading ? (
          <div className="loading-state">
            <div className="spinner" />
            <h3>Analysing your resume…</h3>
            <p>Extracting skills, scoring ATS compatibility, and generating rewrites.</p>
          </div>
        ) : (
          <>
            <div className="dash-header">
              <h2>Resume Analysis</h2>
              <p>{data.filename} · {data.experience} experience · {data.education}</p>
            </div>

            {/* ATS Score Hero */}
            <div className="score-row" style={{ "--pct": pct }}>
              <div className="score-circle">
                <div className="score-inner">
                  <span className="score-num">{pct}</span>
                  <span className="score-of">/ 100</span>
                </div>
              </div>
              <div className="score-info">
                <h3>{data.title}</h3>
                <p>Your resume scores <strong style={{ color: "var(--g300)" }}>{pct}/100</strong> for ATS compatibility. You're matching {data.keywordsFound.length} of {data.keywordsFound.length + data.keywordsMissing.length} key skills. Add missing keywords to break into the top 15%.</p>
                <span className="score-grade">
                  {pct >= 80 ? "🟢 Excellent" : pct >= 60 ? "🟡 Good" : "🔴 Needs Work"}
                </span>
              </div>
            </div>

            {/* Tab Content */}
            {activeTab === "overview" && (
              <div className="analysis-grid">
                <div className="a-card">
                  <div className="a-card-header">
                    <div className="a-card-icon">📝</div>
                    <div><h4>Contact Extracted</h4><p className="a-sub">Parsed from your document</p></div>
                  </div>
                  {[
                    ["👤", data.name],
                    ["📧", data.email],
                    ["📞", data.phone],
                    ["📍", data.location],
                  ].map(([ico, val]) => (
                    <div className="contact-row" key={val}>
                      <span className="contact-ico">{ico}</span>
                      <span className="contact-val">{val}</span>
                    </div>
                  ))}
                </div>
                <div className="a-card">
                  <div className="a-card-header">
                    <div className="a-card-icon">📊</div>
                    <div><h4>Quick Stats</h4><p className="a-sub">At a glance</p></div>
                  </div>
                  {[
                    ["ATS Score", pct + " / 100"],
                    ["Keywords Found", data.keywordsFound.length + " keywords"],
                    ["Keywords Missing", data.keywordsMissing.length + " keywords"],
                    ["Experience", data.experience],
                  ].map(([label, val]) => (
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: ".5rem .8rem", background: "var(--g50)", borderRadius: 10, marginBottom: ".5rem" }} key={label}>
                      <span style={{ fontSize: ".85rem", color: "var(--muted)" }}>{label}</span>
                      <span style={{ fontSize: ".875rem", fontWeight: 700 }}>{val}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "keywords" && (
              <div className="analysis-grid">
                <div className="a-card">
                  <div className="a-card-header">
                    <div className="a-card-icon">✅</div>
                    <div><h4>Keywords Found</h4><p className="a-sub">{data.keywordsFound.length} matched</p></div>
                  </div>
                  <div className="pill-list">
                    {data.keywordsFound.map(k => (
                      <span className="pill pill-found" key={k}>
                        <span className="pill-dot" />{k}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="a-card">
                  <div className="a-card-header">
                    <div className="a-card-icon">❌</div>
                    <div><h4>Missing Keywords</h4><p className="a-sub">{data.keywordsMissing.length} to add</p></div>
                  </div>
                  <div className="pill-list">
                    {data.keywordsMissing.map(k => (
                      <span className="pill pill-miss" key={k}>
                        <span className="pill-dot" />{k}
                      </span>
                    ))}
                  </div>
                  <p style={{ fontSize: ".8rem", color: "var(--muted)", marginTop: "1rem", lineHeight: 1.6 }}>
                    Adding these keywords could increase your ATS score by <strong style={{ color: "var(--g600)" }}>~18 points</strong>.
                  </p>
                </div>
              </div>
            )}

            {activeTab === "bullets" && (
              <div className="a-card" style={{ maxWidth: 680 }}>
                <div className="a-card-header">
                  <div className="a-card-icon">✨</div>
                  <div><h4>Bullet Point Rewrites</h4><p className="a-sub">Weak bullets → quantified impact</p></div>
                </div>
                <div className="bullet-list">
                  {data.bullets.map((b, i) => (
                    <div className="bullet-item" key={i}>
                      <p className="bullet-original">✗ {b.original}</p>
                      <p className="bullet-arrow">↳ Improved</p>
                      <p className="bullet-new">✓ {b.improved}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "skills" && (
              <div className="a-card" style={{ maxWidth: 500 }}>
                <div className="a-card-header">
                  <div className="a-card-icon">🧠</div>
                  <div><h4>Skills Breakdown</h4><p className="a-sub">Coverage detected in your resume</p></div>
                </div>
                {data.skills.map(s => (
                  <div key={s.name} className="skill-row" style={{ display: "flex", alignItems: "center", gap: ".75rem", marginBottom: ".75rem" }}>
                    <span className="skill-name" style={{ fontSize: ".85rem", fontWeight: 600, width: 120, flexShrink: 0 }}>{s.name}</span>
                    <div className="skill-bar-bg" style={{ flex: 1, height: 8, background: "var(--g100)", borderRadius: 10, overflow: "hidden" }}>
                      <div className="skill-bar-fill" style={{ width: `${s.pct}%`, height: "100%", background: "var(--g400)", borderRadius: 10 }} />
                    </div>
                    <span className="skill-pct" style={{ fontSize: ".78rem", color: "var(--muted)", width: 36, textAlign: "right" }}>{s.pct}%</span>
                  </div>
                ))}
              </div>
            )}

            {activeTab === "contact" && (
              <div className="a-card" style={{ maxWidth: 480 }}>
                <div className="a-card-header">
                  <div className="a-card-icon">👤</div>
                  <div><h4>Profile Information</h4><p className="a-sub">Extracted from your resume</p></div>
                </div>
                {[
                  ["Name", data.name, "👤"],
                  ["Email", data.email, "📧"],
                  ["Phone", data.phone, "📞"],
                  ["Location", data.location, "📍"],
                  ["LinkedIn", data.linkedin, "🔗"],
                  ["Title", data.title, "💼"],
                  ["Experience", data.experience, "⏱️"],
                  ["Education", data.education, "🎓"],
                ].map(([label, val, ico]) => (
                  <div className="contact-row" key={label}>
                    <span className="contact-ico">{ico}</span>
                    <div>
                      <p className="contact-label">{label}</p>
                      <p className="contact-val">{val}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === "tips" && (
              <div className="a-card" style={{ maxWidth: 620 }}>
                <div className="a-card-header">
                  <div className="a-card-icon">💡</div>
                  <div><h4>Top Suggestions</h4><p className="a-sub">Prioritised improvements</p></div>
                </div>
                <div className="sugg-list">
                  {data.suggestions.map((s, i) => (
                    <div className="sugg-item" key={i}>
                      <div className="sugg-num">{i + 1}</div>
                      <p className="sugg-text" dangerouslySetInnerHTML={{ __html: s.text }} />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// APP ROOT
// ═══════════════════════════════════════════════════════════════════════════════
export default function App() {
  const [page, setPage] = useState("home"); // home | dashboard
  const [authModal, setAuthModal] = useState(null); // null | "login" | "signup"
  const [uploadOpen, setUploadOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [toast, setToast] = useState(null);

  function showToast(msg) {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  }

  function handleAuth(userData) {
    setUser(userData);
    setAuthModal(null);
    showToast(`✓ Welcome, ${userData.name}!`);
  }

  function handleUploadClick() {
    if (!user) { setAuthModal("signup"); return; }
    setUploadOpen(true);
  }

  function handleAnalyse(file) {
    setUploadOpen(false);
    const data = mockAnalysis(file.name);
    setAnalysis(data);
    setPage("dashboard");
  }

  return (
    <>
      <style>{css}</style>

      <Navbar
        onLogin={() => setAuthModal("login")}
        onSignup={() => setAuthModal("signup")}
        page={page}
        onLogo={() => setPage("home")}
      />

      {page === "home" && <HomePage onUploadClick={handleUploadClick} />}

      {page === "dashboard" && analysis && (
        <Dashboard
          user={user}
          data={analysis}
          onBack={() => setPage("home")}
          onNewUpload={() => setUploadOpen(true)}
        />
      )}

      {authModal && (
        <AuthModal
          mode={authModal}
          onClose={() => setAuthModal(null)}
          onSuccess={handleAuth}
        />
      )}

      {uploadOpen && (
        <UploadDialog
          onClose={() => setUploadOpen(false)}
          onAnalyse={handleAnalyse}
        />
      )}

      {toast && <div className="toast">{toast}</div>}
    </>
  );
}
