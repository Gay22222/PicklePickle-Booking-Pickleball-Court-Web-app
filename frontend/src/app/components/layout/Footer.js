// src/app/components/layout/Footer.js

export default function Footer() {
  return (
    <footer className="pp-footer">
      <div className="max-w-5xl mx-auto px-6 py-6 text-xs text-zinc-500">
        © {new Date().getFullYear()} PicklePickle. All rights reserved.
      </div>
    </footer>
  );
}
