import { Entity, EntitySystem } from 'complex-engine';
import { fabric } from 'fabric';

import { bound } from '../../utils/bound';
import { CanvasComponent } from '../components/canvas-component';
import { SelectedComponent } from '../components/selected-component';
import { EntityType, Purpose, TypeComponent } from '../components/type-component';
import { WaterCycleBuilderSystem } from './water-cycle-builder-system';
import '../../utils/fabric-ecs';


const typeToIconUrlMock: Record<string, string> = {
  pump: '/path/to/the/icon.svg'
};
const highlightPostfix = '-lighter';

export class CanvasSystem extends EntitySystem {
  constructor(private canvas: fabric.Canvas) {
    super();
    this.components = [CanvasComponent];

    this.canvas.on({
      'object:moved': this.snapObjectHandler,
      'mouse:wheel': this.zoomCanvas,
      'selection:created': this.selectionCreatedHandler
    });
  }

  private gridSpacingX = 50;
  private gridSpacingY = 50;
  private typeToIconUrl: Record<string, string> = typeToIconUrlMock;

  @bound
  private snapObjectHandler(options: any) {
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
    let closestY = 0;

    if (topLeft.x % this.gridSpacingX < this.gridSpacingX / 2) {
      closestX = topLeft.x - (topLeft.x % this.gridSpacingX);
    } else {
      closestX = topLeft.x + (this.gridSpacingX - (topLeft.x % this.gridSpacingX));
    }
    object.set('left', closestX);

    if (topLeft.y % this.gridSpacingY < this.gridSpacingY / 2) {
      closestY = topLeft.y - (topLeft.y % this.gridSpacingY);
    } else {
      closestY = topLeft.y + (this.gridSpacingY - (topLeft.y % this.gridSpacingY));
    }
    object.set('top', closestY);
    object.setCoords();
  }

  @bound
  private zoomCanvas(options: any) {
    const delta = -options.e.deltaY;
    let zoom = this.canvas.getZoom();
    zoom = zoom + delta / 200;
    if (zoom > 20) {
      zoom = 20;
    }
    if (zoom < 0.01) {
      zoom = 0.01;
    }
    this.canvas.setZoom(zoom);
    options.e.preventDefault();
    options.e.stopPropagation();
  }

  public removeActiveObject(): void {
    const object = this.canvas.getActiveObject();
    if (object) {
      this.canvas.remove(object);
    }
  }

  @bound
  private selectionCreatedHandler(option: any) {
    if (option.target.hasOwnProperty('_objects')) {
      console.log(option.target);
      option.target._objects.forEach(element => {
        console.log(element);
      });
    } else if (option.hasOwnProperty('target')) {
      console.log(option.target);
      const entity = option.target.ecs_entity as Entity;
      entity.addComponent(SelectedComponent);
      const waterCycleBuilderSystem = this.world.getSystem(
        WaterCycleBuilderSystem
      ) as WaterCycleBuilderSystem;
      waterCycleBuilderSystem.entitySelected(entity);
    }
  }

  private addPostfix(url: string, postfix: string): string {
    const i = url.lastIndexOf('.');
    return [url.slice(0, i), postfix, url.slice(i)].join('');
  }

  private getIconUrl(entityType: EntityType, purpose: Purpose = Purpose.Default): string {
    if (purpose === Purpose.Default) {
      return this.typeToIconUrl[entityType];
    } else {
      const url = this.typeToIconUrl[entityType];
      return this.addPostfix(url, highlightPostfix);
    }
  }

  added(entity: Entity) {
    // Check if an entity has an identity and a corresponding representation
    if (entity.hasComponent(TypeComponent)) {
      const typeComponent = entity.getComponents(TypeComponent)[0] as TypeComponent;
    }

    // Add an entities representation to the canvas
    if (entity.hasComponent(CanvasComponent)) {
      const canvasComponent = entity.getComponents(CanvasComponent)[0] as CanvasComponent;
      if (!canvasComponent.object) {
        const rect = new fabric.Rect({
          left: 50,
          top: 50,
          strokeWidth: 0,
          width: canvasComponent.width,
          height: canvasComponent.height,
          fill: 'blue'
        });
        canvasComponent.object = rect;
        rect.ecs_entity = entity;
        this.canvas.add(canvasComponent.object);
      }
    }
  }

  update(entity: Entity) {
    const typeComponent = entity.getComponents(TypeComponent)[0] as TypeComponent;
    if (typeComponent.isDirty) {
      const canvasComponent = entity.getComponents(CanvasComponent)[0] as CanvasComponent;
      const [left, top] = [canvasComponent.object.left, canvasComponent.object.top];
      canvasComponent.object.set({ left: 0, top: 0 });
      canvasComponent.object.setCoords();
      const group = new fabric.Group(
        [
          canvasComponent.object,
          new fabric.Rect({
            width: canvasComponent.object.width,
            height: canvasComponent.object.height,
            strokeWidth: 0,
            fill: 'white'
          })
        ],
        { left, top }
      );
      group.item(1).set('opacity', 0.5);
      this.canvas.add(group);
      this.canvas.remove(canvasComponent.object);
      canvasComponent.object = group;

      typeComponent.clearIsDirty();
    }
  }
}
