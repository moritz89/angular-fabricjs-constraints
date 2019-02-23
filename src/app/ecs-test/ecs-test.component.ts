import { fabric } from 'fabric';
import { Component, OnInit } from '@angular/core';
import { Scene, Entity, Complex, Manager, EntitySystem } from 'complex-engine';

import { CanvasComponent } from '../models/components/canvas-component';
import { WaterCycleComponent } from '../models/components/water-cycle-component';
import { CanvasSystem } from '../models/systems/canvas-system';
import { WaterCycleSimulationSystem } from '../models/systems/water-cycle-simulation-system';
import { WaterCycleBuilderSystem } from '../models/systems/water-cycle-builder-system';
import { TypeComponent, EntityType } from '../models/components/type-component';

class MyScene extends Scene {
  public canvas: fabric.Canvas;

  constructor(private uiInterface: UiInterface) {
    super('MainScene');
  }

  static createPump(): Entity {
    const pump = new Entity('Pump');
    pump.addComponent(new CanvasComponent(20, 30));
    pump.addComponent(new TypeComponent(EntityType.Pump));
    pump.addComponent(new WaterCycleComponent(-1, 100, [], [], true));

    return pump;
  }

  load() {
    this.canvas = new fabric.Canvas('canvas');
    this.canvas.backgroundColor = 'white';
    this.canvas.renderAll();

    this.world.addManager(this.uiInterface);
    this.world.addSystem(new CanvasSystem(this.canvas));
    const waterCycleSimulationSystem = new WaterCycleSimulationSystem();
    this.world.addSystem(waterCycleSimulationSystem);
    this.world.addSystem(new WaterCycleBuilderSystem(waterCycleSimulationSystem));
    this.world.addEntity(MyScene.createPump());
  }
}

class UiInterface extends Manager {
  constructor() {
    super();
  }

  public createPump(): void {
    this.getWorld().addEntity(MyScene.createPump());
  }

  public deleteActiveObject(): void {
    const canvasSystem = this.getWorld().getSystem(CanvasSystem) as CanvasSystem;
    canvasSystem.removeActiveObject();
  }
}

@Component({
  selector: 'app-ecs-test',
  templateUrl: './ecs-test.component.html',
  styleUrls: ['./ecs-test.component.css']
})
export class EcsTestComponent implements OnInit {
  private uiInterface: UiInterface = new UiInterface();
  private myScene: MyScene = new MyScene(this.uiInterface);
  private complex: Complex;

  constructor() {}

  ngOnInit() {
    this.complex = Complex.getInstance();
    this.complex.loadScene(this.myScene);
  }

  create() {
    this.uiInterface.createPump();
  }

  delete() {
    this.uiInterface.deleteActiveObject();
  }
}
