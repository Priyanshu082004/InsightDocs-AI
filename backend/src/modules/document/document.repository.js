import { Document } from "./document.model.js";

export const createDocument = async (data) => {
  return Document.create(data);
};

export const findById = async (documentId) => {
  return Document.findOne({ _id: documentId, isDeleted: false });
};

export const updateDisplayName = async (documentId, displayName) => {
  return Document.findByIdAndUpdate(documentId, { displayName }, { new: true });
};

export const updateStatus = async (documentId, status) => {
  return Document.findByIdAndUpdate(documentId, { status }, { new: true });
};

export const softDelete = async (documentId) => {
  return Document.findByIdAndUpdate(documentId, { isDeleted: true }, { new: true });
};

// Display names for a set of ids in ONE query — used by the RAG read
// path to label sources without a $lookup inside the vector-search
// aggregation. Deliberately no isDeleted filter: retrieval already
// permission-scoped the ids, and a chunk cited from a just-deleted
// document should still show its name rather than "unknown".
export const findNamesByIds = async (documentIds) => {
  return Document.find({ _id: { $in: documentIds } })
    .select("displayName")
    .lean();
};


//   documentIds comes from permission.repository.listDocumentIdsForUser —
//  this function only ever operates on that pre-filtered set, never on
//   the full Document collection, so a search/list request can't
//   accidentally surface a document the caller has no Permission row for.
 
export const findManyByIds = async (documentIds, { search, tags, page, limit }) => {
  const filter = {
    _id: { $in: documentIds },
    isDeleted: false,
  };

  if (search) {
    filter.displayName = { $regex: search, $options: "i" };
  }

  if (tags?.length) {
    filter.tags = { $in: tags };
  }

  const skip = (page - 1) * limit;

  const [items, total] = await Promise.all([
    Document.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
    Document.countDocuments(filter),
  ]);

  return { items, total, page, limit, totalPages: Math.ceil(total / limit) };
};