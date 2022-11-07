import { SingleMapSample } from "@luciad/ria-sample-common/components/SingleMapSample";
import { Map } from "@luciad/ria/view/Map";
import React from "react";
import ReactDOM from "react-dom";
import { createIISLayer } from "./ISSLayer";

async function onInit(map: Map) {
    console.log("Map has been initialized!");

    map.layerTree.addChild(createIISLayer());
}

ReactDOM.render(
    <SingleMapSample onInit={onInit} />,
    document.getElementById("root")
);
