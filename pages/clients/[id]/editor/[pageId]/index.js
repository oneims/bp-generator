import React, { useState, useEffect } from "react";
import Header from "@/components/layouts/editor/Header";
import Sidebar from "@/components/layouts/editor/Sidebar";
import Main from "@/components/layouts/Main";
import HeadingWithContent from "@/components/blocks/HeadingWithContent";
import SimpleContent from "@/components/blocks/SimpleContent";
import Drawer from "@/components/parts/Drawer";
import ImageGallery from "@/components/parts/ImageGallery";
import { Container } from "@/components/blocks/Container";
import { useAppContext } from "@/context/AppWrapper";

import { Editor, Frame, Element } from "@craftjs/core";

// Static Blocks
import FrameHeader from "@/components/blocks/static/FrameHeader";
import FrameFooter from "@/components/blocks/static/FrameFooter";

// Compressor
import lz from "lzutf8";

// Fetchers
import Spinner from "@/components/core/Spinner";
import axios from "axios";
import { Sleeper } from "@/lib/Helpers";
import { useRouter } from "next/router";
import { useSWRConfig } from "swr";
import { useBlueprintPageByIdGET } from "@/lib/Fetcher";

const PageEditor = () => {
  const router = useRouter();
  const { mutate } = useSWRConfig();
  const { pageId, id } = router.query;
  const { data, isLoading, isError } = useBlueprintPageByIdGET(pageId);
  const { globalState, handlers } = useAppContext();
  const [updatePage, setUpdatePage] = useState({
    response: null,
    isLoading: false,
    isError: null,
  });
  const [pageQuery, setPageQuery] = useState(null);
  const [canSave, setCanSave] = useState(false);
  const [editorReady, setEditorReady] = useState(false);
  const [pendingChanges, setPendingChanges] = useState(0);
  const [renderLayers, setRenderLayers] = useState(false);
  const handleRenderLayers = () => {
    setTimeout(() => {
      setRenderLayers(renderLayers ? false : true);
    }, 50);
  };
  let pageData;
  let editorState;
  let clientData;
  if (data) {
    pageData = data.data.attributes;
    clientData = data.data.attributes.client.data.attributes;
    editorState = pageData.draftEditorState
      ? lz.decompress(lz.decodeBase64(pageData.draftEditorState))
      : pageData.draftEditorState;
  }

  // console.log(editorState);

  const updatePageDraft = () => {
    setUpdatePage((prevState) => ({ ...prevState, isLoading: true }));
    const payload = {
      data: {
        draftTitle: pageData.draftTitle,
        draftDescription: pageData.draftDescription,
        draftEditorState: lz.encodeBase64(lz.compress(pageQuery)),
      },
    };
    const putPayload = async () => {
      await axios
        .put(`${process.env.NEXT_PUBLIC_API_URL}/blueprint-pages/${pageId}`, payload)
        .then(Sleeper(500))
        .then((res) => {
          mutate(
            `${process.env.NEXT_PUBLIC_API_URL}/blueprint-pages/${pageId}?populate=blueprint`,
            (data) => {
              console.log(data);
              return {
                ...data,
                draftTitle: pageData.draftTitle,
                draftDescription: pageData.draftDescription,
                draftEditorState: lz.encodeBase64(lz.compress(pageQuery)),
              };
            },
            false
          );
          setUpdatePage((prevState) => ({
            ...prevState,
            response: res.data.data,
            isLoading: false,
          }));
          if (pendingChanges > 0) {
            setCanSave(true);
            setPendingChanges(0);
          } else {
            setCanSave(false);
          }
          console.log(pendingChanges);
          mutate(`${process.env.NEXT_PUBLIC_API_URL}/blueprint-pages/${pageId}?populate=blueprint`);
        })
        .catch((err) => {
          console.log(err);
          setUpdatePage((prevState) => ({ ...prevState, isError: true, isLoading: false }));
        });
    };
    putPayload();
  };

  const autoSave = () => {
    if (canSave && editorReady) {
      updatePageDraft();
    }
  };

  useEffect(() => {
    setTimeout(() => {
      setEditorReady(true);
      console.log("Setting Editor Ready");
    }, 3000);
  }, []);

  useEffect(() => {
    let interval = setInterval(() => {
      autoSave();
    }, 1500);
    return () => {
      clearInterval(interval);
      interval = 0;
    };
  }, [pageQuery, canSave, pendingChanges]);

  return (
    <>
      <div className="h-screen overflow-hidden">
        <Editor
          onNodesChange={(query) => {
            setPageQuery(query.serialize());
            if (editorReady) {
              setCanSave(true);
              setPendingChanges(pendingChanges + 1);
            }
          }}
          indicator={{
            success: "#0091ae",
            error: "#e34850",
            transition: "0s ease",
            thickness: 5,
          }}
          resolver={{ Container, HeadingWithContent, SimpleContent }}
        >
          <Header
            canSave={canSave}
            updatePage={updatePage}
            updatePageDraft={updatePageDraft}
            router={router}
            clientId={id}
            pageData={data ? pageData : null}
            clientData={data ? clientData : null}
          />
          <Main>
            <div className="theme-row flex">
              <Sidebar
                loading={isLoading}
                renderLayers={renderLayers}
                handleRenderLayers={handleRenderLayers}
              />
              <div className="overflow-hidden w-full ">
                <div
                  className="theme-column w-full pb-20 overflow-y-scroll"
                  style={{ height: "100vh" }}
                >
                  <FrameHeader loading={isLoading} clientData={data ? clientData : null} />
                  <div
                    className="pb-10 BS_ENABLED COMPONENT__editor"
                    onClick={() => setRenderLayers(false)}
                  >
                    {data && (
                      <>
                        <Frame data={editorState}>
                          <Element is={Container} padding={0} background="#fff" canvas></Element>
                        </Frame>
                      </>
                    )}
                    {isLoading && (
                      <>
                        <div
                          className="flex justify-center items-center flex-col"
                          style={{ height: "400px" }}
                        >
                          <Spinner />
                        </div>
                      </>
                    )}

                    <div></div>
                    <FrameFooter />
                  </div>
                </div>
              </div>
            </div>
          </Main>
          <Drawer active={globalState.drawerOpen}>
            <ImageGallery />
          </Drawer>
        </Editor>
      </div>
    </>
  );
};

export default PageEditor;
