import { AadharData } from "../interfaces/IAadhar";

export default function extractAadhaarInfo(text: string): AadharData {
  const data: AadharData = {};

  const nameMatch = text.match(/([A-Z][a-z]+\s?){2,3}/);
  if (nameMatch) data.name = nameMatch[0].trim();
  const dobMatch = text.match(/DOB\s*[:\-]?\s*(\d{2}\/\d{2}\/\d{4})/i);
  if (dobMatch) data.dob = dobMatch[1];
  const genderMatch = text.match(/\b(Male|Female|Transgender)\b/i);
  if (genderMatch) data.gender = genderMatch[0];
  const numberMatch = text.match(/\b\d{4}\s\d{4}\s\d{4}\b/);
  if (numberMatch) data.aadharNumber = numberMatch[0].replace(/\s/g, '');

  data.success = true;
  data.message = 'Data extracted successfully from front side.';
  return data;
}
