import {GlobalActionTypes} from "./GlobalActions";
import {allChartTypes} from "../utils/constants";

export type GlobalState = {
    selectedChartTypes: string[],
    chartNum: number,
    base: number,
    split: [number, number, number],
    chartList: any[]
}

const initialGlobalState: () => GlobalState = () => ({
    selectedChartTypes: allChartTypes,
    chartNum: 10,
    base: 0,
    split: [8, 1, 1],
    chartList: []
});

const globalReducer: (state: GlobalState, action: GlobalActionTypes) => GlobalState = (state = initialGlobalState(), action) => {
    switch (action.type) {
        case "setSelectedChartTypes":
            return {
                ...state,
                selectedChartTypes: action.payload
            }
        case "setChartNum":
            return {
                ...state,
                chartNum: action.payload
            }
        case "setBase":
            return {
                ...state,
                base: action.payload
            }
        case "setSplit":
            return {
                ...state,
                split: action.payload
            }
        case "setChartList":
            return {
                ...state,
                chartList: action.payload
            }
        default:
            return state;
    }
};
export default globalReducer;
