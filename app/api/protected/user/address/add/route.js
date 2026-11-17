import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { connectDB } from "@/connections/connect db";
import Address from "@/models/Address";
import mongoose from "mongoose";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^[0-9]{10}$/;
const PINCODE_REGEX = /^[1-9][0-9]{5}$/;
const OBJECT_ID_REGEX = /^[0-9a-fA-F]{24}$/;

export async function POST(request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized",
        },
        { status: 401 }
      );
    }

    let body;

    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid request body.",
        },
        { status: 400 }
      );
    }

    const { address, addressId } = body;

    if (
      !address ||
      typeof address !== "object" ||
      Array.isArray(address)
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Address details are required.",
        },
        { status: 400 }
      );
    }

    const {
      email,
      phone,
      address: street,
      apartment,
      city,
      state,
      pincode,
    } = address;

    const normalizedAddress = {
      email: String(email || "").trim().toLowerCase(),
      phone: String(phone || "").trim(),
      address: String(street || "").trim(),
      apartment: String(apartment || "").trim(),
      city: String(city || "").trim(),
      state: String(state || "").trim(),
      pincode: String(pincode || "").trim(),
    };

    // Validate email
    if (
      !normalizedAddress.email ||
      normalizedAddress.email.length > 254 ||
      !EMAIL_REGEX.test(normalizedAddress.email)
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Enter a valid email address.",
        },
        { status: 400 }
      );
    }

    // Validate phone number
    if (!PHONE_REGEX.test(normalizedAddress.phone)) {
      return NextResponse.json(
        {
          success: false,
          message: "Enter a valid 10-digit phone number.",
        },
        { status: 400 }
      );
    }

    // Validate required address fields
    if (
      !normalizedAddress.address ||
      !normalizedAddress.city ||
      !normalizedAddress.state
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Please complete all required address fields.",
        },
        { status: 400 }
      );
    }

    // Validate PIN code
    if (!PINCODE_REGEX.test(normalizedAddress.pincode)) {
      return NextResponse.json(
        {
          success: false,
          message: "Enter a valid 6-digit PIN code.",
        },
        { status: 400 }
      );
    }

    // Validate address ID when editing
    if (addressId && !OBJECT_ID_REGEX.test(String(addressId))) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid address ID.",
        },
        { status: 400 }
      );
    }

    await connectDB();

    // ====================================
    // UPDATE EXISTING ADDRESS
    // ====================================

    if (addressId) {
      const updatedDocument = await Address.findOneAndUpdate(
        {
          userId,
          "addresses._id": new mongoose.Types.ObjectId(addressId),
        },
        {
          $set: {
            "addresses.$.email": normalizedAddress.email,
            "addresses.$.phone": normalizedAddress.phone,
            "addresses.$.address": normalizedAddress.address,
            "addresses.$.apartment": normalizedAddress.apartment,
            "addresses.$.city": normalizedAddress.city,
            "addresses.$.state": normalizedAddress.state,
            "addresses.$.pincode": normalizedAddress.pincode,
          },
        },
        {
          new: true,
          runValidators: true,
        }
      );

      if (!updatedDocument) {
        return NextResponse.json(
          {
            success: false,
            message: "Saved address not found.",
          },
          { status: 404 }
        );
      }

      return NextResponse.json(
        {
          success: true,
          message: "Address updated successfully.",
          savedAddresses: updatedDocument.addresses,
        },
        { status: 200 }
      );
    }

    // ====================================
    // ADD NEW ADDRESS
    // ====================================

    const updatedDocument = await Address.findOneAndUpdate(
      { userId },
      {
        $push: {
          addresses: normalizedAddress,
        },
      },
      {
        new: true,
        upsert: true,
        runValidators: true,
        setDefaultsOnInsert: true,
      }
    );

    return NextResponse.json(
      {
        success: true,
        message: "Address added successfully.",
        savedAddresses: updatedDocument.addresses,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("SAVE ADDRESS ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Internal server error.",
      },
      { status: 500 }
    );
  }
}