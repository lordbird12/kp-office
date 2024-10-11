import { TextFieldModule } from '@angular/cdk/text-field';
import { CommonModule, NgClass } from '@angular/common';
import {
    AfterViewInit,
    ChangeDetectorRef,
    Component,
    OnInit,
    ViewChild,
    ViewEncapsulation,
} from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatChipsModule } from '@angular/material/chips';
import { MatOptionModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { FormDialogComponent } from '../form-dialog/form-dialog.component';
import { Service } from '../page.service';
import { EditDialogComponent } from '../edit-dialog/edit-dialog.component';
import { DataTableDirective, DataTablesModule } from 'angular-datatables';
import { Router } from '@angular/router';
import { PictureComponent } from '../../picture/picture.component';
import { FormReportComponent } from '../form-report/form-report.component';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { MatCheckboxModule } from '@angular/material/checkbox';

@Component({
    selector: 'employee-list',
    templateUrl: './list.component.html',
    encapsulation: ViewEncapsulation.None,
    standalone: true,
    imports: [
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
        MatPaginatorModule,
        MatTableModule,
        DataTablesModule,
        MatCheckboxModule
    ],
})
export class ListComponent implements OnInit, AfterViewInit {
    @ViewChild(DataTableDirective)
    dtElement!: DataTableDirective;
    isLoading: boolean = false;
    dtOptions: DataTables.Settings = {};
    positions: any[];
    form: FormGroup;
    formFieldHelpers: string[] = ['fuse-mat-dense'];
    itemSupplier: any
    item1Data: any
    itemBrand: any;
    companie: any;
    flashMessage: 'success' | 'error' | null = null;
    dataRow: any[] = [];
    @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
    constructor(
        private dialog: MatDialog,
        private _changeDetectorRef: ChangeDetectorRef,
        private _service: Service,
        private _router: Router,
        private _fb: FormBuilder,
        private _fuseConfirmationService: FuseConfirmationService,

    ) {
        this.form = this._fb.group({
            category_product_id: '',
            supplier_id: '',
            brand_id: '',
            type: '',
            status: '',
            companie_id: '',
            area_id: '',
        })
    }

    getSuppliers(): void {
        this._service.getSuppliers().subscribe((resp) => {
            this.itemSupplier = resp.data;
        });
    }

    getCategories(): void {
        this._service.getCategories().subscribe((resp) => {
            this.item1Data = resp.data;
        });
    }

    getBrand(): void {
        this._service.getBrand().subscribe((resp) => {
            this.itemBrand = resp.data;
        });

    }

    getCompanie(): void {
        this._service.getCompanie().subscribe((resp) => {
            this.companie = resp.data;
        });
    }

    areas: any[] = [];
    somethingCompanie(event: any): void {
        const item = this.companie.find(item => item.id === event.value);
        this.areas = item.areas
    }

    ngOnInit() {
        this.loadTable();
        this.getCategories();
        this.getBrand();
        this.getSuppliers();
        this.getCompanie();
    }

    ngAfterViewInit(): void {
        this._changeDetectorRef.detectChanges();
    }

    ClearForm() {
        this.form.reset()
    }

    search() {
        this.rerender()
    }

    rerender(): void {
        this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
            dtInstance.ajax.reload();
        });
    }

    // เพิ่มเมธอด editElement(element) และ deleteElement(element)
    editElement(element: any) {
        this._router.navigate([
            'admin/product/edit/' + element
        ])
    }
    viewElement(element: any) {
        const dialogRef = this.dialog.open(EditDialogComponent, {
            width: '700px', // กำหนดความกว้างของ Dialog
            data: element
        });

        dialogRef.afterClosed().subscribe((result) => {
            if (result) {
                //    console.log(result,'result')
            }
        });
    }
    downloadReport() {
        const dialogRef = this.dialog.open(FormReportComponent, {
            width: '700px', // กำหนดความกว้างของ Dialog
            maxHeight: '900px'

        });

        dialogRef.afterClosed().subscribe((result) => {
            if (result) {
                //    console.log(result,'result')
            }
        });
    }
    addElement() {
        this._router.navigate(['admin/product/form']);
    }

    pages = { current_page: 1, last_page: 1, per_page: 10, begin: 0 };
    loadTable(): void {
        const that = this;
        this.dtOptions = {
            pagingType: 'full_numbers',
            pageLength: 25,
            serverSide: true,
            processing: true,
            language: {
                url: 'https://cdn.datatables.net/plug-ins/1.11.3/i18n/th.json',
            },
            order: [[0, 'desc']], // Default ordering by 'created_at' in descending order
            ajax: (dataTablesParameters: any, callback) => {
                dataTablesParameters.type = this.form.value.type;
                dataTablesParameters.status = this.form.value.status;
                dataTablesParameters.category_product_id = this.form.value.category_product_id;
                dataTablesParameters.supplier_id = this.form.value.supplier_id;
                dataTablesParameters.brand_id = this.form.value.brand_id;
                dataTablesParameters.companie_id = this.form.value.companie_id;
                dataTablesParameters.area_id = this.form.value.area_id;
                that._service
                    .getPage(dataTablesParameters)
                    .subscribe((resp: any) => {
                        this.dataRow = resp.data;
                        this.pages.current_page = resp.current_page;
                        this.pages.last_page = resp.last_page;
                        this.pages.per_page = resp.per_page;
                        if (resp.current_page > 1) {
                            this.pages.begin =
                                resp.per_page * resp.current_page - 1;
                        } else {
                            this.pages.begin = 0;
                        }

                        callback({
                            recordsTotal: resp.total,
                            recordsFiltered: resp.total,
                            data: [],
                        });
                        this._changeDetectorRef.markForCheck();
                    });
            },
            columns: [
                { data: 'action', orderable: false },
                { data: 'No' },
                { data: 'name' },
                { data: 'create_by' },
                { data: 'created_at' },
            ],
        };
    }

    deleteElement() {
        // เขียนโค้ดสำหรับการลบออกองคุณ
    }

    showPicture(imgObject: any): void {
        this.dialog
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

    get someOneChecked() {
        return this.dataRow?.filter((e) => e.checked);
    }

    get someCheck() {
        if (this.someOneChecked?.length == 0) {
            return false;
        }

        return this.someOneChecked?.length > 0 && !this.checkAll;
    }

    get checkAll() {
        return this.dataRow?.every((e) => e.checked);
    }

    setAll(checked: boolean) {
        this.dataRow?.forEach((e) => (e.checked = checked));
    }

    confirmDelete() {
        const confirmation = this._fuseConfirmationService.open({
            title: `ยืนยันการลบ ${this.someOneChecked.length} รายการ`,
            message: 'รายชื่อพนักงานที่เลือกจะถูกลบออกจากระบบถาวร',
            icon: {
                show: true,
                name: 'heroicons_asha:delete2',
                color: 'error',
            },
            actions: {
                confirm: {
                    label: 'ลบ',
                },
                cancel: {
                    label: 'ยกเลิก',
                },
            },
        });

        confirmation.afterClosed().subscribe((result) => {
            if (result == 'confirmed') {
                const data_array = [];
                this.dataRow.forEach((element) => {
                    if (element.checked) {
                        const data = {
                            user_id: element.id,
                            check: element.checked,
                        };
                        data_array.push(data);
                    }
                });


                // this._service.delete_all(data_array).subscribe({
                //     next: (resp: any) => {
                //         this.showFlashMessage('success');
                //         this.rerender();
                //     },
                //     error: (err: any) => {
                //         this._fuseConfirmationService.open({
                //             title: 'กรุณาระบุข้อมูล',
                //             message: err.error.message,
                //             icon: {
                //                 show: true,
                //                 name: 'heroicons_outline:exclamation',
                //                 color: 'warning',
                //             },
                //             actions: {
                //                 confirm: {
                //                     show: false,
                //                     label: 'ยืนยัน',
                //                     color: 'primary',
                //                 },
                //                 cancel: {
                //                     show: false,
                //                     label: 'ยกเลิก',
                //                 },
                //             },
                //             dismissible: true,
                //         });
                //     },
                // });
            }
        });
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

    cancelCheck() {
        this.setAll(false);
    }
}
