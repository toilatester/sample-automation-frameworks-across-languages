/* eslint-disable no-undef*/
// in this file you can append custom step methods to 'I' object
/// <reference path="../../typings/steps.d.ts" />
const { AbstractComponent } = require('../base.component');

const I = actor();
class TableComponent extends AbstractComponent {
  constructor(rootElement) {
    super();
    this.__root = rootElement || { css: 'section[class*="master-layout"]' };
  }

  get tableElement() {
    return locate('div[class*="TableView__table__"]').inside(this.__root);
  }

  get tableFilterBarElement() {
    return locate('div[class*="TableView__filter-bar"]').inside(this.__root);
  }

  get tableDataElement() {
    return locate('div[class*="echo-component-EchoTable"][style*="width"]').inside(this.tableElement);
  }

  get tableHeaderElement() {
    return locate('div[class*="echo-component-EchoTable"][style*="padding"]').inside(this.tableDataElement);
  }

  get tableBodyElement() {
    return locate('div[class*="EchoTable"][style*="height"]').inside(this.tableDataElement);
  }

  isNoDataInsideTable() {
    try {
      I.seeElement(locate('div[class*="TableView__no-data"]').inside(this.tableElement));
      return true;
    } catch (err) {
      return false;
    }
  }
}

exports.TableComponent = TableComponent;
