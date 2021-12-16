import React from "react";
import { useState } from "react";
import { useNode } from "@craftjs/core";
import { node } from "prop-types";
import { Textarea, Select, Toggle } from "@/components/core/FormElements";
import { backgroundColor } from "tailwindcss/defaultTheme";

const HeadingWithContent = ({ backgroundColor, heading, content, borderTop, borderBottom }) => {
  const {
    connectors: { connect, drag },
    isActive,
    actions: { setProp },
  } = useNode((node) => ({
    isActive: node.events.selected,
  }));
  return (
    <section
      className={`cursor-grab py-16 ${borderTop && `border-t-2`} ${
        borderBottom && `border-b-2`
      } bg-${backgroundColor.value}`}
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
    backgroundColor,
    borderTop,
    borderBottom,
  } = useNode((node) => ({
    heading: node.data.props.heading,
    content: node.data.props.content,
    backgroundColor: node.data.props.backgroundColor,
    borderTop: node.data.props.borderTop,
    borderBottom: node.data.props.borderBottom,
  }));

  console.log(backgroundColor);

  const backgroundColorOptions = [
    { label: "White", value: "white" },
    { label: "Gray", value: "theme-light" },
    { label: "Sky", value: "theme-panel" },
  ];
  const [backgroundSelected, setbackgroundSelected] = useState(backgroundColor);

  return (
    <>
      <Select
        label="Background Color"
        options={backgroundColorOptions}
        onChange={(value) => {
          setbackgroundSelected(value), setProp((props) => (props.backgroundColor = value));
        }}
        value={backgroundSelected}
      />
      <Textarea
        wrapperClassName="mt-5"
        label="Heading"
        onChange={(e) => setProp((props) => (props.heading = e.target.value))}
        value={heading}
        placeholder="Add Content"
      />
      <Textarea
        wrapperClassName="mt-5"
        label="Content"
        onChange={(e) => setProp((props) => (props.content = e.target.value))}
        value={content}
        placeholder="Add Content"
      />
      <Toggle
        wrapperClassName="mt-5"
        label="Add Border Top"
        onClick={(e) => setProp((props) => (props.borderTop = e.target.checked))}
        value={borderTop}
      />
      <Toggle
        wrapperClassName="mt-5"
        label="Add Border Bottom"
        onClick={(e) => setProp((props) => (props.borderBottom = e.target.checked))}
        value={borderBottom}
      />
    </>
  );
};

HeadingWithContent.craft = {
  displayName: "Heading With Content",
  props: {
    heading: "Large Heading!",
    content:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.",
    backgroundColor: { label: "White", value: "white" },
    borderTop: false,
    borderBottom: false,
  },
  related: {
    settings: HeadingWithContentSettings,
  },
};

export default HeadingWithContent;
