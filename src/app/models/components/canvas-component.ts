import { Component } from 'complex-engine';

export const enum CanvasPurpose {
  Icon,
  Slot,
  Movement
}

export class CanvasComponent extends Component {
  public x: number = 0;
  public y: number = 0;
  public addedToScene: boolean = false;
  public svgUrl: string;

  constructor(
    public width: number,
    public height: number,
    public purpose: CanvasPurpose
  ) {
    super();
  }
}
