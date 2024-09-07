import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { SERVER_URL } from "@/configs/site.config";
import { endPointApi } from "@/helpers/endPointApi";
const { ARTICLE } = endPointApi;

export const articleSliceApi = createApi({
  reducerPath: "articleApi",
  baseQuery: fetchBaseQuery({ baseUrl: SERVER_URL }),
  tagTypes: ["Articles"],
  endpoints: (builder) => ({
    getAllArticles: builder.query({
      query: ({ page = 1, limit = 10 }) => ({
        url: ARTICLE,
        method: "GET",
        params: { page, limit },
      }),
      providesTags: (result, error, id) => [{ type: "Articles", id: "LIST" }],
    }),
    getArticleDetail: builder.query({
      query: (id) => ({
        url: `${ARTICLE}/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "Articles", id }],
    }),
    updateArticle: builder.mutation({
      query: ({ id, ...patch }) => ({
        url: `${ARTICLE}/${id}`,
        method: "PATCH",
        body: patch,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Articles", id: "LIST" },
      ],
    }),
    createArticle: builder.mutation({
      query: (body) => ({
        url: `${ARTICLE}`,
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Articles", id: "LIST" }],
    }),
    deleteArticle: builder.mutation({
      query: (id) => ({
        url: `${ARTICLE}/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [
        { type: "Articles", id },
        { type: "Articles", id: "LIST" },
      ],
    }),
  }),
});
export const articleApiReducer = articleSliceApi.reducer;
export const articleApiReducerPath = articleSliceApi.reducerPath;
export const articleApiMiddleware = articleSliceApi.middleware;
export const {
  useGetAllArticlesQuery,
  useGetArticleDetailQuery,
  useCreateArticleMutation,
  useUpdateArticleMutation,
  useDeleteArticleMutation,
} = articleSliceApi;
