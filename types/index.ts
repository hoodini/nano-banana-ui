export interface Feature {
  id: string;
  name: string;
  description: string;
  icon: string;
  thumbnail: string;
  category: 'generation' | 'editing' | 'special';
  requiresImage: boolean;
  requiresMultipleImages: boolean;
  maxImages?: number;
  modelType: 'flash' | 'pro';
  examplePrompt?: string;
}

export interface GenerationConfig {
  aspectRatio?: '1:1' | '2:3' | '3:2' | '3:4' | '4:3' | '4:5' | '5:4' | '9:16' | '16:9' | '21:9';
  imageSize?: '1K' | '2K' | '4K';
  useGoogleSearch?: boolean;
}

export interface GenerationRequest {
  prompt: string;
  images?: string[]; // base64 encoded images
  config?: GenerationConfig;
  featureId: string;
  apiKey: string;
}

export interface GenerationResponse {
  success: boolean;
  imageData?: string; // base64 encoded
  text?: string;
  error?: string;
}

export const FEATURES: Feature[] = [
  {
    id: 'text-to-image',
    name: 'Text to Image Generation',
    description: 'Transform your ideas into stunning visuals instantly. Generate photorealistic images from simple text descriptions - from interior design to fantasy landscapes.',
    icon: '✨',
    thumbnail: 'https://ai.google.dev/static/gemini-api/docs/images/nano-banana.png',
    category: 'generation',
    requiresImage: false,
    requiresMultipleImages: false,
    modelType: 'pro',
    examplePrompt: 'A wide shot of a modern, well-lit living room with a prominent blue sofa in the center, hardwood floors, and large windows with natural light',
  },
  {
    id: 'image-editing',
    name: 'AI Image Editing & Transformation',
    description: 'Upload any image and transform it with AI precision. Change colors, swap objects, modify styles, or reimagine entire scenes while maintaining photorealistic quality.',
    icon: '🎨',
    thumbnail: 'https://ai.google.dev/static/gemini-api/docs/images/cat-banana.png',
    category: 'editing',
    requiresImage: true,
    requiresMultipleImages: false,
    modelType: 'pro',
    examplePrompt: 'Change the blue sofa to be a vintage, brown leather chesterfield sofa with tufted buttons and wooden legs',
  },
  {
    id: 'multi-image-compose',
    name: 'Multi-Image Composition Studio',
    description: 'Combine up to 14 images seamlessly. Perfect for fashion visualization, product mockups, virtual try-ons, and creative compositions. Transfer clothing, merge scenes, or create impossible combinations.',
    icon: '🖼️',
    thumbnail: 'https://ai.google.dev/static/gemini-api/docs/images/office-group-photo.jpeg',
    category: 'editing',
    requiresImage: true,
    requiresMultipleImages: true,
    maxImages: 14,
    modelType: 'pro',
    examplePrompt: 'Take the elegant dress from the first image and have the person from the second image wearing it, maintaining realistic lighting and fit',
  },
  {
    id: 'search-grounding',
    name: 'Real-Time Search Visualization',
    description: 'Generate images powered by live Google Search data. Create visualizations of current weather, stock trends, sports scores, news events, and real-world information with up-to-date accuracy.',
    icon: '🔍',
    thumbnail: 'https://ai.google.dev/static/gemini-api/docs/images/weather-forecast.png',
    category: 'generation',
    requiresImage: false,
    requiresMultipleImages: false,
    modelType: 'pro',
    examplePrompt: 'Create an artistic visualization of the current weather forecast for the next 5 days in San Francisco, showing temperature changes and conditions',
  },
  {
    id: 'social-media-thumbnail',
    name: 'Viral Thumbnail Generator',
    description: 'Create scroll-stopping YouTube and social media thumbnails that demand attention. Automatically adds dramatic expressions, bold text overlays, arrows, and viral aesthetics proven to boost engagement.',
    icon: '🚀',
    thumbnail: 'https://ai.google.dev/static/gemini-api/docs/images/photorealistic_example.png',
    category: 'special',
    requiresImage: true,
    requiresMultipleImages: false,
    modelType: 'pro',
    examplePrompt: 'Person with shocked, excited expression discovering something amazing, dramatic lighting, with energy and urgency in the scene',
  },
  {
    id: 'style-transfer',
    name: 'Style Transfer & Artistic Transformation',
    description: 'Apply artistic styles to your images. Transform photos into paintings, match the aesthetic of reference images, or create unique artistic interpretations. From oil paintings to watercolors, anime to impressionism.',
    icon: '🎭',
    thumbnail: 'https://ai.google.dev/static/gemini-api/docs/images/cat-banana.png',
    category: 'editing',
    requiresImage: true,
    requiresMultipleImages: true,
    maxImages: 2,
    modelType: 'pro',
    examplePrompt: 'Apply the artistic style and color palette from the first image to the content of the second image, creating a stylized masterpiece',
  },
];
