// Get references to elements on the page
let label = document.getElementById("label"); // The element to display the total amount or cart message
let ShoppingCart = document.getElementById("shopping-cart"); // The container where cart items will be displayed

// Retrieve the basket data from localStorage or initialize an empty array
let basket = JSON.parse(localStorage.getItem("data")) || [];

// Function to update the cart icon with the total number of items in the cart
let calculation = () => {
  let cartIcon = document.getElementById("cartAmount");
  cartIcon.innerHTML = basket.map((x) => x.item).reduce((x, y) => x + y, 0);
};

// Call calculation to update the cart icon when the page loads
calculation();

// Function to generate and display cart items
let generateCartItems = () => {
  if (basket.length !== 0) {
    // If there are items in the cart, display them
    return (ShoppingCart.innerHTML = basket
      .map((x) => {
        let { id, item } = x; // Destructure the id and item quantity from each cart item
        let search = shopItemsData.find((y) => y.id === id) || []; // Find the item details from the shopItemsData array
        return `
      <div class="cart-header">
        <div class="cart-product-header"><h3>Product</h3></div>
        <div class="cart-price-header"><h3>Price</h3></div>
        <div class="cart-quantity-header"><h3>Quantity</h3></div>
        <div class="cart-total-header"><h3>Total</h3></div>
      </div>
          <div class="cart-item">
            <div class="cart-img">
              <img width="100" height="100" src=${search.img} alt="${search.name}" />
            </div>
            <div class="cart-details">
              <p class="cart-title">${search.name}</p>
            </div>
            <div class="cart-price">
              <p>$${search.price}</p>
            </div>
            <div class="cart-quantity">
              <!-- Buttons to increase or decrease the item quantity -->
              <button onclick="decrement(${id})" class="quantity-btn">-</button>
              <span id=${id} class="quantity">${item}</span>
              <button onclick="increment(${id})" class="quantity-btn">+</button>
            </div>
            <div class="cart-total">
              <p>$${(item * search.price).toFixed(2)}</p>
            </div>
            <div class="cart-remove">
              <button onclick="removeItem(${id})" class="remove-btn">Remove</button>
            </div>
          </div>
        `;
      })
      .join(""));
  } else {
    // If the cart is empty, display a message and a back button
    ShoppingCart.innerHTML = ``;
    label.innerHTML = `
    <h2>Cart is Empty</h2>
    <a href="index.html">
      <button class="HomeBtn">Back to home</button>
    </a>
    `;
  }
};

// Generate the cart items when the page loads
generateCartItems();

// Function to increment the quantity of an item in the cart
let increment = (id) => {
  let selectedItem = id;
  let search = basket.find((x) => x.id === selectedItem.id); // Find the item in the basket

  if (search === undefined) {
    // If the item is not found, add it to the basket
    basket.push({
      id: selectedItem.id,
      item: 1,
    });
  } else {
    // If the item is found, increase the quantity
    search.item += 1;
  }

  generateCartItems(); // Regenerate the cart items to reflect the updated quantity
  update(selectedItem.id); // Update the quantity display
  localStorage.setItem("data", JSON.stringify(basket)); // Store the updated basket in localStorage
};

// Function to decrement the quantity of an item in the cart
let decrement = (id) => {
  let selectedItem = id;
  let search = basket.find((x) => x.id === selectedItem.id); // Find the item in the basket

  if (search === undefined) return; // If the item is not found, do nothing
  else if (search.item === 0) return; // If the quantity is already 0, do nothing
  else {
    search.item -= 1; // Decrease the item quantity
  }
  update(selectedItem.id); // Update the quantity display
  basket = basket.filter((x) => x.item !== 0); // Remove items with 0 quantity from the basket
  generateCartItems(); // Regenerate the cart items to reflect the updated quantity
  localStorage.setItem("data", JSON.stringify(basket)); // Store the updated basket in localStorage
};

// Function to update the display of the item quantity and total
let update = (id) => {
  let search = basket.find((x) => x.id === id); // Find the item in the basket
  document.getElementById(id).innerHTML = search.item; // Update the quantity displayed for the item
  calculation(); // Recalculate the total number of items in the cart
  TotalAmount(); // Update the total amount
};

// Function to remove an item from the cart
let removeItem = (id) => {
  let selectedItem = id;
  basket = basket.filter((x) => x.id !== selectedItem.id); // Remove the item from the basket
  generateCartItems(); // Regenerate the cart items to reflect the updated basket
  TotalAmount(); // Update the total amount
  localStorage.setItem("data", JSON.stringify(basket)); // Store the updated basket in localStorage
};

// Function to clear all items from the cart
let clearCart = () => {
  basket = []; // Empty the basket
  localStorage.setItem("data", JSON.stringify(basket)); // Clear the cart in localStorage
  generateCartItems(); // Regenerate the empty cart UI
  calculation(); // Update the cart amount display
};

// Function to calculate and display the total amount for all items in the cart
let TotalAmount = () => {
  if (basket.length !== 0) {
    let amount = basket
      .map((x) => {
        let { item, id } = x;
        let search = shopItemsData.find((y) => y.id === id) || [];
        return item * search.price; // Calculate the total for each item
      })
      .reduce((x, y) => x + y, 0); // Sum all the item totals
    label.innerHTML = `
    <h2>Total Bill : $ ${amount}</h2>
    <a href="checkout.html">
    <button class="checkout">Checkout</button>
    </a>
    <button onclick="clearCart()" class="removeAll">Clear Cart</button>
    `;
  } else return; // If the cart is empty, don't do anything
};

// Call TotalAmount to update the total when the page loads
TotalAmount();
