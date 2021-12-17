import { User } from "@firebase/auth";
import React, { useState, useEffect } from "react";
import {
  Button,
  ButtonGroup,
  ButtonToolbar,
  Container,
  Form,
} from "react-bootstrap";
import { signIn, signUp, setUserObserver } from "../firebaseManager";
import { NavBar } from "./NavBar";

export const LoginHandler = ({
  setCurrentUserId,
}: {
  setCurrentUserId: (currentUserId: string | null) => void;
}) => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  useEffect(function loadCachedCurrentUser() {
    setUserObserver((user: User | null) =>
      setCurrentUserId(user ? user.uid : null)
    );
  }, []);

  return (
    <Container style={{ width: "100vw" }}>
      <NavBar />
      <Form key={`org-edit-modal`} className="mb-3">
        <Form.Group className="mb-3">
          <Form.Label>Email</Form.Label>
          <Form.Control
            placeholder="Email"
            value={email}
            onChange={(e: any) => setEmail(e.target.value)}
          />
          <Form.Label>Password</Form.Label>
          <Form.Control
            placeholder="Password"
            value={password}
            type="password"
            onChange={(e) => setPassword(e.target.value)}
          />
        </Form.Group>
      </Form>
      <ButtonToolbar
        style={{ margin: 8 }}
        className="justify-content-between"
        aria-label="Toolbar with button groups"
      >
        <ButtonGroup className="mr-2">
          <Button
            variant="info"
            onClick={async () => {
              const uid = await signUp(email, password);
              if (uid) {
                setCurrentUserId(uid);
              }
            }}
          >
            Sign Up
          </Button>
        </ButtonGroup>
        <ButtonGroup className="mr-2">
          <Button
            variant="info"
            onClick={async () => {
              const uid = await signIn(email, password);
              if (uid) {
                setCurrentUserId(uid);
              }
            }}
          >
            Login
          </Button>
        </ButtonGroup>
      </ButtonToolbar>
    </Container>
  );
};
