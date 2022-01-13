import React, { useState, useEffect } from "react";
import HeadingWithContent from "@/components/blocks/HeadingWithContent";
import SimpleContent from "@/components/blocks/SimpleContent";
import { Container } from "@/components/blocks/Container";
import { useAppContext } from "@/context/AppWrapper";

import { Editor, Frame, Element } from "@craftjs/core";
import lz from "lzutf8";

// Static Blocks
import FrameHeader from "@/components/blocks/static/FrameHeader";
import FrameFooter from "@/components/blocks/static/FrameFooter";

// Compressor

// Fetchers
import Spinner from "@/components/core/Spinner";
import { useRouter } from "next/router";
import { useSWRConfig } from "swr";
import { useBlueprintPageByIdGET } from "@/lib/Fetcher";

const PagePreview = () => {
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
  let pageData;
  let editorState;
  if (data) {
    pageData = data.data.attributes;
    editorState = pageData.draftEditorState
      ? lz.decompress(lz.decodeBase64(pageData.draftEditorState))
      : pageData.draftEditorState;
  }

  return (
    <>
      <Editor enabled={false} resolver={{ Container, HeadingWithContent, SimpleContent }}>
        <FrameHeader />
        <main>
          <div className="BS_ENABLED">
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
                  style={{ height: "800px" }}
                >
                  <Spinner />
                </div>
              </>
            )}
          </div>
        </main>
        <FrameFooter />
      </Editor>
    </>
  );
};

export default PagePreview;
