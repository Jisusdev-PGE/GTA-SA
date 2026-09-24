import * as THREE from "three";

export class Player{
  constructor(game){
    this.game=game;this.inVehicle=false;this.speed=5.5;
    this.object=new THREE.Group();
    const body=new THREE.Mesh(new THREE.CapsuleGeometry(.42,1.05,5,10),new THREE.MeshStandardMaterial({color:0x263d77}));
    body.position.y=1.15;body.castShadow=true;this.object.add(body);
    const head=new THREE.Mesh(new THREE.SphereGeometry(.33,12,8),new THREE.MeshStandardMaterial({color:0x7c4a2b}));
    head.position.y=2;head.castShadow=true;this.object.add(head);
    this.object.position.set(-5,.05,10);
    this.yaw=0;
  }
  update(dt){
    if(this.inVehicle)return;
    const k=this.game.keys;
    const v=new THREE.Vector3((k.has("KeyD")?1:0)-(k.has("KeyA")?1:0),0,(k.has("KeyS")?1:0)-(k.has("KeyW")?1:0));
    if(v.lengthSq()){
      v.normalize();const s=k.has("ShiftLeft")?8.5:this.speed;
      this.object.position.addScaledVector(v,s*dt);
      this.yaw=Math.atan2(v.x,v.z);this.object.rotation.y=this.yaw;
      if(this.game.world.blocked(this.object.position,.55))this.object.position.addScaledVector(v,-s*dt);
    }
    if(k.has("KeyE")){k.delete("KeyE");if(this.game.vehicle.near(this.object.position)){this.inVehicle=true;this.game.vehicle.driver=this;this.object.visible=false;}}
  }
}
