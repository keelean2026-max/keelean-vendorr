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
/* (unchanged from your version) */
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

const completeFormSchema = z.object({
  profile: profileSchema,
  location: locationSchema,
  deliveryPersons: z.array(deliveryPersonSchema).min(1, "At least one delivery person is required"),
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

const InputField = ({ label, name, register, errors, placeholder, type = "text", required = false, className = "", ...props }) => {
  const error = name.split(".").reduce((obj, key) => obj?.[key], errors);
  return (
    <div className={className}>
      <label className="block text-sm font-medium mb-2" style={{ color: colors.textPrimary }}>{label}{required && " *"}</label>
      <input type={type} {...register(name, { required: required && `${label} is required` })} className={`w-full px-3 py-2 rounded-lg border border-gray-400 transition-colors focus:ring-2 focus:outline-none focus:border-gray-500 focus:ring-gray-500 ${error ? "border-red-300 focus:border-red-500 focus:ring-red-500" : "border-gray-400"}`} style={{ backgroundColor: colors.card }} placeholder={placeholder} {...props} />
      {error && <p className="mt-1 text-xs text-red-600">{error.message}</p>}
    </div>
  );
};

const SelectField = ({ label, name, register, errors, options, required = false, className = "" }) => {
  const error = name.split(".").reduce((obj, key) => obj?.[key], errors);
  return (
    <div className={className}>
      <label className="block text-sm font-medium mb-2" style={{ color: colors.textPrimary }}>{label}{required && " *"}</label>
      <select {...register(name, { required: required && `${label} is required` })} className={`w-full px-3 py-2 rounded-lg border border-gray-400 transition-colors focus:ring-2 focus:outline-none focus:border-gray-500 focus:ring-gray-500 ${error ? "border-red-300 focus:border-red-500 focus:ring-red-500" : "border-gray-400"}`} style={{ backgroundColor: colors.card }}>
        {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
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
    { id: "deliveryPersons", title: "Delivery Team", icon: TruckIcon },
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
        sectionFields = ["location.address", "location.pickupRadius", "location.deliveryRadius"];
        break;
      case "deliveryPersons":
        sectionFields = ["deliveryPersons", "deliveryPersons.0.name", "deliveryPersons.0.phone"];
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
      console.log("Form submitted:", data);
      // TODO: replace with real API call
      await new Promise((r) => setTimeout(r, 800));
      // navigate to sidebar after success
      navigate("/sidebar");
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

  // helper used for final-step button: first validate current section then submit
  const handleFinalNext = async () => {
    const ok = await validateCurrentSection();
    if (!ok) return;
    // now submit full form (handleSubmit runs resolver/zod)
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

          <div className="flex-1">
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
              <SectionLayout title="Location & Hours" description="Business location and service hours" icon={MapPinIcon} onNext={goToNextSection} onBack={goToPreviousSection}>
                <div className="bg-gray-50 border border-gray-400 rounded-xl p-6 space-y-6 shadow-sm">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <InputField label="Address" name="location.address" register={register} errors={errors} placeholder="Full address" required />
                      <div className="grid grid-cols-2 gap-4">
                        <InputField label="Pickup Radius (km)" name="location.pickupRadius" register={register} errors={errors} type="number" required />
                        <InputField label="Delivery Radius (km)" name="location.deliveryRadius" register={register} errors={errors} type="number" required />
                      </div>
                      <InputField label="Landmark" name="location.landmark" register={register} errors={errors} placeholder="Nearby famous location" />
                    </div>

                    <div>
                      <h3 className="text-lg font-medium mb-4" style={{ color: colors.textPrimary }}>Operating Hours</h3>
                      <div className="space-y-3">
                        {formValues.location?.operatingHours?.map((day, index) => (
                          <div key={index} className="flex items-center justify-between">
                            <label className="flex items-center gap-2 text-sm font-medium" style={{ color: colors.textPrimary }}>
                              <input type="checkbox" checked={!day.closed} onChange={(e) => { const hours = [...(formValues.location?.operatingHours || [])]; hours[index] = { ...hours[index], closed: !e.target.checked }; setValue("location.operatingHours", hours, { shouldValidate: true }); }} className="rounded border-gray-400 text-gray-600 focus:ring-gray-500" />
                              {day.day}
                            </label>
                            {!day.closed && (
                              <div className="flex items-center gap-2">
                                <input type="time" value={day.open} onChange={(e) => { const hours = [...(formValues.location?.operatingHours || [])]; hours[index] = { ...hours[index], open: e.target.value }; setValue("location.operatingHours", hours, { shouldValidate: true }); }} className="px-2 py-1 border border-gray-400 rounded text-sm" style={{ backgroundColor: colors.card }} />
                                <span style={{ color: colors.textSecondary }}>to</span>
                                <input type="time" value={day.close} onChange={(e) => { const hours = [...(formValues.location?.operatingHours || [])]; hours[index] = { ...hours[index], close: e.target.value }; setValue("location.operatingHours", hours, { shouldValidate: true }); }} className="px-2 py-1 border border-gray-400 rounded text-sm" style={{ backgroundColor: colors.card }} />
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
                // if last section, clicking next will validate current section then submit
                onNext={isLastSection ? handleFinalNext : goToNextSection}
                onBack={goToPreviousSection}
                isLast={isLastSection}
                actionButton={<ActionButton onClick={addDeliveryPerson}><PlusIcon className="w-4 h-4" /> Add Person</ActionButton>}
              >
                <div className="space-y-4">
                  {formValues.deliveryPersons?.map((person, index) => (
                    <Card key={person.id ?? index}>
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="font-medium" style={{ color: colors.textPrimary }}>Delivery Person {index + 1}</h3>
                        {formValues.deliveryPersons.length > 1 && (
                          <button type="button" onClick={() => removeDeliveryPerson(index)} style={{ color: colors.textSecondary }} className="hover:opacity-70 p-1">
                            <TrashIcon className="w-4 h-4" />
                          </button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <InputField label="Full Name" name={`deliveryPersons.${index}.name`} register={register} errors={errors} placeholder="Full name" required />
                        <InputField label="Phone Number" name={`deliveryPersons.${index}.phone`} register={register} errors={errors} placeholder="Phone number" required />
                        <SelectField label="Vehicle Type" name={`deliveryPersons.${index}.vehicleType`} register={register} errors={errors} options={[{ value: "bike", label: "Bike" }, { value: "car", label: "Car" }, { value: "scooter", label: "Scooter" }, { value: "van", label: "Van" }]} required />
                        <InputField label="License Number" name={`deliveryPersons.${index}.licenseNumber`} register={register} errors={errors} placeholder="License number" className="md:col-span-2" />
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
