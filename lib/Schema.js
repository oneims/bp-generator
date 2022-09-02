export const Schema__Form__Login = {
  fields: [
    {
      label: "Email address",
      name: "email",
      type: "email",
      element: `input`,
      autoComplete: `off`,
      validations: {
        required: {
          value: true,
          message: `Email address is required`,
        },
        pattern: {
          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
          message: `Please enter a valid email address`,
        },
      },
    },
    {
      label: "Password",
      name: "password",
      type: "password",
      element: `input`,
      autoComplete: `off`,
      validations: {
        required: {
          value: true,
          message: `Password is required`,
        },
        minLength: {
          value: 10,
          message: `Must be at least 10 characters`,
        },
      },
    },
  ],
  button: {
    title: `Sign in`,
    type: `submit`,
    variant: `primary`,
    className: `w-full`,
  },
  helpLinkAboveButton: {
    title: null,
    destination: null,
  },
  helpLinkBelowButton: {
    title: null,
    destination: null,
  },
};
