import { Entity, EntitySystem } from 'complex-engine';
import { fabric } from 'fabric';

import { CanvasComponent } from '../components/canvas-component';
import { TypeComponent } from '../components/type-component';
import { bound } from '../../utils/bound';

const typeToIconUrlMock: Record<string, string> = {
  pump: '/path/to/the/icon.svg'
};

export class CanvasSystem extends EntitySystem {
  constructor(private canvas: fabric.Canvas) {
    super();
    this.components = [CanvasComponent];

    this.canvas.on({
      'object:moved': this.snapObjectHandler,
      'mouse:wheel': this.zoomCanvas
    });
    this.canvas.add(
      new fabric.Rect({
        left: 100,
        top: 200,
        strokeWidth: 0,
        width: 50,
        height: 40,
        fill: 'red'
      })
    );
  }

  private gridSpacingX: number = 50;
  private gridSpacingY: number = 50;
  typeToIconUrl: Record<string, string> = typeToIconUrlMock;

  @bound
  public snapObjectHandler(options: any) {
    if (!this.isSnapped(options.target)) {
      this.snapObject(options.target);
    }
  }

  private isSnapped(object: fabric.Object): boolean {
    const boundingRect = object.getBoundingRect();
    if (boundingRect.left % this.gridSpacingY || boundingRect.top % this.gridSpacingX) {
      return false;
    } else {
      return true;
    }
  }

  private snapObject(object: fabric.Object): void {
    const topLeft = object.aCoords.tl;
    let closestX = 0;

    if (topLeft.x % this.gridSpacingX < this.gridSpacingX / 2) {
      closestX = topLeft.x - (topLeft.x % this.gridSpacingX);
    } else {
      closestX = topLeft.x + (this.gridSpacingX - (topLeft.x % this.gridSpacingX));
    }
    object.set('left', closestX);
    console.log(closestX);
  }

  @bound
  private zoomCanvas(options: any) {
    var delta = -options.e.deltaY;
    var zoom = this.canvas.getZoom();
    zoom = zoom + delta / 200;
    if (zoom > 20) zoom = 20;
    if (zoom < 0.01) zoom = 0.01;
    this.canvas.setZoom(zoom);
    options.e.preventDefault();
    options.e.stopPropagation();
  }

  added(entity: Entity) {
    // Check if an entity has an identity and a corresponding representation
    if (entity.hasComponent(TypeComponent)) {
      const typeComponent = entity.getComponents(TypeComponent)[0] as TypeComponent;
    }

    // Add an entities representation to the canvas
    if (entity.hasComponent(CanvasComponent)) {
      const canvasComponent = entity.getComponents(CanvasComponent)[0] as CanvasComponent;
      if (!canvasComponent.addedToScene) {
        this.canvas.add(
          new fabric.Rect({
            left: 20,
            top: 50,
            strokeWidth: 0,
            width: canvasComponent.width,
            height: canvasComponent.height,
            fill: 'blue'
          })
        );
      }
    }
  }

  update(entity: Entity) {}
}
