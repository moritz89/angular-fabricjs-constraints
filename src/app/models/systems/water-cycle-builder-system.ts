import { EntitySystem, Entity } from 'complex-engine';
import { takeUntil } from 'rxjs/operators';

import { WaterCycleComponent } from '../components/water-cycle-component';
import { SelectedComponent } from '../components/selected-component';
import { WaterCycleSimulationSystem } from './water-cycle-simulation-system';
import { TypeComponent, Purpose } from '../components/type-component';
import { EventsService } from '../events.service';

export class WaterCycleBuilderSystem extends EntitySystem {
  constructor(
    private waterCycleSimulationSystem: WaterCycleSimulationSystem,
    private eventsService: EventsService
  ) {
    super();
    this.components = [WaterCycleComponent, TypeComponent, SelectedComponent];
    this.eventsService.entitySelected$
      .pipe(takeUntil(this.eventsService.destroy$))
      .subscribe((entity: Entity) => {
        this.entitySelected(entity);
      });
    this.eventsService.entitiesUnselected$
      .pipe(takeUntil(this.eventsService.destroy$))
      .subscribe((entities: Entity[]) => {
        this.entityUnselected(entities);
      });
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
    this.eventsService.redrawEntities$.emit(
      Array.from(this.waterCycleSimulationSystem.waterCycleEntities)
    );
  }

  entityUnselected(entities: Entity[]) {
    for (let item of this.waterCycleSimulationSystem.waterCycleEntities) {
      if (!entities.includes(item)) {
        let typeComponent = item.getComponents(TypeComponent)[0] as TypeComponent;
        typeComponent.purpose = Purpose.Default;
      }
    }
    this.eventsService.redrawEntities$.emit(
      Array.from(this.waterCycleSimulationSystem.waterCycleEntities)
    );
  }

  update(entity: Entity) {}
}
