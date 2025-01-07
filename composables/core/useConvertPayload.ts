import { unref } from 'vue';

export function convertObjWithRefToObj(obj: Record<string, any>): Record<string, any> {
  const plainObject: Record<string, any> = {};

  Object.keys(obj).forEach(key => {
    plainObject[key] = unref(obj[key]); // Unwrap the value
  });

  return plainObject;
}
