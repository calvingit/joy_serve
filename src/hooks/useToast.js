import { useCallback, useState } from "react";

export function useToast() {
  const [t, setT] = useState(null);
  const show = useCallback((text, type = "success") => {
    setT({ text, type });
  }, []);

  return { toast: t, show, hide: () => setT(null) };
}
