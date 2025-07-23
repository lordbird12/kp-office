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
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatSort } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { TextFieldModule } from '@angular/cdk/text-field';
import { CommonModule, NgClass } from '@angular/common';
import { MatRadioModule } from '@angular/material/radio';
import { Service } from '../page.service';
import { FuseConfirmationService } from '@fuse/services/confirmation';

@Component({
    selector: 'app-status-dialog-job',
    templateUrl: './form-dialog.component.html',
    styleUrls: ['./form-dialog.component.scss'],
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
    ],
})
export class FormDialogComponent implements OnInit {
    formFieldHelpers: string[] = ['fuse-mat-dense']
    addForm: FormGroup;
    flashMessage: 'success' | 'error' | null = null;
    filePreviewUrls: string[] = [];

    status: any[] = [
        { values: 'send', name: 'ร้องขอ' },
        { values: 'wait', name: 'รอตรวจสอบ' },
        { values: 'approve', name: 'ยืนยัน' },
    ];

    constructor(
        private dialogRef: MatDialogRef<FormDialogComponent>,
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
            date: [new Date(), Validators.required],
            image: this.formBuilder.array([]),
            remark: [''],
        });

        // If data is provided for editing, populate the form
        if (this.data && this.data.item) {
            this.addForm.patchValue({
                status: this.data.item.status,
                date: new Date(this.data.item.date),
                remark: this.data.item.remark,
            });

            // If there are images in the data, add them to the form array
            if (this.data.item.images && Array.isArray(this.data.item.images)) {
                this.data.item.images.forEach((img) => {
                    this.addImageToFormArray(img);
                    // Add the preview URL if available
                    if (img.url) {
                        this.filePreviewUrls.push(img.url);
                    }
                });
            }
        }
    }

    // Getter for the images FormArray
    get imageArray(): FormArray {
        return this.addForm.get('image') as FormArray;
    }

    // Add a file to the FormArray
    addImageToFormArray(file: any): void {
        this.imageArray.push(
            this.formBuilder.group({
                file: [file],
                name: [file.name || ''],
                type: [file.type || ''],
            })
        );
    }

    onFileSelected(event: any): void {
        const files = event.target.files;
        if (files) {
            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                this.addImageToFormArray(file);

                // Create preview URLs
                const reader = new FileReader();
                reader.onload = (e: any) => {
                    this.filePreviewUrls.push(e.target.result);
                    this._changeDetectorRef.markForCheck();
                };
                reader.readAsDataURL(file);
            }
        }
    }

    removeFile(index: number): void {
        this.imageArray.removeAt(index);
        this.filePreviewUrls.splice(index, 1);
        this._changeDetectorRef.markForCheck();
    }

    prepareFormData(): FormData {
        const formData = new FormData()
        formData.append('id', this.addForm.get('id').value);
        formData.append('status', this.addForm.get('status').value);
        formData.append(
            'date',
            new Date(this.addForm.get('date').value).toISOString()
        );
        formData.append('remark', this.addForm.get('remark').value);

        // Append all files from the FormArray
        const imageControls = this.imageArray.controls;
        for (let i = 0; i < imageControls.length; i++) {
            const file = imageControls[i].get('file').value;
            if (file instanceof File) {
                formData.append(`images[${i}]`, file, file.name);
            }
        }

        return formData;
    }

    onSaveClick(): void {
        this.flashMessage = null;

        // Return if the form is invalid
        if (this.addForm.invalid) {
            this.addForm.markAllAsTouched();
            this._fuseConfirmationService.open({
                title: 'กรุณาระบุข้อมูล',
                icon: {
                    show: true,
                    name: 'heroicons_outline:exclamation',
                    color: 'warning',
                },
                actions: {
                    confirm: {
                        show: false,
                        label: 'ยืนยัน',
                        color: 'primary',
                    },
                    cancel: {
                        show: false,
                        label: 'ยกเลิก',
                    },
                },
                dismissible: true,
            });
            return;
        }

        // Open the confirmation dialog
        const confirmation = this._fuseConfirmationService.open({
            title: 'อัปเดตสถานะ',
            message: 'คุณต้องการอัปเดตสถานะหรือไม่ ',
            icon: {
                show: false,
                name: 'heroicons_outline:exclamation',
                color: 'warning',
            },
            actions: {
                confirm: {
                    show: true,
                    label: 'ยืนยัน',
                    color: 'primary',
                },
                cancel: {
                    show: true,
                    label: 'ยกเลิก',
                },
            },
            dismissible: true,
        });

        // Subscribe to the confirmation dialog closed action
        confirmation.afterClosed().subscribe((result) => {
            if (result === 'confirmed') {
                // Create FormData object with files
                const formData = this.prepareFormData();

                this._service.statusUpdate(formData).subscribe({
                    next: (resp: any) => {
                        this.showFlashMessage('success');
                        this.dialogRef.close(resp);
                    },
                    error: (err: any) => {
                        this.showFlashMessage('error');
                        this._fuseConfirmationService.open({
                            title: 'เกิดข้อผิดพลาด',
                            message:
                                err.error.message || 'ไม่สามารถอัปเดตสถานะได้',
                            icon: {
                                show: true,
                                name: 'heroicons_outline:exclamation',
                                color: 'warning',
                            },
                            actions: {
                                confirm: {
                                    show: false,
                                    label: 'ยืนยัน',
                                    color: 'primary',
                                },
                                cancel: {
                                    show: false,
                                    label: 'ยกเลิก',
                                },
                            },
                            dismissible: true,
                        });
                    },
                });
            }
        });
    }

    onCancelClick(): void {
        this.dialogRef.close();
    }

    showFlashMessage(type: 'success' | 'error'): void {
        // Show the message
        this.flashMessage = type;

        // Mark for check
        this._changeDetectorRef.markForCheck();

        // Hide it after 3 seconds
        setTimeout(() => {
            this.flashMessage = null;
            // Mark for check
            this._changeDetectorRef.markForCheck();
        }, 3000);
    }
}
