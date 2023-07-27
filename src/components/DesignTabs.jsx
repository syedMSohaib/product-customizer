import React from "react";

export const DesignTabs = () => {
  return (
    <div className="flex gap-2">
      <button className="font-light text-green-500 underline underline-offset-8">
        New design
      </button>
      <button className="font-light  hover:text-green-500 hover:underline-offset-8">
        My Design
      </button>
      <button className="font-light  hover:text-green-500 hover:underline-offset-8">
        My templates
      </button>
      <button className="font-light  hover:text-green-500 hover:underline-offset-8">
        Graphics
      </button>
    </div>
  );
};
