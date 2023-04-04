export type lens<S, T> = {
  view: (store: S) => T;
  set: (store: S, value: T) => S;
};

export const setApply = <U, S, T>(fn: (item: U) => T) => (l: lens<S, T>) => (
  store: S,
  item: U
) => l.set(store, fn(item));

export const setMany = <U, S, T>(fn: (item: U, i: number, array: U[]) => T) => (
  l: lens<S, T>
) => (store: S, items: U[]) => items.map(fn).reduce(l.set, store);

export const setConcat = <U, S, T>(
  fn: (item: U, i: number, array: U[]) => T[]
) => (l: lens<S, T>) => (store: S, items: U[]) =>
  items
    .map(fn)
    .reduce((acc, curr) => acc.concat(curr), [])
    .reduce(l.set, store);

export const mergeApply = <U, S, T>(
  fn: (store: T, item: U) => T,
  ...fns: ((store: T, item: U) => T)[]
) => (l: lens<S, T>) => (store: S, item: U) =>
  fns.length > 0
    ? l.set(
        store,
        fns.reduce((acc: T, curr) => curr(acc, item), fn(l.view(store), item))
      )
    : l.set(store, fn(l.view(store), item));

export const forEach = <U, S, T>(fn: (item: T) => T, l: lens<S, T[]>) => (
  store: S,
  items: U[]
) => items;

const viewApply = <U, S, T>(l: lens<S, T>, fn: (item: T) => U) => (store: S) =>
  fn(l.view(store));

const map = <S, T>(fn: (n: T) => T, l: lens<S, T>) => (source: S): S =>
  l.set(source, fn(l.view(source)));

export const identity = <T>(): lens<T, T> => ({
  view: s => s,
  set: (_, t) => t
});

export function pipe<T>(): lens<T, T>;
export function pipe<T, A>(l1: lens<T, A>): lens<T, A>;
export function pipe<T, A, B>(l1: lens<T, A>, l2: lens<A, B>): lens<T, B>;
export function pipe<T, A, B, C>(
  l1: lens<T, A>,
  l2: lens<A, B>,
  l3: lens<B, C>
): lens<T, C>;
export function pipe<T, A, B, C, D>(
  l1: lens<T, A>,
  l2: lens<A, B>,
  l3: lens<B, C>,
  l4: lens<C, D>
): lens<T, D>;
export function pipe<T, A, B, C, D, E>(
  l1: lens<T, A>,
  l2: lens<A, B>,
  l3: lens<B, C>,
  l4: lens<C, D>,
  l5: lens<D, E>
): lens<T, E>;
export function pipe<T, A, B, C, D, E, F>(
  l1: lens<T, A>,
  l2: lens<A, B>,
  l3: lens<B, C>,
  l4: lens<C, D>,
  l5: lens<D, E>,
  l6: lens<E, F>
): lens<T, F>;
export function pipe<T, A, B, C, D, E, F, G>(
  l1: lens<T, A>,
  l2: lens<A, B>,
  l3: lens<B, C>,
  l4: lens<C, D>,
  l5: lens<D, E>,
  l6: lens<E, F>,
  l7: lens<F, G>
): lens<T, G>;
export function pipe<T, A, B, C, D, E, F, G, H>(
  l1: lens<T, A>,
  l2: lens<A, B>,
  l3: lens<B, C>,
  l4: lens<C, D>,
  l5: lens<D, E>,
  l6: lens<E, F>,
  l7: lens<F, G>,
  l8: lens<G, H>
): lens<T, H>;
export function pipe<T, A, B, C, D, E, F, G, H, I>(
  l1: lens<T, A>,
  l2: lens<A, B>,
  l3: lens<B, C>,
  l4: lens<C, D>,
  l5: lens<D, E>,
  l6: lens<E, F>,
  l7: lens<F, G>,
  l8: lens<G, H>,
  l9: lens<H, I>
): lens<T, I>;
export function pipe<T, A, B, C, D, E, F, G, H, I>(
  l1: lens<T, A>,
  l2: lens<A, B>,
  l3: lens<B, C>,
  l4: lens<C, D>,
  l5: lens<D, E>,
  l6: lens<E, F>,
  l7: lens<F, G>,
  l8: lens<G, H>,
  l9: lens<H, I>,
  ...arr: lens<any, any>[]
): lens<T, {}>;

export function pipe(...fns: Array<lens<any, any>>): lens<any, any> {
  return pipeFromArray(fns);
}

export class Lens<S, T> implements lens<S, T> {
  constructor(
    public view: (store: S) => T,
    public set: (store: S, value: T) => S 
    ) {}  
  public static Create<T>()   {
    return Lens.From(identity<T>())
  }
  public static From<S, T>(lens: lens<S, T>) {
    return new Lens<S, T>(lens.view, lens.set);
  }
  public setApply<U>(fn: (item: U) => T) {
    return setApply<U, S, T>(fn)(this);
  }
  public viewApply<U>(fn: (item: T) => U) {
    return viewApply(this, fn);
  }
  public setMany<U>(fn: (item: U, i?: number, arr?: U[]) => T) {
    return setMany<U, S, T>(fn)(this);
  }
  public mergeApply<U>(
    fn: (store: T, item: U) => T,
    ...fns: ((store: T, item: U) => T)[]
  ) {
    return mergeApply<U, S, T>(fn, ...fns)(this);
  }
  public setConcat<U>(fn: (items: U, i?: number, arr?: U[]) => T[]) {
    return setConcat<U, S, T>(fn)(this);
  }
  public map(fn: (item: T) => T) {
    return map(fn, this);
  }
  public pipe(): Lens<S, T>;
  public pipe<A>(lens: lens<T, A>): Lens<S, A>;
  public pipe<A, B>(l1: lens<T, A>, l2: lens<A, B>): Lens<S, B>;
  public pipe<A, B, C>(
    l1: lens<T, A>,
    l2: lens<A, B>,
    l3: lens<B, C>
  ): Lens<S, C>;
  public pipe<A, B, C, D>(
    l1: lens<T, A>,
    l2: lens<A, B>,
    l3: lens<B, C>,
    l4: lens<C, D>
  ): Lens<S, D>;
  public pipe<A, B, C, D, E>(
    l1: lens<T, A>,
    l2: lens<A, B>,
    l3: lens<B, C>,
    l4: lens<C, D>,
    l5: lens<D, E>
  ): Lens<S, E>;
  public pipe<A, B, C, D, E, F>(
    l1: lens<T, A>,
    l2: lens<A, B>,
    l3: lens<B, C>,
    l4: lens<C, D>,
    l5: lens<D, E>,
    l6: lens<E, F>
  ): Lens<S, F>;
  public pipe<A, B, C, D, E, F, G>(
    l1: lens<T, A>,
    l2: lens<A, B>,
    l3: lens<B, C>,
    l4: lens<C, D>,
    l5: lens<D, E>,
    l6: lens<E, F>,
    l7: lens<F, G>
  ): Lens<S, G>;
  public pipe<A, B, C, D, E, F, G, H>(
    l1: lens<T, A>,
    l2: lens<A, B>,
    l3: lens<B, C>,
    l4: lens<C, D>,
    l5: lens<D, E>,
    l6: lens<E, F>,
    l7: lens<F, G>,
    l8: lens<G, H>
  ): Lens<S, H>;
  public pipe<A, B, C, D, E, F, G, H, I>(
    l1: lens<T, A>,
    l2: lens<A, B>,
    l3: lens<B, C>,
    l4: lens<C, D>,
    l5: lens<D, E>,
    l6: lens<E, F>,
    l7: lens<F, G>,
    l8: lens<G, H>,
    l9: lens<H, I>
  ): Lens<S, I>;
  public pipe<A, B, C, D, E, F, G, H, I>(
    l1: lens<T, A>,
    l2: lens<A, B>,
    l3: lens<B, C>,
    l4: lens<C, D>,
    l5: lens<D, E>,
    l6: lens<E, F>,
    l7: lens<F, G>,
    l8: lens<G, H>,
    l9: lens<H, I>,
    ...arr: lens<any, any>[]
  ): Lens<S, {}>;

  public pipe(...l: lens<any, any>[]): Lens<any, any> {
    let inner = pipeFromArray([this, ...l]);
    return Lens.From(inner);
  }
}

export const field = <S extends object, K extends keyof S>(
  name: K
): Lens<S, S[K]> =>
  new Lens(
    (store: S) => store[name],
    (store: S, value: S[K]) => ({ ...store, [name]: value } as S)
  );



export const index = <S>(id: number): Lens<S[], S> =>
  new Lens(
    (item: S[]) => item[id],
    (store: S[], value: S) =>
      store
        .slice(0, id)
        .concat(new Array(Math.max(0, id - store.length)))
        .concat([value])
        .concat(store.slice(id + 1))
  );

export const withDefault = <T>(def: T): Lens<T | undefined, T> =>
  new Lens(store => store || def, (_, value) => value);

export const maybeArray = <T>(): Lens<T[] | T | undefined, T[]> =>
  new Lens(
    store =>
      typeof store === "undefined"
        ? []
        : Array.isArray(store)
        ? store
        : [store],
    (_, value) => value
  );
export const pushPeek = <T>(): Lens<T[], T | undefined> =>
  new Lens(
    store => store.slice(-1).pop(),
    (store, value) => (value ? [...store, value] : store)
  );

export const start = <T>(): Lens<T, T> =>
  Lens.Create<T>();

export const from = <S, T>(
  getter: (store: S) => T,
  setter: (store: S, value: T) => S
) => new Lens<S, T>(getter, setter);

function pipeInner<S, T, U>(first: lens<S, T>, second: lens<T, U>): lens<S, U> {
  return {
    view: (store: S) => second.view(first.view(store)),
    set: (store: S, value: U) =>
      first.set(store, second.set(first.view(store), value))
  };
}
function pipeFromArray(fns: Array<lens<any, any>>): lens<any, any> {
  if (!fns) {
    return identity();
  }
  if (fns.length === 1) {
    return fns[0];
  }
  return fns.reduce(pipeInner);
}
export function defaultArray<T>(): Lens<T[] | undefined, T[]> {
  return withDefault(new Array<T>());
}

export const mapKey = <V>(
  key: string
): Lens<{ [key: string]: V }, V | undefined> =>
  new Lens(
    map => map[key],
    (map, v: V | undefined) =>
      typeof v === "undefined" ? map : { ...map, [key]: v }
  );

  export const group = 
  <T>(key: string) =>
    mapKey<T[]>(key).pipe(
      defaultArray()
    );
export const grouped = <T>(key: string) =>
  group<T>(key).pipe(pushPeek())
  

export const toGrouped = <T>(fn: (item: T) => string) => (items: T[]) =>
  items.reduce((acc, item) => grouped<T>(fn(item)).set(acc, item), {} as {
    [key: string]: T[];
  });

export const nil = <T>(): lens<T, T> => ({
  view: s => undefined,
  set: (s, _) => s
});

export const iff = <T>(statement: boolean | ((item:T) => boolean) ): lens<T, T> =>
  typeof(statement) == 'boolean' ?
    statement ? identity() : nil() :
    { view: s => statement(s) ? s : undefined,
      set: (s,item) => statement(s) ? item : s
    }

export const bind = <S,T extends object>(v: {[K in keyof T]: lens<S,T[K]>}) =>  
    {
      
      
      
    }
    
    
   
