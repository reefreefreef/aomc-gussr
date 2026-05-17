import {CRS, Transformation, Canvas, Map, TileLayer, Util, Control} from "leaflet"


const scaleFactor = 1 / Math.pow(2, 9); 

const MinecraftCRS = Object.create(CRS.Simple);
Object.assign(MinecraftCRS, {
    transformation: new Transformation(
        scaleFactor, 0,
        scaleFactor, 0
    )
});

const canvasRenderer = new Canvas({
  tolerance: 5
});

const map = new Map('map', {
    renderer: canvasRenderer,
    crs: MinecraftCRS,
    center: [0, 0],
    zoom: 7
});

map.whenReady(async () => {
    class MinecraftTileLayer extends TileLayer {
        getTileUrl(coords) {
            // Invert zoom since 0 = 1:1, 1 = 2:1 etc
            const zoomFolder = this.options.maxNativeZoom - coords.z;
            const subdomains = this.options.subdomains;
            const index = Math.abs(coords.x + coords.y) % subdomains.length;

            return Util.template(this._url, {
                z: zoomFolder,
                x: coords.x * 512 * (2 ** zoomFolder), // since tiles use top left coordinate as name
                y: coords.y * 512 * (2 ** zoomFolder),
                s: subdomains[index]
            });
        }
    }

    

    
    var tileLayer = new MinecraftTileLayer(`https://aomc-map.game.algot.net/map/overworld/{z}/{x}_{y}.png?s={s}`, {
        maxNativeZoom: 9,
        minNativeZoom: 0,
        maxZoom: 15,
        minZoom: 0,
        tileSize: 512,
        attribution: '©AOMC Players',
    })
    tileLayer.addTo(map)
})