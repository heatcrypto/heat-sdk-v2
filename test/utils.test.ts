import "./jasmine"
import { unformat, commaFormat, isNumber, hasToManyDecimals, timestampToDate, formatQNT, trimDecimals } from "../src/utils"

describe("unformat test", () => {
  it("is a function", () => {
    expect(unformat).toBeInstanceOf(Function)
  })
  // it("accepts null", () => {
  //   expect(unformat(null)).toBe("0")
  // })
  it("works with single comma", () => {
    expect(unformat("1,000.99")).toBe("1000.99")
  })
  it("works with multiple commas", () => {
    expect(unformat("1,000,000.99")).toBe("1000000.99")
  })
})

describe("commaFormat test", () => {
  it("is a function", () => {
    expect(commaFormat).toBeInstanceOf(Function)
  })
  // it("accepts undefined", () => {
  //   expect(commaFormat(undefined)).toBe("0")
  // })
  it("works with single comma", () => {
    expect(commaFormat("1000.99")).toBe("1,000.99")
  })
  it("works with multiple commas", () => {
    expect(commaFormat("1000000.99")).toBe("1,000,000.99")
  })
})

describe("isNumber test", () => {
  it("is a function", () => {
    expect(isNumber).toBeInstanceOf(Function)
  })
  it("works with comma formatted", () => {
    expect(isNumber("1,000")).toBeTruthy()
  })
})

describe("hasToManyDecimals test", () => {
  it("is a function", () => {
    expect(hasToManyDecimals).toBeInstanceOf(Function)
  })
  // TODO write tests for hasToManyDecimals
})

describe("timestampToDate test", () => {
  it("is a function", () => {
    expect(timestampToDate).toBeInstanceOf(Function)
  })
  // TODO write tests for timestampToDate
})

describe("formatQNT test", () => {
  it("is a function", () => {
    expect(formatQNT).toBeInstanceOf(Function)
  })
  // TODO write tests formatQNT
})

describe("trimDecimals test", () => {
  it("is a function", () => {
    expect(trimDecimals).toBeInstanceOf(Function)
  })
  // TODO write tests trimDecimals
})

// etc..
