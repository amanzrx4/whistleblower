import {
  Proof,
  SubmittedProof,
  reclaimprotocol,
} from "@reclaimprotocol/reclaim-sdk";

const INVALID_PROOF = "Invalid proof";

export const validateProofs = async (obj: unknown) => {
  let isValid = false;
  const { verifyCorrectnessOfProofs } = new reclaimprotocol.Reclaim();

  try {
    const proofsObj = isProofObject(
      JSON.parse(decodeURIComponent(JSON.stringify(obj)))
    )
      ? (obj as SubmittedProof[])
      : null;

    if (proofsObj) {
      let isValid = false;

      // @ts-ignore
      isValid = await verifyCorrectnessOfProofs("", proofsObj);

      return isValid;
    }
  } catch (error) {
    isValid = false;
  }
  return isValid;
};

const isProofObject = (obj: unknown): obj is Proof[] => {
  if (!Array.isArray(obj)) {
    return false;
  }

  return true;
};

export const validateWhistleBlowMessage = (message: unknown) => {
  if (typeof message !== "string" || message.trim().length === 0) {
    return false;
  }

  // regex for string of max length 500
  const regex = /^.{1,1000}$/;

  if (!regex.test(message)) {
    return false;
  }
  return true;
};
