import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Service } from '../page.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { ToastrService } from 'ngx-toastr';
import { StatusDialogComponent } from '../status-dialog/status-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
    selector: 'app-stock-request-form',
    templateUrl: './form.component.html',
    standalone: true,
    imports: [
        ReactiveFormsModule,
        FormsModule,
        CommonModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatIconModule,
        MatCardModule,
        MatSelectModule
    ]
})
export class StockRequestFormComponent implements OnInit {
    requestForm: FormGroup;
    isForm: boolean = true
    formFieldHelpers: string[] = ['fuse-mat-dense'];
    constructor(
        private fb: FormBuilder,
        private _serviceJob: Service,
        private _cdr: ChangeDetectorRef,
        private _router: Router,
        private _fuseConfirmationService: FuseConfirmationService,
        private _toastr: ToastrService,
        private dialog: MatDialog,
        private _activatedRoute: ActivatedRoute
    ) {
        this._serviceJob.getJobs().subscribe((resp: any) => {
            this.jobs = resp.data
        })

        this._serviceJob.getProductAttribute().subscribe((resp: any) => {
            this.productAttributes = resp.data
        })

        this._serviceJob.getWorkType().subscribe((resp: any) => {
            this.workTypes = resp.data
        })

        this.Id = this._activatedRoute.snapshot.params.id
        console.log(this.Id);

    }
    form: FormGroup;
    Id: any
    jobs = []; // ดึงจาก API
    productAttributes = []; // ดึงจาก API
    stepJobs = []; // ดึงจาก API
    workTypes = []; // ดึงจาก API    
    itemData: any
    ngOnInit(): void {
        this.form = this.fb.group({
            job_id: [null],
            remark: [''],
            items: this.fb.array([])
        });
        this._serviceJob.getProductAttribute().subscribe(resp => {
            this.productAttributes = resp.data;
        });

        this._serviceJob.getWorkType().subscribe(resp => {
            this.workTypes = resp.data;
        });
        if (this.Id) {
            this.GetById()
        }


    }

    GetById() {
        this.isForm = false
        this._serviceJob.getById(this.Id).subscribe((resp: any) => {
            const data = resp.data;
            this.itemData = resp.data
            // เคลียร์ items ก่อน
            const itemsArray = this.items;
            itemsArray.clear();

            for (const trans of data.product_attribute_trans_lists) {
                itemsArray.push(this.fb.group({
                    product_attribute_id: [+trans.product_attribute_id, Validators.required],
                    qty: [Number(trans.qty), [Validators.required, Validators.min(1)]],
                    step_jobs_type_list_id: [+trans.step_jobs_type_list_id],
                    work_type_id: [+trans.work_type_id]
                }));
            }

            this.form.patchValue({
                job_id: +data.job_id,
                remark: data.remark ?? ''
            });

            this._cdr.markForCheck(); // สำหรับ OnPush
            console.log('Patched:', this.form.value);
        });
    }

    get items(): FormArray {
        return this.form.get('items') as FormArray;
    }

    addItem(item: any = {}): void {
        if (!item) {
            const group = this.fb.group({
                product_attribute_id: [null],
                qty: [item?.qty ?? 1, [Validators.required, Validators.min(1)]],
                step_jobs_type_list_id: [null],
                work_type_id: [null],
            });
            this.items.push(group);
        } else {
            const group = this.fb.group({
                product_attribute_id: [item.product_attribute_id ?? null, Validators.required],
                qty: [item.qty ?? 1, [Validators.required, Validators.min(1)]],
                step_jobs_type_list_id: [item.step_jobs_type_list_id ?? null],
                work_type_id: [item.work_type_id ?? null]
            });
            this.items.push(group);
        }

    }

    removeItem(index: number): void {
        this.items.removeAt(index);
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
                this._serviceJob.getById(this.Id).subscribe((result: any) => {
                    console.log(result);
                    this.GetById()
                    this._cdr.markForCheck();
                });
            }
        });
    }


    onSelectJob(event: any): void {
        this._serviceJob.getByIdJob(event.value).subscribe((resp: any) => {
            const detailedProductAttributes = [];

            for (const step of resp.data.steps) {
                for (const jobType of step.step_job_type_lists) {
                    if (jobType.product_attributes?.length) {
                        for (const pa of jobType.product_attributes) {
                            detailedProductAttributes.push({
                                product_attribute_id: +pa.product_attribute_id,
                                qty: pa.qty,
                                step_jobs_type_list_id: jobType.id,
                                work_type_id: +pa.work_type_id
                            });
                        }
                    }
                }
            }

            const itemsFormArray = this.items;
            itemsFormArray.clear();

            for (const item of detailedProductAttributes) {
                this.addItem(item);
            }

            this.form.patchValue({
                job_id: resp.data.job_id ?? event.value,
                remark: resp.data.remark ?? ''
            });

            this._cdr.markForCheck();
            console.log('Form patched with items:', this.form.value);
        });
    }

    trackByIndex(index: number): number {
        return index;
    }

    onSubmit(): void {
        // Function to prepare formData
        if (this.form.invalid) {
            this.form.markAllAsTouched();
            return;
        }


        if (this.Id) {
            const confirmation = this._fuseConfirmationService.open({
                title: "แก้ไขข้อมูล",
                message: "คุณต้องการแก้ไขข้อมูลใช่หรือไม่ ",
                icon: {
                    show: false,
                    name: "heroicons_outline:exclamation",
                    color: "warning"
                },
                actions: {
                    confirm: {
                        show: true,
                        label: "ยืนยัน",
                        color: "primary"
                    },
                    cancel: {
                        show: true,
                        label: "ยกเลิก"
                    }
                },
                dismissible: true
            });

            // Subscribe to the confirmation dialog closed action
            confirmation.afterClosed().subscribe((result) => {
                if (result === 'confirmed') {
                    let formValue = this.form.value
                    this._serviceJob.update(formValue, this.Id).subscribe({
                        next: (resp: any) => {
                            this._router.navigate(['admin/withdraw/list']);
                            this._toastr.success('Saved!');
                        },
                        error: (err: any) => {
                            this.form.enable();
                            this._fuseConfirmationService.open({
                                title: "กรุณาระบุข้อมูล",
                                message: err.error.message,
                                icon: {
                                    show: true,
                                    name: "heroicons_outline:exclamation",
                                    color: "warning"
                                },
                                actions: {
                                    confirm: {
                                        show: false,
                                        label: "ยืนยัน",
                                        color: "primary"
                                    },
                                    cancel: {
                                        show: false,
                                        label: "ยกเลิก"
                                    }
                                },
                                dismissible: true
                            });
                        }
                    });
                }
            });
        } else {
            const confirmation = this._fuseConfirmationService.open({
                title: "เพิ่มข้อมูล",
                message: "คุณต้องการเพิ่มข้อมูลใช่หรือไม่ ",
                icon: {
                    show: false,
                    name: "heroicons_outline:exclamation",
                    color: "warning"
                },
                actions: {
                    confirm: {
                        show: true,
                        label: "ยืนยัน",
                        color: "primary"
                    },
                    cancel: {
                        show: true,
                        label: "ยกเลิก"
                    }
                },
                dismissible: true
            });

            // Subscribe to the confirmation dialog closed action
            confirmation.afterClosed().subscribe((result) => {
                if (result === 'confirmed') {
                    let formValue = this.form.value
                    this._serviceJob.create(formValue).subscribe({
                        next: (resp: any) => {
                            this._router.navigate(['admin/withdraw/list']);
                            this._toastr.success('Created Successfully!');
                        },
                        error: (err: any) => {
                            this.form.enable();
                            this._fuseConfirmationService.open({
                                title: "กรุณาระบุข้อมูล",
                                message: err.error.message,
                                icon: {
                                    show: true,
                                    name: "heroicons_outline:exclamation",
                                    color: "warning"
                                },
                                actions: {
                                    confirm: {
                                        show: false,
                                        label: "ยืนยัน",
                                        color: "primary"
                                    },
                                    cancel: {
                                        show: false,
                                        label: "ยกเลิก"
                                    }
                                },
                                dismissible: true
                            });
                        }
                    });
                }
            });
        }
    }
    getStatusText(status: string): string {
        switch (status) {
            case 'approved': return 'อนุมัติแล้ว';
            case 'pending': return 'รออนุมัติ';
            case 'rejected': return 'ถูกปฏิเสธ';
            default: return status;
        }
    }
}
