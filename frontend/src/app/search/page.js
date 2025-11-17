import SearchFiltersBar from "../components/search/SearchFiltersBar";
import SearchResultsGrid from "../components/search/SearchResultsGrid";

export default function SearchPage() {
  return (
    <main className="bg-white min-h-screen">
      <section className="max-w-6xl mx-auto px-4 py-8">
        <SearchFiltersBar />

        <div className="mt-6">
          <SearchResultsGrid />
        </div>
      </section>
    </main>
  );
}
