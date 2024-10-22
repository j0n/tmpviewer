import React from 'react';
import { IPixPath, IPixPolygon } from '../types.ts';

interface PixBimViewerProps {
  polygons: IPixPolygon[]
  paths: IPixPath[],
  onClick?: (id: string | undefined, coordinates: [number, number]) => void,
  onDragAndDrop?: (id: string, points: number[][]) => void,
  pointerTracker?: {
    color: string,
    size: number,
  }
}

const PixBimViewer: React.FC<PixBimViewerProps> = ({ polygons, paths }) => {

  return <div>
    hello 2d-bim viewer
    <br/>
    Polygons: {polygons.length}
    <br/>
    Paths: {paths.length}
  </div>
};

export default PixBimViewer;
