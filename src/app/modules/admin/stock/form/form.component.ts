import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

@Component({
    selector: 'app-stock-request-form',
    templateUrl: './form.component.html',
    standalone: true,
    imports: [
        ReactiveFormsModule,
        FormsModule,
        CommonModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatIconModule,
        MatCardModule
    ]
})
export class StockRequestFormComponent implements OnInit {
    requestForm: FormGroup;
    isForm: boolean = true
    formFieldHelpers: string[] = ['fuse-mat-dense'];
    constructor(private fb: FormBuilder) { }

    ngOnInit(): void {
        this.requestForm = this.fb.group({
            job_id: [null],
            remark: [null, Validators.required],
            items: this.fb.array([
                this.createItem(),
            ])
        });
    }

    createItem(): FormGroup {
        return this.fb.group({
            product_attribute_id: [null, Validators.required],
            qty: [null, [Validators.required, Validators.min(1)]],
            step_jobs_type_list_id: [null],
            work_type_id: [null]
        });
    }

    get items(): FormArray {
        return this.requestForm.get('items') as FormArray;
    }

    addItem(): void {
        this.items.push(this.createItem());
    }

    removeItem(index: number): void {
        this.items.removeAt(index);
    }

    onSubmit(): void {
        if (this.requestForm.valid) {
            console.log(this.requestForm.value);
        } else {
            console.warn('Form not valid');
        }
    }
}
