import {customer_db, item_db, order_db} from "../db/db.js";
import OrderModel from "../model/OrderModel.js";
import CartModel from "../model/CartModel.js";



// $('#nav-orders').addEventListener("click", loadCustomerIds);


/*

document.getElementById('save_customer').addEventListener('click', function () {
    loadCustomerIds();
});


*/




// controller/OrderController.js

function initialize() {
    console.log("Page is loaded and module initialized");
    // Your code here
    generateNextOrderId();

    $('#order-date').val(getDate());



}

// Call it immediately because the module script is deferred
initialize();



function getDate() {

    /*
    let currentDate = new Date();
    let year = currentDate.getFullYear();
    let month = currentDate.getMonth();
    let day = currentDate.getDay();

    */



    // let date = `${year}/${month}/${day}`


    let date = new Date(Date.now()).toLocaleDateString();

    return date;
}













/* Here this listener is listening to the CustomerEventListener -->> customDbUpdated */

window.addEventListener('customerDbUpdated', (event) => {
    const updatedCustomerDb = event.detail; // Access the updated customer_db
    // Now you can update the <select> options or perform other actions
    console.log('Customer DB updated:', updatedCustomerDb);
    loadCustomerIds();
});



/* Here this listener is listening to the CustomerEventListener -->> itemDbUpdated */
window.addEventListener('itemDbUpdated', (event) => {
    const updatedItemDb = event.detail; // Access the updated customer_db
    // Now you can update the <select> options or perform other actions
    console.log('Customer DB updated:', updatedItemDb);
    loadItemIds();
});







function loadCustomerIds() {

    console.log("loadCustomerIds() called here !!!")



    $('#customer-id-select').empty();

    customer_db.forEach((customer) => {


        console.log(`Cust Ids ->> ${customer.custid}`);

        let data = `<option>${customer.custid}</option>>`

        $('#customer-id-select').append(data);

    });

    console.log("loadCustomerIds() called here !!! -- Ends")

}



function loadItemIds() {


    $('#select_item_id').empty();

    let optionLabel = `<option>---- Select Item ID ---</option>>`
    $('#select_item_id').append(optionLabel);

    item_db.forEach((item) => {


        console.log(`Item Ids ->> ${item.itemid}`);

        let data = `<option>${item.itemid}</option>>`

        $('#select_item_id').append(data);

    });

    console.log("loadItemIds() called here !!! -- Ends")





}






function generateNextOrderId() {

    console.log("inside next order id");

    if (order_db.length === 0) {
        $('#order-id').val("O-001");
    } else {

        let lastOrder /*lastCustomer*/ = order_db[order_db.length-1];

        console.log(`inside next order id --> ${lastOrder.orderId}`);


        let currentorderid = lastOrder.orderId; /*++index;*/ /* customer_db[customer_db.length-1].custid */   /*$('#cust_id').val();*/
        let substring = currentorderid.slice(2);
        let nextdigit = parseInt(substring) + 1;
        let nextid = "O-" + nextdigit.toString().padStart(3, '0');

        console.log(`inside next order id --> ${nextid}`);

        $('#order-id').val(nextid);
    }


}


$('#select_item_id').change(function() {


    let selectedValue = $(this).val();
    let selectedText = $(this).find('option:selected').text();
    console.log('Selected value:', selectedValue);
    console.log('Selected text:', selectedText);





    item_db.forEach(function (item) {

        if (item.itemid === selectedText) {

            $('#item_desc').val(item.itemname);
            $('#unit_price').val(item.price);
            $('#qty_on_hand').val(item.quantity);
        }
    });


    if (selectedText === "---- Select Item ID ---") {
        clearItemDetailsForm();
    }



});



let cartArray = [];
$('#add_to_cart').on('click', function () {

    let orderId = $('#order-id').val();
    let itemId = $('#select_item_id').val();
    let itemName = $('#item_desc').val();
    let itemQty = $('#qty_on_hand_select').val();
    let price = parseFloat($('#unit_price').val())  * parseInt($('#qty_on_hand_select').val());


    if (!formValidationItemDetails()) {
        return;
    }



    if (itemQty > parseInt($('#qty_on_hand').val())) {
        alert("Not enough qty on hand");
        return;
    }

    let cartData = new CartModel(orderId, itemId, itemName, itemQty, price);

    if (cartArray.length === 0) {
        cartArray.push(cartData);
    } else {

        let flag = false;

        cartArray.forEach(function (data) {
            alert("inside forEach")
            if (data.itemId === cartData.itemId){
                alert("inside if condition")
                flag = true;

                console.log(`data.qty -> ${data.qty}`);
                console.log(`cartDate.qty -> ${cartData.qty}`);

                let pevQty = data.qty;
                let currentQty = cartData.qty;
                let totQty = parseInt(pevQty)  + parseInt(currentQty);

                data.qty = totQty;/*itemQty*/
                data.price = parseFloat($('#unit_price').val()) * totQty;
            }
            alert("inside here after if")


        });

        if (!flag) {
            cartArray.push(cartData);
        }


    }

    loadCart();

    /*clear item details form*/
    /*update the array*/

    updateItemDbQty(cartData);

    let total = calculateTotal();

    console.log(`Total --> : ${total}`)



    $('#total').val(total);
    clearItemDetailsForm();

});



function loadCart() {

    $(`#order_cart_tbody`).empty();


    alert("inside cart load function ")
    cartArray.forEach(function (cartItem) {
        let data =`<tr>
                            <td>${cartItem.orderId}</td>
                            <td>${cartItem.itemId}</td>
                            <td>${cartItem.itemName}</td>
                            <td>${cartItem.qty}</td>
                            <td>${cartItem.price}</td>
                          </tr>`

        $(`#order_cart_tbody`).append(data);


    });


}



function updateItemDbQty(cartData) {

        item_db.forEach(function (item) {
            if (item.itemid === cartData.itemId) {
                let itemQty = parseInt(item.quantity) - parseInt(cartData.qty);
                item.quantity = String(itemQty);
            }
        });

}


function calculateTotal() {
    let total = 0;
    cartArray.forEach(function (cartItem){
        total+= parseInt(cartItem.price) ;
    });
    return total;
}







function clearItemDetailsForm() {


    $('#select_item_id')[0].selectedIndex = 0;
    // $('#select_item_id').val('');
    $('#item_desc').val('');
    $('#qty_on_hand').val(''); /*issue*/
    $('#unit_price').val('');
    $('#qty_on_hand_select').val(''); /* issue*/



}


function formValidationItemDetails() {


    console.log(` Ths select item Id val --> :${$('#select_item_id').val()}`);

    let flag = true;

    if ($('#select_item_id').children('option').length === 0) {
        flag = false;
        alert('The select element is empty.');

    } else if ($('#select_item_id').val() === "---- Select Item ID ---") {

        flag = false;
        alert('Pls select a valid Item.');

    } else if ($('#item_desc').val().trim() === '') {

        flag = false;
        alert('The Description field is empty.');

    } else if ($('#unit_price').val().trim() === '') {

        flag = false;
        alert('The unit price field is empty.');

    } else if ( $('#qty_on_hand_select').val().trim() === '') {
        flag = false;
        alert('The Qty field is empty.');
    }

    return flag;

}





$('#save_order').on('click', function () {


    // let orderDetArray = [];

    cartArray.forEach(function (cartItem) {

        let orderId = cartItem.orderId;
        let date = $('#order-date').val();
        let custId = $('#customer-id-select').val();
        let itemId = cartItem.itemId;
        let itemDesc = cartItem.itemName;
        let qty = cartItem.qty;
        let price = cartItem.price;

        let orderDetails = new OrderModel(orderId, date, custId, itemId, itemDesc, qty, price);

        order_db.push(orderDetails)

    });


    let cashOnhand = parseInt($('#cash').val());


    if (cashOnhand < parseInt($('#total').val())) {
        Swal.fire({
            title: "Insufficient",
            text: "Insufficient credits?",
            icon: "question"
        });
        return;
    }

    let balance = cashOnhand - parseInt($('#total').val());

    let isDiscountEmpty = false;
    if ($('#discount').val() === '') {
        isDiscountEmpty = true;
    }

    if (!isDiscountEmpty) {
        let discount = parseFloat($('#discount').val());
        balance = balance + discount;
    }


    $('#balance').val(balance);




    loadOrderDetailsTable();

    // crating a custom even to update the item table.

    let event = new CustomEvent('itemTableUpdate', {detail: item_db});
    window.dispatchEvent(event);



})




function loadOrderDetailsTable() {

    $('#order-tbody').empty();
    order_db.forEach(function (order) {

        let data = `<tr>
                            <td>${order.orderId}</td>
                            <td>${order.orderDate}</td>
                            <td>${order.custId}</td>
                            <td>${order.itemId}</td>
                            <td>${order.itemDesc}</td>
                            <td>${order.qty}</td>
                            <td>${order.total}</td>
                        </tr>>`


        $('#order-tbody').append(data);

    });


    cartArray = [];

    $('#order_cart_tbody').empty();
    generateNextOrderId();
    $('#customer-id-select').val('');

    $('#total').val('');

    alert("Order saved Successfully !!");
    // $('#select-item-form').fadeOut(0);






}