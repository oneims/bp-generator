import React from "react";
import { Typography } from "@material-ui/core";
import { useNode } from "@craftjs/core";

export const Text = ({ text }) => {
  const {
    connectors: { connect, drag },
  } = useNode();
  return (
    <div ref={(ref) => connect(drag(ref))}>
      <p>{text}</p>
    </div>
  );
};

Text.craft = {
  rules: {
    canDrag: (node) => node.data.props.text != "Drag",
  },
};
