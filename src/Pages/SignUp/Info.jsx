// ProfessionalBusinessSetup.jsx
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
  UserCircleIcon,
  CheckCircleIcon,
  ChevronLeftIcon,
} from "@heroicons/react/24/outline";

/* ----------------- colors & schemas ----------------- */
const colors = {
  background: "#FFFFFF",
  card: "#F8F9FA",
  borderLight: "#F3F4F6",
  border: "#9CA3AF",
  textPrimary: "#111827",
  textSecondary: "#374151",
  success: "#10B981",
  error: "#EF4444",
  accent: "#6B7280",
};

/* ---------- Zod schemas (updated with lat/lng/delivery radius) ---------- */

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

/* Location schema updated to include latitude, longitude and deliveryRadius */
const locationSchema = z.object({
  address: z.string().min(10, "Address must be at least 10 characters"),
  latitude: z.coerce.number().min(-90, "Latitude must be >= -90").max(90, "Latitude must be <= 90"),
  longitude: z.coerce.number().min(-180, "Longitude must be >= -180").max(180, "Longitude must be <= 180"),
  pickupRadius: z.coerce.number().min(1, "Pickup radius must be at least 1 km").max(50, "Pickup radius max 50 km"),
  deliveryRadius: z.coerce.number().min(1, "Delivery radius must be at least 1 km").max(100, "Delivery radius max 100 km"),
  landmark: z.string().min(3, "Landmark too short").optional().or(z.literal("")),
  operatingHours: z.array(operatingHourSchema).length(7),
});

const deliveryPersonSchema = z.object({
  id: z.number(),
  name: z.string().min(3, "Full name must be at least 3 characters"),
  phone: z.string().min(10, "Phone must be at least 10 digits"),
  vehicleType: z.enum(["bike", "car", "scooter", "van"]),
  licenseNumber: z.string().min(5, "License number must be at least 5 characters"),
});

const completeFormSchema = z.object({
  profile: profileSchema,
  location: locationSchema,
  deliveryPersons: z.array(deliveryPersonSchema).min(1, "At least one delivery person is required"),
});

/* ----------------- default form values (updated latitude/longitude/deliveryRadius) ----------------- */
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
    latitude: 25.276987, // example default — change to '' if you want empty
    longitude: 55.296249,
    pickupRadius: 5,
    deliveryRadius: 15, // maps to delivery_radius_km in your backend
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
};

/* ----------------- UI subcomponents ----------------- */
const SectionLayout = ({ title, description, icon: Icon, children, onNext, onBack, isFirst = false, isLast = false, actionButton }) => (
  <div className="space-y-6">
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <Icon className="w-6 h-6" style={{ color: colors.textPrimary }} />
        <div>
          <h2 className="text-xl font-semibold" style={{ color: colors.textPrimary }}>{title}</h2>
          {description && <p className="text-sm" style={{ color: colors.textSecondary }}>{description}</p>}
        </div>
      </div>
      {actionButton}
    </div>

    <div className="space-y-6">{children}</div>

    <div className="flex justify-between pt-6">
      {!isFirst && (
        <button type="button" onClick={onBack} className="px-4 py-2 rounded-lg border flex items-center gap-2 transition-colors hover:bg-gray-50 bg-white border-gray-400" style={{ color: colors.textPrimary }}>
          <ChevronLeftIcon className="w-4 h-4" /> Back
        </button>
      )}
      <div className="flex-1" />
      <button type="button" onClick={onNext} className="px-6 py-2 rounded-lg font-medium transition-colors hover:opacity-90 border border-gray-400" style={{ backgroundColor: colors.accent, color: "#FFFFFF" }}>
        {isLast ? "Complete Setup" : "Next"}
      </button>
    </div>
  </div>
);

const InputField = ({ label, name, register, errors, placeholder, type = "text", required = false }) => {
  const error = name.split(".").reduce((obj, key) => obj?.[key], errors);
  return (
    <div>
      <label className="block text-sm font-medium mb-2" style={{ color: colors.textPrimary }}>{label}{required && " *"}</label>
      <input
        type={type}
        {...register(name, { valueAsNumber: type === "number" })}
        className={`w-full px-3 py-2 rounded-lg border border-gray-400 transition-colors focus:ring-2 focus:outline-none focus:border-gray-500 focus:ring-gray-500 ${error ? "border-red-300 focus:border-red-500 focus:ring-red-500" : "border-gray-400"}`}
        style={{ backgroundColor: colors.card }}
        placeholder={placeholder}
      />
      {error && <p className="mt-1 text-xs text-red-600">{error.message}</p>}
    </div>
  );
};

const Card = ({ children, className = "" }) => <div className={`rounded-lg border border-gray-400 p-4 ${className}`} style={{ backgroundColor: colors.card }}>{children}</div>;

const ActionButton = ({ children, onClick, className = "" }) => (
  <button type="button" onClick={onClick} className={`px-3 py-2 rounded-lg border border-gray-400 flex items-center gap-2 text-sm font-medium transition-colors hover:bg-gray-50 ${className}`} style={{ color: colors.textPrimary }}>
    {children}
  </button>
);

/* ----------------- main component ----------------- */
export default function ProfessionalBusinessSetup() {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState("profile");
  const [completedSections, setCompletedSections] = useState(new Set());
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, control, formState: { errors }, watch, setValue, getValues, trigger } = useForm({
    defaultValues,
    resolver: zodResolver(completeFormSchema),
    mode: "onChange",
  });

  const sections = [
    { id: "profile", title: "Profile Details", icon: UserCircleIcon },
    { id: "location", title: "Location & Hours", icon: MapPinIcon },
  ];

  const progress = Math.round((completedSections.size / sections.length) * 100);
  const formValues = watch();
  const isLastSection = sections.findIndex((s) => s.id === activeSection) === sections.length - 1;

  const markSectionComplete = (sectionId) => {
    setCompletedSections((prev) => new Set([...prev, sectionId]));
  };

  const validateCurrentSection = async () => {
    let sectionFields = [];
    switch (activeSection) {
      case "profile":
        sectionFields = ["profile.companyName", "profile.landline", "profile.whatsapp"];
        break;
      case "location":
        sectionFields = ["location.address", "location.pickupRadius", "location.deliveryRadius", "location.latitude", "location.longitude"];
        break;
      default:
        sectionFields = [];
    }
    const result = await trigger(sectionFields);
    if (result) markSectionComplete(activeSection);
    return result;
  };

  const goToNextSection = async () => {
    const ok = await validateCurrentSection();
    if (!ok) return;
    const currentIndex = sections.findIndex((s) => s.id === activeSection);
    if (currentIndex < sections.length - 1) setActiveSection(sections[currentIndex + 1].id);
  };

  const goToPreviousSection = () => {
    const currentIndex = sections.findIndex((s) => s.id === activeSection);
    if (currentIndex > 0) setActiveSection(sections[currentIndex - 1].id);
  };

  const onSubmit = async (data) => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      // Map to backend fields: deliveryRadius -> delivery_radius_km
      const payload = {
        profile: data.profile,
        location: {
          address: data.location.address,
          latitude: Number(data.location.latitude),
          longitude: Number(data.location.longitude),
          delivery_radius_km: Number(data.location.deliveryRadius),
          pickup_radius_km: Number(data.location.pickupRadius),
          landmark: data.location.landmark,
          operatingHours: data.location.operatingHours,
        },
        deliveryPersons: data.deliveryPersons,
      };

      console.log("Prepared payload for backend:", payload);

      // TODO: replace with actual API call (axios/fetch)
      await new Promise((r) => setTimeout(r, 800));
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      alert("Submission failed. Try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const addDeliveryPerson = () => {
    const persons = getValues("deliveryPersons") || [];
    const newPerson = { id: Date.now(), name: "", phone: "", vehicleType: "bike", licenseNumber: "" };
    setValue("deliveryPersons", [...persons, newPerson], { shouldValidate: true, shouldDirty: true });
  };

  const removeDeliveryPerson = (indexToRemove) => {
    const persons = getValues("deliveryPersons") || [];
    if (persons.length <= 1) return;
    const updated = persons.filter((_, idx) => idx !== indexToRemove);
    setValue("deliveryPersons", updated, { shouldValidate: true, shouldDirty: true });
  };

  /* Use browser geolocation to fill latitude/longitude */
  const useMyLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not available in your browser.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setValue("location.latitude", Number(latitude).toFixed(6), { shouldValidate: true, shouldDirty: true });
        setValue("location.longitude", Number(longitude).toFixed(6), { shouldValidate: true, shouldDirty: true });
      },
      (err) => {
        console.error(err);
        alert("Could not get your location. Please allow location access.");
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  // helper used for final-step button: first validate current section then submit
  const handleFinalNext = async () => {
    const ok = await validateCurrentSection();
    if (!ok) return;
    handleSubmit(onSubmit)();
  };

  return (
    <div className="min-h-screen bg-gray-50" style={{ backgroundColor: colors.card }}>
      <div style={{ backgroundColor: colors.card, borderBottom: `1px solid ${colors.border}` }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-center py-6 gap-4">
            <div>
              <h1 className="text-2xl font-bold" style={{ color: colors.textPrimary }}>Business Setup</h1>
              <p className="mt-1" style={{ color: colors.textSecondary }}>Complete your business profile to start accepting orders</p>
            </div>
            <div className="p-3 rounded-xl border border-gray-400" style={{ backgroundColor: colors.card }}>
              <div className="text-sm mb-1" style={{ color: colors.textSecondary }}>Setup Progress</div>
              <div className="flex items-center gap-3">
                <div className="w-32 rounded-full h-2" style={{ backgroundColor: colors.border }}>
                  <div className="h-2 rounded-full transition-all duration-300" style={{ width: `${progress}%`, backgroundColor: colors.success }} />
                </div>
                <span className="text-sm font-medium" style={{ color: colors.textPrimary }}>{progress}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-64 shrink-0">
            <div className="rounded-lg border border-gray-400 p-4 sticky top-8" style={{ backgroundColor: colors.card }}>
              <nav className="space-y-2">
                {sections.map((section) => (
                  <button key={section.id} type="button" onClick={() => setActiveSection(section.id)} className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${activeSection === section.id ? "border border-gray-400" : "hover:opacity-80"}`} style={activeSection === section.id ? { backgroundColor: colors.background, color: colors.textPrimary } : { color: colors.textSecondary }}>
                    <section.icon className="w-4 h-4" />
                    <span className="flex-1 text-left">{section.title}</span>
                    {completedSections.has(section.id) && <CheckCircleIcon className="w-4 h-4" style={{ color: colors.success }} />}
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

          <div className="flex-1 space-y-6">
            {activeSection === "profile" && (
              <SectionLayout title="Profile Details" icon={UserCircleIcon} onNext={goToNextSection} onBack={goToPreviousSection} isFirst>
                <div className="bg-gray-50 border border-gray-400 rounded-xl p-6 space-y-6 shadow-sm">
                  <div className="pb-4 border-b border-gray-200"><h3 className="text-lg font-semibold text-gray-900">Company Information</h3></div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <InputField label="Company Name" name="profile.companyName" register={register} errors={errors} placeholder="Enter company name" required />
                    <InputField label="Landline" name="profile.landline" register={register} errors={errors} placeholder="+971 X XXX XXXX" />
                    <InputField label="WhatsApp Number" name="profile.whatsapp" register={register} errors={errors} placeholder="+971 XX XXX XXXX" required />
                    <InputField label="Website" name="profile.website" register={register} errors={errors} placeholder="https://example.com" />
                    <InputField label="Facebook" name="profile.facebook" register={register} errors={errors} placeholder="https://facebook.com/yourpage" />
                    <InputField label="Instagram" name="profile.instagram" register={register} errors={errors} placeholder="https://instagram.com/yourprofile" />
                  </div>
                </div>
              </SectionLayout>
            )}

            {activeSection === "location" && (
              <SectionLayout
                title="Location & Service Area"
                description="Set your business address and define your delivery service zone"
                icon={MapPinIcon}
                onNext={goToNextSection}
                onBack={goToPreviousSection}
                isLast={isLastSection}
              >
                {/* Address Section */}
                <div className="space-y-6">
                  <div className="bg-gray-50 rounded-xl border border-gray-200 p-6">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
                        <MapPinIcon className="w-5 h-5 text-gray-600" />
                      </div>
                      <div>
                      </div>
                    </div>

                    <div className="space-y-6">
                      {/* Full Address */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Full Address <span className="text-red-500">*</span>
                        </label>
                        <textarea
                          {...register("location.address", { required: "Address is required" })}
                          rows="3"
                          className={`w-full px-4 py-3 rounded-lg border ${errors.location?.address ? 'border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-100' : 'border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100'} placeholder-gray-400 focus:outline-none transition-colors`}
                          placeholder="Building name, street, area, city"
                        />
                        {errors.location?.address && (
                          <p className="mt-2 text-sm text-red-600">{errors.location.address.message}</p>
                        )}
                      </div>

                      {/* Coordinates Section */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Latitude <span className="text-red-500">*</span>
                            <span className="ml-2 text-xs text-gray-500 font-normal">(e.g., 25.276987)</span>
                          </label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                              </svg>
                            </div>
                            <input
                              type="number"
                              step="any"
                              {...register("location.latitude", {
                                required: "Latitude is required",
                                min: { value: -90, message: "Latitude must be between -90 and 90" },
                                max: { value: 90, message: "Latitude must be between -90 and 90" }
                              })}
                              className={`w-full pl-10 pr-4 py-3 rounded-lg border ${errors.location?.latitude ? 'border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-100' : 'border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100'} placeholder-gray-400 focus:outline-none transition-colors`}
                              placeholder="25.276987"
                            />
                          </div>
                          {errors.location?.latitude && (
                            <p className="mt-2 text-sm text-red-600">{errors.location.latitude.message}</p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Longitude <span className="text-red-500">*</span>
                            <span className="ml-2 text-xs text-gray-500 font-normal">(e.g., 55.296249)</span>
                          </label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                              </svg>
                            </div>
                            <input
                              type="number"
                              step="any"
                              {...register("location.longitude", {
                                required: "Longitude is required",
                                min: { value: -180, message: "Longitude must be between -180 and 180" },
                                max: { value: 180, message: "Longitude must be between -180 and 180" }
                              })}
                              className={`w-full pl-10 pr-4 py-3 rounded-lg border ${errors.location?.longitude ? 'border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-100' : 'border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100'} placeholder-gray-400 focus:outline-none transition-colors`}
                              placeholder="55.296249"
                            />
                          </div>
                          {errors.location?.longitude && (
                            <p className="mt-2 text-sm text-red-600">{errors.location.longitude.message}</p>
                          )}
                        </div>
                      </div>

                    
                    </div>
                  </div>

                  {/* Delivery Radius Section */}
                  <div className="bg-gray-50 rounded-xl border border-gray-200 p-6">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center">
                        <TruckIcon className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">Delivery Service Zone</h3>
                        <p className="text-sm text-gray-600">Define your delivery coverage area</p>
                      </div>
                    </div>

                    <div className="space-y-6 ">
                      {/* Delivery Radius Slider + Number Input */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2 ">
                          Delivery Radius (km) <span className="text-red-500">*</span>
                        </label>

                        {/* Slider */}
                        <input
                          type="range"
                          min="1"
                          max="50"
                          step="1"
                          {...register("location.deliveryRadius")}
                          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-blue-600"
                        />

                        <div className="flex justify-between text-xs text-gray-500 mt-1">
                          <span>1 km</span>
                          <span>25 km</span>
                          <span>50 km</span>
                        </div>

                        {/* Display + Manual Number Input */}
                        <div className="mt-4">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">Selected radius:</span>
                            <span className="text-lg font-bold text-gray-600">
                              {watch("location.deliveryRadius") ?? defaultValues.location.deliveryRadius} km
                            </span>
                          </div>

                          <input
                            type="number"
                            min="1"
                            max="50"
                            {...register("location.deliveryRadius", {
                              required: "Delivery radius is required",
                              min: { value: 1, message: "Minimum radius is 1 km" },
                              max: { value: 50, message: "Maximum radius is 50 km" },
                            })}
                            className="mt-2 w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-gray-500 focus:ring-2 focus:ring-blue-100 focus:outline-none"
                          />
                        </div>

                        {/* Error Message */}
                        {errors.location?.deliveryRadius && (
                          <p className="mt-2 text-sm text-red-600">
                            {errors.location.deliveryRadius.message}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                </div>
              </SectionLayout>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
