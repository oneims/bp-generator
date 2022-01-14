import React from "react";
import Topbar from "@/components/parts/Topbar";
import Infobar from "@/components/parts/Infobar";

const Header = (props) => {
  return (
    <header style={{ position: "relative", zIndex: "99999999999999" }}>
      <Topbar
        canSave={props.canSave}
        updatePage={props.updatePage}
        updatePageDraft={props.updatePageDraft}
        router={props.router}
        clientId={props.clientId}
        pageData={props.pageData ? props.pageData : null}
        clientData={props.clientData ? props.clientData : null}
      />
      <Infobar
        router={props.router}
        clientId={props.clientId}
        pageData={props.pageData ? props.pageData : null}
        clientData={props.clientData ? props.clientData : null}
      />
    </header>
  );
};

export default Header;
