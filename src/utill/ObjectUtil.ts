export function ObjectMap<T, U>(obj: { [key: string]: T }, func: (key: string, val: T, index: number) => U): U[] {
    return Object.keys(obj).map((k, i) => func(k, obj[k], i));
}