"use client";

import { Box, Button, Container, Heading, Stack, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.replace("/login");
      return;
    }
    setReady(true);
  }, [router]);

  const logout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  if (!ready) return null;

  return (
    <Container maxW="lg" py={12}>
      <Box borderWidth="1px" borderRadius="lg" p={6}>
        <Stack spacing={4}>
          <Heading size="md">Dashboard</Heading>
          <Text opacity={0.8}>
            مرحله بعد: لاگین واقعی + Dashboard Layout + Users/Products با DummyJSON
          </Text>
          <Button onClick={logout} variant="outline">
            خروج
          </Button>
        </Stack>
      </Box>
    </Container>
  );
}