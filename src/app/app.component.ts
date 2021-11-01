import { Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  floors=['9th','8th','7th','6th','5th','4th','3rd','2nd','1st','Ground'];
  cols=5;
  rows=10;
  elevators:[{
    id:number,
    status: string,
  }]=[{
    id:1,
    status:'',
  }];
  ngOnInit() {
    this.createElevators();
  }

  createElevators(){
    for(let i=0;i<this.cols;i++){
        this.elevators[i]={
          id: i,
          status:'call'
        }
    }
  }

  callElevator(ind){
    console.log(ind);
  }
}
