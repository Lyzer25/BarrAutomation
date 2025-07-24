import React from "react";
import "./StarBorder.css";

type StarBorderProps<T extends React.ElementType> =
  React.ComponentPropsWithoutRef<T> & {
    as?: T;
    className?: string;
    children?: React.ReactNode;
    color?: string;
    speed?: React.CSSProperties['animationDuration'];
    thickness?: number;
  }

const StarBorder = <T extends React.ElementType = "button">({
  as,
  className = "",
  color = "white",
  speed = "6s",
  thickness = 1,
  children,
  style,
  ...rest
}: StarBorderProps<T>) => {
  const Component = as || "button";

  const componentStyle: React.CSSProperties = {
    padding: `${thickness}px`,
    ...style,
  };

  return (
    <Component 
      className={`star-border-container ${className}`} 
      {...rest}
      style={componentStyle}
    >
      <div
        className="border-gradient-bottom"
        style={{
          background: `radial-gradient(circle, ${color} 20%, transparent 80%)`,
          animationDuration: speed,
        }}
      ></div>
      <div
        className="border-gradient-top"
        style={{
          background: `radial-gradient(circle, ${color} 20%, transparent 80%)`,
          animationDuration: speed,
        }}
      ></div>
      <div
        className="border-gradient-left"
        style={{
          background: `radial-gradient(circle, ${color} 20%, transparent 80%)`,
          animationDuration: speed,
        }}
      ></div>
      <div
        className="border-gradient-right"
        style={{
          background: `radial-gradient(circle, ${color} 20%, transparent 80%)`,
          animationDuration: speed,
        }}
      ></div>
      <div className="inner-content">{children}</div>
    </Component>
  );
};

StarBorder.displayName = "StarBorder";

export default StarBorder;
