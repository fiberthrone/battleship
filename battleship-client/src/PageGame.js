import io from "socket.io-client";
import { fromEvent } from "rxjs";
import { concatWith, take } from "rxjs/operators";
import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { getTableOutOfArrangementsAndHits, getTableOutOfCellReveals } from "battleship-core";
import BattlefieldTable from "./BattlefieldTable";

function getYourTable(yourState) {
  return getTableOutOfArrangementsAndHits(yourState.ships, yourState.hits);
}

function getEnemyTable(enemyState) {
  return getTableOutOfCellReveals(enemyState.hits);
}

function PageGame() {
  const { player } = useParams();
  const socketRef = useRef(io.connect("http://localhost:4000"));
  const [state, setState] = useState(null);

  const handleEnemyCellClick = (i, j) => {
    socketRef.current.emit("action", { type: "shot", i, j, player });
  };

  useEffect(() => {
    const socket = socketRef.current;
    const initialState$ = fromEvent(socket, "initial_state").pipe(take(1));
    const stateUpdates$ = fromEvent(socket, "state_update");
    const state$ = initialState$.pipe(concatWith(stateUpdates$));

    const stateSubscription = state$.subscribe((nextState) => {
      setState(nextState);
    });

    socket.emit("join_game", player);

    return () => {
      stateSubscription.unsubscribe();
      socket.disconnect(true);
    };
  }, []);

  if (state === null) {
    return <div>Loading...</div>;
  }

  const yourTable = getYourTable(state.you);
  const enemyTable = getEnemyTable(state.enemy);

  return (
    <div>
      <section>
        <h2>Your ships</h2>
        <BattlefieldTable size="s" values={yourTable} />
      </section>
      <section>
        <h2>Enemy ships</h2>
        <BattlefieldTable size="m" values={enemyTable} interactive onCellClick={handleEnemyCellClick} />
      </section>
    </div>
  );
}

export default PageGame;
