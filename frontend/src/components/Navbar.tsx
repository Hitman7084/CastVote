import React from 'react';
import { Box, Flex, Button, useColorModeValue, Stack, useColorMode, Container, Heading, IconButton } from '@chakra-ui/react';
import { MoonIcon, SunIcon } from '@chakra-ui/icons';
import { Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar: React.FC = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const { user, logout } = useAuth();
  
  return (
    <Box
      bg={useColorModeValue('white', 'gray.800')}
      px={4}
      boxShadow="sm"
      position="sticky"
      top={0}
      zIndex={999}
    >
      <Container maxW="container.xl">
        <Flex h={16} alignItems="center" justifyContent="space-between">
          <RouterLink to="/">
            <Heading
              size="lg"
              bgGradient="linear(to-r, blue.400, teal.400)"
              bgClip="text"
              fontWeight="extrabold"
            >
              CastVote
            </Heading>
          </RouterLink>

          <Flex alignItems="center">
            <Stack direction="row" spacing={4} alignItems="center">
              <IconButton
                aria-label="Toggle color mode"
                icon={colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
                onClick={toggleColorMode}
                variant="ghost"
                colorScheme="blue"
              />
              
              {user ? (
                <>
                  <Button
                    as={RouterLink}
                    to="/create-poll"
                    colorScheme="blue"
                    variant="ghost"
                  >
                    Create Poll
                  </Button>
                  <Button
                    onClick={logout}
                    colorScheme="red"
                    variant="ghost"
                  >
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    as={RouterLink}
                    to="/login"
                    colorScheme="blue"
                    variant="ghost"
                  >
                    Login
                  </Button>
                  <Button
                    as={RouterLink}
                    to="/register"
                    colorScheme="blue"
                    variant="solid"
                  >
                    Sign Up
                  </Button>
                </>
              )}
            </Stack>
          </Flex>
        </Flex>
      </Container>
    </Box>
  );
};

export default Navbar; 