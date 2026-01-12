import { test, expect } from '@playwright/test';
import { loginData } from '../test-data/login.data';
import { LoginPage } from '../pages/login.page';
import { PaymentPage } from '../pages/payment.page';
import { PulpitPage } from '../pages/pulpit.page';

test.describe('Payment tests', () => {
  let paymentPage: PaymentPage;

  test.beforeEach(async ({ page }) => {
    const userId = loginData.userId;
    const userPassword = loginData.userPassword;

    await page.goto('/');
    const loginPage = new LoginPage(page);
    await loginPage.loginInput.fill(userId);
    await loginPage.passwordInput.fill(userPassword);
    await loginPage.loginButton.click();

    const pulpitPage = new PulpitPage(page);
    await pulpitPage.sideMenu.paymentButton.click();

    await page.waitForLoadState('networkidle'); // needed to load everything properly
    paymentPage = new PaymentPage(page);
  });

  test('simple payment', async ({ page }) => {
    // Arrange
    const transferReceiver = 'Jan Nowak';
    const receiverAccount = '12 3456 7890 1234 5678 9012 3456';
    const transferAmount = '150';
    const expectedMessage = `Przelew wykonany! ${transferAmount},00PLN dla ${transferReceiver}`;

    //Act
    await paymentPage.transferReceiverSelect.fill(transferReceiver);
    await paymentPage.transferAccountInput.fill(receiverAccount);
    await paymentPage.transferAmountInput.fill(transferAmount);
    await paymentPage.executeTransferButton.click();
    await paymentPage.closeButton.click();

    // Assert
    await expect(paymentPage.expectedMessageLocator).toHaveText(
      expectedMessage,
    );
  });
});
