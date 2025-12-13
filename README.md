# Agendou - Sistema de Agendamento

<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/15jGSyjz8t0sBey9zbz-xcbBHHGiIaRPb

## Run Locally

**Prerequisites:** Node.js

1. Install dependencies:
   `npm install`
2. Copy the environment file and configure it:
   `cp .env.example .env.local`
3. Set the required environment variables in `.env.local`:
   - `GEMINI_API_KEY`: Your Gemini API key
   - `VITE_META_PHONE_ID`: Your Meta WhatsApp Business Phone ID
   - `VITE_META_TOKEN`: Your Meta WhatsApp Access Token
   - `VITE_STORE_PHONE`: Your store's WhatsApp number (with country code, no +)
4. Run the app:
   `npm run dev`

## Environment Variables

The application uses the following environment variables:

- `VITE_META_PHONE_ID`: WhatsApp Business Phone ID from Meta
- `VITE_META_TOKEN`: Access token for WhatsApp Business API
- `VITE_STORE_PHONE`: Store's WhatsApp number for notifications

Copy `.env.example` to `.env.local` and fill in your values.
