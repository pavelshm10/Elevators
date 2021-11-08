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
    distance: number,
  }]=[{
    id:1,
    status:'',
    floor:0,
    distance: 0,
  }];
  queueOfCalls:any=[]; 
  initPosition: number=0;
  
  ngOnInit() {
    this.createElevators();
    this.createFloors();
    this.createGrid();
    const setArrived=()=>{
      var element=document.getElementsByClassName('elevator') as HTMLCollectionOf<HTMLElement>
      this.initPosition=+element.item(0).offsetTop;
    }
    setTimeout(setArrived.bind(undefined), 1000);
  }

  findClosetElevator(floorCall){
    var correctFloorCall=this.rows-floorCall-1;
    var floorsDistance=this.rows;
    var nearestID=-1;
    var currentDistance=-1
    var direction='up';
    for(let elevator of this.elevators){
      if((Math.abs((correctFloorCall-elevator.floor))<floorsDistance) && (elevator.status==='stand')){ //(elevator.floor<=correctFloorCall) &&
        floorsDistance=Math.abs(correctFloorCall-elevator.floor);
        nearestID=elevator.id;
        currentDistance=elevator.distance;
        if(elevator.floor>correctFloorCall){
          direction='down';
        } else{
          direction='up';
        }
      }
    }
    if(nearestID==-1){ //if all busy add to que
        this.queueOfCalls.push({id:this.queueOfCalls.length+1,floor:correctFloorCall});
    } else{
      var element=document.getElementsByClassName('elevator') as HTMLCollectionOf<HTMLElement>
      console.log("offset ", element.item(nearestID).offsetTop);
      console.log("last distance of elevator ",currentDistance);
      element.item(nearestID).style.top=element.item(nearestID).offsetTop - currentDistance +'px';
      this.updateElevatorAndButton(correctFloorCall,floorsDistance,nearestID,currentDistance,direction);
    }
  }

  updateElevatorAndButton(callFloor,floorsDistance,elevatorID,currentDistance,direction){
    var distanceToMove=floorsDistance*80;
    this.updateElevatorStatus(elevatorID,callFloor,distanceToMove,'busy');
    this.updateButtonStatus(callFloor,floorsDistance);
    this.setTimer(floorsDistance,elevatorID);
    this.moveElevator(elevatorID,distanceToMove,floorsDistance,direction);
    
    const setStand=(callFloor,elevatorID)=>{
      this.updateElevatorStatus(elevatorID,callFloor,distanceToMove,'stand');
      if(this.queueOfCalls.length>0){ //check if there are call in que
        var queCall=this.queueOfCalls.shift();
        if(queCall.floor>callFloor){
          this.updateElevatorAndButton(queCall.floor,floorsDistance,elevatorID,currentDistance,'up');
        } else{
          this.updateElevatorAndButton(queCall.floor,floorsDistance,elevatorID,currentDistance,'down');
        }
      }
    }
    setTimeout(setStand.bind(undefined, callFloor,elevatorID),floorsDistance*1000+2000);

    const setArrived=(callFloor,elevatorID)=>{
      this.updateElevatorStatus(elevatorID,callFloor,distanceToMove,'arrived');
    }
    setTimeout(setArrived.bind(undefined, callFloor,elevatorID), floorsDistance*1000);
  } 

  moveElevator(elevatorID,distanceToMove,nearestDistance,direction){
    var elevator = document.getElementsByClassName('elevator') as HTMLCollectionOf<HTMLElement>  
    var moveMent=0;
    if(direction==='up'){
      moveMent=-distanceToMove;
    } else{
      moveMent=distanceToMove;
    }
    console.log("movement ",moveMent);
    elevator.item(elevatorID).animate([
      { transform: 'translateX(0px)' },
      { transform: 'translateY('+(moveMent)+'px)' }
    ], {
      duration: 1000*nearestDistance,
      iterations: 1,
      fill: 'forwards',
    });
  }

  setTimer(nearestDistance,elevatorID){
    var minutes = Math.floor((nearestDistance*1000 % (1000 * 60 * 60)) / (1000 * 60));
    var seconds = Math.floor((nearestDistance*1000 % (1000 * 60)) / 1000);
    var x = setInterval(function() {
      document.getElementsByClassName("timer").item(elevatorID).innerHTML = minutes + "m " + seconds + "s ";
      if(minutes>0 && seconds>0){
        seconds=seconds-1;
      } else if (minutes>0 && seconds===0){
        seconds=60;
        minutes=minutes-1;
      } else if(minutes===0 && seconds>0){
        seconds=seconds-1;
      } else if(minutes===0 && seconds===0){
        document.getElementsByClassName("timer").item(elevatorID).innerHTML ='';
        var sound = document.getElementById('beep_audio');
        sound.play(); 
        clearInterval(x);
      }
    }, 1000);
  }

  updateButtonStatus(correctFloorCall,nearestDistance){    
    //red
    var button=document.getElementsByClassName('button') as HTMLCollectionOf<HTMLElement>
    button.item(this.rows-correctFloorCall-1).style.backgroundColor="red";
    button.item(this.rows-correctFloorCall-1).innerText="await";


    //arrived
    const serArrived=(element,correctFloorCall)=>{
      element.item(this.rows-correctFloorCall-1).style.backgroundColor="inherit";
      element.item(this.rows-correctFloorCall-1).style.border="1px solid lightgreen";
      element.item(this.rows-correctFloorCall-1).style.color="lightgreen";
      element.item(this.rows-correctFloorCall-1).innerText="arrived";
    }
    setTimeout(serArrived.bind(undefined, button,correctFloorCall), nearestDistance*1000);

    //call
    const setCall=(element,correctFloorCall)=>{
      element.item(this.rows-correctFloorCall-1).style.backgroundColor="lightgreen";
      element.item(this.rows-correctFloorCall-1).style.border="2px solid rgb(118, 118, 118)";
      element.item(this.rows-correctFloorCall-1).style.color="white";
      element.item(this.rows-correctFloorCall-1).innerText="call";
    }
    setTimeout(setCall.bind(undefined, button,correctFloorCall), nearestDistance*1000+2000);   
  }

  updateElevatorStatus(elevatorID,floorCall,distance,status){
    this.elevators[elevatorID].status=status;
    this.elevators[elevatorID].floor=floorCall;
    this.elevators[elevatorID].distance=distance;
  } 

  createElevators(){
    for(let i=0;i<this.cols;i++){
      this.elevators[i]={
        id: i,
        status:'stand',
        floor:0,
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
