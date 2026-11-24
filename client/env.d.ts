/// <reference types="vite/client" />

// electa-ui exports its stylesheet as "./styles" (no .css extension), so the
// ambient "*.css" declaration from vite/client doesn't match it.
declare module "@assemblyvoting/electa-ui/styles";
