import {findArrMax, findArrMin, randomChoice} from "./utils";
import {xLabels} from "./constants";
import _ from "lodash";

// bar chart data
export const getBarData = (insightType: string) => {
    const xLabel = randomChoice(xLabels);
    // const xLabel = [1, 2, 3, 4, 5, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]
    let data = [];
    if (insightType === "evenness") {
        const range = 3 + Math.random() * 3;
        data = xLabel.map(() => 60 + Math.random() * range);
    } else {
        const range = 20 + Math.random() * 120;
        data = xLabel.map(() => 5 + Math.random() * range);
        const mxIndex = findArrMax(data);
        const mnIndex = findArrMin(data);
        data[mxIndex] += 30;
        data[mnIndex] = Math.max(5, data[mnIndex] - 20);
    }
    return {xLabel, data};
}

// line chart data
export const getLineData = (insightType: string) => {
    const xLabel = randomChoice(xLabels);
    let data = [];
    let params = {};
    if (insightType === "ascending") {
        let lastValue = 10 + Math.random() * 5;
        data = xLabel.map(() => {
            const nextValue = lastValue + 15 * Math.random();
            lastValue = nextValue;
            return nextValue;
        });
    } else if (insightType === "descending") {
        let lastValue = 100 + Math.random() * 5;
        data = xLabel.map(() => {
            const nextValue = lastValue - 15 * Math.random();
            lastValue = nextValue;
            return nextValue;
        });
    } else if (insightType === "outlier") {
        const meanValue = 50 + Math.random() * 20;
        const outlierIndex = Math.floor(Math.random() * xLabel.length);
        // @ts-ignore
        params.outlierIndex = outlierIndex;
        data = xLabel.map((l: any, i: number) => {
            const signal = Math.random() > 0.5 ? 1 : -1;
            if (i === outlierIndex) {
                const offset = signal * (60 + Math.random() * 5);
                return meanValue + offset
            } else {
                return meanValue + signal * Math.random() * 5;
            }
        })
    }

    return {xLabel, data, params};
}

// scatter plot data
export const getScatterData = (insightType: string) => {
    let data = [];
    let params: any = [];
    if (insightType === "positive relation") {
        const k = 0.5 + Math.random() * 2;
        const b = 15;
        const num = Math.floor(20 + Math.random() * 100);
        for (let i = 0; i < num; i++) {
            const offset = Math.random() * (5 + Math.random() * 20);
            const signal = Math.random() > 0.5 ? 1 : -1;
            const x = Math.random() * 100;
            const y = k * x + b + offset * signal;
            data.push([x, y]);
        }
    } else if (insightType === "negative relation") {
        const k = -0.5 - Math.random() * 2;
        const b = 200;
        const num = Math.floor(20 + Math.random() * 100);
        for (let i = 0; i < num; i++) {
            const offset = Math.random() * (5 + Math.random() * 20);
            const signal = Math.random() > 0.5 ? 1 : -1;
            const x = Math.random() * 100;
            const y = k * x + b + offset * signal;
            data.push([x, y]);
        }
    } else if (insightType === "cluster") {
        const centerPointsList = [
            [[20, 60], [60, 40]],
            [[30, 20], [20, 80], [60, 40]],
            [[30, 40], [70, 50], [20, 5], [40, 80]],
        ];

        const centerPoints = randomChoice(centerPointsList);

        params.clusters = centerPoints.map((point: any) => {
            const num = Math.floor(25 + Math.random() * 30);
            for (let i = 0; i < num; i++) {
                let offset = Math.random() * 10;
                let signal = Math.random() > 0.5 ? 1 : -1;
                const x = point[0] + offset * signal;
                offset = Math.random() * 10;
                signal = Math.random() > 0.5 ? 1 : -1;
                const y = point[1] + offset * signal;
                data.push([x, y]);
            }
            return num;
        })
    }

    return {data, params};
}

// pie chart data
export const getPieChartData = () => {
    const xLabel = randomChoice(xLabels);
    let data = [];
    for (let i = 0; i < xLabel.length - 1; i++) {
        data.push(Math.random() * 10);
    }
    data.push(_.sum(data) + 10);
    data = _.shuffle(data);
    return {xLabel, data};
}

// complex bar chart data
export const getComplexBarData = () => {

}

// complex scatter plot data
export const getComplexScatterData = () => {

}
