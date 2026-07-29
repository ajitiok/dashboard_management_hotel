// @ts-nocheck
import React from "react";
import cx from "classnames";

type BadgeProps = {
  /**
   * additional CSS class
   *
   * @optional
   */
  className?: string;
  /**
   * background of badge
   *
   * @default #EDF3FB
   */
  bgColor: string;
  /**
   * text color
   */
  textColor: string;
  /**
   * size options of badges
   *
   * @default m
   */
  size?: "l" | "m" | "s" | "xs";
  /**
   * label or text of badge
   */
  label?: string;
  leftIcon?: String | React.ReactNode;
  rightIcon?: String | React.ReactNode;
};

const sizes = {
  l: "text-sub1 px-4 py-3",
  m: "text-sub2 px-[14px] py-[11px]",
  s: "text-sub3 px-2.5 py-1.5",
  xs: "text-sub4 px-2 py-1",
};

const Badge: React.FC<BadgeProps> = ({
  className,
  bgColor = "#EDF3FB",
  textColor = "white",
  size = "m",
  label,
  leftIcon,
  rightIcon,
}) => {
  return (
    <span
      style={{ backgroundColor: bgColor, color: textColor }}
      className={cx(sizes[size], "rounded-full", className)}
    >
      {leftIcon && <i className="pr-1">{leftIcon}</i>}
      {label}
      {rightIcon && <i className="pl-1">{rightIcon}</i>}
    </span>
  );
};

export default Badge;
