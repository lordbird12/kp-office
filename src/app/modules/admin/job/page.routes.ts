import { Routes } from '@angular/router';
import { PageComponent } from './page.component';
import { ListComponent } from './list/list.component';
import { FormComponent } from './form/form.component';
import { EditComponent } from './edit/edit.component';
import { inject } from '@angular/core';
import { Service } from './page.service';
import { ViewComponent } from './view/view.component';

export default [
    // {
    //     path      : '',
    //     pathMatch : 'full',
    //     redirectTo: 'quotation',
    // },
    {
        path     : '',
        component: PageComponent,
        children : [
            {
                path     : 'list',
                component: ListComponent,
                resolve  : {
                    workTypes   : () => inject(Service).getWorkType(),
                    products    : () => inject(Service).getProducts(),
                },
            },
        ],
    },
    {
        path     : '',
        component: PageComponent,
        children : [
            {
                path     : 'form',
                component: FormComponent,
                resolve  : {
                    categoryJobs   : () => inject(Service).getCategoryJobs(),
                    products   : () => inject(Service).getProducts(),
                    workType   : () => inject(Service).getWorkType(),
                    expenseType   : () => inject(Service).getExpenseType(),
                    productAttribute   : () => inject(Service).getProductAttribute(),
                    masters   : () => inject(Service).getMaseter(),

                },
            },
        ],
    },
    {
        path     : '',
        component: PageComponent,
        children : [
            {
                path     : 'edit/:id',
                component: FormComponent,
                resolve  : {
                    categoryJobs   : () => inject(Service).getCategoryJobs(),
                    products   : () => inject(Service).getProducts(),
                    workType   : () => inject(Service).getWorkType(),
                    expenseType   : () => inject(Service).getExpenseType(),
                    productAttribute   : () => inject(Service).getProductAttribute(),
                },
            },
        ],
    },
    {
        path     : '',
        component: PageComponent,
        children : [
            {
                path     : 'view/:id',
                component: ViewComponent,
                resolve  : {
                    job  : (route) => inject(Service).getById(route.params['id']),
                    productAttribute   : () => inject(Service).getProductAttribute(),
                    expenseType   : () => inject(Service).getExpenseType(),
                    workType   : () => inject(Service).getWorkType(),
                    color   : () => inject(Service).getColor(),
                },
            },
        ],
    },
] as Routes;
