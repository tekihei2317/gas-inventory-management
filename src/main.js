import calcConsumedPriceSum from "./lib/calcConsumedPriceSum.js";

// データの開始行
const OFFSET_ROW = 2;
// データの開始列
const OFFSET_COL = 1;
// 消費個数累計の列
const CONSUMED_COUNT_COL = 7;
const sheet = SpreadsheetApp.getActiveSheet();

const calcLastRowIndex = (colIndex = 1) => {
  rowIndex = 0;
  while (true) {
    cellValue = sheet.getRange(rowIndex + 1, colIndex).getValue();
    if (cellValue !== "") rowIndex++;
    else break;
  }
  return rowIndex;
};

const makeStocks = (lastRowIndex) => {
  const stocks = [];
  for (let i = OFFSET_ROW; i <= lastRowIndex; i++) {
    const count = sheet.getRange(i, OFFSET_COL).getValue();
    if (count > 0) {
      const price = sheet.getRange(i, OFFSET_COL + 1).getValue();
      stocks.push({ count, price });
    }
  }
  return stocks;
};

const calcResult = (stocks, lastRowIndex) => {
  let consumedCounts = 0;

  for (let i = OFFSET_ROW + 1; i <= lastRowIndex; i++) {
    count = sheet.getRange(i, CONSUMED_COUNT_COL).getValue();
    consumedCounts.push(count);
  }

  return calcConsumedPriceSum(stocks, consumedCounts);
};

const setPriceSum = (priceSumList) => {
  priceSumList.forEach((priceSum, index) => {
    // 開始行は固定値なので、その次の行から埋める
    sheet
      .getRange(OFFSET_ROW + 1 + index, CONSUMED_COUNT_COL + 1)
      .setValue(priceSum);
  });
};

const main = () => {
  const lastRowIndex = calcLastRowIndex();
  const stocks = makeStocks(lastRowIndex);
  const priceSumList = calcResult(stocks, lastRowIndex);
  setPriceSum(priceSumList);
};
