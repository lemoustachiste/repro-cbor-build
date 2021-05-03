import decode from "../src";
import fixture from "./data/fixture";
import assertion from "./data/assertion";

describe('decode test', function () {
  it('should decode the base58 string to a valid json', function () {
    const output = decode(fixture);
    expect(output).toEqual(assertion);
  });
});
