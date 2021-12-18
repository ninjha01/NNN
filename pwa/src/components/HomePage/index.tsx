import * as React from "react";
import { useState, useEffect } from "react";
import { Form } from "react-bootstrap";
import { Container } from "react-bootstrap";
import {
  initializeMessaging,
  NotificationSource,
  subscribeToTopic,
  unsubscribeFromTopic,
} from "../../firebaseManager";
import { ToastMaster } from "../common/ToastMaster";
import { NavBar } from "../NavBar";

interface HomePageProps {
  currentUserId: any;
}

const HomePage = (props: HomePageProps) => {
  const [toastMsgs, setToastMsgs] = useState<string[]>([]);
  const [sources, setSources] = useState<NotificationSource[]>([]);
  const queueMsg = (msg: string) =>
    setToastMsgs((old: string[]) => [...old, msg]);

  useEffect(() => {
    async function retrieveNotificationSources() {
      const s = await initializeMessaging(props.currentUserId);
      setSources(s);
    }
    retrieveNotificationSources();
  }, []);

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
        {sources.map((source) => (
          <SourceToggle
            key={source.id}
            source={source}
            currentUserId={props.currentUserId}
          />
        ))}
        <ToastMaster msgs={toastMsgs} />
      </Container>
    </div>
  );
};

const SourceToggle = (props: {
  source: NotificationSource;
  currentUserId: string;
}) => {
  const [isSubscribed, setSubscribed] = useState<boolean>(
    props.source.subscribers.includes(props.currentUserId)
  );
  return (
    <Form.Switch
      type="switch"
      id="custom-switch"
      label={props.source.display_name}
      checked={isSubscribed}
      onChange={() => {
        if (isSubscribed) {
          setSubscribed(false);
          unsubscribeFromTopic(props.source.id, props.currentUserId);
        } else {
          setSubscribed(true);
          subscribeToTopic(props.source.id, props.currentUserId);
        }
      }}
    />
  );
};
export default HomePage;
