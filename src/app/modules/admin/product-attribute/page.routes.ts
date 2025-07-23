import { Routes } from '@angular/router';
import { PageComponent } from './page.component';
import { ListComponent } from './list/list.component';
import { FormComponent } from './form/form.component';
import { EditComponent } from './edit/edit.component';
import { inject } from '@angular/core';
import { Service } from './page.service';

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
                    // categories: () => inject(InventoryService).getCategories(),
                    // products  : () => inject(InventoryService).getProducts(),
                    // tags      : () => inject(InventoryService).getTags(),
                    // vendors   : () => inject(InventoryService).getVendors(),
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
                    category    : () => inject(Service).getCategories(),
                    supplie: () => inject(Service).getSuppliers(),
                    brand  : () => inject(Service).getBrand(),
                    companie      : () => inject(Service).getCompanie(),
                    cc   : () => inject(Service).getCC(),
                    color   : () => inject(Service).getColor(),
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
                    category    : () => inject(Service).getCategories(),
                    supplie: () => inject(Service).getSuppliers(),
                    brand  : () => inject(Service).getBrand(),
                    companie      : () => inject(Service).getCompanie(),
                    cc   : () => inject(Service).getCC(),
                    color   : () => inject(Service).getColor(),
                },
            },
        ],
    },
] as Routes;
