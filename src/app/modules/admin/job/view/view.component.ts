import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { ActivatedRoute, Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { Service } from '../page.service';
import { ImageViewerComponent } from 'app/shared/image-viewer.component';
import { StatusDialogComponent } from '../status-dialog/status-dialog.component';
import { environment } from 'environments/environment.development';

@Component({
    selector: 'app-job-view',
    standalone: true,
    imports: [
        CommonModule,
        MatIconModule,
        MatButtonModule,
        MatDialogModule,
        MatTabsModule,
    ],
    templateUrl: './view.component.html',
})
export class ViewComponent implements OnInit {
    jobId: number;
    job: any;
    hoveredIndex: number | null = null;
    // Lists for dropdowns
    productAttributes: any[] = [];
    expenseType: any[] = [];
    workTypeList: any[] = [];
    colorList: any[] = [];

    testImages: string[] = [
        'https://picsum.photos/id/1015/600/400',
        'https://picsum.photos/id/1016/600/400',
        'https://picsum.photos/id/1018/600/400',
        'https://picsum.photos/id/1020/600/400',
        'https://picsum.photos/id/1024/600/400',
        'https://picsum.photos/id/1025/600/400',
        'https://picsum.photos/id/1027/600/400',
        'https://picsum.photos/id/1033/600/400',
        'https://picsum.photos/id/1035/600/400',
        'https://picsum.photos/id/1037/600/400',
        'https://picsum.photos/id/1041/600/400',
        'https://picsum.photos/id/1043/600/400',
    ];

    // Deposit type mapping
    depositTypes = [
        { value: 'internal', label: 'ภายใน' },
        { value: 'external', label: 'ภายนอก' },
    ];

    constructor(
        private route: ActivatedRoute,
        private jobService: Service,
        private dialog: MatDialog,
        private _router: Router,
        private _activated: ActivatedRoute,
        private _changeDetectorRef: ChangeDetectorRef
    ) {
        this.job = this._activated.snapshot.data?.job?.data || [];
        this.productAttributes =
            this._activated.snapshot.data?.productAttribute?.data || [];
        this.expenseType =
            this._activated.snapshot.data?.expenseType?.data || [];
        this.workTypeList = this._activated.snapshot.data?.workType?.data || [];
        this.colorList = this._activated.snapshot.data?.color?.data || [];
    }

    ngOnInit(): void {
        this.jobId = this.route.snapshot.params['id'];
    }

    getStatusText(status: string): string {
        switch (status) {
            case 'completed':
                return 'เสร็จสิ้น';
            case 'in_progress':
                return 'กำลังดำเนินการ';
            case 'pending':
                return 'รอดำเนินการ';
            case 'waiting':
                return 'รอดำเนินการ';
            default:
                return status;
        }
    }

    getStatusClass(status: string): string {
        switch (status) {
            case 'completed':
                return 'bg-green-100 text-green-800';
            case 'in_progress':
                return 'bg-blue-100 text-blue-800';
            case 'pending':
            case 'waiting':
                return 'bg-yellow-100 text-yellow-800';
            case 'cancelled':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    }

    getDepositTypeName(type: string): string {
        const found = this.depositTypes.find((t) => t.value === type);
        return found ? found.label : type;
    }

    getProductAttributeName(id: string | number): string {
        const found = this.productAttributes.find((item) => item.id == id);
        return found ? found.name : '-';
    }

    getExpenseTypeName(id: string | number): string {
        const found = this.expenseType.find((item) => item.id == id);
        return found ? found.name : '-';
    }

    getColorName(id: string | number): string {
        const found = this.colorList.find((item) => item.id == id);
        return found ? found.name : '-';
    }

    openImageViewer(imageUrl: string): void {
        this.dialog.open(ImageViewerComponent, {
            data: { imageUrl },
            width: '80%',
            maxWidth: '90vh',
            panelClass: 'image-viewer-dialog',
        });
    }

    gotoEdit(): void {
        this._router.navigate(['/admin/job/edit/' + this.jobId]);
    }

    opendialogStatus(data: any): void {
        console.log(data);
        const dialog = this.dialog.open(StatusDialogComponent, {
            data: {
                itemId: data.id,
                status: data.status,
            },
            width: '500px',
            maxWidth: '90vh',
            panelClass: 'image-viewer-dialog',
        });

        dialog.afterClosed().subscribe((result) => {
            if (result) {
                this.jobService.getById(this.jobId).subscribe((result: any) => {
                    console.log(result);
                    this.job = result.data;
                    this._changeDetectorRef.markForCheck();
                });
            }
        });
    }

    converImage(imagePath: string) {
        return environment.baseURL + '/' + imagePath
    }

    onImageError(event: Event): void {
        const target = event.target as HTMLImageElement;
        target.src = 'assets/images/no_image.png'; // เส้นทางรูปภาพ default
    }
}
