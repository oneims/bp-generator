import React from "react";
import { useNode } from "@craftjs/core";

export const Container = ({ children }) => {
  const {
    connectors: { connect, drag },
  } = useNode();
  return <div ref={(ref) => connect(drag(ref))}>{children}</div>;
};
