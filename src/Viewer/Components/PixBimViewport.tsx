import React, { useRef, useEffect } from 'react';
import type { Application, FederatedPointerEvent } from 'pixi.js';
import type { Viewport as ViewportType } from 'pixi-viewport';
// @ts-expect-error no expeted member as pixi/react is in beta
import type { PixiReactElementProps } from '@pixi/react';
import { useApplication, extend } from '@pixi/react'
import { Viewport } from "pixi-viewport";

declare global {
  namespace JSX {
    interface IntrinsicElements {
      viewport: PixiReactElementProps<typeof ViewportType>;
    }
  }
}


export interface ViewportProps {
  children?: React.ReactNode;
  boundingBox?: { x: number, y: number, width: number, height: number };
  onpointermove?: (e: FederatedPointerEvent) => void;
  onpointerup?: (e: FederatedPointerEvent) => void;
}

export interface PixiComponentViewportProps extends ViewportProps {
  app: Application;
}
extend({ Viewport })

  /*
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
      instance.ensureVisible(x, y, width, height, true);
    }
  }
});

   */
const PixBimViewport = (props: ViewportProps) => {
  const { app } = useApplication();
  const { boundingBox, onpointerup, onpointermove } = props;
  const { renderer } = app;
  const viewportRef = useRef<ViewportType>(null);
  const { ticker } = app;
  useEffect(() => {
    if (viewportRef.current) {
      viewportRef.current.drag().pinch().wheel()
      if (onpointermove) {
        viewportRef.current.on('pointermove', onpointermove);
      }
      if (onpointerup) {
        viewportRef.current.on('pointerup', onpointerup);
      }
      if (boundingBox) {
        const { x, y, width, height } = boundingBox;
        viewportRef.current.ensureVisible(x, y, width, height, true);
      }
    }
  }, [boundingBox, onpointerup, onpointermove]);
  if (!app.renderer) {
    return 
  }
  return <viewport ref={viewportRef} events={renderer.events} ticker={ticker} {...props} pointermove={() => console.log('hej')} />
};

export default PixBimViewport;
