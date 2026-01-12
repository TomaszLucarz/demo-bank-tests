import { Page } from '@playwright/test';
import { SideMenuComponent } from '../components/side-menu.component';

export class PulpitPage {
  constructor(private page: Page) {}

  sideMenu = new SideMenuComponent(this.page);

  transferAmountInput = this.page.locator('#widget_1_transfer_amount');
  transferTitleInput = this.page.locator('#widget_1_transfer_title');
  transferReceiverSelect = this.page.locator('#widget_1_transfer_receiver');
  executeTransferButton = this.page.locator('#execute_btn');
  expectedMessageLocator = this.page.locator('#show_messages');

  moneyValueLocator = this.page.locator('#money_value');
  topupReceiverSelect = this.page.locator('#widget_1_topup_receiver');
  topupAmountSelect = this.page.locator('#widget_1_topup_amount');
  topupAgreementCheckbox = this.page.locator(
    '#uniform-widget_1_topup_agreement span',
  );
  executeTopupButton = this.page.getByRole('button', {
    name: 'doładuj telefon',
  });
  closeButton = this.page.getByTestId('close-button');

  usernameTextLocator = this.page.locator('#user_name');

  async executeQuickPayment(
    transferReceiver: string,
    transferAmount: string,
    transferTitle: string,
  ): Promise<void> {
    await this.transferReceiverSelect.selectOption({
      label: transferReceiver,
    });
    await this.transferAmountInput.fill(transferAmount);
    await this.transferTitleInput.fill(transferTitle);
    await this.executeTransferButton.click();
    await this.closeButton.click();
  }

  async executeMobileTopup(
    topupReceiver: string,
    topupAmount: string,
  ): Promise<void> {
    await this.topupReceiverSelect.selectOption(topupReceiver);
    await this.topupAmountSelect.selectOption(topupAmount);
    await this.topupAgreementCheckbox.click();
    await this.executeTopupButton.click();
    await this.closeButton.click();
  }
}
