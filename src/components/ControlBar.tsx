import React, {useState} from 'react';
import {Button, Card, InputNumber, Checkbox} from "antd";
import {allChartTypes} from "../utils/constants";
import {useGlobalState} from "../store/useData";
import {useDispatch} from "react-redux";
import _ from "lodash";

const ControlBar = () => {
    const {selectedChartTypes, chartNum, base, split} = useGlobalState();
    const dispatch = useDispatch();

    const onChartTypesSelect = (checkedValues: any[]) => {
        dispatch({
            type: "setSelectedChartTypes",
            payload: checkedValues
        })
    }

    const onChartNumChange = (value: number) => {
        if (value < 0) return;
        dispatch({
            type: "setChartNum",
            payload: value
        })
    }

    const onBaseChange = (value: number) => {
        if (value < 0) return;
        dispatch({
            type: "setBase",
            payload: value
        })
    }

    const onSplitChange = (value: number, i: number) => {
        if (value < 0) return;
        const newSplit = split.slice();
        newSplit[i] = value;
        dispatch({
            type: "setSplit",
            payload: newSplit
        })
    }

    const onRun = () => {
        let chartList: any[] = [];
        selectedChartTypes.forEach((type) => {
            chartList = chartList.concat(new Array(chartNum).fill(type));
        })

        dispatch({
            type: "setChartList",
            payload: _.shuffle(chartList)
        })
    }

    return <div className={"ControlBar"}>
        <Card>
            <div className={"configRow"}>
                <div className={"configItem"}>
                    <div className={"configName"}>ChartTypes:</div>
                    <Checkbox.Group
                        options={allChartTypes}
                        defaultValue={selectedChartTypes}
                        onChange={onChartTypesSelect}/>
                </div>
            </div>
            <div className={"configRow"}>
                <div className={"configItem"}>
                    <div className={"configName"}>ChartNum:</div>
                    <InputNumber value={chartNum} onChange={onChartNumChange}/>
                </div>

                <div className={"configItem"}>
                    <div className={"configName"}>Base:</div>
                    <InputNumber value={base} onChange={onBaseChange}/>
                </div>

                <div className={"configItem"}>
                    <div className={"configName"}>Train-Val-Test:</div>
                    <InputNumber value={split[0]} onChange={(value) => onSplitChange(value, 0)}/> -
                    <InputNumber value={split[1]} onChange={(value) => onSplitChange(value, 1)}/> -
                    <InputNumber value={split[2]} onChange={(value) => onSplitChange(value, 2)}/>
                </div>

                <Button type={"primary"} onClick={onRun}>Run</Button>
            </div>
        </Card>
    </div>
}

export default ControlBar;
