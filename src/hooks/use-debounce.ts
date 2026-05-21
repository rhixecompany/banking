/**
 * useDebounce hook — delays updating a value until after a specified wait time.
 * Useful for search inputs, window resize handlers, and other frequently-changing
 * values where you want to avoid expensive operations until the user "stops" typing.
 *
 * @example
 * ```tsx
 * const [query, setQuery] = useState("");
 * const debouncedQuery = useDebounce(query, 300);
 *
 * // Use debouncedQuery for expensive operations (API calls, filtering, etc.)
 * useEffect(() => {
 *   if (debouncedQuery) {
 *     searchAPI(debouncedQuery);
 *   }
 * }, [debouncedQuery]);
 * ```
 */

import { useEffect, useRef, useState } from "react";

/**
 * Hook configuration options.
 */
interface UseDebounceOptions {
  /** Leading edge: trigger immediately on first change, then debounce. Default: false */
  leading?: boolean;
  /** Trailing edge: trigger after wait time elapses. Default: true */
  trailing?: boolean;
}

/**
 * Debounces a value, delaying updates until after the specified wait time.
 *
 * @param value - The value to debounce
 * @param delay - Delay in milliseconds (default: 500)
 * @param options - Additional options for leading/trailing edge behavior
 * @returns The debounced value
 *
 * @example
 * // Basic usage with search input
 * const [searchTerm, setSearchTerm] = useState("");
 * const debouncedSearch = useDebounce(searchTerm, 300);
 *
 * // Usage with leading edge (trigger immediately, then debounce)
 * const debouncedWithLeading = useDebounce(value, 500, { leading: true });
 */
export function useDebounce<T>(
  value: T,
  delay: number = 500,
  options?: UseDebounceOptions,
): T {
  const { leading = false, trailing = true } = options ?? {};

  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  const timeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined,
  );
  const leadingRef = useRef(true);

  // Clean up timeout on unmount or when value/delay changes
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [value, delay]);

  // Debounce logic
  useEffect(() => {
    // Reset leading flag on value change
    if (leading && leadingRef.current) {
      leadingRef.current = false;
      setDebouncedValue(value);
      return;
    }

    // If leading edge is disabled, reset leading flag for next time
    if (!leading) {
      leadingRef.current = true;
    }

    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Handle trailing edge
    if (trailing) {
      timeoutRef.current = setTimeout(() => {
        leadingRef.current = true;
        setDebouncedValue(value);
      }, delay);
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [value, delay, leading, trailing]);

  return debouncedValue;
}

/**
 * useDebounceCallback - Debounce a callback function directly.
 * Use this when you want to debounce a function call rather than a value.
 *
 * @example
 * ```tsx
 * const debouncedSearch = useDebounceCallback(async (query) => {
 *   await searchAPI(query);
 * }, 300);
 *
 * <input onChange={(e) => debouncedSearch(e.target.value)} />
 * ```
 */
export function useDebounceCallback<T extends (...args: unknown[]) => unknown>(
  callback: T,
  delay: number = 500,
): T {
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined,
  );

  const debouncedCallback = (...args: Parameters<T>) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      callback(...args);
    }, delay);
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return debouncedCallback as T;
}

export default useDebounce;
