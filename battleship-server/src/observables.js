const { fromEvent } = require("rxjs");
const { map, filter, scan, startWith, switchAll, mergeMap, take, mergeWith, tap } = require("rxjs/operators");
const { createInitialState, reducer, getPOVState } = require("./state");
const io = require("./io");

const sockets$ = fromEvent(io, "connection").pipe(
  tap((socket) => {
    socket.setMaxListeners(20); // Default is 10, we have 11 or something
  })
);

const socketJoins$ = sockets$.pipe(
  mergeMap((socket) =>
    fromEvent(socket, "join_game").pipe(
      map((joinedPlayer) => [socket, joinedPlayer]),
      take(1)
    )
  )
);

const player1Socket$ = socketJoins$.pipe(
  filter(([, joinedPlayer]) => joinedPlayer === "player1"),
  map(([socket]) => socket)
);

const player2Socket$ = socketJoins$.pipe(
  filter(([, joinedPlayer]) => joinedPlayer === "player2"),
  map(([socket]) => socket)
);

const player1Actions = player1Socket$.pipe(
  map((socket) => fromEvent(socket, "action")),
  switchAll()
);

const player2Actions = player2Socket$.pipe(
  map((socket) => fromEvent(socket, "action")),
  switchAll()
);

const actions$ = player1Actions.pipe(mergeWith(player2Actions));

const initialState = createInitialState();
const state$ = actions$.pipe(scan(reducer, initialState), startWith(initialState));

const player1POVState$ = state$.pipe(map((state) => getPOVState(state, "player1")));
const player2POVState$ = state$.pipe(map((state) => getPOVState(state, "player2")));

module.exports = {
  sockets$,
  actions$,
  state$,
  player1Socket$,
  player2Socket$,
  player1POVState$,
  player2POVState$,
};
