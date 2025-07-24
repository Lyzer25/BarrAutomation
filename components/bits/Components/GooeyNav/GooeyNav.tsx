'use client';
import React, { useRef, useEffect, useState, FC, MouseEvent, KeyboardEvent } from "react";
import "./GooeyNav.css";

interface GooeyNavItem {
  label: string;
  href: string;
}

export interface GooeyNavProps {
  items: GooeyNavItem[];
  initialActiveIndex?: number;
}

const GooeyNav: FC<GooeyNavProps> = ({
  items,
  initialActiveIndex = 0,
}) => {
  const [activeIndex, setActiveIndex] = useState<number>(initialActiveIndex);

  const handleClick = (
    e: MouseEvent<HTMLAnchorElement>,
    index: number
  ) => {
    setActiveIndex(index);
  };

  if (!items) {
    return null;
  }

  return (
    <div className="gooey-nav-container">
      <nav>
        <ul>
          {items.map((item, index) => (
            <li key={index} className={activeIndex === index ? "active" : ""}>
              <a
                href={item.href}
                onClick={(e) => handleClick(e, index)}
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default GooeyNav;
