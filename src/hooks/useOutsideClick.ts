import { type RefObject, useEffect } from "react";

export function useOutsideClick(
  ref: RefObject<HTMLElement | null>,
  handler: () => void,
) {
  useEffect(() => {
    function handleClickOutside(event: Event) {
      if (ref.current && !ref.current.contains(event.target as Node | null)) {
        handler();
      }
    }

    document.addEventListener("click", handleClickOutside, false);
    return () =>
      document.removeEventListener("click", handleClickOutside, false);
  }, [ref, handler]);
}
