(function (root) {
  'use strict';

  function createRig(look={}) {
  const clamp = (v, lo=0, hi=1) => Math.max(lo,Math.min(hi,v));
  const lerp = (a,b,t) => a+(b-a)*t;
  const smooth = v => {v=clamp(v);return v*v*(3-2*v);};
  const TAU = Math.PI*2;
  const COLORS = {skin:'#ffdab9',skinShadow:'#deaa88',skinLight:'#ffe8d3',hair:'#302326',hairLight:'#975a39',
    tee:'#303950',pants:'#383438',pantsShadow:'#302d32',seam:'#28252c',shoe:'#fff1d5',sole:'#c8bca9',eye:'#fff6e8',...look.colors};

  const baseEmotion = {eyeL:1,eyeR:1,browL:0,browR:0,browYL:0,browYR:0,lookX:0,lookY:0,
    curve:.07,width:.33,open:0,asym:0,tears:0,sweat:0,blush:0,lowerLid:0};
  const EMOTIONS = {
    deadpan:{eyeL:.43,eyeR:.48,lookX:.68,curve:-.015,width:.24},
    teasing:{eyeL:.58,eyeR:.93,browYR:-.14,lookX:-.72,curve:.19,asym:.26},
    stifledLaugh:{eyeL:.31,eyeR:.37,lowerLid:.45,curve:.34,width:.22,asym:.12,blush:.55},
    mockShock:{eyeL:1.65,eyeR:.88,browYL:-.21,browYR:-.09,open:.32,width:.19,lookX:.48},
    caughtOut:{eyeL:1.22,eyeR:1.28,lookX:-.95,curve:-.02,width:.21,sweat:.8},
    smugAside:{eyeL:.46,eyeR:.5,browYL:-.12,lookX:.95,curve:.12,asym:.32},
    neutral:{},friendly:{curve:.16},happy:{curve:.24,eyeL:.85,eyeR:.85,lowerLid:.15},
    joy:{curve:.3,open:.2,eyeL:.65,eyeR:.65,browYL:-.07,browYR:-.07},
    laugh:{curve:.35,open:.48,eyeL:.2,eyeR:.2,lowerLid:.3},smirk:{curve:.15,asym:.16,eyeL:.8,browR:-.12},
    proud:{curve:.2,eyeL:.8,eyeR:.8,browYL:-.06,browYR:-.06},confident:{curve:.13,eyeL:.88,eyeR:.88,browL:.03,browR:-.03},
    determined:{curve:-.02,browL:.18,browR:-.18,eyeL:.8,eyeR:.8},focused:{curve:0,eyeL:.67,eyeR:.67,browL:.12,browR:-.12},
    curious:{eyeL:1.1,eyeR:1.1,browYL:-.12,browYR:-.12,curve:.02,lookX:.5},
    thinking:{lookX:.7,lookY:-.6,curve:0,asym:.04,browL:-.07,browR:-.1},
    confused:{browYL:-.15,browR:-.17,curve:-.04,asym:.08,eyeR:.72},
    skeptical:{eyeL:.68,eyeR:.86,browYL:-.16,browYR:.03,curve:0,asym:-.05},
    suspicious:{eyeL:.58,eyeR:.58,lookX:.8,curve:0,browL:.1,browR:-.1},
    worried:{browL:-.17,browR:.17,browYL:-.04,browYR:-.04,curve:-.17,eyeL:1.1,eyeR:1.1},
    nervous:{browL:-.12,browR:.12,curve:-.04,asym:.06,sweat:.7,open:.04},
    afraid:{eyeL:1.5,eyeR:1.5,browL:-.15,browR:.15,open:.25,curve:-.17},
    shocked:{eyeL:1.7,eyeR:1.7,browYL:-.2,browYR:-.2,open:.48,width:.22},
    surprised:{eyeL:1.4,eyeR:1.4,browYL:-.16,browYR:-.16,open:.25,width:.22},
    awe:{eyeL:1.4,eyeR:1.4,browYL:-.15,browYR:-.15,open:.19,curve:.12},
    sad:{browL:-.18,browR:.18,curve:-.22,eyeL:.8,eyeR:.8,lookY:.3},
    disappointed:{browL:-.12,browR:.12,curve:-.16,eyeL:.65,eyeR:.65,lookY:.3},
    tired:{eyeL:.38,eyeR:.38,browYL:.03,browYR:.03,curve:-.06},
    sleepy:{eyeL:.14,eyeR:.14,open:.12,curve:0,width:.22},bored:{eyeL:.45,eyeR:.45,curve:-.03,lookX:.6},
    annoyed:{eyeL:.7,eyeR:.7,browL:.18,browR:-.18,curve:-.09},
    angry:{browL:.28,browR:-.28,eyeL:.78,eyeR:.78,curve:-.2},
    furious:{browL:.35,browR:-.35,eyeL:.7,eyeR:.7,curve:-.22,open:.26,width:.37},
    embarrassed:{blush:.7,lookY:.45,lookX:-.5,curve:.04,asym:.08,browL:-.08,browR:.08},
    shy:{blush:.5,eyeL:.8,eyeR:.8,curve:.12,lookX:-.7,lookY:.25},
    grateful:{curve:.23,eyeL:.78,eyeR:.78,browL:-.08,browR:.08},
    relieved:{eyeL:.55,eyeR:.55,curve:.2,browYL:-.04,browYR:-.04},
    excited:{curve:.32,open:.22,eyeL:1.3,eyeR:1.3,browYL:-.16,browYR:-.16},
    hopeful:{curve:.16,lookY:-.35,eyeL:1.1,eyeR:1.1,browL:-.06,browR:.06},
    disgusted:{eyeL:.65,eyeR:.65,browL:.13,browR:-.13,curve:-.12,asym:.13},
    crying:{eyeL:.2,eyeR:.2,browL:-.22,browR:.22,curve:-.25,open:.1,tears:1},
    pain:{eyeL:.12,eyeR:.4,browL:.15,browR:-.15,curve:-.2,open:.16},
    wink:{eyeL:.08,eyeR:1,curve:.2,asym:.08},mischievous:{eyeL:.65,eyeR:.8,browYL:-.1,curve:.2,asym:.15},
  };

  const PHONEMES = {
    rest:{open:0,width:.33}, A:{open:.55,width:.34}, E:{open:.22,width:.48}, I:{open:.12,width:.45},
    O:{open:.44,width:.23}, U:{open:.25,width:.2}, F:{open:.1,width:.36},
    M:{open:0,width:.3}, L:{open:.32,width:.34}, W:{open:.17,width:.2},
  };

  function emotion(name='neutral') {return {...baseEmotion,...EMOTIONS[name]};}
  function blendEmotion(from,to,progress) {
    const a=typeof from==='string'?emotion(from):{...baseEmotion,...from};
    const b=typeof to==='string'?emotion(to):{...baseEmotion,...to};
    return Object.fromEntries(Object.keys(baseEmotion).map(k=>[k,lerp(a[k],b[k],smooth(progress))]));
  }

  const POSE_NAMES = ['idle','walk','run','sneak','tiptoe','stop','turn','wave','point','pointUp',
    'explain','shrug','think','crossArms','handsHips','handsPockets','thumbsUp','celebrate','facepalm','recoil',
    'crouch','kneel','sit','standUp','jump','land','pickUp','carry','push','pull','bow','climb',
    'hug','makeBed','reach','openDoor','pressButton','salute','clap','phone','sadWalk','talk'];

  function defaultPose() {
    return {hip:[0,-323],lean:0,headTilt:0,yaw:.18,handL:[-100,-320],handR:[100,-320],
      footL:[-35,-24],footR:[35,-24],bendArmL:1,bendArmR:-1,bendLegL:1,bendLegR:-1,
      gestureL:'relaxed',gestureR:'relaxed',headNod:0};
  }

  function motion(name='idle',time=0,options={}) {
    const p=defaultPose(),t=Math.max(0,time),phase=t*TAU;
    p.action=name;p.actingTime=t;
    const pulse=Math.sin(t*2.2),settle=smooth(t/.45);
    p.hip[1]+=pulse*1.1;p.handL[1]+=pulse*1.3;p.handR[1]+=pulse*1.3;
    p.headTilt=Math.sin(t*.9)*.012;
    if(['walk','run','sneak','tiptoe','sadWalk','climb'].includes(name)) {
      const run=name==='run',sneak=name==='sneak',sad=name==='sadWalk';
      const frequency=run?1.65:sneak?.58:sad?.65:.95;
      const ph=phase*frequency;
      const stride=run?100:sneak?52:86,lift=run?58:sneak?18:28;
      const stance=run?.43:sneak?.72:.64;
      const foot=(v,side)=>{
        const u=((v/TAU)%1+1)%1;
        const planted=u<stance;
        const q=planted?u/stance:(u-stance)/(1-stance);
        const x=side*24+(planted?lerp(stride,-stride,q):lerp(-stride,stride,smooth(q)));
        const y=-24-(planted?0:Math.sin(q*Math.PI)*lift);
        return [x,name==='climb'?y-x*.4:y];
      };
      p.footL=foot(ph,-1);p.footR=foot(ph+Math.PI,1);
      p.hip=[Math.sin(ph)*2,(run?-286:sneak?-275:-299)-Math.abs(Math.sin(ph))*(run?12:4)];
      p.bendLegL=-1;p.bendLegR=-1;
      p.travelX=t*2*stride*frequency/stance;
      p.contactL=((ph/TAU)%1)<stance;p.contactR=((ph/TAU+.5)%1)<stance;
      p.lean=run?.17:sneak?.17:sad?.1:.035;
      p.headTilt=sad?.14:run?-.07:.015*Math.sin(ph-.35);
      // Shoulder leads, forearm follows and folds as the hand swings forward.
      p.gaitPhase=ph;
      p.yaw=Math.PI/2;
      for(const side of ['L','R']){
        const sign=side==='L'?-1:1;
        const beat=ph+(side==='L'?Math.PI:0);
        const amplitude=run?.83:sad?.27:sneak?.32:.46;
        const upper=amplitude*Math.cos(beat-.12)-.11;
        const lower=upper+(run?1.12:.30)+.18*Math.cos(beat-.54);
        const shoulder=add(p.hip,rotate([sign*71,-222],p.lean));
        const elbow=add(shoulder,[122*Math.sin(upper),122*Math.cos(upper)]);
        p['hand'+side]=add(elbow,[112*Math.sin(lower),112*Math.cos(lower)]);
        p['bendArm'+side]=1;
      }
      if(name==='tiptoe'){p.hip[1]-=12;p.footL[1]-=12;p.footR[1]-=12;}
    }
    const apply = o=>Object.assign(p,o);
    switch(name) {
      case 'stop': apply({lean:-.12*(1-smooth(t)),handL:[-120,-325],handR:[120,-330],footL:[-65,-24],footR:[52,-24]});break;
      case 'turn':p.yaw=Math.sin(t*.8)*Math.PI;break;
      case 'wave':p.handR=[142+Math.sin(t*5.4)*18,-594];p.gestureR='open';p.headTilt=-.035;break;
      case 'point':p.handR=[272,-465];p.gestureR='point';p.lean=.035;break;
      case 'pointUp':p.handR=[177,-686];p.gestureR='point';p.headTilt=-.06;break;
      case 'explain':p.handL=[-183,-445+Math.sin(t*3)*7];p.handR=[181,-425-Math.sin(t*3)*9];p.gestureL='open';p.gestureR='open';break;
      case 'shrug':p.handL=[-182,-500];p.handR=[182,-500];p.gestureL='open';p.gestureR='open';p.hip[1]-=3;break;
      case 'think':p.handR=[32,-576];p.handL=[-15,-425];p.headTilt=-.065;break;
      case 'crossArms':p.handR=[-57,-451];p.handL=[61,-439];break;
      case 'handsHips':p.handL=[-63,-354];p.handR=[63,-354];break;
      case 'handsPockets':p.handL=[-40,-314];p.handR=[40,-314];break;
      case 'thumbsUp':p.handR=[151,-488];p.gestureR='thumb';p.headTilt=-.03;break;
      case 'celebrate':p.handL=[-166,-676];p.handR=[166,-676];p.gestureL='fist';p.gestureR='fist';p.hip[1]-=Math.max(0,Math.sin(t*5))*8;break;
      case 'facepalm':p.handR=[16,-620];p.headTilt=.1;p.lean=.04;break;
      case 'recoil':p.lean=-.15;p.handL=[-147,-508];p.handR=[147,-508];p.gestureL='open';p.gestureR='open';p.footL=[-65,-24];p.footR=[67,-24];break;
      case 'crouch':p.hip=[0,-190];p.lean=.18;p.footL=[-93,-24];p.footR=[93,-24];p.handL=[-108,-160];p.handR=[108,-160];break;
      case 'kneel':p.hip=[-30,-180];p.footL=[-140,-24];p.footR=[146,-24];p.bendLegR=1;p.handL=[-105,-242];p.handR=[116,-221];p.lean=.08;break;
      case 'sit':p.hip=[-60,-180];p.footL=[100,-24];p.footR=[140,-24];p.bendLegL=-1;p.bendLegR=-1;p.handL=[-25,-210];p.handR=[50,-210];p.yaw=.95;p.lean=.015;break;
      case 'standUp': {
        const phase=(t%4)/4;
        const k=smooth(phase<.5?phase*2:(1-phase)*2);
        p.hip=[lerp(-60,44,k),lerp(-180,-313,k)];p.lean=.28*Math.sin(k*Math.PI);
        p.handL=[lerp(-25,-105,k),lerp(-210,-310,k)];p.handR=[lerp(50,105,k),lerp(-210,-310,k)];
        p.footL=[70,-24];p.footR=[90,-24];p.bendLegL=-1;p.bendLegR=-1;break;
      }
      case 'jump': {
        const q=t%2.5;
        const load=smooth(q/.45),flight=clamp((q-.45)/.85);
        const h=q<.45?28*load:q<1.3?-110*Math.sin(flight*Math.PI):20*Math.sin(Math.PI*clamp((q-1.3)/.4));
        p.hip[1]+=h;p.footL[1]+=Math.min(0,h);p.footR[1]+=Math.min(0,h);
        p.handL=[-115,-350-Math.max(0,-h)*1.8];p.handR=[115,-350-Math.max(0,-h)*1.8];break;
      }
      case 'land':p.hip[1]+=45*(1-smooth(t/.7));p.footL=[-67,-24];p.footR=[67,-24];p.handL=[-128,-275];p.handR=[128,-275];break;
      case 'pickUp': {
        const k=Math.sin(Math.PI*clamp((t%3)/2.3));p.hip[1]+=110*k;p.lean=.7*k;p.headTilt=.1*k;
        p.handL=[lerp(-105,140,k),lerp(-310,-205,k)];p.handR=[lerp(105,230,k),lerp(-310,-205,k)];
        p.footL=[-80,-24];p.footR=[80,-24];break;
      }
      case 'carry':p.handL=[-94,-391];p.handR=[100,-391];break;
      case 'push':p.lean=.24;p.handL=[-30,-432];p.handR=[239,-452];p.footL=[-95,-24];p.footR=[85,-24];p.gestureR='open';break;
      case 'pull':p.lean=-.18;p.handL=[-26,-422];p.handR=[219,-441];p.footL=[-94,-24];p.footR=[70,-24];p.gestureR='fist';break;
      case 'bow':p.lean=.55*Math.sin(Math.PI*clamp((t%3)/2.4));p.headTilt=.1;p.handL=[-83,-327];p.handR=[83,-327];break;
      case 'reach':p.handR=[232,-594];p.lean=.11;p.gestureR='open';break;
      case 'openDoor':p.handR=[lerp(244,130,smooth((t%2)/1.2)),-432];p.lean=-.05*smooth(t);p.gestureR='fist';break;
      case 'pressButton':p.handR=[lerp(166,245,smooth((t%2)/.5)),-475];p.gestureR='point';break;
      case 'salute':p.handR=[70,-637];p.gestureR='open';break;
      case 'clap':{const x=28+(.5-.5*Math.cos(t*9))*65;p.handL=[-x,-464];p.handR=[x,-464];p.gestureL='open';p.gestureR='open';break;}
      case 'phone':p.handR=[82,-584];p.headTilt=-.04;break;
      case 'sadWalk':break;
      case 'talk':p.handR=[151,-418+Math.sin(t*3)*13];p.handL=[-110,-315];p.headNod=Math.sin(t*3.2)*.04;p.gestureR='open';break;
    }
    if(options.yaw!==undefined)p.yaw=options.yaw;
    if(options.hip)p.hip=options.hip.slice();
    return p;
  }

  function blendPose(a,b,t) {
    const k=smooth(t),out={};
    for(const key of Object.keys(a)) {
      if(Array.isArray(a[key]))out[key]=a[key].map((v,i)=>lerp(v,b[key][i],k));
      else if(typeof a[key]==='number')out[key]=lerp(a[key],b[key],k);
      else out[key]=k<.5?a[key]:b[key];
    }
    out.mix={a,b,k:clamp(t)};   // kit: smooth arcs (see posed)
    return out;
  }

  function rotate(p,a) {return [p[0]*Math.cos(a)-p[1]*Math.sin(a),p[0]*Math.sin(a)+p[1]*Math.cos(a)];}
  function add(a,b){return [a[0]+b[0],a[1]+b[1]];}
  function ik(a,target,l1,l2,bend) {
    const dx=target[0]-a[0],dy=target[1]-a[1],requested=Math.hypot(dx,dy);
    const d=clamp(requested,Math.abs(l1-l2)+.1,l1+l2-.1),axis=Math.atan2(dy,dx);
    const q=axis+bend*Math.acos(clamp((l1*l1+d*d-l2*l2)/(2*l1*d),-1,1));
    const end=[a[0]+Math.cos(axis)*d,a[1]+Math.sin(axis)*d];
    return {a:a.slice(),b:[a[0]+Math.cos(q)*l1,a[1]+Math.sin(q)*l1],c:end,requested,clamped:requested>d+.1};
  }
  function skeleton(p) {
    const hip=p.hip,shL=add(hip,rotate([-71,-222],p.lean)),shR=add(hip,rotate([71,-222],p.lean));
    return {hip,shL,shR,head:add(hip,rotate([0,-313],p.lean)),
      armL:ik(shL,p.handL,122,112,p.bendArmL),armR:ik(shR,p.handR,122,112,p.bendArmR),
      legL:ik(add(hip,[-32,0]),p.footL,155,146,p.bendLegL),
      legR:ik(add(hip,[32,0]),p.footR,155,146,p.bendLegR)};
  }

  // Directions in performer space: lateral, forward, down. Both links keep
  // their length before camera projection, even when the elbow points at us.
  function actingArm(p, side) {
    // kit 2026-11-26 (user: "arms look weird, don't take them up, less movement while talking"):
    // CALM ARMS. The upper arm always hangs mostly down and no hand rises above the shoulder. Talking = arms at rest.
    // Only a real gesture with a purpose (point, wave, hold, press...) moves one arm, low and small.
    const sign=side==='L'?-1:1,R=side==='R';
    const relax=[[sign*.13,-.04,.99],[sign*.07,.16,.98]];
    const phase=p.actingTime||0,soft=Math.sin(phase*1.7+sign)*.025;
    const rest=[relax[0],[sign*.07,.17+soft,.98]];
    const low=(u,f)=>[[sign*u[0],u[1],u[2]],[sign*f[0],f[1],f[2]]];
    switch(p.action){
      case 'idle': case 'talk': case 'turn': case 'stop': case 'land': return rest;
      case 'explain': return R?low([.16,.10,.98],[.18,.62,.72+soft]):rest;
      case 'shrug': return low([.22,0,.97],[.42,.40,.80]);
      case 'think': case 'conceal': return R?low([.14,.26,.95],[-.45,.72,.05]):low([.12,.16,.98],[-.55,.60,.55]);
      case 'facepalm': case 'salute': return R?low([.14,.30,.94],[-.30,.80,-.20]):rest;
      case 'phone': return R?low([.14,.28,.95],[-.20,.92,.10]):rest;
      case 'point': case 'pressButton': case 'openDoor': return R?low([.20,.34,.92],[.14,.98,.12]):rest;
      case 'reach': case 'pointUp': return R?low([.24,.40,.88],[.16,.95,-.12]):rest;
      case 'thumbsUp': return R?low([.18,.28,.94],[.10,.80,.02]):rest;
      case 'wave': return R?low([.34,.14,.93],[.30+.14*Math.sin(phase*5),.40,-.34]):rest;
      case 'celebrate': return low([.24,.18,.95],[-.04,.78,-.08]);
      case 'recoil': return low([.26,.06,.96],[.10,.82,.16]);
      case 'hug': return low([.20,.62,.76],[-.30,.92,.05]);
      case 'makeBed': case 'carry': case 'push': case 'pull': case 'pickUp': return low([.16,.42,.89],[-.12,.94,.24]);
      case 'crossArms': return low([.14,.20,.97],[-.85,.45,.10]);
      case 'handsHips': return low([.42,-.10,.90],[-.60,.10,.76]);
      case 'handsPockets': return low([.12,.02,.99],[-.20,.22,.95]);
      case 'clap': return low([.18,.30,.94],[-.45-.18*Math.cos(phase*8),.82,-.05]);
      case 'bow': return rest;
      case 'sit':
      case 'standUp':{
        const standing=p.action==='sit'?0:clamp((-p.hip[1]-180)/133);
        const lap=[[sign*.29,-.16,.94],[-sign*.73,.56,.41]];
        return lap.map((dir,i)=>dir.map((v,j)=>lerp(v,relax[i][j],standing)));
      }
      case 'jump': return low([.22,.12,.97],[.14,.55,.82]);
      default:return null;
    }
  }

  // Separate lateral spacing from forward reach before rotating the performer.
  // Y stays in stage coordinates; depth contributes a small vertical offset.
  function projectPose(p,sk){
    const sine=Math.abs(Math.sin(p.yaw)),cosine=Math.cos(p.yaw);
    const seated=p.action==='sit'||p.action==='standUp';
    const gait=Number.isFinite(p.gaitPhase);
    const hipDepth=seated?p.hip[0]:0;
    const shoulderDepth=Math.sin(p.lean)*222;
    const point=(lateral,depth,y)=>[lateral*cosine+depth*sine,y+.12*(depth*cosine+lateral*sine)];
    const out={...sk, hip:point(0,hipDepth,p.hip[1])};
    out.head=point(0,hipDepth+313*Math.sin(p.lean),sk.head[1]);
    for(const side of ['L','R']){
      const sign=side==='L'?-1:1;
      const twist=gait?sign*7*Math.sin(p.gaitPhase+.18):0;
      const arm=sk['arm'+side],leg=sk['leg'+side];
      const shoulder=point(sign*71,hipDepth+shoulderDepth+twist,arm.a[1]);
      const projectArm=(joint,segment)=>{
        const dx=joint[0]-arm.a[0];
        const lateral=gait?sign*(71+segment*6)-dx*.12:sign*71+dx;
        const forward=gait?dx:seated?(segment===1?8:62):Math.abs(dx)*.56+(segment===1?-15:10);
        return point(lateral,hipDepth+shoulderDepth+twist+forward,joint[1]);
      };
      const directions=actingArm(p,side);
      if(directions){
        let joint=[sign*71,hipDepth+shoulderDepth+twist,arm.a[1]];
        const projected=directions.map((dir,i)=>{
          const length=(i===0?122:112)/Math.hypot(...dir);
          joint=joint.map((v,j)=>v+dir[j]*length);
          return point(...joint);
        });
        out['arm'+side]={a:shoulder,b:projected[0],c:projected[1]};
      }else{
        out['arm'+side]={a:shoulder,b:projectArm(arm.b,1),c:projectArm(arm.c,2)};
      }
      const projectLeg=(joint,index)=>{
        if(gait){const spread=index===2?24:32;return point(sign*spread,joint[0]-sign*spread,joint[1]);}
        if(seated)return point(sign*(index===1?44:35),joint[0],joint[1]);
        return point(joint[0],index===1?12:index===2?6:0,joint[1]);
      };
      out['leg'+side]={a:projectLeg(leg.a,0),b:projectLeg(leg.b,1),c:projectLeg(leg.c,2)};
    }
    return out;
  }

  // kit 2026-11-26: a blend between two actions swings every bone on an arc (angle + length), forearm following
  // a beat behind the upper arm, instead of switching the whole arm style half way.
  const ease5=v=>{v=clamp(v);return v*v*v*(v*(v*6-15)+10);};
  function posed(p){
    if(!p.mix)return projectPose(p,skeleton(p));
    const {a,b,k}=p.mix,A=posed(a),B=posed(b),K=ease5(k),K2=ease5((k-.12)/.88);
    const mixP=(u,v,t)=>[lerp(u[0],v[0],t),lerp(u[1],v[1],t)];
    const swing=(from,A0,A1,B0,B1,t,out)=>{
      const ax=A1[0]-A0[0],ay=A1[1]-A0[1],bx=B1[0]-B0[0],by=B1[1]-B0[1],qa=Math.atan2(ay,ax),qb=Math.atan2(by,bx);
      let d=Math.atan2(Math.sin(qb-qa),Math.cos(qb-qa));
      if(Math.abs(d)>2.5&&Math.cos(qa+d/2)*out<0)d-=Math.sign(d)*TAU;      // big raises go round the outside, not through the chest
      const q=qa+d*t,len=lerp(Math.hypot(ax,ay),Math.hypot(bx,by),t);return [from[0]+Math.cos(q)*len,from[1]+Math.sin(q)*len];
    };
    const sk={...B,hip:mixP(A.hip,B.hip,K),head:mixP(A.head,B.head,K)};
    for(const key of ['armL','armR','legL','legR']){
      const x=A[key],y=B[key],arm=key[0]==='a',out=key.endsWith('L')?-1:1,start=mixP(x.a,y.a,K);
      const mid=swing(start,x.a,x.b,y.a,y.b,K,out),end=swing(mid,x.b,x.c,y.b,y.c,arm?K2:K,out);
      sk[key]={a:start,b:mid,c:arm?end:mixP(x.c,y.c,K)};
    }
    return sk;
  }
  function softArm(g,l,width,color,shadow){      // kit: rounded elbow (no hinge look)
    const q=(u,v,t)=>[lerp(u[0],v[0],t),lerp(u[1],v[1],t)],i=q(l.a,l.b,.68),o=q(l.b,l.c,.34);
    const draw=(w,c)=>{g.beginPath();g.moveTo(...l.a);g.lineTo(...i);g.quadraticCurveTo(...l.b,...o);g.lineTo(...l.c);g.lineWidth=w;g.strokeStyle=c;g.lineCap='round';g.lineJoin='round';g.stroke();};
    draw(width+3,COLORS.seam);draw(width*.92,color);line(g,[q(l.b,l.c,.4),q(l.b,l.c,.9)],width*.14,shadow);
  }
  function line(g,points,width,color) {
    g.beginPath();g.moveTo(...points[0]);points.slice(1).forEach(p=>g.lineTo(...p));
    g.lineWidth=width;g.strokeStyle=color;g.lineCap='round';g.lineJoin='round';g.stroke();
  }
  function polygon(g,pts,fill,outline=COLORS.seam,width=2) {
    g.beginPath();g.moveTo(...pts[0]);pts.slice(1).forEach(p=>g.lineTo(...p));g.closePath();g.fillStyle=fill;g.fill();
    if(outline){g.strokeStyle=outline;g.lineWidth=width;g.stroke();}
  }
  function ellipse(g,x,y,rx,ry,fill) {g.beginPath();g.ellipse(x,y,rx,ry,0,0,TAU);g.fillStyle=fill;g.fill();}
  function limb(g,l,width,color,shadow) {
    line(g,[l.a,l.b,l.c],width+3,COLORS.seam);
    line(g,[l.a,l.b],width,color);line(g,[l.b,l.c],width*.84,color);
    line(g,[[l.b[0]+width*.17,l.b[1]],[l.c[0]+width*.17,l.c[1]-4]],width*.16,shadow);
  }
  function hand(g,wrist,elbow,gesture='relaxed',handedness=1) {
    g.save();g.translate(...wrist);g.rotate(Math.atan2(wrist[1]-elbow[1],wrist[0]-elbow[0])-Math.PI/2);
    const folded=gesture==='fist'||gesture==='thumb';
    const spread=gesture==='open'?1.25:.6;
    g.scale(handedness,1);
    shape(g, folded?'M -7 -3 Q -14 1 -12 12 Q -12 22 0 23 Q 12 23 12 13 L 10 4 Q 8 -3 4 -3 Z':'M -7 -3 Q -11 1 -11 9 L -9 15 Q -3 21 7 16 Q 12 12 9 3 L 6 -3 Z',COLORS.skin,COLORS.seam,1.8);
    if(!folded){
      for(let i=0;i<4;i++){
        const x=-7+i*4.6,tip=gesture==='point'?(i===0?32:18):[22,25,24,20][i];
        const finger=[[x,12],[x+(i-1.5)*spread,tip]];
        line(g,finger,5.1,COLORS.skinShadow);line(g,finger,3.8,COLORS.skin);
      }
    }
    const thumb=[[-7,5],[-13,gesture==='thumb'?-6:12],[-14,gesture==='thumb'?-12:15]];
    line(g,thumb,6.8,COLORS.skinShadow);line(g,thumb,4.8,COLORS.skin);
    g.restore();
  }
  function shoe(g,p,side) {
    g.save();g.translate(...p);
    g.scale(side<0?-.93:1,1);
    shape(g,'M -18 -5 Q -6 0 8 -6 L 16 1 Q 18 7 29 9 Q 38 11 38 18 Q 36 22 27 22 L -18 22 Q -23 16 -18 -5 Z',COLORS.shoe);
    shape(g,'M -21 17 Q 8 21 38 16 L 38 21 Q 34 25 -19 24 Z',COLORS.sole,COLORS.seam,1.6);
    for(let i=0;i<3;i++)line(g,[[7+i*4,1+i*2],[3+i*4,5+i*2]],1.8,'#997f67');
    g.restore();
  }

  function shape(g, path, fill, outline=COLORS.seam, width=2) {
    const curve=new Path2D(path);
    g.fillStyle=fill; g.fill(curve);
    if(outline){g.strokeStyle=outline; g.lineWidth=width; g.stroke(curve);}
  }
  function torso(g,p,sk,back) {
    g.save();g.translate(...sk.hip);
    const side=Math.abs(Math.sin(p.yaw));
    g.rotate(p.lean*side);g.scale(Math.sqrt(Math.cos(p.yaw)**2+.42*side**2),1);
    shape(g,'M -28 -236 Q 0 -224 28 -236 Q 65 -234 79 -212 L 68 -141 Q 57 -69 68 10 Q 4 24 -68 10 Q -61 -57 -72 -150 L -79 -212 Q -70 -230 -28 -236 Z',COLORS.tee);
    shape(g,'M -64 -32 Q -24 -8 41 -18 Q 10 -4 -53 -10 L -64 -12 Z','#232b40',null);
    g.beginPath();g.moveTo(-28,-234);g.quadraticCurveTo(0,-209,29,-234);g.strokeStyle='#1f2433';g.lineWidth=5;g.stroke();
    g.save();g.translate(side*48,0);g.scale(1-side*.84,1);
    const cut=look.cut;
    if(!back&&(cut==='jacket'||cut==='cardigan')){
      shape(g,'M -23 -231 L 23 -231 L 34 10 L -34 10 Z',look.accent);
      if(cut==='jacket'){
        shape(g,'M -22 -234 L -49 -219 L -34 -187 L -42 -179 L -24 -139 Z',COLORS.tee);
        shape(g,'M 22 -234 L 49 -219 L 34 -187 L 42 -179 L 24 -139 Z',COLORS.tee);
      }else for(let y=-150;y<5;y+=36)ellipse(g,34,y,3,3,look.accent);
    }
    if(cut==='overalls'){
      shape(g,'M -52 -228 L -38 -228 L -30 -175 L 32 -175 L 41 -228 L 54 -226 L 49 -163 L 61 11 Q 0 24 -62 11 L -50 -160 Z',COLORS.pants);
      shape(g,'M -23 -156 L 25 -156 L 23 -129 Q 0 -116 -22 -129 Z',COLORS.pantsShadow);
    }
    if(!back&&cut==='polo'){
      shape(g,'M -28 -234 L 0 -221 L -14 -197 L -38 -221 Z',look.accent);
      shape(g,'M 28 -234 L 0 -221 L 14 -197 L 38 -221 Z',look.accent);
      shape(g,'M 30 -164 L 57 -164 L 56 -139 L 44 -134 L 30 -142 Z',COLORS.tee);
    }
    g.restore();
    if(cut==='stripe')for(let y=-165;y<-71;y+=27)line(g,[[-65,y],[65,y+2]],7,look.accent);
    g.restore();
  }
  function trouser(g,leg,fill){
    const [hx,hy]=leg.a,[kx,ky]=leg.b,[fx,fy]=leg.c;
    const path=new Path2D();
    path.moveTo(hx-30,hy-8);path.lineTo(hx+30,hy-8);
    path.quadraticCurveTo(kx+31,ky-18,kx+29,ky+6);
    path.lineTo(fx+23,fy-6);path.quadraticCurveTo(fx,fy+1,fx-24,fy-6);
    path.lineTo(kx-26,ky+8);path.quadraticCurveTo(kx-31,ky-8,hx-30,hy-8);path.closePath();
    g.fillStyle=fill;g.fill(path);g.strokeStyle=COLORS.seam;g.lineWidth=2;g.stroke(path);
    line(g,[[fx-21,fy-13],[fx+20,fy-14]],3,'#595055');
  }
  function shirtArm(g,arm,gesture,handedness){
    const long=look.cut==='jacket'||look.cut==='cardigan';
    softArm(g,arm,long?32:23,long?COLORS.tee:COLORS.skin,long?COLORS.seam:COLORS.skinShadow);
    const a=arm.a,b=arm.b,angle=Math.atan2(b[1]-a[1],b[0]-a[0]);
    g.save();g.translate(...a);g.rotate(angle);
    g.scale(Math.min(1,Math.hypot(b[0]-a[0],b[1]-a[1])/122),1);
    shape(g,'M -8 -18 Q -23 -10 -19 7 Q -17 18 -5 20 L 69 23 Q 76 5 71 -21 Z',COLORS.tee);
    g.restore();hand(g,arm.c,b,gesture,handedness);
  }
  function drawEye(g,x,y,openness,e) {
    const h=Math.max(.45,8*openness);
    g.save();g.translate(x,y);
    const eye=new Path2D();eye.moveTo(-12,-h*.45);eye.quadraticCurveTo(0,-h*.95,12,-h*.55);
    eye.bezierCurveTo(12,h*1.3,-9,h*1.5,-12,-h*.45);
    g.fillStyle=COLORS.eye;g.fill(eye);g.clip(eye);
    ellipse(g,e.lookX*5,e.lookY*3-.8,5.5,8,'#241f25');
    g.restore();g.beginPath();g.moveTo(x-12,y-h*.45);g.quadraticCurveTo(x,y-h*.95,x+12,y-h*.55);g.lineWidth=2.2;g.strokeStyle=COLORS.hair;g.stroke();
  }
  const curls='M -40 18 Q -54 23 -51 8 Q -64 8 -58 -5 Q -69 -13 -54 -23 Q -62 -38 -45 -41 Q -47 -54 -31 -52 Q -32 -67 -13 -61 Q 2 -64 -4 -73 Q 13 -72 16 -60 Q 34 -73 37 -58 Q 49 -57 44 -47 Q 64 -48 56 -31 Q 67 -22 57 -13 Q 64 0 49 6 Q 49 18 40 18 L 30 -14 Q 19 -26 12 -26 Q 15 -12 -2 -12 Q 3 -18 -2 -27 Q -9 -18 -23 -22 Q -32 -19 -34 -7 Z';
  function head(g,x,y,p,e,options) {
    const yaw=Math.abs(p.yaw),back=Math.cos(yaw)<-.25,profile=Math.abs(Math.sin(yaw));
    const shift=Math.sin(yaw)*12;
    g.save();g.translate(x,y);g.rotate(p.headTilt+p.headNod);
    g.scale(1.68*(1-profile*.23)*(look.faceWidth||1),1.60*(look.faceHeight||1));
    if(look.head){look.head(g,{e,shift,back,inProfile:profile>.91&&!back,options,skin:COLORS.skin,open:PHONEMES[options.phoneme]?.open??Math.max(e.open,clamp(options.talk||0)*.48)});g.restore();return;}   // kit hook: whole custom head (engine/newheads.js)
    ellipse(g,0,-9,52,55,COLORS.hair);
    shape(g,'M -46 -18 C -44 -51 38 -53 46 -18 C 58 19 37 43 8 46 C -22 51 -53 31 -46 -18 Z',COLORS.skin);
    ellipse(g,-44,6,8,11,COLORS.skin);ellipse(g,44,6,8,11,COLORS.skin);
    const inProfile=profile>.91&&!back;
    if(inProfile){
      shape(g,'M -31 -32 Q 9 -56 35 -29 Q 42 -21 41 -9 L 51 3 Q 55 8 45 10 L 43 24 Q 38 44 11 45 Q -24 45 -34 15 Z',COLORS.skin);
      g.save();g.translate(-9,0);g.scale(.92,1);
    }
    const style=look.hairStyle||'curls';
    if(style==='curls'){
    shape(g,curls,COLORS.hair);
    shape(g,'M -48 -29 Q -50 -42 -32 -42 Q -19 -41 -14 -55 Q -13 -39 -30 -37 Q -43 -37 -48 -29 Z','#ae6941',null);
    shape(g,'M 2 -54 Q 21 -69 29 -56 Q 22 -61 12 -54 Q 5 -50 2 -54 Z','#ca8351',null);
    shape(g,'M -47 -13 Q -58 -27 -40 -35 Q -45 -25 -39 -26 Q -49 -22 -47 -13 Z','#463036',null);
    shape(g,'M 14 -39 Q 36 -56 45 -37 Q 36 -46 25 -36 Q 17 -30 14 -31 Q 23 -37 14 -39 Z','#56383a',null);
    shape(g,'M 34 -18 Q 47 -33 55 -24 Q 46 -24 42 -12 Q 39 -6 35 -5 Q 39 -13 34 -18 Z','#4d3337',null);
    }else{
      const cuts={
        crop:'M -46 6 Q -60 -55 -8 -59 Q 36 -67 48 -28 L 43 5 L 34 -20 Q 12 -14 -6 -27 L -29 -19 L -36 5 Z',
        wave:'M -44 10 Q -61 -35 -38 -51 Q -21 -65 7 -58 Q 35 -73 46 -50 Q 58 -31 39 -18 Q 18 -18 5 -28 Q -10 -14 -32 -13 L -39 9 Z',
        bob:'M -45 23 Q -64 10 -54 -34 Q -47 -64 -7 -61 Q 41 -65 51 -34 Q 59 -4 49 26 L 38 17 L 32 -21 Q 9 -20 -3 -38 Q -14 -17 -36 -12 L -36 22 Z',
        bun:'M -43 6 Q -57 -31 -38 -49 Q -14 -68 17 -55 Q 49 -48 49 -12 L 40 10 L 32 -21 Q 7 -24 -9 -37 Q -23 -24 -38 -18 Z',
        fade:'M -46 1 Q -55 -38 -33 -52 Q 0 -66 29 -51 Q 48 -40 47 -9 L 38 -2 L 33 -25 Q 0 -16 -32 -26 L -38 2 Z'
      };
      if(style==='bun')ellipse(g,-38,-51,22,21,COLORS.hair);
      shape(g,cuts[style]||cuts.crop,COLORS.hair);
      shape(g,'M -37 -38 Q -16 -58 8 -51 Q -15 -51 -37 -36 Z',COLORS.hairLight,null);
    }
    if(inProfile){
      g.restore();ellipse(g,-11,8,8,11,COLORS.skin);
      line(g,[[-14,7],[-10,4],[-7,7]],1.5,COLORS.skinShadow);
    }
    if(back){
      shape(g,'M -48 -26 Q 0 -61 47 -24 L 44 14 Q 39 29 28 33 L 29 29 Q 16 46 5 43 L 7 39 Q -9 47 -19 40 Q -42 38 -48 15 Z',COLORS.hair,null);
      if(profile>.3){
        ellipse(g,34,10,6,9,COLORS.skinShadow);
        line(g,[[32,9],[35,6],[36,11]],1.2,COLORS.hairLight);
      }
      g.restore();return;
    }
    if(look.face){look.face(g,{e,shift,inProfile,options,hair:COLORS.hair,skin:COLORS.skin,open:PHONEMES[options.phoneme]?.open??Math.max(e.open,clamp(options.talk||0)*.48)});g.restore();return;}   // kit hook: custom face (engine/memefaces.js)
    if(look.stubble!==false)for(let i=-5;i<=5;i++){const sx=i*3.8,sy=43-i*i*.12;line(g,[[sx,sy],[sx+1,sy-2]],.85,'#715548');}
    const blink=options.blink===true||(options.autoBlink!==false&&((options.time||0)%3.7)>3.55);
    const eyeScale=blink?.08:1;
    const nearX=17+shift,farX=-18+shift;
    if(!inProfile)drawEye(g,farX,-6,e.eyeL*eyeScale*(1-profile*.2),e);drawEye(g,nearX,-6,e.eyeR*eyeScale,e);
    const brows=[{x:farX,y:-19+e.browYL*40,a:e.browL},{x:nearX,y:-19+e.browYR*40,a:e.browR}];
    for(const b of (inProfile?brows.slice(1):brows))line(g,[[b.x-11,b.y-b.a*20],[b.x+10,b.y+b.a*20]],3.5,COLORS.hair);
    if(!inProfile)line(g,[[4+shift,-3],[9+shift,13],[1+shift,16]],1.8,COLORS.skinShadow);
    line(g,[[23+shift,13],[28+shift,10]],1,COLORS.skinShadow);
    if(look.glasses){
      g.strokeStyle='#443939';g.lineWidth=2.2;
      for(const cx of (inProfile?[nearX]:[farX,nearX])){g.beginPath();g.ellipse(cx,-4,14,10,0,0,TAU);g.stroke();}
      line(g,[[inProfile?-8:farX+14,-6],[nearX-14,-6]],2,'#443939');
    }
    if(look.aged)for(const side of [-1,1])line(g,[[side*27+shift,6],[side*34+shift,8]],1.1,COLORS.skinShadow);
    const phoneme=PHONEMES[options.phoneme];
    const talking=clamp(options.talk||0);
    const width=(phoneme?.width??e.width)*(inProfile?32:51);
    const open=phoneme?.open??Math.max(e.open,talking*.48);
    const my=25,mx=inProfile?31:shift*.65;
    if(open>.065){
      g.beginPath();g.moveTo(mx-width,my);g.quadraticCurveTo(mx,my+e.curve*25,mx+width,my-e.asym*25);
      g.quadraticCurveTo(mx,my+open*45,mx-width,my);g.closePath();g.fillStyle='#523331';g.fill();
      if(open>.18){g.save();g.clip();line(g,[[mx-width*.63,my+2],[mx+width*.65,my+1]],3.5,COLORS.eye);ellipse(g,mx,my+open*24,width*.4,open*6,'#bb786a');g.restore();}   // kit: tongue stays inside the mouth
    }else{
      g.beginPath();g.moveTo(mx-width,my);g.quadraticCurveTo(mx,my+e.curve*37,mx+width,my-e.asym*22);
      g.strokeStyle='#6d4738';g.lineWidth=2;g.stroke();
    }
    if(e.blush){g.globalAlpha=e.blush*.32;ellipse(g,-27,16,10,5,'#da6b5a');ellipse(g,28,16,10,5,'#da6b5a');g.globalAlpha=1;}
    if(e.tears){for(const ex of [farX,nearX])line(g,[[ex,0],[ex,22]],3,'#8ec6d4');}
    if(e.sweat){ellipse(g,-39,-1,2.8,6,'#a5d4df');}
    g.restore();
  }

  function draw(g,options={}) {
    const t=options.time||0;
    const p=options.pose||motion(options.action||'idle',t,options);
    const world=skeleton(p),sk=posed(p),back=Math.cos(p.yaw)<-.25;
    let e=typeof options.emotion==='object'?{...baseEmotion,...options.emotion}:emotion(options.emotion||'neutral');
    if(options.transition)e=blendEmotion(options.transition.from,options.transition.to,options.transition.progress);
    if(options.look)e={...e,lookX:options.look[0],lookY:options.look[1]};
    g.save();g.translate(options.x||0,options.y||0);g.scale((options.scale||1)*(options.facing||1)*(p.yaw<0?-1:1)*(look.build||1)*(look.height||1),(options.scale||1)*(look.height||1));
    if(options.shadow!==false)ellipse(g,0,3,91,12,'rgba(35,43,43,.14)');
    trouser(g,sk.legL,COLORS.pantsShadow);shoe(g,sk.legL.c,Math.abs(Math.sin(p.yaw))>.45?1:-1);
    trouser(g,sk.legR,COLORS.pants);shoe(g,sk.legR.c,1);
    for(const leg of [sk.legL,sk.legR])line(g,[[leg.b[0]-13,leg.b[1]+9],[leg.b[0]+9,leg.b[1]+5]],1.5,COLORS.pantsShadow);
    shirtArm(g,sk.armL,p.gestureL,-1);
    line(g,[sk.head,[(sk.armL.a[0]+sk.armR.a[0])/2,(sk.armL.a[1]+sk.armR.a[1])/2]],30,COLORS.skinShadow);
    torso(g,p,sk,back);
    if(!back&&['sit','think','standUp','shrug','recoil'].includes(p.action)){
      const fore=sk.armL,long=look.cut==='jacket'||look.cut==='cardigan';

      line(g,[[lerp(fore.b[0],fore.c[0],.3),lerp(fore.b[1],fore.c[1],.3)],fore.c],long?26:17,long?COLORS.tee:COLORS.skin);
      hand(g,fore.c,fore.b,p.gestureL,-1);
    }
    shirtArm(g,sk.armR,p.gestureR,1);
    head(g,...sk.head,p,e,options);
    if(options.debug){
      for(const chain of [sk.armL,sk.armR,sk.legL,sk.legR]){
        line(g,[chain.a,chain.b,chain.c],2,'#dd3956');for(const joint of [chain.a,chain.b,chain.c])ellipse(g,...joint,4,4,'#dd3956');
      }
    }
    g.restore();return world;
  }

  return {createRig,look,draw,motion,skeleton,blendPose,emotion,blendEmotion,EMOTIONS,POSE_NAMES,PHONEMES,COLORS,ik};
  }
  root.Character19=createRig();
  if(typeof module!=='undefined')module.exports=root.Character19;
})(typeof window!=='undefined'?window:globalThis);
