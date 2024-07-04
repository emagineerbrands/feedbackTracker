import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ColorService {

  constructor() { }

  //Colors for charts
  getBackgroundColor(index: number): string {
    const colors = ['#f53d3d', '#5b5bf5', '#79ccb3'];
    return colors[index % colors.length];
  }

  getRandomHexColor(): string {
    // Generate a random color code (hexadecimal)
    const randomColor = Math.floor(Math.random() * 16777215).toString(16);

    // Ensure the color code has six digits
    return '#' + '0'.repeat(6 - randomColor.length) + randomColor;
  }
}
