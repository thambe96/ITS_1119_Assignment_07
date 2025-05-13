
export default class CartModel {
    constructor(orderId, itemId, itemName, qty, price) {
        this.orderId = orderId;
        this.itemId = itemId;
        this.itemName = itemName;
        this.qty = qty;
        this.price = price;

    }
}