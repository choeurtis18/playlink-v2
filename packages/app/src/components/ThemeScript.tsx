export function ThemeScript() {
  const script = `
    try {
      var s = JSON.parse(localStorage.getItem('playlink-store') || '{}');
      if (s.state?.darkMode) document.documentElement.classList.add('dark');
    } catch {}
  `;
  return <script dangerouslySetInnerHTML={{ __html: script }} />;
}
