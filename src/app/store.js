import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../reducers/auth/authSlice";

import superAdminReducer from "../reducers/superAdmin/superAdminSlice";
import invitationReducer from "../reducers/invitations/invitationsSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    superAdmin: superAdminReducer,
    invitations: invitationReducer,
  },
});

export default store;
