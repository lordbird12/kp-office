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
    FormBuilder,
    FormGroup,
    FormsModule,
    ReactiveFormsModule,
    Validators,
    FormArray,
    FormControl,
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
import { FormDialogComponent } from '../form-dialog/form-dialog.component';
import { environment } from 'environments/environment';
import { map, Observable, ReplaySubject, startWith, Subject, takeUntil } from 'rxjs';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { AutocompleteDropdownComponent } from 'app/shared/autocomplete-dropdown/autocomplete-dropdown.component';

interface WorkType {
    work_type_id: number;
    product_attributes: ProductAttribute[];
    product_attribute_others: ProductAttributeOther[];
    expenses: Expense[];
}

interface ProductAttribute {
    deposit_type: 'internal' | 'external';
    product_attribute_id: number;
    product_attribute_qty: number;
    amount: number;
}

interface ProductAttributeOther {
    deposit_type: 'internal' | 'external';
    name: string;
    detail: string;
    qty: number;
    amount: number;
}

interface Expense {
    expense_type_id: number;
    amount: number;
}

interface WorkStep {
    step_no: string;
    completed_date: Date | null;
    work_types: WorkType[];
}

interface OtherExpense {
    name: string;
    amount: number;
}

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
    selector: 'form-job',
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
        MatAutocompleteModule,
        MatCheckboxModule,
        AutocompleteDropdownComponent
    ],
})
export class FormComponent implements OnInit, OnDestroy {
    formFieldHelpers: string[] = ['fuse-mat-dense'];
    // Form fields
    products: any[] = [];
    parts: any[] = [];
    workTypeList: any[] = [];
    expenseType: any[] = [];
    productAttributes: any[] = [];
    formData: FormGroup;
    productsFilter = new FormControl('');
    partsFilter = new FormControl('');

    filterproducts: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
    filterparts: Observable<any[]>;
    protected _onDestroy = new Subject<void>();

    // New images (from file upload)
    files: File[] = [];

    //master
    masterControl = new FormControl(null);
    masters: any[] = [ /* ดึงจาก API หรือข้อมูลส่วนกลาง */];
    filtermasters: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);


    // Existing images (from API)
    existingImages: ExistingImage[] = [];
    imagesToRemove: number[] = [];

    Id: number;
    itemData: any;

    // For steps and work types
    steps: WorkStep[] = [];

    // Deposit types
    depositTypes: { value: 'internal' | 'external'; label: string }[] = [
        { value: 'internal', label: 'ภายใน' },
        { value: 'external', label: 'ภายนอก' },
    ];

    // For status options
    status: any[] = [
        { values: 'pending', name: 'รอดำเนินการ' },
        { values: 'in_progress', name: 'กำลังดำเนินการ' },
        { values: 'completed', name: 'เสร็จสิ้น' },
    ];

    // For other expenses
    otherExpenses: OtherExpense[] = [];
    newOtherExpense: OtherExpense = {
        name: '',
        amount: 0,
    };

    // New items in step
    newPart: ProductAttribute = {
        deposit_type: 'internal',
        product_attribute_id: null,
        product_attribute_qty: 1,
        amount: 0,
    };

    newCustomPart: ProductAttributeOther = {
        deposit_type: 'internal',
        name: '',
        detail: '',
        qty: 0,
        amount: 0,
    };

    newExpense: Expense = {
        expense_type_id: null,
        amount: 0,
    };

    currentUnitPrice: number = 0;
    selectedVehicle: any = null;
    selectedParts: any = null;

    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _fuseConfirmationService: FuseConfirmationService,
        private _formBuilder: FormBuilder,
        private _service: Service,
        private _matDialog: MatDialog,
        private _router: Router,
        private _activatedRoute: ActivatedRoute,
        private _activated: ActivatedRoute
    ) {
        // Get data from route resolver
        this.workTypeList = this._activated.snapshot.data?.workType?.data || [];
        this.products = this._activated.snapshot.data?.products?.data || [];
        this.expenseType =
            this._activated.snapshot.data?.expenseType?.data || [];
        this.productAttributes =
            this._activated.snapshot.data?.productAttribute?.data || [];
        console.log(this.productAttributes, 'productAttributes')
        this.filterproducts.next(this.products.slice());
        this.masters = this._activated.snapshot.data?.masters?.data || [];
        // Get ID from route params for edit mode
        this.Id = Number(this._activatedRoute.snapshot.paramMap.get('id'));

        // Get current user
        const user = JSON.parse(localStorage.getItem('user'));

        // Initialize form
        this.formData = this._formBuilder.group({
            product_id: ['', Validators.required],
            priority: ['', Validators.required],
            remark: [''],
            status: ['pending'],
            completed_date: [null],
            create_by: [user?.name],
            images: this._formBuilder.array([]),
            existingImages: this._formBuilder.array([]),
            master: [false],
            master_name: ['']
        });

        // Initialize first step if new job
        if (!this.Id) {
            this.addStep();
        }
    }

    async ngOnInit(): Promise<void> {
        this.productsFilter.valueChanges
            .pipe(takeUntil(this._onDestroy))
            .subscribe(() => this._filterproducts());
        this.filterparts = this.partsFilter.valueChanges.pipe(
            startWith(''),
            map(value => this._filterParts(value))
        );

        this._activatedRoute.queryParams.subscribe(params => {
            const productId = Number(params['product_id']);
            this.formData.patchValue({ product_id: productId });

            const vehicle = this.products.find(
                (product) => product.id === productId
            );

            if (vehicle) {
                this.selectedVehicle = vehicle;
            } else {
                this.selectedVehicle = null;
            }

            this._changeDetectorRef.markForCheck();
            this.productsFilter.setValue(`${vehicle.name} (${vehicle.license_plate})`);

        });
        if (this.Id) {
            // If editing existing record, fetch data and populate form
            this._service.getById(this.Id).subscribe((response) => {
                this.itemData = response.data;

                // Set form values
                this.formData.patchValue({
                    product_id: Number(this.itemData.product_id),
                    priority: this.itemData.priority,
                    remark: this.itemData.remark,
                    status: this.itemData.status,
                    completed_date: this.itemData.completed_date
                        ? new Date(this.itemData.completed_date)
                        : null,
                    create_by: this.itemData.create_by,
                });
                const vehicle = this.products.find(
                    (product) => product.id === Number(this.itemData.product_id)
                );

                if (vehicle) {
                    this.selectedVehicle = vehicle;
                } else {
                    this.selectedVehicle = null;
                }

                this.productsFilter.setValue(`${vehicle.name} (${vehicle.license_plate})`);
                this._changeDetectorRef.markForCheck();

                // Load existing images if available
                if (this.itemData.images && this.itemData.images.length) {
                    this.existingImages = this.itemData.images;
                    console.log('existingImages:', this.existingImages);

                    this.updateExistingImagesFormArray();
                }

                // Populate steps if they exist
                if (this.itemData.steps && this.itemData.steps.length) {
                    this.steps = [];
                    this.itemData.steps.forEach((step) => {
                        const workStepItem: WorkStep = {
                            step_no: step.step_no,
                            completed_date: step.completed_date
                                ? new Date(step.completed_date)
                                : null,
                            work_types: [],
                        };

                        if (
                            step.step_job_type_lists &&
                            step.step_job_type_lists.length
                        ) {
                            step.step_job_type_lists.forEach((workType) => {
                                const workTypeItem: WorkType = {
                                    work_type_id: Number(workType.work_type_id),
                                    product_attributes: [],
                                    product_attribute_others: [],
                                    expenses: [],
                                };

                                // Add product attributes if they exist
                                if (
                                    workType.product_attributes &&
                                    workType.product_attributes.length
                                ) {
                                    workType.product_attributes.forEach(
                                        (attr) => {
                                            workTypeItem.product_attributes.push(
                                                {
                                                    deposit_type:
                                                        attr.deposit_type ||
                                                        'internal',
                                                    product_attribute_id:
                                                        Number(
                                                            attr.product_attribute_id
                                                        ),
                                                    product_attribute_qty:
                                                        attr.product_attribute_qty,
                                                    amount: attr.amount,
                                                }
                                            );
                                        }
                                    );
                                }

                                // Add product attribute others if they exist
                                if (
                                    workType.product_attribute_others &&
                                    workType.product_attribute_others.length
                                ) {
                                    workType.product_attribute_others.forEach(
                                        (other) => {
                                            workTypeItem.product_attribute_others.push(
                                                {
                                                    deposit_type:
                                                        other.deposit_type ||
                                                        'internal',
                                                    name: other.name,
                                                    detail: other.detail,
                                                    qty: other.qty,
                                                    amount: other.amount,
                                                }
                                            );
                                        }
                                    );
                                }

                                // Add expenses if they exist
                                if (
                                    workType.expenses &&
                                    workType.expenses.length
                                ) {
                                    workType.expenses.forEach((expense) => {
                                        workTypeItem.expenses.push({
                                            expense_type_id: Number(
                                                expense.expense_type_id
                                            ),
                                            amount: expense.amount,
                                        });
                                    });
                                }

                                workStepItem.work_types.push(workTypeItem);
                            });
                        }

                        this.steps.push(workStepItem);
                    });
                }

                // Populate other expenses if they exist
                if (
                    this.itemData.other_expenses &&
                    this.itemData.other_expenses.length
                ) {
                    this.otherExpenses = this.itemData.other_expenses.map(
                        (expense) => ({
                            name: expense.name,
                            amount: expense.amount,
                        })
                    );
                }
            });
        }
    }

    // Image handling for new uploads
    onSelect(event: any) {
        this.files.push(...event.addedFiles);
        // Update images form array
        this.updateImagesFormArray();
        // Trigger Image Preview
        setTimeout(() => {
            this._changeDetectorRef.markForCheck();
        }, 150);
    }

    onRemove(file: any) {
        this.files.splice(this.files.indexOf(file), 1);
        this.updateImagesFormArray();
    }

    // Remove existing image
    onRemoveExistingImage(image: ExistingImage) {
        // Add image ID to the list of images to remove
        this.imagesToRemove.push(image.id);

        // Remove from the existingImages array
        const index = this.existingImages.findIndex(
            (img) => img.id === image.id
        );
        if (index > -1) {
            this.existingImages.splice(index, 1);
        }

        // Update form array
        this.updateExistingImagesFormArray();

        // Mark for check to update the UI
        this._changeDetectorRef.markForCheck();
    }

    // Update the images form array based on the files
    updateImagesFormArray() {
        // Clear existing array
        const imagesArray = this.formData.get('images') as FormArray;
        while (imagesArray.length) {
            imagesArray.removeAt(0);
        }

        // Add new file entries
        this.files.forEach((file) => {
            const imageGroup = this._formBuilder.group({
                image: [file.name],
            });
            imagesArray.push(imageGroup);
        });
    }

    // Update the existing images form array
    updateExistingImagesFormArray() {
        // Clear existing array
        const existingImagesArray = this.formData.get(
            'existingImages'
        ) as FormArray;
        while (existingImagesArray.length) {
            existingImagesArray.removeAt(0);
        }

        // Add existing images entries
        this.existingImages.forEach((img) => {
            const imageGroup = this._formBuilder.group({
                id: [img.id],
                image: [img.image],
            });
            existingImagesArray.push(imageGroup);
        });
    }

    // Get all the form arrays
    get imagesArray(): FormArray {
        return this.formData.get('images') as FormArray;
    }

    get existingImagesArray(): FormArray {
        return this.formData.get('existingImages') as FormArray;
    }

    // Step management methods
    addStep() {
        const newStep: WorkStep = {
            step_no: (this.steps.length + 1).toString(),
            completed_date: null,
            work_types: [],
        };

        // Add initial work type to new step
        this.addWorkType(newStep);
        this.steps.push(newStep);
        this._changeDetectorRef.markForCheck();
    }

    removeStep(index: number) {
        this.steps.splice(index, 1);
        // Re-number remaining steps
        this.steps.forEach((step, idx) => {
            step.step_no = (idx + 1).toString();
        });
        this._changeDetectorRef.markForCheck();
    }

    // Work type management methods
    addWorkType(step: WorkStep) {
        const newWorkType: WorkType = {
            work_type_id: null,
            product_attributes: [],
            product_attribute_others: [],
            expenses: [],
        };
        step.work_types.push(newWorkType);
        this._changeDetectorRef.markForCheck();
    }

    removeWorkType(step: WorkStep, index: number) {
        step.work_types.splice(index, 1);
        this._changeDetectorRef.markForCheck();
    }

    onWorkTypeChange(step: WorkStep, workType: WorkType) {
        // Reset product attributes and expenses when work type changes
        workType.product_attributes = [];
        workType.product_attribute_others = [];
        workType.expenses = [];
        this._changeDetectorRef.markForCheck();
    }

    // Product attribute management methods
    addProductAttribute(workType: WorkType) {
        if (
            this.newPart.deposit_type &&
            this.newPart.product_attribute_id &&
            this.newPart.product_attribute_qty > 0 &&
            this.newPart.amount >= 0
        ) {
            // Add new product attribute
            workType.product_attributes.push({
                deposit_type: this.newPart.deposit_type,
                product_attribute_id: this.newPart.product_attribute_id,
                product_attribute_qty: this.newPart.product_attribute_qty,
                amount: this.newPart.amount,
            });

            const currentDepositType = this.newPart.deposit_type;
            this.newPart = {
                deposit_type: currentDepositType,
                product_attribute_id: null,
                product_attribute_qty: 1,
                amount: 0,
            };
            // รีเซ็ตราคาต่อหน่วย
            this.currentUnitPrice = 0;
            this._changeDetectorRef.markForCheck();
        }
    }

    removeProductAttribute(workType: WorkType, index: number) {
        workType.product_attributes.splice(index, 1);
        this._changeDetectorRef.markForCheck();
    }

    // Custom product attribute management methods
    addCustomProductAttribute(workType: WorkType) {
        if (
            this.newCustomPart.deposit_type &&
            this.newCustomPart.name &&
            this.newCustomPart.amount >= 0
        ) {
            // Add new custom product attribute
            workType.product_attribute_others.push({
                deposit_type: this.newCustomPart.deposit_type,
                name: this.newCustomPart.name,
                detail: this.newCustomPart.detail,
                qty: this.newCustomPart.qty,
                amount: this.newCustomPart.amount,
            });

            // Reset form
            this.newCustomPart = {
                deposit_type: 'internal',
                name: '',
                detail: '',
                qty: 0,
                amount: 0,
            };
            this._changeDetectorRef.markForCheck();
        }
    }

    removeCustomProductAttribute(workType: WorkType, index: number) {
        workType.product_attribute_others.splice(index, 1);
        this._changeDetectorRef.markForCheck();
    }

    // Expense management methods
    addExpense(workType: WorkType) {
        if (this.newExpense.expense_type_id && this.newExpense.amount >= 0) {
            // Add new expense
            workType.expenses.push({
                expense_type_id: this.newExpense.expense_type_id,
                amount: this.newExpense.amount,
            });

            // Reset form
            this.newExpense = {
                expense_type_id: null,
                amount: 0,
            };
            this._changeDetectorRef.markForCheck();
        }
    }

    removeExpense(workType: WorkType, index: number) {
        workType.expenses.splice(index, 1);
        this._changeDetectorRef.markForCheck();
    }

    // Other expense management methods
    addOtherExpense() {
        if (this.newOtherExpense.name && this.newOtherExpense.amount > 0) {
            this.otherExpenses.push({
                name: this.newOtherExpense.name,
                amount: this.newOtherExpense.amount,
            });

            // Reset form
            this.newOtherExpense = {
                name: '',
                amount: 0,
            };
            this._changeDetectorRef.markForCheck();
        }
    }

    removeOtherExpense(index: number) {
        this.otherExpenses.splice(index, 1);
        this._changeDetectorRef.markForCheck();
    }

    // Helper methods
    getProductAttributeName(id: number): string {
        const found = this.productAttributes.find((attr) => attr.id === id);
        return found ? found.name : 'ไม่ระบุ';
    }

    getExpenseTypeName(id: number): string {
        const found = this.expenseType.find((type) => type.id === id);
        return found ? found.name : 'ไม่ระบุ';
    }

    getDepositTypeName(type: 'internal' | 'external'): string {
        return type === 'internal' ? 'ภายใน' : 'ภายนอก';
    }

    // Price calculation
    onProductAttributeChange(event: any) {
        const selectedAttributeId = event.value || event;
        if (selectedAttributeId) {
            const selectedAttribute = this.productAttributes.find(
                (attr) => attr.id === selectedAttributeId
            );
            if (selectedAttribute && selectedAttribute.cost) {
                // เก็บราคาต่อหน่วย
                this.currentUnitPrice = Number(selectedAttribute.cost);
                // คำนวณราคารวม (ราคาต่อหน่วย x จำนวน)
                this.newPart.amount =
                    this.currentUnitPrice * this.newPart.product_attribute_qty;
            } else {
                this.currentUnitPrice = 0;
                this.newPart.amount = 0;
            }
            this._changeDetectorRef.markForCheck();
        }
    }

    onQuantityChange(event: any) {
        const quantity =
            event.target.value || this.newPart.product_attribute_qty;
        if (quantity && this.currentUnitPrice) {
            // คำนวณราคารวมใหม่
            this.newPart.amount = this.currentUnitPrice * quantity;
            this._changeDetectorRef.markForCheck();
        }
    }

    // Get base URL for image path
    getImageBaseUrl(): string {
        return environment.baseURL;
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

    // Save the form data
    async save(): Promise<void> {
        console.log(this.newPart, 'newpart')
        if (this.formData.invalid) {
            this.formData.markAllAsTouched();
            return;
        }

        // Check if there are any steps with work types
        if (
            this.steps.length === 0 ||
            this.steps.some((step) => step.work_types.length === 0)
        ) {
            this._fuseConfirmationService.open({
                title: 'ข้อมูลไม่ครบถ้วน',
                message:
                    'กรุณาระบุขั้นตอนการทำงานและประเภทงานอย่างน้อย 1 รายการ',
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

        // Prepare JSON data for confirmation
        const rawFormValue = this.formData.getRawValue();
        if (this.formData.value.master === false) {
            rawFormValue.master = 'N'
        } else {
            rawFormValue.master = 'Y'
        }

        // Format steps data according to new API format
        const formattedSteps = this.steps.map((step) => {
            return {
                step_no: step.step_no,
                completed_date: step.completed_date
                    ? new Date(step.completed_date).toISOString().split('T')[0]
                    : null,
                work_types: step.work_types.map((workType) => {
                    return {
                        work_type_id: workType.work_type_id,
                        product_attributes: workType.product_attributes,
                        product_attribute_others:
                            workType.product_attribute_others,
                        expenses: workType.expenses,
                    };
                }),
            };
        });

        // Handle confirmation
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
        confirmation.afterClosed().subscribe(async (result) => {
            if (result === 'confirmed') {
                try {
                    const uploadedImages = [];

                    // If there are existing images, add them to the upload list
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
                                    imagePath = imagePath.replace(
                                        baseToRemove,
                                        ''
                                    );
                                }
                            }

                            uploadedImages.push({
                                id: img.id,
                                image: imagePath, // ใช้ path ที่ตัดแล้ว
                            });
                        });
                    }

                    // If there are new files to upload
                    if (this.files && this.files.length > 0) {
                        // Use Promise.all to wait for all image uploads to complete
                        const uploadPromises = this.files.map((file) => {
                            const formData = new FormData();
                            formData.append('image', file);
                            formData.append('path', 'images/asset/');
                            return this._service
                                .upload_images(formData)
                                .toPromise();
                        });

                        const responses = await Promise.all(uploadPromises);

                        // Process responses
                        responses.forEach((response: any) => {
                            if (response.status && response.data) {
                                uploadedImages.push({
                                    image: response.data,
                                });
                            }
                        });
                    }

                    // Create final JSON data for submission with the new API format
                    const jsonData = {
                        ...rawFormValue,
                        product_id: Number(rawFormValue.product_id),
                        images: uploadedImages,
                        steps: formattedSteps,
                        other_expenses: this.otherExpenses,
                        completed_date: rawFormValue.completed_date
                            ? new Date(rawFormValue.completed_date)
                                .toISOString()
                                .split('T')[0]
                            : null,
                        images_to_remove: this.imagesToRemove, // Add IDs of images to remove
                    };

                    console.log('jsonData:', jsonData);

                    // Call API based on whether it's an update or creation
                    const apiCall = this.Id
                        ? this._service.update(jsonData, this.Id)
                        : this._service.create(jsonData);

                    apiCall.subscribe({
                        next: () => {
                            this._router.navigate(['admin/job/list']);
                        },
                        error: (err: any) => {
                            this.formData.enable();
                            this._fuseConfirmationService.open({
                                title: 'เกิดข้อผิดพลาด',
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
        });
    }

    // Navigate back to list
    backTo() {
        this._router.navigate(['admin/job/list']);
    }

    // Open status update dialog
    openStatusDialog(): void {
        if (!this.Id) {
            return; // Don't open dialog for new jobs
        }

        const dialogRef = this._matDialog.open(FormDialogComponent, {
            width: '500px',
            maxHeight: '90vh',
            data: {
                itemId: this.Id,
            },
        });

        dialogRef.afterClosed().subscribe((result) => {
            if (result) {
                // Refresh job data after status update
                this._service.getById(this.Id).subscribe((response) => {
                    this.itemData = response.data;
                    this.formData.patchValue({
                        status: this.itemData.status,
                        completed_date: this.itemData.completed_date
                            ? new Date(this.itemData.completed_date)
                            : null,
                    });
                });
            }
        });
    }
    onVehicleSelect(productId: number): void {
        if (!productId) {
            this.selectedVehicle = null;
            return;
        }

        // ค้นหาข้อมูลรถจาก products array
        const vehicle = this.products.find(
            (product) => product.id === productId
        );
        if (vehicle) {
            this.selectedVehicle = vehicle;
            console.log('Selected vehicle:', this.selectedVehicle);
        } else {
            this.selectedVehicle = null;
        }

        this._changeDetectorRef.markForCheck();
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
                (item) =>
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


    private _filterParts(value: string): any[] {
        const filterValue = value;
        return this.productAttributes.filter(part => part.name.includes(filterValue));
    }

    onSelectproducts(event: any): void {
        if (!event) {
            if (this.productsFilter.invalid) {
                this.productsFilter.markAsTouched();
            }
            return;
        }

        this.formData.patchValue({
            product_id: event.id,
        });
        const vehicle = this.products.find(
            (product) => product.id === event.id
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

    onSelectparts(event: any): void {
        const selectedAttributeId = event.value || event;
        if (selectedAttributeId) {
            const selectedAttribute = this.productAttributes.find(
                (attr) => attr.id === selectedAttributeId.id
            );
            if (selectedAttribute && selectedAttribute.cost) {

                this.currentUnitPrice = Number(selectedAttribute.cost);
                this.newPart.amount =
                    this.currentUnitPrice * this.newPart.product_attribute_qty;
            } else {
                this.currentUnitPrice = 0;
                this.newPart.amount = 0;
            }

            if (!event) {
                if (this.partsFilter.invalid) {
                    this.partsFilter.markAsTouched();
                }
                return;
            }

            this.newPart.product_attribute_id = event.id;

            const productAttributes = this.productAttributes.find(
                (product) => product.id === event.id
            );
            if (productAttributes) {
                this.selectedParts = productAttributes;
            } else {
                this.selectedParts = null;
            }


            this.partsFilter.setValue(`${event.name}`);
            this._changeDetectorRef.markForCheck();
        }

    }
    ngOnDestroy(): void {
        // Clean up code if needed
    }

    onSelectMaseter(selectedItem: any) {
        // Populate steps if they exist
        if (selectedItem?.steps && selectedItem?.steps.length) {
            console.log(selectedItem);
            this.steps = [];
            selectedItem?.steps.forEach((step) => {
                const workStepItem: WorkStep = {
                    step_no: step.step_no,
                    completed_date: step.completed_date
                        ? new Date(step.completed_date)
                        : null,
                    work_types: [],
                };
                console.log(workStepItem, 'workStepItem');

                if (
                    step.step_job_type_lists &&
                    step.step_job_type_lists.length
                ) {
                    step.step_job_type_lists.forEach((workType) => {
                        const workTypeItem: WorkType = {
                            work_type_id: Number(workType.work_type_id),
                            product_attributes: [],
                            product_attribute_others: [],
                            expenses: [],
                        };

                        // Add product attributes if they exist
                        if (
                            workType.product_attributes &&
                            workType.product_attributes.length
                        ) {
                            workType.product_attributes.forEach(
                                (attr) => {
                                    workTypeItem.product_attributes.push(
                                        {
                                            deposit_type:
                                                attr.deposit_type ||
                                                'internal',
                                            product_attribute_id:
                                                Number(
                                                    attr.product_attribute_id
                                                ),
                                            product_attribute_qty:
                                                attr.product_attribute_qty,
                                            amount: attr.amount,
                                        }
                                    );
                                }
                            );
                        }

                        // Add product attribute others if they exist
                        if (
                            workType.product_attribute_others &&
                            workType.product_attribute_others.length
                        ) {
                            workType.product_attribute_others.forEach(
                                (other) => {
                                    workTypeItem.product_attribute_others.push(
                                        {
                                            deposit_type:
                                                other.deposit_type ||
                                                'internal',
                                            name: other.name,
                                            detail: other.detail,
                                            qty: other.qty,
                                            amount: other.amount,
                                        }
                                    );
                                }
                            );
                        }

                        // Add expenses if they exist
                        if (
                            workType.expenses &&
                            workType.expenses.length
                        ) {
                            workType.expenses.forEach((expense) => {
                                workTypeItem.expenses.push({
                                    expense_type_id: Number(
                                        expense.expense_type_id
                                    ),
                                    amount: expense.amount,
                                });
                            });
                        }

                        workStepItem.work_types.push(workTypeItem);
                    });
                }

                this.steps.push(workStepItem);
            });
        }

        // Populate other expenses if they exist
        if (
            selectedItem?.other_expenses &&
            selectedItem?.other_expenses.length
        ) {
            this.otherExpenses = selectedItem?.other_expenses.map(
                (expense) => ({
                    name: expense.name,
                    amount: expense.amount,
                })
            );
        }
        this._changeDetectorRef.markForCheck();

    }

    converImage(imagePath: string) {
        return environment.baseURL + '/' + imagePath
    }

    onImageError(event: Event): void {
        const target = event.target as HTMLImageElement;
        target.src = 'assets/images/no_image.png'; // เส้นทางรูปภาพ default
    }
}
