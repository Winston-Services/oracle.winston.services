// Import ethers from the CDN
import { ethers } from "https://cdn.jsdelivr.net/npm/ethers/dist/ethers.min.js";
let poolMaps = new Map();

function createABIFromString(str) {
  return `${str}`;
}

const Networks = ["Eth", "Bsc", "Pol", "Arb"]; // , "Gno", "One"

function NetworkId(name) {
  switch (name) {
    case "Eth":
      return 1;
    case "Bsc":
      return 56;
    case "Pol":
      return 137;
    case "Arb":
      return 42161;
    case "Gno":
      return 100;
    case "One":
      return 1666600000;
    default:
      throw Error("Not Implemented.");
  }
}

const ProjectAssets = ["Rickle", "Winston", "Academy", "Ahwa"];
const StableAssets = ["BUSD", "USDT", "USDC"];
const VolatileAssets = ["BTC", "BNB", "Pol", "Arb", "Weth"];

const STABLE_VALUE_BASE = 1;

const StandardABIFunctions = {
  balanceOf: createABIFromString(
    "function balanceOf(address account) external view returns (uint256)"
  ),
  totalSupply: createABIFromString(
    "function totalSupply() external view returns (uint256)"
  ),
  getPair: createABIFromString(
    "function getPair(address tokenA, address tokenB) external view returns (address pair)"
  )
};

// Uniswap V2 factory contract ABI
const UNISWAP_V2_FACTORY_ABI = [StandardABIFunctions.getPair];

async function getPairInterface(provider, factory, tokenA, tokenB) {
  // Initialize the factory contract
  const factoryContract = new ethers.Contract(
    factory,
    UNISWAP_V2_FACTORY_ABI,
    provider
  );

  try {
    const pairAddress = await factoryContract.getPair(tokenA, tokenB);
    if (pairAddress === ethers.ZeroAddress) {
      console.log("No liquidity pool exists for this pair.");
      return null;
    } else {
      console.log(`Liquidity pool address: ${pairAddress}`);
      return pairAddress;
    }
  } catch (error) {
    console.error("Error fetching liquidity pool address:", error);
    return null;
  }
}

// setting up some address reference
let addressBook = {
  Dead: {
    1: "0x000000000000000000000000000000000000dEaD", // eth
    56: "0x000000000000000000000000000000000000dEaD", // bsc
    137: "0x000000000000000000000000000000000000dEaD", // pol
    42161: "0x000000000000000000000000000000000000dEaD", // arb
    100: "0x000000000000000000000000000000000000dEaD", // gno
    1666600000: "0x000000000000000000000000000000000000dEaD" // one
  },
  Rickle: {
    1: "0x0ff80a1708191c0da8aa600fa487f7ac81d7818c",
    56: "0xeCa15e1BbFF172D545Dd6325F3Bae7b737906737",
    137: "0x9fdc23fe295104ac55fef09363c56451d0e37cfa",
    42161: "0x2d0e0ec9c82c67c4a8d7c7e6c176831f52821b33",
    100: "0x2dF5912439d2D14d04a7742346508505288eF367", // gno
    1666600000: "0x32eb48b083acce94d994ce885d9ab295c081f884" // one
  }, // missing gno/one
  Winston: {
    56: "0x75578ebbefe274f240b8e1b5859ca34f342157d9"
  },
  Academy: {
    56: "0x181d5cec845973e64bccf9848412948be8a3883e"
  },
  Ahwa: {
    56: "0x3a81caafeedcf2d743be893858cda5acdbf88c11"
  },
  BUSD: {
    56: "0xe9e7cea3dedca5984780bafc599bd69add087d56"
  },
  USDT: {
    1: "0xdAC17F958D2ee523a2206206994597C13D831ec7", // eth
    56: "0x55d398326f99059ff775485246999027b3197955", // bsc
    137: "0xc2132D05D31c914a87C6611C10748AEb04B58e8F", // pol
    42161: "0xfd086bc7cd5c481dcc9c85ebe478a1c0b69fcbb9", // arb
    100: "0x4E3E3E3E3E3E3E3E3E3E3E3E3E3E3E3E3E3E3E3E", // gno
    1666600000: "0x3E3E3E3E3E3E3E3E3E3E3E3E3E3E3E3E3E3E3E3E" // one
  },
  USDC: {
    1: "0xA0b86991c6218b36c1d19d4a2e9eb0ce3606eb48", // eth
    56: "0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d", // bsc
    137: "0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359", // pol
    42161: "0xff970a61a04b1ca14834a43f5de4533ebddb5cc8", // arb
    100: "0xD02E9B6d3eD4b4a6E8A1b5A5b5A5b5A5b5A5b5A5", // gno
    1666600000: "0x985458e523db3d53125813ed68c274899e9dfab4" // one
  },
  BTC: {
    56: "0x7130d2a12b9bcfaae4f2634d864a1ee1ce3ead9c",
    42161: "0x2f2a2543b76a4166549f7aab2e75bef0aefc5b0f"
  },
  BNB: {
    56: "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c"
  },
  Pol: {
    1: "0x7d1afa7b718fb893db30a3abc0cfc608aacfebb0", // wmatic on eth
    56: "0x7d1afa7b718fb893db30a3abc0cfc608aacfebb0", // wmatic on bsc
    137: "0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270", // wmatic on pol
    42161: "0x7d1afa7b718fb893db30a3abc0cfc608aacfebb0", // wmatic on arb
    100: "0x7d1afa7b718fb893db30a3abc0cfc608aacfebb0", // wmatic on gno
    1666600000: "0x7d1afa7b718fb893db30a3abc0cfc608aacfebb0" // wmatic on one
  },
  Eth: {
    1: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
    56: "0x2170Ed0880ac9A755fd29B2688956BD959F933F8", // BSC WETH
    137: "0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619", // Polygon WETH
    42161: "0x82af49447d8a07e3bd95bd0d56f35241523fbab1", // Arbitrum WETH
    100: "0x6a023ccd1ff6f2045c3309768ead9e68f978f6e1", // Gnosis WETH
    1666600000: "0x6983D1E6DEf3690C4d616b13597A09e6193EA013" // Harmony WETH
  },
  Gno: {
    100: "0x6a023ccd1ff6f2045c3309768ead9e68f978f6e1" // Gnosis WETH
  },
  One: {
    1666600000: "0x6983D1E6DEf3690C4d616b13597A09e6193EA013" // Harmony WETH
  },
  UNISWAP_V2_FACTORY_ADDRESS: {
    1: "0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f",
    56: "0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f",
    137: "0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f",
    42161: "0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f",
    100: "0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f",
    1666600000: "0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f"
  },
  PANCAKE_V2_FACTORY_ADDRESS: {
    56: "0xca143ce32fe78f1f7019d7d551a6402fc5350c73"
  },
  QUICK_V2_FACTORY_ADDRESS: {
    42161: "0x5757371414417b8C6CAad45bAeF941aBc7d3Ab32"
  },
  SUSHISWAP_V2_FACTORY_ADDRESS: {
    56: "0xca143ce32fe78f1f7019d7d551a6402fc5350c73",
    137: "0xc35DADB65012eC5796536bD986B6e95e7E537097",
    42161: "0x5757371414417b8C6CAad45bAeF941aBc7d3Ab32"
  }
};

async function getBalance(token, holder, provider) {
  let contract = new ethers.Contract(
    token,
    [StandardABIFunctions.balanceOf],
    provider
  );
  return await contract.balanceOf(holder);
}

// Get a pair balance.
async function getPairBalance(
  poolAddress = "0x",
  a = "0x",
  b = "0x",
  provider
) {
  return {
    [poolAddress]: {
      [a]: await getBalance(a, poolAddress, provider),
      [b]: await getBalance(b, poolAddress, provider)
    }
  };
}

async function getTotalSupply(network, token, provider) {
  let contract = new ethers.Contract(
    token,
    [StandardABIFunctions.totalSupply],
    provider
  );
  switch (network) {
    case "Eth":
    case "Bsc":
    case "Pol":
    case "Arb":
      return await contract.totalSupply();
    default:
      throw Error("Network Not Implemented.");
  }
}

function addPool(network, poolAddress, a, b) {
  function _addPool(m, p, t) {
    if (!m.has(p)) {
      m.set(p, t);
    }
  }
  const pools = poolMaps.get(network);
  switch (network) {
    case NetworkId("Eth"):
      _addPool(pools, poolAddress, [a, b]);
      return;
    case NetworkId("Bsc"):
      _addPool(pools, poolAddress, [a, b]);
      return;
    case NetworkId("Pol"):
      _addPool(pools, poolAddress, [a, b]);
      return;
    case NetworkId("Arb"):
      _addPool(pools, poolAddress, [a, b]);
      return;
    case NetworkId("Gno"):
      _addPool(pools, poolAddress, [a, b]);
      return;
    case NetworkId("One"):
      _addPool(pools, poolAddress, [a, b]);
      return;
    default:
      throw Error("Network not implemented.");
  }
}

function getNetworkRpcUrl(networkId) {
  switch (networkId) {
    case NetworkId("Eth"):
      return "https://mainnet.infura.io/v3/";
    case NetworkId("Bsc"):
      return "https://bsc-dataseed.binance.org/";
    case NetworkId("Pol"):
      return "https://polygon-rpc.com/";
    case NetworkId("Arb"):
      return "https://arb1.arbitrum.io/rpc";
    case NetworkId("Gno"):
      return "https://rpc.gnosischain.com/";
    case NetworkId("One"):
      return "https://api.harmony.one/";
    default:
      throw Error("Network not implemented.");
  }
}

async function getLiquidityBalances(poolMaps) {
  const data = [];
  const _n = Array.from(poolMaps.keys());
  for (let netIndex = 0; netIndex < _n.length; netIndex++) {
    const net = _n[netIndex];
    const pools = poolMaps.get(net);
    const poolAddresses = Array.from(pools.keys());
    for (let poolIndex = 0; poolIndex < poolAddresses.length - 1; poolIndex++) {
      const poolAddress = poolAddresses[poolIndex];
      const [a, b] = pools.get(poolAddress);
      data.push(await getPairBalance(poolAddress, a, b, provider(net)));
    }
  }
  return await Promise.all(data);
}

async function dataReponse(poolMaps) {
  return {
    liquidity: await getLiquidityBalances(poolMaps),
    burned_supply: {
      Rickle: {
        1: await getBalance(
          addressBook.Rickle[1],
          addressBook.Dead[1],
          provider(NetworkId("Eth"))
        ),
        56: await getBalance(
          addressBook.Rickle[56],
          addressBook.Dead[56],
          provider(NetworkId("Bsc"))
        ),
        137: await getBalance(
          addressBook.Rickle[137],
          addressBook.Dead[137],
          provider(NetworkId("Pol"))
        ),
        42161: await getBalance(
          addressBook.Rickle[42161],
          addressBook.Dead[42161],
          provider(NetworkId("Arb"))
        )
      },
      Winston: await getBalance(
        addressBook.Winston[56],
        addressBook.Dead[56],
        provider(NetworkId("Bsc"))
      ),
      Academy: await getBalance(
        addressBook.Academy[56],
        addressBook.Dead[56],
        provider(NetworkId("Bsc"))
      )
    },
    locked_in_winston: {
      Rickle: await getBalance(
        addressBook.Rickle[56],
        addressBook.Winston[56],
        provider(NetworkId("Bsc"))
      ),
      Winston: await getBalance(
        addressBook.Winston[56],
        addressBook.Winston[56],
        provider(NetworkId("Bsc"))
      ),
      Academy: await getBalance(
        addressBook.Academy[56],
        addressBook.Winston[56],
        provider(NetworkId("Bsc"))
      )
    },
    cir_supply: {
      Rickle: {
        1: 0,
        56: 0,
        137: 0,
        42161: 0
      },
      Winston: 0,
      Academy: 0,
      Ahwa: 0
    },
    t_cir_supply: {
      Rickle: {
        1: 0,
        56: 0,
        137: 0,
        42161: 0
      },
      Winston: 0,
      Academy: 0,
      Ahwa: 0
    },
    market_cap: {
      Rickle: {
        1: 0,
        56: 0,
        137: 0,
        42161: 0
      },
      Winston: 0,
      Academy: 0,
      Ahwa: 0
    },
    t_market_cap: {
      Rickle: {
        1: 0,
        56: 0,
        137: 0,
        42161: 0
      },
      Winston: 0,
      Academy: 0,
      Ahwa: 0
    },
    total_supply: {
      Rickle: {
        1: await getTotalSupply(
          "Eth",
          addressBook.Rickle[1],
          provider(NetworkId("Eth"))
        ),
        56: await getTotalSupply(
          "Bsc",
          addressBook.Rickle[56],
          provider(NetworkId("Bsc"))
        ),
        137: await getTotalSupply(
          "Pol",
          addressBook.Rickle[137],
          provider(NetworkId("Pol"))
        ),
        42161: await getTotalSupply(
          "Arb",
          addressBook.Rickle[42161],
          provider(NetworkId("Arb"))
        )
      },
      Winston: await getTotalSupply(
        "Bsc",
        addressBook.Winston[56],
        provider(NetworkId("Bsc"))
      ),
      Academy: await getTotalSupply(
        "Bsc",
        addressBook.Academy[56],
        provider(NetworkId("Bsc"))
      ),
      Ahwa: await getTotalSupply(
        "Bsc",
        addressBook.Ahwa[56],
        provider(NetworkId("Bsc"))
      )
    }
  };
}

const provider = (net) =>
  net !== 1
    ? new ethers.JsonRpcProvider(getNetworkRpcUrl(net))
    : ethers.getDefaultProvider();

async function fetchPools(network = "Bsc", a = "Rickle", b = "Winston") {
  console.log("Network:%s\t %s:%s", network, a, b);
  const uniswapPools = async () => {
    const pairAddress = await getPairInterface(
      provider(NetworkId(network)),
      addressBook.UNISWAP_V2_FACTORY_ADDRESS[NetworkId(network)],
      addressBook[a][NetworkId(network)],
      addressBook[b][NetworkId(network)]
    );
    if (pairAddress) {
      // console.log("Pool Address : ", pairAddress);
      addPool(
        NetworkId(network),
        pairAddress,
        addressBook[a][NetworkId(network)],
        addressBook[b][NetworkId(network)]
      );
    }
  };
  const pancakePools = async () => {
    const pairAddress = await getPairInterface(
      provider(NetworkId(network)),
      addressBook.PANCAKE_V2_FACTORY_ADDRESS[NetworkId(network)],
      addressBook[a][NetworkId(network)],
      addressBook[b][NetworkId(network)]
    );
    if (pairAddress) {
      console.log("Pool Address : ", pairAddress);
      addPool(
        NetworkId(network),
        pairAddress,
        addressBook[a][NetworkId(network)],
        addressBook[b][NetworkId(network)]
      );
    }
  };
  const quickPools = async () => {
    const pairAddress = await getPairInterface(
      provider(NetworkId(network)),
      addressBook.QUICK_V2_FACTORY_ADDRESS[NetworkId(network)],
      addressBook[a][NetworkId(network)],
      addressBook[b][NetworkId(network)]
    );
    if (pairAddress) {
      console.log("Pool Address : ", pairAddress);
      addPool(
        NetworkId(network),
        pairAddress,
        addressBook[a][NetworkId(network)],
        addressBook[b][NetworkId(network)]
      );
    }
  };
  const sushiswapPools = async () => {
    const pairAddress = await getPairInterface(
      provider(NetworkId(network)),
      addressBook.SUSHISWAP_V2_FACTORY_ADDRESS[NetworkId(network)],
      addressBook[a][NetworkId(network)],
      addressBook[b][NetworkId(network)]
    );
    if (pairAddress) {
      console.log("Pool Address : ", pairAddress);
      addPool(
        NetworkId(network),
        pairAddress,
        addressBook[a][NetworkId(network)],
        addressBook[b][NetworkId(network)]
      );
    }
  };
  if (network === "Eth") await uniswapPools();
  if (network === "Bsc") await pancakePools();
  // if (network === "Pol") await quickPools();
  if (network === "Bsc") await sushiswapPools();
  // if (network === "Pol") await sushiswapPools();
  // if (network === "Arb") await sushiswapPools();
}

async function main() {
  for (let net of Networks) {
    // console.log(net, NetworkId(net));
    poolMaps.set(NetworkId(net), new Map());

    if (net === "Bsc") {
      await fetchPools(net, "Rickle", "Winston");
      await fetchPools(net, "Winston", "Academy");
      await fetchPools(net, "Winston", "Ahwa");
      await fetchPools(net, "Winston", "USDT");
      await fetchPools(net, "Winston", "BUSD");
      await fetchPools(net, "Winston", "USDC");
      await fetchPools(net, "Winston", "BTC");
      await fetchPools(net, "Winston", "BNB");
      await fetchPools(net, "Academy", "BNB");
      await fetchPools(net, "Academy", "USDT");
      await fetchPools(net, "Academy", "BUSD");
      await fetchPools(net, "Academy", "USDC");
      await fetchPools(net, "Academy", "BTC");
      await fetchPools(net, "Academy", "BNB");
      await fetchPools(net, "Rickle", "BNB");
      await fetchPools(net, "Rickle", "BTC");
      await fetchPools(net, "Rickle", "BUSD");
    }
    if (net === "Pol") {
      await fetchPools(net, "Rickle", "Pol");
    }
    if (net !== "Eth") {
      await fetchPools(net, "Rickle", "USDT");
      await fetchPools(net, "Rickle", "USDC");
      await fetchPools(net, "Rickle", "Eth");
      //await fetchPools(net, "Rickle", "Gno");
      //await fetchPools(net, "Rickle", "One");
    }
  }
  // console.log(poolMaps);
  globalThis.Winston = {
    data: dataReponse(poolMaps).then((r) => {
      let _r = { ...r };
      _r.burned_supply.Academy = ethers.formatUnits(
        _r.burned_supply.Academy,
        18
      );
      _r.burned_supply.Winston = ethers.formatUnits(
        _r.burned_supply.Winston,
        18
      );
      for (let net of [1, 56, 137, 42161]) {
        _r.burned_supply.Rickle[net] = ethers.formatUnits(
          _r.burned_supply.Rickle[net],
          18
        );
      }
      _r.locked_in_winston.Rickle = ethers.formatUnits(
        _r.locked_in_winston.Rickle,
        18
      );
      _r.locked_in_winston.Academy = ethers.formatUnits(
        _r.locked_in_winston.Academy,
        18
      );
      _r.locked_in_winston.Winston = ethers.formatUnits(
        _r.locked_in_winston.Winston,
        18
      );
      _r.total_supply.Winston = ethers.formatUnits(_r.total_supply.Winston, 18);
      _r.total_supply.Academy = ethers.formatUnits(_r.total_supply.Academy, 18);
      _r.total_supply.Ahwa = ethers.formatUnits(_r.total_supply.Ahwa, 18);
      for (let net of [1, 56, 137, 42161]) {
        _r.total_supply.Rickle[net] = ethers.formatUnits(
          _r.total_supply.Rickle[net],
          18
        );
      }

      _r.cir_supply.Ahwa = r.total_supply.Ahwa;
      _r.cir_supply.Winston = String(
        _r.total_supply.Winston - _r.burned_supply.Winston
      );
      _r.cir_supply.Academy = String(
        _r.total_supply.Academy - _r.burned_supply.Academy
      );
      let total = String(
        [56, 137, 42161].reduce(
          (acc, net) => acc + Number(r.total_supply.Rickle[net]),
          0
        )
      );
      for (let net of [1, 56, 137, 42161]) {
        _r.cir_supply.Rickle[net] = String(
          _r.total_supply.Rickle[net] - _r.burned_supply.Rickle[net]
        );
      }
      _r.cir_supply.Rickle[1] = String(_r.cir_supply.Rickle[1] - total);
      // console.log("On Other Chains.", total);
      // console.log(_r.liquidity);
      return _r;
    })
  };
}

main();
