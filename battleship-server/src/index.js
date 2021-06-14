const { withLatestFrom } = require("rxjs/operators");
const app = require("./app");
const server = require("./server");
const { player1Socket$, player1POVState$, player2Socket$, player2POVState$ } = require("./observables");

const port = 4000;

app.get("/", (req, res) => {
  res.send("Hello World!");
});

player1Socket$.pipe(withLatestFrom(player1POVState$)).subscribe(([socket, state]) => {
  socket.emit("initial_state", state);
});

player2Socket$.pipe(withLatestFrom(player2POVState$)).subscribe(([socket, state]) => {
  socket.emit("initial_state", state);
});

player1POVState$.pipe(withLatestFrom(player1Socket$)).subscribe(([povState, socket]) => {
  socket.emit("state_update", povState);
});

player2POVState$.pipe(withLatestFrom(player2Socket$)).subscribe(([povState, socket]) => {
  socket.emit("state_update", povState);
});

server.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
