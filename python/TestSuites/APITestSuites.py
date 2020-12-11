from Core.Runner.TestRunnerHtml import HTMLTestRunner
from TestAPI import SignUpTest, CreateBotTest, SignInTest, AddUrlTest, AddPersonalityTest, \
    DeletePersonalityTest, UpdatePersonalityTest, ChangeAppearanceTest
import unittest

loader = unittest.TestLoader()
suites = unittest.TestSuite()
runner = HTMLTestRunner()
suites.addTests(loader.loadTestsFromTestCase(SignInTest))
suites.addTests(loader.loadTestsFromTestCase(SignUpTest))
suites.addTests(loader.loadTestsFromTestCase(AddUrlTest))
suites.addTests(loader.loadTestsFromTestCase(CreateBotTest))
suites.addTests(loader.loadTestsFromTestCase(AddPersonalityTest))
suites.addTests(loader.loadTestsFromTestCase(UpdatePersonalityTest))
suites.addTests(loader.loadTestsFromTestCase(DeletePersonalityTest))
suites.addTests(loader.loadTestsFromTestCase(ChangeAppearanceTest))
runner.run(suites)
