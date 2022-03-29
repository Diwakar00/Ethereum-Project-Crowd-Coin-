import web3 from "./web3";
import factoryCampaign from "./build/FactoryCampaign.json";

export const factory = new web3.eth.Contract(
  JSON.parse(factoryCampaign.interface),
  "0x39a676b8AcbB76b1995bE73e5C57963F25Fa4a81"
);
