import mongoose from 'mongoose';

const ReportSchema = new mongoose.Schema({
  url: { type: String, required: true },
  keywords: { type: [String], required: true },
  analysis: {
    metaTags: Object,
    keywordDensity: Object,
    pageSpeed: Object,
    mobileFriendly: Boolean,
    readabilityScore: Number,
    semanticClarity: String,
  },
  createdAt: { type: Date, default: Date.now },
});

const Report = mongoose.model('Report', ReportSchema);

export default Report;
