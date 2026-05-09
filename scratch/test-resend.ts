import { Resend } from 'resend';

const resend = new Resend('re_KN9nY7ZP_9ZiHJDQ7WziHKs2k7h15TH5A');

async function testEmail() {
  try {
    const data = await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: 'delivered@resend.dev',
      subject: 'Test Email',
      text: 'This is a test email from SpendSight development environment.',
    });
    console.log('Success:', JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Error:', error);
  }
}

testEmail();
