import fs from 'fs';

const gameJsons = await Promise.all(
  fs.readdirSync(new URL('../games', import.meta.url)).map((game) =>
    import(`../games/${game}`).then(({ default: gameJson }) => {
      return gameJson;
    })
  )
);

export default gameJsons;
