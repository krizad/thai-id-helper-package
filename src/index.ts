// ─── Branded Types ───────────────────────────────────────────────────────────

export type ThaiID = string & { readonly __brand: unique symbol };

// ─── Error Class ─────────────────────────────────────────────────────────────

export class ThaiIDError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ThaiIDError';
  }
}

// ─── Province Data ───────────────────────────────────────────────────────────

const PROVINCE_MAP: Record<string, string> = {
  '10': 'กรุงเทพมหานคร',
  '11': 'สมุทรปราการ',
  '12': 'นนทบุรี',
  '13': 'ปทุมธานี',
  '14': 'นครปฐม',
  '15': 'สระบุรี',
  '16': 'ชัยนาท',
  '17': 'ลพบุรี',
  '18': 'สิงห์บุรี',
  '19': 'พระนครศรีอยุธยา',
  '20': 'ชลบุรี',
  '21': 'ระยอง',
  '22': 'จันทบุรี',
  '23': 'ตราด',
  '24': 'ฉะเชิงเทรา',
  '25': 'ปราจีนบุรี',
  '26': 'นครนายก',
  '27': 'สระแก้ว',
  '30': 'นครราชสีมา',
  '31': 'บุรีรัมย์',
  '32': 'สุรินทร์',
  '33': 'ศรีสะเกด',
  '34': 'อุบลราชธานี',
  '35': 'ยโสธร',
  '36': 'ชัยภูมิ',
  '37': 'อำนาจเจริญ',
  '38': 'บึงกาฬ',
  '39': 'หนองบัวลำภู',
  '40': 'ขอนแก่น',
  '41': 'อุดรธานี',
  '42': 'เลย',
  '43': 'หนองคาย',
  '44': 'มหาสารคาม',
  '45': 'ร้อยเอ็ด',
  '46': 'กาฬสินธุ์',
  '47': 'สกลนคร',
  '48': 'นครพนม',
  '49': 'มุกดาหาร',
  '50': 'เชียงใหม่',
  '51': 'ลำพูน',
  '52': 'ลำปาง',
  '53': 'อุตรดิตถ์',
  '54': 'แพร่',
  '55': 'น่าน',
  '56': 'พะเยา',
  '57': 'เชียงราย',
  '58': 'แม่ฮ่องสอน',
  '60': 'นครสวรรค์',
  '61': 'อุทัยธานี',
  '62': 'กำแพงเพชร',
  '63': 'ตาก',
  '64': 'สุโขทัย',
  '65': 'พิษณุโลก',
  '66': 'พิจิตร',
  '67': 'เพชรบูรณ์',
  '70': 'ราชบุรี',
  '71': 'กาญจนบุรี',
  '72': 'สุพรรณบุรี',
  '73': 'นครปฐม',
  '74': 'สมุทรสาคร',
  '75': 'สมุทรสงคราม',
  '76': 'เพชรบุรี',
  '77': 'ประจวบคีรีขันธ์',
  '80': 'นครศรีธรรมราช',
  '81': 'กระบี่',
  '82': 'พังงา',
  '83': 'ภูเก็ต',
  '84': 'สุราษฎร์ธานี',
  '85': 'ระนอง',
  '86': 'ชุมพร',
  '90': 'สงขลา',
  '91': 'สตูล',
  '92': 'ตรัง',
  '93': 'พัทลุง',
  '94': 'ปัตตานี',
  '95': 'ยะลา',
  '96': 'นราธิวาส',
};

// ─── Internal Helpers ─────────────────────────────────────────────────────────

function cleanID(id: string): string {
  return id.replace(/-/g, '').trim();
}

const THAI_ID_REGEX = /^\d{13}$/;
const THAI_ID_FORMATTED_REGEX = /^\d{1}-\d{4}-\d{5}-\d{2}-\d{1}$/;

// ─── Interface ────────────────────────────────────────────────────────────────

export interface ThaiIDInfo {
  isValid: boolean;
  personType: string;
  provinceCode: string;
  provinceName: string;
  districtCode: string;
  birthCertificateBookNo: string;
  sequenceNo: string;
  checkDigit: string;
}

// ─── 1. Validate ─────────────────────────────────────────────────────────────

/**
 * ตรวจสอบความถูกต้องของเลขบัตรประชาชน (สูตรคณิตศาสตร์หลักที่ 13)
 * @param id - เลขบัตรประชาชน 13 หลัก สามารถมีขีด (-) คั่นหรือไม่มีก็ได้
 * @returns `true` ถ้าเลขบัตรถูกต้องตามสูตรคณิตศาสตร์, `false` ถ้าไม่ถูกต้อง
 */
export function validateThaiID(id: string): boolean {
  const cleaned = cleanID(id);
  if (!THAI_ID_REGEX.test(cleaned)) return false;

  let sum = 0;
  for (let i = 0; i < 12; i++) {
    sum += parseInt(cleaned.charAt(i)) * (13 - i);
  }

  const checkDigit = (11 - (sum % 11)) % 10;
  return checkDigit === parseInt(cleaned.charAt(12));
}

// ─── 2. Format ───────────────────────────────────────────────────────────────

/**
 * จัด Format เลขบัตรประชาชนให้สวยงาม (ใส่ขีด)
 * ตัวอย่าง: 1100100123456 -> 1-1001-00123-45-6
 * @param id - เลขบัตรประชาชน 13 หลัก สามารถมีขีด (-) คั่นหรือไม่มีก็ได้
 * @returns เลขบัตรประชาชนที่จัด Format แล้ว หรือคืนค่าเดิมถ้าความยาวไม่ใช่ 13 หลัก
 */
export function formatThaiID(id: string): string {
  const cleaned = cleanID(id);
  if (cleaned.length !== 13) return id;
  return `${cleaned.charAt(0)}-${cleaned.substring(1, 5)}-${cleaned.substring(5, 10)}-${cleaned.substring(10, 12)}-${cleaned.charAt(12)}`;
}

// ─── 3. Unformat ─────────────────────────────────────────────────────────────

/**
 * ลบขีดออกจากเลขบัตรประชาชน คืนค่าเป็นตัวเลข 13 หลักเท่านั้น
 * ตัวอย่าง: 1-1001-00123-45-6 -> 1100100123456
 * @param id - เลขบัตรประชาชนที่อาจมีขีด (-) คั่น
 * @returns เลขบัตรประชาชน 13 หลักที่ไม่มีขีดคั่น
 */
export function unformatThaiID(id: string): string {
  return cleanID(id);
}

// ─── 4. Is Formatted ─────────────────────────────────────────────────────────

/**
 * ตรวจสอบว่าเลขบัตรประชาชนอยู่ในรูปแบบที่มีขีดคั่นแล้วหรือไม่ (X-XXXX-XXXXX-XX-X)
 * @param id - เลขบัตรประชาชนที่ต้องการตรวจสอบ
 * @returns `true` ถ้าอยู่ในรูปแบบที่มีขีดคั่น, `false` ถ้าไม่ใช่
 */
export function isFormattedThaiID(id: string): boolean {
  return THAI_ID_FORMATTED_REGEX.test(id);
}

// ─── 5. Mask ──────────────────────────────────────────────────────────────────

/**
 * เซ็นเซอร์เลขบัตรประชาชนเพื่อความปลอดภัยตามกฎหมาย PDPA (Privacy Masking)
 * ตัวอย่าง: 1-1001-XXXXX-XX-6
 * @param id - เลขบัตรประชาชน 13 หลัก สามารถมีขีด (-) คั่นหรือไม่มีก็ได้
 * @returns เลขบัตรประชาชนที่ถูกเซ็นเซอร์แล้ว หรือคืนค่าเดิมถ้าไม่สามารถ Format ได้
 */
export function maskThaiID(id: string): string {
  const formatted = formatThaiID(id);
  if (formatted.length !== 17) return id;
  return `${formatted.substring(0, 7)}XXXXX-XX${formatted.substring(15)}`;
}

// ─── 6. Generate Mock ────────────────────────────────────────────────────────

/**
 * สุ่มเลขบัตรประชาชนที่ถูกต้องตามหลักคณิตศาสตร์ (Valid Mock ID Generator)
 * @param firstDigit - ตัวเลขหลักแรก (1-8) กำหนดประเภทบุคคล ถ้าไม่ระบุจะสุ่มให้
 * @returns เลขบัตรประชาชน 13 หลักที่ถูกต้องตามสูตรคณิตศาสตร์
 * @throws {ThaiIDError} ถ้า firstDigit ไม่อยู่ในช่วง 1-8
 */
export function generateMockThaiID(firstDigit?: number): string {
  const start = firstDigit ?? (Math.floor(Math.random() * 8) + 1);
  if (start < 1 || start > 8) {
    throw new ThaiIDError('firstDigit must be between 1 and 8');
  }

  let result = '';
  let sum = 0;

  result += start;
  sum += start * 13;

  for (let i = 1; i < 12; i++) {
    const digit = Math.floor(Math.random() * 10);
    result += digit;
    sum += digit * (13 - i);
  }

  const checkDigit = (11 - (sum % 11)) % 10;
  result += checkDigit;

  return result;
}

// ─── 7. Parse (strict with branded return) ───────────────────────────────────

/**
 * ตรวจสอบและแปลงเลขบัตรประชาชนให้เป็น ThaiID type ที่รับประกันความถูกต้อง
 * @param id - เลขบัตรประชาชน 13 หลัก สามารถมีขีด (-) คั่นหรือไม่มีก็ได้
 * @returns ThaiID branded type ถ้าเลขถูกต้อง
 * @throws {ThaiIDError} ถ้าเลขบัตรประชาชนไม่ถูกต้อง
 */
export function parseThaiID(id: string): ThaiID {
  const cleaned = cleanID(id);
  if (!validateThaiID(cleaned)) {
    throw new ThaiIDError(`Invalid Thai National ID: "${id}"`);
  }
  return cleaned as ThaiID;
}

// ─── 8. Extract Info ──────────────────────────────────────────────────────────

/**
 * แกะข้อมูลเชิงลึกจากเลขบัตรประชาชน 13 หลัก (Information Extractor)
 * @param id - เลขบัตรประชาชน 13 หลัก สามารถมีขีด (-) คั่นหรือไม่มีก็ได้
 * @returns ออบเจกต์ `ThaiIDInfo` ที่มีข้อมูลประเภทบุคคล, รหัสจังหวัด, ชื่อจังหวัด, รหัสอำเภอ/เขต และข้อมูลอื่นๆ
 */
export function extractThaiIDInfo(id: string): ThaiIDInfo {
  const cleaned = cleanID(id);
  const isValid = validateThaiID(cleaned);

  if (cleaned.length !== 13) {
    return {
      isValid: false,
      personType: 'Unknown',
      provinceCode: '',
      provinceName: '',
      districtCode: '',
      birthCertificateBookNo: '',
      sequenceNo: '',
      checkDigit: '',
    };
  }

  const firstDigit = cleaned.charAt(0);
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

  const provinceCode = cleaned.substring(1, 3);
  const provinceName = PROVINCE_MAP[provinceCode] ?? '';
  const districtCode = cleaned.substring(3, 5);
  const birthCertificateBookNo = cleaned.substring(5, 10);
  const sequenceNo = cleaned.substring(10, 12);
  const checkDigit = cleaned.charAt(12);

  return {
    isValid,
    personType,
    provinceCode,
    provinceName,
    districtCode,
    birthCertificateBookNo,
    sequenceNo,
    checkDigit,
  };
}

// ─── 9. Province Lookup ──────────────────────────────────────────────────────

/**
 * ค้นหาชื่อจังหวัดจากรหัสจังหวัด (หลักที่ 2-3 ของเลขบัตรประชาชน)
 * @param provinceCode - รหัสจังหวัด 2 หลัก (เช่น "10" = กรุงเทพมหานคร)
 * @returns ชื่อจังหวัดในภาษาไทย หรือ empty string ถ้าไม่พบรหัสจังหวัด
 */
export function getProvinceName(provinceCode: string): string {
  return PROVINCE_MAP[provinceCode] ?? '';
}