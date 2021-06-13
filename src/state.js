import { slice } from "lodash";
import { createDefaultShipArrangement, createEmptyTable, hit } from "./utils";

export function createInitialState() {
  return {
    currentTurn: "you",
    you: createDefaultShipArrangement(),
    enemy: createEmptyTable(),
  };
}

export function reducer(state, action) {
  if (action.type === "enemy_reveal") {
    const { i, j, cellValue } = action;
    const revealedCellValue = hit(cellValue);

    return {
      ...state,
      enemy: [
        ...slice(state.enemy, 0, i),
        [...slice(state.enemy[i], 0, j), revealedCellValue, ...slice(state.enemy[i], j + 1)],
        ...slice(state.enemy, i + 1),
      ],
    };
  }

  if (action.type === "enemy_shot") {
    const { i, j } = action;
    const revealedCellValue = hit(state.you[i][j]);

    return {
      ...state,
      you: [
        ...slice(state.you, 0, i),
        [...slice(state.you[i], 0, j), revealedCellValue, ...slice(state.you[i], j + 1)],
        ...slice(state.you, i + 1),
      ],
    };
  }

  throw new Error(`Unknown action type: ${action.type}`);
}
