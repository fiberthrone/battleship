import { merge, Subject } from "rxjs";
import { delay, filter, map, scan, startWith } from "rxjs/operators";
import { EMPTY } from "./constants";
import { createDefaultShipArrangement } from "./utils";
import { createInitialState, reducer } from "./state";

const enemyMakeMove = (() => {
  let idx = 0;
  return () => {
    const i = Math.floor(idx / 10);
    const j = idx % 10;
    ++idx;

    return { i, j };
  };
})();

const initialState = createInitialState();
const enemyArranegement = createDefaultShipArrangement();

export const uiEventsSubject = new Subject();

export const enemyAnswersObservable = uiEventsSubject.pipe(
  filter((uiEvent) => uiEvent.type === "enemy_cell_click" && uiEvent.cellValue === EMPTY),
  map(({ i, j }) => ({ type: "enemy_reveal", cellValue: enemyArranegement[i][j], i, j }))
);

export const enemyShotsObservable = enemyAnswersObservable.pipe(
  delay(200),
  map(() => ({ type: "enemy_shot", ...enemyMakeMove() }))
);

export const actionsObservable = merge(enemyAnswersObservable, enemyShotsObservable);

export const stateObservable = actionsObservable.pipe(
  scan((state, action) => reducer(state, action), initialState),
  startWith(initialState)
);
