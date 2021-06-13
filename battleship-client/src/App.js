import { useSubscriber } from "./UIEventsContext";
import BattlefieldTable from "./BattlefieldTable";

function App(props) {
  const subscriber = useSubscriber();
  const handleEnemyCellClick = (cellValue, i, j) => {
    subscriber.next({ type: "enemy_cell_click", cellValue, i, j });
  };

  return (
    <div className="App">
      <section>
        <h2>Your ships</h2>
        <BattlefieldTable size="s" values={props.you} />
      </section>
      <section>
        <h2>Enemy ships</h2>
        <BattlefieldTable size="m" values={props.enemy} interactive onCellClick={handleEnemyCellClick} />
      </section>
    </div>
  );
}

export default App;
