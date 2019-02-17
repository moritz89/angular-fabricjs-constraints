import { Component } from 'complex-engine';

export class WaterCycleComponent extends Component {
  constructor(
    public cycleId: number,
    public heightIncrease: number,
    public previousItems: [],
    public followingItems: [],
    public isOpen: boolean
  ) {
    super();
  }
}
