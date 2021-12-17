import * as React from "react";
import { Container, Card } from "react-bootstrap";
import { OrgBody } from "../TodoPage/OrgCard/OrgBody";
import { Link } from "react-router-dom";

import { useOnlineStatus } from "../../Hooks/useOnlineStatus";
import { NavBar } from "../NavBar";
import { OrgItem } from "../TodoPage/common";

export const ShareHandler = (props: { token: any }) => {
  const urlParams = new URLSearchParams(window.location.search);
  const title = urlParams.get("title") || "* From share sheet";
  const body = urlParams.get("text") || "From share sheet";
  const isOnline = useOnlineStatus();

  const addToOrgFile = async (title: string, body: string) => {
    if (!isOnline) {
      const prev = localStorage.getItem("localOrgFile") || "";

      localStorage.setItem("localOrgFile", `* ${title}\n  ${body}\n` + prev);
    } else {
      const payload: any = {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: "Bearer " + props.token.access_token,
        },
        credentials: "include",
        method: "post",
        body: JSON.stringify({
          text: `* ${title}\n${body}`,
          org_file_enum: "PERSONAL",
        }),
      };
      try {
        const response = await fetch("/api/org/add", payload);
        const data = await response.json();
        if (data.success) {
          console.log("Added\n", data.added, "successfully");
          return true;
        } else {
          console.log("Recieved error", data.error);
          return null;
        }
      } catch (err) {
        console.log("Failed", err);
        return null;
      }
    }
  };
  addToOrgFile(title, body);
  const orgItem = new OrgItem({ title, body });
  return (
    <>
      <NavBar />
      <Container fluid>
        <Link
          id="todo"
          style={{ fontSize: "1.25rem" }}
          className="nav-link"
          to="/todo"
        >
          {isOnline ? "Added to personal.org" : "Offline: Added to local"}
        </Link>
        <Card style={{ maxWidth: 400, margin: 8 }}>
          <Card.Header as="h5">{title}</Card.Header>
          <Card.Body>
            <OrgBody orgItem={orgItem} setOrgItem={() => {}} />
          </Card.Body>
        </Card>
      </Container>
    </>
  );
};

/* used in service worker */
