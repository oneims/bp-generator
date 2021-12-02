import React from "react";
import Header from "@/components/layouts/editor/Header";
import Main from "@/components/layouts/Main";
import HeadingWithContent from "@/components/blocks/HeadingWithContent";
import { Toolbox } from "../components/Toolbox";
import { SettingsPanel } from "../components/SettingsPanel";
import { Container } from "../components/user/Container";
import { Button } from "../components/user/Button";
import { Card } from "../components/user/Card";
import { Text } from "../components/user/Text";

import { Editor, Frame, Element } from "@craftjs/core";

const Boilerplate = () => {
  return (
    <>
      <div className="h-screen overflow-hidden">
        <Header />
        <Main>
          <div className="theme-row flex">
            <div className="theme-column text-theme-text w-full max-w-sm bg-white border-r border-theme-border">
              <div className="theme-box bg-white py-4 px-4">
                <div className="theme-box">
                  <h2 className="text-xl font-medium">Edit page</h2>
                </div>
              </div>
              <div className="theme-box text-theme-text-light border-t border-theme-border">
                <div className="theme-row bg-theme-panel-dark flex flex-items-center">
                  <div className="theme-column w-full max-w-1/2 bg-theme-panel text-center">
                    <div className="theme-box px-4 py-4 border-r border-theme-border font-normal border-b cursor-pointer">
                      Add
                    </div>
                  </div>
                  <div className="theme-column w-full max-w-1/2 text-center">
                    <div className="theme-box px-4 py-4 border-theme-border border-b cursor-pointer">
                      Contents
                    </div>
                  </div>
                </div>
              </div>
              <div
                style={{ height: "calc(100vh - 57px - 60px - 125px)" }}
                className="theme-box py-2 px-4 bg-theme-panel overflow-y-scroll pb-24"
              >
                <div className="theme-box text-theme-text-light py-4">
                  <h2 className="font-medium">All Layouts</h2>
                </div>
                <div className="theme-row flex flex-wrap -mx-1">
                  {Array.from(Array(10).keys()).map((elem, index) => (
                    <div key={index} className="theme-column mb-4 px-1 w-full max-w-1/3">
                      <div className="theme-box text-center text-theme-text-light  bg-white border border-theme-border px-2 py-2 cursor-grab rounded flex flex-col justify-between">
                        <div className="theme-box dots mb-2">
                          <span className="block">······</span>
                          <span className="block">······</span>
                        </div>
                        <div className="theme-box flex justify-center" style={{ color: "#7c98b6" }}>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-10 w-10"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
                            />
                          </svg>
                        </div>
                        <div className="theme-box">
                          <span className="text-xs">Layout Name</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
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
                <div className="pb-10">
                  <Editor
                    indicator={{
                      success: "#0091ae",
                      error: "#e34850",
                      transition: "0s ease",
                      thickness: 5,
                    }}
                    resolver={{ Card, Button, Text, Container, HeadingWithContent }}
                  >
                    <Frame>
                      <Element is={Container} padding={0} background="#fff" canvas>
                        <HeadingWithContent
                          heading="Meet The Team"
                          content="Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s."
                          backgroundColor="white"
                        />
                        <HeadingWithContent
                          heading="Powerful Section Heading to Insure Readability"
                          content="Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s."
                          backgroundColor="theme-light"
                        />
                        <HeadingWithContent
                          heading="Integrated Marketing Solutions"
                          content="Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s."
                          backgroundColor="white"
                        />
                        <HeadingWithContent
                          heading="OneIMS Website Grader"
                          content="Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s."
                          backgroundColor="theme-panel"
                        />
                      </Element>
                    </Frame>
                  </Editor>
                </div>
              </div>
            </div>
          </div>
        </Main>
      </div>
    </>
  );
};

export default Boilerplate;
