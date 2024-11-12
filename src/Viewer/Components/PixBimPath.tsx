import React, { useCallback, useState } from 'react';

import { Graphics } from '@pixi/react';
import type { Graphics as GraphicsType } from 'pixi.js';
import { Texture } from 'pixi.js';

import { IPixPath } from '../../types.ts';

interface PixBimPathProps {
  path: IPixPath,
}



const PixBimPath: React.FC<PixBimPathProps> = ({ path }) => {

  const [strokeColor] = useState(path.strokeColor);
  const strokeWidth = typeof path.strokeWidth === "string" ? parseInt(path.strokeWidth.replace("px", "")) : path.strokeWidth;

  const draw = useCallback((g: GraphicsType) => {
    g.clear();
    g.lineTextureStyle({ texture:Texture.WHITE, width: strokeWidth, color:strokeColor })
    
    const points = path.points;
    g.moveTo(points[0][0], points[0][1]);
    points.forEach((point) => {
      const [x, y] = point;
      g.lineTo(x, y);
    })
    g.endFill();
  }, [path, strokeColor, strokeWidth]);
  ;

  const onPointerOver = () => {
    console.log('show tool tip');
    //  setFillColor("fafad2")
  }

  const onPointerOut = () => {
    console.log('hide tool tip');
  }

  return <>
    <Graphics
      draw={draw}
      pointerover={onPointerOver}
      pointerout={onPointerOut}
      />
  </>
};

export default PixBimPath;