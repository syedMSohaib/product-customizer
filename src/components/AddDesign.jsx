import React from "react";
import { AiOutlinePlus } from "react-icons/ai";

export const AddDesign = (
    setShowCustomizer
) => {
  return (
    <div
      onClick={() => setShowCustomizer(false)}
      className="my-4 flex cursor-pointer items-center gap-6 border border-dashed border-gray-300 p-5 hover:text-green-500"
    >
      <AiOutlinePlus className="p-[2px] text-3xl" />
      <div className="items-left flex flex-col ">
        <p>Add Design</p>
        <p className="text-sm text-gray-700">
          Print area size 3600 x 4800 px (300 dpi)
        </p>
      </div>
    </div>
  );
};
