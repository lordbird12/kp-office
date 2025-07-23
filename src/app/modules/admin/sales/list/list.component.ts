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
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
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
import { PageService } from '../page.service';
import { EditDialogComponent } from '../edit-dialog/edit-dialog.component';
import { DataTableDirective, DataTablesModule } from 'angular-datatables';
import { Router, RouterModule } from '@angular/router';
import { PictureComponent } from '../../picture/picture.component';
import { FormReportComponent } from '../../product/form-report/form-report.component';
import { MatTabsModule } from '@angular/material/tabs';
import { MatMenuModule } from '@angular/material/menu';

@Component({
    selector: 'list-sales',
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
        MatTabsModule,
        RouterModule,
        MatMenuModule
    ],
})
export class ListComponent implements OnInit, AfterViewInit {
    @ViewChild(DataTableDirective) dtElement!: DataTableDirective;
    isLoading: boolean = false;
    dtOptions: DataTables.Settings = {};
    positions: any[];
    // public dataRow: any[];
    dataRow: any[] = [];

    selectedTabIndex: number = 0;
    statusTabs = [
        { label: 'ทั้งหมด', value: '' },
        { label: 'รอรับมัดจำ', value: 'pending' },
        { label: 'รับมัดจำแล้ว', value: 'deposit_received' },
        { label: 'รอผลไฟแนนซ์', value: 'waiting_for_finance' },
        { label: 'ไฟแนนซ์อนุมัติผล', value: 'finance_approved' },
        { label: 'รอรับรถ', value: 'waiting_for_delivery' },
        { label: 'ส่งมอบเรียบร้อย', value: 'completed' },
        { label: 'ยกเลิกการขาย', value: 'cancelled' },
    ];
    @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
    constructor(
        private dialog: MatDialog,
        private _changeDetectorRef: ChangeDetectorRef,
        private _service: PageService,
        private _router: Router
    ) { }

    ngOnInit() {
        this.loadTable();

    }

    ngAfterViewInit(): void {
        this._changeDetectorRef.detectChanges();
    }

    // เพิ่มเมธอด editElement(element) และ deleteElement(element)
    editElement(element: any) {
        this._router.navigate(['admin/sales/edit/' + element.id]);
    }
    addElement() {
        this._router.navigate(['admin/sales/form']);
    }

    rerender(): void {
        this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
            dtInstance.ajax.reload();
        });
    }

    onTabChange(event: any): void {
        this.selectedTabIndex = event.index;
        this.rerender();
    }

    pages = { current_page: 1, last_page: 1, per_page: 10, begin: 0 };
    loadTable(): void {
        const that = this;
        this.dtOptions = {
            pagingType: 'full_numbers',
            pageLength: 25,
            serverSide: true,
            processing: true,
            order: [[0, 'DESC']],
            language: {
                url: 'https://cdn.datatables.net/plug-ins/1.11.3/i18n/th.json',
            },
            ajax: (dataTablesParameters: any, callback) => {
                const selectedStatus = this.statusTabs[this.selectedTabIndex].value;
                dataTablesParameters.status = selectedStatus;
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
                { data: 'code', orderable: false },
                { data: 'date', orderable: false },
                { data: 'client', orderable: false },
                { data: 'total_price', orderable: false },
                { data: 'create_by', orderable: false },
                { data: 'created_at', orderable: false },
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

    downloadReport(item: any) {
        const dialogRef = this.dialog.open(FormReportComponent, {
            width: '700px', // กำหนดความกว้างของ Dialog
            height: '700px',
            data: item

        });

        dialogRef.afterClosed().subscribe((result) => {
            if (result) {
                //    console.log(result,'result')
            }
        });
    }

       openStatusDialog(data: any): void {
            const dialogRef = this.dialog.open(FormDialogComponent, {
                width: '500px',
                maxHeight: '90vh',
                data: {
                    itemId: data.Id,
                    item: data
                },
            });
    
            dialogRef.afterClosed().subscribe((result) => {
                if (result) {
                    // Refresh job data after status update
                    this.rerender()
                }
            });
        }
}
