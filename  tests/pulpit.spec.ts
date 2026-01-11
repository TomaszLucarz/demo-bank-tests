import { test, expect } from '@playwright/test';
import { loginData } from '../test-data/login.data';
import { LoginPage } from '../pages/login.page';
import { PulpitPage } from '../pages/pulpit.page';

test.describe('Pulpit tests', () => {
  test.beforeEach(async ({ page }) => {
    const userId = loginData.userId;
    const userPassword = loginData.userPassword;
    await page.goto('/');
    const loginPage = new LoginPage(page);
    await loginPage.loginInput.fill(userId);
    await loginPage.passwordInput.fill(userPassword);
    await loginPage.loginButton.click();
    await page.waitForLoadState('networkidle'); // needed to load everything properly
  });

  test('quick payment with correct data', async ({ page }) => {
    // Arrange
    const transferReceiver = 'Chuck Demobankowy';
    const transferAmount = '150';
    const transferTitle = 'Zwrot środków';
    const expectedPaymentMessage = `Przelew wykonany! ${transferReceiver} - ${transferAmount},00PLN - ${transferTitle}`;

    // Act
    const pulpitPage = new PulpitPage(page);
    await pulpitPage.transferReceiverSelect.selectOption({
      label: transferReceiver,
    });
    await pulpitPage.transferAmountInput.fill(transferAmount);
    await pulpitPage.transferTitleInput.fill(transferTitle);
    await pulpitPage.executeTransferButton.click(); // await page.getByRole('button', { name: 'wykonaj' }).click();
    await pulpitPage.closeButton.click();

    // Assert
    await expect(pulpitPage.expectedMessageLocator).toHaveText(
      expectedPaymentMessage,
    );
  });

  test('successful mobile top-up', async ({ page }) => {
    // Arrange
    const topupReceiver = '504 xxx xxx';
    const topupAmount = '100';
    const expectedMessage = `Doładowanie wykonane! ${topupAmount},00PLN na numer ${topupReceiver}`;

    // Act
    await page.locator('#widget_1_topup_receiver').selectOption(topupReceiver);
    await page.locator('#widget_1_topup_amount').selectOption(topupAmount);
    await page.locator('#uniform-widget_1_topup_agreement span').click();
    await page.getByRole('button', { name: 'doładuj telefon' }).click();
    await page.getByTestId('close-button').click();

    // Assert
    await expect(page.locator('#show_messages')).toHaveText(expectedMessage);
  });

  test('correct balance after successful mobile top-up', async ({ page }) => {
    // Arrange
    const pulpitPage = new PulpitPage(page);
    const topupReceiver = '504 xxx xxx';
    const topupAmount = '100';
    const initialBalance = await pulpitPage.moneyValueLocator.innerText();
    const expectedBalance = Number(initialBalance) - Number(topupAmount);

    // Act
    await pulpitPage.topupReceiverSelect.selectOption(topupReceiver);
    await pulpitPage.topupAmountSelect.selectOption(topupAmount);
    await pulpitPage.topupAgreementCheckbox.click();
    await pulpitPage.executeTopupButton.click();
    await pulpitPage.closeButton.click();

    // Assert
    await expect(pulpitPage.moneyValueLocator).toHaveText(`${expectedBalance}`);
  });
});
