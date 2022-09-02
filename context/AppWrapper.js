import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { parseCookies, destroyCookie } from "nookies";

const AppContext = createContext();

export function AppWrapper({ children }) {
  const [richTextMedia, setRichTextMedia] = useState({
    intent: false,
    src: null,
  });
  const [globalState, setGlobalState] = useState({
    drawerOpen: false,
    mediaGalleryFieldSelected: null,
    repeaterMeta: null,
    expandedRichText: false,
    richTextSelectedFieldName: null,
  });
  const [user, setUser] = useState({
    isLoading: true,
    isLoggedIn: false,
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
      setGlobalState({
        ...globalState,
        expandedRichText: bool,
        richTextSelectedFieldName: value,
      });
    },
    handleRichTextImageIntent: (value) => {
      setRichTextMedia({
        ...richTextMedia,
        intent: value,
      });
    },
    handleRichTextImageSource: (value) => {
      setRichTextMedia({
        ...richTextMedia,
        src: value,
      });
    },
    handleRepeaterMeta: (value) => {
      setGlobalState({
        ...globalState,
        repeaterMeta: value,
      });
    },
    checkLogin: async () => {
      let token;
      const cookies = parseCookies();
      const params = `?populate=avatar&populate=followers&populate=following`;
      if (!cookies.token || user.isLoggedIn) {
        setUser((prevState) => ({ ...prevState, isLoading: false }));
        return null;
      }
      setUser((prevState) => ({ ...prevState, isLoading: true }));
      token = cookies.token;
      await axios
        .get(`${process.env.NEXT_PUBLIC_API_URL}/users/me${params}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          setUser((prevState) => ({
            ...prevState,
            ...res.data,
            token: token,
            isLoggedIn: true,
            isLoading: false,
          }));
          return res;
        })
        .catch((err) => {
          console.log(err);
          setUser((prevState) => ({ ...prevState, isLoggedIn: false, isLoading: false }));
          return err.response;
        });
    },
  };

  useEffect(() => {
    handlers.checkLogin();
  }, []);

  return (
    <AppContext.Provider value={{ user, globalState, richTextMedia, handlers }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  return useContext(AppContext);
}
