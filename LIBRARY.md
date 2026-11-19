# Scene library cheat sheet (see LIBRARY_CATALOG.png for pictures; test clip: specs/clip100.json)

Every scene is `{"name","start","dur","type":"stage","bg":...}`; times are scene-local seconds (or voice-over phrases for start/end/say.at).

## Environments (`bg`)
street (`time` day|dusk|night), railway, harbor, dayCloud, buildSite, neonNight, officeNight, office1925, serverHall,
bedroom / kitchen / classroom / hospital / livingRoom (`time` day|night), factory, lab, stadium.

## Props (`props:[{type,x,y,scale,dir,move:[t0,t1,dx],col,label,front}]`, y = ground line)
Vehicles: car (`beam:true` headlights), bus (`label`), truck (`label`), train (smoke), plane, bike, boat (`sail:true`). Wheels rotate with the move distance.
Machines: factoryLine (moving boxes), robotArm (swinging), serverRack (blinking), labBench (bubbling), controlPanel (blinking).

## People
Hero + cast: `chars:[{name,style:"mascot",x,y,scale,view,dir,walk:[t0,t1,dx],shirt,skin,glasses,curl}]`
Crowd: `"crowd":{"n":22,"x0":0,"x1":1900,"y":820,"scale":0.8,"walk":[0,2],"seed":9,"still":false}` (varied mascots, mixed directions, never yellow).
Group: `"group":{"n":5,"x":110,"dx":135,"y":1015,"hats":["bowler"],"walk":[0,2,500]}`.
Talking: `"say":[{"char":"hero","emotion":"crying","at":"spoken phrase"}]`.
Semi-3D: `"vol":true` on a mascot (form shading, specular highlights, rim lights, chin/ground shadows; see docs/SEMI3D_BEFORE_AFTER.png). Head turn: `"turns":[[t,dur,yaw,fromYaw]]` with yaw -1 (left) .. 0 (front) .. 1 (right), see docs/HEAD_TURN.png; or call `T.turn(tl,id,t,dur,yaw)`.
Aging: `"age":0..70` on a mascot (15 first lines, 30 glasses + grey tufts, 50 grey brows + spots, 55+ cane, 60+ white hair, side/three-quarter views stoop). `cane:true/false` overrides. See docs/MASCOT_AGES.png.

## Look and light
`"weather":"rain|snow|fog|sunrise|stars"`, `"exposure":0.3`, `"lights":[[x,y,r,opacity]]`, `"camMoves":[{t,dur,fx,fy,k}]`, `"theme":"google"`.
