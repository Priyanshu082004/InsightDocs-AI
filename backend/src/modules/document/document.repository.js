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

export const softDelete = async (documentId) => {
  return Document.findByIdAndUpdate(documentId, { isDeleted: true }, { new: true });
};


//  documentIds comes from permission.repository.listDocumentIdsForUser —
//  this function only ever operates on that pre-filtered set, never on
//   the full Document collection, so a search/list request can't
//  accidentally surface a document the caller has no Permission row for.
 
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