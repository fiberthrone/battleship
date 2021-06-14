const { fromEvent } = require("rxjs");
const { map, filter, scan, startWith, switchAll, mergeWith } = require("rxjs/operators");
const { createInitialState, reducer, getPOVState } = require("./state");
const io = require("./io");

const socket$ = fromEvent(io, "connection");
const remoteActions$ = socket$.pipe(
  map((socket) => fromEvent(socket, "action")),
  switchAll()
);

const remoteShots$ = remoteActions$.pipe(
  filter((action) => action.type === "shot"),
  map((action) => ({ ...action, targetPlayer: "player2" }))
);

const aiShots$ = remoteShots$.pipe(
  map((playerShot) => ({ type: "shot", targetPlayer: "player1", i: playerShot.j, j: playerShot.i }))
);

const initialState = createInitialState();
const actions$ = remoteShots$.pipe(mergeWith(aiShots$));
const state$ = actions$.pipe(scan(reducer, initialState), startWith(initialState));

const player1POVState$ = state$.pipe(map((state) => getPOVState(state, "player1")));

module.exports = {
  socket$,
  actions$,
  state$,
  player1POVState$,
};
