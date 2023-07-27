import React, { useState } from "react";
import { TwitterPicker } from "react-color";
import { AiOutlineFontColors } from "react-icons/ai";
import { BiAlignMiddle } from "react-icons/bi";
import { BsJustify, BsJustifyLeft, BsJustifyRight, BsTrash } from "react-icons/bs";

export const Toolbar = ({ changeFont, changeFontSize, justifyText, changeTextColor }) => {
  const [showColorPicker, setShowColorPicker] = useState(false);
  return (
    <div className="ml-auto flex justify-center gap-[10px] rounded border-gray-100 bg-gray-200 px-2 py-2  text-black">
      <div className="font-picker max-w-[200px]">
        <select
          className="h-full border  bg-gray-50 text-sm text-gray-900 "
          id="font-family"
          onChange={(e) => changeFont(e.target.value)}
        >
          <option value={"helvetica"}>Select</option>
          <option value="arial">Arial</option>
          <option value="helvetica" selected>
            Helvetica
          </option>
          <option value="myriad pro">Myriad Pro</option>
          <option value="delicious">Delicious</option>
          <option value="verdana">Verdana</option>
          <option value="georgia">Georgia</option>
          <option value="courier">Courier</option>
          <option value="comic sans ms">Comic Sans MS</option>
          <option value="impact">Impact</option>
          <option value="monaco">Monaco</option>
          <option value="optima">Optima</option>
          <option value="hoefler text">Hoefler Text</option>
          <option value="plaster">Plaster</option>
          <option value="engagement">Engagement</option>
        </select>
      </div>
      <div>
        <input
          className="h-full w-[60px] border border-gray-300 bg-gray-50 pl-2"
          type="number"
          onChange={(e) => changeFontSize(e.target.value)}
          defaultValue={16}
        />
      </div>

      <button onClick={() => justifyText("left")} className="bg-white p-2">
        <BsJustifyLeft />
      </button>
      <button onClick={() => justifyText("justify")} className="bg-white p-2">
        <BsJustify />
      </button>
      <button onClick={() => justifyText("center")} className="bg-white p-2">
        <BiAlignMiddle />
      </button>
      <button onClick={() => justifyText("right")} className="bg-white p-2">
        <BsJustifyRight />
      </button>
      <div className="relative bg-white p-2">
        <button onClick={() => setShowColorPicker(!showColorPicker)}>
          <AiOutlineFontColors />
        </button>
        {showColorPicker && (
          <div className="absolute left-1.5 top-[50px] z-10 border border-solid border-gray-200 bg-white p-2.5">
            <TwitterPicker
              onChangeComplete={(color) => changeTextColor(color.hex)}
            />
          </div>
        )}
      </div>
      <button className="bg-white p-2">
        <BsTrash />
      </button>
    </div>
  );
};
