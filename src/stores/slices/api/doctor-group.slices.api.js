import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { SERVER_URL } from "@/configs/site.config";
import { endPointApi } from "@/helpers/endPointApi";
const { DOCTOR_GROUP } = endPointApi;

export const doctorGroupSliceApi = createApi({
  reducerPath: "doctorGroupApi",
  baseQuery: fetchBaseQuery({ baseUrl: SERVER_URL }),
  tagTypes: ["doctorGroup"],
  endpoints: (builder) => ({
    getAllDoctorGroup: builder.query({
      query: ({ page = 1, limit = 10 }) => ({
        url: DOCTOR_GROUP,
        method: "GET",
        params: { page, limit },
      }),
      providesTags: (result, error, id) => [
        { type: "doctorGroup", id: "LIST" },
      ],
    }),
    createDoctorGroup: builder.mutation({
      query: (body) => ({
        url: `${DOCTOR_GROUP}`,
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "doctorGroup", id: "LIST" }],
    }),
    updateDoctorGroup: builder.mutation({
      query: ({ id, ...patch }) => ({
        url: `${DOCTOR_GROUP}/${id}`,
        method: "PATCH",
        body: patch,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "doctorGroup", id: "LIST" },
      ],
    }),
    deleteDoctorGroup: builder.mutation({
      query: (id) => ({
        url: `${DOCTOR_GROUP}/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [
        { type: "doctorGroup", id },
        { type: "doctorGroup", id: "LIST" },
      ],
    }),
  }),
});
export const doctorGroupApiReducer = doctorGroupSliceApi.reducer;
export const doctorGroupApiReducerPath = doctorGroupSliceApi.reducerPath;
export const doctorGroupApiMiddleware = doctorGroupSliceApi.middleware;
export const {
  useGetAllDoctorGroupQuery,
  useCreateDoctorGroupMutation,
  useDeleteDoctorGroupMutation,
  useUpdateDoctorGroupMutation,
} = doctorGroupSliceApi;
