import web3 from "../../../ethereum/web3";
import { getCampaignInstance } from "../../../ethereum/campaign";
import { Link, Router } from "../../../routes";
import { Button, Form, Input, Message } from "semantic-ui-react";
import { useState } from "react";
import { Layout } from "../../../components/Layout";

const NewRequest = ({ address }) => {
  const [description, setDescription] = useState("");
  const [value, setValue] = useState("");
  const [recipient, setRecipient] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const accounts = await web3.eth.getAccounts();
      const campaign = await getCampaignInstance(address);
      await campaign.methods
        .createRequest(description, value, recipient)
        .send({ from: accounts[0] });
      Router.pushRoute(`/campaigns/${address}/requests`);
    } catch (e) {
      setError(e.message);
    }
    setLoading(false);
  };

  return (
    <Layout>
      <Link route={`/campaigns/${address}/requests`}>
        <a>Back</a>
      </Link>
      <h3>Create a Request</h3>
      <Form onSubmit={onSubmit} error={!!error}>
        <Form.Field>
          <ladel>Description</ladel>
          <Input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </Form.Field>
        <Form.Field>
          <ladel>Value in Wei</ladel>
          <Input value={value} onChange={(e) => setValue(e.target.value)} />
        </Form.Field>
        <Form.Field>
          <ladel>Recipient</ladel>
          <Input
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
          />
        </Form.Field>
        <Button primary loading={loading}>
          Create Request
        </Button>
        <Message error header="Oops!" content={error} />
      </Form>
    </Layout>
  );
};

export async function getServerSideProps(props) {
  return {
    props: {
      address: props.query.address,
    },
  };
}

export default NewRequest;
