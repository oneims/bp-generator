import React from "react";

const PageTitle = (props) => {
  return (
    <>
      <div
        className={`COMPONENT__page-title py-6 border-theme-border border-b-2 ${props.className}`}
      >
        {props.renderActionButton ? (
          <div className="container mx-auto px-3 text-theme-text">
            <div className="flex justify-between items-center">
              <div className="column">
                <h1 className="text-2xl font-medium">{props.title}</h1>
                {props.renderClientName && <span>Client Name</span>}
              </div>
              <div className="column">
                <button
                  type="button"
                  className="px-6 py-2 mt-4 w-max rounded border border-theme-border bg-theme-panel-dark text-theme-text-light text-sm"
                >
                  Add New
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="container mx-auto px-3 text-theme-text">
            <h1 className="text-2xl font-medium">{props.title}</h1>
            {props.renderClientName && <span>Client Name</span>}
          </div>
        )}
      </div>
    </>
  );
};

export default PageTitle;
