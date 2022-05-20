import React, {useMemo} from "react";
import {Card, Button} from "antd";
import {convertCanvasToBlob, randomChoice} from "../utils/utils";
import {allInsights, barInsights, lineInsights, pieInsight, scatterInsight} from "../utils/constants";
import {getBarData, getLineData, getPieChartData, getScatterData} from "../utils/chartDataUtils";
import BarChart from "./charts/BarChart";
import LineChart from "./charts/LineChart";
import ScatterPlot from "./charts/ScatterPlot";
import PieChart from "./charts/PieChart";
import {DownloadUtil} from "../utils/downloadUtil";
import {useGlobalState} from "../store/useData";

const Gallery = () => {
    const {chartList, base, split} = useGlobalState();
    const chartRefs = useMemo(() => {
        return chartList.map(() => React.createRef());
    }, [chartList])

    const SPLIT = useMemo(() => {
        let SPLIT: string[] = [];
        ["train", "val", "test"].forEach((name, i) => {
            SPLIT = SPLIT.concat(new Array(split[i]).fill(name));
        })

        return SPLIT;
    }, [split])

    const handleChartSave = () => {
        const downloadUtil = new DownloadUtil();
        const allBBoxs: any[] = [];

        // create folders
        downloadUtil.addFolderInZip("train");
        downloadUtil.addFolderInZip("val");
        downloadUtil.addFolderInZip("test");

        const canvasList = document.querySelectorAll(`canvas`);
        chartRefs.forEach((ref: any, i: number) => {
            const split = randomChoice(SPLIT);
            const type = chartList[i];

            // save image
            const canvas = canvasList[i];
            const blob: any = convertCanvasToBlob(canvas);

            downloadUtil.addFileInZip(`${type}-${base + i}.png`, blob, split);

            // 保存bbox和caption
            const {bboxs, captions, insightType} = ref.current.getBBox();
            allBBoxs.push({
                type: "bar",
                split,
                pairs: bboxs.map((box: any) => {
                    const j = allInsights.findIndex((insight) => insight === insightType);
                    return {
                        heatmap: `${type}-${base + i}-${j}.png`,
                        bbox: box,
                        caption: captions[j]
                    }
                })
            });
        })

        // download annotation
        const content = JSON.stringify({data: allBBoxs});

        downloadUtil.addFileInZip("dataset.json", content);

        // download as zip
        downloadUtil.packageZipAndDownload("charts.zip");
    }

    return <div className={"Gallery"}>
        <Card>
            <Button type={"primary"} onClick={handleChartSave}>Download</Button>

            <div style={{display: "flex", flexWrap: "wrap"}}>
                {chartRefs.map((ref, i) => {
                    /* ---barchart--- */
                    if (chartList[i] === "BarChart") {
                        const insightType = randomChoice(barInsights);
                        const {xLabel, data} = getBarData(insightType);
                        return <BarChart
                            onRef={ref}
                            key={"barchart-" + i}
                            insightType={insightType}
                            xLabel={xLabel}
                            data={data}/>
                    }

                    /* ---linechart--- */
                    if (chartList[i] === "LineChart") {
                        const insightType = randomChoice(lineInsights);
                        const {xLabel, data, params} = getLineData(insightType);
                        return <LineChart
                            onRef={ref}
                            key={"linechart-" + i}
                            insightType={insightType}
                            xLabel={xLabel}
                            data={data}
                            params={params}/>
                    }

                    /* ---scatterplot--- */
                    if (chartList[i] === "ScatterPlot") {
                        const insightType = randomChoice(scatterInsight);
                        const {data, params} = getScatterData(insightType)
                        return <ScatterPlot
                            onRef={ref}
                            key={"scatterplot-" + i}
                            insightType={insightType}
                            data={data}
                            params={params}/>
                    }

                    /* ---piechart--- */
                    if (chartList[i] === "PieChart") {
                        const insightType = randomChoice(pieInsight);
                        const {xLabel, data} = getPieChartData();
                        return <PieChart
                            onRef={ref}
                            key={"piechart-" + i}
                            insightType={insightType}
                            xLabel={xLabel}
                            data={data}/>
                    }
                })}
            </div>
        </Card>
    </div>
}

export default Gallery;
