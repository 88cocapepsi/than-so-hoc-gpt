import React, { useEffect, useRef, useState } from "react";
import { SUCCESS_DATA } from "./data/data_success";
import { GROWTH_DATA } from "./data/data_growth";
import { HAPPINESS_DATA } from "./data/data_happiness";
import { KARMA_DATA } from "./data/data_karma";
import { DEBT_DATA } from "./data/data_debt";
import { LIFE_PATH_DATA } from "./data/lifepath";
import { arrowData } from "./data/data_arrows";

const STORAGE_KEY = "than_so_hoc_gpt_pro_messages_v13_final";
const SETTINGS_KEY = "than_so_hoc_gpt_pro_settings_v13_final";
const HISTORY_KEY = "than_so_hoc_gpt_pro_history_v13_final";
const MASTER_NUMBERS = [11, 22, 33];

const LIFE_PATH_FALLBACK = {
  1: "Số chủ đạo 1: độc lập, chủ động, có tố chất lãnh đạo và cần học cách lắng nghe.",
  2: "Số chủ đạo 2: nhạy cảm, trực giác tốt, tận tụy và giàu tình cảm.",
  3: "Số chủ đạo 3: tư duy nhanh, sáng tạo, giỏi biểu đạt và cần học sự tập trung.",
  4: "Số chủ đạo 4: thực tế, kỷ luật, đáng tin và cần học sự linh hoạt.",
  5: "Số chủ đạo 5: yêu tự do, thích trải nghiệm và cần học sự ổn định.",
  6: "Số chủ đạo 6: yêu thương, trách nhiệm, sáng tạo và cần bớt lo lắng.",
  7: "Số chủ đạo 7: sâu sắc, chiêm nghiệm, học qua trải nghiệm và cần mở lòng hơn.",
  8: "Số chủ đạo 8: mạnh về quản trị, thành tựu, tài chính và cần cân bằng cảm xúc.",
  9: "Số chủ đạo 9: nhân văn, lý tưởng, trách nhiệm và cần học sự thực tế.",
  10: "Số chủ đạo 10: linh hoạt, thích nghi, quảng giao và cần giữ chiều sâu.",
  11: "Số chủ đạo 11: trực giác mạnh, nhạy tinh thần, truyền cảm hứng và cần giữ nền sống ổn định.",
  22: "Số chủ đạo 22/4: master number của kiến tạo lớn, cần biến tiềm năng thành kỷ luật thực tế.",
  33: "Số chủ đạo 33: yêu thương, chữa lành, phụng sự và cần cân bằng giữa cho đi với chăm sóc bản thân.",
};

const PERSONAL_YEAR_DATA = {
  1: "Năm cá nhân 1: bắt đầu chu kỳ mới, khởi sự, tự chủ và gieo hạt.",
  2: "Năm cá nhân 2: kiên nhẫn, hợp tác, nuôi dưỡng quan hệ và chờ thời điểm chín.",
  3: "Năm cá nhân 3: sáng tạo, biểu đạt, giao tiếp và mở rộng niềm vui sống.",
  4: "Năm cá nhân 4: xây nền, kỷ luật, ổn định và xử lý việc thực tế.",
  5: "Năm cá nhân 5: thay đổi, trải nghiệm, dịch chuyển và mở rộng.",
  6: "Năm cá nhân 6: gia đình, trách nhiệm, tình cảm, chữa lành và cam kết.",
  7: "Năm cá nhân 7: chiêm nghiệm, học sâu, nhìn lại và nâng cấp nội tâm.",
  8: "Năm cá nhân 8: thành tựu, tài chính, kết quả, quyền lực và sức ảnh hưởng.",
  9: "Năm cá nhân 9: hoàn tất chu kỳ cũ, buông bỏ và chuẩn bị cho vòng mới.",
};

const ARROW_META = {
  "1-2-3": {
    id: "123",
    icon: "🧠",
    title: "Mũi tên 1–2–3",
    subtitle: "Trí nhớ – Tư duy – Khả năng tổ chức",
    emptyName: "Mũi tên trống 1–2–3",
  },
  "4-5-6": {
    id: "456",
    icon: "🏗️",
    title: "Mũi tên 4–5–6",
    subtitle: "Thực tế – Hành động – Vận hành đời sống",
    emptyName: "Mũi tên trống 4–5–6",
  },
  "7-8-9": {
    id: "789",
    icon: "⚡",
    title: "Mũi tên 7–8–9",
    subtitle: "Hành động – Trải nghiệm – Năng lượng sống",
    emptyName: "Mũi tên trống 7–8–9",
  },
  "1-4-7": {
    id: "147",
    icon: "🔥",
    title: "Mũi tên 1–4–7",
    subtitle: "Ý chí – Nội lực – Sức bền",
    emptyName: "Mũi tên trống 1–4–7",
  },
  "2-5-8": {
    id: "258",
    icon: "⚖️",
    title: "Mũi tên 2–5–8",
    subtitle: "Cân bằng cảm xúc – Nội tâm ổn định",
    emptyName: "Mũi tên trống 2–5–8",
  },
  "3-6-9": {
    id: "369",
    icon: "📚",
    title: "Mũi tên 3–6–9",
    subtitle: "Trí tuệ – Nhận thức – Tầm nhìn",
    emptyName: "Mũi tên trống 3–6–9",
  },
  "1-5-9": {
    id: "159",
    icon: "🚀",
    title: "Mũi tên 1–5–9",
    subtitle: "Quyết tâm – Động lực – Sức bật",
    emptyName: "Mũi tên trống 1–5–9",
  },
  "3-5-7": {
    id: "357",
    icon: "🔮",
    title: "Mũi tên 3–5–7",
    subtitle: "Trực giác – Tâm linh – Chiều sâu",
    emptyName: "Mũi tên trống 3–5–7",
  },
};

const ADVANCED_OPTIONS = [
  { id: "lifepath-full", icon: "☉", title: "Con số chủ đạo", desc: "Hiện full nội dung từ data/lifepath" },
  { id: "arrows-strong", icon: "↗", title: "Mũi tên cá tính", desc: "Các trục mạnh trong biểu đồ ngày sinh" },
  { id: "arrows-empty", icon: "↘", title: "Mũi tên trống", desc: "Vùng thiếu và bài học cần rèn" },
  { id: "pinnacles", icon: "△", title: "4 đỉnh cao cuộc đời", desc: "Giai đoạn, độ tuổi và số đỉnh" },
  { id: "secondary", icon: "✦", title: "Các số phụ", desc: "Mở menu dữ liệu chuyên sâu" },
];

const SECONDARY_OPTIONS = [
  { id: "success", icon: "🏆", title: "Cầu nối thành công", dataKey: "successBridge" },
  { id: "growth", icon: "🌱", title: "Con số trưởng thành", dataKey: "maturity" },
  { id: "happiness", icon: "💗", title: "Cầu nối hạnh phúc", dataKey: "happinessBridge" },
  { id: "karma", icon: "🧩", title: "Bài học nghiệp", dataKey: "karmicLessons" },
  { id: "debt", icon: "🔥", title: "Nợ nghiệp", dataKey: "karmicDebts" },
  { id: "balance", icon: "⚖️", title: "Cân bằng", dataKey: "balance" },
];

const darkTheme = {
  appBg: "#080b14", sidebarBg: "#0d1323", mainBg: "#0b1020", card: "#101827", panel: "#111c2f",
  border: "#263449", text: "#e8edf6", muted: "#93a4bb", accent: "#10a37f", accentSoft: "rgba(16,163,127,.18)",
  danger: "#ef4444", dangerSoft: "rgba(239,68,68,.15)", userBubble: "#123b31", assistantBubble: "#101827", inputBg: "#101827",
};

const lightTheme = {
  appBg: "#f5f7fb", sidebarBg: "#ffffff", mainBg: "#f5f7fb", card: "#ffffff", panel: "#f1f5f9",
  border: "#d9e2ee", text: "#111827", muted: "#64748b", accent: "#10a37f", accentSoft: "#dff8ef",
  danger: "#dc2626", dangerSoft: "#fee2e2", userBubble: "#dff8ef", assistantBubble: "#ffffff", inputBg: "#ffffff",
};

const css = `
*{box-sizing:border-box}body{margin:0}.app{min-height:100vh;display:grid;grid-template-columns:320px 1fr;font-family:Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif}.sidebar{padding:20px;border-right:1px solid;position:sticky;top:0;height:100vh;overflow:auto}.brand h1{font-size:28px;line-height:1.06;margin:0;font-weight:850;letter-spacing:-.04em}.brand p{font-size:13px;line-height:1.5;margin:8px 0 18px}.new-btn{width:100%;border:0;border-radius:16px;padding:13px 14px;color:#fff;font-weight:800;cursor:pointer;margin-bottom:14px;box-shadow:0 12px 30px rgba(16,163,127,.22)}.side-card{border:1px solid;border-radius:18px;padding:14px;margin-bottom:14px}.side-card h3{font-size:15px;margin:0 0 12px}.input{width:100%;border:1px solid;border-radius:13px;padding:11px 12px;outline:none}.row{display:flex;gap:8px;flex-wrap:wrap}.mini-btn,.prompt-btn{border:1px solid;border-radius:12px;background:transparent;padding:9px 11px;cursor:pointer}.prompt-btn{text-align:left;width:100%;margin-bottom:8px;line-height:1.4}.history-item{border:1px solid;border-radius:14px;padding:10px 12px;margin-bottom:8px;cursor:pointer}.history-item b{display:block;font-size:13px;margin-bottom:4px}.history-item span{font-size:12px}.main{display:flex;flex-direction:column;min-width:0}.header{padding:26px 32px 10px;position:sticky;top:0;z-index:3;backdrop-filter:blur(14px)}.header h2{font-size:40px;margin:0;font-weight:850;letter-spacing:-.05em}.header p{margin:8px 0 0;font-size:14px}.chat{flex:1;padding:22px 32px 160px;overflow:auto}.hero{border:1px solid;border-radius:28px;padding:28px;margin-bottom:24px;box-shadow:0 24px 70px rgba(0,0,0,.14)}.hero h1{text-align:center;font-size:52px;line-height:1.05;margin:0 0 12px;letter-spacing:-.06em}.hero p{text-align:center;max-width:760px;margin:0 auto 22px;line-height:1.65}.hero-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:12px}.hero-card{border:1px solid;border-radius:18px;padding:16px;cursor:pointer}.hero-card h3{margin:0 0 8px}.hero-card p{text-align:left;margin:0;font-size:13px}.msg-row{display:flex;gap:12px;align-items:flex-start;margin-bottom:18px}.msg-user{justify-content:flex-end}.avatar{width:40px;height:40px;border-radius:50%;display:flex;align-items:center;justify-content:center;flex-shrink:0}.msg{width:min(100%,1040px);border:1px solid;border-radius:22px;padding:16px;box-shadow:0 14px 35px rgba(0,0,0,.12)}.msg-meta{display:flex;justify-content:space-between;gap:12px;font-size:12px;margin-bottom:10px}.msg-text{white-space:pre-wrap;line-height:1.75;font-size:15px;word-break:break-word}.full-data-text{white-space:pre-wrap;line-height:1.85;font-size:15.5px;word-break:break-word}.copy-btn{margin-top:12px;background:transparent;border:1px solid;border-radius:10px;padding:8px 10px;cursor:pointer;font-size:12px}.visual-pro{margin-top:18px}.metrics-row{display:grid;grid-template-columns:repeat(auto-fit,minmax(120px,1fr));gap:10px;margin-bottom:14px}.ts-card{border:1px solid;border-radius:16px;padding:12px}.ts-card-label{font-size:12px;margin-bottom:6px}.ts-card-value{font-size:26px;font-weight:850}.panel-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:14px}.pro-panel{border:1px solid;border-radius:20px;padding:16px}.panel-head{display:flex;align-items:flex-start;justify-content:space-between;gap:10px;margin-bottom:14px}.panel-head h3{margin:0;font-size:16px}.panel-head p{margin:4px 0 0;font-size:12px}.panel-badge{border-radius:999px;padding:5px 9px;font-size:11px;font-weight:800}.birth-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:8px}.birth-cell{border:1px solid;border-radius:14px;padding:10px;min-height:68px;display:flex;flex-direction:column;justify-content:space-between}.birth-cell span{font-size:12px}.birth-cell strong{font-size:20px;letter-spacing:1px}.arrow-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:8px}.arrow-chip{border:1px solid;border-radius:13px;padding:10px;display:flex;justify-content:space-between;gap:8px;align-items:center}.arrow-chip span{font-size:12px}.pyramid{display:flex;flex-direction:column;align-items:center;gap:10px;margin:8px 0 14px}.p-row{display:flex;gap:18px}.p-node{width:58px;height:58px;border:1px solid;border-radius:17px;display:flex;align-items:center;justify-content:center;font-size:24px;font-weight:850}.p-node.bottom{width:78px;height:78px;font-size:30px}.timeline{display:flex;flex-direction:column;gap:8px}.timeline-item{border:1px solid;border-radius:13px;padding:10px}.timeline-item b{display:block;font-size:13px}.timeline-item span{font-size:12px}.advanced-wrap{margin-top:18px}.advanced-title{font-weight:850;margin-bottom:10px;display:flex;gap:8px;align-items:center}.advanced-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:10px}.advanced-btn{border:1px solid;border-radius:16px;padding:12px;text-align:left;cursor:pointer;display:flex;gap:10px;align-items:flex-start}.advanced-btn:hover{transform:translateY(-1px)}.advanced-btn b{display:block;margin-bottom:4px}.advanced-btn small{display:block;line-height:1.35}.adv-icon{width:32px;height:32px;border-radius:12px;display:flex;align-items:center;justify-content:center;flex-shrink:0}.inputbar{position:sticky;bottom:0;padding:18px 24px 22px;backdrop-filter:blur(14px);z-index:4}.input-inner{max-width:1040px;margin:0 auto}.input-box{display:flex;gap:12px;border:1px solid;border-radius:22px;padding:12px;align-items:flex-end}.textarea{width:100%;border:0;outline:0;resize:none;background:transparent;font:inherit;line-height:1.55;max-height:220px}.send{width:44px;height:44px;border:0;border-radius:15px;color:#fff;font-weight:900;cursor:pointer;flex-shrink:0}.hint{text-align:center;font-size:12px;margin-top:8px}@media(max-width:900px){.app{grid-template-columns:1fr}.sidebar{position:relative;height:auto;border-right:0;border-bottom:1px solid}.header{position:relative}.chat{padding:16px 14px 150px}.hero h1{font-size:38px}.msg{border-radius:18px}.avatar{display:none}}@media(max-width:560px){.header h2{font-size:31px}.hero{padding:18px}.hero h1{font-size:32px}.metrics-row{grid-template-columns:repeat(2,1fr)}.panel-grid{grid-template-columns:1fr}.advanced-grid{grid-template-columns:1fr}.arrow-grid{grid-template-columns:1fr}.sidebar{padding:14px}.chat{padding-left:10px;padding-right:10px}}


/* ===================== PRO MAX UI UPGRADE ===================== */
.app{
  position:relative;
  isolation:isolate;
  overflow:hidden;
}
.app:before{
  content:"";
  position:fixed;
  inset:-20%;
  z-index:-2;
  background:
    radial-gradient(circle at 18% 14%, rgba(16,163,127,.26), transparent 30%),
    radial-gradient(circle at 78% 8%, rgba(84,105,212,.22), transparent 34%),
    radial-gradient(circle at 50% 100%, rgba(255,255,255,.08), transparent 28%),
    linear-gradient(135deg, rgba(8,11,20,.96), rgba(11,16,32,.98));
  animation:proMaxGalaxy 18s ease-in-out infinite alternate;
}
.app:after{
  content:"";
  position:fixed;
  inset:0;
  z-index:-1;
  pointer-events:none;
  opacity:.32;
  background-image:
    radial-gradient(circle, rgba(255,255,255,.75) 0 1px, transparent 1.6px),
    radial-gradient(circle, rgba(16,163,127,.7) 0 1px, transparent 1.8px);
  background-size:84px 84px, 137px 137px;
  background-position:0 0, 22px 40px;
  animation:proMaxStars 45s linear infinite;
}
@keyframes proMaxGalaxy{from{transform:scale(1) rotate(0deg)}to{transform:scale(1.08) rotate(2deg)}}
@keyframes proMaxStars{from{transform:translateY(0)}to{transform:translateY(-120px)}}
.sidebar,.header,.inputbar{background-color:rgba(13,19,35,.72)!important;backdrop-filter:blur(20px) saturate(140%)}
.sidebar{box-shadow:18px 0 60px rgba(0,0,0,.25)}
.brand h1,.header h2,.hero h1{background:linear-gradient(90deg,#fff,#a7f3d0,#93c5fd);-webkit-background-clip:text;background-clip:text;color:transparent!important}
.new-btn,.send{box-shadow:0 14px 38px rgba(16,163,127,.34)}
.side-card,.hero,.msg,.pro-panel,.ts-card,.advanced-btn,.input-box{
  box-shadow:0 20px 60px rgba(0,0,0,.18), inset 0 1px 0 rgba(255,255,255,.04);
}
.hero,.msg,.pro-panel,.side-card,.input-box{
  border-color:rgba(148,163,184,.22)!important;
}
.promax-message{position:relative;overflow:hidden}
.promax-message:before{
  content:"";
  position:absolute;
  inset:0;
  pointer-events:none;
  background:linear-gradient(135deg,rgba(255,255,255,.055),transparent 34%,rgba(16,163,127,.045));
}
.promax-avatar{box-shadow:0 0 0 1px rgba(255,255,255,.08),0 0 30px rgba(16,163,127,.24)}
.ts-card,.birth-cell,.arrow-chip,.timeline-item,.advanced-btn,.hero-card,.history-item,.prompt-btn,.mini-btn{transition:transform .18s ease,border-color .18s ease,box-shadow .18s ease}
.ts-card:hover,.birth-cell:hover,.arrow-chip:hover,.timeline-item:hover,.advanced-btn:hover,.hero-card:hover,.history-item:hover,.prompt-btn:hover,.mini-btn:hover{
  transform:translateY(-2px);
  box-shadow:0 14px 34px rgba(0,0,0,.18);
}
.advanced-btn{min-height:82px}
.panel-head h3,.advanced-title{letter-spacing:-.02em}
.birth-cell strong,.ts-card-value,.p-node{text-shadow:0 0 18px rgba(147,197,253,.2)}
.p-node{box-shadow:0 10px 32px rgba(0,0,0,.18), inset 0 1px 0 rgba(255,255,255,.06)}
.copy-btn:hover{background:rgba(255,255,255,.06)}
.textarea::placeholder{color:rgba(147,164,187,.85)}
.chat::-webkit-scrollbar,.sidebar::-webkit-scrollbar{width:10px}
.chat::-webkit-scrollbar-thumb,.sidebar::-webkit-scrollbar-thumb{background:rgba(148,163,184,.25);border-radius:999px}
.chat::-webkit-scrollbar-track,.sidebar::-webkit-scrollbar-track{background:transparent}
@media(max-width:900px){.sidebar,.header,.inputbar{background-color:rgba(13,19,35,.86)!important}}


/* ===================== PRO MAX FINAL MOBILE-FIRST UPGRADE ===================== */
:root{color-scheme:dark}
button,input,textarea{font-family:inherit;-webkit-tap-highlight-color:transparent}
button{touch-action:manipulation}
.app{min-height:100dvh}
.main{height:100dvh;overflow:hidden}
.chat{scroll-behavior:smooth}
.sidebar,.header,.inputbar,.side-card,.hero,.msg,.pro-panel,.ts-card,.advanced-btn,.input-box,.history-item,.prompt-btn,.mini-btn{border-color:rgba(148,163,184,.18)!important}
.header{box-shadow:0 18px 50px rgba(0,0,0,.16)}
.header:after{content:"PRO MAX FINAL";display:inline-flex;margin-top:10px;padding:6px 10px;border-radius:999px;font-size:11px;font-weight:900;letter-spacing:.08em;color:#d1fae5;background:rgba(16,163,127,.14);border:1px solid rgba(16,163,127,.28)}
.brand:before{content:"✦";display:inline-flex;width:42px;height:42px;align-items:center;justify-content:center;border-radius:16px;margin-bottom:12px;color:#d1fae5;background:linear-gradient(135deg,rgba(16,163,127,.32),rgba(96,165,250,.16));box-shadow:0 18px 40px rgba(16,163,127,.18)}
.new-btn,.send,.mini-btn,.prompt-btn,.advanced-btn,.hero-card,.history-item{user-select:none}
.new-btn:active,.send:active,.mini-btn:active,.prompt-btn:active,.advanced-btn:active,.hero-card:active,.history-item:active{transform:scale(.985)}
.input:focus,.textarea:focus{outline:none}
.input:focus,.input-box:focus-within{border-color:rgba(16,163,127,.7)!important;box-shadow:0 0 0 4px rgba(16,163,127,.13)}
.msg{animation:proMaxMessageIn .25s ease both}
@keyframes proMaxMessageIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
.ts-card{position:relative;overflow:hidden}
.ts-card:after{content:"";position:absolute;inset:auto 12px 10px 12px;height:1px;background:linear-gradient(90deg,transparent,rgba(255,255,255,.22),transparent)}
.metrics-row{align-items:stretch}.ts-card-value{line-height:1}.birth-grid,.arrow-grid,.advanced-grid{align-items:stretch}.arrow-chip strong{font-size:13px;line-height:1.25}.arrow-chip span{white-space:nowrap}.full-data-text{max-width:920px}
@media(max-width:1100px){.app{grid-template-columns:280px 1fr}.header h2{font-size:34px}.hero h1{font-size:44px}.chat{padding-left:20px;padding-right:20px}}
@media(max-width:900px){.app{display:block;overflow:auto}.main{height:auto;min-height:100dvh;overflow:visible}.sidebar{position:relative!important;height:auto!important;max-height:none;padding:14px;border-right:0!important;border-bottom:1px solid rgba(148,163,184,.18)!important}.brand{display:grid;grid-template-columns:auto 1fr;gap:10px;align-items:center;margin-bottom:12px}.brand:before{margin:0;width:38px;height:38px;border-radius:14px}.brand h1{font-size:23px!important}.brand p{grid-column:1 / -1;margin:0!important;font-size:12px!important}.new-btn{min-height:46px;border-radius:15px;margin-bottom:10px}.side-card{padding:12px;border-radius:16px;margin-bottom:10px}.side-card h3{font-size:14px;margin-bottom:9px}.prompt-btn{font-size:13px;min-height:44px;margin-bottom:7px}.history-item{padding:9px 10px}.header{position:sticky!important;top:0;padding:14px 14px 10px;z-index:30}.header h2{font-size:27px!important;line-height:1.05}.header p{font-size:12px;margin-top:6px}.header:after{font-size:10px;padding:5px 8px;margin-top:8px}.chat{padding:12px 10px 150px!important;overflow:visible}.hero{padding:18px;border-radius:22px;margin-bottom:14px}.hero h1{font-size:32px!important}.hero p{font-size:13px;line-height:1.55;margin-bottom:14px}.hero-grid{grid-template-columns:1fr!important;gap:9px}.hero-card{padding:13px;border-radius:16px}.msg-row{gap:0;margin-bottom:12px}.avatar{display:none!important}.msg{width:100%!important;border-radius:18px!important;padding:14px!important;box-shadow:0 12px 36px rgba(0,0,0,.18)}.msg-meta{font-size:11px;margin-bottom:8px}.msg-text,.full-data-text{font-size:14px!important;line-height:1.7!important}.visual-pro{margin-top:14px}.metrics-row{grid-template-columns:repeat(2,minmax(0,1fr))!important;gap:8px;margin-bottom:10px}.ts-card{padding:10px;border-radius:14px;min-height:74px}.ts-card-label{font-size:11px}.ts-card-value{font-size:23px!important}.panel-grid{grid-template-columns:1fr!important;gap:10px}.pro-panel{padding:13px;border-radius:18px}.panel-head{margin-bottom:10px}.panel-head h3{font-size:15px}.panel-head p{font-size:11px}.birth-grid{gap:7px}.birth-cell{min-height:58px;padding:8px;border-radius:13px}.birth-cell strong{font-size:18px}.arrow-grid{grid-template-columns:1fr!important;gap:7px}.arrow-chip{min-height:48px;padding:9px;border-radius:13px}.p-node{width:52px;height:52px;font-size:21px;border-radius:16px}.p-node.bottom{width:68px;height:68px;font-size:26px}.timeline{gap:7px}.timeline-item{padding:9px;border-radius:12px}.advanced-wrap{margin-top:14px}.advanced-title{font-size:14px;margin-bottom:8px}.advanced-grid{grid-template-columns:1fr!important;gap:8px}.advanced-btn{min-height:58px;padding:10px;border-radius:15px}.adv-icon{width:30px;height:30px;border-radius:11px}.copy-btn{min-height:38px;border-radius:12px}.inputbar{position:fixed!important;left:0;right:0;bottom:0;padding:10px 10px calc(10px + env(safe-area-inset-bottom));z-index:50}.input-inner{max-width:none}.input-box{border-radius:20px;padding:10px;gap:9px;box-shadow:0 -14px 45px rgba(0,0,0,.24)}.textarea{font-size:15px;line-height:1.45;max-height:140px}.send{width:42px;height:42px;border-radius:14px}.hint{font-size:10px;margin-top:6px}}
@media(max-width:560px){.sidebar{padding:12px}.row{display:grid;grid-template-columns:1fr 1fr;gap:7px}.row .mini-btn:last-child{grid-column:1 / -1}.side-card:nth-of-type(3){max-height:220px;overflow:auto}.header h2{font-size:25px!important}.hero h1{font-size:30px!important}.metrics-row{grid-template-columns:repeat(2,1fr)!important}.ts-card{min-height:68px;padding:9px}.ts-card-value{font-size:21px!important}.birth-cell{min-height:54px}.msg{padding:12px!important}.pro-panel{padding:12px}.advanced-btn small{font-size:11px}}
@media(max-width:390px){.metrics-row{grid-template-columns:1fr!important}.header h2{font-size:23px!important}.hero h1{font-size:27px!important}.msg-text,.full-data-text{font-size:13.5px!important}.input-box{padding:8px;border-radius:18px}.send{width:40px;height:40px}}
@media(prefers-reduced-motion:reduce){.app:before,.app:after,.msg{animation:none!important}.ts-card,.birth-cell,.arrow-chip,.timeline-item,.advanced-btn,.hero-card,.history-item,.prompt-btn,.mini-btn{transition:none!important}}

/* ===================== AUDIO / VOICE CONTROLS ===================== */
.audio-actions{display:flex;gap:8px;flex-wrap:wrap;margin-top:12px;position:relative;z-index:2}
.voice-btn,.mic-btn{
  min-height:38px;
  border:1px solid rgba(148,163,184,.22);
  border-radius:12px;
  padding:8px 10px;
  cursor:pointer;
  background:rgba(255,255,255,.035);
  color:inherit;
  font-size:12px;
  font-weight:700;
  transition:transform .16s ease, background .16s ease, border-color .16s ease;
}
.voice-btn:hover,.mic-btn:hover{background:rgba(255,255,255,.075);border-color:rgba(16,163,127,.45);transform:translateY(-1px)}
.mic-btn{
  width:44px;
  height:44px;
  flex-shrink:0;
  padding:0;
  font-size:18px;
  border-radius:15px;
}
.mic-btn.listening{
  background:linear-gradient(135deg,rgba(239,68,68,.9),rgba(16,163,127,.85));
  color:#fff;
  animation:micPulse 1.2s ease-in-out infinite;
}
@keyframes micPulse{0%,100%{box-shadow:0 0 0 0 rgba(239,68,68,.32)}50%{box-shadow:0 0 0 8px rgba(239,68,68,0)}}
@media(max-width:900px){
  .audio-actions{gap:7px;margin-top:10px}
  .voice-btn{min-height:36px;font-size:11.5px;padding:7px 9px}
}
`;

function makeId(prefix = "id") {
  if (window.crypto?.randomUUID) return window.crypto.randomUUID();
  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function reduceNumber(num, keepMasters = true) {
  let n = Number(num) || 0;
  while (n > 9) {
    if (keepMasters && MASTER_NUMBERS.includes(n)) return n;
    n = String(n).split("").reduce((sum, digit) => sum + Number(digit), 0);
  }
  return n;
}

function normalizeVietnamese(str = "") {
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/đ/g, "d").replace(/Đ/g, "D");
}

function parseDate(dateStr = "") {
  const match = dateStr.match(/(\d{1,2})\/(\d{1,2})\/(\d{4})/);
  if (!match) return null;
  const day = Number(match[1]);
  const month = Number(match[2]);
  const year = Number(match[3]);
  if (day < 1 || day > 31 || month < 1 || month > 12 || year < 1000) return null;
  return { day, month, year, raw: `${String(day).padStart(2, "0")}/${String(month).padStart(2, "0")}/${year}` };
}

function extractNameAndDate(input = "") {
  const dateMatch = input.match(/(\d{1,2})\/(\d{1,2})\/(\d{4})/);
  const dateText = dateMatch?.[0] || "";
  const date = dateText ? parseDate(dateText) : null;
  let name = input
    .replace(dateText, "")
    .replace(/tôi tên là|tôi tên|ten toi la|ten toi|my name is|name is|sinh ngày|sinh ngay|ngày sinh|ngay sinh|toi la|tôi là|hãy xem cho tôi|xem cho tôi|phân tích cho tôi|lập cho tôi|lap cho toi|cho tôi biết|của tôi|thần số học|phân tích/gi, " ")
    .replace(/[,:;|–—-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  return { name: name || "Bạn", date };
}

function charToNumber(char) {
  const map = { A: 1, J: 1, S: 1, B: 2, K: 2, T: 2, C: 3, L: 3, U: 3, D: 4, M: 4, V: 4, E: 5, N: 5, W: 5, F: 6, O: 6, X: 6, G: 7, P: 7, Y: 7, H: 8, Q: 8, Z: 8, I: 9, R: 9 };
  return map[char] || 0;
}

function splitNameNumbers(name) {
  const cleaned = normalizeVietnamese(name).toUpperCase().replace(/[^A-Z\s]/g, " ");
  const letters = cleaned.replace(/\s+/g, "").split("");
  const vowels = ["A", "E", "I", "O", "U", "Y"];
  const vowelNums = [];
  const consonantNums = [];
  letters.forEach((char) => {
    const n = charToNumber(char);
    if (!n) return;
    if (vowels.includes(char)) vowelNums.push(n);
    else consonantNums.push(n);
  });
  return { vowelNums, consonantNums, allNums: [...vowelNums, ...consonantNums] };
}

function calcLifePath(date) {
  const raw = `${date.day}${date.month}${date.year}`.split("").reduce((sum, digit) => sum + Number(digit), 0);
  return reduceNumber(raw, true);
}

function calcAttitude(date) {
  return reduceNumber(date.day + date.month, true);
}

function calcSoulUrge(name) {
  const { vowelNums } = splitNameNumbers(name);
  return reduceNumber(vowelNums.reduce((a, b) => a + b, 0), true);
}

function calcPersonality(name) {
  const { consonantNums } = splitNameNumbers(name);
  return reduceNumber(consonantNums.reduce((a, b) => a + b, 0), true);
}

function calcExpression(name) {
  const { allNums } = splitNameNumbers(name);
  return reduceNumber(allNums.reduce((a, b) => a + b, 0), true);
}

function calcPersonalYear(date, targetYear) {
  const universalYear = String(targetYear).split("").reduce((a, b) => a + Number(b), 0);
  return reduceNumber(date.day + date.month + universalYear, false);
}

function getBirthDigitCounts(date) {
  const counts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0 };
  `${String(date.day).padStart(2, "0")}${String(date.month).padStart(2, "0")}${date.year}`
    .replace(/0/g, "")
    .split("")
    .forEach((d) => {
      const n = Number(d);
      if (counts[n] !== undefined) counts[n] += 1;
    });
  return counts;
}

function getArrowDetail(meta) {
  const data = arrowData?.[meta.id] || {};
  return {
    ...meta,
    dataTitle: data.title || meta.title,
    dataSubtitle: data.subtitle || meta.subtitle,
    dataContent:
      data.content ||
      `Chưa có nội dung chi tiết cho ${meta.title}. Anh kiểm tra lại file src/data/data_arrows.js và key "${meta.id}".`,
  };
}

function analyzeArrows(counts) {
  const patterns = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9],
    [1, 4, 7],
    [2, 5, 8],
    [3, 6, 9],
    [1, 5, 9],
    [3, 5, 7],
  ];

  const strong = [];
  const empty = [];

  patterns.forEach((arr) => {
    const key = arr.join("-");
    const meta = ARROW_META[key];
    if (!meta) return;

    const detail = getArrowDetail(meta);
    const hasAll = arr.every((n) => counts[n] > 0);
    const missingAll = arr.every((n) => counts[n] === 0);

    if (hasAll) {
      strong.push({
        key,
        status: "strong",
        statusText: "Mũi tên cá tính nổi bật",
        ...detail,
      });
    }

    if (missingAll) {
      empty.push({
        key,
        status: "empty",
        statusText: "Mũi tên trống cần rèn",
        ...detail,
      });
    }
  });

  return { strong, empty };
}

function calcPinnacles(date) {
  const m = reduceNumber(date.month, false);
  const d = reduceNumber(date.day, false);
  const y = reduceNumber(String(date.year).split("").reduce((a, b) => a + Number(b), 0), false);
  const p1 = reduceNumber(m + d, false);
  const p2 = reduceNumber(d + y, false);
  const p3 = reduceNumber(p1 + p2, false);
  const p4 = reduceNumber(m + y, false);
  const firstEndAge = 36 - reduceNumber(calcLifePath(date), false);
  return [
    { title: "Đỉnh cao 1", number: p1, ageStart: 0, ageEnd: firstEndAge },
    { title: "Đỉnh cao 2", number: p2, ageStart: firstEndAge + 1, ageEnd: firstEndAge + 9 },
    { title: "Đỉnh cao 3", number: p3, ageStart: firstEndAge + 10, ageEnd: firstEndAge + 18 },
    { title: "Đỉnh cao 4", number: p4, ageStart: firstEndAge + 19, ageEnd: null },
  ];
}

function calcMaturity(lifePath, expression) {
  return reduceNumber(reduceNumber(lifePath, false) + reduceNumber(expression, false), false);
}

function calcBridge(a, b) {
  return Math.abs(reduceNumber(a, false) - reduceNumber(b, false));
}

function calcKarmicLessons(counts) {
  return Object.entries(counts)
    .filter(([, count]) => count === 0)
    .map(([n]) => Number(n));
}

function calcKarmicDebts(date) {
  const rawSum = `${date.day}${date.month}${date.year}`.split("").reduce((sum, digit) => sum + Number(digit), 0);
  const debts = [];
  if ([13, 14, 16, 19].includes(date.day)) debts.push(date.day);
  if ([13, 14, 16, 19].includes(rawSum)) debts.push(rawSum);
  return [...new Set(debts)];
}

function calcBalance(name) {
  const parts = normalizeVietnamese(name).toUpperCase().replace(/[^A-Z\s]/g, "").split(/\s+/).filter(Boolean);
  const total = parts.reduce((sum, part) => sum + charToNumber(part[0]), 0);
  return reduceNumber(total, false) || 1;
}

function debtKey(n) {
  return `${n}/${reduceNumber(n, false)}`;
}

function fallbackData(title, number) {
  return `${title}: ${number}\n\nChưa có nội dung data cho mục này. Anh kiểm tra lại file data hoặc key số tương ứng.`;
}

function getLifePathText(lifePath) {
  return LIFE_PATH_DATA?.[lifePath] || LIFE_PATH_DATA?.[String(lifePath)] || LIFE_PATH_FALLBACK[lifePath] || `Chưa có nội dung số chủ đạo ${lifePath}.`;
}

function buildProfile(name, date, yearView) {
  const lifePath = calcLifePath(date);
  const attitude = calcAttitude(date);
  const soulUrge = calcSoulUrge(name);
  const personality = calcPersonality(name);
  const expression = calcExpression(name);
  const personalYear = calcPersonalYear(date, yearView);
  const counts = getBirthDigitCounts(date);
  const arrows = analyzeArrows(counts);
  const pinnacles = calcPinnacles(date);
  const maturity = calcMaturity(lifePath, expression);
  const successBridge = calcBridge(lifePath, expression);
  const happinessBridge = calcBridge(soulUrge, personality);
  const karmicLessons = calcKarmicLessons(counts);
  const karmicDebts = calcKarmicDebts(date);
  const balance = calcBalance(name);

  return {
    name,
    date,
    yearView,
    lifePath,
    attitude,
    soulUrge,
    personality,
    expression,
    personalYear,
    counts,
    arrows,
    pinnacles,
    maturity,
    successBridge,
    happinessBridge,
    karmicLessons,
    karmicDebts,
    balance,
  };
}

function buildMainReply(profile) {
  const chartRows = [[3, 6, 9], [2, 5, 8], [1, 4, 7]]
    .map((row) => row.map((n) => `[${profile.counts[n] ? String(n).repeat(profile.counts[n]) : "-"}]`).join(" "))
    .join("\n");

  return `HỒ SƠ THẦN SỐ HỌC

Họ tên: ${profile.name}
Ngày sinh: ${profile.date.raw}
Năm đang xem: ${profile.yearView}

1) Số chủ đạo: ${profile.lifePath}
${getLifePathText(profile.lifePath)}

2) Số thái độ: ${profile.attitude}
Số thái độ cho thấy cách bạn bước vào cuộc sống, cách người khác dễ cảm nhận bạn ở lớp ban đầu.

3) Số linh hồn: ${profile.soulUrge}
Số linh hồn phản ánh khao khát sâu bên trong và điều trái tim bạn thật sự cần.

4) Số nhân cách: ${profile.personality}
Số nhân cách phản ánh hình ảnh bên ngoài và cách bạn dễ được người khác nhìn nhận.

5) Số sứ mệnh / biểu đạt: ${profile.expression}
Số biểu đạt cho thấy cách bạn dùng năng lực, tên gọi và khả năng tự nhiên để tạo giá trị.

6) Biểu đồ ngày sinh
${chartRows}

7) Mũi tên cá tính
${profile.arrows.strong.length ? profile.arrows.strong.map((x) => `- ${x.title} (${x.subtitle})`).join("\n") : "- Không có mũi tên cá tính nổi bật theo 8 trục cơ bản."}

8) Mũi tên trống
${profile.arrows.empty.length ? profile.arrows.empty.map((x) => `- ${x.emptyName} (${x.subtitle})`).join("\n") : "- Không có mũi tên trống nổi bật theo 8 trục cơ bản."}

9) Kim tự tháp / 4 đỉnh cao
${profile.pinnacles.map((p) => {
  const startYear = profile.date.year + p.ageStart;
  const endYear = p.ageEnd == null ? null : profile.date.year + p.ageEnd;
  return `- ${p.title}: số ${p.number}, tuổi ${p.ageStart}${p.ageEnd == null ? "+" : `-${p.ageEnd}`}, năm ${startYear}${endYear == null ? "+" : `-${endYear}`}`;
}).join("\n")}

10) Năm cá nhân ${profile.yearView}: ${profile.personalYear}
${PERSONAL_YEAR_DATA[profile.personalYear]}

11) Các số phụ cá nhân
- Cầu nối thành công: ${profile.successBridge}
- Con số trưởng thành: ${profile.maturity}
- Cầu nối hạnh phúc: ${profile.happinessBridge}
- Bài học nghiệp: ${profile.karmicLessons.length ? profile.karmicLessons.join(", ") : "Không nổi bật"}
- Nợ nghiệp: ${profile.karmicDebts.length ? profile.karmicDebts.map(debtKey).join(", ") : "Không nổi bật"}
- Con số cân bằng: ${profile.balance}

Bên dưới có mục “Phân tích chuyên sâu cá nhân hoá”. Bấm “Mũi tên cá tính” hoặc “Mũi tên trống” để xem full nội dung từ file data_arrows.js.`;
}

function formatArrowDetail(item, index, typeLabel) {
  return `${index + 1}. ${item.dataTitle}
(${item.dataSubtitle})

Trạng thái: ${typeLabel}

${String(item.dataContent || "").trim()}`;
}

function getAdvancedContent(optionId, profile) {
  switch (optionId) {
    case "lifepath-full":
      return getLifePathText(profile.lifePath);

    case "arrows-strong":
      if (!profile.arrows.strong.length) return "Không có mũi tên cá tính nổi bật theo 8 trục cơ bản.";
      return profile.arrows.strong
        .map((x, i) => formatArrowDetail(x, i, "Mũi tên cá tính nổi bật"))
        .join("\n\n━━━━━━━━━━━━━━━━━━━━\n\n");

    case "arrows-empty":
      if (!profile.arrows.empty.length) return "Không có mũi tên trống nổi bật theo 8 trục cơ bản.";
      return profile.arrows.empty
        .map((x, i) => formatArrowDetail(x, i, "Mũi tên trống / vùng thiếu cần rèn"))
        .join("\n\n━━━━━━━━━━━━━━━━━━━━\n\n");

    case "pinnacles":
      return `DIỄN GIẢI 4 ĐỈNH CAO CUỘC ĐỜI

${profile.pinnacles.map((p, i) => {
  const startYear = profile.date.year + p.ageStart;
  const endYear = p.ageEnd == null ? null : profile.date.year + p.ageEnd;
  return `${i + 1}. ${p.title} — Số ${p.number}
Tuổi: ${p.ageStart}${p.ageEnd == null ? "+" : ` - ${p.ageEnd}`}
Năm: ${startYear}${endYear == null ? "+" : ` - ${endYear}`}`;
}).join("\n\n")}

Lưu ý: phần này đang hiển thị theo logic tính toán. Nếu anh có file data riêng cho luận giải từng số đỉnh cao, có thể tách thêm data_pinnacles.js.`;

    case "success":
      return SUCCESS_DATA[profile.successBridge] || fallbackData("Cầu nối thành công", profile.successBridge);

    case "growth":
      return GROWTH_DATA[profile.maturity] || fallbackData("Con số trưởng thành", profile.maturity);

    case "happiness":
      return HAPPINESS_DATA[profile.happinessBridge] || fallbackData("Cầu nối hạnh phúc", profile.happinessBridge);

    case "karma":
      if (!profile.karmicLessons.length) return "Không có bài học nghiệp nổi bật theo cách tính thiếu số 1–9.";
      return profile.karmicLessons
        .map((n, i) => `${i + 1}. ${KARMA_DATA[n] || fallbackData("Bài học nghiệp", n)}`)
        .join("\n\n━━━━━━━━━━━━━━━━━━━━\n\n");

    case "debt":
      if (!profile.karmicDebts.length) return "Không có nợ nghiệp nổi bật theo nhóm 13/4, 14/5, 16/7, 19/1.";
      return profile.karmicDebts
        .map((n, i) => {
          const key = debtKey(n);
          return `${i + 1}. ${DEBT_DATA[key] || DEBT_DATA[n] || fallbackData("Nợ nghiệp", key)}`;
        })
        .join("\n\n━━━━━━━━━━━━━━━━━━━━\n\n");

    case "balance":
      return GROWTH_DATA?.balance?.[profile.balance] || GROWTH_DATA?.[profile.balance] || fallbackData("Con số cân bằng", profile.balance);

    default:
      return "Chưa nhận diện được mục này.";
  }
}


function cleanSpeechText(text = "") {
  return String(text)
    .replace(/[★✦◆◇▪︎•●]/g, " ")
    .replace(/[━─]+/g, " ")
    .replace(/[↗↘△☉]/g, " ")
    .replace(/\bPRO MAX FINAL\b/gi, "")
    .replace(/\bPRO MAX\b/gi, "")
    .replace(/\bGPT\b/g, "G P T")
    .replace(/\bdd\/mm\/yyyy\b/gi, "ngày, tháng, năm")
    .replace(/(\d+)\/(\d+)/g, "$1 trên $2")
    .replace(/\s+/g, " ")
    .trim();
}

function getVietnameseVoice() {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return null;

  const voices = window.speechSynthesis.getVoices?.() || [];
  const scoreVoice = (voice) => {
    const lang = (voice.lang || "").toLowerCase();
    const name = (voice.name || "").toLowerCase();
    let score = 0;

    if (lang === "vi-vn") score += 100;
    if (lang.startsWith("vi")) score += 70;
    if (name.includes("vietnam") || name.includes("vietnamese")) score += 60;
    if (name.includes("an") || name.includes("linh") || name.includes("mai") || name.includes("hoai")) score += 20;
    if (voice.localService) score += 6;

    return score;
  };

  return voices
    .filter((voice) => {
      const lang = (voice.lang || "").toLowerCase();
      const name = (voice.name || "").toLowerCase();
      return lang.startsWith("vi") || name.includes("vietnam") || name.includes("vietnamese");
    })
    .sort((a, b) => scoreVoice(b) - scoreVoice(a))[0] || null;
}

function speakText(text) {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) {
    alert("Trình duyệt này chưa hỗ trợ đọc audio.");
    return;
  }

  const synth = window.speechSynthesis;
  const content = cleanSpeechText(text);

  if (!content) return;

  const speakNow = () => {
    synth.cancel();

    const utterance = new SpeechSynthesisUtterance(content);
    const vietnameseVoice = getVietnameseVoice();

    utterance.lang = "vi-VN";
    utterance.rate = 0.88;
    utterance.pitch = 1;
    utterance.volume = 1;

    if (vietnameseVoice) {
      utterance.voice = vietnameseVoice;
      utterance.lang = vietnameseVoice.lang || "vi-VN";
    }

    synth.speak(utterance);
  };

  const voices = synth.getVoices?.() || [];

  if (!voices.length) {
    synth.onvoiceschanged = () => speakNow();
    setTimeout(speakNow, 350);
    return;
  }

  speakNow();
}

function stopSpeak() {
  if (typeof window !== "undefined" && "speechSynthesis" in window) {
    window.speechSynthesis.cancel();
  }
}

function formatTime(iso) {
  return new Date(iso).toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" });
}

function StatCard({ label, value, tone = "normal", theme }) {
  return (
    <div className="ts-card" style={{ background: tone === "accent" ? theme.accentSoft : theme.panel, borderColor: theme.border }}>
      <div className="ts-card-label" style={{ color: theme.muted }}>{label}</div>
      <div className="ts-card-value" style={{ color: theme.text }}>{value}</div>
    </div>
  );
}

function BirthChart({ profile, theme }) {
  const rows = [[3, 6, 9], [2, 5, 8], [1, 4, 7]];
  return (
    <div className="pro-panel" style={{ background: theme.card, borderColor: theme.border }}>
      <div className="panel-head">
        <div>
          <h3 style={{ color: theme.text }}>Biểu đồ ngày sinh</h3>
          <p style={{ color: theme.muted }}>3-6-9 / 2-5-8 / 1-4-7</p>
        </div>
        <span className="panel-badge" style={{ background: theme.accentSoft, color: theme.text }}>Personal</span>
      </div>
      <div className="birth-grid">
        {rows.flat().map((n) => (
          <div key={n} className="birth-cell" style={{ background: theme.panel, borderColor: theme.border }}>
            <span style={{ color: theme.muted }}>{n}</span>
            <strong style={{ color: theme.text }}>{profile.counts[n] ? String(n).repeat(profile.counts[n]) : "—"}</strong>
          </div>
        ))}
      </div>
    </div>
  );
}

function ArrowPanel({ profile, theme }) {
  const patterns = ["1-2-3", "4-5-6", "7-8-9", "1-4-7", "2-5-8", "3-6-9", "1-5-9", "3-5-7"];
  const strong = new Set(profile.arrows.strong.map((x) => x.key));
  const empty = new Set(profile.arrows.empty.map((x) => x.key));

  return (
    <div className="pro-panel" style={{ background: theme.card, borderColor: theme.border }}>
      <div className="panel-head">
        <div>
          <h3 style={{ color: theme.text }}>Mũi tên</h3>
          <p style={{ color: theme.muted }}>Mạnh / Trống / Trung tính</p>
        </div>
      </div>
      <div className="arrow-grid">
        {patterns.map((key) => {
          const isStrong = strong.has(key);
          const isEmpty = empty.has(key);
          const meta = ARROW_META[key];

          return (
            <div
              key={key}
              className="arrow-chip"
              style={{
                background: isStrong ? theme.accentSoft : isEmpty ? theme.dangerSoft : theme.panel,
                borderColor: isStrong ? theme.accent : isEmpty ? theme.danger : theme.border,
                color: theme.text,
              }}
            >
              <strong>{meta?.title || key}</strong>
              <span style={{ color: theme.muted }}>{isStrong ? "Mạnh" : isEmpty ? "Trống" : "Trung tính"}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function PyramidPanel({ profile, theme }) {
  return (
    <div className="pro-panel" style={{ background: theme.card, borderColor: theme.border }}>
      <div className="panel-head">
        <div>
          <h3 style={{ color: theme.text }}>Kim tự tháp</h3>
          <p style={{ color: theme.muted }}>4 đỉnh cao cuộc đời</p>
        </div>
      </div>
      <div className="pyramid">
        <div className="p-node top" style={{ background: theme.panel, borderColor: theme.border, color: theme.text }}>{profile.pinnacles[2].number}</div>
        <div className="p-row">
          <div className="p-node" style={{ background: theme.panel, borderColor: theme.border, color: theme.text }}>{profile.pinnacles[0].number}</div>
          <div className="p-node" style={{ background: theme.panel, borderColor: theme.border, color: theme.text }}>{profile.pinnacles[1].number}</div>
        </div>
        <div className="p-node bottom" style={{ background: theme.accentSoft, borderColor: theme.accent, color: theme.text }}>{profile.pinnacles[3].number}</div>
      </div>
      <div className="timeline">
        {profile.pinnacles.map((p) => {
          const startYear = profile.date.year + p.ageStart;
          const endYear = p.ageEnd == null ? null : profile.date.year + p.ageEnd;
          return (
            <div key={p.title} className="timeline-item" style={{ borderColor: theme.border }}>
              <b style={{ color: theme.text }}>{p.title}: {p.number}</b>
              <span style={{ color: theme.muted }}>
                Tuổi {p.ageStart}{p.ageEnd == null ? "+" : `-${p.ageEnd}`} · Năm {startYear}{endYear == null ? "+" : `-${endYear}`}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function VisualPro({ profile, theme }) {
  if (!profile) return null;
  return (
    <div className="visual-pro">
      <div className="metrics-row">
        <StatCard theme={theme} label="Số chủ đạo" value={profile.lifePath} tone="accent" />
        <StatCard theme={theme} label="Linh hồn" value={profile.soulUrge} />
        <StatCard theme={theme} label="Nhân cách" value={profile.personality} />
        <StatCard theme={theme} label="Sứ mệnh" value={profile.expression} />
        <StatCard theme={theme} label="Năm cá nhân" value={profile.personalYear} tone="accent" />
        <StatCard theme={theme} label="Trưởng thành" value={profile.maturity} />
      </div>
      <div className="panel-grid">
        <BirthChart profile={profile} theme={theme} />
        <ArrowPanel profile={profile} theme={theme} />
        <PyramidPanel profile={profile} theme={theme} />
      </div>
    </div>
  );
}

function AdvancedButtons({ profile, onSelect, theme }) {
  if (!profile) return null;
  return (
    <div className="advanced-wrap">
      <div className="advanced-title" style={{ color: theme.text }}>
        <span>✦</span> Phân tích chuyên sâu cá nhân hoá
      </div>
      <div className="advanced-grid">
        {ADVANCED_OPTIONS.map((item) => (
          <button
            key={item.id}
            className="advanced-btn"
            style={{ background: theme.panel, borderColor: theme.border, color: theme.text }}
            onClick={() => onSelect(item.id, profile)}
          >
            <span className="adv-icon" style={{ background: theme.accentSoft }}>{item.icon}</span>
            <span>
              <b>{item.title}</b>
              <small style={{ color: theme.muted }}>{item.desc}</small>
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

function SecondaryButtons({ profile, onSelect, theme }) {
  if (!profile) return null;
  return (
    <div className="advanced-wrap">
      <div className="advanced-title" style={{ color: theme.text }}>
        <span>✦</span> Chọn một số phụ để xem full nội dung data
      </div>
      <div className="advanced-grid">
        {SECONDARY_OPTIONS.map((item) => (
          <button
            key={item.id}
            className="advanced-btn"
            style={{ background: theme.panel, borderColor: theme.border, color: theme.text }}
            onClick={() => onSelect(item.id, profile)}
          >
            <span className="adv-icon" style={{ background: theme.accentSoft }}>{item.icon}</span>
            <span>
              <b>{item.title}</b>
              <small style={{ color: theme.muted }}>
                {Array.isArray(profile[item.dataKey]) ? profile[item.dataKey].join(", ") || "Không nổi bật" : profile[item.dataKey]}
              </small>
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

function Message({ message, theme, onCopy, onAdvancedSelect }) {
  const isUser = message.role === "user";
  const isMainAnalysis = !isUser && message.kind === "main" && message.profile;
  const isSecondaryMenu = !isUser && message.kind === "secondary" && message.profile;

  return (
    <div className={`msg-row ${isUser ? "msg-user" : ""}`}>
      {!isUser && <div className="avatar ai promax-avatar" style={{ background: theme.accentSoft }}>✦</div>}
      <div
        className={`msg ${isUser ? "user-bubble" : "ai-bubble"} promax-message`}
        style={{
          background: isUser ? theme.userBubble : theme.assistantBubble,
          borderColor: theme.border,
          color: theme.text,
        }}
      >
        <div className="msg-meta">
          <b>{isUser ? "Bạn" : "Thần Số Học GPT"}</b>
          <span style={{ color: theme.muted }}>{formatTime(message.time)}</span>
        </div>
        <div className={message.kind === "deep" ? "full-data-text" : "msg-text"}>{message.content}</div>

        {/* PRO MAX FIX: bảng tổng quan chỉ hiện ở câu phân tích chính, không lặp lại ở câu trả lời sau */}
        {isMainAnalysis && <VisualPro profile={message.profile} theme={theme} />}
        {isMainAnalysis && <AdvancedButtons profile={message.profile} onSelect={onAdvancedSelect} theme={theme} />}
        {isSecondaryMenu && <SecondaryButtons profile={message.profile} onSelect={onAdvancedSelect} theme={theme} />}

        {!isUser && (
          <div className="audio-actions">
            <button className="voice-btn" style={{ color: theme.text, borderColor: theme.border }} onClick={() => onCopy(message.content)}>
              Sao chép
            </button>
            <button className="voice-btn" style={{ color: theme.text, borderColor: theme.border }} onClick={() => speakText(message.content)}>
              🔊 Nghe
            </button>
            <button className="voice-btn" style={{ color: theme.text, borderColor: theme.border }} onClick={stopSpeak}>
              ⏹ Dừng
            </button>
          </div>
        )}
      </div>
      {isUser && <div className="avatar user promax-avatar" style={{ background: theme.panel }}>👤</div>}
    </div>
  );
}

export default function App() {
  const [settings, setSettings] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(SETTINGS_KEY)) || { themeMode: "dark", yearView: 2026 };
    } catch {
      return { themeMode: "dark", yearView: 2026 };
    }
  });

  const [messages, setMessages] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [
        {
          id: makeId("welcome"),
          role: "assistant",
          kind: "main",
          content: "Xin chào, tôi là Thần Số Học GPT. Bạn hãy nhập họ tên và ngày sinh theo dạng dd/mm/yyyy. Sau khi có kết quả, bấm các mục chuyên sâu để xem full nội dung từ data đã update.",
          time: new Date().toISOString(),
          profile: null,
        },
      ];
    } catch {
      return [];
    }
  });

  const [history, setHistory] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(HISTORY_KEY)) || [];
    } catch {
      return [];
    }
  });

  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const textareaRef = useRef(null);
  const endRef = useRef(null);
  const recognitionRef = useRef(null);
  const [isListening, setIsListening] = useState(false);
  const theme = settings.themeMode === "light" ? lightTheme : darkTheme;

  useEffect(() => localStorage.setItem(STORAGE_KEY, JSON.stringify(messages)), [messages]);
  useEffect(() => localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings)), [settings]);
  useEffect(() => localStorage.setItem(HISTORY_KEY, JSON.stringify(history)), [history]);
  useEffect(() => {
    document.body.style.background = theme.appBg;
    document.body.style.color = theme.text;
  }, [theme]);
  useEffect(() => endRef.current?.scrollIntoView({ behavior: "smooth" }), [messages, typing]);
  useEffect(() => {
    if (!textareaRef.current) return;
    textareaRef.current.style.height = "auto";
    textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 220)}px`;
  }, [input]);

  useEffect(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;

    const synth = window.speechSynthesis;
    const loadVietnameseVoices = () => {
      synth.getVoices?.();
      getVietnameseVoice();
    };

    loadVietnameseVoices();
    synth.onvoiceschanged = loadVietnameseVoices;

    return () => {
      synth.onvoiceschanged = null;
    };
  }, []);

  useEffect(() => {
    return () => {
      stopSpeak();
      try {
        recognitionRef.current?.stop?.();
      } catch {
        // ignore cleanup errors
      }
    };
  }, []);

  async function copyText(text) {
    try {
      await navigator.clipboard.writeText(text);
      alert("Đã sao chép");
    } catch {
      alert("Không sao chép được");
    }
  }

  function saveHistory(profile) {
    const item = {
      id: `${profile.name}-${profile.date.raw}`,
      name: profile.name,
      dob: profile.date.raw,
      lifePath: profile.lifePath,
      prompt: `Tôi tên ${profile.name}, sinh ngày ${profile.date.raw}`,
      time: new Date().toISOString(),
    };
    setHistory((prev) => [item, ...prev.filter((x) => x.id !== item.id)].slice(0, 14));
  }

  async function send(customText) {
    const text = (customText ?? input).trim();
    if (!text) return;
    setInput("");
    setMessages((prev) => [...prev, { id: makeId("user"), role: "user", kind: "user", content: text, time: new Date().toISOString(), profile: null }]);
    setTyping(true);

    setTimeout(() => {
      const { name, date } = extractNameAndDate(text);

      if (!date) {
        setMessages((prev) => [
          ...prev,
          {
            id: makeId("assistant"),
            role: "assistant",
            kind: "main",
            content: "Tôi chưa thấy ngày sinh hợp lệ. Anh/chị nhập theo mẫu: Tôi tên Nguyễn Hoàng Long, sinh ngày 17/01/1989",
            time: new Date().toISOString(),
            profile: null,
          },
        ]);
        setTyping(false);
        return;
      }

      const profile = buildProfile(name, date, settings.yearView);
      saveHistory(profile);
      setMessages((prev) => [
        ...prev,
        {
          id: makeId("assistant"),
          role: "assistant",
          kind: "main",
          content: buildMainReply(profile),
          time: new Date().toISOString(),
          profile,
        },
      ]);
      setTyping(false);
    }, 600);
  }

  function analyzeSelectedYear() {
    const lastProfile = [...messages].reverse().find((m) => m.profile)?.profile;

    if (!lastProfile) {
      setMessages((prev) => [
        ...prev,
        {
          id: makeId("year-warning"),
          role: "assistant",
          kind: "deep",
          content: "Anh cần phân tích một người trước đã. Ví dụ: Tôi tên Nguyễn Hoàng Long, sinh ngày 17/01/1989. Sau đó chọn năm và bấm OK để xem phân tích năm cá nhân.",
          time: new Date().toISOString(),
          profile: null,
        },
      ]);
      return;
    }

    const newProfile = buildProfile(lastProfile.name, lastProfile.date, settings.yearView);

    const content = `PHÂN TÍCH NĂM CÁ NHÂN ${settings.yearView}

Họ tên: ${newProfile.name}
Ngày sinh: ${newProfile.date.raw}

Năm cá nhân: ${newProfile.personalYear}

${PERSONAL_YEAR_DATA[newProfile.personalYear] || "Chưa có dữ liệu năm cá nhân này."}

LUẬN GIẢI CÁ NHÂN HÓA:
Năm ${settings.yearView} của ${newProfile.name} mang năng lượng số ${newProfile.personalYear}. Đây là chu kỳ ảnh hưởng trực tiếp đến cảm xúc, lựa chọn, công việc, quan hệ và hướng phát triển trong năm.

HƯỚNG ỨNG DỤNG TRONG NĂM:
- Quan sát năng lượng chính của năm cá nhân ${newProfile.personalYear}.
- Không nên đi ngược nhịp năm cá nhân.
- Dùng năm này để điều chỉnh kế hoạch công việc, tài chính, tình cảm và định hướng bản thân.

GỢI Ý THEO HỒ SƠ CÁ NHÂN:
- Số chủ đạo: ${newProfile.lifePath}
- Số linh hồn: ${newProfile.soulUrge}
- Số nhân cách: ${newProfile.personality}
- Cầu nối thành công: ${newProfile.successBridge}
- Cầu nối hạnh phúc: ${newProfile.happinessBridge}

Nếu muốn xem lại toàn bộ hồ sơ với năm ${settings.yearView}, anh có thể bấm lại gợi ý hoặc nhập lại tên + ngày sinh.`;

    setMessages((prev) => [
      ...prev,
      {
        id: makeId("personal-year"),
        role: "assistant",
        kind: "deep",
        content,
        time: new Date().toISOString(),
        profile: newProfile,
      },
    ]);
  }

  function handleAdvancedSelect(optionId, profile) {
    if (optionId === "secondary") {
      setMessages((prev) => [
        ...prev,
        {
          id: makeId("secondary"),
          role: "assistant",
          kind: "secondary",
          content: "Đã mở mục Các số phụ. Chọn một mục bên dưới để xem full nội dung data theo đúng con số cá nhân.",
          time: new Date().toISOString(),
          profile,
        },
      ]);
      return;
    }

    setMessages((prev) => [
      ...prev,
      {
        id: makeId("deep"),
        role: "assistant",
        kind: "deep",
        content: getAdvancedContent(optionId, profile),
        time: new Date().toISOString(),
        profile: null,
      },
    ]);
  }

  function startVoiceInput() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Trình duyệt này chưa hỗ trợ nhập giọng nói. Anh nên dùng Chrome trên Android hoặc Chrome/Edge trên máy tính.");
      return;
    }

    if (isListening) {
      try {
        recognitionRef.current?.stop?.();
      } catch {
        // ignore stop errors
      }
      setIsListening(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;
    recognition.lang = "vi-VN";
    recognition.interimResults = false;
    recognition.continuous = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => setIsListening(true);

    recognition.onerror = () => {
      setIsListening(false);
      alert("Chưa nghe được giọng nói. Anh kiểm tra quyền micro rồi thử lại.");
    };

    recognition.onend = () => setIsListening(false);

    recognition.onresult = (event) => {
      const transcript = Array.from(event.results)
        .map((result) => result[0]?.transcript || "")
        .join(" ")
        .trim();

      if (!transcript) return;

      setInput(transcript);
      setTimeout(() => send(transcript), 120);
    };

    recognition.start();
  }

  function resetChat() {
    setMessages([
      {
        id: makeId("welcome"),
        role: "assistant",
        kind: "main",
        content: "Xin chào, tôi là Thần Số Học GPT. Bạn hãy nhập họ tên và ngày sinh theo dạng dd/mm/yyyy. Sau khi có kết quả, bấm các mục chuyên sâu để xem full nội dung từ data đã update.",
        time: new Date().toISOString(),
        profile: null,
      },
    ]);
  }

  return (
    <>
      <style>{css}</style>
      <div className="app" style={{ background: theme.appBg }}>
        <aside className="sidebar" style={{ background: theme.sidebarBg, borderColor: theme.border }}>
          <div className="brand">
            <h1 style={{ color: theme.text }}>Thần Số Học GPT</h1>
            <p style={{ color: theme.muted }}>PRO MAX FINAL · Mobile first · Galaxy AI interface</p>
          </div>

          <button className="new-btn" style={{ background: theme.accent }} onClick={resetChat}>
            ✨ Cuộc trò chuyện mới
          </button>

          <div className="side-card" style={{ background: theme.card, borderColor: theme.border }}>
            <h3 style={{ color: theme.text }}>Tùy chọn</h3>
            <label style={{ color: theme.muted, fontSize: 12 }}>Năm cần xem</label>

            <div style={{ display: "flex", gap: 8, marginTop: 6, marginBottom: 10 }}>
              <input
                className="input"
                style={{ background: theme.panel, borderColor: theme.border, color: theme.text, flex: 1 }}
                type="number"
                value={settings.yearView}
                onChange={(e) => setSettings((p) => ({ ...p, yearView: Number(e.target.value) || new Date().getFullYear() }))}
              />
              <button
                className="mini-btn"
                style={{ color: "#fff", borderColor: theme.accent, background: theme.accent, fontWeight: 800 }}
                onClick={analyzeSelectedYear}
              >
                OK
              </button>
            </div>

            <div className="row">
              <button
                className="mini-btn"
                style={{ color: theme.text, borderColor: theme.border, background: settings.themeMode === "dark" ? theme.accentSoft : "transparent" }}
                onClick={() => setSettings((p) => ({ ...p, themeMode: "dark" }))}
              >
                🌙 Dark
              </button>
              <button
                className="mini-btn"
                style={{ color: theme.text, borderColor: theme.border, background: settings.themeMode === "light" ? theme.accentSoft : "transparent" }}
                onClick={() => setSettings((p) => ({ ...p, themeMode: "light" }))}
              >
                ☀️ Light
              </button>
              <button className="mini-btn" style={{ color: theme.text, borderColor: theme.border }} onClick={resetChat}>
                Xóa chat
              </button>
            </div>
          </div>

          <div className="side-card" style={{ background: theme.card, borderColor: theme.border }}>
            <h3 style={{ color: theme.text }}>Lịch sử người dùng</h3>
            {history.length === 0 ? (
              <p style={{ color: theme.muted, fontSize: 13 }}>Chưa có hồ sơ.</p>
            ) : (
              history.map((h) => (
                <div key={h.id} className="history-item" style={{ background: theme.panel, borderColor: theme.border }} onClick={() => send(h.prompt)}>
                  <b style={{ color: theme.text }}>{h.name}</b>
                  <span style={{ color: theme.muted }}>{h.dob} · Số chủ đạo {h.lifePath}</span>
                </div>
              ))
            )}
          </div>
        </aside>

        <main className="main" style={{ background: theme.mainBg }}>
          <header className="header" style={{ background: `${theme.mainBg}dd` }}>
            <h2 style={{ color: theme.text }}>Thần Số Học GPT</h2>
            <p style={{ color: theme.muted }}>PRO MAX FINAL · tối ưu mobile · galaxy glass · full data</p>
          </header>

          <section className="chat">
            {messages.length <= 1 && (
              <div className="hero" style={{ background: theme.card, borderColor: theme.border }}>
                <h1 style={{ color: theme.text }}>Thần Số Học GPT</h1>
                <p style={{ color: theme.muted }}>
                  Nhập họ tên và ngày sinh. Ứng dụng sẽ tính hồ sơ cá nhân, hiển thị biểu đồ minh hoạ và mở nội dung chuyên sâu từ các file data riêng.
                </p>
                <div className="hero-grid">
                  <div className="hero-card" style={{ background: theme.panel, borderColor: theme.border }}>
                    <h3 style={{ color: theme.text }}>Bắt đầu phân tích</h3>
                    <p style={{ color: theme.muted }}>Nhập họ tên và ngày sinh vào ô chat bên dưới để xem hồ sơ cá nhân.</p>
                  </div>
                  <div className="hero-card" style={{ background: theme.panel, borderColor: theme.border }}>
                    <h3 style={{ color: theme.text }}>Xem năm cá nhân</h3>
                    <p style={{ color: theme.muted }}>Sau khi phân tích, chọn năm ở thanh bên trái và bấm OK.</p>
                  </div>
                  <div className="hero-card" style={{ background: theme.panel, borderColor: theme.border }}>
                    <h3 style={{ color: theme.text }}>Mở dữ liệu chuyên sâu</h3>
                    <p style={{ color: theme.muted }}>Bấm các mục bên dưới câu trả lời để xem full data.</p>
                  </div>
                </div>
              </div>
            )}

            {messages.map((m) => (
              <Message key={m.id} message={m} theme={theme} onCopy={copyText} onAdvancedSelect={handleAdvancedSelect} />
            ))}

            {typing && (
              <div className="msg-row">
                <div className="avatar ai" style={{ background: theme.accentSoft }}>✦</div>
                <div className="msg" style={{ background: theme.assistantBubble, borderColor: theme.border }}>
                  <div style={{ display: "flex", gap: 7 }}>
                    <span style={{ width: 8, height: 8, borderRadius: 99, background: theme.accent }} />
                    <span style={{ width: 8, height: 8, borderRadius: 99, background: theme.accent }} />
                    <span style={{ width: 8, height: 8, borderRadius: 99, background: theme.accent }} />
                  </div>
                </div>
              </div>
            )}

            <div ref={endRef} />
          </section>

          <div className="inputbar" style={{ background: `${theme.mainBg}dd` }}>
            <div className="input-inner">
              <div className="input-box" style={{ background: theme.inputBg, borderColor: theme.border }}>
                <textarea
                  ref={textareaRef}
                  className="textarea"
                  style={{ color: theme.text }}
                  value={input}
                  rows={1}
                  placeholder="Nhập họ tên và ngày sinh của bạn..."
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      send();
                    }
                  }}
                />
                <button
                  className={`mic-btn ${isListening ? "listening" : ""}`}
                  style={{ color: "#fff", borderColor: isListening ? theme.danger : theme.border, background: isListening ? theme.danger : theme.panel }}
                  title="Nói để nhập nội dung"
                  type="button"
                  onClick={startVoiceInput}
                >
                  {isListening ? "●" : "🎙️"}
                </button>
                <button className="send" style={{ background: input.trim() ? theme.accent : theme.border }} disabled={!input.trim()} onClick={() => send()}>
                  ➤
                </button>
              </div>
              <div className="hint" style={{ color: theme.muted }}>
                Ví dụ: Tôi tên Nguyễn Hoàng Long, sinh ngày 17/01/1989
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
