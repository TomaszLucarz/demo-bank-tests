import { test, expect } from '@playwright/test';

test.describe('User login to Demobank', () => {
  test.beforeEach(async ({ page }) => {
    const url = 'https://demo-bank.vercel.app/';
    await page.goto('/');
  });

  test('successful login with correct credentials', async ({ page }) => {
    // Arrange
    const userId = 'testlogin';
    const userPassword = 'test1234';
    const expectedUsername = 'Jan Demobankowy';

    // Act
    await page.getByTestId('login-input').fill(userId);
    await page.getByTestId('password-input').fill(userPassword);
    await page.getByTestId('login-button').click();

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
    await page.getByTestId('login-input').fill(incorrectUserId);
    await page.getByTestId('password-input').click();

    // Assert
    await expect(page.getByTestId('error-login-id')).toHaveText(
      expectedLoginErrorText,
    );
  });

  test('unsuccessful login with incorrect credentials with too short password', async ({
    page,
  }) => {
    // Arrange
    const userId = 'testlogin';
    const incorrectUserPassword = 'test';
    const expectedPasswordErrorText = 'hasło ma min. 8 znaków';

    // Act
    await page.getByTestId('login-input').fill(userId);
    await page.getByTestId('password-input').fill(incorrectUserPassword);
    await page.getByTestId('password-input').blur();

    // Assert
    await expect(page.getByTestId('error-login-password')).toHaveText(
      expectedPasswordErrorText,
    );
  });
});
