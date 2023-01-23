const cache = {};

function importAll(r) {
  r.keys().forEach(key => (cache[key] = r(key)));
}

importAll(require.context("../static", true, /\.(png|wav)$/));

export default cache;
