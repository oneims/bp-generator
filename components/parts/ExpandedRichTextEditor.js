import React from "react";
import { useAppContext } from "@/context/AppWrapper";
import { Richtext } from "@/components/core/FormElements";
import { useEditor } from "@craftjs/core";
import { useEditor as useRichTextEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Image from "@tiptap/extension-image";

const ExpandedRichTextEditor = (props) => {
  const { handlers, globalState } = useAppContext();
  const { actions, selected } = useEditor((state) => {
    const currentNodeId = [...state.events.selected][0];
    let selected;

    if (currentNodeId) {
      selected = {
        id: currentNodeId,
        displayName: state.nodes[currentNodeId].data.displayName,
        name: state.nodes[currentNodeId].data.name,
        props: state.nodes[currentNodeId].data.props,
        settings: state.nodes[currentNodeId].related && state.nodes[currentNodeId].related.settings,
      };
    }

    return {
      selected,
    };
  });

  const richTextEditor = useRichTextEditor({
    extensions: [StarterKit, Underline, Image],
    editorProps: {
      attributes: {
        class:
          "prose p-4 focus:outline-none CUSTOM__rich-text-editor__content-editable CUSTOM__rich-text-editor__content-editable-full-height max-w-max",
      },
    },
    content: selected?.props[globalState.richTextSelectedFieldName],
    onUpdate({ editor }) {
      actions.setProp(selected.id, (props) => {
        props[globalState?.richTextSelectedFieldName] = editor.getHTML();
      });
    },
  });

  return (
    <>
      <div className="bg-theme-panel px-8 py-8" style={{ height: "100vh" }}>
        <div className="bg-white px-8 py-10 border border-theme-border">
          <div className="mb-2">
            <span
              className="text-theme-notify text-sm cursor-pointer"
              onClick={() => handlers.handleExpandedRichText(false, null)}
            >
              Back to page
            </span>
          </div>
          <h2 className="text-xl font-medium">Edit Rich Text Content</h2>
          <Richtext expanded wrapperClassName="mt-5" editor={richTextEditor} />
        </div>
      </div>
    </>
  );
};

export default ExpandedRichTextEditor;
