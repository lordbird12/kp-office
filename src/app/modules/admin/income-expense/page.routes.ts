import { Routes } from '@angular/router';
import { PageComponent } from './page.component';
import { ListComponent } from './list/list.component';
import { FormComponent } from './form/form.component';
import { inject } from '@angular/core';
import { Service } from './page.service';

export default [
    // {
    //     path      : '',
    //     pathMatch : 'full',
    //     redirectTo: 'quotation',
    // },
    {
        path: '',
        component: PageComponent,
        children: [
            {
                path: 'list',
                component: ListComponent,
                resolve: {
                    // brands    : () => inject(InventoryService).getBrands(),
                    // categories: () => inject(InventoryService).getCategories(),
                    // products  : () => inject(InventoryService).getProducts(),
                    // tags      : () => inject(InventoryService).getTags(),
                    // vendors   : () => inject(InventoryService).getVendors(),
                },
            },
        ],
    },
    {
        path: '',
        component: PageComponent,
        children: [
            {
                path: 'form',
                component: FormComponent,
                resolve: {
                    users: () => inject(Service).getUser(),
                    cars: () => inject(Service).getProducts(),
                    type_income: () => inject(Service).getIncome(),
                    type_deduct: () => inject(Service).getDeduct(),
                    income_expenses_tracker_type: () => inject(Service).getIncomeExpenseType(),
                    product_attribute: () => inject(Service).getProductAttribute(),

                },
            },
        ],
    },
    {
        path: '',
        component: PageComponent,
        children: [
            {
                path: 'edit/:id',
                component: FormComponent,
                resolve: {
                    users: () => inject(Service).getUser(),
                    type_income: () => inject(Service).getIncome(),
                    type_deduct: () => inject(Service).getDeduct(),
                    income_expenses_tracker_type: () => inject(Service).getIncomeExpenseType(),
                },
            },
        ],
    },
] as Routes;
