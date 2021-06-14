const { EMPTY, EMPTY_HIT, SHIP, SHIP_HIT, SHIP_KILLED } = require("./constants");

function hitVersionOfCellValue(cellValue) {
  switch (cellValue) {
    case EMPTY:
    case EMPTY_HIT:
      return EMPTY_HIT;
    case SHIP:
    case SHIP_HIT:
    case SHIP_KILLED:
      return SHIP_HIT;
    default:
      throw new Error(`Unknown cell value ${cellValue}`);
  }
}

function killedVersionOfCellValue(cellValue) {
  switch (cellValue) {
    case EMPTY:
    case EMPTY_HIT:
      return EMPTY_HIT;
    case SHIP:
    case SHIP_HIT:
    case SHIP_KILLED:
      return SHIP_KILLED;
    default:
      throw new Error(`Unknown cell value ${cellValue}`);
  }
}

function createEmptyTable() {
  return Array(10)
    .fill(null)
    .map(() => Array(10).fill(EMPTY));
}

function putShipToTable(table, ship) {
  const { i: i1, j: j1 } = ship.from;
  const { i: i2, j: j2 } = ship.to;

  for (let i = i1; i <= i2; i++) {
    for (let j = j1; j <= j2; j++) {
      table[i][j] = SHIP;
    }
  }

  return table;
}

function getTableOutOfShipArrangement(shipArrangement) {
  const emptyTable = createEmptyTable();
  const table = shipArrangement.reduce((table, ship) => putShipToTable(table, ship), emptyTable);

  return table;
}

function applyHits(table, hits) {
  const tableWithAppliedHits = hits.reduce((table, hit) => {
    const { i, j } = hit;
    table[i][j] = hitVersionOfCellValue(table[i][j]);

    return table;
  }, table);

  return tableWithAppliedHits;
}

function revealKills(table, shipArrangement) {
  return shipArrangement.reduce((table, ship) => {
    const { i: i1, j: j1 } = ship.from;
    const { i: i2, j: j2 } = ship.to;

    let killed = true;
    for (let i = i1; i <= i2; i++) {
      for (let j = j1; j <= j2; j++) {
        if (table[i][j] !== SHIP_HIT) {
          killed = false;
        }
      }
    }

    if (killed) {
      for (let i = Math.max(0, i1 - 1); i <= Math.min(9, i2 + 1); i++) {
        for (let j = Math.max(0, j1 - 1); j <= Math.min(9, j2 + 1); j++) {
          table[i][j] = killedVersionOfCellValue(table[i][j]);
        }
      }
    }

    return table;
  }, table);
}

function getTableOutOfArrangementsAndHits(shipArrangement, hits) {
  const initialTable = getTableOutOfShipArrangement(shipArrangement);
  const tableWithHitsApplied = hits ? applyHits(initialTable, hits) : initialTable;
  const finalTable = revealKills(tableWithHitsApplied, shipArrangement);

  return finalTable;
}

function getTableOutOfCellReveals(hitsWithReveals) {
  const emptyTable = createEmptyTable();
  const table = hitsWithReveals.reduce((table, hitWithReveal) => {
    const { i, j, cellValue } = hitWithReveal;
    table[i][j] = cellValue;
    return table;
  }, emptyTable);

  return table;
}

module.exports = {
  hitVersionOfCellValue,
  createEmptyTable,
  revealKills,
  getTableOutOfShipArrangement,
  getTableOutOfArrangementsAndHits,
  getTableOutOfCellReveals,
};
