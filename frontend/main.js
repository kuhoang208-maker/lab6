// LƯU Ý: Cổng port 5107 có thể khác biệt tùy theo máy của bạn khi chạy Visual Studio.
// Hãy mở file Properties/launchSettings.json để xem cổng chính xác của ứng dụng Backend.
const apiUrl = 'http://localhost:5107/api/products';

document.addEventListener("DOMContentLoaded", function () {
    fetchProducts();
    document.getElementById('btnSave').addEventListener('click', saveProduct);
});

function fetchProducts() {
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => displayProducts(data))
        .catch(error => console.error('Fetch error:', error));
}

function displayProducts(products) {
    const bookList = document.getElementById('bookList');
    bookList.innerHTML = '';
    products.forEach(product => {
        bookList.innerHTML += createProductRow(product);
    });
}

function createProductRow(product) {
    return `
        <tr>
            <td>${product.id}</td>
            <td>${product.name}</td>
            <td>${product.price}</td>
            <td>${product.description}</td>
            <td>
                <button onclick="editProduct(${product.id}, '${product.name}', ${product.price}, '${product.description}')">Edit</button>
                <button onclick="deleteProduct(${product.id})">Delete</button>
            </td>
        </tr>
    `;
}

function clearForm() {
    document.getElementById('productId').value = '';
    document.getElementById('productName').value = '';
    document.getElementById('productPrice').value = '';
    document.getElementById('productDescription').value = '';
}

function saveProduct() {
    const id = document.getElementById('productId').value;
    const name = document.getElementById('productName').value;
    const price = document.getElementById('productPrice').value;
    const description = document.getElementById('productDescription').value;

    const productData = {
        name: name,
        price: parseFloat(price),
        description: description
    };

    if (id) {
        // Cập nhật (PUT)
        productData.id = parseInt(id);
        fetch(`${apiUrl}/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(productData)
        })
        .then(response => {
            if (response.ok) {
                console.log('Product updated successfully.');
                fetchProducts();
                clearForm();
            } else {
                console.error('Failed to update product.');
            }
        })
        .catch(error => console.error('Error:', error));
    } else {
        // Thêm mới (POST)
        fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(productData)
        })
        .then(response => {
            if (response.ok) {
                console.log('Product added');
                fetchProducts();
                clearForm();
            } else {
                console.error('Failed to add product.');
            }
        })
        .catch(error => console.error('Error:', error));
    }
}

function editProduct(id, name, price, description) {
    document.getElementById('productId').value = id;
    document.getElementById('productName').value = name;
    document.getElementById('productPrice').value = price;
    document.getElementById('productDescription').value = description;
}

function deleteProduct(id) {
    if (confirm("Are you sure you want to delete this product?")) {
        fetch(`${apiUrl}/${id}`, {
            method: 'DELETE'
        })
        .then(response => {
            if (response.ok) {
                console.log('Deleted successfully.');
                fetchProducts();
            } else {
                console.error('Failed to delete product.');
            }
        })
        .catch(error => console.error('Error:', error));
    }
}
