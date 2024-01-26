import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
declare global {
  interface Window {
    webkitSpeechRecognition: any;
  }
}
@Injectable({
  providedIn: 'root'
})
export class SpeechService {
  recognition: any;
  isListening = false;
  private transcriptSource = new Subject<string>();
  public transcript$ = this.transcriptSource.asObservable();
  constructor() {
    this.recognition = new (window as any).webkitSpeechRecognition();
    this.recognition.continuous = true;
    this.recognition.lang = 'fr-FR';
    this.recognition.interimResults = false;
    this.recognition.maxAlternatives = 1;

    this.recognition.onresult = (event: any) => {
      const transcript = event.results[event.resultIndex][0].transcript;
      console.log(transcript);
      this.transcriptSource.next(transcript);
    };
  }

  startListening() {
    this.isListening = true;
    this.recognition.start();
  }

  stopListening() {
    this.isListening = false;
    this.recognition.stop();
  }
}


