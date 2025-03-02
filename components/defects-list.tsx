"use client"

import { useEffect, useRef } from "react"
import { FrameData } from "./frame-by-frame-detector"

interface DefectsListProps {
  frame: FrameData
  typingTexts: { [key: string]: string }
  currentFrameIndex: number
  totalFrames: number
}

export function DefectsList({
  frame,
  typingTexts,
  currentFrameIndex,
  totalFrames,
}: DefectsListProps) {
  // 创建结果容器的引用
  const resultsContainerRef = useRef<HTMLDivElement>(null)
  
  // 添加自动滚动效果
  useEffect(() => {
    if (resultsContainerRef.current) {
      resultsContainerRef.current.scrollTop = resultsContainerRef.current.scrollHeight
    }
  }, [typingTexts, frame]) // 当打字文本或帧发生变化时滚动

  // 调试用：打印当前帧的缺陷信息
  console.log("缺陷信息:", frame.defects);

  return (
    <div className="w-full h-full bg-gray-800 p-4 overflow-y-auto" ref={resultsContainerRef}>
      <div className="text-white text-lg font-medium mb-4 flex items-center justify-between">
        <div className="flex items-center">
          <span className="inline-block w-1 h-5 bg-cyan-500 mr-2"></span>
          检测结果
        </div>
        <div className="text-xs text-gray-400">
          已检测帧数: {currentFrameIndex + 1}/{totalFrames}
        </div>
      </div>

      {frame.defects && frame.defects.length > 0 ? (
        <div className="space-y-4">
          {frame.defects.map((defect, defectIndex) => {
            // 只有当facility-${defectIndex}在typingTexts中存在时才显示这个缺陷块
            const facilityKey = `facility-${defectIndex}`;
            if (!typingTexts[facilityKey] && frame.isKeyFrame) return null;
            
            return (
              <div key={defectIndex} className="bg-gray-700/80 rounded-lg p-3 border-l-2 border-cyan-500">
                <div className="flex justify-between items-start mb-2">
                  <div className="text-white font-medium">
                    {/* 设施类型 */}
                    {typingTexts[facilityKey] || ""}
                    {typingTexts[facilityKey] && (
                      <span className="inline-block w-0.5 h-4 bg-white ml-1 align-middle animate-pulse"></span>
                    )}
                  </div>
                </div>
                
                {/* 缺陷详情列表 */}
                <div className="space-y-3">
                  {defect.defect_detail.map((detail, detailIndex) => {
                    const typeKey = `defect_type-${defectIndex}-${detailIndex}`;
                    const descKey = `description-${defectIndex}-${detailIndex}`;
                    
                    // 只有当typeKey在typingTexts中存在时才显示这个详情
                    if (!typingTexts[typeKey] && frame.isKeyFrame) return null;
                    
                    return (
                      <div key={detailIndex} className="pl-2 border-l border-gray-600 py-1">
                        <div className="flex justify-between items-start">
                          <div className="text-yellow-400 text-sm font-medium">
                            {/* 缺陷类型 */}
                            {typingTexts[typeKey] || ""}
                            {typingTexts[typeKey] && (
                              <span className="inline-block w-0.5 h-4 bg-white ml-1 align-middle animate-pulse"></span>
                            )}
                          </div>
                        </div>
                        
                        {/* 缺陷描述 - 只在有描述文本时显示 */}
                        {typingTexts[descKey] && (
                          <div className="mt-2 text-gray-300 text-sm">
                            {typingTexts[descKey]}
                            <span className="inline-block w-0.5 h-4 bg-white ml-1 align-middle animate-pulse"></span>
                          </div>
                        )}
                        
                        {/* 置信度 - 只在有描述文本时显示 */}
                        {typingTexts[descKey] && detail.confidence !== undefined && (
                          <div className="mt-2 flex items-center opacity-60 hover:opacity-100 transition-opacity">
                            <div className="text-xs text-gray-400 mr-1">置信度</div>
                            <div className="w-16 h-1 bg-gray-600 rounded-full mx-1">
                              <div 
                                className="h-full bg-green-500 rounded-full" 
                                style={{ width: `${detail.confidence * 100}%` }}
                              ></div>
                            </div>
                            <div className="text-xs text-gray-400 ml-1">
                              {Math.round(detail.confidence * 100)}%
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="flex items-center justify-center h-32 text-gray-400">
          {frame.isKeyFrame 
            ? "此关键帧未检测到缺陷" 
            : "正在逐帧分析视频..."}
        </div>
      )}
    </div>
  )
} 