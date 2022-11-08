import { UrlTileSetModel } from "@luciad/ria/model/tileset/UrlTileSetModel";
import { getReference } from "@luciad/ria/reference/ReferenceProvider";
import { createBounds } from "@luciad/ria/shape/ShapeFactory";
import { RasterTileSetLayer } from "@luciad/ria/view/tileset/RasterTileSetLayer";

const WEB_MERCATOR_REFERENCE = getReference("EPSG:900913");
const WEB_MERCATOR_BOUNDS = createBounds(WEB_MERCATOR_REFERENCE, [
    -20037508.34278924,
    40075016.68557848,
    -20037508.352,
    40075016.704
]);

export function createRainViewerLayer() {
    const API_URL = "https://tilecache.rainviewer.com/v2/satellite/aca26b0ff20f/256/{z}/{x}/{-y}/0/0_0.png";

    const model = new UrlTileSetModel({
        baseURL: API_URL,
        bounds: WEB_MERCATOR_BOUNDS,
        reference: WEB_MERCATOR_REFERENCE,
        level0Columns: 1,
        level0Rows: 1,
    });

    const layer = new RasterTileSetLayer(model, {
        label: "Rainviewer-Satellite"
    });

    return layer;
}