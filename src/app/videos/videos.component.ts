import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-videos',
  templateUrl: './videos.component.html',
  styleUrls: ['./videos.component.scss']
})
export class VideosComponent implements OnInit {
  video1: SafeResourceUrl;
  video2: SafeResourceUrl;
  constructor(private sanitizer : DomSanitizer) { }

  ngOnInit() {
    this.video1 =  this.sanitizer.bypassSecurityTrustResourceUrl("https://www.youtube.com/embed/Hu4Yvq-g7_Y");
    this.video2 =  this.sanitizer.bypassSecurityTrustResourceUrl("https://www.youtube.com/embed/LNHBMFCzznE");
  }

}
