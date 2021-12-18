import { faPlane } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { Nav, Navbar, Spinner, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useOnlineStatus } from "../../Hooks/useOnlineStatus";

const NNS_COMMIT_SHA = "local";
export const NavBar = (props: {
  loading?: boolean;
  loadingCount?: number;
  errorOnClick?: () => void;
}) => {
  const { loading, loadingCount, errorOnClick } = props;
  const isOnline = useOnlineStatus();
  const spinnerVariant = () => {
    if (!loading) {
      return "dark";
    } else if (loadingCount && loadingCount > 0) {
      return "danger";
    } else {
      return "light";
    }
  };
  return (
    <Navbar
      collapseOnSelect
      bg="dark"
      variant="dark"
      expand={false}
      sticky="top"
    >
      <Navbar.Toggle
        style={{ marginLeft: 8 }}
        aria-controls="basic-navbar-nav"
      />
      <Navbar.Brand href="/">
        NNS{" "}
        <span style={{ color: "#444", fontSize: "1rem" }}>
          {NNS_COMMIT_SHA}
        </span>
      </Navbar.Brand>
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="mr-auto">
          <Link
            id="home"
            style={{ fontSize: "1.25rem" }}
            className="nav-link"
            to="/"
          >
            Home
          </Link>
          <Button
            onClick={() => {
              localStorage.clear();
              window.location.reload(true);
            }}
          >
            Reset
          </Button>
        </Nav>
      </Navbar.Collapse>
      <Nav>
        <Spinner
          as="span"
          animation="grow"
          style={{ position: "relative", marginRight: 8 }}
          variant={spinnerVariant()}
        />
        {(loadingCount ? loadingCount : 0) > 0 && (
          <div
            style={{
              position: "absolute",
              top: "50%",
              right: "16px",
              zIndex: 5,
              color: "#e74c3c",
              transform: "translate(-50%, -50%)",
            }}
            onClick={errorOnClick}
          >
            {loadingCount}
          </div>
        )}
        {!isOnline && (
          <FontAwesomeIcon
            icon={faPlane}
            style={{
              position: "relative",
              zIndex: 5,
            }}
          />
        )}
      </Nav>
    </Navbar>
  );
};
