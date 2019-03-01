import { Injectable } from '@angular/core';
import { Output, EventEmitter } from '@angular/core';
import { Entity } from 'complex-engine';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EventsService {
  @Output() entitySelected$: EventEmitter<Entity> = new EventEmitter();
  @Output() entitiesUnselected$: EventEmitter<Entity[]> = new EventEmitter();
  @Output() redrawEntities$: EventEmitter<Entity[]> = new EventEmitter();

  destroy$ = new Subject();

  constructor() {}
}
