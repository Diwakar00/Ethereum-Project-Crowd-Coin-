import { useState } from "react";
import { Button, Form, Input, Message } from "semantic-ui-react";
import { getCampaignInstance } from "../ethereum/campaign";
import web3 from "../ethereum/web3";
import { Router } from "../routes.js";

const ContributeForm = ({ address }) => {
  const [value, setValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const contribute = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const campaign = await getCampaignInstance(address);
      const accounts = await web3.eth.getAccounts();
      await campaign.methods
        .contribute()
        .send({ from: accounts[0], value: web3.utils.toWei(value, "ether") });
      Router.replaceRoute("/campaigns/" + address);
    } catch (e) {
      setError(e.message);
    }
    setLoading(false);
  };

  return (
    <Form onSubmit={contribute} error={!!error}>
      <Form.Field>
        <label>Amount to contribute</label>
        <Input
          label="ether"
          labelPosition="right"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
      </Form.Field>
      <Button loading={loading} primary>
        Contribute
      </Button>
      <Message error header="Oops!" content={error} />
    </Form>
  );
};

export default ContributeForm;
