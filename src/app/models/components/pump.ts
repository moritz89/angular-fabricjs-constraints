import { fabric } from "fabric";

import { ElectricalGrid } from "../electrical-grid";
import { WaterCycle } from "../water-cycle";

export class Pump {
  canvasIcon: fabric.Rect = new fabric.Rect({
    left: 20,
    top: 50,
    strokeWidth: 5,
    width: 35,
    height: 90,
    fill: "blue"
  });

  constructor(
    private canvas: fabric.Canvas,
    private waterCycle: WaterCycle,
    private electricalGrid: ElectricalGrid,
    private electricalGrid2: ElectricalGrid,
    private electricalGrid3: ElectricalGrid
  ) {
    this.canvas.add(this.canvasIcon);
    this.waterCycle.pumps.add(this);
    this.electricalGrid.pumps.add(this);
    this.electricalGrid2.pumps.add(this);
    this.electricalGrid3.pumps.add(this);
  }

  delete() {
    this.waterCycle.pumps.delete(this);
    this.electricalGrid.pumps.delete(this);
    this.electricalGrid2.pumps.delete(this);
    this.electricalGrid3.pumps.delete(this);
    this.canvas.remove(this.canvasIcon);
  }
}
