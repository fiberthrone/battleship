const { getTableOutOfArrangementsAndHits, hitVersionOfCellValue } = require("battleship-core");

function createDefaultShipArrangement() {
  return [
    { from: { i: 0, j: 0 }, to: { i: 0, j: 3 } },
    { from: { i: 2, j: 0 }, to: { i: 2, j: 2 } },
    { from: { i: 2, j: 4 }, to: { i: 2, j: 6 } },
    { from: { i: 4, j: 0 }, to: { i: 4, j: 1 } },
    { from: { i: 4, j: 3 }, to: { i: 4, j: 4 } },
    { from: { i: 4, j: 6 }, to: { i: 4, j: 7 } },
    { from: { i: 6, j: 0 }, to: { i: 6, j: 0 } },
    { from: { i: 6, j: 2 }, to: { i: 6, j: 2 } },
    { from: { i: 6, j: 4 }, to: { i: 6, j: 4 } },
    { from: { i: 6, j: 6 }, to: { i: 6, j: 6 } },
  ];
}

function enemyOf(player) {
  return player === "player1" ? "player2" : "player1";
}

function nextTurn(player) {
  return enemyOf(player);
}

module.exports.createInitialState = function createInitialState() {
  return {
    currentTurn: "player1",
    player1: {
      ships: createDefaultShipArrangement(),
      hits: [],
    },
    player2: {
      ships: createDefaultShipArrangement(),
      hits: [],
    },
  };
};

module.exports.reducer = function reducer(state, action) {
  if (action.type === "shot") {
    const { player, i, j } = action;
    if (player !== state.currentTurn) {
      return state;
    }

    const targetPlayer = enemyOf(player);

    return {
      ...state,
      currentTurn: nextTurn(state.currentTurn),
      [targetPlayer]: {
        ships: state[targetPlayer].ships,
        hits: [...state[targetPlayer].hits, { i, j }],
      },
    };
  }

  throw new Error(`Unknown action type: ${action.type}`);
};

function censorEnemyState(enemyState) {
  const { ships, hits } = enemyState;
  const enemyTable = getTableOutOfArrangementsAndHits(ships);
  const hitsWithRevealedCells = hits.map((hit) => ({
    ...hit,
    cellValue: hitVersionOfCellValue(enemyTable[hit.i][hit.j]),
  }));

  return { hits: hitsWithRevealedCells };
}

module.exports.getPOVState = function getPOVState(state, player) {
  const enemyPlayer = enemyOf(player);
  const enemy = censorEnemyState(state[enemyPlayer]);
  const you = state[player];
  const currentTurn = state.currentTurn;

  return { currentTurn, you, enemy };
};
