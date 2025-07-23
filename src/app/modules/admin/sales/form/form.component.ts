import { TextFieldModule } from '@angular/cdk/text-field';
import { CommonModule, NgClass } from '@angular/common';
import {
    ChangeDetectorRef,
    Component,
    OnInit,
    ViewEncapsulation,
} from '@angular/core';
import {
    AbstractControl,
    FormArray,
    FormBuilder,
    FormControl,
    FormGroup,
    FormsModule,
    ReactiveFormsModule,
    UntypedFormBuilder,
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
import { MatSelectModule } from '@angular/material/select';
import { PageService } from '../page.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FuseConfirmationService } from '@fuse/services/confirmation';

import moment from 'moment';
import { EditDialogComponent } from '../edit-dialog/edit-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { PictureComponent } from '../picture/picture.component';
import { environment } from 'environments/environment.development';
import { ClaimDialogComponent } from '../claim-dialog/claim-dialog.component';
import { DateTime } from 'luxon';
import { distinctUntilChanged, ReplaySubject, Subject, takeUntil } from 'rxjs';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { NgxMaskDirective } from 'ngx-mask';
import { MatRadioModule } from '@angular/material/radio';
import { CustomerDialogComponent } from '../customer-dialog/customer-dialog.component';
import { CarouselComponent } from '../image-slide/carousel.component';
import { FormDialogComponent } from '../form-dialog/form-dialog.component';
import { ProductDialogComponent } from '../product-dialog/product-dialog.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { UploadService } from 'app/shared/upload.service';
import { attempt } from 'lodash';
import { AutocompleteDropdownComponent } from 'app/shared/autocomplete-dropdown/autocomplete-dropdown.component';
@Component({
    selector: 'form-sales',
    templateUrl: './form.component.html',
    styleUrls: ['./form.component.scss'],
    encapsulation: ViewEncapsulation.None,
    standalone: true,
    imports: [
        CarouselComponent,
        MatRadioModule,
        NgxMaskDirective,
        MatAutocompleteModule,
        CommonModule,
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
        MatCheckboxModule,
        AutocompleteDropdownComponent
    ],
})
export class FormComponent implements OnInit {
    masterControl = new FormControl(null);
    masters: any[] = [ /* ดึงจาก API หรือข้อมูลส่วนกลาง */];
    formFieldHelpers: string[] = ['fuse-mat-dense'];
    isForm: boolean = true;
    total: number;
    Id: number;
    newTxForm!: FormGroup;
    newTx = {
        transaction_date: null,
        type: '',
        description: '',
        amount: null
    };
    financeChannel: any[] = [
        {
            code: 'front',
            name: 'หน้าร้าน',
        },
        {
            code: 'facebook',
            name: 'Facebook',
        },
        {
            code: 'tiktok',
            name: 'Tiktok',
        },
        {
            code: 'etc',
            name: 'ETC.',
        },
    ];
    readinessCheckItems: string[] = [
        'ตรวจสอบเครื่องยนต์',
        'ตรวจสอบระบบเบรก',
        'ตรวจสอบระบบไฟฟ้า',
        'ตรวจสอบสภาพภายนอก',
        'ตรวจสอบสภาพภายใน',
        'ตรวจสอบน้ำมันเครื่อง',
        'ตรวจสอบระบบปรับอากาศ',
        'ตรวจสอบล้อและยาง',
        'ตรวจสอบเอกสาร',
        'ตรวจสอบพ.ร.บ.',
    ];
    otherCosts: Array<{ name: string; cost: number }> = [];
    newCostItem: { name: string; cost: number } = { name: '', cost: 0 };
    categories: any[] = [];
    formData: FormGroup;
    formattedDateTime: string;
    productSelected: any;
    form: FormGroup;
    ///sale_user
    saleFilter = new FormControl('', Validators.required);
    filterSale: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
    saleData: any[] = [];
    checkListOptions: any[] = [];
    categoryOptionsPerRow: any[] = [];
    type_income: any[] = [];
    type_deduct: any[] = [];
    users: any[] = [];
    userFilter = new FormControl('');
    filteruser: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
    itemData: any
    /**
     * Constructor
     */
    constructor(
        private _service: PageService,
        private _fb: FormBuilder,
        private _router: Router,
        private _fuseConfirmationService: FuseConfirmationService,
        public activatedRoute: ActivatedRoute,
        private dialog: MatDialog,
        private _changeDetectorRef: ChangeDetectorRef,
        private _matDialog: MatDialog,
        private _uploadService: UploadService
    ) {
        this.masters = this.activatedRoute.snapshot.data?.masters?.data || [];
        this.Id = this.activatedRoute.snapshot.params['id'];
        this.users = this.activatedRoute.snapshot.data?.users?.data || [];
        this.checkListOptions = this.activatedRoute.snapshot.data?.checkLists?.data || [];
        this.filteruser.next(this.users.slice());
        this.type_income =
            this.activatedRoute.snapshot.data?.type_income?.data || [];
        this.type_deduct =
            this.activatedRoute.snapshot.data?.type_deduct?.data || [];
        this.formData = this._fb.group({
            master_jobs_id: [''],
            id: [null],
            date: [null, Validators.required],
            date_receive: [null, Validators.required],
            finance_channel: [null],
            finance_deposit: [0],
            finance_price: [0],
            finance_price_sale: [0],
            finance_discount: [0],
            finance_remark: [''],
            // Vehicle information
            product_id: [null],
            vehicle_name: [''],
            brand: [''],
            model: [''],
            license_plate: [''],
            province: [''],
            year: [''],
            // Customer information
            customer_id: [null],
            customer_name: [''],
            phone: [''],
            idcard: [''],
            address: [''],
            type: [''],
            // Sales information
            sale_id: [null, Validators.required],
            // Car readiness checklist
            readiness_checks: this._fb.array([]),
            // Other costs
            other_costs: this._fb.array([]),
        });

        this.form = this._fb.group({
            complete_date: '',
            master_jobs_id: [null],
            brand: [null],
            model: [null],
            color: [null],
            license: [null],
            province: [null],
            year: [null],
            client_name: [null],
            client_phone: [null],
            client_id_card: [null],
            client_address: [null],
            booking_date: [null],
            pickup_date: [null],
            sale_channel: [null],
            down_payment: [null],
            sale_price: [null],
            discount: [null],
            sale_remark: [null],
            check_lists: this._fb.array([]),
            income_expense_trans: this._fb.array([])
        });


        // ในส่วน constructor แทนที่การสร้าง FormArray ว่าง
        this.readinessCheckItems.forEach(item => {
            (this.formData.get('readiness_checks') as FormArray).push(new FormControl(false));
        });

        this.userFilter.valueChanges
            .pipe(takeUntil(this._onDestroy))
            .subscribe(() => {
                this._filterUser();
            });
    }

    addPromotion() {
        // this.setPromotions(data.data);
    }

    ngOnInit() {
        if (this.Id) {
            this.isForm = false;
            this._service.getById(this.Id).subscribe((resp: any) => {
                const data = resp.data;
                this.itemData = data
                this.form.patchValue({
                    ...data,
                });

                data.income_expenses.forEach(element => {
                    const Array = this._fb.group({
                        transaction_date: moment(element.transaction_date).format(
                            'YYYY-MM-DD'
                        ),
                        type: [element.type || ''],
                        type_ref_id: [+element.type_ref_id || null],
                        description: [element.description || ''],
                        amount: [element.amount || null],
                        payment_method: [element.payment_method || ''],
                        attachment: [element.attachment || '']
                    });
                    this.incomeExpenseFormArray.push(Array)
                });
                this._changeDetectorRef.markForCheck();
            });
        }

        this.newTxForm = this._fb.group({
            transaction_date: [null],
            type: [''],
            type_ref_id: [''],
            payment_method: [''],
            description: [''],
            amount: [null],
            attachment: [null],
            attachment_name: [null],
        });

        this.newTxForm.get('type').valueChanges.subscribe((value) => {
            if (value === 'income') {
                this.categories = this.type_income;
            } else if (value === 'expense') {
                this.categories = this.type_deduct;
            } else {
                this.categories = [];
            }
        });
        // this.initializeReadinessChecks();
    }



    /**
     * On destroy
     */ protected _onDestroy = new Subject<void>();

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Get the form field helpers as string
     */

    onBack() {
        this._router.navigate(['admin/sales/list']);
    }

    onSubmit(): void {
        // this.updateReadinessChecks();
        if (this.isForm === true) {
            const dialogRef = this._fuseConfirmationService.open({
                title: 'บันทึกข้อมูล',
                message: 'คุณต้องการบันทึกข้อมูลใช่หรือไม่ ?',
                icon: {
                    show: true,
                    name: 'heroicons_outline:exclamation-triangle',
                    color: 'accent',
                },
                actions: {
                    confirm: {
                        show: true,
                        label: 'ตกลง',
                        color: 'primary',
                    },
                    cancel: {
                        show: true,
                        label: 'ยกเลิก',
                    },
                },
                dismissible: true,
            });

            dialogRef.afterClosed().subscribe((result) => {
                if (result === 'confirmed') {

                    let formValue = this.form.value;
                    formValue.complete_date = moment(formValue.complete_date).format(
                        'YYYY-MM-DD'
                    );
                    formValue.pickup_date = moment(formValue.pickup_date).format(
                        'YYYY-MM-DD'
                    );
                    formValue.booking_date = moment(formValue.booking_date).format(
                        'YYYY-MM-DD'
                    );

                    this._service.create(formValue).subscribe({
                        next: (resp: any) => {
                            this._router.navigate(['admin/sales/list']);
                        },
                        error: (err: any) => {
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
                } else {
                }
            });
        } else {
            const dialogRef = this._fuseConfirmationService.open({
                title: 'บันทึกข้อมูล',
                message: 'คุณต้องการบันทึกข้อมูลใช่หรือไม่ ?',
                icon: {
                    show: true,
                    name: 'heroicons_outline:exclamation-triangle',
                    color: 'accent',
                },
                actions: {
                    confirm: {
                        show: true,
                        label: 'ตกลง',
                        color: 'primary',
                    },
                    cancel: {
                        show: true,
                        label: 'ยกเลิก',
                    },
                },
                dismissible: true,
            });

            dialogRef.afterClosed().subscribe((result) => {
                if (result === 'confirmed') {
                    let formValue = this.form.value;
                    const formatDate = (date: any) => {
                        if (
                            !date || // null, undefined, ""
                            typeof date !== 'string' ||
                            moment(date, 'YYYY-MM-DD', true).isValid() // ถ้าอยู่ในรูปแบบ YYYY-MM-DD แล้ว
                        ) {
                            return date;
                        }
                        return moment(date).format('YYYY-MM-DD');
                    };

                    formValue.complete_date = formatDate(formValue.complete_date);
                    formValue.pickup_date = formatDate(formValue.pickup_date);
                    formValue.booking_date = formatDate(formValue.booking_date);
                    console.log(formValue);
                    this._service.update(formValue, this.Id).subscribe({
                        next: (resp: any) => {
                            this._router.navigate(['admin/sales/list']);
                        },
                        error: (err: any) => {
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
                } else {
                }
            });
        }
    }

    customer(value: any) {
        const dialogRef = this.dialog.open(CustomerDialogComponent, {
            width: '800px',
            height: '800px',
            data: {
                type: value,
            },
        });

        dialogRef.afterClosed().subscribe((result) => {
            if (result) {
                this.formData.patchValue({
                    customer_id: result.id ?? null,
                    customer_name: result.name ?? null,
                    phone: result.phone ?? null,
                    idcard: result.idcard ?? null,
                    address: result.address ?? null,
                    type: result.type ?? null,
                });
                this.form.patchValue({
                    client_name: result.name ?? null,
                    client_phone: result.phone ?? null,
                    client_id_card: result.idcard ?? null,
                    client_address: result.address ?? null,
                });


            }
        });
    }

    convertType(id: any, type: string) {
        if (type === 'income') {
            const selectedData = this.type_income.find(item => item.id === id);
            return selectedData.name
        } else if (type === 'expense') {
            const selectedData = this.type_deduct.find(item => item.id === id);
            return selectedData.name
        } else {
            return '-'
        }
    }

    converPaymentMethod(type: string) {
        if (type === 'cash') {
            return 'เงินสด'
        } else if (type === 'tranfer') {
            return 'โอนเงิน'
        } else {
            return '-'
        }
    }

    product(value: any) {
        const dialogRef = this.dialog.open(ProductDialogComponent, {
            width: '800px',
            height: '800px',
            data: {
                type: value,
            },
        });

        dialogRef.afterClosed().subscribe((result) => {
            if (result) {

                console.log(result, 'result.name');
                this.formData.patchValue({
                    product_id: result.id,
                    vehicle_name: result.name ?? null,
                    brand: result.brand?.name ?? null,
                    model: result.brand_model?.name ?? null,
                    license_plate: result.license_plate ?? null,
                    province: result.province ?? null,
                    year: result.year ?? null,
                });
                this.form.patchValue({
                    brand: result.brand?.name ?? null,
                    model: result.brand_model?.name ?? null,
                    color: result.color?.name ?? null,
                    license: result.license_plate ?? null,
                    province: result.province ?? null,
                    year: result.year ?? null,
                });
                this._changeDetectorRef.markForCheck();
            }
        });
    }

    showPicture(imgObject: any): void {
        console.log(environment.baseURL + '/' + imgObject);
        this.dialog
            .open(PictureComponent, {
                autoFocus: false,
                data: {
                    imgSelected: environment.baseURL + '/' + imgObject,
                },
            })
            .afterClosed()
            .subscribe(() => {
                // Go up twice because card routes are setup like this; "card/CARD_ID"
                // this._router.navigate(['./../..'], {relativeTo: this._activatedRoute});
            });
    }
    formatNumber() {
        let value = this.formData.get('sale_price')?.value;

        if (value) {
            // Remove commas if any
            value = value.replace(/,/g, '');
            // Convert to number and then format
            const formattedValue = new Intl.NumberFormat().format(value);
            this.formData.get('sale_price')?.setValue(formattedValue);
        }
    }

    onInputChange(event: any) {
        // Remove all characters except numbers
        let value = event.target.value.replace(/[^0-9]/g, '');
        // Format as currency
        const formattedValue = new Intl.NumberFormat().format(value);
        console.log(formattedValue);

        this.formData.get('sale_price')?.setValue(formattedValue);
        // console.log(this.formData.value.sale_price);
    }
    zoomedImage: { url: string; alt: string } | null = null;
    zoomImage(image: { url: string; alt: string }) {
        this.zoomedImage = image;
    }

    closeZoom() {
        this.zoomedImage = null;
    }

    openStatusDialog(): void {
        const dialogRef = this._matDialog.open(FormDialogComponent, {
            width: '500px',
            maxHeight: '90vh',
            data: {
                itemId: this.Id,
                item: this.itemData
            },
        });

        dialogRef.afterClosed().subscribe((result) => {
            if (result) {
                // Refresh job data after status update
                this._service.getById(this.Id).subscribe((resp: any) => { 
                    const data = resp.data;
                this.itemData = data
                this.form.patchValue({
                    ...data,
                });
                this.incomeExpenseFormArray.clear()
                data.income_expenses.forEach(element => {
                    const Array = this._fb.group({
                        transaction_date: moment(element.transaction_date).format(
                            'YYYY-MM-DD'
                        ),
                        type: [element.type || ''],
                        type_ref_id: [+element.type_ref_id || null],
                        description: [element.description || ''],
                        amount: [element.amount || null],
                        payment_method: [element.payment_method || ''],
                        attachment: [element.attachment || '']
                    });
                    this.incomeExpenseFormArray.push(Array)
                });
                this._changeDetectorRef.markForCheck();
                });
            }
        });
    }

    addCost(): void {
        if (this.newCostItem.name && this.newCostItem.cost) {
            this.otherCosts.push({ ...this.newCostItem });
            this.newCostItem = { name: '', cost: 0 };
            this._changeDetectorRef.markForCheck();
        }
    }
    removeCost(index: number): void {
        this.otherCosts.splice(index, 1);
        this._changeDetectorRef.markForCheck();
    }

    get readinessChecks(): FormArray {
        return this.formData.get('readiness_checks') as FormArray;
    }

    protected _filterUser() {
        if (!this.users) {
            return;
        }
        let search = this.userFilter.value;
        if (!search) {
            this.filteruser.next(this.users.slice());
            return;
        } else {
            search = search.toLowerCase();
        }
        this.filteruser.next(
            this.users.filter(
                (item) => item.name.toLowerCase().indexOf(search) > -1
            )
        );
    }

    onSelectUser(event: any) {
        const selected = this.users.find(item => item.name === event);
        if (selected) {
            this.formData.patchValue({
                sale_id: selected.id
            })
            this.userFilter.setValue(selected.name);
        }
    }

    initializeReadinessChecks(): void {
        this.readinessCheckItems.forEach((item, index) => {
            this.formData.addControl('readiness_check_' + index, new FormControl(false));
        });
    }

    updateReadinessChecks(): void {
        const checks = this.readinessCheckItems
            .map((item, index) => {
                return this.formData.get('readiness_check_' + index)?.value ? item : null;
            })
            .filter(item => item !== null);

        this.formData.get('readiness_checks').setValue(checks);
    }

    onCheckChange(event: any, value: string) {
        const formArray: FormArray = this.form.get('check_lists') as FormArray;
        if (event.checked) {

            formArray.push(this._fb.group({ detail: [value] }));
            console.log(this.form.value);

        } else {
            const index = formArray.controls.findIndex(
                (ctrl) => ctrl.get('detail')?.value === value
            );
            if (index !== -1) {
                formArray.removeAt(index);
            }
        }
    }

    isChecked(name: string): boolean {
        const formArray: FormArray = this.form.get('check_lists') as FormArray;
        return formArray.controls.some(ctrl => ctrl.get('detail')?.value === name);
    }

    get incomeExpenseFormArray(): FormArray {
        return this.form.get('income_expense_trans') as FormArray;
    }

    createTransactionGroup(data: any = {}): FormGroup {
        return this._fb.group({
            transaction_date: moment(data.transaction_date).format(
                'YYYY-MM-DD'
            ),
            type: [data.type || ''],
            type_ref_id: [data.type_ref_id || null],
            description: [data.description || ''],
            amount: [data.amount || null],
            payment_method: [data.payment_method || ''],
            attachment: [data.attachment || '']
        });
    }

    addTransaction() {
        if (this.newTxForm.valid) {
            const newItem = this.createTransactionGroup(this.newTxForm.value);
            this.incomeExpenseFormArray.push(newItem);
            this.newTxForm.reset();
        }
    }

    removeTransaction(index: number) {
        this.incomeExpenseFormArray.removeAt(index);
    }

    setCategoryOptions(index: number, options: any[]) {
        this.categoryOptionsPerRow[index] = options;
    }

    selectedFileName: string | null = null;

    async onFileSelected(fileList: FileList | null): Promise<void> {
        if (fileList && fileList.length > 0) {
            const file = fileList[0];
            this.selectedFileName = file.name;
            this.newTxForm.get('attachment_name')?.setValue(file.name); // อัปเดตชื่อไฟล์ลง form control
            const filePath = await this._uploadService.uploadImage(fileList[0]);
            this.newTxForm.patchValue({
                attachment: filePath
            })
            // console.log(filePath, 'filePath');
        }
    }

    files: File[] = [];
    onSelect(event, input: any) {
        if (input === 'addfile') {
            this.form.patchValue({
                file: event[0],
                file_name: event[0].name,
            });
        }
    }

    convertPathImage(data: any) {
        if (data) {
            const url_image = environment + data
            return url_image;
        } else {
            return '';
        }
    }

    onSelectMaseter(selectedItem: any) {
        if (selectedItem) {
            this.form.patchValue({
                master_jobs_id: selectedItem?.id
            })
        } else {
            this.form.patchValue({
                master_jobs_id: '',
            })
        }
        console.log(this.form.value);

        this._changeDetectorRef.markForCheck();
    }



}
