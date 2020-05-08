export const calculateSessionExpiration = (milliseconds = 0) => {
  let date = new Date();
  date.setMilliseconds(milliseconds + date.getMilliseconds());
  return date.toISOString();
};