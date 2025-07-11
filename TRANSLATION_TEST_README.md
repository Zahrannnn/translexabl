# Translation Test Page

This test page demonstrates the DeepL API Pro integration for the TransleXable platform.

## Features

- **Text Translation**: Translate text using DeepL API Pro/Free
- **Language Support**: 20+ languages with auto-detection
- **Tone Selection**: Choose from formal, informal, business, or friendly tones
- **Credit Estimation**: Real-time credit calculation (1 credit = 700 characters)
- **Copy to Clipboard**: Easy copying of translated text
- **Error Handling**: Comprehensive error handling and user feedback
- **Auto Endpoint Detection**: Automatically uses correct API endpoint based on key type

## Setup

1. **Get a DeepL API Key**:
   - Sign up at [DeepL Pro API](https://www.deepl.com/pro-api)
   - Choose between:
     - **DeepL API Free**: 500,000 characters/month free
     - **DeepL API Pro**: Paid plans with higher limits
   - Get your API key from the account dashboard

2. **Configure Environment Variables**:
   ```bash
   cp .env.example .env.local
   ```
   
   Then edit `.env.local` and add your DeepL API key:
   ```
   DEEPL_API_KEY=your_actual_deepl_api_key_here
   ```
   
   **Key Types**:
   - **Free API keys**: End with `:fx` and use `api-free.deepl.com`
   - **Pro API keys**: Don't end with `:fx` and use `api.deepl.com`
   - The system automatically detects which endpoint to use

3. **Install Dependencies** (if not already done):
   ```bash
   npm install
   ```

4. **Run the Development Server**:
   ```bash
   npm run dev
   ```

5. **Access the Test Page**:
   Navigate to `http://localhost:3000/test-translate` (or the port shown in terminal)

## Usage

1. **Select Languages**: Choose source and target languages
2. **Choose Tone**: Select the appropriate tone for your translation
3. **Enter Text**: Type or paste the text you want to translate
4. **View Credits**: See the estimated credit cost in real-time
5. **Translate**: Click the "Translate Text" button
6. **Copy Result**: Use the copy button to copy the translated text

## API Endpoints

- **POST** `/api/translate` - Translate text using DeepL API

### Request Body:
```json
{
  "text": "Hello, world!",
  "source_lang": "EN",
  "target_lang": "ES",
  "tone": "formal"
}
```

### Response:
```json
{
  "translated_text": "¡Hola, mundo!",
  "detected_source_language": "EN",
  "characters_used": 13,
  "credits_used": 1,
  "tone_applied": "formal",
  "api_endpoint_used": "https://api-free.deepl.com/v2"
}
```

## Testing with Postman

You can test the API directly using Postman or curl:

```bash
curl -X POST "http://localhost:3000/api/translate" \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Hello, world!",
    "source_lang": "EN",
    "target_lang": "ES",
    "tone": "formal"
  }'
```

## Tone Mapping

- **Default**: Standard DeepL translation
- **Formal/Business**: Maps to DeepL's `formality: "more"`
- **Informal/Friendly**: Maps to DeepL's `formality: "less"`

## Supported Languages

- English (EN)
- Spanish (ES)
- French (FR)
- German (DE)
- Italian (IT)
- Portuguese (PT)
- Russian (RU)
- Japanese (JA)
- Korean (KO)
- Chinese (ZH)
- Arabic (AR)
- Hindi (HI)
- Turkish (TR)
- Polish (PL)
- Dutch (NL)
- Swedish (SV)
- Danish (DA)
- Norwegian (NO)
- Finnish (FI)

## Error Handling

The API handles various error scenarios:

- **400**: Missing required fields
- **403**: Invalid API key or quota exceeded
- **456**: DeepL quota exceeded
- **500**: Server errors

## Notes

- The system automatically detects whether to use Free or Pro API endpoints
- Free API keys end with `:fx` and have usage limits
- Pro API keys provide higher limits and priority processing
- Credit estimation is based on 1 credit = 700 characters
- Some language pairs may not support formality settings
- The API response includes which endpoint was used for debugging

## DeepL API Documentation

For more information, see the [official DeepL API documentation](https://developers.deepl.com/docs). 