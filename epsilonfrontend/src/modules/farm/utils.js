export const makeContainsFarmers = farmers => (row, col) =>
  farmers.some(farmer => farmer.row === row && farmer.col === col);

export const makeFarmerAt = (row, col) => ({
  row,
  col,
  working: false,
});
