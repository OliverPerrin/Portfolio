// Mono frame: the particle scenes live inside a hairline rectangle that each section of the page reshapes.
(() => {
'use strict';
const html=document.documentElement;
let canvas=document.querySelector('.fl-canvas');
if(!canvas)return;
html.classList.add('has-js');
const reduced=matchMedia('(prefers-reduced-motion: reduce)');
const narrow=matchMedia('(max-width: 720px)');
const medium=matchMedia('(max-width: 1100px)');
const fallback=document.querySelector('.fl-fallback');
const caption=document.querySelector('.fl-caption');
const plates=[...document.querySelectorAll('.fl-plate')];

// ---------- Scenes ----------
const topics=[
  ['Reinforcement learning','An illustrative gridworld: an agent follows a path through obstacles toward a reward.'],
  ['Supervised fine-tuning','Examples enter the model; predictions produce a loss that drives a weight update.'],
  ['Rotary position encoding','Three coordinate pairs rotate at different frequencies.'],
  ['Optimization','A synthetic quadratic loss surface and a descending path.'],
  ['Multi-task learning','A shared encoder feeds three task heads.'],
  ['',''],
  ['LoRA','A frozen weight matrix plus a low-rank update: B times A, as in LiminalML Studio.'],
  ['KV cache','Keys and values accumulate per layer as tokens are decoded, as in LiminalML Studio.'],
  ['Attention','A query scores each key; softmax turns the scores into weights, as in LiminalML Studio.'],
  ['Model merging','Three task vectors combine into one merged model, as studied in LexiMind.'],
  ['Le Mans hypercar','An illustrative Le Mans prototype, after SartheAtlas.'],
  ['Event map','Events pinned on a map, after PlayAxis.'],
  ['Usage dashboard','Allowance gauges over token history, after Pulse.']
];
const FRAME=5;                       // every particle sits on the frame itself
const NAMES={rl:0,sft:1,rope:2,optim:3,mtl:4,frame:5,lora:6,kv:7,attention:8,merge:9,hypercar:10,map:11,gauges:12};
const defaultSequence=[FRAME,0,1,2,3,4];
let sequence=defaultSequence;
const count=36000,hold=3.6,frameHold=2.2,morphDuration=1.7,tau=Math.PI*2;
const route=[[0,0],[1,0],[2,0],[2,1],[3,1],[4,1],[4,2],[4,3],[3,3],[2,3],[2,4],[2,5],[3,5],[4,5],[5,5]];
const walls=[[1,1],[1,2],[1,4],[2,2],[3,0],[3,2],[3,4],[4,4]];
const cell=.58;
const routePoint=n=>[(route[n][0]-2.5)*cell,(route[n][1]-2.5)*cell];
function routePosition(phase){const t=((phase%1)+1)%1*(route.length-1),i=Math.min(route.length-2,Math.floor(t)),f=t-i;const a=routePoint(i),b=routePoint(i+1);return[a[0]+(b[0]-a[0])*f,a[1]+(b[1]-a[1])*f];}
const trainingCurves=[[[0,.65],[.45,.65],[1.1,.65],[1.55,.65]],[[1.55,.65],[1.95,.3],[1.95,-.85],[1.4,-.95]],[[1.4,-.95],[.9,-1.15],[.1,-1.15],[-.2,-.85]],[[-.2,-.85],[-.6,-.45],[-.5,.25],[0,.65]]];
function trainingPosition(phase){const t=((phase%1)+1)%1*4,n=Math.floor(t),f=t-n,g=1-f,p=trainingCurves[n];return[0,1].map(axis=>g*g*g*p[0][axis]+3*g*g*f*p[1][axis]+3*g*f*f*p[2][axis]+f*f*f*p[3][axis]).concat(.08*Math.sin(t*Math.PI));}
let seed=6127;
function random(){seed=(Math.imul(seed,1664525)+1013904223)>>>0;return(seed+.5)/4294967296;}
function gaussian(){return Math.sqrt(-2*Math.log(random()))*Math.cos(tau*random());}
const meta=new Float32Array(count*3);
for(let i=0;i<count;i++)meta.set([random(),.55+random()*.9,random()],i*3);
function makeShape(kind){
  const data=new Float32Array(count*4);
  for(let i=0;i<count;i++){
    const u=random(),v=random(),w=random();let x,y,z,a;
    if(kind===0){
      if(u<.30){const tile=i%36,cx=(tile%6-2.5)*cell,cz=(Math.floor(tile/6)-2.5)*cell;x=cx+(v-.5)*cell*.94;z=cz+(w-.5)*cell*.94;if(i%2===0)x=cx+(v<.5?-.47:.47)*cell;else z=cz+(w<.5?-.47:.47)*cell;y=-.70;a=.22+random()*.16;}
      else if(u<.60){const wall=walls[i%walls.length],face=i%5;x=(wall[0]-2.5)*cell+(v-.5)*cell*.88;z=(wall[1]-2.5)*cell+(w-.5)*cell*.88;y=-.70+random()*.57;if(face===0)y=-.13;if(face===1)x=(wall[0]-2.5)*cell-cell*.44;if(face===2)x=(wall[0]-2.5)*cell+cell*.44;if(face===3)z=(wall[1]-2.5)*cell-cell*.44;if(face===4)z=(wall[1]-2.5)*cell+cell*.44;a=.30+random()*.28;}
      else if(u<.77){const path=routePosition(v);x=path[0]+gaussian()*.018;z=path[1]+gaussian()*.018;y=-.64;a=.28;}
      else if(u<.85){x=gaussian()*.018;y=-.60;z=gaussian()*.018;a=.88;}
      else if(u<.94){const goal=routePoint(route.length-1),angle=v*tau,r=.16+(w-.5)*.035;x=goal[0]+Math.cos(angle)*r;z=goal[1]+Math.sin(angle)*r;y=-.65+random()*.8;a=.65;}
      else{const angle=v*tau,h=w*2-1,r=Math.sqrt(1-h*h)*.105;x=Math.cos(angle)*r;y=-.43+h*.105;z=Math.sin(angle)*r;a=.99;}
    }else if(kind===1){
      if(u<.22){const batch=i%3,row=Math.floor(i/3)%2,token=Math.floor(i/6)%5;x=-1.95+token*.16+(v-.5)*.105;y=.94-batch*.28-row*.105+(w-.5)*.055;z=-.1+random()*.08;a=row===0?.32:.60;}
      else if(u<.48){const layer=i%3,side=i%4;x=-.28+layer*.16+(v-.5)*.64;y=.70+(w-.5)*.85;z=layer*.22-.22;if(side===0)x=-.28+layer*.16-.32;if(side===1)x=-.28+layer*.16+.32;if(side===2)y=.70-.425;if(side===3)y=.70+.425;a=.38+random()*.23;}
      else if(u<.60){const token=i%5;x=1.40+(v-.5)*.55;y=.91-token*.12+(w-.5)*.052;z=(i%2)*.12;a=i%2===0?.30:.62;}
      else if(u<.70){x=1.25+(v-.5)*.7;z=(w-.5)*.55;y=-.94+.9*(x-1.25)*(x-1.25)+z*z;a=.46;}
      else if(u<.92){x=gaussian()*.025;y=gaussian()*.025;z=gaussian()*.025;a=.90;}
      else{x=gaussian()*.018;y=.70+gaussian()*.018;z=gaussian()*.018;a=.99;}
    }else if(kind===2){
      const pair=i%3,marker=i%17===0;const angle=marker?(u-.5)*.07:u*tau;const radius=1.23+(v-.5)*(marker?.035:.085);
      x=Math.cos(angle)*radius;y=(pair-1)*1.28+(marker?0:(w-.5)*.045);z=Math.sin(angle)*radius;a=marker?.98:.055+w*.075;
    }else if(kind===3){
      if(i%9===0){const step=Math.floor(u*14),along=v;x=1.8*Math.pow(.80,step)*(1-along)+1.8*Math.pow(.80,step+1)*along;z=1.3*Math.pow(.72,step)*(1-along)+1.3*Math.pow(.72,step+1)*along;x+=(w-.5)*.022;z+=(random()-.5)*.022;y=.33*x*x+.55*z*z-1.05+.035;a=.96;}
      else{x=(u*2-1)*1.9;z=(v*2-1)*1.6;if(i%2===0)x=Math.round(x/.10)*.10;else z=Math.round(z/.10)*.10;y=.33*x*x+.55*z*z-1.05;a=.27+w*.2;}
    }else if(kind===4){
      const branch=i%3,headY=(branch-1)*1.35;
      if(u<.36){x=-2.1+v*1.65;y=gaussian()*.065;z=gaussian()*.065;a=.4+w*.28;}
      else if(u<.83){const t=v,e=t*t*(3-2*t);x=-.45+t*2.25;y=headY*e+gaussian()*.045;z=(branch-1)*.24*e+gaussian()*.045;a=.35+w*.3;}
      else{const shared=i%2===0;x=(shared?[-1.85,-1.15,-.45][branch]:1.8)+gaussian()*.12;y=(shared?0:headY)+gaussian()*.12;z=(shared?0:(branch-1)*.24)+gaussian()*.12;a=.6+w*.3;}
    }else if(kind===FRAME){
      // The frame: x stores a perimeter position, y an offset along the edge normal.
      const edge=u<.84;x=v;y=edge?gaussian()*.006:-Math.abs(gaussian())*.045;z=0;a=edge?.7+w*.3:.16+w*.14;
    }else{
      [x,y,z,a]=extraPoint(kind,i,u,v,w);
    }
    data.set([x,y,z,a],i*4);
  }
  return data;
}

// ---------- Scenes from the projects: LiminalML figures, LexiMind, SartheAtlas, PlayAxis, Pulse ----------
function sm(x){x=Math.max(0,Math.min(1,x));return x*x*(3-2*x);}
function lerpKeys(k,s){if(s<=k[0][0])return k[0][1];for(let j=1;j<k.length;j++){if(s<=k[j][0]){const a=k[j-1],b=k[j],t=sm((s-a[0])/(b[0]-a[0]));return a[1]+(b[1]-a[1])*t;}}return k[k.length-1][1];}
// Hypercar proportions: about 5 m long, 2 m wide, 1.05 m tall; front at +x. s runs 0 (tail) to 1 (nose).
const CAR={
  c:[[0,-.2],[.08,-.14],[.3,-.06],[.45,-.08],[.62,-.15],[.8,-.24],[.92,-.31],[1,-.4]],             // centreline top
  f:[[0,-.2],[.1,-.06],[.2,.0],[.3,-.06],[.42,-.2],[.6,-.22],[.7,-.08],[.78,.01],[.87,-.07],[.95,-.3],[1,-.4]], // fender line
  w:[[0,.72],[.2,.8],[.42,.66],[.6,.68],[.78,.8],[.92,.7],[1,.48]]                                   // half width
};
const FLOOR=-.52,WY=-.32,WR=.3,WHEELS=[[-1.2,.66],[-1.2,-.66],[1.12,.66],[1.12,-.66]];
function carTop(s,u){const c=lerpKeys(CAR.c,s),f=lerpKeys(CAR.f,s),g=sm((Math.abs(u)-.35)/.55);return c*(1-g)+f*g;}
function extraPoint(kind,i,u,v,w){
  let x=0,y=0,z=0,a=.3;
  if(kind===6){
    // LoRA: frozen W, plus B (tall, thin) times A (short, wide), with their product BA beneath A.
    if(u<.4){x=-2.05+v*1.6;y=-.8+w*1.6;if(i%2)x=-2.05+Math.round(v*16)/16*1.6;else y=-.8+Math.round(w*16)/16*1.6;a=.16+random()*.12;}
    else if(u<.43){const t=v*2-1;if(i%2){x=-.2+t*.12;y=0;}else{x=-.2;y=t*.12;}a=.85;}
    else if(u<.6){x=.08+v*.22;y=-.8+w*1.6;if(i%3===0)x=.08+(v<.5?0:.22);a=.5+random()*.35;}
    else if(u<.77){x=.72+v*1.4;y=.58+w*.22;if(i%3===0)y=.58+(w<.5?0:.22);a=.5+random()*.35;}
    else{x=.72+v*1.4;y=-.8+w*1.22;if(i%2)x=.72+Math.round(v*8)/8*1.4;else y=-.8+Math.round(w*8)/8*1.22;a=.12+random()*.12;}
    z=gaussian()*.01;
  }else if(kind===7){
    // KV cache: three layers, keys and values per decoded token.
    const token=i%12,layer=Math.floor(i/12)%3,isV=Math.floor(i/36)%2;
    const cx=-2+token*.35,cy=(layer-1)*.78,cz=isV?.15:-.15;
    x=cx+(v-.5)*.24;y=cy+(w-.5)*.24;z=cz+(random()-.5)*.12;
    if(i%3===0)x=cx+(v<.5?-.12:.12);else if(i%3===1)y=cy+(w<.5?-.12:.12);
    a=isV?.6:.42;
  }else if(kind===8){
    // Attention: a query against four keys on the unit circle, and the softmax weights (62/17/5/16%).
    const ox=-.9;
    if(u<.12){const g=v*tau;x=ox+Math.cos(g);y=Math.sin(g);a=.12;}
    else if(u<.3){x=ox+v*.92+gaussian()*.008;y=v*.39+gaussian()*.008;a=.92;}
    else if(u<.62){const k=i%4,g=[.35,1.25,2.6,-.9][k];x=ox+Math.cos(g)*v+gaussian()*.006;y=Math.sin(g)*v+gaussian()*.006;a=[.75,.45,.28,.45][k];}
    else{const k=i%4,wt=[.62,.17,.05,.16][k],bx=.75+k*.38,h=wt*2.2;x=bx+(v-.5)*.24;y=-.95+w*h;if(i%2)x=bx+(v<.5?-.12:.12);a=.35+wt*.8;}
  }else if(kind===9){
    // Model merging: three task vectors from shared weights, and their scaled sum.
    const base=[-1.1,-.4,0],T=[[1.9,1.3,.3],[2.2,-.5,.8],[1.3,.3,-1.2]],lam=.4;
    const M=[0,1,2].map(d=>(T[0][d]+T[1][d]+T[2][d])*lam);
    const at=(vec,t)=>[base[0]+vec[0]*t,base[1]+vec[1]*t,base[2]+vec[2]*t];
    let q;
    if(u<.08){q=[base[0]+gaussian()*.05,base[1]+gaussian()*.05,base[2]+gaussian()*.05];a=.95;}
    else if(u<.58){const k=i%3;q=at(T[k],w<.15?1:v);if(w<.15){q[0]+=gaussian()*.04;q[1]+=gaussian()*.04;q[2]+=gaussian()*.04;a=.85;}else{q[0]+=gaussian()*.008;q[1]+=gaussian()*.008;a=.42;}}
    else if(u<.84){q=at(M,w<.18?1:v);if(w<.18){q[0]+=gaussian()*.05;q[1]+=gaussian()*.05;q[2]+=gaussian()*.05;}a=.95;}
    else{const k=i%3,tip=at(T[k],1),mt=at(M,1);q=[tip[0]+(mt[0]-tip[0])*v,tip[1]+(mt[1]-tip[1])*v,tip[2]+(mt[2]-tip[2])*v];a=Math.floor(v*14)%2?0:.28;}
    [x,y,z]=q;
  }else if(kind===10){
    // Le Mans hypercar: wedge body with fender bulges, canopy, shark fin, swan-neck wing, wheels, light bars.
    const s=v,X=-2+4*s;
    if(u<.38){
      const uu=w*2-1,W=lerpKeys(CAR.w,s);
      x=X;z=uu*W;y=carTop(s,uu);if(Math.abs(uu)>.94)y-=(Math.abs(uu)-.94)*1.6;a=.2+random()*.12;
      if(i%7===0){const ln=Math.round(uu*4)/4;z=ln*W;y=carTop(s,ln);a=.45;}
    }else if(u<.56){
      const side=i%2?1:-1,W=lerpKeys(CAR.w,s);
      const yy=FLOOR+w*(carTop(s,side)-FLOOR),wx=X<0?-1.2:1.12,ra=WR+.05;
      if(Math.hypot(X-wx,yy-WY)<ra){const g=Math.abs(Math.atan2(yy-WY,X-wx));x=wx+Math.cos(g)*ra;y=WY+Math.sin(g)*ra;a=.7;}
      else{x=X;y=yy;a=.17+random()*.1;}
      z=side*W*(.97+.03*(1-w));
    }else if(u<.66){
      const el=w*Math.PI/2,az=v*tau,r=Math.cos(el);
      x=.45+.8*r*Math.cos(az);z=.32*r*Math.sin(az);y=-.14+.38*Math.sin(el);a=i%9===0?.6:.26+random()*.1;
    }else if(u<.7){
      x=-.15-1.7*v;const bottom=carTop((x+2)/4,0),top=.22+.08*v;y=bottom+(top-bottom)*w;z=gaussian()*.004;a=w>.92?.7:.2;
    }else if(u<.78){
      const part=i%6;
      if(part<3){x=-2.02+.3*v;z=-.8+1.6*w;y=.3+.035*Math.sin(v*Math.PI);a=(v<.08||v>.92)?.75:.4;}
      else if(part<5){const sd=part===3?1:-1;x=-2.06+.42*v;y=-.2+.56*w;z=sd*.81;a=(w>.95||w<.04||v<.04||v>.96)?.7:.08;}
      else{const sd=i%12<6?1:-1;x=-1.86+gaussian()*.01;z=sd*.24+gaussian()*.01;const b=carTop((x+2)/4,.3);y=b+(.3-b)*w;a=.55;}
    }else if(u<.9){
      const wh=WHEELS[i%4],phi=v*tau;
      if(w<.66){x=wh[0]+Math.cos(phi)*WR;y=WY+Math.sin(phi)*WR;z=wh[1]+(random()-.5)*.26;a=.3;}
      else{const rr=i%3===0?.2:random()*.2,g=i%3===0?phi:Math.floor(phi/tau*10)/10*tau;x=wh[0]+Math.cos(g)*rr;y=WY+Math.sin(g)*rr;z=wh[1]+(wh[1]>0?.13:-.13);a=.55;}
    }else if(u<.94){
      if(i%2){const sd=i%4<2?1:-1;x=1.66+.1*v;y=-.32+.12*w;z=sd*(.52+.04*v);a=.95;}
      else{x=-2;y=-.12+gaussian()*.006;z=-.66+1.32*v;a=.95;}
    }else{
      const part=i%3;
      if(part===0){x=1.72+.36*v;y=FLOOR-.02;z=(w*2-1)*.72;a=.28;}
      else if(part===1){x=-2.02+.32*w;z=(Math.floor(v*7)-3)*.15;y=FLOOR+.16*random();a=.16;}
      else{const sd=i%2?1:-1;x=X;z=sd*lerpKeys(CAR.w,s);y=FLOOR;a=.4;}
    }
    x*=.8;y*=.8;z*=.8;
  }else if(kind===11){
    // Event map: a street grid with roads, and pinned events with rings.
    const pins=[[-1.4,.6,.7],[-.6,-.8,.5],[.2,.3,.9],[1.1,-.4,.6],[1.6,.9,.45],[-.2,1,.55],[.8,-1.1,.65]];
    if(u<.45){x=-2+v*4;z=-1.4+w*2.8;if(i%2)x=-2+Math.round(v*20)/20*4;else z=-1.4+Math.round(w*14)/14*2.8;y=-.6;a=.08+random()*.08;}
    else if(u<.65){const k=i%3;x=-2+4*v;z=.9*Math.sin(v*3+k*2)*.6+(k-1)*.75;y=-.6;a=.42;}
    else{const p=pins[i%7],part=w;
      if(part<.6){x=p[0]+gaussian()*.012;z=p[1]+gaussian()*.012;y=-.6+v*p[2];a=.55;}
      else if(part<.8){x=p[0]+gaussian()*.05;z=p[1]+gaussian()*.05;y=-.6+p[2]+gaussian()*.05;a=.95;}
      else{const g=v*tau;x=p[0]+Math.cos(g)*.2;z=p[1]+Math.sin(g)*.2;y=-.6;a=.45;}}
  }else{
    // Usage dashboard: three allowance gauges over a bar chart of token history.
    if(u<.55){const g=i%3,cx=(g-1)*1.35,cy=.4,R=.5,fill=[.72,.45,.9][g],ang=Math.PI*1.25-v*Math.PI*1.5,r=R+(w-.5)*.07;
      x=cx+Math.cos(ang)*r;y=cy+Math.sin(ang)*r;a=v<fill?.85:.14;}
    else if(u<.6){const g=i%3;x=(g-1)*1.35+gaussian()*.03;y=.4+gaussian()*.03;a=.9;}
    else{const b=i%24,bx=-2+(b+.5)*(4/24),h=.15+.55*(.5+.5*Math.sin(b*.7+1.3))*(.6+.4*Math.sin(b*.23));
      x=bx+(v-.5)*.11;y=-1+w*h;a=.32+random()*.2;}
  }
  return[x,y,z,a];
}
const shapes=Array.from({length:13},(_,k)=>makeShape(k));

// ---------- State ----------
const clock=()=>performance.now()/1000;
const smooth=x=>{x=Math.max(0,Math.min(1,x));return x*x*(3-2*x);};
const easeInOut=x=>{x=Math.max(0,Math.min(1,x));return x<.5?4*x*x*x:1-Math.pow(-2*x+2,3)/2;};
let topic=reduced.matches?0:FRAME,seqIndex=sequence.indexOf(topic),activePlate=0,hoverScene=null;
let from=shapes[topic],to=shapes[topic],fromKind=topic,fromFlat=topic===FRAME?1:0;
let elapsed=0,morph=1,time=0,sceneTime=0,paused=false;
const t0=clock();
let drawStart=reduced.matches?-100:t0+.15;
let W=1,H=1,ratio=1,anchors=[],presets=[];
const cur=[0,0,0,0,1],vel=[0,0,0,0,0];
let tiltX=0,tiltY=0,tiltTX=0,tiltTY=0,pointerX=-9,pointerY=-9,pointerGlow=0,pointerOn=false;
let frameHalfU=[2,1.5];

function rectPoint(s,hx,hy){
  const P=4*(hx+hy);let d=(((s%1)+1)%1)*P;
  if(d<2*hx)return[-hx+d,hy,0,1];d-=2*hx;
  if(d<2*hy)return[hx,hy-d,1,0];d-=2*hy;
  if(d<2*hx)return[hx-d,-hy,0,-1];d-=2*hx;
  return[-hx,-hy+d,-1,0];
}
function drawLevel(now){return drawStart<0?1:easeInOut((now-drawStart)/1.8);}
// CPU mirror of the vertex shader, used only to capture positions mid-transition.
function animated(data,k,kind,t){
  let x=data[k],y=data[k+1],z=data[k+2],alpha=data[k+3];
  const i=k/4,phase=meta[i*3+2];
  if(kind===0&&data[k+3]>.85){const p=routePosition(data[k+3]>.95?Math.min(sceneTime/3.1,.99999):t*.28+phase);x+=p[0];z+=p[1];}
  else if(kind===1&&data[k+3]>.85){if(data[k+3]>.95)x+=-1.8+((t*.7+phase)%1)*1.65;else{const p=trainingPosition(t*.27+phase);x+=p[0];y+=p[1];z+=p[2];}alpha*=.12+.88*Math.pow(.5+.5*Math.cos(phase*tau*3),8);}
  else if(kind===2&&data[k+3]>.85){const pair=Math.round(y/1.28)+1,angle=t*.55*Math.pow(.3,pair),c=Math.cos(angle),s=Math.sin(angle);const nx=c*x-s*z;z=s*x+c*z;x=nx;}
  else if(kind===4){x+=Math.sin(t*1.2+phase*20)*.013;y+=Math.cos(t+phase*17)*.013;}
  else if(kind>FRAME){
    if(kind===7&&x>-2.2+((sceneTime*.9)%4.8))alpha=0;
    if(kind===10){const g=t*.22,c=Math.cos(g),sn=Math.sin(g);const nx=c*x-sn*z;z=sn*x+c*z;x=nx;}
    alpha*=.78+.22*Math.sin(t*1.6+phase*tau);
  }
  else if(kind===FRAME){const s=((x+t*(.004+.012*meta[i*3]))%1+1)%1,r=rectPoint(s,frameHalfU[0],frameHalfU[1]);const off=y;x=r[0]+r[2]*off;y=r[1]+r[3]*off;z=0;if(s>drawLevel(clock()))alpha=0;}
  return[x,y,z,alpha];
}
function capture(){
  const result=new Float32Array(count*4);
  for(let i=0;i<count;i++){
    const k=i*4,s=meta[i*3],m=smooth((morph-s*.08)/.92);
    const a=animated(from,k,fromKind,time),b=animated(to,k,topic,time);
    const bridge=Math.sin(Math.PI*m)*.23;
    result[k]=a[0]+(b[0]-a[0])*m+Math.sin(s*43)*bridge;
    result[k+1]=a[1]+(b[1]-a[1])*m+Math.cos(s*31)*bridge;
    result[k+2]=a[2]+(b[2]-a[2])*m+Math.sin(s*71)*bridge;
    result[k+3]=a[3]+(b[3]-a[3])*m;
  }
  return result;
}
function currentFlat(){return fromFlat+((topic===FRAME?1:0)-fromFlat)*smooth(morph);}
function select(next){
  if(next===topic)return;
  const flat=currentFlat();
  from=capture();fromKind=-1;fromFlat=flat;topic=next;to=shapes[topic];
  morph=reduced.matches?1:0;elapsed=0;sceneTime=0;
  updateCaption();upload();
}
function updateCaption(){
  if(!caption)return;
  if(topic===FRAME){caption.classList.add('is-hidden');return;}
  caption.textContent=topics[topic][0];caption.title=topics[topic][1];caption.classList.remove('is-hidden');
}

// ---------- WebGL ----------
const routeShader=route.map((_,i)=>{const p=routePoint(i);return `if(n<${i+.5})return vec2(${p[0].toFixed(4)},${p[1].toFixed(4)});`;}).join('');
const trainingShader=trainingCurves.map((p,i)=>`if(n<${i+.5})return ${p.map((v,j)=>['g*g*g','3.*g*g*f','3.*g*f*f','f*f*f'][j]+`*vec2(${v[0].toFixed(4)},${v[1].toFixed(4)})`).join('+')};`).join('');
const particleVertex=`
precision highp float;
attribute vec4 aFrom,aTo;attribute vec3 aMeta;
uniform float uTime,uSceneTime,uMorph,uRatio,uFromKind,uToKind,uPresence,uFromFlat,uToFlat,uOutside,uDraw,uPointerGlow,uAspect;
uniform vec2 uTilt,uCenter,uScale,uFrameHalf,uFrameC,uFrameH,uPointer;
varying float vAlpha;
vec2 routePoint(float n){${routeShader}return vec2(1.45,1.45);}
vec2 routePosition(float phase){float step=fract(phase)*14.;float n=floor(step);return mix(routePoint(n),routePoint(n+1.),fract(step));}
vec2 trainingPosition(float phase){float t=fract(phase)*4.;float n=floor(t),f=fract(t),g=1.-f;${trainingShader}return vec2(0.,.65);}
vec2 rectPoint(float s,vec2 h,out vec2 nrm){
  float d=fract(s)*4.*(h.x+h.y);
  if(d<2.*h.x){nrm=vec2(0.,1.);return vec2(-h.x+d,h.y);}d-=2.*h.x;
  if(d<2.*h.y){nrm=vec2(1.,0.);return vec2(h.x,h.y-d);}d-=2.*h.y;
  if(d<2.*h.x){nrm=vec2(0.,-1.);return vec2(h.x-d,-h.y);}d-=2.*h.x;
  nrm=vec2(-1.,0.);return vec2(-h.x,-h.y+d);
}
vec4 animate(vec4 p,float kind){
  if(kind>-.5&&kind<.5&&p.w>.85){vec2 path=routePosition(p.w>.95?min(uSceneTime/3.1,.99999):uTime*.28+aMeta.z);p.xz+=path;}
  else if(kind>.5&&kind<1.5&&p.w>.85){
    if(p.w>.95)p.x+=-1.8+fract(uTime*.7+aMeta.z)*1.65;
    else{float phase=uTime*.27+aMeta.z;p.xy+=trainingPosition(phase);p.z+=.08*sin(fract(phase)*12.5663706);}
    p.w*=.12+.88*pow(.5+.5*cos(aMeta.z*18.8495559),8.);
  }
  else if(kind>1.5&&kind<2.5&&p.w>.85){float pair=floor(p.y/1.28+.5)+1.;float angle=uTime*.55*pow(.3,pair);p.xz=mat2(cos(angle),sin(angle),-sin(angle),cos(angle))*p.xz;}
  else if(kind>3.5&&kind<4.5){p.xy+=vec2(sin(uTime*1.2+aMeta.z*20.),cos(uTime+aMeta.z*17.))*.013;}
  else if(kind>5.5){
    if(kind>6.5&&kind<7.5)p.w*=step(p.x,-2.2+mod(uSceneTime*.9,4.8));
    if(kind>9.5&&kind<10.5){float g=uTime*.22;p.xz=mat2(cos(g),sin(g),-sin(g),cos(g))*p.xz;}
    p.w*=.78+.22*sin(uTime*1.6+aMeta.z*6.2831853);
  }
  else if(kind>4.5){
    float s=fract(p.x+uTime*(.004+.012*aMeta.x));vec2 nrm;vec2 q=rectPoint(s,uFrameHalf,nrm);
    p.xy=q+nrm*p.y;p.z=0.;p.w*=step(s,uDraw);
  }
  return p;
}
void main(){
  float s=aMeta.x;float m=clamp((uMorph-s*.08)/.92,0.,1.);m=m*m*(3.-2.*m);
  vec4 p=mix(animate(aFrom,uFromKind),animate(aTo,uToKind),m);
  p.xyz+=sin(3.14159265*m)*.23*vec3(sin(s*43.),cos(s*31.),sin(s*71.));
  float flatness=mix(uFromFlat,uToFlat,m);
  vec3 r=p.xyz;
  float yaw=.20+sin(uTime*.16)*.13+uTilt.x*.09,pitch=.53+uTilt.y*.06;
  r.xz=mat2(cos(yaw),-sin(yaw),sin(yaw),cos(yaw))*r.xz;
  r.yz=mat2(cos(pitch),-sin(pitch),sin(pitch),cos(pitch))*r.yz;
  r=mix(r,p.xyz,flatness);
  float depth=1./(1.+r.z*.11);
  vec2 screen=r.xy*uScale*depth+uCenter;
  gl_Position=vec4(screen,0.,1.);
  gl_PointSize=clamp(aMeta.y*uRatio*depth*1.75*(1.+flatness*.4),.8,4.5);
  vec2 rel=abs(screen-uFrameC)/uFrameH;float edge=max(rel.x,rel.y);
  float inside=1.-smoothstep(.975,1.03,edge);
  float a=p.w*uPresence*(.8+sin(uTime*.35+s*18.)*.12);
  a*=mix(mix(uOutside,1.,inside),1.,flatness);
  vec2 dp=(screen-uPointer)*vec2(uAspect,1.);
  a*=1.+uPointerGlow*exp(-dot(dp,dp)*20.);
  vAlpha=a;
}`;
const particleFragment=`precision mediump float;varying float vAlpha;
void main(){float r=length(gl_PointCoord-.5)*2.;if(r>1.)discard;float a=exp(-r*r*2.8)*vAlpha;gl_FragColor=vec4(vec3(.93,.93,.9)*a,a);}`;
const quadVertex=`attribute vec2 aPos;varying vec2 vUv;void main(){vUv=aPos*.5+.5;gl_Position=vec4(aPos,0.,1.);}`;
const blurFragment=`precision mediump float;varying vec2 vUv;uniform sampler2D uTex;uniform vec2 uDir;
void main(){vec4 c=texture2D(uTex,vUv)*.2270270;
c+=texture2D(uTex,vUv+uDir*1.3846154)*.3162162;c+=texture2D(uTex,vUv-uDir*1.3846154)*.3162162;
c+=texture2D(uTex,vUv+uDir*3.2307692)*.0702703;c+=texture2D(uTex,vUv-uDir*3.2307692)*.0702703;gl_FragColor=c;}`;
// Composite: black ground, particles with a slight split while moving, bloom, the hairline frame, grain.
const compositeFragment=`precision highp float;varying vec2 vUv;
uniform sampler2D uScene,uBloom;uniform vec2 uRes,uFrameC,uFrameH;
uniform float uDraw,uMotion,uGrainTime;
float hash(vec2 p){p=fract(p*vec2(123.34,456.21));p+=dot(p,p+45.32);return fract(p.x*p.y);}
float sdBox(vec2 p,vec2 b){vec2 d=abs(p)-b;return length(max(d,0.))+min(max(d.x,d.y),0.);}
float perimeter(vec2 p,vec2 h){
  // The draw starts and ends at the top-left corner; count its outer quadrant as the start.
  if(p.x<-h.x&&p.y>h.y)return 0.;
  vec2 q=clamp(p,-h,h);float P=4.*(h.x+h.y);float s;
  if(h.x-abs(p.x)<h.y-abs(p.y)){s=p.x>0.?2.*h.x+(h.y-q.y):4.*h.x+2.*h.y+(q.y+h.y);}
  else{s=p.y>0.?q.x+h.x:2.*h.x+2.*h.y+(h.x-q.x);}
  return s/P;
}
void main(){
  vec2 px=vUv*uRes;vec2 p=px-uFrameC;
  float d=sdBox(p,uFrameH);float line=abs(d);
  float P=4.*(uFrameH.x+uFrameH.y);float s=perimeter(p,uFrameH);
  vec2 c=vUv-.5;
  float ca=(.0012+.004*dot(c,c))*(1.+uMotion*3.);vec2 off=c*ca;
  vec3 scene=vec3(texture2D(uScene,vUv+off).r,texture2D(uScene,vUv).g,texture2D(uScene,vUv-off).b);
  vec3 bloom=texture2D(uBloom,vUv).rgb*.75;
  float drawn=uDraw>.999?1.:1.-step(uDraw,s);
  float tip=(uDraw-s)*P;
  float spark=exp(-(tip*tip+line*line)/260.)*(1.-step(.999,uDraw))*step(.0001,uDraw);
  float frame=(drawn*((1.-smoothstep(.5,1.4,line))*.95+exp(-line/4.)*.22+exp(-line/30.)*.05)+spark*1.6)*(1.+uMotion*.5);
  vec3 col=vec3(.03)+scene+bloom+vec3(frame);
  col=1.-exp(-col*1.3);
  col=vec3(dot(col,vec3(.299,.587,.114)));
  col=mix(col,col*col*(3.-2.*col),.35);
  float vig=smoothstep(1.3,.2,length(c*vec2(uRes.x/uRes.y,1.)));
  col*=mix(1.,vig,.5);
  col+=(hash(gl_FragCoord.xy+fract(uGrainTime)*731.)-.5)*.075;
  gl_FragColor=vec4(col,1.);
}`;

let gl,pProgram,bProgram,cProgram,fromBuffer,toBuffer,metaBuffer,quadBuffer,pu,bu,cu,sceneT,bloomA,bloomB;
function compile(type,source){const s=gl.createShader(type);gl.shaderSource(s,source);gl.compileShader(s);if(!gl.getShaderParameter(s,gl.COMPILE_STATUS)){const log=gl.getShaderInfoLog(s);gl.deleteShader(s);throw new Error(log);}return s;}
function program(vs,fs,attribs){
  const p=gl.createProgram();gl.attachShader(p,compile(gl.VERTEX_SHADER,vs));gl.attachShader(p,compile(gl.FRAGMENT_SHADER,fs));
  attribs.forEach((name,i)=>gl.bindAttribLocation(p,i,name));gl.linkProgram(p);
  if(!gl.getProgramParameter(p,gl.LINK_STATUS))throw new Error(gl.getProgramInfoLog(p));return p;
}
function locations(p,names){return Object.fromEntries(names.map(n=>[n,gl.getUniformLocation(p,n)]));}
function target(w,h,old){
  if(old){gl.deleteTexture(old.t);gl.deleteFramebuffer(old.f);}
  const t=gl.createTexture();gl.bindTexture(gl.TEXTURE_2D,t);
  gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,w,h,0,gl.RGBA,gl.UNSIGNED_BYTE,null);
  gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);
  const f=gl.createFramebuffer();gl.bindFramebuffer(gl.FRAMEBUFFER,f);gl.framebufferTexture2D(gl.FRAMEBUFFER,gl.COLOR_ATTACHMENT0,gl.TEXTURE_2D,t,0);
  if(gl.checkFramebufferStatus(gl.FRAMEBUFFER)!==gl.FRAMEBUFFER_COMPLETE)throw new Error('Framebuffer incomplete');
  gl.bindFramebuffer(gl.FRAMEBUFFER,null);return{t,f,w,h};
}
function useFallback(error){
  if(error)console.warn('Mono frame: using the CSS frame.',error);
  if(gl){gl.getExtension('WEBGL_lose_context')?.loseContext();gl=null;}
  const replacement=canvas.cloneNode();canvas.replaceWith(replacement);canvas=replacement;html.classList.add('no-gl');
}
function initGL(){
  try{
    gl=canvas.getContext('webgl',{alpha:false,antialias:false,depth:false,premultipliedAlpha:false});
    if(!gl)throw new Error('WebGL unavailable');
    pProgram=program(particleVertex,particleFragment,['aFrom','aTo','aMeta']);
    bProgram=program(quadVertex,blurFragment,['aPos']);
    cProgram=program(quadVertex,compositeFragment,['aPos']);
    const make=data=>{const b=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,b);gl.bufferData(gl.ARRAY_BUFFER,data,gl.DYNAMIC_DRAW);return b;};
    fromBuffer=make(from);toBuffer=make(to);metaBuffer=make(meta);quadBuffer=make(new Float32Array([-1,-1,3,-1,-1,3]));
    pu=locations(pProgram,['uTime','uSceneTime','uMorph','uRatio','uFromKind','uToKind','uPresence','uFromFlat','uToFlat','uOutside','uDraw','uPointerGlow','uAspect','uTilt','uCenter','uScale','uFrameHalf','uFrameC','uFrameH','uPointer']);
    bu=locations(bProgram,['uTex','uDir']);
    cu=locations(cProgram,['uScene','uBloom','uRes','uFrameC','uFrameH','uDraw','uMotion','uGrainTime']);
  }catch(error){useFallback(error);}
}
function upload(){
  if(!gl)return;
  gl.bindBuffer(gl.ARRAY_BUFFER,fromBuffer);gl.bufferData(gl.ARRAY_BUFFER,from,gl.DYNAMIC_DRAW);
  gl.bindBuffer(gl.ARRAY_BUFFER,toBuffer);gl.bufferData(gl.ARRAY_BUFFER,to,gl.DYNAMIC_DRAW);
}
function bindParticles(){
  [[fromBuffer,4],[toBuffer,4],[metaBuffer,3]].forEach(([b,size],i)=>{gl.bindBuffer(gl.ARRAY_BUFFER,b);gl.enableVertexAttribArray(i);gl.vertexAttribPointer(i,size,gl.FLOAT,false,0,0);});
}
function bindQuad(){
  gl.bindBuffer(gl.ARRAY_BUFFER,quadBuffer);gl.enableVertexAttribArray(0);gl.vertexAttribPointer(0,2,gl.FLOAT,false,0,0);
  gl.disableVertexAttribArray(1);gl.disableVertexAttribArray(2);
}

// ---------- Layout: each plate sets the frame (cx cy width height presence, as viewport fractions) ----------
function presetFor(plate,i){
  const raw=narrow.matches?(plate.dataset.frameMobile||(i===0?plate.dataset.frame:'0.5 0.52 0.94 0.76 0.22'))
    :medium.matches&&plate.dataset.frameMedium?plate.dataset.frameMedium:plate.dataset.frame;
  return (raw||'0.5 0.52 0.94 0.76 0.22').split(/\s+/).map(Number);
}
function measure(){anchors=plates.map(p=>p.getBoundingClientRect().top+scrollY);presets=plates.map(presetFor);}
// A frame wrapped around a live element: follows it while the page scrolls.
function wrap(el,pad,presence){
  const r=el.getBoundingClientRect();
  return[(r.left+r.width/2)/W,(r.top+r.height/2)/H,(r.width+2*pad)/W,(r.height+2*pad)/H,presence];
}
function presetAt(i){
  const plate=plates[i],sel=plate.dataset.frameTarget;
  const el=sel&&plate.querySelector(sel);
  return el?wrap(el,+(plate.dataset.framePad||24),+(plate.dataset.framePresence||0)):presets[i];
}
function sceneList(plate){
  const l=(plate&&plate.dataset.scenes||'').split(/[\s,]+/).map(n=>NAMES[n]).filter(n=>n!=null);
  return l.length?l:defaultSequence;
}
function activeIndex(){
  const y=scrollY;let a=0;
  for(let i=1;i<plates.length;i++){const t=(y-(anchors[i]-.72*H))/(.62*H);if(t>=.5)a=i;else if(t<=0)break;}
  return a;
}
function setPlate(i){
  activePlate=i;sequence=sceneList(plates[i]);
  seqIndex=sequence.indexOf(topic);
  if(hoverScene||topic===FRAME||seqIndex>=0)return;
  seqIndex=0;select(sequence[0]);
}
function targetFrame(){
  if(hoverEl&&document.contains(hoverEl))return wrap(hoverEl,+(hoverEl.dataset.framePad||14),0);
  const y=scrollY;const f=presetAt(0).slice();
  for(let i=1;i<plates.length;i++){
    const t=easeInOut((y-(anchors[i]-.72*H))/(.62*H));
    if(t<=0)break;
    const g=presetAt(i);
    for(let k=0;k<5;k++)f[k]+=(g[k]-f[k])*t;
  }
  return f;
}
function targetPixels(){const f=targetFrame();return[f[0]*W,f[1]*H,f[2]*W/2,f[3]*H/2,f[4]];}

// ---------- Render ----------
let raf=0,last=0;
function render(now){
  const [fx,fy,hw,hh,presence]=cur;
  if(!gl){
    if(fallback){fallback.style.left=(fx-hw)+'px';fallback.style.top=(fy-hh)+'px';fallback.style.width=(hw*2)+'px';fallback.style.height=(hh*2)+'px';}
    return;
  }
  const pixels=Math.max(8,Math.min(hw/2.2,hh/1.85));
  frameHalfU=[hw/pixels,hh/pixels];
  const draw=drawLevel(now);
  const cw=canvas.width,ch=canvas.height;
  const motion=Math.min(1,(Math.abs(vel[0])+Math.abs(vel[1])+Math.abs(vel[2])+Math.abs(vel[3]))/(W*2.2));
  // 1. Particles into the scene target.
  gl.bindFramebuffer(gl.FRAMEBUFFER,sceneT.f);gl.viewport(0,0,cw,ch);
  gl.clearColor(0,0,0,0);gl.clear(gl.COLOR_BUFFER_BIT);
  gl.useProgram(pProgram);bindParticles();
  gl.enable(gl.BLEND);gl.blendFunc(gl.ONE,gl.ONE);
  gl.uniform1f(pu.uTime,time);gl.uniform1f(pu.uSceneTime,sceneTime);gl.uniform1f(pu.uMorph,morph);gl.uniform1f(pu.uRatio,ratio);
  gl.uniform1f(pu.uFromKind,fromKind);gl.uniform1f(pu.uToKind,topic);gl.uniform1f(pu.uPresence,presence*.92);
  gl.uniform1f(pu.uFromFlat,fromFlat);gl.uniform1f(pu.uToFlat,topic===FRAME?1:0);
  gl.uniform1f(pu.uOutside,.1);gl.uniform1f(pu.uDraw,draw);
  gl.uniform1f(pu.uPointerGlow,pointerGlow*.45);gl.uniform1f(pu.uAspect,W/H);
  gl.uniform2f(pu.uTilt,tiltX,tiltY);
  gl.uniform2f(pu.uCenter,fx/W*2-1,1-fy/H*2);gl.uniform2f(pu.uScale,2*pixels/W,2*pixels/H);
  gl.uniform2f(pu.uFrameHalf,frameHalfU[0],frameHalfU[1]);
  gl.uniform2f(pu.uFrameC,fx/W*2-1,1-fy/H*2);gl.uniform2f(pu.uFrameH,2*hw/W,2*hh/H);
  gl.uniform2f(pu.uPointer,pointerX,pointerY);
  if(presence>.001)gl.drawArrays(gl.POINTS,0,W<500?24000:count);
  gl.disable(gl.BLEND);
  // 2. Bloom at quarter resolution.
  gl.useProgram(bProgram);bindQuad();gl.uniform1i(bu.uTex,0);gl.activeTexture(gl.TEXTURE0);
  const pass=(src,dst,dx,dy)=>{gl.bindFramebuffer(gl.FRAMEBUFFER,dst.f);gl.viewport(0,0,dst.w,dst.h);gl.bindTexture(gl.TEXTURE_2D,src.t);gl.uniform2f(bu.uDir,dx,dy);gl.drawArrays(gl.TRIANGLES,0,3);};
  pass(sceneT,bloomA,2/sceneT.w,0);
  pass(bloomA,bloomB,0,1.6/bloomA.h);
  pass(bloomB,bloomA,2.6/bloomA.w,0);
  pass(bloomA,bloomB,0,2.6/bloomA.h);
  // 3. Composite to the screen.
  gl.bindFramebuffer(gl.FRAMEBUFFER,null);gl.viewport(0,0,cw,ch);
  gl.useProgram(cProgram);bindQuad();
  gl.activeTexture(gl.TEXTURE0);gl.bindTexture(gl.TEXTURE_2D,sceneT.t);gl.uniform1i(cu.uScene,0);
  gl.activeTexture(gl.TEXTURE1);gl.bindTexture(gl.TEXTURE_2D,bloomB.t);gl.uniform1i(cu.uBloom,1);
  gl.uniform2f(cu.uRes,W,H);gl.uniform2f(cu.uFrameC,fx,H-fy);gl.uniform2f(cu.uFrameH,hw,hh);
  gl.uniform1f(cu.uDraw,draw);gl.uniform1f(cu.uMotion,motion);
  gl.uniform1f(cu.uGrainTime,animatingScene()?now:0);
  gl.drawArrays(gl.TRIANGLES,0,3);
  gl.activeTexture(gl.TEXTURE0);
}
function animatingScene(){return !paused&&!reduced.matches&&!document.hidden;}
function tick(){
  raf=0;const now=clock();const dt=Math.min(now-last,.1);last=now;
  if(animatingScene()){
    time+=dt;sceneTime+=dt;
    if(morph<1)morph=Math.min(1,morph+dt/morphDuration);
    else{elapsed+=dt;if(elapsed>=(topic===FRAME?frameHold:hold)){
      if(hoverScene)elapsed=0;
      else if(sequence.length>1||sequence[0]!==topic){seqIndex=(seqIndex+1)%sequence.length;select(sequence[seqIndex]);}
      else elapsed=0;
    }}
  }
  const ai=activeIndex();if(ai!==activePlate)setPlate(ai);
  // The frame follows its target on a spring; reduced motion snaps.
  const goal=targetPixels();let settling=false;
  for(let k=0;k<5;k++){
    if(reduced.matches){cur[k]=goal[k];vel[k]=0;continue;}
    const a=(goal[k]-cur[k])*70-vel[k]*13.5;vel[k]+=a*dt;cur[k]+=vel[k]*dt;
    if(Math.abs(goal[k]-cur[k])>.05||Math.abs(vel[k])>.05)settling=true;
  }
  tiltX+=(tiltTX-tiltX)*.06;tiltY+=(tiltTY-tiltY)*.06;
  pointerGlow+=((pointerOn?1:0)-pointerGlow)*.08;
  render(now);
  const busy=animatingScene()||settling||drawLevel(now)<1||Math.abs(pointerGlow-(pointerOn?1:0))>.01;
  if(busy&&!document.hidden)raf=requestAnimationFrame(tick);
}
function wake(){if(!raf){last=clock();raf=requestAnimationFrame(tick);}}
function resize(){
  W=Math.max(1,innerWidth);H=Math.max(1,innerHeight);ratio=Math.min(devicePixelRatio||1,1.5);
  canvas.width=Math.round(W*ratio);canvas.height=Math.round(H*ratio);
  if(gl){
    try{
      sceneT=target(canvas.width,canvas.height,sceneT);
      const bw=Math.max(1,Math.round(canvas.width/4)),bh=Math.max(1,Math.round(canvas.height/4));
      bloomA=target(bw,bh,bloomA);bloomB=target(bw,bh,bloomB);
    }catch(error){useFallback(error);}
  }
  measure();
  if(!cur[2]){const t=targetPixels();for(let k=0;k<5;k++)cur[k]=t[k];}
  wake();
}

// ---------- Controls, reveal, pointer, lifecycle ----------
const pauseButton=document.querySelector('.fl-pause');
if(pauseButton)pauseButton.addEventListener('click',()=>{paused=!paused;pauseButton.setAttribute('aria-pressed',String(paused));pauseButton.textContent=paused?'Play':'Pause';wake();});
if(reduced.matches||!('IntersectionObserver' in window)){plates.forEach(p=>p.classList.add('is-in'));}
else{const io=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('is-in');io.unobserve(e.target);}}),{threshold:.12});plates.forEach(p=>io.observe(p));}
addEventListener('pointermove',e=>{
  if(reduced.matches)return;
  tiltTX=e.clientX/W-.5;tiltTY=e.clientY/H-.5;pointerX=e.clientX/W*2-1;pointerY=1-e.clientY/H*2;pointerOn=true;wake();
},{passive:true});
document.documentElement.addEventListener('pointerleave',()=>{tiltTX=tiltTY=0;pointerOn=false;wake();});
addEventListener('scroll',wake,{passive:true});
// Hovering or focusing a project marked data-scene-hover shows its scene.
function setSceneHover(el){
  const name=el?el.dataset.sceneHover:null;
  if(name===hoverScene)return;
  hoverScene=name;
  if(name&&NAMES[name]!=null){select(NAMES[name]);elapsed=0;}
  else seqIndex=sequence.indexOf(topic);
  wake();
}
document.addEventListener('pointerover',e=>{if(e.pointerType==='mouse')setSceneHover(e.target.closest?.('[data-scene-hover]')||null);},{passive:true});
document.addEventListener('focusin',e=>setSceneHover(e.target.closest?.('[data-scene-hover]')||null));
// Hovering or focusing an element marked data-frame-hover pulls the frame onto it.
let hoverEl=null;
function setHover(el){if(el!==hoverEl){hoverEl=el;wake();}}
document.addEventListener('pointerover',e=>{if(e.pointerType==='mouse')setHover(e.target.closest?.('[data-frame-hover]')||null);},{passive:true});
document.addEventListener('focusin',e=>setHover(e.target.closest?.('[data-frame-hover]')||null));
document.addEventListener('focusout',e=>{if(!e.relatedTarget?.closest?.('[data-frame-hover]'))setHover(null);});
addEventListener('resize',resize);
document.addEventListener('visibilitychange',wake);
reduced.addEventListener('change',()=>{morph=1;plates.forEach(p=>p.classList.add('is-in'));wake();});
narrow.addEventListener('change',()=>{measure();wake();});
medium.addEventListener('change',()=>{measure();wake();});
if('ResizeObserver' in window)new ResizeObserver(()=>{measure();wake();}).observe(document.body);
addEventListener('pagehide',()=>{cancelAnimationFrame(raf);raf=0;});
addEventListener('pageshow',wake);

updateCaption();initGL();resize();
})();
