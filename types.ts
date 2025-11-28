export enum PoseStatus {
  IDLE = 'IDLE',
  GENERATING_TEXT = 'GENERATING_TEXT',
  PENDING_IMAGE = 'PENDING_IMAGE',
  GENERATING_IMAGE = 'GENERATING_IMAGE',
  COMPLETED = 'COMPLETED',
  ERROR = 'ERROR'
}

export interface PoseItem {
  id: number;
  description: string;
  imageUrl?: string;
  status: PoseStatus;
}

export interface GenerateTextResponse {
  poses: string[];
}