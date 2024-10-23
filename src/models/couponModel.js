const mongoose = require("mongoose");

const couponSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      required: true,
      enum: ["cart-wise", "product-wise", "bxgy"], // Restrict types to predefined values
    },
    discountDetails: {
      type: Object,
      required: true,
    },
    conditions: {
      type: Object,
      required: true,
    },
    expirationDate: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt timestamps
  }
);

// Method to check if the coupon is applicable to the cart
couponSchema.methods.isApplicable = function (cartItems) {
  const now = new Date();

  // Check if coupon is expired
  if (this.expirationDate && this.expirationDate < now) {
    return false;
  }
  // Conditions based on coupon type
  switch (this.type) {
    case "cart-wise":
      const totalCartAmount = cartItems.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0
      );
      return totalCartAmount >= this.conditions.minCartAmount;

    case "product-wise":
      return cartItems.some((item) =>
        this.conditions.applicableProducts.includes(item.productId)
      );

    case "bxgy":
      const buyItemsCount = cartItems
        .filter((item) => this.conditions.buyProducts.includes(item.productId))
        .reduce((acc, item) => acc + item.quantity, 0);
      return buyItemsCount >= this.conditions.buyQuantity;

    default:
      return false;
  }
};

// Method to calculate discount based on the coupon type
couponSchema.methods.calculateDiscount = function (cartItems) {
  let discount = 0;

  switch (this.type) {
    case "cart-wise":
      const totalCartAmount = cartItems.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0
      );
      discount = totalCartAmount * (this.discountDetails.percentage / 100);
      break;

    case "product-wise":
      cartItems.forEach((item) => {
        if (this.conditions.applicableProducts.includes(item.productId)) {
          discount +=
            item.price *
            (this.discountDetails.percentage / 100) *
            item.quantity;
        }
      });
      break;

    case "bxgy":
      let freeItemsCount = 0;
      const buyItemsCount = cartItems
        .filter((item) => this.conditions.buyProducts.includes(item.productId))
        .reduce((acc, item) => acc + item.quantity, 0);

      const repetitions = Math.floor(
        buyItemsCount / this.conditions.buyQuantity
      );
      freeItemsCount = Math.min(
        repetitions * this.conditions.getQuantity,
        cartItems
          .filter((item) =>
            this.conditions.getProducts.includes(item.productId)
          )
          .reduce((acc, item) => acc + item.quantity, 0)
      );

      cartItems.forEach((item) => {
        if (
          this.conditions.getProducts.includes(item.productId) &&
          freeItemsCount > 0
        ) {
          const freeCount = Math.min(item.quantity, freeItemsCount);
          discount += item.price * freeCount;
          freeItemsCount -= freeCount;
        }
      });
      break;

    default:
      discount = 0;
  }

  return discount;
};

// Method to apply the coupon to the cart (returns updated cart with discounts applied)
couponSchema.methods.applyToCart = function (cartItems) {
  const updatedCart = cartItems.map((item) => {
    let discountedItem = { ...item };

    if (
      this.type === "product-wise" &&
      this.conditions.applicableProducts.includes(item.productId)
    ) {
      console.log("ppppppp", discountedItem, item, this);
      discountedItem.price -=
        item.price * (this.discountDetails.percentage / 100);
    } else if (
      this.type === "bxgy" &&
      this.conditions.getProducts.includes(item.productId)
    ) {
      const applicableFreeItems = Math.min(
        this.conditions.getQuantity,
        item.quantity
      );
      discountedItem.price = applicableFreeItems > 0 ? 0 : item.price;
    }
    console.log("discounted ", discountedItem);
    return discountedItem;
  });

  return updatedCart;
};

const Coupon = mongoose.model("Coupon", couponSchema);

module.exports = Coupon;
