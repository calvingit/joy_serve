import { useState } from "react";

export function useModal() {
  const [o, setO] = useState(false);
  return { open: o, show: () => setO(true), hide: () => setO(false) };
}
