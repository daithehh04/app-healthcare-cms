import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { SERVER_URL } from "@/configs/site.config";
import { endPointApi } from "@/helpers/endPointApi";
const { BOOK_APPOINTMENT } = endPointApi;

export const bookAppointmentApiSlice = createApi({
     reducerPath: 'bookAppointmentApi',
     baseQuery: fetchBaseQuery({ baseUrl: SERVER_URL }),
     tagTypes: ['bookAppointmentApi'],
     endpoints: (builder) => ({
          getBookAppointments: builder.query({
               query: ({ page, limit, ...fields }) => {
                    const params = new URLSearchParams({
                         page: String(page || 1),
                         limit: String(limit || 10),
                         ...Object.fromEntries(
                              Object.entries(fields).map(([key, value]) => [key, String(value)])
                         ),
                    }).toString();
                    return `${BOOK_APPOINTMENT}?${params}`;

               }
               ,
               providesTags(result) {
                    if (result && result.data && result.data.items) {
                         const final = [
                              ...result.data.items.map(({ id }) => ({
                                   type: 'bookAppointmentApi',
                                   id,
                              })),
                              { type: 'bookAppointmentApi', id: 'LIST' },
                         ];
                         return final;
                    }
                    return [{ type: 'bookAppointmentApi', id: 'LIST' }];
               },
          }),
          addBookAppointment: builder.mutation({
               query: (body) => {
                    return {
                         url: BOOK_APPOINTMENT,
                         method: 'POST',
                         headers: {
                              'Content-Type': 'application/json',
                         },
                         body,
                    };
               },
               invalidatesTags: (result, error, body) =>
                    error ? [] : [{ type: 'bookAppointmentApi', id: 'LIST' }],
          }),
          updatedBookAppointments: builder.mutation({
               query: ({ id, body }) => {
                    return {
                         url: `${BOOK_APPOINTMENT}/${id}`,
                         method: 'PATCH',
                         headers: {
                              'Content-Type': 'application/json',
                         },
                         body,
                    };
               },
               invalidatesTags: (result, error, body) =>
                    error ? [] : [{ type: 'bookAppointmentApi', id: 'LIST' }],
          }),
          deleteBookAppointment: builder.mutation({
               query: ({ id }) => {
                    return {
                         url: `${BOOK_APPOINTMENT}/${id}`,
                         method: 'DELETE',
                    };
               },
               invalidatesTags: (result, error, body) =>
                    error ? [] : [{ type: 'bookAppointmentApi', id: 'LIST' }],
          }),
     })

});
export const bookAppointmentApiReducer = bookAppointmentApiSlice.reducer;
export const bookAppointmentApiReducerPath = bookAppointmentApiSlice.reducerPath;
export const bookAppointmentApiMiddleware = bookAppointmentApiSlice.middleware;
export const {
     useAddBookAppointmentMutation,
     useGetBookAppointmentsQuery,
     useUpdatedBookAppointmentsMutation,
     useDeleteBookAppointmentMutation,
} = bookAppointmentApiSlice;