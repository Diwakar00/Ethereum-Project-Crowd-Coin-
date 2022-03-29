const HDWallet = require("@truffle/hdwallet-provider");
const Web3 = require("web3");
const factoryCampaignJson = require("./build/FactoryCampaign.json");

const provider = new HDWallet(
  "subway token climb arrive pyramid novel tonight critic donkey potato copper example",
  "https://rinkeby.infura.io/v3/9dc05e82529c40d6857cc169a265fc79"
);

const web3 = new Web3(provider);

const deploy = async () => {
  const accounts = await web3.eth.getAccounts();
  const factoryCampaign = await new web3.eth.Contract(
    JSON.parse(factoryCampaignJson.interface)
  )
    .deploy({ data: factoryCampaignJson.bytecode })
    .send({ from: accounts[0], gas: "1000000" });

  console.log(factoryCampaign.options.address);
};

deploy();
