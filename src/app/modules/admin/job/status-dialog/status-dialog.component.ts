import {
    ChangeDetectorRef,
    Component,
    Inject,
    OnInit,
    ViewEncapsulation,
} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {
    FormBuilder,
    FormGroup,
    FormArray,
    FormsModule,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatChipsModule } from '@angular/material/chips';
import { MatOptionModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { TextFieldModule } from '@angular/cdk/text-field';
import { CommonModule, NgClass } from '@angular/common';
import { MatRadioModule } from '@angular/material/radio';
import { Service } from '../page.service';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { environment } from 'environments/environment';

interface ExistingImage {
    id: number;
    job_id: string;
    image: string;
    create_by: string | null;
    update_by: string | null;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
}

@Component({
    selector: 'app-status-dialog-job',
    templateUrl: './status-dialog.component.html',
    encapsulation: ViewEncapsulation.None,
    standalone: true,
    imports: [
        MatIconModule,
        FormsModule,
        MatFormFieldModule,
        NgClass,
        MatInputModule,
        TextFieldModule,
        ReactiveFormsModule,
        MatButtonToggleModule,
        MatButtonModule,
        MatSelectModule,
        MatOptionModule,
        MatChipsModule,
        MatDatepickerModule,
        MatPaginatorModule,
        MatTableModule,
        MatRadioModule,
        CommonModule,
        NgxDropzoneModule,
    ],
})
export class StatusDialogComponent implements OnInit {
    formFieldHelpers: string[] = ['fuse-mat-dense'];
    addForm: FormGroup;
    flashMessage: 'success' | 'error' | null = null;

    // สำหรับการอัปโหลดไฟล์ใหม่
    files: File[] = [];

    // สำหรับรูปภาพเดิมที่มีอยู่
    existingImages: ExistingImage[] = [];
    imagesToRemove: number[] = [];

    status: any[] = [
        { values: 'waiting', name: 'รอดำเนินการ' },
        { values: 'in_progress', name: 'กำลังดำเนินการ' },
        { values: 'completed', name: 'สำเร็จ' },
        { values: 'cancelled', name: 'ยกเลิก' },
    ];

    constructor(
        private dialogRef: MatDialogRef<StatusDialogComponent>,
        @Inject(MAT_DIALOG_DATA) private data: any,
        private formBuilder: FormBuilder,
        private _service: Service,
        private _fuseConfirmationService: FuseConfirmationService,
        private _changeDetectorRef: ChangeDetectorRef
    ) {}

    ngOnInit(): void {
        // สร้าง Reactive Form
        this.addForm = this.formBuilder.group({
            id: [this.data ? this.data.itemId : ''],
            status: ['', Validators.required],
            images: this.formBuilder.array([]),
            existingImages: this.formBuilder.array([]),
        });

        // ดึงข้อมูลเดิมของงาน (รวมถึงรูปภาพ)
        if (this.data && this.data.itemId) {
            // ตั้งค่าสถานะเดิม
            this.addForm.patchValue({
                status: this.data.status || '',
            });

            // โหลดรูปภาพเดิม (ถ้ามี)
            if (this.data.images && this.data.images.length) {
                this.existingImages = this.data.images;
                this.updateExistingImagesFormArray();
            }

            this._changeDetectorRef.markForCheck();
        }
    }

    // จัดการกับรูปภาพที่อัปโหลดใหม่
    onSelect(event: any) {
        this.files.push(...event.addedFiles);
        this.updateImagesFormArray();
        this._changeDetectorRef.markForCheck();
    }

    onRemove(file: any) {
        this.files.splice(this.files.indexOf(file), 1);
        this.updateImagesFormArray();
        this._changeDetectorRef.markForCheck();
    }

    // จัดการกับรูปภาพเดิม
    onRemoveExistingImage(image: ExistingImage) {
        // เพิ่ม ID ของรูปภาพไปยังรายการที่ต้องการลบ
        this.imagesToRemove.push(image.id);

        // ลบออกจาก array รูปภาพเดิม
        const index = this.existingImages.findIndex(
            (img) => img.id === image.id
        );
        if (index > -1) {
            this.existingImages.splice(index, 1);
        }

        // อัปเดต form array
        this.updateExistingImagesFormArray();
        this._changeDetectorRef.markForCheck();
    }

    // อัปเดต form array สำหรับรูปภาพใหม่
    updateImagesFormArray() {
        const imagesArray = this.addForm.get('images') as FormArray;

        // ล้าง array เดิม
        while (imagesArray.length) {
            imagesArray.removeAt(0);
        }

        // เพิ่มไฟล์ใหม่
        this.files.forEach((file) => {
            const imageGroup = this.formBuilder.group({
                image: [file.name],
            });
            imagesArray.push(imageGroup);
        });
    }

    // อัปเดต form array สำหรับรูปภาพเดิม
    updateExistingImagesFormArray() {
        const existingImagesArray = this.addForm.get(
            'existingImages'
        ) as FormArray;

        // ล้าง array เดิม
        while (existingImagesArray.length) {
            existingImagesArray.removeAt(0);
        }

        // เพิ่มรูปภาพเดิม
        this.existingImages.forEach((img) => {
            const imageGroup = this.formBuilder.group({
                id: [img.id],
                image: [img.image],
            });
            existingImagesArray.push(imageGroup);
        });
    }

    // Getters สำหรับ form arrays
    get imagesArray(): FormArray {
        return this.addForm.get('images') as FormArray;
    }

    get existingImagesArray(): FormArray {
        return this.addForm.get('existingImages') as FormArray;
    }

    // ฟังก์ชั่นสำหรับการจัดการกับ URL ของรูปภาพ
    getImageUrl(imageUrl: string): string {
        // ตรวจสอบว่า URL เริ่มต้นด้วย http หรือ https หรือไม่
        if (
            imageUrl &&
            (imageUrl.startsWith('http://') || imageUrl.startsWith('https://'))
        ) {
            // ถ้าใช่ แสดงว่าเป็น URL เต็มแล้ว ไม่ต้องต่อ base URL
            return imageUrl;
        } else {
            // ถ้าไม่ใช่ URL เต็ม ให้ต่อกับ base URL
            return this.getImageBaseUrl() + imageUrl;
        }
    }

    // Get base URL for image path
    getImageBaseUrl(): string {
        return environment.baseURL;
    }

    // บันทึกข้อมูลและรูปภาพ
    async onSaveClick(): Promise<void> {
        // ตรวจสอบความถูกต้องของฟอร์ม
        if (this.addForm.invalid) {
            this.addForm.markAllAsTouched();
            return;
        }

        if (
            this.addForm.value.status === 'completed' &&
            this.files.length === 0 &&
            this.existingImages.length === 0
        ) {
            this._fuseConfirmationService.open({
                title: 'กรุณาเพิ่มรูปภาพ',
                message: 'จำเป็นต้องมีรูปภาพอย่างน้อย 1 รูป',
                icon: {
                    show: true,
                    name: 'heroicons_outline:exclamation',
                    color: 'warning',
                },
                actions: {
                    confirm: {
                        show: true,
                        label: 'เข้าใจแล้ว',
                        color: 'primary',
                    },
                    cancel: {
                        show: false,
                    },
                },
                dismissible: true,
            });
            return;
        }
        try {
            const uploadedImages = [];

            // จัดการกับรูปภาพเดิม
            if (this.existingImages && this.existingImages.length > 0) {
                this.existingImages.forEach((img) => {
                    let imagePath = img.image;

                    // ตรวจสอบว่า image เป็น URL เต็มหรือไม่
                    if (
                        imagePath &&
                        (imagePath.startsWith('http://') ||
                            imagePath.startsWith('https://'))
                    ) {
                        const baseToRemove = environment.baseURL;
                        if (imagePath.includes(baseToRemove)) {
                            imagePath = imagePath.replace(baseToRemove, '');
                        }
                    }

                    uploadedImages.push({
                        id: img.id,
                        image: imagePath,
                    });
                });
            }

            // อัปโหลดรูปภาพใหม่ (ถ้ามี)
            if (this.files && this.files.length > 0) {
                // ใช้ Promise.all เพื่อรอให้อัปโหลดรูปภาพทั้งหมดเสร็จสิ้น
                const uploadPromises = this.files.map((file) => {
                    const formData = new FormData();
                    formData.append('image', file);
                    formData.append('path', 'images/asset/');
                    return this._service.upload_images(formData).toPromise();
                });

                const responses = await Promise.all(uploadPromises);

                // ประมวลผลการตอบกลับ
                responses.forEach((response: any) => {
                    if (response.status && response.data) {
                        uploadedImages.push({
                            image: response.data,
                        });
                    }
                });
            }

            // สร้างข้อมูล JSON สำหรับส่งไปยัง API
            const jsonData = {
                id: this.addForm.value.id,
                status: this.addForm.value.status,
                images: uploadedImages.map((img) => img.image), // ส่งเฉพาะ path ของรูปภาพ
            };
            const Id = this.addForm.value.id;

            // เรียกใช้ API เพื่ออัปเดตสถานะ
            this._service.updateStatus(jsonData, Id).subscribe({
                next: () => {
                    // ปิด dialog เมื่อเสร็จสมบูรณ์
                    this.dialogRef.close(true);
                },
                error: (err: any) => {
                    // แสดงข้อความแจ้งเตือนเมื่อเกิดข้อผิดพลาด
                    this._fuseConfirmationService.open({
                        title: 'เกิดข้อผิดพลาด',
                        message: err.error.message || 'ไม่สามารถอัปเดตสถานะได้',
                        icon: {
                            show: true,
                            name: 'heroicons_outline:exclamation',
                            color: 'warning',
                        },
                        actions: {
                            confirm: {
                                show: true,
                                label: 'เข้าใจแล้ว',
                                color: 'primary',
                            },
                            cancel: {
                                show: false,
                            },
                        },
                        dismissible: true,
                    });
                },
            });
        } catch (error) {
            console.error('การประมวลผลล้มเหลว:', error);
            this._fuseConfirmationService.open({
                title: 'เกิดข้อผิดพลาด',
                message: 'การอัปโหลดรูปภาพล้มเหลว โปรดลองอีกครั้ง',
                icon: {
                    show: true,
                    name: 'heroicons_outline:exclamation',
                    color: 'warning',
                },
                actions: {
                    confirm: {
                        show: true,
                        label: 'เข้าใจแล้ว',
                        color: 'primary',
                    },
                    cancel: {
                        show: false,
                    },
                },
                dismissible: true,
            });
        }
    }

    // ปิด dialog โดยไม่บันทึกการเปลี่ยนแปลง
    onCancelClick(): void {
        this.dialogRef.close(false);
    }
}
