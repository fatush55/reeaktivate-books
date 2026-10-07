import { API_CONFIG } from "@entities/book/configs";

export const getIsPrivateBook = (ownerId?: string) => {
  return ownerId?.trim() === API_CONFIG.USER_NAME;
};
