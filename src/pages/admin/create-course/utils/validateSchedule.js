// const TIME_12H = /^(0?[1-9]|1[0-2]):[0-5]\d\s?(AM|PM)$/i;

export const validateSchedule = (schedule = {}) => {
  const errs = {};
  const { date, time, duration } = schedule || {};

  if (!date) errs.date = "Date is required.";
  else if (Number.isNaN(+new Date(date)))
    errs.date = "Please pick a valid date.";

  if (!time || !String(time).trim()) errs.time = "Time is required.";
  // else if (!TIME_12H.test(String(time)))
  //   errs.time = 'Time must be HH:MM AM/PM';

  const dur = Number(duration);
  if (!Number.isFinite(dur)) {
    errs.duration = "Duration is required.";
  } else if (!Number.isInteger(dur)) {
    errs.duration = "Duration must be an integer.";
  } else if (dur < 30) {
    errs.duration = "Min 30 minutes.";
  } else if (dur > 60) {
    errs.duration = "Max 60 minutes.";
  }

  return errs;
};
