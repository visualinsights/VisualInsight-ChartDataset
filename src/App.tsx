import React from 'react';
import './App.css';
import store from "./store";
import Header from "./components/Header";
import ControlBar from "./components/ControlBar";
import Gallery from "./components/Gallery";
import {Provider} from "react-redux";

const App = () => {
    return <Provider store={store}>
        <div className="App">
            <Header/>
            <ControlBar/>
            <Gallery/>
        </div>
    </Provider>

}

export default App;
