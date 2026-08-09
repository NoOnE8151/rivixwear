import mongoose from "mongoose";

const cartSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      unique: true,
    },

    products: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
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
      },
    ],
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Cart || mongoose.model("Cart", cartSchema);