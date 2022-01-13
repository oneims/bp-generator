import React, { useState } from "react";
import Logo from "../../../resources/Logo";
const FrameHeader = () => {
  return (
    <div className="px-4 py-5 mx-auto text-white bg-theme-dark">
      <div className="relative flex grid items-center justify-center">
        <Logo />
      </div>
    </div>
  );
};

export default FrameHeader;
