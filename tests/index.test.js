const { mozCompare } = require("../src");

describe(__filename, () => {
  describe("mozCompare", () => {
    it("returns false", () => {
      expect(mozCompare("1", "2")).toEqual(false);
    });
  });
});
