// データの開始行
const OFFSET_ROW = 2;
// データの開始列
const OFFSET_COL = 1;
// 消費個数累計の列
const CONSUMED_COUNT_COL = 7;
const sheet = SpreadsheetApp.getActiveSheet();

const calcLastRowIndex = (colIndex = 1) => {
  rowIndex = 0;
  while(true){
    cellValue = sheet.getRange(rowIndex + 1, colIndex).getValue();
    if(cellValue !== "") rowIndex++;
    else break;
  }
  return rowIndex;
};

const makeStocks = (lastRowIndex) => {
  const stocks = [];
  for(let i = OFFSET_ROW; i <= lastRowIndex; i++){
    const count = sheet.getRange(i, OFFSET_COL).getValue();
    if (count > 0) {
      const price = sheet.getRange(i, OFFSET_COL + 1).getValue();
      stocks.push({ count, price });
    }
  }
  return stocks;
};

const calcCounsumedPriceSum = (stocks, lastRowIndex) => {
  const priceSumList = [];
  let currentPriceSum = 0;
  let currentStockIndex = -1;
  let currentStock = null;

  // 開始行は固定値なので、その次の行から始める
  for(let i = OFFSET_ROW + 1; i <= lastRowIndex; i++) {
    let countDiff = sheet.getRange(i, CONSUMED_COUNT_COL).getValue() - sheet.getRange(i - 1, CONSUMED_COUNT_COL).getValue();

    while(countDiff > 0) {
      if (currentStock === null || currentStock.count === 0) {
        currentStockIndex++;
        currentStock = stocks[currentStockIndex];
      }
      const count = Math.min(countDiff, currentStock.count);
      currentPriceSum += currentStock.price * count;
      countDiff -= count;
      currentStock.count -= count;
    }

    priceSumList.push(currentPriceSum);
  }

  return priceSumList;
}

const setPriceSum = (priceSumList) => {
  priceSumList.forEach((priceSum, index) => {
    // 開始行は固定値なので、その次の行から埋める
    sheet.getRange(OFFSET_ROW + 1 + index, CONSUMED_COUNT_COL + 1).setValue(priceSum);
  });
}

const main = () => {
  const lastRowIndex = calcLastRowIndex();
  const stocks = makeStocks(lastRowIndex);
  const priceSumList = calcCounsumedPriceSum(stocks, lastRowIndex);
  setPriceSum(priceSumList);
};
