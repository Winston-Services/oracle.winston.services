// Import ethers from the CDN
import { addressBook, main } from "https://oracle.winston.services/oracle.js";
await main();
const responseData = globalThis.Winston.data;
console.log(responseData);
function setRickleTotalSupply() {
  const el = document.getElementById("");
}
function setWinstonTotalSupply() {
  const el = document.getElementById("");
}
function setAcademyTotalSupply() {
  const el = document.getElementById("");
}
function setAhwaTotalSupply() {
  const el = document.getElementById("");
}
function setRickleLockedSupply() {
  const el = document.getElementById("totalRKLLocked");
  el.innerText = responseData.locked_in_winston.Rickle;
}
function setWinstonLockedSupply() {
  const el = document.getElementById("totalWINLocked");
  el.innerText = responseData.locked_in_winston.Winston;
}
function setAcademyLockedSupply() {
  const el = document.getElementById("");
}
function setRickleBurnedSupply() {
  const el = document.getElementById("");
}
function setWinstonBurnedSupply() {
  const el = document.getElementById("totalWINBurned");
  el.innerText = responseData.burned_supply.Winston;
}
function setAcademyBurnedSupply() {
  const el = document.getElementById("");
}
setRickleLockedSupply();
setWinstonLockedSupply();
setWinstonBurnedSupply();

let maticRickle = {
  baseToken: "0x9fdc23fe295104ac55fef09363c56451d0e37cfa",
  chainId: 137
};

let arbRickle = {
  baseToken: "0x2d0e0ec9c82c67c4a8d7c7e6c176831f52821b33",
  chainId: 42161
};
let bscRickle = {
  baseToken: "0xeCa15e1BbFF172D545Dd6325F3Bae7b737906737",
  chainId: 56
};

let ethRickle = {
  baseToken: "0x0ff80a1708191c0da8aa600fa487f7ac81d7818c",
  chainId: 1
};

let bscWinston = {
  baseToken: "0x75578ebbefe274f240b8e1b5859ca34f342157d9",
  chainId: 56
};

let bscWinstonAcademyCoin = {
  baseToken: "0x181d5cec845973e64bccf9848412948be8a3883e",
  chainId: 56
};

let bscAhwa = {
  baseToken: "0x3a81caafeedcf2d743be893858cda5acdbf88c11",
  chainId: 56
};

function coinbrainUrl(chainId, baseToken) {
  return `https://api.coinbrain.com/cointoaster/coins/liquidity-pools-page/?chainId=${chainId}&baseToken=${baseToken}&pagination=%7B%22limit%22%3A50%7D`;
}

function extractDataItem(item) {
  // console.log(item);
  return {
    baseToken: item.baseToken,
    chainId: item.chainId,
    baseTokenLiquidity: item.baseTokenLiquidity,
    baseTokenLiquidityUsd: item.baseTokenLiquidityUsd,
    coinReserve: item.coinReserve,
    exchange: item.exchange.fullName,
    exchangeLink: item.exchange.web,
    exchangeVerified: item.exchange.isVerified,
    poolTokenAddress: item.poolTokenAddress,
    reverse: item.reverse,
    token0_name: item.target.name,
    token0_symbol: item.target.symbol,
    token0_address: item.target.address,
    token0_decimals: item.target.decimals,
    targetTokenLiquidity: item.targetTokenLiquidity,
    targetTokenLiquidityUsd: item.targetTokenLiquidityUsd,
    verified: item.verified
  };
}

function createCell(text, style) {
  let cellEl = document.createElement("td");
  cellEl.innerHTML = text;
  if (style) {
    if (style.backgroundColor)
      cellEl.style.backgroundColor = style.backgroundColor; //"#000";
    if (style.color) cellEl.style.color = style.color; //"#fff";
    if (style.textAlign) cellEl.style.textAlign = style.textAlign;
  }
  return cellEl;
}

const abbrevAddress = (address) =>
  address.slice(0, 6) + "..." + address.slice(-4);

let table = document.getElementById("price");
let tableBodyEl = document.createElement("tbody");

async function getData() {
  let data = [];
  let eth = await fetch(
    coinbrainUrl(ethRickle.chainId, ethRickle.baseToken)
  ).then((r) => r.json());
  let bsc = await fetch(
    coinbrainUrl(bscRickle.chainId, bscRickle.baseToken)
  ).then((r) => r.json());
  let poly = await fetch(
    coinbrainUrl(maticRickle.chainId, maticRickle.baseToken)
  ).then((r) => r.json());
  let arb = await fetch(
    coinbrainUrl(arbRickle.chainId, arbRickle.baseToken)
  ).then((r) => r.json());
  let win = await fetch(
    coinbrainUrl(bscWinston.chainId, bscWinston.baseToken)
  ).then((r) => r.json());
  let wac = await fetch(
    coinbrainUrl(bscWinstonAcademyCoin.chainId, bscWinstonAcademyCoin.baseToken)
  ).then((r) => r.json());
  let ahwa = await fetch(coinbrainUrl(bscAhwa.chainId, bscAhwa.baseToken)).then(
    (r) => r.json()
  );

  data.push(
    ...eth.items.map((item) => ({
      ...item,
      chainId: ethRickle.chainId,
      baseToken: ethRickle.baseToken
    })),
    ...bsc.items.map((item) => ({
      ...item,
      chainId: bscRickle.chainId,
      baseToken: bscRickle.baseToken
    })),
    ...poly.items.map((item) => ({
      ...item,
      chainId: maticRickle.chainId,
      baseToken: maticRickle.baseToken
    })),
    ...arb.items.map((item) => ({
      ...item,
      chainId: arbRickle.chainId,
      baseToken: arbRickle.baseToken
    })),
    ...win.items.map((item) => ({
      ...item,
      chainId: bscWinston.chainId,
      baseToken: bscWinston.baseToken
    })),
    ...wac.items.map((item) => ({
      ...item,
      chainId: bscWinstonAcademyCoin.chainId,
      baseToken: bscWinstonAcademyCoin.baseToken
    })),
    ...ahwa.items.map((item) => ({
      ...item,
      chainId: bscAhwa.chainId,
      baseToken: bscAhwa.baseToken
    }))
  );
  return data;
}
let data = await getData();
data = data.sort(function (a, b) {
  return b.baseTokenLiquidity - a.baseTokenLiquidity;
});

let totalRickleInLiquidity = data
  .filter(
    (x) =>
      x.baseToken.startsWith("0xeCa1") ||
      x.baseToken.startsWith("0x0ff8") ||
      x.baseToken.startsWith("0x9fdc") ||
      x.baseToken.startsWith("0x2d0e")
  )
  .reduce((p, v) => p + v.baseTokenLiquidity, 0);
let totalWinstonInLiquidity = data
  .filter((x) => x.baseToken.startsWith("0x7557"))
  .reduce((p, v) => p + v.baseTokenLiquidity, 0);
let totalAhwaInLiquidity = data
  .filter((x) => x.baseToken.startsWith("0x3a81"))
  .reduce((p, v) => p + v.baseTokenLiquidity, 0);
let totalWACInLiquidity = data
  .filter((x) => x.baseToken.startsWith("0x181d"))
  .reduce((p, v) => p + v.baseTokenLiquidity, 0);

let totalWBTCInLiquidity = data
  .filter(
    (x) =>
      x.target.address.startsWith("0x7130") ||
      x.target.address.startsWith("0x2f2a")
  )
  .reduce((p, v) => p + v.targetTokenLiquidity, 0);

let totalWETHInLiquidity = data
  .filter(
    (x) =>
      x.target.address.startsWith("0xc02a") ||
      x.target.address.startsWith("0x82af")
  )
  .reduce((p, v) => p + v.targetTokenLiquidity, 0);

let totalWBNBInLiquidity = data
  .filter((x) => x.target.address.startsWith("0xbb4c"))
  .reduce((p, v) => p + v.targetTokenLiquidity, 0);

let totalBUSDInLiquidity = data
  .filter((x) => x.target.address.startsWith("0xe9e7"))
  .reduce((p, v) => p + v.targetTokenLiquidity, 0);

let totalUSDCInLiquidity = data
  .filter(
    (x) =>
      x.target.address.startsWith("0x8ac7") ||
      x.target.address.startsWith("0x2791") ||
      x.target.address.startsWith("0xaf88")
  )
  .reduce((p, v) => p + v.targetTokenLiquidity, 0);

let totalUSDTInLiquidity = data
  .filter(
    (x) =>
      x.target.address.startsWith("0x55d3") ||
      x.target.address.startsWith("0xc213")
  )
  .reduce((p, v) => p + v.targetTokenLiquidity, 0);

let totalWMATICInLiquidity = data
  .filter((x) => x.target.address.startsWith("0x0d50"))
  .reduce((p, v) => p + v.targetTokenLiquidity, 0);

let totalCAKEInLiquidity = data
  .filter((x) => x.target.address.startsWith("0x0e09"))
  .reduce((p, v) => p + v.targetTokenLiquidity, 0);

let rickleInLiquidityEl = document.getElementById("rickleInLiquidity");
rickleInLiquidityEl.innerText = totalRickleInLiquidity;
let winstonInLiquidityEl = document.getElementById("winstonInLiquidity");
winstonInLiquidityEl.innerText = totalWinstonInLiquidity;

let ahwaInLiquidityEl = document.getElementById("ahwaInLiquidity");
ahwaInLiquidityEl.innerText = totalAhwaInLiquidity;

let wacInLiquidityEl = document.getElementById("wacInLiquidity");
wacInLiquidityEl.innerText = totalWACInLiquidity;

let wethInLiquidityEl = document.getElementById("wethInLiquidity");
wethInLiquidityEl.innerText = totalWETHInLiquidity;

let wbtcInLiquidityEl = document.getElementById("wbtcInLiquidity");
wbtcInLiquidityEl.innerText = totalWBTCInLiquidity;

let wbnbInLiquidityEl = document.getElementById("wbnbInLiquidity");
wbnbInLiquidityEl.innerText = totalWBNBInLiquidity;

let busdInLiquidityEl = document.getElementById("busdInLiquidity");
busdInLiquidityEl.innerText = totalBUSDInLiquidity;

let usdcInLiquidityEl = document.getElementById("usdcInLiquidity");
usdcInLiquidityEl.innerText = totalUSDCInLiquidity;

let usdtInLiquidityEl = document.getElementById("usdtInLiquidity");
usdtInLiquidityEl.innerText = totalUSDTInLiquidity;

let wmaticInLiquidityEl = document.getElementById("wmaticInLiquidity");
wmaticInLiquidityEl.innerText = totalWMATICInLiquidity;

let cakeInLiquidityEl = document.getElementById("cakeInLiquidity");
cakeInLiquidityEl.innerText = totalCAKEInLiquidity;

let d = [];
let h = [];
data.forEach((x) => {
  if (d.indexOf(x.poolTokenAddress) === -1) {
    d.push(x.poolTokenAddress);
    h.push(x);
  }
});
data = h;
let number_of_dexs = [];
let number_of_pools = [];
let number_of_pairs = [];

for (let item = 0; item < data.length; item++) {
  if (item < data.length) {
    const {
      chainId,
      baseToken,
      baseTokenLiquidity,
      baseTokenLiquidityUsd,
      coinReserve,
      exchange,
      exchangeLink,
      exchangeVerified,
      poolTokenAddress,
      reverse,
      token0_name,
      token0_symbol,
      token0_address,
      token0_decimals,
      targetTokenLiquidity,
      targetTokenLiquidityUsd,
      verified
    } = extractDataItem(data[item]);

    if (number_of_dexs.indexOf(exchange) === -1) {
      number_of_dexs.push(exchange);
    }
    if (number_of_pools.indexOf(poolTokenAddress) === -1) {
      number_of_pools.push(poolTokenAddress);
    }
    if (number_of_pairs.indexOf(token0_address) === -1) {
      number_of_pairs.push(token0_address);
    }
    let chains = {
      1: "ETH",
      56: "BSC",
      137: "POLY",
      42161: "ARB"
    };
    let chainStyle = {
      1: { backgroundColor: "#000123", color: "#fff" },
      56: { backgroundColor: "#000321", color: "#fff" },
      137: { backgroundColor: "#000444", color: "#fff" },
      42161: { backgroundColor: "#000555", color: "#fff" }
    };
    let rowEl = document.createElement("tr");
    switch (chains[chainId]) {
      case "ETH":
        rowEl.style.backgroundColor = chainStyle[chainId].backgroundColor;
        rowEl.style.color = chainStyle[chainId].color;
        break;
      case "BSC":
        rowEl.style.backgroundColor = chainStyle[chainId].backgroundColor;
        rowEl.style.color = chainStyle[chainId].color;
        break;
      case "POLY":
        rowEl.style.backgroundColor = chainStyle[chainId].backgroundColor;
        rowEl.style.color = chainStyle[chainId].color;
        break;
      case "ARB":
        rowEl.style.backgroundColor = chainStyle[chainId].backgroundColor;
        rowEl.style.color = chainStyle[chainId].color;
        break;
    }
    rowEl.classList.add(token0_symbol.toLowerCase());
    rowEl.append(
      createCell(item + 1, {
        backgroundColor: "#000",
        color: "#fff",
        textAlign: "center"
      })
    );
    rowEl.append(createCell(chains[chainId], { textAlign: "center" }, "eth"));
    function tokenName(str) {
      if (str.startsWith("0x181d")) {
        return "Winston Academy";
      } else if (
        str.startsWith("0xeCa1") ||
        str.startsWith("0x0ff8") ||
        str.startsWith("0x9fdc") ||
        str.startsWith("0x2d0e")
      ) {
        return "Rickle";
      } else if (str.startsWith("0x7557")) {
        return "Winston";
      } else if (str.startsWith("0x3a81")) {
        return "Ahwa";
      } else return str;
    }
    rowEl.append(
      createCell(tokenName(abbrevAddress(baseToken)), {
        textAlign: "center"
      })
    );
    rowEl.append(
      createCell(Number(baseTokenLiquidity).toFixed(8), {
        textAlign: "right"
      })
    );
    rowEl.append(
      createCell(baseTokenLiquidityUsd, {
        textAlign: "right"
      })
    );
    rowEl.append(
      createCell(coinReserve, {
        textAlign: "right"
      })
    );
    rowEl.append(
      createCell(
        `<a href="${exchangeLink}" target="_default">${exchange} </a>${
          exchangeVerified ? "✅" : "❌"
        }`
      )
    );
    rowEl.append(createCell(abbrevAddress(poolTokenAddress)));
    rowEl.append(createCell(reverse));
    rowEl.append(createCell(`<a title="${token0_address}">${token0_symbol}`));
    rowEl.append(createCell(token0_decimals));
    rowEl.append(
      createCell(targetTokenLiquidity, {
        textAlign: "right"
      })
    );
    rowEl.append(
      createCell(Number(targetTokenLiquidityUsd).toFixed(8), {
        textAlign: "right"
      })
    );
    rowEl.append(createCell(verified ? "✅" : "❌"));
    tableBodyEl.append(rowEl);
  }
}
table.append(tableBodyEl);
const numberOfDexsEl = document.getElementById("number_of_dexs");
numberOfDexsEl.innerText = number_of_dexs.length;
const numberOfPoolsEl = document.getElementById("number_of_pools");
numberOfPoolsEl.innerText = number_of_pools.length;
const numberOfPairsEl = document.getElementById("number_of_pairs");
numberOfPairsEl.innerText = number_of_pairs.length;
