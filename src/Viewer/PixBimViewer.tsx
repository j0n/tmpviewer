import React, { useRef, useState, useEffect, useCallback } from 'react';

import { FederatedPointerEvent, Graphics, IPointData} from 'pixi.js';
import { Stage, Container } from '@pixi/react';

import { getBoundingBox } from '../utils/geo.ts';
import { IPixPath, IPixPolygon } from '../types.ts';
import PixBimPolygon from './Components/PixBimPolygon.tsx';
import PixBimPath from './Components/PixBimPath.tsx';
import Viewport from './Components/PixBimViewport.tsx';
import { invertScalePoint, scalePoint } from '../utils/pixbim-scale.ts';

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

const SCALE = 10;
let offSet = {x: 0, y: 0 };
const PixBimViewer: React.FC<PixBimViewerProps> = (props) => {
  const {
    polygons,
    onClick,
    onDragAndDrop,
    paths,
  } = props
  const containerRef = useRef<HTMLDivElement>(null);
  const [, setLoaded] = useState(false)
  const [x, y] = polygons[0].points[0];

  useEffect(() => {
    offSet = { x, y }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const scaledItems = useCallback(() => {
    const scaledPaths = paths.map(path => {
      const points = path.points.map(p => scalePoint(p, offSet, SCALE))
      return {
        ...path,
        points,
      }
    })
    const scaledPolygons = polygons.map(polygon => {
      const points = polygon.points.map(p => scalePoint(p, offSet, SCALE))
      return {
        ...polygon,
        points,
      }
    })
    return {
      scaledPolygons,
      scaledPaths,
    }
  }, [polygons, paths])

  const {
    scaledPolygons,
    scaledPaths
  } = scaledItems();

  const boundingBox = getBoundingBox(scaledPolygons.map(p => p.points).flat(1))

  useEffect(() => { 
    setLoaded(true)
  }, []);

  let dragPoint: IPointData = { x: 0, y: 0 }
  let dragTarget: Graphics|undefined = undefined;

  const onPolygonPointerDown = (e: FederatedPointerEvent, polygon: IPixPolygon) => {
    if (onClick) {
      onClick(polygon.id, [e.data.global.x, e.data.global.y])
    }
    if (polygon.isMoveable) {
      e.stopPropagation();
      const target = e.currentTarget as Graphics;
      target.polygon = polygon
      dragPoint = e.getLocalPosition(target.parent);
      dragPoint.x -= target.x;
      dragPoint.y -= target.y;
      dragTarget = target;
    }
  }
  const onPointerMoveOnStage = (e: FederatedPointerEvent) => {
    if (dragTarget) {
      const newPosition = e.getLocalPosition(dragTarget.parent);
      dragTarget.x = newPosition.x - dragPoint.x;
      dragTarget.y = newPosition.y - dragPoint.y;
    }
  }
  const onPointerUpOnStage = (e: FederatedPointerEvent) => {
    if (dragTarget) {
      const { polygon } = dragTarget;
      const newPosition = e.getLocalPosition(dragTarget.parent);
      dragTarget.x = newPosition.x - dragPoint.x;
      dragTarget.y = newPosition.y - dragPoint.y;
      dragTarget = undefined;
      const movedPosition = newPosition;
      const newOffSet = { x: offSet.x + movedPosition.x, y: offSet.y + movedPosition.y }
      
      const points = polygon.points.map((p: number[])  => invertScalePoint(p, newOffSet, SCALE))
      if (onDragAndDrop) {
        onDragAndDrop(polygon.id, points)
      }
    }

  }

  return (
    <div style={{width: "100%", height: "100%", display: "flex"}} ref={containerRef}>
      {containerRef.current &&
        <Stage
          options={{
            antialias: true,
            background: 0xffffff,
            resizeTo: containerRef.current,
          }}
          width={containerRef.current?.clientWidth ?? window.innerWidth}
          height={containerRef.current?.clientHeight ?? window.innerHeight}
        >
          <Viewport
            boundingBox={boundingBox} 
            onpointermove={onPointerMoveOnStage}
            onpointerup={onPointerUpOnStage}
            >
            <Container>
              { scaledPolygons.map((polygon: IPixPolygon) => 
                <PixBimPolygon onDragAndDrop={onDragAndDrop} onClick={onPolygonPointerDown} polygon={polygon} key={polygon.id} />)
              }
              { scaledPaths.map((path: IPixPath) => <PixBimPath path={path} key={path.id} />) }
            </Container>
          </Viewport>
        </Stage>
      }
    </div>
  )
};

export default PixBimViewer;
