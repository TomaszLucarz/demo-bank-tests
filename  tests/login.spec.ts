import { test, expect } from '@playwright/test';
import { loginData } from '../test-data/login.data';
import { LoginPage } from '../pages/login.page';
import { log } from 'node:console';
import { PulpitPage } from '../pages/pulpit.page';

test.describe('User login to Demobank', () => {
  test.describe.configure({ retries: 3 });
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    const url = 'https://demo-bank.vercel.app/';
    await page.goto('/');
    loginPage = new LoginPage(page);
  });

  test(
    'successful login with correct credentials',
    {
      tag: ['@login', '@smoke'],
      annotation: {
        type: 'Happy path',
        description: 'Basic happy path test for login',
      },
    },
    async ({ page }) => {
      // Arrange
      const userId = loginData.userId;
      const userPassword = loginData.userPassword;
      const expectedUsername = 'Jan Demobankowy';

      // Act
      await loginPage.login(userId, userPassword);
      await page.waitForLoadState('domcontentloaded'); // needed to load everything properly

      // Assert
      const pulpitPage = new PulpitPage(page);
      await expect(pulpitPage.usernameTextLocator).toHaveText(expectedUsername);
    },
  );

  test(
    'unsuccessful login with incorrect credentials with incorrect username',
    { tag: ['@login', '@unhappy path'] },
    async ({ page }) => {
      // Arrange
      const incorrectUserId = 'test';
      const expectedLoginErrorText = 'identyfikator ma min. 8 znaków';

      // Act
      await loginPage.loginInput.fill(incorrectUserId);
      await loginPage.passwordInput.click();

      // Assert
      await expect(loginPage.loginError).toHaveText(expectedLoginErrorText);
    },
  );

  test(
    'unsuccessful login with incorrect credentials with too short password',
    { tag: ['@login', '@unhappy path'] },
    async ({ page }) => {
      // Arrange
      const userId = loginData.userId;
      const incorrectUserPassword = 'test';
      const expectedPasswordErrorText = 'hasło ma min. 8 znaków';

      // Act
      await loginPage.loginInput.fill(userId);
      await loginPage.passwordInput.fill(incorrectUserPassword);
      await loginPage.loginInput.click();
      // Assert
      await expect(loginPage.passwordError).toHaveText(
        expectedPasswordErrorText,
      );
    },
  );
});
