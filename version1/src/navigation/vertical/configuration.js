export default [
  { 
    title: 'Configuration',
    icon: { icon: 'mdi-cog-outline' },
    children: [
      // {
      //   title: 'General Setting',
      //   to: 'configurationSetting-generalSetting-general',
      // },
      {
        title: 'Company Information',
        to: 'configurationSetting-companyInformation-companyInformation',
      },
      {
        title: 'Product Data',
        children: [
          { 
            title: 'Product List',
            to: 'configurationSetting-productInformation-product-list',
          },

          // { 
          //   title: 'Product Lot',
          //   to: 'configurationSetting-productInformation-product-lot',
          // },
          { 
            title: 'Categories',
            to: 'configurationSetting-productInformation-productCategory-category',
          },
          { 
            title: 'Group',
            to: 'configurationSetting-productInformation-secondProduct-secondProduct',
          },
          { 
            title: 'Sub Group',
            to: 'configurationSetting-productInformation-subProduct-subProduct',
          },
          { 
            title: 'Counting Unit',
            to: 'configurationSetting-productInformation-countingUnit-unit',
          },
          { 
            title: 'Color',
            to: 'configurationSetting-productInformation-color-color',
          },
          { 
            title: 'Size',
            to: 'configurationSetting-productInformation-size-size',
          },
        ],
      },

      // {
      //   title: 'Inventory Data',
      //   children: [
      //     { 
      //       title: 'Warehouse List',
      //       to: 'configurationSetting-inventoryInformation-warehouseList-warehouseList',
      //     },
      //     { 
      //       title: 'Warehouse',
      //       to: 'configurationSetting-inventoryInformation-InventoryWarehouse-inventory',
      //     },
      //     { 
      //       title: 'Storage Zone',
      //       to: 'configurationSetting-inventoryInformation-storageZone-zone',
      //     },
      //     { 
      //       title: 'Storage Area',
      //       to: 'configurationSetting-inventoryInformation-storageArea-area',
      //     },
      //     { 
      //       title: 'Sub Storage Area',
      //       to: 'configurationSetting-inventoryInformation-subStorageArea-subArea',
      //     },
      //   ],
      // },
      // {
      //   title: 'Employee Data',
      //   children: [
      //     { 
      //       title: 'Employee Data List',
      //       to: 'configurationSetting-employeeInformation-employeeList-list',
      //     },
      //     { 
      //       title: 'Department',
      //       to: 'configurationSetting-employeeInformation-departmentData-department',
      //     },
      //     { 
      //       title: 'Section',
      //       to: 'configurationSetting-employeeInformation-sectionData-section',
      //     },
      //     { 
      //       title: 'Position',
      //       to: 'configurationSetting-employeeInformation-positionData-position',
      //     },
      //     { 
      //       title: 'Division',
      //       to: 'configurationSetting-employeeInformation-divisionData-division',
      //     },
      //   ],
      // },

      // {
      //   title: 'Receipt/Issue',
      //   children: [
      //     { 
      //       title: 'Receipt/Issue Categories',
      //       to: 'configurationSetting-receiptIssue-receiptIssueCat',
      //     },
      //   ],
      // },
      // {
      //   title: 'Customer Data',
      //   children: [
      //     { 
      //       title: 'Customer Data List',
      //       to: 'configurationSetting-customerInformation-customer',
      //     },
      //   ],
      // },
      // {
      //   title: 'Supplier Data',
      //   children: [
      //     { 
      //       title: 'Vendor Data List',
      //       to: 'configurationSetting-vendorInformation-vendor',
      //     },
      //   ],
      // },
    ],
  },
]
