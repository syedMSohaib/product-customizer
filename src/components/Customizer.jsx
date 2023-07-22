import { fabric } from "fabric";
import FontPicker from "font-picker-react";
import { useEffect, useRef, useState } from "react";
import { CirclePicker } from "react-color";
import { AiOutlineFontColors } from "react-icons/ai";
import { BiAlignMiddle } from "react-icons/bi";
import {
  BsJustify,
  BsJustifyLeft,
  BsJustifyRight,
  BsTrash,
} from "react-icons/bs";
import eventBus from "../lib/EventBus";

const WIDTH = 600;
const HEIGHT = 600;
const API_KEY = "AIzaSyBDxfunY1Kyy4TUqCK3Dm96EBUsOJuTIIs";

const Customizer = ({ isFront }) => {
  const fabricRef = useRef(null);
  const canvasRef = useRef(null);
  const toolbarRef = useRef(null);
  const [elementsRefs, setElementsRef] = useState([]);
  const [showToolbar, setShowToolbar] = useState(false);
  const [activeObject, setActiveObject] = useState(null);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [activeFont, setActiveFont] = useState("open sans");

  let boundary;

  const initFabric = () => {
    fabricRef.current = new fabric.Canvas(canvasRef.current);
    fabricRef.current.setWidth(WIDTH);
    fabricRef.current.setHeight(HEIGHT);
  };

  const createBoundingBox = () => {
    const canvas = fabricRef.current;
    boundary = new fabric.Rect({
      name: "boundary",
      left: 210,
      top: 175,
      width: 172,
      height: 230,
      fill: "transparent",
      stroke: "white",
      strokeWidth: 1,
      selectable: false, // To prevent the boundary from being selectable
    });
    canvas.add(boundary);
  };

  const attachShirtBackground = (url) => {
    const canvas = fabricRef.current;
    new fabric.Image.fromURL("/images/front.png", function (img) {
      // Define the image as background image of the Canvas
      canvas.setBackgroundImage(img, canvas.renderAll.bind(canvas), {
        // Scale the image to the canvas size
        scaleX: canvas.width / img.width,
        scaleY: canvas.height / img.height,
        backgroundImageOpacity: 1,
        backgroundImageStretch: false,
        // scaleX: 0.5,
        // scaleY: 0.5,
        top: canvas.getCenter().top,
        left: canvas.getCenter().left,
        originX: "center",
        originY: "center",
      });
    });
    canvas.renderAll();
  };

  const addTextBox = () => {
    const canvas = fabricRef.current;
    var center = canvas.getCenter();
    var textbox = new fabric.Textbox("Enter Text", {
      fontFamily: "open sans",
      fontSize: 12,
      name: "textbox",
      top: center.top,
      left: center.left,
      originX: "center",
      originY: "center",

      onChange: function (e) {
        // This function defines the clipping region for the text box
        console.log("changed");
      },
    });
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
      setActiveObject(selectedObject[0]);

      if (selectedObject.length && selectedObject[0]?.name === "textbox") {
        toolbarRef.current.style.top = selectedObject[0].top + "px";
        toolbarRef.current.style.top = selectedObject[0].left + "px";
        setShowToolbar(true);
        setActiveFont(selectedObject[0].fontFamily);
      }
    });
    canvas.on("selection:cleared", function (event) {
      // Perform any actions or log the event when the text box selection is cleared
      const deselectedObject = event.deselected;

      if (deselectedObject.length && deselectedObject[0]?.name === "textbox") {
        setShowToolbar(false);
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
    canvas.set("backgroundColor", hex);
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
        left: 100,
        top: 100,
        angle: 0,
        padding: 10,
        cornersize: 10,
        hasRotatingPoint: true,
      });
      canvas.add(img).renderAll();
      canvas.setActiveObject(img);
    });
    canvas.renderAll();
  };

  useEffect(() => {
    const url = isFront ? "/images/front.png" : "/images/back.png";
    initFabric();
    attachShirtBackground(url);
    createBoundingBox();
  }, []);

  useEffect(() => {
    eventBus.on("addTextBox", (data) => {
      console.log("addTextBox event received", data);
      addTextBox();
    });

    eventBus.on("changeBgColor", (data) => {
      console.log("changeBgColor event received", data);
      changeBgColor(data.color);
    });

    eventBus.on("addImage", (data) => {
      console.log("addImage event received", data);
      attachImage(data.base64);
    });
  }, []);

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
  }, []);

  return (
    <>
      <canvas ref={canvasRef} />
      {/* Toolbar */}

      <div className="absolute" ref={toolbarRef}>
        {showToolbar && (
          <div className="ml-auto flex justify-center gap-[10px] rounded border-gray-100 bg-gray-200  px-2  py-2">
            <div>
              <FontPicker
                activeFontFamily={activeFont}
                className="h-8 border border-gray-800 bg-gray-50 text-sm text-gray-900 "
                apiKey={API_KEY}
                onChange={(nextFont) => {
                  console.log(nextFont.family), changeFont(nextFont.family);
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
    </>
  );
};

export default Customizer;
