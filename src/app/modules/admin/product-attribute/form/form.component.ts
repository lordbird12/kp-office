import { TextFieldModule } from '@angular/cdk/text-field';
import { NgClass } from '@angular/common';
import {
    AfterViewInit,
    ChangeDetectorRef,
    Component,
    OnDestroy,
    OnInit,
    ViewEncapsulation,
} from '@angular/core';
import {
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
import { AuthService } from 'app/core/auth/auth.service';
import { Service } from '../page.service';
import { CommonModule } from '@angular/common';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { forkJoin, lastValueFrom } from 'rxjs';

@Component({
    selector: 'form-product',
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
    ],
})
export class FormComponent implements OnInit, AfterViewInit, OnDestroy {
    formFieldHelpers: string[] = ['fuse-mat-dense'];
    fixedSubscriptInput: FormControl = new FormControl('', [
        Validators.required,
    ]);
    dynamicSubscriptInput: FormControl = new FormControl('', [
        Validators.required,
    ]);
    fixedSubscriptInputWithHint: FormControl = new FormControl('', [
        Validators.required,
    ]);
    dynamicSubscriptInputWithHint: FormControl = new FormControl('', [
        Validators.required,
    ]);

    item1Data: any = [];
    item2Data: any = [];
    itemSupplier: any = [];

    itemBrand: any = [];
    itemBrandModel: any = [];
    itemCC: any = [];
    itemColor: any = [];

    formData: FormGroup;
    formData2: FormGroup;

    files: File[] = [];
    files1: File[] = [];
    warehouseData: any;
    companie: any;
    Id: any
    itemData: any
    /**
     * Constructor
     */
    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _fuseConfirmationService: FuseConfirmationService,
        private _formBuilder: FormBuilder,
        private _Service: Service,
        private _matDialog: MatDialog,
        private _router: Router,
        private _activatedRoute: ActivatedRoute,
        private _authService: AuthService
    ) {

        this.Id = this._activatedRoute.snapshot.paramMap.get('id');

        this.formData = this._formBuilder.group({
            category_product_id: ['', Validators.required],
            pr_no: [''],
            name: [''],
            detail: [''],
            tank_no: [''],
            engine_no: [''],
            license_plate: [''],
            sale_price: [''],
            cost: [''],
            type: [''],
            year: [''],
            supplier_id: [''],
            brand_id: [''],
            brand_model_id: [''],
            cc_id: [''],
            color_id: [''],
            image: [''],
            images: [''],
            companie_id: '',
            area_id: '',
            mile: ''
        });
        this.formData2 = this._formBuilder.group({
            category_product_id: ['', Validators.required],
            pr_no: [''],
            name: [''],
            detail: [''],
            tank_no: [''],
            engine_no: [''],
            license_plate: [''],
            sale_price: [''],
            cost: [''],
            type: [''],
            year: [''],
            supplier_id: [''],
            brand_id: [''],
            brand_model_id: [''],
            cc_id: [''],
            color_id: [''],
            image: [''],
            images: [''],
        });
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    async ngOnInit(): Promise<void> {
        // this.getCategories();
        // this.getSuppliers();
        // this.getBrand();
        // this.getCompanie();
        // this.getCC();
        // this.getColor();
        let response = await lastValueFrom(
            forkJoin({
                category: this._Service.getCategories(),
                supplie: this._Service.getSuppliers(),
                brand: this._Service.getBrand(),
                companie: this._Service.getCompanie(),
                cc: this._Service.getCC(),
                color: this._Service.getColor()
            })
        )
        this.item1Data = response.category.data;
        this.itemSupplier = response.supplie.data;
        this.itemBrand = response.brand.data;
        this.companie = response.companie.data;
        this.itemCC = response.cc.data;
        this.itemColor = response.color.data;
        
        if (this.Id) {
            
           
            
            this._Service.getById(this.Id).subscribe((resp: any) => {
                this.itemData = resp.data
                const item = this.companie.find(item => item.id === +this.itemData.area?.companie_id);
                const brand = this.itemBrand.find(item => item.id === +this.itemData.area?.companie_id);
                this.areas = item.areas
                console.log(this.itemData);
                this._Service.getBrandModel(+this.itemData.brand_id).subscribe((resp) => {
                    this.itemBrandModel = resp.data;
                    this.formData.patchValue({
                        ...this.itemData,
                        category_product_id: +this.itemData.category_product_id,
                        supplier_id: +this.itemData.supplier_id,
                        area_id: +this.itemData.area_id,
                        brand_id: +this.itemData.brand_id,
                        brand_model_id: +this.itemData.brand_model_id,
                        cc_id: +this.itemData.cc_id,
                        companie_id: +this.itemData.area?.companie_id,
                        color_id: +this.itemData.color_id,
                        image: [''],
                        images: [''],
                    })
    
                    this.formData2.patchValue({
                        ...this.itemData,
                        image: [''],
                        images: [''],
                    })
                });
       
            })
        }






    }

    /**
     * After view init
     */
    ngAfterViewInit(): void { }

    /**
     * On destroy
     */
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
    }

    getCategories(): void {
        this._Service.getCategories().subscribe((resp) => {
            this.item1Data = resp.data;
        });
    }


    getSuppliers(): void {
        this._Service.getSuppliers().subscribe((resp) => {
            this.itemSupplier = resp.data;
        });
    }

    getBrand(): void {
        this._Service.getBrand().subscribe((resp) => {
            this.itemBrand = resp.data;
        });
    }
    getCompanie(): void {
        this._Service.getCompanie().subscribe((resp) => {
            this.companie = resp.data;
        });
    }

    getBrandModel(id: any): void {
        this._Service.getBrandModel(id).subscribe((resp) => {
            this.itemBrandModel = resp.data;
        });
    }

    getCC(): void {
        this._Service.getCC().subscribe((resp) => {
            this.itemCC = resp.data;
        });
    }

    getColor(): void {
        this._Service.getColor().subscribe((resp) => {
            this.itemColor = resp.data;
        });
    }

    /**
     * Get the form field helpers as string
     */
    getFormFieldHelpersAsString(): string {
        return this.formFieldHelpers.join(' ');
    }

    // somethingChanged(event: any): void {
    //     this.item2Data = event.value;
    // }

    somethingBrandChanged(event: any): void {
        this.itemBrand = event.value;
    }

    somethingBrandModelChanged(event: any): void {
        this.itemBrandModel = event.value;
    }

    somethingCCChanged(event: any): void {
        this.itemCC = event.value;
    }

    somethingColorChanged(event: any): void {
        this.itemColor = event.value;
    }
    areas: any[] = [];
    somethingCompanie(event: any): void {
        const item = this.companie.find(item => item.id === event.value);
        this.areas = item.areas


    }




    onSelect(event) {
        this.files.push(...event.addedFiles);
        // Trigger Image Preview
        setTimeout(() => {
            this._changeDetectorRef.detectChanges();
        }, 150);

    }

    onSelect1(event) {
        this.files1.push(...event.addedFiles);
        // Trigger Image Preview
        setTimeout(() => {
            this._changeDetectorRef.detectChanges();
        }, 150);
    }

    onRemove(event) {
        this.files.splice(this.files.indexOf(event), 1);
    }

    onRemove1(event) {
        this.files1.splice(this.files1.indexOf(event), 1);
    }

    New(): void {
        if(this.Id) {
            const confirmation = this._fuseConfirmationService.open({
                title: 'แก้ไขข้อมูล',
                message: 'คุณต้องการแก้ไขข้อมูลใช่หรือไม่ ',
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
                // If the confirm button pressed...
                if (result === 'confirmed') {
                    const formData = new FormData();
                    Object.entries(this.formData.value).forEach(
                        ([key, value]: any[]) => {
                            formData.append(key, value);
                        }
                    );
                    for (var i = 0; i < this.files.length; i++) {
                        formData.append('image', this.files[i]);
                    }
    
                    for (var i = 0; i < this.files1.length; i++) {
                        formData.append('images[]', this.files1[i]);
                    }
    
                    this._Service.update(formData).subscribe({
                        next: (resp: any) => {
                            this._router.navigate(['admin/product/list'])
                        },
                        error: (err: any) => {
                            this._fuseConfirmationService.open({
                                title: 'กรุณาระบุข้อมูล',
                                message:
                                    'ไม่สามารถบันทึกข้อมูลได้กรุณาตรวจสอบใหม่อีกครั้ง',
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
        } else {

        }
   
    }

    backTo() {
        this._router.navigate(['admin/product/list'])
    }

}
