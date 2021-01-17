/**
 *  1. 先去http://www.cwl.gov.cn/kjxx/wqkj/拿往期的号码
 *  2. 根据往期号码计算权重生成一个权重号码池
 *  3. 从号码池随机取一个
 */

/**
 * TODO:
 *  1. 输出权重
 *  2. 出现次数最少视为权重最大(目前出现次数越多权重越高)
 */
import {
  buildRandomNumberPool,
  calcWeight,
  createRandomPool,
  currentDateString,
  fetchHistoryData,
  genNumbers,
} from "./lib.ts";

const result = await fetchHistoryData(100);
const pool = createRandomPool(result);
const redPool = pool.red.map((val) =>
  buildRandomNumberPool(calcWeight(val, 33))
);
const bluePool = buildRandomNumberPool(calcWeight(pool.blue, 16));
const totalRedPool = buildRandomNumberPool(
  calcWeight(pool.red.flat(), 33),
);
const one = await genNumbers(redPool, bluePool);
const two = await genNumbers(new Array(6).fill(totalRedPool), bluePool);

console.log("生成时间: %s", currentDateString());
console.log("随机第一注: %s", one);
console.log("随机第二注: %s", two);
