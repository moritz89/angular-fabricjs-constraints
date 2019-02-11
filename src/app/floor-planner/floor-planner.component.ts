import { Component, OnInit } from '@angular/core';
import { fabric } from 'fabric';

@Component({
  selector: 'app-floor-planner',
  templateUrl: './floor-planner.component.html',
  styleUrls: ['./floor-planner.component.css']
})
export class FloorPlannerComponent implements OnInit {
  canvas: any;

  constructor() { }

  ngOnInit() {
    this.canvas = new fabric.Canvas('canvas');
    this.canvas.backgroundColor = 'gray';
    this.canvas.renderAll();
  }

}
