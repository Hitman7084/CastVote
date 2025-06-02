import React, { useState } from 'react';
import { Box, Button, Container, FormControl, FormLabel, Heading, Input, useToast, Text, useColorModeValue, VStack, Link } from '@chakra-ui/react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { User } from '../types/api';

const Register: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const toast = useToast();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post<User>('http://localhost:5000/api/users', {
        name,
        email,
        password,
      });

      login(response.data);
      toast({
        title: 'Registration successful',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      navigate('/');
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'An error occurred',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxW="container.sm">
      <Box
        bg={useColorModeValue('white', 'gray.700')}
        p={8}
        rounded="xl"
        shadow="lg"
        w="full"
      >
        <VStack spacing={6} align="stretch">
          <Heading
            textAlign="center"
            size="xl"
            bgGradient="linear(to-r, blue.400, teal.400)"
            bgClip="text"
            mb={2}
          >
            Create Your Account
          </Heading>
          <Text textAlign="center" color={useColorModeValue('gray.600', 'gray.400')}>
            Welcome to CastVote
          </Text>

          <form onSubmit={handleSubmit}>
            <VStack spacing={4}>
              <FormControl isRequired>
                <FormLabel>Full Name</FormLabel>
                <Input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your full name"
                  size="lg"
                  bg={useColorModeValue('gray.50', 'gray.600')}
                  border={0}
                  _focus={{
                    bg: useColorModeValue('white', 'gray.800'),
                    ring: '2px',
                    ringColor: 'blue.500',
                  }}
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Email address</FormLabel>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  size="lg"
                  bg={useColorModeValue('gray.50', 'gray.600')}
                  border={0}
                  _focus={{
                    bg: useColorModeValue('white', 'gray.800'),
                    ring: '2px',
                    ringColor: 'blue.500',
                  }}
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Password</FormLabel>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  size="lg"
                  bg={useColorModeValue('gray.50', 'gray.600')}
                  border={0}
                  _focus={{
                    bg: useColorModeValue('white', 'gray.800'),
                    ring: '2px',
                    ringColor: 'blue.500',
                  }}
                />
              </FormControl>

              <Button
                type="submit"
                colorScheme="blue"
                size="lg"
                fontSize="md"
                isLoading={loading}
                w="full"
                mt={4}
              >
                Sign Up
              </Button>
            </VStack>
          </form>

          <Text textAlign="center" mt={4}>
            Already have an account?{' '}
            <Link
              as={RouterLink}
              to="/login"
              color="blue.500"
              _hover={{ textDecoration: 'underline' }}
            >
              Login here
            </Link>
          </Text>
        </VStack>
      </Box>
    </Container>
  );
};

export default Register; 