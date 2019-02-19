import { fabric } from 'fabric';
import { Component, OnInit } from '@angular/core';
import { Scene, Entity, Complex, Manager } from 'complex-engine';

import { CanvasComponent, CanvasPurpose } from '../models/components/canvas-component';
import { WaterCycleComponent } from '../models/components/water-cycle-component';
import { CanvasSystem } from '../models/systems/canvas-system';

class UiInterface extends Manager {
  constructor() {
    super();
  }

  createPump(): void {
    this.getWorld().addEntity(MyScene.createPump());
  }
}

class MyScene extends Scene {
  public canvas: fabric.Canvas;

  constructor(private uiInterface: UiInterface) {
    super('MainScene');
  }

  load() {
    this.canvas = new fabric.Canvas('canvas');
    this.canvas.backgroundColor = 'white';
    this.canvas.renderAll();

    this.world.addManager(this.uiInterface);
    this.world.addSystem(new CanvasSystem(this.canvas));
    this.world.addEntity(MyScene.createPump());
  }

  static createPump(): Entity {
    let pump = new Entity('Pump');
    pump.addComponent(new CanvasComponent(20, 30, CanvasPurpose.Icon));
    pump.addComponent(new WaterCycleComponent(-1, 100, [], [], true));

    return pump;
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
}
