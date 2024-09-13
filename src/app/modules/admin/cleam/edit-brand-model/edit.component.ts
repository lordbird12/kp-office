

import { TextFieldModule } from '@angular/cdk/text-field';
import { CommonModule, NgClass } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatChipsModule } from '@angular/material/chips';
import { MatOptionModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { PageService } from '../page.service';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { DataTableDirective, DataTablesModule } from 'angular-datatables';
import { ActivatedRoute, Router } from '@angular/router';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { MatTabsModule } from '@angular/material/tabs';
import { MatDialog } from '@angular/material/dialog';
import { FormDialogCCComponent } from '../form-dialog-cc/form-dialog.component';
import { FormDialogColorComponent } from '../form-dialog-color/form-dialog.component';

@Component({
  selector: 'edit-brand-model',
  templateUrl: './edit.component.html',
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
    MatCheckboxModule,
    NgxDropzoneModule,
    MatTabsModule
  ],

})
export class EditBrandModelComponent implements OnInit {

  @ViewChild(DataTableDirective)
  dtElement!: DataTableDirective;
  dataRow: any[] = [];
  dataRowcc: any[] = [];

  editForm: FormGroup;
  MenuList: any = [];
  formFieldHelpers: string[] = ['fuse-mat-dense'];
  fixedSubscriptInput: FormControl = new FormControl('', [Validators.required]);
  dynamicSubscriptInput: FormControl = new FormControl('', [Validators.required]);
  fixedSubscriptInputWithHint: FormControl = new FormControl('', [Validators.required]);
  dynamicSubscriptInputWithHint: FormControl = new FormControl('', [Validators.required]);
  Id: any;
  url_image: string;
  itemData: any;
  dtOptionsCC: DataTables.Settings = {};
  dtOptionsColor: DataTables.Settings = {};
  /**
   * Constructor
   */
  constructor(
    private dialog: MatDialog,
    private _formBuilder: FormBuilder,
    private _Service: PageService,
    private _changeDetectorRef: ChangeDetectorRef,
    private _router: Router,
    private _fuseConfirmationService: FuseConfirmationService,
    public activatedRoute: ActivatedRoute,
  ) {
    this.Id = this.activatedRoute.snapshot.paramMap.get('id');

    this.editForm = this._formBuilder.group({

      id: '',
      brand_id: '',
      name: '',
      detail: '',
      status: '',
    })
  }

  ngOnInit(): void {
    this._Service.getByIdModel(this.Id).subscribe((resp: any) => {
      this.itemData = resp.data;
      this.editForm.patchValue({
        ...this.itemData,
      })
    })
    this.loadTable();

  }

  onSubmit(): void {
    const confirmation = this._fuseConfirmationService.open({
      "title": "แก้ไขข้อมูล",
      "message": "คุณต้องการแก้ไขข้อมูลใช่หรือไม่ ",
      "icon": {
        "show": false,
        "name": "heroicons_outline:exclamation",
        "color": "warning"
      },
      "actions": {
        "confirm": {
          "show": true,
          "label": "ยืนยัน",
          "color": "primary"
        },
        "cancel": {
          "show": true,
          "label": "ยกเลิก"
        }
      },
      "dismissible": true
    });

    // Subscribe to the confirmation dialog closed action
    confirmation.afterClosed().subscribe((result) => {
      if (result === 'confirmed') {
        let formValue = this.editForm.value
        this._Service.updateModel(formValue, this.Id).subscribe({
          next: (resp: any) => {


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
      }
    })
  }

  addElementCC(data: any) {
    const dialogRef = this.dialog.open(FormDialogCCComponent, {
      width: '500px', // กำหนดความกว้างของ Dialog
      maxHeight: '100Vh',
      data: {
        data: data,
        brand_model_id: this.Id
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.rerender();
      }
    });
  }

  addElementColor(data: any) {
    const dialogRef = this.dialog.open(FormDialogColorComponent, {
      width: '500px', // กำหนดความกว้างของ Dialog
      maxHeight: '100Vh',
      data: {
        data: data,
        brand_model_id: this.Id
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.rerender();
        this._changeDetectorRef.markForCheck();
      }
    });
  }


  rerender(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.ajax.reload();
    });
  }

  pages = { current_page: 1, last_page: 1, per_page: 10, begin: 0 };
  loadTable(): void {
    const that = this;
    this.dtOptionsCC = {
      pagingType: "full_numbers",
      pageLength: 25,
      serverSide: true,
      processing: true,
      language: {
        url: "https://cdn.datatables.net/plug-ins/1.11.3/i18n/th.json",
      },
      ajax: (dataTablesParameters: any, callback) => {
        dataTablesParameters.status = null;
        dataTablesParameters.brand_model_id = +this.Id;
        that._Service.getPageCC(dataTablesParameters).subscribe((resp: any) => {
          this.dataRowcc = resp.data;
          this.pages.current_page = resp.current_page;
          this.pages.last_page = resp.last_page;
          this.pages.per_page = resp.per_page;
          if (resp.current_page > 1) {
            this.pages.begin =
              parseInt(resp.per_page) *
              (parseInt(resp.current_page) - 1);
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
        { data: 'detail' },
        { data: 'create_by' },
        { data: 'created_at' },

      ],
    };
    this.dtOptionsColor = {
      pagingType: "full_numbers",
      pageLength: 25,
      serverSide: true,
      processing: true,
      language: {
        url: "https://cdn.datatables.net/plug-ins/1.11.3/i18n/th.json",
      },
      ajax: (dataTablesParameters: any, callback) => {
        dataTablesParameters.status = null;
        dataTablesParameters.brand_model_id = +this.Id;
        that._Service.getPageColor(dataTablesParameters).subscribe((resp: any) => {
          this.dataRow = resp.data;
          this.pages.current_page = resp.current_page;
          this.pages.last_page = resp.last_page;
          this.pages.per_page = resp.per_page;
          if (resp.current_page > 1) {
            this.pages.begin =
              parseInt(resp.per_page) *
              (parseInt(resp.current_page) - 1);
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
        { data: 'detail' },
        { data: 'create_by' },
        { data: 'created_at' },

      ],
    };
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
  backTo() {
    this._router.navigate(['admin/brand/list'])
  }

  files: File[] = [];
  onSelect(event: { addedFiles: File[] }): void {
    this.files.push(...event.addedFiles);
    setTimeout(() => {
      this._changeDetectorRef.detectChanges()
    }, 150)
    this.url_image = null
  }

  onRemove(file: File): void {
    const index = this.files.indexOf(file);
    this.url_image = this.itemData.image;
    if (index >= 0) {
      this.files.splice(index, 1);
    }
  }

  deleteCC(itemid: any) {
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
        this._Service.deleteCC(itemid).subscribe((resp) => {
          this.rerender();
        });
      }
      error: (err: any) => { };
    });
  }

  deleteColor(itemid: any) {
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
        this._Service.deleteColor(itemid).subscribe((resp) => {
          this.rerender();
        });
      }
      error: (err: any) => { };
    });
  }
}

