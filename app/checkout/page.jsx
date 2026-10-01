"use client";

import React, { useState, useEffect } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import {
  Mail,
  MapPin,
  Tag,
  LockKeyhole,
  ChevronLeft,
  ChevronDown,
  ArrowRight,
} from "lucide-react";

// Helpers
const formatPrice = (price) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(price);
};

// Reusable form components

function FieldError({ message }) {
  if (!message) return null;

  return <p className="mt-1.5 text-xs text-red-500">{message}</p>;
}

function InputField({
  label,
  name,
  placeholder,
  register,
  errors,
  type = "text",
  required = false,
  className = "",
}) {
  return (
    <div className={className}>
      <label
        htmlFor={name}
        className="mb-2 block text-sm font-medium text-neutral-900"
      >
        {label}
      </label>

      <input
        id={name}
        type={type}
        placeholder={placeholder}
        {...register(name, {
          required: required ? `${label} is required` : false,
        })}
        className={`
          h-14 w-full rounded-xl border bg-white px-4
          text-sm text-neutral-900 outline-none transition
          placeholder:text-neutral-400
          focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900
          ${errors[name] ? "border-red-400" : "border-neutral-200"}
        `}
      />

      <FieldError message={errors[name]?.message} />
    </div>
  );
}

// Checkout page

export default function Checkout() {
  const params = useSearchParams();

  const items = React.useMemo(() => {
    try {
      return JSON.parse(params.get("items") || "[]");
    } catch {
      return [];
    }
  }, [params]);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      firstName: "",
      lastName: "",
      address: "",
      apartment: "",
      city: "",
      state: "",
      pinCode: "",
      country: "India",
      saveAddress: false,
      orderUpdates: true,
    },
    mode: "onBlur",
  });

  // cart items
  const [cartItems, setCartItems] = useState([]);
  const displayItems = cartItems.map((item, index) => ({
    ...item,
    name: item.name || `Product ${index + 1}`,
    price: item.price ?? 0,
    quantity: item.quantity ?? 1,
    variant:
      item.variant ||
      item.size ||
      (item.variantId ? `Variant ${item.variantId}` : ""),
  }));

  // Calculate order totals
  const subtotal = displayItems.reduce(
    (total, item) => total + (item.price || 0) * (item.quantity || 1),
    0,
  );

  const shipping = 0;
  const total = subtotal + shipping;

  const [showSavedAddresses, setShowSavedAddresses] = useState(false);
  //fetch cart items for cart checkout
  const fetchCart = async () => {
    try {
      const res = await fetch("/api/protected/user/cart/get");
      const r = await res.json();
      setCartItems(r.cart);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  //fetching saved addresses initially
  const [savedAddresses, setSavedAddresses] = useState([]);

  const fetchSavedAddresses = async () => {
    const res = await fetch("/api/protected/user/address/get");
    const r = await res.json();
    setSavedAddresses(r.savedAddresses);
  };

  useEffect(() => {
    fetchSavedAddresses();
  }, []);

  //managing form filling when a saved address is clicked
  const handleFillAddress = (address) => {
    setValue("address", address.address);
    setValue("apartment", address.apartment);
    setValue("city", address.city);
    setValue("state", address.state);
    setValue("pinCode", address.pincode);
    setShowSavedAddresses(false);
  };

  //create order
  const createOrder = async () => {
    const res = await fetch("/api/protected/payment/order/create", {
      method: "POST",
    });
    const r = await res.json();
    console.log("fetched order details: ", r)
    return r.order.id;
  };

  //handle checkout
  const submitCheckout = async (data) => {
    const orderId = await createOrder();

    //payment handle scripts:
    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY,
      amount: 100,
      currency: "INR",
      name: "RIVIX™",
      image: "/assets/logo/rivix-symbol-black.png",
      order_id: orderId,
      handler: async function (response) {
        //esnd payment details to backend
        const verifyRes = await fetch("/api/protected/payment/verify", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
            razorpay_order_id: orderId,
          }),
        });

        const result = await verifyRes.json();

        if (result.success) {
          window.location.href = "/checkout/success";
        } else {
          window.location.href = "/checkout/failed";
        }
      },
      notes: {},
      theme: {
        color: "#3399cc",
      },
    };
    const rzp1 = new Razorpay(options);
    rzp1.on('payment.failed', function (response){
        alert(response.error.code);
        alert(response.error.description);
        alert(response.error.source);
        alert(response.error.step);
        alert(response.error.reason);
        alert(response.error.metadata.order_id);
        alert(response.error.metadata.payment_id);
});
    rzp1.open();
  };

  return (
    <div className="min-h-screen bg-white text-neutral-950">
      <script src="https://checkout.razorpay.com/v1/checkout.js"></script>
      {/* Header */}

      <header className="border-b border-neutral-200">
        <div className="mx-auto flex h-[88px] max-w-[1440px] items-center justify-between px-5 sm:px-8 lg:px-12">
          <h1 className="font-heading text-2xl font-bold tracking-tight sm:text-3xl">
            RIVIX
          </h1>

          <div
            className="
              font-heading text-sm font-bold uppercase
              tracking-tight transition-opacity
              hover:opacity-60
              sm:text-lg
            "
          >
            Continue to purchase
          </div>
        </div>
      </header>

      {/* Main checkout */}

      <main className="mx-auto max-w-[1440px] px-5 py-8 sm:px-8 lg:px-12 lg:py-12">
        <form
          onSubmit={handleSubmit(submitCheckout)}
          className="
            grid items-start gap-10
            lg:grid-cols-[minmax(0,1fr)_500px]
            xl:gap-16
          "
        >
          {/* Left column */}

          <div className="min-w-0">
            {/* Checkout progress */}

            <div className="mb-12 hidden sm:block">
              <div className="flex items-start">
                {["Information", "Shipping", "Payment", "Review"].map(
                  (step, index) => (
                    <React.Fragment key={step}>
                      <div className="flex min-w-[80px] flex-col items-center">
                        <div
                          className={`
                          flex h-8 w-8 items-center justify-center
                          rounded-full text-xs font-medium
                          ${
                            index === 0
                              ? "bg-neutral-950 text-white"
                              : "bg-neutral-100 text-neutral-600"
                          }
                        `}
                        >
                          {index + 1}
                        </div>

                        <span
                          className={`
                          mt-2 text-xs
                          ${
                            index === 0
                              ? "font-medium text-neutral-950"
                              : "text-neutral-500"
                          }
                        `}
                        >
                          {step}
                        </span>
                      </div>

                      {index !== 3 && (
                        <div className="mt-4 h-px flex-1 bg-neutral-200" />
                      )}
                    </React.Fragment>
                  ),
                )}
              </div>
            </div>

            {/* Contact information */}

            <section>
              <div className="mb-5 flex items-end justify-between relative">
                <h2 className="font-heading text-xl font-bold uppercase sm:text-2xl">
                  Contact Information
                </h2>

                {/* address selection will be here */}
                <button
                  type="button"
                  className="flex items-center cursor-pointer"
                  onClick={() => {
                    setShowSavedAddresses((prev) => !prev);
                  }}
                >
                  Saved Addresses{" "}
                  <ChevronLeft
                    size={18}
                    className={`right-0 top-5 transition-transform ${
                      showSavedAddresses ? "rotate-90" : "-rotate-90"
                    }`}
                  />
                </button>
                {showSavedAddresses && (
                  <ul className="absolute right-0 top-10 z-50 bg-background border border-element-border flex flex-col gap-3 items-start w-full rounded-lg">
                    {savedAddresses.length === 0 ? (
                      <li className="w-full py-3 px-5">No address is saved</li>
                    ) : (
                      savedAddresses.map((item, idx) => (
                        <li
                          onClick={() => handleFillAddress(item)}
                          key={idx}
                          className="hover:bg-gray-200 cursor-pointer w-full py-3 px-5 capitalize"
                        >
                          {item.address}
                        </li>
                      ))
                    )}
                  </ul>
                )}
              </div>

              <div className="relative">
                <Mail
                  size={20}
                  strokeWidth={1.5}
                  className="
                    pointer-events-none absolute left-4 top-1/2
                    -translate-y-1/2 text-neutral-700
                  "
                />

                <input
                  id="phone"
                  type="tel"
                  placeholder="9973XXXXXX"
                  {...register("phone", {
                    required: "Phone no is required",
                  })}
                  className={`
                    h-16 w-full rounded-xl border bg-white
                    pl-12 pr-4 text-sm outline-none transition
                    placeholder:text-neutral-400
                    focus:border-neutral-950
                    focus:ring-1 focus:ring-neutral-950
                    ${errors.phone ? "border-red-400" : "border-neutral-200"}
                  `}
                />

                <label
                  htmlFor="phone"
                  className="
                    pointer-events-none absolute left-12 top-2
                    text-xs text-neutral-500
                  "
                >
                  Phone No.
                </label>
              </div>

              <FieldError message={errors.phone?.message} />
            </section>

            {/* Shipping address */}

            <section className="mt-12">
              <h2 className="mb-5 font-heading text-xl font-bold uppercase sm:text-2xl">
                Shipping Address
              </h2>

              <div className="grid gap-4 sm:grid-cols-2">
                <InputField
                  label="First name"
                  name="firstName"
                  placeholder="Lomash"
                  register={register}
                  errors={errors}
                  required
                />

                <InputField
                  label="Last name"
                  name="lastName"
                  placeholder="Jangde"
                  register={register}
                  errors={errors}
                  required
                />
              </div>

              <div className="mt-4">
                <div className="relative">
                  <MapPin
                    size={20}
                    strokeWidth={1.5}
                    className="
                      pointer-events-none absolute left-4 top-1/2
                      -translate-y-1/2 text-neutral-700
                    "
                  />

                  <input
                    id="address"
                    type="text"
                    placeholder="House number, street name"
                    {...register("address", {
                      required: "Address is required",
                    })}
                    className={`
                      h-16 w-full rounded-xl border bg-white
                      pl-12 pr-4 text-sm outline-none transition
                      placeholder:text-neutral-400
                      focus:border-neutral-950
                      focus:ring-1 focus:ring-neutral-950
                      ${
                        errors.address ? "border-red-400" : "border-neutral-200"
                      }
                    `}
                  />

                  <label
                    htmlFor="address"
                    className="
                      pointer-events-none absolute left-12 top-2
                      text-xs text-neutral-500
                    "
                  >
                    Address
                  </label>
                </div>

                <FieldError message={errors.address?.message} />
              </div>

              <div className="mt-4">
                <InputField
                  label="Apartment, suite, etc. (optional)"
                  name="apartment"
                  placeholder="e.g. Apt 101"
                  register={register}
                  errors={errors}
                />
              </div>

              {/* City, state and PIN */}

              <div className="mt-4 grid gap-4 sm:grid-cols-3">
                <InputField
                  label="City"
                  name="city"
                  placeholder="Raipur"
                  register={register}
                  errors={errors}
                  required
                />

                <div>
                  <label
                    htmlFor="state"
                    className="mb-2 block text-sm font-medium text-neutral-900"
                  >
                    State / Province
                  </label>

                  <div className="relative">
                    <input
                      id="state"
                      type="text"
                      placeholder="Chhattisgarh"
                      {...register("state", {
                        required: "State is required",
                      })}
                      className={`
                        h-14 w-full appearance-none rounded-xl
                        border bg-white px-4 pr-10 text-sm
                        outline-none transition
                        focus:border-neutral-950
                        focus:ring-1 focus:ring-neutral-950
                        ${
                          errors.state ? "border-red-400" : "border-neutral-200"
                        }
                      `}
                    ></input>
                  </div>

                  <FieldError message={errors.state?.message} />
                </div>

                <InputField
                  label="PIN code"
                  name="pinCode"
                  placeholder="400001"
                  register={register}
                  errors={errors}
                  required
                />
              </div>

              {/* Country */}

              <div className="mt-4">
                <label
                  htmlFor="country"
                  className="mb-2 block text-sm font-medium text-neutral-900"
                >
                  Country
                </label>

                <div className="relative">
                  <select
                    id="country"
                    {...register("country", {
                      required: "Country is required",
                    })}
                    className="
                      h-14 w-full appearance-none rounded-xl
                      border border-neutral-200 bg-white
                      px-4 pr-10 text-sm outline-none transition
                      focus:border-neutral-950
                      focus:ring-1 focus:ring-neutral-950
                    "
                  >
                    <option value="India">India</option>
                  </select>

                  <ChevronLeft
                    size={18}
                    className={`pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 transition-transform ${
                      showSavedAddresses ? "rotate-90" : "-rotate-90"
                    }`}
                  />
                </div>
              </div>

              {/* Save address */}

              <label className="mt-4 flex cursor-pointer items-center gap-3 text-sm text-neutral-700">
                <input
                  type="checkbox"
                  {...register("saveAddress")}
                  className="
                    h-5 w-5 cursor-pointer appearance-none
                    rounded border border-neutral-300
                    checked:border-neutral-950
                    checked:bg-neutral-950
                    relative
                    after:absolute after:left-1/2 after:top-1/2
                    after:hidden after:h-2 after:w-1
                    after:-translate-x-1/2 after:-translate-y-1/2
                    after:rotate-45
                    after:border-b-2 after:border-r-2
                    after:border-white
                    checked:after:block
                  "
                />
                Save this address for next time
              </label>
            </section>

            {/* Shipping method */}

            <section className="mt-12">
              <h2 className="mb-5 font-heading text-xl font-bold uppercase sm:text-2xl">
                Shipping Method
              </h2>

              <div className="flex min-h-[76px] items-center justify-between rounded-xl border border-neutral-300 px-5">
                <div className="flex items-center gap-4">
                  <div className="flex h-5 w-5 items-center justify-center rounded-full border-[6px] border-neutral-950" />

                  <div>
                    <p className="text-sm font-semibold">Standard Shipping</p>

                    <p className="mt-1 text-sm text-neutral-500">
                      3–7 business days
                    </p>
                  </div>
                </div>

                <span className="text-sm font-semibold">Free</span>
              </div>
            </section>

            {/* Mobile payment button */}

            <button
              type="submit"
              disabled={isSubmitting}
              className="
                mt-8 flex h-14 w-full items-center
                justify-center gap-3 rounded-xl
                bg-neutral-950 px-5 text-sm font-semibold
                text-white transition
                hover:bg-neutral-800
                disabled:cursor-not-allowed
                disabled:opacity-60
                lg:hidden
              "
            >
              {isSubmitting ? "Processing..." : "Proceed to Payment"}

              {!isSubmitting && <ArrowRight size={19} />}
            </button>
          </div>

          {/* Right column - order summary */}

          <aside className="lg:sticky lg:top-8">
            <div className="rounded-2xl bg-neutral-50 p-6 sm:p-8">
              {/* Order summary header */}

              <div className="flex items-center justify-between gap-4">
                <h2 className="font-heading text-xl font-bold uppercase sm:text-2xl">
                  Order Summary ({displayItems.length})
                </h2>
              </div>

              {/* Products */}

              <div className="mt-7 space-y-5">
                {displayItems.length > 0 ? (
                  displayItems.map((item, index) => (
                    <div
                      key={`${item.productId}-${item.variantId}-${index}`}
                      className="flex gap-4"
                    >
                      {/* Product image */}

                      <div
                        className="
                          flex h-24 w-24 shrink-0
                          items-center justify-center
                          overflow-hidden rounded-xl
                          bg-neutral-200
                          sm:h-28 sm:w-28
                        "
                      >
                        {item.image ? (
                          <img
                            src={item.image}
                            alt={item.name}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <span className="text-xs text-neutral-500">
                            PRODUCT
                          </span>
                        )}
                      </div>

                      {/* Product information */}

                      <div className="min-w-0 flex-1">
                        <div className="flex justify-between gap-3">
                          <h3 className="text-sm font-semibold">{item.name}</h3>

                          <span className="shrink-0 text-sm font-semibold">
                            {formatPrice(
                              (item.price || 0) * (item.quantity || 1),
                            )}
                          </span>
                        </div>

                        {item.variant && (
                          <p className="mt-1 text-sm text-neutral-500">
                            {item.variant}
                          </p>
                        )}

                        <p className="mt-3 text-sm text-neutral-500">
                          Qty: {item.quantity}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="rounded-xl border border-dashed border-neutral-300 py-10 text-center">
                    <p className="text-sm text-neutral-500">
                      No items selected
                    </p>
                  </div>
                )}
              </div>

              <div className="my-7 h-px bg-neutral-200" />

              {/* Discount code */}
              {/* 
              <div className="flex gap-3">
                <div className="relative flex-1">
                  <Tag
                    size={19}
                    strokeWidth={1.5}
                    className="
                      pointer-events-none absolute left-4
                      top-1/2 -translate-y-1/2
                      text-neutral-600
                    "
                  />

                  <input
                    type="text"
                    placeholder="Discount code or gift card"
                    className="
                      h-14 w-full rounded-xl border
                      border-neutral-200 bg-white
                      pl-12 pr-4 text-sm outline-none transition
                      placeholder:text-neutral-400
                      focus:border-neutral-950
                      focus:ring-1 focus:ring-neutral-950
                    "
                  />
                </div>

                <button
                  type="button"
                  className="
                    h-14 rounded-xl bg-neutral-950
                    px-6 text-sm font-semibold text-white
                    transition hover:bg-neutral-800
                  "
                >
                  Apply
                </button>
              </div> */}

              {/* Order totals */}

              <div className="mt-7 space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <span>Subtotal</span>

                  <span className="font-medium">{formatPrice(subtotal)}</span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span>Shipping</span>

                  <span className="font-medium">
                    {shipping === 0 ? "Free" : formatPrice(shipping)}
                  </span>
                </div>
              </div>

              <div className="my-6 h-px bg-neutral-200" />

              {/* Total */}

              <div className="flex items-start justify-between">
                <div>
                  <p className="text-base font-bold">Total</p>

                  <p className="mt-1 text-xs text-neutral-500">
                    Including all taxes
                  </p>
                </div>

                <p className="text-xl font-bold sm:text-2xl">
                  {formatPrice(total)}
                </p>
              </div>

              {/* Desktop payment button */}

              <button
                type="submit"
                disabled={isSubmitting}
                className="
                  mt-6 flex h-14 w-full items-center
                  justify-center gap-3 rounded-xl
                  bg-neutral-950 px-5
                  text-sm font-semibold text-white
                  transition hover:bg-neutral-800
                  disabled:cursor-not-allowed
                  disabled:opacity-60
                "
              >
                {isSubmitting ? "Processing..." : "Proceed to Payment"}

                {!isSubmitting && <ArrowRight size={19} />}
              </button>

              {/* Security message */}

              <div className="mt-5 flex items-center justify-center gap-2 text-xs text-neutral-500">
                <LockKeyhole size={14} />

                <span>Secure checkout. Your information is protected.</span>
              </div>
            </div>
          </aside>
        </form>
      </main>

      {/* Floating button */}

      <button
        type="button"
        className="
          fixed bottom-5 left-5
          flex h-11 w-11 items-center justify-center
          rounded-full border border-neutral-600
          bg-neutral-900 text-sm font-medium text-white
          shadow-lg
        "
      >
        N
      </button>
    </div>
  );
}
