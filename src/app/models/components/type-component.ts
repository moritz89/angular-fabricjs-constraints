import { Component } from 'complex-engine';

export enum Purpose {
  Default,
  OpenSlot,
  Movement,
  ActiveFamily
}

export const enum EntityType {
  Pump
}

export class TypeComponent extends Component {
  constructor(private _entityType: EntityType, private _purpose: Purpose = Purpose.Default) {
    super();
  }

  private _isDirty: boolean = true;

  get isDirty(): boolean {
    return this._isDirty;
  }

  /**
   * Should only be called by the canvas-system
   *
   * This call is used to update the canvas representation of the entity
   */
  clearIsDirty(): void {
    this._isDirty = false;
  }

  get entityType(): EntityType {
    return this._entityType;
  }

  set entityType(entityType: EntityType) {
    this._entityType = entityType;
    this._isDirty = true;
  }

  get purpose(): Purpose {
    return this._purpose;
  }

  set purpose(purpose: Purpose) {
    this._purpose = purpose;
    this._isDirty = true;
  }
}
