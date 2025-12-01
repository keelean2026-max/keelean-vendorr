import React, { useState, useEffect, useRef, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import ReactCountryFlag from "react-country-flag";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import countriesData from "world-countries";

// Generate countries list from world-countries
const generateCountriesList = () => {
  return countriesData
    .map((country) => ({
      code: country.cca2,
      name: country.name.common,
      dialCode: country.idd.root + (country.idd.suffixes ? country.idd.suffixes[0] : ""),
      flag: country.flag,
      capital: country.capital ? country.capital[0] : "N/A",
      region: country.region,
      subregion: country.subregion,
    }))
    .filter((country) => country.dialCode && country.dialCode !== "+") // Remove invalid dial codes
    .sort((a, b) => a.name.localeCompare(b.name));
};

// Popular countries to show first
const popularCountryCodes = ["AE", "SA", "US", "GB", "IN", "PK", "BD", "PH", "EG"];

const getSortedCountries = () => {
  const allCountries = generateCountriesList();
  const popularCountries = allCountries.filter((c) => popularCountryCodes.includes(c.code));
  const otherCountries = allCountries.filter((c) => !popularCountryCodes.includes(c.code));
  return [...popularCountries, ...otherCountries];
};

// Zod schemas
const emailSchema = z.object({
  identifier: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
});

const phoneSchema = z.object({
  identifier: z
    .string()
    .min(1, "Phone number is required")
    .regex(/^\d{10}$/, "Please enter a valid 10-digit phone number"),
});

const otpSchema = z.object({
  otp: z
    .string()
    .min(1, "OTP is required")
    .min(4, "OTP must be at least 4 digits")
    .regex(/^\d+$/, "OTP must contain only numbers"),
});

// Combined schemas for different form states
const createSchema = (identifierType, otpSent) => {
  if (otpSent) {
    return otpSchema;
  }
  return identifierType === "email" ? emailSchema : phoneSchema;
};

const baseButtonClasses =
  "w-full rounded-lg text-white font-semibold text-sm py-2.5 " +
  "border border-[#AAB4BC] shadow-lg " +          
  "bg-gradient-to-br from-[#808A93] to-[#95A1AC] " + // Fixed: bg-linear-to-br should be bg-gradient-to-br
  "disabled:opacity-60 disabled:cursor-not-allowed transition-colors duration-200";

const VendorAuth = () => {
  const navigate = useNavigate();
  const [identifierType, setIdentifierType] = useState("email");
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);
  const [channel, setChannel] = useState(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [canResend, setCanResend] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  
  const dropdownRef = useRef(null);

  // Generate countries list
  const countries = useMemo(() => getSortedCountries(), []);
  const [selectedCountry, setSelectedCountry] = useState(countries[0] || null);

  // React Hook Form setup
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    setValue,
    reset,
    trigger,
    clearErrors,
  } = useForm({
    resolver: zodResolver(createSchema(identifierType, otpSent)),
    mode: "onChange",
    defaultValues: {
      identifier: "",
      otp: "",
    },
  });

  const identifierValue = watch("identifier");
  const otpValue = watch("otp");

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowCountryDropdown(false);
        setSearchTerm(""); // Clear search when closing
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // OTP timer effect
  useEffect(() => {
    if (otpSent && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (otpSent && timeLeft === 0) {
      setCanResend(true);
    }
  }, [otpSent, timeLeft]);

  // Handle identifier type change
  const handleIdentifierTypeChange = (type) => {
    setIdentifierType(type);
    reset({ identifier: "", otp: "" });
    setOtpSent(false);
    clearErrors();
  };

  // Handle country selection
  const handleCountrySelect = (country) => {
    setSelectedCountry(country);
    setShowCountryDropdown(false);
    setSearchTerm(""); // Clear search after selection
  };

  // Filter countries for search
  const filteredCountries = useMemo(() => {
    if (!searchTerm) return countries;
    return countries.filter(
      (country) =>
        country.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        country.dialCode.includes(searchTerm) ||
        country.code.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [countries, searchTerm]);

  // Handle phone number input formatting
  const handlePhoneChange = (e) => {
    const rawValue = e.target.value.replace(/\D/g, "").slice(0, 10);
    setValue("identifier", rawValue, { shouldValidate: true });
  };

  // Send OTP
  const handleSendOtp = async (data) => {
    try {
      let mode = null;
      if (identifierType === "email") {
        mode = "EMAIL";
      } else if (identifierType === "phone") {
        mode = "WHATSAPP";
      }

      setChannel(mode);
      setOtpSent(true);
      setTimeLeft(60);
      setCanResend(false);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      alert(`OTP sent to ${identifierType === "phone" ? `${selectedCountry.dialCode} ${data.identifier}` : data.identifier}`);
    } catch (error) {
      console.error("Error sending OTP:", error);
    }
  };

  // Verify OTP
  const handleVerifyOtp = async (data) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Navigate to next page on successful verification
      navigate("/upload-document");
    } catch (error) {
      console.error("Error verifying OTP:", error);
    }
  };

  // Resend OTP
  const handleResendOtp = async () => {
    if (canResend) {
      try {
        setTimeLeft(60);
        setCanResend(false);
        setValue("otp", "");
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        alert("OTP has been resent!");
      } catch (error) {
        console.error("Error resending OTP:", error);
      }
    }
  };

  // Combined submit handler
  const onSubmit = async (data) => {
    if (otpSent) {
      await handleVerifyOtp(data);
    } else {
      await handleSendOtp(data);
    }
  };
  const channelLabel = channel === "EMAIL" ? "Email" : "WhatsApp";
  const fullPhoneNumber = identifierType === "phone" && selectedCountry 
    ? `${selectedCountry.dialCode} ${identifierValue}` 
    : identifierValue;

  // Format time display
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // Fix for background gradient class
  const backgroundClasses = "min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-slate-50 via-slate-100 to-slate-200";

  return (
    <div className={backgroundClasses}>
      <div className="relative w-full max-w-md">
        <div className="absolute inset-0 -z-10 blur-3xl bg-linear-to-b from-slate-200/60 to-transparent"/>
        <div className="bg-white/95 rounded-3xl border border-slate-100 shadow-2xl shadow-slate-200 px-8 py-8 md:py-9">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="h-12 w-12 rounded-full bg-linear-to-br from-slate-100 to-slate-300 flex items-center justify-center shadow-sm ring-1 ring-slate-300/80">
              <span className="text-lg font-bold text-slate-800">V</span>
            </div>
            <span className="text-3xl font-semibold tracking-tight text-slate-900">
              Login
            </span>
          </div>
          <h1 className="text-[22px] font-semibold text-slate-900 mb-1">
            {step === "IDENTIFIER" ? "Sign in or create account" : "OTP verification"}
          </h1>
          {step === "OTP" && (
            <p className="text-sm font-medium text-gray-600 mb-7">
              We’ve sent an OTP on {channelLabel} to:
              <br />
              <span className="font-semibold text-gray-700 break-all">
                {identifierType === "phone" ? fullPhoneNumber : identifierValue}
              </span>
            </p>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="mt-4 space-y-4" noValidate>
            {/* Toggle Buttons */}
            <div className="flex gap-2 mb-4">
              <button
                type="button"
                onClick={() => handleIdentifierTypeChange("email")}
                className={`flex-1 py-2.5 px-4 rounded-lg border text-sm font-medium transition-all duration-200 ${
                  identifierType === "email"
                    ? "bg-blue-50 border-blue-500 text-blue-700 shadow-sm"
                    : "bg-white border-slate-300 text-slate-600 hover:bg-slate-50"
                }`}
              >
                Email
              </button>
              <button
                type="button"
                onClick={() => handleIdentifierTypeChange("phone")}
                className={`flex-1 py-2.5 px-4 rounded-lg border text-sm font-medium transition-all duration-200 ${
                  identifierType === "phone"
                    ? "bg-blue-50 border-blue-500 text-blue-700 shadow-sm"
                    : "bg-white border-slate-300 text-slate-600 hover:bg-slate-50"
                }`}
              >
                Mobile
              </button>
            </div>

            {/* Input Field */}
            <div>
              <label className="block text-sm font-medium text-slate-800 mb-1.5">
                {identifierType === "email" ? "Email address" : "Mobile number"}
              </label>
              {identifierType === "email" ? (
                <div>
                  <input
                    type="email"
                    {...register("identifier")}
                    disabled={otpSent || isSubmitting}
                    className="w-full rounded-lg border border-slate-300 bg-slate-50/70 px-3.5 py-2.5 text-sm text-gray-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-slate-400 transition disabled:bg-slate-100 disabled:text-slate-500"
                    placeholder="Enter your email address"
                  />
                  {errors.identifier && (
                    <p className="mt-1 text-xs text-red-600">
                      {errors.identifier.message}
                    </p>
                  )}
                </div>
              ) : (
                <div>
                  <div className="flex gap-2">
                    {/* Country Code Dropdown */}
                    <div className="relative shrink-0" ref={dropdownRef}>
                      <button
                        type="button"
                        onClick={() => !otpSent && setShowCountryDropdown(!showCountryDropdown)}
                        disabled={otpSent || isSubmitting}
                        className="w-28 h-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-700 flex items-center justify-between hover:bg-slate-50 transition-colors disabled:bg-slate-100 disabled:text-slate-500"
                      >
                        <span className="flex items-center gap-2">
                          {selectedCountry && (
                            <ReactCountryFlag 
                              countryCode={selectedCountry.code}
                              svg
                              style={{
                                width: '20px',
                                height: '15px'
                              }}
                              title={selectedCountry.name}
                            />
                          )}
                          <span>{selectedCountry?.dialCode || "+1"}</span>
                        </span>
                        <span className="text-slate-400">▼</span>
                      </button>

                      {/* Dropdown Menu */}
                      {showCountryDropdown && (
                        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-300 rounded-lg shadow-lg z-10 max-h-60 overflow-hidden flex flex-col">
                          {/* Search Input */}
                          <div className="p-2 border-b">
                            <input
                              type="text"
                              placeholder="Search country..."
                              value={searchTerm}
                              onChange={(e) => setSearchTerm(e.target.value)}
                              className="w-full px-3 py-1.5 text-sm border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                              autoFocus
                            />
                          </div>
                          
                          {/* Countries List */}
                          <div className="overflow-y-auto flex-1">
                            {filteredCountries.length > 0 ? (
                              filteredCountries.map((country) => (
                                <button
                                  key={country.code}
                                  type="button"
                                  onClick={() => handleCountrySelect(country)}
                                  className="w-full px-3 py-2 text-sm text-left hover:bg-slate-50 flex items-center gap-3 transition-colors border-b border-slate-100 last:border-b-0"
                                >
                                  <ReactCountryFlag 
                                    countryCode={country.code}
                                    svg
                                    style={{
                                      width: '20px',
                                      height: '15px'
                                    }}
                                    title={country.name}
                                  />
                                  <span className="flex-1">{country.name}</span>
                                  <span className="text-slate-600">{country.dialCode}</span>
                                </button>
                              ))
                            ) : (
                              <div className="p-4 text-center text-slate-500">
                                No countries found
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Phone Input */}
                    <input
                      type="tel"
                      {...register("identifier")}
                      onChange={handlePhoneChange}
                      disabled={otpSent || isSubmitting}
                      maxLength={10}
                      className="flex-1 rounded-lg border border-slate-300 bg-slate-50/70 px-3.5 py-2.5 text-sm text-gray-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-slate-400 transition disabled:bg-slate-100 disabled:text-slate-500"
                      placeholder="Enter mobile number"
                    />
                  </div>
                  {errors.identifier && (
                    <p className="mt-1 text-xs text-red-600">
                      {errors.identifier.message}
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* OTP Section */}
            {otpSent && (
              <div className="space-y-4 border-t border-slate-200 pt-4">
                <div>
                  <label className="block text-sm font-medium text-slate-800 mb-1.5">
                    Enter OTP
                  </label>
                  <input 
                    type="text" 
                    {...register("otp")}
                    maxLength={6}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm text-slate-900 tracking-[0.4em] text-center placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-slate-400 transition" 
                    placeholder="••••••"
                  />
                  {errors.otp && (
                    <p className="mt-1 text-xs text-red-600">
                      {errors.otp.message}
                    </p>
                  )}
                  
                  {/* Timer Display */}
                  <div className="text-center mt-3">
                    <span className={`text-sm font-medium ${timeLeft === 0 ? 'text-green-600' : 'text-slate-600'}`}>
                      {timeLeft > 0 ? `Time remaining: ${formatTime(timeLeft)}` : 'OTP expired'}
                    </span>
                  </div>
                </div>

                <button 
                  type="submit"
                  disabled={isSubmitting || !otpValue || otpValue.length < 4}
                  className={baseButtonClasses}
                >
                  {isSubmitting ? "Verifying..." : "Verify OTP"}
                </button>

                <button 
                  type="button" 
                  onClick={handleResendOtp}
                  disabled={!canResend || isSubmitting}
                  className={`w-full text-xs font-medium py-2.5 rounded-lg border transition ${
                    canResend 
                      ? "bg-white hover:bg-slate-50 border-slate-300 text-slate-700" 
                      : "bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed"
                  }`}
                >
                  {canResend ? "Resend OTP" : "Resend OTP available in 1 minute"}
                </button>
              </div>
            )}

            {/* Continue/Verify Button */}
            {!otpSent && (
              <button 
                type="submit" 
                disabled={isSubmitting || !identifierValue}
                className={baseButtonClasses}
              >
                {isSubmitting ? "Sending..." : "Send OTP"}
              </button>
            )}

            {/* Change email/mobile option when OTP is sent */}
            {otpSent && (
              <button 
                type="button" 
                onClick={() => {
                  setOtpSent(false);
                  setValue("otp", "");
                  setTimeLeft(0);
                  setCanResend(false);
                  clearErrors();
                }}
                className="w-full text-center text-sm text-sky-600 hover:text-sky-700 hover:underline py-2"
              >
                Change {identifierType === "email" ? "email" : "mobile number"}
              </button>
            )}

            <p className="text-slate-600 text-xs font-medium mt-4 leading-relaxed">
              By continuing, you agree to Vendor's{" "}
              <button type="button" className="text-sky-600 text-xs font-bold hover:text-sky-700 hover:underline">
                Conditions of Use
              </button>{" "}
              and{" "}
              <button type="button" className="text-sky-600 text-xs font-bold hover:text-sky-700 hover:underline">
                Privacy Notice
              </button>.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default VendorAuth;
