import { Route } from '@angular/router';
import { initialDataResolver } from 'app/app.resolvers';
import { AuthGuard } from 'app/core/auth/guards/auth.guard';
import { NoAuthGuard } from 'app/core/auth/guards/noAuth.guard';
import { LayoutComponent } from 'app/layout/layout.component';

// @formatter:off
/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
export const appRoutes: Route[] = [
    // Redirect empty path to '/dashboards/project'
    { path: '', pathMatch: 'full', redirectTo: 'dashboards/project' },

    // Redirect signed-in user to the '/dashboards/project'
    //
    // After the user signs in, the sign-in page will redirect the user to the 'signed-in-redirect'
    // path. Below is another redirection for that path to redirect the user to the desired
    // location. This is a small convenience to keep all main routes together here on this file.
    {
        path: 'signed-in-redirect',
        pathMatch: 'full',
        redirectTo: 'dashboards/project',
    },

    // Auth routes for guests
    {
        path: '',
        canActivate: [NoAuthGuard],
        canActivateChild: [NoAuthGuard],
        component: LayoutComponent,
        data: {
            layout: 'empty',
        },
        children: [
            {
                path: 'confirmation-required',
                loadChildren: () =>
                    import(
                        'app/modules/auth/confirmation-required/confirmation-required.routes'
                    ),
            },
            {
                path: 'forgot-password',
                loadChildren: () =>
                    import(
                        'app/modules/auth/forgot-password/forgot-password.routes'
                    ),
            },
            {
                path: 'reset-password',
                loadChildren: () =>
                    import(
                        'app/modules/auth/reset-password/reset-password.routes'
                    ),
            },
            {
                path: 'sign-in',
                loadChildren: () =>
                    import('app/modules/auth/sign-in/sign-in.routes'),
            },
            {
                path: 'sign-up',
                loadChildren: () =>
                    import('app/modules/auth/sign-up/sign-up.routes'),
            },
        ],
    },

    // Auth routes for authenticated users
    {
        path: '',
        canActivate: [AuthGuard],
        canActivateChild: [AuthGuard],
        component: LayoutComponent,
        data: {
            layout: 'empty',
        },
        children: [
            {
                path: 'sign-out',
                loadChildren: () =>
                    import('app/modules/auth/sign-out/sign-out.routes'),
            },
            {
                path: 'unlock-session',
                loadChildren: () =>
                    import(
                        'app/modules/auth/unlock-session/unlock-session.routes'
                    ),
            },
        ],
    },

    // Landing routes
    {
        path: '',
        component: LayoutComponent,
        data: {
            layout: 'empty',
        },
        children: [
            {
                path: 'home',
                loadChildren: () =>
                    import('app/modules/landing/home/home.routes'),
            },
        ],
    },

    // Admin routes
    {
        path: '',
        canActivate: [AuthGuard],
        canActivateChild: [AuthGuard],
        component: LayoutComponent,
        resolve: {
            initialData: initialDataResolver,
        },
        children: [
            // Dashboards
            {
                path: 'dashboards',
                children: [
                    {
                        path: 'project',
                        loadChildren: () =>
                            import(
                                'app/modules/admin/dashboards/project/project.routes'
                            ),
                    },
                    {
                        path: 'analytics',
                        loadChildren: () =>
                            import(
                                'app/modules/admin/dashboards/analytics/analytics.routes'
                            ),
                    },
                    {
                        path: 'finance',
                        loadChildren: () =>
                            import(
                                'app/modules/admin/dashboards/finance/finance.routes'
                            ),
                    },
                ],
            },

            // 404 & Catch all
            // { path: '404-not-found', pathMatch: 'full', loadChildren: () => import('app/modules/admin/pages/error/error-404/error-404.routes') },
            { path: '**', redirectTo: '404-not-found' },
            //Sales
            {
              
                path: 'admin',
                children: [
                    { path: 'payroll', loadChildren: () => import('app/modules/admin/payroll/page.routes') },
                    { path: 'time', loadChildren: () => import('app/modules/admin/time/page.routes') },
                    { path: 'cleam', loadChildren: () => import('app/modules/admin/cleam/page.routes') },
                    { path: 'payment', loadChildren: () => import('app/modules/admin/payment/page.routes') },
                    {
                        path: 'department',
                        loadChildren: () =>
                            import('app/modules/admin/department/page.routes'),
                    },
                    {
                        path: 'income',
                        loadChildren: () =>
                            import('app/modules/admin/income/page.routes'),
                    },
                    {
                        path: 'income-deduct',
                        loadChildren: () =>
                            import('app/modules/admin/income-paid/page.routes'),
                    },
                    {
                        path: 'deduct',
                        loadChildren: () =>
                            import('app/modules/admin/deduct/page.routes'),
                    },
                    {
                        path: 'late',
                        loadChildren: () =>
                            import('app/modules/admin/late/page.routes'),
                    },
                    {
                        path: 'position',
                        loadChildren: () =>
                            import('app/modules/admin/position/page.routes'),
                    },
                    {
                        path: 'employee',
                        loadChildren: () =>
                            import('app/modules/admin/employee/page.routes'),
                    },
                    {
                        path: 'permission',
                        loadChildren: () =>
                            import(
                                'app/modules/admin/permission/permission-routing'
                            ),
                    },
                    {
                        path: 'product',
                        loadChildren: () =>
                            import('app/modules/admin/product/page.routes'),
                    },
                    {
                        path: 'product-attribute',
                        loadChildren: () =>
                            import('app/modules/admin/product-attribute/page.routes'),
                    },
                    {
                        path: 'customer',
                        loadChildren: () =>
                            import('app/modules/admin/customer/page.routes'),
                    },
                    {
                        path: 'finance',
                        loadChildren: () =>
                            import('app/modules/admin/finance/page.routes'),
                    },
                    {
                        path: 'brand',
                        loadChildren: () =>
                            import('app/modules/admin/brand/page.routes'),
                    },
                    {
                        path: 'brand-model',
                        loadChildren: () =>
                            import('app/modules/admin/brand-model/page.routes'),
                    },
                    {
                        path: 'sales',
                        loadChildren: () =>
                            import('app/modules/admin/sales/page.routes'),
                    },
                    {
                        path: 'time-attendance',
                        loadChildren: () =>
                            import(
                                'app/modules/admin/timea-attendance/page.routes'
                            ),
                    },
                    {
                        path: 'supplier',
                        loadChildren: () =>
                            import('app/modules/admin/supplier/page.routes'),
                    },
                    {
                        path: 'companie',
                        loadChildren: () =>
                            import('app/modules/admin/companie/page.routes'),
                    },
                    {
                        path: 'branch',
                        loadChildren: () =>
                            import('app/modules/admin/branch/page.routes'),
                    },
                    {
                        path: 'transfer',
                        loadChildren: () =>
                            import('app/modules/admin/transfer/page.routes'),
                    },
                    {
                        path: 'purchase',
                        loadChildren: () =>
                            import('app/modules/admin/purchase/page.routes'),
                    },
                    {
                        path: 'report-stock-vat',
                        loadChildren: () =>
                            import(
                                'app/modules/admin/report-stock-vat/page.routes'
                            ),
                    },
                    {
                        path: 'report-stock-card',
                        loadChildren: () =>
                            import(
                                'app/modules/admin/report-stock-card/page.routes'
                            ),
                    },
                ],
            },
        ],
    },
];
