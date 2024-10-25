import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { SERVER_URL } from "@/configs/site.config";
import { endPointApi } from "@/helpers/endPointApi";
const { VOUCHER } = endPointApi;

export const voucherSliceApi = createApi({
  reducerPath: "voucherApi",
  baseQuery: fetchBaseQuery({ baseUrl: SERVER_URL }),
  tagTypes: ["Vouchers"],
  endpoints: (builder) => ({
    getVoucherByCode: builder.mutation({
      query: (body) => ({
        url: `/getVoucherByCode`,
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Vouchers", id: "VOUCHER_CODE" }],
    }),
    getAllVouchers: builder.query({
      query: ({ page = 1, limit = 10 }) => ({
        url: `${VOUCHER}/all`,
        method: "GET",
        params: { page, limit },
      }),
      providesTags: (result, error, id) => [{ type: "Vouchers", id: "LIST" }],
    }),
    getVoucherDetail: builder.query({
      query: (id) => ({
        url: `${VOUCHER}/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "Vouchers", id }],
    }),
    updateVoucher: builder.mutation({
      query: ({ id, ...patch }) => ({
        url: `${VOUCHER}/${id}`,
        method: "PATCH",
        body: patch,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Vouchers", id: "LIST" },
      ],
    }),
    createVoucher: builder.mutation({
      query: (body) => ({
        url: `${VOUCHER}`,
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Vouchers", id: "LIST" }],
    }),
    deleteVoucher: builder.mutation({
      query: (id) => ({
        url: `${VOUCHER}/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [
        { type: "Vouchers", id },
        { type: "Vouchers", id: "LIST" },
      ],
    }),
  }),
});
export const voucherApiReducer = voucherSliceApi.reducer;
export const voucherApiReducerPath = voucherSliceApi.reducerPath;
export const voucherApiMiddleware = voucherSliceApi.middleware;
export const {
  useGetAllVouchersQuery,
  useCreateVoucherMutation,
  useUpdateVoucherMutation,
  useDeleteVoucherMutation,
  useGetVoucherByCodeMutation,
} = voucherSliceApi;
