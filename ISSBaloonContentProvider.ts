import { Feature } from "@luciad/ria/model/feature/Feature";
import { FeatureLayer } from "@luciad/ria/view/feature/FeatureLayer";

function getPositionMetadata(feature: Feature) {
    const latitude = feature.properties.latitude;
    const longitude = feature.properties.longitude;

    const GET_METADATA_API = `https://api.wheretheiss.at/v1/coordinates/${latitude},${longitude}`;

    return fetch(GET_METADATA_API)
        .then(response => response.json());
}


export function balloonContentProvider(feature: any) {
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
