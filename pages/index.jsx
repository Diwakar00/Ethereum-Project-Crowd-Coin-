import { useEffect } from "react";
import { factory } from "../ethereum/factory";
import { Card, Button } from "semantic-ui-react";
import { Layout } from "../components/Layout";
import { Link } from "../routes";

const CampaignIndex = ({ campaigsList }) => {
  const campaignsArr = () => {
    return campaigsList.map((address) => {
      return {
        header: address,
        description: (
          <Link route={"/campaigns/" + address}>
            <a>view campaign</a>
          </Link>
        ),
        fluid: true,
      };
    });
  };

  return (
    <Layout>
      <h3>Open Campaigns</h3>
      <Link route="/campaigns/new">
        <a>
          <Button
            content="Create Campaign"
            icon="add circle"
            floated="right"
            primary
          />
        </a>
      </Link>
      <Card.Group items={campaignsArr()} />
    </Layout>
  );
};

export async function getServerSideProps() {
  const campaigsList = await await factory.methods.getCampaigns().call();
  return { props: { campaigsList } };
}

export default CampaignIndex;
