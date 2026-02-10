"use client";

import { Box, Button, Container, Heading, Input, Stack, Text } from "@chakra-ui/react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("kminchelle");
  const [password, setPassword] = useState("0lelplR");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      localStorage.setItem("token", "FAKE_TOKEN");
      router.push("/dashboard");
    }, 600);
  };

  return (
    <Container maxW="md" py={12}>
      <Box borderWidth="1px" borderRadius="lg" p={6}>
        <Heading size="md" mb={2}>ورود</Heading>
        <Text mb={6} opacity={0.8}>
          فعلاً لاگین نمایشی است؛ در مرحله بعد به DummyJSON وصلش می‌کنیم.
        </Text>

        <form onSubmit={onSubmit}>
          <Stack spacing={4}>
            <Input
              placeholder="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <Input
              placeholder="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button type="submit" isLoading={loading} colorScheme="teal">
              ورود
            </Button>
          </Stack>
        </form>
      </Box>
    </Container>
  );
}