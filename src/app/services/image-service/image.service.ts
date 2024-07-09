import { Injectable } from '@angular/core';
import { NgxImageCompressService } from 'ngx-image-compress';

@Injectable({
  providedIn: 'root'
})
export class ImageService {

  constructor(private imageCompress: NgxImageCompressService) {}

  compressImage(file: File, maxWidth: number, maxHeight: number): Promise<File> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (event) => {
        const base64String = event.target?.result as string;

        if (base64String) {
          this.imageCompress
            .compressFile(base64String, -1, maxWidth, maxHeight)
            .then((result) => {
              // Use type assertion and type guard
              const compressedImage = this.getCompressedImage(result);

              if (compressedImage) {
                resolve(compressedImage);
              } else {
                reject('Invalid response from image compression library');
              }
            })
            .catch((error) => {
              console.error('Error compressing image:', error);
              reject(error);
            });
        } else {
          reject('Failed to read image as base64 string');
        }
      };

      reader.onerror = (error) => {
        reject(error);
      };

      reader.readAsDataURL(file);
    });
  }

  // Helper function to convert base64 string to File
  private dataURItoFile(dataURI: string, fileName: string): File {
    const byteString = atob(dataURI.split(',')[1]);
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const uint8Array = new Uint8Array(arrayBuffer);

    for (let i = 0; i < byteString.length; i++) {
      uint8Array[i] = byteString.charCodeAt(i);
    }

    return new File([arrayBuffer], fileName, { type: 'image/jpeg' });
  }

  // Type guard to check for the 'image' property
  private getCompressedImage(result: unknown): File | null {
    if (result && typeof result === 'object' && 'image' in result) {
      return result['image'] as File;
    }
    return null;
  }
}
