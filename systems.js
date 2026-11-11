(function(root){
'use strict';
const boosts=[[1,5,14],[1,4,10],[2,6,8],[2,3,3]],costs=[[60,600,4800],[75,540,3000],[90,720,3600],[80,420,1800]],finalCost=12600;
function createIdle(at){return {at,last:at,elapsed:0,energy:0,rate:1,levels:[0,0,0,0],purchases:0,history:[]};}
function buyIdle(s,i){if(!Number.isInteger(i)||i<0||i>3||s.levels[i]>=3)return false;const level=s.levels[i],cost=costs[i][level];if(s.energy+1e-6<cost)return false;s.energy=Math.max(0,s.energy-cost);s.levels[i]++;s.rate+=boosts[i][level];s.purchases++;s.history.push({system:i,level:level+1,at:s.elapsed,cost});return true;}
function advanceIdle(s,at){const next=Math.max(s.last,at),delta=(next-s.last)/1000;s.energy+=delta*s.rate;s.elapsed+=delta;s.last=next;return s;}
function idleReady(s){return s.levels.every(v=>v===3)&&s.energy+1e-6>=finalCost;}
function rotate(mask,n=1){for(let i=0;i<(n+4)%4;i++)mask=((mask<<1)&15)|(mask>>3);return mask;}
const nodes=[{x:500,y:150},{x:500,y:210},{x:500,y:270},{x:750,y:400},{x:690,y:400},{x:630,y:400},{x:500,y:650},{x:500,y:590},{x:500,y:530},{x:250,y:400},{x:310,y:400},{x:370,y:400}];
const solved=[7,5,5,5,9,12,10,11,3,5,6,9],edges=[];
for(let k=0;k<3;k++){const t=k,r=3+k,b=6+k,l=9+k;edges.push({a:t,ap:2,b:r,bp:1,corner:[nodes[r].x,nodes[t].y]},{a:r,ap:4,b:b,bp:2,corner:[nodes[r].x,nodes[b].y]},{a:b,ap:8,b:l,bp:4,corner:[nodes[l].x,nodes[b].y]},{a:l,ap:1,b:t,bp:8,corner:[nodes[l].x,nodes[t].y]});}
for(let k=0;k<2;k++)edges.push({a:k,ap:4,b:k+1,bp:1},{a:3+k,ap:8,b:4+k,bp:2},{a:6+k,ap:1,b:7+k,bp:4},{a:9+k,ap:2,b:10+k,bp:8});
function powerState(masks){const live=new Set();if(masks[0]&1)live.add(0);let changed=true;while(changed){changed=false;for(const e of edges)if((masks[e.a]&e.ap)&&(masks[e.b]&e.bp)){if(live.has(e.a)&&!live.has(e.b)){live.add(e.b);changed=true;}if(live.has(e.b)&&!live.has(e.a)){live.add(e.a);changed=true;}}}const center=[ [2,4],[5,8],[8,1],[11,2] ].some(([i,p])=>live.has(i)&&(masks[i]&p));const corner=live.has(6)&&!!(masks[6]&8)||live.has(9)&&!!(masks[9]&4);return {live,center,corner,count:Number(center)+Number(corner)};}
const api={createIdle,advanceIdle,buyIdle,idleReady,boosts,costs,finalCost,rotate,nodes,solved,edges,powerState};if(typeof module==='object'&&module.exports)module.exports=api;else root.SignalSystems=api;
})(typeof window==='undefined'?globalThis:window);
