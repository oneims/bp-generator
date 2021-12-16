import React from "react";
import TextareaAutosize from "react-textarea-autosize";
import { Fragment } from "react";
import { Listbox, Transition } from "@headlessui/react";
import { SelectorIcon } from "@heroicons/react/solid";
import PropTypes from "prop-types";

export const Textarea = (props) => {
  return (
    <>
      <div className={props.wrapperClassName}>
        {props.label && (
          <div className="mb-2">
            <label className="text-theme-text-light font-small block" htmlFor={props.name}>
              {props.label}
            </label>
          </div>
        )}
        <TextareaAutosize
          className="form-control
          block
          w-full
          px-3
          py-1.5
          text-base
          font-normal
          text-gray-700
          bg-white bg-clip-padding
          border border-solid border-gray-300
          rounded
          transition
          ease-in-out
          m-0
          focus:text-gray-700 focus:bg-white focus:border-theme-focus-green focus__shadow-green focus:border-8 focus:outline-none"
          name={props.name}
          type="textarea"
          onChange={props.onChange}
          value={props.value}
          placeholder={props.placeholder}
          style={{ resize: "none" }}
        />
      </div>
    </>
  );
};

export const Select = (props) => {
  const options = props.options;
  const selected = props.value;
  return (
    <div className={props.wrapperClassName}>
      {props.label && (
        <div className="mb-2">
          <label className="text-theme-text-light font-small block" htmlFor={props.name}>
            {props.label}
          </label>
        </div>
      )}
      <div className="w-100">
        <Listbox value={props.value} onChange={props.onChange} name={props.name}>
          <div className="relative mt-1">
            <Listbox.Button
              className="form-control
                block
                w-full
                px-3
                py-1.5
                text-base
                font-normal
                text-gray-700
                bg-white bg-clip-padding
                border border-solid border-gray-300
                rounded
                transition
                ease-in-out
                m-0
                focus:text-gray-700 focus:bg-white focus:border-theme-focus-green focus__shadow-green focus:border-8 focus:outline-none"
            >
              <span className="block truncate">{selected.label}</span>
              <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                <SelectorIcon className="w-5 h-5 text-gray-400" aria-hidden="true" />
              </span>
            </Listbox.Button>
            <Transition
              as={Fragment}
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Listbox.Options className="absolute w-full mt-1 overflow-auto text-base bg-white rounded border border-solid border-gray-200 shadow-lg max-h-60 ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                {options.map((elem, index) => (
                  <Listbox.Option key={index} value={elem}>
                    {({ selected, active }) => (
                      <>
                        <span
                          className={`${
                            selected ? "font-bold" : ""
                          } hover:bg-theme-focus-green-light block truncate py-3 px-3 cursor-pointer`}
                        >
                          {elem.label}
                        </span>
                      </>
                    )}
                  </Listbox.Option>
                ))}
              </Listbox.Options>
            </Transition>
          </div>
        </Listbox>
      </div>
    </div>
  );
};

export const Toggle = (props) => {
  return (
    <>
      <div className={props.wrapperClassName}>
        {props.label && (
          <div className="mb-2">
            <label className="text-theme-text-light font-small block" htmlFor={props.name}>
              {props.label}
            </label>
          </div>
        )}
        <div class="form-control">
          <div class="cursor-pointer label">
            <input
              type="checkbox"
              onChange={props.onChange}
              name={props.name}
              checked={props.value ? `checked` : ``}
              class="toggle border-2 border-theme-primary bg-theme-primary"
            />
          </div>
        </div>
      </div>
    </>
  );
};
