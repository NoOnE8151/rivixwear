import mongoose from "mongoose";

const cartSchema = new mongoose.Schema(
  {
    product: [
      {
        userId: {
          type: String,
          required: true,

        },
        id: {
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
        price: {
          type: Number,
          required: true,
        },
      },
    ],
  },
  {
    timestamps: true,
  },
);

export default mongoose.models.Cart || mongoose.model("Cart", cartSchema);
