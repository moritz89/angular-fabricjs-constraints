import { fabric } from 'fabric';
import { Entity } from 'complex-engine';

declare module 'fabric' {
  namespace fabric {
    interface Object {
      ecs_entity: Entity;
    }
  }
}

// fabric.Object.prototype.newMethod = function() {
//   console.log('Hello, this is newMethod() calling');
// };
