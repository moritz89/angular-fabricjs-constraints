import { Entity, EntitySystem } from 'complex-engine';
import { fabric } from 'fabric';
import { Output, EventEmitter } from '@angular/core';

import { bound } from '../../utils/bound';
import { CanvasComponent } from '../components/canvas-component';
import { Purpose, TypeComponent } from '../components/type-component';
import '../../utils/fabric-ecs';

export class CanvasSystem extends EntitySystem {
  constructor(private canvas: fabric.Canvas) {
    super();
    this.components = [CanvasComponent];

    this.canvas.on({
      'object:moved': this.snapObjectHandler,
      'mouse:wheel': this.zoomCanvas,
      'selection:created': this.selectionCreatedHandler,
      'selection:cleared': this.selectionClearedHandler
    });

    this.redrawEntities.subscribe((entities: Entity[]) =>
      entities.forEach(entity => this.update(entity))
    );
  }

  private gridSpacingX: number = 50;
  private gridSpacingY: number = 50;

  @Output() entitySelected: EventEmitter<Entity> = new EventEmitter();
  @Output() entitiesUnselected: EventEmitter<Entity[]> = new EventEmitter();
  @Output() redrawEntities: EventEmitter<Entity[]> = new EventEmitter();

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
    let object = this.canvas.getActiveObject();
    if (object.ecs_entity) {
      this.removed(object.ecs_entity);
    }
  }

  @bound
  private selectionCreatedHandler(option: any) {
    if (option.target.hasOwnProperty('_objects')) {
      // console.log(option.target);
      option.target._objects.forEach(element => {
        // console.log(element);
      });
    } else if (option.hasOwnProperty('target')) {
      let entity = option.target.ecs_entity as Entity;
      this.entitySelected.emit(entity);
    }
  }

  @bound
  private selectionClearedHandler(option: any) {
    let deselected = [] as fabric.Object[];
    if (option.hasOwnProperty('deselected')) {
      deselected = option.deselected;
    } else if (option.hasOwnProperty('target')) {
      deselected = [option.target];
    } else {
      console.log('Unknown option for selectionClearedHandler', option);
      return;
    }

    const entities = [] as Entity[];
    for (let object of deselected) {
      entities.push(object.ecs_entity);
    }
    this.entitiesUnselected.emit(entities);
  }

  added(entity: Entity) {
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

  removed(entity: Entity) {
    if (entity.hasComponent(CanvasComponent)) {
      entity
        .getComponents(CanvasComponent)
        .forEach((canvasComponent: CanvasComponent) => this.canvas.remove(canvasComponent.object));
    }
  }

  update(entity: Entity) {
    let typeComponent = entity.getComponents(TypeComponent)[0] as TypeComponent;
    let canvasComponent = entity.getComponents(CanvasComponent)[0] as CanvasComponent;

    if (typeComponent.isDirty) {
      if (typeComponent.purpose !== Purpose.Default) {
        canvasComponent.object.set('opacity', 0.5);
      } else {
        canvasComponent.object.set('opacity', 1);
      }
      typeComponent.clearIsDirty();
    }
  }
}
