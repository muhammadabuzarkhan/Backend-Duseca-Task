// // utils/response.js

// const success = (res, message, data = null, messageKey = "success") => {
//   return res.json({
//     messageKey,
//     message,
//     data
//   });
// };

// const error = (res, message, statusCode = 500, messageKey = "error") => {
//   return res.status(statusCode).json({
//     messageKey,
//     message,
//     data: null
//   });
// };

// module.exports = { success, error };

// utils/response.js
exports.success = (res, message, data = null, status = 200) => {
  return res.status(status).json({
    messageKey: "success",
    message,
    data,
  });
};

exports.error = (res, message, status = 500, code = "server_error", details = null) => {
  return res.status(status).json({
    messageKey: "error",
    message,
    code,     // e.g., validation_error, not_found
    details,  // optional debugging info
    data: null,
  });
};
