import { createContext, useContext, useState } from "react";

const AppContext = createContext();

export function AppWrapper({ children }) {
  const [globalState, setGlobalState] = useState({
    drawerOpen: false,
    mediaGalleryFieldSelected: null,
    repeaterMeta: null,
    expandedRichText: false,
    richTextSelected: null,
  });

  const handlers = {
    handleDrawer: (value) => {
      if (globalState.drawerOpen) {
        setGlobalState({
          ...globalState,
          drawerOpen: false,
          mediaGalleryFieldSelected: null,
        });
      } else {
        setGlobalState({
          ...globalState,
          drawerOpen: true,
          mediaGalleryFieldSelected: value,
        });
      }
    },
    handleExpandedRichText: (bool, value) => {
      console.log(globalState);
      setGlobalState({
        ...globalState,
        expandedRichText: bool,
        richTextSelected: value,
      });
    },
    handleRepeaterMeta: (value) => {
      setGlobalState({
        ...globalState,
        repeaterMeta: value,
      });
    },
  };

  return <AppContext.Provider value={{ globalState, handlers }}>{children}</AppContext.Provider>;
}

export function useAppContext() {
  return useContext(AppContext);
}
