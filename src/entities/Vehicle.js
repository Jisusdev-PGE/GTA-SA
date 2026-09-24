import * as THREE from "three";

export class Vehicle{
  constructor(game,pos){
    this.game=game;this.driver=null;this.velocity=0;this.steer=0;
    this.object=new THREE.Group();this.object.position.copy(pos);
    const body=new THREE.Mesh(new THREE.BoxGeometry(2,1,4.2),new THREE.MeshStandardMaterial({color:0xb52d2d,roughness:.55}));
    body.position.y=1;body.castShadow=true;this.object.add(body);
    const cabin=new THREE.Mesh(new THREE.BoxGeometry(1.7,.8,1.9),new THREE.MeshStandardMaterial({color:0x171a20,roughness:.2,metalness:.2}));
    cabin.position.set(0,1.75,-.15);cabin.castShadow=true;this.object.add(cabin);
    for(const x of [-1,1])for(const z of [-1.45,1.45]){
      const w=new THREE.Mesh(new THREE.CylinderGeometry(.34,.34,.22,12),new THREE.MeshStandardMaterial({color:0x111111}));
      w.rotation.z=Math.PI/2;w.position.set(x,0.42,z);this.object.add(w);
    }
  }
  near(p){return this.object.position.distanceTo(p)<4}
  update(dt){
    const k=this.game.keys;
    if(this.driver){
      const accel=(k.has("KeyW")?1:0)-(k.has("KeyS")?1:0);
      this.velocity+=accel*18*dt;
      if(!accel)this.velocity*=Math.pow(.18,dt);
      this.velocity=THREE.MathUtils.clamp(this.velocity,-10,32);
      const steer=(k.has("KeyD")?1:0)-(k.has("KeyA")?1:0);
      this.steer=THREE.MathUtils.lerp(this.steer,steer,.12);
      this.object.rotation.y-=this.steer*this.velocity*.025*dt;
      const forward=new THREE.Vector3(0,0,1).applyQuaternion(this.object.quaternion);
      const next=this.object.position.clone().addScaledVector(forward,this.velocity*dt);
      if(!this.game.world.blocked(next,1.35))this.object.position.copy(next);else this.velocity*=-.25;
      if(k.has("Space"))this.velocity*=Math.pow(.015,dt);
      if(k.has("KeyE")){k.delete("KeyE");this.driver.inVehicle=false;this.driver.object.visible=true;this.driver.object.position.copy(this.object.position).add(new THREE.Vector3(2,0,0));this.driver=null;}
    }
  }
}
