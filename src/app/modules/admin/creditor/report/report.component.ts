

import { TextFieldModule } from '@angular/cdk/text-field';
import { CommonModule, NgClass } from '@angular/common';
import { AfterViewInit, ChangeDetectorRef, Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
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
import { PageService } from '../page.service';
import { DataTableDirective, DataTablesModule } from 'angular-datatables';
import { Router } from '@angular/router';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { MatTabsModule } from '@angular/material/tabs';
import { DateTime } from 'luxon';
import { MatMenuModule } from '@angular/material/menu';



@Component({
    selector: 'creditor-report',
    templateUrl: './report.component.html',
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
        MatTabsModule,
        MatMenuModule
    ],
})



export class ReportComponent implements OnInit, AfterViewInit {
    selectedTabIndex = 0;
    formFieldHelpers: string[] = ['fuse-mat-dense'];
    isLoading: boolean = false;
    dtOptions: DataTables.Settings = {};
    positions: any[];
    dataRow: any[] = [];


    creditorFilterStart?: Date;
    creditorFilterEnd?: Date;
    debtorFilterStart?: Date;
    debtorFilterEnd?: Date;
    form: FormGroup

    @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
    @ViewChild(DataTableDirective)
    dtElement!: DataTableDirective;
    constructor(
        private dialog: MatDialog,
        private _changeDetectorRef: ChangeDetectorRef,
        private _service: PageService,
        private _router: Router,
        private _fuseConfirmationService: FuseConfirmationService,
        private _fb: FormBuilder
    ) {

        this.form = this._fb.group({
            status: [''],
            partner_name: [''],
            start_date: [''],
            end_date: [''],
            partner_type: [''],
        });
    }

    ngOnInit() {
        // this.loadTable();
    }

    ngAfterViewInit(): void {
        this._changeDetectorRef.detectChanges();
    }

    pages = { current_page: 1, last_page: 1, per_page: 10, begin: 0 };
    // loadTable(): void {
    //     const that = this;
    //     this.dtOptions = {
    //         pagingType: "full_numbers",
    //         pageLength: 25,
    //         serverSide: true,
    //         processing: true,
    //         language: {
    //             url: "https://cdn.datatables.net/plug-ins/1.11.3/i18n/th.json",
    //         },
    //         ajax: (dataTablesParameters: any, callback) => {
    //             const formValue = this.form.value;

    //             dataTablesParameters.status = formValue.status ?? null;
    //             dataTablesParameters.partner_name = formValue.partner_name ?? null;
    //             // format วันที่เป็น yyyy-MM-dd
    //             const formatDate = (d: any) =>
    //                 d ? DateTime.fromJSDate(new Date(d)).toFormat('yyyy-MM-dd') : null;

    //             dataTablesParameters.start_date = formatDate(formValue.start_date);
    //             dataTablesParameters.end_date = formatDate(formValue.end_date);

    //             // 🔻 กำหนด partner_type ตาม tab ปัจจุบัน
    //             dataTablesParameters.partner_type = this.currentPartnerType;
    //             that._service.getPage(dataTablesParameters).subscribe((resp: any) => {
    //                 this.dataRow = resp.data;
    //                 this.pages.current_page = resp.current_page;
    //                 this.pages.last_page = resp.last_page;
    //                 this.pages.per_page = resp.per_page;
    //                 if (resp.current_page > 1) {
    //                     this.pages.begin =
    //                         resp.per_page * resp.current_page - 1;
    //                 } else {
    //                     this.pages.begin = 0;
    //                 }

    //                 callback({
    //                     recordsTotal: resp.total,
    //                     recordsFiltered: resp.total,
    //                     data: [],
    //                 });
    //                 this._changeDetectorRef.markForCheck();
    //             });
    //         },
    //         columns: [
    //             { data: 'action', orderable: false },
    //             { data: 'No' },
    //             { data: 'name' },
    //             { data: 'create_by' },
    //             { data: 'created_at' },

    //         ],
    //     };
    // }
    loadTableNormal(): void {
        const formValue = this.form.value;

        const params: any = {
            draw: 1, // กำหนดเป็นค่า static หรือเพิ่มตัวแปร counter ถ้าใช้จริง
            start: 0, // เริ่มจากรายการที่ 0 (pagination)
            length: 1000, // จำนวนรายการต่อหน้า
            order: [
                {
                    column: 0,
                    dir: 'asc',
                },
            ],
            search: {
                value: '',
                regex: false,
            },
            status: formValue.status ?? null,
            partner_name: formValue.partner_name ?? null,
            start_date: formValue.start_date
                ? DateTime.fromJSDate(new Date(formValue.start_date)).toFormat('yyyy-MM-dd')
                : null,
            end_date: formValue.end_date
                ? DateTime.fromJSDate(new Date(formValue.end_date)).toFormat('yyyy-MM-dd')
                : null,
            partner_type: formValue.partner_type ?? null,
        };

        this._service.getPage(params).subscribe((resp: any) => {
            const selectedStatus = this.form.value.status; // null, 'pending', or 'paid'

            // กรองข้อมูล
            this.dataRow = resp.data.filter(item => {
                const isPartnerTypeValid = item.partner_type === 'debtor' || item.partner_type === 'creditor';

                // ถ้าไม่ได้เลือก status (ค่าเป็น null) ก็ไม่ต้องกรอง status
                const isStatusValid = selectedStatus ? item.status === selectedStatus : true;

                return isPartnerTypeValid && isStatusValid;
            });
            this.pages.current_page = resp.current_page;
            this.pages.last_page = resp.last_page;
            this.pages.per_page = resp.per_page;
            this.pages.begin =
                resp.current_page > 1 ? resp.per_page * (resp.current_page - 1) : 0;

            this._changeDetectorRef.markForCheck();
        });
    }


    deleteElement(): void {
        const dialogRef = this._fuseConfirmationService.open({
            "title": "ลบข้อมูล",
            "message": "คุณต้องการลบข้อมูลใช่หรือไม่ ?",
            "icon": {
                "show": true,
                "name": "heroicons_outline:exclamation-triangle",
                "color": "warn"
            },
            "actions": {
                "confirm": {
                    "show": true,
                    "label": "ตกลง",
                    "color": "warn"
                },
                "cancel": {
                    "show": true,
                    "label": "ยกเลิก"
                }
            },
            "dismissible": true
        });
        // Subscribe to afterClosed from the dialog reference
        dialogRef.afterClosed().subscribe((result) => {
            if (result === 'confirmed') {
                console.log('delete complete')
            } else {
                console.log('cancel');

            }
        });

    }
    addElement() {
        this._router.navigate(['/admin/creditor/form'])
    }
    editElement(data: any) {
        this._router.navigate(['/admin/creditor/edit/' + data.id])
    }



    onTabChanged(index: number) {
        this.selectedTabIndex = index;
        this.rerender(); // โหลดข้อมูลใหม่
    }

    get currentPartnerType(): 'creditor' | 'debtor' {
        return this.selectedTabIndex === 0 ? 'creditor' : 'debtor';
    }

    rerender(): void {
        this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
            dtInstance.ajax.reload();
        });
    }


    ClearForm() {
        this.form.reset()
        this.rerender()
    }

    getTotalAmount(): number {
        return this.dataRow.reduce((sum, item) => {
            const amount = item.total_amount ?? item.amount ?? 0;
            return sum + Number(amount);
        }, 0);
    }

    countPendingBills(): number {
        return this.dataRow.filter(item => item.status !== 'paid').length;
    }

    getTotalPendingAmount(): number {
        return this.dataRow
            .filter(item => item.status !== 'paid')
            .reduce((sum, item) => sum + (Number(item.total_amount ?? item.amount) || 0), 0);
    }

    getNetResult(): number {
        const inAmount = this.dataRow
            .filter(i => i.direction === 'in')
            .reduce((sum, i) => sum + (Number(i.total_amount ?? i.amount) || 0), 0);
        const outAmount = this.dataRow
            .filter(i => i.direction === 'out')
            .reduce((sum, i) => sum + (Number(i.total_amount ?? i.amount) || 0), 0);
        return inAmount - outAmount;
    }

}


