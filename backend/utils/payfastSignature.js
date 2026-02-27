// import crypto from "crypto";

// export function generateSignature(data, passphrase) {
//   const string = Object.entries(data)
//     .filter(([key]) => key !== "signature")
//     .map(([key, val]) => `${key}=${encodeURIComponent(val).replace(/%20/g, "+")}`)
//     .join("&");

//   return crypto
//     .createHash("md5")
//     .update(string + `&passphrase=${passphrase}`)
//     .digest("hex");
// }
