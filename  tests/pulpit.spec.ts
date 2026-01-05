import { test, expect } from '@playwright/test';

test.describe('Pulpit tests', () => {
  test.beforeEach(async ({ page }) => {
    const userId = 'testlogin';
    const userPassword = 'test1234';

    await page.goto('/');
    await page.getByTestId('login-input').fill(userId);
    await page.getByTestId('password-input').fill(userPassword);
    await page.getByTestId('login-button').click();
    await page.waitForLoadState('networkidle'); // needed to load everything properly
  });

  test('quick payment with correct data', async ({ page }) => {
    // Arrange
    const transferReceiver = 'Chuck Demobankowy';
    const transferAmount = '150';
    const transferTitle = 'Zwrot środków';

    // Act
    await page
      .locator('#widget_1_transfer_receiver')
      .selectOption({ label: transferReceiver });
    await page.locator('#widget_1_transfer_amount').fill(transferAmount);
    await page.locator('#widget_1_transfer_title').fill(transferTitle);

    await page.locator('#execute_btn').click(); // await page.getByRole('button', { name: 'wykonaj' }).click();
    await page.getByTestId('close-button').click();

    // Assert
    await expect(page.locator('#show_messages')).toHaveText(
      `Przelew wykonany! ${transferReceiver} - ${transferAmount},00PLN - ${transferTitle}`,
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
    const topupReceiver = '504 xxx xxx';
    const topupAmount = '100';
    const initialBalance = await page.locator('#money_value').innerText();
    const expectedBalance = Number(initialBalance) - Number(topupAmount);

    // Act
    await page.locator('#widget_1_topup_receiver').selectOption(topupReceiver);
    await page.locator('#widget_1_topup_amount').selectOption(topupAmount);
    await page.locator('#uniform-widget_1_topup_agreement span').click();
    await page.getByRole('button', { name: 'doładuj telefon' }).click();
    await page.getByTestId('close-button').click();

    // Assert
    await expect(page.locator('#money_value')).toHaveText(`${expectedBalance}`);
  });
});
