import { Gender } from 'src/app/api/models';

export interface CsvStudent {
  firstName: string;
  lastName: string;
  email: string;
  gender: string;
  id: string;
  semester: number;
  studyDegree: string;
  studyProgram: string;
  skillLevel: string; // introCourseProficiency
  nationality: string;

  [key: string]: any;
}
