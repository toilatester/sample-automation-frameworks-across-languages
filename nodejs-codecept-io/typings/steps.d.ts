type ICodeceptCallback = (
  i: CodeceptJS.I,
  I_Authenticate: CodeceptJS.I_Authenticate,
  At_Home_I: CodeceptJS.At_Home_I,
  At_Vendor_I: CodeceptJS.At_Vendor_I,
  At_Count_I: CodeceptJS.At_Count_I,
  At_Order_I: CodeceptJS.At_Order_I,
  At_Receive_I: CodeceptJS.At_Receive_I
) => void;

declare class FeatureConfig {
  retry(times: number): FeatureConfig;

  timeout(seconds: number): FeatureConfig;

  config(config: object): FeatureConfig;

  config(helperName: string, config: object): FeatureConfig;
}

declare class ScenarioConfig {
  throws(err: any): ScenarioConfig;

  fails(): ScenarioConfig;

  retry(times: number): ScenarioConfig;

  timeout(timeout: number): ScenarioConfig;

  inject(inject: object): ScenarioConfig;

  config(config: object): ScenarioConfig;

  config(helperName: string, config: object): ScenarioConfig;
}

interface ILocator {
  xpath?: string;
  css?: string;
  name?: string;
  value?: string;
  frame?: string;
  android?: string;
  ios?: string;
}

declare class Helper {
  /** Abstract method to provide required config options */
  static _config(): any;

  /** Abstract method to validate config */
  _validateConfig<T>(config: T): T;

  /** Sets config for current test */
  _setConfig(opts: any): void;

  /** Hook executed before all tests */
  _init(): void;

  /** Hook executed before each test. */
  _before(): void;

  /** Hook executed after each test */
  _after(): void;

  /**
   * Hook provides a test details
   * Executed in the very beginning of a test
   */
  _test(test: () => void): void;

  /** Hook executed after each passed test */
  _passed(test: () => void): void;

  /** Hook executed after each failed test */
  _failed(test: () => void): void;

  /** Hook executed before each step */
  _beforeStep(step: () => void): void;

  /** Hook executed after each step */
  _afterStep(step: () => void): void;

  /** Hook executed before each suite */
  _beforeSuite(suite: () => void): void;

  /** Hook executed after each suite */
  _afterSuite(suite: () => void): void;

  /** Hook executed after all tests are executed */
  _finishTest(suite: () => void): void;

  /**Access another configured helper: this.helpers['AnotherHelper'] */
  readonly helpers: any;

  /** Print debug message to console (outputs only in debug mode) */
  debug(msg: string): void;

  debugSection(section: string, msg: string): void;
}

declare class Locator implements ILocator {
  xpath?: string;

  css?: string;

  name?: string;

  value?: string;

  frame?: string;

  android?: string;

  ios?: string;

  or(locator: string): Locator;

  find(locator: string): Locator;

  withChild(locator: string): Locator;

  find(locator: string): Locator;

  at(position: number): Locator;

  first(): Locator;

  last(): Locator;

  inside(locator: string): Locator;

  before(locator: string): Locator;

  after(locator: string): Locator;

  withText(locator: string): Locator;

  withAttr(locator: object): Locator;

  as(locator: string): Locator;
}

declare function actor(customSteps?: { [action: string]: (this: CodeceptJS.I, ...args: any[]) => void }): CodeceptJS.I;
declare function actor(customSteps?: {}): CodeceptJS.I;
declare function Feature(title: string, opts?: {}): FeatureConfig;
declare const Scenario: {
(title: string, callback: ICodeceptCallback): ScenarioConfig;
(title: string, opts: {}, callback: ICodeceptCallback): ScenarioConfig;
only(title: string, callback: ICodeceptCallback): ScenarioConfig;
only(title: string, opts: {}, callback: ICodeceptCallback): ScenarioConfig;
};
declare function xScenario(title: string, callback: ICodeceptCallback): ScenarioConfig;
declare function xScenario(title: string, opts: {}, callback: ICodeceptCallback): ScenarioConfig;
declare function Data(data: any): any;
declare function xData(data: any): any;
declare function Before(callback: ICodeceptCallback): void;
declare function BeforeSuite(callback: ICodeceptCallback): void;
declare function After(callback: ICodeceptCallback): void;
declare function AfterSuite(callback: ICodeceptCallback): void;

declare function locate(selector: string): Locator;
declare function locate(selector: ILocator): Locator;
declare function within(selector: string, callback: Function): Promise<any>;
declare function within(selector: ILocator, callback: Function): Promise<any>;
declare function session(selector: string, callback: Function): Promise<any>;
declare function session(selector: ILocator, callback: Function): Promise<any>;
declare function session(selector: string, config: any, callback: Function): Promise<any>;
declare function session(selector: ILocator, config: any, callback: Function): Promise<any>;
declare function pause(): void;

declare const codeceptjs: any;

declare namespace CodeceptJS {
  export interface I {
    setRequestTimeout(newTimeout: string): void;
    sendGetRequest(url: string, headers?: string): void;
    sendPostRequest(url: string, payload?: string, headers?: string): void;
    sendPatchRequest(url: string, payload: string, headers?: string): void;
    sendPutRequest(url: string, payload?: string, headers?: string): void;
    sendDeleteRequest(url: string, headers?: string): void;
    debug(msg: string): void;
    debugSection(section: string, msg: string): void;
    amAcceptingPopups(): void;
    acceptPopup(): void;
    amCancellingPopups(): void;
    cancelPopup(): void;
    seeInPopup(text: string): void;
    grabPopupText(): Promise<string>;
    amOnPage(url: string): void;
    resizeWindow(width: number, height: number): void;
    haveRequestHeaders(customHeaders: string): void;
    moveCursorTo(locator: ILocator, offsetX?: number, offsetY?: number): void;
    moveCursorTo(locator: string, offsetX?: number, offsetY?: number): void;
    dragAndDrop(srcElement: string, destElement: string): void;
    refreshPage(): void;
    scrollPageToTop(): void;
    scrollPageToBottom(): void;
    scrollTo(locator: ILocator, offsetX?: number, offsetY?: number): void;
    scrollTo(locator: string, offsetX?: number, offsetY?: number): void;
    seeInTitle(text: string): void;
    grabPageScrollPosition(): Promise<string>;
    seeTitleEquals(text: string): void;
    dontSeeInTitle(text: string): void;
    grabTitle(): Promise<string>;
    switchToNextTab(num?: number): void;
    switchToPreviousTab(num?: number): void;
    closeCurrentTab(): void;
    closeOtherTabs(): void;
    openNewTab(): void;
    grabNumberOfOpenTabs(): Promise<string>;
    seeElement(locator: ILocator): void;
    seeElement(locator: string): void;
    dontSeeElement(locator: ILocator): void;
    dontSeeElement(locator: string): void;
    seeElementInDOM(locator: ILocator): void;
    seeElementInDOM(locator: string): void;
    dontSeeElementInDOM(locator: ILocator): void;
    dontSeeElementInDOM(locator: string): void;
    click(locator: ILocator, context?: ILocator): void;
    click(locator: string, context?: ILocator): void;
    click(locator: ILocator, context?: string): void;
    click(locator: string, context?: string): void;
    clickLink(locator: ILocator, context?: ILocator): void;
    clickLink(locator: string, context?: ILocator): void;
    clickLink(locator: ILocator, context?: string): void;
    clickLink(locator: string, context?: string): void;
    downloadFile(locator: ILocator, customName: string): void;
    downloadFile(locator: string, customName: string): void;
    doubleClick(locator: ILocator, context?: ILocator): void;
    doubleClick(locator: string, context?: ILocator): void;
    doubleClick(locator: ILocator, context?: string): void;
    doubleClick(locator: string, context?: string): void;
    rightClick(locator: ILocator, context?: ILocator): void;
    rightClick(locator: string, context?: ILocator): void;
    rightClick(locator: ILocator, context?: string): void;
    rightClick(locator: string, context?: string): void;
    checkOption(field: ILocator, context?: ILocator): void;
    checkOption(field: string, context?: ILocator): void;
    checkOption(field: ILocator, context?: string): void;
    checkOption(field: string, context?: string): void;
    uncheckOption(field: ILocator, context?: ILocator): void;
    uncheckOption(field: string, context?: ILocator): void;
    uncheckOption(field: ILocator, context?: string): void;
    uncheckOption(field: string, context?: string): void;
    seeCheckboxIsChecked(field: ILocator): void;
    seeCheckboxIsChecked(field: string): void;
    dontSeeCheckboxIsChecked(field: ILocator): void;
    dontSeeCheckboxIsChecked(field: string): void;
    pressKey(key: string): void;
    fillField(field: ILocator, value: string): void;
    fillField(field: string, value: string): void;
    clearField(field: ILocator): void;
    clearField(field: string): void;
    appendField(field: ILocator, value: string): void;
    appendField(field: string, value: string): void;
    seeInField(field: ILocator, value: string): void;
    seeInField(field: string, value: string): void;
    dontSeeInField(field: ILocator, value: string): void;
    dontSeeInField(field: string, value: string): void;
    attachFile(locator: ILocator, pathToFile: string): void;
    attachFile(locator: string, pathToFile: string): void;
    selectOption(select: ILocator, option: string): void;
    selectOption(select: string, option: string): void;
    grabNumberOfVisibleElements(locator: ILocator): Promise<string>;
    grabNumberOfVisibleElements(locator: string): Promise<string>;
    seeInCurrentUrl(url: string): void;
    dontSeeInCurrentUrl(url: string): void;
    seeCurrentUrlEquals(url: string): void;
    dontSeeCurrentUrlEquals(url: string): void;
    see(text: string, context?: ILocator): void;
    see(text: string, context?: string): void;
    seeTextEquals(text: string, context?: ILocator): void;
    seeTextEquals(text: string, context?: string): void;
    dontSee(text: string, context?: ILocator): void;
    dontSee(text: string, context?: string): void;
    grabSource(): Promise<string>;
    grabBrowserLogs(): Promise<string>;
    grabCurrentUrl(): Promise<string>;
    seeInSource(text: string): void;
    dontSeeInSource(text: string): void;
    seeNumberOfElements(selector: string, num: number): void;
    seeNumberOfVisibleElements(locator: ILocator, num: number): void;
    seeNumberOfVisibleElements(locator: string, num: number): void;
    setCookie(cookie: string): void;
    seeCookie(name: string): void;
    dontSeeCookie(name: string): void;
    grabCookie(name: string): Promise<string>;
    clearCookie(name: string): void;
    executeScript(fn: Function): void;
    executeAsyncScript(fn: Function): void;
    grabTextFrom(locator: ILocator): Promise<string>;
    grabTextFrom(locator: string): Promise<string>;
    grabValueFrom(locator: ILocator): Promise<string>;
    grabValueFrom(locator: string): Promise<string>;
    grabHTMLFrom(locator: ILocator): Promise<string>;
    grabHTMLFrom(locator: string): Promise<string>;
    grabCssPropertyFrom(locator: ILocator, cssProperty: string): Promise<string>;
    grabCssPropertyFrom(locator: string, cssProperty: string): Promise<string>;
    seeCssPropertiesOnElements(locator: ILocator, cssProperties: string): void;
    seeCssPropertiesOnElements(locator: string, cssProperties: string): void;
    seeAttributesOnElements(locator: ILocator, attributes: string): void;
    seeAttributesOnElements(locator: string, attributes: string): void;
    dragSlider(locator: ILocator, offsetX?: number): void;
    dragSlider(locator: string, offsetX?: number): void;
    grabAttributeFrom(locator: ILocator, attr: string): Promise<string>;
    grabAttributeFrom(locator: string, attr: string): Promise<string>;
    saveScreenshot(fileName: string, fullPage: string): void;
    wait(sec: number): void;
    waitForEnabled(locator: ILocator, sec: number): void;
    waitForEnabled(locator: string, sec: number): void;
    waitForValue(field: ILocator, value: string, sec: number): void;
    waitForValue(field: string, value: string, sec: number): void;
    waitNumberOfVisibleElements(locator: ILocator, num: number, sec: number): void;
    waitNumberOfVisibleElements(locator: string, num: number, sec: number): void;
    waitForElement(locator: ILocator, sec: number): void;
    waitForElement(locator: string, sec: number): void;
    waitForVisible(locator: ILocator, sec: number): void;
    waitForVisible(locator: string, sec: number): void;
    waitForInvisible(locator: ILocator, sec: number): void;
    waitForInvisible(locator: string, sec: number): void;
    waitToHide(locator: ILocator, sec: number): void;
    waitToHide(locator: string, sec: number): void;
    waitInUrl(urlPart: string, sec?: number): void;
    waitUrlEquals(urlPart: string, sec?: number): void;
    waitForText(text: string, sec?: number, context?: ILocator): void;
    waitForText(text: string, sec?: number, context?: string): void;
    waitForRequest(urlOrPredicate: string, sec?: number): void;
    waitForResponse(urlOrPredicate: string, sec?: number): void;
    switchTo(locator: ILocator): void;
    switchTo(locator: string): void;
    waitForFunction(fn: Function, argsOrSec?: string, sec?: number): void;
    waitForNavigation(opts?: string): void;
    waitUntil(fn: Function, sec?: number): void;
    waitUntilExists(locator: ILocator, sec: number): void;
    waitUntilExists(locator: string, sec: number): void;
    waitForDetached(locator: ILocator, sec: number): void;
    waitForDetached(locator: string, sec: number): void;
    seeEquals(actual: string, expected: string, message: string): void;
    seeTextInclude(actual: string, expected: string, message: string): void;
    navigateToAuthenticatePage(): void;
    navigateToHomePage(): void;
    navigateToAdjustmentPage(): void;
    navigateToConfigPage(): void;
    navigateToCountFrequencyPage(): void;
    navigateToCountSheetPage(): void;
    navigateToCreateFrequencyPage(): void;
    navigateToInvoicePage(): void;
    navigateToOrderPage(): void;
    navigateToReceivePage(): void;
    navigateToSetupCategoryPage(): void;
    navigateToSetupItemPage(): void;
    navigateToSetupLocationPage(): void;
    navigateToSetupRecipePage(): void;
    navigateToSetupUOMPage(): void;
    navigateToSetupVendorPage(): void;
    navigateToSetItemFrequencyPage(): void;
    navigateToTransferPage(): void;
    navigateToWacActivityPage(): void;
    waitForClickable(locator: ILocator, timeout: string): void;
    waitForClickable(locator: string, timeout: string): void;
    waitForLoadingIconInvisible(timeout: string): void;
    waitForLoadingIconVisible(timeout: string): void;
    sendScreenShotToReportPortal(name: string, logLevel: string, message: string): void;
    setAuthenticateCookie(domain: string): void;
    waitInMilliseconds(milliseconds?: string): void;
    say: () => any;
    retryStep(opts: string): void;
  }

  export interface I_Authenticate {
    setRequestTimeout(): void;
    sendGetRequest(): void;
    sendPostRequest(): void;
    sendPatchRequest(): void;
    sendPutRequest(): void;
    sendDeleteRequest(): void;
    amAcceptingPopups(): void;
    acceptPopup(): void;
    amCancellingPopups(): void;
    cancelPopup(): void;
    seeInPopup(): void;
    grabPopupText(): Promise<string>;
    amOnPage(): void;
    resizeWindow(): void;
    haveRequestHeaders(): void;
    moveCursorTo(): void;
    dragAndDrop(): void;
    refreshPage(): void;
    scrollPageToTop(): void;
    scrollPageToBottom(): void;
    scrollTo(): void;
    seeInTitle(): void;
    grabPageScrollPosition(): Promise<string>;
    seeTitleEquals(): void;
    dontSeeInTitle(): void;
    grabTitle(): Promise<string>;
    switchToNextTab(): void;
    switchToPreviousTab(): void;
    closeCurrentTab(): void;
    closeOtherTabs(): void;
    openNewTab(): void;
    grabNumberOfOpenTabs(): Promise<string>;
    seeElement(): void;
    dontSeeElement(): void;
    seeElementInDOM(): void;
    dontSeeElementInDOM(): void;
    click(): void;
    clickLink(): void;
    downloadFile(): void;
    doubleClick(): void;
    rightClick(): void;
    checkOption(): void;
    uncheckOption(): void;
    seeCheckboxIsChecked(): void;
    dontSeeCheckboxIsChecked(): void;
    pressKey(): void;
    fillField(): void;
    clearField(): void;
    appendField(): void;
    seeInField(): void;
    dontSeeInField(): void;
    attachFile(): void;
    selectOption(): void;
    grabNumberOfVisibleElements(): Promise<string>;
    seeInCurrentUrl(): void;
    dontSeeInCurrentUrl(): void;
    seeCurrentUrlEquals(): void;
    dontSeeCurrentUrlEquals(): void;
    see(): void;
    seeTextEquals(): void;
    dontSee(): void;
    grabSource(): Promise<string>;
    grabBrowserLogs(): Promise<string>;
    grabCurrentUrl(): Promise<string>;
    seeInSource(): void;
    dontSeeInSource(): void;
    seeNumberOfElements(): void;
    seeNumberOfVisibleElements(): void;
    setCookie(): void;
    seeCookie(): void;
    dontSeeCookie(): void;
    grabCookie(): Promise<string>;
    clearCookie(): void;
    executeScript(): void;
    executeAsyncScript(): void;
    grabTextFrom(): Promise<string>;
    grabValueFrom(): Promise<string>;
    grabHTMLFrom(): Promise<string>;
    grabCssPropertyFrom(): Promise<string>;
    seeCssPropertiesOnElements(): void;
    seeAttributesOnElements(): void;
    dragSlider(): void;
    grabAttributeFrom(): Promise<string>;
    saveScreenshot(): void;
    wait(): void;
    waitForEnabled(): void;
    waitForValue(): void;
    waitNumberOfVisibleElements(): void;
    waitForElement(): void;
    waitForVisible(): void;
    waitForInvisible(): void;
    waitToHide(): void;
    waitInUrl(): void;
    waitUrlEquals(): void;
    waitForText(): void;
    waitForRequest(): void;
    waitForResponse(): void;
    switchTo(): void;
    waitForFunction(): void;
    waitForNavigation(): void;
    waitUntil(): void;
    waitUntilExists(): void;
    waitForDetached(): void;
    seeEquals(): void;
    seeTextInclude(): void;
    navigateToAuthenticatePage(): void;
    navigateToHomePage(): void;
    navigateToAdjustmentPage(): void;
    navigateToConfigPage(): void;
    navigateToCountFrequencyPage(): void;
    navigateToCountSheetPage(): void;
    navigateToCreateFrequencyPage(): void;
    navigateToInvoicePage(): void;
    navigateToOrderPage(): void;
    navigateToReceivePage(): void;
    navigateToSetupCategoryPage(): void;
    navigateToSetupItemPage(): void;
    navigateToSetupLocationPage(): void;
    navigateToSetupRecipePage(): void;
    navigateToSetupUOMPage(): void;
    navigateToSetupVendorPage(): void;
    navigateToSetItemFrequencyPage(): void;
    navigateToTransferPage(): void;
    navigateToWacActivityPage(): void;
    waitForClickable(): void;
    waitForLoadingIconInvisible(): void;
    waitForLoadingIconVisible(): void;
    sendScreenShotToReportPortal(): void;
    setAuthenticateCookie(): void;
    waitInMilliseconds(): void;
    say(msg: string, color?: string): void;
    retryStep(opts: string): void;
    open(): void;
    login(): void;
    isAt(): void;
  }

  export interface At_Home_I {
    setRequestTimeout(): void;
    sendGetRequest(): void;
    sendPostRequest(): void;
    sendPatchRequest(): void;
    sendPutRequest(): void;
    sendDeleteRequest(): void;
    amAcceptingPopups(): void;
    acceptPopup(): void;
    amCancellingPopups(): void;
    cancelPopup(): void;
    seeInPopup(): void;
    grabPopupText(): Promise<string>;
    amOnPage(): void;
    resizeWindow(): void;
    haveRequestHeaders(): void;
    moveCursorTo(): void;
    dragAndDrop(): void;
    refreshPage(): void;
    scrollPageToTop(): void;
    scrollPageToBottom(): void;
    scrollTo(): void;
    seeInTitle(): void;
    grabPageScrollPosition(): Promise<string>;
    seeTitleEquals(): void;
    dontSeeInTitle(): void;
    grabTitle(): Promise<string>;
    switchToNextTab(): void;
    switchToPreviousTab(): void;
    closeCurrentTab(): void;
    closeOtherTabs(): void;
    openNewTab(): void;
    grabNumberOfOpenTabs(): Promise<string>;
    seeElement(): void;
    dontSeeElement(): void;
    seeElementInDOM(): void;
    dontSeeElementInDOM(): void;
    click(): void;
    clickLink(): void;
    downloadFile(): void;
    doubleClick(): void;
    rightClick(): void;
    checkOption(): void;
    uncheckOption(): void;
    seeCheckboxIsChecked(): void;
    dontSeeCheckboxIsChecked(): void;
    pressKey(): void;
    fillField(): void;
    clearField(): void;
    appendField(): void;
    seeInField(): void;
    dontSeeInField(): void;
    attachFile(): void;
    selectOption(): void;
    grabNumberOfVisibleElements(): Promise<string>;
    seeInCurrentUrl(): void;
    dontSeeInCurrentUrl(): void;
    seeCurrentUrlEquals(): void;
    dontSeeCurrentUrlEquals(): void;
    see(): void;
    seeTextEquals(): void;
    dontSee(): void;
    grabSource(): Promise<string>;
    grabBrowserLogs(): Promise<string>;
    grabCurrentUrl(): Promise<string>;
    seeInSource(): void;
    dontSeeInSource(): void;
    seeNumberOfElements(): void;
    seeNumberOfVisibleElements(): void;
    setCookie(): void;
    seeCookie(): void;
    dontSeeCookie(): void;
    grabCookie(): Promise<string>;
    clearCookie(): void;
    executeScript(): void;
    executeAsyncScript(): void;
    grabTextFrom(): Promise<string>;
    grabValueFrom(): Promise<string>;
    grabHTMLFrom(): Promise<string>;
    grabCssPropertyFrom(): Promise<string>;
    seeCssPropertiesOnElements(): void;
    seeAttributesOnElements(): void;
    dragSlider(): void;
    grabAttributeFrom(): Promise<string>;
    saveScreenshot(): void;
    wait(): void;
    waitForEnabled(): void;
    waitForValue(): void;
    waitNumberOfVisibleElements(): void;
    waitForElement(): void;
    waitForVisible(): void;
    waitForInvisible(): void;
    waitToHide(): void;
    waitInUrl(): void;
    waitUrlEquals(): void;
    waitForText(): void;
    waitForRequest(): void;
    waitForResponse(): void;
    switchTo(): void;
    waitForFunction(): void;
    waitForNavigation(): void;
    waitUntil(): void;
    waitUntilExists(): void;
    waitForDetached(): void;
    seeEquals(): void;
    seeTextInclude(): void;
    navigateToAuthenticatePage(): void;
    navigateToHomePage(): void;
    navigateToAdjustmentPage(): void;
    navigateToConfigPage(): void;
    navigateToCountFrequencyPage(): void;
    navigateToCountSheetPage(): void;
    navigateToCreateFrequencyPage(): void;
    navigateToInvoicePage(): void;
    navigateToOrderPage(): void;
    navigateToReceivePage(): void;
    navigateToSetupCategoryPage(): void;
    navigateToSetupItemPage(): void;
    navigateToSetupLocationPage(): void;
    navigateToSetupRecipePage(): void;
    navigateToSetupUOMPage(): void;
    navigateToSetupVendorPage(): void;
    navigateToSetItemFrequencyPage(): void;
    navigateToTransferPage(): void;
    navigateToWacActivityPage(): void;
    waitForClickable(): void;
    waitForLoadingIconInvisible(): void;
    waitForLoadingIconVisible(): void;
    sendScreenShotToReportPortal(): void;
    setAuthenticateCookie(): void;
    waitInMilliseconds(): void;
    say(msg: string, color?: string): void;
    retryStep(opts: string): void;
    selectCompanyRadioElement(companyName: string): void;
    selectStore(storeName: string): void;
    selectCompany(companyName: string): void;
    open(): void;
    isAt(): void;
  }

  export interface At_Vendor_I {
    setRequestTimeout(): void;
    sendGetRequest(): void;
    sendPostRequest(): void;
    sendPatchRequest(): void;
    sendPutRequest(): void;
    sendDeleteRequest(): void;
    amAcceptingPopups(): void;
    acceptPopup(): void;
    amCancellingPopups(): void;
    cancelPopup(): void;
    seeInPopup(): void;
    grabPopupText(): Promise<string>;
    amOnPage(): void;
    resizeWindow(): void;
    haveRequestHeaders(): void;
    moveCursorTo(): void;
    dragAndDrop(): void;
    refreshPage(): void;
    scrollPageToTop(): void;
    scrollPageToBottom(): void;
    scrollTo(): void;
    seeInTitle(): void;
    grabPageScrollPosition(): Promise<string>;
    seeTitleEquals(): void;
    dontSeeInTitle(): void;
    grabTitle(): Promise<string>;
    switchToNextTab(): void;
    switchToPreviousTab(): void;
    closeCurrentTab(): void;
    closeOtherTabs(): void;
    openNewTab(): void;
    grabNumberOfOpenTabs(): Promise<string>;
    seeElement(): void;
    dontSeeElement(): void;
    seeElementInDOM(): void;
    dontSeeElementInDOM(): void;
    click(): void;
    clickLink(): void;
    downloadFile(): void;
    doubleClick(): void;
    rightClick(): void;
    checkOption(): void;
    uncheckOption(): void;
    seeCheckboxIsChecked(): void;
    dontSeeCheckboxIsChecked(): void;
    pressKey(): void;
    fillField(): void;
    clearField(): void;
    appendField(): void;
    seeInField(): void;
    dontSeeInField(): void;
    attachFile(): void;
    selectOption(): void;
    grabNumberOfVisibleElements(): Promise<string>;
    seeInCurrentUrl(): void;
    dontSeeInCurrentUrl(): void;
    seeCurrentUrlEquals(): void;
    dontSeeCurrentUrlEquals(): void;
    see(): void;
    seeTextEquals(): void;
    dontSee(): void;
    grabSource(): Promise<string>;
    grabBrowserLogs(): Promise<string>;
    grabCurrentUrl(): Promise<string>;
    seeInSource(): void;
    dontSeeInSource(): void;
    seeNumberOfElements(): void;
    seeNumberOfVisibleElements(): void;
    setCookie(): void;
    seeCookie(): void;
    dontSeeCookie(): void;
    grabCookie(): Promise<string>;
    clearCookie(): void;
    executeScript(): void;
    executeAsyncScript(): void;
    grabTextFrom(): Promise<string>;
    grabValueFrom(): Promise<string>;
    grabHTMLFrom(): Promise<string>;
    grabCssPropertyFrom(): Promise<string>;
    seeCssPropertiesOnElements(): void;
    seeAttributesOnElements(): void;
    dragSlider(): void;
    grabAttributeFrom(): Promise<string>;
    saveScreenshot(): void;
    wait(): void;
    waitForEnabled(): void;
    waitForValue(): void;
    waitNumberOfVisibleElements(): void;
    waitForElement(): void;
    waitForVisible(): void;
    waitForInvisible(): void;
    waitToHide(): void;
    waitInUrl(): void;
    waitUrlEquals(): void;
    waitForText(): void;
    waitForRequest(): void;
    waitForResponse(): void;
    switchTo(): void;
    waitForFunction(): void;
    waitForNavigation(): void;
    waitUntil(): void;
    waitUntilExists(): void;
    waitForDetached(): void;
    seeEquals(): void;
    seeTextInclude(): void;
    navigateToAuthenticatePage(): void;
    navigateToHomePage(): void;
    navigateToAdjustmentPage(): void;
    navigateToConfigPage(): void;
    navigateToCountFrequencyPage(): void;
    navigateToCountSheetPage(): void;
    navigateToCreateFrequencyPage(): void;
    navigateToInvoicePage(): void;
    navigateToOrderPage(): void;
    navigateToReceivePage(): void;
    navigateToSetupCategoryPage(): void;
    navigateToSetupItemPage(): void;
    navigateToSetupLocationPage(): void;
    navigateToSetupRecipePage(): void;
    navigateToSetupUOMPage(): void;
    navigateToSetupVendorPage(): void;
    navigateToSetItemFrequencyPage(): void;
    navigateToTransferPage(): void;
    navigateToWacActivityPage(): void;
    waitForClickable(): void;
    waitForLoadingIconInvisible(): void;
    waitForLoadingIconVisible(): void;
    sendScreenShotToReportPortal(): void;
    setAuthenticateCookie(): void;
    waitInMilliseconds(): void;
    say(msg: string, color?: string): void;
    retryStep(opts: string): void;
    selectStore(storeName: string): void;
    clickNotificationIcon(): void;
    clickUserProfileIcon(): void;
    clickHelpIcon(): void;
    clickToMarkAllReadNotifications(): void;
    clickToDismissAllNotifications(): void;
    inputSearchToWalkMe(search: string): void;
    addNewVendor(
      vendorName: string,
      vendorCode: string,
      address: string,
      generalLedger: string,
      country: string,
      isActive?: string
    ): void;
    seeNewVendorInVendorTable(vendorName: string, vendorCode: string, vendorStatus: string): void;
    seeNumberOfAssignStoreOfVendor(vendorName: string, numberAssignStores: string): void;
    assignVendorToStore(storeName: string, vendorName: string): void;
    assignAllVendorToStore(storeName: string): void;
    createVendorGroup(vendorName: string, groupName: string): void;
    seeNewVendorGroupInVendorGroupPanel(vendorGroupName: string): void;
    addNewVendorItem(vendorName: string, groupName: string, vendorItems: string): void;
    seeNewVendorItemInVendorCatalog(groupName: string, vendorItems: string): void;
    assignVendorItemToStore(storeName: string, vendorItems: string): void;
    assignAllVendorItemToStore(storeName: string): void;
    seeNumberOfAssignStoreOfVendorItems(vendorItems: string, numberAssignStores: string): void;
    open(): void;
    isAt(): void;
  }

  export interface At_Count_I {
    setRequestTimeout(): void;
    sendGetRequest(): void;
    sendPostRequest(): void;
    sendPatchRequest(): void;
    sendPutRequest(): void;
    sendDeleteRequest(): void;
    amAcceptingPopups(): void;
    acceptPopup(): void;
    amCancellingPopups(): void;
    cancelPopup(): void;
    seeInPopup(): void;
    grabPopupText(): Promise<string>;
    amOnPage(): void;
    resizeWindow(): void;
    haveRequestHeaders(): void;
    moveCursorTo(): void;
    dragAndDrop(): void;
    refreshPage(): void;
    scrollPageToTop(): void;
    scrollPageToBottom(): void;
    scrollTo(): void;
    seeInTitle(): void;
    grabPageScrollPosition(): Promise<string>;
    seeTitleEquals(): void;
    dontSeeInTitle(): void;
    grabTitle(): Promise<string>;
    switchToNextTab(): void;
    switchToPreviousTab(): void;
    closeCurrentTab(): void;
    closeOtherTabs(): void;
    openNewTab(): void;
    grabNumberOfOpenTabs(): Promise<string>;
    seeElement(): void;
    dontSeeElement(): void;
    seeElementInDOM(): void;
    dontSeeElementInDOM(): void;
    click(): void;
    clickLink(): void;
    downloadFile(): void;
    doubleClick(): void;
    rightClick(): void;
    checkOption(): void;
    uncheckOption(): void;
    seeCheckboxIsChecked(): void;
    dontSeeCheckboxIsChecked(): void;
    pressKey(): void;
    fillField(): void;
    clearField(): void;
    appendField(): void;
    seeInField(): void;
    dontSeeInField(): void;
    attachFile(): void;
    selectOption(): void;
    grabNumberOfVisibleElements(): Promise<string>;
    seeInCurrentUrl(): void;
    dontSeeInCurrentUrl(): void;
    seeCurrentUrlEquals(): void;
    dontSeeCurrentUrlEquals(): void;
    see(): void;
    seeTextEquals(): void;
    dontSee(): void;
    grabSource(): Promise<string>;
    grabBrowserLogs(): Promise<string>;
    grabCurrentUrl(): Promise<string>;
    seeInSource(): void;
    dontSeeInSource(): void;
    seeNumberOfElements(): void;
    seeNumberOfVisibleElements(): void;
    setCookie(): void;
    seeCookie(): void;
    dontSeeCookie(): void;
    grabCookie(): Promise<string>;
    clearCookie(): void;
    executeScript(): void;
    executeAsyncScript(): void;
    grabTextFrom(): Promise<string>;
    grabValueFrom(): Promise<string>;
    grabHTMLFrom(): Promise<string>;
    grabCssPropertyFrom(): Promise<string>;
    seeCssPropertiesOnElements(): void;
    seeAttributesOnElements(): void;
    dragSlider(): void;
    grabAttributeFrom(): Promise<string>;
    saveScreenshot(): void;
    wait(): void;
    waitForEnabled(): void;
    waitForValue(): void;
    waitNumberOfVisibleElements(): void;
    waitForElement(): void;
    waitForVisible(): void;
    waitForInvisible(): void;
    waitToHide(): void;
    waitInUrl(): void;
    waitUrlEquals(): void;
    waitForText(): void;
    waitForRequest(): void;
    waitForResponse(): void;
    switchTo(): void;
    waitForFunction(): void;
    waitForNavigation(): void;
    waitUntil(): void;
    waitUntilExists(): void;
    waitForDetached(): void;
    seeEquals(): void;
    seeTextInclude(): void;
    navigateToAuthenticatePage(): void;
    navigateToHomePage(): void;
    navigateToAdjustmentPage(): void;
    navigateToConfigPage(): void;
    navigateToCountFrequencyPage(): void;
    navigateToCountSheetPage(): void;
    navigateToCreateFrequencyPage(): void;
    navigateToInvoicePage(): void;
    navigateToOrderPage(): void;
    navigateToReceivePage(): void;
    navigateToSetupCategoryPage(): void;
    navigateToSetupItemPage(): void;
    navigateToSetupLocationPage(): void;
    navigateToSetupRecipePage(): void;
    navigateToSetupUOMPage(): void;
    navigateToSetupVendorPage(): void;
    navigateToSetItemFrequencyPage(): void;
    navigateToTransferPage(): void;
    navigateToWacActivityPage(): void;
    waitForClickable(): void;
    waitForLoadingIconInvisible(): void;
    waitForLoadingIconVisible(): void;
    sendScreenShotToReportPortal(): void;
    setAuthenticateCookie(): void;
    waitInMilliseconds(): void;
    say(msg: string, color?: string): void;
    retryStep(opts: string): void;
    selectStore(storeName: string): void;
    addLocation(locationName: string): void;
    addLocationWithNestedUnderOption(locationName: string, nestUnderLocationName: string): void;
    open(): void;
    isAt(): void;
  }

  export interface At_Order_I {
    setRequestTimeout(): void;
    sendGetRequest(): void;
    sendPostRequest(): void;
    sendPatchRequest(): void;
    sendPutRequest(): void;
    sendDeleteRequest(): void;
    amAcceptingPopups(): void;
    acceptPopup(): void;
    amCancellingPopups(): void;
    cancelPopup(): void;
    seeInPopup(): void;
    grabPopupText(): Promise<string>;
    amOnPage(): void;
    resizeWindow(): void;
    haveRequestHeaders(): void;
    moveCursorTo(): void;
    dragAndDrop(): void;
    refreshPage(): void;
    scrollPageToTop(): void;
    scrollPageToBottom(): void;
    scrollTo(): void;
    seeInTitle(): void;
    grabPageScrollPosition(): Promise<string>;
    seeTitleEquals(): void;
    dontSeeInTitle(): void;
    grabTitle(): Promise<string>;
    switchToNextTab(): void;
    switchToPreviousTab(): void;
    closeCurrentTab(): void;
    closeOtherTabs(): void;
    openNewTab(): void;
    grabNumberOfOpenTabs(): Promise<string>;
    seeElement(): void;
    dontSeeElement(): void;
    seeElementInDOM(): void;
    dontSeeElementInDOM(): void;
    click(): void;
    clickLink(): void;
    downloadFile(): void;
    doubleClick(): void;
    rightClick(): void;
    checkOption(): void;
    uncheckOption(): void;
    seeCheckboxIsChecked(): void;
    dontSeeCheckboxIsChecked(): void;
    pressKey(): void;
    fillField(): void;
    clearField(): void;
    appendField(): void;
    seeInField(): void;
    dontSeeInField(): void;
    attachFile(): void;
    selectOption(): void;
    grabNumberOfVisibleElements(): Promise<string>;
    seeInCurrentUrl(): void;
    dontSeeInCurrentUrl(): void;
    seeCurrentUrlEquals(): void;
    dontSeeCurrentUrlEquals(): void;
    see(): void;
    seeTextEquals(): void;
    dontSee(): void;
    grabSource(): Promise<string>;
    grabBrowserLogs(): Promise<string>;
    grabCurrentUrl(): Promise<string>;
    seeInSource(): void;
    dontSeeInSource(): void;
    seeNumberOfElements(): void;
    seeNumberOfVisibleElements(): void;
    setCookie(): void;
    seeCookie(): void;
    dontSeeCookie(): void;
    grabCookie(): Promise<string>;
    clearCookie(): void;
    executeScript(): void;
    executeAsyncScript(): void;
    grabTextFrom(): Promise<string>;
    grabValueFrom(): Promise<string>;
    grabHTMLFrom(): Promise<string>;
    grabCssPropertyFrom(): Promise<string>;
    seeCssPropertiesOnElements(): void;
    seeAttributesOnElements(): void;
    dragSlider(): void;
    grabAttributeFrom(): Promise<string>;
    saveScreenshot(): void;
    wait(): void;
    waitForEnabled(): void;
    waitForValue(): void;
    waitNumberOfVisibleElements(): void;
    waitForElement(): void;
    waitForVisible(): void;
    waitForInvisible(): void;
    waitToHide(): void;
    waitInUrl(): void;
    waitUrlEquals(): void;
    waitForText(): void;
    waitForRequest(): void;
    waitForResponse(): void;
    switchTo(): void;
    waitForFunction(): void;
    waitForNavigation(): void;
    waitUntil(): void;
    waitUntilExists(): void;
    waitForDetached(): void;
    seeEquals(): void;
    seeTextInclude(): void;
    navigateToAuthenticatePage(): void;
    navigateToHomePage(): void;
    navigateToAdjustmentPage(): void;
    navigateToConfigPage(): void;
    navigateToCountFrequencyPage(): void;
    navigateToCountSheetPage(): void;
    navigateToCreateFrequencyPage(): void;
    navigateToInvoicePage(): void;
    navigateToOrderPage(): void;
    navigateToReceivePage(): void;
    navigateToSetupCategoryPage(): void;
    navigateToSetupItemPage(): void;
    navigateToSetupLocationPage(): void;
    navigateToSetupRecipePage(): void;
    navigateToSetupUOMPage(): void;
    navigateToSetupVendorPage(): void;
    navigateToSetItemFrequencyPage(): void;
    navigateToTransferPage(): void;
    navigateToWacActivityPage(): void;
    waitForClickable(): void;
    waitForLoadingIconInvisible(): void;
    waitForLoadingIconVisible(): void;
    sendScreenShotToReportPortal(): void;
    setAuthenticateCookie(): void;
    waitInMilliseconds(): void;
    say(msg: string, color?: string): void;
    retryStep(opts: string): void;
    openAndSelectStore(storeName: string): void;
    addNewOrder(vendorName: string, deliveryDate: string, coverUntilDate: string): void;
    getOrderItemCode(): void;
    getOrderItemHrefLink(): void;
    seeNewOrderInOrderTable(
      vendorName: string,
      orderItemHrefLink: string,
      orderItemCode: string,
      orderDate: string
    ): void;
    addNewOrderItems(vendorName: string, vendorGroup: string, orderItemHrefLink: string, vendorItems: string): void;
    seeOrderInOrderTableWithCorrectTotalCost(
      vendorName: string,
      orderItemHrefLink: string,
      orderItemCode: string,
      vendorItems: string
    ): void;
    submitOrder(vendorName: string, orderItemHrefLink: string): void;
    seeOrderSubmitSuccessfully(
      vendorName: string,
      orderItemHrefLink: string,
      orderItemCode: string,
      vendorItems: string
    ): void;
    open(): void;
    isAt(): void;
  }

  export interface At_Receive_I {
    setRequestTimeout(): void;
    sendGetRequest(): void;
    sendPostRequest(): void;
    sendPatchRequest(): void;
    sendPutRequest(): void;
    sendDeleteRequest(): void;
    amAcceptingPopups(): void;
    acceptPopup(): void;
    amCancellingPopups(): void;
    cancelPopup(): void;
    seeInPopup(): void;
    grabPopupText(): Promise<string>;
    amOnPage(): void;
    resizeWindow(): void;
    haveRequestHeaders(): void;
    moveCursorTo(): void;
    dragAndDrop(): void;
    refreshPage(): void;
    scrollPageToTop(): void;
    scrollPageToBottom(): void;
    scrollTo(): void;
    seeInTitle(): void;
    grabPageScrollPosition(): Promise<string>;
    seeTitleEquals(): void;
    dontSeeInTitle(): void;
    grabTitle(): Promise<string>;
    switchToNextTab(): void;
    switchToPreviousTab(): void;
    closeCurrentTab(): void;
    closeOtherTabs(): void;
    openNewTab(): void;
    grabNumberOfOpenTabs(): Promise<string>;
    seeElement(): void;
    dontSeeElement(): void;
    seeElementInDOM(): void;
    dontSeeElementInDOM(): void;
    click(): void;
    clickLink(): void;
    downloadFile(): void;
    doubleClick(): void;
    rightClick(): void;
    checkOption(): void;
    uncheckOption(): void;
    seeCheckboxIsChecked(): void;
    dontSeeCheckboxIsChecked(): void;
    pressKey(): void;
    fillField(): void;
    clearField(): void;
    appendField(): void;
    seeInField(): void;
    dontSeeInField(): void;
    attachFile(): void;
    selectOption(): void;
    grabNumberOfVisibleElements(): Promise<string>;
    seeInCurrentUrl(): void;
    dontSeeInCurrentUrl(): void;
    seeCurrentUrlEquals(): void;
    dontSeeCurrentUrlEquals(): void;
    see(): void;
    seeTextEquals(): void;
    dontSee(): void;
    grabSource(): Promise<string>;
    grabBrowserLogs(): Promise<string>;
    grabCurrentUrl(): Promise<string>;
    seeInSource(): void;
    dontSeeInSource(): void;
    seeNumberOfElements(): void;
    seeNumberOfVisibleElements(): void;
    setCookie(): void;
    seeCookie(): void;
    dontSeeCookie(): void;
    grabCookie(): Promise<string>;
    clearCookie(): void;
    executeScript(): void;
    executeAsyncScript(): void;
    grabTextFrom(): Promise<string>;
    grabValueFrom(): Promise<string>;
    grabHTMLFrom(): Promise<string>;
    grabCssPropertyFrom(): Promise<string>;
    seeCssPropertiesOnElements(): void;
    seeAttributesOnElements(): void;
    dragSlider(): void;
    grabAttributeFrom(): Promise<string>;
    saveScreenshot(): void;
    wait(): void;
    waitForEnabled(): void;
    waitForValue(): void;
    waitNumberOfVisibleElements(): void;
    waitForElement(): void;
    waitForVisible(): void;
    waitForInvisible(): void;
    waitToHide(): void;
    waitInUrl(): void;
    waitUrlEquals(): void;
    waitForText(): void;
    waitForRequest(): void;
    waitForResponse(): void;
    switchTo(): void;
    waitForFunction(): void;
    waitForNavigation(): void;
    waitUntil(): void;
    waitUntilExists(): void;
    waitForDetached(): void;
    seeEquals(): void;
    seeTextInclude(): void;
    navigateToAuthenticatePage(): void;
    navigateToHomePage(): void;
    navigateToAdjustmentPage(): void;
    navigateToConfigPage(): void;
    navigateToCountFrequencyPage(): void;
    navigateToCountSheetPage(): void;
    navigateToCreateFrequencyPage(): void;
    navigateToInvoicePage(): void;
    navigateToOrderPage(): void;
    navigateToReceivePage(): void;
    navigateToSetupCategoryPage(): void;
    navigateToSetupItemPage(): void;
    navigateToSetupLocationPage(): void;
    navigateToSetupRecipePage(): void;
    navigateToSetupUOMPage(): void;
    navigateToSetupVendorPage(): void;
    navigateToSetItemFrequencyPage(): void;
    navigateToTransferPage(): void;
    navigateToWacActivityPage(): void;
    waitForClickable(): void;
    waitForLoadingIconInvisible(): void;
    waitForLoadingIconVisible(): void;
    sendScreenShotToReportPortal(): void;
    setAuthenticateCookie(): void;
    waitInMilliseconds(): void;
    say(msg: string, color?: string): void;
    retryStep(opts: string): void;
    searchReceiveItem(vendorName: string): void;
    open(): void;
    isAt(): void;
  }
}

declare module 'codeceptjs' {
  export = CodeceptJS;
}