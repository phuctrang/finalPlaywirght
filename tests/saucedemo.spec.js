const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../pages/LoginPage');
const { InventoryPage } = require('../pages/InventoryPage');
const { CartPage } = require('../pages/CartPage');

test.describe('Sauce Demo Tests', () => {
  let loginPage;
  let inventoryPage;
  let cartPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    inventoryPage = new InventoryPage(page);
    cartPage = new CartPage(page);
    await loginPage.goto();
  });

  test('1. should display correct error message when user input invalid credential', async ({ page }) => {
    await loginPage.login('invalid_user', 'invalid_password');
    await expect(loginPage.errorMessage).toHaveText('Epic sadface: Username and password do not match any user in this service');
  });

  test('2. should navigate to dashboard page when login with valid credential', async ({ page }) => {
    await loginPage.login('standard_user', 'secret_sauce');
    await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html');
  });

  test('3. should display correct error message when no credential is given', async ({ page }) => {
    await loginPage.login('', '');
    await expect(loginPage.errorMessage).toHaveText('Epic sadface: Username is required');
  });

  test('4. should display 6 items in the inventory', async ({ page }) => {
    await loginPage.login('standard_user', 'secret_sauce');
    const itemCount = await inventoryPage.getInventoryItemCount();
    expect(itemCount).toBe(6);
  });

  test('5. should be able to add item to cart', async ({ page }) => {
    await loginPage.login('standard_user', 'secret_sauce');
    await inventoryPage.addItemToCart('Sauce Labs Backpack');
    await expect(inventoryPage.cartBadge).toHaveText('1');
  });

  test('6. cart should display the correct number of added item', async ({ page }) => {
    await loginPage.login('standard_user', 'secret_sauce');
    await inventoryPage.addItemToCart('Sauce Labs Backpack');
    await inventoryPage.addItemToCart('Sauce Labs Bike Light');
    await inventoryPage.goToCart();
    const cartItemCount = await cartPage.getCartItemCount();
    expect(cartItemCount).toBe(2);
  });

  test('7. should display the correct number of item when remove item from cart', async ({ page }) => {
    await loginPage.login('standard_user', 'secret_sauce');
    await inventoryPage.addItemToCart('Sauce Labs Backpack');
    await inventoryPage.addItemToCart('Sauce Labs Bike Light');
    await inventoryPage.goToCart();
    await cartPage.removeItemFromCart('Sauce Labs Backpack');
    const cartItemCount = await cartPage.getCartItemCount();
    expect(cartItemCount).toBe(1);
  });

  test('8. should display the correct order of item when filter is set to "Price (low to high)"', async ({ page }) => {
    await loginPage.login('standard_user', 'secret_sauce');
    await inventoryPage.sortBy('lohi');
    const prices = await inventoryPage.getItemPrices();
    expect(prices).toEqual(prices.slice().sort((a, b) => a - b));
  });

  test('9. should display the correct total price of added item when checking out', async ({ page }) => {
    await loginPage.login('standard_user', 'secret_sauce');
    await inventoryPage.addItemToCart('Sauce Labs Backpack');
    await inventoryPage.addItemToCart('Sauce Labs Bike Light');
    await inventoryPage.goToCart();
    await cartPage.checkout();
    await cartPage.fillCheckoutInfo('John', 'Doe', '12345');
    const subtotal = await cartPage.getSubtotal();
    const tax = subtotal * 0.08;
    const expectedTotal = Math.round((subtotal + tax) * 100) / 100;
    const actualTotal = await cartPage.getTotalPrice();
    expect(actualTotal).toBe(expectedTotal);
  });
});