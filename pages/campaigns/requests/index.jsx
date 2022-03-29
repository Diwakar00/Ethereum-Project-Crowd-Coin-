import { Button, Table } from "semantic-ui-react";
import { Layout } from "../../../components/Layout";
import { Link } from "../../../routes";
import { getCampaignInstance } from "../../../ethereum/campaign";
import RequestRow from "../../../components/RequestRow";

const RequestIndex = ({ address, requests, totalApprovers, totalRequests }) => {
  const { Header, Row, HeaderCell, Body } = Table;

  return (
    <Layout>
      <h3>Requests</h3>
      <Link route={`/campaigns/${address}/requests/new`}>
        <a>
          <Button primary floated="right" style={{ margin: 10 }}>
            Add Request
          </Button>
        </a>
      </Link>
      <Table>
        <Header>
          <Row>
            <HeaderCell>ID</HeaderCell>
            <HeaderCell>Description</HeaderCell>
            <HeaderCell>Amount</HeaderCell>
            <HeaderCell>Recipient</HeaderCell>
            <HeaderCell>Approval Count</HeaderCell>
            <HeaderCell>Approve</HeaderCell>
            <HeaderCell>Finalize</HeaderCell>
          </Row>
        </Header>
        <Body>
          {requests.map((request, i) => (
            <RequestRow
              key={i}
              id={i}
              request={request}
              address={address}
              totalApprovers={totalApprovers}
            />
          ))}
        </Body>
      </Table>
      <div>Found {totalRequests} requests</div>
    </Layout>
  );
};

export async function getServerSideProps(props) {
  const campaign = await getCampaignInstance(props.query.address);
  const summaryDetails = await campaign.methods.getSummary().call();
  const totalRequests = summaryDetails[2];
  let requests = [];
  for (let i = 0; i < totalRequests; i++) {
    requests.push(await campaign.methods.requests(i).call());
  }
  requests = requests.map((request) => {
    const { description, value, recepient, approvals, completed } = request;
    return { description, value, recepient, approvals, completed };
  });

  return {
    props: {
      address: props.query.address,
      requests,
      totalApprovers: summaryDetails[3],
      totalRequests,
    },
  };
}

export default RequestIndex;
