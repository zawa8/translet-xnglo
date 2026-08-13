import TsvViewer from "@/components/TsvViewer";

export default function TsvViewPage() {
  return (
    <main className="min-h-screen p-8 bg-gray-950 text-gray-100">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <a 
            href="/" 
            className="inline-flex items-center gap-2 bg-gray-900 hover:bg-gray-800 text-gray-300 px-3 py-1.5 rounded-lg text-sm border border-gray-800 transition"
          >
            ← bxk tu vom
          </a>
        </div>

        <h1 className="text-2xl font-bold mb-2">3K Local TSV Dataset Viewer</h1>
        <p className="text-gray-400 text-sm mb-6">
          wiyuiNg dxta lodid daynxmikli from <code className="bg-gray-800 px-1.5 py-0.5 rounded">data/3k_local_copy.tsv</code>.
        </p>

        <TsvViewer />
      </div>
    </main>
  );
}