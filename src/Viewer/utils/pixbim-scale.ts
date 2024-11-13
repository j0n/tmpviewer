export const scalePoint = (point: number[], offSet: { x: number, y: number }, scale: number): number[] => {
    const [x, y] = point;
    return [(x - offSet.x) * scale, (y - offSet.y) * scale]
}

export const invertScalePoint = (point: number[], offSet: { x: number, y: number }, scale: number): number[] => {
    const [x, y] = point;
    return [(x + offSet.x * scale)/scale, (y + offSet.y * scale) / scale]
}