import React, { useRef, useState, useEffect, useCallback } from 'react';

import { FederatedPointerEvent, Container } from 'pixi.js';
import type { PointData  } from 'pixi.js';
import { Application, extend } from '@pixi/react'

import { getBoundingBox } from './utils/geo.ts';
import { invertScalePoint, scalePoint } from './utils/pixbim-scale.ts';
import { IPixPath, IPixPolygon } from './types.ts';
import PixBimPolygon from './Components/PixBimPolygon.tsx';
import PixBimPath from './Components/PixBimPath.tsx';
import Viewport from './Components/PixBimViewport.tsx';

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
interface DragObject extends Container {
  polygon?: IPixPolygon
}

extend({ Container })

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
  const firstPolygon = polygons.length > 0 ? polygons[0] : { points: [[0,0]] }
  const [firstPoint = [0, 0]] = firstPolygon.points;
  const [x, y] = firstPoint;

  useEffect(() => {
    offSet = { x, y }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const scaledItems = useCallback(() => {
    const ids: Map<string, number> = new Map();
    const scaledPaths = paths.map(path => {
      const points = path.points.map(p => scalePoint(p, offSet, SCALE))
      const { id } = path;

      const count = ids.get(id) || 0;
      ids.set(id, count + 1);
      return {
        ...path,
        id: path.id + count,
        points,
      }
    })
    const scaledPolygons = polygons.map(polygon => {
      const points = polygon.points.map(p => scalePoint(p, offSet, SCALE))
      const { id } = polygon;
      const count = ids.get(id) || 0;
      ids.set(id, count + 1);
      return {
        ...polygon,
        id: `${id}-${count}`,
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

  let dragPoint: PointData = { x: 0, y: 0 }
  let dragTarget: DragObject|undefined = undefined;

  const onPolygonPointerDown = (e: FederatedPointerEvent, polygon: IPixPolygon) => {
    if (onClick) {
      onClick(polygon.id, [e.data.global.x, e.data.global.y])
    }
    if (polygon.isMoveable) {
      e.stopPropagation();
      const target = e.currentTarget as DragObject;
      console.log({target});
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
      if (!polygon) {
        return;
      }
      const points = polygon.points.map((p: number[])  => invertScalePoint(p, newOffSet, SCALE))
      if (onDragAndDrop && polygon) {
        onDragAndDrop(polygon.id, points)
      }
    }

  }

  return (
    <div style={{width: "100%", height: "100%", display: "flex"}} ref={containerRef}>
      {containerRef.current &&
        <Application
          antialias={true}
          background={0xffffff}
          resizeTo={containerRef}
          width={containerRef.current?.clientWidth ?? window.innerWidth}
          height={containerRef.current?.clientHeight ?? window.innerHeight}
        >
          <Viewport
            boundingBox={boundingBox} 
            onpointermove={onPointerMoveOnStage}
            onpointerup={onPointerUpOnStage}
            >
            <container>
              { scaledPolygons.map((polygon: IPixPolygon) => 
                <PixBimPolygon onDragAndDrop={onDragAndDrop} onClick={onPolygonPointerDown} polygon={polygon} key={polygon.id} />)
              }
              { scaledPaths.map((path: IPixPath) => <PixBimPath path={path} key={path.id} />) }
            </container>
          </Viewport>
        </Application>
      }
    </div>
  )
};

export default PixBimViewer;
