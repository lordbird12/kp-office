import { Routes } from '@angular/router';
import { PageComponent } from './page.component';
// import { FormComponent } from './form/form.component';
import { inject } from '@angular/core';
import { Service } from './page.service';
import { ListComponent } from './list/list.component';

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
                    // brands    : () => inject(InventoryService).getBrands(),
                },
            },
        ],
    },
] as Routes;
