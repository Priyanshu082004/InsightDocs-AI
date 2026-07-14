import { getMimeCategory } from "../../constants/fileUpload.constant.js";


export const stageHandlers = {
  OCR: async ({ document }) => {
    const category = getMimeCategory(document.mimeType);

    if (category !== "IMAGES") {

      return { skipped: true };
    }

    return { skipped: false, placeholder: true };
  },

  TEXT_EXTRACTION: async () => {
    
    return { placeholder: true };
  },

  CHUNKING: async () => {
 
    return { placeholder: true };
  },

  EMBEDDING: async () => {
    
    return { placeholder: true };
  },

  SUMMARY: async () => {
    
    return { placeholder: true };
  },

  KEYWORDS: async () => {
    
    return { placeholder: true };
  },

  RISK_ANALYSIS: async () => {
   
    return { placeholder: true };
  },
};