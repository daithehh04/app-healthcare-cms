import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { SERVER_URL } from "@/configs/site.config";
import { endPointApi } from "@/helpers/endPointApi";
const { DOCTOR } = endPointApi;

export const doctorSliceApi = createApi({
     reducerPath: 'doctorApi',
     baseQuery: fetchBaseQuery({ baseUrl: SERVER_URL }),
     tagTypes: ['DoctorApi'],
     endpoints: (builder) => ({
          getDoctors: builder.query({
               query: ({ page, limit, ...fields }) => {
                    const params = new URLSearchParams({
                         page: String(page || 1),
                         limit: String(limit || 10),
                         ...Object.fromEntries(
                              Object.entries(fields).map(([key, value]) => [key, String(value)])
                         ),
                    }).toString();
                    return `${DOCTOR}?${params}`;

               }
               ,
               providesTags(result) {
                    if (result && result.data && result.data.items) {
                         const final = [
                              ...result.data.items.map(({ id }) => ({
                                   type: 'DoctorApi',
                                   id,
                              })),
                              { type: 'DoctorApi', id: 'LIST' },
                         ];
                         return final;
                    }
                    return [{ type: 'DoctorApi', id: 'LIST' }];
               },
          }),
          addDoctor: builder.mutation({
               query: (body) => {
                    return {
                         url: DOCTOR,
                         method: 'POST',
                         headers: {
                              'Content-Type': 'application/json',
                         },
                         body,
                    };
               },
               invalidatesTags: (result, error, body) =>
                    error ? [] : [{ type: 'DoctorApi', id: 'LIST' }],
          }),
          updatedDoctor: builder.mutation({
               query: ({ id, body }) => {
                    return {
                         url: `${DOCTOR}/${id}`,
                         method: 'PUT',
                         headers: {
                              'Content-Type': 'application/json',
                         },
                         body,
                    };
               },
               invalidatesTags: (result, error, body) =>
                    error ? [] : [{ type: 'DoctorApi', id: 'LIST' }],
          }),
          deleteDoctor: builder.mutation({
               query: ({ id }) => {
                    return {
                         url: `${DOCTOR}/${id}`,
                         method: 'DELETE',
                    };
               },
               invalidatesTags: (result, error, body) =>
                    error ? [] : [{ type: 'DoctorApi', id: 'LIST' }],
          }),
     })

});
export const doctorApiReducer = doctorSliceApi.reducer;
export const doctorApiReducerPath = doctorSliceApi.reducerPath;
export const doctorApiMiddleware = doctorSliceApi.middleware;
export const {
     useGetDoctorsQuery,
     useAddDoctorMutation,
     useUpdatedDoctorMutation,
     useDeleteDoctorMutation
} = doctorSliceApi;