export function cleanAddress(rawText: string): string {
    let address = rawText;
  
    // Step 1: Remove unwanted symbols and junk patterns
    address = address.replace(/[~“”'"`;:!@#$%^&*_=+\[\]{}<>\\|]/g, ' ');
  
    // Step 2: Collapse multiple spaces to single space
    address = address.replace(/\s+/g, ' ').trim();
  
    // Step 3: Remove known garbage-like words (OCR noise)
    const garbageWords = [
      "Ce", "EEE", "Ul", "os", "Hyiohe", "Treva", "te", "SHAT", "ha", "HRS", "FA", "g", "omen", "me", "Ak", "gues"
    ];
  
    garbageWords.forEach(noise => {
      const pattern = new RegExp(`\\b${noise}\\b`, "gi");
      address = address.replace(pattern, '').replace(/\s+/g, ' ').trim();
    });
  
    // Step 4: Ensure PO, DIST, State, and Pincode are preserved and capitalized
    address = address.replace(/\b(po|dist|kerala)\b/gi, match => match.toUpperCase());
  
    return address;
  }
  