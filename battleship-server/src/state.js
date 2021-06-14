const { getTableOutOfArrangementsAndHits, EMPTY_HIT, SHIP_HIT, SHIP_KILLED } = require("battleship-core");

function isHitOrKilled(cellValue) {
  return cellValue === EMPTY_HIT || cellValue === SHIP_HIT || cellValue === SHIP_KILLED;
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
      ships: null,
      hits: [],
    },
    player2: {
      ships: null,
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

  if (action.type === "set_ships_arrangement") {
    const { player, shipsArrangement } = action;
    return {
      ...state,
      [player]: {
        ...state[player],
        ships: shipsArrangement,
      },
    };
  }

  throw new Error(`Unknown action type: ${action.type}`);
};

function censorEnemyState(enemyState) {
  const { ships, hits } = enemyState;
  if (!ships) {
    return { ships: null, hits: [] };
  }

  const enemyTable = getTableOutOfArrangementsAndHits(ships, hits);
  const hitsWithRevealedCells = [];
  for (let i = 0; i < 10; i++) {
    for (let j = 0; j < 10; j++) {
      const cellValue = enemyTable[i][j];
      if (isHitOrKilled(cellValue)) {
        hitsWithRevealedCells.push({ i, j, cellValue: enemyTable[i][j] });
      }
    }
  }

  return { hits: hitsWithRevealedCells };
}

module.exports.getPOVState = function getPOVState(state, player) {
  const enemyPlayer = enemyOf(player);
  const enemy = censorEnemyState(state[enemyPlayer]);
  const you = state[player];
  const currentTurn = state.currentTurn;

  return { currentTurn, you, enemy };
};
