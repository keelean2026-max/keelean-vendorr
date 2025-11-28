import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const baseButtonClasses =
  "w-full rounded-lg text-white font-semibold text-sm py-2.5 " +
  "border border-[#AAB4BC] shadow-lg " +          
  " bg-linear-to-br from-[#808A93] to-[#95A1AC] " +
  "disabled:opacity-60 disabled:cursor-not-allowed";
const VendorAuth = () => {
   const navigate = useNavigate();
  const [step, setStep] = useState("IDENTIFIER"); 
  const [identifier, setIdentifier] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [channel, setChannel] = useState(null); 
  const isEmail = (value) => /\S+@\S+\.\S+/.test(value);
  const isPhone = (value) => /^\+?\d{10,15}$/.test(value);

  const handleIdentifierChange = (e) => {
    const raw = e.target.value;
    if (raw.includes("@")) {
      setIdentifier(raw);
      return;
    }
    const digits = raw.replace(/\D/g, "");
    if (!digits) {
      setIdentifier("");
      return;
    }
    let formatted;
    if (digits.startsWith("971")) {
      formatted = "+" + digits.slice(0, 12); 
    } else {
      const local = digits.slice(0, 9);
      formatted = "+971" + local;
    }
    setIdentifier(formatted);
  };
  const handleContinue = async (e) => {
    e.preventDefault();
    setError("");

    const raw = identifier.trim();
    if (!raw) {
      setError("Please enter your mobile number or email.");
      return;
    }

    let mode = null;
    if (isEmail(raw)) {
      mode = "EMAIL";
    } else if (isPhone(raw)) {
      mode = "WHATSAPP";
    } else {
      setError("Please enter a valid email or mobile number.");
      return;
    }

    setChannel(mode);
    setStep("OTP");
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError("");

    if (!otp.trim()) {
      setError("Please enter the OTP.");
      return;
    }
    if (otp.length < 4) {
      setError("OTP should be at least 4 digits.");
      return;
    }
     navigate("/upload-document");
  };
  const handleBackToIdentifier = () => {
    setStep("IDENTIFIER");
    setOtp("");
    setError("");
    setChannel(null);
  };
  const channelLabel = channel === "EMAIL" ? "Email" : "WhatsApp";

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-linear-to-br from-slate-50 via-slate-100 to-slate-200">
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
                {identifier}
              </span>
            </p>
          )}
          {step === "IDENTIFIER" && (
            <form onSubmit={handleContinue} className="mt-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-800 mb-1.5">
                  Enter mobile number or email
                </label>
                <input
                  type="text"
                  value={identifier}
                  onChange={handleIdentifierChange}
                  className="w-full rounded-lg border border-slate-300 bg-slate-50/70 px-3.5 py-2.5 text-sm text-gray-700 placeholder:text-slate-400  focus:outline-none focus:ring-2 focus:ring-slate-400
                             focus:border-slate-400 transition" placeholder="Enter mobile number or email"/>
                 </div>
              {error && (
                <p className="text-xs text-red-600 bg-red-50 border border-red-100 rounded-md px-3 py-2">
                  {error}
                </p>
              )}
              <button type="submit" disabled={!identifier.trim()} className={baseButtonClasses}>Continue </button>
              <p className="text-slate-600 text-xs font-medium mt-4 leading-relaxed">
                By continuing, you agree to Vendor&apos;s{" "}
                <button type="button" className="text-sky-600 text-xs font-bold hover:text-sky-700 hover:underline" >
                  Conditions of Use
                </button>{" "}
                and{" "}
                <button type="button" className="text-sky-600 text-xs font-bold hover:text-sky-700 hover:underline">Privacy Notice</button>.
              </p>
            </form>
          )}
          {step === "OTP" && (
            <form onSubmit={handleVerifyOtp} className="mt-4 space-y-4">
              <div className="flex items-center justify-between mb-1">
                <span className="text-base text-slate-600">
                  OTP sent via {channelLabel}
                </span>
                <button type="button" onClick={handleBackToIdentifier} className="text-xs text-sky-600 hover:text-sky-700 hover:underline" >
                  Change mobile/email
                </button>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-800 mb-1.5">
                  Enter OTP
                </label>
                <input type="text" value={otp} onChange={(e) => setOtp(e.target.value)} maxLength={6}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm text-slate-900 tracking-[0.4em] text-center
                         placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-slate-400 transition" placeholder="••••••"/>
              </div>
              {error && (
                <p className="text-xs text-red-600 bg-red-50 border border-red-100 rounded-md px-3 py-2">
                  {error}
                </p>
              )}

              <button type="submit" disabled={!otp.trim()} className={baseButtonClasses}> Verify OTP</button>
              <button type="button" onClick={() => alert("Resend OTP (demo)")} className="w-full mt-2 bg-white hover:bg-slate-50
                           text-xs font-medium py-2.5 rounded-lg border border-slate-300 transition">
                Resend OTP
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default VendorAuth;
