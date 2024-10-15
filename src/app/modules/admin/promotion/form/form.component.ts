

import { TextFieldModule } from '@angular/cdk/text-field';
import { CommonModule, NgClass } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, UntypedFormBuilder, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatChipsModule } from '@angular/material/chips';
import { MatOptionModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ActivatedRoute, Router } from '@angular/router';
import { PageService } from '../page.service';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { DateTime } from 'luxon';
interface Discount {
    id: number
    name: string
    amount: number
}
@Component({
    selector: 'form-employee',
    templateUrl: './form.component.html',
    encapsulation: ViewEncapsulation.None,
    standalone: true,
    imports: [
        MatIconModule,
        ReactiveFormsModule,
        FormsModule,
        MatFormFieldModule,
        NgClass,
        MatInputModule,
        TextFieldModule,
        MatButtonToggleModule,
        MatButtonModule,
        MatSelectModule,
        MatOptionModule,
        MatChipsModule,
        MatDatepickerModule,
        CommonModule],
})


export class FormComponent implements OnInit {
    isForm: boolean = true
    formFieldHelpers: string[] = ['fuse-mat-dense'];
    fixedSubscriptInput: FormControl = new FormControl('', [Validators.required]);
    dynamicSubscriptInput: FormControl = new FormControl('', [Validators.required]);
    fixedSubscriptInputWithHint: FormControl = new FormControl('', [Validators.required]);
    dynamicSubscriptInputWithHint: FormControl = new FormControl('', [Validators.required]);
    flashMessage: 'success' | 'error' | null = null;
    formData: FormGroup
    discount: Discount[] = []
    Id: number;
    /**
     * Constructor
     */
    constructor(
        private _formBuilder: UntypedFormBuilder,
        private _router: Router,
        private _fb: FormBuilder,
        private _service: PageService,
        private _changeDetectorRef: ChangeDetectorRef,
        private _fuseConfirmationService: FuseConfirmationService,
        private _activated: ActivatedRoute
    ) {
        this.formData = this._fb.group({
            id: null,
            name: null,
            remark: null,
            promotion_lists: this._fb.array([]),
            start: null,
            end: null
        })

        this.Id = this._activated.snapshot.params.id

    }

    ngOnInit(): void {


        if (this.Id) {
            this.isForm = false;
            const array = this.formData.get('promotion_lists') as FormArray;
            this._service.getDiscount().subscribe((resp: any) => {
                this.discount = resp.data; // เก็บข้อมูล discount ที่ได้จาก API
            });
            this._service.getById(this.Id).subscribe((resp: any) => {
                this.formData.patchValue({
                    ...resp.data
                })
                resp.data.promotiom_lists.forEach(element => {
                    const group = this._fb.group({
                        discount_id: [+element.discount_id, Validators.required]
                    });

                    // Push FormGroup เข้าไปใน FormArray
                    array.push(group);
                });
            })
        } else {
            this._service.getDiscount().subscribe((resp: any) => {
                this.discount = resp.data; // เก็บข้อมูล discount ที่ได้จาก API

                const array = this.formData.get('promotion_lists') as FormArray;

                // ล้างข้อมูลเดิมใน FormArray (หากจำเป็น)
                array.clear();

                // วนลูปข้อมูล และสร้าง FormGroup สำหรับแต่ละ discount
                this.discount.forEach((discount: any) => {
                    const group = this._fb.group({
                        discount_id: [discount.id, Validators.required] // สร้าง FormGroup ที่ถูกต้อง
                    });

                    // Push FormGroup เข้าไปใน FormArray
                    array.push(group);
                });

                // แจ้งให้ Angular รู้ว่ามีการเปลี่ยนแปลง
            });
        }
        this._changeDetectorRef.markForCheck();


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


    onSubmit() {
        const confirmation = this._fuseConfirmationService.open({
            "title": "บันทึกข้อมูล",
            "message": "คุณต้องการบันทึกข้อมูลใช่หรือไม่ ",
            "icon": {
                "show": false,
                "name": "heroicons_outline:exclamation",
                "color": "warning"
            },
            "actions": {
                "confirm": {
                    "show": true,
                    "label": "ยืนยัน",
                    "color": "primary"
                },
                "cancel": {
                    "show": true,
                    "label": "ยกเลิก"
                }
            },
            "dismissible": true
        });

        // Subscribe to the confirmation dialog closed action
        confirmation.afterClosed().subscribe((result) => {
            if (result === 'confirmed') {
                const updatedData = this.formData.value;
                const startDateTime = DateTime.fromISO(this.formData.value.start)
                updatedData.start = startDateTime.toFormat('yyyy-MM-dd')

                const endDateTime = DateTime.fromISO(this.formData.value.end)
                updatedData.end = endDateTime.toFormat('yyyy-MM-dd')
                if (this.Id) {
                    this._service.update(updatedData, this.Id).subscribe({
                        next: (resp: any) => {
                            this.showFlashMessage('success');
                            this._router.navigate(['admin/promotion/list'])
                        },
                        error: (err: any) => {
                            this.formData.enable();
                            this._fuseConfirmationService.open({
                                "title": "กรุณาระบุข้อมูล",
                                "message": err.error.message,
                                "icon": {
                                    "show": true,
                                    "name": "heroicons_outline:exclamation",
                                    "color": "warning"
                                },
                                "actions": {
                                    "confirm": {
                                        "show": false,
                                        "label": "ยืนยัน",
                                        "color": "primary"
                                    },
                                    "cancel": {
                                        "show": false,
                                        "label": "ยกเลิก",

                                    }
                                },
                                "dismissible": true
                            });
                        }
                    })
                } else {
                    this._service.create(updatedData).subscribe({
                        next: (resp: any) => {
                            this.showFlashMessage('success');
                            this._router.navigate(['admin/promotion/list'])
                        },
                        error: (err: any) => {
                            this.formData.enable();
                            this._fuseConfirmationService.open({
                                "title": "กรุณาระบุข้อมูล",
                                "message": err.error.message,
                                "icon": {
                                    "show": true,
                                    "name": "heroicons_outline:exclamation",
                                    "color": "warning"
                                },
                                "actions": {
                                    "confirm": {
                                        "show": false,
                                        "label": "ยืนยัน",
                                        "color": "primary"
                                    },
                                    "cancel": {
                                        "show": false,
                                        "label": "ยกเลิก",

                                    }
                                },
                                "dismissible": true
                            });
                        }
                    })
                }


            }
        })

    }
    onBack() {
        this._router.navigate(['admin/promotion/list'])
    }

    promotion_lists(): FormArray {
        return this.formData.get('promotion_lists') as FormArray;
    }

    createForm(): FormGroup {
        return this._fb.group({
            discount_id: null,

        });
    }

    addArray(): void {
        console.log(this.formData.value);

        this.promotion_lists().push(this.createForm());

    }

    removeRepair(i: number): void {
        this.promotion_lists().removeAt(i);
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

