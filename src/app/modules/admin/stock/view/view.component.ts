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
    selector: 'app-stock-request-view',
    styleUrl: './view.component.scss',
    templateUrl: './view.component.html',
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
export class StockRequestViewComponent implements OnInit {
    requestForm: FormGroup;
    isForm: boolean = true
    formFieldHelpers: string[] = ['fuse-mat-dense'];
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
    ngOnInit(): void {
        this.GetById()
    }

    GetById() {
        this._serviceJob.getById(this.Id).subscribe((resp: any) => {
            this.itemData = resp.data


            this._cdr.markForCheck(); // สำหรับ OnPush

        });
    }


    getStatusText(status: string): string {
        switch (status) {
            case 'approved': return 'อนุมัติแล้ว';
            case 'pending': return 'รออนุมัติ';
            case 'rejected': return 'ถูกปฏิเสธ';
            default: return status;
        }
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

    printPage() {
        window.print();
    }
}
