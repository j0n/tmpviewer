import '../App.css'
import PixBimViewer from '../Viewer/PixBimViewer.tsx';
import { IPixPath, IPixPolygon } from '../types.ts';
import {
  convertDemoRoomsToPixPolygons, convertRoomDevicesToPixPolygons,
  convertRoomGridsToPixPaths,
  DEMO_ROOMS,
  DEMO_ROOMS_DEVICES
} from './demodata.ts';
import { useMemo } from 'react';

function Demo() {

  const roomPolygons: IPixPolygon[] = useMemo(() => convertDemoRoomsToPixPolygons(DEMO_ROOMS), [DEMO_ROOMS]);
  const devicePolygons: IPixPolygon[] = useMemo(() => convertRoomDevicesToPixPolygons(DEMO_ROOMS_DEVICES), [DEMO_ROOMS_DEVICES]);

  const paths: IPixPath[] = useMemo(() => convertRoomGridsToPixPaths(DEMO_ROOMS_DEVICES), [DEMO_ROOMS_DEVICES]);

  const polygons: IPixPolygon[] = useMemo(() => [...roomPolygons, ...devicePolygons], [roomPolygons, devicePolygons]);

  return (
    <>
      <PixBimViewer paths={paths} polygons={polygons} />
    </>
  )
}

export default Demo

