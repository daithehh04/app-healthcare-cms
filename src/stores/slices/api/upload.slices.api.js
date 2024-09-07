import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { SERVER_URL } from "@/configs/site.config";
import { endPointApi } from "@/helpers/endPointApi";
const { UPLOAD_IMAGE } = endPointApi;
export const uploadApiSlice = createApi({
     reducerPath: 'upload',
     baseQuery: fetchBaseQuery({ baseUrl: SERVER_URL }),
     endpoints: (builder) => ({
          uploadImage: builder.mutation({
               query: (formData) => ({
                    url: UPLOAD_IMAGE,
                    method: 'POST',
                    body: formData,
               }),
          }),
     }),
});
export const uploadApiReducer = uploadApiSlice.reducer;
export const uploadApiReducerPath = uploadApiSlice.reducerPath;
export const uploadApiMiddleware = uploadApiSlice.middleware;
export const {
     useUploadImageMutation
} = uploadApiSlice;