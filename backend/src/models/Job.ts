import mongoose, { Document, Schema } from "mongoose";

// Define the TypeScript interface for a Job document
// This helps give type safety when working with jobs in the code
export interface IJob extends Document {
  "Job ID (Numeric)"?: string;
  title?: string;
  company?: string;
  location?: string;
  job_link?: string;
  employment_type?: string;
  experience?: string;
  description?: string;
  employmentType?: string;
  experienceRange?: string;
  source?: string;
  country?: string;
  postedDateTime?: {
    $date?: string;
  };
  companyImageUrl?: string;
  min_exp?: number;
  max_exp?: number;
  postedDate?: Date;
  [key: string]: any; // Let’s allow any extra fields not explicitly listed
}

// Define the Mongoose schema for the Job collection
const JobSchema: Schema = new Schema(
  {
    "Job ID (Numeric)": { type: String },
    title: { type: String },
    company: { type: String },
    location: { type: String },
    job_link: { type: String },
    employment_type: { type: String },
    experience: { type: String },
    description: { type: String },
    employmentType: { type: String },
    experienceRange: { type: String },
    source: { type: String },
    country: { type: String },
    postedDateTime: {
      $date: { type: String },
    },
    companyImageUrl: { type: String },
    min_exp: { type: Number },
    max_exp: { type: Number },
    postedDate: { type: Date },
  },
  {
    // This tells Mongoose to allow saving extra fields not defined here
    strict: false,
  }
);

// Finally, export the Job model so we can use it elsewhere in the app
export default mongoose.model<IJob>("Job", JobSchema);
