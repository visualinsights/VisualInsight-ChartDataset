export interface setSelectedChartTypes {
    type: "setSelectedChartTypes"
    payload: string[]
}

export interface setChartNum {
    type: "setChartNum",
    payload: number
}

export interface setBase {
    type: "setBase",
    payload: number
}

export interface setSplit {
    type: "setSplit",
    payload: [number, number, number]
}

export interface setChartList {
    type: "setChartList",
    payload: any[]
}


export type GlobalActionTypes = setSelectedChartTypes
    | setChartNum
    | setBase
    | setSplit
    | setChartList
