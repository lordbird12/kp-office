import { TextFieldModule } from '@angular/cdk/text-field';
import { NgClass } from '@angular/common';
import {
    AfterViewInit,
    ChangeDetectorRef,
    Component,
    ElementRef,
    OnDestroy,
    OnInit,
    ViewChild,
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
import { MatRadioModule } from '@angular/material/radio';
import { PictureComponent } from '../picture/picture.component';
import {
    MatCheckboxChange,
    MatCheckboxModule,
} from '@angular/material/checkbox';
import { DropzoneModule } from 'ngx-dropzone-wrapper';
import { DROPZONE_CONFIG } from 'ngx-dropzone-wrapper';
import { DropzoneConfigInterface } from 'ngx-dropzone-wrapper';
import { environment } from 'environments/environment.development';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { ToastrService } from 'ngx-toastr';
import { DateTime } from 'luxon';
import { MatCardModule } from '@angular/material/card';
import { PictureMultiComponent } from 'app/shared/picture-multi/picture-multi.component';

const DEFAULT_DROPZONE_CONFIG: DropzoneConfigInterface = {
    // Change this to your upload POST address:
    url: environment.baseURL + '/api/upload-image',
    maxFilesize: 50,
    acceptedFiles: 'image/*',
    addRemoveLinks: true, // Show remove links
    // headers: {
    //     'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content'),
    // },
    paramName: 'image', // Ensure the field name matches the backend validation
    init: function () {
        this.on('removedfile', function (file) {
            const storedArray = localStorage.getItem('upload_images');
            const usestoredArray = localStorage.getItem('use_upload_images');

            if (storedArray && usestoredArray) {
                const myArray: string[] = storedArray
                    ? JSON.parse(storedArray)
                    : [];
                const myArray1: string[] = usestoredArray
                    ? JSON.parse(usestoredArray)
                    : [];

                const index = myArray.indexOf(file.name);
                if (index > -1) {
                    myArray.splice(index, 1);
                    myArray1.splice(index, 1);
                }
                localStorage.setItem('upload_images', JSON.stringify(myArray));
                localStorage.setItem(
                    'use_upload_images',
                    JSON.stringify(myArray1)
                );
            }
            // const index = this.upload_images.indexOf(file);
            // if (index > -1) {
            //     this.upload_images.splice(index, 1);
            // }
            // console.log('images:', this.upload_images);
        });
    },
};

@Component({
    selector: 'form-product',
    templateUrl: './form.component.html',
    styleUrls: ['./form.component.css'],
    encapsulation: ViewEncapsulation.None,
    standalone: true,
    imports: [
        DragDropModule,
        DropzoneModule,
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
        MatRadioModule,
        MatCheckboxModule,
        MatCardModule
    ],
    providers: [
        {
            provide: DROPZONE_CONFIG,
            useValue: DEFAULT_DROPZONE_CONFIG,
        },
    ],
})
export class FormComponent implements OnInit, AfterViewInit, OnDestroy {

    vehicleImages: File[] = [];
    uploadStatuses: { [key: string]: 'queued' | 'uploading' | 'done' } = {};
    uploadProgress: { [key: string]: number } = {};


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
    subCategory: any = [];
    itemSupplier: any = [];

    itemBrand: any = [];
    itemBrandModel: any = [];
    itemCC: any = [];
    itemColor: any = [];

    formData: FormGroup;
    formData2: FormGroup;
    form: FormGroup;
    currentYear: any

    files: File[] = [];
    files1: File[] = [];
    files2: File[] = [];
    status: any[] = [
        {
            id: '0',
            name: 'ไม่มี VAT',
        },
        {
            id: '1',
            name: 'มี VAT',
        },
    ];
    existingImages = {
        first_images: [],
        repair_images: [],
        ready_images: [],
        after_sale_images: [],
    };

    images: any[] = [];

    warehouseData: any;
    companie: any;
    Id: any;
    itemData: any;
    upload_images: any[] = [];

    DEFAULT_DROPZONE_CONFIG: any;
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
        private _toastr: ToastrService,

    ) {
        this.form = this._formBuilder.group({
            file: null,
            file_name: null,
            path: '',
        });
        this.Id = this._activatedRoute.snapshot.paramMap.get('id');

        this.formData = this._formBuilder.group({
            id: null,

            pr_no: ['', Validators.required],
            supplier_id: ['', Validators.required],
            category_product_id: ['', Validators.required],
            name: [''],
            detail: [''],
            area_id: [''],
            brand_id: [''],
            brand_model_id: [''],
            cc_id: [''],
            color_id: [''],
            tank_no: [''],
            engine_no: [''],
            license_plate: [''],
            year: [''],
            cost: [''],
            sale_price: [''],
            type: [''],
            status: [''],
            companie_id: [''],
            tax_expire: [''],
            province: [''],

            other_cost: this._formBuilder.array([]),
            repair_images: this._formBuilder.array([]),
            ready_images: this._formBuilder.array([]),
            after_sale_images: this._formBuilder.array([]),
        });
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    async ngOnInit(): Promise<void> {
        let response = await lastValueFrom(
            forkJoin({
                category: this._Service.getCategories(),
                supplie: this._Service.getSuppliers(),
                brand: this._Service.getBrand(),
                companie: this._Service.getCompanie(),
                cc: this._Service.getCC(),
                color: this._Service.getColor(),
            })
        );
        this.item1Data = response.category.data;
        this.itemSupplier = response.supplie.data;
        this.itemBrand = response.brand.data;
        this.companie = response.companie.data;
        this.itemCC = response.cc.data;
        this.itemColor = response.color.data;

        if (this.Id) {
            this._Service.getById(this.Id).subscribe((resp: any) => {
                if (resp.data) {
                    // Load other costs if they exist
                    if (resp.data.other_cost && resp.data.other_cost.length) {
                        this.otherCosts = resp.data.other_cost;
                    }
                    this.images = resp.data.images
                    // Populate form data from API response
                    this.formData.patchValue({
                        id: Number(resp.data.id),
                        pr_no: resp.data.pr_no,
                        supplier_id: Number(resp.data.supplier_id),
                        category_product_id: Number(resp.data.category_product_id),
                        name: resp.data.name,
                        detail: resp.data.detail,
                        area_id: Number(resp.data.area_id),
                        brand_id: Number(resp.data.brand_id),
                        companie_id: Number(resp.data.companie_id),
                        cost: resp.data.cost,
                        sale_price: resp.data.sale_price,
                        type: resp.data.type,
                        status: resp.data.status,
                        tank_no: resp.data.tank_no,
                        engine_no: resp.data.engine_no,
                        license_plate: resp.data.license_plate,
                        year: resp.data.year,
                        tax_expire: resp.data.tax_expire
                            ? new Date(resp.data.tax_expire)
                            : null,
                        province: resp.data.province,
                    });

                    // Load company areas based on selected company
                    if (resp.data.companie_id) {
                        const company = this.companie.find(
                            (c) => c.id == resp.data.companie_id
                        );
                        if (company && company.areas) {
                            this.areas = company.areas;
                        }
                    }

                    // Load brand models if brand is selected
                    if (resp.data.brand_id) {
                        this.getBrandModel(resp.data.brand_id);

                        // We need to wait for brand models to load before setting brand_model_id
                        setTimeout(() => {
                            this.formData.patchValue({
                                brand_model_id: Number(resp.data.brand_model_id),
                            });

                            // Load CC and colors for this model
                            if (resp.data.brand_model_id) {
                                this.getccAndcolor(resp.data.brand_model_id);

                                // Set CC and color after filters are applied
                                setTimeout(() => {
                                    this.formData.patchValue({
                                        cc_id: Number(resp.data.cc_id),
                                        color_id: Number(resp.data.color_id),
                                    });
                                }, 300);
                            }
                        }, 300);
                    }
                }
            });
        }

        if (this.companie.length > 0) {
            // Set the default value to the first item's id
            this.formData.get('companie_id')?.setValue(this.companie[0].id);
        }
    }
    selectedImages: any[] = []; // ตัวแปรสำหรับเก็บรายการที่เลือก

    downloadSelectedImages(): void {
        // ตรวจสอบว่ามีภาพถูกเลือกหรือไม่
        if (this.selectedImages.length === 0) {
            console.warn('No images selected for download.');
            return;
        }

        // ทำการดาวน์โหลดไฟล์แต่ละไฟล์ที่ถูกเลือก
        this.selectedImages.forEach((image) => {
            fetch(image.image) // image.url ควรเป็น URL ของไฟล์
                .then((response) => {
                    if (!response.ok) {
                        throw new Error(`Failed to fetch ${image.name}`);
                    }
                    return response.blob();
                })
                .then((blob) => {
                    const url = window.URL.createObjectURL(blob);
                    const link = document.createElement('a');
                    link.href = url;
                    link.download = image.name; // ตั้งชื่อไฟล์ตามที่ต้องการ
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                    window.URL.revokeObjectURL(url);
                })
                .catch((err) => console.error('Error downloading:', err));
        });
    }
    allSelected: boolean = false;
    toggleAllSelection(event: MatCheckboxChange): void {
        this.allSelected = event.checked;

        // เคลียร์ selectedImages ก่อน
        this.selectedImages = [];

        if (this.allSelected) {
            // ถ้าเลือกทั้งหมด ให้ push item เข้าไปใน selectedImages
            this.images.forEach((item) => {
                item.selected = true; // กำหนดสถานะ checkbox
                this.selectedImages.push(item);
            });
        } else {
            // ถ้ายกเลิกเลือกทั้งหมด
            this.images.forEach((item) => (item.selected = false));
        }

        console.log('Selected Images:', this.selectedImages);
        this._changeDetectorRef.markForCheck();
    }
    /**
     * After view init
     */
    ngAfterViewInit() { }

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
    getSubCategories(): void {
        this._Service.getSubCategory().subscribe((resp) => {
            this.subCategory = resp.data;
            console.log();
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
    getccAndcolor(data: any): void {
        console.log(data);

        console.log(this.itemCC, 'cc');
        this.itemCC = this.itemCC.filter(
            (item: any) => item.brand_model_id == data
        );
        console.log(this.itemCC, 'ccb');

        console.log(this.itemColor, 'color');
        this.itemColor = this.itemColor.filter(
            (item: any) => item.brand_model_id == data
        );
        console.log(this.itemColor, 'colorb');
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
        const item = this.companie.find((item) => item.id === event.value);
        this.areas = item.areas;
    }

    onSelect(event: any) {
        this.files.push(...event.addedFiles);
        // Trigger Image Preview
        setTimeout(() => {
            this._changeDetectorRef.detectChanges();
        }, 150);
    }

    onRemove(event: any) {
        this.files.splice(this.files.indexOf(event), 1);
    }

    async onSubmit(): Promise<void> {
        if (this.formData.invalid) {
            this.formData.markAllAsTouched();
            return;
        }
        const taxExpireRaw = this.formData.get('tax_expire')?.value;

        this.formData.patchValue({
            tax_expire: taxExpireRaw
                ? DateTime.fromISO(
                    typeof taxExpireRaw === 'string'
                        ? taxExpireRaw
                        : new Date(taxExpireRaw).toISOString()
                ).toFormat('yyyy-MM-dd')
                : null,
        });

        const uploadedImages = [];
        if (this.vehicleImages && this.vehicleImages.length > 0) {
            // Use Promise.all to wait for all image uploads to complete
            const uploadPromises = this.vehicleImages.map((file) => {
                const formData = new FormData();
                formData.append('image', file);
                formData.append('path', 'images/asset/');
                return this._Service
                    .upload_images(formData)
                    .toPromise();
            });

            const responses = await Promise.all(uploadPromises);

            // Process responses
            responses.forEach((response: any) => {
                if (response.status && response.data) {
                    uploadedImages.push(response.data);
                }
            });
        }
        const productData = {
            id: Number(this.Id),
            pr_no: this.formData.get('pr_no')?.value,
            supplier_id: this.formData.get('supplier_id')?.value,
            category_product_id: this.formData.get('category_product_id')
                ?.value,
            name: this.formData.get('name')?.value,
            detail: this.formData.get('detail')?.value,
            area_id: this.formData.get('area_id')?.value,
            brand_id: this.formData.get('brand_id')?.value,
            brand_model_id: this.formData.get('brand_model_id')?.value,
            cc_id: this.formData.get('cc_id')?.value,
            color_id: this.formData.get('color_id')?.value,
            tank_no: this.formData.get('tank_no')?.value,
            engine_no: this.formData.get('engine_no')?.value,
            license_plate: this.formData.get('license_plate')?.value,
            year: this.formData.get('year')?.value,
            cost: this.formData.get('cost')?.value,
            sale_price: this.formData.get('sale_price')?.value,
            type: this.formData.get('type')?.value,
            status: this.formData.get('status')?.value,
            companie_id: this.formData.get('companie_id')?.value,
            tax_expire: this.formData.get('tax_expire')?.value,
            other_cost: this.otherCosts,
            first_images: uploadedImages,
            repair_images: [],
            ready_images: [],
            after_sale_images: [],
        };

        const formData = new FormData();

        // Process first_images
        // this.firstImages.forEach((file, index) => {
        //     formData.append(`first_images`, file);
        // });

        // Process repair_images
        this.repairImages.forEach((file, index) => {
            formData.append(`repair_images`, file);
        });

        // Process ready_images
        this.readyImages.forEach((file, index) => {
            formData.append(`ready_images`, file);
        });

        // Process after_sale_images
        this.afterSaleImages.forEach((file, index) => {
            formData.append(`after_sale_images`, file);
        });

        // Temporary image handlers (mock implementation)
        // productData.first_images = this.firstImages.map((file) => file.name);
        productData.repair_images = this.repairImages.map((file) => file.name);
        productData.ready_images = this.readyImages.map((file) => file.name);
        productData.after_sale_images = this.afterSaleImages.map(
            (file) => file.name
        );

        if (this.Id) {
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
                if (result === 'confirmed') {
                    // const formData = prepareFormData();
                    this._Service.update(productData).subscribe({
                        next: (resp: any) => {
                            if (localStorage.getItem('upload_images')) {
                                localStorage.removeItem('upload_images');
                            }

                            if (localStorage.getItem('use_upload_images')) {
                                localStorage.removeItem('use_upload_images');
                            }
                            this._router.navigate(['admin/product/list']);
                            this._toastr.success('Saved!');
                        },
                        error: (err: any) => {
                            this.formData.enable();
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
        } else {
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
                    // const formData = prepareFormData();
                    this._Service.create(productData).subscribe({
                        next: (resp: any) => {
                            if (localStorage.getItem('upload_images')) {
                                localStorage.removeItem('upload_images');
                            }

                            if (localStorage.getItem('use_upload_images')) {
                                localStorage.removeItem('use_upload_images');
                            }
                            this._router.navigate(['admin/product/list']);
                            this._toastr.success('Created Successfully!');
                        },
                        error: (err: any) => {
                            this.formData.enable();
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
        }
    }

    backTo() {
        this._router.navigate(['admin/product/list']);
    }

    showPicture(imgObject: any): void {
        this._matDialog
            .open(PictureComponent, {
                autoFocus: false,
                data: {
                    imgSelected: imgObject,
                },
            })
            .afterClosed()
            .subscribe(() => {
                // Go up twice because card routes are setup like this; "card/CARD_ID"
                // this._router.navigate(['./../..'], {relativeTo: this._activatedRoute});
            });
    }

    // Other Cost handling
    otherCosts: Array<{ name: string; cost: number }> = [];
    newCostItem: { name: string; cost: number } = { name: '', cost: 0 };

    // Images handling
    firstImages: File[] = [];
    repairImages: File[] = [];
    readyImages: File[] = [];
    afterSaleImages: File[] = [];

    // Add these methods to your FormComponent class

    // For Other Cost
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

    // For First Images
    onSelectFirstImages(event: { addedFiles: any }): void {
        this.firstImages.push(...event.addedFiles);
        this._changeDetectorRef.detectChanges();
        setTimeout(() => {
            this._changeDetectorRef.markForCheck();
        }, 150);
    }

    onRemoveFirstImage(event: any): void {
        this.firstImages.splice(this.firstImages.indexOf(event), 1);
        this._changeDetectorRef.detectChanges();
    }

    // For Repair Images
    onSelectRepairImages(event: { addedFiles: any }): void {
        this.repairImages.push(...event.addedFiles);
        this._changeDetectorRef.detectChanges();
    }

    onRemoveRepairImage(event: any): void {
        this.repairImages.splice(this.repairImages.indexOf(event), 1);
        this._changeDetectorRef.detectChanges();
    }

    // For Ready Images
    onSelectReadyImages(event: { addedFiles: any }): void {
        this.readyImages.push(...event.addedFiles);
        this._changeDetectorRef.detectChanges();
    }

    onRemoveReadyImage(event: any): void {
        this.readyImages.splice(this.readyImages.indexOf(event), 1);
        this._changeDetectorRef.detectChanges();
    }

    // For After Sale Images
    onSelectAfterSaleImages(event: { addedFiles: any }): void {
        this.afterSaleImages.push(...event.addedFiles);
        this._changeDetectorRef.detectChanges();
    }

    onRemoveAfterSaleImage(event: any): void {
        this.afterSaleImages.splice(this.afterSaleImages.indexOf(event), 1);
        this._changeDetectorRef.detectChanges();
    }


    onFileSelect(event: Event): void {
        const input = event.target as HTMLInputElement;
        if (input.files) {
            const files = Array.from(input.files).filter(f => f.size <= 5242880); // 5MB max

            for (const file of files) {
                this.vehicleImages.push(file);
                this.uploadStatuses[file.name] = 'queued';
                this.uploadProgress[file.name] = 0;
                this.uploadFile(file);
            }

            input.value = ''; // reset
        }
    }

    uploadFile(file: File): void {
        this.uploadStatuses[file.name] = 'uploading';
        this.uploadProgress[file.name] = 0;

        // Simulate upload progress (0 to 100%)
        const interval = setInterval(() => {
            this.uploadProgress[file.name] += 10;

            if (this.uploadProgress[file.name] >= 100) {
                this.uploadProgress[file.name] = 100;
                this.uploadStatuses[file.name] = 'done';
                clearInterval(interval);
                this._changeDetectorRef.markForCheck()
            }
        }, 500); // 5s total (10% every 500ms)
    }

    removeFile(index: number): void {
        const file = this.vehicleImages[index];
        const key = file.name;

        URL.revokeObjectURL(this.getImagePreview(file));
        this.vehicleImages.splice(index, 1);
        delete this.uploadStatuses[key];
        delete this.uploadProgress[key];
    }

    reorderMetadata(name: string, status: string, progress: number): void {
        const newUploadStatuses: { [key: string]: any } = {};
        const newUploadProgress: { [key: string]: number } = {};

        newUploadStatuses[name] = status;
        newUploadProgress[name] = progress;

        for (const file of this.vehicleImages.slice(1)) {
            newUploadStatuses[file.name] = this.uploadStatuses[file.name];
            newUploadProgress[file.name] = this.uploadProgress[file.name];
        }

        this.uploadStatuses = newUploadStatuses;
        this.uploadProgress = newUploadProgress;
    }

    getImagePreview(file: File): string {
        return URL.createObjectURL(file);
    }

    showMultiPicture(images: any[], i): void {
        const imgList = images.map(item => item.image);
        this._matDialog.open(PictureMultiComponent, {
            data: {
                images: imgList,
                selectedIndex: i
            },
            width: '90vw',
            height: '90vh',
        });
    }
}
