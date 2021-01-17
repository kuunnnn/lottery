import * as colors from "fmt/colors.ts";

/**
 * @param {number} min
 * @param {number} max
 * @returns {Promise<number>}
 */
function getRandomNumber(min: number, max: number): number {
  // return randomNumber( min, max )
  return Math.floor(Math.random() * max) + min;
}

/**
 * @param {*[]} list
 * @param {number} i index
 * @param {number} j index
 */
function swap<T>(list: T[], i: number, j: number): void {
  const temp = list[i];
  list[i] = list[j];
  list[j] = temp;
}

/**
 * @param {*[]} list
 * @returns {*[]}
 */
function randomList<T>(list: T[]): T[] {
  let index = list.length;
  while (--index) {
    swap(list, index, Math.floor(Math.random() * index));
  }
  return list;
}

/**
 * @param {*[]} numbers
 * @returns {Promise<*>}
 */
function getSingleRandomNumber(numbers: number[]): number {
  const index = getRandomNumber(0, numbers.length - 1);
  return numbers[index];
}

interface HistoryItem {
  blue: number;
  red: [number, number, number, number, number, number];
}
/**
 * @param {number} count
 * @returns {Promise<HistoryItem[]>}}
 */
export async function fetchHistoryData(count: number): Promise<HistoryItem[]> {
  const params = Object.entries({ name: "ssq", issueCount: count.toString() })
    .map(([key, value]) => `${key}=${value}`)
    .join("&");
  const options = {
    method: "GET",
    headers: {
      "Referer": "http://www.cwl.gov.cn/kjxx/wqkj/",
    },
  };
  const url = "http://www.cwl.gov.cn/cwl_admin/kjxx/findDrawNotice?" + params;
  const json = await fetch(url, options).then((result) => result.json());
  if (json.message === "查询成功") {
    return json.result.map((val: { red: string; blue: string }) => ({
      red: val.red.split(",").map((v) => parseInt(v, 10)),
      blue: parseInt(val.blue),
    }));
  }
  return [];
}

interface RandomNumberPool {
  blue: number[];
  red: number[][];
}
/**
 * @param {HistoryItem[]} data
 */
export function createRandomPool(data: HistoryItem[]): RandomNumberPool {
  const pool: RandomNumberPool = { blue: [], red: [[], [], [], [], [], []] };
  for (let item of data) {
    pool.blue.push(item.blue);
    for (let i = 0; i < 6; i++) {
      pool.red[i].push(item.red[i]);
    }
  }
  return pool;
}

/**
 *
 * @param {*[]} numbers
 * @param {number} size
 * @returns {number[]}
 */
export function calcWeight(numbers: number[], size: number): number[] {
  const weight = new Array(size).fill(0);
  for (let num of numbers) {
    weight[num - 1] += 1;
  }
  return weight;
}

/**
 * @param {*[]} bucketList
 * @returns {*[]}
 */
export function buildRandomNumberPool(bucketList: number[]): number[] {
  const result = [];
  for (let i = 0, len = bucketList.length; i < len; i++) {
    const val = bucketList[i];
    for (let j = 0; j < val; j++) {
      result.push(i + 1);
    }
  }
  return randomList(result);
}

/**
 * @param {number[]} red
 * @returns {boolean}
 */
function verify(red: number[]) {
  for (let i = 0; i < 6; i++) {
    if (red[i] >= red[i + 1]) return false;
  }
  return true;
}

/**
 * @param {number[][]} redNumbers
 * @param {number[]} blueNumbers
 * @returns {Promise<string>}
 */
export function genNumbers(redNumbers: number[][], blueNumbers: number[]) {
  const reds = [];
  while (true) {
    reds.length = 0;
    for (const nums of redNumbers) reds.push(getSingleRandomNumber(nums));
    if (verify(reds)) break;
  }
  const blue = getSingleRandomNumber(blueNumbers);
  const str = (n: number) => n.toString().padStart(2, "0");
  const r = reds.map((red) => colors.red(str(red))).join(", ");
  const b = colors.blue(str(blue));
  return r + ", " + b;
}

/**
 * @returns {string}
 */
export function currentDateString() {
  const today = new Date();
  const y = today.getFullYear();
  const m = (today.getMonth() + 1).toString().padStart(2, "0");
  const d = today.getDate().toString().padStart(2, "0");
  const h = today.getHours().toString().padStart(2, "0");
  const mm = today.getMinutes().toString().padStart(2, "0");
  return `${y}-${m}-${d} ${h}:${mm}`;
}
