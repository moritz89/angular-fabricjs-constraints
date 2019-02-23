import { EntitySystem, Entity } from 'complex-engine';
import { WaterCycleComponent } from '../components/water-cycle-component';
import { SelectedComponent } from '../components/selected-component';
import { WaterCycleSimulationSystem } from './water-cycle-simulation-system';
import { CanvasSystem } from './canvas-system';
import { TypeComponent, Purpose } from '../components/type-component';

export class WaterCycleBuilderSystem extends EntitySystem {
  constructor(private waterCycleSimulationSystem: WaterCycleSimulationSystem) {
    super();
    this.components = [WaterCycleComponent, TypeComponent, SelectedComponent];
  }

  removed(entity: Entity) {
    if (this.components.every(component => entity.hasComponent(component))) {
      this.entityUnselected(entity);
    }
  }

  entitySelected(entity: Entity) {
    for (const item of this.waterCycleSimulationSystem.waterCycleEntities) {
      if (item !== entity) {
        console.log('updating purpose to activeFamily');
        const typeComponent = item.getComponents(TypeComponent)[0] as TypeComponent;
        typeComponent.purpose = Purpose.ActiveFamily;
      }
    }

    const canvasSystem = this.world.getSystem(CanvasSystem) as CanvasSystem;
    canvasSystem.processEntities(Array.from(this.waterCycleSimulationSystem.waterCycleEntities));
  }

  entityUnselected(entity: Entity) {
    for (const item of this.waterCycleSimulationSystem.waterCycleEntities) {
      if (item !== entity) {
        console.log('updating purpose to default');

        const typeComponent = item.getComponents(TypeComponent)[0] as TypeComponent;
        typeComponent.purpose = Purpose.Default;
      }
    }

    const canvasSystem = this.world.getSystem(CanvasSystem) as CanvasSystem;
    canvasSystem.processEntities(Array.from(this.waterCycleSimulationSystem.waterCycleEntities));
  }

  update(entity: Entity) {}
}
