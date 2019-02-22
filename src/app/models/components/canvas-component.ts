import { Component, Entity } from 'complex-engine';
import { fabric } from 'fabric';

export class CanvasComponent extends Component {
  public x: number = 0;
  public y: number = 0;
  public object: fabric.Object;

  constructor(public width: number, public height: number) {
    super();
  }
}
