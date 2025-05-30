import React, { useState } from 'react';
import { Box, Button, Container, FormControl, FormLabel, Heading, Input, Stack, useToast, IconButton } from '@chakra-ui/react';
import { AddIcon, DeleteIcon } from '@chakra-ui/icons';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Poll } from '../types/api';

const CreatePoll: React.FC = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [options, setOptions] = useState(['', '']);
  const [endDate, setEndDate] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const toast = useToast();
  const { user } = useAuth();

  const addOption = () => {
    setOptions([...options, '']);
  };

  const removeOption = (index: number) => {
    if (options.length > 2) {
      const newOptions = options.filter((_, i) => i !== index);
      setOptions(newOptions);
    }
  };

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post<Poll>(
        'http://localhost:5000/api/polls',
        {
          title,
          description,
          options,
          endDate,
        },
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        }
      );

      toast({
        title: 'Poll created successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      navigate(`/polls/${response.data._id}`);
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
    <Container maxW="container.sm" py={8}>
      <Box p={8} borderWidth={1} borderRadius="lg" boxShadow="lg">
        <Heading mb={6} textAlign="center">
          Create New Poll
        </Heading>
        <form onSubmit={handleSubmit}>
          <Stack spacing={4}>
            <FormControl isRequired>
              <FormLabel>Title</FormLabel>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Description</FormLabel>
              <Input
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Options</FormLabel>
              <Stack spacing={2}>
                {options.map((option, index) => (
                  <Stack key={index} direction="row">
                    <Input
                      value={option}
                      onChange={(e) => handleOptionChange(index, e.target.value)}
                      placeholder={`Option ${index + 1}`}
                    />
                    {options.length > 2 && (
                      <IconButton
                        aria-label="Remove option"
                        icon={<DeleteIcon />}
                        onClick={() => removeOption(index)}
                      />
                    )}
                  </Stack>
                ))}
                <Button
                  leftIcon={<AddIcon />}
                  onClick={addOption}
                  size="sm"
                  colorScheme="teal"
                  variant="ghost"
                >
                  Add Option
                </Button>
              </Stack>
            </FormControl>
            <FormControl isRequired>
              <FormLabel>End Date</FormLabel>
              <Input
                type="datetime-local"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                min={new Date().toISOString().slice(0, 16)}
              />
            </FormControl>
            <Button
              type="submit"
              colorScheme="teal"
              size="lg"
              fontSize="md"
              isLoading={loading}
            >
              Create Poll
            </Button>
          </Stack>
        </form>
      </Box>
    </Container>
  );
};

export default CreatePoll; 