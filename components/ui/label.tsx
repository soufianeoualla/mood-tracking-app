import React from "react";

const Label = ({
  htmlFor,
  children,
}: {
  htmlFor: string;
  children: React.ReactNode;
}) => {
  return (
    <label
      htmlFor={htmlFor}
      className={"text-preset-6 text-neutral-900 capitalize"}
    >
      {children}
    </label>
  );
};

export default Label;
