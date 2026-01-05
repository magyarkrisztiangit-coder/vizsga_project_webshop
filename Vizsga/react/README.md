# React + Vite

Ez a sablon egy minimális beállítást ad a React futtatásához Vite alatt, HMR támogatással és néhány ESLint szabállyal.

Jelenleg két hivatalos plugin érhető el:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) a Fast Refresh-hez [Babel]-t használ (vagy [oxc]-et, ha [rolldown-vite]-val használják)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) a Fast Refresh-hez [SWC]-t használ

## React fordító

Ez a sablon nem engedélyezi a React fordítót a fejlesztési és build teljesítményre gyakorolt hatása miatt. Ha szeretnéd hozzáadni, lásd ezt a [dokumentációt](https://react.dev/learn/react-compiler/installation).

## ESLint konfiguráció bővítése

Ha éles alkalmazást fejlesztesz, ajánlott a TypeScript használata típusérzékeny lint szabályokkal. Nézd meg a [TS sablont](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) további információkért a TypeScript és a [`typescript-eslint`](https://typescript-eslint.io) integrálásáról a projektedbe.
