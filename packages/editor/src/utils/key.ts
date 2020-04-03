import { isNumber } from "./common";

const keyMap = new Map<KeyType, number>();

export function generateKey(type: KeyType): number {
  const v = keyMap.get(type);

  if (isNumber(v)) {
    keyMap.set(type, v! + 1);
    return v! + 1;
  }

  return createFromType(type);
}

export function setMaxKey(type: KeyType, max: number): void {
  const v = keyMap.get(type);

  if (!isNumber(v) || max > v!) {
    keyMap.set(type, max);
  }
}

export function getMaxId(type: KeyType): number {
  const v = keyMap.get(type);

  if (isNumber(v)) {
    return v!;
  }

  return createFromType(type);
}

function createFromType(type: KeyType) {
  keyMap.set(type, 1);
  return 1;
}

export enum KeyType {
  Comppnent = "component",
  Plugin = "plugin",
  Action = "action"
}
