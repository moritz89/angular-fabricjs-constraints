import { Component, OnInit } from "@angular/core";
import { fabric } from "fabric";

import { Pump } from "../models/components/pump";
import { WaterCycle } from "../models/water-cycle";
import { ElectricalGrid } from "../models/electrical-grid";

@Component({
  selector: "app-floor-planner",
  templateUrl: "./floor-planner.component.html",
  styleUrls: ["./floor-planner.component.css"]
})
export class FloorPlannerComponent implements OnInit {
  canvas: fabric.Canvas;
  waterCycle: WaterCycle = new WaterCycle();
  electricalGrid: ElectricalGrid = new ElectricalGrid();
  electricalGrid2: ElectricalGrid = new ElectricalGrid();
  electricalGrid3: ElectricalGrid = new ElectricalGrid();

  constructor() {}

  ngOnInit() {
    this.canvas = new fabric.Canvas("canvas");
    this.canvas.backgroundColor = "gray";
    this.canvas.renderAll();
  }

  create() {
    for (let i = 0; i < 10000; i++) {
      new Pump(
        this.canvas,
        this.waterCycle,
        this.electricalGrid,
        this.electricalGrid2,
        this.electricalGrid3
      );
    }
  }

  delete() {
    for (let pump of this.waterCycle.pumps) {
      pump.delete();
    }
  }
}
