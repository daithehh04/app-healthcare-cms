import { createSlice } from "@reduxjs/toolkit";
import { bookAppointmentApiSlice } from "./api/book-appointment.slices.api";

const initialBookAppointmentState = {
     bookAppointments: [],
     isLoading: false,

};

export const bookAppointmentSlices = createSlice({
     name: 'bookAppointment',
     initialState: initialBookAppointmentState,
     reducers: {
          setBookAppointments: (state, action) => {
               state.bookAppointments = action.payload;
          }
     },
     extraReducers: (builder) => {
          builder
               .addMatcher(bookAppointmentApiSlice.endpoints.getBookAppointments.matchPending, (state) => {
                    state.isLoading = true;
               })
               .addMatcher(
                    bookAppointmentApiSlice.endpoints.getBookAppointments.matchFulfilled,
                    (state, { payload }) => {
                         state.bookAppointments = payload.data.appointments.map((appointment, index) => ({
                              index: index + 1,
                              ...appointment
                         }));
                         state.isLoading = false;
                    }
               )
               .addMatcher(
                    bookAppointmentApiSlice.endpoints.getBookAppointments.matchRejected,
                    (state, { error }) => {
                         state.error = error;
                         state.isLoading = false;
                    }
               );

     },
});

export const { setBookAppointments } = bookAppointmentSlices.actions;
export const bookAppointmentStates = (state) => state.bookAppointment;
export default bookAppointmentSlices.reducer;