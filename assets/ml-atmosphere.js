// Continuous synthetic ML structures, adapted from the approved portfolio study.
(() => {
  'use strict';
  const stage=document.querySelector('.ml-atmosphere');
  if(!stage)return;
  let canvas=stage.querySelector('canvas');
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  const topics=[
    ['Reinforcement learning', 'An illustrative gridworld: an agent follows a path through obstacles toward a reward.'],
    ['Supervised fine-tuning', 'Examples enter the model; predictions produce a loss that drives a weight update.'],
    ['Rotary position encoding', 'Three coordinate pairs rotate at different frequencies.'],
    ['Optimization', 'A synthetic quadratic loss surface and a descending path.'],
    ['Multi-task learning', 'A shared encoder feeds three task heads.']
  ];
  // Short, moving scenes joined by a continuous particle current.
  const count=36000,hold=3.6,morphDuration=1.7,tau=Math.PI*2;
  const route=[[0,0],[1,0],[2,0],[2,1],[3,1],[4,1],[4,2],[4,3],[3,3],[2,3],[2,4],[2,5],[3,5],[4,5],[5,5]];
  const walls=[[1,1],[1,2],[1,4],[2,2],[3,0],[3,2],[3,4],[4,4]];
  const cell=.58;
  const routePoint=(n)=>[(route[n][0]-2.5)*cell,(route[n][1]-2.5)*cell];
  function routePosition(phase){
    const t=((phase%1)+1)%1*(route.length-1),i=Math.min(route.length-2,Math.floor(t)),f=t-i;
    const a=routePoint(i),b=routePoint(i+1);return[a[0]+(b[0]-a[0])*f,a[1]+(b[1]-a[1])*f];
  }
  const trainingCurves=[
    [[0,.65],[.45,.65],[1.1,.65],[1.55,.65]],
    [[1.55,.65],[1.95,.3],[1.95,-.85],[1.4,-.95]],
    [[1.4,-.95],[.9,-1.15],[.1,-1.15],[-.2,-.85]],
    [[-.2,-.85],[-.6,-.45],[-.5,.25],[0,.65]]
  ];
  function trainingPosition(phase){
    const t=((phase%1)+1)%1*4,n=Math.floor(t),f=t-n,g=1-f,p=trainingCurves[n];
    return [0,1].map(axis=>g*g*g*p[0][axis]+3*g*g*f*p[1][axis]+3*g*f*f*p[2][axis]+f*f*f*p[3][axis]).concat(.08*Math.sin(t*Math.PI));
  }
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
        if(u<.30){
          // Tile rims define the traversable environment; no random cloud.
          const tile=i%36,cx=(tile%6-2.5)*cell,cz=(Math.floor(tile/6)-2.5)*cell;
          x=cx+(v-.5)*cell*.94;z=cz+(w-.5)*cell*.94;
          if(i%2===0)x=cx+(v<.5?-.47:.47)*cell;else z=cz+(w<.5?-.47:.47)*cell;
          y=-.70;a=.22+random()*.16;
        }else if(u<.60){
          const wall=walls[i%walls.length],face=i%5;
          x=(wall[0]-2.5)*cell+(v-.5)*cell*.88;
          z=(wall[1]-2.5)*cell+(w-.5)*cell*.88;y=-.70+random()*.57;
          if(face===0)y=-.13;
          if(face===1)x=(wall[0]-2.5)*cell-cell*.44;
          if(face===2)x=(wall[0]-2.5)*cell+cell*.44;
          if(face===3)z=(wall[1]-2.5)*cell-cell*.44;
          if(face===4)z=(wall[1]-2.5)*cell+cell*.44;
          a=.30+random()*.28;
        }else if(u<.77){
          const path=routePosition(v);x=path[0]+gaussian()*.018;z=path[1]+gaussian()*.018;y=-.64;a=.28;
        }else if(u<.85){
          x=gaussian()*.018;y=-.60;z=gaussian()*.018;a=.88;
        }else if(u<.94){
          const goal=routePoint(route.length-1),angle=v*tau,r=.16+(w-.5)*.035;
          x=goal[0]+Math.cos(angle)*r;z=goal[1]+Math.sin(angle)*r;y=-.65+random()*.8;a=.65;
        }else{
          // A single moving agent, represented by a tight spherical cloud.
          const angle=v*tau,h=w*2-1,r=Math.sqrt(1-h*h)*.105;
          x=Math.cos(angle)*r;y=-.43+h*.105;z=Math.sin(angle)*r;a=.99;
        }
      }else if(kind===1){
        if(u<.22){
          // Paired input/target token rows, arranged as three training examples.
          const batch=i%3,row=Math.floor(i/3)%2,token=Math.floor(i/6)%5;
          x=-1.95+token*.16+(v-.5)*.105;y=.94-batch*.28-row*.105+(w-.5)*.055;z=-.1+random()*.08;
          a=row===0?.32:.60;
        }else if(u<.48){
          // Three sheets form the model. Edges and interior lattices stay distinct.
          const layer=i%3,side=i%4;
          x=-.28+layer*.16+(v-.5)*.64;y=.70+(w-.5)*.85;z=layer*.22-.22;
          if(side===0)x=-.28+layer*.16-.32;
          if(side===1)x=-.28+layer*.16+.32;
          if(side===2)y=.70-.425;
          if(side===3)y=.70+.425;
          a=.38+random()*.23;
        }else if(u<.60){
          // Prediction/target comparisons on the right.
          const token=i%5;x=1.40+(v-.5)*.55;y=.91-token*.12+(w-.5)*.052;z=(i%2)*.12;
          a=i%2===0?.30:.62;
        }else if(u<.70){
          // A compact loss well on the lower arc.
          x=1.25+(v-.5)*.7;z=(w-.5)*.55;y=-.94+.9*(x-1.25)*(x-1.25)+z*z;a=.46;
        }else if(u<.92){
          x=gaussian()*.025;y=gaussian()*.025;z=gaussian()*.025;a=.90;
        }else{
          x=gaussian()*.018;y=.70+gaussian()*.018;z=gaussian()*.018;a=.99;
        }
      }else if(kind===2){
        const pair=i%3,marker=i%17===0;
        const angle=marker?(u-.5)*.07:u*tau;
        const radius=1.23+(v-.5)*(marker?.035:.085);
        x=Math.cos(angle)*radius;y=(pair-1)*1.28+(marker?0:(w-.5)*.045);z=Math.sin(angle)*radius;
        a=marker?.98:.055+w*.075;
      }else if(kind===3){
        if(i%9===0){
          const step=Math.floor(u*14),along=v;
          x=1.8*Math.pow(.80,step)*(1-along)+1.8*Math.pow(.80,step+1)*along;
          z=1.3*Math.pow(.72,step)*(1-along)+1.3*Math.pow(.72,step+1)*along;
          x+=(w-.5)*.022;z+=(random()-.5)*.022;
          y=.33*x*x+.55*z*z-1.05+.035;a=.96;
        }else{
          // Alternate fine rows and columns to give the surface a legible mesh.
          x=(u*2-1)*1.9;z=(v*2-1)*1.6;
          if(i%2===0)x=Math.round(x/.10)*.10;else z=Math.round(z/.10)*.10;
          y=.33*x*x+.55*z*z-1.05;a=.27+w*.2;
        }
      }else{
        const branch=i%3,headY=(branch-1)*1.35;
        if(u<.36){
          x=gaussian()*.065;y=-1.85+v*1.4;z=gaussian()*.065;a=.4+w*.28;
        }else if(u<.83){
          const t=v,e=t*t*(3-2*t);
          x=headY*e+gaussian()*.045;y=-.45+t*2.1;z=(branch-1)*.24*e+gaussian()*.045;a=.35+w*.3;
        }else{
          const shared=i%2===0;
          x=(shared?0:headY)+gaussian()*.12;
          y=(shared?[-1.65,-1.05,-.45][branch]:1.65)+gaussian()*.12;z=(shared?0:(branch-1)*.24)+gaussian()*.12;a=.6+w*.3;
        }
      }
      data.set([x,y,z,a],i*4);
    }
    return data;
  }
  const shapes=topics.map((_,i)=>makeShape(i));
  let from=shapes[0].slice(),to=shapes[0],topic=0,fromKind=-1;
  let elapsed=0,morph=1,time=0,sceneTime=0,visible=true,disposed=false;
  let width=1,height=1,ratio=1,raf=0,last=0,px=0,py=0,tx=0,ty=0;
  const smooth=x=>{x=Math.max(0,Math.min(1,x));return x*x*(3-2*x);};
  function animated(data,k,kind,t){
    let x=data[k],y=data[k+1],z=data[k+2],alpha=data[k+3];
    const phase=meta[k/4*3+2];
    if(kind===0&&data[k+3]>.85){
      const p=routePosition(data[k+3]>.95?Math.min(sceneTime/3.1,.99999):t*.28+phase);x+=p[0];z+=p[1];
    }else if(kind===1&&data[k+3]>.85){
      if(data[k+3]>.95)x+=-1.8+((t*.7+phase)%1)*1.65;
      else{const p=trainingPosition(t*.27+phase);x+=p[0];y+=p[1];z+=p[2];}
    }else if(kind===2&&data[k+3]>.85){
      const pair=Math.round(y/1.28)+1,angle=t*.55*Math.pow(.3,pair),c=Math.cos(angle),s=Math.sin(angle);
      const nx=c*x-s*z;z=s*x+c*z;x=nx;
    }else if(kind===4){
      x+=Math.sin(t*1.2+phase*20)*.013;y+=Math.cos(t+phase*17)*.013;
    }
    if(kind===1&&data[k+3]>.85)alpha*=.12+.88*Math.pow(.5+.5*Math.cos(phase*tau*3),8);
    return [x,y,z,alpha];
  }
  // Start each transition from the current moving geometry, including its bridge.
  function capture(stride=1,result=new Float32Array(count*4)){
    for(let i=0;i<count;i+=stride){
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
  function select(next){
    if(next===topic)return;
    from=capture();fromKind=-1;topic=next;to=shapes[topic];morph=reduced.matches?1:0;elapsed=0;sceneTime=0;
    const caption=document.getElementById('background-topic');
    caption.textContent=topics[topic][0];caption.title=topics[topic][1];
    upload();draw();
  }
  const routeShader=route.map((_,i)=>{const p=routePoint(i);return `if(n<${i+.5})return vec2(${p[0].toFixed(4)},${p[1].toFixed(4)});`;}).join('');
  const trainingShader=trainingCurves.map((p,i)=>`if(n<${i+.5})return ${p.map((v,j)=>['g*g*g','3.*g*g*f','3.*g*f*f','f*f*f'][j]+`*vec2(${v[0].toFixed(4)},${v[1].toFixed(4)})`).join('+')};`).join('');
  const vertex=`
    precision highp float;
    attribute vec4 aFrom,aTo;
    attribute vec3 aMeta;
    uniform float uTime,uSceneTime,uMorph,uAspect,uRatio,uFromKind,uToKind,uPresence;
    uniform vec2 uPointer,uCenter,uScale;
    varying float vAlpha;
    vec2 routePoint(float n){${routeShader}return vec2(1.45,1.45);}
    vec2 routePosition(float phase){
      float step=fract(phase)*14.;float n=floor(step);
      return mix(routePoint(n),routePoint(n+1.),fract(step));
    }
    vec2 trainingPosition(float phase){
      float t=fract(phase)*4.;float n=floor(t),f=fract(t),g=1.-f;
      ${trainingShader}return vec2(0.,.65);
    }
    vec4 animate(vec4 p,float kind){
      if(kind>-.5&&kind<.5&&p.w>.85){
        vec2 path=routePosition(p.w>.95?min(uSceneTime/3.1,.99999):uTime*.28+aMeta.z);p.xz+=path;
      }else if(kind>.5&&kind<1.5&&p.w>.85){
        if(p.w>.95)p.x+=-1.8+fract(uTime*.7+aMeta.z)*1.65;
        else{float phase=uTime*.27+aMeta.z;p.xy+=trainingPosition(phase);p.z+=.08*sin(fract(phase)*12.5663706);}
        p.w*=.12+.88*pow(.5+.5*cos(aMeta.z*18.8495559),8.);
      }

      if(kind>1.5&&kind<2.5&&p.w>.85){
        float pair=floor(p.y/1.28+.5)+1.;
        float angle=uTime*.55*pow(.3,pair);
        p.xz=mat2(cos(angle),sin(angle),-sin(angle),cos(angle))*p.xz;
      }else if(kind>3.5){
        p.xy+=vec2(sin(uTime*1.2+aMeta.z*20.),cos(uTime+aMeta.z*17.))*.013;
      }
      return p;
    }
    void main(){
      float s=aMeta.x;
      float m=clamp((uMorph-s*.08)/.92,0.,1.);
      m=m*m*(3.-2.*m);
      vec4 p=mix(animate(aFrom,uFromKind),animate(aTo,uToKind),m);
      p.xyz+=sin(3.14159265*m)*.23*vec3(sin(s*43.),cos(s*31.),sin(s*71.));
      float yaw=.20+sin(uTime*.16)*.13+uPointer.x*.09;
      float pitch=.53+uPointer.y*.06;
      p.xz=mat2(cos(yaw),-sin(yaw),sin(yaw),cos(yaw))*p.xz;
      p.yz=mat2(cos(pitch),-sin(pitch),sin(pitch),cos(pitch))*p.yz;
      float depth=1./(1.+p.z*.11);
      vec2 screen=p.xy*uScale*depth+uCenter;
      gl_Position=vec4(screen,0.,1.);
      gl_PointSize=clamp(aMeta.y*uRatio*depth*1.75, .8, 4.);
      vAlpha=p.w*uPresence*(.8+sin(uTime*.35+s*18.)*.12);
    }`;
  const fragment=`precision mediump float;varying float vAlpha;
    void main(){float r=length(gl_PointCoord-.5)*2.;if(r>1.)discard;
      gl_FragColor=vec4(vec3(.902,.902,.875),exp(-r*r*2.8)*vAlpha);}`;
  let gl,program,fromBuffer,toBuffer,metaBuffer,uniforms,ctx;
  const fallbackPositions=new Float32Array(count*4);
  function shader(type,source){
    const shader=gl.createShader(type);gl.shaderSource(shader,source);gl.compileShader(shader);
    if(!gl.getShaderParameter(shader,gl.COMPILE_STATUS)){gl.deleteShader(shader);throw new Error('Particle shader could not compile');}
    return shader;
  }
  function initRenderer(){
    try{
      gl=canvas.getContext('webgl',{alpha:true,antialias:false,depth:false,powerPreference:'low-power'});
      if(!gl)throw new Error('WebGL unavailable');
      const vs=shader(gl.VERTEX_SHADER,vertex),fs=shader(gl.FRAGMENT_SHADER,fragment);
      program=gl.createProgram();gl.attachShader(program,vs);gl.attachShader(program,fs);gl.linkProgram(program);
      gl.deleteShader(vs);gl.deleteShader(fs);
      if(!gl.getProgramParameter(program,gl.LINK_STATUS))throw new Error('Particle shader could not link');
      gl.useProgram(program);gl.enable(gl.BLEND);gl.blendFunc(gl.SRC_ALPHA,gl.ONE);gl.clearColor(0,0,0,0);
      function buffer(name,size,data){
        const b=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,b);gl.bufferData(gl.ARRAY_BUFFER,data,gl.DYNAMIC_DRAW);
        const location=gl.getAttribLocation(program,name);gl.enableVertexAttribArray(location);gl.vertexAttribPointer(location,size,gl.FLOAT,false,0,0);return b;
      }
      fromBuffer=buffer('aFrom',4,from);toBuffer=buffer('aTo',4,to);metaBuffer=buffer('aMeta',3,meta);
      uniforms=Object.fromEntries(['uTime','uSceneTime','uMorph','uAspect','uRatio','uFromKind','uToKind','uPresence','uPointer','uCenter','uScale'].map(n=>[n,gl.getUniformLocation(program,n)]));
    }catch{
      // The same geometry and morphing work without a GPU context at lower density.
      if(gl){gl.getExtension('WEBGL_lose_context')?.loseContext();gl=null;}
      const replacement=canvas.cloneNode();canvas.replaceWith(replacement);canvas=replacement;ctx=canvas.getContext('2d');
    }
  }
  function upload(){
    if(!gl)return;
    gl.bindBuffer(gl.ARRAY_BUFFER,fromBuffer);gl.bufferData(gl.ARRAY_BUFFER,from,gl.DYNAMIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER,toBuffer);gl.bufferData(gl.ARRAY_BUFFER,to,gl.DYNAMIC_DRAW);
  }
  function composition(){
    const bounds=document.querySelector('.personal-page').getBoundingClientRect();
    let left=Math.max(bounds.left+bounds.width*.51, width*.48),right=Math.min(width-22,bounds.right+15);
    let top=Math.min(130,height*.16),bottom=height-65;
    if(width<=640){
      left=30;right=width-14;top=height*.18;bottom=height-52;
      const photo=document.querySelector('.intro-photo').getBoundingClientRect();
      if(photo.bottom>top&&photo.top<bottom){
        const above=Math.max(0,photo.top-top-24),below=Math.max(0,bottom-photo.bottom-24);
        if(above>=below&&above>40)bottom=photo.top-24;
        else if(below>40)top=photo.bottom+24;
      }
    }
    const pixels=Math.min((right-left)/4.8,(bottom-top)/4.7);
    return {centerX:(left+right)/width-1,centerY:1-(top+bottom)/height,scaleX:2*pixels/width,scaleY:2*pixels/height};
  }
  let camera;
  function draw(){
    const next=composition();
    if(!camera||reduced.matches)camera=next;
    else for(const key of Object.keys(next))camera[key]+=(next[key]-camera[key])*.12;
    const {centerX,centerY,scaleX,scaleY}=camera;
    // Keep every structure equally visible while reading, including RoPE's fine rings.
    const presence=.88;
    if(gl){
      gl.clear(gl.COLOR_BUFFER_BIT);gl.useProgram(program);
      gl.uniform1f(uniforms.uTime,time);gl.uniform1f(uniforms.uSceneTime,sceneTime);gl.uniform1f(uniforms.uMorph,morph);
      gl.uniform1f(uniforms.uAspect,width/height);gl.uniform1f(uniforms.uRatio,ratio);
      gl.uniform1f(uniforms.uFromKind,fromKind);gl.uniform1f(uniforms.uToKind,topic);
      gl.uniform1f(uniforms.uPresence,presence);gl.uniform2f(uniforms.uPointer,px,py);
      gl.uniform2f(uniforms.uCenter,centerX,centerY);gl.uniform2f(uniforms.uScale,scaleX,scaleY);
      gl.drawArrays(gl.POINTS,0,width<500?24000:count);
    }else if(ctx){
      ctx.clearRect(0,0,width,height);
      const stride=width<500?8:5;
      const positions=capture(stride,fallbackPositions),yaw=.2+Math.sin(time*.16)*.13+px*.09,pitch=.53+py*.06;
      for(let i=0;i<count;i+=stride){
        const k=i*4,x=positions[k],y=positions[k+1],z=positions[k+2];
        const xx=Math.cos(yaw)*x+Math.sin(yaw)*z,zz=-Math.sin(yaw)*x+Math.cos(yaw)*z;
        const yy=Math.cos(pitch)*y+Math.sin(pitch)*zz,depth=1/(1+(-Math.sin(pitch)*y+Math.cos(pitch)*zz)*.11);
        const sx=(xx*scaleX*depth+centerX+1)*width/2,sy=(1-yy*scaleY*depth-centerY)*height/2;
        ctx.fillStyle=`rgba(230,230,223,${positions[k+3]*presence*.72})`;ctx.fillRect(sx,sy,1,1);
      }
    }
  }
  function tick(now){
    raf=0;if(reduced.matches||!visible||document.hidden||disposed)return;
    if(now-last>=(gl?33:50)){
      const dt=Math.min((now-last)/1000,.1);last=now;time+=dt;sceneTime+=dt;
      px+=(tx-px)*.06;py+=(ty-py)*.06;
      if(morph<1)morph=Math.min(1,morph+dt/morphDuration);
      else{elapsed+=dt;if(elapsed>=hold)select((topic+1)%topics.length);}
      draw();
    }
    raf=requestAnimationFrame(tick);
  }
  function sync(){
    cancelAnimationFrame(raf);raf=0;last=performance.now();
    if(reduced.matches){morph=1;px=py=tx=ty=0;}
    draw();if(!reduced.matches&&visible&&!document.hidden&&!disposed)raf=requestAnimationFrame(tick);
  }
  function resize(){
    width=Math.max(1,stage.clientWidth);height=Math.max(1,stage.clientHeight);ratio=Math.min(devicePixelRatio||1,1.65);
    canvas.width=Math.round(width*ratio);canvas.height=Math.round(height*ratio);
    if(gl)gl.viewport(0,0,canvas.width,canvas.height);else if(ctx)ctx.setTransform(ratio,0,0,ratio,0,0);
    draw();
  }
  // Scrolling changes only the composition around the portrait, never visibility.
  window.addEventListener('scroll',()=>{if(reduced.matches)draw();},{passive:true});
  window.addEventListener('pointermove',e=>{if(reduced.matches)return;const r=stage.getBoundingClientRect();tx=(e.clientX-r.left)/width-.5;ty=(e.clientY-r.top)/height-.5;},{passive:true});
  document.documentElement.addEventListener('pointerleave',()=>{tx=ty=0;});
  document.addEventListener('visibilitychange',sync);reduced.addEventListener('change',sync);
  initRenderer();
  document.querySelector('.atmosphere-caption').hidden=false;
  const sizeObserver=new ResizeObserver(resize);sizeObserver.observe(stage);
  const observer=new IntersectionObserver(([entry])=>{visible=entry.isIntersecting;sync();});observer.observe(stage);
  window.addEventListener('pagehide',()=>{disposed=true;cancelAnimationFrame(raf);});
  window.addEventListener('pageshow',()=>{disposed=false;sync();});
  resize();sync();
})();
