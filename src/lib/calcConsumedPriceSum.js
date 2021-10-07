/**
 * 在庫から引き出した価格の累計を求める
 * @param {*} stocks - 在庫の配列（価格と個数のペア）
 * @param {*} consumedCounts - 引き出した個数の累計の配列
 * @returns {*} 価格の累計の配列
 */
const calcConsumedPriceSum = (stocks, consumedCounts) => {
  let currentStock = null;
  let currentStockIndex = -1;
  let consumedPriceSum = 0;

  return consumedCounts.map((consumedCount, index) => {
    let countDiff = consumedCount - (consumedCounts[index - 1] ?? 0);

    while (countDiff > 0) {
      if (currentStock === null || currentStock.count === 0) {
        currentStock = stocks[++currentStockIndex];
      }

      const count = Math.min(countDiff, currentStock.count);
      consumedPriceSum += currentStock.price * count;
      countDiff -= count;
      currentStock.count -= count;
    }

    return consumedPriceSum;
  });
};
