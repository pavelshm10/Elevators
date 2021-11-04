import { Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  floors=[];
  cols=5;
  rows=10;
  elevators:[{
    id:number,
    status: string,
    floor:number,
    direction:number,
    distance: number,
  }]=[{
    id:1,
    status:'',
    floor:0,
    direction:0,
    distance: 0,
  }];
  queueOfCalls:any=[]; 

  ngOnInit() {
    this.createElevators();
    this.createFloors();
    this.createGrid();
    // this.setElevatorToCall();
  }

  setElevatorToCall(){
    for(let call of this.queueOfCalls) {
      this.initElevatorsLocation();
      this.findClosetElevator(call);
    }
  }

  initElevatorsLocation(){
    for(let elevator of this.elevators){
      var element=document.getElementsByClassName('elevator') as HTMLCollectionOf<HTMLElement>
      element.item(elevator.id).style.top=element.item(elevator.id).offsetTop-elevator.distance+'px';
    }
  }

  findClosetElevator(call){
    var nearestDistance=this.rows;
    var nearestID=-1;
    var nearestFloor=-1;
    for(let elevator of this.elevators){
      if((call.floor-elevator.floor<nearestDistance) && (elevator.floor<=call.floor)){  
        nearestDistance=call.floor-elevator.floor;
        nearestFloor=elevator.floor;
        nearestID=elevator.id;
      }
    }
    this.sendElevatorToCall(call.floor,nearestDistance,nearestID);
    this.queueOfCalls=this.queueOfCalls.filter(({id}) => id !== call.id);
  }

  sendElevatorToCall(callFloor,nearestDistance,elevatorID){
    // console.log(this.elevators.find((elevator)=>elevator.id===elevatorID));
    var distance=nearestDistance*80;
    document.getElementsByClassName('elevator').item(elevatorID).animate([
      { transform: 'translateX(0px)' },
      { transform: 'translateY('+(-distance)+'px)' }
    ], {
      duration: 1000,
      iterations: 1,
      fill: 'forwards'
    });
    this.updateElevatorStatus(elevatorID,callFloor,distance,'busy',1);
  } 

  updateElevatorStatus(elevatorID,floorCall,distance,status,direction){
    this.elevators[elevatorID].status=status;
    this.elevators[elevatorID].floor=floorCall;
    this.elevators[elevatorID].direction=direction;
    this.elevators[elevatorID].distance=distance;
  }

  insertCall(floorCall){ 
    var correctFloorCall=this.rows-floorCall-1;
    if(this.queueOfCalls){
      this.queueOfCalls.push({id:this.queueOfCalls.length+1,floor:correctFloorCall});
    } else {
      this.queueOfCalls=[{id:1,floor:correctFloorCall}];
    }
    this.setElevatorToCall();
  }


  createElevators(){
    for(let i=0;i<this.cols;i++){
      this.elevators[i]={
        id: i,
        status:'stand',
        floor:0,
        direction:0,
        distance: 0,
      }
    }
  }

  createFloors(){
    for(let i=this.rows-1;i>=0;i--){
      switch(i) { 
        case 0: { 
           this.floors.push('Ground Floor'); 
           break; 
        } 
        case 1: { 
          this.floors.push(i+'st'); 
           break; 
        }
        case 2: { 
          this.floors.push(i+'nd'); 
           break; 
        }  
        case 3: { 
          this.floors.push(i+'rd'); 
           break; 
        } 
        default: { 
          this.floors.push(i+'th'); 
          break; 
        } 
     } 
    }
  }

  createGrid(){
    const calc=this.rows*80;
    setTimeout(function(){ 
      var element=document.getElementsByClassName('building') as HTMLCollectionOf<HTMLElement>
      element.item(0).style.height=calc+'px';
      var list=document.getElementsByClassName('elevator') as HTMLCollectionOf<HTMLElement>;
      for(var i = 0; i < list.length; i++){
        list[i].style.top=(calc-50)+'px';
      }
    }, 1);
  }
}
