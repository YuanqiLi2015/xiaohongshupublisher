export interface ProductMetadata {
    product_category: string;
    brand: string;
    model: string;
    estimated_price_range?: string;
    key_features: string[];
    target_audience: string;
    tone_keywords: string[];
    confidence: number;
}

export interface GenerationResult {
    recognition: ProductMetadata;
    copywriting: string;
    images: string[]; // URLs of generated images
}
