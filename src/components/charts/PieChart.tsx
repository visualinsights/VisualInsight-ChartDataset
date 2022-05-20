import React, {useEffect, useImperativeHandle, useRef, useState} from "react";
import {findArrMax} from "../../utils/utils";

const echarts = require("echarts");
const PieChart = (props: any) => {
    const {xLabel, data, insightType} = props;
    const [mChart, setMChart] = useState(null);
    const currentNode = useRef(null);

    useEffect(() => {
        renderChart();
    }, []);

    useImperativeHandle(props.onRef, () => {
        return {getBBox}
    })

    const renderChart = () => {
        const option = {
            backgroundColor: '#fff',
            series: [
                {
                    data: data.map((value: any, idx: any) => {
                        return {value, name: xLabel[idx]}
                    }),
                    type: "pie",
                    radius: '70%',
                },
            ],
        };
        const chart = echarts.init(currentNode.current);
        chart.setOption(option);

        setMChart(chart);
    };

    const getBBox = () => {
        // get the series model
        // @ts-ignore
        const model = mChart.getModel().getSeriesByIndex(0); // `getSeriesByType`/`getSeriesByName` is available
        // get the series view
        // @ts-ignore
        const view = mChart.getViewOfSeriesModel(model);
        // get the element group
        const group = view.group;
        // get all the elements in the group
        const elements = group.childrenRef();
        // get the bounding rectangle of one element
        const arcs = elements.map((e: any) => e.shape);

        const mxIndex = findArrMax(arcs.map((a: any) => a.angle));
        const maxArc = arcs[mxIndex];

        const {angle, cx, cy, r, startAngle} = maxArc;

        const fixations = [[cx, cy]];

        const perAngle = angle / 10;
        for (let i = 0; i < 11; i++) {
            const a = startAngle - Math.PI / 2 + perAngle * i;
            const x = cx - r * Math.sin(a);
            const y = cy + r * Math.cos(a);
            fixations.push([x, y]);
        }

        const bboxs = [[fixations]];
        const captions = ["This value is the dominant value in the pie chart."];

        return {bboxs, captions, insightType}
    }

    return <div className={"PieChart"}>
        <div style={{width: 350, height: 350}}
             ref={currentNode}/>
    </div>
};

export default PieChart;
