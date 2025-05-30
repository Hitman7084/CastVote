import React, { useEffect, useState } from 'react';
import { Box, Container, Heading, Text, Stack, Radio, RadioGroup, Button, Progress, useToast, Badge } from '@chakra-ui/react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Poll } from '../types/api';

const PollDetails: React.FC = () => {
  const [poll, setPoll] = useState<Poll | null>(null);
  const [selectedOption, setSelectedOption] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const toast = useToast();
  const { user } = useAuth();

  useEffect(() => {
    const fetchPoll = async () => {
      try {
        const response = await axios.get<Poll>(`http://localhost:5000/api/polls/${id}`);
        setPoll(response.data);
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to fetch poll details',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
        navigate('/');
      }
    };

    fetchPoll();
  }, [id, navigate, toast]);

  const handleVote = async () => {
    if (!user) {
      toast({
        title: 'Error',
        description: 'Please login to vote',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      navigate('/login');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post<Poll>(
        `http://localhost:5000/api/polls/${id}/vote`,
        {
          optionIndex: poll?.options.findIndex(
            (option) => option._id === selectedOption
          ),
        },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      setPoll(response.data);
      toast({
        title: 'Success',
        description: 'Vote cast successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to cast vote',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  if (!poll) {
    return null;
  }

  const totalVotes = poll.options.reduce((sum, option) => sum + option.votes, 0);
  const hasVoted = user && poll.voters.includes(user._id);
  const isExpired = new Date() > new Date(poll.endDate);

  return (
    <Container maxW="container.md" py={8}>
      <Box p={8} borderWidth={1} borderRadius="lg" boxShadow="lg">
        <Stack spacing={6}>
          <Box>
            <Heading size="lg" mb={2}>
              {poll.title}
            </Heading>
            <Text color="gray.600" mb={4}>
              {poll.description}
            </Text>
            <Text fontSize="sm" mb={2}>
              Created by: {poll.creator.name}
            </Text>
            <Badge
              colorScheme={!isExpired && poll.isActive ? 'green' : 'red'}
              mb={4}
            >
              {!isExpired && poll.isActive ? 'Active' : 'Closed'}
            </Badge>
          </Box>

          <RadioGroup value={selectedOption} onChange={setSelectedOption}>
            <Stack spacing={4}>
              {poll.options.map((option) => (
                <Box key={option._id} p={4} borderWidth={1} borderRadius="md">
                  <Stack spacing={2}>
                    <Radio value={option._id} isDisabled={hasVoted || isExpired}>
                      {option.text}
                    </Radio>
                    <Progress
                      value={(option.votes / (totalVotes || 1)) * 100}
                      colorScheme="teal"
                      size="sm"
                    />
                    <Text fontSize="sm" color="gray.600">
                      {option.votes} vote{option.votes !== 1 ? 's' : ''} (
                      {totalVotes
                        ? Math.round((option.votes / totalVotes) * 100)
                        : 0}
                      %)
                    </Text>
                  </Stack>
                </Box>
              ))}
            </Stack>
          </RadioGroup>

          <Button
            colorScheme="teal"
            isLoading={loading}
            onClick={handleVote}
            isDisabled={!selectedOption || hasVoted || isExpired || !poll.isActive}
          >
            {hasVoted
              ? 'Already Voted'
              : isExpired
              ? 'Poll Ended'
              : !poll.isActive
              ? 'Poll Closed'
              : 'Cast Vote'}
          </Button>

          <Text fontSize="sm" color="gray.600">
            Poll ends at: {new Date(poll.endDate).toLocaleString()}
          </Text>
        </Stack>
      </Box>
    </Container>
  );
};

export default PollDetails; 