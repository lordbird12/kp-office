import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Service } from '../page.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { ToastrService } from 'ngx-toastr';
import { StatusDialogComponent } from '../status-dialog/status-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
    selector: 'app-stock-request-stock-view',
    styleUrl: './stock-view.component.scss',
    templateUrl: './stock-view.component.html',
    standalone: true,
    imports: [
        ReactiveFormsModule,
        FormsModule,
        CommonModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatIconModule,
        MatCardModule,
        MatSelectModule
    ]
})
export class StockRequestStockViewComponent implements OnInit {
    requestForm: FormGroup;
    isForm: boolean = true
    formFieldHelpers: string[] = ['fuse-mat-dense'];
    searchTerm: string = ''
    constructor(
        private fb: FormBuilder,
        private _serviceJob: Service,
        private _cdr: ChangeDetectorRef,
        private _router: Router,
        private _fuseConfirmationService: FuseConfirmationService,
        private _toastr: ToastrService,
        private dialog: MatDialog,
        private _activatedRoute: ActivatedRoute
    ) {
        this._serviceJob.getJobs().subscribe((resp: any) => {
            this.jobs = resp.data
        })

        this._serviceJob.getProductAttribute().subscribe((resp: any) => {
            this.productAttributes = resp.data
        })

        this._serviceJob.getWorkType().subscribe((resp: any) => {
            this.workTypes = resp.data
        })

        this.Id = this._activatedRoute.snapshot.params.id
        console.log(this.Id);

    }
    form: FormGroup;
    Id: any
    jobs = []; // ดึงจาก API
    productAttributes = []; // ดึงจาก API
    stepJobs = []; // ดึงจาก API
    workTypes = []; // ดึงจาก API    
    itemData: any
    filteredItemData: any[] = [];
    ngOnInit(): void {
        this.GetById()
    }

    GetById() {
        this._serviceJob.getAllTrans().subscribe((resp: any) => {
            this.itemData = resp.data
            this.filteredItemData = resp.data; // default กรองไว้ก่อน
            this._cdr.markForCheck(); // สำหรับ OnPush

        });
    }

    onSearchChange() {
        const term = this.searchTerm.toLowerCase();
        this.filteredItemData = this.itemData.filter((doc: any) =>
            doc.code?.toLowerCase().includes(term)
        );
        this._cdr.markForCheck(); // ถ้าใช้ OnPush
    }

    clearSearch() {
        this.searchTerm = '';
        this.filteredItemData = [...this.itemData];
        this._cdr.markForCheck();
    }


 

    viewElement(data: any) {
        this._router.navigate(['/admin/withdraw/view/' + data.id]);
    }

    


    getWorkTypeName(workTypeId: number | string): string {
        const work = this.itemData?.job?.steps
            ?.flatMap(step => step.step_job_type_lists)
            ?.find(typeList => typeList?.work_type_id == workTypeId);
        return work?.work_type?.name || '-';
    }

    getStepNo(stepJobTypeListId: number | string): string {
        const step = this.itemData?.job?.steps?.find(s =>
            s.step_job_type_lists.some(list => list.id == stepJobTypeListId)
        );
        return step ? `ขั้นตอนที่ ${step.step_no}` : '-';
    }

}
