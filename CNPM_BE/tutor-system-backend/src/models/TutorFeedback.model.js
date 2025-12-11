import mongoose from 'mongoose';

const TutorFeedbackSchema = new mongoose.Schema({
    tutorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tutor',
        required: true,
        index: true
    },
    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student',
        required: true,
        index: true
    },
    sessionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'TutorSession',
        required: true,
        index: true
    },
    attendanceStatus: {
        type: String,
        enum: ['PRESENT', 'ABSENT', 'LATE'],
        default: 'PRESENT'
    },
    progressScore: {
        type: Number,
        min: 0,
        max: 10
    },
    rating: {
        type: Number,
        min: 1,
        max: 5
    },
    content: {
        type: String,
        required: true
    },
    comment: { // Alias for content if needed, or separate
        type: String
    },
    evaluatedAt: {
        type: Date,
        default: Date.now,
        index: true
    }
}, {
    timestamps: true
});

// CRITICAL: Composite unique index - prevents duplicate evaluations
TutorFeedbackSchema.index(
    { tutorId: 1, studentId: 1, sessionId: 1 },
    { unique: true }
);

// Query optimization indexes
TutorFeedbackSchema.index({ studentId: 1, progressScore: 1 });
TutorFeedbackSchema.index({ sessionId: 1 });

export default mongoose.model('TutorFeedback', TutorFeedbackSchema);
