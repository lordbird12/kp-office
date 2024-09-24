

import { TextFieldModule } from '@angular/cdk/text-field';
import { CommonModule, NgClass } from '@angular/common';
import { AfterViewInit, ChangeDetectorRef, Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
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
import { PageService } from '../page.service';
import { DataTableDirective, DataTablesModule } from 'angular-datatables';
import { Router } from '@angular/router';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { PictureComponent } from '../../picture/picture.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ToastrService } from 'ngx-toastr';
import { forkJoin } from 'rxjs';


@Component({
    selector: 'list',
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
    dataRow: any[] = [];
    @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
    constructor(
        private dialog: MatDialog,
        private _changeDetectorRef: ChangeDetectorRef,
        private _service: PageService,
        private _router: Router,
        private _fuseConfirmationService: FuseConfirmationService,
        // private toastr: ToastrService,
    ) {

    }
    ngOnInit() {
        this.loadTable();
    }

    ngAfterViewInit(): void {
        this._changeDetectorRef.detectChanges();
    }

    pages = { current_page: 1, last_page: 1, per_page: 10, begin: 0 };
    loadTable(): void {
        const that = this;
        this.dtOptions = {
            pagingType: "full_numbers",
            pageLength: 25,
            serverSide: true,
            processing: true,
            language: {
                url: "https://cdn.datatables.net/plug-ins/1.11.3/i18n/th.json",
            },
            ajax: (dataTablesParameters: any, callback) => {
                dataTablesParameters.status = null;
                that._service.getPage(dataTablesParameters).subscribe((resp: any) => {
                    this.dataRow = resp.data;
                    console.log(this.dataRow)
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
                { data: 'picture' },
                { data: 'create_by' },
                { data: 'created_at' },

            ],
        };
    }

    delete(itemid: any) {
        const confirmation = this._fuseConfirmationService.open({
            title: 'ลบข้อมูล',
            message: 'คุณต้องการลบข้อมูลใช่หรือไม่ ?',
            icon: {
                show: true,
                name: 'heroicons_outline:exclamation-triangle',
                color: 'warning',
            },
            actions: {
                confirm: {
                    show: true,
                    label: 'ยืนยัน',
                    color: 'warn',
                },
                cancel: {
                    show: true,
                    label: 'ยกเลิก',
                },
            },
            dismissible: true,
        });
        confirmation.afterClosed().subscribe((result) => {
            if (result === 'confirmed') {
                this._service.delete(itemid).subscribe((resp) => {
                    this.rerender();
                });
            }
            error: (err: any) => {};
        });
    }
    addElement() {
        this._router.navigate(['/admin/finance/form'])
    }
    editElement(data: any) {
        this._router.navigate(['/admin/finance/edit/' + data.id])
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

    rerender(): void {
        this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
            dtInstance.ajax.reload();
        });
    }

    get someOneChecked() {
        return this.dataRow?.filter(e => e.checked);
    }

    get someCheck() {
        if (this.someOneChecked?.length == 0) { return false; }

        return this.someOneChecked?.length > 0 && !this.checkAll;
    }

    get checkAll() {
        return this.dataRow?.every(e => e.checked);
    }

    setAll(checked: boolean) {
        this.dataRow?.forEach(e => e.checked = checked);
    }

    confirmSubmit() {
        const confirmation = this._fuseConfirmationService.open({
            title: 'ลบข้อมูล',
            message: 'คุณต้องการลบข้อมูลใช่หรือไม่ ?',
            icon: {
                show: true,
                name: 'heroicons_outline:exclamation-triangle',
                color: 'warning',
            },
            actions: {
                confirm: {
                    show: true,
                    label: 'ยืนยัน',
                    color: 'warn',
                },
                cancel: {
                    show: true,
                    label: 'ยกเลิก',
                },
            },
            dismissible: true,
        });

        confirmation.afterClosed().subscribe((result) => {
            // if (result == 'confirmed') {
            //     this.toastr.success('รายการที่คุณเลือกไว้ได้ตรวจสอบและยืนยันแล้ว')
            //     this.toastr.error('กรุณาตรวจสอบข้อมูล')

            // }
            if (result == 'confirmed') {
                const data = {
                    ids: []
                };
                const deleteOperations = this.dataRow
                .filter(element => element.checked) 
                .map(element => this._service.delete(element.id));
              
              forkJoin(deleteOperations).subscribe(
                () => {
                
                  this.rerender();
                },
                (error) => {
                  
                  console.error('Error during deletion', error);
                }
            )
            }
        });
    }

}


