import React from "react";
import { useAppContext } from "@/context/AppWrapper";

const Drawer = (props) => {
  const { handlers } = useAppContext();
  return (
    <>
      <div
        className={`COMPONENT__tint ${
          props.active && `COMPONENT__tint-active`
        } tint w-full h-full fixed inset-0 bg-gray-700 bg-opacity-80 CUSTOM__z-index-high`}
      ></div>
      <div
        className={`COMPONENT__drawer ${
          props.active && `COMPONENT__drawer-active`
        } bg-white flex flex-col fixed top-0 right-0 bottom-0 w-full max-w-md CUSTOM__z-index-most-high`}
      >
        <div className="COMPONENT__drawer__header bg-theme-notify px-6 py-5 text-white">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-medium">Upload Image</h2>
            </div>
            <div className="flex justify-between flex-col items-center">
              <button
                onClick={handlers.handleDrawer}
                className="cursor-pointer block"
                type="button"
                aria-label="Close Drawer"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
        <div className="COMPONENT__drawer__body h-full px-6 py-5"></div>
        <div className="COMPONENT__drawer__footer px-6 py-5 bg-theme-panel border-t-2 border-theme-border">
          <div className="flex">
            <button
              type="button"
              className="px-6 py-2 rounded border border-theme-border bg-theme-panel-dark text-theme-text-light text-sm"
            >
              Add Image
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Drawer;
