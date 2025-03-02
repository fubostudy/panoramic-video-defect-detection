export interface DefectDetail {
    defect_type: string;
    defect_description: string;
    confidence: number;
    is_critical: boolean;
}

export interface DetectedDefect {
    facility_type: string;
    defect_detail: DefectDetail[];
}

export interface GroundTruth {
    detected_defects: DetectedDefect[];
    status: string;
    created_by: string;
    updated_by: string;
}

export interface VideoFrame {
    frame_id: string;
    frame_number: string;
    timestamp: string;
    timestamp_seconds: number;
    image_url: string;
    is_key_frame: boolean;
    ground_truth?: GroundTruth;
}

export interface VideoData {
    video_id: string;
    video_name: string;
    total_frames: number;
    export_time: string;
    frames: VideoFrame[];
} 