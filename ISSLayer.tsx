/**
 * Layer for International Space Station.
 * @see https://www.nasa.gov/mission_pages/station/main/index.html
 */

import { Feature } from "@luciad/ria/model/feature/Feature";
import { FeatureModel } from "@luciad/ria/model/feature/FeatureModel";
import { MemoryStore } from "@luciad/ria/model/store/MemoryStore";
import { getReference } from "@luciad/ria/reference/ReferenceProvider";
import { createPoint } from "@luciad/ria/shape/ShapeFactory";
import { FeatureLayer } from "@luciad/ria/view/feature/FeatureLayer";

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

export function createIISLayer() {
    const model = new FeatureModel(new MemoryStore(), {
        reference: CRS84_REFERENCE
    });

    getPosition().then(feature => model.put(feature));

    return new FeatureLayer(model, {
        label: "International Space Station"
    });
}