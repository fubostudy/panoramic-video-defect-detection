// 在客户端组件中，我们需要使用require动态导入JSON
const videoData = require('./video_frames_export.json');
import { VideoFrame } from '@/lib/types';

// 转换所有帧数据为组件需要的格式
const allFrames = (videoData.frames as VideoFrame[]).map((frame: VideoFrame, index: number) => {
  return {
    id: index + 1,
    frameNumber: frame.frame_number,
    timestamp: frame.timestamp,
    timestampSeconds: frame.timestamp_seconds,
    imageUrl: frame.image_url,
    isKeyFrame: frame.is_key_frame,
    defects: frame.ground_truth?.detected_defects.map(defect => ({
      facility_type: defect.facility_type,
      defect_detail: defect.defect_detail.map(detail => ({
        defect_type: detail.defect_type,
        defect_description: detail.defect_description || "",
        confidence: detail.confidence,
        is_critical: detail.is_critical
      }))
    })) || []
  };
});

// 转换关键帧数据为组件需要的格式
const keyFrames = allFrames.filter(frame => frame.isKeyFrame);

// 创建帧位置映射
const framePositions: Record<number, number> = {};
allFrames.forEach((frame, index) => {
  // 将时间戳转换为帧号
  const frameNumber = parseInt(frame.frameNumber.split(':')[1]);
  framePositions[frameNumber] = index;
});

export const mockData = {
  // 视频信息
  videoName: videoData.video_name,
  videoId: videoData.video_id,

  // 总帧数
  totalFrames: videoData.total_frames,

  // 所有帧数据
  allFrames,

  // 关键帧数据
  keyFrames,

  // 帧位置映射
  framePositions,
};

