import { documentProcessingQueue } from "../queues/documentProcessing.queue.js";
import { JOB_NAMES, JOB_OPTIONS } from "../../constants/queue.constant.js";

export const enqueueDocumentProcessing = async (documentId) => {
  await documentProcessingQueue.add(
    JOB_NAMES.PROCESS_DOCUMENT,
    { documentId: documentId.toString() },
    JOB_OPTIONS
  );
};