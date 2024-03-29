import { nanoid } from "nanoid";

const BLOB_KEY = "iconBlob";

export const blobToString = async (blob: Blob) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => resolve(event?.target?.result);
    reader.onerror = reject;
    reader.readAsText(blob);
  });
};
export const stringToBlob = (str: string, contentType = "text/plain"): Blob => {
  const byteNumbers = new Uint8Array(str.length);
  for (let i = 0; i < str.length; i++) {
    byteNumbers[i] = str.charCodeAt(i);
  }
  const blob = new Blob([byteNumbers], { type: contentType });
  return blob;
};

export const saveBlob = (blob: Blob): Promise<string> => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    const id = nanoid();
    reader.onload = (event) => {
      chrome.storage.local.get([BLOB_KEY]).then((current) => {
        chrome.storage.local
          .set({
            [BLOB_KEY]: {
              ...current[BLOB_KEY],
              [`${id}`]: event?.target?.result,
            },
          })
          .then(() => resolve(`${id}`));
      });
    };

    reader.readAsDataURL(blob);
  });
};
export const loadBlob = async (key: string) => {
  return (await chrome.storage.local.get(BLOB_KEY))[BLOB_KEY][key];
};
