import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../reducers/auth/authSlice";

import superAdminReducer from "../reducers/superAdmin/superAdminSlice";
import invitationReducer from "../reducers/invitations/invitationsSlice";
import lessonsReducer from "../reducers/lessons/lessonsSlice";
import courseReducers from "../reducers/courses/courseSlice";
import pageLoaderReducer from "../reducers/ui/pageLoaderSlice";
import scheduleReducer from "../reducers/schedule/scheduleSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    superAdmin: superAdminReducer,
    invitations: invitationReducer,
    lessons: lessonsReducer,
    courseList: courseReducers.courseList,
    courseDetail: courseReducers.courseDetail,
    pageLoader: pageLoaderReducer,
    schedule: scheduleReducer,
  },
});

export default store;
