/* eslint-disable no-undef,camelcase*/
// in this file you can append custom step methods to 'I' object
/// <reference path="../../typings/steps.d.ts" />
const { DataGeneratorUtils, RunnerConfig, DateTimeUtils, DATE_FORMAT } = require('../../core');

Feature('Create Vendor -> Create Vendor Item -> Create Order -> Receive Order Item');

Before((I, At_Home_I) => {
  I.navigateToHomePage();
  I.setAuthenticateCookie('.sample-auth.io');
  I.navigateToHomePage();
  At_Home_I.selectStore('env');
  I.navigateToSetupVendorPage();
});

const dataGenerate = () => {
  return {
    vendorName: DataGeneratorUtils.generateName,
    vendorCode: DataGeneratorUtils.generateNumber(10000, 9999999),
    vendorStreet: DataGeneratorUtils.generateStreet,
    vendorLedgerCode: DataGeneratorUtils.generateLedgerCode,
    vendorCountry: DataGeneratorUtils.generateCountry,
    vendorGroup: DataGeneratorUtils.generateName,
    listVendorItems: DataGeneratorUtils.generateItemCatalog(1),
    orderDeliveryDate: DateTimeUtils.getCurrentDateWithDateFormat(DATE_FORMAT.MM_DD_YYYY),
    coverUntilDate: DateTimeUtils.getFutureDateWithFormat(5, DATE_FORMAT.MM_DD_YYYY),
  };
};

Scenario(
  'I can receive items from order with select stores',
  async (I, At_Vendor_I, At_Order_I, At_Receive_I) => {
    const current = dataGenerate();
    // Step 1: create new vendor and verify it create successfully
    At_Vendor_I.addNewVendor(
      current.vendorName,
      current.vendorCode,
      current.vendorStreet,
      current.vendorLedgerCode,
      'Iraq'
    );
    At_Vendor_I.seeNewVendorInVendorTable(current.vendorName, current.vendorCode, 'Active');

    // Step 2 Assign vendor to store and verify it assign successfully
    At_Vendor_I.assignVendorToStore(
      ['Pacific Store GMT-11', 'US Store GMT-3', 'VN Store GMT+7'],
      current.vendorName
    );
    At_Vendor_I.seeNumberOfAssignStoreOfVendor(current.vendorName, 3);

    // Step 3 Create vendor group and verify it create successfully
    At_Vendor_I.createVendorGroup(current.vendorName, current.vendorGroup);
    At_Vendor_I.seeNewVendorGroupInVendorGroupPanel(current.vendorGroup);

    // Step 4 Add vendor items and verify it create successfully
    At_Vendor_I.addNewVendorItem(current.vendorName, current.vendorGroup, current.listVendorItems);
    At_Vendor_I.seeNewVendorItemInVendorCatalog(current.vendorGroup, current.listVendorItems);

    // Step 5 Assign vendor items to store and verify it assign successfully
    At_Vendor_I.assignVendorItemToStore(
      ['Pacific Store GMT-11', 'US Store GMT-3', 'VN Store GMT+7'],
      current.listVendorItems
    );
    At_Vendor_I.seeNumberOfAssignStoreOfVendorItems(current.listVendorItems, 3);

    // Step 6 Create new order
    I.navigateToOrderPage();
    At_Order_I.openAndSelectStore('VN Store GMT+7');
    await At_Order_I.addNewOrder(
      current.vendorName,
      current.orderDeliveryDate,
      current.coverUntilDate
    );
    await At_Order_I.seeNewOrderInOrderTable(
      current.vendorName,
      At_Order_I.getOrderItemHrefLink(),
      At_Order_I.getOrderItemCode(),
      current.orderDeliveryDate
    );

    // Step 7 Add items to order
    At_Order_I.addNewOrderItems(
      current.vendorName,
      current.vendorGroup,
      At_Order_I.getOrderItemHrefLink(),
      current.listVendorItems
    );
    await At_Order_I.seeOrderInOrderTableWithCorrectTotalCost(
      current.vendorName,
      At_Order_I.getOrderItemHrefLink(),
      At_Order_I.getOrderItemCode(),
      current.listVendorItems
    );

    // Step 8 Submit order

    At_Order_I.submitOrder(current.vendorName, At_Order_I.getOrderItemHrefLink());
    await At_Order_I.seeOrderSubmitSuccessfully(
      current.vendorName,
      At_Order_I.getOrderItemHrefLink(),
      At_Order_I.getOrderItemCode(),
      current.listVendorItems
    );

    // Step 9 Receive item
    I.navigateToReceivePage();
    At_Receive_I.searchReceiveItem(current.vendorName, At_Order_I.getOrderItemCode());
    await At_Receive_I.seeReceiveItemWithOrderCode(
      current.vendorName,
      At_Order_I.getOrderItemCode(),
      current.listVendorItems
    );
  }
)
  .retry(RunnerConfig.retriesNumber)
  .tag('@order');
