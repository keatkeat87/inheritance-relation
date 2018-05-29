import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, OnInit, ViewChild, Input } from '@angular/core';

import { GoogleMapService } from './google-map.service';

declare let google: any;

export type GoogleMapPosition = {
  lat: number,
  lng: number
};

export class GoogleMapSetting {
  constructor(data: GoogleMapSetting) {
    Object.assign(this, data);
  }
  zoom: number
  center: GoogleMapPosition
  styles: any[]
  markers: {
    position: GoogleMapPosition,
    url: string
  }[]
}

@Component({
  selector: 's-google-map',
  templateUrl: './google-map.component.html',
  styleUrls: ['./google-map.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GoogleMapComponent implements OnInit, AfterViewInit {

  constructor(
    private googleMapService: GoogleMapService
  ) { }

  @ViewChild('map', { read: ElementRef }) private mapEl: ElementRef;

  ngOnInit() { }

  @Input()
  setting : GoogleMapSetting

  async ngAfterViewInit() {
    await this.googleMapService.loadScriptAsync();

    const position = new google.maps.LatLng(this.setting.center.lat, this.setting.center.lng);
    const map = new google.maps.Map(this.mapEl.nativeElement, {
      scrollwheel: false,
      gestureHandling: 'cooperative',
      center: position,
      zoom: this.setting.zoom,
      styles : this.setting.styles
    });

    //map.mapTypes.set('styled_map', styledMapType);
    //map.setMapTypeId('styled_map');
    this.setting.markers.forEach(m => {
      var marker = new google.maps.Marker({
        position: m.position,
        map: map,
        animation: google.maps.Animation.DROP, // BOUNCE, DROP, lo, no
        icon: '/assets/images/google-map-drop-point.png',
        url: m.url
      });
      marker.addListener('click', function () {
        window.open(this.url, '_blank');
      });
    }); 
  }
}
