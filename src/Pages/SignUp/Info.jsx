import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  PlusIcon,
  TrashIcon,
  MapPinIcon,
  TruckIcon,
  TagIcon,
  CurrencyDollarIcon,
  UserCircleIcon,
  CheckCircleIcon,
  GiftIcon,
  FireIcon,
  PhotoIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  BuildingStorefrontIcon,
  ClockIcon,
  UsersIcon,
  CubeIcon,
  ExclamationCircleIcon,
  PencilIcon,
  XMarkIcon,
  DocumentTextIcon,
  CalendarIcon,
  ChartBarIcon,
  ShoppingBagIcon,
} from "@heroicons/react/24/outline";
const colors = {
  background: "#FFFFFF",
  card: "#F8F9FA",
    borderLight: "#F3F4F6",
  border: "#9CA3AF", 
  borderDark: "#9CA3AF",
  divider: "#E5E7EB",

    textPrimary: "#111827",
  textSecondary: "#374151",
  textTertiary: "#6B7280",
  textMuted: "#9CA3AF",
  textDisabled: "#D1D5DB",
  textInverse: "#FFFFFF",
  
  buttonPrimary: "#374151",
  buttonPrimaryHover: "#1F2937",
  buttonSecondary: "#F3F4F6",
  buttonSecondaryHover: "#E5E7EB",
  buttonText: "#FFFFFF",
  buttonTextSecondary: "#374151",
  buttonDisabled: "#E5E7EB",
  
  // Status
  accentLight: "#F3F4F6",
  accent: "#6B7280",
  accentDark: "#374151",
  success: "#10B981",
  error: "#EF4444",
  warning: "#F59E0B",
  info: "#3B82F6",
  
  hover: "rgba(0, 0, 0, 0.04)",
  active: "rgba(0, 0, 0, 0.08)",
  selected: "rgba(0, 0, 0, 0.12)",
};

const profileSchema = z.object({
  companyName: z.string().min(2, "Company name must be at least 2 characters"),
  landline: z.string().min(1, "Landline number is required"),
  whatsapp: z
    .string()
    .min(7, "WhatsApp number must be at least 7 digits")
    .regex(/^[+\d\s-]+$/, "Invalid WhatsApp number format"),
  website: z.string().url("Please enter a valid URL (https://...)").optional().or(z.literal("")),
  facebook: z.string().url("Please enter a valid Facebook URL").optional().or(z.literal("")),
  instagram: z.string().url("Please enter a valid Instagram URL").optional().or(z.literal("")),
});

const operatingHourSchema = z.object({
  day: z.string(),
  open: z.string().regex(/^\d{2}:\d{2}$/, "Invalid time format (HH:MM)"),
  close: z.string().regex(/^\d{2}:\d{2}$/, "Invalid time format (HH:MM)"),
  closed: z.boolean(),
});

const locationSchema = z.object({
  address: z.string().min(10, "Address must be at least 10 characters"),
  pickupRadius: z.coerce.number().min(1).max(50),
  deliveryRadius: z.coerce.number().min(1).max(100),
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

const productSchema = z.object({
  id: z.number(),
  name: z.string().min(1, "Product name is required"),
  category: z.string().min(1, "Category is required"),
  price: z.coerce.number().positive("Price must be positive"),
  urgentPrice: z.coerce.number().positive("Price must be positive").optional().nullable(),
  specialPrice: z.coerce.number().positive("Price must be positive").optional().nullable(),
  imagePreview: z.string().optional(),
});

const bundleSchema = z.object({
  id: z.number(),
  name: z.string().min(1, "Bundle name is required"),
  description: z.string().min(1, "Description is required"),
  price: z.coerce.number().nonnegative("Price must be non-negative"),
  discount: z.string().optional(),
  isActive: z.boolean().default(true),
});

const dateOfferSchema = z.object({
  id: z.number(),
  name: z.string().min(1, "Offer name is required"),
  description: z.string().optional(),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().min(1, "End date is required"),
  discountType: z.enum(["percentage", "fixed"]),
  discountValue: z.coerce.number().nonnegative("Discount value is required"),
  minOrder: z.coerce.number().nonnegative("Minimum order must be non-negative").optional().nullable(),
  isActive: z.boolean().default(true),
});

const amountDiscountSchema = z.object({
  id: z.number(),
  minAmount: z.coerce.number().nonnegative("Minimum amount is required"),
  discountType: z.enum(["percentage", "fixed"]),
  discountValue: z.coerce.number().nonnegative("Discount value is required"),
  maxDiscount: z.coerce.number().nonnegative("Max discount must be non-negative").optional().nullable(),
  isActive: z.boolean().default(true),
});

const deliveryChargeSchema = z.object({
  id: z.number(),
  area: z.string().min(1, "Area name is required"),
  baseCharge: z.coerce.number().nonnegative("Base charge is required"),
  additionalCharge: z.coerce.number().nonnegative("Additional charge must be non-negative").default(0),
  freeDeliveryAbove: z.coerce.number().nonnegative("Must be non-negative").optional().nullable(),
  estimatedTime: z.coerce.number().nonnegative("Estimated time must be non-negative").optional().nullable(),
  isActive: z.boolean().default(true),
});

const promotionSchema = z.object({
  id: z.number(),
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  type: z.enum(["banner", "popup", "notification", "email", "sms"]),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().min(1, "End date is required"),
  targetAudience: z.enum(["all", "new", "returning", "vip"]).default("all"),
  priority: z.enum(["low", "medium", "high", "urgent"]).default("medium"),
  status: z.enum(["active", "inactive"]).default("active"),
});

const completeFormSchema = z.object({
  profile: profileSchema,
  location: locationSchema,
  deliveryPersons: z.array(deliveryPersonSchema).min(1, "At least one delivery person is required"),
  products: z.array(productSchema).min(1, "At least one product is required"),
  offers: z.object({
    bundles: z.array(bundleSchema).default([]),
    dateOffers: z.array(dateOfferSchema).default([]),
    amountDiscounts: z.array(amountDiscountSchema).default([]),
  }).default({
    bundles: [],
    dateOffers: [],
    amountDiscounts: [],
  }),
  deliveryCharges: z.array(deliveryChargeSchema).min(1, "At least one delivery charge is required"),
  promotions: z.array(promotionSchema).min(1, "At least one promotion is required"),
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
    pickupRadius: 5,
    deliveryRadius: 15,
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
  deliveryPersons: [
    {
      id: Date.now(),
      name: "",
      phone: "",
      vehicleType: "bike",
      licenseNumber: "",
    },
  ],
  products: [
    {
      id: Date.now() + 1,
      name: "",
      category: "",
      price: 0,
      urgentPrice: null,
      specialPrice: null,
      imagePreview: "",
    },
  ],
  offers: {
    bundles: [
      {
        id: Date.now() + 2,
        name: "",
        description: "",
        price: 0,
        discount: "",
        isActive: true,
      },
    ],
    dateOffers: [
      {
        id: Date.now() + 3,
        name: "",
        description: "",
        startDate: "",
        endDate: "",
        discountType: "percentage",
        discountValue: 0,
        minOrder: null,
        isActive: true,
      },
    ],
    amountDiscounts: [
      {
        id: Date.now() + 4,
        minAmount: 0,
        discountType: "percentage",
        discountValue: 0,
        maxDiscount: null,
        isActive: true,
      },
    ],
  },
  deliveryCharges: [
    {
      id: Date.now() + 5,
      area: "",
      baseCharge: 0,
      additionalCharge: 0,
      freeDeliveryAbove: null,
      estimatedTime: null,
      isActive: true,
    },
  ],
  promotions: [
    {
      id: Date.now() + 6,
      title: "",
      description: "",
      type: "banner",
      startDate: "",
      endDate: "",
      targetAudience: "all",
      priority: "medium",
      status: "active",
    },
  ],
};

const SectionLayout = ({ 
  title, 
  description, 
  icon: Icon, 
  children, 
  onNext, 
  onBack, 
  isFirst = false, 
  isLast = false,
  actionButton 
}) => (
  <div className="space-y-6">
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <Icon className="w-6 h-6" style={{ color: colors.textPrimary }} />
        <div>
          <h2 className="text-xl font-semibold" style={{ color: colors.textPrimary }}>
            {title}
          </h2>
          <p className="text-sm" style={{ color: colors.textSecondary }}>{description}</p>
        </div>
      </div>
      {actionButton}
    </div>

    <div className="space-y-6">{children}</div>

    <div className="flex justify-between pt-6">
      {!isFirst && (
        <button
          type="button"
          onClick={onBack}
          className="px-4 py-2 rounded-lg border flex items-center gap-2 transition-colors hover:bg-gray-50 bg-white border-gray-400"
          style={{ color: colors.textPrimary }}
        >
          <ChevronLeftIcon className="w-4 h-4" />
          Back
        </button>
      )}
      <div className="flex-1" />
      <button
        type="button"
        onClick={onNext}
        className="px-6 py-2 rounded-lg font-medium transition-colors hover:opacity-90 border border-gray-400"
        style={{ backgroundColor: colors.accent, color: "#FFFFFF" }}
      >
        {isLast ? "Complete Setup" : "Next"}
      </button>
    </div>
  </div>
);

const InputField = ({ 
  label, 
  name, 
  register, 
  errors, 
  placeholder, 
  type = "text", 
  required = false, 
  className = "",
  ...props 
}) => {
  const error = name.split('.').reduce((obj, key) => obj?.[key], errors);
  
  return (
    <div className={className}>
      <label className="block text-sm font-medium mb-2" style={{ color: colors.textPrimary }}>
        {label}{required && " *"}
      </label>
      <input
        type={type}
        {...register(name, { required: required && `${label} is required` })}
        className={`w-full px-3 py-2 rounded-lg border border-gray-400 transition-colors focus:ring-2 focus:outline-none focus:border-gray-500 focus:ring-gray-500 ${
          error ? "border-red-300 focus:border-red-500 focus:ring-red-500" : "border-gray-400"
        }`}
        style={{ backgroundColor: colors.card }}
        placeholder={placeholder}
        {...props}
      />
      {error && (
        <p className="mt-1 text-xs text-red-600">{error.message}</p>
      )}
    </div>
  );
};

const SelectField = ({ 
  label, 
  name, 
  register, 
  errors, 
  options, 
  required = false, 
  className = "" 
}) => {
  const error = name.split('.').reduce((obj, key) => obj?.[key], errors);
  
  return (
    <div className={className}>
      <label className="block text-sm font-medium mb-2" style={{ color: colors.textPrimary }}>
        {label}{required && " *"}
      </label>
      <select
        {...register(name, { required: required && `${label} is required` })}
        className={`w-full px-3 py-2 rounded-lg border border-gray-400 transition-colors focus:ring-2 focus:outline-none focus:border-gray-500 focus:ring-gray-500 ${
          error ? "border-red-300 focus:border-red-500 focus:ring-red-500" : "border-gray-400"
        }`}
        style={{ backgroundColor: colors.card }}
      >
        {options.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && (
        <p className="mt-1 text-xs text-red-600">{error.message}</p>
      )}
    </div>
  );
};

const TextAreaField = ({ 
  label, 
  name, 
  register, 
  errors, 
  placeholder, 
  required = false, 
  className = "", 
  rows = 3 
}) => {
  const error = name.split('.').reduce((obj, key) => obj?.[key], errors);
  
  return (
    <div className={className}>
      <label className="block text-sm font-medium mb-2" style={{ color: colors.textPrimary }}>
        {label}{required && " *"}
      </label>
      <textarea
        rows={rows}
        {...register(name, { required: required && `${label} is required` })}
        className={`w-full px-3 py-2 rounded-lg border border-gray-400 transition-colors focus:ring-2 focus:outline-none resize-none focus:border-gray-500 focus:ring-gray-500 ${
          error ? "border-red-300 focus:border-red-500 focus:ring-red-500" : "border-gray-400"
        }`}
        style={{ backgroundColor: colors.card }}
        placeholder={placeholder}
      />
      {error && (
        <p className="mt-1 text-xs text-red-600">{error.message}</p>
      )}
    </div>
  );
};

const Card = ({ children, className = "" }) => (
  <div 
    className={`rounded-lg border border-gray-400 p-4 ${className}`}
    style={{ 
      backgroundColor: colors.card
    }}
  >
    {children}
  </div>
);

const ActionButton = ({ children, onClick, className = "" }) => (
  <button
    type="button"
    onClick={onClick}
    className={`px-3 py-2 rounded-lg border border-gray-400 flex items-center gap-2 text-sm font-medium transition-colors hover:bg-gray-50 ${className}`}
    style={{ color: colors.textPrimary }}
  >
    {children}
  </button>
);

export default function ProfessionalBusinessSetup() {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState("profile");
  const [completedSections, setCompletedSections] = useState(new Set());
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isValid },
    watch,
    setValue,
    getValues,
    trigger,
  } = useForm({
    defaultValues,
    resolver: zodResolver(completeFormSchema),
    mode: "onChange",
  });

  const sections = [
    { id: "profile", title: "Profile Details", icon: UserCircleIcon },
    { id: "location", title: "Location & Hours", icon: MapPinIcon },
    { id: "deliveryPersons", title: "Delivery Team", icon: TruckIcon },
    { id: "products", title: "Products/Services", icon: TagIcon },
    { id: "offers", title: "Offers & Discounts", icon: GiftIcon },
    { id: "deliveryCharges", title: "Delivery Charges", icon: CurrencyDollarIcon },
    { id: "promotions", title: "Promotions", icon: FireIcon },
  ];

  // Calculate progress
  const progress = Math.round((completedSections.size / sections.length) * 100);

  const markSectionComplete = (sectionId) => {
    setCompletedSections(prev => new Set([...prev, sectionId]));
  };

  const validateCurrentSection = async () => {
    let sectionFields = [];
    
    switch (activeSection) {
      case "profile":
        sectionFields = ["profile.companyName", "profile.landline", "profile.whatsapp"];
        break;
      case "location":
        sectionFields = ["location.address", "location.pickupRadius", "location.deliveryRadius"];
        break;
      case "deliveryPersons":
        sectionFields = ["deliveryPersons"];
        break;
      case "products":
        sectionFields = ["products"];
        break;
      case "offers":
        sectionFields = ["offers"];
        break;
      case "deliveryCharges":
        sectionFields = ["deliveryCharges"];
        break;
      case "promotions":
        sectionFields = ["promotions"];
        break;
    }

    const result = await trigger(sectionFields);
    if (result) {
      markSectionComplete(activeSection);
    }
    return result;
  };

  const goToNextSection = async () => {
    const isValid = await validateCurrentSection();
    if (!isValid) return;

    const currentIndex = sections.findIndex(s => s.id === activeSection);
    if (currentIndex < sections.length - 1) {
      setActiveSection(sections[currentIndex + 1].id);
    }
  };

  const goToPreviousSection = () => {
    const currentIndex = sections.findIndex(s => s.id === activeSection);
    if (currentIndex > 0) {
      setActiveSection(sections[currentIndex - 1].id);
    }
  };

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      console.log("Form submitted:", data);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      alert("Business setup completed successfully!");
      navigate("/dashboard");
    } catch (error) {
      console.error("Submission error:", error);
      alert("An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Helper functions for dynamic arrays
  const addDeliveryPerson = () => {
    const current = getValues("deliveryPersons");
    setValue("deliveryPersons", [
      ...current,
      {
        id: Date.now(),
        name: "",
        phone: "",
        vehicleType: "bike",
        licenseNumber: "",
      },
    ]);
  };

  const removeDeliveryPerson = (index) => {
    const current = getValues("deliveryPersons");
    if (current.length > 1) {
      setValue("deliveryPersons", current.filter((_, i) => i !== index));
    }
  };

  const addProduct = () => {
    const current = getValues("products");
    setValue("products", [
      ...current,
      {
        id: Date.now(),
        name: "",
        category: "",
        price: 0,
        urgentPrice: null,
        specialPrice: null,
        imagePreview: "",
      },
    ]);
  };

  const removeProduct = (index) => {
    const current = getValues("products");
    if (current.length > 1) {
      setValue("products", current.filter((_, i) => i !== index));
    }
  };

  const handleImageUpload = (index, event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const current = getValues("products");
        const updated = [...current];
        updated[index] = { ...updated[index], imagePreview: e.target.result };
        setValue("products", updated);
      };
      reader.readAsDataURL(file);
    }
  };

  const addBundle = () => {
    const current = getValues("offers.bundles");
    setValue("offers.bundles", [
      ...current,
      {
        id: Date.now(),
        name: "",
        description: "",
        price: 0,
        discount: "",
        isActive: true,
      },
    ]);
  };

  const addDateOffer = () => {
    const current = getValues("offers.dateOffers");
    setValue("offers.dateOffers", [
      ...current,
      {
        id: Date.now(),
        name: "",
        description: "",
        startDate: "",
        endDate: "",
        discountType: "percentage",
        discountValue: 0,
        minOrder: null,
        isActive: true,
      },
    ]);
  };

  const addAmountDiscount = () => {
    const current = getValues("offers.amountDiscounts");
    setValue("offers.amountDiscounts", [
      ...current,
      {
        id: Date.now(),
        minAmount: 0,
        discountType: "percentage",
        discountValue: 0,
        maxDiscount: null,
        isActive: true,
      },
    ]);
  };

  const addDeliveryCharge = () => {
    const current = getValues("deliveryCharges");
    setValue("deliveryCharges", [
      ...current,
      {
        id: Date.now(),
        area: "",
        baseCharge: 0,
        additionalCharge: 0,
        freeDeliveryAbove: null,
        estimatedTime: null,
        isActive: true,
      },
    ]);
  };

  const removeDeliveryCharge = (index) => {
    const current = getValues("deliveryCharges");
    if (current.length > 1) {
      setValue("deliveryCharges", current.filter((_, i) => i !== index));
    }
  };

  const formValues = watch();

  return (
    <div className="min-h-screen bg-gray-50" style={{ backgroundColor: colors.card }}>
      <div style={{ backgroundColor: colors.card, borderBottom: `1px solid ${colors.border}` }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-center py-6 gap-4">
            <div>
              <h1 className="text-2xl font-bold" style={{ color: colors.textPrimary }}>
                Business Setup
              </h1>
              <p className="mt-1" style={{ color: colors.textSecondary }}>
                Complete your business profile to start accepting orders
              </p>
            </div>
            <div className="p-3 rounded-xl border border-gray-400" style={{ backgroundColor: colors.card }}>
              <div className="text-sm mb-1" style={{ color: colors.textSecondary }}>Setup Progress</div>
              <div className="flex items-center gap-3">
                <div className="w-32 rounded-full h-2" style={{ backgroundColor: colors.border }}>
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-64 shrink-0">
            <div 
              className="rounded-lg border border-gray-400 p-4 sticky top-8"
              style={{ 
                backgroundColor: colors.card
              }}
            >
              <nav className="space-y-2">
                {sections.map((section) => (
                  <button
                    key={section.id}
                    type="button"
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      activeSection === section.id
                        ? "border border-gray-400"
                        : "hover:opacity-80"
                    }`}
                    style={
                      activeSection === section.id
                        ? {
                            backgroundColor: colors.background,
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

              <div className="mt-6 p-3 rounded-lg border border-gray-400" style={{ backgroundColor: colors.background }}>
                <div className="text-xs" style={{ color: colors.textPrimary }}>
                  <div className="font-medium mb-1">Quick Tips</div>
                  <ul className="space-y-2 font-medium" style={{ color: colors.textSecondary }}>
                    <li>• Complete all required fields</li>
                    <li>• Upload clear information</li>
                    <li>• Set realistic delivery radius</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <div className="flex-1">
            {activeSection === "profile" && (
              <SectionLayout
                title="Profile Details"
                icon={UserCircleIcon}
                onNext={goToNextSection}
                onBack={goToPreviousSection}
                isFirst={true}
              >
                <div className="bg-gray-50 border border-gray-400 rounded-xl p-6 space-y-6 shadow-sm">
                  <div className="pb-4 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900">Company Information</h3>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <InputField
                      label="Company Name"
                      name="profile.companyName"
                      register={register}
                      errors={errors}
                      placeholder="Enter company name"
                      required
                    />
                    <InputField
                      label="Landline"
                      name="profile.landline"
                      register={register}
                      errors={errors}
                      placeholder="+971 X XXX XXXX"
                    />
                    <InputField
                      label="WhatsApp Number"
                      name="profile.whatsapp"
                      register={register}
                      errors={errors}
                      placeholder="+971 XX XXX XXXX"
                      required
                    />
                    <InputField
                      label="Website"
                      name="profile.website"
                      register={register}
                      errors={errors}
                      placeholder="https://example.com"
                    />
                    <InputField
                      label="Facebook"
                      name="profile.facebook"
                      register={register}
                      errors={errors}
                      placeholder="https://facebook.com/yourpage"
                    />
                    <InputField
                      label="Instagram"
                      name="profile.instagram"
                      register={register}
                      errors={errors}
                      placeholder="https://instagram.com/yourprofile"
                    />
                  </div>
                </div>
              </SectionLayout>
            )}
            {activeSection === "location" && (
              <SectionLayout
                title="Location & Hours"
                description="Business location and service hours"
                icon={MapPinIcon}
                onNext={goToNextSection}
                onBack={goToPreviousSection}
              >
                <div className="bg-gray-50 border border-gray-400 rounded-xl p-6 space-y-6 shadow-sm">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <TextAreaField
                        label="Complete Address"
                        name="location.address"
                        register={register}
                        errors={errors}
                        placeholder="Enter your complete business address"
                        required
                      />
                      <div className="grid grid-cols-2 gap-4">
                        <InputField
                          label="Pickup Radius (km)"
                          name="location.pickupRadius"
                          register={register}
                          errors={errors}
                          type="number"
                          required
                        />
                        <InputField
                          label="Delivery Radius (km)"
                          name="location.deliveryRadius"
                          register={register}
                          errors={errors}
                          type="number"
                          required
                        />
                      </div>
                      <InputField
                        label="Landmark"
                        name="location.landmark"
                        register={register}
                        errors={errors}
                        placeholder="Nearby famous location"
                      />
                    </div>
                    <div>
                      <h3 className="text-lg font-medium mb-4" style={{ color: colors.textPrimary }}>Operating Hours</h3>
                      <div className="space-y-3">
                        {formValues.location?.operatingHours?.map((day, index) => (
                          <div key={index} className="flex items-center justify-between">
                            <label className="flex items-center gap-2 text-sm font-medium" style={{ color: colors.textPrimary }}>
                              <input
                                type="checkbox"
                                checked={!day.closed}
                                onChange={(e) => {
                                  const hours = [...formValues.location.operatingHours];
                                  hours[index] = { ...hours[index], closed: !e.target.checked };
                                  setValue("location.operatingHours", hours);
                                }}
                                className="rounded border-gray-400 text-gray-600 focus:ring-gray-500"
                              />
                              {day.day}
                            </label>
                            {!day.closed && (
                              <div className="flex items-center gap-2">
                                <input
                                  type="time"
                                  value={day.open}
                                  onChange={(e) => {
                                    const hours = [...formValues.location.operatingHours];
                                    hours[index] = { ...hours[index], open: e.target.value };
                                    setValue("location.operatingHours", hours);
                                  }}
                                  className="px-2 py-1 border border-gray-400 rounded text-sm"
                                  style={{ backgroundColor: colors.card }}
                                />
                                <span style={{ color: colors.textSecondary }}>to</span>
                                <input
                                  type="time"
                                  value={day.close}
                                  onChange={(e) => {
                                    const hours = [...formValues.location.operatingHours];
                                    hours[index] = { ...hours[index], close: e.target.value };
                                    setValue("location.operatingHours", hours);
                                  }}
                                  className="px-2 py-1 border border-gray-400 rounded text-sm"
                                  style={{ backgroundColor: colors.card }}
                                />
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </SectionLayout>
            )}
            {activeSection === "deliveryPersons" && (
              <SectionLayout
                title="Delivery Team"
                description="Manage your delivery personnel"
                icon={TruckIcon}
                onNext={goToNextSection}
                onBack={goToPreviousSection}
                actionButton={
                  <ActionButton onClick={addDeliveryPerson}>
                    <PlusIcon className="w-4 h-4" />
                    Add Person
                  </ActionButton>
                }
              >
                <div className="space-y-4">
                  {formValues.deliveryPersons?.map((person, index) => (
                    <Card key={index}>
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="font-medium" style={{ color: colors.textPrimary }}>
                          Delivery Person {index + 1}
                        </h3>
                        {formValues.deliveryPersons.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeDeliveryPerson(index)}
                            style={{ color: colors.textSecondary }}
                            className="hover:opacity-70 p-1"
                          >
                            <TrashIcon className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <InputField
                          label="Full Name"
                          name={`deliveryPersons.${index}.name`}
                          register={register}
                          errors={errors}
                          placeholder="Full name"
                          required
                        />
                        <InputField
                          label="Phone Number"
                          name={`deliveryPersons.${index}.phone`}
                          register={register}
                          errors={errors}
                          placeholder="Phone number"
                          required
                        />
                        <SelectField
                          label="Vehicle Type"
                          name={`deliveryPersons.${index}.vehicleType`}
                          register={register}
                          errors={errors}
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
                          name={`deliveryPersons.${index}.licenseNumber`}
                          register={register}
                          errors={errors}
                          placeholder="License number"
                          className="md:col-span-2"
                        />
                      </div>
                    </Card>
                  ))}
                </div>
              </SectionLayout>
            )}
            {activeSection === "products" && (
              <SectionLayout
                title="Products / Services"
                description="Manage your product catalog and pricing"
                icon={TagIcon}
                onNext={goToNextSection}
                onBack={goToPreviousSection}
                actionButton={
                  <ActionButton onClick={addProduct}>
                    <PlusIcon className="w-4 h-4" />
                    Add Product
                  </ActionButton>
                }
              >
                <div className="space-y-6">
                  {formValues.products?.map((product, index) => (
                    <Card key={index}>
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="font-medium" style={{ color: colors.textPrimary }}>
                          Product {index + 1}
                        </h3>
                        {formValues.products.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeProduct(index)}
                            style={{ color: colors.textSecondary }}
                            className="hover:opacity-70 p-1"
                          >
                            <TrashIcon className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div>
                          <label className="block text-sm font-medium mb-2" style={{ color: colors.textPrimary }}>
                            Product Image
                          </label>
                          <div 
                            className="border-2 border-dashed border-gray-400 rounded-lg p-4 text-center h-32 flex items-center justify-center cursor-pointer hover:opacity-80 transition-opacity"
                            style={{ backgroundColor: colors.background }}
                            onClick={() => document.getElementById(`product-image-${index}`).click()}
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
                                <PhotoIcon className="mx-auto h-8 w-8" style={{ color: colors.textSecondary }} />
                                <span className="mt-2 block text-sm font-medium" style={{ color: colors.textPrimary }}>
                                  Upload Image
                                </span>
                              </div>
                            )}
                            <input
                              id={`product-image-${index}`}
                              type="file"
                              className="hidden"
                              accept="image/*"
                              onChange={(e) => handleImageUpload(index, e)}
                            />
                          </div>
                        </div>
                        <div className="lg:col-span-2">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <InputField
                              label="Product Name"
                              name={`products.${index}.name`}
                              register={register}
                              errors={errors}
                              placeholder="Product name"
                              required
                              className="md:col-span-2"
                            />
                            <InputField
                              label="Category"
                              name={`products.${index}.category`}
                              register={register}
                              errors={errors}
                              placeholder="Product category"
                              required
                            />
                            <InputField
                              label="Normal Price"
                              name={`products.${index}.price`}
                              register={register}
                              errors={errors}
                              type="number"
                              step="0.01"
                              placeholder="0.00"
                              required
                            />
                            <InputField
                              label="Urgent Price"
                              name={`products.${index}.urgentPrice`}
                              register={register}
                              errors={errors}
                              type="number"
                              step="0.01"
                              placeholder="0.00"
                            />
                            <InputField
                              label="Special Price"
                              name={`products.${index}.specialPrice`}
                              register={register}
                              errors={errors}
                              type="number"
                              step="0.01"
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
              {activeSection === "offers" && (
                <SectionLayout
                  title="Offers & Discounts"
                  description="Configure special offers and discount strategies"
                  icon={GiftIcon}
                  onNext={goToNextSection}
                  onBack={goToPreviousSection}
                >
                  {/* Product Bundles */}
                  <div className="mb-8">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-medium" style={{ color: colors.textPrimary }}>
                        Product Bundles
                      </h3>
                      <ActionButton onClick={addBundle}>
                        <PlusIcon className="w-4 h-4" />
                        Add Bundle
                      </ActionButton>
                    </div>
                    <div className="space-y-4">
                      {formValues.offers?.bundles?.map((bundle, index) => (
                        <Card key={index}>
                          <div className="flex justify-between items-center mb-4">
                            <h3 className="font-medium" style={{ color: colors.textPrimary }}>
                              Bundle {index + 1}
                            </h3>
                            <button
                              type="button"
                              onClick={() => {
                                const current = getValues("offers.bundles");
                                setValue(
                                  "offers.bundles",
                                  current.filter((_, i) => i !== index)
                                );
                              }}
                              style={{ color: colors.textSecondary }}
                              className="hover:opacity-70 p-1"
                            >
                              <TrashIcon className="w-4 h-4" />
                            </button>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <InputField
                              label="Bundle Name"
                              name={`offers.bundles.${index}.name`}
                              register={register}
                              errors={errors}
                              placeholder="e.g., Family Combo"
                              required
                            />
                            <InputField
                              label="Bundle Price"
                              name={`offers.bundles.${index}.price`}
                              register={register}
                              errors={errors}
                              type="number"
                              step="0.01"
                              placeholder="0.00"
                              required
                            />
                            <TextAreaField
                              label="Description"
                              name={`offers.bundles.${index}.description`}
                              register={register}
                              errors={errors}
                              placeholder="Describe this bundle offer..."
                              className="md:col-span-2"
                            />
                          </div>
                        </Card>
                      ))}
                      {formValues.offers?.bundles?.length === 0 && (
                        <Card>
                          <div className="text-center py-8" style={{ color: colors.textSecondary }}>
                            <p>No bundles added yet. Click "Add Bundle" to create one.</p>
                          </div>
                        </Card>
                      )}
                    </div>
                  </div>

                  {/* Date-wise Offers */}
                  <div className="mb-8">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-medium" style={{ color: colors.textPrimary }}>
                        Date-wise Offers
                      </h3>
                      <ActionButton onClick={addDateOffer}>
                        <PlusIcon className="w-4 h-4" />
                        Add Offer
                      </ActionButton>
                    </div>
                    <div className="space-y-4">
                      {formValues.offers?.dateOffers?.map((offer, index) => (
                        <Card key={index}>
                          <div className="flex justify-between items-center mb-4">
                            <h3 className="font-medium" style={{ color: colors.textPrimary }}>
                              Date Offer {index + 1}
                            </h3>
                            <button
                              type="button"
                              onClick={() => {
                                const current = getValues("offers.dateOffers");
                                setValue(
                                  "offers.dateOffers",
                                  current.filter((_, i) => i !== index)
                                );
                              }}
                              style={{ color: colors.textSecondary }}
                              className="hover:opacity-70 p-1"
                            >
                              <TrashIcon className="w-4 h-4" />
                            </button>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <InputField
                              label="Offer Name"
                              name={`offers.dateOffers.${index}.name`}
                              register={register}
                              errors={errors}
                              placeholder="e.g., Weekend Special"
                              required
                            />
                            <SelectField
                              label="Discount Type"
                              name={`offers.dateOffers.${index}.discountType`}
                              register={register}
                              errors={errors}
                              options={[
                                { value: "percentage", label: "Percentage (%)" },
                                { value: "fixed", label: "Fixed Amount" }
                              ]}
                            />
                            <InputField
                              label="Start Date"
                              name={`offers.dateOffers.${index}.startDate`}
                              register={register}
                              errors={errors}
                              type="date"
                              required
                            />
                            <InputField
                              label="End Date"
                              name={`offers.dateOffers.${index}.endDate`}
                              register={register}
                              errors={errors}
                              type="date"
                              required
                            />
                            <InputField
                              label="Discount Value"
                              name={`offers.dateOffers.${index}.discountValue`}
                              register={register}
                              errors={errors}
                              type="number"
                              placeholder="10"
                              required
                            />
                            <InputField
                              label="Minimum Order"
                              name={`offers.dateOffers.${index}.minOrder`}
                              register={register}
                              errors={errors}
                              type="number"
                              step="0.01"
                              placeholder="0.00"
                            />
                          </div>
                        </Card>
                      ))}
                      {formValues.offers?.dateOffers?.length === 0 && (
                        <Card>
                          <div className="text-center py-8" style={{ color: colors.textSecondary }}>
                            <p>No date offers added yet. Click "Add Offer" to create one.</p>
                          </div>
                        </Card>
                      )}
                    </div>
                  </div>

                  {/* Amount-based Discounts */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-medium" style={{ color: colors.textPrimary }}>
                        Amount-based Discounts
                      </h3>
                      <ActionButton onClick={addAmountDiscount}>
                        <PlusIcon className="w-4 h-4" />
                        Add Tier
                      </ActionButton>
                    </div>
                    <div className="space-y-4">
                      {formValues.offers?.amountDiscounts?.map((discount, index) => (
                        <Card key={index}>
                          <div className="flex justify-between items-center mb-4">
                            <h3 className="font-medium" style={{ color: colors.textPrimary }}>
                              Discount Tier {index + 1}
                            </h3>
                            <button
                              type="button"
                              onClick={() => {
                                const current = getValues("offers.amountDiscounts");
                                setValue(
                                  "offers.amountDiscounts",
                                  current.filter((_, i) => i !== index)
                                );
                              }}
                              style={{ color: colors.textSecondary }}
                              className="hover:opacity-70 p-1"
                            >
                              <TrashIcon className="w-4 h-4" />
                            </button>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            <InputField
                              label="Minimum Amount"
                              name={`offers.amountDiscounts.${index}.minAmount`}
                              register={register}
                              errors={errors}
                              type="number"
                              step="0.01"
                              placeholder="100.00"
                              required
                            />
                            <SelectField
                              label="Discount Type"
                              name={`offers.amountDiscounts.${index}.discountType`}
                              register={register}
                              errors={errors}
                              options={[
                                { value: "percentage", label: "Percentage (%)" },
                                { value: "fixed", label: "Fixed Amount" }
                              ]}
                            />
                            <InputField
                              label="Discount Value"
                              name={`offers.amountDiscounts.${index}.discountValue`}
                              register={register}
                              errors={errors}
                              type="number"
                              placeholder="10"
                              required
                            />
                            <InputField
                              label="Max Discount"
                              name={`offers.amountDiscounts.${index}.maxDiscount`}
                              register={register}
                              errors={errors}
                              type="number"
                              step="0.01"
                              placeholder="0.00"
                            />
                          </div>
                        </Card>
                      ))}
                      {formValues.offers?.amountDiscounts?.length === 0 && (
                        <Card>
                          <div className="text-center py-8" style={{ color: colors.textSecondary }}>
                            <p>No discount tiers added yet. Click "Add Tier" to create one.</p>
                          </div>
                        </Card>
                      )}
                    </div>
                  </div>
                </SectionLayout>
              )}

            {/* Delivery Charges Section */}
            {activeSection === "deliveryCharges" && (
              <SectionLayout
                title="Delivery Charges"
                description="Configure delivery charges for different areas"
                icon={CurrencyDollarIcon}
                onNext={goToNextSection}
                onBack={goToPreviousSection}
                actionButton={
                  <ActionButton onClick={addDeliveryCharge}>
                    <PlusIcon className="w-4 h-4" />
                    Add Area
                  </ActionButton>
                }
              >
                <div className="space-y-4">
                  {formValues.deliveryCharges?.map((area, index) => (
                    <Card key={index}>
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="font-medium" style={{ color: colors.textPrimary }}>
                          Area {index + 1}
                        </h3>
                        {formValues.deliveryCharges.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeDeliveryCharge(index)}
                            style={{ color: colors.textSecondary }}
                            className="hover:opacity-70 p-1"
                          >
                            <TrashIcon className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <InputField
                          label="Area Name"
                          name={`deliveryCharges.${index}.area`}
                          register={register}
                          errors={errors}
                          placeholder="e.g., Downtown, Business Bay"
                          required
                        />
                        <InputField
                          label="Base Charge (AED)"
                          name={`deliveryCharges.${index}.baseCharge`}
                          register={register}
                          errors={errors}
                          type="number"
                          step="0.01"
                          placeholder="15.00"
                          required
                        />
                        <InputField
                          label="Additional Charge (AED)"
                          name={`deliveryCharges.${index}.additionalCharge`}
                          register={register}
                          errors={errors}
                          type="number"
                          step="0.01"
                          placeholder="5.00"
                        />
                        <InputField
                          label="Free Delivery Above (AED)"
                          name={`deliveryCharges.${index}.freeDeliveryAbove`}
                          register={register}
                          errors={errors}
                          type="number"
                          step="0.01"
                          placeholder="100.00"
                        />
                        <InputField
                          label="Estimated Time (minutes)"
                          name={`deliveryCharges.${index}.estimatedTime`}
                          register={register}
                          errors={errors}
                          type="number"
                          placeholder="45"
                        />
                      </div>
                    </Card>
                  ))}
                </div>
              </SectionLayout>
            )}

            {/* Promotions Section */}
            {activeSection === "promotions" && (
              <SectionLayout
                title="Promotions"
                description="Create and manage marketing promotions"
                icon={FireIcon}
                onNext={handleSubmit(onSubmit)}
                onBack={goToPreviousSection}
                isLast={true}
                actionButton={
                  <ActionButton
                    onClick={() => {
                      const current = getValues("promotions");
                      setValue("promotions", [
                        ...current,
                        {
                          id: Date.now(),
                          title: "",
                          description: "",
                          type: "banner",
                          startDate: "",
                          endDate: "",
                          targetAudience: "all",
                          priority: "medium",
                          status: "active",
                        },
                      ]);
                    }}
                  >
                    <PlusIcon className="w-4 h-4" />
                    Add Promotion
                  </ActionButton>
                }
              >
                <div className="space-y-4">
                  {formValues.promotions?.map((promo, index) => (
                    <Card key={index}>
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-medium" style={{ color: colors.textPrimary }}>
                          Promotion {index + 1}
                        </h3>
                        {formValues.promotions.length > 1 && (
                          <button
                            type="button"
                            onClick={() => {
                              const current = getValues("promotions");
                              if (current.length > 1) {
                                setValue("promotions", current.filter((_, i) => i !== index));
                              }
                            }}
                            style={{ color: colors.textSecondary }}
                            className="hover:opacity-70 p-1"
                          >
                            <TrashIcon className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <InputField
                          label="Promotion Title"
                          name={`promotions.${index}.title`}
                          register={register}
                          errors={errors}
                          placeholder="e.g., Summer Sale, Ramadan Offer"
                          required
                        />
                        <SelectField
                          label="Promotion Type"
                          name={`promotions.${index}.type`}
                          register={register}
                          errors={errors}
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
                          name={`promotions.${index}.startDate`}
                          register={register}
                          errors={errors}
                          type="date"
                          required
                        />
                        <InputField
                          label="End Date"
                          name={`promotions.${index}.endDate`}
                          register={register}
                          errors={errors}
                          type="date"
                          required
                        />
                        <SelectField
                          label="Target Audience"
                          name={`promotions.${index}.targetAudience`}
                          register={register}
                          errors={errors}
                          options={[
                            { value: "all", label: "All Customers" },
                            { value: "new", label: "New Customers" },
                            { value: "returning", label: "Returning Customers" },
                            { value: "vip", label: "VIP Customers" }
                          ]}
                        />
                        <SelectField
                          label="Priority"
                          name={`promotions.${index}.priority`}
                          register={register}
                          errors={errors}
                          options={[
                            { value: "low", label: "Low" },
                            { value: "medium", label: "Medium" },
                            { value: "high", label: "High" },
                            { value: "urgent", label: "Urgent" }
                          ]}
                        />
                        <TextAreaField
                          label="Description"
                          name={`promotions.${index}.description`}
                          register={register}
                          errors={errors}
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
        </form>
      </div>
    </div>
  );
}