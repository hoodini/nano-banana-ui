import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { prompt, images, config, apiKey } = body;

    if (!apiKey) {
      return NextResponse.json(
        { success: false, error: 'API key is required' },
        { status: 400 }
      );
    }

    if (!prompt && !images?.length) {
      return NextResponse.json(
        { success: false, error: 'Prompt or image is required' },
        { status: 400 }
      );
    }

    // Initialize the Google GenAI client
    const ai = new GoogleGenAI({ apiKey });

    // Use Gemini 3 Pro Image Preview for all image generation
    // This is the correct model for image generation according to Google docs
    const modelName = 'gemini-3-pro-image-preview';

    // Prepare the prompt parts array
    const promptParts: any[] = [];

    // Add text prompt first
    if (prompt) {
      promptParts.push({ text: prompt });
    }

    // Add images if provided
    if (images && images.length > 0) {
      for (const imageBase64 of images) {
        promptParts.push({
          inlineData: {
            mimeType: 'image/png',
            data: imageBase64,
          },
        });
      }
    }

    // Prepare generation config
    const generationConfig: any = {};

    // Add image configuration if specified
    if (config?.aspectRatio || config?.imageSize) {
      generationConfig.imageConfig = {};
      if (config.aspectRatio) {
        generationConfig.imageConfig.aspectRatio = config.aspectRatio;
      }
      if (config.imageSize) {
        generationConfig.imageConfig.imageSize = config.imageSize;
      }
    }

    // Add Google Search tool if requested
    if (config?.useGoogleSearch) {
      generationConfig.tools = [{ googleSearch: {} }];
    }

    // Generate content using the correct API structure
    const response = await ai.models.generateContent({
      model: modelName,
      contents: promptParts,
      ...generationConfig,
    });

    // Extract image data from response
    let imageData = null;
    let textResponse = null;

    if (response.candidates && response.candidates.length > 0) {
      const candidate = response.candidates[0];
      if (candidate.content && candidate.content.parts) {
        for (const part of candidate.content.parts) {
          if (part.inlineData && part.inlineData.data) {
            imageData = part.inlineData.data;
          }
          if (part.text) {
            textResponse = part.text;
          }
        }
      }
    }

    if (!imageData) {
      console.error('No image data in response:', JSON.stringify(response, null, 2));
      return NextResponse.json(
        {
          success: false,
          error: 'No image data returned from the API. Please try again.',
          text: textResponse,
          debug: response.candidates?.[0]?.finishReason || 'Unknown reason',
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      imageData,
      text: textResponse,
    });
  } catch (error: any) {
    console.error('Generation error:', error);
    console.error('Error details:', error.response?.data || error.message);

    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to generate image',
        details: error.response?.data?.error?.message || error.toString(),
      },
      { status: 500 }
    );
  }
}
