"use client"

import { Pause, Play } from "lucide-react"
import { useState } from "react"
import { FrameData } from "./frame-by-frame-detector"

interface FrameDisplayProps {
  frame: FrameData
  isPlaying: boolean
  togglePlayPause: () => void
  jumpToNextKeyFrame: () => void
  jumpToPrevKeyFrame: () => void
}

export function FrameDisplay({
  frame,
  isPlaying,
  togglePlayPause,
  jumpToNextKeyFrame,
  jumpToPrevKeyFrame,
}: FrameDisplayProps) {
  const [isFullscreen, setIsFullscreen] = useState(false)

  // 切换全屏
  const toggleFullscreen = () => {
    setIsFullscreen((prev) => !prev)
  }

  return (
    <div className={`w-full h-full relative bg-black ${isFullscreen ? "fixed inset-0 z-50" : ""}`}>
      {/* 视频帧 */}
      <img
        src={frame.imageUrl || `/placeholder.svg`}
        alt={`视频帧 ${frame.frameNumber}`}
        className="w-full h-full object-contain"
        onError={(e) => {
          // 如果图像加载失败，使用占位符
          e.currentTarget.src = '/placeholder.svg'
        }}
      />

      {/* 关键帧覆盖层 */}
      {frame.isKeyFrame && (
        <div className="absolute top-4 left-4 bg-orange-500 text-white px-3 py-1 rounded-md flex items-center gap-2 shadow-md">
          <div className="w-2 h-2 bg-white rounded-full animate-ping"></div>
          关键帧 - {frame.timestamp}
        </div>
      )}

      {/* 帧号显示 */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-gray-800/70 text-white px-3 py-1 rounded-md">
        帧号: {frame.frameNumber}
      </div>

      {/* 控制按钮 */}
      <div className="absolute bottom-4 right-4 flex gap-2">
        <button
          onClick={jumpToPrevKeyFrame}
          className="bg-gray-800/80 hover:bg-gray-700/80 text-white w-12 h-12 rounded-full flex items-center justify-center backdrop-blur-sm"
          title="上一个关键帧"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polygon points="19 20 9 12 19 4 19 20"></polygon>
            <line x1="5" y1="19" x2="5" y2="5"></line>
          </svg>
        </button>

        <button
          onClick={togglePlayPause}
          className="bg-gray-800/80 hover:bg-gray-700/80 text-white w-12 h-12 rounded-full flex items-center justify-center backdrop-blur-sm"
        >
          {isPlaying ? <Pause size={24} /> : <Play size={24} />}
        </button>

        <button
          onClick={jumpToNextKeyFrame}
          className="bg-gray-800/80 hover:bg-gray-700/80 text-white w-12 h-12 rounded-full flex items-center justify-center backdrop-blur-sm"
          title="下一个关键帧"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polygon points="5 4 15 12 5 20 5 4"></polygon>
            <line x1="19" y1="5" x2="19" y2="19"></line>
          </svg>
        </button>

        <button
          onClick={toggleFullscreen}
          className="bg-gray-800/80 hover:bg-gray-700/80 text-white w-12 h-12 rounded-full flex items-center justify-center backdrop-blur-sm"
          title="全屏"
        >
          {isFullscreen ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M8 3v3a2 2 0 0 1-2 2H3"></path>
              <path d="M21 8h-3a2 2 0 0 1-2-2V3"></path>
              <path d="M3 16h3a2 2 0 0 1 2 2v3"></path>
              <path d="M16 21v-3a2 2 0 0 1 2-2h3"></path>
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M8 3H5a2 2 0 0 0-2 2v3"></path>
              <path d="M21 8V5a2 2 0 0 0-2-2h-3"></path>
              <path d="M3 16v3a2 2 0 0 0 2 2h3"></path>
              <path d="M16 21h3a2 2 0 0 0 2-2v-3"></path>
            </svg>
          )}
        </button>
      </div>

      {/* 键盘快捷键提示 */}
      {/* <div className="absolute top-4 right-4 bg-gray-800/70 text-white text-xs px-3 py-2 rounded backdrop-blur-sm">
        <div className="flex items-center gap-1 mb-1">
          <kbd className="px-1.5 py-0.5 bg-gray-700 rounded">空格</kbd>
          <span>播放/暂停</span>
        </div>
        <div className="flex items-center gap-1 mb-1">
          <kbd className="px-1.5 py-0.5 bg-gray-700 rounded">←</kbd>
          <kbd className="px-1.5 py-0.5 bg-gray-700 rounded">→</kbd>
          <span>前后帧</span>
        </div>
      </div> */}
    </div>
  )
} 