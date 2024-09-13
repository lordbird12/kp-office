

import { TextFieldModule } from '@angular/cdk/text-field';
import { CommonModule, NgClass } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, UntypedFormBuilder, Validators } from '@angular/forms';
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
@Component({
    selector: 'form-product',
    templateUrl: './form.component.html',
    encapsulation: ViewEncapsulation.None,
    standalone: true,
    imports: [
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
    itemData: any;
    total: number;
    Id: number;
    claimId: number;
    product_select:any;
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
    formData: FormGroup;
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


        this.formData = this._fb.group({
            code:'',
            date: '',
            client_id: '',
            total_price: '',
            down_payment: '',
            finance_id: '',
            interest: '',
            payment_period: '',
            payment_date: '',
            sale_type: '',
            product: {
                product_id: '',
                cost: '', //ต้นทุน
                price: '' //ราคา
            },
            brand_id:'',
            brand_model_id:'',
            color_id:'',
            cc_id:'',
            product_code:''

        });

        this._service.getClient().subscribe((resp: any) => {
            this.clientData = resp.data
        });
        this._service.getFinanace().subscribe((resp: any) => {
            this.finanaceData = resp.data
        });
      
        this._service.getBrand().subscribe((resp: any) => {
            this.brandData = resp.data
        });
       
        console.log(this._router.url)
        if(this._router.url !== '/admin/sales/form') {
            this.activatedRoute.params.subscribe(params => {
                this.isForm = false;
                const id = params.id;
                this.Id= id
                this._service.getById(id).subscribe((resp: any) => {
                    this.itemData = resp.data;
                    this._service.getBrandModel(this.itemData.orders.product.brand_id).subscribe((resp: any) => {
                        this.brandModelData = resp.data
                    });

                    this._service.getProduct(this.itemData.orders.product.brand_model_id).subscribe((resp: any) => {
                        this.productData = resp.data
                        this.selectProduct(this.itemData.orders.product.code);
                        this._changeDetectorRef.markForCheck();

                    });

                    this.paymentData = resp.data.orders.payments;
                    this.claimId = resp.data.orders.product_id;
                    this.total = this.paymentData.reduce((sum, current) => sum + (+current.price), 0);
                    this.formData.patchValue({
                        ...this.itemData,
                    });
                    this.formData.patchValue({
                        brand_id:this.itemData.orders.product.brand_id,
                        brand_model_id:this.itemData.orders.product.brand_model_id,
                        product_code:this.itemData.orders.product.code,
                    });
                    
                    this._changeDetectorRef.markForCheck();
                    this._service.getClaim(this.claimId).subscribe((res: any)=>{
                        this.claimData = res.data;
                        this._changeDetectorRef.markForCheck();
                    })
                });

              });
        }


    }

    ngOnInit() {




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

    onBack() {
        this._router.navigate(['admin/sales/list'])
    }

    selectProduct(item: any): void {
        this.product_select = this.productData.find(product=> product.code === item)
        console.log(this.product_select);

        this.formData.patchValue({
            product: {
                product_id: this.product_select.id,
                cost: this.product_select.cost,
                price: this.product_select.sale_price,
            }
        })
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

    onSubmit() : void {
        if(this.isForm === true) {
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
                if(result === 'confirmed') {
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
            return;
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
    claim() {
        const dialogRef = this.dialog.open(ClaimDialogComponent, {
            width: '500px', // กำหนดความกว้างของ Dialog
            data: {
                    data: this.itemData.id,
            } // ส่งข้อมูลเริ่มต้นไปยัง Dialog
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this._service.getClaim(this.claimId).subscribe((res: any)=>{
                    this.claimData = res.data;
                    console.log(this.claimData)
                    this._changeDetectorRef.markForCheck();
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
                    imgSelected: environment.baseURL +  imgObject,
                },
            })
            .afterClosed()
            .subscribe(() => {
                // Go up twice because card routes are setup like this; "card/CARD_ID"
                // this._router.navigate(['./../..'], {relativeTo: this._activatedRoute});
            });
    }
}


