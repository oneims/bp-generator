import React from "react";

const FrameFooter = () => {
  return (
    <div className="bg-gray-900">
      <div className="px-4 flex items-center flex-col justify-between py-4">
        <p className="text-sm text-gray-300 mb-0">
          © Copyright {new Date().getFullYear()} OneIMS. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default FrameFooter;
