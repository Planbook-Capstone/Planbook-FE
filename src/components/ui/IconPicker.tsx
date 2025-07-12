"use client";

import { useState } from "react";
import * as FaIcons from "react-icons/fa6";
import { FaChevronDown } from "react-icons/fa6";
import { cn } from "@/lib/utils";

const iconList = [
  "FaAddressBook",
  "FaAddressCard",
  "FaAnchor",
  "FaArrowPointer",
  "FaAward",
  "FaBaby",
  "FaBacteria",
  "FaBagShopping",
  "FaBan",
  "FaBanSmoking",
  "FaBandage",
  "FaBaseball",
  "FaBaseballBatBall",
  "FaBasketShopping",
  "FaBasketball",
  "FaBatteryFull",
  "FaBed",
  "FaBeerMugEmpty",
  "FaBell",
  "FaBellSlash",
  "FaBellConcierge",
  "FaBicycle",
  "FaBinoculars",
  "FaBluesky",
  "FaBolt",
  "FaBoltLightning",
  "FaBomb",
  "FaBone",
  "FaBong",
  "FaBook",
  "FaBookAtlas",
  "FaBookBookmark",
  "FaBookOpen",
  "FaBookSkull",
  "FaBookmark",
  "FaBottleWater",
  "FaBowlFood",
  "FaBox",
  "FaBoxArchive",
  "FaBoxesStacked",
  "FaBrain",
  "FaBreadSlice",
  "FaBriefcase",
  "FaBriefcaseMedical",
  "FaBroom",
  "FaBrush",
  "FaBug",
  "FaBuilding",
  "FaBuildingColumns",
  "FaBuildingUser",
  "FaBullhorn",
  "FaBullseye",
  "FaBurger",
  "FaCat",
  "FaCheese",
  "FaCertificate",
  "FaCarrot",
  "FaCalendar",
  "FaCartShopping",
  "FaCircleRadiation",
  "FaCloudRain",
  "FaEnvelope",
  "FaFile",
  "FaFilePen",
  "FaFlagCheckered",
  "FaFlag",
  "FaFlask",
  "FaFlaskVial",
  "FaFolder",
  "FaFolderOpen",
  "FaGhost",
  "FaGift",
  "FaGlasses",
  "FaHeart",
  "FaHeartCrack",
  "FaHourglassHalf",
  "FaHouse",
  "FaInbox",
  "FaImage",
  "FaLocationDot",
  "FaMessage",
  "FaMobile",
  "FaNewspaper",
] as const;
type IconName = (typeof iconList)[number];

const presetColors = [
  "#9ca3af",
  "#d97706",
  "#ca8a04",
  "#15803d",
  "#0369a1",
  "#7c3aed",
  "#db2777",
  "#e11d48",
];

interface IconPickerProps {
  selectedIcon?: IconName;
  selectedColor?: string;
  onIconChange?: (iconName: IconName) => void;
  onColorChange?: (color: string) => void;
  className?: string;
}

export const IconPicker = ({
  selectedIcon = "FaBookBookmark",
  selectedColor = "#9ca3af",
  onIconChange,
  onColorChange,
  className,
}: IconPickerProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isColorOpen, setIsColorOpen] = useState(false);

  return (
    <div className={cn("w-full inline-block", className)}>
      <div className="grid grid-cols-6 gap-2 max-h-48 overflow-y-auto">
        {iconList.map((iconName) => {
          const IconComponent = FaIcons[iconName];
          if (!IconComponent) return null;

          return (
            <button
              key={iconName}
              onClick={() => {
                onIconChange?.(iconName);
                setIsColorOpen(true);
              }}
              className="rounded-md hover:bg-gray-50 py-2 cursor-pointer transition-colors flex items-center justify-center"
            >
              <IconComponent size={20} className="text-gray-700" />
            </button>
          );
        })}
      </div>

      {/* Color Picker Popover */}
      {isColorOpen && (
        <div className="absolute left-full top-0 ml-2 mt-1 bg-white border rounded-lg shadow-lg z-50 p-2 flex flex-wrap w-36">
          {presetColors.map((color) => (
            <button
              key={color}
              className="w-6 h-6 rounded-full m-1 border cursor-pointer border-gray-200 hover:scale-110 transition-transform"
              style={{ backgroundColor: color }}
              onClick={() => {
                onColorChange?.(color);
                setIsOpen(false);
                setIsColorOpen(false);
              }}
            />
          ))}
        </div>
      )}

      {/* Overlay */}
      {(isOpen || isColorOpen) && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => {
            setIsOpen(false);
            setIsColorOpen(false);
          }}
        />
      )}
    </div>
  );
};
