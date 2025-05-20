import {customer_db, item_db} from "../db/db.js";
import ItemModel from "../model/ItemModel.js";




//load customer data to the table-body
function loadItems() {

    $('#item-tbody').empty();
    item_db.map((item, index) => {
        let itemid = item.itemid;
        let itemname = item.itemname;
        let price = item.price;
        let quantity = item.quantity;

        let data =`<tr>
                            <td>${itemid}</td>
                            <td>${itemname}</td>
                            <td>${price}</td>
                            <td>${quantity}</td>
                          </tr>`

        $(`#item-tbody`).append(data);

    });




    // Optionally dispatch a custom event to notify other modules
    const event = new CustomEvent('itemDbUpdated', { detail: item_db });
    window.dispatchEvent(event);







}



// save customer

function clearForm() {

    $('#item_name').val('');
    $('#item_price').val('');
    $('#item_qty').val('');
    generateNextItemId();

}


// let index = 0;
// to increment the index number for the customer_db array
function generateNextItemId() {

    if (item_db.length === 0) {
        $('#item_id').val("I001");
    } else {

        let lastItem = item_db[item_db.length-1];

        let currentitemid = lastItem.itemid /*++index;*/ /* customer_db[customer_db.length-1].custid */   /*$('#cust_id').val();*/
        let substring = currentitemid.slice(1);
        let nextdigit = parseInt(substring) + 1;
        let nextid = "I" + nextdigit.toString().padStart(3, '0');
        $('#item_id').val(nextid);
    }
}



$('#save_item').on('click', function (){


    console.log("save Changes was clicked")

    let itemid = $('#item_id').val();
    let itemname = $('#item_name').val();
    let price = $('#item_price').val();
    let quantiy = $('#item_qty').val();



    // Validating user inputs for item

    const itemNamePattern = /^[A-Za-z0-9\s\-']+$/;
    const itemQuantityPattern = /^(100|[1-9][0-9]?|[1-9])$/;
    const itemPricePattern = /^(?:0|[1-9]\d{0,4})(\.\d+)?$/;



    if (!itemNamePattern.test(itemname)) {
        Swal.fire({
            title: "Item Name?",
            text: "Wrong format for a item-name?",
            icon: "question"
        });
        return;
    }

    if (!itemPricePattern.test(price)) {
        Swal.fire({
            title: "Price?",
            text: "Wrong format for a item-price?",
            icon: "question"
        });
        return;
    }

    if (!itemQuantityPattern.test(quantiy)) {
        Swal.fire({
            title: "Qty?",
            text: "Wrong Qty?",
            icon: "question"
        });
        return;
    }

    if (price <= 1) {

        Swal.fire({
            title: "Price?",
            text: "price can not be 0 or negative?",
            icon: "question"
        });
        return;


    }




    let item_data = new ItemModel(itemid, itemname, price, quantiy);
    item_db.push(item_data);

    console.log(item_db);

    loadItems();

    Swal.fire({
        title: "Item Added Successfully!",
        icon: "success",
        draggable: true
    });

    clearForm();
    // generateNextCustomerId();

});





$('#add_item').on('click', function () {
    generateNextItemId();
});


/*
function customerSearch() {

    if ($('#customer_search_field').value() === null) {

    }

*/




/* -------- From Here ------------------------------ */






let itemFoundIndex;

$('#item_search_btn').on('click', function (){


    console.log("This is search item button !!!!")

    let itemSearchVal = $('#item_search_field').val();
    let itemSearchType = $('#item_search_type').val();


/*
    console.log("This is search button")
    console.log(customerSearchVal === '')
    console.log(customerSearchType)
    console.log(customerSearchType === "1")

    */

    if (itemSearchVal === '') {
        Swal.fire({
            title: 'Error!',
            text: 'Item Name / ID field is Empty',
            icon: 'error',
            confirmButtonText: 'Ok'
        });
        return;
    }


/* ------------- From here ------------------------------- */




    $('#update_item_search_close_btn').click(function (){
        $('#update_item_form_search').fadeOut(0);
    })


    if ((itemSearchType === "1")) {

        console.log("this is inside serarch type");

        let flag = true;


        item_db.map((item,index) => {

            if (item.itemid === itemSearchVal) {

                flag = false;
                itemFoundIndex = index;

                $('#update_item_form_search').fadeIn(0);
                $('#item_id_search').val(item.itemid);
                $('#item_name_search').val(item.itemname);
                $('#item_price_search').val(item.price);
                $('#item_quantity_search').val(item.quantity);

            }

        });


        // If no customer found flag boolean stays in true condition and below alert pops up

        if (flag) {

            Swal.fire({
                title: 'Error!',
                text: 'No Item Found',
                icon: 'error',
                confirmButtonText: 'Ok'
            });

        }


    }


});




$('#update_item_btn_search').on('click', function () {

    let id = $('#item_id_search').val();
    let name = $('#item_name_search').val();
    let price = $('#item_price_search').val();
    let quantity = $('#item_quantity_search').val();


    /*

        customer_db[custFoundIndex].customerId(id);
        customer_db[custFoundIndex].customerName(name);
        customer_db[custFoundIndex].custSalary(salary);
        customer_db[custFoundIndex].custAddress(address);


    */


    // check if the customer data was updated




    //validating user inputs for item


    const itemNamePattern = /^[A-Za-z0-9\s\-']+$/;
    const itemQuantityPattern = /^(100|[1-9][0-9]?|[1-9])$/;
    const itemPricePattern = /^\d+(\.\d+)?$/;



    if (!itemNamePattern.test(itemname)) {
        Swal.fire({
            title: "Item Name?",
            text: "Wrong format for a item-name?",
            icon: "question"
        });
        return;
    }

    if (!itemPricePattern.test(price)) {
        Swal.fire({
            title: "Price?",
            text: "Wrong format for a item-price?",
            icon: "question"
        });
        return;
    }

    if (!itemQuantityPattern.test(quantiy)) {
        Swal.fire({
            title: "Qty?",
            text: "Wrong format for a item-quantity?",
            icon: "question"
        });
        return;
    }









    let updateFlag = true

    if (item_db[itemFoundIndex].itemname === name && item_db[itemFoundIndex].price === price && item_db[itemFoundIndex].quantity == quantity) {
        updateFlag = false;
    }








    item_db[itemFoundIndex].itemid = id;
    item_db[itemFoundIndex].itemname = name;
    item_db[itemFoundIndex].price = price;
    item_db[itemFoundIndex].quantity = quantity;

    loadItems();


/*

    console.log("this is inside update btn!!!1")

    console.log(customer_db[custFoundIndex].custname);
    console.log(customer_db[custFoundIndex].salary);
    console.log(customer_db[custFoundIndex].address);



    */



    if (updateFlag) {

        Swal.fire({
            title: "Item updated Successfully!",
            icon: "success",
            draggable: true
        });


    } else {
        Swal.fire("Item details were not updated!");
    }

    //making the modal faded away
    $('#update_item_form_search').fadeOut(0);
    $('#item_search_field').val('');


});



// Delete Customer btn

$('#delete_item_btn_search').on('click', function () {

    let index = findItem();

    Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!"
    }).then((result) => {
        if (result.isConfirmed) {

            item_db.splice(index, 1);
            loadItems();
            $('#update_item_form_search').fadeOut(0);
            $('#item_search_field').val('');


            Swal.fire({
                title: "Deleted!",
                text: "The Item has been deleted.",
                icon: "success"
            });
        }
    });






});





function findItem() {

    let itemFoundDeleteIndex = -1;

    item_db.map((item,index) => {

        if (item.itemid === $('#item_id_search').val()) {

            itemFoundDeleteIndex = index;

            return itemFoundDeleteIndex;
            /*

                $('#cust_id_search').val(customer.custid);
                $('#cust_name_search').val(customer.custname);
                $('#cust_salary_search').val(customer.salary);
                $('#cust_address_search').val(customer.address);


                */
        }

    });

    return itemFoundDeleteIndex;
}


// Creating an eventListener to itemTableUpdate even so that the item table can be updated
window.addEventListener('itemTableUpdate', (event) => {
    loadItems();
})


