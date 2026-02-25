import { useState, useEffect } from "react";

const C = {
  bg:"#050c18", surface:"#0d1b2e", card:"#0f2137", border:"#1a3a5c",
  accent:"#00e5ff", gold:"#f4b942", green:"#00e676", red:"#ff5252",
  purple:"#b388ff", text:"#e0f2fe", muted:"#4a7090", dim:"#1e3a56",
};

const SEED = {
  users:[
    {id:1,name:"Athi Kumar",role:"lead",team:"Alpha",avatar:"AK",email:"athi@dept.edu"},
    {id:2,name:"Priya Sharma",role:"student",team:"Beta",avatar:"PS",email:"priya@dept.edu"},
    {id:3,name:"Ravi Patel",role:"student",team:"Alpha",avatar:"RP",email:"ravi@dept.edu"},
    {id:4,name:"Sneha Nair",role:"admin",team:"-",avatar:"SN",email:"admin@dept.edu"},
    {id:5,name:"Karthik R",role:"student",team:"Gamma",avatar:"KR",email:"karthik@dept.edu"},
    {id:6,name:"Divya M",role:"student",team:"Beta",avatar:"DM",email:"divya@dept.edu"},
    {id:7,name:"Arjun S",role:"student",team:"Gamma",avatar:"AS",email:"arjun@dept.edu"},
  ],
  teams:[
    {id:1,name:"Alpha",project:"Smart Inventory System",lead:"Athi Kumar",members:["Athi Kumar","Ravi Patel"],progress:64,status:"active"},
    {id:2,name:"Beta",project:"Geo-Tech Analytics Dashboard",lead:"Priya Sharma",members:["Priya Sharma","Divya M"],progress:82,status:"active"},
    {id:3,name:"Gamma",project:"AI Attendance Tracker",lead:"Karthik R",members:["Karthik R","Arjun S"],progress:91,status:"active"},
  ],
  tasks:[
    {id:1,title:"Design System Architecture",team:"Alpha",assignee:"Athi Kumar",deadline:"2025-08-10",priority:"high",status:"in-progress",score:null},
    {id:2,title:"Build Auth Module",team:"Beta",assignee:"Priya Sharma",deadline:"2025-08-12",priority:"high",status:"done",score:92},
    {id:3,title:"Setup Database Schema",team:"Gamma",assignee:"Karthik R",deadline:"2025-08-08",priority:"medium",status:"done",score:88},
    {id:4,title:"Integrate REST APIs",team:"Alpha",assignee:"Ravi Patel",deadline:"2025-08-15",priority:"medium",status:"pending",score:null},
    {id:5,title:"Cloud Deployment",team:"Beta",assignee:"Divya M",deadline:"2025-08-20",priority:"low",status:"pending",score:null},
    {id:6,title:"Write Technical Docs",team:"Gamma",assignee:"Arjun S",deadline:"2025-08-18",priority:"low",status:"in-progress",score:null},
    {id:7,title:"Unit Testing Suite",team:"Alpha",assignee:"Athi Kumar",deadline:"2025-08-22",priority:"high",status:"pending",score:null},
    {id:8,title:"UI/UX Prototype",team:"Beta",assignee:"Priya Sharma",deadline:"2025-08-09",priority:"high",status:"done",score:97},
  ],
  bugs:[
    {id:1,title:"Login crashes on mobile Safari",reporter:"Ravi Patel",severity:"critical",status:"open",team:"Beta",created:"2025-07-28",desc:"App throws white screen after submit on iOS 16"},
    {id:2,title:"CSV export returns empty file",reporter:"Karthik R",severity:"high",status:"open",team:"Alpha",created:"2025-07-29",desc:"Export button triggers download but file is 0 bytes"},
    {id:3,title:"Slow dashboard load (>5s)",reporter:"Divya M",severity:"medium",status:"resolved",team:"Gamma",created:"2025-07-25",desc:"Initial paint blocked by unoptimized queries"},
    {id:4,title:"Wrong score shown in report",reporter:"Arjun S",severity:"low",status:"open",team:"Gamma",created:"2025-07-30",desc:"Evaluation report shows previous session data"},
  ],
  events:[
    {id:1,title:"Internal Hackathon 2025",date:"2025-08-25",type:"hackathon",participants:24,status:"upcoming",prize:"₹5000"},
    {id:2,title:"Workshop: System Design Basics",date:"2025-08-14",type:"workshop",participants:18,status:"upcoming",prize:"-"},
    {id:3,title:"Project Final Submission",date:"2025-08-30",type:"submission",participants:30,status:"upcoming",prize:"-"},
    {id:4,title:"Code Review Session",date:"2025-07-20",type:"workshop",participants:12,status:"completed",prize:"-"},
  ],
};

const pColor = p=>p==="high"?"#ff5252":p==="medium"?"#f4b942":"#00e676";
const sColor = s=>s==="done"?"#00e676":s==="in-progress"?"#00e5ff":"#4a7090";
const sevColor = s=>s==="critical"?"#ff5252":s==="high"?"#f4b942":s==="medium"?"#00e5ff":"#00e676";
const rColor = r=>r==="admin"?"#b388ff":r==="lead"?"#00e5ff":"#00e676";
const tColor = t=>t==="Alpha"?"#00e5ff":t==="Beta"?"#b388ff":"#f4b942";

function Badge({label,color}){return(<span style={{display:"inline-flex",alignItems:"center",padding:"3px 10px",borderRadius:20,fontSize:11,fontWeight:700,letterSpacing:.5,background:`${color}18`,color,border:`1px solid ${color}40`}}>{label}</span>);}
function Avatar({initials,color="#00e5ff",size=34}){return(<div style={{width:size,height:size,borderRadius:"50%",background:`${color}22`,border:`2px solid ${color}55`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:size*.35,fontWeight:800,color,flexShrink:0}}>{initials}</div>);}
function ProgressBar({pct,color="#00e5ff",height=6}){return(<div style={{height,borderRadius:99,background:C.dim,overflow:"hidden"}}><div style={{height:"100%",borderRadius:99,width:`${pct}%`,background:`linear-gradient(90deg,${color}cc,${color})`,transition:"width .8s ease",boxShadow:`0 0 8px ${color}88`}}/></div>);}

function StatCard({icon,label,value,sub,color,trend}){
  return(
    <div style={{background:`linear-gradient(135deg,${C.card},${C.surface})`,border:`1px solid ${C.border}`,borderRadius:16,padding:"20px 24px",display:"flex",flexDirection:"column",gap:8,position:"relative",overflow:"hidden"}}>
      <div style={{position:"absolute",top:-20,right:-20,fontSize:72,opacity:.04,color,userSelect:"none"}}>{icon}</div>
      <div style={{width:42,height:42,borderRadius:12,display:"flex",alignItems:"center",justifyContent:"center",background:`${color}18`,fontSize:20,color,border:`1px solid ${color}30`}}>{icon}</div>
      <div style={{fontSize:11,color:C.muted,letterSpacing:1.2,textTransform:"uppercase"}}>{label}</div>
      <div style={{fontSize:34,fontWeight:900,color,lineHeight:1}}>{value}</div>
      {sub&&<div style={{fontSize:11,color:C.muted}}>{sub}</div>}
      {trend!==undefined&&<div style={{fontSize:11,color:trend>=0?C.green:C.red}}>{trend>=0?"↑":"↓"} {Math.abs(trend)}% vs last week</div>}
    </div>
  );
}

function Modal({title,children,onClose}){
  return(
    <div style={{position:"fixed",inset:0,zIndex:1000,background:"rgba(5,12,24,.9)",backdropFilter:"blur(6px)",display:"flex",alignItems:"center",justifyContent:"center",padding:20}} onClick={onClose}>
      <div style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:20,padding:28,minWidth:380,maxWidth:520,width:"100%",boxShadow:`0 24px 80px rgba(0,0,0,.7)`}} onClick={e=>e.stopPropagation()}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
          <div style={{fontSize:16,fontWeight:800,color:C.text}}>{title}</div>
          <button onClick={onClose} style={{background:"none",border:"none",color:C.muted,cursor:"pointer",fontSize:20}}>✕</button>
        </div>
        {children}
      </div>
    </div>
  );
}

const iStyle={background:C.bg,border:`1px solid ${C.border}`,borderRadius:10,color:C.text,padding:"10px 14px",fontSize:13,outline:"none",width:"100%",fontFamily:"inherit"};
function Field({label,children}){return(<div style={{marginBottom:14}}><div style={{fontSize:11,color:C.muted,letterSpacing:1,textTransform:"uppercase",marginBottom:6}}>{label}</div>{children}</div>);}

/* ── LOGIN ── */
function Login({onLogin}){
  const [sel,setSel]=useState(null);
  const [pwd,setPwd]=useState("");
  const [err,setErr]=useState("");
  const demos=[
    {...SEED.users[0],hint:"Technical Lead — Full Access"},
    {...SEED.users[3],hint:"Admin — System Overview"},
    {...SEED.users[1],hint:"Student — Personal View"},
  ];
  const login=()=>{
    if(!sel){setErr("Select a role to continue");return;}
    if(pwd!=="1234"){setErr("Demo password: 1234");return;}
    onLogin(sel);
  };
  return(
    <div style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",background:C.bg,fontFamily:"'Syne','DM Sans',sans-serif",position:"relative",overflow:"hidden"}}>
      <div style={{position:"absolute",inset:0,opacity:.04,backgroundImage:`linear-gradient(${C.accent} 1px,transparent 1px),linear-gradient(90deg,${C.accent} 1px,transparent 1px)`,backgroundSize:"40px 40px"}}/>
      <div style={{position:"absolute",top:"20%",left:"10%",width:400,height:400,borderRadius:"50%",background:`radial-gradient(circle,${C.accent}08 0%,transparent 70%)`,filter:"blur(60px)"}}/>
      <div style={{position:"absolute",bottom:"15%",right:"10%",width:350,height:350,borderRadius:"50%",background:`radial-gradient(circle,${C.purple}08 0%,transparent 70%)`,filter:"blur(60px)"}}/>
      <div style={{width:"100%",maxWidth:460,padding:"0 20px",position:"relative"}}>
        <div style={{textAlign:"center",marginBottom:40}}>
          <div style={{display:"inline-flex",alignItems:"center",gap:10,background:`${C.accent}0f`,border:`1px solid ${C.accent}30`,borderRadius:99,padding:"8px 20px",marginBottom:24}}>
            <span style={{fontSize:18}}>⬡</span>
            <span style={{fontSize:13,fontWeight:700,color:C.accent,letterSpacing:2}}>DEPT SYSTEM</span>
          </div>
          <h1 style={{fontSize:32,fontWeight:900,color:C.text,margin:0,lineHeight:1.1}}>Smart Department<br/><span style={{color:C.accent}}>Management</span></h1>
          <p style={{color:C.muted,marginTop:12,fontSize:14}}>Role-based access portal · BSc Computer Technology</p>
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:10,marginBottom:20}}>
          {demos.map(u=>(
            <div key={u.id} onClick={()=>{setSel(u);setErr("");}} style={{border:`1px solid ${sel?.id===u.id?rColor(u.role):C.border}`,borderRadius:14,padding:"14px 18px",background:sel?.id===u.id?`${rColor(u.role)}0f`:C.surface,cursor:"pointer",display:"flex",alignItems:"center",gap:14,transition:"all .2s",boxShadow:sel?.id===u.id?`0 0 20px ${rColor(u.role)}22`:"none"}}>
              <Avatar initials={u.avatar} color={rColor(u.role)} size={42}/>
              <div style={{flex:1}}>
                <div style={{fontWeight:700,fontSize:15}}>{u.name}</div>
                <div style={{fontSize:12,color:C.muted}}>{u.hint}</div>
              </div>
              <Badge label={u.role.toUpperCase()} color={rColor(u.role)}/>
            </div>
          ))}
        </div>
        <div style={{marginBottom:16}}>
          <input placeholder="Password (demo: 1234)" type="password" value={pwd} onChange={e=>{setPwd(e.target.value);setErr("");}} onKeyDown={e=>e.key==="Enter"&&login()} style={{...iStyle,padding:"12px 16px",fontSize:14,borderRadius:12}}/>
        </div>
        {err&&<div style={{color:C.red,fontSize:13,marginBottom:12,textAlign:"center"}}>{err}</div>}
        <button onClick={login} style={{width:"100%",padding:"14px",borderRadius:12,background:`linear-gradient(135deg,${C.accent}cc,${C.accent}88)`,border:"none",color:C.bg,fontWeight:900,fontSize:15,cursor:"pointer",letterSpacing:.5,boxShadow:`0 8px 32px ${C.accent}44`}}>
          ACCESS SYSTEM →
        </button>
      </div>
    </div>
  );
}

/* ── DASHBOARD ── */
function Dashboard({data}){
  const done=data.tasks.filter(t=>t.status==="done").length;
  const subRate=Math.round((done/data.tasks.length)*100);
  const scored=data.tasks.filter(t=>t.score);
  const avgScore=scored.length?Math.round(scored.reduce((a,t)=>a+t.score,0)/scored.length):0;
  const openBugs=data.bugs.filter(b=>b.status==="open").length;
  return(
    <div style={{display:"flex",flexDirection:"column",gap:24}}>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))",gap:16}}>
        <StatCard icon="◈" label="Total Students" value={data.users.filter(u=>u.role==="student").length} sub="Enrolled this semester" color={C.accent} trend={5}/>
        <StatCard icon="◆" label="Submission Rate" value={`${subRate}%`} sub={`${done}/${data.tasks.length} tasks done`} color={C.green} trend={8}/>
        <StatCard icon="⬡" label="Average Score" value={avgScore} sub="Across evaluations" color={C.gold} trend={-2}/>
        <StatCard icon="◇" label="Open Bugs" value={openBugs} sub="Pending resolution" color={C.red}/>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:20}}>
        <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:16,padding:22}}>
          <div style={{fontSize:14,fontWeight:800,marginBottom:18}}>◉ Team Progress</div>
          {data.teams.map(t=>(
            <div key={t.id} style={{marginBottom:18}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
                <div><span style={{fontWeight:700,fontSize:14}}>Team {t.name}</span><span style={{color:C.muted,fontSize:12,marginLeft:8}}>{t.project}</span></div>
                <span style={{fontWeight:800,fontSize:14,color:tColor(t.name)}}>{t.progress}%</span>
              </div>
              <ProgressBar pct={t.progress} color={tColor(t.name)}/>
              <div style={{fontSize:11,color:C.muted,marginTop:5}}>Lead: {t.lead} · {t.members.length} members</div>
            </div>
          ))}
        </div>
        <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:16,padding:22}}>
          <div style={{fontSize:14,fontWeight:800,marginBottom:18}}>◆ Recent Tasks</div>
          {data.tasks.slice(0,5).map(t=>(
            <div key={t.id} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"10px 0",borderBottom:`1px solid ${C.dim}`}}>
              <div><div style={{fontWeight:600,fontSize:13}}>{t.title}</div><div style={{fontSize:11,color:C.muted}}>{t.team} · {t.assignee}</div></div>
              <div style={{display:"flex",gap:6}}><Badge label={t.status} color={sColor(t.status)}/><Badge label={t.priority} color={pColor(t.priority)}/></div>
            </div>
          ))}
        </div>
        <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:16,padding:22}}>
          <div style={{fontSize:14,fontWeight:800,marginBottom:18}}>◇ Bug Reports</div>
          {data.bugs.map(b=>(
            <div key={b.id} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"10px 0",borderBottom:`1px solid ${C.dim}`}}>
              <div><div style={{fontWeight:600,fontSize:13}}>{b.title}</div><div style={{fontSize:11,color:C.muted}}>{b.reporter} · {b.team}</div></div>
              <div style={{display:"flex",gap:6}}><Badge label={b.severity} color={sevColor(b.severity)}/><Badge label={b.status} color={b.status==="open"?C.red:C.green}/></div>
            </div>
          ))}
        </div>
        <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:16,padding:22}}>
          <div style={{fontSize:14,fontWeight:800,marginBottom:18}}>◎ Events</div>
          {data.events.map(e=>(
            <div key={e.id} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"10px 0",borderBottom:`1px solid ${C.dim}`}}>
              <div><div style={{fontWeight:600,fontSize:13}}>{e.title}</div><div style={{fontSize:11,color:C.muted}}>{e.date} · {e.participants} participants</div></div>
              <Badge label={e.type} color={e.type==="hackathon"?C.purple:e.type==="workshop"?C.gold:C.accent}/>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── STUDENTS ── */
function Students({data,currentUser,onUpdate,notify}){
  const [search,setSearch]=useState("");
  const [addModal,setAddModal]=useState(false);
  const [form,setForm]=useState({name:"",team:"Alpha",email:""});
  const filtered=data.users.filter(u=>u.role==="student"&&(u.name.toLowerCase().includes(search.toLowerCase())||u.team.includes(search)));
  const getTasks=u=>data.tasks.filter(t=>t.assignee===u.name);
  const getScore=u=>{const s=getTasks(u).filter(t=>t.score);return s.length?Math.round(s.reduce((a,t)=>a+t.score,0)/s.length):null;};
  const addStudent=()=>{
    if(!form.name.trim())return;
    const initials=form.name.trim().split(" ").map(w=>w[0]).join("").toUpperCase().slice(0,2);
    onUpdate({...data,users:[...data.users,{id:Date.now(),name:form.name,role:"student",team:form.team,avatar:initials,email:form.email}]});
    setForm({name:"",team:"Alpha",email:""});setAddModal(false);notify("Student added!");
  };
  return(
    <div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
        <h2 style={{margin:0,fontSize:20,fontWeight:900}}>◈ Students</h2>
        <div style={{display:"flex",gap:10}}>
          <input placeholder="Search…" value={search} onChange={e=>setSearch(e.target.value)} style={{...iStyle,width:180,padding:"8px 14px"}}/>
          {currentUser.role!=="student"&&<button onClick={()=>setAddModal(true)} style={{padding:"8px 18px",borderRadius:10,border:`1px solid ${C.accent}`,background:`${C.accent}18`,color:C.accent,cursor:"pointer",fontWeight:700,fontSize:13,fontFamily:"inherit"}}>+ Add Student</button>}
        </div>
      </div>
      <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:16,overflow:"hidden"}}>
        <table style={{width:"100%",borderCollapse:"collapse"}}>
          <thead>
            <tr style={{borderBottom:`1px solid ${C.border}`}}>
              {["Student","Team","Tasks Done","Avg Score","Performance","Email"].map(h=>(
                <th key={h} style={{padding:"14px 18px",textAlign:"left",fontSize:11,color:C.muted,textTransform:"uppercase",letterSpacing:1,fontWeight:600}}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map(u=>{
              const tasks=getTasks(u);const done=tasks.filter(t=>t.status==="done").length;const score=getScore(u);const perf=tasks.length?Math.round((done/tasks.length)*100):0;
              return(
                <tr key={u.id} style={{borderBottom:`1px solid ${C.dim}`}} onMouseEnter={e=>e.currentTarget.style.background=C.dim+"44"} onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                  <td style={{padding:"14px 18px"}}><div style={{display:"flex",alignItems:"center",gap:10}}><Avatar initials={u.avatar} color={tColor(u.team)} size={34}/><div><div style={{fontWeight:700,fontSize:14}}>{u.name}</div><div style={{fontSize:11,color:C.muted}}>#{u.id}</div></div></div></td>
                  <td style={{padding:"14px 18px"}}><Badge label={u.team} color={tColor(u.team)}/></td>
                  <td style={{padding:"14px 18px",fontWeight:600,color:C.muted}}>{done}/{tasks.length}</td>
                  <td style={{padding:"14px 18px"}}>{score?<span style={{fontWeight:800,fontSize:16,color:score>=90?C.green:score>=70?C.gold:C.red}}>{score}</span>:<span style={{color:C.muted}}>—</span>}</td>
                  <td style={{padding:"14px 18px",minWidth:130}}><ProgressBar pct={perf} color={perf>=80?C.green:perf>=50?C.gold:C.red}/><div style={{fontSize:10,color:C.muted,marginTop:3}}>{perf}%</div></td>
                  <td style={{padding:"14px 18px",fontSize:13,color:C.muted}}>{u.email}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {addModal&&(<Modal title="Add New Student" onClose={()=>setAddModal(false)}>
        <Field label="Full Name"><input style={iStyle} value={form.name} onChange={e=>setForm({...form,name:e.target.value})} placeholder="e.g. Ramesh Kumar"/></Field>
        <Field label="Email"><input style={iStyle} value={form.email} onChange={e=>setForm({...form,email:e.target.value})} placeholder="student@dept.edu"/></Field>
        <Field label="Team"><select style={{...iStyle,cursor:"pointer"}} value={form.team} onChange={e=>setForm({...form,team:e.target.value})}><option>Alpha</option><option>Beta</option><option>Gamma</option></select></Field>
        <button onClick={addStudent} style={{width:"100%",padding:"12px",borderRadius:10,background:`${C.accent}cc`,border:"none",color:C.bg,fontWeight:800,fontSize:14,cursor:"pointer",fontFamily:"inherit"}}>Add Student →</button>
      </Modal>)}
    </div>
  );
}

/* ── TEAMS ── */
function Teams({data}){
  return(
    <div>
      <h2 style={{margin:"0 0 20px",fontSize:20,fontWeight:900}}>◉ Team Allocations</h2>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(300px,1fr))",gap:20,marginBottom:24}}>
        {data.teams.map(t=>(
          <div key={t.id} style={{background:`linear-gradient(145deg,${C.card},${C.surface})`,border:`1px solid ${tColor(t.name)}44`,borderRadius:18,padding:24,position:"relative",overflow:"hidden",boxShadow:`0 0 40px ${tColor(t.name)}08`}}>
            <div style={{position:"absolute",top:-30,right:-30,fontSize:100,opacity:.04,color:tColor(t.name)}}>{t.name[0]}</div>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"start",marginBottom:16}}>
              <div><div style={{fontSize:22,fontWeight:900,color:tColor(t.name)}}>Team {t.name}</div><div style={{fontSize:12,color:C.muted}}>{t.members.length} members</div></div>
              <Badge label={t.status} color={C.green}/>
            </div>
            <div style={{marginBottom:12}}><div style={{fontSize:11,color:C.muted,letterSpacing:1,marginBottom:4}}>PROJECT</div><div style={{fontWeight:700,fontSize:15}}>{t.project}</div></div>
            <div style={{marginBottom:16}}><div style={{fontSize:11,color:C.muted,letterSpacing:1,marginBottom:4}}>LEAD</div><div style={{fontWeight:700,color:tColor(t.name)}}>{t.lead}</div></div>
            <div style={{marginBottom:14}}>
              <div style={{fontSize:11,color:C.muted,letterSpacing:1,marginBottom:8}}>MEMBERS</div>
              <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
                {t.members.map(m=>(
                  <div key={m} style={{display:"flex",alignItems:"center",gap:6,background:C.dim,borderRadius:20,padding:"4px 10px"}}>
                    <Avatar initials={m.split(" ").map(w=>w[0]).join("").slice(0,2)} color={tColor(t.name)} size={22}/>
                    <span style={{fontSize:12,fontWeight:600}}>{m}</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}><span style={{fontSize:12,color:C.muted}}>Progress</span><span style={{fontWeight:800,color:tColor(t.name)}}>{t.progress}%</span></div>
              <ProgressBar pct={t.progress} color={tColor(t.name)} height={8}/>
            </div>
          </div>
        ))}
      </div>
      <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:16,padding:22}}>
        <div style={{fontSize:14,fontWeight:800,marginBottom:16}}>Member Task Breakdown</div>
        {data.users.filter(u=>u.role==="student").map(u=>{
          const tasks=data.tasks.filter(t=>t.assignee===u.name);
          return(
            <div key={u.id} style={{display:"flex",alignItems:"center",gap:16,padding:"10px 0",borderBottom:`1px solid ${C.dim}`}}>
              <Avatar initials={u.avatar} color={tColor(u.team)} size={36}/>
              <div style={{flex:1}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
                  <div style={{display:"flex",alignItems:"center",gap:8}}><span style={{fontWeight:700,fontSize:14}}>{u.name}</span><Badge label={u.team} color={tColor(u.team)}/></div>
                  <span style={{fontSize:12,color:C.muted}}>{tasks.filter(t=>t.status==="done").length}/{tasks.length} tasks</span>
                </div>
                <div style={{display:"flex",gap:4,flexWrap:"wrap"}}>
                  {tasks.map(t=><div key={t.id} title={t.title} style={{width:28,height:8,borderRadius:4,background:t.status==="done"?C.green:t.status==="in-progress"?C.accent:C.dim}}/>)}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ── TASKS ── */
function Tasks({data,currentUser,onUpdate,notify}){
  const [filter,setFilter]=useState("all");
  const [addModal,setAddModal]=useState(false);
  const [scoreModal,setScoreModal]=useState(null);
  const [form,setForm]=useState({title:"",team:"Alpha",assignee:"",deadline:"",priority:"medium"});
  const [scoreVal,setScoreVal]=useState("");
  const filtered=data.tasks.filter(t=>filter==="all"||t.status===filter);
  const addTask=()=>{
    if(!form.title.trim())return;
    onUpdate({...data,tasks:[...data.tasks,{id:Date.now(),...form,status:"pending",score:null}]});
    setForm({title:"",team:"Alpha",assignee:"",deadline:"",priority:"medium"});setAddModal(false);notify("Task created!");
  };
  const saveScore=()=>{
    const s=parseInt(scoreVal);if(isNaN(s)||s<0||s>100)return;
    onUpdate({...data,tasks:data.tasks.map(t=>t.id===scoreModal.id?{...t,score:s,status:"done"}:t)});
    setScoreModal(null);setScoreVal("");notify(`Score ${s}/100 saved!`);
  };
  const filters=[{v:"all",label:`All (${data.tasks.length})`},{v:"pending",label:`Pending (${data.tasks.filter(t=>t.status==="pending").length})`},{v:"in-progress",label:`In Progress (${data.tasks.filter(t=>t.status==="in-progress").length})`},{v:"done",label:`Done (${data.tasks.filter(t=>t.status==="done").length})`}];
  return(
    <div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
        <h2 style={{margin:0,fontSize:20,fontWeight:900}}>◆ Task Management</h2>
        {currentUser.role!=="student"&&<button onClick={()=>setAddModal(true)} style={{padding:"8px 18px",borderRadius:10,border:`1px solid ${C.gold}`,background:`${C.gold}18`,color:C.gold,cursor:"pointer",fontWeight:700,fontSize:13,fontFamily:"inherit"}}>+ New Task</button>}
      </div>
      <div style={{display:"flex",gap:8,marginBottom:20,flexWrap:"wrap"}}>
        {filters.map(f=><button key={f.v} onClick={()=>setFilter(f.v)} style={{padding:"7px 16px",borderRadius:20,border:`1px solid ${filter===f.v?C.accent:C.border}`,background:filter===f.v?`${C.accent}18`:"transparent",color:filter===f.v?C.accent:C.muted,cursor:"pointer",fontWeight:600,fontSize:12,fontFamily:"inherit"}}>{f.label}</button>)}
      </div>
      <div style={{display:"flex",flexDirection:"column",gap:10}}>
        {filtered.map(t=>(
          <div key={t.id} style={{background:C.card,border:`1px solid ${C.border}`,borderLeft:`3px solid ${pColor(t.priority)}`,borderRadius:14,padding:"16px 20px",display:"flex",alignItems:"center",gap:16}} onMouseEnter={e=>e.currentTarget.style.boxShadow="0 4px 20px rgba(0,0,0,.4)"} onMouseLeave={e=>e.currentTarget.style.boxShadow="none"}>
            <div style={{flex:1}}>
              <div style={{fontWeight:700,fontSize:15,marginBottom:4}}>{t.title}</div>
              <div style={{fontSize:12,color:C.muted}}>Team {t.team} · {t.assignee} · Due {t.deadline}</div>
            </div>
            <div style={{display:"flex",gap:8,alignItems:"center",flexWrap:"wrap",justifyContent:"flex-end"}}>
              <Badge label={t.priority} color={pColor(t.priority)}/>
              <Badge label={t.status} color={sColor(t.status)}/>
              {t.score&&<Badge label={`Score: ${t.score}`} color={t.score>=90?C.green:t.score>=70?C.gold:C.red}/>}
              {currentUser.role!=="student"&&t.status!=="done"&&(
                <>
                  {t.status==="pending"&&<button onClick={()=>{onUpdate({...data,tasks:data.tasks.map(x=>x.id===t.id?{...x,status:"in-progress"}:x)});notify("Task started!");}} style={{padding:"5px 12px",borderRadius:8,border:`1px solid ${C.accent}`,background:`${C.accent}18`,color:C.accent,cursor:"pointer",fontSize:12,fontFamily:"inherit"}}>Start</button>}
                  <button onClick={()=>setScoreModal(t)} style={{padding:"5px 12px",borderRadius:8,border:`1px solid ${C.green}`,background:`${C.green}18`,color:C.green,cursor:"pointer",fontSize:12,fontFamily:"inherit"}}>Evaluate</button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
      {addModal&&(<Modal title="Create New Task" onClose={()=>setAddModal(false)}>
        <Field label="Task Title"><input style={iStyle} value={form.title} onChange={e=>setForm({...form,title:e.target.value})} placeholder="e.g. Design Login Flow"/></Field>
        <Field label="Team"><select style={{...iStyle,cursor:"pointer"}} value={form.team} onChange={e=>setForm({...form,team:e.target.value})}><option>Alpha</option><option>Beta</option><option>Gamma</option></select></Field>
        <Field label="Assignee"><input style={iStyle} value={form.assignee} onChange={e=>setForm({...form,assignee:e.target.value})} placeholder="Student name"/></Field>
        <Field label="Deadline"><input style={{...iStyle,cursor:"pointer"}} type="date" value={form.deadline} onChange={e=>setForm({...form,deadline:e.target.value})}/></Field>
        <Field label="Priority"><select style={{...iStyle,cursor:"pointer"}} value={form.priority} onChange={e=>setForm({...form,priority:e.target.value})}><option>high</option><option>medium</option><option>low</option></select></Field>
        <button onClick={addTask} style={{width:"100%",padding:"12px",borderRadius:10,background:`${C.gold}cc`,border:"none",color:C.bg,fontWeight:800,fontSize:14,cursor:"pointer",fontFamily:"inherit"}}>Create Task →</button>
      </Modal>)}
      {scoreModal&&(<Modal title={`Evaluate: ${scoreModal.title}`} onClose={()=>setScoreModal(null)}>
        <p style={{color:C.muted,fontSize:14,margin:"0 0 16px"}}>Enter score (0–100). Auto quick-select presets:</p>
        <Field label="Score (0–100)"><input style={{...iStyle,fontSize:24,fontWeight:800,textAlign:"center",color:C.gold}} type="number" min={0} max={100} value={scoreVal} onChange={e=>setScoreVal(e.target.value)} placeholder="e.g. 87"/></Field>
        <div style={{display:"flex",gap:8,marginTop:8}}>
          {[70,80,90,100].map(s=><button key={s} onClick={()=>setScoreVal(String(s))} style={{flex:1,padding:"8px",borderRadius:8,border:`1px solid ${s>=90?C.green:s>=80?C.gold:C.accent}`,background:"transparent",color:s>=90?C.green:s>=80?C.gold:C.accent,cursor:"pointer",fontWeight:700,fontSize:13,fontFamily:"inherit"}}>{s}</button>)}
        </div>
        <button onClick={saveScore} style={{width:"100%",padding:"12px",borderRadius:10,background:`${C.green}cc`,border:"none",color:C.bg,fontWeight:800,fontSize:14,cursor:"pointer",marginTop:16,fontFamily:"inherit"}}>Save Score & Mark Done ✓</button>
      </Modal>)}
    </div>
  );
}

/* ── BUGS ── */
function Bugs({data,currentUser,onUpdate,notify}){
  const [modal,setModal]=useState(false);
  const [form,setForm]=useState({title:"",reporter:currentUser.name,severity:"medium",team:"Alpha",desc:""});
  const addBug=()=>{
    if(!form.title.trim())return;
    onUpdate({...data,bugs:[...data.bugs,{id:Date.now(),...form,status:"open",created:new Date().toISOString().slice(0,10)}]});
    setForm({title:"",reporter:currentUser.name,severity:"medium",team:"Alpha",desc:""});setModal(false);notify("Bug reported!");
  };
  const resolve=id=>{onUpdate({...data,bugs:data.bugs.map(b=>b.id===id?{...b,status:"resolved"}:b)});notify("Bug resolved ✓");};
  const open=data.bugs.filter(b=>b.status==="open").length;
  return(
    <div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
        <h2 style={{margin:0,fontSize:20,fontWeight:900}}>◇ Bug Reports</h2>
        <button onClick={()=>setModal(true)} style={{padding:"8px 18px",borderRadius:10,border:`1px solid ${C.red}`,background:`${C.red}18`,color:C.red,cursor:"pointer",fontWeight:700,fontSize:13,fontFamily:"inherit"}}>+ Report Bug</button>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12,marginBottom:22}}>
        {[{l:"Total",v:data.bugs.length,c:C.muted},{l:"Open",v:open,c:C.red},{l:"Resolved",v:data.bugs.filter(b=>b.status==="resolved").length,c:C.green},{l:"Critical",v:data.bugs.filter(b=>b.severity==="critical").length,c:"#ff5252"}].map(s=>(
          <div key={s.l} style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:12,padding:"14px 16px"}}><div style={{fontSize:11,color:C.muted,letterSpacing:1}}>{s.l}</div><div style={{fontSize:28,fontWeight:900,color:s.c}}>{s.v}</div></div>
        ))}
      </div>
      <div style={{display:"flex",flexDirection:"column",gap:12}}>
        {data.bugs.map(b=>(
          <div key={b.id} style={{background:C.card,border:`1px solid ${b.status==="open"?sevColor(b.severity)+"44":C.border}`,borderRadius:14,padding:"18px 22px",boxShadow:b.status==="open"&&b.severity==="critical"?`0 0 20px ${C.red}18`:"none"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"start"}}>
              <div style={{flex:1}}>
                <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:6}}>
                  {b.status==="open"&&<span style={{width:8,height:8,borderRadius:"50%",background:sevColor(b.severity),display:"inline-block",boxShadow:`0 0 8px ${sevColor(b.severity)}`}}/>}
                  <span style={{fontWeight:700,fontSize:15}}>{b.title}</span>
                </div>
                <div style={{fontSize:12,color:C.muted,marginBottom:6}}>By <strong style={{color:C.text}}>{b.reporter}</strong> · Team {b.team} · {b.created}</div>
                <div style={{fontSize:13,color:C.muted,fontStyle:"italic"}}>"{b.desc}"</div>
              </div>
              <div style={{display:"flex",gap:8,alignItems:"center",marginLeft:16,flexShrink:0}}>
                <Badge label={b.severity} color={sevColor(b.severity)}/><Badge label={b.status} color={b.status==="open"?C.red:C.green}/>
                {currentUser.role!=="student"&&b.status==="open"&&<button onClick={()=>resolve(b.id)} style={{padding:"5px 14px",borderRadius:8,border:`1px solid ${C.green}`,background:`${C.green}18`,color:C.green,cursor:"pointer",fontSize:12,fontFamily:"inherit"}}>Resolve ✓</button>}
              </div>
            </div>
          </div>
        ))}
      </div>
      {modal&&(<Modal title="Report a Bug" onClose={()=>setModal(false)}>
        <Field label="Bug Title"><input style={iStyle} value={form.title} onChange={e=>setForm({...form,title:e.target.value})} placeholder="Short descriptive title"/></Field>
        <Field label="Description"><textarea style={{...iStyle,minHeight:80,resize:"vertical"}} value={form.desc} onChange={e=>setForm({...form,desc:e.target.value})} placeholder="Steps to reproduce…"/></Field>
        <Field label="Severity"><select style={{...iStyle,cursor:"pointer"}} value={form.severity} onChange={e=>setForm({...form,severity:e.target.value})}><option value="critical">🔴 Critical</option><option value="high">🟠 High</option><option value="medium">🟡 Medium</option><option value="low">🟢 Low</option></select></Field>
        <Field label="Team"><select style={{...iStyle,cursor:"pointer"}} value={form.team} onChange={e=>setForm({...form,team:e.target.value})}><option>Alpha</option><option>Beta</option><option>Gamma</option></select></Field>
        <button onClick={addBug} style={{width:"100%",padding:"12px",borderRadius:10,background:`${C.red}cc`,border:"none",color:"#fff",fontWeight:800,fontSize:14,cursor:"pointer",fontFamily:"inherit"}}>Submit Bug Report →</button>
      </Modal>)}
    </div>
  );
}

/* ── EVENTS ── */
function Events({data,currentUser,onUpdate,notify}){
  const [modal,setModal]=useState(false);
  const [form,setForm]=useState({title:"",date:"",type:"workshop",participants:0,prize:"-"});
  const addEvent=()=>{
    if(!form.title.trim())return;
    onUpdate({...data,events:[...data.events,{id:Date.now(),...form,status:"upcoming"}]});
    setForm({title:"",date:"",type:"workshop",participants:0,prize:"-"});setModal(false);notify("Event created!");
  };
  const tc=t=>t==="hackathon"?C.purple:t==="workshop"?C.gold:C.accent;
  return(
    <div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
        <h2 style={{margin:0,fontSize:20,fontWeight:900}}>◎ Events & Hackathons</h2>
        {currentUser.role!=="student"&&<button onClick={()=>setModal(true)} style={{padding:"8px 18px",borderRadius:10,border:`1px solid ${C.purple}`,background:`${C.purple}18`,color:C.purple,cursor:"pointer",fontWeight:700,fontSize:13,fontFamily:"inherit"}}>+ Add Event</button>}
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))",gap:16}}>
        {data.events.map(e=>(
          <div key={e.id} style={{background:`linear-gradient(145deg,${C.card},${C.surface})`,border:`1px solid ${tc(e.type)}33`,borderRadius:18,padding:24,position:"relative",overflow:"hidden"}}>
            <div style={{position:"absolute",top:-15,right:-15,fontSize:80,opacity:.06,color:tc(e.type)}}>★</div>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"start",marginBottom:14}}><Badge label={e.type.toUpperCase()} color={tc(e.type)}/><Badge label={e.status} color={e.status==="upcoming"?C.accent:C.muted}/></div>
            <div style={{fontWeight:800,fontSize:17,marginBottom:10}}>{e.title}</div>
            <div style={{display:"flex",flexDirection:"column",gap:6}}>
              <div style={{fontSize:13,color:C.muted}}>📅 {e.date}</div>
              <div style={{fontSize:13,color:C.muted}}>👥 {e.participants} participants</div>
              {e.prize!=="-"&&<div style={{fontSize:13,color:C.gold}}>🏆 Prize: {e.prize}</div>}
            </div>
            {currentUser.role!=="student"&&e.status==="upcoming"&&<button onClick={()=>{onUpdate({...data,events:data.events.map(ev=>ev.id===e.id?{...ev,status:"completed"}:ev)});notify("Event complete!");}} style={{marginTop:14,width:"100%",padding:"8px",borderRadius:10,border:`1px solid ${C.green}`,background:`${C.green}18`,color:C.green,cursor:"pointer",fontSize:12,fontFamily:"inherit",fontWeight:600}}>Mark Complete ✓</button>}
          </div>
        ))}
      </div>
      {modal&&(<Modal title="Add New Event" onClose={()=>setModal(false)}>
        <Field label="Event Title"><input style={iStyle} value={form.title} onChange={e=>setForm({...form,title:e.target.value})} placeholder="e.g. Hackathon 2025"/></Field>
        <Field label="Date"><input style={{...iStyle,cursor:"pointer"}} type="date" value={form.date} onChange={e=>setForm({...form,date:e.target.value})}/></Field>
        <Field label="Type"><select style={{...iStyle,cursor:"pointer"}} value={form.type} onChange={e=>setForm({...form,type:e.target.value})}><option value="hackathon">Hackathon</option><option value="workshop">Workshop</option><option value="submission">Submission</option></select></Field>
        <Field label="Participants"><input style={iStyle} type="number" value={form.participants} onChange={e=>setForm({...form,participants:Number(e.target.value)})}/></Field>
        <Field label="Prize"><input style={iStyle} value={form.prize} onChange={e=>setForm({...form,prize:e.target.value})} placeholder="₹5000 or -"/></Field>
        <button onClick={addEvent} style={{width:"100%",padding:"12px",borderRadius:10,background:`${C.purple}cc`,border:"none",color:"#fff",fontWeight:800,fontSize:14,cursor:"pointer",fontFamily:"inherit"}}>Create Event →</button>
      </Modal>)}
    </div>
  );
}

/* ── ANALYTICS ── */
function Analytics({data}){
  const byTeam=["Alpha","Beta","Gamma"].map(name=>{
    const tt=data.tasks.filter(t=>t.team===name);
    const done=tt.filter(t=>t.status==="done").length;
    const sc=tt.filter(t=>t.score);
    return{name,done,total:tt.length,rate:tt.length?Math.round((done/tt.length)*100):0,avg:sc.length?Math.round(sc.reduce((a,t)=>a+t.score,0)/sc.length):0};
  });
  const scored=data.tasks.filter(t=>t.score).sort((a,b)=>b.score-a.score);
  return(
    <div>
      <h2 style={{margin:"0 0 20px",fontSize:20,fontWeight:900}}>▣ Analytics</h2>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:20,marginBottom:20}}>
        <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:16,padding:22}}>
          <div style={{fontSize:14,fontWeight:800,marginBottom:18}}>Team Submission Rate</div>
          {byTeam.map(t=>(
            <div key={t.name} style={{marginBottom:20}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
                <div style={{display:"flex",alignItems:"center",gap:8}}><div style={{width:10,height:10,borderRadius:2,background:tColor(t.name)}}/><span style={{fontWeight:700}}>Team {t.name}</span></div>
                <div style={{fontSize:12,color:C.muted}}>{t.done}/{t.total} · <strong style={{color:tColor(t.name)}}>{t.rate}%</strong></div>
              </div>
              <ProgressBar pct={t.rate} color={tColor(t.name)} height={10}/>
            </div>
          ))}
        </div>
        <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:16,padding:22}}>
          <div style={{fontSize:14,fontWeight:800,marginBottom:18}}>Average Score by Team</div>
          <div style={{display:"flex",alignItems:"flex-end",gap:20,height:150,paddingBottom:20,borderBottom:`1px solid ${C.dim}`}}>
            {byTeam.map(t=>(
              <div key={t.name} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:6}}>
                <div style={{fontSize:13,fontWeight:800,color:tColor(t.name)}}>{t.avg||"—"}</div>
                <div style={{width:"100%",borderRadius:"8px 8px 0 0",background:`linear-gradient(0deg,${tColor(t.name)}cc,${tColor(t.name)}44)`,height:`${(t.avg/100)*120}px`,transition:"height 1s ease",minHeight:4,boxShadow:`0 0 20px ${tColor(t.name)}44`}}/>
              </div>
            ))}
          </div>
          <div style={{display:"flex",gap:20,marginTop:8}}>
            {byTeam.map(t=><div key={t.name} style={{flex:1,textAlign:"center",fontSize:12,color:C.muted}}>Team {t.name}</div>)}
          </div>
        </div>
      </div>
      <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:16,padding:22}}>
        <div style={{fontSize:14,fontWeight:800,marginBottom:18}}>🏆 Score Leaderboard</div>
        {scored.length===0&&<div style={{color:C.muted,textAlign:"center",padding:20}}>No scores yet. Start evaluating tasks!</div>}
        {scored.map((t,i)=>(
          <div key={t.id} style={{display:"flex",alignItems:"center",gap:14,padding:"10px 0",borderBottom:`1px solid ${C.dim}`}}>
            <div style={{width:30,fontSize:16,fontWeight:900,color:i===0?C.gold:i===1?"#c0c0c0":i===2?"#cd7f32":C.muted,textAlign:"center"}}>{i<3?["🥇","🥈","🥉"][i]:`#${i+1}`}</div>
            <div style={{flex:1}}><div style={{fontWeight:700,fontSize:14}}>{t.title}</div><div style={{fontSize:12,color:C.muted}}>{t.assignee} · Team {t.team}</div></div>
            <div style={{fontWeight:900,fontSize:22,color:t.score>=90?C.green:t.score>=70?C.gold:C.red}}>{t.score}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ══════ ROOT ══════ */
export default function App(){
  const [currentUser,setCurrentUser]=useState(null);
  const [tab,setTab]=useState("dashboard");
  const [data,setData]=useState(SEED);
  const [toast,setToast]=useState(null);

  useEffect(()=>{
    const link=document.createElement("link");
    link.rel="stylesheet";link.href="https://fonts.googleapis.com/css2?family=Syne:wght@700;800;900&family=DM+Sans:wght@400;500;600&display=swap";
    document.head.appendChild(link);
  },[]);

  const notify=(msg,type="success")=>{setToast({msg,type});setTimeout(()=>setToast(null),3000);};

  if(!currentUser) return <Login onLogin={u=>{setCurrentUser(u);setTab("dashboard");}}/>;

  const navItems=[
    {id:"dashboard",label:"Dashboard",icon:"⬡"},
    {id:"students",label:"Students",icon:"◈"},
    {id:"teams",label:"Teams",icon:"◉"},
    {id:"tasks",label:"Tasks",icon:"◆"},
    {id:"bugs",label:"Bug Reports",icon:"◇"},
    {id:"events",label:"Events",icon:"◎"},
    {id:"analytics",label:"Analytics",icon:"▣"},
  ];
  const vp={data,currentUser,onUpdate:setData,notify};

  return(
    <div style={{minHeight:"100vh",background:C.bg,color:C.text,fontFamily:"'DM Sans',sans-serif",display:"flex",flexDirection:"column",position:"relative"}}>
      <div style={{position:"fixed",inset:0,pointerEvents:"none",zIndex:0,background:`radial-gradient(ellipse at 15% 0%,${C.accent}05 0%,transparent 50%),radial-gradient(ellipse at 85% 100%,${C.purple}05 0%,transparent 50%)`}}/>
      {/* HEADER */}
      <div style={{background:`${C.surface}ee`,backdropFilter:"blur(16px)",borderBottom:`1px solid ${C.border}`,padding:"12px 28px",display:"flex",alignItems:"center",justifyContent:"space-between",position:"sticky",top:0,zIndex:200}}>
        <div style={{display:"flex",alignItems:"center",gap:12}}>
          <div style={{width:36,height:36,borderRadius:10,background:`${C.accent}22`,border:`1px solid ${C.accent}44`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,color:C.accent}}>⬡</div>
          <div>
            <div style={{fontSize:15,fontWeight:900,color:C.text,lineHeight:1}}>DeptSystem</div>
            <div style={{fontSize:10,color:C.muted,letterSpacing:2,textTransform:"uppercase"}}>BSc Computer Technology</div>
          </div>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:14}}>
          <div style={{textAlign:"right"}}>
            <div style={{fontSize:14,fontWeight:700}}>{currentUser.name}</div>
            <Badge label={currentUser.role.toUpperCase()} color={rColor(currentUser.role)}/>
          </div>
          <Avatar initials={currentUser.avatar} color={rColor(currentUser.role)} size={38}/>
          <button onClick={()=>setCurrentUser(null)} style={{background:"none",border:`1px solid ${C.border}`,borderRadius:8,color:C.muted,cursor:"pointer",padding:"6px 12px",fontSize:12,fontFamily:"inherit"}}>Logout</button>
        </div>
      </div>
      {/* NAV */}
      <div style={{background:C.surface,borderBottom:`1px solid ${C.border}`,padding:"0 28px",display:"flex",gap:2,overflowX:"auto",position:"sticky",top:61,zIndex:199}}>
        {navItems.map(n=>(
          <button key={n.id} onClick={()=>setTab(n.id)} style={{padding:"14px 18px",background:"none",border:"none",borderBottom:`2px solid ${tab===n.id?C.accent:"transparent"}`,color:tab===n.id?C.accent:C.muted,cursor:"pointer",fontWeight:700,fontSize:13,fontFamily:"inherit",whiteSpace:"nowrap",display:"flex",alignItems:"center",gap:6}}>
            <span style={{fontSize:14}}>{n.icon}</span>{n.label}
          </button>
        ))}
      </div>
      {/* CONTENT */}
      <div style={{flex:1,padding:"28px 28px 40px",position:"relative",zIndex:1,maxWidth:1280,width:"100%",margin:"0 auto",boxSizing:"border-box"}}>
        {tab==="dashboard"&&<Dashboard {...vp}/>}
        {tab==="students"&&<Students {...vp}/>}
        {tab==="teams"&&<Teams {...vp}/>}
        {tab==="tasks"&&<Tasks {...vp}/>}
        {tab==="bugs"&&<Bugs {...vp}/>}
        {tab==="events"&&<Events {...vp}/>}
        {tab==="analytics"&&<Analytics {...vp}/>}
      </div>
      {/* TOAST */}
      {toast&&<div style={{position:"fixed",bottom:28,right:28,zIndex:9999,padding:"14px 22px",borderRadius:14,background:toast.type==="success"?`${C.green}18`:`${C.red}18`,border:`1px solid ${toast.type==="success"?C.green:C.red}`,color:toast.type==="success"?C.green:C.red,fontWeight:700,fontSize:14,backdropFilter:"blur(12px)",boxShadow:"0 8px 40px rgba(0,0,0,.5)"}}>
        {toast.type==="success"?"✓ ":"✕ "}{toast.msg}
      </div>}
    </div>
  );
}
