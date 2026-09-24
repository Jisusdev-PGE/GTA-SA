import * as THREE from "three";

export class MissionSystem{
  constructor(game){
    this.game=game;this.stage=0;this.money=350;this.wanted=0;
    this.points=[
      new THREE.Vector3(-95,.2,-75),
      new THREE.Vector3(35,.2,-65),
      new THREE.Vector3(0,.2,95),
      new THREE.Vector3(95,.2,35)
    ];
    this.marker=new THREE.Mesh(new THREE.CylinderGeometry(3,3,.25,32),new THREE.MeshBasicMaterial({color:0xff4b4b,transparent:true,opacity:.75}));
    this.marker.position.copy(this.points[0]);this.game.scene.add(this.marker);
  }
  update(dt){
    const target=this.game.player.inVehicle?this.game.vehicle.object:this.game.player.object;
    this.marker.rotation.y+=dt*2;this.marker.position.y=.3+Math.sin(performance.now()*.004)*.15;
    if(target.position.distanceTo(this.points[this.stage])<6){
      this.money+=250;this.stage=(this.stage+1)%this.points.length;this.wanted=Math.min(5,this.wanted+(this.stage===0?1:0));this.marker.position.copy(this.points[this.stage]);
    }
  }
}
