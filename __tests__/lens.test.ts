import {
  start,
  field,
  index,
  withDefault,
  pushPeek,
  lens,
  grouped,
  toGrouped,
  mergeApply,
  iff,
  defaultArray,
  setMany
} from "../lens";

type TestType = {
  a: number;
  b: string;
  inner?: TestType;
};
type Container = {
  contained: TestType;
};
type ArrayContainer = {
  arrayed: number[];
};

const notTesting: TestType = {
  a: 2,
  b: "notTested"
};
const testing: TestType = {
  a: 1,
  b: "tested"
};
const nesting: TestType = {
  a: 2,
  b: "nested",
  inner: testing
};
const nestnesting: TestType ={
  a: 0,
  b: "nest-nesting",
  inner: nesting
}
const containing = {
  contained: testing
};

const array = [1, 2, 3, 4, 5];

const arraying = {
  arrayed: array
};
const a = field<TestType, "a">("a");
const contained = field<Container, "contained">("contained");
const id = index<number>(3);
const outOfRange = index<number>(6);
const arrayed = field<ArrayContainer, "arrayed">("arrayed");
const defaulted = field<TestType, "inner">("inner").pipe(
  withDefault<TestType>(testing)
);

test("Can extract field", () => {
  expect(a.view(testing)).toBe(1);
  expect(a.view(nesting)).toBe(2);
  expect(contained.pipe(a).view(containing)).toBe(1);
});
test("Can insert field", () => {
  let testingNew = a.set(testing, 3);
  expect(a.view(testingNew)).toBe(3);
  expect(a.view(testingNew)).not.toBe(a.view(testing));
});
test("Can Insert Element", () => {
  let arrayNew = id.set(array, 2);
  expect(arrayNew).toMatchObject([1, 2, 3, 2, 5]);
  expect(array).toMatchObject([1, 2, 3, 4, 5]);
});
test("Can insert nested ", () => {
  let newContaining = contained.pipe(a).set(containing, 3);
  expect(contained.pipe(a).view(newContaining)).toBe(3);
});

test("Can extract item from array", () => {
  expect(id.view(array)).toBe(4);
  expect(arrayed.pipe(id).view(arraying)).toBe(4);
});

test("Extract Item Too far", () => {
  expect(outOfRange.view(array)).toBeUndefined();
  let inserted = outOfRange.set(array, 6);
  expect(outOfRange.view(inserted)).toBe(6);
  let reallyShort = [1, 2];
  let insertedShort = outOfRange.set(reallyShort, 6);

  expect(outOfRange.view(insertedShort)).toBe(6);
  let almostLongEnough = [1, 2, 3, 4, 5, 6];
  let insertedAlmost = outOfRange.set(almostLongEnough, 7);
  expect(outOfRange.view(insertedAlmost)).toBe(7);
});

test("Testing Default", () => {
  let newTesting = a.set(testing, 7);
  let newNesting = defaulted.set(testing, newTesting);

  expect(defaulted.view(testing)).toMatchObject(testing);
  expect(defaulted.view(newNesting)).toMatchObject(newTesting);
});

test("Test pushPeek", () => {
  let pp = pushPeek<number>();
  expect(pp.view(array)).toBe(5);
  expect(pp.view(pp.set(array, 6))).toBe(6);
  expect(pp.view([])).toBeUndefined();
  expect(pp.set([], 1)).toMatchObject([1]);
});
test("Test pipe", () => {
  let l = start<TestType>().pipe(
    field("inner"),
    withDefault(notTesting),
    field("a")
  );
  expect(l.view(nesting)).toBe(1);
});
test("Test iff",() => {
  let l = start<TestType>().pipe(
    field("inner"),
    iff(item => !!item),
    field("inner"),
    field("a")
  );  
  expect(l.view(nestnesting)).toBe(1);
})

function lensTestPrimitive<S, T>(
  l: lens<S, T>,
  store: S,
  value: T,
  secondValue: T
) {
  expect(l.view(l.set(store, value))).toBe(value);
  expect(l.view(l.set(l.set(store, secondValue), value))).toBe(
    l.view(l.set(store, value))
  );
  expect(l.view(l.set(store, l.view(store)))).toBe(l.view(store));
}




// function lensTestObject<S, T>(
//   l: lens<S, T>,
//   store: S,
//   value: T,
//   secondValue: T
// ) {
//   expect(l.view(l.set(store, value))).toMatchObject(value);
//   expect(l.view(l.set(l.set(store, secondValue), value))).toMatchObject(
//     l.view(l.set(store, value))
//   );
//   expect(l.view(l.set(store, l.view(store)))).toMatchObject(l.view(store));
// }

test("Test Lens Properties", () => {
  lensTestPrimitive(pushPeek<number>(), [1, 2, 3], 1, 2);
  lensTestPrimitive(pushPeek<number>(), [], 2, 1);
});

test("Test Grouped", () => {
  let t = toGrouped((x: number) => `${x % 3}`)([1, 2, 3, 4, 5]);
  expect(grouped("1").view(t)).toEqual(4);
});
test("Test MergeApply", () => {
  let out = mergeApply<number, { arrayed: number[] }, number[]>(
    pushPeek<number>().set,
    index<number>(0).set,
    (s, i) => index<number>(3).set(s, index<number>(3).view(s) / i)
  )(field("arrayed"))(arraying, 2);
  expect(out.arrayed).toMatchObject([2, 2, 3, 2, 5, 2]);
});
test("Test MergeApplyWithSetMany", () => {
  let out = field<ArrayContainer, "arrayed">("arrayed").mergeApply(
    pushPeek<number>().setMany<number>(i => i ** 2),
    index<number>(0).setApply(item => item.reduce((acc, curr) => acc + curr))
  )(arraying, [1, 2, 3, 4]);
  expect(out.arrayed).toMatchObject([10, 2, 3, 4, 5, 1, 4, 9, 16]);
});
