import * as React from "react";

type MotionProps = Record<string, unknown>;

const motionProps = new Set([
  "animate",
  "initial",
  "layout",
  "transition",
  "variants",
  "viewport",
  "whileHover",
  "whileInView",
  "whileTap",
]);

function createMotionComponent(tag: keyof React.JSX.IntrinsicElements) {
  return React.forwardRef<HTMLElement, MotionProps>((props, ref) => {
    const domProps = Object.fromEntries(
      Object.entries(props).filter(([key]) => !motionProps.has(key)),
    );

    return React.createElement(tag, { ...domProps, ref });
  });
}

export const motion = {
  article: createMotionComponent("article"),
  div: createMotionComponent("div"),
  h1: createMotionComponent("h1"),
  p: createMotionComponent("p"),
};