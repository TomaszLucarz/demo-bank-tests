import { test, expect } from '@playwright/test';

test.describe('Pulpit tests', () => {

    test('quick payment with correct data', async ({ page }) => {

        await page.goto('https://demo-bank.vercel.app/');

        await page.getByTestId('login-input').fill('aaaaaaaa');
        await page.getByTestId('password-input').fill('test1234');
        await page.getByTestId('login-button').click();

        await page.waitForLoadState('networkidle'); // needed to load everything properly

        await page.locator('#widget_1_transfer_receiver').selectOption({ label: 'Chuck Demobankowy' });
        await page.locator('#widget_1_transfer_amount').fill('150');
        await page.locator('#widget_1_transfer_title').fill('Zwrot środków');

        await page.locator('#execute_btn').click(); // await page.getByRole('button', { name: 'wykonaj' }).click();
        await page.getByTestId('close-button').click();

        await expect(page.locator('#show_messages')).toHaveText('Przelew wykonany! Chuck Demobankowy - 150,00PLN - Zwrot środków');
    });

    test('successful mobile top-up', async ({ page }) => {
        await page.goto('https://demo-bank.vercel.app/');

        await page.getByTestId('login-input').fill('aaaaaaaa');
        await page.getByTestId('password-input').fill('test1234');
        await page.getByTestId('login-button').click();

        await page.waitForLoadState('networkidle'); // needed to load everything properly

        await page.locator('#widget_1_topup_receiver').selectOption('504 xxx xxx');
        await page.locator('#widget_1_topup_amount').selectOption('100');
        await page.locator('#uniform-widget_1_topup_agreement span').click();
        await page.getByRole('button', { name: 'doładuj telefon' }).click();
        await page.getByTestId('close-button').click();

        await expect(page.locator('#show_messages')).toHaveText('Doładowanie wykonane! 100,00PLN na numer 504 xxx xxx');
    });

});