// Injecte les couleurs du jeu (?main=…&secondary=…) et le mode debug (?safe=1).
(() => {
  const q = new URLSearchParams(location.search);
  const root = document.documentElement.style;
  if (q.get('main')) root.setProperty('--main', q.get('main'));
  if (q.get('secondary')) root.setProperty('--secondary', q.get('secondary'));
  if (q.get('safe')) document.addEventListener('DOMContentLoaded', () => document.body.classList.add('safe'));
})();
