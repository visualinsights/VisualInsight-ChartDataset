import React, {useEffect, useImperativeHandle, useRef, useState} from "react";
import {findArrMax, findArrMin, randomChoice} from "../../utils/utils";
import {colorList} from "../../utils/constants";

const echarts = require("echarts");

const LineChart = (props: any) => {
    const {xLabel, data, insightType, params} = props;
    const currentNode = useRef(null);

    // configuration
    const color = randomChoice(colorList);
    const lineWidth = 1 + Math.random() * 5;
    const maxValue = Math.floor(Math.max(...data) + 5 + Math.random() * 45);
    const labelShow = Math.random() > 0.5;
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
        renderLineChart();
    }, [])

    const renderLineChart = () => {
        const option = {
            title: {
                text: "This is a linechart",
                left: "center"
            },
            backgroundColor: '#fff',
            grid,
            xAxis: {
                type: "category",
                data: xLabel,
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
                max: maxValue,
                axisLabel: {
                    fontSize: 12
                }
            },
            series: [
                {
                    data: data,
                    type: "line",
                    itemStyle: {color},
                    lineStyle: {
                        width: lineWidth
                    },
                    label: {
                        show: labelShow,
                        position: 'top',
                        formatter: (param: any) => {
                            return param.value.toFixed(2);
                        }
                    },
                },
            ],
        }
        const chart = echarts.init(currentNode.current);
        chart.setOption(option);
        setMChart(chart);
    }

    const getBBox = () => {
        if (insightType === "ascending" || insightType === "descending") {
            return tendencyBBox();
        } else if (insightType === "outlier") {
            return outlierBBox();
        }
    }

    const tendencyBBox = () => {
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
        const boundingRect = elements[0].childrenRef();

        const points = boundingRect.map((e: any) => e.position);

        let bboxs = [];

        for (let i = 0; i < points.length; i++) {
            const point = points[i];
            bboxs.push([point[0], point[1] - 10]);
        }

        for (let i = points.length - 1; i >= 0; i--) {
            const point = points[i];
            bboxs.push([point[0], point[1] + 10]);
        }

        bboxs = [[bboxs]]

        const getCaption = () => {
            const templates = [
                `A line chart with the ${insightType} tendency.`,
                `This line chart shows the ${insightType} tendency.`,
                `The line chart's tendency is ${insightType}.`,
                `It shows the ${insightType} tendency in the line chart.`
            ];
            return templates;
        }
        const captions = [getCaption()];
        return {bboxs, captions, insightType}
    }

    const outlierBBox = () => {
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
        const boundingRect = elements[0].childrenRef();

        const points = boundingRect.map((e: any) => e.position);

        const {outlierIndex} = params;
        const point = points[outlierIndex];

        let bboxs = [
            [point[0] - 10, point[1] - 10],
            [point[0] + 10, point[1] - 10],
            [point[0] + 10, point[1] + 10],
            [point[0] - 10, point[1] + 10],
        ];

        bboxs = [[bboxs]]

        const getCaption = () => {
            const templates = [
                `This is an ${insightType} in the line chart.`,
                `This line chart contains an ${insightType}.`,
                `This point is out of distribution, as an ${insightType}.`
            ];
            return templates;
        }

        const captions = [getCaption()];
        return {bboxs, captions, insightType}
    }

    return <div className={"LineChart"}>
        <div style={{width: 350, height: 350}}
             ref={currentNode}/>
    </div>
}

export default LineChart;
