/* eslint-disable @typescript-eslint/no-var-requires */
const crypto = require("crypto");
const admin = require("firebase-admin");
const functions = require("firebase-functions");
const { ethers } = require("ethers");
const { v4: uuidv4 } = require("uuid");
const { signatureMessage } = require("./constant");

admin.initializeApp();
const firestore = admin.firestore();

const algorithm = "aes-256-ctr";
const secretKey = "vOVH6sdmpNWjRRIqCc7rdxs01lwHzfr3";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
module.exports.signIn = functions.region("asia-northeast1").https.onCall(async (data, context) => {
  const { signature, userAddress } = data;
  const recoveredAddress = ethers.utils.verifyMessage(`${signatureMessage}${userAddress}`, signature).toLowerCase();
  const customToken = await admin.auth().createCustomToken(recoveredAddress, {});
  return customToken;
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
module.exports.lock = functions.region("asia-northeast1").https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError(
      "failed-precondition",
      "The function must be called " + "while authenticated."
    );
  }
  const userAddress = context.auth.uid;
  const { chainId, nftContractAddress, tokenId, contentUrl, password } = data;
  const id = uuidv4();
  const ivBuffer = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(algorithm, secretKey, ivBuffer);
  const encryptedPasswordBuffer = Buffer.concat([cipher.update(password), cipher.final()]);

  const iv = ivBuffer.toString("hex");
  const encryptedPassword = encryptedPasswordBuffer.toString("hex");
  await firestore.collection("locks").doc(id).set({
    id,
    userAddress,
    nftContractAddress,
    chainId,
    tokenId,
    contentUrl,
    encryptedPassword,
    iv,
  });
  return id;
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
module.exports.unlock = functions.region("asia-northeast1").https.onCall((data, context) => {
  const { iv, encryptedPassword } = data;
  const decipher = crypto.createDecipheriv(algorithm, secretKey, Buffer.from(iv, "hex"));
  const decrpyted = Buffer.concat([decipher.update(Buffer.from(encryptedPassword, "hex")), decipher.final()]);
  return decrpyted.toString();
});
