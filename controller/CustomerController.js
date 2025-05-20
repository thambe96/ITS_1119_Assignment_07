import {customer_db} from "../db/db.js";
import CustomerModel from "../model/CustomerModel.js";


//load customer data to the table-body
function loadCustomers() {

    $('#customer-tbody').empty();
    customer_db.map((item, index) => {
        let custid = item.custid;
        let custname = item.custname;
        let salary = item.salary;
        let address = item.address;

        let data =`<tr>
                            <td>${custid}</td>
                            <td>${custname}</td>
                            <td>${salary}</td>
                            <td>${address}</td>
                          </tr>`

        $(`#customer-tbody`).append(data);

    });



    // Optionally dispatch a custom event to notify other modules
    const event = new CustomEvent('customerDbUpdated', { detail: customer_db });
    window.dispatchEvent(event);




}



// save customer

function clearForm() {

    $('#cust_name').val('');
    $('#cust_salary').val('');
    $('#cust_address').val('');
    generateNextCustomerId();

}


// let index = 0;
// to increment the index number for the customer_db array
function generateNextCustomerId() {

    if (customer_db.length === 0) {
        $('#cust_id').val("C001");
    } else {

        let lastCustomer = customer_db[customer_db.length-1];

        let currentcusid = lastCustomer.custid /*++index;*/ /* customer_db[customer_db.length-1].custid */   /*$('#cust_id').val();*/
        let substring = currentcusid.slice(1);
        let nextdigit = parseInt(substring) + 1;
        let nextid = "C" + nextdigit.toString().padStart(3, '0');
        $('#cust_id').val(nextid);
    }
}



$('#save_customer').on('click', function (){


    console.log("save Changes was clicked")

    let custid = $('#cust_id').val();
    let custname = $('#cust_name').val();
    let custsalary = $('#cust_salary').val();
    let custaddress = $('#cust_address').val();




    // Validating user inputs for customer

    const addressPattern = /^[A-Za-z]{3,15}$/; // Only letters, length 3-15
    const usernamePattern = /^[A-Za-z\s]+$/; // Letters and spaces only
    const salaryPattern = /^\d+(\.\d+)?$/;


    if (!usernamePattern.test(custname)) {

        Swal.fire({
            title: "Username?",
            text: "Wrong format for a username?",
            icon: "question"
        });

        return;

    }


    if (!addressPattern.test(custaddress)) {
        Swal.fire({
            title: "Address?",
            text: "Wrong format for a address?",
            icon: "question"
        });

        return;
    }

    if (!salaryPattern.test(custsalary)) {
        Swal.fire({
            title: "Salary?",
            text: "Wrong format for the salary?",
            icon: "question"
        });

        return;
    }






    let customer_data = new CustomerModel(custid, custname, custsalary, custaddress);
    customer_db.push(customer_data);

    console.log(customer_db);

    loadCustomers();

    Swal.fire({
        title: "Customer Added Successfully!",
        icon: "success",
        draggable: true
    });

    clearForm();
    // generateNextCustomerId();

});


$('#add_customer').on('click', function () {
    generateNextCustomerId();
});


/*
function customerSearch() {

    if ($('#customer_search_field').value() === null) {

    }

*/



let custFoundIndex;

$('#customer_search_btn').on('click', function (){



    let customerSearchVal = $('#customer_search_field').val();
    let customerSearchType = $('#customer_search_type').val();

    console.log("This is search button")
    console.log(customerSearchVal === '')
    console.log(customerSearchType)
    console.log(customerSearchType === "1")

    if (customerSearchVal === '') {
        Swal.fire({
            title: 'Error!',
            text: 'Customer Name / ID field is Empty',
            icon: 'error',
            confirmButtonText: 'Ok'
        });
        return;
    }



    $('#update_search_close_btn').click(function (){
        $('#update_customer_form_search').fadeOut(0);
    })


    if ((customerSearchType === "1")) {

        console.log("this is inside serarch type");

        let flag = true;


        customer_db.map((customer,index) => {

            if (customer.custid === customerSearchVal) {

                flag = false;
                custFoundIndex = index;

                $('#update_customer_form_search').fadeIn(0);
                $('#cust_id_search').val(customer.custid);
                $('#cust_name_search').val(customer.custname);
                $('#cust_salary_search').val(customer.salary);
                $('#cust_address_search').val(customer.address);

            }

        });


        // If no customer found flag boolean stays in true condition and below alert pops up

        if (flag) {

            Swal.fire({
                title: 'Error!',
                text: 'No Customer Found',
                icon: 'error',
                confirmButtonText: 'Ok'
            });

        }


    }


});




$('#update_customer_btn_search').on('click', function () {

    let id = $('#cust_id_search').val();
    let name = $('#cust_name_search').val();
    let salary = $('#cust_salary_search').val();
    let address = $('#cust_address_search').val();


    // Validation user inputs for customer


    const addressPattern = /^[A-Za-z]{3,15}$/; // Only letters, length 3-15
    const usernamePattern = /^[A-Za-z\s]+$/; // Letters and spaces only
    const salaryPattern = /^\d+(\.\d+)?$/;


    if (!usernamePattern.test(custname)) {

        Swal.fire({
            title: "Username?",
            text: "Wrong format for a username?",
            icon: "question"
        });

        return;

    }


    if (!addressPattern.test(custaddress)) {
        Swal.fire({
            title: "Address?",
            text: "Wrong format for a address?",
            icon: "question"
        });

        return;
    }

    if (!salaryPattern.test(custsalary)) {
        Swal.fire({
            title: "Salary?",
            text: "Wrong format for the salary?",
            icon: "question"
        });

        return;
    }








    /*

        customer_db[custFoundIndex].customerId(id);
        customer_db[custFoundIndex].customerName(name);
        customer_db[custFoundIndex].custSalary(salary);
        customer_db[custFoundIndex].custAddress(address);


    */


    // check if the customer data was updated


    let updateFlag = true

    if (customer_db[custFoundIndex].custname === name && customer_db[custFoundIndex].salary === salary && customer_db[custFoundIndex].address == address) {
        updateFlag = false;
    }








    customer_db[custFoundIndex].custid = id;
    customer_db[custFoundIndex].custname = name;
    customer_db[custFoundIndex].salary = salary;
    customer_db[custFoundIndex].address = address;

    loadCustomers();

    console.log("this is inside update btn!!!1")

    console.log(customer_db[custFoundIndex].custname);
    console.log(customer_db[custFoundIndex].salary);
    console.log(customer_db[custFoundIndex].address);


    if (updateFlag) {

        Swal.fire({
            title: "Customer updated Successfully!",
            icon: "success",
            draggable: true
        });


    } else {
        Swal.fire("Customer details were not updated!");
    }

    //making the modal faded away
    $('#update_customer_form_search').fadeOut(0);
    $('#customer_search_field').val('');





});



// Delete Customer btn

$('#delete_customer_btn_search').on('click', function () {

    let index = findCustomer();

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

            customer_db.splice(index, 1);
            loadCustomers();
            $('#update_customer_form_search').fadeOut(0);
            $('#customer_search_field').val('');


            Swal.fire({
                title: "Deleted!",
                text: "The Customer has been deleted.",
                icon: "success"
            });
        }
    });






});

function findCustomer() {

    let custFoundDeleteIndex = -1;



    customer_db.map((customer,index) => {

        if (customer.custid === $('#cust_id_search').val()) {

            custFoundDeleteIndex = index;

            return custFoundDeleteIndex;
            /*

                $('#cust_id_search').val(customer.custid);
                $('#cust_name_search').val(customer.custname);
                $('#cust_salary_search').val(customer.salary);
                $('#cust_address_search').val(customer.address);


                */
        }

    });

    return custFoundDeleteIndex;
}


















