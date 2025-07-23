import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
    MAT_DIALOG_DATA,
    MatDialogRef,
    MatDialogModule,
} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
    selector: 'app-image-viewer',
    standalone: true,
    imports: [CommonModule, MatDialogModule, MatButtonModule, MatIconModule],
    template: `
        <div class="image-viewer">
            <div class="flex justify-end mb-2">
                <button mat-icon-button (click)="close()">
                    <mat-icon>close</mat-icon>
                </button>
            </div>
            <div class="image-container flex justify-center">
                <img
                    [src]="data.imageUrl"
                    alt="รูปภาพงาน"
                    class="w-auto max-h-[80vh]"
                />
            </div>
        </div>
    `,
    styles: [
        `
            .image-viewer {
                padding: 16px;
            }
            .image-container {
                overflow: auto;
            }
        `,
    ],
})
export class ImageViewerComponent {
    constructor(
        public dialogRef: MatDialogRef<ImageViewerComponent>,
        @Inject(MAT_DIALOG_DATA) public data: { imageUrl: string }
    ) {}

    close(): void {
        this.dialogRef.close();
    }
}
