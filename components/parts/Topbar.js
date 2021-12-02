import React from "react";
import Button from "@/components/core/Button";

const Topbar = () => {
  return (
    <div className="py-4 bg-theme-dark text-theme-text-inverted">
      <div className="theme-container mx-auto px-4">
        <div className="theme-row flex items-center -mx-1 justify-between">
          <div className="theme-column px-1">
            <div className="theme-row flex items-center -mx-1">
              <div className="theme-column px-1">
                <Button variant="dark" className="text-xs">
                  Back
                </Button>
              </div>
              <div className="theme-column px-1">
                <Button variant="dark" className="text-xs">
                  Save
                </Button>
              </div>
            </div>
          </div>

          <div className="theme-column px-1">
            <div className="theme-box">
              <h1 className="text-2xl font-medium">Blueprint Generator</h1>
            </div>
          </div>

          <div className="theme-column px-1">
            <div className="theme-box">
              <Button variant="primary" className="text-xs">
                Update
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Topbar;
