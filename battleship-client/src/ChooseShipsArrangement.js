import { getTableOutOfShipArrangement } from "battleship-core";
import { random } from "lodash";
import { useState } from "react";
import BattlefieldTable from "./BattlefieldTable";

function intersect(shipA, shipB) {
  return !(
    shipA.to.i < shipB.from.i - 1 ||
    shipB.to.i + 1 < shipA.from.i ||
    shipA.to.j < shipB.from.j - 1 ||
    shipB.to.j + 1 < shipA.from.j
  );
}

function randomShipOfLength(length) {
  const nextShipSize = Math.random() < 0.5 ? { w: length, h: 1 } : { w: 1, h: length };
  const nextShipFrom = { i: random(10 - nextShipSize.w), j: random(10 - nextShipSize.h) };
  const nextShip = {
    from: nextShipFrom,
    to: { i: nextShipFrom.i + nextShipSize.w - 1, j: nextShipFrom.j + nextShipSize.h - 1 },
  };

  return nextShip;
}

function generateRandomShipsArrangement() {
  const shipsArrangement = [4, 3, 3, 2, 2, 2, 1, 1, 1, 1].reduce((ships, nextShipLength) => {
    for (;;) {
      const nextShip = randomShipOfLength(nextShipLength);
      if (ships.some((ship) => intersect(ship, nextShip))) {
        continue;
      }

      ships.push(nextShip);
      return ships;
    }
  }, []);

  return shipsArrangement;
}

function ChooseShipsArrangement(props) {
  const [ships, setShips] = useState(generateRandomShipsArrangement());
  const table = getTableOutOfShipArrangement(ships);

  return (
    <div>
      <h2>Choose ships arrangement</h2>
      <BattlefieldTable size="m" values={table} />
      <div>
        <button
          onClick={
            props.onChoose &&
            (() => {
              props.onChoose(ships);
            })
          }
        >
          I like this one
        </button>
        <button
          onClick={() => {
            setShips(generateRandomShipsArrangement());
          }}
        >
          Show me another one
        </button>
      </div>
    </div>
  );
}

export default ChooseShipsArrangement;
