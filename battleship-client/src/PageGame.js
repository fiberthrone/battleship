import io from "socket.io-client";
import { fromEvent } from "rxjs";
import { concatWith, take } from "rxjs/operators";
import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { getTableOutOfArrangementsAndHits, getTableOutOfCellReveals, SHIP_HIT, SHIP_KILLED } from "battleship-core";
import BattlefieldTable from "./BattlefieldTable";
import ChooseShipsArrangement from "./ChooseShipsArrangement";

const WIN_THRESHOLD = 4 + 3 + 3 + 2 + 2 + 2 + 1 + 1 + 1;

function getYourTable(yourState) {
  return getTableOutOfArrangementsAndHits(yourState.ships, yourState.hits);
}

function getEnemyTable(enemyState) {
  return getTableOutOfCellReveals(enemyState.hits);
}

function getWinner(state) {
  if (state.enemy.hits.filter((hit) => hit.cellValue === SHIP_KILLED).length >= WIN_THRESHOLD) {
    return "you";
  }

  const yourTable = getYourTable(state.you);
  if (state.you.hits.filter((hit) => yourTable[hit.i][hit.j] === SHIP_KILLED).length >= WIN_THRESHOLD) {
    return "enemy";
  }

  return null;
}

function areYouReady(state) {
  return state.you.ships !== null;
}

function isEnemyReady(state) {
  return state.enemy.ships !== null;
}

function PageGame() {
  const { player } = useParams();
  const socketRef = useRef(io.connect("http://localhost:4000"));
  const [state, setState] = useState(null);

  const handleEnemyCellClick = (i, j) => {
    socketRef.current.emit("action", { type: "shot", i, j, player });
  };

  const handleShipsArrangementChoose = (shipsArrangement) => {
    socketRef.current.emit("action", { type: "set_ships_arrangement", player, shipsArrangement });
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

  if (!areYouReady(state)) {
    return <ChooseShipsArrangement onChoose={handleShipsArrangementChoose} />;
  }

  if (!isEnemyReady(state)) {
    return <div>Waiting for your opponent...</div>;
  }

  const winner = getWinner(state);
  if (winner) {
    return (
      <div>
        <strong>{winner === "you" ? "You won!" : "You lost 😔"}</strong>
      </div>
    );
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
        <BattlefieldTable
          size="m"
          values={enemyTable}
          interactive={state.currentTurn === player}
          onCellClick={handleEnemyCellClick}
        />
      </section>
    </div>
  );
}

export default PageGame;
