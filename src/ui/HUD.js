export class HUD{
  constructor(game){this.game=game;this.health=100;this.last=0;}
  update(){
    const g=this.game, p=g.player, v=g.vehicle;
    const target=p.inVehicle?v:p;
    document.querySelector("#health").textContent=this.health;
    document.querySelector("#money").textContent="$"+g.missions.money;
    document.querySelector("#speed").textContent=Math.round(Math.abs(v.velocity)*3.6)+" KM/H";
    document.querySelector("#wanted").textContent="★".repeat(g.missions.wanted)+"☆".repeat(5-g.missions.wanted);
    const names=["Drive to Grove Street.","Reach Idlewood.","Head downtown.","Reach East Los Santos."];
    document.querySelector("#mission").textContent="MISSION: "+names[g.missions.stage];
    const d=g.missions.points[g.missions.stage].clone().sub(target.position);
    const scale=.45;
    const dot=document.querySelector("#missionDot");
    dot.style.left=(70+Math.max(-55,Math.min(55,d.x*scale)))+"px";
    dot.style.top=(70+Math.max(-55,Math.min(55,d.z*scale)))+"px";
  }
}
