// @ts-nocheck
import cx from "classnames";
import React from "react";

import LoadingIcon from "~/icons/loading.svg";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "text";
  size?: "xl" | "l" | "m" | "s" | "xs";
  full?: boolean;
  leftIcon?: String | React.ReactNode;
  rightIcon?: String | React.ReactNode;
  loading?: boolean;
  loadingText?: string;
  loadingTextClassName?: string;
}

const sizes = {
  xl: "text-h6 px-6 py-4",
  l: "text-sub1 px-4 py-3",
  m: "text-sub2 px-[14px] py-[11px]",
  s: "text-sub3 px-3 py-2",
  xs: "text-sub4 px-2 py-1",
};

const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  color,
  full = false,
  size = "l",
  leftIcon,
  rightIcon,
  className,
  loading,
  loadingText,
  loadingTextClassName,
  ...rest
}) => {
  return (
    <button
      {...rest}
      className={cx(
        "rounded-md font-bold transition-colors duration-200",
        "focus:outline-[1px] focus:outline-primary-700",
        "disabled:cursor-not-allowed",
        sizes[size],
        {
          "w-full": full,
          // variant primary
          "bg-primary-600 text-white hover:bg-primary-700 active:bg-primary-800 disabled:bg-base-500":
            variant === "primary",
          // variant secondary
          "border border-primary-600 text-primary-600 hover:border-primary-700 hover:bg-white hover:text-primary-700 active:text-primary-800 disabled:border-base-500 disabled:text-base-500":
            variant === "secondary",
          // variant text
          "text-primary-600 hover:text-primary-700 active:text-primary-800 disabled:text-base-500":
            variant === "text",
        },
        className
      )}
      disabled={loading || rest.disabled}
    >
      {loading ? (
        <div className="flex items-center justify-center">
          <div className="animate-loading-slide-up flex items-center justify-center gap-2.5">
            <LoadingIcon className="mx-auto h-5 w-5 animate-spin fill-base-500 !text-white dark:text-gray-600" />
            {loadingText && (
              <span className={cx("font-medium", loadingTextClassName)}>
                {loadingText}
              </span>
            )}
          </div>
        </div>
      ) : (
        <>
          {leftIcon && <i className="pr-4">{leftIcon}</i>}
          {rest.children}
          {rightIcon && <i className="pl-4">{rightIcon}</i>}
        </>
      )}
    </button>
  );
};

export default Button;
