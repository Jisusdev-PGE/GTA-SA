import * as THREE from "three";

export class TrafficSystem{
  constructor(game){
    this.game=game;this.cars=[];
    const colors=[0x3c74b8,0xd6b43b,0x4d9a57,0xb34c9a,0xdddddd];
    for(let i=0;i<18;i++){
      const g=new THREE.Group(),b=new THREE.Mesh(new THREE.BoxGeometry(1.8,.8,3.6),new THREE.MeshStandardMaterial({color:colors[i%colors.length]}));
      b.position.y=.7;g.add(b);g.position.set((i%9-4)*40,.05,((i*67)%360)-180);g.userData.axis=i%2;g.userData.dir=i%3?1:-1;g.userData.speed=8+(i%6)*1.5;this.game.scene.add(g);this.cars.push(g);
    }
  }
  update(dt){
    for(const c of this.cars){
      if(c.userData.axis===0)c.position.x+=c.userData.speed*c.userData.dir*dt;else c.position.z+=c.userData.speed*c.userData.dir*dt;
      if(c.position.x>205)c.position.x=-205;if(c.position.x<-205)c.position.x=205;
      if(c.position.z>205)c.position.z=-205;if(c.position.z<-205)c.position.z=205;
    }
  }
}
