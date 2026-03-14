<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Memora — Memories That Move</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,600&family=Lora:ital,wght@0,400;0,500;1,400&family=DM+Mono:wght@400;500&display=swap" rel="stylesheet">

<style>
/* ─── TOKENS ─────────────────────────────────────────── */
:root {
  --ink:       #2C1A0F;
  --ink-soft:  #7A5C4A;
  --ink-muted: #A8896F;
  --paper:     #F9F4EE;
  --paper-2:   #EDE3D6;
  --paper-3:   #E2D4C4;
  --clay:      #C8845A;
  --clay-deep: #9B4F35;
  --rust:      #E07A52;
  --rust-dark: #B85530;
  --cream:     #FBF7F2;
  --sage:      #8B9E84;
  --shadow:    rgba(44,26,15,0.12);
  --glow:      rgba(200,132,90,0.18);
  --ff-display: 'Cormorant Garamond', Georgia, serif;
  --ff-body:    'Lora', Georgia, serif;
  --ff-mono:    'DM Mono', monospace;
  --ease-spring: cubic-bezier(0.34,1.56,0.64,1);
  --ease-out:    cubic-bezier(0.22,1,0.36,1);
}

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

html { scroll-behavior: smooth; overflow-x: hidden; }

body {
  background: var(--paper);
  color: var(--ink);
  font-family: var(--ff-body);
  font-size: 16px;
  line-height: 1.7;
  overflow-x: hidden;
}

/* ─── GRAIN OVERLAY ──────────────────────────────────── */
body::before {
  content: '';
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 9999;
  opacity: 0.032;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E");
  background-size: 200px 200px;
}

/* ─── LOADER ─────────────────────────────────────────── */
#loader {
  position: fixed; inset: 0; z-index: 9000;
  background: var(--paper);
  display: flex; align-items: center; justify-content: center;
  flex-direction: column; gap: 24px;
  transition: opacity 0.8s var(--ease-out), visibility 0.8s;
}
#loader.hidden { opacity: 0; visibility: hidden; pointer-events: none; }

.loader-film {
  width: 56px; height: 56px;
  border: 2.5px solid var(--paper-3);
  border-top-color: var(--clay);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }

.loader-text {
  font-family: var(--ff-display);
  font-size: 1.1rem;
  color: var(--ink-muted);
  letter-spacing: 0.15em;
  font-weight: 400;
  animation: pulse-text 1.5s ease-in-out infinite;
}
@keyframes pulse-text { 0%,100% { opacity: 0.5; } 50% { opacity: 1; } }

.loader-bar-wrap {
  width: 160px; height: 2px;
  background: var(--paper-3); border-radius: 1px; overflow: hidden;
}
.loader-bar {
  height: 100%; background: var(--clay);
  border-radius: 1px;
  animation: load-fill 1.6s var(--ease-out) forwards;
}
@keyframes load-fill { from { width: 0; } to { width: 100%; } }

/* ─── NAV ────────────────────────────────────────────── */
nav {
  position: fixed; top: 0; left: 0; right: 0; z-index: 100;
  padding: 20px 40px;
  display: flex; align-items: center; justify-content: space-between;
  transition: background 0.4s, box-shadow 0.4s, padding 0.4s;
}
nav.scrolled {
  background: rgba(249,244,238,0.92);
  backdrop-filter: blur(14px);
  box-shadow: 0 1px 0 var(--paper-3);
  padding: 14px 40px;
}
.nav-logo {
  font-family: var(--ff-display);
  font-size: 1.55rem;
  font-weight: 600;
  color: var(--ink);
  letter-spacing: -0.01em;
  text-decoration: none;
}
.nav-logo span { color: var(--clay); }

.nav-links {
  display: flex; gap: 36px; list-style: none; align-items: center;
}
.nav-links a {
  font-family: var(--ff-body);
  font-size: 0.875rem;
  color: var(--ink-soft);
  text-decoration: none;
  letter-spacing: 0.01em;
  position: relative;
  transition: color 0.25s;
}
.nav-links a::after {
  content: '';
  position: absolute; bottom: -3px; left: 0; right: 0; height: 1px;
  background: var(--clay);
  transform: scaleX(0); transform-origin: left;
  transition: transform 0.3s var(--ease-out);
}
.nav-links a:hover { color: var(--clay); }
.nav-links a:hover::after { transform: scaleX(1); }

.nav-cta {
  background: var(--ink);
  color: var(--paper) !important;
  padding: 10px 24px;
  border-radius: 100px;
  font-size: 0.85rem !important;
  transition: background 0.25s, transform 0.2s var(--ease-spring) !important;
}
.nav-cta:hover { background: var(--clay-deep) !important; transform: scale(1.04) !important; }
.nav-cta::after { display: none !important; }

.hamburger {
  display: none; flex-direction: column; gap: 5px;
  background: none; border: none; cursor: pointer; padding: 4px;
}
.hamburger span {
  display: block; width: 22px; height: 2px;
  background: var(--ink); border-radius: 2px;
  transition: all 0.3s;
}

/* ─── HERO ───────────────────────────────────────────── */
.hero {
  min-height: 100vh;
  display: flex; align-items: center;
  padding: 120px 40px 80px;
  position: relative; overflow: hidden;
}

.hero-bg {
  position: absolute; inset: 0; pointer-events: none;
  overflow: hidden;
}
.hero-circle {
  position: absolute;
  border-radius: 50%;
  background: radial-gradient(circle, var(--glow), transparent 70%);
}
.hero-circle-1 {
  width: 700px; height: 700px;
  top: -200px; right: -100px;
  animation: drift1 12s ease-in-out infinite;
}
.hero-circle-2 {
  width: 400px; height: 400px;
  bottom: -100px; left: -80px;
  animation: drift2 15s ease-in-out infinite;
}
@keyframes drift1 { 0%,100%{transform:translate(0,0) scale(1)} 50%{transform:translate(-30px,20px) scale(1.08)} }
@keyframes drift2 { 0%,100%{transform:translate(0,0) scale(1)} 50%{transform:translate(20px,-25px) scale(1.1)} }

/* Decorative scan lines */
.hero-scanlines {
  position: absolute; inset: 0;
  background: repeating-linear-gradient(
    0deg, transparent, transparent 3px,
    rgba(44,26,15,0.012) 3px, rgba(44,26,15,0.012) 4px
  );
  pointer-events: none;
}

.hero-inner {
  position: relative; z-index: 1;
  max-width: 1200px; margin: 0 auto; width: 100%;
  display: grid; grid-template-columns: 1fr 1fr; gap: 60px; align-items: center;
}

.hero-left {}

.hero-badge {
  display: inline-flex; align-items: center; gap: 8px;
  background: var(--paper-2);
  border: 1px solid var(--paper-3);
  padding: 6px 14px; border-radius: 100px;
  font-family: var(--ff-mono); font-size: 0.72rem;
  color: var(--ink-soft); letter-spacing: 0.08em;
  margin-bottom: 28px;
  opacity: 0; transform: translateY(16px);
  animation: reveal-up 0.7s 0.2s var(--ease-out) forwards;
}
.hero-badge-dot {
  width: 7px; height: 7px; border-radius: 50%;
  background: var(--sage);
  animation: badge-pulse 2s ease-in-out infinite;
}
@keyframes badge-pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.5;transform:scale(0.85)} }

.hero-h1 {
  font-family: var(--ff-display);
  font-size: clamp(3.2rem, 6vw, 5.2rem);
  line-height: 1.08;
  font-weight: 600;
  letter-spacing: -0.02em;
  color: var(--ink);
  margin-bottom: 24px;
  opacity: 0; transform: translateY(24px);
  animation: reveal-up 0.9s 0.35s var(--ease-out) forwards;
}
.hero-h1 em {
  font-style: italic;
  color: var(--clay);
  position: relative;
}
.hero-h1 em::after {
  content: '';
  position: absolute; left: 0; right: 0;
  bottom: 2px; height: 3px;
  background: var(--clay);
  opacity: 0.3; border-radius: 2px;
}

.hero-sub {
  font-size: 1.05rem; color: var(--ink-soft);
  line-height: 1.75; max-width: 420px;
  margin-bottom: 40px;
  opacity: 0; transform: translateY(20px);
  animation: reveal-up 0.9s 0.5s var(--ease-out) forwards;
}

.hero-actions {
  display: flex; gap: 16px; flex-wrap: wrap; align-items: center;
  opacity: 0; transform: translateY(20px);
  animation: reveal-up 0.9s 0.65s var(--ease-out) forwards;
}

.btn-primary {
  display: inline-flex; align-items: center; gap: 10px;
  background: var(--ink);
  color: var(--paper);
  padding: 15px 32px;
  border-radius: 100px;
  font-family: var(--ff-body);
  font-size: 0.95rem; font-weight: 500;
  text-decoration: none;
  border: none; cursor: pointer;
  position: relative; overflow: hidden;
  transition: transform 0.25s var(--ease-spring), box-shadow 0.3s;
  box-shadow: 0 4px 20px rgba(44,26,15,0.18);
}
.btn-primary::before {
  content: '';
  position: absolute; inset: 0;
  background: var(--clay-deep);
  transform: translateX(-101%);
  transition: transform 0.4s var(--ease-out);
}
.btn-primary:hover { transform: scale(1.03) translateY(-1px); box-shadow: 0 8px 28px rgba(44,26,15,0.22); }
.btn-primary:hover::before { transform: translateX(0); }
.btn-primary span { position: relative; z-index: 1; }
.btn-primary .arrow { position: relative; z-index: 1; transition: transform 0.25s var(--ease-spring); }
.btn-primary:hover .arrow { transform: translateX(4px); }

.btn-ghost {
  display: inline-flex; align-items: center; gap: 10px;
  background: transparent;
  color: var(--ink-soft);
  padding: 15px 24px;
  border-radius: 100px;
  font-size: 0.9rem;
  text-decoration: none;
  border: 1.5px solid var(--paper-3);
  cursor: pointer;
  transition: color 0.25s, border-color 0.25s, background 0.25s;
}
.btn-ghost:hover {
  color: var(--clay-deep);
  border-color: var(--clay);
  background: var(--paper-2);
}

.hero-stats {
  display: flex; gap: 32px; margin-top: 48px;
  opacity: 0; transform: translateY(16px);
  animation: reveal-up 0.9s 0.8s var(--ease-out) forwards;
}
.stat-item {}
.stat-num {
  font-family: var(--ff-display);
  font-size: 1.8rem; font-weight: 600;
  color: var(--ink); line-height: 1;
  margin-bottom: 4px;
}
.stat-label {
  font-family: var(--ff-mono); font-size: 0.7rem;
  color: var(--ink-muted); letter-spacing: 0.08em;
  text-transform: uppercase;
}

/* ─── HERO RIGHT: FLOATING PHOTO CARDS ──────────────── */
.hero-right {
  position: relative; height: 520px;
  opacity: 0; animation: reveal-fade 1.2s 0.5s var(--ease-out) forwards;
}

.photo-card {
  position: absolute;
  background: white;
  border-radius: 16px;
  box-shadow: 0 20px 60px rgba(44,26,15,0.14), 0 4px 16px rgba(44,26,15,0.08);
  overflow: hidden;
  transition: transform 0.4s var(--ease-spring), box-shadow 0.4s;
  transform-style: preserve-3d;
}
.photo-card:hover {
  box-shadow: 0 32px 80px rgba(44,26,15,0.2), 0 8px 24px rgba(44,26,15,0.1);
}

.card-1 {
  width: 220px; height: 270px;
  top: 30px; left: 20px;
  transform: rotate(-4deg);
  animation: float-1 6s ease-in-out infinite;
  z-index: 2;
}
.card-2 {
  width: 200px; height: 240px;
  top: 60px; right: 30px;
  transform: rotate(3.5deg);
  animation: float-2 7s ease-in-out infinite;
  z-index: 3;
}
.card-3 {
  width: 230px; height: 260px;
  bottom: 20px; left: 60px;
  transform: rotate(1.5deg);
  animation: float-3 8s ease-in-out infinite;
  z-index: 1;
}

@keyframes float-1 { 0%,100%{transform:rotate(-4deg) translateY(0)} 50%{transform:rotate(-4deg) translateY(-16px)} }
@keyframes float-2 { 0%,100%{transform:rotate(3.5deg) translateY(0)} 50%{transform:rotate(3.5deg) translateY(-12px)} }
@keyframes float-3 { 0%,100%{transform:rotate(1.5deg) translateY(0)} 50%{transform:rotate(1.5deg) translateY(-10px)} }

.card-photo {
  width: 100%; height: 76%;
  object-fit: cover;
  display: block;
}
.card-photo-placeholder {
  width: 100%; height: 76%;
  display: flex; align-items: center; justify-content: center;
  font-size: 2.5rem;
  background: var(--paper-2);
}
.card-meta {
  padding: 10px 14px;
  background: white;
}
.card-date {
  font-family: var(--ff-mono); font-size: 0.65rem;
  color: var(--ink-muted); letter-spacing: 0.06em;
}
.card-title-small {
  font-family: var(--ff-display); font-size: 0.95rem;
  color: var(--ink); margin-top: 2px;
}

/* AR overlay badge */
.ar-badge {
  position: absolute; top: 12px; right: 12px;
  background: rgba(200,132,90,0.92);
  color: white;
  font-family: var(--ff-mono); font-size: 0.6rem;
  padding: 4px 8px; border-radius: 6px;
  letter-spacing: 0.06em;
  animation: ar-glow 2.5s ease-in-out infinite;
}
@keyframes ar-glow {
  0%,100%{ background: rgba(200,132,90,0.92); }
  50%{ background: rgba(155,79,53,0.95); }
}

.qr-badge {
  position: absolute; bottom: 68px; right: 12px;
  width: 40px; height: 40px;
  background: white;
  border-radius: 8px;
  display: flex; align-items: center; justify-content: center;
  box-shadow: 0 2px 8px rgba(44,26,15,0.14);
  font-size: 1.2rem;
}

/* Play ripple on card-2 */
.play-overlay {
  position: absolute;
  top: 50%; left: 50%;
  transform: translate(-50%, -50%);
  width: 48px; height: 48px;
  background: rgba(255,255,255,0.88);
  border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  font-size: 1.1rem;
  pointer-events: none;
}
.play-ripple {
  position: absolute; inset: -10px;
  border: 2px solid rgba(255,255,255,0.5);
  border-radius: 50%;
  animation: ripple 2s ease-out infinite;
}
.play-ripple-2 {
  position: absolute; inset: -20px;
  border: 2px solid rgba(255,255,255,0.25);
  border-radius: 50%;
  animation: ripple 2s 0.6s ease-out infinite;
}
@keyframes ripple { 0%{opacity:1;transform:scale(0.9)} 100%{opacity:0;transform:scale(1.5)} }

/* ─── SECTION COMMONS ────────────────────────────────── */
section { padding: 100px 40px; position: relative; }
.section-inner { max-width: 1200px; margin: 0 auto; }

.section-eyebrow {
  font-family: var(--ff-mono); font-size: 0.72rem;
  color: var(--clay); letter-spacing: 0.14em;
  text-transform: uppercase; margin-bottom: 16px;
  display: block;
}
.section-title {
  font-family: var(--ff-display);
  font-size: clamp(2.2rem, 4vw, 3.4rem);
  font-weight: 600; line-height: 1.15;
  letter-spacing: -0.02em;
  color: var(--ink); margin-bottom: 20px;
}
.section-title em { font-style: italic; color: var(--clay); }
.section-sub {
  font-size: 1rem; color: var(--ink-soft);
  max-width: 520px; line-height: 1.75;
}

/* ─── REVEAL ANIMATIONS ──────────────────────────────── */
@keyframes reveal-up {
  from { opacity: 0; transform: translateY(24px); }
  to   { opacity: 1; transform: translateY(0); }
}
@keyframes reveal-fade {
  from { opacity: 0; }
  to   { opacity: 1; }
}

.reveal {
  opacity: 0; transform: translateY(32px);
  transition: opacity 0.8s var(--ease-out), transform 0.8s var(--ease-out);
}
.reveal.in-view { opacity: 1; transform: translateY(0); }
.reveal-delay-1 { transition-delay: 0.1s; }
.reveal-delay-2 { transition-delay: 0.2s; }
.reveal-delay-3 { transition-delay: 0.3s; }
.reveal-delay-4 { transition-delay: 0.4s; }
.reveal-scale {
  opacity: 0; transform: scale(0.93);
  transition: opacity 0.7s var(--ease-out), transform 0.7s var(--ease-spring);
}
.reveal-scale.in-view { opacity: 1; transform: scale(1); }

/* ─── HOW IT WORKS ───────────────────────────────────── */
.how-section { background: var(--cream); }

.how-steps {
  display: grid; grid-template-columns: repeat(4,1fr); gap: 2px;
  margin-top: 64px; position: relative;
}
.how-steps::before {
  content: '';
  position: absolute; top: 40px; left: 12.5%; right: 12.5%; height: 1px;
  background: linear-gradient(90deg, transparent, var(--paper-3), var(--clay), var(--paper-3), transparent);
}

.how-step {
  background: var(--cream); padding: 32px 24px 36px;
  text-align: center; position: relative;
  transition: transform 0.3s var(--ease-spring);
}
.how-step:hover { transform: translateY(-6px); }

.step-num {
  width: 56px; height: 56px; margin: 0 auto 24px;
  background: white;
  border: 2px solid var(--paper-3);
  border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  font-family: var(--ff-display); font-size: 1.35rem; font-weight: 600;
  color: var(--clay);
  position: relative;
  transition: border-color 0.3s, background 0.3s;
  z-index: 1;
}
.how-step:hover .step-num {
  background: var(--clay); color: white; border-color: var(--clay);
}
.step-icon { font-size: 1.2rem; margin-bottom: 16px; }
.step-title {
  font-family: var(--ff-display); font-size: 1.2rem; font-weight: 600;
  color: var(--ink); margin-bottom: 10px;
}
.step-desc {
  font-size: 0.9rem; color: var(--ink-soft); line-height: 1.65;
}

/* ─── FEATURES ───────────────────────────────────────── */
.features-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px; margin-top: 60px;
}

.feat-card {
  background: white;
  border: 1px solid var(--paper-3);
  border-radius: 20px;
  padding: 36px 32px;
  position: relative; overflow: hidden;
  transition: transform 0.35s var(--ease-spring), box-shadow 0.35s, border-color 0.3s;
  cursor: default;
}
.feat-card::before {
  content: '';
  position: absolute; inset: 0;
  background: linear-gradient(135deg, var(--glow), transparent 60%);
  opacity: 0;
  transition: opacity 0.4s;
}
.feat-card:hover {
  transform: translateY(-8px) scale(1.01);
  box-shadow: 0 24px 56px rgba(44,26,15,0.1);
  border-color: var(--clay);
}
.feat-card:hover::before { opacity: 1; }

/* large feature card */
.feat-card.large { grid-column: span 2; }
.feat-card.tall { grid-row: span 2; }

.feat-icon {
  width: 48px; height: 48px;
  background: var(--paper-2);
  border-radius: 14px;
  display: flex; align-items: center; justify-content: center;
  font-size: 1.4rem; margin-bottom: 20px;
  transition: background 0.3s, transform 0.3s var(--ease-spring);
}
.feat-card:hover .feat-icon {
  background: var(--clay); transform: scale(1.1) rotate(-4deg);
}

.feat-title {
  font-family: var(--ff-display); font-size: 1.25rem;
  font-weight: 600; color: var(--ink); margin-bottom: 10px;
}
.feat-desc { font-size: 0.9rem; color: var(--ink-soft); line-height: 1.7; }

.feat-tag {
  display: inline-block; margin-top: 16px;
  font-family: var(--ff-mono); font-size: 0.65rem;
  background: var(--paper-2); color: var(--clay);
  padding: 4px 10px; border-radius: 100px; letter-spacing: 0.08em;
}

/* ─── USE CASES ──────────────────────────────────────── */
.usecases-section { background: var(--paper-2); }

.usecases-grid {
  display: grid; grid-template-columns: repeat(3, 1fr);
  gap: 16px; margin-top: 56px;
}
.usecase-card {
  background: var(--paper);
  border-radius: 18px;
  padding: 32px 28px;
  transition: transform 0.3s var(--ease-spring), box-shadow 0.3s;
  border: 1px solid transparent;
}
.usecase-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 16px 48px rgba(44,26,15,0.1);
  border-color: var(--paper-3);
}
.usecase-emoji { font-size: 2.2rem; margin-bottom: 16px; display: block; }
.usecase-title {
  font-family: var(--ff-display); font-size: 1.15rem; font-weight: 600;
  color: var(--ink); margin-bottom: 8px;
}
.usecase-desc { font-size: 0.88rem; color: var(--ink-soft); line-height: 1.7; }

/* ─── TESTIMONIALS ───────────────────────────────────── */
.testimonials-section {}
.testimonials-inner { text-align: center; }
.testimonials-grid {
  display: grid; grid-template-columns: repeat(3, 1fr);
  gap: 20px; margin-top: 56px; text-align: left;
}
.testi-card {
  background: var(--paper-2);
  border-radius: 20px; padding: 32px;
  position: relative;
  transition: transform 0.3s var(--ease-spring);
}
.testi-card:hover { transform: translateY(-4px); }
.testi-quote {
  font-family: var(--ff-display);
  font-size: 1.05rem; line-height: 1.75;
  color: var(--ink);
  margin-bottom: 24px;
  font-style: italic;
}
.testi-marks {
  font-family: var(--ff-display); font-size: 3.5rem;
  color: var(--clay); opacity: 0.3; line-height: 1;
  margin-bottom: 8px; display: block;
}
.testi-author {
  display: flex; gap: 12px; align-items: center;
}
.testi-avatar {
  width: 40px; height: 40px; border-radius: 50%;
  background: var(--paper-3);
  display: flex; align-items: center; justify-content: center;
  font-size: 1.2rem; flex-shrink: 0;
}
.testi-name {
  font-family: var(--ff-body); font-size: 0.9rem; font-weight: 500;
  color: var(--ink);
}
.testi-role {
  font-family: var(--ff-mono); font-size: 0.68rem;
  color: var(--ink-muted); letter-spacing: 0.06em;
}

/* ─── CTA SECTION ────────────────────────────────────── */
.cta-section {
  background: var(--ink);
  color: var(--paper);
  text-align: center;
  padding: 120px 40px;
  position: relative; overflow: hidden;
}
.cta-section::before {
  content: '';
  position: absolute; inset: 0;
  background: radial-gradient(ellipse 70% 60% at 50% 50%, rgba(200,132,90,0.15), transparent);
}
.cta-inner { position: relative; z-index: 1; }
.cta-eyebrow {
  font-family: var(--ff-mono); font-size: 0.72rem;
  color: var(--clay); letter-spacing: 0.14em;
  text-transform: uppercase; margin-bottom: 20px;
  display: block;
}
.cta-title {
  font-family: var(--ff-display);
  font-size: clamp(2.8rem, 5vw, 4.5rem);
  font-weight: 600; line-height: 1.1;
  letter-spacing: -0.02em;
  color: var(--paper); margin-bottom: 20px;
}
.cta-title em { font-style: italic; color: var(--clay); }
.cta-sub {
  font-size: 1rem; color: rgba(249,244,238,0.65);
  max-width: 440px; margin: 0 auto 40px; line-height: 1.75;
}
.cta-actions { display: flex; gap: 16px; justify-content: center; flex-wrap: wrap; }
.btn-light {
  display: inline-flex; align-items: center; gap: 10px;
  background: var(--paper); color: var(--ink);
  padding: 15px 36px; border-radius: 100px;
  font-family: var(--ff-body); font-size: 0.95rem; font-weight: 500;
  text-decoration: none; border: none; cursor: pointer;
  transition: transform 0.25s var(--ease-spring), background 0.25s, box-shadow 0.3s;
  box-shadow: 0 4px 20px rgba(0,0,0,0.2);
}
.btn-light:hover {
  transform: scale(1.04) translateY(-1px);
  background: var(--paper-2);
  box-shadow: 0 8px 30px rgba(0,0,0,0.3);
}
.btn-outline-light {
  display: inline-flex; align-items: center; gap: 10px;
  background: transparent; color: rgba(249,244,238,0.8);
  padding: 15px 28px; border-radius: 100px;
  font-size: 0.9rem;
  text-decoration: none; border: 1.5px solid rgba(249,244,238,0.25);
  cursor: pointer;
  transition: color 0.25s, border-color 0.25s;
}
.btn-outline-light:hover { color: var(--clay); border-color: var(--clay); }

/* floating text deco */
.cta-deco {
  position: absolute;
  font-family: var(--ff-display);
  font-size: 16rem; font-weight: 700;
  color: rgba(249,244,238,0.02);
  line-height: 1; user-select: none; pointer-events: none;
  letter-spacing: -0.04em;
  white-space: nowrap;
}
.cta-deco-1 { top: -40px; left: -60px; }
.cta-deco-2 { bottom: -60px; right: -40px; }

/* ─── FOOTER ─────────────────────────────────────────── */
footer {
  background: var(--ink);
  border-top: 1px solid rgba(249,244,238,0.08);
  padding: 60px 40px 40px;
  color: rgba(249,244,238,0.5);
}
.footer-inner {
  max-width: 1200px; margin: 0 auto;
  display: flex; justify-content: space-between; align-items: flex-end;
  flex-wrap: wrap; gap: 32px;
}
.footer-logo {
  font-family: var(--ff-display); font-size: 1.4rem; font-weight: 600;
  color: var(--paper);
}
.footer-logo span { color: var(--clay); }
.footer-tagline {
  font-size: 0.85rem; margin-top: 6px; color: rgba(249,244,238,0.4);
  font-style: italic;
}
.footer-links {
  display: flex; gap: 28px; flex-wrap: wrap; list-style: none;
}
.footer-links a {
  font-size: 0.85rem; color: rgba(249,244,238,0.45);
  text-decoration: none;
  transition: color 0.25s;
}
.footer-links a:hover { color: var(--clay); }
.footer-copy {
  width: 100%; font-family: var(--ff-mono); font-size: 0.68rem;
  letter-spacing: 0.06em; color: rgba(249,244,238,0.25);
  padding-top: 32px; margin-top: 20px;
  border-top: 1px solid rgba(249,244,238,0.06);
  text-align: center;
}

/* ─── PARALLAX BG TEXT ───────────────────────────────── */
.parallax-text {
  position: absolute; z-index: 0;
  font-family: var(--ff-display);
  font-size: 22vw; font-weight: 700;
  color: var(--paper-2); opacity: 0.5;
  line-height: 1; user-select: none; pointer-events: none;
  letter-spacing: -0.04em; white-space: nowrap;
  will-change: transform;
}

/* ─── SCROLL PROGRESS ────────────────────────────────── */
.scroll-progress {
  position: fixed; top: 0; left: 0; right: 0; z-index: 200;
  height: 2.5px;
  background: linear-gradient(90deg, var(--clay), var(--rust));
  transform-origin: left;
  transform: scaleX(0);
  transition: transform 0.1s linear;
}

/* ─── RESPONSIVE ─────────────────────────────────────── */
@media (max-width: 960px) {
  nav { padding: 16px 24px; }
  nav.scrolled { padding: 12px 24px; }
  .nav-links { display: none; }
  .hamburger { display: flex; }
  section { padding: 80px 24px; }
  .hero { padding: 100px 24px 60px; }
  .hero-inner { grid-template-columns: 1fr; gap: 40px; }
  .hero-right { height: 360px; }
  .card-1 { width: 170px; height: 210px; left: 0; }
  .card-2 { width: 160px; height: 190px; right: 0; }
  .card-3 { width: 175px; height: 200px; left: 40px; }
  .hero-stats { gap: 24px; }
  .how-steps { grid-template-columns: repeat(2,1fr); }
  .how-steps::before { display: none; }
  .features-grid { grid-template-columns: 1fr 1fr; }
  .feat-card.large { grid-column: span 1; }
  .usecases-grid { grid-template-columns: 1fr 1fr; }
  .testimonials-grid { grid-template-columns: 1fr; }
}
@media (max-width: 600px) {
  .hero-h1 { font-size: 2.8rem; }
  .how-steps { grid-template-columns: 1fr; }
  .features-grid { grid-template-columns: 1fr; }
  .feat-card.large, .feat-card.tall { grid-column: span 1; grid-row: span 1; }
  .usecases-grid { grid-template-columns: 1fr; }
  .hero-actions { flex-direction: column; }
  .btn-primary, .btn-ghost { width: 100%; justify-content: center; }
  .cta-actions { flex-direction: column; align-items: center; }
  .footer-inner { flex-direction: column; align-items: flex-start; }
}

/* ─── MOBILE NAV OVERLAY ─────────────────────────────── */
.mobile-nav {
  position: fixed; inset: 0; z-index: 500;
  background: rgba(249,244,238,0.97);
  backdrop-filter: blur(20px);
  display: flex; align-items: center; justify-content: center;
  flex-direction: column; gap: 32px;
  opacity: 0; visibility: hidden;
  transition: opacity 0.3s, visibility 0.3s;
}
.mobile-nav.open { opacity: 1; visibility: visible; }
.mobile-nav a {
  font-family: var(--ff-display); font-size: 2.2rem; font-weight: 500;
  color: var(--ink); text-decoration: none;
  transition: color 0.2s;
}
.mobile-nav a:hover { color: var(--clay); }
.mobile-nav-close {
  position: absolute; top: 24px; right: 24px;
  background: none; border: none; cursor: pointer;
  font-size: 1.5rem; color: var(--ink);
}

/* ─── COUNTER ANIMATION ──────────────────────────────── */
.count-up { display: inline-block; }

/* ─── CARD TILT ──────────────────────────────────────── */
.photo-card { transform-style: preserve-3d; }

/* ─── SEPARATOR ──────────────────────────────────────── */
.sep {
  display: inline-block; width: 40px; height: 1.5px;
  background: var(--clay); border-radius: 1px;
  margin: 0 16px; vertical-align: middle;
}
</style>
</head>
<body>

<!-- Scroll progress -->
<div class="scroll-progress" id="scrollProgress"></div>

<!-- Loader -->
<div id="loader">
  <div style="font-family:'Cormorant Garamond',serif; font-size:2rem; font-weight:600; color:#2C1A0F; letter-spacing:-0.01em;">
    Memo<span style="color:#C8845A">ra</span>
  </div>
  <div class="loader-film"></div>
  <div class="loader-bar-wrap"><div class="loader-bar"></div></div>
  <div class="loader-text">developing your memories…</div>
</div>

<!-- Mobile Nav -->
<div class="mobile-nav" id="mobileNav">
  <button class="mobile-nav-close" id="mobileClose">✕</button>
  <a href="#how">How it Works</a>
  <a href="#features">Features</a>
  <a href="#usecases">Use Cases</a>
  <a href="#cta" style="color:#C8845A">Get Started →</a>
</div>

<!-- NAV -->
<nav id="mainNav">
  <a href="#" class="nav-logo">Memo<span>ra</span></a>
  <ul class="nav-links">
    <li><a href="#how">How it Works</a></li>
    <li><a href="#features">Features</a></li>
    <li><a href="#usecases">Use Cases</a></li>
    <li><a href="#cta" class="nav-cta">Start Creating</a></li>
  </ul>
  <button class="hamburger" id="hamburger">
    <span></span><span></span><span></span>
  </button>
</nav>

<!-- ── HERO ─────────────────────────────────────────── -->
<section class="hero" id="hero">
  <div class="hero-bg">
    <div class="hero-circle hero-circle-1"></div>
    <div class="hero-circle hero-circle-2"></div>
    <div class="hero-scanlines"></div>
  </div>
  <div class="hero-inner">
    <div class="hero-left">
      <div class="hero-badge">
        <span class="hero-badge-dot"></span>
        WebAR · No App Required · Instant Experience
      </div>
      <h1 class="hero-h1">
        Your photos<br>
        deserve to <em>breathe</em>
      </h1>
      <p class="hero-sub">
        Memora transforms printed photo cards into living memories. Point a phone — watch the moment play back to life.
      </p>
      <div class="hero-actions">
        <a href="#cta" class="btn-primary">
          <span>Create Your First Card</span>
          <span class="arrow">→</span>
        </a>
        <a href="#how" class="btn-ghost">See how it works</a>
      </div>
      <div class="hero-stats">
        <div class="stat-item">
          <div class="stat-num"><span class="count-up" data-target="2400">0</span>+</div>
          <div class="stat-label">Cards Created</div>
        </div>
        <div class="stat-item">
          <div class="stat-num"><span class="count-up" data-target="18">0</span>K+</div>
          <div class="stat-label">Memories Scanned</div>
        </div>
        <div class="stat-item">
          <div class="stat-num"><span class="count-up" data-target="98">0</span>%</div>
          <div class="stat-label">No-App Success Rate</div>
        </div>
      </div>
    </div>
    <div class="hero-right">
      <!-- Card 1 -->
      <div class="photo-card card-1" id="card1">
        <div class="card-photo-placeholder">🌸</div>
        <div class="ar-badge">▶ AR LIVE</div>
        <div class="card-meta">
          <div class="card-date">MARCH 2024</div>
          <div class="card-title-small">Our First Dance</div>
        </div>
      </div>
      <!-- Card 2 -->
      <div class="photo-card card-2" id="card2">
        <div class="card-photo-placeholder">🎂</div>
        <div class="play-overlay">
          ▶
          <div class="play-ripple"></div>
          <div class="play-ripple-2"></div>
        </div>
        <div class="qr-badge">⬛</div>
        <div class="card-meta">
          <div class="card-date">JULY 2023</div>
          <div class="card-title-small">Sweet 16</div>
        </div>
      </div>
      <!-- Card 3 -->
      <div class="photo-card card-3" id="card3">
        <div class="card-photo-placeholder">🌅</div>
        <div class="card-meta">
          <div class="card-date">DEC 2023</div>
          <div class="card-title-small">Golden Hour</div>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- ── HOW IT WORKS ──────────────────────────────────── -->
<section class="how-section" id="how">
  <div class="parallax-text" data-parallax="0.15">Story</div>
  <div class="section-inner" style="position:relative;z-index:1;">
    <div class="reveal" style="text-align:center; margin-bottom:8px;">
      <span class="section-eyebrow">The Process</span>
    </div>
    <h2 class="section-title reveal" style="text-align:center; margin: 0 auto 12px;">
      Four steps to a<br><em>living memory</em>
    </h2>
    <p class="section-sub reveal" style="margin:0 auto; text-align:center;">
      From upload to experience in under three minutes. No technical knowledge required.
    </p>
    <div class="how-steps">
      <div class="how-step reveal reveal-delay-1">
        <div class="step-num">01</div>
        <div class="step-icon">📷</div>
        <div class="step-title">Upload Your Photo</div>
        <p class="step-desc">Drop your favourite photo into Memora. We accept any JPEG or PNG — wedding portraits, birthday snaps, travel stills.</p>
      </div>
      <div class="how-step reveal reveal-delay-2">
        <div class="step-num">02</div>
        <div class="step-icon">🎬</div>
        <div class="step-title">Attach a Memory</div>
        <p class="step-desc">Pair it with a video, voice note, GIF, or audio message. The emotion behind the photo, now embedded in it.</p>
      </div>
      <div class="how-step reveal reveal-delay-3">
        <div class="step-num">03</div>
        <div class="step-icon">✨</div>
        <div class="step-title">Get Your Memora Card</div>
        <p class="step-desc">We generate a Magic Card with a QR code — ready to print, share digitally, or gift at any occasion.</p>
      </div>
      <div class="how-step reveal reveal-delay-4">
        <div class="step-num">04</div>
        <div class="step-icon">📱</div>
        <div class="step-title">Scan &amp; Experience</div>
        <p class="step-desc">Recipient scans. Phone camera recognises the photo. The memory plays live, overlaid in real time. No app. No friction.</p>
      </div>
    </div>
  </div>
</section>

<!-- ── FEATURES ──────────────────────────────────────── -->
<section id="features" style="background: var(--paper);">
  <div class="section-inner">
    <span class="section-eyebrow reveal">What Makes Memora Different</span>
    <h2 class="section-title reveal">Built around the <em>emotion</em>,<br>not the technology</h2>
    <div class="features-grid">
      <div class="feat-card large reveal reveal-delay-1">
        <div class="feat-icon">🌐</div>
        <div class="feat-title">App-Free WebAR</div>
        <p class="feat-desc">The entire AR experience runs in any smartphone browser. No Play Store. No App Store. No download prompt. Point, scan, feel — that's the whole journey.</p>
        <span class="feat-tag">INSTANT ACCESS</span>
      </div>
      <div class="feat-card reveal reveal-delay-2">
        <div class="feat-icon">🔒</div>
        <div class="feat-title">Private by Default</div>
        <p class="feat-desc">Cards can be public or locked. Your memories are yours.</p>
        <span class="feat-tag">SECURE</span>
      </div>
      <div class="feat-card reveal reveal-delay-1">
        <div class="feat-icon">🎞️</div>
        <div class="feat-title">Multi-Media Support</div>
        <p class="feat-desc">Video, GIF, audio, or voice note — any format, any emotion, one card.</p>
        <span class="feat-tag">VERSATILE</span>
      </div>
      <div class="feat-card reveal reveal-delay-2">
        <div class="feat-icon">⚡</div>
        <div class="feat-title">2-Second Recognition</div>
        <p class="feat-desc">MindAR's image tracking identifies your photo and fires the overlay within moments of pointing the camera.</p>
        <span class="feat-tag">INSTANT</span>
      </div>
      <div class="feat-card reveal reveal-delay-3">
        <div class="feat-icon">📊</div>
        <div class="feat-title">Scan Analytics</div>
        <p class="feat-desc">See when, where, and how often your card has been experienced. Every scan tells you someone cared enough to look again.</p>
        <span class="feat-tag">INSIGHTS</span>
      </div>
      <div class="feat-card reveal reveal-delay-1">
        <div class="feat-icon">🎁</div>
        <div class="feat-title">Print-Ready QR</div>
        <p class="feat-desc">Download a high-res 300 DPI QR code alongside your card. Paste it onto print invitations, gifts, or packaging.</p>
        <span class="feat-tag">PRINT READY</span>
      </div>
    </div>
  </div>
</section>

<!-- ── USE CASES ─────────────────────────────────────── -->
<section class="usecases-section" id="usecases">
  <div class="section-inner">
    <span class="section-eyebrow reveal">Where Memora Lives</span>
    <h2 class="section-title reveal">Every occasion deserves<br>a <em>living</em> keepsake</h2>
    <div class="usecases-grid">
      <div class="usecase-card reveal reveal-delay-1">
        <span class="usecase-emoji">💍</span>
        <div class="usecase-title">Weddings</div>
        <p class="usecase-desc">Attach the proposal video to your invitation. Let guests scan the table card and watch you both relive it.</p>
      </div>
      <div class="usecase-card reveal reveal-delay-2">
        <span class="usecase-emoji">🎂</span>
        <div class="usecase-title">Birthday Cards</div>
        <p class="usecase-desc">Turn a birthday card into a surprise video message from everyone who loves them.</p>
      </div>
      <div class="usecase-card reveal reveal-delay-3">
        <span class="usecase-emoji">🎓</span>
        <div class="usecase-title">Graduation</div>
        <p class="usecase-desc">A proud parent moment, a teacher's message, a whole journey — embedded in a single photo.</p>
      </div>
      <div class="usecase-card reveal reveal-delay-1">
        <span class="usecase-emoji">🏛️</span>
        <div class="usecase-title">Museums & Exhibits</div>
        <p class="usecase-desc">Bring artefacts to life with audio narration and archival footage, no app required for visitors.</p>
      </div>
      <div class="usecase-card reveal reveal-delay-2">
        <span class="usecase-emoji">📦</span>
        <div class="usecase-title">Brand Packaging</div>
        <p class="usecase-desc">Product packaging that plays a founder story or tutorial when scanned. Marketing that stays.</p>
      </div>
      <div class="usecase-card reveal reveal-delay-3">
        <span class="usecase-emoji">📚</span>
        <div class="usecase-title">Education</div>
        <p class="usecase-desc">Textbook photos that narrate concepts. History comes alive when students scan the page.</p>
      </div>
    </div>
  </div>
</section>

<!-- ── TESTIMONIALS ──────────────────────────────────── -->
<section class="testimonials-section">
  <div class="section-inner">
    <div style="text-align:center">
      <span class="section-eyebrow reveal">Voices</span>
      <h2 class="section-title reveal" style="margin: 0 auto 12px;">Memories they'll carry<br>for <em>a lifetime</em></h2>
    </div>
    <div class="testimonials-grid">
      <div class="testi-card reveal reveal-delay-1">
        <span class="testi-marks">"</span>
        <p class="testi-quote">We sent Memora cards as wedding invitations. When our guests scanned them, they watched our entire love story unfold on the card itself. Half the table was in tears before the ceremony even started.</p>
        <div class="testi-author">
          <div class="testi-avatar">🌸</div>
          <div>
            <div class="testi-name">Priya &amp; Arjun</div>
            <div class="testi-role">WEDDING · COIMBATORE · 2025</div>
          </div>
        </div>
      </div>
      <div class="testi-card reveal reveal-delay-2">
        <span class="testi-marks">"</span>
        <p class="testi-quote">I added a voice message from my dad to his birthday card. He scanned it three times in a row, just to hear it again. That's what Memora is — a way to be there even when you're not.</p>
        <div class="testi-author">
          <div class="testi-avatar">🎂</div>
          <div>
            <div class="testi-name">Kavya Nair</div>
            <div class="testi-role">PERSONAL USE · KOCHI · 2025</div>
          </div>
        </div>
      </div>
      <div class="testi-card reveal reveal-delay-3">
        <span class="testi-marks">"</span>
        <p class="testi-quote">We used Memora cards as product inserts for our chai brand. Scan the pack, see our farmers on the hillside, hear the story. Our NPS went up 18 points in one quarter.</p>
        <div class="testi-author">
          <div class="testi-avatar">🍃</div>
          <div>
            <div class="testi-name">Rajan Menon</div>
            <div class="testi-role">BRAND FOUNDER · NILGIRIS · 2025</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- ── CTA ───────────────────────────────────────────── -->
<section class="cta-section" id="cta">
  <div class="cta-deco cta-deco-1">M</div>
  <div class="cta-deco cta-deco-2">∞</div>
  <div class="cta-inner">
    <span class="cta-eyebrow reveal">Begin Now — Free Forever for 5 Cards</span>
    <h2 class="cta-title reveal">
      Give your memories<br>a <em>voice</em>
    </h2>
    <p class="cta-sub reveal">
      Upload a photo. Attach a moment. Watch someone's face when they scan it for the first time.
    </p>
    <div class="cta-actions reveal">
      <a href="#" class="btn-light">
        <span>Create My First Card</span> <span>→</span>
      </a>
      <a href="#how" class="btn-outline-light">Watch a Demo</a>
    </div>
  </div>
</section>

<!-- ── FOOTER ────────────────────────────────────────── -->
<footer>
  <div class="footer-inner">
    <div>
      <div class="footer-logo">Memo<span>ra</span></div>
      <div class="footer-tagline">Every photo has a story. We let it speak.</div>
    </div>
    <ul class="footer-links">
      <li><a href="#">How it Works</a></li>
      <li><a href="#">Pricing</a></li>
      <li><a href="#">Privacy</a></li>
      <li><a href="#">Contact</a></li>
    </ul>
  </div>
  <div class="footer-copy">
    © 2026 Memora · Built with love by Ahill Selvaraj · SNS College of Technology
  </div>
</footer>

<script>
/* ── LOADER ─────────────────────────────── */
window.addEventListener('load', () => {
  setTimeout(() => {
    document.getElementById('loader').classList.add('hidden');
  }, 1800);
});

/* ── NAV SCROLL ─────────────────────────── */
const nav = document.getElementById('mainNav');
const progress = document.getElementById('scrollProgress');

window.addEventListener('scroll', () => {
  if (window.scrollY > 60) nav.classList.add('scrolled');
  else nav.classList.remove('scrolled');

  const total = document.body.scrollHeight - window.innerHeight;
  const pct = total > 0 ? window.scrollY / total : 0;
  progress.style.transform = `scaleX(${pct})`;
});

/* ── MOBILE NAV ─────────────────────────── */
document.getElementById('hamburger').addEventListener('click', () => {
  document.getElementById('mobileNav').classList.add('open');
});
document.getElementById('mobileClose').addEventListener('click', () => {
  document.getElementById('mobileNav').classList.remove('open');
});
document.querySelectorAll('.mobile-nav a').forEach(a => {
  a.addEventListener('click', () => document.getElementById('mobileNav').classList.remove('open'));
});

/* ── INTERSECTION OBSERVER (reveal) ────── */
const revealEls = document.querySelectorAll('.reveal, .reveal-scale');
const io = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('in-view'); io.unobserve(e.target); }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
revealEls.forEach(el => io.observe(el));

/* ── PARALLAX BG TEXT ───────────────────── */
document.querySelectorAll('[data-parallax]').forEach(el => {
  const speed = parseFloat(el.dataset.parallax);
  window.addEventListener('scroll', () => {
    el.style.transform = `translateY(${window.scrollY * speed}px)`;
  }, { passive: true });
});

/* ── HERO PARALLAX ─────────────────────── */
window.addEventListener('scroll', () => {
  const heroCards = document.querySelectorAll('.photo-card');
  heroCards.forEach((c, i) => {
    const offsets = [0.06, 0.04, 0.03];
    const existing = c.style.transform || '';
    // Only add subtle translateY, don't override float animation
    c.style.marginTop = `-${window.scrollY * offsets[i]}px`;
  });
}, { passive: true });

/* ── CARD 3D TILT ──────────────────────── */
document.querySelectorAll('.photo-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const r = card.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width  - 0.5;
    const y = (e.clientY - r.top)  / r.height - 0.5;
    const baseRot = card.classList.contains('card-1') ? -4
                  : card.classList.contains('card-2') ?  3.5 : 1.5;
    card.style.transform = `rotate(${baseRot}deg) rotateX(${-y * 14}deg) rotateY(${x * 14}deg) translateZ(8px)`;
  });
  card.addEventListener('mouseleave', () => {
    const baseRot = card.classList.contains('card-1') ? -4
                  : card.classList.contains('card-2') ?  3.5 : 1.5;
    card.style.transition = 'transform 0.6s cubic-bezier(0.34,1.56,0.64,1)';
    card.style.transform = `rotate(${baseRot}deg)`;
    setTimeout(() => card.style.transition = '', 600);
  });
});

/* ── COUNT UP ──────────────────────────── */
const counters = document.querySelectorAll('.count-up');
const countIO = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const el = entry.target;
    const target = parseInt(el.dataset.target);
    const duration = 1600;
    const start = performance.now();
    const update = (now) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.floor(eased * target);
      if (progress < 1) requestAnimationFrame(update);
      else el.textContent = target;
    };
    requestAnimationFrame(update);
    countIO.unobserve(el);
  });
}, { threshold: 0.5 });
counters.forEach(c => countIO.observe(c));
</script>
</body>
</html>