export interface ThaiIDInfo {
  isValid: boolean;               // เลขนี้ถูกต้องตามสูตรคณิตศาสตร์ไหม
  personType: string;             // ประเภทบุคคล (หลักที่ 1)
  provinceCode: string;           // รหัสจังหวัด (หลักที่ 2-3)
  districtCode: string;           // รหัสอำเภอ/เขต (หลักที่ 4-5)
  birthCertificateBookNo: string; // กลุ่มของบุคคล หรือ เล่มที่ของสูติบัตร (หลักที่ 6-10)
  sequenceNo: string;             // ลำดับที่ของบุคคลในกลุ่ม (หลักที่ 11-12)
  checkDigit: string;             // ตัวเลขตรวจสอบความถูกต้อง (หลักที่ 13)
}

/**
 * 1. ตรวจสอบความถูกต้องของเลขบัตรประชาชน (สูตรคณิตศาสตร์หลักที่ 13)
 */
export function validateThaiID(id: string): boolean {
  const cleanID = id.replace(/-/g, '').trim();
  if (!/^\d{13}$/.test(cleanID)) return false;
  
  let sum = 0;
  for (let i = 0; i < 12; i++) {
    sum += parseInt(cleanID.charAt(i)) * (13 - i);
  }
  
  const checkDigit = (11 - (sum % 11)) % 10;
  return checkDigit === parseInt(cleanID.charAt(12));
}

/**
 * 2. จัด Format เลขบัตรประชาชนให้สวยงาม (ใส่ขีด)
 * ตัวอย่าง: 1100100123456 -> 1-1001-00123-45-6
 */
export function formatThaiID(id: string): string {
  const cleanID = id.replace(/-/g, '').trim();
  if (cleanID.length !== 13) return id;
  return `${cleanID.charAt(0)}-${cleanID.substring(1, 5)}-${cleanID.substring(5, 10)}-${cleanID.substring(10, 12)}-${cleanID.charAt(12)}`;
}

/**
 * 3. เซ็นเซอร์เลขบัตรประชาชนเพื่อความปลอดภัยตามกฎหมาย PDPA (Privacy Masking)
 * ตัวอย่าง: 1-1001-XXXXX-XX-6
 */
export function maskThaiID(id: string): string {
  const formatted = formatThaiID(id);
  if (formatted.length !== 17) return id;
  return `${formatted.substring(0, 7)}XXXXX-XX${formatted.substring(15)}`;
}

/**
 * 4. สุ่มเลขบัตรประชาชนที่ถูกต้องตามหลักคณิตศาสตร์ (Valid Mock ID Generator)
 */
export function generateMockThaiID(): string {
  let result = '';
  let sum = 0;

  const firstDigit = Math.floor(Math.random() * 8) + 1;
  result += firstDigit;
  sum += firstDigit * 13;

  for (let i = 1; i < 12; i++) {
    const digit = Math.floor(Math.random() * 10);
    result += digit;
    sum += digit * (13 - i);
  }

  const checkDigit = (11 - (sum % 11)) % 10;
  result += checkDigit;

  return result;
}

/**
 * 5. แกะข้อมูลเชิงลึกจากเลขบัตรประชาชน 13 หลัก (Information Extractor)
 */
export function extractThaiIDInfo(id: string): ThaiIDInfo {
  const cleanID = id.replace(/-/g, '').trim();
  const isValid = validateThaiID(cleanID);
  
  if (cleanID.length !== 13) {
    return { 
      isValid: false, 
      personType: 'Unknown', 
      provinceCode: '', 
      districtCode: '',
      birthCertificateBookNo: '',
      sequenceNo: '',
      checkDigit: ''
    };
  }

  const firstDigit = cleanID.charAt(0);
  let personType = 'บุคคลประเภทอื่นๆ';
  
  switch (firstDigit) {
    case '1': personType = 'คนที่เกิดและมีสัญชาติเป็นคนไทย และแจ้งเกิดภายในกำหนดเวลา'; break;
    case '2': personType = 'คนที่เกิดและมีสัญชาติไทย แต่แจ้งเกิดเกินกำหนดเวลาที่กำหนด'; break;
    case '3': personType = 'คนไทยและคนต่างด้าวที่มีใบสำคัญประจำตัวคนต่างด้าว และมีชื่อในทะเบียนบ้านสมัยเริ่มแรก'; break;
    case '4': personType = 'คนไทยและคนต่างด้าวที่มีใบสำคัญต่างด้าว แต่แจ้งย้ายเข้าโดยยังไม่มีเลขประจำตัวประชาชนตั้งแต่เริ่มแรก'; break;
    case '5': personType = 'คนไทยที่ได้รับอนุมัติให้เพิ่มชื่อเข้าไปในทะเบียนบ้านจากการตกสำรวจ หรือเป็นกรณีที่มี 2 สัญชาติ'; break;
    case '6': personType = 'คนที่ไม่ได้เข้าเมืองมาตามกฎหมาย หรือคนที่เข้าเมืองมาตามกฎหมายก็จริงแต่ยังไม่ได้สัญชาติไทยหรืออยู่ในลักษณะชั่วคราว'; break;
    case '7': personType = 'บุตรของบุคคลประเภทที่ 6 ที่เกิดในประเทศไทย'; break;
    case '8': personType = 'คนต่างด้าวที่อาศัยอยู่ในประเทศไทยอย่างถูกต้องตามกฎหมาย คนที่ได้รับใบสำคัญประจำตัวคนต่างด้าวหรือได้รับการแปลงสัญชาติเป็นสัญชาติไทยแล้ว'; break;
  }

  const provinceCode = cleanID.substring(1, 3);
  const districtCode = cleanID.substring(3, 5);
  const birthCertificateBookNo = cleanID.substring(5, 10);
  const sequenceNo = cleanID.substring(10, 12);
  const checkDigit = cleanID.charAt(12);

  return { 
    isValid, 
    personType, 
    provinceCode, 
    districtCode,
    birthCertificateBookNo,
    sequenceNo,
    checkDigit
  };
}