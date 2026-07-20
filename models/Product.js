import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    collection: {
      type: String,
      required: true,
      trim: true
    },

    variants: [
      {
        id: {
          type: String,
          required: true,
          tirm: true
        },
        name: {
          type: String,
          required: true,
          trim: true
        },

        images: [
          {
            type: String,
            required: true,
          },
        ],

        sizes: [
          {
            type: String,
            enum: ["XS","S", "M", "L", "XL", "XXL", "XXXL"],
            required: true,
          },
        ],

        stock: {
          type: Number,
          required: true,
          min: 0,
        },

        price: {
          type: Number,
          required: true,
          min: 0,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Product || mongoose.model('Product', productSchema );