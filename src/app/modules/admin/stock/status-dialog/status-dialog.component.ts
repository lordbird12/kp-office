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
        { values: 'pending', name: 'รอดำเนินการ' },
        { values: 'approved', name: 'อนุมัติ' },
        { values: 'rejected', name: 'ไม่อนุมัติ' },
        { values: 'completed', name: 'เสร็จสิ้น' },
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
        // สร้าง Reactive Form'
        console.log(this.data);
        
        this.addForm = this.formBuilder.group({
            id: [this.data ? this.data.itemId : ''],
            status: [this.data.status, Validators.required],
        });
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

          

            // สร้างข้อมูล JSON สำหรับส่งไปยัง API
            const jsonData = {
                status: this.addForm.value.status,
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
