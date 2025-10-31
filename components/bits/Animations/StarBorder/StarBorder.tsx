import React, { memo } from "react";
import styles from "./StarBorder.module.css";

type StarBorderProps<T extends React.ElementType> =
  React.ComponentPropsWithoutRef<T> & {
    as?: T;
    className?: string;
    children?: React.ReactNode;
    color?: string;
    speed?: React.CSSProperties['animationDuration'];
    thickness?: number;
  }

const StarBorderInner = <T extends React.ElementType = "button">({
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
      className={`${styles["star-border-container"]} ${className}`} 
      {...rest}
      style={componentStyle}
    >
      <div
        className={styles["border-gradient-bottom"]}
        style={{
          background: `radial-gradient(circle, ${color} 20%, transparent 80%)`,
          animationDuration: speed,
        }}
      ></div>
      <div
        className={styles["border-gradient-top"]}
        style={{
          background: `radial-gradient(circle, ${color} 20%, transparent 80%)`,
          animationDuration: speed,
        }}
      ></div>
      <div
        className={styles["border-gradient-left"]}
        style={{
          background: `radial-gradient(circle, ${color} 20%, transparent 80%)`,
          animationDuration: speed,
        }}
      ></div>
      <div
        className={styles["border-gradient-right"]}
        style={{
          background: `radial-gradient(circle, ${color} 20%, transparent 80%)`,
          animationDuration: speed,
        }}
      ></div>
      <div className={styles["inner-content"]}>{children}</div>
    </Component>
  );
};

StarBorderInner.displayName = "StarBorder";

const StarBorder = memo(StarBorderInner) as <T extends React.ElementType = "button">(props: StarBorderProps<T>) => React.ReactElement;


export default StarBorder;
