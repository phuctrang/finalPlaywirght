class CartPage {
    constructor(page) {
      this.page = page;
      this.cartItems = page.locator('.cart_item');
      this.checkoutButton = page.locator('[data-test="checkout"]');
      this.firstNameInput = page.locator('[data-test="firstName"]');
      this.lastNameInput = page.locator('[data-test="lastName"]');
      this.postalCodeInput = page.locator('[data-test="postalCode"]');
      this.continueButton = page.locator('[data-test="continue"]');
      this.subtotalLabel = page.locator('.summary_subtotal_label');
      this.totalLabel = page.locator('.summary_total_label');
    }
  
    async getCartItemCount() {
      return await this.cartItems.count();
    }
  
    async removeItemFromCart(itemName) {
      const removeButton = this.page.locator(`//div[text()="${itemName}"]/ancestor::div[contains(@class, "cart_item")]//button[text()="Remove"]`);
      await removeButton.click();
    }
  
    async checkout() {
      await this.checkoutButton.click();
    }
  
    async fillCheckoutInfo(firstName, lastName, postalCode) {
      await this.firstNameInput.fill(firstName);
      await this.lastNameInput.fill(lastName);
      await this.postalCodeInput.fill(postalCode);
      await this.continueButton.click();
    }
  
    async getSubtotal() {
      const subtotalText = await this.subtotalLabel.innerText();
      return parseFloat(subtotalText.replace('Item total: $', ''));
    }
  
    async getTotalPrice() {
      const totalText = await this.totalLabel.innerText();
      return parseFloat(totalText.replace('Total: $', ''));
    }
  }
  
  module.exports = { CartPage };