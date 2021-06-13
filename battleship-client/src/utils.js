import { EMPTY, EMPTY_HIT, SHIP, SHIP_HIT } from "./constants";

export function hit(cellValue) {
  switch (cellValue) {
    case EMPTY:
    case EMPTY_HIT:
      return EMPTY_HIT;
    case SHIP:
    case SHIP_HIT:
      return SHIP_HIT;
    default:
      throw new Error(`Unknown cell value ${cellValue}`);
  }
}

export function createEmptyTable() {
  return Array(10).fill(Array(10).fill(EMPTY));
}

export function createDefaultShipArrangement() {
  return [
    [SHIP, SHIP, SHIP, SHIP, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY],
    [EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY],
    [SHIP, SHIP, SHIP, EMPTY, SHIP, SHIP, SHIP, EMPTY, EMPTY, EMPTY],
    [EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY],
    [SHIP, SHIP, EMPTY, SHIP, SHIP, EMPTY, SHIP, SHIP, EMPTY, EMPTY],
    [EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY],
    [SHIP, EMPTY, SHIP, EMPTY, SHIP, EMPTY, SHIP, EMPTY, EMPTY, EMPTY],
    [EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY],
    [EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY],
    [EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY],
  ];
}
