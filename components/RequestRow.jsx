import { useState } from "react";
import { Table, Button } from "semantic-ui-react";
import web3 from "../ethereum/web3";
import { getCampaignInstance } from "../ethereum/campaign";

const RequestRow = ({ id, request, address, totalApprovers }) => {
  const { description, value, recepient, approvals, completed } = request;
  const { Row, Cell } = Table;

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const approveRequest = async (id) => {
    try {
      const campaign = await getCampaignInstance(address);
      const accounts = await web3.eth.getAccounts();
      await campaign.methods.approveRequest(id).send({ from: accounts[0] });
    } catch (e) {}
  };

  const finalizeRequest = async (id) => {
    try {
      const campaign = await getCampaignInstance(address);
      const accounts = await web3.eth.getAccounts();
      await campaign.methods.transferAmount(id).send({ from: accounts[0] });
    } catch (e) {}
  };

  return (
    <Row disabled={completed}>
      <Cell>{Number(id) + 1}</Cell>
      <Cell>{description}</Cell>
      <Cell>{value + " Wei"}</Cell>
      <Cell>{recepient}</Cell>
      <Cell>{`${approvals}/${totalApprovers}`}</Cell>
      <Cell>
        <Button
          color="green"
          basic
          onClick={() => approveRequest(id)}
          disabled={completed}
        >
          Approve
        </Button>
      </Cell>
      <Cell>
        <Button
          color="teal"
          basic
          onClick={() => finalizeRequest(id)}
          disabled={completed}
        >
          Finalize
        </Button>
      </Cell>
    </Row>
  );
};

export default RequestRow;
