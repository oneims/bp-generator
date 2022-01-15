import React from "react";
import { useAppContext } from "@/context/AppWrapper";

const Infobar = (props) => {
  const { handlers } = useAppContext();
  return (
    <div className="py-3 bg-white text-theme-text border-b border-theme-border">
      <div className="theme-container mx-auto px-4">
        <div className="theme-row flex items-center -mx-1 justify-between">
          <div className="theme-row flex items-center -mx-1">
            <div className="theme-column px-1">
              <button
                onClick={() => {
                  props.pageSettingsHandler(true);
                  handlers.handleDrawer();
                }}
                type="button"
                className="px-6 flex items-center py-2 rounded border border-theme-border bg-theme-panel-dark text-theme-text-light text-xs hover:bg-theme-panel-hover"
              >
                Page Settings
              </button>
            </div>
            <div className="theme-column ml-1">
              <div
                onClick={props.enableResponsiveMode}
                className="cursor-pointer px-3 py-2 w-max rounded border border-theme-border bg-theme-panel-dark text-theme-text-light text-sm hover:bg-theme-panel-hover"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
                  />
                </svg>
              </div>
            </div>
          </div>
          <div className="theme-column px-1">
            <div className="theme-row flex items-center -mx-1">
              <div className="theme-column px-1">
                <a href={`${props.router.asPath}/preview?ref=editor`} target="_blank">
                  <button
                    type="button"
                    className="px-6 flex items-center py-2 rounded border border-theme-border bg-theme-panel-dark text-theme-text-light text-xs hover:bg-theme-panel-hover"
                  >
                    Preview{" "}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="ml-2 h-3 w-3"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                      />
                    </svg>
                  </button>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Infobar;
