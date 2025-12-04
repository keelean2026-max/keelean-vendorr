import { baseApi } from "./baseApi";

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // -----------------------------------
    // 1) Request OTP
    // -----------------------------------
    requestOtp: builder.mutation({
      query: ({ phone }) => ({
        url: "/vendor/request-otp/",
        method: "POST",
        body: { phone },
      }),
    }),

    // -----------------------------------
    // 2) Verify OTP → JWT
    // -----------------------------------
    verifyOtp: builder.mutation({
      query: ({ phone, otp }) => ({
        url: "/vendor/verify-otp/",
        method: "POST",
        body: { phone, otp },
      }),
    }),

    // -----------------------------------
    // 3) Upload Vendor Profile (Multipart)
    // -----------------------------------
    uploadVendorProfile: builder.mutation({
      query: (formData) => ({
        url: "/vendor/upload-profile/",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["VendorProfile"],
    }),

    // -----------------------------------
    // 4) Get Vendor Profile
    // -----------------------------------
    getVendorProfile: builder.query({
      query: (vendorId) => ({
        url: "/vendor/get-vendor-profile/",
        params: { vendor_id: vendorId },
      }),
      providesTags: ["VendorProfile"],
    }),
  }),
});

export const {
  useRequestOtpMutation,
  useVerifyOtpMutation,
  useUploadVendorProfileMutation,
  useGetVendorProfileQuery,
} = authApi;
