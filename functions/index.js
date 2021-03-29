/* eslint-disable @typescript-eslint/no-var-requires */
const admin = require("firebase-admin");
const functions = require("firebase-functions");
const { ethers } = require("ethers");
const { signatureMessage } = require("./constant");

admin.initializeApp();

// eslint-disable-next-line @typescript-eslint/no-unused-vars
module.exports.signIn = functions.region("asia-northeast1").https.onCall(async (data, context) => {
  const { signature, signerAddress } = data;
  const recoveredAddress = ethers.utils.verifyMessage(`${signatureMessage}${signerAddress}`, signature).toLowerCase();
  const customToken = await admin.auth().createCustomToken(recoveredAddress);
  return customToken;
});
