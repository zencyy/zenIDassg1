function toggleMenu() {
  const navLinks = document.querySelector(".navbar ul");
  navLinks.classList.toggle("show"); // Toggle the `show` class
}

/* slideable carousell function for Shop page */
let currentSlide = 0;
const slides = document.querySelectorAll('.carousell-image');
const totalSlides = slides.length;

function moveSlide(step) {
    currentSlide += step;

    if (currentSlide >= totalSlides) {
        currentSlide = 0;
    } else if (currentSlide < 0) {
        currentSlide = totalSlides - 1;
    }

    updateCarousel();
}

function updateCarousel() {
    const carousel = document.querySelector('.carousell-images');
    carousel.style.transform = `translateX(-${currentSlide * 100}%)`;
}

// Automatic slide transition every 5 seconds
setInterval(() => {
    moveSlide(1);
}, 5000);

// Get the reference to the shop container where the products will be displayed
let shop = document.getElementById("shop");

// Retrieve the cart data from localStorage or initialize it as an empty array if there's no data
let basket = JSON.parse(localStorage.getItem("data")) || [];

// Function to generate the product items on the shop page
let generateShop = () => {
  // Dynamically generate the HTML for each product based on the shopItemsData array
  return (shop.innerHTML = shopItemsData
    .map((x) => {
      let { id, name, price, desc, img } = x; // Destructure each product's details
      let search = basket.find((x) => x.id === id) || []; // Check if the item is already in the cart
      return `
    <div id=product-id-${id} class="item">
        <img width="200" src=${img} alt="${name}">
        <div class="details">
          <h3>${name}</h3>
          <p>${desc}</p>
          <div class="price-quantity">
            <h2>$ ${price} </h2>
            <!-- Button to add item to cart -->
            <button onclick="addToCart('${id}')" class="add-to-cart-btn">Add to Cart</button>
          </div>
        </div>
      </div>
    `;
    })
    .join("")); // Join the map results into a single string to insert into the HTML
};

// Call generateShop to populate the products on the shop page
generateShop();

// Function to add a product to the cart
let addToCart = (id) => {
  let selectedItem = id; // Store the id of the selected item
  let search = basket.find((x) => x.id === selectedItem); // Search for the selected item in the cart

  if (search === undefined) {
    // If the item is not in the cart, add it with a quantity of 1
    basket.push({
      id: selectedItem,
      item: 1,
    });
  } else {
    // If the item is already in the cart, increment its quantity
    search.item += 1;
  }

  // Save the updated cart to localStorage
  localStorage.setItem("data", JSON.stringify(basket));

  // Update the cart icon with the new item count
  calculation();

  // Show the notification indicating the item was added to the cart
  let notification = document.getElementById("notification");
  notification.classList.add("show"); // Add the 'show' class to display the notification

  // Hide the notification after 3 seconds (fade-out effect)
  setTimeout(() => {
    notification.classList.remove("show"); // Remove the 'show' class to hide the notification
  }, 3000); // Timeout duration set to 3000 milliseconds (3 seconds)
};

// Function to update the cart icon with the total number of items in the cart
let calculation = () => {
  let cartIcon = document.getElementById("cartAmount"); // Get the reference to the cart icon
  // Calculate the total number of items in the cart and display it
  cartIcon.innerHTML = basket.map((x) => x.item).reduce((x, y) => x + y, 0);
};

// Call calculation to display the current number of items in the cart on page load
calculation();

