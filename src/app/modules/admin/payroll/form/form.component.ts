import {
    AfterViewInit,
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
    FormsModule,
    ReactiveFormsModule,
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
import { PageService } from '../page.service';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { Router } from '@angular/router';

@Component({
    selector: 'form-employee',
    templateUrl: './form.component.html',
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
export class FormComponent implements OnInit {
    /**
     * Constructor
     */
    formFieldHelpers: string[] = ['fuse-mat-dense'];
    addForm: FormGroup;
    addForm2: FormGroup;
    isLoading: boolean = false;
    positions: any[];
    departments: any[];
    permissions: any[];
    flashMessage: 'success' | 'error' | null = null;
    selectedFile: File = null;
    constructor(
        private formBuilder: FormBuilder,
        private _service: PageService,
        private _fuseConfirmationService: FuseConfirmationService,
        private _changeDetectorRef: ChangeDetectorRef,
        private _router: Router
    ) {
        this._service.getPermission().subscribe((resp: any) => {
            this.permissions = resp.data;
        });

        this._service.getDepartment().subscribe((resp: any) => {
            this.departments = resp.data;
        });

        this._service.getPosition().subscribe((resp: any) => {
            this.positions = resp.data;
        });
    }
    ngOnInit(): void {
        this.addForm = this.formBuilder.group({
            permission_id: [],
            department_id: [],
            position_id: [],
            username: [],
            password: [],
            name: [],
            email: [],
            phone: null,
            image: null,
            user_no: [],
            ot: [],
        });

        this.addForm2 = this.formBuilder.group({
            permission_id: [],
            department_id: [],
            position_id: [],
            username: [],
            password: [],
            name: [],
            email: [],
            phone: null,
            image: null,
            user_no: [],
            ot: [],
        });
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Get the form field helpers as string
     */
    getFormFieldHelpersAsString(): string {
        return this.formFieldHelpers.join(' ');
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

    onSaveClick(): void {
        this.flashMessage = null;
        // if (this.addForm.value!) {
        //     this.addForm.enable();
        //     this._fuseConfirmationService.open({
        //         title: 'กรุณาระบุข้อมูล',
        //         message: 'กรุณาระบุข้อมูลให้ครบถ้วน',
        //         icon: {
        //             show: true,
        //             name: 'heroicons_outline:exclamation',
        //             color: 'warning',
        //         },
        //         actions: {
        //             confirm: {
        //                 show: false,
        //                 label: 'ยืนยัน',
        //                 color: 'primary',
        //             },
        //             cancel: {
        //                 show: false,
        //                 label: 'ยกเลิก',
        //             },
        //         },
        //         dismissible: true,
        //     });

        //     return;
        // }

        this.addForm.patchValue({
            user_no: this.addForm2.value.user_no,
            name: this.addForm2.value.name,
            username: this.addForm2.value.username,
            password: this.addForm2.value.password,
            ot: this.addForm2.value.ot,
        });

        // Open the confirmation dialog
        const confirmation = this._fuseConfirmationService.open({
            title: 'เพิ่มข้อมูล',
            message: 'คุณต้องการเพิ่มข้อมูลใช่หรือไม่ ',
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
                const formData = new FormData();
                Object.entries(this.addForm.value).forEach(
                    ([key, value]: any[]) => {
                        formData.append(key, value);
                    }
                );
                this._service.create(formData).subscribe({
                    next: (resp: any) => {
                        this.showFlashMessage('success');
               
                        this._router.navigate(['admin/employee/list'])

                    },
                    error: (err: any) => {
                        this.addForm.enable();
                        this._fuseConfirmationService.open({
                            title: 'กรุณาระบุข้อมูล',
                            message: err.error.message,
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

        // แสดง Snackbar ข้อความ "complete"
    }

    files: File[] = [];
    url_logo: string;
    onSelect(event: { addedFiles: File[] }): void {
        this.files.push(...event.addedFiles);

        // this.addForm.patchValue({
        //     image: this.files[0]
        // })

        var reader = new FileReader();
        reader.readAsDataURL(this.files[0]);
        reader.onload = (e: any) => (this.url_logo = e.target.result);
        const file = this.files[0];
        this.addForm.patchValue({
            image: file,
        });
    }

    onRemove(file: File): void {
        const index = this.files.indexOf(file);
        if (index >= 0) {
            this.files.splice(index, 1);
        }
    }
}
