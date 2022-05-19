import {RootState} from "./index";
import {useSelector} from "react-redux";
import {createSelector} from "reselect";
import {GlobalState} from "./GlobalStore";

const selectData = createSelector(
    (state: RootState) => state.global,
    (global: GlobalState) => ({...global})
);

export const useGlobalState: () => GlobalState = () => useSelector(selectData);
