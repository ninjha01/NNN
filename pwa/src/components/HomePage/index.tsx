import * as React from "react";
import { useState } from "react";
import { Container } from "react-bootstrap";
import { ToastMaster } from "../common/ToastMaster";
import { NavBar } from "../NavBar";

interface HomePageProps {
  token: any;
}

const HomePage = (props: HomePageProps) => {
  const [toastMsgs, setToastMsgs] = useState<string[]>([]);

  const queueMsg = (msg: string) =>
    setToastMsgs((old: string[]) => [...old, msg]);

  return (
    <div style={{ height: "110vh" }}>
      <NavBar />
      <Container
        fluid
        style={{
          height: "100%",
          padding: 16,
        }}
      >
        Hello World
        <ToastMaster msgs={toastMsgs} />
      </Container>
    </div>
  );
};
export default HomePage;
