import React, {useEffect, useImperativeHandle, useRef, useState} from "react";
import {convertBboxToPosition, findArrMax, findArrMin, randomChoice} from "../../utils/utils";
import {colorList} from "../../utils/constants";

const echarts = require("echarts");

const BarChart = (props: any) => {
    const {xLabel, data, insightType} = props;
    const currentNode = useRef(null);

    // configuration
    const color = randomChoice(colorList);
    const barWidth = Math.floor(55 + Math.random() * 30);
    const maxValue = Math.floor(Math.max(...data) + 5 + Math.random() * 45);
    const labelShow = Math.random() > 0.5;
    const grid = {
        top: `${5 + Math.random() * 12}%`,
        bottom: `${10 + Math.random() * 8}%`,
        left: `${10 + Math.random() * 8}%`,
        right: `${3 + Math.random() * 6}%`,
    }

    const [mChart, setMChart] = useState(null);

    useImperativeHandle(props.onRef, () => {
        return {getBBox}
    })

    useEffect(() => {
        renderBarChart();
    }, [])

    const renderBarChart = () => {
        const option = {
            title: {
                text: "This is a barchart",
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
                    type: "bar",
                    itemStyle: {
                        color,
                    },
                    label: {
                        show: labelShow,
                        position: 'top',
                        formatter: (param: any) => {
                            return param.value.toFixed(2);
                        }
                    },
                    barWidth: `${barWidth}%`
                },
            ],
        }
        const chart = echarts.init(currentNode.current);
        chart.setOption(option, true);
        setMChart(chart);
    }

    const getChartComponentBBox = (myChart: any, name: string) => {
        const model = myChart.getModel().getComponent(name);
        const view = myChart.getViewOfComponentModel(model);
        const group = view.group;
        // get all the elements in the group
        const elements = group.childrenRef();
        // get the bounding rectangle of one element
        const boundingRect = elements.map((e: any) => e.getBoundingRect());
        return boundingRect;
    };

    // extreme insight
    const extremeBBox = () => {
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

        elements = elements.filter((item: any) => {
            return item.constructor.name === "Rect";
        });

        // get the bounding rectangle of one element
        const boundingRect = elements.map((e: any) => e.getBoundingRect());

        // get label bbox
        const xAxis = getChartComponentBBox(mChart, "xAxis")[0];
        const labelWidth = xAxis.width / data.length
        let from = xAxis.x;
        const labels = new Array(data.length).fill(0).map(() => {
            const to = from + labelWidth;
            const {y, height} = xAxis;
            const result = [
                [from, y], [to, y], [to, y + height], [from, y + height]
            ]
            from = to;
            return result;
        })

        const bboxs = [];
        const captions = [];

        const getCaption = (type: string, index: number) => {
            const templates: any = {
                "max": [
                    `The max value in the bar chart is in the ${xLabel[index]}.`,
                    `${xLabel[index]} is the max value in the bar chart.`,
                    `${xLabel[index]}'s value is higher than others.`
                ],
                "min": [
                    `The min value in the bar chart is in the ${xLabel[index]}.`,
                    `${xLabel[index]} is the min value in the bar chart.`,
                    `${xLabel[index]}'s value is lower than others.`
                ]
            }
            return templates[type];
        }

        // find the max
        const mxIndex = findArrMax(data);
        bboxs.push([
            convertBboxToPosition(boundingRect[mxIndex]),
            labels[mxIndex]
        ])
        captions.push(getCaption("max", mxIndex));

        // find the min
        const mnIndex = findArrMin(data);
        bboxs.push([
            convertBboxToPosition(boundingRect[mnIndex]),
            labels[mnIndex]
        ])
        captions.push(getCaption("min", mxIndex));

        return {bboxs, captions, insightType: ["maximal", "minimum"]};
    }

    // evenness insight
    const evennessBBox = () => {
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

        elements = elements.filter((item: any) => {
            return item.constructor.name === "Rect";
        });

        // get the bounding rectangle of one element
        const boundingRect = elements.map((e: any) => e.getBoundingRect());

        const bboxs = [];

        const minX = Math.min(...boundingRect.map((e: any) => e.x));
        const maxX = Math.max(...boundingRect.map((e: any) => e.x));
        const minY = Math.min(...boundingRect.map((e: any) => e.y));
        const width = boundingRect[0].width;
        const maxHeight = Math.max(...boundingRect.map((e: any) => e.height));

        bboxs.push([[
            [minX, minY], [maxX + width, minY], [maxX + width, minY + maxHeight], [minX, minY + maxHeight]
        ]])
        const getCaption = () => {
            const templates = [
                `This bar chart's value is ${insightType}.`,
                `It shows the values of the bar chart is ${insightType}.`,
                `All of the bar height in the bar chart looks ${insightType}.`
            ];
            return templates;
        }
        const captions = [getCaption()];

        return {bboxs, captions, insightType};
    }

    const getBBox = () => {
        if (insightType === "extreme") {
            return extremeBBox();
        } else if (insightType === "evenness") {
            return evennessBBox();
        }
    }

    return <div className={"BarChart"}>
        <div style={{width: 350, height: 350}}
             ref={currentNode}/>
    </div>
}

export default BarChart;
