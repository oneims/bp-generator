import React from "react";
import PropTypes from "prop-types";

const Button = (props) => {
  let classList = ``;
  if (props.variant === "dark") {
    classList = `border border-white bg-theme-dark text-white`;
  } else if (props.variant === "secondary") {
    classList = `border-theme-secondary bg-theme-secondary text-white`;
  } else {
    classList = `border-theme-primary bg-theme-primary text-white`;
  }
  return (
    <button
      type="button"
      onClick={props.onClick}
      className={`px-6 py-2 rounded ${classList} ${props.className}`}
    >
      {props.children}
    </button>
  );
};

export default Button;

Button.propTypes = {
  variant: PropTypes.string,
  className: PropTypes.string,
};
