const Web3 = require("web3");
const assert = require("assert");
const ganache = require("ganache-cli");
const factoryCampaignJson = require("../ethereum/build/FactoryCampaign.json");
const campaignJson = require("../ethereum/build/Campaign.json");

const web3 = new Web3(ganache.provider());

let accounts;
let factory;
let campaignAddresses;
let campaign;

beforeEach(async () => {
  accounts = await web3.eth.getAccounts();
  factory = await new web3.eth.Contract(
    JSON.parse(factoryCampaignJson.interface)
  )
    .deploy({ data: factoryCampaignJson.bytecode })
    .send({ from: accounts[0], gas: "1000000" });
  await factory.methods
    .createCampaign(10)
    .send({ from: accounts[0], gas: "1000000" });
  campaignAddresses = await factory.methods.getCampaigns().call();
  campaign = await new web3.eth.Contract(
    JSON.parse(campaignJson.interface),
    campaignAddresses[0]
  );
});

describe("Tests", () => {
  it("varify both contracts deployed", async () => {
    assert.ok(factory.options.address);
    assert.ok(campaign.options.address);
  });

  it("verify the manager address", async () => {
    assert.equal(accounts[0], await campaign.methods.manager().call());
  });

  it("verify that people can contribute", async () => {
    for (let i = 1; i <= 5; i++) {
      await campaign.methods
        .contribute()
        .send({ from: accounts[i], value: web3.utils.toWei("1", "ether") });
      const isContributer = await campaign.methods
        .contributers(accounts[i])
        .call();
      assert.ok(isContributer);
    }
  });

  it("verify that user cannot be contributer if he sends less than minimum ether", async () => {
    try {
      await campaign.methods
        .contribute()
        .send({ from: accounts[2], value: "9" });
    } catch (e) {}
    const isContributer = await campaign.methods
      .contributers(accounts[2])
      .call();
    assert.ok(!isContributer);
  });

  it("verify that only manager can create request", async () => {
    await campaign.methods
      .createRequest("Amount for infrastructure", 1000000000000000, accounts[6])
      .send({ from: accounts[0], gas: "1000000" });
    const requests = await campaign.methods.requests(0).call();
    assert.equal(accounts[6], requests.recepient);
  });
});
