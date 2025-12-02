import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  CloudUploadIcon,
  DocumentIcon,
  CheckCircleIcon,
  ExclamationIcon,
  TrashIcon,
  InformationCircleIcon,
} from "@heroicons/react/outline";

const ProfessionalDocumentUpload = () => {
  const navigate = useNavigate();

  const [documents, setDocuments] = useState({
    tradeLicense: { file: null, status: "pending", name: "" },
    emiratesId: { file: null, status: "pending", name: "" },
    ejari: { file: null, status: "pending", name: "" },
    vatCertificate: { file: null, status: "pending", name: "" },
    corporateTaxCertificate: { file: null, status: "pending", name: "" },
    bankDetails: { file: null, status: "pending", name: "" },
    logo: { file: null, status: "pending", name: "" },
  });

  const [companyInfo, setCompanyInfo] = useState({
    companyName: "",
    tradeName: "",
    licenseNumber: "",
    establishmentDate: "",
  });

  const [activeCategory, setActiveCategory] = useState("all");

  const documentConfig = {
    tradeLicense: {
      title: "Trade License",
      description: "Valid trade license document",
      category: "legal",
      required: true,
      icon: "📄",
    },
    emiratesId: {
      title: "Emirates ID",
      description: "Front and back copy",
      category: "identification",
      required: true,
      icon: "🆔",
    },
    ejari: {
      title: "Ejari Certificate",
      description: "Tenancy contract registration",
      category: "legal",
      required: false,
      icon: "🏠",
    },
    vatCertificate: {
      title: "VAT Certificate",
      description: "VAT registration certificate",
      category: "tax",
      required: false,
      icon: "💰",
    },
    corporateTaxCertificate: {
      title: "Corporate Tax Certificate",
      description: "Tax registration document",
      category: "tax",
      required: false,
      icon: "🏢",
    },
    bankDetails: {
      title: "Bank Details",
      description: "Bank account information",
      category: "financial",
      required: true,
      icon: "🏦",
    },
    logo: {
      title: "Company Logo",
      description: "High-quality logo file",
      category: "branding",
      required: false,
      icon: "🎨",
    },
  };

  const categories = [
    { id: "all", name: "All Documents" },
    { id: "legal", name: "Legal" },
    { id: "tax", name: "Tax" },
    { id: "financial", name: "Financial" },
    { id: "identification", name: "ID" },
    { id: "branding", name: "Branding" },
  ].map((cat) => ({
    ...cat,
    count:
      cat.id === "all"
        ? Object.keys(documents).length
        : Object.keys(documents).filter(
            (key) => documentConfig[key].category === cat.id
          ).length,
  }));

  const filteredDocuments = Object.entries(documentConfig).filter(
    ([, config]) => activeCategory === "all" || config.category === activeCategory
  );

  const uploadedCount = Object.values(documents).filter(
    (doc) => doc.status === "uploaded"
  ).length;
  const totalCount = Object.keys(documents).length;
  const progressPercent = Math.round((uploadedCount / totalCount) * 100);

  const handleFileUpload = (documentType, file) => {
    if (!file) return;
    setDocuments((prev) => ({
      ...prev,
      [documentType]: {
        file,
        status: "uploaded",
        name: file.name,
      },
    }));
  };

  const handleRemoveFile = (documentType) => {
    setDocuments((prev) => ({
      ...prev,
      [documentType]: { file: null, status: "pending", name: "" },
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate("/Info");
  };

  const getStatusIcon = (status) => {
    if (status === "uploaded") {
      return <CheckCircleIcon className="w-4 h-4 text-[#646D74]" />; // 800
    }
    if (status === "error") {
      return <ExclamationIcon className="w-4 h-4 text-[#3B3F44]" />; // 900
    }
    return <DocumentIcon className="w-4 h-4 text-[#BDC4CB]" />; // 400
  };

  const getStatusLabel = (status) => {
    if (status === "uploaded") return "Uploaded";
    if (status === "error") return "Error";
    return "Pending";
  };

  const requiredMissing = Object.entries(documentConfig)
    .filter(([, cfg]) => cfg.required)
    .map(([k]) => k)
    .filter((k) => !(docs?.[k] instanceof File));

  return (
    <div className="min-h-screen bg-[#FAFBFB] py-10 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Top header */}
        <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            
            <h1 className="text-3xl font-semibold text-[#3B3F44]">
              Business Document Upload
            </h1>
            
          </div>

          <div className="rounded-xl border border-[#CED3D8] bg-[#F8F9FA] px-4 py-3 text-right">
            <p className="text-xs font-medium text-[#646D74] mb-1">
              Overall Progress
            </p>
            <div className="flex items-center gap-2">
              <div className="w-32 h-2 rounded-full bg-[#CED3D8] overflow-hidden">
                <div
                  className="h-2 rounded-full bg-[#808A93] transition-all duration-300"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <span className="text-xs font-semibold text-[#3B3F44]">
                {progressPercent}%
              </span>
            </div>
          </div>
        </header>

        <div className="bg-[#FAFBFB] border border-[#CED3D8] rounded-2xl shadow-lg">
          {/* Company Information */}
          <section className="border-b border-[#DDE1E4] px-6 py-5 sm:px-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-[#3B3F44]">
                Company Information
              </h2>
              
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-[#646D74] mb-1">
                  Company Name <span className="text-[#3B3F44]">*</span>
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 rounded-lg bg-[#FAFBFB] border border-[#CED3D8] text-sm text-[#3B3F44] placeholder-[#AAB4BC] focus:outline-none focus:border-[#808A93]"
                  placeholder="Enter company legal name"
                  value={companyInfo.companyName}
                  onChange={(e) =>
                    setCompanyInfo((prev) => ({
                      ...prev,
                      companyName: e.target.value,
                    }))
                  }
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-[#646D74] mb-1">
                  Trade Name <span className="text-[#3B3F44]">*</span>
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 rounded-lg bg-[#FAFBFB] border border-[#95A1AC] text-sm text-[#3B3F44] placeholder-[#AAB4BC] focus:outline-none focus:border-[#808A93]"
                  placeholder="Enter trading name"
                  value={companyInfo.tradeName}
                  onChange={(e) =>
                    setCompanyInfo((prev) => ({
                      ...prev,
                      tradeName: e.target.value,
                    }))
                  }
                />
              </div>
            </div>
          </section>

          {/* Documents Section */}
          <section className="px-6 py-6 sm:px-8 sm:py-8">
            <div className="flex flex-col lg:flex-row gap-6">
              {/* Sidebar */}
              <aside className="lg:w-64 shrink-0 space-y-4">
                <div className="bg-[#F8F9FA] border border-[#CED3D8] rounded-xl p-4">
                  <h3 className="text-sm font-medium text-[#3B3F44] mb-3">
                    Categories
                  </h3>
                  <div className="space-y-1">
                    {categories.map((category) => (
                      <button
                        key={category.id}
                        onClick={() => setActiveCategory(category.id)}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold sm:text-sm transition ${
                          activeCategory === category.id
                            ? "bg-[#DDE1E4] text-[#3B3F44] border font-bold border-[#BDC4CB]"
                            : "text-[#808A93] hover:bg-[#EBEDEF] border border-transparent"
                        }`}
                      >
                        <span>{category.name}</span>
                        <span
                          className={`px-2 py-0.5 rounded-full text-[11px] ${
                            activeCategory === category.id
                              ? "bg-[#CED3D8] text-[#3B3F44]"
                              : "bg-[#EBEDEF] text-[#646D74]"
                          }`}
                        >
                          {category.count}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Small hint box */}
                <div className="bg-[#F8F9FA] border border-[#CED3D8] rounded-xl p-4 text-[11px] font-medium text-[#3B3F44] space-y-1">
                  <p className="font-semibold text-[#3B3F44] mb-1">Tips</p>
                  <p>• Upload clear scans or photos of documents.</p>
                  <p>• Make sure expiry dates are valid.</p>
                  <p>• Company logo should be high–resolution.</p>
                </div>
              </aside>

              {/* Documents Grid */}
              <main className="flex-1">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredDocuments.map(([key, config]) => {
                    const doc = documents[key];
                    const hasFile = !!doc.file;
                    const statusLabel = getStatusLabel(doc.status);

                    return (
                      <div
                        key={key}
                        className="border border-[#CED3D8] bg-[#F8F9FA] rounded-xl p-4 hover:border-[#808A93] transition"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-start gap-2">
                            <span className="text-xl">{config.icon}</span>
                            <div>
                              <h3 className="text-sm font-medium text-[#3B3F44]">
                                {config.title}
                                {config.required && (
                                  <span className="text-[#3B3F44] ml-1">*</span>
                                )}
                              </h3>
                              <p className="text-[11px] text-[#646D74] mt-0.5">
                                {config.description}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="rounded-full bg-[#EBEDEF] px-2 py-0.5 text-[10px] font-medium text-[#646D74]">
                              {statusLabel}
                            </span>
                            {getStatusIcon(doc.status)}
                          </div>
                        </div>

                        {hasFile ? (
                          <div className="flex items-center justify-between bg-[#EBEDEF] border border-[#CED3D8] rounded-lg px-3 py-2">
                            <div className="flex items-center gap-2 min-w-0">
                              <DocumentIcon className="w-4 h-4 text-[#646D74] shrink-0" />
                              <span className="text-xs font-medium text-[#3B3F44] truncate">
                                {doc.name}
                              </span>
                            </div>
                            <button
                              type="button"
                              onClick={() => handleRemoveFile(key)}
                              className="ml-2 text-[#808A93] hover:text-[#3B3F44]"
                            >
                              <TrashIcon className="w-4 h-4" />
                            </button>
                          </div>
                        ) : (
                          <label className="block cursor-pointer">
                            <div className="border-2 border-dashed border-[#BDC4CB] rounded-lg px-3 py-4 text-center hover:border-[#808A93] hover:bg-[#EBEDEF] transition">
                              <CloudUploadIcon className="w-6 h-6 mx-auto mb-2 text-[#95A1AC]" />
                              <p className="text-xs font-medium text-[#3B3F44]">
                                Upload File
                              </p>
                              <p className="mt-1 text-[11px] font-semibold text-[#3B3F44]">
                                PDF, JPG, PNG up to 10MB
                              </p>
                              <input
                                type="file"
                                className="hidden"
                                accept=".pdf,.jpg,.jpeg,.png"
                                onChange={(e) =>
                                  handleFileUpload(key, e.target.files[0])
                                }
                              />
                            </div>
                          </label>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Submit Section */}
                <div className="mt-6 pt-5 border-t border-[#DDE1E4]">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-2 font-medium text-xs text-[#808A93]">
                      <InformationCircleIcon className="w-4 h-4 text-[#95A1AC]" />
                      <span>
                        All required documents must be uploaded before submission.
                      </span>
                    </div>
                    <button
                      type="submit"
                      onClick={handleSubmit}
                      disabled={
                        !Object.entries(documents).every(([key, doc]) =>
                          documentConfig[key].required
                            ? doc.status === "uploaded"
                            : true
                        )
                      }
                      className="inline-flex items-center justify-center px-6 py-2 rounded-lg text-sm font-medium
                                 bg-[#95A1AC] text-[#FAFBFB] hover:bg-[#808A93]
                                 disabled:bg-[#CED3D8] disabled:text-[#808A93] disabled:cursor-not-allowed"
                    >
                      Submit Documents
                    </button>
                  </div>
                </div>
              </main>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default ProfessionalDocumentUpload;
