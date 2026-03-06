import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { selectAuthUser } from "reducers/auth/authSelectors";
import { selectStudent } from "reducers/profile/profileSlice";
import { fetchCurrentUser } from "reducers/auth/authThunks";

/**
 * Custom hook to automatically select the first child for parent users
 */
const useAutoSelectChild = () => {
  const dispatch = useDispatch();
  const authUser = useSelector(selectAuthUser);
  const selectedChildId = useSelector((state) => state.profile.selectedChildId);

  useEffect(() => {
    const initializeChildSelection = async () => {
      if (
        authUser?.role === "parent" &&
        (!authUser?.profile?.children || authUser.profile.children.length === 0)
      ) {
        await dispatch(fetchCurrentUser());
        return;
      }

      if (
        authUser?.role === "parent" &&
        authUser?.profile?.children?.length > 0 &&
        !selectedChildId
      ) {
        const firstChildId =
          authUser.profile.children[0]._id || authUser.profile.children[0].id;
        dispatch(selectStudent(firstChildId));
      }
    };

    initializeChildSelection();
  }, [authUser?.role, authUser?.profile?.children, selectedChildId, dispatch]);
};

export default useAutoSelectChild;
