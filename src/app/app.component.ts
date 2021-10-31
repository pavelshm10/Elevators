import { BehaviorSubject } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { DataSource } from '@angular/cdk/collections';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  dataSource: tableDataSource;
  _dataSubject = new BehaviorSubject<any[]>([])
  source: any;
  displayedColumns : string [];
  columns : [{
    columnDef: string,
    header: string,
    cell: [],
  }];
  tableData : any [] = [];
  cols : number=7;
  rows : number=10;
  floors=['9th','8th','7th','6th','5th','4th','3rd','2nd','1st','Ground']
  constructor()
  {
    this.dataSource = new tableDataSource(this._dataSubject)
  }

  ngOnInit() {
    this.generateHeaders ();
    this.generateColumns();
    this.generateData ();
  }

  generateHeaders(){
    for(let i=0;i<this.cols;i++){
      if(i===0){
        this.displayedColumns = ['floors']  
      } else if(i!=this.cols-1){
        this.displayedColumns.push (i.toString())
      } else {
        this.displayedColumns.push ('buttons')
      }
    }
  }

  generateColumns(){
    // var columns : []
    for(let i=1;i<this.cols-1;i++){
      if(i===1){
        this.columns=[{
          columnDef : i.toString(),
          header : i.toString(),
          cell : [],
        }];  
      } else{
        this.columns.push({
          columnDef : i.toString(),
          header : i.toString(),
          cell : [],
        })
      }
    }
  }

  generateData (){
    var tableRow : string [] = [];    
    for(let i=0;i<this.rows;i++){
      for(let j=0;j<this.cols-1;j++){
        if(i===this.rows-1){
          tableRow.push ('elevator'+j);
        }
      }
      this.tableData.push(tableRow);
      tableRow = [];
    }
    this._dataSubject.next(this.tableData) 
  }
}



export class tableDataSource extends DataSource<any>
{

  constructor(private _data: BehaviorSubject<any[]>)
  {
    super();
  }

  connect()
  {
    return this._data.asObservable()
  }
  
  disconnect() {}
}