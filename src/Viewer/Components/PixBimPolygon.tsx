import React, { useCallback, useState } from 'react';

import { FederatedPointerEvent, Graphics, Texture } from 'pixi.js';
import { extend } from '@pixi/react'

import type { Graphics as GraphicsType } from 'pixi.js';

import { IPixPolygon } from '../types.ts';
extend({ Graphics })

interface PixBimPolygonProps {
  polygon: IPixPolygon
  onClick?: (e: FederatedPointerEvent, polygon: IPixPolygon, coordinates: [number, number]) => void,
  onDragAndDrop?: (id: string, points: number[][]) => void,
  initScale?: number,
  pointerTracker?: {
    color: string,
    size: number,
  }
}

const PixBimPolygon: React.FC<PixBimPolygonProps> = ({ polygon, onClick }) => {
  const [fillColor, setFillColor] = useState(polygon.fillColor || 'fafafa');
  const [strokeColor, setStrokeColor] = useState(polygon.strokeColor);
  const strokeWidth = typeof polygon.strokeWidth === "string" ? parseFloat(polygon.strokeWidth.replace("px", "")) : polygon.strokeWidth;

  const draw = useCallback((g: GraphicsType) => {
    g.clear();
    g.setFillStyle({ color: fillColor });
    const points = polygon.points.flat(1)
    if (polygon.isMoveable) {
      g.cursor = "pointer";
    }
    g.poly(points)
    g.eventMode = "static";
    g.stroke({ color: strokeColor, width: strokeWidth, texture: Texture.WHITE });
    g.fill();
  }, [polygon, strokeColor,fillColor, strokeWidth]);

  const onPointerDown = (e: FederatedPointerEvent) => {
    if (onClick) {
      onClick(e, polygon, [0,0])
    }
  }
  const onPointerOver = () => {
    setFillColor("fafad2")
  }

  const onPointerOut = () => {
    setFillColor(polygon.fillColor || 'fafafa');
    setStrokeColor(polygon.strokeColor);
  }

  return <>
    <graphics
      draw={draw}
      onPointerDown={onPointerDown}
      onPointerOver={onPointerOver}
      onPointerOut={onPointerOut}
      />
  </>
};

export default PixBimPolygon;
