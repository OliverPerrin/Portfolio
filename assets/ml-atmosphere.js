// Continuous synthetic ML structures, adapted from the approved portfolio study.
(() => {
  'use strict';
  const stage=document.querySelector('.ml-atmosphere');
  if(!stage)return;
  let canvas=stage.querySelector('canvas');
  const buttons=[...document.querySelectorAll('[data-topic]')];
  const progress=document.querySelector('.atmosphere-progress span');
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  const topics=[
    ['Embedding space','A cloud separates into neighborhoods in a three-dimensional projection.'],
    ['Causal attention','A triangular field forms: each position can attend to itself and earlier positions.'],
    ['Rotary position encoding','Three coordinate pairs, three circular paths. Position advances their angles at different rates.'],
    ['Optimization','A loss surface forms around a descending path toward the minimum.'],
    ['Multi-task learning','A shared encoder feeds three task heads: summarization, topic classification, and emotion classification.']
  ];
  const count=36000,hold=8,morphDuration=4.2,tau=Math.PI*2;
  let seed=6127;
  function random(){seed=(Math.imul(seed,1664525)+1013904223)>>>0;return(seed+.5)/4294967296;}
  function gaussian(){return Math.sqrt(-2*Math.log(random()))*Math.cos(tau*random());}
  const meta=new Float32Array(count*3);
  for(let i=0;i<count;i++)meta.set([random(),.55+random()*.9,random()],i*3);
  function makeShape(kind){
    const data=new Float32Array(count*4);
    const centers=[[-1.25,.9,.35],[.95,1.05,-.6],[1.3,-.7,.65],[-.85,-1.05,-.8],[.1,.05,.1]];
    const cells=[];for(let row=0;row<12;row++)for(let col=0;col<=row;col++)cells.push([row,col]);
    for(let i=0;i<count;i++){
      const u=random(),v=random(),w=random();let x,y,z,a;
      if(kind===0){
        const group=i%5,c=centers[group],spread=group===4?.3:.26;
        x=c[0]+gaussian()*spread;y=c[1]+gaussian()*spread;z=c[2]+gaussian()*spread;
        a=.34+u*.44;
        // Sparse bridges hint at a continuous representation between the neighborhoods.
        if(i%13===0){const d=centers[(group+1)%5];x=c[0]*(1-u)+d[0]*u+gaussian()*.06;y=c[1]*(1-u)+d[1]*u+gaussian()*.06;z=c[2]*(1-u)+d[2]*u+gaussian()*.06;a=.15;}
      }else if(kind===1){
        const [row,col]=cells[i%cells.length];
        x=(col-5.5)*.32+(u-.5)*.245;
        y=(5.5-row)*.32+(v-.5)*.245;
        z=(w-.5)*.055;
        a=col===row?.88:.24+.36*(1-(row-col)/12);
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
          x=-2.1+v*1.65;y=gaussian()*.065;z=gaussian()*.065;a=.4+w*.28;
        }else if(u<.83){
          const t=v,e=t*t*(3-2*t);
          x=-.45+t*2.25;y=headY*e+gaussian()*.045;z=(branch-1)*.24*e+gaussian()*.045;a=.35+w*.3;
        }else{
          const shared=i%2===0;
          x=(shared?[-1.85,-1.15,-.45][branch]:1.8)+gaussian()*.11;
          y=(shared?0:headY)+gaussian()*.15;z=(shared?0:(branch-1)*.24)+gaussian()*.12;a=.6+w*.3;
        }
      }
      data.set([x,y,z,a],i*4);
    }
    return data;
  }
  const shapes=topics.map((_,i)=>makeShape(i));
  let from=shapes[0].slice(),to=shapes[0],topic=0,fromKind=-1;
  let elapsed=0,morph=1,time=0,visible=true,disposed=false;
  let width=1,height=1,ratio=1,raf=0,last=0,px=0,py=0,tx=0,ty=0;
  const smooth=x=>{x=Math.max(0,Math.min(1,x));return x*x*x*(x*(x*6-15)+10);};
  function animated(data,k,kind,t){
    let x=data[k],y=data[k+1],z=data[k+2];
    if(kind===2&&data[k+3]>.85){
      const pair=Math.round(y/1.28)+1,angle=t*.55*Math.pow(.3,pair),c=Math.cos(angle),s=Math.sin(angle);
      const nx=c*x-s*z;z=s*x+c*z;x=nx;
    }
    return [x,y,z,data[k+3]];
  }
  // Capture the rendered interpolation before changing its destination, including
  // the bridge displacement. Repeated clicks therefore never reset the cloud.
  function capture(stride=1,result=new Float32Array(count*4)){
    for(let i=0;i<count;i+=stride){
      const k=i*4,s=meta[i*3],m=smooth((morph-s*.16)/.84);
      const a=animated(from,k,fromKind,time),b=animated(to,k,topic,time);
      const bridge=Math.sin(Math.PI*m)*.48;
      result[k]=a[0]+(b[0]-a[0])*m+Math.sin(s*43)*bridge;
      result[k+1]=a[1]+(b[1]-a[1])*m+Math.cos(s*31)*bridge;
      result[k+2]=a[2]+(b[2]-a[2])*m+Math.sin(s*71)*bridge;
      result[k+3]=a[3]+(b[3]-a[3])*m;
    }
    return result;
  }
  function select(next,announce=false){
    if(next===topic)return;
    from=capture();fromKind=-1;topic=next;to=shapes[topic];morph=reduced.matches?1:0;elapsed=0;
    buttons.forEach((b,i)=>b.setAttribute('aria-pressed',String(i===topic)));
    const caption=document.getElementById('background-topic');
    caption.setAttribute('aria-live',announce?'polite':'off');
    caption.textContent=topics[topic][0];
    document.querySelector('[data-atmosphere-next]').title=topics[topic][1];
    upload();draw();
  }
  const vertex=`
    precision highp float;
    attribute vec4 aFrom,aTo;
    attribute vec3 aMeta;
    uniform float uTime,uMorph,uAspect,uRatio,uFromKind,uToKind,uPresence;
    uniform vec2 uPointer,uCenter;
    varying float vAlpha;
    vec4 animate(vec4 p,float kind){
      if(kind>1.5&&kind<2.5&&p.w>.85){
        float pair=floor(p.y/1.28+.5)+1.;
        float angle=uTime*.55*pow(.3,pair);
        p.xz=mat2(cos(angle),sin(angle),-sin(angle),cos(angle))*p.xz;
      }
      return p;
    }
    void main(){
      float s=aMeta.x;
      float m=clamp((uMorph-s*.16)/.84,0.,1.);
      m=m*m*m*(m*(m*6.-15.)+10.);
      vec4 p=mix(animate(aFrom,uFromKind),animate(aTo,uToKind),m);
      p.xyz+=sin(3.14159265*m)*.48*vec3(sin(s*43.),cos(s*31.),sin(s*71.));
      float yaw=.20+sin(uTime*.065)*.09+uPointer.x*.09;
      float pitch=.53+uPointer.y*.06;
      p.xz=mat2(cos(yaw),-sin(yaw),sin(yaw),cos(yaw))*p.xz;
      p.yz=mat2(cos(pitch),-sin(pitch),sin(pitch),cos(pitch))*p.yz;
      float depth=1./(1.+p.z*.11);
      vec2 screen=p.xy*vec2(.37/uAspect,.37)*depth+uCenter;
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
      uniforms=Object.fromEntries(['uTime','uMorph','uAspect','uRatio','uFromKind','uToKind','uPresence','uPointer','uCenter'].map(n=>[n,gl.getUniformLocation(program,n)]));
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
  function draw(){
    const bounds=document.querySelector('.personal-page').getBoundingClientRect();
    const centerX=width<500?.31:(bounds.left+bounds.width*.70)/width*2-1;
    const centerY=width<500?-.15:.06;
    // Keep every structure equally visible while reading, including RoPE's fine rings.
    const presence=.88;
    if(gl){
      gl.clear(gl.COLOR_BUFFER_BIT);gl.useProgram(program);
      gl.uniform1f(uniforms.uTime,time);gl.uniform1f(uniforms.uMorph,morph);
      gl.uniform1f(uniforms.uAspect,width/height);gl.uniform1f(uniforms.uRatio,ratio);
      gl.uniform1f(uniforms.uFromKind,fromKind);gl.uniform1f(uniforms.uToKind,topic);
      gl.uniform1f(uniforms.uPresence,presence);gl.uniform2f(uniforms.uPointer,px,py);
      gl.uniform2f(uniforms.uCenter,centerX,centerY);
      gl.drawArrays(gl.POINTS,0,width<500?24000:count);
    }else if(ctx){
      ctx.clearRect(0,0,width,height);
      const stride=width<500?8:5;
      const positions=capture(stride,fallbackPositions),yaw=.2+Math.sin(time*.065)*.09+px*.09,pitch=.53+py*.06;
      for(let i=0;i<count;i+=stride){
        const k=i*4,x=positions[k],y=positions[k+1],z=positions[k+2];
        const xx=Math.cos(yaw)*x+Math.sin(yaw)*z,zz=-Math.sin(yaw)*x+Math.cos(yaw)*z;
        const yy=Math.cos(pitch)*y+Math.sin(pitch)*zz,depth=1/(1+(-Math.sin(pitch)*y+Math.cos(pitch)*zz)*.11);
        const sx=(xx*.37/(width/height)*depth+centerX+1)*width/2,sy=(1-yy*.37*depth-centerY)*height/2;
        ctx.fillStyle=`rgba(230,230,223,${positions[k+3]*presence*.72})`;ctx.fillRect(sx,sy,1,1);
      }
    }
    progress.style.transform=`scaleX(${morph<1?0:Math.min(elapsed/hold,1)})`;
  }
  function tick(now){
    raf=0;if(reduced.matches||!visible||document.hidden||disposed)return;
    if(now-last>=(gl?33:50)){
      const dt=Math.min((now-last)/1000,.1);last=now;time+=dt;
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
  buttons.forEach((b,i)=>b.addEventListener('click',()=>select(i,true)));
  document.querySelector('[data-atmosphere-next]').addEventListener('click',()=>select((topic+1)%topics.length,true));
  window.addEventListener('pointermove',e=>{if(reduced.matches)return;const r=stage.getBoundingClientRect();tx=(e.clientX-r.left)/width-.5;ty=(e.clientY-r.top)/height-.5;},{passive:true});
  document.documentElement.addEventListener('pointerleave',()=>{tx=ty=0;});
  document.addEventListener('visibilitychange',sync);reduced.addEventListener('change',sync);
  initRenderer();
  document.querySelectorAll('[data-atmosphere-controls]').forEach(element=>{element.hidden=false;});
  const sizeObserver=new ResizeObserver(resize);sizeObserver.observe(stage);
  const observer=new IntersectionObserver(([entry])=>{visible=entry.isIntersecting;sync();});observer.observe(stage);
  window.addEventListener('pagehide',()=>{disposed=true;cancelAnimationFrame(raf);});
  window.addEventListener('pageshow',()=>{disposed=false;sync();});
  resize();sync();
})();
