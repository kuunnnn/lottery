const noColor = globalThis.Deno?.noColor ?? true;
let enabled = !noColor;
function code(open, close) {
    return {
        open: `\x1b[${open.join(";")}m`,
        close: `\x1b[${close}m`,
        regexp: new RegExp(`\\x1b\\[${close}m`, "g")
    };
}
function run(str, code1) {
    return enabled ? `${code1.open}${str.replace(code1.regexp, code1.open)}${code1.close}` : str;
}
function red(str) {
    return run(str, code([
        31
    ], 39));
}
function blue(str) {
    return run(str, code([
        34
    ], 39));
}
function brightBlack(str) {
    return run(str, code([
        90
    ], 39));
}
function clampAndTruncate(n, max = 255, min = 0) {
    return Math.trunc(Math.max(Math.min(n, max), min));
}
const ANSI_PATTERN = new RegExp([
    "[\\u001B\\u009B][[\\]()#;?]*(?:(?:(?:[a-zA-Z\\d]*(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]*)*)?\\u0007)",
    "(?:(?:\\d{1,4}(?:;\\d{0,4})*)?[\\dA-PR-TZcf-ntqry=><~]))", 
].join("|"), "g");
function getRandomNumber(min, max) {
    return Math.floor(Math.random() * max) + min;
}
function swap(list, i, j) {
    const temp = list[i];
    list[i] = list[j];
    list[j] = temp;
}
function randomList(list) {
    let index = list.length;
    while(--index){
        swap(list, index, Math.floor(Math.random() * index));
    }
    return list;
}
function getSingleRandomNumber(numbers) {
    const index = getRandomNumber(0, numbers.length - 1);
    return numbers[index];
}
async function fetchHistoryData(count) {
    const params = Object.entries({
        name: "ssq",
        issueCount: count.toString()
    }).map(([key, value])=>`${key}=${value}`
    ).join("&");
    const options = {
        method: "GET",
        headers: {
            "Referer": "http://www.cwl.gov.cn/kjxx/wqkj/"
        }
    };
    const url = "http://www.cwl.gov.cn/cwl_admin/kjxx/findDrawNotice?" + params;
    const json = await fetch(url, options).then((result)=>result.json()
    );
    if (json.message === "查询成功") {
        return json.result.map((val)=>({
                red: val.red.split(",").map((v)=>parseInt(v, 10)
                ),
                blue: parseInt(val.blue)
            })
        );
    }
    return [];
}
function createRandomPool(data) {
    const pool = {
        blue: [],
        red: [
            [],
            [],
            [],
            [],
            [],
            []
        ]
    };
    for (let item of data){
        pool.blue.push(item.blue);
        for(let i = 0; i < 6; i++){
            pool.red[i].push(item.red[i]);
        }
    }
    return pool;
}
function calcWeight(numbers, size) {
    const weight = new Array(size).fill(0);
    for (let num of numbers){
        weight[num - 1] += 1;
    }
    return weight;
}
function buildRandomNumberPool(bucketList) {
    const result = [];
    for(let i = 0, len = bucketList.length; i < len; i++){
        const val = bucketList[i];
        for(let j = 0; j < val; j++){
            result.push(i + 1);
        }
    }
    return randomList(result);
}
function verify(red1) {
    for(let i = 0; i < 6; i++){
        if (red1[i] >= red1[i + 1]) return false;
    }
    return true;
}
function genNumbers(redNumbers, blueNumbers) {
    const reds = [];
    while(true){
        reds.length = 0;
        for (const nums of redNumbers)reds.push(getSingleRandomNumber(nums));
        if (verify(reds)) break;
    }
    const blue1 = getSingleRandomNumber(blueNumbers);
    const str = (n)=>n.toString().padStart(2, "0")
    ;
    const r = reds.map((red1)=>red(str(red1))
    ).join(", ");
    const b = blue(str(blue1));
    return r + ", " + b;
}
function currentDateString() {
    const today = new Date();
    const y = today.getFullYear();
    const m = (today.getMonth() + 1).toString().padStart(2, "0");
    const d = today.getDate().toString().padStart(2, "0");
    const h = today.getHours().toString().padStart(2, "0");
    const mm = today.getMinutes().toString().padStart(2, "0");
    return `${y}-${m}-${d} ${h}:${mm}`;
}
const result = await fetchHistoryData(100);
const pool = createRandomPool(result);
const redPool = pool.red.map((val)=>buildRandomNumberPool(calcWeight(val, 33))
);
const bluePool = buildRandomNumberPool(calcWeight(pool.blue, 16));
const totalRedPool = buildRandomNumberPool(calcWeight(pool.red.flat(), 33));
const one = await genNumbers(redPool, bluePool);
const two = await genNumbers(new Array(6).fill(totalRedPool), bluePool);
console.log("生成时间: %s", currentDateString());
console.log("随机第一注: %s", one);
console.log("随机第二注: %s", two);

