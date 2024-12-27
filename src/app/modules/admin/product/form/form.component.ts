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
import { MatRadioModule } from '@angular/material/radio';
import { PictureComponent } from '../picture/picture.component';
import { MatCheckboxChange, MatCheckboxModule } from '@angular/material/checkbox';
import { DropzoneModule } from 'ngx-dropzone-wrapper';
import { DROPZONE_CONFIG } from 'ngx-dropzone-wrapper';
import { DropzoneConfigInterface } from 'ngx-dropzone-wrapper';
const DEFAULT_DROPZONE_CONFIG: DropzoneConfigInterface = {
    // Change this to your upload POST address:
    url: 'https://httpbin.org/post',
    maxFilesize: 50,
    acceptedFiles: 'image/*'
};

@Component({
    selector: 'form-product',
    templateUrl: './form.component.html',
    styleUrls: ['./form.component.css'],
    encapsulation: ViewEncapsulation.None,
    standalone: true,
    imports: [
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
        MatCheckboxModule
    ],
    providers: [
        {
            provide: DROPZONE_CONFIG,
            useValue: DEFAULT_DROPZONE_CONFIG
        }
    ]
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
    subCategory: any = [];
    itemSupplier: any = [];

    itemBrand: any = [];
    itemBrandModel: any = [];
    itemCC: any = [];
    itemColor: any = [];

    formData: FormGroup;
    formData2: FormGroup;
    form: FormGroup;

    files: File[] = [];
    files1: File[] = [];
    files2: File[] = [];
    status: any[] = [
        {
            id: "0",
            name: 'ไม่มี VAT'
        },
        {
            id: "1",
            name: 'มี VAT'
        },
    ];
    warehouseData: any;
    companie: any;
    Id: any
    itemData: any
    images: any[] = []
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

    ) {

        this.form = this._formBuilder.group({
            file: null,
            file_name: null,
            path: ''
        })
        this.Id = this._activatedRoute.snapshot.paramMap.get('id');

        this.formData = this._formBuilder.group({
            id: null,
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
            companie_id: [''],
            area_id: [''],
            mile: [''],
            front_tire: [''],
            back_tire: [''],
            // sub_category_product_id: [1],
            vat_status: 0,
            province: '',
            video_url: '',
            file_name: '',
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
            front_tire: [''],
            back_tire: [''],
            image: [''],
            images: [''],
            // sub_category_product_id: '',
            vat_status: 0,
            province: '',
            video_url: '',
            file_name: '',
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
        // this.getSubCategories()
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
                if (item)
                    this.areas = item.areas;
                // console.log(this.itemData);
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
                        companie_id: +this.itemData?.companie_id,
                        color_id: +this.itemData.color_id,
                        image: [''],
                        images: [],
                    })

                    this.formData2.patchValue({
                        ...this.itemData,
                        image: [''],
                        images: [''],
                    })
                });

                if (this.itemData) {
                    this.itemData.images.forEach(element => {
                        let formValue = {
                            image: element.image,
                            selected: false
                        }
                        this.images.push(formValue)

                    });
                }

            })
        }

        if (this.companie.length > 0) {
            // Set the default value to the first item's id
            this.formData.get('companie_id')?.setValue(this.companie[0].id);
        }




    }
    selectedImages: any[] = []; // ตัวแปรสำหรับเก็บรายการที่เลือก

    onCheckboxChange(event: any, item: any): void {

        if (event.checked === true) {            // เพิ่ม item เข้าไปใน selectedImages ถ้ายังไม่มี
            if (!this.selectedImages.includes(item)) {
                this.selectedImages.push(item);
            }
        } else {
            // เอา item ออกจาก selectedImages
            this.selectedImages = this.selectedImages.filter(selectedItem => selectedItem !== item);
        }

        console.log('Selected Images:', this.selectedImages);
    }

    downloadSelectedImages(): void {
        // ตรวจสอบว่ามีภาพถูกเลือกหรือไม่
        if (this.selectedImages.length === 0) {
            console.warn('No images selected for download.');
            return;
        }

        // ทำการดาวน์โหลดไฟล์แต่ละไฟล์ที่ถูกเลือก
        this.selectedImages.forEach(image => {
            fetch(image.image) // image.url ควรเป็น URL ของไฟล์
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`Failed to fetch ${image.name}`);
                    }
                    return response.blob();
                })
                .then(blob => {
                    const url = window.URL.createObjectURL(blob);
                    const link = document.createElement('a');
                    link.href = url;
                    link.download = image.name; // ตั้งชื่อไฟล์ตามที่ต้องการ
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                    window.URL.revokeObjectURL(url);
                })
                .catch(err => console.error('Error downloading:', err));
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

    onSelect2(event: any, input: any, index: number) {
        if (input === 'addfile') {
            const file = event[0];
            const fileName = file.name;

            this.form.patchValue({
                file: file,
                file_name: fileName,
                path: 'files/asset/'
            });
            this.formData.patchValue({
                file_name: fileName
            })

            const formData = new FormData();
            Object.entries(this.form.value).forEach(
                ([key, value]: any[]) => {
                    formData.append(key, value);
                }
            );
            this._Service.image(formData).subscribe((resp: any) => {
                console.log(resp);

                // this.file1 = resp
                // console.log("ดู profiles ชื่อ บัตร", this.file1);
                this.formData.patchValue({
                    video_url: resp.path,
                });
                // console.log(this.addForm.value)
            });
        }
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
                formData.append('images[]', file);
            });

            // // Append videos
            // this.files2.forEach((file) => {
            //     formData.append('video', file);
            // });

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
                            this._router.navigate(['admin/product/list']);
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
                            this._router.navigate(['admin/product/list']);
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
        this._router.navigate(['admin/product/list'])
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

    downloadImage(image: any): void {
        console.log(image);

        const imageUrl = image; // URL หรือ Path ของรูปภาพ
        const fileName = 'downloaded-image.jpg'; // ชื่อไฟล์ที่ต้องการให้ดาวน์โหลด

        // ดึงไฟล์รูปภาพเป็น Blob
        fetch(imageUrl)
            .then(response => response.blob()) // แปลง response เป็น Blob
            .then(blob => {
                // สร้าง URL ชั่วคราวจาก Blob
                const url = window.URL.createObjectURL(blob);

                // สร้าง <a> element สำหรับดาวน์โหลด
                const link = document.createElement('a');
                link.href = url;
                link.download = fileName; // ชื่อไฟล์ที่จะบันทึก
                document.body.appendChild(link);

                // คลิก <a> element จำลองการดาวน์โหลด
                link.click();

                // ทำความสะอาด (Cleanup)
                document.body.removeChild(link);
                window.URL.revokeObjectURL(url);
            })
            .catch(err => console.error('Error downloading the image', err));
    }

    downloadVideo(image: any): void {
        const imageUrl = image; // URL หรือ Path ของรูปภาพ
        fetch(imageUrl)
            .then(response => response.blob()) // แปลงไฟล์วิดีโอเป็น Blob
            .then(blob => {
                const url = window.URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = 'downloaded-video.mp4'; // ชื่อไฟล์สำหรับดาวน์โหลด
                document.body.appendChild(link);
                link.click();

                // ทำความสะอาด URL และ DOM
                document.body.removeChild(link);
                window.URL.revokeObjectURL(url);
            })
            .catch(error => console.error('Error downloading video:', error));
    }

    public onUploadInit(args: any): void {
        console.log('onUploadInit:', args);
    }

    public onUploadError(args: any): void {
        console.log('onUploadError:', args);
    }

    public onUploadSuccess(args: any): void {
        console.log('onUploadSuccess:', args);
    }
}




