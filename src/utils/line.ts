import { Client } from '@line/bot-sdk';

const client = new Client({
  channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN!,
});
const userId = process.env.LINE_USER_ID!;


export async function sendLineMessage(text: string) {
  try {
    // ตรวจสอบว่า userId ไม่ว่างเปล่า
    if (!userId) {
      throw new Error("User ID is empty or undefined");
    }

    // ตรวจสอบความยาวของ text
    if (text.length > 5000) {
      text = text.substring(0, 5000); // ตัดข้อความถ้ายาวเกิน
    }

    console.log(`📤 Sending message to userId: ${userId}, text: ${text}`);
    await client.pushMessage(userId,
      {
        type: 'template',
        altText: 'this is a confirm template',
        template: {
          type: 'confirm',
          text: text,
          actions: [
            {
              type: 'message',
              label: 'Yes',
              text: 'Yes',
            },
            {
              type: 'message',
              label: 'No',
              text: 'No'
            }
          ]
        }
      }
    );
    console.log(`✅ ส่งข้อความถึง ${userId} สำเร็จ`);
  } catch (error) {
    console.error(`❌ ส่งข้อความไม่สำเร็จ`, error);
    throw error; // โยน error เพื่อให้ caller จัดการต่อ
  }
}