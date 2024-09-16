import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { SERVER_URL } from "@/configs/site.config";
import { endPointApi } from "@/helpers/endPointApi";
const { CATEGORY_MEDICINE } = endPointApi;

export const CateGoryMedicineSliceApi = createApi({
  reducerPath: "categoryMedicineApi",
  baseQuery: fetchBaseQuery({ baseUrl: SERVER_URL }),
  tagTypes: ["categoryMedicine"],
  endpoints: (builder) => ({
    getAllCategoryMedicine: builder.query({
      query: ({ page = 1, limit = 10 }) => ({
        url: CATEGORY_MEDICINE,
        method: "GET",
        params: { page, limit },
      }),
      providesTags: (result, error, id) => [
        { type: "categoryMedicine", id: "LIST" },
      ],
    }),
    createCategoryMedicine: builder.mutation({
      query: (body) => ({
        url: `${CATEGORY_MEDICINE}`,
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "categoryMedicine", id: "LIST" }],
    }),
    updateCategoryMedicine: builder.mutation({
      query: ({ id, ...patch }) => ({
        url: `${CATEGORY_MEDICINE}/${id}`,
        method: "PATCH",
        body: patch,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "categoryMedicine", id: "LIST" },
      ],
    }),
    deleteCategoryMedicine: builder.mutation({
      query: (id) => ({
        url: `${CATEGORY_MEDICINE}/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [
        { type: "categoryMedicine", id },
        { type: "categoryMedicine", id: "LIST" },
      ],
    }),
  }),
});
export const categoryMedicineApiReducer = CateGoryMedicineSliceApi.reducer;
export const categoryMedicineApiReducerPath =
  CateGoryMedicineSliceApi.reducerPath;
export const categoryMedicineApiMiddleware =
  CateGoryMedicineSliceApi.middleware;
export const {
  useGetAllCategoryMedicineQuery,
  useCreateCategoryMedicineMutation,
  useDeleteCategoryMedicineMutation,
  useUpdateCategoryMedicineMutation,
} = CateGoryMedicineSliceApi;
