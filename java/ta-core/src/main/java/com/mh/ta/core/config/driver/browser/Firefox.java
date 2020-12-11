
package com.mh.ta.core.config.driver.browser;

import static org.openqa.selenium.remote.DesiredCapabilities.firefox;

import org.openqa.selenium.WebDriver;
import org.openqa.selenium.firefox.FirefoxDriver;
import org.openqa.selenium.firefox.FirefoxProfile;
import org.openqa.selenium.remote.DesiredCapabilities;

/**
 * @author minhhoang
 *
 */
class Firefox implements SeleniumDriver {
	private FirefoxProfile profile;
	private DesiredCapabilities capabilities = firefox();

	public WebDriver createDriver() {
		DesiredCapabilities cap = DesiredCapabilities.firefox();
		cap.setCapability(FirefoxDriver.PROFILE, getProfile());
		return new FirefoxDriver(cap.merge(getCapabilities()));		
	}

	private FirefoxProfile getProfile() {
		if (profile == null) {
			profile = new FirefoxProfile();
			profile.setAcceptUntrustedCertificates(true);
			profile.setAlwaysLoadNoFocusLib(true);
			profile.setAssumeUntrustedCertificateIssuer(true);
		}
		return profile;
	}

	private DesiredCapabilities getCapabilities() {
		if (capabilities == null)
			capabilities = firefox();
		return capabilities;
	}

	public void setDriverOptions(Object options) {
		this.profile = (FirefoxProfile) options;
	}

	public void setCapabilities(Object capabilities) {
		this.capabilities = (DesiredCapabilities) capabilities;
	}
}
