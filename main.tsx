import { SingleMapSample } from "@luciad/ria-sample-common/components/SingleMapSample";
import { Map } from "@luciad/ria/view/Map";
import React from "react";
import ReactDOM from "react-dom";

async function onInit(map: Map) {
    console.log("Map has been initialized!");
}

ReactDOM.render(
    <SingleMapSample onInit={onInit} />,
    document.getElementById("root")
);
