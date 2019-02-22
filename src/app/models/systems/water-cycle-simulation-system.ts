import { EntitySystem, Entity } from 'complex-engine';
import { WaterCycleComponent } from '../components/water-cycle-component';

export class WaterCycleSimulationSystem extends EntitySystem {
  constructor() {
    super();
    this.components = [WaterCycleComponent];
  }

  public waterCycleEntities = new Set<Entity>();

  added(entity: Entity) {
    this.waterCycleEntities.add(entity);
  }

  removed(entity: Entity) {
    this.waterCycleEntities.delete(entity);
  }

  update(entity: Entity) {}
}
