import fs from 'fs';

const readGameConfig = async () => {
  try {
    return Promise.all(
      fs
        .readdirSync(new URL('./gameConfig', import.meta.url))
        .filter((game) => game.endsWith('.js'))
        .map((game) =>
          import(`../gameConfig/${game}`).then(({ default: gameJson }) => {
            return gameJson;
          })
        )
    );
  } catch (e) {
    console.error('Failed to read game configs', e);
    return [];
  }
};

export default readGameConfig;
