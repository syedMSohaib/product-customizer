import React from "react";

export const PrintInfo = () => {
  return (
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
  );
};
