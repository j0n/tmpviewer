import React from "react";
import * as PIXI from "pixi.js";
import { useApp, PixiComponent } from '@pixi/react'
import { Viewport as PixiViewport } from "pixi-viewport";

export interface ViewportProps {
  children?: React.ReactNode;
  boundingBox?: { x: number, y: number, width: number, height: number };
  onpointermove?: (e: PIXI.FederatedPointerEvent) => void;
  onpointerup?: (e: PIXI.FederatedPointerEvent) => void;
}

export interface PixiComponentViewportProps extends ViewportProps {
  app: PIXI.Application;
}

const PixiComponentViewport = PixiComponent("Viewport", {
  create: (props: PixiComponentViewportProps) => {
    const { app, onpointermove, onpointerup } = props
    // app.renderer.events.domElement = app.view as any;
    const viewport = new PixiViewport({
        events: app.renderer.events,
        ticker: app.ticker,
    });
    if (onpointermove) {
      viewport.on("pointermove", onpointermove);
    }
    if (onpointerup) {
      viewport.on("pointerup", onpointerup);
    }
    viewport.drag().pinch().wheel()
    return viewport;
  },
  applyProps: (instance, oldProps: PixiComponentViewportProps, newProps: PixiComponentViewportProps) => {
    const { boundingBox } = newProps;
    const { boundingBox: oldBoundingBox } = oldProps;
    if (boundingBox && boundingBox !== oldBoundingBox) {
      const { x, y, width, height } = boundingBox;
      // instance.moveCenter(x - (width/2), y - (height/2))
      instance.ensureVisible(x, y, width, height, true);
    }
  }
});

const Viewport = (props: ViewportProps) => {
  const app = useApp();
  return <PixiComponentViewport app={app} {...props} />;
};

export default Viewport;
