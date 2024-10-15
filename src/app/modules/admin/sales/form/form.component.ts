

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
@Component({
    selector: 'form-product',
    templateUrl: './form.component.html',
    styleUrls: ['./form.component.scss'],
    encapsulation: ViewEncapsulation.None,
    standalone: true,
    imports: [
        CarouselComponent,
        MatRadioModule, 
        NgxMaskDirective,
         MatAutocompleteModule, 
         CommonModule, MatIconModule, FormsModule, MatFormFieldModule, NgClass, MatInputModule, TextFieldModule, ReactiveFormsModule, MatButtonToggleModule, MatButtonModule, MatSelectModule, MatOptionModule, MatChipsModule, MatDatepickerModule],
})
export class FormComponent implements OnInit {
    formFieldHelpers: string[] = ['fuse-mat-dense'];
    fixedSubscriptInput: FormControl = new FormControl('', [Validators.required]);
    dynamicSubscriptInput: FormControl = new FormControl('', [Validators.required]);
    fixedSubscriptInputWithHint: FormControl = new FormControl('', [Validators.required]);
    dynamicSubscriptInputWithHint: FormControl = new FormControl('', [Validators.required]);
    isForm: boolean = true
    clientData: any[] = [];
    finanaceData: any[] = [];
    productData: any[] = [];
    brandData: any[] = [];
    brandModelData: any[] = [];
    paymentData: any[] = [];
    claimData: any[] = [];
    userData: any[] = [];
    images: any[] = [];
    image: string = '';
    itemData: any;
    total: number;
    total1: number;
    Id: number;
    claimId: number;
    product_select: any;
    saleType: any[] = [
        {
            code: 'Installment_with_finance',
            name: 'ผ่อนชำระผ่านไฟแนนซ์'
        },
        {
            code: 'Installment_with_companie',
            name: 'ผ่อนชำระกับทางร้าน'
        },
        {
            code: 'Cash',
            name: 'เงินสด'
        },

    ];
    promotionData: any[] = [];
    repairType: any[] = [
        {
            code: 'IN',
            name: 'ช่างภายใน'
        },
        {
            code: 'OUT',
            name: 'ช่างภายนอก'
        },

    ];
    formData: FormGroup;
    formattedDateTime: string;
    productSelected: any;

    ///sale_user
    saleFilter = new FormControl('', Validators.required);
    filterSale: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
    saleData: any[] = [];

    ///finance_user
    financeFilter = new FormControl('');
    filterFinance: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
    financeData: any[] = [];

    ///engineer_user
    engineerFilter = new FormControl('');
    filterEngineer: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
    engineerData: any[] = [];

    garageData: any[] = []
    user_login: any = JSON.parse(localStorage.getItem('user'));

    productFilter = new FormControl(Object);
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

    ) {

        this._service.getPromotion().subscribe((resp: any) => {
            this.promotionData = resp.data
        })
        this._service.getUserByDepartment(2).subscribe((resp: any) => {
            this.saleData = resp.data
            this.filterSale.next(this.saleData.slice());
        })
        this._service.getUserByDepartment(1).subscribe((resp: any) => {
            this.engineerData = resp.data
            this.filterEngineer.next(this.engineerData.slice());
        })
        this._service.getFinanace().subscribe((resp: any) => {
            this.financeData = resp.data
            this.filterFinance.next(this.financeData.slice());
        })
        this.formData = this._fb.group({
            id: null,
            date: null,
            sale_id: null,
            client_id: null,
            finance_id: null,
            finance_payment_period: null,
            finance_other: null,
            sale_price: 0,
            finance_price: 0,
            down_price: 0,
            sale_type: null,
            tax_and_plo: 0,
            type: null,
            finance_fee: 0,
            assemble_fee: 0,
            gps_fee: 0,
            insurance_level: null,
            insurance_price: 0,
            total_price: 0,
            first_payment: 0,
            discount: 0,
            other_price: 0,
            final_price: 0,
            remark: null,
            interview: null,
            product_id: null,
            engineer_id: null,
            customer_name: null,
            phone: null,
            idcard: null,
            address: null,
            brand_id: null,
            brand_model_id: null,
            promotion_lists: this._fb.array([]),
            repairs: this._fb.array([]),
            promotion_id: null
        });

        this._service.getClient().subscribe((resp: any) => {
            this.clientData = resp.data
        });
        // this._service.getFinanace(.subscribe((resp: any) => {
        //     this.finanaceData = resp.data
        // });

        this._service.getBrand().subscribe((resp: any) => {
            this.brandData = resp.data
        });
        this._service.getGarage().subscribe((resp: any) => {
            this.garageData = resp.data
        });




    }

    addPromotion() {
        // this.setPromotions(data.data);
    }

    ngOnInit() {

        if (this._router.url !== '/admin/sales/form') {
            this.activatedRoute.params.subscribe(params => {

                this.isForm = false;
                const id = params.id;
                this.Id = id
                this._service.getById(id).subscribe((resp: any) => {
                    this.itemData = resp.data;
                    const currentDateTime = DateTime.fromISO(this.itemData.date)
                    this.formattedDateTime = currentDateTime.toFormat('dd/MM/yyyy')
                    this.saleFilter.setValue(this.itemData.sale?.name)
                    this.financeFilter.setValue(this.itemData.finance?.name)
                    this.engineerFilter.setValue(this.itemData.engineer?.name)
                    this._service.getBrandModel(this.itemData.orders?.brand?.id).subscribe((resp: any) => {
                        this.brandModelData = resp.data

                    });

                    this._service.getProduct(this.itemData.orders?.brand_model.id).subscribe((resp: any) => {
                        this.productData = resp.data
                        // console.log('product 1',this.itemData.orders.product_id);
                        let value = this.productData.find(item => item.id === +this.itemData.orders.product_id)
                        this.productFilter.setValue(value)
                        // console.log('product data',value);
                        this.selectProduct(value);
                        this._changeDetectorRef.markForCheck();

                    });

                    // this.paymentData = resp.data.orders.payments;
                    // this.claimId = resp.data.orders.product_id;
                    // this.total = this.paymentData.reduce((sum, current) => sum + (+current.price), 0);
                    this.formData.patchValue({
                        ...this.itemData,
                    });
                    this.formData.patchValue({
                        id: +this.itemData.id,
                        brand_id: +this.itemData.orders?.brand?.id,
                        brand_model_id: +this.itemData.orders?.brand_model.id,
                        customer_name: this.itemData.client?.name,
                        phone: this.itemData.client?.phone,
                        idcard: this.itemData.client?.idcard,
                        address: this.itemData.client?.address,
                        type: this.itemData.client?.type,
                        promotion_id: +this.itemData.promotion_id
                    });

                    this._changeDetectorRef.markForCheck();
                    // this._service.getClaim(this.claimId).subscribe((res: any) => {
                    //     this.claimData = res.data;
                    //     this._changeDetectorRef.markForCheck();
                    // })

                    const promotionFormArray = this.formData.get('promotion_lists') as FormArray;
                    this.itemData.promotion_lists.forEach(promotion => {
                        let promo = this._fb.group({
                            id: promotion.id,
                            discount_id: [promotion.discount.id || ''],
                            name: promotion.discount.name,
                            amount: promotion.discount.amount,
                            status: [promotion.status || 'Y'],
                        });

                        promotionFormArray.push(promo);
                    });
                    const repairFormArray = this.formData.get('repairs') as FormArray;
                    this.itemData.repairs.forEach(repair => {
                        let promo = this._fb.group({
                            engineer_id: +repair.engineer_id,
                            type: [repair.type || 'IN'],
                            detail: repair.detail,
                        });

                        repairFormArray.push(promo);
                    })
                });
            });
        } else {
            const currentDateTime = DateTime.now();
            this.formattedDateTime = currentDateTime.toFormat('dd/MM/yyyy');
            this.formData.patchValue({
                sale_id: this.user_login?.id,
                date: currentDateTime.toFormat('yyyy-MM-dd')
            })
            this.saleFilter.setValue(this.user_login.name)


            // this._service.getPromotion().subscribe((data) => {
            //     // this.setPromotions(data.data);
            //     this._changeDetectorRef.markForCheck();
            // });
        }
        this.saleFilter.valueChanges
            .pipe(takeUntil(this._onDestroy))
            .subscribe(() => {
                this._filterSale();
            });
        this.financeFilter.valueChanges
            .pipe(takeUntil(this._onDestroy))
            .subscribe(() => {
                this._filterSale();
            });
        this.engineerFilter.valueChanges
            .pipe(takeUntil(this._onDestroy))
            .subscribe(() => {
                this._filterEngineer();
            });
        this.formData.valueChanges.pipe(distinctUntilChanged())
            .subscribe(() => this.calculateTotal());
    }


    calculateTotal(): void {
        const formValues = this.formData.value;
        // let financePrice = formValues.sale_price - formValues.down_price
        // console.log(financePrice, 'financePrice');
        // คำนวณยอดจัดไฟแนนซ์ (ราคาขาย - เงินดาวน์)
        const financeAmount = formValues.sale_price - formValues.down_price;

        // ตรวจสอบว่าผลลัพธ์ไม่ต่ำกว่า 0 (กรณีที่กรอกเกิน)
        const validFinanceAmount = Math.max(financeAmount, 0);
        this.total1 =
            formValues.down_price +
            formValues.tax_and_plo +
            formValues.finance_fee +
            formValues.assemble_fee +
            formValues.gps_fee +
            formValues.insurance_price;

        // คำนวณ final_price
        const finalPrice =
            this.total1 -
            formValues.first_payment -
            formValues.discount +
            formValues.other_price;

        this.formData.patchValue(
            {
                finance_price: validFinanceAmount,  // อัปเดตยอดจัดไฟแนนซ์
                total_price: this.total1,             // อัปเดตผลรวมทั้งหมด
                final_price: finalPrice              // ราคาไฟนอล
            },
            { emitEvent: false }
        );
    }


        /**
     * On destroy
     */  protected _onDestroy = new Subject<void>();

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Get the form field helpers as string
     */

    protected _filterEngineer() {

        if (!this.engineerData) {
            return;
        }
        let search = this.engineerFilter.value;
        if (!search) {
            this.filterEngineer.next(this.engineerData.slice());
            return;
        } else {
            search = search.toLowerCase();
        }
        this.filterEngineer.next(
            this.engineerData.filter(item => item.name.toLowerCase().indexOf(search) > -1)
        );
    }

    protected _filterSale() {

        if (!this.saleData) {
            return;
        }
        let search = this.saleFilter.value;
        if (!search) {
            this.filterSale.next(this.saleData.slice());
            return;
        } else {
            search = search.toLowerCase();
        }
        this.filterSale.next(
            this.saleData.filter(item => item.name.toLowerCase().indexOf(search) > -1)
        );
    }

    protected _filterFinance() {

        if (!this.financeData) {
            return;
        }
        let search = this.financeFilter.value;
        if (!search) {
            this.filterFinance.next(this.financeData.slice());
            return;
        } else {
            search = search.toLowerCase();
        }
        this.filterSale.next(
            this.financeData.filter(item => item.name.toLowerCase().indexOf(search) > -1)
        );
    }

    repairs(): FormArray {
        return this.formData.get('repairs') as FormArray;
    }

    createRepairsForm(): FormGroup {
        return this._fb.group({
            engineer_id: null,
            type: 'IN',
            detail: '',
        });
    }

    addRepair(): void {
        this.repairs().push(this.createRepairsForm());

    }

    removeRepair(i: number): void {
        this.repairs().removeAt(i);
    }

    promotions(): FormArray {
        return this.formData.get('promotion_lists') as FormArray;
    }

    createPromotionForm(promotion: any): FormGroup {
        return this._fb.group({
            discount_id: '',
            name: promotion?.discount?.name,
            amount: promotion?.discount?.amount
            // promotion_id: [promotion.id || ''],
            // name: promotion.name,
            // amount: 0,
            // paid: '1',
            // detail: '',
            // checked: false
        });
    }
    setPromotions(promotions: any[]) {

        console.log('promotion', promotions);

        const promotionFormArray = this.formData.get('promotion_lists') as FormArray;
        promotions.forEach(promotion => {
            console.log(promotion);

            promotionFormArray.push(this.createPromotionForm(promotion));
        });
    }

    onSelectSale(event: any, type: any) {
        if (!event) {
            if (this.saleFilter.invalid) {

                this.saleFilter.markAsTouched(); // กำหนดสถานะ touched เพื่อแสดง mat-error
            }
            console.log('No sale');
            return;
        }
        const _value = event;
        const selectedData = this.saleData.find(item => item.name === _value);
        if (selectedData) {
            this.formData.patchValue({
                sale_id: selectedData.id,
            });
            this.saleFilter.setValue(selectedData?.name)
        } else {
            if (this.saleFilter.invalid) {

                this.saleFilter.markAsTouched(); // กำหนดสถานะ touched เพื่อแสดง mat-error
            }
            console.log('No sale');
            return;
        }
    }
    onSelectEngineer(event: any, type: any) {
        if (!event) {
            if (this.engineerFilter.invalid) {

                this.engineerFilter.markAsTouched(); // กำหนดสถานะ touched เพื่อแสดง mat-error
            }
            console.log('No Engineer');
            return;
        }
        const _value = event;
        const selectedData = this.engineerData.find(item => item.name === _value);
        if (selectedData) {
            this.formData.patchValue({
                engineer_id: selectedData.id,
            });
            this.engineerFilter.setValue(selectedData?.name)
        } else {
            if (this.engineerFilter.invalid) {

                this.engineerFilter.markAsTouched(); // กำหนดสถานะ touched เพื่อแสดง mat-error
            }
            console.log('No Engineer');
            return;
        }
    }
    onSelectFinance(event: any, type: any) {
        if (!event) {

            console.log('No Finance');
            return;
        }
        const _value = event;
        const selectedData = this.financeData.find(item => item.name === _value);
        if (selectedData) {
            this.formData.patchValue({
                finance_id: selectedData.id,
            });
            this.financeFilter.setValue(selectedData?.name)
        } else {

            console.log('No Finance');
            return;
        }
    }

    getFormFieldHelpersAsString(): string {
        return this.formFieldHelpers.join(' ');
    }

    onBack() {
        this._router.navigate(['admin/sales/list'])
    }

    selectProduct(item: any): void {

        // console.log(item,'item');
        
        this.formData.patchValue({
            product_id: item.id,
            sale_price: item.sale_price
        })
        let data = {
            brand_model: item.brand?.name + '/' + item.brand_model?.name,
            year: item.year,
            color: item.color?.name,
            gear: item.gear,
            license_plete: item.license_plate,
            engine_no: item.engine_no,
            tank_no: item.tank_no,
        }
        
        if (item.images) {
            item.images.forEach(element => {
                let _images = {
                    url: element.image,
                    alt: element.id
                }
                this.images.push(_images)
            })
           
        }
        this.image = item.image
        
        // this.images = item.images
        this.productSelected = data
        this.productFilter.setValue(item)
        // console.log(this.productSelected);
        this._changeDetectorRef.markForCheck();

    }

    selectBrand(item: any): void {


        this._service.getBrandModel(item).subscribe((resp: any) => {
            this.brandModelData = resp.data
        });
    }

    selectBrandModel(item: any): void {
        this._service.getProduct(item).subscribe((resp: any) => {
            this.productData = resp.data
        });
    }

    onSubmit(): void {
        if (this.isForm === true) {
            const dialogRef = this._fuseConfirmationService.open({
                "title": "บันทึกข้อมูล",
                "message": "คุณต้องการบันทึกข้อมูลใช่หรือไม่ ?",
                "icon": {
                    "show": true,
                    "name": "heroicons_outline:exclamation-triangle",
                    "color": "accent"
                },
                "actions": {
                    "confirm": {
                        "show": true,
                        "label": "ตกลง",
                        "color": "primary"
                    },
                    "cancel": {
                        "show": true,
                        "label": "ยกเลิก"
                    }
                },
                "dismissible": true
            })

            dialogRef.afterClosed().subscribe((result => {
                if (result === 'confirmed') {
                    let formValue = this.formData.value;
                    formValue.date = moment(formValue.date).format('YYYY-MM-DD')
                    this._service.create(formValue).subscribe({
                        next: (resp: any) => {
                            this._router.navigate(['admin/sales/list'])
                        },
                        error: (err: any) => {
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

                }
            }))
        } else {
            const dialogRef = this._fuseConfirmationService.open({
                "title": "บันทึกข้อมูล",
                "message": "คุณต้องการบันทึกข้อมูลใช่หรือไม่ ?",
                "icon": {
                    "show": true,
                    "name": "heroicons_outline:exclamation-triangle",
                    "color": "accent"
                },
                "actions": {
                    "confirm": {
                        "show": true,
                        "label": "ตกลง",
                        "color": "primary"
                    },
                    "cancel": {
                        "show": true,
                        "label": "ยกเลิก"
                    }
                },
                "dismissible": true
            })

            dialogRef.afterClosed().subscribe((result => {
                if (result === 'confirmed') {
                    let formValue = this.formData.value;
                    formValue.date = moment(formValue.date).format('YYYY-MM-DD')
                    this._service.update(formValue, this.Id).subscribe({
                        next: (resp: any) => {
                            this._router.navigate(['admin/sales/list'])
                        },
                        error: (err: any) => {
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

                }
            }))
        }

    }

    payment() {
        const dialogRef = this.dialog.open(EditDialogComponent, {
            width: '500px', // กำหนดความกว้างของ Dialog
            data: {
                data: this.itemData.id,
            } // ส่งข้อมูลเริ่มต้นไปยัง Dialog
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this._service.getById(this.Id).subscribe((resp: any) => {
                    this.itemData = resp.data;
                    this.paymentData = resp.data.orders.payments;
                    this.total = this.paymentData.reduce((sum, current) => sum + (+current.price), 0);
                    this.formData.patchValue({
                        ...this.itemData,
                    });
                });
            }
        });
    }
    customer(value: any) {
        const dialogRef = this.dialog.open(CustomerDialogComponent, {
            width: '800px',
            height: '800px',
            data: {
                type: value
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.formData.patchValue({
                    client_id: result.id,
                    customer_name: result.name ?? null,
                    phone: result.phone ?? null,
                    idcard: result.idcard ?? null,
                    address: result.address ?? null,
                    type: result.type ?? null,
                })
            }
        });
    }

    showPicture(imgObject: any): void {
        console.log(imgObject)
        this.dialog
            .open(PictureComponent, {
                autoFocus: false,
                data: {
                    imgSelected: environment.baseURL + imgObject,
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

    onSelectedPromotion(event: any) {

        let data = this.promotionData.find(item => item.id === event)
        const promotionFormArray = this.formData.get('promotion_lists') as FormArray;
        // เคลียร์ข้อมูลใน FormArray
        while (promotionFormArray.length !== 0) {
            promotionFormArray.removeAt(0);
        }
        data.promotion_lists.forEach(promotion => {
            let promo = this._fb.group({
                discount_id: [promotion.discount.id || ''],
                name: promotion.discount.name,
                amount: promotion.discount.amount,
                status: 'Y'
            });
            promotionFormArray.push(promo);
        });
        this.formData.patchValue({
            promotion_id: event
        })
    }
    zoomedImage: { url: string; alt: string } | null = null;
    zoomImage(image: { url: string; alt: string }) {
        this.zoomedImage = image;
      }
    
      closeZoom() {
        this.zoomedImage = null;
      }

}


