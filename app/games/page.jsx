"use client";

import {
  Box,
  Button,
  Heading,
  HStack,
  Input,
  Select,
  SimpleGrid,
  Spinner,
  Text,
  Image,
  Badge,
} from "@chakra-ui/react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { rawgGet } from "@/lib/rawgApi";
import { useDebouncedValue } from "@/lib/useDebouncedValue";

export default function GamesPage() {
  const PAGE_SIZE = 12;

  const [search, setSearch] = useState("");
  const debouncedSearch = useDebouncedValue(search, 400);

  const [ordering, setOrdering] = useState("-rating");
  const [genre, setGenre] = useState("");

  const [platform, setPlatform] = useState(""); // parent platform id
  const [platforms, setPlatforms] = useState([]);

  const [page, setPage] = useState(1);

  const [genres, setGenres] = useState([]);

  const [items, setItems] = useState([]);
  const [count, setCount] = useState(0);

  const [loading, setLoading] = useState(false);
  const [metaLoading, setMetaLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => setPage(1), [debouncedSearch, ordering, genre, platform]);

    useEffect(() => {
    let cancelled = false;

    async function loadMeta() {
        setMetaLoading(true);
        try {
        const [g, p] = await Promise.all([
            rawgGet("genres", { page_size: 40 }),
            rawgGet("platforms/lists/parents", { page_size: 20 }),
        ]);

        if (cancelled) return;

        setGenres(g.results || []);
        setPlatforms(p.results || []);
        } finally {
        if (cancelled) return;
        setMetaLoading(false);
        }
    }

    loadMeta();
    return () => {
        cancelled = true;
    };
    }, []);

  // گرفتن لیست بازی‌ها
  useEffect(() => {
    let cancelled = false;

    async function loadGames() {
      setLoading(true);
      setError("");

      try {
        const data = await rawgGet("games", {
          page,
          page_size: PAGE_SIZE,
          search: debouncedSearch.trim(),
          ordering,
          genres: genre, 
          parent_platforms: platform,
        });

        if (cancelled) return;

        setItems(data.results || []);
        setCount(data.count || 0);
      } catch (e) {
        if (cancelled) return;
        setError(e.message || "Error");
      } finally {
        if (cancelled) return;
        setLoading(false);
      }
    }

    loadGames();
    return () => {
      cancelled = true;
    };
  }, [page, debouncedSearch, ordering, genre]);

  const totalPages = useMemo(() => Math.max(1, Math.ceil(count / PAGE_SIZE)), [count]);

  return (
    <Box p={6}>
      <HStack justify="space-between" mb={4} flexWrap="wrap" spacing={4}>
        <Heading size="md">Games</Heading>

        <HStack spacing={3} flexWrap="wrap">
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search games..."
            w={{ base: "260px", md: "340px" }}
          />

          <Select value={ordering} onChange={(e) => setOrdering(e.target.value)} w="220px">
            <option value="-rating">Top rating</option>
            <option value="-metacritic">Top metacritic</option>
            <option value="-released">Newest</option>
            <option value="name">Name (A-Z)</option>
          </Select>

          <Select
            value={genre}
            onChange={(e) => setGenre(e.target.value)}
            w="220px"
            isDisabled={metaLoading}
          >
            <option value="">All genres</option>
            {genres.map((g) => (
              <option key={g.id} value={g.slug}>
                {g.name}
              </option>
            ))}
          </Select>

          <Select
                value={platform}
                onChange={(e) => setPlatform(e.target.value)}
                w="220px"
                isDisabled={metaLoading}
                >
                <option value="">All platforms</option>
                {platforms.map((p) => (
                    <option key={p.id} value={p.id}>
                    {p.name}
                    </option>
                ))}
          </Select>

          <Button
            variant="outline"
            onClick={() => {
              setSearch("");
              setGenre("");
              setOrdering("-rating");
              setPage(1);
              setPlatform("");
            }}
          >
            Reset
          </Button>
        </HStack>
      </HStack>

      {error ? (
        <Box p={4} borderWidth="1px" borderRadius="md">
          <Text color="red.500">{error}</Text>
        </Box>
      ) : null}

      {loading ? (
        <HStack py={10} justify="center">
          <Spinner />
          <Text>Loading games...</Text>
        </HStack>
      ) : (
        <>
          <Text opacity={0.75} mb={3}>
            Page {page} / {totalPages} — Results: {count}
          </Text>

          <SimpleGrid columns={{ base: 1, sm: 2, md: 3, lg: 4 }} spacing={4}>
            {items.map((game) => (
              <Box
                key={game.id}
                borderWidth="1px"
                borderRadius="lg"
                overflow="hidden"
                bg="white"
              >
                <Image
                  src={game.background_image || "/placeholder.png"}
                  alt={game.name}
                  h="160px"
                  w="100%"
                  objectFit="cover"
                />
                <Box p={3}>
                  <HStack justify="space-between" mb={2}>
                    <Text fontWeight="bold" noOfLines={1}>
                      {game.name}
                    </Text>
                    {game.rating ? <Badge>{game.rating}</Badge> : null}
                  </HStack>

                  <Text opacity={0.75} fontSize="sm" mb={3} noOfLines={2}>
                    Released: {game.released || "-"}
                  </Text>

                  <Button as={Link} href={`/games/${game.id}`} size="sm" w="100%">
                    Details
                  </Button>
                </Box>
              </Box>
            ))}
          </SimpleGrid>

          <HStack justify="center" mt={6} spacing={3}>
            <Button onClick={() => setPage((p) => Math.max(1, p - 1))} isDisabled={page <= 1}>
              Prev
            </Button>
            <Button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              isDisabled={page >= totalPages}
            >
              Next
            </Button>
          </HStack>
        </>
      )}
    </Box>
  );
}