import AppError from "@/lib/server/utils/appError";

export const sendMail = async (toEmail: string, templateId: number, data: object) => {
    try {
        if (!toEmail || !templateId || !data) {
            throw new AppError('Missing required fields for sending email', 400)
        }
        const endpoint = 'https://api.brevo.com/v3/smtp/email';

        const emailData = {
            sender: { email: process.env.BREVO_EMAIL }, // Sender email
            to: [{ email: toEmail }], // Recipient email
            templateId: templateId, // Brevo template ID
            params: data
        };

        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'api-key': process.env.BREVO_API_KEY!, // Brevo API key for authentication
                'Content-Type': 'application/json', // Content type for JSON data
            },
            body: JSON.stringify(emailData), // Email data in JSON format
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new AppError(errorData.message || 'Failed to send email', 400);
        }
        return response.json(); // Return the response data
    } catch (error) {
        throw new AppError((error as Error).message || 'Failed to send email', 400)
    }

}