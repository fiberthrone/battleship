const { withLatestFrom } = require("rxjs/operators");
const app = require("./app");
const server = require("./server");
const { socket$, player1POVState$ } = require("./observables");

const port = 4000;

app.get("/", (req, res) => {
  res.send("Hello World!");
});

socket$.pipe(withLatestFrom(player1POVState$)).subscribe(([socket, state]) => {
  socket.emit("initial_state", state);
});

player1POVState$.pipe(withLatestFrom(socket$)).subscribe(([povState, socket]) => {
  socket.emit("state_update", povState);
});

server.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
