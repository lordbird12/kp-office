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
import { ToastrService } from 'ngx-toastr';
import { environment } from 'environments/environment.development';

@Component({
    selector: 'form-product-attribute',
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
    files2: File[] = [];
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
        private _authService: AuthService,
        private activated: ActivatedRoute,
        private _toastr: ToastrService,
    ) {
        this.item1Data = this.activated.snapshot.data?.category?.data;
        this.itemSupplier = this.activated.snapshot.data?.supplie?.data;
        this.itemBrand = this.activated.snapshot.data?.brand?.data;
        this.companie = this.activated.snapshot.data?.companie?.data;
        this.itemCC = this.activated.snapshot.data?.cc?.data;
        this.itemColor = this.activated.snapshot.data?.color?.data;

        this.Id = this._activatedRoute.snapshot.paramMap.get('id');

        this.formData = this._formBuilder.group({
            id: [''],
            category_attribute_id: [''],
            serial: 'xxx',
            pr_no: [''],
            name: [''],
            detail: [''],
            tank_no: [''],
            engine_no: [''],
            license_plate: [''],
            sale_price: [0],
            cost: [0],
            type: [''],
            year: [''],
            supplier_id: [''],
            brand_id: [''],
            brand_model_id: [''],
            cc_id: [''],
            color_id: [''],
            image: [''],
            images: [''],
            companie_id: [''],
            area_id: [''],
            mile: [''],
            qty: [0]
        });
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    async ngOnInit(): Promise<void> {

        if (this.Id) {
            this._Service.getProductAttribute(this.Id).subscribe((resp) => {
                this.itemData = resp.data;
                this.formData.patchValue({
                    ...this.itemData,
                    category_attribute_id: Number(this.itemData.category_attribute_id),
                })
            });
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


    /**
     * Get the form field helpers as string
     */
    getFormFieldHelpersAsString(): string {
        return this.formFieldHelpers.join(' ');
    }



    onSelect(event: any) {
        this.files.push(...event.addedFiles);
        // Trigger Image Preview
        setTimeout(() => {
            this._changeDetectorRef.detectChanges();
        }, 150);
    }

    onSelect1(event: any) {
        this.files1.push(...event.addedFiles);
        // Trigger Image Preview
        setTimeout(() => {
            this._changeDetectorRef.detectChanges();
        }, 150);
    }

    onSelect2(event: any) {
        this.files2.push(...event.addedFiles);
        // Trigger Image Preview
        setTimeout(() => {
            this._changeDetectorRef.detectChanges();
        }, 150);
    }

    onRemove(event: any) {
        this.files.splice(this.files.indexOf(event), 1);
    }

    onRemove1(event: any) {
        this.files1.splice(this.files1.indexOf(event), 1);
    }

    onRemove2(event: any) {
        this.files2.splice(this.files2.indexOf(event), 1);
    }


    New(): void {
        // Function to prepare formData
        if (this.formData.invalid) {
            this.formData.markAllAsTouched();
            return;
        }

        const prepareFormData = (): FormData => {
            const formData = new FormData();
            Object.entries(this.formData.value).forEach(([key, value]: any[]) => {
                formData.append(key, value);
            });

            // Append images
            this.files.forEach((file) => {
                formData.append('image', file);
            });

            // Append additional images
            this.files1.forEach((file) => {
                formData.append('image', file);
            });

            // Append videos
            this.files2.forEach((file) => {
                formData.append('video', file);
            });

            return formData;
        };

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
                    const formData = prepareFormData();
                    this._Service.update(formData).subscribe({
                        next: (resp: any) => {
                            this._router.navigate(['admin/product-attribute/list']);
                            this._toastr.success('Saved!');
                        },
                        error: (err: any) => {
                            this.formData.enable();
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
                    const formData = prepareFormData();
                    this._Service.create(formData).subscribe({
                        next: (resp: any) => {
                            this._router.navigate(['admin/product-attribute/list']);
                            this._toastr.success('Created Successfully!');
                        },
                        error: (err: any) => {
                            this.formData.enable();
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


    backTo() {
        this._router.navigate(['admin/product-attribute/list'])
    }

    getPath(data: any) {
        const imageUrl = environment.baseURL + '/' + data
        return imageUrl
    }

    // รูป fallback ที่จะแสดงถ้าโหลดรูปจริงไม่สำเร็จ
    fallbackImage = 'assets/images/no_image.png';
    
    onImageError(event: Event): void {
        const imgElement = event.target as HTMLImageElement;
        imgElement.src = this.fallbackImage;
    }

}
