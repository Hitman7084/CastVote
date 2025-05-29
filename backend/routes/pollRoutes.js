const express = require('express');
const router = express.router();
const {
    getPolls,
    createPoll,
    getPoll,
    updatePoll,
    deletePoll,
    castVote,
} = require('../controllers/pollController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').get(getPolls).post(protect, creqtePoll);
router.route('/:id').get(getPoll).put(protect, updatePoll).delete(protect, deletePoll);
router.post('/:id/vote', protect, castVote);

module.exports = router;