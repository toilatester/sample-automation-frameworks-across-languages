from Core.Runner.TestRunnerHtml import HTMLTestRunner
from TestVisualAppearance.TestAdminPages import TestAdminPages
from TestVisualAppearance.TestAuthenticationPages import TestAuthenticationPages
import unittest

loader = unittest.TestLoader()
suites = unittest.TestSuite()
runner = HTMLTestRunner()

suites.addTests(loader.loadTestsFromTestCase(TestAdminPages))
suites.addTests(loader.loadTestsFromTestCase(TestAuthenticationPages))

runner.run(suites)
