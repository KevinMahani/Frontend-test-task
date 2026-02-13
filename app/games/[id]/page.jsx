"use client";

import {
  Box,
  Button,
  Heading,
  HStack,
  Image,
  Spinner,
  Stack,
  Text,
  Badge,
  Divider,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { rawgGet } from "@/lib/rawgApi";
import { useParams, useRouter } from "next/navigation";

export default function GameDetailsPage() {
  const { id } = useParams();
  const router = useRouter();

  const [game, setGame] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError("");

      try {
        const data = await rawgGet(`games/${id}`);
        if (cancelled) return;
        setGame(data);
      } catch (e) {
        if (cancelled) return;
        setError(e.message || "Error");
      } finally {
        if (cancelled) return;
        setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [id]);

  return (
    <Box p={6}>
      <HStack justify="space-between" mb={4}>
        <Heading size="md">Game Details</Heading>
        <Button variant="outline" onClick={() => router.back()}>
          Back
        </Button>
      </HStack>

      {loading ? (
        <HStack py={10} justify="center">
          <Spinner />
          <Text>Loading...</Text>
        </HStack>
      ) : error ? (
        <Text color="red.500">{error}</Text>
      ) : game ? (
        <Box borderWidth="1px" borderRadius="lg" overflow="hidden" bg="white">
          <Image
            src={game.background_image || "/placeholder.png"}
            alt={game.name}
            h="300px"
            w="100%"
            objectFit="cover"
          />
          <Box p={6}>
            <Stack spacing={3}>
              <Heading size="md">{game.name}</Heading>

              <HStack spacing={2} flexWrap="wrap">
                {game.rating ? <Badge>Rating: {game.rating}</Badge> : null}
                {game.metacritic ? <Badge colorScheme="green">Metacritic: {game.metacritic}</Badge> : null}
                {game.released ? <Badge>Released: {game.released}</Badge> : null}
              </HStack>

              <Divider />

              <Text opacity={0.85}>
                <b>Genres:</b>{" "}
                {Array.isArray(game.genres) && game.genres.length
                  ? game.genres.map((g) => g.name).join(", ")
                  : "-"}
              </Text>

              <Text opacity={0.85}>
                <b>Platforms:</b>{" "}
                {Array.isArray(game.platforms) && game.platforms.length
                  ? game.platforms.map((p) => p.platform?.name).filter(Boolean).join(", ")
                  : "-"}
              </Text>

              <Divider />

              <Text opacity={0.9} whiteSpace="pre-wrap">
                {game.description_raw || "No description."}
              </Text>
            </Stack>
          </Box>
        </Box>
      ) : null}
    </Box>
  );
}