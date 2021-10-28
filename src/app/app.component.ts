import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'home-task';
  elevators=new Array(5);
  floors=new Array(10);
  ngOnInit() {
    console.log("check ", this.floors.length);
  }
}
