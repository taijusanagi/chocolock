/* eslint-disable @typescript-eslint/no-var-requires */
const crypto = require("crypto");
const { encrypt } = require("eth-sig-util");
const admin = require("firebase-admin");
const functions = require("firebase-functions");
const { ethers } = require("ethers");

const { v4: uuidv4 } = require("uuid");

const { KeyManagementServiceClient } = require("@google-cloud/kms");
const { signatureMessage } = require("./constant");

admin.initializeApp();
const firestore = admin.firestore();

const kmsConfig = {
  projectId: "chocolock-prod",
  locationId: "asia-southeast1",
  keyRingId: "chocolock-prod",
  keyId: "encryption",
};

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
  const { chainId, nftContractAddress, tokenId, contentUrl, embedContent, password } = data;
  const client = new KeyManagementServiceClient();
  const keyName = client.cryptoKeyPath(kmsConfig.projectId, kmsConfig.locationId, kmsConfig.keyRingId, kmsConfig.keyId);
  const plaintextBuffer = Buffer.from(password);
  const encryptedPassword = await client.encrypt({
    name: keyName,
    plaintext: plaintextBuffer,
  });
  const uid = uuidv4();
  await firestore.collection("locks").doc(uid).set({
    userAddress,
    nftContractAddress,
    chainId,
    tokenId,
    contentUrl,
    embedContent,
    encryptedPassword,
  });
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
module.exports.unlock = functions.region("asia-northeast1").https.onCall(async (data, context) => {
  // const { iv, encryptedPassword } = data;
  // const decipher = crypto.createDecipheriv(algorithm, secretKey, Buffer.from(iv, "hex"));
  // const decrpyted = Buffer.concat([decipher.update(Buffer.from(encryptedPassword, "hex")), decipher.final()]);
  // return decrpyted.toString();
});
