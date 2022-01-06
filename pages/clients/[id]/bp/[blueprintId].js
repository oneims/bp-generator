import React, { useState } from "react";
import DashboardHeader from "@/components/parts/DashboardHeader";
import PageTitle from "@/components/parts/PageTitle";
import Main from "@/components/layouts/Main";
import ContentWrapper from "@/components/parts/ContentWrapper";
import Drawer from "@/components/parts/Drawer";
import { useAppContext } from "@/context/AppWrapper";
import Link from "next/link";

import { useBlueprintByIdGET } from "@/lib/Fetcher";
import { useRouter } from "next/router";

import { useForm } from "react-hook-form";
import { InputLF, TextareaLF } from "@/components/core/FormElements";

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
  const { blueprintId, id } = router.query;
  const { data, isLoading, isError } = useBlueprintByIdGET(blueprintId);
  const { globalState, handlers } = useAppContext();
  let attributes, client;
  if (data) {
    attributes = data.data.attributes;
    client = attributes.client.data.attributes;
  }

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm({ mode: "all" });

  const [items, setItems] = useState([
    {
      id: 1,
      orderId: 1,
      title: "Dummy Page",
    },
    {
      id: 2,
      orderId: 2,
      title: "Dummy Page 2",
    },
    {
      id: 3,
      orderId: 3,
      title: "Dummy Page 3",
    },
    {
      id: 4,
      orderId: 4,
      title: "Dummy Page 4",
    },
    {
      id: 5,
      orderId: 5,
      title: "Dummy Page 5",
    },
    {
      id: 6,
      orderId: 6,
      title: "Dummy Page 6",
    },
  ]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  function handleDragEnd(event) {
    const { active, over } = event;

    if (active.id !== over.id) {
      setItems((items) => {
        const oldIndex = items.findIndex((x) => x.id === active.id);
        const newIndex = items.findIndex((x) => x.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
      setItems((items) => {
        const updatedItems = items.map((elem, index) => {
          const obj = elem;
          obj.orderId = index + 1;
          return obj;
        });
        return arrayMove(updatedItems);
      });
    }
  }

  return (
    <>
      <DashboardHeader />
      <Main>
        {data && (
          <PageTitle
            title={attributes.title}
            clientTitle={client.title}
            clientRoute={`/clients/${id}/bp`}
            renderActionButton
            renderOptionsButton
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
                      />
                    ))}
                  </SortableContext>
                </DndContext>
              </tbody>
            </table>
          </div>
        </ContentWrapper>
      </Main>
      <Drawer active={globalState.drawerOpen} title="Blueprint Options" buttonOneTitle="Save">
        <div className="mb-4">
          <h2 className="font-medium text-theme-text">Blueprint Settings</h2>
        </div>
        {data && (
          <>
            <InputLF
              type="text"
              wrapperClassName="mt-5 text-left"
              label="Blueprint Name*"
              name="blueprintName"
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
        )}
      </Drawer>
    </>
  );
};

const SortableItem = (props) => {
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
        {props.title}
        <span className="text-xs block">Order: {props.order}</span>
      </td>
      <td>
        May 29, 2021<span className="text-xs block">11:55 PM</span>
      </td>
      <td>
        May 29, 2021<span className="text-xs block">11:55 PM</span>
      </td>
    </tr>
  );
};

export default BlueprintSingular;
