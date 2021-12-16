import React from "react";
import HeadingWithContent from "@/components/blocks/HeadingWithContent";
import { Element, useEditor } from "@craftjs/core";

const Sidebar = () => {
  const { connectors, query } = useEditor();
  const { actions, selected } = useEditor((state) => {
    const currentNodeId = [...state.events.selected][0];
    let selected;

    if (currentNodeId) {
      selected = {
        id: currentNodeId,
        displayName: state.nodes[currentNodeId].data.displayName,
        name: state.nodes[currentNodeId].data.name,
        settings: state.nodes[currentNodeId].related && state.nodes[currentNodeId].related.settings,
      };
      // console.log(selected);
    }

    return {
      selected,
    };
  });

  return (
    <>
      {selected ? (
        <div className="theme-column text-theme-text w-full max-w-sm bg-white border-r border-theme-border">
          <div className="theme-box bg-white py-4 px-4">
            <div className="theme-box">
              <div className="text-sm breadcrumbs">
                <ul>
                  <li
                    className="cursor-pointer hover:theme-primary"
                    onClick={() => {
                      actions.clearEvents();
                    }}
                  >
                    <span className="text-theme-primary">Home</span>
                  </li>
                  <li>
                    <span
                      style={{ width: "200px" }}
                      className="text-gray-400 truncate cursor-not-allowed"
                    >
                      {selected.displayName}
                    </span>
                  </li>
                </ul>
              </div>
              <h2 className="text-xl font-medium">{selected.displayName}</h2>
            </div>
          </div>
          <div className="theme-box text-theme-text-light border-t border-theme-border">
            <div className="theme-row bg-theme-panel-dark flex flex-items-center">
              <div className="theme-column w-full max-w-100 text-left">
                <div className="theme-box px-4 py-4 border-theme-border border-b cursor-pointer">
                  Content
                </div>
              </div>
            </div>
          </div>
          <div
            style={{ height: "calc(100vh - 57px - 60px - 125px)" }}
            className="theme-box py-5 px-4 bg-theme-panel overflow-y-scroll pb-52"
          >
            {selected.settings && React.createElement(selected.settings)}
          </div>
        </div>
      ) : (
        <div className="theme-column text-theme-text w-full max-w-sm bg-white border-r border-theme-border">
          <div className="theme-box bg-white py-4 px-4">
            <div className="theme-box">
              <h2 className="text-xl font-medium">Edit page</h2>
            </div>
          </div>
          <div className="theme-box text-theme-text-light border-t border-theme-border">
            <div className="theme-row bg-theme-panel-dark flex flex-items-center">
              <div className="theme-column w-full max-w-1/2 bg-theme-panel text-center">
                <div className="theme-box px-4 py-4 border-r border-theme-border font-normal border-b cursor-pointer">
                  Add
                </div>
              </div>
              <div className="theme-column w-full max-w-1/2 text-center">
                <div className="theme-box px-4 py-4 border-theme-border border-b cursor-pointer">
                  Contents
                </div>
              </div>
            </div>
          </div>
          <div
            style={{ height: "calc(100vh - 57px - 60px - 125px)" }}
            className="theme-box py-2 px-4 bg-theme-panel overflow-y-scroll pb-24"
          >
            <div className="theme-box text-theme-text-light py-4">
              <h2 className="font-medium">All Layouts</h2>
            </div>
            <div className="theme-row flex flex-wrap -mx-1">
              {Array.from(Array(10).keys()).map((elem, index) => (
                <div
                  ref={(ref) => connectors.create(ref, <HeadingWithContent />)}
                  key={index}
                  className="theme-column mb-4 px-1 w-full max-w-1/3"
                >
                  <div className="theme-box text-center text-theme-text-light  bg-white border border-theme-border px-2 py-2 cursor-grab rounded flex flex-col justify-between">
                    <div className="theme-box dots mb-2">
                      <span className="block">······</span>
                      <span className="block">······</span>
                    </div>
                    <div className="theme-box flex justify-center" style={{ color: "#7c98b6" }}>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-10 w-10"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
                        />
                      </svg>
                    </div>
                    <div className="theme-box">
                      <span className="text-xs">Layout Name</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;
