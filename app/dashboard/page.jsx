"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Container, Heading, Button, Stack } from "@chakra-ui/react";

export default function DashboardPage() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.replace("/login");
    }
  }, [router]);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/login");
  };

  return (
    <Container maxW="lg" py={12}>
      <Stack spacing={4}>
        <Heading size="md">Dashboard</Heading>
        <Button onClick={logout} variant="outline">
          خروج
        </Button>
      </Stack>
    </Container>
  );
}