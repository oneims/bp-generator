import React from "react";
import { useNode } from "@craftjs/core";
import { node } from "prop-types";

const HeadingWithContent = ({ backgroundColor, heading, content }) => {
  const {
    connectors: { connect, drag },
    isActive,
    actions: { setProp },
  } = useNode((node) => ({
    isActive: node.events.selected,
  }));
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

const HeadingWithContentSettings = () => {
  const {
    actions: { setProp },
    heading,
    content,
  } = useNode((node) => ({
    heading: node.data.props.heading,
    content: node.data.props.content,
  }));
  return (
    <>
      <input
        type="text"
        onChange={(e) => setProp((props) => (props.heading = e.target.value))}
        value={heading}
        placeholder="Add Heading Content"
      />
      <br />
      <input
        type="textarea"
        onChange={(e) => setProp((props) => (props.content = e.target.value))}
        value={content}
        placeholder="Add Texarea Content"
      />
    </>
  );
};

HeadingWithContent.craft = {
  displayName: "Heading With Content",
  related: {
    settings: HeadingWithContentSettings,
  },
};

export default HeadingWithContent;
