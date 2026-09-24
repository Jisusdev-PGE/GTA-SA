import * as THREE from "three";

const AREAS=[
  ["Grove Street", -95,-75],["Ganton",-35,-70],["Idlewood",35,-65],
  ["Willowfield",95,-45],["East Los Santos",95,35],["Downtown Los Santos",0,95]
];

export class World{
  constructor(scene){
    this.scene=scene; this.colliders=[]; this.time=8;
    this.build();
  }
  mat(color){return new THREE.MeshStandardMaterial({color,roughness:.85,metalness:.02});}
  box(x,y,z,sx,sy,sz,color){
    const m=new THREE.Mesh(new THREE.BoxGeometry(sx,sy,sz),this.mat(color));
    m.position.set(x,y,z);m.castShadow=true;m.receiveShadow=true;this.scene.add(m);return m;
  }
  build(){
    const sun=new THREE.DirectionalLight(0xffffff,2.2);sun.position.set(-100,180,80);sun.castShadow=true;sun.shadow.mapSize.set(2048,2048);this.scene.add(sun);
    this.sun=sun;
    this.scene.add(new THREE.HemisphereLight(0x9dc8ff,0x40502e,1.5));
    const ground=this.box(0,-1,0,500,2,500,0x3d633a);
    const roadMat=0x27292d;
    for(let x=-180;x<=180;x+=40)this.box(x,.02,0,12,.1,390,roadMat);
    for(let z=-180;z<=180;z+=40)this.box(0,.03,z,390,.1,12,roadMat);
    for(const x of [-160,-120,-80,-40,0,40,80,120,160]){
      for(const z of [-160,-120,-80,-40,0,40,80,120,160]){
        const h=8+((Math.abs(x*13+z*7)%26));
        const w=22+((Math.abs(x+z)%7));
        const b=this.box(x+(x%20)*.12,h/2,z+(z%17)*.12,w,h,22,0x77766f);
        this.colliders.push({minX:b.position.x-w/2,maxX:b.position.x+w/2,minZ:b.position.z-11,maxZ:b.position.z+11});
      }
    }
    for(const [name,x,z] of AREAS)this.label(name,x,z);
    this.makeStreetLights();
  }
  label(text,x,z){
    const c=document.createElement("canvas");c.width=512;c.height=64;
    const g=c.getContext("2d");g.fillStyle="#ffffff";g.font="bold 34px Arial";g.textAlign="center";g.fillText(text,256,42);
    const tex=new THREE.CanvasTexture(c);const sp=new THREE.Sprite(new THREE.SpriteMaterial({map:tex,transparent:true,depthTest:false}));
    sp.position.set(x,18,z);sp.scale.set(34,4.2,1);this.scene.add(sp);
  }
  makeStreetLights(){
    const mat=this.mat(0x242424);
    for(let x=-160;x<=160;x+=40)for(let z=-160;z<=160;z+=40){
      const p=new THREE.Mesh(new THREE.CylinderGeometry(.12,.16,5,8),mat);p.position.set(x+7,2.5,z+7);p.castShadow=true;this.scene.add(p);
      const l=new THREE.PointLight(0xffd38a,.5,18);l.position.set(x+7,5,z+7);this.scene.add(l);
    }
  }
  update(dt){
    this.time=(this.time+dt*.08)%24;
    const daylight=Math.max(.08,Math.sin((this.time-6)/12*Math.PI));
    this.sun.intensity=.5+daylight*2.2;
    this.scene.background.setHSL(.58,.48,.22+daylight*.28);
  }
  blocked(pos,r=1){
    for(const c of this.colliders)if(pos.x>c.minX-r&&pos.x<c.maxX+r&&pos.z>c.minZ-r&&pos.z<c.maxZ+r)return true;
    return false;
  }
}
