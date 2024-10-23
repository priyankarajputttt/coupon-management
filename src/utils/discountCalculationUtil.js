// Utility function to calculate discount for different coupon types
const calculateDiscount = (cartItems, coupon) => {
  let discount = 0;

  switch (coupon.type) {
    case "cart-wise":
      discount = calculateCartWiseDiscount(cartItems, coupon);
      break;

    case "product-wise":
      discount = calculateProductWiseDiscount(cartItems, coupon);
      break;

    case "bxgy":
      discount = calculateBxGyDiscount(cartItems, coupon);
      break;

    default:
      throw new Error("Invalid coupon type");
  }

  return discount;
};

// Calculate discount for cart-wise coupons
const calculateCartWiseDiscount = (cartItems, coupon) => {
  const cartTotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  if (cartTotal >= coupon.conditions.minCartAmount) {
    return (coupon.discountDetails.percentage / 100) * cartTotal;
  }

  return 0;
};

// Calculate discount for product-wise coupons
const calculateProductWiseDiscount = (cartItems, coupon) => {
  let discount = 0;

  cartItems.forEach((item) => {
    if (coupon.conditions.applicableProducts.includes(item.productId)) {
      discount +=
        (coupon.discountDetails.percentage / 100) * item.price * item.quantity;
    }
  });

  return discount;
};

// Calculate discount for BxGy (Buy X Get Y) coupons
const calculateBxGyDiscount = (cartItems, coupon) => {
  const buyItems = cartItems.filter((item) =>
    coupon.conditions.buyProducts.includes(item.productId)
  );
  const getItems = cartItems.filter((item) =>
    coupon.conditions.getProducts.includes(item.productId)
  );

  // Check if the cart satisfies the "buy" conditions
  let buyCount = buyItems.reduce((sum, item) => sum + item.quantity, 0);
  let getCount = Math.min(
    Math.floor(buyCount / coupon.conditions.buyQuantity),
    getItems.length
  );

  // Calculate the discount for the free items
  let discount = 0;
  for (let i = 0; i < getCount; i++) {
    discount += getItems[i].price; // Assuming the full price of the "get" item is discounted
  }

  return discount;
};

module.exports = {
  calculateDiscount,
};
