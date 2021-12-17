import * as React from "react";
import { useState } from "react";
import { Toast } from "react-bootstrap";
export const ToastMaster = (props: { msgs: string[] }) => {
  return (
    <div
      style={{
        position: "fixed",
        width: 300,
        bottom: 100,
        right: 10,
        zIndex: 100,
      }}
    >
      {props.msgs.map((msg, i) => (
        <AutoHideToast key={`toast-${i}`} msg={msg} />
      ))}
    </div>
  );
};

const AutoHideToast = (props: { msg: string }) => {
  const [show, setShow] = useState(true);
  return (
    <Toast onClose={() => setShow(false)} show={show} delay={3000} autohide>
      <Toast.Header>
        <strong className="rounded mr-auto">NNS</strong>
      </Toast.Header>
      <Toast.Body>{props.msg}</Toast.Body>
    </Toast>
  );
};
