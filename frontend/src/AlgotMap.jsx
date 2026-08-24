import { useEffect, useState, useRef } from 'react';
const { CRS, Transformation, Canvas, TileLayer, Util, Control, Marker, circleMarker } = L;
import { useAuth } from './API';

import L from "leaflet";

let heatPluginPromise;

function loadHeatPlugin() {
    if (L.heatLayer) return Promise.resolve();

    window.L = L;

    if (!heatPluginPromise) {
        heatPluginPromise = new Promise((resolve, reject) => {
            const script = document.createElement("script");
            script.src = "/leaflet-heat.js";
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
        });
    }

    return heatPluginPromise;
}


export default function AlgotMap({ options }) {



    const { bearerToken, getGuess } = useAuth();



    var previousMarker = null;

    useEffect(() => {
        if (bearerToken) {

            getGuess(1, (e) => {

                if (options.setPrevious) {
                    options.setPrevious(e.previousGuess)
                }
            })
        }
    }, [bearerToken])

    const mapRef = useRef(null);



    useEffect(() => {

        if (!mapRef.current || bearerToken === "null") return;

        let cancelled = false;

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
        const map = L.map(mapRef.current, {
            crs: MinecraftCRS,
            renderer: canvasRenderer,
            center: [0, 0],
            zoom: 7,
        });



        if (options.input && !options.previous) {
            var userSelect = L.marker([0, 0], { draggable: true }).addTo(map);
            userSelect.on('drag', function (e) {
                var position = userSelect.getLatLng();
                options.input({
                    x: position.lng,
                    y: position.lat
                })

            });

            map.on('click', function (e) {
                var lat = e.latlng.lat;
                var lng = e.latlng.lng;
                userSelect.setLatLng([lat, lng])
                options.input({
                    x: lng,
                    y: lat
                })
            });
        }

        if (options.answer) {

            const answerCoords = options.answer
            var previousSelection = L.circleMarker([answerCoords.y, answerCoords.x]).addTo(map);

            previousSelection.bindTooltip("Answer")

            if (options.answer && !options.ownGuess) map.flyTo(previousSelection.getLatLng());
        }

        if (options.otherGuesses) {
            for (let i = 0; i < options.otherGuesses.length; i++) {
                const guess = options.otherGuesses[i];
                const guessCoords = JSON.parse(guess.guess)

                var previousSelection = L.marker([guessCoords.y, guessCoords.x]).addTo(map);

                previousSelection.bindTooltip(guess.user)
            }
        }


        if (options.previous) {

            var previousSelection = L.circleMarker([options.previous.y, options.previous.x], {
                fillColor: "#0f0"
            }).addTo(map);

            map.setView([options.previous.y, options.previous.x])

            previousSelection.bindTooltip("Current Selection")

        }
        if (options.heatmap) {
            loadHeatPlugin().then(() => {
                if (cancelled || !map._panes?.overlayPane) return;

                if (true) {
                    const points = options.heatmap.map(({ x, y }) => [y, x, 15]);

                    L.heatLayer(points, {
                        radius: 60,
                        blur: 20,
                        gradient: {0: 'yellow', 1: 'red'},
                        minOpacity: 0.3,
                    }).addTo(map);
                }
            })
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




            var tileLayer = new MinecraftTileLayer(`https://{s}.map.diorite.xyz/map/overworld/{z}/{x}_{y}.png?s={s}`, {
                maxNativeZoom: 9,
                minNativeZoom: 0,
                maxZoom: 15,
                minZoom: 0,
                tileSize: 512,
                attribution: '©AOMC Players',
                subdomains: "abcd"
            })
            tileLayer.addTo(map)

            if (options.ownGuess) {
                var latlngs = [
                    [options.ownGuess.own.y, options.ownGuess.own.x],
                    [options.ownGuess.answer.y, options.ownGuess.answer.x]
                ];

                var polyline = L.polyline(latlngs, { color: 'red' }).addTo(map);
                map.flyToBounds(polyline.getBounds().pad(0.5));
            }

            setTimeout(() => {
                map.invalidateSize();
            }, 50);
        })
        return () => {
            cancelled = true;
            map.remove();
        };
    }, [
        options.previous,
        options.ownGuess,
        bearerToken,
        options.answer,
        options.heatmap,
    ]);


    return (<div ref={mapRef} id="map"></div>)
}