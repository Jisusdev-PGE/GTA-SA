import * as THREE from "three";

export class PedestrianSystem{
  constructor(game){
    this.game=game;this.peds=[];
    for(let i=0;i<55;i++){
      const g=new THREE.Group();
      const body=new THREE.Mesh(new THREE.CapsuleGeometry(.18,.55,3,6),new THREE.MeshStandardMaterial({color:0x555e78+(i%4)*0x080000}));
      body.position.y=.6;g.add(body);
      g.position.set((Math.random()*360)-180,.05,(Math.random()*360)-180);
      g.userData.v=new THREE.Vector3(Math.random()-.5,0,Math.random()-.5).normalize();
      g.userData.t=1+Math.random()*5;this.game.scene.add(g);this.peds.push(g);
    }
  }
  update(dt){
    for(const p of this.peds){
      p.userData.t-=dt;
      if(p.userData.t<0){p.userData.t=1+Math.random()*5;p.userData.v.set(Math.random()-.5,0,Math.random()-.5).normalize();}
      const n=p.position.clone().addScaledVector(p.userData.v,1.2*dt);
      if(!this.game.world.blocked(n,.25))p.position.copy(n);else p.userData.v.negate();
    }
  }
}
