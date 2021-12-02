import React from "react";
import { useNode } from "@craftjs/core";

const HeadingWithContent = ({ backgroundColor, heading, content }) => {
  const {
    connectors: { connect, drag },
  } = useNode();
  return (
    <section
      className={`cursor-grab py-16 border-t-2 border-b-2 bg-${backgroundColor}`}
      ref={(ref) => connect(drag(ref))}
    >
      <div className="container mx-auto px-4">
        <div className="theme-box text-center max-w-4xl mx-auto">
          <h1 className="text-7xl font-black mb-8">{heading}</h1>
        </div>
        <div className="theme-box prose mx-auto text-center">
          <p>{content}</p>
        </div>
      </div>
    </section>
  );
};

export default HeadingWithContent;
