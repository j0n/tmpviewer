import React, { useCallback, useState } from 'react';

import { Graphics } from '@pixi/react';
import { FederatedPointerEvent, Texture } from 'pixi.js';
import type { Graphics as GraphicsType } from 'pixi.js';

import { IPixPolygon } from '../types.ts';

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
    g.lineTextureStyle({ texture:Texture.WHITE, width: strokeWidth, color: strokeColor })
    g.beginFill(fillColor);
    const points = polygon.points.flat(1)
    if (polygon.isMoveable) {
      g.cursor = "pointer";
    }
    g.drawPolygon(points)
    g.eventMode = "static";
    g.endFill();
  }, [polygon, strokeColor,fillColor, strokeWidth]);
  ;

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
    <Graphics
      draw={draw}
      pointerdown={onPointerDown}
      pointerover={onPointerOver}
      pointerout={onPointerOut}
      />
  </>
};

export default PixBimPolygon;
