import { useMemo, useRef, useState } from "react";
import { Header } from "./components/Header";
import { FilterBar } from "./components/FilterBar";
import { Feed } from "./components/Feed";
import { LoginScreen } from "./components/LoginScreen";
import { useLaunchFeed } from "./hooks/useLaunchFeed";
import { auth } from "./lib/auth";
import { LaunchCategory, LaunchSource } from "./types/launch";

export default function App() {
  const [authed, setAuthed] = useState(() => Boolean(auth.getToken()));
  const [source, setSource] = useState<LaunchSource | undefined>();
  const [category, setCategory] = useState<LaunchCategory | undefined>();
  const [search, setSearch] = useState("");

  const filters = useMemo(() => ({ source, category, search: search || undefined }), [
    source,
    category,
    search,
  ]);

  // The feed hook (and the socket connection it opens) only run once
  // we're authed — no point opening a socket pre-login just to have
  // the server's handshake auth check reject it.
  const { items, loading, error, connected } = useLaunchFeed(filters, authed);

  const liveIdsRef = useRef<Set<string>>(new Set());
  const prevLength = useRef(items.length);
  if (items.length > prevLength.current && items[0]?._id?.startsWith("live-")) {
    liveIdsRef.current.add(items[0]._id);
  }
  prevLength.current = items.length;

  function handleLogout() {
    auth.clearToken();
    setAuthed(false);
  }

  if (!authed) {
    return <LoginScreen onSuccess={() => setAuthed(true)} />;
  }

  return (
    <div className="min-h-screen">
      <Header connected={connected} totalVisible={items.length} onLogout={handleLogout} />
      <FilterBar
        source={source}
        category={category}
        search={search}
        onSourceChange={setSource}
        onCategoryChange={setCategory}
        onSearchChange={setSearch}
      />
      <Feed items={items} loading={loading} error={error} liveIds={liveIdsRef.current} />
    </div>
  );
}
