
package com.mh.ta.core.report.extent;

import com.aventstack.extentreports.AnalysisStrategy;
import com.aventstack.extentreports.ExtentReports;
import com.aventstack.extentreports.reporter.ExtentHtmlReporter;
import com.aventstack.extentreports.reporter.configuration.ChartLocation;
import com.aventstack.extentreports.reporter.configuration.Theme;

/**
 * @author minhhoang
 *
 */
public class ReportExtend {
	private ReportExtend() {
		throw new IllegalStateException("Report utility class");
	}

	private static ExtentReports instance;

	public static ExtentReports getInstance() {
		if (instance == null)
			createInstance("test-output/extent.html");
		return instance;
	}

	public static synchronized ExtentReports createInstance(String fileName) {
		ExtentHtmlReporter htmlReporter = new ExtentHtmlReporter(fileName);
		htmlReporter.config().setTestViewChartLocation(ChartLocation.TOP);
		htmlReporter.config().setChartVisibilityOnOpen(true);
		htmlReporter.config().setTheme(Theme.STANDARD);
		htmlReporter.config().setDocumentTitle(fileName);
		htmlReporter.config().setEncoding("utf-8");
		htmlReporter.config().setReportName(fileName);
		instance = new ExtentReports();
		instance.setAnalysisStrategy(AnalysisStrategy.TEST);
		instance.attachReporter(htmlReporter);
		return instance;
	}

	public static synchronized void createReport() {
		if (instance != null) {
			instance.setAnalysisStrategy(AnalysisStrategy.CLASS);
			instance.flush();
		}
	}

	public static synchronized ExtentHtmlReporter createHTMLReportInstance(String path) {
		return new ExtentHtmlReporter(path);
	}
}
