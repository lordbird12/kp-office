import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { Service } from '../page.service';
import { ImageViewerComponent } from 'app/shared/image-viewer.component';
import { environment } from 'environments/environment.development';


@Component({
  selector: 'app-job-view',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule, MatDialogModule],
  templateUrl: './view.component.html',
})
export class ViewComponent implements OnInit {
  Id: number;
  job: any;

  // Lists for dropdowns
  productAttributes: any[] = [];
  expenseType: any[] = [];
  workTypeList: any[] = [];
  colorList: any[] = [];
  jobTotals: any[] = [];
  itemData: any = {}
  totalAll: number = 0;
  summaryNet: number = 0;

  // Deposit type mapping
  depositTypes = [
    { value: 'internal', label: 'ภายใน' },
    { value: 'external', label: 'ภายนอก' },
  ];

  netProfit:  number = 0

  constructor(
    private route: ActivatedRoute,
    private _service: Service,
    private dialog: MatDialog,
    private _router: Router,
    private _activated: ActivatedRoute,
    private _changeDetectorRef: ChangeDetectorRef,
  ) {
    this.Id = this.route.snapshot.params['id'];
    this.expenseType = this._activated.snapshot.data?.expenseType?.data || [];
  }

  ngOnInit(): void {
    this._service.getById(this.Id).subscribe((resp: any) => {
      this.itemData = resp.data;
      console.log(this.itemData, 'itemData');
      const data = this.itemData

      function safeParseFloat(value: any): number {
        if (value === null || value === undefined || value === '') {
          return 0;
        }
        const num = parseFloat(value);
        return isNaN(num) ? 0 : num;
      }

      let totalAllJobs = 0;
      console.log(data.jobs, 'jobs');

      data.jobs.forEach(job => {
        let totalJob = 0;
        // Sum other_expenses
        if (Array.isArray(job.other_expenses)) {


          totalJob += job.other_expenses.reduce((sum, exp) => sum + safeParseFloat(exp.amount), 0);

        }

        // Sum steps
        if (Array.isArray(job.steps)) {
          job.steps.forEach(step => {
            if (Array.isArray(step.step_job_type_lists)) {
              step.step_job_type_lists.forEach(jobTypeList => {
                // product_attributes
                if (Array.isArray(jobTypeList.product_attributes)) {
                  totalJob += jobTypeList.product_attributes.reduce((sum, attr) => sum + safeParseFloat(attr.amount), 0);
                }

                // product_attribute_others
                if (Array.isArray(jobTypeList.product_attribute_others)) {
                  totalJob += jobTypeList.product_attribute_others.reduce((sum, attrOther) => sum + safeParseFloat(attrOther.amount), 0);
                }

                // expenses
                if (Array.isArray(jobTypeList.expenses)) {
                  totalJob += jobTypeList.expenses.reduce((sum, exp) => sum + safeParseFloat(exp.amount), 0);
                }
              });
            }
          });
          this.jobTotals.push({
            job_id: job.id,
            total: parseFloat(totalJob.toFixed(2))
          });
        }

        console.log(`Job ID ${job.id} total: ${totalJob.toFixed(2)}`);
        totalAllJobs += totalJob;

      });



      console.log(`Total All Jobs: ${totalAllJobs.toFixed(2)}`);
      this.totalAll = totalAllJobs
      this.netProfit = +this.itemData.sale_price + totalAllJobs
      this.summaryNet = (+this.itemData.sale_price + totalAllJobs) - (+this.itemData.cost)
      this._changeDetectorRef.markForCheck();
    })

  }

  getStatusText(status: string): string {
    switch (status) {
      case 'completed':
        return 'เสร็จสิ้น';
      case 'in-progress':
        return 'กำลังดำเนินการ';
      case 'pending':
        return 'รอดำเนินการ';
      case 'waiting':
        return 'รอดำเนินการ';
      default:
        return status;
    }
  }

  getDepositTypeName(type: string): string {
    const found = this.depositTypes.find((t) => t.value === type);
    return found ? found.label : type;
  }

  getProductAttributeName(id: string | number): string {
    const found = this.productAttributes.find((item) => item.id == id);

    return found ? found.name : '-';
  }

  getExpenseTypeName(id: string | number): string {
    const found = this.expenseType.find((item) => item.id == id);
    return found ? found.name : '-';
  }

  getColorName(id: string | number): string {
    const found = this.colorList.find((item) => item.id == id);
    return found ? found.name : '-';
  }

  openImageViewer(imageUrl: string): void {
    this.dialog.open(ImageViewerComponent, {
      data: { imageUrl },
      width: '80%',
      maxWidth: '1000px',
      panelClass: 'image-viewer-dialog',
    });
  }
  gotoEdit(): void {
    this._router.navigate(['/admin/product/edit/' + this.Id]);
  }
  gotoJob(data: any): void {
    this._router.navigate(['/admin/job/edit/' + data]);
  }

  converImage(imagePath: string) {
    return environment.baseURL + '/' + imagePath
  }

  onImageError(event: Event): void {
    const target = event.target as HTMLImageElement;
    target.src = 'assets/images/no_image.png'; // เส้นทางรูปภาพ default
  }

}
