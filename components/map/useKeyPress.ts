import { RefObject, useEffect, useRef } from "react";

export interface UseKeyPressProps<T extends HTMLElement = HTMLElement> {
  keys: KeyPressDefinition<T>[];
}

export interface KeyPressDefinition<T extends HTMLElement = HTMLElement> {
  readonly targetKey: string;
  readonly onKeyPress: (element: T) => void;
}

export const useKeyPress = <T extends HTMLElement = HTMLElement>({
  keys,
}: UseKeyPressProps): RefObject<T> => {
  const elementRef = useRef<T>(null);

  useEffect(() => {
    if (elementRef.current) {
      const localRef = elementRef.current;
      const keyPressListener = (event: KeyboardEvent) => {
        const key = event.key;
        const isDefined = keys.filter((k) => k.targetKey === key);
        if (isDefined.length > 0) {
          isDefined[0].onKeyPress(localRef);
        }
      };

      document.addEventListener("keydown", keyPressListener);
      return () => {
        document.removeEventListener("keydown", keyPressListener);
      };
    }
  });

  return elementRef;
};
