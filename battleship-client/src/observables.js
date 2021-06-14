import { fromEvent, Subject } from "rxjs";
import { concatWith, filter, take } from "rxjs/operators";
import { EMPTY } from "battleship-core";
import socket from "./socket";

const initialState$ = fromEvent(socket, "initial_state").pipe(take(1));
const stateUpdates$ = fromEvent(socket, "state_update");
export const state$ = initialState$.pipe(concatWith(stateUpdates$));

export const uiEvents$ = new Subject();
export const yourShots$ = uiEvents$.pipe(
  filter((uiEvent) => uiEvent.type === "enemy_cell_click" && uiEvent.cellValue === EMPTY)
);
