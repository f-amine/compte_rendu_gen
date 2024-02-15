import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-hero-section',
  templateUrl: './hero-section.component.html',
  styleUrl: './hero-section.component.css'
})
export class HeroSectionComponent {
  appClinicalGrantProviderAccessData: any
  bahmniUserLocation: any
  patientData: any 
  searchValue!: string;
  constructor(private cookieService: CookieService,private http: HttpClient) {}
  // bahmni.user.location
  ngOnInit() {
  this.bahmniUserLocation = JSON.parse(this.cookieService.get('bahmni.user.location'));
  console.log("🚀 ~ HeroSectionComponent ~ ngOnInit ~ bahmniUserLocation:", this.bahmniUserLocation)
  this.appClinicalGrantProviderAccessData = JSON.parse(this.cookieService.get('app.clinical.grantProviderAccessData'));
  console.log("🚀 ~ HeroSectionComponent ~ ngOnInit ~ appClinicalGrantProviderAccessData:", this.appClinicalGrantProviderAccessData)
  const url = `https://his.modoock.com/openmrs/ws/rest/v1/bahmnicore/sql?location_uuid=${this.bahmniUserLocation.uuid}&provider_uuid=${this.appClinicalGrantProviderAccessData.uuid}&q=emrapi.sqlSearch.activePatients&v=full`;
  this.http.get(url).subscribe(response => {
    this.patientData=response
    console.log("🚀 ~ HeroSectionComponent ~ this.http.get ~ patientData:", this.patientData)
  });
  }
  search() {
    console.log("🚀 ~ HeroSectionComponent ~ searchValue:", this.bahmniUserLocation)
    const url = `https://his.modoock.com/openmrs/ws/rest/v1/bahmni/search/patient/lucene?filterOnAllIdentifiers=true&identifier=${this.searchValue}&loginLocationUuid=${this.bahmniUserLocation.uuid}&q=${this.searchValue}&startIndex=0`;
    this.http.get(url).subscribe(response => {
      this.patientData=response
    });
  }
}
