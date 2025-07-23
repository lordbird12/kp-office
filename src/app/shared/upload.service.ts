import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom, Observable } from 'rxjs';
import { environment } from 'environments/environment';

@Injectable({
  providedIn: 'root'
})

export class UploadService {
  private apiUrl = environment.baseURL;

  constructor(private http: HttpClient) {}

  /**
   * Upload image to server
   * @param file - File to upload
   * @param path - Path to store the file (e.g., 'images/asset/')
   * @returns Observable with upload response
   */
  async uploadImage(file: File, path: string = 'images/asset/'): Promise<string> {
    const formData = new FormData();
    formData.append('image', file);
    formData.append('path', path);

    try {
      const response = await lastValueFrom(
        this.http.post(`${this.apiUrl}/api/upload_images`, formData)
      );

      // Assuming response has a structure like { status: true, data: "path/to/file.jpg" }
      if (response && response['status'] && response['data']) {
        return response['data']; // Return just the string
      }
      throw new Error('Upload failed or invalid response format');
    } catch (error) {
      console.error('Image upload error:', error);
      throw error;
    }
  }

  /**
   * Upload multiple images
   * @param files - Array of files to upload
   * @param path - Path to store the files
   * @returns Promise with array of uploaded file paths
   */
  async uploadMultipleImages(files: File[], path: string = 'images/asset/'): Promise<string[]> {
    // Since uploadImage already returns a Promise<string>, you can use it directly
    const uploadPromises = files.map(file => this.uploadImage(file, path));

    // Use Promise.all to wait for all uploads to complete
    return Promise.all(uploadPromises);
  }
}
