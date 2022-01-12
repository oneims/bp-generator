import React, { useState } from "react";
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

// Compressor
import lz from "lzutf8";

// Fetchers
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
  const [json, setJson] = useState(null);
  const [renderLayers, setRenderLayers] = useState(false);
  const handleRenderLayers = () => {
    setTimeout(() => {
      setRenderLayers(renderLayers ? false : true);
    }, 50);
  };
  let pageData;
  if (data) {
    pageData = data.data.attributes;
    console.log(lz.decompress(lz.decodeBase64(pageData.draftEditorState)));
    if (pageData.drafteEditorState) {
      setJson(lz.decompress(lz.decodeBase64(pageData.draftEditorState)));
    }
  }

  console.log(pageData);

  const updatePageDraft = (updatedData) => {
    setUpdatePage((prevState) => ({ ...prevState, isLoading: true }));
    const payload = {
      data: {
        draftTitle: updatedData.draftTitle,
        draftDescription: updatedData.draftDescription,
        draftEditorState: updatedData.draftEditorState,
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
              return {
                ...data,
                data: {
                  ...data.data,
                  attributes: {
                    ...data.data.attributes,
                    title: updatedData.blueprintTitle,
                  },
                },
              };
            },
            false
          );
          setUpdatePage((prevState) => ({
            ...prevState,
            response: res.data.data,
            isLoading: false,
          }));
          mutate(`${process.env.NEXT_PUBLIC_API_URL}/blueprint-pages/${pageId}?populate=blueprint`);
        })
        .catch((err) => {
          console.log(err);
          setUpdatePage((prevState) => ({ ...prevState, isError: true, isLoading: false }));
        });
    };
    putPayload();
  };

  return (
    <>
      <div className="h-screen overflow-hidden">
        <Editor
          indicator={{
            success: "#0091ae",
            error: "#e34850",
            transition: "0s ease",
            thickness: 5,
          }}
          resolver={{ Container, HeadingWithContent, SimpleContent }}
        >
          <Header
            updatePageDraft={updatePageDraft}
            router={router}
            clientId={id}
            pageData={data ? pageData : null}
          />
          <Main>
            <div className="theme-row flex">
              <Sidebar renderLayers={renderLayers} handleRenderLayers={handleRenderLayers} />
              <div className="overflow-hidden w-full ">
                <div
                  className="theme-column w-full pb-20 overflow-y-scroll"
                  style={{ height: "100vh" }}
                >
                  <div className="w-full bg-theme-panel-dark text-theme-text py-1 text-center">
                    <div className="container mx-auto px-4">
                      <span className="text-xs block">Powered by OneIMS</span>
                    </div>
                  </div>
                  <div
                    className="pb-10 BS_ENABLED COMPONENT__editor"
                    onClick={() => setRenderLayers(false)}
                  >
                    {data && (
                      <Frame data={lz.decompress(lz.decodeBase64(pageData.draftEditorState))}>
                        <Element is={Container} padding={0} background="#fff" canvas></Element>
                      </Frame>
                    )}
                    <div></div>
                    <div className="w-full bg-gray-900 text-white py-2 text-center">
                      <div className="container mx-auto px-4">
                        <span className="text-xs block">© {new Date().getFullYear()} OneIMS</span>
                      </div>
                    </div>
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
