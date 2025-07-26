import { useCallback, useEffect, useMemo, useRef, useState } from "react";

type Serializer<T> = (object: T | undefined) => string;
type Parser<T> = (val: string) => T | undefined;

type Options<T> = Partial<{
  serializer: Serializer<T>;
  parser: Parser<T>;
  logger: (error: Error) => void;
  syncData: boolean;
}>;

export function useLocalStorage<T>(
  key: string,
  defaultValue?: T,
  options?: Options<T>,
): [T, (value: React.SetStateAction<T | undefined>) => void] {
  const opts = useMemo(() => {
    return {
      serializer: JSON.stringify,
      parser: JSON.parse,
      logger: console.log,
      syncData: true,
      ...options,
    };
  }, [options]);

  const { serializer, parser, logger, syncData } = opts;

  const rawValueRef = useRef<string | null>(null);

  const readValue = useCallback((): T | undefined => {
    if (typeof window === "undefined") return undefined;

    try {
      rawValueRef.current = window.localStorage.getItem(key);
      return rawValueRef.current ? parser(rawValueRef.current) : undefined;
    } catch (e) {
      logger(e);
    }

    return undefined;
  }, [parser, logger, key]);

  const [value, setInternalValue] = useState(readValue() ?? defaultValue);

  // biome-ignore lint/correctness/useExhaustiveDependencies: call only once
  useEffect(() => {
    setInternalValue(readValue() ?? defaultValue);
  }, []);

  const setValue = useCallback(
    (setStateValue: React.SetStateAction<T | undefined>) => {
      setInternalValue((prev) => {
        const value =
          typeof setStateValue === "function"
            ? // @ts-expect-error
              setStateValue(prev)
            : setStateValue;

        if (typeof window === "undefined") return value;

        try {
          // Browser ONLY dispatch storage events to other tabs, NOT current tab.
          // We need to manually dispatch storage event for current tab
          if (value !== undefined) {
            const newValue = serializer(value);
            const oldValue = rawValueRef.current;
            rawValueRef.current = newValue;
            window.localStorage.setItem(key, newValue);
            window.dispatchEvent(
              new StorageEvent("storage", {
                storageArea: window.localStorage,
                url: window.location.href,
                key,
                newValue,
                oldValue,
              }),
            );
          } else {
            window.localStorage.removeItem(key);
            window.dispatchEvent(
              new StorageEvent("storage", {
                storageArea: window.localStorage,
                url: window.location.href,
                key,
              }),
            );
          }
        } catch (e) {
          logger(e);
        }

        return value;
      });
    },
    [key, logger, serializer],
  );

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!syncData) return;

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key !== key || e.storageArea !== window.localStorage) return;
      if (e.newValue === rawValueRef.current) return;

      setInternalValue(readValue());
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [readValue, key, syncData]);

  return [value as T, setValue];
}
