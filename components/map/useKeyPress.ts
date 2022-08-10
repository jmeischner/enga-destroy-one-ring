import { useEffect } from "react";

export interface UseKeyPressProps {
  keys: KeyPressDefinition[];
}

export interface KeyPressDefinition {
  readonly targetKey: string;
  readonly onKeyPress: () => void;
}

export const useKeyPress = ({ keys }: UseKeyPressProps) => {
  useEffect(() => {
    const keyPressListener = (event: KeyboardEvent) => {
      const key = event.key;
      const isDefined = keys.filter((k) => k.targetKey === key);
      if (isDefined.length > 0) {
        isDefined[0].onKeyPress();
      }
    };

    document.addEventListener("keydown", keyPressListener);
    return () => {
      document.removeEventListener("keydown", keyPressListener);
    };
  });
};
