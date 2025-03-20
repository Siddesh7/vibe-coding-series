import { google } from 'googleapis';

// Initialize Google Sheets API
const auth = new google.auth.GoogleAuth({
  credentials: JSON.parse(process.env.GOOGLE_SHEETS_CREDENTIALS || '{}'),
  scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
});

const sheets = google.sheets({ version: 'v4', auth });

export interface StreamData {
  id: number;
  title: string;
  projectNumber: number;
  date: string;
  time: string;
  description: string;
  status: "completed" | "in-progress";
  thumbnail?: string;
  link?: string;
  links: {
    type: "twitter" | "youtube" | "github" | "demo";
    label: string;
    url: string;
  }[];
}

export async function getStreamsFromSheet(): Promise<StreamData[]> {
  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range: 'A2:I',
    });

    const rows = response.data.values;
    if (!rows) return [];

    return rows.map((row: any[], index: number) => ({
      id: index + 1,
      title: row[0] || '',
      projectNumber: parseInt(row[1]) || 0,
      date: row[2] ? formatSheetDate(row[2]) : '',
      time: row[3] ? formatSheetTime(row[3]) : '',
      description: row[4] || '',
      status: row[5] as "completed" | "in-progress",
      thumbnail: row[6] || undefined,
      link: row[7] || undefined,
      links: parseLinks(row[8] || ''),
    }));
  } catch (error) {
    console.error('Error fetching data from Google Sheets:', error);
    return [];
  }
}

function parseLinks(linksString: string) {
  try {
    return JSON.parse(linksString);
  } catch {
    return [];
  }
}

function formatSheetDate(dateString: string) {
  if (!dateString) return '';
  // Handle "Apr 10, 2025" format
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return ''; // Invalid date
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }); // Returns "Apr 10, 2025"
  } catch {
    return '';
  }
}

function formatSheetTime(timeString: string) {
  if (!timeString) return '';
  // Clean up any trailing characters like \r and return as-is
  return timeString.trim().replace(/[\r\n]/g, '');
}