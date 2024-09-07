import { configureStore } from "@reduxjs/toolkit";
import {
  authApiReducer,
  authApiMiddleware,
  authApiReducerPath,
} from "./slices/api/auth.slices.api";
import {
  productApiReducer,
  productApiMiddleware,
  productApiReducerPath,
} from "./slices/api/product.slices.api";
import {
  articleApiReducer,
  articleApiMiddleware,
  articleApiReducerPath,
} from "./slices/api/article.slices.api";
import {
  cartApiReducer,
  cartApiMiddleware,
  cartApiReducerPath,
} from "./slices/api/cart.slices.api";
import {
  userApiReducer,
  userApiMiddleware,
  userApiReducerPath,
} from "./slices/api/user.slices.api";
import {
  doctorApiReducer,
  doctorApiMiddleware,
  doctorApiReducerPath,
} from "./slices/api/doctor.slices.api";
import doctorReducer from "./slices/docotor.slices";
import bookAppointmentReducer from "./slices/book-appointment.slices";
import {
  uploadApiReducer,
  uploadApiReducerPath,
  uploadApiMiddleware,
} from "./slices/api/upload.slices.api";
import {
  bookAppointmentApiReducer,
  bookAppointmentApiReducerPath,
  bookAppointmentApiMiddleware,
} from "./slices/api/book-appointment.slices.api";
export const store = configureStore({
  reducer: {
    bookAppointment: bookAppointmentReducer,
    doctor: doctorReducer,
    [authApiReducerPath]: authApiReducer,
    [doctorApiReducerPath]: doctorApiReducer,
    [uploadApiReducerPath]: uploadApiReducer,
    [bookAppointmentApiReducerPath]: bookAppointmentApiReducer,
    [productApiReducerPath]: productApiReducer,
    [articleApiReducerPath]: articleApiReducer,
    [cartApiReducerPath]: cartApiReducer,
    [userApiReducerPath]: userApiReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(authApiMiddleware)
      .concat(doctorApiMiddleware)
      .concat(uploadApiMiddleware)
      .concat(bookAppointmentApiMiddleware)
      .concat(productApiMiddleware)
      .concat(cartApiMiddleware)
      .concat(articleApiMiddleware)
      .concat(userApiMiddleware),
});
