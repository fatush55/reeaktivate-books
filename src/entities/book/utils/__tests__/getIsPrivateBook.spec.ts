import { API_CONFIG } from "../../configs";
import { getIsPrivateBook } from "../getIsPrivateBook";

describe("getIsPrivateBook", () => {
  it("should return true when ownerId matches API_CONFIG.USER_NAME", () => {
    expect(getIsPrivateBook(API_CONFIG.USER_NAME)).toBe(true);
  });

  it("should return true when ownerId matches API_CONFIG.USER_NAME with surrounding whitespace", () => {
    expect(getIsPrivateBook(`  ${API_CONFIG.USER_NAME}  `)).toBe(true);
  });

  it("should return false when ownerId belongs to another user", () => {
    expect(getIsPrivateBook("other-user")).toBe(false);
  });

  it("should return false when ownerId is an empty string or whitespace only", () => {
    expect(getIsPrivateBook("")).toBe(false);
    expect(getIsPrivateBook("   ")).toBe(false);
  });

  it("should return false when ownerId is undefined or missing", () => {
    expect(getIsPrivateBook(undefined)).toBe(false);
    expect(getIsPrivateBook()).toBe(false);
  });
});
