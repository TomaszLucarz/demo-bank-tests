import { test, expect } from '@playwright/test';
import { loginData } from '../test-data/login.data';
import { LoginPage } from '../pages/login.page';
import { log } from 'node:console';

test.describe('User login to Demobank', () => {
  test.beforeEach(async ({ page }) => {
    const url = 'https://demo-bank.vercel.app/';
    await page.goto('/');
  });

  test('successful login with correct credentials', async ({ page }) => {
    // Arrange
    const userId = loginData.userId;
    const userPassword = loginData.userPassword;
    const expectedUsername = 'Jan Demobankowy';

    // Act
    const loginPage = new LoginPage(page);
    await loginPage.loginInput.fill(userId);
    await loginPage.passwordInput.fill(userPassword);
    await loginPage.loginButton.click();

    // Assert
    await expect(page.getByTestId('user-name')).toHaveText(expectedUsername);
  });

  test('unsuccessful login with incorrect credentials with incorrect username', async ({
    page,
  }) => {
    // Arrange
    const incorrectUserId = 'test';
    const expectedLoginErrorText = 'identyfikator ma min. 8 znaków';

    // Act
    const loginPage = new LoginPage(page);
    await loginPage.loginInput.fill(incorrectUserId);
    await loginPage.passwordInput.click();

    // Assert
    await expect(loginPage.loginError).toHaveText(expectedLoginErrorText);
  });

  test('unsuccessful login with incorrect credentials with too short password', async ({
    page,
  }) => {
    // Arrange
    const userId = loginData.userId;
    const incorrectUserPassword = 'test';
    const expectedPasswordErrorText = 'hasło ma min. 8 znaków';

    // Act
    const loginPage = new LoginPage(page);
    await loginPage.loginInput.fill(userId);
    await loginPage.passwordInput.fill(incorrectUserPassword);
    await loginPage.loginInput.click();

    // Assert
    await expect(loginPage.passwordError).toHaveText(expectedPasswordErrorText);
  });
});
