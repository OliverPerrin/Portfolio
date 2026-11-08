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
  ['Multi-task learning','A shared encoder feeds three task heads.']
];
const FRAME=5;                       // every particle sits on the frame itself
const sequence=[FRAME,0,1,2,3,4];
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
    }else{
      // The frame: x stores a perimeter position, y an offset along the edge normal.
      const edge=u<.84;x=v;y=edge?gaussian()*.006:-Math.abs(gaussian())*.045;z=0;a=edge?.7+w*.3:.16+w*.14;
    }
    data.set([x,y,z,a],i*4);
  }
  return data;
}
const shapes=[0,1,2,3,4,5].map(makeShape);

// ---------- State ----------
const clock=()=>performance.now()/1000;
const smooth=x=>{x=Math.max(0,Math.min(1,x));return x*x*(3-2*x);};
const easeInOut=x=>{x=Math.max(0,Math.min(1,x));return x<.5?4*x*x*x:1-Math.pow(-2*x+2,3)/2;};
let topic=reduced.matches?0:FRAME,seqIndex=sequence.indexOf(topic);
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
  return raw.split(/\s+/).map(Number);
}
function measure(){anchors=plates.map(p=>p.getBoundingClientRect().top+scrollY);presets=plates.map(presetFor);}
function targetFrame(){
  const y=scrollY;const f=presets[0].slice();
  for(let i=1;i<plates.length;i++){
    const t=easeInOut((y-(anchors[i]-.72*H))/(.62*H));
    if(t<=0)break;
    for(let k=0;k<5;k++)f[k]+=(presets[i][k]-f[k])*t;
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
    else{elapsed+=dt;if(elapsed>=(topic===FRAME?frameHold:hold)){seqIndex=(seqIndex+1)%sequence.length;select(sequence[seqIndex]);}}
  }
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
