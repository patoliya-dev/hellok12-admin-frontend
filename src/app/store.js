import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../reducers/auth/authSlice";

import schoolReducer from "../reducers/superAdmin/superAdminSlice";
import invitationReducer from "../reducers/invitations/invitationsSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    school: schoolReducer,
    invitations: invitationReducer,
  },
});

export default store;
