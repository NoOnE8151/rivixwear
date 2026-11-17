
"use client";

import { useEffect, useState } from "react";
import {
  MapPin,
  Phone,
  Mail,
  Home,
  Plus,
  Pencil,
  ArrowLeft,
  Save,
  Loader2,
  CheckCircle2,
  AlertCircle,
  MapPinned,
  X,
  Trash2,
} from "lucide-react";

const ADDRESS_GET_API = "/api/protected/user/address/get";
const ADDRESS_SAVE_API = "/api/protected/user/address/add";
const ADDRESS_DELETE_API = "/api/protected/user/address/delete";

const initialForm = {
  email: "",
  phone: "",
  address: "",
  apartment: "",
  city: "",
  state: "",
  pincode: "",
};

function normalizeAddress(address = {}) {
  return {
    _id: address._id || "",
    email: String(address.email ?? ""),
    phone: String(address.phone ?? ""),
    address: address.address || "",
    apartment: address.apartment || "",
    city: address.city || "",
    state: address.state || "",
    pincode: String(address.pincode ?? ""),
  };
}

function FormField({
  label,
  name,
  value,
  onChange,
  placeholder,
  required = false,
  maxLength,
  inputMode,
  autoComplete,
  type = "text",
}) {
  return (
    <div className="space-y-2">
      <label
        htmlFor={name}
        className="block text-xs font-semibold text-foreground"
      >
        {label}
        {required && (
          <span className="ml-1 text-status-danger">*</span>
        )}
      </label>

      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        maxLength={maxLength}
        inputMode={inputMode}
        autoComplete={autoComplete}
        className="h-12 w-full border border-element-border bg-background px-4 text-sm text-foreground outline-none transition-colors placeholder:text-foreground-muted focus:border-accent"
      />
    </div>
  );
}

function EmptyAddress({ onAdd }) {
  return (
    <div className="flex min-h-[340px] flex-col items-center justify-center border border-dashed border-element-border bg-background px-5 py-12 text-center">
      <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-background-soft">
        <MapPinned
          size={28}
          strokeWidth={1.5}
          className="text-foreground-muted"
        />
      </div>

      <h2 className="text-lg font-semibold text-foreground">
        No saved addresses
      </h2>

      <p className="mt-2 max-w-sm text-sm leading-relaxed text-foreground-muted">
        Add your delivery address to make your future RIVIX purchases easier.
      </p>

      <button
        type="button"
        onClick={onAdd}
        className="mt-7 inline-flex items-center gap-2 bg-background-inverse px-6 py-3 text-sm font-semibold text-foreground-inverse transition-colors hover:bg-element-hover"
      >
        <Plus size={17} />
        Add Address
      </button>
    </div>
  );
}

function AddressCard({
  address,
  index,
  onEdit,
  onDelete,
  isDeleting,
}) {
  return (
    <article className="overflow-hidden border border-element-border bg-background">
      <div className="flex items-center justify-between gap-3 border-b border-element-border bg-background-soft/40 px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center bg-background-muted">
            <Home size={17} className="text-foreground" />
          </div>

          <div>
            <p className="text-sm font-semibold text-foreground">
              Delivery Address {index + 1}
            </p>
            <p className="mt-0.5 text-[10px] uppercase tracking-wider text-foreground-muted">
              Saved address
            </p>
          </div>
        </div>

        <span className="bg-status-success/10 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-status-success">
          Saved
        </span>
      </div>

      <div className="space-y-5 p-5 sm:p-6">
        <div className="flex gap-3">
          <MapPin
            size={18}
            className="mt-0.5 shrink-0 text-foreground-muted"
          />

          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-wider text-foreground-muted">
              Address
            </p>

            <p className="mt-2 break-words text-sm leading-relaxed text-foreground">
              {address.address}
            </p>

            {address.apartment && (
              <p className="mt-1 break-words text-sm text-foreground-muted">
                {address.apartment}
              </p>
            )}

            <p className="mt-1 text-sm text-foreground">
              {address.city}, {address.state} - {address.pincode}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 border-t border-element-border pt-5">
          <Mail
            size={17}
            className="shrink-0 text-foreground-muted"
          />

          <div className="min-w-0">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-foreground-muted">
              Email Address
            </p>

            <p className="mt-1 break-all text-sm font-medium text-foreground">
              {address.email}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 border-t border-element-border pt-5">
          <Phone
            size={17}
            className="shrink-0 text-foreground-muted"
          />

          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-foreground-muted">
              Contact Number
            </p>

            <p className="mt-1 text-sm font-medium text-foreground">
              +91 {address.phone}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 border-t border-element-border pt-5">
          <button
            type="button"
            onClick={() => onEdit(address)}
            disabled={isDeleting}
            className="inline-flex items-center gap-2 border border-element-border px-5 py-2.5 text-xs font-semibold text-foreground transition-colors hover:border-background-inverse hover:bg-background-soft disabled:opacity-50"
          >
            <Pencil size={14} />
            Edit
          </button>

          <button
            type="button"
            onClick={() => onDelete(address)}
            disabled={isDeleting}
            className="inline-flex items-center gap-2 border border-status-danger/30 px-5 py-2.5 text-xs font-semibold text-status-danger transition-colors hover:border-status-danger hover:bg-status-danger/5 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isDeleting ? (
              <>
                <Loader2 size={14} className="animate-spin" />
                Deleting...
              </>
            ) : (
              <>
                <Trash2 size={14} />
                Delete
              </>
            )}
          </button>
        </div>
      </div>
    </article>
  );
}

function AddressForm({
  form,
  setForm,
  onSubmit,
  onCancel,
  isSaving,
  error,
  isEditing,
}) {
  const handleChange = (event) => {
    const { name, value } = event.target;

    const sanitizedValue =
      name === "phone" || name === "pincode"
        ? value.replace(/\D/g, "")
        : value;

    setForm((previous) => ({
      ...previous,
      [name]: sanitizedValue,
    }));
  };

  return (
    <form
      onSubmit={onSubmit}
      className="border border-element-border bg-background"
    >
      <div className="border-b border-element-border bg-background-soft/40 px-5 py-5 sm:px-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center bg-background-muted">
            <MapPin size={19} />
          </div>

          <div>
            <h2 className="text-base font-semibold text-foreground">
              {isEditing ? "Edit Address" : "Add New Address"}
            </h2>

            <p className="mt-1 text-xs text-foreground-muted">
              Enter your complete delivery information.
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-6 p-5 sm:p-6">
        <div>
          <FormField
            label="Email Address"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Enter email address"
            autoComplete="email"
            required
            maxLength={254}
          />

          <p className="mt-1.5 text-[10px] text-foreground-muted">
            Order and delivery updates will use this email address.
          </p>
        </div>

        <div>
          <FormField
            label="Phone Number"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            placeholder="Enter 10-digit mobile number"
            inputMode="numeric"
            maxLength={10}
            autoComplete="tel-national"
            required
          />

          <p className="mt-1.5 text-[10px] text-foreground-muted">
            Enter your 10-digit Indian mobile number.
          </p>
        </div>

        <FormField
          label="House No. / Street / Locality"
          name="address"
          value={form.address}
          onChange={handleChange}
          placeholder="House number, street name, locality"
          autoComplete="street-address"
          required
        />

        <FormField
          label="Apartment / Landmark"
          name="apartment"
          value={form.apartment}
          onChange={handleChange}
          placeholder="Apartment, floor, nearby landmark (optional)"
        />

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <FormField
            label="City"
            name="city"
            value={form.city}
            onChange={handleChange}
            placeholder="Enter your city"
            autoComplete="address-level2"
            required
          />

          <FormField
            label="State"
            name="state"
            value={form.state}
            onChange={handleChange}
            placeholder="Enter your state"
            autoComplete="address-level1"
            required
          />
        </div>

        <div className="sm:max-w-[calc(50%-10px)]">
          <FormField
            label="PIN Code"
            name="pincode"
            value={form.pincode}
            onChange={handleChange}
            placeholder="6-digit PIN code"
            inputMode="numeric"
            maxLength={6}
            autoComplete="postal-code"
            required
          />
        </div>

        {error && (
          <div
            role="alert"
            className="flex items-start gap-3 border border-status-danger/20 bg-status-danger/5 p-4"
          >
            <AlertCircle
              size={17}
              className="mt-0.5 shrink-0 text-status-danger"
            />

            <p className="text-xs leading-relaxed text-status-danger">
              {error}
            </p>
          </div>
        )}

        <div className="flex flex-col-reverse gap-3 border-t border-element-border pt-5 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onCancel}
            disabled={isSaving}
            className="flex items-center justify-center gap-2 border border-element-border px-6 py-3 text-sm font-medium text-foreground transition-colors hover:bg-background-soft disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={isSaving}
            className="flex items-center justify-center gap-2 bg-background-inverse px-6 py-3 text-sm font-semibold text-foreground-inverse transition-colors hover:bg-element-hover disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSaving ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save size={16} />
                {isEditing ? "Update Address" : "Save Address"}
              </>
            )}
          </button>
        </div>
      </div>
    </form>
  );
}

function AddressSkeleton() {
  return (
    <div className="animate-pulse space-y-5">
      {[1, 2].map((item) => (
        <div
          key={item}
          className="border border-element-border p-5"
        >
          <div className="flex items-center gap-3 border-b border-element-border pb-4">
            <div className="h-9 w-9 bg-background-muted" />
            <div className="space-y-2">
              <div className="h-3 w-32 bg-background-muted" />
              <div className="h-2 w-20 bg-background-muted" />
            </div>
          </div>

          <div className="mt-5 space-y-4">
            <div className="h-3 w-3/4 bg-background-muted" />
            <div className="h-3 w-1/2 bg-background-muted" />
            <div className="h-3 w-1/3 bg-background-muted" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function SavedAddressPage() {
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [form, setForm] = useState(initialForm);

  const [editingAddressId, setEditingAddressId] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const [error, setError] = useState("");
  const [pageError, setPageError] = useState("");
  const [success, setSuccess] = useState("");

  const [deletingAddressId, setDeletingAddressId] = useState(null);
  const [deleteError, setDeleteError] = useState("");

  // Fetch saved addresses.
  useEffect(() => {
    const controller = new AbortController();

    async function fetchSavedAddresses() {
      setIsLoading(true);
      setPageError("");

      try {
        const response = await fetch(ADDRESS_GET_API, {
          method: "GET",
          cache: "no-store",
          signal: controller.signal,
        });

        const data = await response.json();

        if (response.status === 401) {
          throw new Error("Please sign in to manage your addresses.");
        }

        if (!response.ok || !data.success) {
          throw new Error(
            data.message || "Unable to fetch your saved addresses."
          );
        }

        const addresses = Array.isArray(data.savedAddresses)
          ? data.savedAddresses
          : [];

        setSavedAddresses(addresses.map(normalizeAddress));
      } catch (err) {
        if (err.name === "AbortError") return;

        setPageError(
          err.message || "Something went wrong while loading addresses."
        );
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    }

    fetchSavedAddresses();

    return () => controller.abort();
  }, []);

  const handleAddAddress = () => {
    setForm(initialForm);
    setEditingAddressId(null);
    setError("");
    setSuccess("");
    setIsFormOpen(true);
  };

  const handleEditAddress = (address) => {
    setForm(normalizeAddress(address));
    setEditingAddressId(address._id);
    setError("");
    setSuccess("");
    setIsFormOpen(true);
  };

  const handleCancel = () => {
    setForm(initialForm);
    setEditingAddressId(null);
    setError("");
    setIsFormOpen(false);
  };

  const handleDeleteAddress = async (address) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete this delivery address?\n\n${address.address}, ${address.city}, ${address.state} - ${address.pincode}`
    );

    if (!confirmed) return;

    setDeletingAddressId(address._id);
    setDeleteError("");
    setSuccess("");

    try {
      const response = await fetch(ADDRESS_DELETE_API, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          addressId: address._id,
        }),
      });

      const responseText = await response.text();

      let data;

      try {
        data = JSON.parse(responseText);
      } catch {
        throw new Error(
          `Invalid server response. HTTP ${response.status}`
        );
      }

      if (response.status === 401) {
        throw new Error("Please sign in to manage your addresses.");
      }

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Unable to delete this address."
        );
      }

      setSavedAddresses(
        Array.isArray(data.savedAddresses)
          ? data.savedAddresses.map(normalizeAddress)
          : []
      );

      if (editingAddressId === address._id) {
        setIsFormOpen(false);
        setEditingAddressId(null);
        setForm(initialForm);
      }

      setSuccess("Address deleted successfully.");
    } catch (err) {
      setDeleteError(
        err.message || "Something went wrong while deleting the address."
      );
    } finally {
      setDeletingAddressId(null);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    const email = form.email.trim().toLowerCase();
    const phone = form.phone.trim();
    const pincode = form.pincode.trim();

    if (
      email.length > 254 ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    ) {
      setError("Please enter a valid email address.");
      return;
    }

    if (!/^[0-9]{10}$/.test(phone)) {
      setError("Please enter a valid 10-digit phone number.");
      return;
    }

    if (!form.address.trim()) {
      setError("Please enter your house number and street address.");
      return;
    }

    if (!form.city.trim()) {
      setError("Please enter your city.");
      return;
    }

    if (!form.state.trim()) {
      setError("Please enter your state.");
      return;
    }

    if (!/^[1-9][0-9]{5}$/.test(pincode)) {
      setError("Please enter a valid 6-digit PIN code.");
      return;
    }

    setIsSaving(true);

    try {
      const payload = {
        address: {
          email,
          phone,
          address: form.address.trim(),
          apartment: form.apartment.trim(),
          city: form.city.trim(),
          state: form.state.trim(),
          pincode,
        },
        ...(editingAddressId && {
          addressId: editingAddressId,
        }),
      };

      const response = await fetch(ADDRESS_SAVE_API, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const responseText = await response.text();

      let data;

      try {
        data = JSON.parse(responseText);
      } catch {
        throw new Error(
          `Invalid server response. HTTP ${response.status}`
        );
      }

      if (response.status === 401) {
        throw new Error("Please sign in to save your address.");
      }

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Unable to save your address."
        );
      }

      if (Array.isArray(data.savedAddresses)) {
        setSavedAddresses(data.savedAddresses.map(normalizeAddress));
      } else {
        const savedAddress = normalizeAddress(
          data.address || data.savedAddress
        );

        setSavedAddresses((previous) => {
          if (editingAddressId) {
            return previous.map((item) =>
              item._id === editingAddressId
                ? savedAddress
                : item
            );
          }

          return [...previous, savedAddress];
        });
      }

      setForm(initialForm);
      setEditingAddressId(null);
      setIsFormOpen(false);

      setSuccess(
        editingAddressId
          ? "Your address has been updated successfully."
          : "Your new delivery address has been saved successfully."
      );
    } catch (err) {
      setError(
        err.message || "Something went wrong while saving your address."
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <section className="min-w-0 w-full">
      {/* PAGE HEADER */}
      <div className="mb-7 border-b border-element-border pb-6 sm:mb-8">
        <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-accent">
          Your RIVIX Account
        </p>

        {deleteError && (
          <div
            role="alert"
            className="mb-5 flex items-center gap-3 border border-status-danger/20 bg-status-danger/5 p-4"
          >
            <AlertCircle
              size={17}
              className="shrink-0 text-status-danger"
            />

            <p className="flex-1 text-xs text-status-danger">
              {deleteError}
            </p>

            <button
              type="button"
              onClick={() => setDeleteError("")}
              aria-label="Dismiss error"
            >
              <X size={15} />
            </button>
          </div>
        )}

        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="font-heading text-4xl leading-none tracking-wide text-foreground sm:text-5xl">
              SAVED ADDRESSES
            </h1>

            <p className="mt-3 max-w-lg text-sm leading-relaxed text-foreground-muted">
              Manage your delivery addresses for a smoother checkout experience.
            </p>
          </div>

          {!isLoading &&
            !pageError &&
            savedAddresses.length > 0 &&
            !isFormOpen && (
              <button
                type="button"
                onClick={handleAddAddress}
                className="inline-flex shrink-0 items-center justify-center gap-2 bg-background-inverse px-5 py-3 text-xs font-semibold text-foreground-inverse transition-colors hover:bg-element-hover"
              >
                <Plus size={16} />
                Add Address
              </button>
            )}
        </div>
      </div>

      {/* SUCCESS MESSAGE */}
      {success && (
        <div
          role="status"
          className="mb-6 flex items-start gap-3 border border-status-success/20 bg-status-success/5 p-4"
        >
          <CheckCircle2
            size={18}
            className="mt-0.5 shrink-0 text-status-success"
          />

          <p className="flex-1 text-sm text-status-success">
            {success}
          </p>

          <button
            type="button"
            onClick={() => setSuccess("")}
            aria-label="Dismiss message"
            className="text-status-success"
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* LOADING / ERROR / CONTENT */}
      {isLoading ? (
        <AddressSkeleton />
      ) : pageError ? (
        <div
          role="alert"
          className="border border-element-border p-8 text-center"
        >
          <AlertCircle
            size={25}
            className="mx-auto text-status-danger"
          />

          <h2 className="mt-4 text-base font-semibold text-foreground">
            Unable to load your addresses
          </h2>

          <p className="mt-2 text-sm text-foreground-muted">
            {pageError}
          </p>

          <button
            type="button"
            onClick={() => window.location.reload()}
            className="mt-5 bg-background-inverse px-5 py-3 text-sm font-medium text-foreground-inverse"
          >
            Try Again
          </button>
        </div>
      ) : (
        <>
          {isFormOpen && (
            <div className="mb-6">
              <button
                type="button"
                onClick={handleCancel}
                disabled={isSaving}
                className="mb-5 inline-flex items-center gap-2 text-xs font-medium text-foreground-muted transition-colors hover:text-foreground"
              >
                <ArrowLeft size={15} />
                Back to Saved Addresses
              </button>

              <AddressForm
                form={form}
                setForm={setForm}
                onSubmit={handleSubmit}
                onCancel={handleCancel}
                isSaving={isSaving}
                error={error}
                isEditing={Boolean(editingAddressId)}
              />
            </div>
          )}

          {!isFormOpen && savedAddresses.length === 0 && (
            <EmptyAddress onAdd={handleAddAddress} />
          )}

          {!isFormOpen && savedAddresses.length > 0 && (
            <div className="space-y-5">
              <div className="flex items-center justify-between border-b border-element-border pb-3">
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-foreground-muted">
                  Your Saved Addresses
                </p>

                <span className="text-xs text-foreground-muted">
                  {savedAddresses.length}{" "}
                  {savedAddresses.length === 1
                    ? "Address"
                    : "Addresses"}
                </span>
              </div>

              <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
                {savedAddresses.map((address, index) => (
                  <AddressCard
                    key={address._id || index}
                    address={address}
                    index={index}
                    onEdit={handleEditAddress}
                    onDelete={handleDeleteAddress}
                    isDeleting={deletingAddressId === address._id}
                  />
                ))}
              </div>

              <p className="pt-2 text-xs leading-relaxed text-foreground-muted">
                Your saved addresses are available during checkout. You can
                update any address whenever your delivery details change.
              </p>
            </div>
          )}
        </>
      )}
    </section>
  );
}
