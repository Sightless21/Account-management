export function generateTaskId(): number {
  return Math.floor(Math.random() * 1_000_000_0000); // สุ่มเลขตั้งแต่ 0 ถึง 9999999999
}