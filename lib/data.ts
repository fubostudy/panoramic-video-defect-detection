import fs from 'fs';
import path from 'path';
import { VideoData } from './types';

export function getVideoData(): VideoData {
    const filePath = path.join(process.cwd(), 'data', 'video_frames_export.json');
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const data: VideoData = JSON.parse(fileContents);
    return data;
}

export function getKeyFrames(data: VideoData): VideoData['frames'] {
    return data.frames.filter(frame => frame.is_key_frame);
}

export function getAllFrames(data: VideoData): VideoData['frames'] {
    return data.frames;
}

export function getFrameById(data: VideoData, frameId: string): VideoData['frames'][0] | undefined {
    return data.frames.find(frame => frame.frame_id === frameId);
}

export function getFrameByNumber(data: VideoData, frameNumber: string): VideoData['frames'][0] | undefined {
    return data.frames.find(frame => frame.frame_number === frameNumber);
}

export function getFrameByTimestamp(data: VideoData, timestamp: string): VideoData['frames'][0] | undefined {
    return data.frames.find(frame => frame.timestamp === timestamp);
}

export function getFrameByTimestampSeconds(data: VideoData, timestampSeconds: number): VideoData['frames'][0] | undefined {
    return data.frames.find(frame => frame.timestamp_seconds === timestampSeconds);
} 