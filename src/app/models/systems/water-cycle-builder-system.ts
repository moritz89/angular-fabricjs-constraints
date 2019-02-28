import { EntitySystem, Entity } from 'complex-engine';
import { EventEmitter } from '@angular/core';

import { WaterCycleComponent } from '../components/water-cycle-component';
import { SelectedComponent } from '../components/selected-component';
import { WaterCycleSimulationSystem } from './water-cycle-simulation-system';
import { TypeComponent, Purpose } from '../components/type-component';

export class WaterCycleBuilderSystem extends EntitySystem {
  constructor(
    private waterCycleSimulationSystem: WaterCycleSimulationSystem,
    private redrawEntities: EventEmitter<Entity[]>
  ) {
    super();
    this.components = [WaterCycleComponent, TypeComponent, SelectedComponent];
  }

  removed(entity: Entity) {
    if (this.components.every(component => entity.hasComponent(component))) {
      this.entityUnselected([entity]);
    }
  }

  entitySelected(entity: Entity) {
    for (const item of this.waterCycleSimulationSystem.waterCycleEntities) {
      if (item !== entity) {
        const typeComponent = item.getComponents(TypeComponent)[0] as TypeComponent;
        typeComponent.purpose = Purpose.ActiveFamily;
      }
    }
    this.redrawEntities.emit(Array.from(this.waterCycleSimulationSystem.waterCycleEntities));
  }

  entityUnselected(entities: Entity[]) {
    for (let item of this.waterCycleSimulationSystem.waterCycleEntities) {
      if (!entities.includes(item)) {
        let typeComponent = item.getComponents(TypeComponent)[0] as TypeComponent;
        typeComponent.purpose = Purpose.Default;
      }
    }
    this.redrawEntities.emit(Array.from(this.waterCycleSimulationSystem.waterCycleEntities));
  }

  update(entity: Entity) {}
}
