import React from "react";
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

const Boilerplate = () => {
  const { globalState } = useAppContext();
  return (
    <>
      <div className="h-screen overflow-hidden">
        <Header />
        <Editor
          indicator={{
            success: "#0091ae",
            error: "#e34850",
            transition: "0s ease",
            thickness: 5,
          }}
          resolver={{ Container, HeadingWithContent, SimpleContent }}
        >
          <Main>
            <div className="theme-row flex">
              <Sidebar />
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
                  <div className="pb-10 BS_ENABLED">
                    <Frame>
                      <Element is={Container} padding={0} background="#fff" canvas>
                        <HeadingWithContent
                          heading="Meet The Team"
                          content="Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s."
                          backgroundColor={{ label: "White", value: "white" }}
                        />
                        <HeadingWithContent
                          heading="Powerful Section Heading to Insure Readability"
                          content="Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s."
                          backgroundColor={{ label: "Gray", value: "gray" }}
                        />
                        <HeadingWithContent
                          heading="Integrated Marketing Solutions"
                          content="Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s."
                          backgroundColor={{ label: "White", value: "white" }}
                        />
                        <HeadingWithContent
                          heading="OneIMS Website Grader"
                          content="Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s."
                          backgroundColor={{ label: "Gray", value: "gray" }}
                        />
                        <SimpleContent />
                      </Element>
                    </Frame>
                    <div className="w-full bg-gray-900 text-white py-2 text-center">
                      <div className="container mx-auto px-4">
                        <span className="text-xs block">© 2021 OneIMS</span>
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

export default Boilerplate;
