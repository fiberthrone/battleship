import { createContext, useContext } from "react";

export const UIEventsContext = createContext();
export function useSubscriber() {
  return useContext(UIEventsContext);
}
