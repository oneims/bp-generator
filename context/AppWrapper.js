import { createContext, useContext, useState } from "react";

const AppContext = createContext();

export function AppWrapper({ children }) {
  const [globalState, setGlobalState] = useState({
    drawerOpen: false,
  });

  const handlers = {
    handleDrawer: () => {
      console.log("clicked");
      if (globalState.drawerOpen) {
        setGlobalState({
          ...globalState,
          drawerOpen: false,
        });
      } else {
        setGlobalState({
          ...globalState,
          drawerOpen: true,
        });
      }
    },
  };

  return <AppContext.Provider value={{ globalState, handlers }}>{children}</AppContext.Provider>;
}

export function useAppContext() {
  return useContext(AppContext);
}
