/* eslint-disable */
import { FuseNavigationItem } from '@fuse/components/navigation';
const storedPermission = JSON.parse(localStorage.getItem('permission'));
export const defaultNavigation: FuseNavigationItem[] = [
    {
        id: 'admin',
        title: 'จัดการระบบ',
        subtitle: 'ขัอมูลเกี่ยวกับระบบ',
        type: 'group',
        icon: 'heroicons_outline:home',
        hidden: () => {
            // const storedPermission = JSON.parse(localStorage.getItem('permission'));
            const menu = storedPermission?.find((e) => e.menu_id == 1);
            if (menu?.view == 0) {
                return true;
            } else {
                return false;
            }
        },
        children: [
            {
                id: 'admin.comp',
                title: 'ข้อมูลบริษัท',
                type: 'basic',
                icon: 'heroicons_outline:building-office-2',
                link: '/admin/companie/list',
            },
            {
                id: 'admin.department',
                title: 'แผนกงาน',
                type: 'basic',
                icon: 'heroicons_outline:list-bullet',
                link: '/admin/department/list',
            },
            {
                id: 'admin.position',
                title: 'ตำแหน่งงาน',
                type: 'basic',
                icon: 'heroicons_outline:list-bullet',
                link: '/admin/position/list',
            },
            {
                id: 'admin.employee',
                title: 'ข้อมูลพนักงาน',
                type: 'basic',
                icon: 'heroicons_outline:list-bullet',
                link: '/admin/employee/list',
            },
            {
                id: 'admin.permission',
                title: 'สิทธิ์การใช้งาน',
                type: 'basic',
                icon: 'heroicons_outline:key',
                link: '/admin/permission/list',
            },
            // {
            //     id: 'admin.time',
            //     title: 'ลงเวลา',
            //     type: 'basic',
            //     icon: 'heroicons_outline:clock',
            //     link: '/admin/time-attendance/list',
            // },

        ],
    },
    // {
    //     id: 'finance',
    //     title: 'จัดการเงินเดือน',
    //     subtitle: 'ขัอมูลเกี่ยวกับเงินเดือน',
    //     type: 'group',
    //     icon: 'heroicons_outline:home',
    //     children: [

    //         {
    //             id: 'finance.payroll',
    //             title: 'เงินเดือน',
    //             type: 'basic',
    //             icon: '10k',
    //             link: '/admin/payroll/list',
    //         },
    //         {
    //             id: 'finance.time',
    //             title: 'ข้อมูลลงเวลา',
    //             type: 'basic',
    //             icon: 'heroicons_outline:clock',
    //             link: '/admin/time/list',
    //         },
    //         {
    //             id: 'finance.income',
    //             title: 'ประเภทเงินได้',
    //             type: 'basic',
    //             icon: 'heroicons_outline:currency-dollar',
    //             link: '/admin/income/list',
    //         },
    //         {
    //             id: 'finance.deduct',
    //             title: 'ประเภทเงินหัก',
    //             type: 'basic',
    //             icon: 'heroicons_outline:squares-plus',
    //             link: '/admin/deduct/list',
    //         },
    //         {
    //             id: 'finance.income-paid',
    //             title: 'เงินได้ - เงินหัก',
    //             type: 'basic',
    //             icon: 'heroicons_outline:list-bullet',
    //             link: '/admin/income-deduct/list',
    //         },
    //         {
    //             id: 'finance.income-paid',
    //             title: 'ตั้งค่ามาสาย',
    //             type: 'basic',
    //             icon: 'heroicons_outline:list-bullet',
    //             link: '/admin/late/list',
    //         },
    //     ],
    // },
    {
        id: 'products',
        title: 'จัดการคลังและสินค้า',
        subtitle: 'ขัอมูลเกี่ยวกับระบบ',
        type: 'group',
        icon: 'heroicons_outline:home',
        children: [
            //     {
            //         id: 'products.warehouse',
            //         title: 'คลังสินค้า',
            //         type: 'basic',
            //         icon: 'heroicons_outline:home-modern',
            //         link: '/admin/warehouse/list',
            //     },
            {
                id: 'products.brand',
                title: 'ยี่ห้อรถ',
                type: 'basic',
                icon: 'heroicons_outline:building-office-2',
                link: '/admin/brand/list',
            },
            {
                id: 'products.category-product',
                title: 'ประเภทรถยนต์',
                type: 'basic',
                icon: 'heroicons_outline:cube',
                link: '/admin/category-product/list',
            },
            {
                id: 'products.product',
                title: 'รถยนต์',
                type: 'basic',
                icon: 'heroicons_outline:cube',
                link: '/admin/product/list',
            },
            {
                id: 'category-attribute.list',
                title: 'ประเภทอะไหล่',
                type: 'basic',
                icon: 'heroicons_outline:wrench-screwdriver',
                link: '/admin/category-attribute/list',
            },
            {
                id: 'spare-part.list',
                title: 'อะไหล่',
                type: 'basic',
                icon: 'heroicons_outline:wrench',
                link: '/admin/product-attribute/list',
            },
            {
                id: 'spare-part.withdraw',
                title: 'เบิกอะไหล่',
                type: 'basic',
                icon: 'heroicons_outline:building-storefront',
                link: '/admin/withdraw/list',
            },
            {
                id: 'spare-part.withdraw-report',
                title: 'รายงานใบเบิกทั้งหมด',
                type: 'basic',
                icon: 'heroicons_outline:building-storefront',
                link: '/admin/withdraw/stock-view',
            },
            {
                id: 'supplier.list',
                title: 'ผู้จำหน่าย',
                type: 'basic',
                icon: 'mat_outline:supervised_user_circle',
                link: '/admin/supplier/list',
            },
        ],
    },
    {
        id: 'sales',
        title: 'จัดการคำสั่งซื้อ',
        subtitle: 'ขัอมูลเกี่ยวกับระบบ',
        type: 'group',
        icon: 'heroicons_outline:home',
        children: [
            {
                id: 'sales.list',
                title: 'คำสั่งซื้อ',
                type: 'basic',
                icon: 'checklist',
                link: '/admin/sales/list',
            },
            {
                id: 'client.list',
                title: 'ลูกค้าของเรา',
                type: 'basic',
                icon: 'heroicons_mini:user-group',
                link: '/admin/customers/list',
            },
            {
                id: 'job.type-income',
                title: 'หมวดหมู่รับเงิน',
                type: 'basic',
                icon: 'heroicons_outline:tag',
                link: '/admin/type-income/list',
            },
            {
                id: 'job.type-expenses',
                title: 'หมวดหมู่จ่ายเงิน ',
                type: 'basic',
                icon: 'heroicons_outline:tag',
                link: '/admin/type-expense/list',
            },
            {
                id: 'job.check-list',
                title: 'รายการตรวจสอบ ',
                type: 'basic',
                icon: 'heroicons_outline:cog-6-tooth',
                link: '/admin/check-list/list',
            },
        ],
        // hidden: () => {
        //     const role = localStorage.getItem('role');
        //     if (role !== 'admin') {
        //         return true;
        //     } else {
        //         return false;
        //     }
        // }
    },
    {
        id: 'job',
        title: 'จัดการงาน',
        subtitle: 'ขัอมูลเกี่ยวกับระบบ',
        type: 'group',
        icon: 'heroicons_outline:briefcase',
        children: [

            {
                id: 'job.category-job',
                title: 'ประเภทงาน',
                type: 'basic',
                icon: 'heroicons_outline:tag',
                link: '/admin/category-job/list',
            },
            {
                id: 'job.job',
                title: 'งาน',
                type: 'basic',
                icon: 'heroicons_outline:clipboard-document-list',
                link: '/admin/job/list',
            },
        ],
    },
    {
        id: 'accounting',
        title: 'บัญชี',
        subtitle: 'ขัอมูลเกี่ยวกับระบบ',
        type: 'group',
        icon: 'heroicons_outline:briefcase',
        children: [
            {
                id: 'account.creditor',
                title: 'เจ้าหนี้ - ลูกหนี้ ',
                type: 'basic',
                icon: 'heroicons_outline:credit-card',
                link: '/admin/creditor/list',
            },
            {
                id: 'account.type',
                title: 'ประเภทรายรับ - รายจ่าย ',
                type: 'basic',
                icon: 'heroicons_outline:tag',
                link: '/admin/income-expense-tracker/list',
            },
            {
                id: 'job.income-expenses',
                title: 'รายรับ-รายจ่าย',
                type: 'basic',
                icon: 'heroicons_outline:currency-dollar',
                link: '/admin/income-expense/list',
            },
            {
                id: 'job.report-income-expenses',
                title: 'รายงาน',
                type: 'collapsable',
                icon: 'heroicons_outline:chart-bar',
                children: [
                    {
                        id: 'job.report-daily-monthly-yearly',
                        title: 'รายงานรายรับ - รายจ่าย (รายวัน/รายเดือน/รายปี)',
                        type: 'basic',
                        icon: 'heroicons_outline:calendar',
                        link: '/admin/report-income-expense/list',
                    },
                    {
                        id: 'job.report-cost-by-car',
                        title: 'รายงานค่าใช้จ่ายของแต่ละรถ',
                        type: 'basic',
                        icon: 'heroicons_outline:truck',
                        link: '/admin/report-cost-by-car/list',
                    },
                    {
                        id: 'ar.report-ar-pr',
                        title: 'รายงานเจ้าหนี้ - ลูกหนี้',
                        type: 'basic',
                        icon: 'heroicons_outline:truck',
                        link: '/admin/creditor/report',
                    },
                ],
            },

        ],
    },
    {
        id: 'จัดการผู้เกี่ยวข้อง',
        title: 'จัดการข้อมูลผู้เกี่ยวข้อง',
        subtitle: 'ขัอมูลเกี่ยวกับระบบ',
        type: 'group',
        icon: 'heroicons_outline:home',
        children: [
            {
                id: 'supplier.list',
                title: 'ผู้จำหน่าย',
                type: 'basic',
                icon: 'mat_outline:supervised_user_circle',
                link: '/admin/supplier/list',
            },
            {
                id: 'finance.list',
                title: 'ไฟแนนซ์',
                type: 'basic',
                icon: 'heroicons_mini:building-office',
                link: '/admin/finance/list',
            },
            {
                id: 'broker.list',
                title: 'ตัวแทนนายหน้า',
                type: 'basic',
                icon: 'mat_outline:safety_divider',
                link: '/admin/broker/list',
            },
            // {
            //     id: 'insurance.list',
            //     title: 'ประกันภัย',
            //     type: 'basic',
            //     icon: 'mat_outline:health_and_safety',
            //     link: '/admin/insurance/list',
            // },
            // {
            //     id: 'garage.list',
            //     title: 'อู่นอก',
            //     type: 'basic',
            //     icon: 'mat_outline:home',
            //     link: '/admin/garage/list',
            // }
        ],
        hidden: () => {
            const role = localStorage.getItem('role');
            if (role !== 'admin') {
                return true;
            } else {
                return false;
            }
        }
    },
    {
        id: 'self',
        title: 'ส่วนตัว',
        subtitle: 'จัดการโปรไฟล์',
        type: 'group',
        icon: 'heroicons_outline:home',
        children: [
            // {
            //     id: 'self.employee',
            //     title: 'แก้ไขข้อมูลส่วนตัว',
            //     type: 'basic',
            //     icon: 'heroicons_outline:user',
            //     link: '/admin/employee/list',
            // },
            {
                id: 'admin.logout',
                title: 'ออกจากระบบ',
                type: 'basic',
                icon: 'heroicons_outline:arrow-left-on-rectangle',
                link: '/sign-out',
            },
        ],
    },
];
export const compactNavigation: FuseNavigationItem[] = [
    {
        id: 'dashboards',
        title: 'Dashboards',
        tooltip: 'Dashboards',
        type: 'aside',
        icon: 'heroicons_outline:home',
        children: [], // This will be filled from defaultNavigation so we don't have to manage multiple sets of the same navigation
    },
    {
        id: 'apps',
        title: 'Apps',
        tooltip: 'Apps',
        type: 'aside',
        icon: 'heroicons_outline:qr-code',
        children: [], // This will be filled from defaultNavigation so we don't have to manage multiple sets of the same navigation
    },
    {
        id: 'pages',
        title: 'Pages',
        tooltip: 'Pages',
        type: 'aside',
        icon: 'heroicons_outline:document-duplicate',
        children: [], // This will be filled from defaultNavigation so we don't have to manage multiple sets of the same navigation
    },
    {
        id: 'user-interface',
        title: 'UI',
        tooltip: 'UI',
        type: 'aside',
        icon: 'heroicons_outline:rectangle-stack',
        children: [], // This will be filled from defaultNavigation so we don't have to manage multiple sets of the same navigation
    },
    {
        id: 'navigation-features',
        title: 'Navigation',
        tooltip: 'Navigation',
        type: 'aside',
        icon: 'heroicons_outline:bars-3',
        children: [], // This will be filled from defaultNavigation so we don't have to manage multiple sets of the same navigation
    },
];
export const futuristicNavigation: FuseNavigationItem[] = [
    {
        id: 'dashboards',
        title: 'DASHBOARDS',
        type: 'group',
        children: [], // This will be filled from defaultNavigation so we don't have to manage multiple sets of the same navigation
    },
    {
        id: 'apps',
        title: 'APPS',
        type: 'group',
        children: [], // This will be filled from defaultNavigation so we don't have to manage multiple sets of the same navigation
    },
    {
        id: 'others',
        title: 'OTHERS',
        type: 'group',
    },
    {
        id: 'pages',
        title: 'Pages',
        type: 'aside',
        icon: 'heroicons_outline:document-duplicate',
        children: [], // This will be filled from defaultNavigation so we don't have to manage multiple sets of the same navigation
    },
    {
        id: 'user-interface',
        title: 'User Interface',
        type: 'aside',
        icon: 'heroicons_outline:rectangle-stack',
        children: [], // This will be filled from defaultNavigation so we don't have to manage multiple sets of the same navigation
    },
    {
        id: 'navigation-features',
        title: 'Navigation Features',
        type: 'aside',
        icon: 'heroicons_outline:bars-3',
        children: [], // This will be filled from defaultNavigation so we don't have to manage multiple sets of the same navigation
    },
];
export const horizontalNavigation: FuseNavigationItem[] = [
    {
        id: 'dashboards',
        title: 'แดชบอร์ด',
        type: 'group',
        icon: 'heroicons_outline:home',
        children: [], // This will be filled from defaultNavigation so we don't have to manage multiple sets of the same navigation
    },
    // {
    //     id: 'apps',
    //     title: 'Apps',
    //     type: 'group',
    //     icon: 'heroicons_outline:qr-code',
    //     children: [], // This will be filled from defaultNavigation so we don't have to manage multiple sets of the same navigation
    // },
    // {
    //     id: 'pages',
    //     title: 'Pages',
    //     type: 'group',
    //     icon: 'heroicons_outline:document-duplicate',
    //     children: [], // This will be filled from defaultNavigation so we don't have to manage multiple sets of the same navigation
    // },
    // {
    //     id: 'user-interface',
    //     title: 'UI',
    //     type: 'group',
    //     icon: 'heroicons_outline:rectangle-stack',
    //     children: [], // This will be filled from defaultNavigation so we don't have to manage multiple sets of the same navigation
    // },
    // {
    //     id: 'navigation-features',
    //     title: 'Misc',
    //     type: 'group',
    //     icon: 'heroicons_outline:bars-3',
    //     children: [], // This will be filled from defaultNavigation so we don't have to manage multiple sets of the same navigation
    // },
    {
        id: 'purchase',
        title: 'ซื้อ',
        type: 'group',
        icon: 'heroicons_outline:inbox-arrow-down',
        children: [],
    },
    {
        id: 'sale',
        title: 'ขาย',
        type: 'group',
        icon: 'heroicons_outline:shopping-cart',
        children: [],
    },
    {
        id: 'inventory',
        title: 'คลังสินค้า',
        type: 'group',
        icon: 'heroicons_outline:cube',
        children: [],
    },
    {
        id: 'accounting',
        title: 'บัญชี/การเงิน',
        type: 'group',
        icon: 'heroicons_outline:users',
        children: [],
    },
    {
        id: 'delivery-workers',
        title: 'คนส่งของ',
        type: 'group',
        icon: 'heroicons_outline:users',
        children: [],
    },
    {
        id: 'admin',
        title: 'จัดการพนักงาน',
        type: 'group',
        icon: 'heroicons_outline:users',
        children: [],
    },
    {
        id: 'reports',
        title: 'รายงาน',
        type: 'group',
        icon: 'heroicons_outline:clipboard-document-list',
        children: [],
    },
];
