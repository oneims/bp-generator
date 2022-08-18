import React, { useEffect, useState, Fragment } from "react";
import DashboardHeader from "@/components/parts/DashboardHeader";
import PageTitle from "@/components/parts/PageTitle";
import Main from "@/components/layouts/Main";
import ContentWrapper from "@/components/parts/ContentWrapper";
import Link from "next/link";
import Spinner from "@/components/core/Spinner";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { Sleeper } from "@/lib/Helpers";
import { Combobox, Transition } from "@headlessui/react";
import { useBlueprintByIdGET } from "@/lib/Fetcher";
import { useClientsGET } from "@/lib/Fetcher";
import { useRouter } from "next/router";
import { NextSeo } from "next-seo";
import { CheckIcon, SelectorIcon } from "@heroicons/react/solid";

const CloneBlueprint = () => {
  const router = useRouter();
  const { blueprintId, id } = router.query;
  const { data, isLoading, isError } = useBlueprintByIdGET(blueprintId);
  const { data: clientData, isLoading: clientIsLoading, isError: clientIsError } = useClientsGET();
  const [cloneBlueprint, setCloneBlueprint] = useState({
    response: null,
    isLoading: false,
    isError: null,
  });
  const [clonePages, setClonePages] = useState({
    response: null,
    isLoading: false,
    isError: null,
  });
  const [cloning, setCloning] = useState({
    isLoading: false,
    isError: null,
    message: null,
  });
  const [progress, setProgress] = useState(0);
  const [selected, setSelected] = useState({
    id: -1,
    attributes: { title: "Please select from the dropdown list" },
  });
  const [query, setQuery] = useState("");
  let attributes, client, pages, clients, filteredClients;
  if (data) {
    attributes = data.data.attributes;
    client = attributes.client.data.attributes;
    pages = attributes.pages.data;
    pages = pages.sort((a, b) => a.attributes.orderId - b.attributes.orderId);
    // console.log(`blueprintAttributes: `, attributes);
    // console.log(`blueprintPages: `, pages);
  }
  if (clientData) {
    clients = clientData.data;
    filteredClients =
      query === ""
        ? clients
        : clients.filter((item) =>
            item?.attributes?.title
              .toLowerCase()
              .replace(/\s+/g, "")
              .includes(query.toLowerCase().replace(/\s+/g, ""))
          );
  }

  console.log(`Destination Client: `, selected);

  const cloneListOfPagesToDestination = (blueprintId, destinationClientId) => {
    setClonePages((prevState) => ({ ...prevState, isLoading: true }));
    setProgress(50);
    setCloning((prevState) => ({
      ...prevState,
      isLoading: true,
      message: `Cloning ${pages.length} pages. Please don't close this window or refresh. This shouldn't take too long...`,
    }));
    const postPayload = async () => {
      await axios
        .all(
          pages.map((elem) => {
            const { attributes } = elem;
            const data = { ...attributes };
            delete data.createdAt;
            delete data.publishedAt;
            delete data.updatedAt;
            data.blueprint = blueprintId;
            data.client = destinationClientId;
            if (data.publishedAtTimestamp) {
              data.publishedAtTimestamp = new Date().toISOString();
            }
            // console.log(data);
            const payload = {
              data,
            };
            return axios.post(`${process.env.NEXT_PUBLIC_API_URL}/pages/`, payload);
          })
        )
        .then(Sleeper(700))
        .then(
          axios.spread((...res) => {
            setClonePages((prevState) => ({
              ...prevState,
              response: res,
              isLoading: false,
            }));
            toast.success("Blueprint cloned successfully");
            setCloning((prevState) => ({
              ...prevState,
              isLoading: true,
              message: `Cloned ${pages.length} pages successfully. Redirecting to the cloned blueprint`,
            }));
            setProgress(95);
            setTimeout(() => {
              if (typeof window !== "undefined") {
                window.location.href = `/clients/${destinationClientId}/bp/${blueprintId}`;
              }
            }, 1500);
          })
        )
        .catch((err) => {
          console.log(err);
          setClonePages((prevState) => ({
            ...prevState,
            isError: true,
            isLoading: false,
          }));
          setCloning((prevState) => ({
            ...prevState,
            isLoading: false,
            isError: true,
            message: `There was an error cloning this blueprint. Please contact dev team if the error persists.`,
          }));
          toast.error(cloning.message);
        });
    };
    postPayload();
  };

  const cloneBlueprintToDestination = (destinationClientId) => {
    setCloneBlueprint((prevState) => ({ ...prevState, isLoading: true }));
    setProgress(25);
    setCloning((prevState) => ({
      ...prevState,
      isLoading: true,
      message: `Cloning ${attributes.title} to ${selected.attributes.title}. Please don't close this window or refresh. This shouldn't take too long...`,
    }));
    const payload = {
      data: {
        title: `${attributes.title} (Clone)`,
        description: attributes.description,
        client: destinationClientId,
      },
    };
    const postPayload = async () => {
      await axios
        .post(`${process.env.NEXT_PUBLIC_API_URL}/blueprints/`, payload)
        .then(Sleeper(500))
        .then((res) => {
          setCloneBlueprint((prevState) => ({
            ...prevState,
            response: res.data.data,
            isLoading: false,
          }));
          const blueprintId = res.data.data.id;
          cloneListOfPagesToDestination(blueprintId, destinationClientId);
        })
        .catch((err) => {
          console.log(err);
          setCloneBlueprint((prevState) => ({ ...prevState, isError: true, isLoading: false }));
          setCloning((prevState) => ({
            ...prevState,
            isLoading: false,
            isError: true,
            message: `There was an error cloning this blueprint. Please contact dev team if the error persists.`,
          }));
          toast.error(cloning.message);
        });
    };
    postPayload();
  };
  return (
    <>
      <NextSeo
        title={data ? `Clone | Design Lab | OneIMS` : `Clone Blueprint | Design Lab | OneIMS`}
        description={``}
      />
      <DashboardHeader />
      <Main>
        {data && (
          <PageTitle
            title={attributes.title}
            clientTitle={`Back`}
            clientRoute={`/clients/${id}/bp`}
            renderActionButton={false}
          />
        )}
        {isLoading && <PageTitle title="Loading" clientTitle="Loading" renderActionButton />}
        <ContentWrapper>
          {isLoading && (
            <div className="flex justify-center items-center flex-col" style={{ height: "400px" }}>
              <Spinner />
            </div>
          )}
          {data && pages.length < 1 && (
            <div className="max-w-xl w-full mx-auto text-theme-text pt-5">
              <h1 className="text-xl font-medium mb-3">Empty Blueprint</h1>
              <p className="text-sm mb-1">Add pages to your blueprint to make it clonable.</p>
              <Link href={`/clients/${id}/bp/${blueprintId}`}>
                <button
                  type="button"
                  className="px-6 py-2 mt-4 w-max rounded border border-theme-border bg-theme-panel-dark text-theme-text-light text-sm hover:bg-theme-panel-hover"
                >
                  Go Back
                </button>
              </Link>
            </div>
          )}
          {data && pages.length > 0 && (
            <>
              <div className="max-w-xl w-full mx-auto text-theme-text pt-5">
                <h1 className="text-xl font-medium mb-3">Copy blueprint to another client</h1>
                <div className="text-sm">
                  <p className="mb-1">The following blueprint will be copied to another account:</p>
                  <div className="py-3 px-3 border mt-4">
                    <h2 className="text-md font-medium mb-2">Selected Blueprint</h2>
                    <div className="flex">
                      <div className="mr-2">
                        <figure className="mx-0 my-0 px-0 py-0">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
                          </svg>
                        </figure>
                      </div>
                      <div className="">
                        <span>{attributes.title}</span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-5">
                    <h2 className="text-lg font-medium mb-2">Destination Client</h2>
                    {!clientData && (
                      <div
                        className="flex justify-center items-center flex-col"
                        style={{ height: "400px" }}
                      >
                        <Spinner />
                      </div>
                    )}
                    {/* Autocomplete */}
                    {clientData && (
                      <div className="">
                        <Combobox value={selected} onChange={setSelected}>
                          <div className="relative mt-1">
                            <div className="relative w-full cursor-default">
                              <Combobox.Input
                                className="w-full form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-theme-focus-green focus__shadow-green focus:border-8 focus:outline-none"
                                displayValue={(item) => item?.attributes?.title}
                                onChange={(event) => setQuery(event.target.value)}
                              />
                              <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
                                <SelectorIcon
                                  className="h-5 w-5 text-gray-400"
                                  aria-hidden="true"
                                />
                              </Combobox.Button>
                            </div>
                            <Transition
                              as={Fragment}
                              leave="transition ease-in duration-100"
                              leaveFrom="opacity-100"
                              leaveTo="opacity-0"
                              afterLeave={() => setQuery("")}
                            >
                              <Combobox.Options className="absolute z-10 w-full mt-1 overflow-auto text-base bg-white rounded border border-solid border-gray-200 shadow-lg max-h-60 ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                                {filteredClients.length === 0 && query !== "" ? (
                                  <div className="relative cursor-default select-none py-2 px-4 text-gray-700">
                                    Nothing found.
                                  </div>
                                ) : (
                                  filteredClients.map((item) => (
                                    <Combobox.Option
                                      key={item.id}
                                      className={({ active }) =>
                                        `relative cursor-default select-none py-2 pl-10 pr-4 hover:bg-theme-focus-green-light block truncate py-3 px-3 cursor-pointer ${
                                          active ? "font-bold" : ""
                                        }`
                                      }
                                      value={item}
                                    >
                                      {({ selected, active }) => (
                                        <>
                                          <span
                                            className={`block truncate ${
                                              selected ? "font-medium" : "font-normal"
                                            }`}
                                          >
                                            {item?.attributes?.title}
                                          </span>
                                          {selected ? (
                                            <span
                                              className={`absolute inset-y-0 left-0 flex items-center pl-3 ${
                                                active ? "" : "text-teal-600"
                                              }`}
                                            >
                                              <CheckIcon className="h-5 w-5" aria-hidden="true" />
                                            </span>
                                          ) : null}
                                        </>
                                      )}
                                    </Combobox.Option>
                                  ))
                                )}
                              </Combobox.Options>
                            </Transition>
                          </div>
                        </Combobox>
                      </div>
                    )}
                    {/* //Autocomplete */}
                    <div className="mt-3">
                      <button
                        onClick={() => cloneBlueprintToDestination(selected.id)}
                        type="button"
                        className={`
                        ${selected.id === -1 ? `opacity-50 pointer-events-none z-0` : ``}
                        px-6 py-2 mt-4 w-max rounded border border-theme-border bg-theme-panel-dark text-theme-text-light text-sm hover:bg-theme-panel-hover`}
                      >
                        Clone Blueprint
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
          {cloning.isLoading && (
            <>
              <div className="COMPONENT__tint COMPONENT__tint-active backdrop-filter backdrop-blur-sm tint w-full h-full fixed inset-0 bg-gray-700 bg-opacity-80 CUSTOM__z-index-high">
                <div
                  className="absolute top-1/2 left-1/2"
                  style={{ transform: `translate(-50%, -50%)` }}
                >
                  <div>
                    <span className="text-white text-center block mb-4">{cloning.message}</span>
                    <Spinner white />
                    {/* <div className="mt-3 text-center">
                      <progress
                        className="progress progress-success relative CUSTOM__z-index-high w-56 mx-auto"
                        value={progress}
                        max="100"
                      ></progress>
                    </div> */}
                  </div>
                </div>
              </div>
            </>
          )}
        </ContentWrapper>
      </Main>
      <Toaster containerStyle={{ zIndex: 50000000000 }} />
    </>
  );
};

export default CloneBlueprint;
