"use client";

import { fabric } from "fabric";
// import FontPicker from "font-picker-react";
import FontPicker from "react-fontpicker-ts";
import { useEffect, useRef, useState } from "react";
import { CirclePicker } from "react-color";
import {
  AiOutlineDropbox,
  AiOutlineFontColors,
  AiOutlinePlus,
} from "react-icons/ai";
import { BiAlignMiddle } from "react-icons/bi";
import {
  BsFillTrashFill,
  BsJustify,
  BsJustifyLeft,
  BsJustifyRight,
  BsLaptop,
  BsTrash,
} from "react-icons/bs";
import {
  MdOutlineVerticalAlignBottom,
  MdVerticalAlignCenter,
} from "react-icons/md";
import { GoTypography } from "react-icons/go";
import { SiShutterstock } from "react-icons/si";

// import eventBus from "../lib/EventBus";
import { Popover } from "react-tiny-popover";

const WIDTH = 900;
const HEIGHT = 600;

const API_KEY = "AIzaSyBDxfunY1Kyy4TUqCK3Dm96EBUsOJuTIIs";

const Customizer = ({ isFront, children = "" }) => {
  const fabricRef = useRef(null);
  const canvasRef = useRef(null);
  const toolbarRef = useRef(null);
  const fileInput = useRef(null);
  const [elementsRefs, setElementsRef] = useState([]);
  const [showToolbar, setShowToolbar] = useState(false);
  const [activeObject, setActiveObject] = useState(null);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [activeFont, setActiveFont] = useState("open sans");
  const [isTextColorPicker, setIsTextColorPicker] = useState(false);
  const [showCustomizer, setShowCustomizer] = useState(false);

  let boundary;
  let productSvg;

  const initFabric = () => {
    fabricRef.current = new fabric.Canvas(canvasRef.current);
    fabricRef.current.setWidth(WIDTH);
    fabricRef.current.setHeight(HEIGHT);
  };

  const createBoundingBox = () => {
    const canvas = fabricRef.current;
    boundary = new fabric.Rect({
      name: "boundary",
      top: 200,
      left: 365,
      width: 172,
      height: 230,
      fill: "transparent",
      stroke: "black",
      strokeWidth: 1,
      selectable: false, // To prevent the boundary from being selectable
      strokeDashArray: [5, 5],
    });
    canvas.renderAll();
    canvas.add(boundary);
  };

  const attachShirtBackground = (url) => {
    const canvas = fabricRef.current;

    fabric.loadSVGFromURL("images/front.svg", function (objects, options) {
      var svg = fabric.util.groupSVGElements(objects, options);

      // Calculate the center coordinates of the canvas
      var centerX = canvas.getWidth() / 2;
      var centerY = canvas.getHeight() / 2;

      // Set the position of the SVG at the center of the canvas
      svg.left = centerX - svg.width / 2;
      svg.top = centerY - svg.height / 2;

      const scaleFactor = Math.min(
        canvas.getWidth() / svg.width,
        canvas.getHeight() / svg.height,
      );

      console.log(scaleFactor);
      svg.scale(scaleFactor);

      svg.viewportHeight = canvas.getHeight();
      svg.viewportWidth = canvas.getWidth();
      svg.selectable = false;
      svg.setCoords();
      svg.name = "product_image";

      productSvg = svg;

      // Add the SVG object to the canvas
      canvas.add(svg);
    });

    canvas.renderAll();
  };

  const addTextBox = () => {
    const canvas = fabricRef.current;

    const centerPoint = boundary.getCenterPoint();

    // Calculate the top and left coordinates from the center point
    const topFromCenter = centerPoint.y;
    const leftFromCenter = centerPoint.x;
    const scaleX = boundary.scaleX || 1;
    const scaleY = boundary.scaleY || 1;

    console.log(topFromCenter, leftFromCenter);

    var textbox = new fabric.Textbox("Enter Text", {
      fontFamily: "open sans",
      fontSize: 12,
      name: "textbox",
      // top: 200,
      // left: 365,
      top: topFromCenter,
      left: leftFromCenter,
      originX: "center",
      originY: "center",
      scaleX: scaleX,
      scaleY: scaleY,
      onChange: function (e) {
        // This function defines the clipping region for the text box
        console.log("changed");
      },
    });
    textbox.setControlsVisibility({
      mb: false,
      mt: false,
      mr: false,
      ml: false,
    });

    while (textbox.textLines.length > 1) {
      textbox.set({ width: textbox.getScaledWidth() + 1 });
    }

    textbox.on("modified", function () {
      // Perform any actions or log the event when the text box is moved
      if (textbox.intersectsWithObject(boundary)) {
        textbox.set("opacity", 1);
      } else {
        textbox.set("opacity", 0);
      }
      canvas.renderAll();
    });
    canvas.on("selection:created", function (event) {
      // Perform any actions or log the event when the text box is selected
      const selectedObject = event.selected;
      console.log(selectedObject[0]);
      setActiveObject(selectedObject[0]);

      selectedObject[0].set({
        borderColor: "#29ab51",
        cornerColor: "#29ab51",
        transparentCorners: false,
        cornerSize: 10,
        cornerStyle: "circle",
      });

      if (selectedObject.length && selectedObject[0]?.name === "textbox") {
        // toolbarRef.current.style.top = (topFromCenter + 50) + "px";
        // toolbarRef.current.style.top = leftFromCenter + "px";
        setShowToolbar(true);
        setActiveFont(selectedObject[0].fontFamily);
        setShowCustomizer(true);
      }
    });
    canvas.on("selection:cleared", function (event) {
      // Perform any actions or log the event when the text box selection is cleared
      const deselectedObject = event.deselected;

      if (deselectedObject.length && deselectedObject[0]?.name === "textbox") {
        setShowToolbar(false);
        // setShowCustomizer(false);
      }

      setActiveObject(null);
    });
    textbox.setControlsVisibility({
      tl: true, // Top-left corner
      br: true, // Bottom-right corner
    });
    canvas.add(textbox);
    canvas.setActiveObject(textbox);
    canvas.renderAll();
    setElementsRef([...elementsRefs, textbox]);
  };

  const changeBgColor = (hex) => {
    const canvas = fabricRef.current;
    const pd = canvas._objects[1]; //will change index later
    console.log(pd); //product image
    pd.getObjects().forEach(function (path) {
      if (path.fill !== "") {
        path.set({ fill: hex });
      }
    });
    canvas.renderAll();
  };

  const changeFont = (font) => {
    const canvas = fabricRef.current;
    if (activeObject && activeObject.type === "textbox") {
      activeObject.set("fontFamily", font);
      console.log(activeObject);
      canvas.renderAll();
    }
  };

  const justifyText = (align) => {
    const canvas = fabricRef.current;
    if (activeObject && activeObject.type === "textbox") {
      activeObject.set("textAlign", align);
      canvas.renderAll();
    }
  };

  const changeTextColor = (color) => {
    const canvas = fabricRef.current;
    if (activeObject && activeObject.type === "textbox") {
      activeObject.set("fill", color);
      canvas.renderAll();
    }
  };

  const attachImage = (base64) => {
    const canvas = fabricRef.current;
    fabric.Image.fromURL(base64, function (img) {
      img.scale(0.1);
      img.set({
        name: "design",
        left: 100,
        top: 100,
        angle: 0,
        padding: 10,
        cornersize: 10,
        hasRotatingPoint: true,
      });
      canvas.add(img).renderAll();
      setElementsRef([...elementsRefs, img]);
      canvas.setActiveObject(img);
    });

    setShowCustomizer(true);
    canvas.renderAll();
  };

  useEffect(() => {
    const url = isFront ? "/images/front.png" : "/images/back.png";
    initFabric();
    attachShirtBackground(url);
    createBoundingBox();
  }, []);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = function () {
      const base64ImageData = reader.result;
      if (typeof window !== undefined) attachImage(base64ImageData);
      // eventBus.dispatch("addImage", { base64: base64ImageData });
    };

    // Read the file as data URL (base64)
    reader.readAsDataURL(file);
  };

  useEffect(() => {
    const canvas = fabricRef.current;
    window.canvas = fabricRef.current;

    //If text is moving and its outside the boundary, hide it
    canvas.on("object:moving", function () {
      elementsRefs.forEach(function (object) {
        console.log("isTextbox", object.name);
        if (object.name == "textbox") {
          if (object.intersectsWithObject(boundary)) {
            console.log("yes");
            // object.set('opacity', 1)
          } else {
            console.log("no");
            // object.set('opacity', 0)
          }
        }
      });
      // Render the canvas to update the visibility of the objects
      // canvas.renderAll()
    });

    canvas.on("object:selected", function () {
      const activeObj = o.target;
      console.log("here", activeObj);
      activeObj.set({ borderColor: "#29ab51", cornerColor: "#29ab51" });
      canvas.renderAll();
    });
  }, []);

  return (
    <>
      <div className="grid  grid-flow-row grid-cols-[1.3fr_0.6fr] grid-rows-[0.2fr] bg-white text-black">
        <div className="relative flex items-center">
          <canvas ref={canvasRef} />
          {/* Toolbar */}
          <div
            className="absolute"
            style={{ top: "10%", left: "20%" }}
            ref={toolbarRef}
          >
            {showToolbar && (
              <div className="ml-auto flex justify-center gap-[10px] rounded border-gray-100 bg-gray-200 px-2 py-2  text-black">
                <div className="font-picker max-w-[200px]">
                  <FontPicker
                    defaultValue={activeFont}
                    className="h-full border  bg-gray-50 text-sm text-gray-900 "
                    // apiKey={API_KEY}
                    value={(nextFont) => {
                      // console.log(nextFont), changeFont(nextFont);
                    }}
                  />
                </div>
                <div>
                  <input
                    className="h-full w-[60px] border border-gray-300 bg-gray-50 pl-2"
                    type="number"
                    defaultValue={12}
                  />
                </div>

                <button
                  onClick={() => justifyText("left")}
                  className="bg-white p-2"
                >
                  <BsJustifyLeft />
                </button>
                <button
                  onClick={() => justifyText("justify")}
                  className="bg-white p-2"
                >
                  <BsJustify />
                </button>
                <button
                  onClick={() => justifyText("center")}
                  className="bg-white p-2"
                >
                  <BiAlignMiddle />
                </button>
                <button
                  onClick={() => justifyText("right")}
                  className="bg-white p-2"
                >
                  <BsJustifyRight />
                </button>
                <div className="relative bg-white p-2">
                  <button onClick={() => setShowColorPicker(!showColorPicker)}>
                    <AiOutlineFontColors />
                  </button>
                  {showColorPicker && (
                    <div className="absolute left-1.5 top-[50px] z-10 border border-solid border-gray-200 bg-white p-2.5">
                      <CirclePicker
                        onChangeComplete={(color) => changeTextColor(color.hex)}
                      />
                    </div>
                  )}
                </div>
                <button className="bg-white p-2">
                  <BsTrash />
                </button>
              </div>
            )}
          </div>
        </div>
        <div className="overflow-y-auto border border-t-0 border-gray-300 p-3">
          {/* Add Items area */}
          {!showCustomizer && (
            <>
              <div className="flex gap-2">
                <button className="font-light text-green-500 underline underline-offset-8">
                  New design
                </button>
                <button className="font-light  hover:text-green-500 hover:underline-offset-8">
                  My library
                </button>
                <button className="font-light  hover:text-green-500 hover:underline-offset-8">
                  My templates
                </button>
                <button className="font-light  hover:text-green-500 hover:underline-offset-8">
                  Graphics
                </button>
              </div>
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
                    <AiOutlineDropbox className="text-3xl text-blue-500" />{" "}
                    Dropbox
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
                <div className="mt-3 bg-gray-200 p-3">
                  <p className="text-medium">Print file requirements</p>
                  <ul className="ml-3 mt-1 list-disc">
                    <li className="text-light text-sm">
                      JPG, PNG and SVG file types supported
                    </li>
                    <li className="text-light text-sm">
                      Maximum 105 MB (JPG, PNG) or 21 MB (SVG)
                    </li>
                    <li className="text-light text-sm">
                      Print area size 3600 × 4800 px (300 DPI)
                    </li>
                    <li className="text-light text-sm">
                      Maximum resolution 30000 x 30000 px
                    </li>
                  </ul>
                </div>
              </div>
            </>
          )}

          {/* Customize items area */}
          {showCustomizer && elementsRefs.length && (
            <div className="mt-[30px] flex flex-col">
              <div className="me-2 grid grid-cols-[1.3fr] grid-rows-[0.6fr_0.6fr]">
                <div className="flex items-center justify-between border border-gray-300 p-2 pl-8">
                  <p>Color</p>
                  <Popover
                    isOpen={isTextColorPicker}
                    positions={["bottom", "left"]}
                    content={
                      <div className="z-10 border border-solid border-gray-200 bg-white p-2.5">
                        <CirclePicker
                          onChangeComplete={(color) => changeBgColor(color.hex)}
                        />
                      </div>
                    }
                  >
                    <button
                      onClick={() => setIsTextColorPicker(!isTextColorPicker)}
                      className="border border-gray-300 p-2 "
                    >
                      Select
                    </button>
                  </Popover>
                </div>
                <div className="border border-gray-300 p-2 py-3 pl-8">
                  <div className="grid h-[35px] w-[35px] items-center justify-center rounded-full border border-green-500 ">
                    <button className="h-[25px] w-[25px] rounded-full border border-gray-300"></button>
                  </div>
                </div>
              </div>

              <p className="my-6 text-xl font-medium">Your Design</p>

              {elementsRefs.map((element, index) => (
                <div
                  key={`layer_${index}`}
                  className="mb-2 border border-gray-400"
                >
                  <div className="border-solid; flex items-center justify-between gap-3 border-b border-b-[#ccc] p-3">
                    <div className="mr-3">
                      { element.name == 'design' ? <img src={ element.toDataURL({format: 'jpeg', quality: 1 }) } /> : <GoTypography className="text-3xl" /> }
                    </div>
                    <div className="items-left flex flex-1 flex-col">
                      {element.name === "design" ? (
                        <>
                          <p>{"Media Object"}</p>
                          <p className="text-sm text-gray-700">
                            Medium resolution (150 DPI)
                          </p>
                        </>
                      ) : (
                        <>
                          <p>{element.text || "Enter text"}</p>
                          <p className="text-sm text-gray-700">
                            {element.fontFamily || "Roboto"}
                          </p>
                        </>
                      )}
                    </div>
                    <div
                      className="cusror-pointer "
                      onClick={() => setShowCustomizer(false)}
                    >
                      <BsFillTrashFill />
                    </div>
                  </div>

                  <div className="p-3 ">
                    <label className="mb-1 block font-light">Rotate</label>
                    <input
                      type="text"
                      className="h-[40px] w-full border border-gray-300 pl-3"
                      defaultValue={0}
                    />
                  </div>

                  <div className="flex gap-3 p-3">
                    <div className="">
                      <label className="mb-1 block font-light">
                        Position Left %
                      </label>
                      <input
                        type="text"
                        className="h-[40px] w-full border border-gray-300 pl-3"
                        defaultValue={0}
                      />

                      <div className="mt-3 flex justify-evenly">
                        <button className="flex-1 border border-gray-300 p-3 hover:text-green-500">
                          <MdOutlineVerticalAlignBottom className="rotate-90" />
                        </button>
                        <button className="flex-1 border border-gray-300 p-3 hover:text-green-500">
                          <MdVerticalAlignCenter className="rotate-90" />
                        </button>
                        <button className="flex-1 border border-gray-300 p-3 hover:text-green-500">
                          <MdOutlineVerticalAlignBottom className="-rotate-90" />
                        </button>
                      </div>
                    </div>
                    <div className="">
                      <label className="mb-1 block font-light">
                        Position Right %
                      </label>
                      <input
                        type="text"
                        className="h-[40px] w-full border border-gray-300 pl-3"
                        defaultValue={0}
                      />
                      <div className="mt-3 flex justify-evenly">
                        <button className="flex-1 border border-gray-300 p-3 hover:text-green-500">
                          <MdOutlineVerticalAlignBottom className="rotate-180" />
                        </button>
                        <button className="flex-1 border border-gray-300 p-3 hover:text-green-500">
                          <MdVerticalAlignCenter className="" />
                        </button>
                        <button className="flex-1 border border-gray-300 p-3 hover:text-green-500">
                          <MdOutlineVerticalAlignBottom className="" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

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

              <button className="my-4 h-[40px] bg-green-500 text-center text-white">
                Save Product
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Customizer;
