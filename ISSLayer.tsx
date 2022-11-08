/**
 * Layer for International Space Station.
 * 
 * @see https://www.nasa.gov/mission_pages/station/main/index.html
 */

import { Feature } from "@luciad/ria/model/feature/Feature";
import { FeatureModel } from "@luciad/ria/model/feature/FeatureModel";
import { MemoryStore } from "@luciad/ria/model/store/MemoryStore";
import { getReference } from "@luciad/ria/reference/ReferenceProvider";
import { Point } from "@luciad/ria/shape/Point";
import { createCircleByCenterPoint, createPoint } from "@luciad/ria/shape/ShapeFactory";
import { FeatureLayer } from "@luciad/ria/view/feature/FeatureLayer";
import { FeaturePainter } from "@luciad/ria/view/feature/FeaturePainter";
import { MapNavigator } from "@luciad/ria/view/MapNavigator";

const GET_POSITION_API = 'https://api.wheretheiss.at/v1/satellites/25544';
const CRS84_REFERENCE = getReference('CRS:84');

function getPosition() {
    return fetch(GET_POSITION_API)
        .then(response => response.json())
        .then(data => {
            const coords = [
                data.longitude,
                data.latitude,
                data.altitude * 1000
            ];

            const shape = createPoint(CRS84_REFERENCE, coords);

            return new Feature(shape, data, data.id);
        });
}

/**
 * @returns A paiter that uses an ISS 3D model.
 * 
 * @see https://www.nasa.gov/specials/3d/iss-viewer.html
 */
function createPainter() {
    const painter = new FeaturePainter();

    painter.paintBody = (geoCanvas, feature, shape, map, layer, state) => {
        geoCanvas.drawIcon3D(shape, {
            meshUrl: 'data/ISS_stationary.glb',
            scale: {
                x: 1000,
                y: 1000,
                z: 1000
            }
        });

        const footprintCircle = createCircleByCenterPoint(CRS84_REFERENCE,
            shape as any,
            feature.properties.footprint * 100);
        geoCanvas.drawShape(footprintCircle, {
            fill: {
                color: "rgba(3, 160, 98, 0.3)"
            },
            stroke: {
                color: "rgba(0, 255, 0, 0.6)"
            }
        })
    };

    return painter;
}

function setAutoNavigation(layer: FeatureLayer) {
    layer.workingSet.on('WorkingSetChanged', (event, feature) => {
        if (feature) {
            const mapNavigator = layer.map?.mapNavigator as MapNavigator;
            mapNavigator.pan({
                targetLocation: feature.shape as Point,
                animate: {
                    duration: 1000
                }
            });
        }
    });
}

function getPositionMetadata(feature: Feature) {
    const latitude = feature.properties.latitude;
    const longitude = feature.properties.longitude;

    const GET_METADATA_API = `https://api.wheretheiss.at/v1/coordinates/${latitude},${longitude}`;

    return fetch(GET_METADATA_API)
        .then(response => response.json());
}

function balloonContentProvider(feature: any) {
    const div = document.createElement("div");

    getPositionMetadata(feature)
        .then(metadata => {
            const timezone = metadata["timezone_id"];
            const countryCode = metadata["country_code"];
            const template = `<li><b>Timezone:</b> ${timezone}</li><br>`;

            if (countryCode !== "??") {
                const image = `https://countryflagsapi.com/png/${countryCode}`;

                return template
                    + `<li><b>Country:</b> ${countryCode}</li><br>`
                    + `<img style="border: 0 none transparent;" height="200" width="150" src="${image}">`
            }

            return template;
        })
        .then(template => div.innerHTML = template);

    return div;
}

export function createIISLayer() {
    const model = new FeatureModel(new MemoryStore(), {
        reference: CRS84_REFERENCE
    });

    const updatePosition = () => getPosition().then(feature => model.put(feature));
    setInterval(updatePosition, 3000);

    const layer = new FeatureLayer(model, {
        label: "International Space Station",
        painter: createPainter(),
        selectable: true
    });

    setAutoNavigation(layer);

    layer.balloonContentProvider = balloonContentProvider;

    return layer;
}