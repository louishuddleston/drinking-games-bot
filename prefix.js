const { readFile, writeFile } = require('fs/promises');

const getJSON = async () => {
  const file = await readFile('prefix.json', { encoding: 'utf-8' });
  const data = JSON.parse(file);
  return data;
};

const getPrefix = async (guildID) => {
  const data = await getJSON();
  let prefix = '!';

  if (data[guildID]) {
    prefix = data[guildID];
  }
  return prefix;
};

const setPrefix = async (prefix, guildID) => {
  const data = await getJSON();
  data[guildID] = prefix;

  await writeFile('prefix.json', JSON.stringify(data), {
    encoding: 'utf-8',
  }).catch((err) => {
    throw new Error(err);
  });

  return true;
};

exports.getPrefix = getPrefix;
exports.setPrefix = setPrefix;
