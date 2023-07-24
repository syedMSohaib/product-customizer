"use client";

import { useState } from "react";
import { CirclePicker } from "react-color";
import Customizer from "../components/Customizer";

// import eventBus from "../lib/EventBus";
import { BiArrowBack } from "react-icons/bi";

export default function Home() {
  const [isFront, setIsFront] = useState(true);

  const onAddTextClick = () => {
    // if (typeof window !== undefined) eventBus.dispatch("addTextBox", {});
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = function () {
      const base64ImageData = reader.result;
      // if (typeof window !== undefined)
        // eventBus.dispatch("addImage", { base64: base64ImageData });
    };

    // Read the file as data URL (base64)
    reader.readAsDataURL(file);
  };

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
      {/* component */}
      { false && (
      <section className="body-font overflow-hidden bg-white text-gray-700">
        <div className="container mx-auto px-5 py-24">
          <div className="mx-auto flex flex-wrap lg:w-full">
            <div className="w-full rounded border border-gray-200 object-cover object-center lg:w-1/2">
              <div className="my-4 flex items-center justify-center gap-4">
                <button
                  onClick={() => setIsFront(true)}
                  className="inline-flex items-center rounded-lg bg-gray-700 px-3 py-2 text-center text-sm font-medium text-white hover:bg-gray-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-gray-600 dark:hover:bg-gray-700 dark:focus:ring-gray-800"
                >
                  Front
                </button>
                <button
                  onClick={() => setIsFront(false)}
                  className="inline-flex items-center rounded-lg bg-gray-700 px-3 py-2 text-center text-sm font-medium text-white hover:bg-gray-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-gray-600 dark:hover:bg-gray-700 dark:focus:ring-gray-800"
                >
                  Back
                </button>
              </div>
              {/* <Customizer isFront={isFront} /> */}
              {/* <canvas ref={setCanvasElRef} /> */}
            </div>
            <div className="mt-6 w-full lg:mt-0 lg:w-1/2 lg:py-6 lg:pl-10">
              <h2 className="title-font text-sm tracking-widest text-gray-500">
                t-shirt
              </h2>
              <h1 className="title-font mb-1 text-3xl font-medium text-gray-900">
                Unisex Heavy Cotton Tee
              </h1>

              <p className="leading-relaxed">
                Gildan 5000
                <ul className="ml-2 mt-2">
                  <li className="ml-2 list-disc">
                    Medium fabric (5.3 oz/yd² (180 g/m²))
                  </li>
                  <li className="ml-2 list-disc">Classic fit</li>
                  <li className="ml-2 list-disc">Runs true to size</li>
                  <li className="ml-2 list-disc">
                    100% cotton (fiber content may vary for different colors)
                  </li>
                  <li className="ml-2 list-disc">Tear-away label</li>
                </ul>
              </p>
              <div className="mb-5 mt-6 flex flex-col items-start border-b-2 border-gray-200 pb-5">
                <div className="flex flex-col gap-2">
                  <span className="font-bold">Color: </span>
                  <CirclePicker
                    onChangeComplete={(color) =>
                      eventBus.dispatch("changeBgColor", { color: color.hex })
                    }
                  />
                </div>
                <div className="mt-5 flex ">
                  <span
                    onClick={onAddTextClick}
                    className="mr-3 cursor-pointer rounded-md p-3 ring-2 ring-gray-400 hover:bg-gray-200"
                  >
                    Add Text Box
                  </span>
                </div>
                <div className="mt-5 flex flex-col">
                  <span className="block font-bold">
                    Upload Image / Artwork:{" "}
                  </span>
                  <input
                    onChange={handleFileChange}
                    type="file"
                    className="mt-3 w-full"
                  />
                </div>
              </div>

              <div className="flex">
                <span className="title-font text-2xl font-medium text-gray-900">
                  $100.00
                </span>
                <button className="ml-auto flex rounded border-0 bg-red-500 px-6 py-2 text-white hover:bg-red-600 focus:outline-none">
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        </div>
      </section> ) }
    </>
  );
}
