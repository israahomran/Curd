const productName = document.querySelector('#productName');
const productCategory = document.querySelector('#productCategory');
const productPrice = document.querySelector('#productPrice');
const productDescription = document.querySelector('#productDescription');

const addBtn = document.querySelector('#addProudct');
const clearBtn = document.querySelector('.clear');
const deleteBtn = document.querySelector('#deleteBtn');
const search = document.querySelector('#search');
// error messages
const invalidValueName = document.querySelector('.invalid-value.name');
const invalidValueCategory = document.querySelector('.invalid-value.category');
const invalidValuePrice = document.querySelector('.invalid-value.price');
const invalidValueDescription = document.querySelector('.invalid-value.description');

const invalidValue = document.querySelector('.invalid-value');
const input = document.querySelector('.inputs');
let products = [];

// when refresh the page the code of next block will guarantee save data stored in local storage and display it in table
if (localStorage.getItem("products") != null) {
    products = JSON.parse(localStorage.getItem("products"));
    displayproducts();
}

// add product and validation
addBtn.addEventListener('click', (e) => {
    e.preventDefault();
    const index = addBtn.getAttribute("data-index");
    // patterns 
    const namePattern = /^[A-Z][a-z]{2,10}$/;
    const categoryPattern = /^[A-Za-z ]{3,20}$/;
    const pricePattern = /^[1-9][0-9]*$/;
    const descriptionPattern = /^.{5,50}$/;

    // validation 
    if (!namePattern.test(productName.value)) {
        invalidValueName.textContent = "Ensure it starts with an uppercase letter followed by 2-10 lowercase letters.";
        invalidValueName.classList.remove('d-none');
        productName.classList.add('is-invalid');
    } else {
        invalidValueName.classList.add('d-none');
        productName.classList.remove('is-invalid');
        productName.classList.add('is-valid');

    }

    if (!categoryPattern.test(productCategory.value)) {
        invalidValueCategory.textContent = "Invalid product category. Use 3-20 alphabetic characters only.";
        invalidValueCategory.classList.remove('d-none');
        productCategory.classList.add('is-invalid');
    } else {
        invalidValueCategory.classList.add('d-none');
        productCategory.classList.remove('is-invalid');
        productCategory.classList.add('is-valid');
    }

    if (!pricePattern.test(productPrice.value)) {
        invalidValuePrice.textContent = "Invalid product price. Enter a positive number.";
        invalidValuePrice.classList.remove('d-none');
        productPrice.classList.add('is-invalid');
    } else {
        invalidValuePrice.classList.add('d-none');
        productPrice.classList.remove('is-invalid');
        productPrice.classList.add('is-valid');
    }

    if (!descriptionPattern.test(productDescription.value)) {
        invalidValueDescription.textContent = "Invalid description. It must be between 5-50 characters.";
        invalidValueDescription.classList.remove('d-none');
        productDescription.classList.add('is-invalid');
    } else {
        invalidValueDescription.classList.add('d-none');
        productDescription.classList.remove('is-invalid');
        productDescription.classList.add('is-valid');
    }

    if (namePattern.test(productName.value) && categoryPattern.test(productCategory.value) && pricePattern.test(productPrice.value) && descriptionPattern.test(productDescription.value)) {
        addProudcts(index);
    }

});
function addProudcts(index) {
    // set values in object to create products array and set items from FormInputs to local storage
    if (index !== null) {

        products[index] = {
            name: productName.value,
            category: productCategory.value,
            price: productPrice.value,
            description: productDescription.value,
        };
        addBtn.removeAttribute("data-index");
        addBtn.textContent = "Add Product";
        addBtn.classList.remove("btn-warning");

        Swal.fire({
            icon: "success",
            title: "Product Updated",
            text: "Your product has been successfully updated!",
        });
    } else {

        products.push({
            name: productName.value,
            category: productCategory.value,
            price: productPrice.value,
            description: productDescription.value,
        });

        Swal.fire({
            icon: "success",
            title: "Product Added",
            text: "Your product has been successfully added!",
        });
    }
    localStorage.setItem("products", JSON.stringify(products));
    displayproducts();
}

//clear data
clearBtn.addEventListener('click', () => {

    invalidValueName.classList.add('d-none');
    invalidValueCategory.classList.add('d-none');
    invalidValuePrice.classList.add('d-none');
    invalidValueDescription.classList.add('d-none');


    productName.classList.remove('is-invalid', 'is-valid');
    productCategory.classList.remove('is-invalid', 'is-valid');
    productPrice.classList.remove('is-invalid', 'is-valid');
    productDescription.classList.remove('is-invalid', 'is-valid');

});

//displayproducts
function displayproducts() {
    const result = products.map((product, index) => {
        return `
        <tr>
        <td>${index}</td>
        <td>${product.name}</td>
        <td>${product.category}</td>
        <td>${product.price}</td>
        <td>${product.description}</td>
        <td>            
            <button class="btn btn-warning" onclick="editProduct(${index})">Update</button> 
        </td>
        <td><button class="btn btn-danger" onclick="deleteproduct(${index})">Delete</button></td>
        </tr>
        `;
    }).join('');
    document.querySelector('#data').innerHTML = result;
}
//delete product
function deleteproduct(index) {
    Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
        if (result.isConfirmed) {
            products.splice(index, 1);
            localStorage.setItem("products", JSON.stringify(products));
            displayproducts();
            Swal.fire(
                'Deleted!',
                'Your product has been deleted.',
                'success'
            )
        }
    })
}
//delete all products
deleteBtn.addEventListener('click', () => {
    Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
        if (result.isConfirmed) {
            products = [];
            localStorage.setItem("products", JSON.stringify(products));
            displayproducts();
            Swal.fire(
                'Deleted!',
                'Your product has been deleted.',
                'success'
            )
        }
    })

});
//search
search.addEventListener("input", (e) => {
    e.preventDefault();
    const value = search.value.toLowerCase();

    const productsResult = products.filter((product) => {
        const name = product.name.toLowerCase();
        return name.includes(value);
    });

    const result = productsResult.map((product, index) => {
        return `
        <tr>
            <td>${index}</td>
            <td>${product.name}</td>
            <td>${product.category}</td>
            <td>${product.price}</td>
            <td>${product.description}</td>
            <td>            
                <button class="btn btn-warning" onclick="editProduct(${index})">Update</button> 
            </td>
            <td>
                <button class='btn btn-danger' onclick='deleteproduct(${index})'>delete</button>
            </td>
        </tr>
        `;
    }).join("");

    document.querySelector("#data").innerHTML = result;
});
//update
function editProduct(index) {
    const product = products[index];
    productName.value = product.name;
    productCategory.value = product.category;
    productPrice.value = product.price;
    productDescription.value = product.description;
    addBtn.textContent = "Save Changes";
    addBtn.classList.add("btn-warning");
    addBtn.setAttribute("data-index", index);

}





