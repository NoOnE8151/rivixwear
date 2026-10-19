  import mongoose from "mongoose";

  const orderSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
    }, 
    products: [{
        productId: {
            type: String,
            required: true,
        },
         variantId: {
          type: String,
          required: true,
        },
        size: {
          type: String,
          enum: ["XS", "S", "M", "L", "XL", "XXL"],
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          default: 1,
          min: 1,
        },
        price: {
          type: Number,
          required: true,
        },
      }],
      status: {
          type: String,
          enum: ["pending", "active", "accepted", "fulfilled", "cancelled"],
          required: true
      },
      paymentMethod: {
          type: String,
          enum: ["cod", "prepaid"]
      },
  }, {
    timestamps: true
  });

  export default mongoose.models.Order || mongoose.model("Order", orderSchema);