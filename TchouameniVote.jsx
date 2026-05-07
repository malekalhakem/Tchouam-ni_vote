import { useState, useEffect } from "react";

const STORAGE_KEY_STAY = "tchaouméni_votes_stay";
const STORAGE_KEY_LEAVE = "tchaouméni_votes_leave";
const STORAGE_KEY_VOTED = "tchaouméni_user_voted";
const TARGET = 200000;

export default function TchaouméniVote() {
  const [votesStay, setVotesStay] = useState(0);
  const [votesLeave, setVotesLeave] = useState(0);
  const [hasVoted, setHasVoted] = useState(false);
  const [userVote, setUserVote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [animating, setAnimating] = useState(null);
  const [showFlash, setShowFlash] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        const stay = await window.storage.get(STORAGE_KEY_STAY, true);
        const leave = await window.storage.get(STORAGE_KEY_LEAVE, true);
        const voted = await window.storage.get(STORAGE_KEY_VOTED);
        setVotesStay(stay ? parseInt(stay.value) : 0);
        setVotesLeave(leave ? parseInt(leave.value) : 0);
        if (voted) {
          setHasVoted(true);
          setUserVote(voted.value);
        }
      } catch (e) {
        setVotesStay(0);
        setVotesLeave(0);
      }
      setLoading(false);
    };
    loadData();
  }, []);

  const vote = async (type) => {
    if (hasVoted) return;
    setAnimating(type);
    setShowFlash(true);
    setTimeout(() => setShowFlash(false), 600);

    const newStay = type === "stay" ? votesStay + 1 : votesStay;
    const newLeave = type === "leave" ? votesLeave + 1 : votesLeave;

    try {
      await window.storage.set(STORAGE_KEY_STAY, String(newStay), true);
      await window.storage.set(STORAGE_KEY_LEAVE, String(newLeave), true);
      await window.storage.set(STORAGE_KEY_VOTED, type);
    } catch (e) {}

    setVotesStay(newStay);
    setVotesLeave(newLeave);
    setHasVoted(true);
    setUserVote(type);
    setTimeout(() => setAnimating(null), 600);
  };

  const total = votesStay + votesLeave;
  const stayPct = total > 0 ? Math.round((votesStay / total) * 100) : 50;
  const leavePct = total > 0 ? Math.round((votesLeave / total) * 100) : 50;
  const leaveProgress = total > 0 ? Math.min((votesLeave / TARGET) * 100, 100) : 0;

  const fmt = (n) => n.toLocaleString("en");

  return (
    <div style={{
      minHeight: "100vh",
      background: "#080808",
      fontFamily: "'Bebas Neue', 'Impact', sans-serif",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "flex-start",
      padding: "0 0 60px 0",
      overflowX: "hidden",
      position: "relative",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Barlow+Condensed:wght@400;600;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes pulse { 0%,100% { opacity:1; } 50% { opacity:.4; } }
        @keyframes flashRed { 0% { opacity:0; } 30% { opacity:.18; } 100% { opacity:0; } }
        @keyframes flashGreen { 0% { opacity:0; } 30% { opacity:.13; } 100% { opacity:0; } }
        @keyframes barGrow { from { width: 0; } }
        @keyframes shake { 0%,100%{transform:translateX(0)} 25%{transform:translateX(-6px)} 75%{transform:translateX(6px)} }
        @keyframes scanline { 0%{transform:translateY(-100%)} 100%{transform:translateY(100vh)} }
        @keyframes shimmer { 0%{background-position:200% center} 100%{background-position:-200% center} }
        @keyframes glowPulse { 0%,100%{text-shadow:0 0 8px #a78bfa,0 0 20px #7c3aed} 50%{text-shadow:0 0 16px #c4b5fd,0 0 40px #a78bfa,0 0 60px #7c3aed} }
        .malek-sig {
          background: linear-gradient(90deg, #7c3aed, #a78bfa, #e879f9, #a78bfa, #7c3aed);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: shimmer 3s linear infinite;
          font-family: 'Bebas Neue', sans-serif;
          letter-spacing: 0.2em;
        }
        .vote-btn { cursor: pointer; border: none; outline: none; transition: transform .15s, filter .15s; }
        .vote-btn:hover:not(:disabled) { transform: scale(1.04); filter: brightness(1.15); }
        .vote-btn:active:not(:disabled) { transform: scale(.97); }
        .vote-btn:disabled { opacity: .5; cursor: not-allowed; }
        .bar-fill { animation: barGrow .9s cubic-bezier(.4,0,.2,1) forwards; }
      `}</style>

      {/* Scanline overlay */}
      <div style={{
        position: "fixed", top: 0, left: 0, right: 0, bottom: 0, pointerEvents: "none", zIndex: 0,
        background: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,.06) 2px, rgba(0,0,0,.06) 4px)",
      }} />

      {/* Flash effect */}
      {showFlash && userVote === "leave" && (
        <div style={{ position:"fixed",inset:0,background:"#ff1a1a",animation:"flashRed .6s ease forwards",pointerEvents:"none",zIndex:99 }} />
      )}
      {showFlash && userVote === "stay" && (
        <div style={{ position:"fixed",inset:0,background:"#00d68f",animation:"flashGreen .6s ease forwards",pointerEvents:"none",zIndex:99 }} />
      )}

      {/* Header band */}
      <div style={{
        width:"100%", background:"#c8102e", padding:"10px 0", textAlign:"center",
        letterSpacing:"0.25em", fontSize:"13px", color:"#fff", fontFamily:"'Barlow Condensed',sans-serif",
        fontWeight:600, zIndex:1, position:"relative"
      }}>
        ⚽ REAL MADRID • TEMPORADA 2024/25 • DECISIÓN FINAL ⚽
        &nbsp;&nbsp;·&nbsp;&nbsp;<span className="malek-sig">MALEK AL HAKEM</span>
      </div>

      {/* Hero section */}
      <div style={{
        width:"100%", maxWidth:520, padding:"0 20px",
        animation:"fadeUp .7s ease both", zIndex:1, position:"relative"
      }}>

        {/* Big title */}
        <div style={{ textAlign:"center", marginTop:32, marginBottom:0 }}>
          <div style={{
            fontSize:"13px", letterSpacing:"0.4em", color:"#888",
            fontFamily:"'Barlow Condensed',sans-serif", fontWeight:600, marginBottom:8
          }}>هل تريد أن يرحل؟</div>
          <h1 style={{
            fontSize:"clamp(52px,14vw,88px)", color:"#fff", lineHeight:.9,
            letterSpacing:"0.04em", textShadow:"0 0 60px rgba(200,16,46,.5)"
          }}>TCHOUAMÉNI</h1>
          <div style={{ fontSize:"clamp(18px,5vw,28px)", color:"#c8102e", letterSpacing:"0.3em", marginTop:6 }}>
            يبقى أم يمشي؟
          </div>
        </div>

        {/* Player photo */}
        <div style={{ display:"flex", justifyContent:"center", marginTop:16, position:"relative" }}>
          <div style={{
            width:220, height:220, borderRadius:"50%",
            border:"3px solid #c8102e",
            background:"#111",
            overflow:"hidden",
            boxShadow:"0 0 60px rgba(200,16,46,.35), 0 0 120px rgba(200,16,46,.15)",
            display:"flex", alignItems:"center", justifyContent:"center",
            position:"relative"
          }}>
            <img
              src="https://img.a.transfermarkt.technology/portrait/header/342229-1695302375.jpg"
              alt="Tchouaméni"
              style={{ width:"100%", height:"100%", objectFit:"cover", objectPosition:"top", filter:"grayscale(20%) contrast(1.1)" }}
              onError={e => { e.target.style.display="none"; }}
            />
          </div>
          {/* Number 18 badge */}
          <div style={{
            position:"absolute", bottom:5, right:"calc(50% - 130px)",
            width:44, height:44, borderRadius:"50%",
            background:"#c8102e", display:"flex", alignItems:"center", justifyContent:"center",
            fontSize:20, color:"#fff", fontFamily:"'Bebas Neue',sans-serif",
            border:"2px solid #080808", boxShadow:"0 2px 12px rgba(200,16,46,.7)"
          }}>18</div>
        </div>

        {/* Name card */}
        <div style={{ textAlign:"center", marginTop:10 }}>
          <div style={{ fontSize:14, color:"#555", letterSpacing:"0.2em", fontFamily:"'Barlow Condensed',sans-serif" }}>
            AURÉLIEN · TCHOUAMÉNI
          </div>
          <div style={{ marginTop:8, fontSize:11, letterSpacing:"0.15em", fontFamily:"'Barlow Condensed',sans-serif", color:"#444" }}>
            CREATED BY <span className="malek-sig" style={{ fontSize:14 }}>MALEK AL HAKEM</span>
          </div>
        </div>

        {/* Target warning */}
        <div style={{
          margin:"24px 0 0", background:"#0d0d0d",
          border:"1px solid #2a0a0a", borderLeft:"4px solid #c8102e",
          padding:"14px 18px", borderRadius:4,
          fontFamily:"'Barlow Condensed',sans-serif"
        }}>
          <div style={{ color:"#c8102e", fontSize:13, letterSpacing:"0.15em", marginBottom:4 }}>⚠ هدف الرحيل</div>
          <div style={{ color:"#fff", fontSize:"clamp(24px,6vw,36px)", letterSpacing:"0.08em" }}>
            {fmt(TARGET)} <span style={{ fontSize:16, color:"#666" }}>صوت</span>
          </div>
          <div style={{ color:"#555", fontSize:12, fontFamily:"'Barlow Condensed',sans-serif", marginTop:2 }}>
            لو وصلنا {fmt(TARGET)} صوت "يمشي" — يمشي
          </div>
        </div>

        {/* Progress to target */}
        <div style={{ marginTop:16 }}>
          <div style={{ display:"flex", justifyContent:"space-between", marginBottom:6, fontFamily:"'Barlow Condensed',sans-serif" }}>
            <span style={{ color:"#888", fontSize:12, letterSpacing:"0.1em" }}>تقدم أصوات الرحيل</span>
            <span style={{ color:"#c8102e", fontSize:14 }}>{fmt(votesLeave)} / {fmt(TARGET)}</span>
          </div>
          <div style={{ height:8, background:"#1a1a1a", borderRadius:2, overflow:"hidden" }}>
            <div className="bar-fill" style={{
              height:"100%", width:`${leaveProgress}%`,
              background:"linear-gradient(90deg,#8b0000,#c8102e,#ff4444)",
              borderRadius:2, transition:"width .9s cubic-bezier(.4,0,.2,1)"
            }} />
          </div>
          <div style={{ textAlign:"right", fontSize:11, color:"#444", marginTop:4, fontFamily:"'Barlow Condensed',sans-serif" }}>
            {leaveProgress.toFixed(1)}% من الهدف
          </div>
        </div>

        {/* Vote buttons */}
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14, marginTop:28 }}>
          {/* STAY */}
          <button
            className="vote-btn"
            disabled={hasVoted || loading}
            onClick={() => vote("stay")}
            style={{
              background: hasVoted && userVote==="stay"
                ? "linear-gradient(135deg,#003d1a,#00a854)"
                : "linear-gradient(135deg,#0a1a0a,#0d2b0d)",
              border: userVote==="stay" ? "2px solid #00d68f" : "1px solid #1a3a1a",
              borderRadius:6, padding:"22px 12px",
              color: userVote==="stay" ? "#00d68f" : "#4caf50",
              fontSize:"clamp(22px,6vw,34px)",
              letterSpacing:"0.05em",
              boxShadow: userVote==="stay"
                ? "0 0 30px rgba(0,214,143,.25), inset 0 0 20px rgba(0,214,143,.05)"
                : "none",
              animation: animating==="stay" ? "shake .3s ease" : "none"
            }}
          >
            <div>✅</div>
            <div style={{ fontSize:"clamp(16px,4vw,22px)", marginTop:4 }}>يبقى</div>
            <div style={{ fontSize:12, color:"#2d6b2d", marginTop:4, fontFamily:"'Barlow Condensed',sans-serif" }}>
              {fmt(votesStay)} صوت
            </div>
          </button>

          {/* LEAVE */}
          <button
            className="vote-btn"
            disabled={hasVoted || loading}
            onClick={() => vote("leave")}
            style={{
              background: hasVoted && userVote==="leave"
                ? "linear-gradient(135deg,#3d0000,#8b0000)"
                : "linear-gradient(135deg,#1a0a0a,#2b0d0d)",
              border: userVote==="leave" ? "2px solid #c8102e" : "1px solid #3a1a1a",
              borderRadius:6, padding:"22px 12px",
              color: userVote==="leave" ? "#ff4444" : "#c8102e",
              fontSize:"clamp(22px,6vw,34px)",
              letterSpacing:"0.05em",
              boxShadow: userVote==="leave"
                ? "0 0 30px rgba(200,16,46,.35), inset 0 0 20px rgba(200,16,46,.08)"
                : "none",
              animation: animating==="leave" ? "shake .3s ease" : "none"
            }}
          >
            <div>❌</div>
            <div style={{ fontSize:"clamp(16px,4vw,22px)", marginTop:4 }}>يمشي</div>
            <div style={{ fontSize:12, color:"#6b2d2d", marginTop:4, fontFamily:"'Barlow Condensed',sans-serif" }}>
              {fmt(votesLeave)} صوت
            </div>
          </button>
        </div>

        {hasVoted && (
          <div style={{
            marginTop:14, textAlign:"center",
            fontFamily:"'Barlow Condensed',sans-serif", fontSize:13,
            color: userVote==="leave" ? "#c8102e" : "#00d68f",
            letterSpacing:"0.15em", animation:"fadeUp .4s ease both"
          }}>
            {userVote==="leave" ? "🔴 صوتك: يمشي" : "🟢 صوتك: يبقى"} · شكراً على تصويتك
          </div>
        )}

        {/* Live stats */}
        <div style={{
          marginTop:28, background:"#0a0a0a",
          border:"1px solid #1c1c1c", borderRadius:8, overflow:"hidden"
        }}>
          <div style={{
            background:"#111", padding:"10px 18px",
            fontFamily:"'Barlow Condensed',sans-serif",
            fontSize:11, letterSpacing:"0.3em", color:"#555",
            borderBottom:"1px solid #1c1c1c"
          }}>
            📊 نتائج التصويت LIVE
          </div>

          {/* Stay bar */}
          <div style={{ padding:"16px 18px 8px" }}>
            <div style={{ display:"flex", justifyContent:"space-between", marginBottom:6 }}>
              <span style={{ color:"#4caf50", fontFamily:"'Barlow Condensed',sans-serif", fontSize:16, letterSpacing:"0.1em" }}>
                يبقى
              </span>
              <span style={{ color:"#4caf50", fontFamily:"'Barlow Condensed',sans-serif", fontSize:20 }}>
                {stayPct}%
              </span>
            </div>
            <div style={{ height:10, background:"#1a1a1a", borderRadius:2, overflow:"hidden" }}>
              <div style={{
                height:"100%", width:`${stayPct}%`,
                background:"linear-gradient(90deg,#1a4d1a,#4caf50)",
                borderRadius:2, transition:"width 1s cubic-bezier(.4,0,.2,1)"
              }} />
            </div>
            <div style={{ color:"#2d6b2d", fontSize:12, marginTop:4, fontFamily:"'Barlow Condensed',sans-serif" }}>
              {fmt(votesStay)} صوت
            </div>
          </div>

          {/* Leave bar */}
          <div style={{ padding:"8px 18px 16px" }}>
            <div style={{ display:"flex", justifyContent:"space-between", marginBottom:6 }}>
              <span style={{ color:"#c8102e", fontFamily:"'Barlow Condensed',sans-serif", fontSize:16, letterSpacing:"0.1em" }}>
                يمشي
              </span>
              <span style={{ color:"#c8102e", fontFamily:"'Barlow Condensed',sans-serif", fontSize:20 }}>
                {leavePct}%
              </span>
            </div>
            <div style={{ height:10, background:"#1a1a1a", borderRadius:2, overflow:"hidden" }}>
              <div style={{
                height:"100%", width:`${leavePct}%`,
                background:"linear-gradient(90deg,#5c0000,#c8102e)",
                borderRadius:2, transition:"width 1s cubic-bezier(.4,0,.2,1)"
              }} />
            </div>
            <div style={{ color:"#6b1010", fontSize:12, marginTop:4, fontFamily:"'Barlow Condensed',sans-serif" }}>
              {fmt(votesLeave)} صوت
            </div>
          </div>

          <div style={{
            borderTop:"1px solid #1c1c1c", padding:"10px 18px",
            display:"flex", justifyContent:"space-between",
            fontFamily:"'Barlow Condensed',sans-serif"
          }}>
            <span style={{ color:"#444", fontSize:12, letterSpacing:"0.1em" }}>إجمالي الأصوات</span>
            <span style={{ color:"#888", fontSize:16 }}>{fmt(total)}</span>
          </div>
        </div>

        {/* Footer */}
        <div style={{
          marginTop:28, textAlign:"center",
          fontFamily:"'Barlow Condensed',sans-serif", fontSize:11,
          color:"#2a2a2a", letterSpacing:"0.2em"
        }}>
          REAL MADRID CF · FAN POLL · {new Date().getFullYear()}<br/>
          <span style={{ color:"#1a1a1a" }}>الأصوات محفوظة ومشتركة بين جميع المستخدمين</span><br/>
          <div style={{ marginTop:12 }}>
            <span className="malek-sig" style={{ fontSize:18 }}>MALEK AL HAKEM</span>
          </div>
        </div>
      </div>
    </div>
  );
}