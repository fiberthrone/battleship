import cx from "classnames";
import { EMPTY_HIT, SHIP, SHIP_HIT, SHIP_KILLED } from "battleship-core";
import "./BattlefieldTable.css";

function BattlefieldTable(props) {
  return (
    <div
      className={cx(
        "BattlefieldTable",
        `BattlefieldTable_size_${props.size}`,
        { BattlefieldTable_interactive_yes: props.interactive },
        props.className
      )}
    >
      {props.values.map((row, i) => (
        <div key={i} className="BattlefieldTable-Row">
          {row.map((cellValue, j) => (
            <div
              key={j}
              className={cx(
                "BattlefieldTable-Cell",
                {
                  "BattlefieldTable-Cell_ship":
                    cellValue === SHIP || cellValue === SHIP_HIT || cellValue === SHIP_KILLED,
                },
                {
                  "BattlefieldTable-Cell_hit": cellValue === EMPTY_HIT || cellValue === SHIP_HIT,
                },
                { "BattlefieldTable-Cell_killed": cellValue === SHIP_KILLED }
              )}
              onClick={
                props.onCellClick &&
                (() => {
                  props.onCellClick(i, j);
                })
              }
            />
          ))}
        </div>
      ))}
    </div>
  );
}

export default BattlefieldTable;
