import React, { useEffect, useState, Fragment } from "react";
import DashboardHeader from "@/components/parts/DashboardHeader";
import PageTitle from "@/components/parts/PageTitle";
import Main from "@/components/layouts/Main";
import ContentWrapper from "@/components/parts/ContentWrapper";
import Drawer from "@/components/parts/Drawer";
import { useAppContext } from "@/context/AppWrapper";
import Spinner from "@/components/core/Spinner";
import { useSWRConfig } from "swr";
import axios from "axios";
import { Sleeper } from "@/lib/Helpers";
import { useBlueprintByIdGET } from "@/lib/Fetcher";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { InputLF, TextareaLF } from "@/components/core/FormElements";
import { Dialog, Transition } from "@headlessui/react";
import { format } from "date-fns";
import toast, { Toaster } from "react-hot-toast";

import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";

import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";

import { CSS } from "@dnd-kit/utilities";

const BlueprintSingular = () => {
  const router = useRouter();
  const { mutate } = useSWRConfig();
  const { blueprintId, id } = router.query;
  const { data, isLoading, isError } = useBlueprintByIdGET(blueprintId);
  const { globalState, handlers } = useAppContext();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ mode: "all" });
  const {
    register: registerNewPage,
    handleSubmit: handleSubmitNewPage,
    setError: setErrorNewPage,
    resetField: resetFieldNewPage,
    formState: { errors: errorsNewPage },
  } = useForm({ mode: "all" });
  const [openModal, setOpenModal] = useState(false);
  const [updateBlueprint, setUpdateBlueprint] = useState({
    response: null,
    isLoading: false,
    isError: null,
  });
  const [newPage, setNewPage] = useState({
    response: null,
    isLoading: false,
    isError: null,
  });
  const [updateOrderIds, setUpdateOrderIds] = useState({
    response: null,
    isLoading: false,
    isError: null,
  });

  let attributes, client, pages;
  if (data) {
    attributes = data.data.attributes;
    client = attributes.client.data.attributes;
    pages = attributes.pages.data;
    pages = pages.sort((a, b) => a.attributes.orderId - b.attributes.orderId);
  }

  const updateBlueprintMeta = (updatedData) => {
    setUpdateBlueprint((prevState) => ({ ...prevState, isLoading: true }));
    const payload = {
      data: {
        title: updatedData.blueprintTitle,
        description: updatedData.blueprintDescription,
      },
    };
    const putPayload = async () => {
      await axios
        .put(`${process.env.NEXT_PUBLIC_API_URL}/blueprints/${blueprintId}`, payload)
        .then(Sleeper(500))
        .then((res) => {
          mutate(
            `${process.env.NEXT_PUBLIC_API_URL}/blueprints/${blueprintId}?populate=client&populate=pages`,
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
          setUpdateBlueprint((prevState) => ({
            ...prevState,
            response: res.data.data,
            isLoading: false,
          }));
          mutate(
            `${process.env.NEXT_PUBLIC_API_URL}/blueprints/${blueprintId}?populate=client&populate=pages`
          );
          handlers.handleDrawer();
        })
        .catch((err) => {
          console.log(err);
          setUpdateBlueprint((prevState) => ({ ...prevState, isError: true, isLoading: false }));
        });
    };
    putPayload();
  };

  const createNewPage = (pageData) => {
    setNewPage((prevState) => ({ ...prevState, isLoading: true }));
    const payload = {
      data: {
        title: pageData.pageTitle,
        draftTitle: pageData.pageTitle,
        orderId: pages.length > 0 ? pages[pages.length - 1].attributes.orderId + 1 : 1,
        blueprint: blueprintId,
        client: id,
        status: "draft",
        type: "blueprint",
      },
    };
    const postPayload = async () => {
      await axios
        .post(`${process.env.NEXT_PUBLIC_API_URL}/pages/`, payload)
        .then(Sleeper(500))
        .then((res) => {
          setNewPage((prevState) => ({
            ...prevState,
            response: res.data.data,
            isLoading: false,
          }));
          mutate(
            `${process.env.NEXT_PUBLIC_API_URL}/blueprints/${blueprintId}?populate=client&populate=pages`
          );
          if (typeof window !== "undefined") {
            window.location.href = `/clients/${id}/editor/${res.data.data.id}`;
          }
          setOpenModal(false);
          resetFieldNewPage("pageTitle");
          setErrorNewPage("pageTitle", { type: "required" });
        })
        .catch((err) => {
          console.log(err);
          setNewPage((prevState) => ({ ...prevState, isError: true, isLoading: false }));
        });
    };
    postPayload();
  };

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  function handleDragEnd(event) {
    const { active, over } = event;
    let movedArray;
    const handleOrderIds = () => {
      if (movedArray && movedArray.length < 1) return null;
      setUpdateOrderIds((prevState) => ({ ...prevState, isLoading: true }));
      let endpoints = movedArray.map((elem) => {
        return `${process.env.NEXT_PUBLIC_API_URL}/pages/${elem.id}`;
      });
      const putPayload = async () => {
        await axios
          .all(
            endpoints.map((elem, index) => {
              return axios.put(elem, {
                data: {
                  orderId: index + 1,
                },
              });
            })
          )
          .then(Sleeper(700))
          .then(
            axios.spread((...res) => {
              // mutate(
              //   `${process.env.NEXT_PUBLIC_API_URL}/blueprints/${blueprintId}?populate=client&populate=pages`,
              //   (data) => {
              //     const oldIndex = pages.findIndex((x) => x.id === active.id);
              //     const newIndex = pages.findIndex((x) => x.id === over.id);
              //     movedArray = arrayMove(pages, oldIndex, newIndex);
              //     console.log(movedArray);
              //     return {
              //       ...data,
              //       data: {
              //         ...data.data,
              //         attributes: {
              //           ...data.data.attributes,
              //           pages: {
              //             ...data.data.attributes.pages,
              //             data: movedArray,
              //           },
              //         },
              //       },
              //     };
              //   },
              //   false
              // );
              setUpdateOrderIds((prevState) => ({
                ...prevState,
                response: res,
                isLoading: false,
              }));
              toast.success("Order updated successfully");
            })
            // .catch((err) => {
            //   console.log(err);
            //   setUpdateOrderIds((prevState) => ({
            //     ...prevState,
            //     isError: true,
            //     isLoading: false,
            //   }));
            // })
          );
      };
      putPayload();
    };

    if (active.id !== over.id) {
      mutate(
        `${process.env.NEXT_PUBLIC_API_URL}/blueprints/${blueprintId}?populate=client&populate=pages`,
        (data) => {
          const oldIndex = pages.findIndex((x) => x.id === active.id);
          const newIndex = pages.findIndex((x) => x.id === over.id);
          movedArray = arrayMove(pages, oldIndex, newIndex);
          movedArray.forEach((elem, index) => {
            elem.attributes.orderId = index + 1;
          });
          console.log(`movedArray`, movedArray);
          return {
            ...data,
            data: {
              ...data.data,
              attributes: {
                ...data.data.attributes,
                pages: {
                  ...data.data.attributes.pages,
                  data: movedArray,
                },
              },
            },
          };
        },
        false
      );
      handleOrderIds();
    }
  }

  useEffect(() => {
    setErrorNewPage("pageTitle", { type: "required" });
  }, []);

  return (
    <>
      <DashboardHeader />
      <Main>
        {data && (
          <PageTitle
            title={attributes.title}
            clientTitle={client.title}
            clientRoute={`/clients/${id}/bp`}
            publicURL={`/blueprint/${blueprintId}`}
            renderActionButton
            renderOptionsButton
            actionsOnClick={() => setOpenModal(true)}
            optionsOnClick={() => handlers.handleDrawer()}
          />
        )}
        {isLoading && (
          <PageTitle
            title="Loading"
            clientTitle="Loading"
            renderActionButton
            renderOptionsButton
            onClick={() => setOpenModal(true)}
          />
        )}
        <ContentWrapper>
          {isLoading && (
            <div className="flex justify-center items-center flex-col" style={{ height: "400px" }}>
              <Spinner />
            </div>
          )}
          {data && pages.length < 1 && (
            <div className="max-w-xl w-full mx-auto text-theme-text pt-5">
              <h1 className="text-xl font-medium mb-3">Add Pages to your Blueprint</h1>
              <p className="text-sm mb-1">
                Add pages to your blueprint that prove to be knowledgable for clients. A blueprint
                may consist of multiple pages and acts as a resource for the client&apos;s marketing
                strategy.
              </p>
              <button
                onClick={() => setOpenModal(true)}
                type="button"
                className="px-6 py-2 mt-4 w-max rounded border border-theme-border bg-theme-panel-dark text-theme-text-light text-sm hover:bg-theme-panel-hover"
              >
                Add New Page
              </button>
            </div>
          )}
          {data && pages.length > 0 && (
            <div className="overflow-x-auto border border-theme-border">
              <table className="COMPONENT__table table w-full text-theme-text text-sm">
                <thead className="bg-theme-panel border-b border-theme-border">
                  <tr>
                    <th>Name</th>
                    <th>Last Updated</th>
                    <th>Publish Date</th>
                    <th>Created Date</th>
                  </tr>
                </thead>
                <tbody>
                  <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                  >
                    <SortableContext items={pages} strategy={verticalListSortingStrategy}>
                      {pages.map((elem, index) => (
                        <SortableItem
                          key={elem.id}
                          clientId={id}
                          id={elem.id}
                          index={index}
                          title={elem.attributes?.title}
                          order={elem.attributes?.orderId}
                          status={elem.attributes?.status}
                          createdAt={elem.attributes?.createdAt}
                          updatedAt={elem.attributes?.updatedAt}
                          publishedAt={elem.attributes?.publishedAtTimestamp}
                        />
                      ))}
                    </SortableContext>
                  </DndContext>
                </tbody>
              </table>
            </div>
          )}
          {/* {data && pages.length > 0 && (
            <div className="overflow-x-auto border border-theme-border">
              <table className="COMPONENT__table table w-full text-theme-text text-sm">
                <thead className="bg-theme-panel border-b border-theme-border">
                  <tr>
                    <th>Name</th>
                    <th>Updated Date</th>
                    <th>Created Date</th>
                  </tr>
                </thead>
                <tbody>
                  <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                  >
                    <SortableContext items={items} strategy={verticalListSortingStrategy}>
                      {items.map((elem, index) => (
                        <SortableItem
                          key={elem.id}
                          id={elem.id}
                          title={elem.title}
                          order={elem.orderId}
                          status={elem.status}
                        />
                      ))}
                    </SortableContext>
                  </DndContext>
                </tbody>
              </table>
            </div>
          )} */}
        </ContentWrapper>
      </Main>
      {data && (
        <Drawer
          active={globalState.drawerOpen}
          title="Blueprint Options"
          buttonOneTitle="Save"
          buttonOneDisabled={errors.blueprintTitle}
          buttonOneLoading={updateBlueprint.isLoading}
          buttonOneHandler={handleSubmit(updateBlueprintMeta)}
        >
          <div className="mb-4">
            <h2 className="font-medium text-theme-text">Blueprint Settings</h2>
          </div>

          <>
            <InputLF
              type="text"
              wrapperClassName="mt-5 text-left"
              label="Blueprint Title*"
              name="blueprintTitle"
              defaultValue={attributes.title}
              register={register}
              rest={{ required: true }}
            />
            <TextareaLF
              wrapperClassName="mt-5 text-left"
              label="Blueprint Description"
              name="blueprintDescription"
              defaultValue={attributes.description}
              register={register}
            />
          </>
        </Drawer>
      )}
      <Transition.Root show={openModal} as={Fragment}>
        <Dialog as="div" className="fixed z-10 inset-0 overflow-y-auto" onClose={setOpenModal}>
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
            </Transition.Child>

            {/* This element is to trick the browser into centering the modal contents. */}
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
              &#8203;
            </span>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <Dialog.Title as="h3" className="text-lg leading-6 font-medium text-gray-900">
                      Add a New Page {data && `for ${data.data.attributes.title}`}
                    </Dialog.Title>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        A blueprint may consist of multiple pages and acts as a resource for the
                        client&apos;s marketing strategy.
                      </p>
                    </div>
                    <div className="mt-2">
                      <form onSubmit={handleSubmitNewPage(createNewPage)}>
                        <InputLF
                          type="text"
                          wrapperClassName="mt-5 text-left"
                          label="Page Title*"
                          name="pageTitle"
                          register={registerNewPage}
                          rest={{ required: true }}
                        />
                      </form>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button
                    type="button"
                    className={`${errorsNewPage.pageTitle && `opacity-50 pointer-events-none`} ${
                      newPage.isLoading && `opacity-50 pointer-events-none`
                    } w-full inline-flex justify-center rounded border border-transparent px-6 py-2 bg-theme-primary font-medium text-white hover:bg-theme-primary-hover sm:ml-3 sm:w-auto sm:text-sm`}
                    onClick={handleSubmitNewPage(createNewPage)}
                  >
                    {newPage.isLoading && <Spinner button white />}
                    Create Page
                  </button>
                  <button
                    type="button"
                    className="mt-3 w-full inline-flex justify-center rounded border border-theme-border px-6 py-2 bg-theme-panel-dark text-theme-text-light hover:bg-theme-panel-hover sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                    onClick={() => setOpenModal(false)}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>
      {updateOrderIds.isLoading && (
        <>
          <div className="COMPONENT__tint COMPONENT__tint-active backdrop-filter backdrop-blur-sm tint w-full h-full fixed inset-0 bg-gray-700 bg-opacity-80 CUSTOM__z-index-high">
            <div
              className="absolute top-1/2 left-1/2"
              style={{ transform: `translate(-50%, -50%)` }}
            >
              <div>
                <span className="text-white text-center block mb-4">
                  Updating pages order, this should be quick...
                </span>
                <Spinner white />
              </div>
            </div>
          </div>
        </>
      )}
      <Toaster />
    </>
  );
};

const SortableItem = (props) => {
  const router = useRouter();
  const timestamps = {
    createdAt: {
      date: props?.createdAt ? format(new Date(props?.createdAt), "MMM d, yyyy") : `...`,
      time: props?.createdAt ? format(new Date(props?.createdAt), "hh:mm a") : `...`,
    },
    updatedAt: {
      date: props?.updatedAt ? format(new Date(props?.updatedAt), "MMM d, yyyy") : `N/A`,
      time: props?.updatedAt ? format(new Date(props?.updatedAt), "hh:mm a") : `...`,
    },
    publishedAt: {
      date: props?.publishedAt ? format(new Date(props?.publishedAt), "MMM d, yyyy") : `N/A`,
      time: props?.publishedAt ? format(new Date(props?.publishedAt), "hh:mm a") : `...`,
    },
  };

  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: props.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <tr ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <td>
        <a href={`/clients/${props.clientId}/editor/${props.id}`}>{props.title}</a>
        <span className="text-xs block mb-1 mt-1">Order: {props.order}</span>
        <span className="text-xs block mt-2">
          <div
            className={`indicator w-2 h-2 mr-1 rounded-full ${
              props.status === "published" ? `bg-green-500` : `bg-gray-400`
            }`}
          ></div>{" "}
          {props.status === "published" ? `Published` : `Draft`}
        </span>
      </td>
      <td>
        {timestamps.updatedAt.date ? timestamps.updatedAt.date : `...`}
        <span className="text-xs block">
          {timestamps.updatedAt.time ? timestamps.updatedAt.time : `...`}
        </span>
      </td>
      <td>
        {timestamps.publishedAt.date ? timestamps.publishedAt.date : `...`}
        <span className="text-xs block">
          {timestamps.publishedAt.time ? timestamps.publishedAt.time : ``}
        </span>
      </td>
      <td>
        {timestamps.createdAt.date ? timestamps.createdAt.date : `...`}
        <span className="text-xs block">
          {timestamps.createdAt.time ? timestamps.createdAt.time : ``}
        </span>
      </td>
    </tr>
  );
};

export default BlueprintSingular;
