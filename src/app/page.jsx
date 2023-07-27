"use client";

import { useState } from "react";
import Customizer from "../components/Customizer";

// import eventBus from "../lib/EventBus";
import { BiArrowBack } from "react-icons/bi";
import DevToolsDetector from "@/components/DevToolsDetector";
import FontPicker from "react-fontpicker-ts";

export default function Home() {
  const [isFront, setIsFront] = useState(true);

  return (
    <>
    <div className="bg-white text-black grid grid-cols-[1.3fr_0.6fr] grid-rows-[0.2fr] grid-flow-row">
        <div className="flex p-3 gap-6 border border-gray-300">
          <span className="inline-flex justify-center items-center gap-2.5">
            <BiArrowBack /> Back to Catalog
          </span>
          <div className="flex flex-col flex-1">
            <p className="font-bold">Unisex Heavy Cotton Tee</p>
            <p className="text-gray-400 font-extralight">Gildan - 5000 - Fulfilled by Print Geek</p>
          </div>
          <div className="flex">
              <button className="min-w-[100px] p-2 bg-gray-500 text-white">Edit</button>
              <button className="min-w-[100px] p-2 border border-gray-500">Preview</button>
          </div>
        </div>
        <div className="flex p-3 items-center justify-between border border-l-0 border-gray-300">
          <p className="font-medium">Cost: USD 10.63 - 11.76 </p>
          <p className="text-green-500 font-light hover:underline cursor-pointer">Product Variants</p>
        </div>
      </div>


      <Customizer isFront={isFront} />


    </>
  );
}
