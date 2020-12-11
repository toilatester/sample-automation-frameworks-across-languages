from Core.Runner.TestRunnerHtml import HTMLTestRunner
from TestGUI import *
import unittest

loader = unittest.TestLoader()
suites = unittest.TestSuite()
runner = HTMLTestRunner()

suites.addTests(loader.loadTestsFromTestCase(AppearanceTests))
suites.addTests(loader.loadTestsFromTestCase(ChangePasswordTests))
suites.addTests(loader.loadTestsFromTestCase(CreateBotFeatureTests))
suites.addTests(loader.loadTestsFromTestCase(FeedbackTests))
suites.addTests(loader.loadTestsFromTestCase(ForgotPasswordTests))
suites.addTests(loader.loadTestsFromTestCase(IntegrationTest))
suites.addTests(loader.loadTestsFromTestCase(KnowledgeFeatureTests))
suites.addTests(loader.loadTestsFromTestCase(LoginFeatureTests))
suites.addTests(loader.loadTestsFromTestCase(RegisterFeatureTests))

runner.run(suites)
