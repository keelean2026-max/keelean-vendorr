import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  PlusIcon,
  TrashIcon,
  LocationMarkerIcon,
  TruckIcon,
  TagIcon,
  CurrencyDollarIcon,
  UserIcon,
  CheckCircleIcon,
  GiftIcon,
  FireIcon,
  PhotographIcon,
} from "@heroicons/react/outline";

const profileSchema = z.object({
  companyName: z.string().min(2, "Company name must be at least 2 characters"),
  landline: z.string().min(1, "Landline number is required"),
  whatsapp: z
    .string()
    .min(7, "WhatsApp number must be at least 7 digits")
    .regex(/^[+\d\s-]+$/, "Invalid WhatsApp number format"),
  website: z.string().url("Please enter a valid URL (https://...)"),
  facebook: z.string().url("Please enter a valid Facebook URL"),
  instagram: z.string().url("Please enter a valid Instagram URL"),
});

const operatingHourSchema = z.object({
  day: z.string(),
  open: z.string().regex(/^\d{2}:\d{2}$/, "Invalid time format (HH:MM)"),
  close: z.string().regex(/^\d{2}:\d{2}$/, "Invalid time format (HH:MM)"),
  closed: z.boolean(),
});

const locationSchema = z.object({
  address: z.string().min(10, "Address must be at least 10 characters"),
  pickupRadius: z.preprocess((v) => Number(v), z.number().min(1).max(50)),
  deliveryRadius: z.preprocess((v) => Number(v), z.number().min(1).max(100)),
  landmark: z.string().min(3, "Landmark too short"),
  operatingHours: z.array(operatingHourSchema).length(7),
});

const deliveryPersonSchema = z.object({
  id: z.number(),
  name: z.string().min(3, "Full name must be at least 3 characters"),
  phone: z.string().min(10, "Phone must be at least 10 digits"),
  vehicleType: z.enum(["bike", "car", "scooter", "van"]),
  licenseNumber: z.string().min(5, "License number must be at least 5 characters"),
});
const deliverySchema = z.array(deliveryPersonSchema).min(1);

const productSchema = z.object({
  id: z.number(),
  name: z.string().min(1),
  category: z.string().min(1),
  price: z.preprocess((v) => Number(v), z.number().positive()),
  urgentPrice: z.preprocess((v) => (v === "" ? null : Number(v)), z.number().positive().nullable()),
  specialPrice: z.preprocess((v) => (v === "" ? null : Number(v)), z.number().positive().nullable()),
  imagePreview: z.string().optional(),
});
const productsSchema = z.array(productSchema).min(1);

const bundleSchema = z.object({
  id: z.number(),
  name: z.string().min(1),
  description: z.string().min(1),
  price: z.preprocess((v) => Number(v), z.number().nonnegative()),
  discount: z.string().optional(),
  isActive: z.boolean().optional(),
});
const dateOfferSchema = z.object({
  id: z.number(),
  name: z.string().min(1),
  description: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  discountType: z.enum(["percentage", "fixed"]),
  discountValue: z.preprocess((v) => Number(v), z.number().nonnegative()),
  minOrder: z.preprocess((v) => (v === "" ? null : Number(v)), z.number().nullable().optional()),
  isActive: z.boolean().optional(),
});
const amountDiscountSchema = z.object({
  id: z.number(),
  minAmount: z.preprocess((v) => Number(v), z.number().nonnegative()),
  discountType: z.enum(["percentage", "fixed"]),
  discountValue: z.preprocess((v) => Number(v), z.number().nonnegative()),
  maxDiscount: z.preprocess((v) => (v === "" ? null : Number(v)), z.number().nullable().optional()),
  isActive: z.boolean().optional(),
});
const offersSchema = z.object({
  bundles: z.array(bundleSchema).optional(),
  dateOffers: z.array(dateOfferSchema).optional(),
  amountDiscounts: z.array(amountDiscountSchema).optional(),
});

const deliveryChargeSchema = z.object({
  id: z.number(),
  area: z.string().min(1),
  baseCharge: z.preprocess((v) => Number(v), z.number().nonnegative()),
  additionalCharge: z.preprocess((v) => (v === "" ? 0 : Number(v)), z.number().nonnegative()),
  freeDeliveryAbove: z.preprocess((v) => (v === "" ? null : Number(v)), z.number().nullable().optional()),
  estimatedTime: z.preprocess((v) => (v === "" ? null : Number(v)), z.number().nullable().optional()),
  isActive: z.boolean().optional(),
});
const deliveryChargesSchema = z.array(deliveryChargeSchema).min(1);

const promotionSchema = z.object({
  id: z.number(),
  title: z.string().min(1),
  description: z.string().min(1),
  type: z.enum(["banner", "popup", "notification", "email", "sms"]),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  targetAudience: z.enum(["all", "new", "returning", "vip"]).optional(),
  priority: z.enum(["low", "medium", "high", "urgent"]).optional(),
  status: z.enum(["active", "inactive"]).optional(),
});
const promotionsSchema = z.array(promotionSchema).min(1);

const completeFormSchema = z.object({
  profile: profileSchema,
  location: locationSchema,
  deliveryPersons: deliverySchema,
  products: productsSchema,
  offers: offersSchema.optional(),
  deliveryCharges: deliveryChargesSchema,
  promotions: promotionsSchema,
});

const defaultValues = {
  profile: {
    companyName: "",
    landline: "",
    whatsapp: "",
    website: "",
    facebook: "",
    instagram: "",
  },
  location: {
    address: "",
    pickupRadius: "5",
    deliveryRadius: "15",
    landmark: "",
    operatingHours: Array(7)
      .fill()
      .map((_, index) => ({
        day: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"][index],
        open: "09:00",
        close: "18:00",
        closed: index === 6,
      })),
  },
  deliveryPersons: [{ id: Date.now(), name: "", phone: "", vehicleType: "bike", licenseNumber: "" }],
  products: [{ id: Date.now() + 1, name: "", category: "", price: "", urgentPrice: "", specialPrice: "", imagePreview: "" }],
  offers: { bundles: [], dateOffers: [], amountDiscounts: [] },
  deliveryCharges: [{ id: Date.now() + 5, area: "", baseCharge: "", additionalCharge: "", freeDeliveryAbove: "", estimatedTime: "", isActive: true }],
  promotions: [{ id: Date.now() + 6, title: "", description: "", type: "banner", startDate: "", endDate: "", targetAudience: "all", priority: "medium", status: "active" }],
};

export default function ProfessionalBusinessSetup() {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState("profile");
  const [completedSections, setCompletedSections] = useState(new Set());

  const {
    control,
    handleSubmit,
    getValues,
    setValue,
    formState: { errors, isValid },
    trigger,
    clearErrors,
  } = useForm({
    defaultValues,
    mode: "onChange",
    resolver: zodResolver(completeFormSchema),
  });

  const getErrorMessage = (path) => {
    if (!errors) return null;
    const parts = path.split(".");
    let cur = errors;
    for (const part of parts) {
      if (!cur) return null;
      cur = cur[part];
    }
    return cur?.message ?? null;
  };

  const addItem = (section, item) => {
    setFormData(prev => ({
      ...prev,
      [section]: [...prev[section], { ...item, id: Date.now() }]
    }));
  };

  const removeItem = (section, id) => {
    setFormData(prev => ({
      ...prev,
      [section]: prev[section].length > 1 ? prev[section].filter(item => item.id !== id) : prev[section]
    }));
  };

  const updateItem = (section, index, field, value) => {
    const arr = [...getValues(section)];
    arr[index] = { ...arr[index], [field]: value };
    setValue(section, arr, { shouldDirty: true, shouldValidate: true });
    trigger(`${section}.${index}.${field}`);
  };

  const updateNestedItem = (section, subsection, index, field, value) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [subsection]: prev[section][subsection].map((item, i) => 
          i === index ? { ...item, [field]: value } : item
        )
      }
    }));
  };

  const updateField = (section, field, value) => {
    setFormData(prev => ({
      ...prev,
      [section]: { ...prev[section], [field]: value }
    }));
  };

  // Image upload handler
  const handleImageUpload = (id, event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setFormData(prev => ({
          ...prev,
          products: prev.products.map(product => 
            product.id === id ? { ...product, imagePreview: e.target.result } : product
          )
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Reusable Components
  const SectionHeader = ({ title, description, icon: Icon, actionButton }) => (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-3">
        <Icon className="w-6 h-6" style={{ color: colors.textPrimary }} />
        <div>
          <h2 className="text-xl font-semibold" style={{ color: colors.textPrimary }}>
            {title}
          </h2>
          <p style={{ color: colors.textSecondary }}>{description}</p>
        </div>
      </div>
      {actionButton}
    </div>
  );

  const InputField = ({ label, value, onChange, placeholder, type = "text", required = false, className = "", ...props }) => (
    <div className={className}>
      <label className="block text-sm font-medium mb-2" style={{ color: colors.textPrimary }}>
        {label}{required && " *"}
      </label>
      <input
        type={type}
        className="w-full px-3 py-2 rounded-lg border transition-colors focus:ring-2 focus:ring-gray-400 focus:border-gray-400"
        style={{ 
          borderColor: colors.border,
          backgroundColor: colors.card
        }}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        {...props}
      />
    </div>
  );

  const SelectField = ({ label, value, onChange, options, required = false, className = "" }) => (
    <div className={className}>
      <label className="block text-sm font-medium mb-2" style={{ color: colors.textPrimary }}>
        {label}{required && " *"}
      </label>
      <select
        className="w-full px-3 py-2 rounded-lg border transition-colors focus:ring-2 focus:ring-gray-400 focus:border-gray-400"
        style={{ 
          borderColor: colors.border,
          backgroundColor: colors.card
        }}
        value={value}
        onChange={onChange}
        required={required}
      >
        {options.map(option => (
          <option key={option.value} value={option.value}>{option.label}</option>
        ))}
      </select>
    </div>
  );

  const TextAreaField = ({ label, value, onChange, placeholder, required = false, className = "", rows = 3 }) => (
    <div className={className}>
      <label className="block text-sm font-medium mb-2" style={{ color: colors.textPrimary }}>
        {label}{required && " *"}
      </label>
      <textarea
        rows={rows}
        className="w-full px-3 py-2 rounded-lg border transition-colors focus:ring-2 focus:ring-gray-400 focus:border-gray-400 resize-none"
        style={{ 
          borderColor: colors.border,
          backgroundColor: colors.card
        }}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
      />
    </div>
  );

  const Card = ({ children, className = "" }) => (
    <div 
      className={`rounded-lg border p-4 ${className}`}
      style={{ 
        borderColor: colors.border,
        backgroundColor: colors.card
      }}
    >
      {children}
    </div>
  );

  const onSaveAndContinue = async () => {
    const ok = await validateCurrentSection();
    if (!ok) return;
    const seq = ["profile", "location", "deliveryPersons", "products", "offers", "deliveryCharges", "promotions"];
    const idx = seq.indexOf(activeSection);
    const next = seq[idx + 1];
    if (next) setActiveSection(next);
  };

  const onSubmit = async (data) => {
   
    try {
      console.log("Submitting payload:", data);
      alert("Business setup completed successfully!");
      navigate("/sidebar");
    } catch (err) {
      console.error("Submission error", err);
      alert("An error occurred. Please try again.");
    }
  };

  const gray = {
    bg: "#F6F7F8",
    card: "#FFFFFF",
    border: "#E6E8EA",
    text: "#6B6F74",
    subtle: "#9AA0A6",
    muted: "#BFC6CA",
    button: "#D9DDE0",
    buttonText: "#333438",
    success: "#6BAF84",
    error: "#E53E3E",
  };

  const sections = [
    { id: "profile", title: "Profile Details", icon: UserIcon },
    { id: "location", title: "Location & Hours", icon: LocationMarkerIcon },
    { id: "deliveryPersons", title: "Delivery Team", icon: TruckIcon },
    { id: "products", title: "Products/Services", icon: TagIcon },
    { id: "offers", title: "Offers & Discounts", icon: GiftIcon },
    { id: "deliveryCharges", title: "Delivery Charges", icon: CurrencyDollarIcon },
    { id: "promotions", title: "Promotions", icon: FireIcon },
  ];

  const allSectionsCompleted = completedSections.size === sections.length || isValid;

  return (
    <div className="min-h-screen" style={{ backgroundColor: colors.background }}>
      {/* Header */}
      <div style={{ backgroundColor: colors.card, borderBottom: `1px solid ${colors.border}` }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-bold" style={{ color: colors.textPrimary }}>
                Business Setup
              </h1>
              <p className="mt-1" style={{ color: colors.textSecondary }}>
                Complete your business profile to start accepting orders
              </p>
            </div>
            <div className="p-3 rounded-xl border" style={{ borderColor: colors.border, backgroundColor: colors.card }}>
              <div className="text-sm mb-1" style={{ color: colors.textSecondary }}>Setup Progress</div>
              <div className="flex items-center gap-3">
                <div className="w-32 rounded-full h-2" style={{ backgroundColor: colors.accent }}>
                  <div
                    className="h-2 rounded-full transition-all duration-300"
                    style={{ 
                      width: `${progress}%`,
                      backgroundColor: colors.success
                    }}
                  />
                </div>
                <span className="text-sm font-medium" style={{ color: colors.textPrimary }}>
                  {progress}%
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-64 shrink-0">
            <Card className="sticky top-8">
              <nav className="space-y-2">
                {sections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      activeSection === section.id
                        ? "border"
                        : "hover:opacity-80"
                    }`}
                    style={
                      activeSection === section.id
                        ? {
                            backgroundColor: colors.background,
                            borderColor: colors.border,
                            color: colors.textPrimary
                          }
                        : { color: colors.textSecondary }
                    }
                  >
                    <section.icon className="w-4 h-4" />
                    <span className="flex-1 text-left">{section.title}</span>
                    {completedSections.has(section.id) && (
                      <CheckCircleIcon className="w-4 h-4" style={{ color: colors.success }} />
                    )}
                  </button>
                ))}
              </nav>

              <div className="mt-6 p-3 rounded-lg border" style={{ borderColor: colors.border, backgroundColor: colors.background }}>
                <div className="text-xs" style={{ color: colors.textPrimary }}>
                  <div className="font-medium mb-1">Quick Tips</div>
                  <ul className="space-y-1">
                    <li>• Complete all required fields</li>
                    <li>• Upload clear information</li>
                    <li>• Set realistic delivery radius</li>
                  </ul>
                </div>
              </div>
            </Card>
          </div>

          {/* Main Content */}
          <div className="flex-1 space-y-6">
            {/* Profile Section */}
            {activeSection === "profile" && (
              <SectionLayout
                title="Profile Details"
                description="Basic business information and social profiles"
                icon={UserIcon}
                onNext={() => {
                  markSectionComplete("profile");
                  setActiveSection("location");
                }}
                isFirst={true}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InputField
                    label="Company Name"
                    value={formData.profile.companyName}
                    onChange={(e) => updateField("profile", "companyName", e.target.value)}
                    placeholder="Enter company name"
                    required
                  />
                  <InputField
                    label="Landline"
                    value={formData.profile.landline}
                    onChange={(e) => updateField("profile", "landline", e.target.value)}
                    placeholder="+971 X XXX XXXX"
                  />
                  <InputField
                    label="WhatsApp Number"
                    value={formData.profile.whatsapp}
                    onChange={(e) => updateField("profile", "whatsapp", e.target.value)}
                    placeholder="+971 XX XXX XXXX"
                    required
                  />
                  <InputField
                    label="Website"
                    value={formData.profile.website}
                    onChange={(e) => updateField("profile", "website", e.target.value)}
                    placeholder="https://example.com"
                  />
                  <InputField
                    label="Facebook"
                    value={formData.profile.facebook}
                    onChange={(e) => updateField("profile", "facebook", e.target.value)}
                    placeholder="https://facebook.com/yourpage"
                  />
                  <InputField
                    label="Instagram"
                    value={formData.profile.instagram}
                    onChange={(e) => updateField("profile", "instagram", e.target.value)}
                    placeholder="https://instagram.com/yourprofile"
                  />
                </div>
              </SectionLayout>
            )}

            {/* Location Section */}
            {activeSection === "location" && (
              <SectionLayout
                title="Location & Hours"
                description="Business location and service hours"
                icon={LocationMarkerIcon}
                onNext={() => {
                  markSectionComplete("location");
                  setActiveSection("delivery");
                }}
                onBack={() => setActiveSection("profile")}
              >
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <TextAreaField
                      label="Complete Address"
                      value={formData.location.address}
                      onChange={(e) => updateField("location", "address", e.target.value)}
                      placeholder="Enter your complete business address"
                      required
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <InputField
                        label="Pickup Radius (km)"
                        type="number"
                        value={formData.location.pickupRadius}
                        onChange={(e) => updateField("location", "pickupRadius", e.target.value)}
                      />
                      <InputField
                        label="Delivery Radius (km)"
                        type="number"
                        value={formData.location.deliveryRadius}
                        onChange={(e) => updateField("location", "deliveryRadius", e.target.value)}
                      />
                    </div>
                    <InputField
                      label="Landmark"
                      value={formData.location.landmark}
                      onChange={(e) => updateField("location", "landmark", e.target.value)}
                      placeholder="Nearby famous location"
                    />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium mb-4" style={{ color: colors.textPrimary }}>Operating Hours</h3>
                    <div className="space-y-3">
                      {formData.location.operatingHours.map((day, index) => (
                        <div key={day.day} className="flex items-center justify-between">
                          <label className="flex items-center gap-2 text-sm font-medium" style={{ color: colors.textPrimary }}>
                            <input
                              type="checkbox"
                              checked={!day.closed}
                              onChange={(e) => {
                                const updated = [...formData.location.operatingHours];
                                updated[index].closed = !e.target.checked;
                                updateField("location", "operatingHours", updated);
                              }}
                              className="rounded border-gray-300 text-gray-600 focus:ring-gray-500"
                            />
                            {day.day}
                          </label>
                          {!day.closed && (
                            <div className="flex items-center gap-2">
                              <input
                                type="time"
                                value={day.open}
                                onChange={(e) => {
                                  const updated = [...formData.location.operatingHours];
                                  updated[index].open = e.target.value;
                                  updateField("location", "operatingHours", updated);
                                }}
                                className="px-2 py-1 border rounded text-sm"
                                style={{ borderColor: colors.border, backgroundColor: colors.card }}
                              />
                              <span style={{ color: colors.textSecondary }}>to</span>
                              <input
                                type="time"
                                value={day.close}
                                onChange={(e) => {
                                  const updated = [...formData.location.operatingHours];
                                  updated[index].close = e.target.value;
                                  updateField("location", "operatingHours", updated);
                                }}
                                className="px-2 py-1 border rounded text-sm"
                                style={{ borderColor: colors.border, backgroundColor: colors.card }}
                              />
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </SectionLayout>
            )}

            {/* Delivery Team Section */}
            {activeSection === "delivery" && (
              <SectionLayout
                title="Delivery Team"
                description="Manage your delivery personnel"
                icon={TruckIcon}
                onNext={() => {
                  markSectionComplete("delivery");
                  setActiveSection("products");
                }}
                onBack={() => setActiveSection("location")}
                actionButton={
                  <ActionButton
                    onClick={() => addItem("deliveryPersons", { name: "", phone: "", vehicleType: "bike", licenseNumber: "" })}
                  >
                    <PlusIcon className="w-4 h-4" />
                    Add Person
                  </ActionButton>
                }
              >
                <div className="space-y-4">
                  {formData.deliveryPersons.map((person, index) => (
                    <Card key={person.id}>
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="font-medium" style={{ color: colors.textPrimary }}>
                          Delivery Person {index + 1}
                        </h3>
                        {formData.deliveryPersons.length > 1 && (
                          <button
                            onClick={() => removeItem("deliveryPersons", person.id)}
                            style={{ color: colors.textSecondary }}
                            className="hover:opacity-70"
                          >
                            <TrashIcon className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <InputField
                          label="Full Name"
                          value={person.name}
                          onChange={(e) => updateItem("deliveryPersons", index, "name", e.target.value)}
                          placeholder="Full name"
                          required
                        />
                        <InputField
                          label="Phone Number"
                          value={person.phone}
                          onChange={(e) => updateItem("deliveryPersons", index, "phone", e.target.value)}
                          placeholder="Phone number"
                          required
                        />
                        <SelectField
                          label="Vehicle Type"
                          value={person.vehicleType}
                          onChange={(e) => updateItem("deliveryPersons", index, "vehicleType", e.target.value)}
                          options={[
                            { value: "bike", label: "Bike" },
                            { value: "car", label: "Car" },
                            { value: "scooter", label: "Scooter" },
                            { value: "van", label: "Van" }
                          ]}
                          required
                        />
                        <InputField
                          label="License Number"
                          value={person.licenseNumber}
                          onChange={(e) => updateItem("deliveryPersons", index, "licenseNumber", e.target.value)}
                          placeholder="License number"
                          className="md:col-span-2"
                        />
                      </div>
                    </Card>
                  ))}
                </div>
              </SectionLayout>
            )}

            {/* Products Section */}
            {activeSection === "products" && (
              <SectionLayout
                title="Products / Services"
                description="Manage your product catalog and pricing"
                icon={TagIcon}
                onNext={() => {
                  markSectionComplete("products");
                  setActiveSection("offers");
                }}
                onBack={() => setActiveSection("delivery")}
                actionButton={
                  <ActionButton
                    onClick={() => addItem("products", { name: "", category: "", price: "", urgentPrice: "", specialPrice: "", imagePreview: "" })}
                  >
                    <PlusIcon className="w-4 h-4" />
                    Add Product
                  </ActionButton>
                }
              >
                <div className="space-y-6">
                  {formData.products.map((product, index) => (
                    <Card key={product.id}>
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="font-medium" style={{ color: colors.textPrimary }}>
                          Product {index + 1}
                        </h3>
                        {formData.products.length > 1 && (
                          <button
                            onClick={() => removeItem("products", product.id)}
                            style={{ color: colors.textSecondary }}
                            className="hover:opacity-70"
                          >
                            <TrashIcon className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Product Image */}
                        <div>
                          <label className="block text-sm font-medium mb-2" style={{ color: colors.textPrimary }}>
                            Product Image
                          </label>
                          <div 
                            className="border-2 border-dashed rounded-lg p-4 text-center h-32 flex items-center justify-center cursor-pointer hover:opacity-80 transition-opacity"
                            style={{ borderColor: colors.border, backgroundColor: colors.background }}
                            onClick={() => document.getElementById(`product-image-${product.id}`).click()}
                          >
                            {product.imagePreview ? (
                              <div className="relative">
                                <img
                                  src={product.imagePreview}
                                  alt="Product preview"
                                  className="h-20 w-20 object-cover rounded"
                                />
                              </div>
                            ) : (
                              <div className="text-center">
                                <PhotographIcon className="mx-auto h-8 w-8" style={{ color: colors.textSecondary }} />
                                <span className="mt-2 block text-sm font-medium" style={{ color: colors.textPrimary }}>
                                  Upload Image
                                </span>
                              </div>
                            )}
                            <input
                              id={`product-image-${product.id}`}
                              type="file"
                              className="hidden"
                              accept="image/*"
                              onChange={(e) => handleImageUpload(product.id, e)}
                            />
                          </div>
                        </div>

                        {/* Product Details */}
                        <div className="lg:col-span-2">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <InputField
                              label="Product Name"
                              value={product.name}
                              onChange={(e) => updateItem("products", index, "name", e.target.value)}
                              placeholder="Product name"
                              required
                              className="md:col-span-2"
                            />
                            <InputField
                              label="Category"
                              value={product.category}
                              onChange={(e) => updateItem("products", index, "category", e.target.value)}
                              placeholder="Product category"
                              required
                            />
                            <InputField
                              label="Normal Price"
                              type="number"
                              step="0.01"
                              value={product.price}
                              onChange={(e) => updateItem("products", index, "price", e.target.value)}
                              placeholder="0.00"
                              required
                            />
                            <InputField
                              label="Urgent Price"
                              type="number"
                              step="0.01"
                              value={product.urgentPrice}
                              onChange={(e) => updateItem("products", index, "urgentPrice", e.target.value)}
                              placeholder="0.00"
                            />
                            <InputField
                              label="Special Price"
                              type="number"
                              step="0.01"
                              value={product.specialPrice}
                              onChange={(e) => updateItem("products", index, "specialPrice", e.target.value)}
                              placeholder="0.00"
                            />
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </SectionLayout>
            )}

            {/* Offers & Discounts Section */}
            {activeSection === "offers" && (
              <SectionLayout
                title="Offers & Discounts"
                description="Configure special offers and discount strategies"
                icon={GiftIcon}
                onNext={() => {
                  markSectionComplete("offers");
                  setActiveSection("delivery-charges");
                }}
                onBack={() => setActiveSection("products")}
              >
                {/* Product Bundles */}
                <div className="mb-8">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium" style={{ color: colors.textPrimary }}>Product Bundles</h3>
                    <ActionButton
                      onClick={() => addNestedItem("offers", "bundles", { name: "", description: "", price: "", discount: "", isActive: true })}
                    >
                      <PlusIcon className="w-4 h-4" />
                      Add Bundle
                    </ActionButton>
                  </div>
                  <div className="space-y-4">
                    {formData.offers.bundles.map((bundle, index) => (
                      <Card key={bundle.id}>
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="font-medium" style={{ color: colors.textPrimary }}>Bundle {index + 1}</h4>
                          {formData.offers.bundles.length > 1 && (
                            <button
                              onClick={() => removeNestedItem("offers", "bundles", bundle.id)}
                              style={{ color: colors.textSecondary }}
                              className="hover:opacity-70"
                            >
                              <TrashIcon className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <InputField
                            label="Bundle Name"
                            value={bundle.name}
                            onChange={(e) => updateNestedItem("offers", "bundles", index, "name", e.target.value)}
                            placeholder="e.g., Family Combo"
                            required
                          />
                          <InputField
                            label="Bundle Price"
                            type="number"
                            step="0.01"
                            value={bundle.price}
                            onChange={(e) => updateNestedItem("offers", "bundles", index, "price", e.target.value)}
                            placeholder="0.00"
                            required
                          />
                          <TextAreaField
                            label="Description"
                            value={bundle.description}
                            onChange={(e) => updateNestedItem("offers", "bundles", index, "description", e.target.value)}
                            placeholder="Describe this bundle offer..."
                            className="md:col-span-2"
                          />
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>

                {/* Date-wise Offers */}
                <div className="mb-8">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium" style={{ color: colors.textPrimary }}>Date-wise Offers</h3>
                    <ActionButton
                      onClick={() => addNestedItem("offers", "dateOffers", { name: "", description: "", startDate: "", endDate: "", discountType: "percentage", discountValue: "", minOrder: "", isActive: true })}
                    >
                      <PlusIcon className="w-4 h-4" />
                      Add Offer
                    </ActionButton>
                  </div>
                  <div className="space-y-4">
                    {formData.offers.dateOffers.map((offer, index) => (
                      <Card key={offer.id}>
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="font-medium" style={{ color: colors.textPrimary }}>Special Offer {index + 1}</h4>
                          {formData.offers.dateOffers.length > 1 && (
                            <button
                              onClick={() => removeNestedItem("offers", "dateOffers", offer.id)}
                              style={{ color: colors.textSecondary }}
                              className="hover:opacity-70"
                            >
                              <TrashIcon className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <InputField
                            label="Offer Name"
                            value={offer.name}
                            onChange={(e) => updateNestedItem("offers", "dateOffers", index, "name", e.target.value)}
                            placeholder="e.g., Weekend Special"
                            required
                          />
                          <SelectField
                            label="Discount Type"
                            value={offer.discountType}
                            onChange={(e) => updateNestedItem("offers", "dateOffers", index, "discountType", e.target.value)}
                            options={[
                              { value: "percentage", label: "Percentage (%)" },
                              { value: "fixed", label: "Fixed Amount" }
                            ]}
                          />
                          <InputField
                            label="Start Date"
                            type="date"
                            value={offer.startDate}
                            onChange={(e) => updateNestedItem("offers", "dateOffers", index, "startDate", e.target.value)}
                            required
                          />
                          <InputField
                            label="End Date"
                            type="date"
                            value={offer.endDate}
                            onChange={(e) => updateNestedItem("offers", "dateOffers", index, "endDate", e.target.value)}
                            required
                          />
                          <InputField
                            label="Discount Value"
                            type="number"
                            value={offer.discountValue}
                            onChange={(e) => updateNestedItem("offers", "dateOffers", index, "discountValue", e.target.value)}
                            placeholder={offer.discountType === 'percentage' ? '10' : '50'}
                            required
                          />
                          <InputField
                            label="Minimum Order"
                            type="number"
                            step="0.01"
                            value={offer.minOrder}
                            onChange={(e) => updateNestedItem("offers", "dateOffers", index, "minOrder", e.target.value)}
                            placeholder="0.00"
                          />
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>

                {/* Amount-based Discounts */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium" style={{ color: colors.textPrimary }}>Amount-based Discounts</h3>
                    <ActionButton
                      onClick={() => addNestedItem("offers", "amountDiscounts", { minAmount: "", discountType: "percentage", discountValue: "", maxDiscount: "", isActive: true })}
                    >
                      <PlusIcon className="w-4 h-4" />
                      Add Tier
                    </ActionButton>
                  </div>
                  <div className="space-y-4">
                    {formData.offers.amountDiscounts.map((discount, index) => (
                      <Card key={discount.id}>
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="font-medium" style={{ color: colors.textPrimary }}>Tier {index + 1}</h4>
                          {formData.offers.amountDiscounts.length > 1 && (
                            <button
                              onClick={() => removeNestedItem("offers", "amountDiscounts", discount.id)}
                              style={{ color: colors.textSecondary }}
                              className="hover:opacity-70"
                            >
                              <TrashIcon className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                          <InputField
                            label="Minimum Amount"
                            type="number"
                            step="0.01"
                            value={discount.minAmount}
                            onChange={(e) => updateNestedItem("offers", "amountDiscounts", index, "minAmount", e.target.value)}
                            placeholder="100.00"
                            required
                          />
                          <SelectField
                            label="Discount Type"
                            value={discount.discountType}
                            onChange={(e) => updateNestedItem("offers", "amountDiscounts", index, "discountType", e.target.value)}
                            options={[
                              { value: "percentage", label: "Percentage (%)" },
                              { value: "fixed", label: "Fixed Amount" }
                            ]}
                          />
                          <InputField
                            label="Discount Value"
                            type="number"
                            value={discount.discountValue}
                            onChange={(e) => updateNestedItem("offers", "amountDiscounts", index, "discountValue", e.target.value)}
                            placeholder={discount.discountType === 'percentage' ? '10' : '50'}
                            required
                          />
                          <InputField
                            label="Max Discount"
                            type="number"
                            step="0.01"
                            value={discount.maxDiscount}
                            onChange={(e) => updateNestedItem("offers", "amountDiscounts", index, "maxDiscount", e.target.value)}
                            placeholder="0.00"
                          />
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              </SectionLayout>
            )}

            {/* Delivery Charges Section */}
            {activeSection === "delivery-charges" && (
              <SectionLayout
                title="Delivery Charges"
                description="Configure delivery charges for different areas"
                icon={CurrencyDollarIcon}
                onNext={() => {
                  markSectionComplete("delivery-charges");
                  setActiveSection("promotions");
                }}
                onBack={() => setActiveSection("offers")}
                actionButton={
                  <ActionButton
                    onClick={() => addItem("deliveryCharges", { area: "", baseCharge: "", additionalCharge: "", freeDeliveryAbove: "", estimatedTime: "", isActive: true })}
                  >
                    <PlusIcon className="w-4 h-4" />
                    Add Area
                  </ActionButton>
                }
              >
                <div className="space-y-4">
                  {formData.deliveryCharges.map((area, index) => (
                    <Card key={area.id}>
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-medium" style={{ color: colors.textPrimary }}>
                          Area {index + 1}
                        </h3>
                        {formData.deliveryCharges.length > 1 && (
                          <button
                            onClick={() => removeItem("deliveryCharges", area.id)}
                            style={{ color: colors.textSecondary }}
                            className="hover:opacity-70"
                          >
                            <TrashIcon className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <InputField
                          label="Area Name"
                          value={area.area}
                          onChange={(e) => updateItem("deliveryCharges", index, "area", e.target.value)}
                          placeholder="e.g., Downtown, Business Bay"
                          required
                        />
                        <InputField
                          label="Base Charge (AED)"
                          type="number"
                          step="0.01"
                          value={area.baseCharge}
                          onChange={(e) => updateItem("deliveryCharges", index, "baseCharge", e.target.value)}
                          placeholder="15.00"
                          required
                        />
                        <InputField
                          label="Additional Charge (AED)"
                          type="number"
                          step="0.01"
                          value={area.additionalCharge}
                          onChange={(e) => updateItem("deliveryCharges", index, "additionalCharge", e.target.value)}
                          placeholder="5.00"
                        />
                        <InputField
                          label="Free Delivery Above (AED)"
                          type="number"
                          step="0.01"
                          value={area.freeDeliveryAbove}
                          onChange={(e) => updateItem("deliveryCharges", index, "freeDeliveryAbove", e.target.value)}
                          placeholder="100.00"
                        />
                        <InputField
                          label="Estimated Time (minutes)"
                          type="number"
                          value={area.estimatedTime}
                          onChange={(e) => updateItem("deliveryCharges", index, "estimatedTime", e.target.value)}
                          placeholder="45"
                        />
                        <div className="flex items-center">
                          <label className="flex items-center gap-2 text-sm font-medium" style={{ color: colors.textPrimary }}>
                            <input
                              type="checkbox"
                              checked={area.isActive}
                              onChange={(e) => updateItem("deliveryCharges", index, "isActive", e.target.checked)}
                              className="rounded border-gray-300 text-gray-600 focus:ring-gray-500"
                            />
                            Active
                          </label>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>

                {/* Summary Card */}
                <Card className="mt-6" style={{ backgroundColor: colors.background }}>
                  <h4 className="font-medium mb-2" style={{ color: colors.textPrimary }}>Delivery Charges Summary</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm" style={{ color: colors.textPrimary }}>
                    <div>
                      <span className="font-medium">Areas Configured:</span> {formData.deliveryCharges.length}
                    </div>
                    <div>
                      <span className="font-medium">Active Areas:</span> {formData.deliveryCharges.filter(area => area.isActive).length}
                    </div>
                    <div>
                      <span className="font-medium">Avg. Charge:</span> AED {
                        (formData.deliveryCharges.reduce((sum, area) => sum + parseFloat(area.baseCharge || 0), 0) / formData.deliveryCharges.length).toFixed(2)
                      }
                    </div>
                  </div>
                </Card>
              </SectionLayout>
            )}

            {/* Promotions Section */}
            {activeSection === "promotions" && (
              <SectionLayout
                title="Promotions"
                description="Create and manage marketing promotions"
                icon={FireIcon}
                onNext={() => {
                  markSectionComplete("promotions");
                  alert("Business setup completed successfully!");
                  navigate("/sidebar");
                }}
                onBack={() => setActiveSection("delivery-charges")}
                actionButton={
                  <ActionButton
                    onClick={() => addItem("promotions", { title: "", description: "", type: "banner", startDate: "", endDate: "", targetAudience: "all", priority: "medium", status: "active" })}
                  >
                    <PlusIcon className="w-4 h-4" />
                    Add Promotion
                  </ActionButton>
                }
              >
                <div className="space-y-4">
                  {formData.promotions.map((promo, index) => (
                    <Card key={promo.id}>
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-medium" style={{ color: colors.textPrimary }}>
                          Promotion {index + 1}
                        </h3>
                        {formData.promotions.length > 1 && (
                          <button
                            onClick={() => removeItem("promotions", promo.id)}
                            style={{ color: colors.textSecondary }}
                            className="hover:opacity-70"
                          >
                            <TrashIcon className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <InputField
                          label="Promotion Title"
                          value={promo.title}
                          onChange={(e) => updateItem("promotions", index, "title", e.target.value)}
                          placeholder="e.g., Summer Sale, Ramadan Offer"
                          required
                        />
                        <SelectField
                          label="Promotion Type"
                          value={promo.type}
                          onChange={(e) => updateItem("promotions", index, "type", e.target.value)}
                          options={[
                            { value: "banner", label: "Homepage Banner" },
                            { value: "popup", label: "Website Popup" },
                            { value: "notification", label: "Push Notification" },
                            { value: "email", label: "Email Campaign" },
                            { value: "sms", label: "SMS Campaign" }
                          ]}
                          required
                        />
                        <InputField
                          label="Start Date"
                          type="date"
                          value={promo.startDate}
                          onChange={(e) => updateItem("promotions", index, "startDate", e.target.value)}
                          required
                        />
                        <InputField
                          label="End Date"
                          type="date"
                          value={promo.endDate}
                          onChange={(e) => updateItem("promotions", index, "endDate", e.target.value)}
                          required
                        />
                        <SelectField
                          label="Target Audience"
                          value={promo.targetAudience}
                          onChange={(e) => updateItem("promotions", index, "targetAudience", e.target.value)}
                          options={[
                            { value: "all", label: "All Customers" },
                            { value: "new", label: "New Customers" },
                            { value: "returning", label: "Returning Customers" },
                            { value: "vip", label: "VIP Customers" }
                          ]}
                        />
                        <SelectField
                          label="Priority"
                          value={promo.priority}
                          onChange={(e) => updateItem("promotions", index, "priority", e.target.value)}
                          options={[
                            { value: "low", label: "Low" },
                            { value: "medium", label: "Medium" },
                            { value: "high", label: "High" },
                            { value: "urgent", label: "Urgent" }
                          ]}
                        />
                        <TextAreaField
                          label="Description"
                          value={promo.description}
                          onChange={(e) => updateItem("promotions", index, "description", e.target.value)}
                          placeholder="Describe the promotion details, terms, and conditions..."
                          className="md:col-span-2"
                        />
                      </div>
                    </Card>
                  ))}
                </div>

              
              </SectionLayout>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper functions for nested operations
const addNestedItem = (section, subsection, item) => {
  setFormData(prev => ({
    ...prev,
    [section]: {
      ...prev[section],
      [subsection]: [...prev[section][subsection], { ...item, id: Date.now() }]
    }
  }));
};

const removeNestedItem = (section, subsection, id) => {
  setFormData(prev => ({
    ...prev,
    [section]: {
      ...prev[section],
      [subsection]: prev[section][subsection].length > 1 
        ? prev[section][subsection].filter(item => item.id !== id)
        : prev[section][subsection]
    }
  }));
};

export default ProfessionalBusinessSetup;