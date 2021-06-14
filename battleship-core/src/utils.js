const { EMPTY, EMPTY_HIT, SHIP, SHIP_HIT } = require("./constants");

function hitVersionOfCellValue(cellValue) {
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

function getTableOutOfArrangementsAndHits(shipArrangement, hits) {
  const initialTable = getTableOutOfShipArrangement(shipArrangement);
  const table = hits ? applyHits(initialTable, hits) : initialTable;

  return table;
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
  getTableOutOfArrangementsAndHits,
  getTableOutOfCellReveals,
};
