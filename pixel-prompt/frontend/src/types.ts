export interface ImageItem {
    userId: string;
    timestamp: string;
    s3Key: string;
    s3Url: string;
    fileName: string;
    contentType: string;
    fileSize: number;
    title: string;
    caption: string;
    tags: string[];
    createdAt: string;
    processedAt: string;
  }