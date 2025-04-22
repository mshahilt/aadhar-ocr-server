import { AadharData } from "../interfaces/IAadhar";
import { cleanAddress } from "./cleanAddress";

export default function extractBackAadhaarInfo(text: string): AadharData {
  const data: AadharData = {
    address: '',
    aadharNumber: '',
    success: false,
    message: 'Failed to extract data.',
  };

  const addressMatch = text.match(/Address[:\s]*([\s\S]*?)\b\d{6}\b/);
  if (addressMatch) {
    data.address = cleanAddress(addressMatch[1].replace(/\n/g, ' ').trim());
  }

  const pincodeMatch = text.match(/\b\d{6}\b/);
  if (pincodeMatch) {
    data.address = `${data.address} ${pincodeMatch[0]}`.trim();
  }
  const numberMatch = text.match(/\b\d{4}\s\d{4}\s\d{4}\b/);
  if (numberMatch) {
    data.aadharNumber = numberMatch[0].replace(/\s/g, '');
  }

  if (data.address || data.aadharNumber) {
    data.success = true;
    data.message = 'Data extracted successfully from back side.';
  }

  return data;
}
