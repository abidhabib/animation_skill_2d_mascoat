/* Reuse a performer with Cast.rig("mara", "workwear").draw(ctx, options).
   Cast.rush(ctx, seconds, seed) paints a repeatable 1200 x 960 street scene. */
window.Cast = (() => {
  const outfits = {
    original: ['Navy tee', 'tee', '#303950', '#383438', '#ddd0ae'],
    workwear: ['Canvas overalls', 'overalls', '#ead0a3', '#48656a', '#bbc7af'],
    blazer: ['Plum blazer', 'jacket', '#69465a', '#343642', '#eee2cf'],
    cardigan: ['Sage cardigan', 'cardigan', '#637c67', '#483f3f', '#f2d5a9'],
    marine: ['Mariner stripes', 'stripe', '#eee2c6', '#394758', '#354d68'],
    uniform: ['Driver polo', 'polo', '#407a80', '#303c47', '#bdd4c6']
  };
  // Each identity keeps its own proportions and features across costume changes.
  const people = {
    lead: ['Main character', 'original', {}],
    niko: ['Niko · young courier', 'workwear', {skin:'#ae704e',shade:'#85523e', hair:'#291f20',hairStyle:'fade',faceWidth:.91,height:1.05,build:.92}],
    ines: ['Ines · young illustrator', 'marine', {skin:'#e3a47a',shade:'#b9795a',hair:'#783f32',hairStyle:'bob',faceWidth:.94,faceHeight:.93,height:.93,stubble:false}],
    tess: ['Tess · young commuter', 'blazer', {skin:'#8e573f',shade:'#714330',hair:'#30262d',hairStyle:'bun',glasses:true,faceHeight:1.06,height:1.04,build:.94,stubble:false}],
    omar: ['Omar · middle-aged driver', 'uniform', {skin:'#bf8260',shade:'#935c46',hair:'#493c38',hairStyle:'crop',faceWidth:1.13,faceHeight:.94,height:1.01,build:1.13}],
    mara: ['Mara · middle-aged shopkeeper', 'cardigan', {skin:'#edb993',shade:'#bf896f',hair:'#482f35',hairStyle:'wave',faceWidth:1.05,height:.96,build:1.12,stubble:false}],
    leon: ['Leon · older tailor', 'blazer', {skin:'#965e48',shade:'#754938',hair:'#c0afa2',hairStyle:'fade',faceHeight:1.08,height:.94,glasses:true,aged:true}],
    june: ['June · older gardener', 'workwear', {skin:'#e3bd97',shade:'#b69779',hair:'#bbb9aa',hairStyle:'bun',faceWidth:1.11,height:.88,build:1.07,aged:true,stubble:false}],
    ivo: ['Ivo · middle-aged cook', 'marine', {skin:'#e2af8d',shade:'#bb866c',hair:'#675142',hairStyle:'wave',faceHeight:1.08,height:1.07,build:1.04}],
    alma: ['Alma · older commuter', 'cardigan', {skin:'#b77e59',shade:'#946244',hair:'#d4c2ad',hairStyle:'bob',glasses:true,faceWidth:.93,height:.92,aged:true,stubble:false}]
  };
  const cache = new Map();
  function rig(person='lead', outfit) {
    const [,usual,features]=people[person];
    outfit=outfit||usual;
    const key=person+'/'+outfit;
    if(!cache.has(key)){
      const [,cut,tee,pants,accent]=outfits[outfit];
      const colors={tee,pants,pantsShadow:pants};
      if(features.skin)Object.assign(colors,{skin:features.skin,skinShadow:features.shade,hair:features.hair,hairLight:features.aged?'#e9d9c0':'#ab7651'});
      cache.set(key,Character19.createRig({...features,cut,accent,colors}));
    }
    return cache.get(key);
  }
  function crowd(seed){
    let state=seed>>>0;
    const random=()=>{state=(Math.imul(state,1664525)+1013904223)>>>0;return state/4294967296;};
    const ids=Object.keys(people);
    for(let i=ids.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[ids[i],ids[j]]=[ids[j],ids[i]];}
    return ids.map((id,i)=>({
      rig:rig(id,random()<.55?people[id][1]:Object.keys(outfits)[Math.floor(random()*6)]),
      lane:Math.floor(i/3), position:(i%3)*465+random()*150,
      direction:Math.floor(i/3)%2?-1:1, phase:random()*2,
      rate:.78+random()*.4, action:random()<.22?'run':'walk',
      emotion:['focused','caughtOut','smugAside','friendly','teasing','deadpan'][Math.floor(random()*6)]
    }));
  }
  let lastSeed,actors;
  function rush(g,time,seed=19){
    if(lastSeed!==seed){actors=crowd(seed);lastSeed=seed;}
    const rect=(x,y,w,h,c)=>{g.fillStyle=c;g.fillRect(x,y,w,h);};
    const sky=g.createLinearGradient(0,0,0,580);sky.addColorStop(0,'#99b8c2');sky.addColorStop(1,'#f5cd9e');
    rect(0,0,1200,960,sky);
    for(let i=0;i<7;i++){
      const x=i*195-41,y=110+(i%3)*32;
      rect(x,y,188,565-y,['#be8169','#d8ac84','#8da5a1'][i%3]);rect(x-3,y-5,194,9,'#6d6760');
      for(let j=0;j<3;j++){rect(x+15+j*55,y+32,35,70,'#5e7179');rect(x+18+j*55,y+36,12,55,'#a3b7b1');}
      rect(x+10,368,168,182,'#42545a');rect(x+16,379,90,144,'#91a6a3');rect(x+117,377,51,159,'#6c827e');
      for(let j=0;j<8;j++)rect(x+j*23,352,23,24,j%2?'#dfc49a':'#985f50');
    }
    rect(0,550,1200,410,'#d2ba9f');
    for(let i=0;i<4;i++)rect(0,598+i*92,1200,2,'#bea98e');
    for(const a of actors){
      const scale=.31+a.lane*.076,t=time*a.rate+a.phase,p=a.rig.motion(a.action,t,{yaw:Math.PI/2});
      const distance=p.travelX*scale*(a.rig.look.height||1)*(a.rig.look.build||1);
      const u=(a.position+distance)%1500;
      a.rig.draw(g,{x:a.direction>0?u-150:1350-u,y:631+a.lane*92,scale,pose:p,time:t,emotion:a.emotion,facing:a.direction});
    }
  }
  return {people,outfits,rig,rush};
})();
