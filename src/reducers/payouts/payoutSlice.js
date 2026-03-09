import { createSlice } from "@reduxjs/toolkit";
import {
  fetchPayouts,
  fetchPayoutDetail,
  previewPayout,
  createPayout,
  approvePayout,
  markPayoutPaid,
  cancelPayout,
  verifyPayoutAccount,
  rejectPayoutAccount,
} from "./payoutThunks";

const initialState = {
  list: { rows: [], pagination: null },
  detail: null,
  preview: null,
  req: {},
};

const setReq = (state, key, status, error = null) => {
  state.req[key] = { status, error };
};

const upsertInList = (rows, item) => {
  const idx = rows.findIndex((r) => String(r?._id) === String(item?._id));
  if (idx >= 0) {
    const next = [...rows];
    next[idx] = item;
    return next;
  }
  return rows;
};

const payoutsSlice = createSlice({
  name: "payouts",
  initialState,
  reducers: {
    clearPayoutPreview: (state) => {
      state.preview = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPayouts.pending, (state) =>
        setReq(state, "list", "loading"),
      )
      .addCase(fetchPayouts.fulfilled, (state, action) => {
        setReq(state, "list", "succeeded");
        state.list = {
          rows: action.payload?.rows || [],
          pagination: action.payload?.pagination || null,
        };
      })
      .addCase(fetchPayouts.rejected, (state, action) =>
        setReq(state, "list", "failed", action.payload),
      )

      .addCase(fetchPayoutDetail.pending, (state) =>
        setReq(state, "detail", "loading"),
      )
      .addCase(fetchPayoutDetail.fulfilled, (state, action) => {
        setReq(state, "detail", "succeeded");
        state.detail = action.payload || null;
      })
      .addCase(fetchPayoutDetail.rejected, (state, action) =>
        setReq(state, "detail", "failed", action.payload),
      )

      .addCase(previewPayout.pending, (state) =>
        setReq(state, "preview", "loading"),
      )
      .addCase(previewPayout.fulfilled, (state, action) => {
        setReq(state, "preview", "succeeded");
        state.preview = action.payload || null;
      })
      .addCase(previewPayout.rejected, (state, action) =>
        setReq(state, "preview", "failed", action.payload),
      )

      .addCase(createPayout.pending, (state) =>
        setReq(state, "create", "loading"),
      )
      .addCase(createPayout.fulfilled, (state, action) => {
        setReq(state, "create", "succeeded");
        const created = action.payload;
        if (created?._id) {
          state.list.rows = [created, ...(state.list.rows || [])];
        }
      })
      .addCase(createPayout.rejected, (state, action) =>
        setReq(state, "create", "failed", action.payload),
      )

      .addCase(approvePayout.pending, (state) =>
        setReq(state, "approve", "loading"),
      )
      .addCase(approvePayout.fulfilled, (state, action) => {
        setReq(state, "approve", "succeeded");
        const item = action.payload;
        if (item?._id) {
          state.list.rows = upsertInList(state.list.rows || [], item);
          state.detail = item;
        }
      })
      .addCase(approvePayout.rejected, (state, action) =>
        setReq(state, "approve", "failed", action.payload),
      )

      .addCase(markPayoutPaid.pending, (state) =>
        setReq(state, "markPaid", "loading"),
      )
      .addCase(markPayoutPaid.fulfilled, (state, action) => {
        setReq(state, "markPaid", "succeeded");
        const item = action.payload;
        if (item?._id) {
          state.list.rows = upsertInList(state.list.rows || [], item);
          state.detail = item;
        }
      })
      .addCase(markPayoutPaid.rejected, (state, action) =>
        setReq(state, "markPaid", "failed", action.payload),
      )

      .addCase(cancelPayout.pending, (state) =>
        setReq(state, "cancel", "loading"),
      )
      .addCase(cancelPayout.fulfilled, (state, action) => {
        setReq(state, "cancel", "succeeded");
        const item = action.payload;
        if (item?._id) {
          state.list.rows = upsertInList(state.list.rows || [], item);
          state.detail = item;
        }
      })
      .addCase(cancelPayout.rejected, (state, action) =>
        setReq(state, "cancel", "failed", action.payload),
      )

      .addCase(verifyPayoutAccount.pending, (state) =>
        setReq(state, "verifyAccount", "loading"),
      )
      .addCase(verifyPayoutAccount.fulfilled, (state) => {
        setReq(state, "verifyAccount", "succeeded");
      })
      .addCase(verifyPayoutAccount.rejected, (state, action) =>
        setReq(state, "verifyAccount", "failed", action.payload),
      )

      .addCase(rejectPayoutAccount.pending, (state) =>
        setReq(state, "rejectAccount", "loading"),
      )
      .addCase(rejectPayoutAccount.fulfilled, (state) => {
        setReq(state, "rejectAccount", "succeeded");
      })
      .addCase(rejectPayoutAccount.rejected, (state, action) =>
        setReq(state, "rejectAccount", "failed", action.payload),
      );
  },
});

export const { clearPayoutPreview } = payoutsSlice.actions;

export const selectPayoutList = (s) => s.payouts.list;
export const selectPayoutDetail = (s) => s.payouts.detail;
export const selectPayoutPreview = (s) => s.payouts.preview;
export const selectPayoutReq = (k) => (s) => s.payouts.req?.[k];

export default payoutsSlice.reducer;
