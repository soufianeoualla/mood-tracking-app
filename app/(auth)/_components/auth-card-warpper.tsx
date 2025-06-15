import Link from "next/link";
import React from "react";

const AuthCardWrapper = ({
  title,
  text,
  bottomLabel,
  bottomHref,
  children,
}: {
  title: string;
  text: string;
  bottomLabel: string;
  bottomHref: string;
  children: React.ReactNode;
}) => {
  const label = bottomLabel.split("?")[0];
  const action = bottomLabel.split("?")[1];

  return (
    <div className="bg-neutral-0 py-10 px-8 w-[530px] rounded-2xl shadow-lg">
      <h3 className="text-preset-3 text-neutral-900 mb-2">{title}</h3>
      <p className="text-preset-6 text-neutral-600">{text}</p>
      {children}

      <div className="mt-6 flex justify-center items-center">
        <Link href={bottomHref} className=" text-preset-6 text-neutral-600">
          {label}
          <span className="text-blue-600">{action}</span>
        </Link>
      </div>
    </div>
  );
};

export default AuthCardWrapper;
