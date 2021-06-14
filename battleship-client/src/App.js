import { getTableOutOfArrangementsAndHits, getTableOutOfCellReveals } from "battleship-core";
import { useSubscriber } from "./UIEventsContext";
import BattlefieldTable from "./BattlefieldTable";

function getYourTable(yourState) {
  return getTableOutOfArrangementsAndHits(yourState.ships, yourState.hits);
}

function getEnemyTable(enemyState) {
  return getTableOutOfCellReveals(enemyState.hits);
}

function App(props) {
  const subscriber = useSubscriber();
  const handleEnemyCellClick = (cellValue, i, j) => {
    subscriber.next({ type: "enemy_cell_click", cellValue, i, j });
  };

  const yourTable = getYourTable(props.you);
  const enemyTable = getEnemyTable(props.enemy);

  return (
    <div className="App">
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

export default App;
