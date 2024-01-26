import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { SpeechRecognitionService, SPEECH_RECOGNITION_SUPPORT } from '@ng-web-apis/speech';
import { SpeechService } from '../speech.service';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-generate-pdf',
  templateUrl: './generate-pdf.component.html',
  styleUrl: './generate-pdf.component.css'
})
export class GeneratePdfComponent implements OnInit{
  form = {
    nomPatient: '',
    nomMedcinT: '',
    nomMedcinR: '',
    resultat: '',
    templateName: '',
  };
  recognitionActive = false;
  selectedItem: any = {};
  data: any[] = [];
  transcribedText = '';
  private transcriptSubscription: Subscription;
  constructor(private http: HttpClient ,private speechService: SpeechService) {
    this.transcriptSubscription = this.speechService.transcript$.subscribe(
      transcript => this.transcribedText += transcript + '\n'
    );
   }
   startService(){
    this.speechService.startListening();
  }

  stopService(){
    this.speechService.stopListening();
  }
  ngOnDestroy(): void {
    this.transcriptSubscription.unsubscribe();
  }
  ngOnInit(): void {
    this.http.get('http://localhost:8000/api/get_template/')
    .subscribe((response: any) => {
      this.data = response;
    });
  }
  onSubmit(formValue: any) {
    formValue.templateName = this.selectedItem.name;
    formValue.resultat = this.transcribedText;
    console.log(formValue);
    this.http.post('http://localhost:8000/api/generate_pdf/', formValue, { responseType: 'blob' })
    .subscribe((response: Blob) => {
      const blob = new Blob([response], { type: 'application/pdf' });

      const url = window.URL.createObjectURL(blob);

      const anchor = document.createElement('a');
      anchor.href = url;

      anchor.download = 'filename.pdf';

      document.body.appendChild(anchor);
      anchor.click();

      window.URL.revokeObjectURL(url);
      document.body.removeChild(anchor);
    });
  }

  selectTemplate(item: any) {
    this.selectedItem = item;
  }
}

