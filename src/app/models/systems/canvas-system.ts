import { Entity, EntitySystem } from 'complex-engine';
import { fabric } from 'fabric';

import { CanvasComponent } from '../components/canvas-component';

export class CanvasSystem extends EntitySystem {
  constructor(private canvas: fabric.Canvas) {
    super();
    this.components = [CanvasComponent];

    this.canvas.add(new fabric.Rect({
      left: 100,
      top: 200,
      strokeWidth: 5,
      width: 50,
      height: 40,
      fill: 'red'
    }));
  }

  added(entity: Entity) {
    if (entity.hasComponent(CanvasComponent)) {
      const component = entity.getComponents(CanvasComponent);
      const canvasComponent = component[0] as CanvasComponent;
      if (!canvasComponent.addedToScene) {
        this.canvas.add(new fabric.Rect({
          left: 20,
          top: 50,
          strokeWidth: 5,
          width: canvasComponent.width,
          height: canvasComponent.height,
          fill: 'blue'
        }));
      }
    }
  }

  update(entity: Entity) {}
}
