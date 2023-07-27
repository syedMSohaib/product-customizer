"use client";

import { fabric } from "fabric";
import { useEffect, useRef, useState } from "react";
import { CirclePicker } from "react-color";
import {
  BsFillTrashFill
} from "react-icons/bs";
import { GoTypography } from "react-icons/go";
import {
  MdOutlineVerticalAlignBottom,
  MdVerticalAlignCenter,
} from "react-icons/md";
import { Popover } from "react-tiny-popover";
import { v4 } from "uuid";
import { AddDesign } from "./AddDesign";
import { DesignTabs } from "./DesignTabs";
import { Toolbar } from "./Toolbar";

const WIDTH = 900;
const HEIGHT = 600;

const API_KEY = "AIzaSyBDxfunY1Kyy4TUqCK3Dm96EBUsOJuTIIs";

const Customizer = ({ isFront, children = "" }) => {
  const fabricRef = useRef(null);
  const canvasRef = useRef(null);
  const toolbarRef = useRef(null);
  const [elementsRefs, setElementsRef] = useState([]);
  const [showToolbar, setShowToolbar] = useState(false);
  const [activeObject, setActiveObject] = useState(null);
  const [activeFont, setActiveFont] = useState("open sans");
  const [isTextColorPicker, setIsTextColorPicker] = useState(false);
  const [showCustomizer, setShowCustomizer] = useState(false);

  let boundary;
  let boundingBoxGroup;

  const initFabric = () => {
    fabricRef.current = new fabric.Canvas(canvasRef.current);
    fabricRef.current.setWidth(WIDTH);
    fabricRef.current.setHeight(HEIGHT);
  };

  const createBoundingBox = () => {
    const canvas = fabricRef.current;
    boundary = new fabric.Rect({
      name: "boundary",
      top: 145,
      left: 338,
      width: 224,
      height: 295,
      fill: "transparent",
      stroke: "black",
      strokeWidth: 1,
      selectable: false, // To prevent the boundary from being selectable
      strokeDashArray: [5, 5],
    });
    canvas.renderAll();
    window.boundary = boundary;
    canvas.add(boundary);
  };

  const getCenterPositionOfObject = (object) => {
    const canvas = fabricRef.current;
    const svg = fabricRef.current._objects[0];
    const placeholderBox = svg._objects.find(
      (obj) => obj.id === "placeholder_front",
    );

    // Calculate the scale factor of the SVG
    const scaleFactor = Math.min(
      canvas.width / svg.width,
      canvas.height / svg.height,
    );
    //Calculate the position and dimensions of the "object" box
    const boxLeft = placeholderBox.left * scaleFactor + svg.left;
    const boxTop = placeholderBox.top * scaleFactor + svg.top;
    const boxWidth = placeholderBox.width * scaleFactor;
    const boxHeight = placeholderBox.height * scaleFactor;

    //Set the position of the object to be centered inside the "placeholder_front" box
    const transformMatrix = placeholderBox.calcTransformMatrix();
    const center = fabric.util.transformPoint(
      { x: boxLeft + boxWidth / 2, y: boxTop + boxHeight / 2 },
      transformMatrix,
    );

    console.log({
      boxLeft,
      boxTop,
      boxWidth,
      boxHeight,
      center,
    });

    // const textLeft = center.x - boxWidth;
    // const textTop = center.y - boxHeight;

    const textLeft = center.x - object.width / 2;
    const textTop = center.y - object.height / 2;
    console.log({ top: textTop, left: textLeft });
    return { top: textTop, left: textLeft };
  };

  const attachShirtBackground = () => {
    const canvas = fabricRef.current;

    fabric.loadSVGFromURL("images/front2.svg", function (objects, options) {
      const svg = fabric.util.groupSVGElements(objects, options);

      // Step 1: Adjust the SVG size to fit the canvas
      const scaleFactor = Math.min(
        canvas.width / svg.width,
        canvas.height / svg.height,
      );
      svg.scale(scaleFactor);

      // Step 2: Center the SVG on the canvas
      svg.left = (canvas.width - svg.width * scaleFactor) / 2;
      svg.top = (canvas.height - svg.height * scaleFactor) / 2;

      // Step 3: Find the "placeholder_front" box within the SVG
      boundingBoxGroup = svg._objects.find(
        (obj) => obj.id === "placeholder_front",
      );
      window.boundingBoxGroup = boundingBoxGroup;

      svg.selectable = false;
      svg.name = "product_image";
      canvas.add(svg);
    });

    canvas.renderAll();
  };

  const addTextBox = () => {
    const canvas = fabricRef.current;

    const textbox = new fabric.IText("Enter Text", {
      uid: v4(),
      fontFamily: "open sans",
      fontSize: 16,
      name: "textbox",
      originX: "center",
      originY: "center",
      onChange: function (e) {
        // This function defines the clipping region for the text box
        console.log("changed");
      },
    });

    const { top, left } = getCenterPositionOfObject(textbox);

    textbox.set({ left: left, top: top });

    textbox.center();
    textbox.bringForward();
    textbox.setControlsVisibility({
      mb: false,
      mt: false,
      mr: false,
      ml: false,
    });

    textbox.on("modified", function () {
      // Perform any actions or log the event when the text box is moved
      // if (textbox.intersectsWithObject(boundary)) {
      // textbox.set("opacity", 1);
      // } else {
      // textbox.set("opacity", 0);
      // }
      // canvas.renderAll();
    });
    canvas.on("selection:created", function (event) {
      // Perform any actions or log the event when the text box is selected
      const selectedObject = event.selected;

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
    const pd = canvas._objects[0]; //will change index later
    pd.getObjects().forEach(function (path) {
      if (path.fill !== "") {
        path.set({ fill: hex });
      }
    });
    canvas.renderAll();
  };

  const changeFont = (font) => {
    const canvas = fabricRef.current;
    if (activeObject && activeObject.type === "i-text") {
      activeObject.set("fontFamily", font);
      canvas.renderAll();
    }
  };

  const changeFontSize = (fontSize) => {
    const canvas = fabricRef.current;
    if (activeObject && activeObject.type === "i-text") {
      activeObject.set("fontSize", fontSize);
      canvas.renderAll();
    }
  };

  const justifyText = (align) => {
    const canvas = fabricRef.current;
    if (activeObject && activeObject.type === "i-text") {
      activeObject.set("textAlign", align);
      canvas.renderAll();
    }
  };

  const changeTextColor = (color) => {
    const canvas = fabricRef.current;
    if (activeObject && activeObject.type === "i-text") {
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
    initFabric();
    attachShirtBackground();
  }, []);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = function () {
      const base64ImageData = reader.result;
      if (typeof window !== undefined) attachImage(base64ImageData);
    };

    reader.readAsDataURL(file);
  };

  useEffect(() => {
    const canvas = fabricRef.current;
    window.canvas = fabricRef.current;
    canvas.on("object:selected", function () {
      const activeObj = o.target;
      activeObj.set({ borderColor: "#29ab51", cornerColor: "#29ab51" });
      canvas.renderAll();
    });

    canvas.on("mouse:wheel", function (opt) {
      var delta = opt.e.deltaY;
      var zoom = canvas.getZoom();
      zoom *= 0.999 ** delta;
      if (zoom > 20) zoom = 20;
      if (zoom < 0.01) zoom = 0.01;
      canvas.setZoom(zoom);
      opt.e.preventDefault();
      opt.e.stopPropagation();
      canvas.renderAll();
    });
  }, []);

  const setObjectToActive = (element) => {
    const canvas = fabricRef.current;
    canvas.setActiveObject(element);
    setActiveObject(element);
  };

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
              <Toolbar
                changeFont={(value) => changeFont(value)}
                changeFontSize={(value) => changeFontSize(value)}
                justifyText={(value) => justifyText(value)}
                changeTextColor={(value) => changeTextColor(value)}
              />
            )}
          </div>
        </div>
        <div className="overflow-y-auto border border-t-0 border-gray-300 p-3">
          {/* Add Items area */}
          {!showCustomizer && (
            <div>
              <DesignTabs />
              <DesignPicker
                handleFileChange={handleFileChange}
                setShowCustomizer={setShowCustomizer}
                addTextBox={addTextBox}
              />
            </div>
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
                  <div
                    onClick={() => setObjectToActive(element)}
                    className="flex cursor-pointer items-center justify-between gap-3 border-b border-solid border-b-[#ccc] p-3"
                  >
                    <div className="mr-3">
                      {element.name == "design" ? (
                        <img
                          src={element.toDataURL({
                            format: "jpeg",
                            quality: 1,
                          })}
                        />
                      ) : (
                        <GoTypography className="text-3xl" />
                      )}
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
                            {element.fontFamily || "Helvetica"}
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
                  {activeObject?.uid == element?.uid && (
                    <>
                      <div className="p-3 ">
                        <label className="mb-1 block font-light">Rotate</label>
                        <input
                          type="number"
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
                            type="number"
                            min={boundary?.left}
                            onChange={(e) => {
                              element.set("left", e.target.value),
                                canvasRef?.current?.renderAll();
                            }}
                            className="h-[40px] w-full border border-gray-300 pl-3"
                            defaultValue={element.left}
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
                            Position Top %
                          </label>
                          <input
                            type="number"
                            min={boundary?.top}
                            onChange={(e) => {
                              element.set("left", e.target.value),
                                canvasRef?.current?.renderAll();
                            }}
                            className="h-[40px] w-full border border-gray-300 pl-3"
                            defaultValue={element.top}
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
                    </>
                  )}
                </div>
              ))}

              <AddDesign setShowCustomizer={setShowCustomizer} />

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
