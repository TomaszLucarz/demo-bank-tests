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
}
