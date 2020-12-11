const { BaseComponent } = require("../../base.component");
const { action } = require("../../../core/actions");

class RightSideBarComponent extends BaseComponent {
    constructor() {
        super($("#rightslidebar"));
    }

    get btnChangePassword() {
        return this.childElement(by.css("change-password a"))
    }

    get btnExpand() {
        return this.childElement(by.css("div#acc-info-name span.icon-expand_more"));
    }

    get btnLogout() {
        return this.childElement(by.css("div#acc-info-name div.logout-panel"))
    }

    async logout() {
        let isLogoutBtnPresented = await this.btnLogout.isPresent();
        if (!isLogoutBtnPresented) {
            await action.click(this.btnExpand);
            Logger.info("Clicked on expand button");
        }
        await action.click(this.btnLogout);
    }
}

exports.RightSideBarComponent = RightSideBarComponent;