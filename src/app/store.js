import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../reducers/auth/authSlice";

import schoolReducer from "../reducers/school/schoolSlice";
import invitationReducer from "../reducers/invitations/invitationSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    school: schoolReducer,
    invitations: invitationReducer,
  },
});

export default store;
