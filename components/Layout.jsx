import Head from "next/head";
import { Header } from "./Header";
import { Container } from "semantic-ui-react";

export const Layout = ({ children }) => {
  return (
    <Container>
      <Head>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/semantic-ui/dist/semantic.min.css"
        ></link>
      </Head>
      <Header />
      {children}
    </Container>
  );
};
