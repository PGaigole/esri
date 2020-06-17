import {
  Component,
  ElementRef,
  ViewChild,
  OnInit,
  OnDestroy,
} from "@angular/core";
import { loadModules } from "esri-loader";
import esri = __esri;

import markers_data from "../json/markers.json";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
})
export class AppComponent implements OnInit, OnDestroy {
  timer: any;
  vehicleLocations = [];
  // Get a container link for map place
  mapViewElement: ElementRef;
  @ViewChild("mapView", { static: true }) get mapElement(): ElementRef {
    return this.mapViewElement;
  }
  set mapElement(newValue: ElementRef) {
    if (this.mapViewElement !== newValue) {
      this.mapViewElement = newValue;
      // Check that newValue is a defined value, and possibly perform actions here.
    }
  }
  // main map view
  private mapView;
  constructor() {}

  ngOnInit() {
    this.getVehiclesLocation();
    this.initMapView();
    // this.getVehiclesLocation();
    // // this.getTelemetry();
    // setInterval(() => {
    //   //   this.getTelemetry();
    //   this.getVehiclesLocation();
    // }, 10000);
  }

  async initMapView() {
    // This function load Dojo's  require the classes
    // listed in the array modules
    loadModules(["esri/Map", "esri/views/MapView"]).then(
      ([Map, MapView]: [esri.MapConstructor, esri.MapViewConstructor]) => {
        // set default map properties
        const mapProperties = {
          basemap: "streets",
        };
        // create map by default properties
        const map = new Map(mapProperties);
        // set default map view properties
        // container - element in html-template for locate map
        // zoom - default zoom parameter, value from 1 to 18
        const mapViewProperties = {
          container: this.mapViewElement.nativeElement,
          center:
            this.vehicleLocations.length !== 0
              ? this.findMapCenter(this.vehicleLocations[0])
              : [0, 0],
          zoom: 5,
          map,
        };
        // create map view by default properties
        this.mapView = new MapView(mapViewProperties);
        // this.getVehiclesLocation();
        // setInterval(() => {
        // first remove markers
        // this.mapView.graphics.graphics.forEach((graphic) => {
        //   if (graphic) {
        //     this.mapView.graphics.remove(graphic);
        //   }
        // });
        // this.mapView.graphics.clear();
        // then add markers
        this.vehicleLocations.forEach((item) => {
          this.addPointToMap(
            Number(item.properties[0].X),
            Number(item.properties[0].Y)
          );
        });
        // }, 10000);
      }
    );
    // this.timer = setInterval(() => {
    // this.getVehiclesLocation();
    // this.vehicleLocations.forEach((item) => {
    //   this.addPointToMap(
    //     Number(item.properties[0].X),
    //     Number(item.properties[0].Y)
    //   );
    // });
    // }, 60000);
  }

  public async addPointToMap(lat: number, lon: number) {
    const [Graphic] = await loadModules(["esri/Graphic"]);

    const point = {
      type: "point",
      longitude: lon,
      latitude: lat,
    };

    const markerSymbol = {
      type: "simple-marker",
      color: [226, 119, 40],
      outline: {
        color: [255, 255, 255],
        width: 2,
      },
    };

    const pointGraphic = new Graphic({
      geometry: point,
      symbol: markerSymbol,
    });
    // this.mapView.graphics.remove(pointGraphic);
    this.mapView.graphics.add(pointGraphic);
  }

  findMapCenter(input) {
    return [Number(input.properties[0].Y), Number(input.properties[0].X)];
  }

  getVehiclesLocation() {
    this.vehicleLocations = markers_data;
  }

  ngOnDestroy() {
    clearInterval(this.timer);
    if (this.mapView) {
      // destroy the map view
      this.mapView.container = null;
    }
  }
}
