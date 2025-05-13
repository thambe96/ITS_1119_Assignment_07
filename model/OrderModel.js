export default class OrderModel {

    constructor(orderId, orderDate, custId, itemId, itemDesc, qty, total) {

        this.orderId = orderId;
        this.orderDate = orderDate;
        this.custId = custId;
        this.itemId = itemId;
        this.itemDesc = itemDesc;
        this.qty = qty;
        this.total = total;


    }



}