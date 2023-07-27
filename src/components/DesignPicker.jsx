import React from "react";
import { AiOutlineDropbox } from "react-icons/ai";
import { BsLaptop } from "react-icons/bs";
import { GoTypography } from "react-icons/go";
import { SiShutterstock } from "react-icons/si";
import { PrintInfo } from "./PrintInfo";

export const DesignPicker = ({
    handleFileChange,
    setShowCustomizer,
    addTextBox
}) => {
    const fileInput = useRef(null);
  return (
    <div className="flex flex-col">
      <p className="mt-4 font-medium">Add design from...</p>
      <div className="mt-3 flex flex-col gap-2">
        <div
          onClick={() => {
            fileInput.current.click();
          }}
          className="text-light flex cursor-pointer items-center gap-6 border border-gray-300 p-5 hover:bg-gray-200"
        >
          <BsLaptop className="text-3xl" /> My device
          <input
            className="hidden"
            onChange={handleFileChange}
            type="file"
            ref={fileInput}
          />
        </div>
        <div
          onClick={() => {
            setShowCustomizer(true), addTextBox();
          }}
          className="flex cursor-pointer items-center gap-6 border border-gray-300 p-5 hover:bg-gray-200"
        >
          <GoTypography className="text-3xl" /> Custom Text
        </div>

        <div className="flex cursor-pointer items-center gap-6 border border-gray-300 p-5 hover:bg-gray-200">
          <SiShutterstock className="bg-red-500 p-[2px] text-3xl text-white" />
          <div className="items-left flex flex-col ">
            <p>Shutterstock</p>
            <p className="text-sm text-gray-700">
              Add images for free and pay only after you sell
            </p>
          </div>
        </div>
        <div className="flex cursor-pointer items-center gap-6 border border-gray-300 p-5 hover:bg-gray-200">
          <AiOutlineDropbox className="text-3xl text-blue-500" /> Dropbox
        </div>
        <div className="flex cursor-pointer items-center gap-6 border border-gray-300 p-5 hover:bg-gray-200">
          <img src="/images/gdrive.svg"></img> Google Drive
        </div>
        <div className="flex cursor-pointer items-center gap-6 border border-gray-300 p-5 hover:bg-gray-200">
          <img src="/images/fiverr.svg" />
          <div className="items-left flex flex-col ">
            <p>Fiverr</p>
            <p className="text-sm text-gray-700">
              Hire professional designers on fiverr
            </p>
          </div>
        </div>
      </div>
      <PrintInfo />
    </div>
  );
};
