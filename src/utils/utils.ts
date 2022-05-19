import {chainHull_2D, Point, sortPointX, sortPointY} from "./convex_hull";

export const findArrMax = (arr: number[]) => {
    const mx = Math.max(...arr);
    const index = arr.findIndex((a) => a === mx);
    return index;
}

export const findArrMin = (arr: number[]) => {
    const mn = Math.min(...arr);
    const index = arr.findIndex((a) => a === mn);
    return index;
}

/**
 * 二进制容器
 * @param {String} dataurl
 */
const getUint8Arr = (dataurl: any) => {
    // 截取base64的数据内容
    let arr = dataurl.split(','),
        mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]),
        // 获取解码后的二进制数据的长度，用于后面创建二进制数据容器
        n = bstr.length,
        // 创建一个Uint8Array类型的数组以存放二进制数据
        u8arr = new Uint8Array(n)
    // 将二进制数据存入Uint8Array类型的数组中
    while (n--) {
        u8arr[n] = bstr.charCodeAt(n)
    }
    return {u8arr, mime}
}

// 将canvas转换为blob
export const convertCanvasToBlob = (canvas: any) => {
    const dataURL = canvas.toDataURL("image/png");
    const uint8 = getUint8Arr(dataURL);
    const blob = new Blob([uint8.u8arr], {type: uint8.mime});
    return blob;
}

// 列表随机选择一个数
export const randomChoice = (array: any[]) => {
    const length = array.length;
    const index = Math.floor(Math.random() * length);
    return array[index];
}

// 转换bbox为position
export const convertBboxToPosition = (bbox: any) => {
    const {x, y, width, height} = bbox;
    return [
        [x, y], [x + width, y], [x + width, y + height], [x, y + height]
    ]
}

// 凸包算法
export const ConvexHullAlgorithm = (points: any[]) => {

    // Use Google Maps’ point class or any point class with x() and y() methods defined
    const hullPoints: any[] = [];
    let hullPoints_size;

    // Add a couple sample points to the array
    const pointList = points.map((p) => {
        return new Point(p[0], -p[1]);
    })

    // Sort the points by X, then by Y (required by the algorithm)
    pointList.sort(sortPointY);
    pointList.sort(sortPointX);

    // Calculate the convex hull
    // Takes: an (1) array of points with x() and y() methods defined
    //          (2) Size of the points array
    //          (3) Empty array to store the hull points
    // Returns: The number of hull points, which may differ the the hull points array’s size
    hullPoints_size = chainHull_2D(pointList, pointList.length, hullPoints);

    return hullPoints.map((p) => {
        return [p.lat(), p.lng()];
    })
};
