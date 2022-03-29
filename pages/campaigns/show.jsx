import { Layout } from "../../components/Layout";
import { getCampaignInstance } from "../../ethereum/campaign";
import { Button, Card, Grid } from "semantic-ui-react";
import web3 from "../../ethereum/web3";
import ContributeForm from "../../components/ContributeForm";
import { Link } from "../../routes";

const Show = (props) => {
  const {
    totalContribution,
    minimumContribution,
    totalRequests,
    noOfContributors,
    manager,
    address,
  } = props;

  const getSummaryObjects = () => {
    return [
      {
        header: manager,
        meta: "Address of Manager",
        description: "The manager created campaign can create requests",
        style: { overflowWrap: "break-word" },
      },
      {
        header: minimumContribution,
        meta: "Minimum contribution in Wei",
        description:
          "You must pay the minimum contribution to become contributor/approver",
        style: { overflowWrap: "break-word" },
      },
      {
        header: totalRequests,
        meta: "Total requests",
        description: "All the open and closed requests tried to withdraw money",
        style: { overflowWrap: "break-word" },
      },
      {
        header: noOfContributors,
        meta: "Number of Contributors/Approvers",
        description: "All the people who contributed in this campaign",
        style: { overflowWrap: "break-word" },
      },
      {
        header: web3.utils.fromWei(totalContribution, "ether"),
        meta: "Total contribution",
        description: "The total number of ether contributed to this campaign",
        style: { overflowWrap: "break-word" },
      },
    ];
  };

  return (
    <Layout>
      <h1>Campaign Show</h1>
      <Grid>
        <Grid.Row>
          <Grid.Column width={10}>
            <Card.Group items={getSummaryObjects()} />
          </Grid.Column>
          <Grid.Column width={6}>
            <ContributeForm address={address} />
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column>
            <Link route={`/campaigns/${address}/requests`}>
              <a>
                <Button primary>View Requests</Button>
              </a>
            </Link>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </Layout>
  );
};

export async function getServerSideProps(props) {
  const campaign = await getCampaignInstance(props.query.address);
  const summaryDetails = await campaign.methods.getSummary().call();
  return {
    props: {
      totalContribution: summaryDetails[0],
      minimumContribution: summaryDetails[1],
      totalRequests: summaryDetails[2],
      noOfContributors: summaryDetails[3],
      manager: summaryDetails[4],
      address: props.query.address,
    },
  };
}

export default Show;
