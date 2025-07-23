import { TextFieldModule } from '@angular/cdk/text-field';
import { NgClass } from '@angular/common';
import {
    ChangeDetectorRef,
    Component,
    OnDestroy,
    OnInit,
    ViewEncapsulation,
} from '@angular/core';
import {
    FormArray,
    FormBuilder,
    FormControl,
    FormGroup,
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
import { MatSelectModule } from '@angular/material/select';
import { ActivatedRoute, Router } from '@angular/router';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { Service } from '../page.service';
import { CommonModule } from '@angular/common';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { Observable, ReplaySubject, Subject, lastValueFrom, map, startWith, takeUntil } from 'rxjs';
import { UploadService } from 'app/shared/upload.service';
import { DateTime } from 'luxon';
import { FilterPipeModule } from 'ngx-filter-pipe';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
@Component({
    selector: 'income-expense-form',
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
        CommonModule,
        NgxDropzoneModule,
        FilterPipeModule,
        MatAutocompleteModule
    ],
})
export class FormComponent implements OnInit, OnDestroy {
    formFieldHelpers: string[] = ['fuse-mat-dense'];
    productsFilter = new FormControl('');
    // Form fields
    selectedVehicle: any = null;
    categories: any[] = [];
    type_income: any[] = [];
    type_deduct: any[] = [];
    income_expenses_tracker_type: any[] = [];
    users: any[] = [];
    filterproducts: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
    formData: FormGroup;
    files: File[] = [];
    products: File[] = [];
    Id: number;
    itemData: any;
    uploadedFilePath: string = '';

    // Transaction types
    transactionTypes: any[] = [
        { value: 'income', name: 'รายรับ' },
        { value: 'expense', name: 'รายจ่าย' },
    ];

    // Payment types
    paymentTypes: any[] = [
        { value: 'cash', name: 'เงินสด' },
        { value: 'transfer', name: 'เงินโอน' },
        { value: 'credit_card', name: 'บัตรเครดิต' },
        { value: 'debit_card', name: 'บัตรเดบิต' },
        { value: 'other', name: 'อื่นๆ' },
    ];
    productList = [
        { id: 1, name: 'ผ้าเบรก' },
        { id: 2, name: 'น้ำมันเครื่อง' },
        { id: 3, name: 'ยางรถยนต์' },
    ];
    protected _onDestroy = new Subject<void>();
    searchTerms: string[] = [];
    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _fuseConfirmationService: FuseConfirmationService,
        private _formBuilder: FormBuilder,
        private _service: Service,
        private _matDialog: MatDialog,
        private _router: Router,
        private _activatedRoute: ActivatedRoute,
        private _activated: ActivatedRoute,
        private _uploadService: UploadService
    ) {
        // Get data from route resolver
        this.productList =
            this._activated.snapshot.data?.product_attribute?.data || [];
        this.products =
            this._activated.snapshot.data?.cars?.data || [];
        this.filterproducts.next(this.products.slice());
        this.type_income =
            this._activated.snapshot.data?.type_income?.data || [];
        this.type_deduct =
            this._activated.snapshot.data?.type_deduct?.data || [];
        this.income_expenses_tracker_type =
            this._activated.snapshot.data?.income_expenses_tracker_type?.data || [];
        console.log(this.income_expenses_tracker_type);

        this.users = this._activated.snapshot.data?.users?.data || [];

        // Get ID from route params for edit mode
        this.Id = Number(this._activatedRoute.snapshot.paramMap.get('id'));

        // Get current user
        const user = JSON.parse(localStorage.getItem('user'));
        console.log(user);

        const today = new Date();

        // Initialize form to match API requirements
        this.formData = this._formBuilder.group({
            income_expenses_tracker_type_id: ['', Validators.required],
            transaction_type: [''],
            date: [today, Validators.required],
            reference_code: [''],
            partner_type: [''],
            partner_name: [''],
            type: ['expense', Validators.required],
            amount: [0, Validators.required],
            direction: ['', Validators.required],
            payment_type: ['cash', Validators.required],
            description: [''],
            items: this._formBuilder.array([]),
            car_id: [''],
            employee_id: ['']
        });
    }

    get items(): FormArray {
        return this.formData.get('items') as FormArray;
    }
    createItem(): FormGroup {
        return this._formBuilder.group({
            product_attribute_id: [null, Validators.required],
            qty: [1, [Validators.required, Validators.min(1)]],
            unit_cost: [0, [Validators.required, Validators.min(0)]]
        });
    }
    addItem(): void {
        this.items.push(this.createItem());
    }

    removeItem(index: number): void {
        this.items.removeAt(index);
    }

    async ngOnInit(): Promise<void> {
        this.categories = this.income_expenses_tracker_type.filter(item => item.type === this.formData.get('type').value);
        // Update categories when type changes
        this.formData.get('type').valueChanges.subscribe((value) => {
            if (value === 'income') {
                this.categories = this.income_expenses_tracker_type.filter(item => item.type === value);

            } else if (value === 'expense') {
                this.categories = this.income_expenses_tracker_type.filter(item => item.type === value);
            } else {
                this.categories = [];
            }
        });
        this.productsFilter.valueChanges
            .pipe(takeUntil(this._onDestroy))
            .subscribe(() => this._filterproducts());
        if (this.Id) {
            // If editing existing record, fetch data and populate form
            this._service.getById(this.Id).subscribe((response) => {
                this.itemData = response.data;
                console.log(this.itemData);

                // Set form values to match API structure
                this.formData.patchValue({
                    ...this.itemData,
                    type: this.itemData.type.type,
                    date: this.itemData.date
                        ? DateTime.fromISO(this.itemData.date).toJSDate()
                        : null,

                });
                if (this.itemData.type) {
                    this.categories = this.income_expenses_tracker_type.filter(item => item.type === this.formData.get('type').value);
                    console.log(this.categories);
                    this.formData.patchValue({
                        income_expenses_tracker_type_id: +this.itemData.income_expenses_tracker_type_id,
                    })
                }
                console.log(this.formData.value);


                // If there's an existing attachment, show it or handle it appropriately
                if (this.itemData.image) {
                    this.uploadedFilePath = this.itemData.image;
                    // You might want to create a preview for the existing file
                }
            });
        }

        this.formData.get('direction')?.valueChanges.subscribe(() => {
            this.updatePartnerAndType();
        });
    }

    protected _filterproducts(): void {
        if (!this.products) {
            return;
        }

        let search = this.productsFilter.value;

        if (!search) {
            this.filterproducts.next(this.products.slice());
            return;
        }

        search = search.toString().toLowerCase();

        this.filterproducts.next(
            this.products.filter(
                (item: any) =>
                    item.name.toLowerCase().includes(search) ||
                    item.license_plate.toLowerCase().includes(search) ||
                    (
                        item.name.toLowerCase() +
                        ' ' +
                        item.license_plate.toLowerCase()
                    ).includes(search)
            )
        );
    }

    onSelect(event: any) {
        this.files.push(...event.addedFiles);
        // Trigger Image Preview
        setTimeout(() => {
            this._changeDetectorRef.markForCheck();
        }, 150);
    }

    // Save the form data
    async save(): Promise<void> {
        // Check form validity
        if (this.formData.invalid) {
            this.formData.markAllAsTouched();
            return;
        }

        // Handle file upload if there are files
        try {
            if (this.files.length > 0) {
                // Upload only the first file (assuming single file upload)
                const filePath = await this._uploadService.uploadImage(this.files[0]);
                console.log(filePath, 'filePath');

                this.formData.patchValue({
                    image: filePath,
                });
            }
        } catch (error) {
            console.error('File upload failed:', error);

            // Show error message
            this._fuseConfirmationService.open({
                title: 'อัพโหลดไฟล์ล้มเหลว',
                message: 'ไม่สามารถอัพโหลดไฟล์ได้ กรุณาลองใหม่อีกครั้ง',
                icon: {
                    show: true,
                    name: 'heroicons_outline:exclamation',
                    color: 'warning',
                },
                actions: {
                    confirm: {
                        show: true,
                        label: 'ตกลง',
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

        // Prepare data for submission
        const rawFormValue = this.formData.getRawValue();

        // กำหนดค่า partner_type ตามเงื่อนไข
        let partnerType = 'normal';

        if (rawFormValue.payment_type === 'credit') {
            if (rawFormValue.direction === 'in') {
                partnerType = 'debtor';
            } else if (rawFormValue.direction === 'out') {
                partnerType = 'creditor';
            }
        }

        const jsonData = {
            ...rawFormValue,
            date: rawFormValue.date
                ? DateTime.fromJSDate(rawFormValue.date).toFormat('yyyy-MM-dd')
                : null,
            partner_type: partnerType // อัปเดตค่าที่ถูกต้องลงไปแทนของเดิม
        };

        this.formData.patchValue({ partner_type: partnerType });

        // Handle confirmation and submission
        const confirmationTitle = this.Id ? 'แก้ไขข้อมูล' : 'เพิ่มข้อมูล';
        const confirmationMessage = `คุณต้องการ${this.Id ? 'แก้ไข' : 'เพิ่ม'
            }ข้อมูลใช่หรือไม่`;

        const confirmation = this._fuseConfirmationService.open({
            title: confirmationTitle,
            message: confirmationMessage,
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
                // Determine which API call to make based on whether we're creating or updating
                const apiCall = this.Id
                    ? this._service.update(jsonData, this.Id)
                    : this._service.create(jsonData);

                apiCall.subscribe({
                    next: () => {
                        // Navigate back to list on success
                        this._router.navigate(['admin/income-expense/list']);
                    },
                    error: (err: any) => {
                        this.formData.enable();

                        // Show error message
                        this._fuseConfirmationService.open({
                            title: 'กรุณาระบุข้อมูล',
                            message: err.error?.message || 'เกิดข้อผิดพลาด',
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

    onCategoryChange(event: any) {
        // if (event) {
        //     const category_name = this.categories.find(
        //         (category) => category.id === event
        //     )?.name;

        //     this.formData.patchValue({
        //         category: category_name,
        //     });
        // }else {
        //     this.formData.patchValue({
        //         category: null,
        //     });
        // }
    }

    // Navigate back to list
    backTo() {
        this._router.navigate(['admin/income-expense/list']);
    }

    ngOnDestroy(): void {
        // Clean up code if needed
    }

    onSelectproducts(event: any): void {
        if (!event) {
            if (this.productsFilter.invalid) {
                this.productsFilter.markAsTouched();
            }
            return;
        }

        this.formData.patchValue({
            car_id: event.id,
        });
        const vehicle = this.products.find(
            (product: any) => product.id === event.id
        );
        if (vehicle) {
            this.selectedVehicle = vehicle;
            console.log('Selected vehicle:', this.selectedVehicle);
        } else {
            this.selectedVehicle = null;
        }

        this._changeDetectorRef.markForCheck();

        this.productsFilter.setValue(`${event.name} (${event.license_plate})`);
    }

    updatePartnerAndType() {
        const direction = this.formData.get('direction')?.value;

        const type = direction === 'in' ? 'income' : direction === 'out' ? 'expense' : null;
        if (type === 'income') {
            this.categories = this.income_expenses_tracker_type.filter(item => item.type === type);

        } else if (type === 'expense') {
            this.categories = this.income_expenses_tracker_type.filter(item => item.type === type);
        } else {
            this.categories = [];
        }
        this.formData.patchValue({
            type: type
        }, { emitEvent: false }); // ป้องกัน loop ถ้า set แล้วมี valueChanges ซ้ำ
    }
}
