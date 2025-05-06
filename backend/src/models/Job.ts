import mongoose, { Document, Schema } from "mongoose";

// Define the interface for the Job document
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
  [key: string]: any; // Allow any additional fields
}

// Create the Job schema
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
    strict: false, // Allow additional fields not defined in schema
  }
);

// Export the Job model
export default mongoose.model<IJob>("Job", JobSchema);
