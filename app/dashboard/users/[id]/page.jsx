"use client";

import {
  Box,
  Button,
  Heading,
  HStack,
  Spinner,
  Text,
  Alert,
  AlertIcon,
  Stack,
  Divider,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { fetchUserById } from "@/lib/usersApi";
import { useParams, useRouter } from "next/navigation";

export default function UserDetailsPage() {
  const params = useParams();
  const router = useRouter();

  const userId = params.id;

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError("");

      try {
        const data = await fetchUserById(userId);

        if (cancelled) return;
        setUser(data);
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
  }, [userId]);

  return (
    <Box>
      <HStack justify="space-between" mb={4}>
        <Heading size="md">User Details</Heading>
        <Button variant="outline" onClick={() => router.back()}>
          Back
        </Button>
      </HStack>

      {error && (
        <Alert status="error" mb={4}>
          <AlertIcon />
          {error}
        </Alert>
      )}

      {loading ? (
        <HStack py={10} justify="center">
          <Spinner />
          <Text>Loading...</Text>
        </HStack>
      ) : user ? (
        <Box borderWidth="1px" borderRadius="lg" p={6} bg="white">
          <Stack spacing={4}>
            <Box>
              <Heading size="sm">
                {user.firstName} {user.lastName} ({user.username})
              </Heading>
              <Text opacity={0.8}>{user.email}</Text>
            </Box>

            <Divider />

            <HStack justify="space-between" flexWrap="wrap">
              <Text><b>ID:</b> {user.id}</Text>
              <Text><b>Age:</b> {user.age}</Text>
              <Text><b>Gender:</b> {user.gender}</Text>
              <Text><b>Phone:</b> {user.phone}</Text>
            </HStack>

            <Divider />

            <Box>
              <Heading size="xs" mb={2}>Address</Heading>
              <Text opacity={0.9}>
                {user.address?.address}, {user.address?.city}, {user.address?.state}
              </Text>
              <Text opacity={0.7}>
                Postal: {user.address?.postalCode} | Country: {user.address?.country}
              </Text>
            </Box>

            <Divider />

            <Box>
              <Heading size="xs" mb={2}>Company</Heading>
              <Text><b>Name:</b> {user.company?.name || "-"}</Text>
              <Text><b>Title:</b> {user.company?.title || "-"}</Text>
              <Text opacity={0.8}><b>Department:</b> {user.company?.department || "-"}</Text>
            </Box>
          </Stack>
        </Box>
      ) : (
        <Text opacity={0.7}>No user data.</Text>
      )}
    </Box>
  );
}