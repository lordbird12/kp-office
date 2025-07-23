import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTableModule } from '@angular/material/table';

@Component({
    selector: 'app-upload-images',
    standalone: true,
    templateUrl: './upload-images.component.html',
    styleUrls: ['./upload-images.component.scss'],
    imports: [
        CommonModule,
        MatIconModule,
        MatButtonModule,
        MatProgressBarModule,
        MatTableModule
    ]
})
export class UploadImagesComponent {


    vehicleImages: File[] = [];
    uploadStatuses: { [key: string]: 'queued' | 'uploading' | 'done' } = {};
    uploadProgress: { [key: string]: number } = {};
    constructor(
        private _cdr: ChangeDetectorRef
    ) {

    }

    onFileSelect(event: Event): void {
        const input = event.target as HTMLInputElement;
        if (input.files) {
            const files = Array.from(input.files).filter(f => f.size <= 5242880); // 5MB max

            for (const file of files) {
                this.vehicleImages.push(file);
                this.uploadStatuses[file.name] = 'queued';
                this.uploadProgress[file.name] = 0;
                this.uploadFile(file);
            }

            input.value = ''; // reset
        }
    }

    uploadFile(file: File): void {
        this.uploadStatuses[file.name] = 'uploading';
        this.uploadProgress[file.name] = 0;

        // Simulate upload progress (0 to 100%)
        const interval = setInterval(() => {
            this.uploadProgress[file.name] += 10;

            if (this.uploadProgress[file.name] >= 100) {
                this.uploadProgress[file.name] = 100;
                this.uploadStatuses[file.name] = 'done';
                clearInterval(interval);
                this._cdr.markForCheck()
            }
        }, 500); // 5s total (10% every 500ms)
    }

    removeFile(index: number): void {
        const file = this.vehicleImages[index];
        const key = file.name;

        URL.revokeObjectURL(this.getImagePreview(file));
        this.vehicleImages.splice(index, 1);
        delete this.uploadStatuses[key];
        delete this.uploadProgress[key];
    }

    setAsPrimary(index: number): void {
        if (index > 0 && index < this.vehicleImages.length) {
            const image = this.vehicleImages[index];
            this.vehicleImages.splice(index, 1);
            this.vehicleImages.unshift(image);

            // Rearrange statuses and progress
            const status = this.uploadStatuses[image.name];
            const progress = this.uploadProgress[image.name];

            // Move data to top
            this.reorderMetadata(image.name, status, progress);
        }
    }

    reorderMetadata(name: string, status: string, progress: number): void {
        const newUploadStatuses: { [key: string]: any } = {};
        const newUploadProgress: { [key: string]: number } = {};

        newUploadStatuses[name] = status;
        newUploadProgress[name] = progress;

        for (const file of this.vehicleImages.slice(1)) {
            newUploadStatuses[file.name] = this.uploadStatuses[file.name];
            newUploadProgress[file.name] = this.uploadProgress[file.name];
        }

        this.uploadStatuses = newUploadStatuses;
        this.uploadProgress = newUploadProgress;
    }

    getImagePreview(file: File): string {
        return URL.createObjectURL(file);
    }
}
