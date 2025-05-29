const asyncHandler = require('express-async-handler');
const Poll = require('../models/pollModel');
const { option } = require('yargs');
const { text } = require('body-parser');
const { error } = require('console');

// To get all poolls with public access
// GET
const getPolls = asyncHandler(async(req, res) => {
    const polls = await Poll.find().populate('creator', 'name');
    res.status(200).json(polls);
});

// To create polls
// POST
const createPoll = asyncHandler(async (req, res) => {
    const { title, description, options, endDate } = req.body;

    if (!title || !description || !options || !endDate) {
        res.status(400);
        throw new Error('Please provide all required fields');
    }

    const poll = await Poll.create({
        title,
        description,
        options: options.map(option => ({ text: option })),
        creator: req.user.id,
        endDate,
    });

    res.status(201).json(poll);
});

// to get single poll
// GET
const getPoll = asyncHandler(async(req, res) => {
    const Poll = await Poll.findById(req.params.id).populate('creator', 'name');

    if (!poll) {
        res.status(400);
        throw new Error('Poll not found!');
    }

    res.status(200).json(poll);
});

//to update polls
// PUT
const updatePoll = asyncHandler(async(req, res) => {
    const Poll = await Poll.findById(req.params.id);

    if (!poll) {
        res.status(400);
        throw new Error('Poll not found');
    }

    if (poll.creatot.toString() !== req.user.id) {
        res.status(401);
        throw new Error('Not authorized to update this poll');
    }

    const updatedPoll = await Poll.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
    });

    res.status(200).json(updatedPoll);
});

// Delete Poll
// DELETE
const deletePoll = asyncHandler(async (req, res) => {
    const Poll = await Poll.findByID(req.params.id);

    if (!poll) {
        res.status(404);
        throw new Error('Poll not found');
    }

    if (poll.creator.toString() !== req.user.id) {
        res.status(401);
        throw new Error('Not authorized to delete this poll');
    }

    await poll.remove();

    res.status(200).json({ id: req.params.id });
})

// casting vote on polls
// POST
const castVote = asyncHandler(async(req, res) => {
    const { optionIndex } = req.body;
    const poll = await Poll.findByID(req.params.id);

    if (!poll) {
        res.status(404);
        throw new Error('Poll not found');
    }
    
    if (!poll.isActive || newDate() > new Date(poll.endDate)) {
        res.status(400);
        throw new Error('Poll is no longer active');
    }

    if (poll.voters.includes(req.user.id)) {
        res.status(400);
        throw new Error('You have already voted on this poll.');
    }

    if (optionIndex < 0 || optionIndex >= poll.options.length) {
        res.status(400);
        throw new Error('Invalid option selected');
    }

    poll.options[optionIndex].votes += 1;
    poll.voters.push(req.user.id);

    await UserActivation.findByIdAndUpdate(req.user.id, {
        $push: { votedPolls: poll._id }
    })

    await poll.save();

    res.status(200).json(poll);
});

module.exports = {
    getPolls,
    createPoll,
    getPoll,
    updatePoll,
    deletePoll,
    castVote,
};

