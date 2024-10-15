import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-carousel',
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.scss'],
  standalone: true,
  imports:[
    CommonModule
  ]
  
})
export class CarouselComponent {
  @Input() images: { url: string; alt: string }[] = [];

  currentIndex = 0;
  zoomedImage: { url: string; alt: string } | null = null;
  
  next() {
    this.currentIndex = (this.currentIndex + 1) % this.images.length;
  }

  prev() {
    this.currentIndex = 
      (this.currentIndex - 1 + this.images.length) % this.images.length;
  }

  goToSlide(index: number) {
    this.currentIndex = index;
  }

  zoomImage(image: { url: string; alt: string }) {
    this.zoomedImage = image;
  }

  closeZoom() {
    this.zoomedImage = null;
  }
}
