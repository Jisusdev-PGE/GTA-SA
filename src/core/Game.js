import * as THREE from "three";
import { World } from "../world/World.js";
import { Player } from "../entities/Player.js";
import { Vehicle } from "../entities/Vehicle.js";
import { TrafficSystem } from "../systems/TrafficSystem.js";
import { PedestrianSystem } from "../systems/PedestrianSystem.js";
import { MissionSystem } from "../systems/MissionSystem.js";
import { HUD } from "../ui/HUD.js";

export class Game {
  constructor(canvas){
    this.canvas=canvas;
    this.scene=new THREE.Scene();
    this.scene.background=new THREE.Color(0x87b7e8);
    this.camera=new THREE.PerspectiveCamera(68,innerWidth/innerHeight,.1,2200);
    this.renderer=new THREE.WebGLRenderer({canvas,antialias:true});
    this.renderer.setPixelRatio(Math.min(devicePixelRatio,1.75));
    this.renderer.setSize(innerWidth,innerHeight);
    this.renderer.shadowMap.enabled=true;
    this.renderer.shadowMap.type=THREE.PCFSoftShadowMap;
    this.clock=new THREE.Clock();
    this.keys=new Set();
    this.started=false;
    this.entities=[];
    addEventListener("resize",()=>this.resize());
    addEventListener("keydown",e=>this.keys.add(e.code));
    addEventListener("keyup",e=>this.keys.delete(e.code));
  }

  boot(){
    this.world=new World(this.scene);
    this.player=new Player(this);
    this.vehicle=new Vehicle(this,new THREE.Vector3(0,0.8,10));
    this.traffic=new TrafficSystem(this);
    this.peds=new PedestrianSystem(this);
    this.missions=new MissionSystem(this);
    this.hud=new HUD(this);
    this.scene.add(this.player.object,this.vehicle.object);
    this.camera.position.set(0,7,12);
    this.animate();
  }

  start(){
    this.started=true;
    this.canvas.requestPointerLock?.();
  }

  update(dt){
    if(!this.started)return;
    this.world.update(dt);
    this.player.update(dt);
    this.vehicle.update(dt);
    this.traffic.update(dt);
    this.peds.update(dt);
    this.missions.update(dt);
    this.hud.update();
    const target=this.player.inVehicle?this.vehicle.object:this.player.object;
    const desired=new THREE.Vector3(0,4.6,8.5).applyQuaternion(target.quaternion).add(target.position);
    this.camera.position.lerp(desired,1-Math.pow(.001,dt));
    const look=target.position.clone(); look.y+=1.4;
    this.camera.lookAt(look);
  }

  animate(){
    requestAnimationFrame(()=>this.animate());
    const dt=Math.min(this.clock.getDelta(),.05);
    this.update(dt);
    this.renderer.render(this.scene,this.camera);
  }

  resize(){
    this.camera.aspect=innerWidth/innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(innerWidth,innerHeight);
  }
}
