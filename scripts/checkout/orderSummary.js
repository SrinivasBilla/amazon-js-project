import { calculateCartQuantity, cart, removeFromCart, updateDeliveryOption, updateQuantity } from "../../data/cart.js";
import { products, getProduct } from "../../data/products.js";
import { formatCurrency } from "../utils/money.js";
import  dayjs  from "https://unpkg.com/dayjs@1.11.10/esm/index.js";
import { deliveryOptions, getDeliveryOption, calculateDeliveryOption } from "../../data/deliveryOption.js";
import { renderPaymentSummary } from "./paymentSummary.js";
import { renderCheckOutHeader } from "./checkoutHeader.js";

export function renderOrderSummary() {
    let cartSummaryHTML = '';
    cart.forEach((cartItem) => {
      const productId = cartItem.productId;
      const matchingItem = getProduct(productId);
      const deliveryOptionId = cartItem.deliveryOptionId;
      const deliveryOption = getDeliveryOption(deliveryOptionId);
      const today = dayjs();
      const deliveryDate = today.add(
      deliveryOption.deliveryDays,
      'days'
    );
    const dateString = deliveryDate.format(
      'dddd, MMMM D'
    );
      cartSummaryHTML += `
      <div class="cart-item-container js-cart-item-container js-cart-item-container-${matchingItem.id}">
                <div class="delivery-date">
                  Delivery date: ${dateString}
                </div>

                <div class="cart-item-details-grid">
                  <img class="product-image"
                    src="${matchingItem.image}">

                  <div class="cart-item-details">
                    <div class="product-name">
                      ${matchingItem.name}
                    </div>
                    <div class="product-price">
                      $${formatCurrency(matchingItem.priceCents)}
                    </div>
                    <div class="product-quantity js-product-quantity-${matchingItem.id}">
                      <span>
                        Quantity: <span class="quantity-label js-quantity-label-${matchingItem.id}">${cartItem.quantity}</span>
                      </span>
                      <span class="update-quantity-link link-primary js-update-link" data-product-id="${matchingItem.id}">
                        Update
                      </span>
                      <input class="quantity-input js-quantity-input-${matchingItem.id}">
                        <span class="save-quantity-link link-primary js-save-quantity-link" data-product-id="${matchingItem.id}">Save</span>
                      <span class="delete-quantity-link link-primary js-delete-link js-delete-link-${matchingItem.id}" data-product-id="${matchingItem.id}">
                        Delete
                      </span>
                    </div>
                  </div>

                  <div class="delivery-options">
                    <div class="delivery-options-title">
                      Choose a delivery option:
                    </div>
                    ${deliveryOptionsHTMl(matchingItem, cartItem)}
                  </div>

                </div>
              </div>
            </div>
            </div>
      `;

    });

    function deliveryOptionsHTMl(matchingItem, cartItem) {
      let html = "";
      deliveryOptions.forEach((deliveryOption) => {
        const dateString = calculateDeliveryOption(deliveryOption);
        const priceString = deliveryOption.priceCents === 0 ? 'FREE' : `$${formatCurrency(deliveryOption.priceCents)} - `;
        const isChecked = deliveryOption.id === cartItem.deliveryOptionId;

        html += 
              ` <div class="delivery-option js-delivery-option"
                    data-product-id="${matchingItem.id}"
                    data-delivery-option-id="${deliveryOption.id}">
                            <input type="radio" 
                            ${isChecked ? 'checked' : ''} class="delivery-option-input"
                              name="delivery-option-${matchingItem.id}">
                            <div>
                              <div class="delivery-option-date">
                                ${dateString}
                              </div>
                              <div class="delivery-option-price">
                                ${priceString}
                              </div>
                            </div>
                            </div>`

      });
      return html;
    }


    document.querySelector('.js-cart-summary').innerHTML = cartSummaryHTML;
    document.querySelectorAll('.js-delete-link').forEach((link) => {
      link.addEventListener('click', () => {
        const productId = link.dataset.productId;
        removeFromCart(productId);

        renderOrderSummary();
        renderPaymentSummary();
        renderCheckOutHeader();
        
      });
    });


    function updateCartQuantity() {
          const cartQuantity = calculateCartQuantity();
          document.querySelector('.js-return-to-home-link').innerHTML = `${cartQuantity} items`;
    }
          
    updateCartQuantity();  

    document.querySelectorAll(".js-update-link").forEach((link) => {
      link.addEventListener('click', () => {
        const productId = link.dataset.productId;
        console.log(productId);
        const container = document.querySelector(`.js-cart-item-container-${productId}`);
        container.classList.add('is-editing-quantity');
      })

    })
    document.querySelectorAll(".js-save-quantity-link").forEach((link) => {
      link.addEventListener('click', () => {
        const productId = link.dataset.productId;
        
        const quantityInput = document.querySelector(`.js-quantity-input-${productId}`);
        const newQuantity = Number(quantityInput.value);
        if (newQuantity < 0 || newQuantity >= 1000) {
          alert('Quantity must be at least 0 and less than 1000');
          return;
        }
        updateQuantity(productId, newQuantity);
        
        const container = document.querySelector(
          `.js-cart-item-container-${productId}`
        );
        container.classList.remove('is-editing-quantity');

        const quantityLabel = document.querySelector(`.js-quantity-label-${productId}`);
        quantityLabel.innerHTML = newQuantity;
        updateCartQuantity();
      })

    });

    document.querySelectorAll('.js-delivery-option').forEach((element) => {
      element.addEventListener('click', () => {
        const {productId, deliveryOptionId} = element.dataset;
        updateDeliveryOption(productId, deliveryOptionId);
        renderOrderSummary();
        renderPaymentSummary();
      });

    })
  }

  