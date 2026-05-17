import { useEffect, useState } from 'react';
import { CRS, Transformation, Canvas, Map, TileLayer, Util, Control, Marker, circleMarker } from "leaflet"
import { useAuth } from './API';


export default function AlgotMap({ options }) {

  

    const { bearerToken, getGuess } = useAuth();


    var previousMarker = null;

    if (options.previous) {
        useEffect(() => {
            if (bearerToken) {
                console.log('gettting')
                getGuess(1, (e) => {
                    console.log("gotten", e)
                    options.setPrevious(e.previousGuess)
                    console.log(previousMarker)
                })
            }
        }, [bearerToken])
    }

    useEffect(() => {




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
        
        if (options.input) {
            var userSelect = L.marker([0, 0], { draggable: true }).addTo(map);
            userSelect.on('drag', function (e) {
                var position = userSelect.getLatLng();
                options.input({
                    x: position.lat,
                    y: position.lng
                })
                console.log("Marker moved to: " + position.lat + ", " + position.lng);
            });
        }

        if (options.answer) {
            console.log(options.answer)
            const answerCoords = JSON.parse(options.answer)

            var previousSelection = L.circleMarker([answerCoords.x, answerCoords.y]).addTo(map);

            previousSelection.bindTooltip("Answer")
        }

        if (options.otherGuesses) {
            for (let i = 0; i < options.otherGuesses.length; i++) {
                const guess = options.otherGuesses[i];
                const guessCoords = JSON.parse(guess.guess)

                var previousSelection = L.marker([guessCoords.x, guessCoords.x]).addTo(map);

                previousSelection.bindTooltip(guess.user)
            }
        }

        
        if (options.previous) {
            console.log("placing marker at ", options.previous)
            var previousSelection = L.circleMarker([options.previous.x, options.previous.y], {
                fillColor: "#0f0"
            }).addTo(map);

            previousSelection.bindTooltip("Previous Selection")

        }



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
        return () => {
            map.remove();
        };
    }, [options.previous]);

    return (<div id="map"></div>)
}