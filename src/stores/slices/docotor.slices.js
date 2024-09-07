import { createSlice } from "@reduxjs/toolkit";
import { doctorSliceApi } from "./api/doctor.slices.api";

const initialDoctorState = {
     doctors: [],
     isLoading: false,

};

export const doctorSlices = createSlice({
     name: 'doctor',
     initialState: initialDoctorState,
     reducers: {
          setDoctors: (state, action) => {
               state.doctors = action.payload;
          }
     },
     extraReducers: (builder) => {
          builder
               .addMatcher(doctorSliceApi.endpoints.getDoctors.matchPending, (state) => {
                    state.isLoading = true;
               })
               .addMatcher(
                    doctorSliceApi.endpoints.getDoctors.matchFulfilled,
                    (state, { payload }) => {
                         state.doctors = payload.data.doctors.map((doctor, index) => ({
                              index: index + 1,
                              ...doctor
                         }));
                         state.isLoading = false;
                    }
               )
               .addMatcher(
                    doctorSliceApi.endpoints.getDoctors.matchRejected,
                    (state, { error }) => {
                         state.error = error;
                         state.isLoading = false;
                    }
               );

     },
});

export const { setDoctors } = doctorSlices.actions;
export const doctorState = (state) => state.doctor;
export default doctorSlices.reducer;