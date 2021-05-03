import decode from "../src";
import fixture from "./fixture";
import assertion from "./assertion";

describe('decode test', function () {
  it('should decode the base58 string to a valid json', function () {
    const output = decode(fixture);
    expect(output).toEqual(assertion);
  });
});
