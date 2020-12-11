const faker = require('faker');
const { ITEM_UNIT } = require('../constant/item.unit');

class DataGeneratorUtils {
  get generateName() {
    return `AUTO_${faker.name.findName()}`;
  }

  get generateEmail() {
    return `AUTO_${faker.internet.email()}`;
  }

  get generateCountry() {
    return faker.address.country();
  }

  get generateStreet() {
    return `${faker.address.streetAddress()}, ${faker.address.streetName()}`;
  }

  get generateLedgerCode() {
    return `${faker.random.number({ min: 1, max: 9999 })}-${faker.random.number({
      min: 1,
      max: 99999999999999999999
    })}`;
  }

  get generateItemUnit() {
    return ITEM_UNIT[Math.floor(Math.random() * ITEM_UNIT.length)];
  }

  get generateItemUnitWithUndefine() {
    const itemUnitWithUndefined = ITEM_UNIT.slice(0);
    itemUnitWithUndefined.push(false);
    return itemUnitWithUndefined[Math.floor(Math.random() * itemUnitWithUndefined.length)];
  }

  get generateItemTaxOption() {
    const taxOptions = [undefined, 'Percent', 'Amount'];
    return taxOptions[Math.floor(Math.random() * taxOptions.length)];
  }

  generateNumber(min = 1, max = 5) {
    return `${faker.random.number({ min, max })}`;
  }

  generateItemCatalog(number = 1) {
    const listItemCatalog = {};
    for (let i = 0; i < number; i++) {
      listItemCatalog[i] = {
        itemName: this.generateName,
        itemCode: this.generateLedgerCode,
        leadTime: this.generateNumber(1, 10),
        purchaseUnitName: this.generateItemUnit,
        purchaseUnitCost: this.generateNumber(1, 99999),
        receivingUnitName: this.generateItemUnit,
        receivingUnitCost: this.generateNumber(1, 99999),
        splitCaseUnitName: this.generateItemUnitWithUndefine,
        splitCaseUnitCost: this.generateNumber(1, 99999),
        taxOptions: this.generateItemTaxOption,
        taxCost: this.generateNumber(1, 15),
        orderQuantity: this.generateNumber(1, 500)
      };
    }
    return listItemCatalog;
  }

  getTotalItemAndTotalCost(listItems, costStringKey, quantityStringKey) {
    const totalItem = Object.keys(listItems).length;
    const totalCost = Object.keys(listItems)
      .map((key) => listItems[key][costStringKey] * listItems[key][quantityStringKey])
      .reduce((accumulator, currentValue) => accumulator + currentValue, 0);
    return { totalItem, totalCost };
  }
}
const generator = new DataGeneratorUtils();
Object.freeze(generator);
exports.DataGeneratorUtils = generator;
