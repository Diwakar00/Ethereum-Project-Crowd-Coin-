import { useState } from "react";
import { Layout } from "../../components/Layout";
import { Form, Button, Input, Message } from "semantic-ui-react";
import { factory } from "../../ethereum/factory";
import web3 from "../../ethereum/web3";
import { Router } from "../../routes";

const NewCampaign = () => {
  const [minimumContribution, setMinimumContribution] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const accounts = await web3.eth.getAccounts();
      await factory.methods
        .createCampaign(minimumContribution)
        .send({ from: accounts[0] });
      Router.push("/");
    } catch (e) {
      setError(e.message);
    }
    setLoading(false);
  };

  return (
    <Layout>
      <h3>Create campaign!!!</h3>
      <Form onSubmit={onSubmit} error={!!error}>
        <Form.Field>
          <label>Minimum Contribution</label>
          <Input
            label="wei"
            labelPosition="right"
            value={minimumContribution}
            onChange={(e) => setMinimumContribution(e.target.value)}
          />
        </Form.Field>
        <Message error header="Oops!" content={error} />
        <Button loading={loading} primary>
          Create
        </Button>
      </Form>
    </Layout>
  );
};

export default NewCampaign;
