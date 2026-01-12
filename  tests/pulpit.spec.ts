import { test, expect } from '@playwright/test';
import { loginData } from '../test-data/login.data';
import { LoginPage } from '../pages/login.page';
import { PulpitPage } from '../pages/pulpit.page';

test.describe('Pulpit tests', () => {
  let pulpitPage: PulpitPage;
  test.beforeEach(async ({ page }) => {
    const userId = loginData.userId;
    const userPassword = loginData.userPassword;
    await page.goto('/');
    const loginPage = new LoginPage(page);
    await loginPage.login(userId, userPassword);

    await page.waitForLoadState('networkidle'); // needed to load everything properly
    pulpitPage = new PulpitPage(page);
  });

  test(
    'quick payment with correct data',
    { tag: ['@pulpit', '@integration'] },
    async ({ page }) => {
      // Arrange
      const transferReceiver = 'Chuck Demobankowy';
      const transferAmount = '150';
      const transferTitle = 'Zwrot środków';
      const expectedPaymentMessage = `Przelew wykonany! ${transferReceiver} - ${transferAmount},00PLN - ${transferTitle}`;

      // Act
      await pulpitPage.executeQuickPayment(
        transferReceiver,
        transferAmount,
        transferTitle,
      );

      // Assert
      await expect(pulpitPage.expectedMessageLocator).toHaveText(
        expectedPaymentMessage,
      );
    },
  );

  test(
    'successful mobile top-up with correct data',
    { tag: ['@pulpit', '@integration'] },
    async ({ page }) => {
      // Arrange
      const topupReceiver = '504 xxx xxx';
      const topupAmount = '100';
      const expectedMessage = `Doładowanie wykonane! ${topupAmount},00PLN na numer ${topupReceiver}`;

      // Act
      await pulpitPage.executeMobileTopup(topupReceiver, topupAmount);

      // Assert
      await expect(page.locator('#show_messages')).toHaveText(expectedMessage);
    },
  );

  test(
    'correct balance after successful mobile top-up',
    { tag: ['@pulpit', '@integration'] },
    async ({ page }) => {
      // Arrange
      const topupReceiver = '504 xxx xxx';
      const topupAmount = '100';
      const initialBalance = await pulpitPage.moneyValueLocator.innerText();
      const expectedBalance = Number(initialBalance) - Number(topupAmount);

      // Act
      await pulpitPage.executeMobileTopup(topupReceiver, topupAmount);

      // Assert
      await expect(pulpitPage.moneyValueLocator).toHaveText(
        `${expectedBalance}`,
      );
    },
  );
});
