import React from "react";

const Infobar = (props) => {
  return (
    <div className="py-3 bg-white text-theme-text border-b border-theme-border">
      <div className="theme-container mx-auto px-4">
        <div className="theme-row flex items-center -mx-1 justify-between">
          <div className="theme-column px-1">
            <button
              type="button"
              className="px-6 py-2 rounded border border-theme-border bg-theme-panel text-xs hover:bg-theme-panel-hover"
            >
              Settings
            </button>
          </div>
          <div className="theme-column px-1">
            <div className="theme-row flex items-center -mx-1">
              <div className="theme-column px-1">
                <a href={`${props.router.asPath}/preview?ref=editor`} target="_blank">
                  <button
                    type="button"
                    className="px-6 flex items-center py-2 rounded border border-theme-border bg-theme-panel text-xs hover:bg-theme-panel-hover"
                  >
                    Preview{" "}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="ml-2 h-3 w-3"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
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
