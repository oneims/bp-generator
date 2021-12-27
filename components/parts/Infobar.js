import React from "react";
import { useAppContext } from "@/context/AppWrapper";

const Infobar = () => {
  const { handlers } = useAppContext();
  return (
    <div className="py-3 bg-white text-theme-text border-b border-theme-border">
      <div className="theme-container mx-auto px-4">
        <div className="theme-row flex items-center -mx-1 justify-end">
          <div className="theme-column px-1">
            <div className="theme-row flex items-center -mx-1">
              <div className="theme-column px-1">
                <button
                  onClick={handlers.handleDrawer}
                  type="button"
                  className="px-6 py-2 rounded border border-theme-border bg-theme-panel text-xs"
                >
                  Preview
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Infobar;
