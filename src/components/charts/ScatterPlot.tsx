import React, {useEffect, useImperativeHandle, useRef, useState} from "react";
import {ConvexHullAlgorithm, findArrMax, findArrMin, randomChoice} from "../../utils/utils";
import {colorList} from "../../utils/constants";

const echarts = require("echarts");

const ScatterPlot = (props: any) => {
    const {data, insightType, params} = props;
    const currentNode = useRef(null);
    // configuration
    const color = randomChoice(colorList);
    const symbolSize = 6 + Math.random() * 6;

    const grid = {
        top: `${5 + Math.random() * 17}%`,
        bottom: `${10 + Math.random() * 8}%`,
        left: `${10 + Math.random() * 8}%`,
        right: `${3 + Math.random() * 6}%`,
    }

    const [mChart, setMChart] = useState(null);

    useImperativeHandle(props.onRef, () => {
        return {getBBox}
    })

    useEffect(() => {
        renderScatterplot();
    }, [])

    const renderScatterplot = () => {
        const option = {
            title: {
                text: "This is a scatterplot",
                left: "center"
            },
            backgroundColor: '#fff',
            xAxis: {
                type: "value",
                name: "xAxis_labels",
                nameGap: 30,
                nameLocation: "middle",
                axisLabel: {
                    fontSize: 12
                }
            },
            yAxis: {
                type: "value",
                axisLine: {
                    show: true
                },
                name: "yAxis_values",
                nameLocation: "middle",
                nameGap: 30,
                axisLabel: {
                    fontSize: 12
                }
            },
            grid,
            series: [
                {
                    data: data,
                    type: "scatter",
                    itemStyle: {
                        color,
                    },
                    symbolSize
                },
            ],
        }
        const chart = echarts.init(currentNode.current);
        chart.setOption(option);
        setMChart(chart);
    }

    const getRelationBBox = () => {

        // get the series model
        // @ts-ignore
        const model = mChart.getModel().getSeriesByIndex(0); // `getSeriesByType`/`getSeriesByName` is available
        // get the series view
        // @ts-ignore
        const view = mChart.getViewOfSeriesModel(model);
        // get the element group
        const group = view.group;
        // get all the elements in the group
        let elements = group.childrenRef();

        // get the bounding rectangle of one element
        const boundingRect = elements.map((e: any) => e.childrenRef());

        const points = boundingRect[0].map((e: any) => e.position);

        // 凸包算法找到轮廓
        const boundaryPoints = ConvexHullAlgorithm(points).map((p) => [p[0], -p[1]]);

        const getCaption = () => {
            const template = [
                `This scatter plot shows the points the ${insightType}.`,
                `It is a scatter plot, the points are ${insightType}.`,
                `The points in the scatter plot shows the ${insightType}`,
                `The points are relative, the relation of these points are ${insightType}.`
            ]

            return template;
        }

        const captions = [getCaption()];
        const bboxs = [[boundaryPoints]];

        return {bboxs, captions}
    }

    const getClusterBBox = () => {
        const {clusters} = params;

        // get the series model
        // @ts-ignore
        const model = mChart.getModel().getSeriesByIndex(0); // `getSeriesByType`/`getSeriesByName` is available
        // get the series view
        // @ts-ignore
        const view = mChart.getViewOfSeriesModel(model);
        // get the element group
        const group = view.group;
        // get all the elements in the group
        let elements = group.childrenRef();

        // get the bounding rectangle of one element
        const boundingRect = elements.map((e: any) => e.childrenRef());

        const points = boundingRect[0].map((e: any) => e.position);

        let base = 0;
        const boundaryPoints = clusters.map((num: number) => {
            const subPoints = points.slice(base, base + num);
            base += num;
            // 凸包算法找到轮廓
            return ConvexHullAlgorithm(subPoints).map((p) => [p[0], -p[1]]);
        })

        const getCaption = () => {
            const template = [
                `There are ${clusters.length} clusters in the scatter plot.`,
                `There shows ${clusters.length} cluster in the scatter plot.`,
                `The scatter plot contains ${clusters.length} clusters.`
            ]

            return template;
        }

        const captions = [getCaption()];
        const bboxs = [boundaryPoints];
        return {bboxs, captions}
    }

    const getBBox = () => {
        if (insightType === "positive relation" || insightType === "negative relation") {
            return getRelationBBox();
        } else if (insightType === "cluster") {
            return getClusterBBox();
        }
    }

    return <div className={"Scatterplot"}>
        <div style={{width: 350, height: 350}}
             ref={currentNode}/>
    </div>
}

export default ScatterPlot;
