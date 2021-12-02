import React from "react";
import Topbar from "@/components/parts/Topbar";
import Infobar from "@/components/parts/Infobar";

const Header = () => {
  return (
    <header style={{ position: "relative", zIndex: "99999999999999;" }}>
      <Topbar />
      <Infobar />
    </header>
  );
};

export default Header;
