/**
 * The MIT License (MIT)
 * Copyright (c) 2020 heatcrypto.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of
 * this software and associated documentation files (the "Software"), to deal in
 * the Software without restriction, including without limitation the rights to
 * use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
 * the Software, and to permit persons to whom the Software is furnished to do so,
 * subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 * */
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
