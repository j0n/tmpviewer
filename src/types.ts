
export interface IPixPolygon {
  id: string;
  points: number[][];
  fillColor: string | undefined;
  strokeColor: string | undefined;
  strokeWidth: string | undefined
  text: {
    value: string | undefined;
    color: string |undefined;
    fontSize: string | undefined;
  },
  tooltip: string | undefined;
  isMoveable: boolean
}

export interface IPixPath {
  id: string;
  points: number[][];
  strokeColor: string | undefined;
  strokeWidth: string | undefined;
  tooltip?: string | undefined;
}
