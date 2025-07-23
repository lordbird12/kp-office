import { Routes } from '@angular/router';
import { PageComponent } from './page.component';
import { ListComponent } from './list/list.component';
import { FormComponent } from './form/form.component';
import { PageService } from './page.service';
import { inject } from '@angular/core';
import { Service } from '../income-expense/page.service';

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
                    users: () => inject(PageService).getUser(),
                    checkLists: () => inject(PageService).getChecklist(),
                    type_income: () => inject(Service).getIncome(),
                    type_deduct: () => inject(Service).getDeduct(),
                     masters   : () => inject(Service).getMaseter(),
                    // categories: () => inject(InventoryService).getCategories(),
                    // products  : () => inject(InventoryService).getProducts(),
                    // tags      : () => inject(InventoryService).getTags(),
                    // vendors   : () => inject(InventoryService).getVendors(),
                },
            },
            {
                path: 'edit/:id',
                component: FormComponent,
                resolve: {
                    users: () => inject(PageService).getUser(),
                    type_income: () => inject(Service).getIncome(),
                    type_deduct: () => inject(Service).getDeduct(),
                    // categories: () => inject(InventoryService).getCategories(),
                    // products  : () => inject(InventoryService).getProducts(),
                    // tags      : () => inject(InventoryService).getTags(),
                    // vendors   : () => inject(InventoryService).getVendors(),
                },
            },
        ],
    },
] as Routes;
