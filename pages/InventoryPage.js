class InventoryPage {
  constructor(page) {
    this.page = page;
    this.inventoryItems = page.locator('.inventory_item');
    this.cartBadge = page.locator('.shopping_cart_badge');
    this.cartLink = page.locator('.shopping_cart_link');
    this.sortDropdown = page.locator('[data-test="product_sort_container"]');
  }

  async getInventoryItemCount() {
    return await this.inventoryItems.count();
  }

  async addItemToCart(itemName) {
    const addButton = this.page.locator(`//div[text()="${itemName}"]/ancestor::div[contains(@class, "inventory_item")]//button[text()="Add to cart"]`);
    await addButton.click();
  }

  async goToCart() {
    await this.cartLink.click();
  }

  async sortBy(option) {
    await this.page.waitForSelector('[data-test="product_sort_container"]', { state: 'visible' });
    await this.sortDropdown.selectOption({ label: option });
    await this.page.waitForLoadState('networkidle');
  }

  async getItemPrices() {
    await delay(3000);
    await this.page.waitForSelector('.inventory_item_price', { state: 'visible' });
    const priceElements = await this.page.$$('.inventory_item_price');
    return await Promise.all(priceElements.map(async (el) => {
      const priceText = await el.innerText();
      return parseFloat(priceText.replace('$', ''));
    }));
  }
}

module.exports = { InventoryPage };