import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { SERVER_URL } from "@/configs/site.config";
import { endPointApi } from "@/helpers/endPointApi";
const { BRANCH, BRANCHES } = endPointApi;

export const BranchSliceApi = createApi({
  reducerPath: "branchApi",
  baseQuery: fetchBaseQuery({ baseUrl: SERVER_URL }),
  tagTypes: ["branch"],
  endpoints: (builder) => ({
    getAllBranches: builder.query({
      query: ({ page = 1, limit = 10 }) => ({
        url: BRANCHES,
        method: "GET",
        params: { page, limit },
      }),
      providesTags: (result, error, id) => [{ type: "branch", id: "LIST" }],
    }),
    createBranch: builder.mutation({
      query: (body) => ({
        url: `${BRANCH}`,
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "branch", id: "LIST" }],
    }),
    updateBranch: builder.mutation({
      query: ({ id, ...patch }) => ({
        url: `${BRANCH}/${id}`,
        method: "PATCH",
        body: patch,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "branch", id: "LIST" },
      ],
    }),
    deleteBranch: builder.mutation({
      query: (id) => ({
        url: `${BRANCH}/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [
        { type: "branch", id },
        { type: "branch", id: "LIST" },
      ],
    }),
  }),
});
export const branchApiReducer = BranchSliceApi.reducer;
export const branchApiReducerPath = BranchSliceApi.reducerPath;
export const branchApiMiddleware = BranchSliceApi.middleware;
export const {
  useGetAllBranchesQuery,
  useCreateBranchMutation,
  useDeleteBranchMutation,
  useUpdateBranchMutation,
} = BranchSliceApi;
