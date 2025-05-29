import React, { useEffect, useState } from 'react';
import { Box, Container, Heading, SimpleGrid, Text, Badge, Button} from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import axios from 'axios';
import { Poll } from '../types/api';

const Home: React.FC = () => {
  const [polls, setPolls] = useState<Poll[]>([]);

  useEffect(() => {
    const fetchPolls = async () => {
      try {
        const response = await axios.get<Poll[]>('http://localhost:5000/api/polls');
        setPolls(response.data);
      }
      catch (error) {
        console.error('Error fetching polls:', error);
      }
    };
    fetchPolls();
  }, []);

  return (
    <Container maxW="container.xml" py = {8}>
      <Heading mb={6}>Active Polls</Heading>
      <SimpleGrid columns={{ base: 1, md: 2, lg: 3}} spacing={6}>
        { polls.map((poll) => (
          <Box 
          key={poll._id}
          p={6}
          borderWidth={1}
          borderRadius="lg"
          boxShadow="md"
          transition="transform 0.2s"
          _hover={{ transform: 'translateY(-5px)' }}
          >
            <Heading size="md" mb={2}>
              { poll.title }
            </Heading>
            <Text color="gray.600" noOfLines={2} mb={4}>
              { poll.description }
            </Text>
            <Text fontSize={"sm"} mb={2}>
              Created by: { poll.creator.name }
            </Text>
            <Badge colorScheme={ poll.isActive ? 'green' : 'red'} mb={4}>
              { poll.isActive ? 'Active' : 'Closed'}
            </Badge>
            <RouterLink to={ `/polls/${ poll._id }` }>
              <Button colorScheme="teal" width="full">
                View Poll
              </Button>
            </RouterLink>
          </Box>
        ))}
      </SimpleGrid>
    </Container>
  );
};

export default Home