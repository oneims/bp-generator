import React from "react";
import Button from "@/components/core/Button";
import { useEditor } from "@craftjs/core";
import lz from "lzutf8";

const Topbar = (props) => {
  const { actions, query, enabled } = useEditor((state) => ({
    enabled: state.options.enabled,
  }));

  const pageData = props.pageData ? props.pageData : null;
  return (
    <div className="py-4 bg-theme-dark text-theme-text-inverted">
      <div className="theme-container mx-auto px-4">
        <div className="theme-row flex items-center -mx-1 justify-between">
          <div className="theme-column px-1">
            <div className="theme-row flex items-center -mx-1">
              <div className="theme-column px-1">
                {props.pageData ? (
                  <a href={`/clients/${props.clientId}/bp/${pageData.blueprint.data.id}`}>
                    <Button variant="dark" className="text-xs">
                      Back
                    </Button>
                  </a>
                ) : (
                  <span className="COMPONENT__skeleton-box COMPONENT__skeleton-box-dark mt-2 h-6 w-24 inline-block rounded"></span>
                )}
              </div>
              <div className="theme-column px-1">
                {props.pageData ? (
                  <Button
                    onClick={() => {
                      const json = query.serialize();
                      console.log(json);
                      const updatedData = {
                        draftTitle: pageData.draftTitle,
                        draftDescription: pageData.draftDescription,
                        draftEditorState: lz.encodeBase64(lz.compress(json)),
                      };
                      props.updatePageDraft(updatedData);
                    }}
                    variant="dark"
                    className="text-xs"
                  >
                    Save
                  </Button>
                ) : (
                  <span className="COMPONENT__skeleton-box COMPONENT__skeleton-box-dark mt-2 h-6 w-24 inline-block rounded"></span>
                )}
              </div>
            </div>
          </div>

          <div className="theme-column px-1">
            <div className="theme-box">
              {props.pageData ? (
                <h1 className="text-2xl font-medium">{pageData.draftTitle}</h1>
              ) : (
                <span className="COMPONENT__skeleton-box COMPONENT__skeleton-box-dark mt-2 h-6 w-44 inline-block rounded "></span>
              )}
            </div>
          </div>

          <div className="theme-column px-1">
            <div className="theme-box">
              {props.pageData ? (
                <Button variant="primary" className="text-xs">
                  Publish
                </Button>
              ) : (
                <span className="COMPONENT__skeleton-box COMPONENT__skeleton-box-dark mt-2 h-6 w-24 inline-block rounded"></span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Topbar;
