import { test, expect } from '@playwright/test';
import { loginData } from '../test-data/login.data';
import { LoginPage } from '../pages/login.page';
import { PaymentPage } from '../pages/payment.page';
import { PulpitPage } from '../pages/pulpit.page';

test.describe('Payment tests', () => {
  test.describe.configure({ retries: 3 });
  let paymentPage: PaymentPage;

  test.beforeEach(async ({ page }) => {
    const userId = loginData.userId;
    const userPassword = loginData.userPassword;

    await page.goto('/');
    const loginPage = new LoginPage(page);
    await loginPage.login(userId, userPassword);

    const pulpitPage = new PulpitPage(page);
    await pulpitPage.sideMenu.paymentButton.click();

    await page.waitForLoadState('domcontentloaded'); // needed to load everything properly
    paymentPage = new PaymentPage(page);
  });

  test(
    'simple payment with correct data',
    {
      tag: ['@payment', '@integration'],
      annotation: {
        type: 'Documentation',
        description:
          'More to find at: https://jaktestowac.pl/lesson/pw1s04l04/ ',
      },
    },
    async ({ page }) => {
      // Arrange
      const transferReceiver = 'Jan Nowak';
      const receiverAccount = '12 3456 7890 1234 5678 9012 3456';
      const transferAmount = '150';
      const expectedMessage = `Przelew wykonany! ${transferAmount},00PLN dla ${transferReceiver}`;

      //Act
      await paymentPage.makeTransfer(
        transferReceiver,
        receiverAccount,
        transferAmount,
      );

      // Assert
      await expect(paymentPage.expectedMessageLocator).toHaveText(
        expectedMessage,
      );
    },
  );
});
