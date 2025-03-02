"use client"

import { mockData } from "@/data/mock-data"
import { useCallback, useEffect, useRef, useState } from "react"
import { DefectsList } from "./defects-list"
import { FrameDisplay } from "./frame-display"

// 帧数据接口
export interface FrameData {
  id: number
  frameNumber: string
  timestamp: string
  timestampSeconds: number
  imageUrl: string
  isKeyFrame: boolean
  defects: DefectItem[]
}

// 缺陷项接口
export interface DefectItem {
  facility_type: string
  defect_detail: DefectDetail[]
}

// 缺陷详情接口
export interface DefectDetail {
  defect_type: string
  defect_description: string
  confidence: number
  is_critical: boolean
}

export default function FrameByFrameDetector() {
  // 状态
  const [currentFrameIndex, setCurrentFrameIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(true)
  const [typingTexts, setTypingTexts] = useState<{ [key: string]: string }>({})
  const [typingComplete, setTypingComplete] = useState(false)
  const [currentTime, setCurrentTime] = useState("00:00")
  
  // 新增：打字机各阶段状态
  const [typingStage, setTypingStage] = useState<"facility" | "defect_type" | "description" | "complete">("facility")
  const [currentDefectIndex, setCurrentDefectIndex] = useState(0)
  const [currentDetailIndex, setCurrentDetailIndex] = useState(0)
  const [stageProgress, setStageProgress] = useState(0) // 当前阶段的进度

  // Refs
  const typingIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const frameIntervalRef = useRef<NodeJS.Timeout | null>(null)

  // 从mock数据获取
  const { videoName, totalFrames, allFrames } = mockData
  const currentFrame = allFrames[currentFrameIndex]

  // 清理所有计时器的函数
  const cleanupTimers = useCallback(() => {
    // 清理帧播放计时器
    if (frameIntervalRef.current) {
      clearInterval(frameIntervalRef.current)
      frameIntervalRef.current = null
    }

    // 清理打字动画计时器
    if (typingIntervalRef.current) {
      clearInterval(typingIntervalRef.current)
      typingIntervalRef.current = null
    }
  }, [])

  // 打字效果函数 - 重新实现，使其逐行显示
  const startTypingAnimations = useCallback((frame: FrameData) => {
    // 如果没有缺陷，直接标记为完成
    if (!frame.defects || frame.defects.length === 0) {
      setTypingComplete(true)
      return
    }

    // 清理现有的打字动画
    if (typingIntervalRef.current) {
      clearInterval(typingIntervalRef.current)
      typingIntervalRef.current = null
    }
    
    // 重置打字状态
    setTypingTexts({})
    setTypingComplete(false)
    setCurrentDefectIndex(0)
    setCurrentDetailIndex(0)
    setTypingStage("facility") // 从设施类型开始
    setStageProgress(0)
  }, [])
  
  // 使用useEffect处理打字逻辑，按层次结构逐行显示
  useEffect(() => {
    // 只在关键帧且未完成打字时处理
    if (!currentFrame.isKeyFrame || typingComplete) {
      return
    }
    
    const frame = currentFrame;
    
    // 确保有缺陷数据
    if (!frame.defects || frame.defects.length === 0 || currentDefectIndex >= frame.defects.length) {
      setTypingComplete(true)
      return;
    }
    
    const currentDefect = frame.defects[currentDefectIndex];
    
    // 如果当前详情索引无效且在描述阶段，移至下一个缺陷
    if (typingStage === "description" && 
        (currentDetailIndex >= currentDefect.defect_detail.length || 
        !currentDefect.defect_detail[currentDetailIndex].defect_description)) {
      
      // 如果已经是最后一个缺陷，标记为完成
      if (currentDefectIndex >= frame.defects.length - 1) {
        setTypingComplete(true)
        return;
      }
      
      // 否则移至下一个缺陷
      setTimeout(() => {
        setCurrentDefectIndex(prev => prev + 1)
        setCurrentDetailIndex(0)
        setTypingStage("facility")
        setStageProgress(0)
      }, 500)
      
      return;
    }
    
    // 清理现有计时器
    if (typingIntervalRef.current) {
      clearInterval(typingIntervalRef.current);
    }
    
    // 根据当前阶段执行打字效果
    const processCurrentStage = () => {
      switch (typingStage) {
        case "facility": {
          // 设施类型阶段
          const text = currentDefect.facility_type;
          const key = `facility-${currentDefectIndex}`;
          
          if (!text) {
            // 如果没有设施类型，直接进入下一阶段
            setTypingStage("defect_type");
            setStageProgress(0);
            return;
          }
          
          typingIntervalRef.current = setInterval(() => {
            if (stageProgress < text.length) {
              setTypingTexts(prev => ({
                ...prev,
                [key]: text.substring(0, stageProgress + 1),
              }));
              setStageProgress(prev => prev + 1);
            } else {
              // 当前阶段完成，清理计时器并延迟进入下一阶段
              clearInterval(typingIntervalRef.current!);
              typingIntervalRef.current = null;
              
              setTimeout(() => {
                setTypingStage("defect_type");
                setStageProgress(0);
              }, 300);
            }
          }, 30);
          break;
        }
        
        case "defect_type": {
          // 缺陷类型阶段
          if (!currentDefect.defect_detail || currentDefect.defect_detail.length === 0) {
            // 如果没有缺陷详情，跳至下一个缺陷
            setTimeout(() => {
              if (currentDefectIndex >= frame.defects.length - 1) {
                setTypingComplete(true);
              } else {
                setCurrentDefectIndex(prev => prev + 1);
                setTypingStage("facility");
                setStageProgress(0);
              }
            }, 300);
            return;
          }
          
          const detail = currentDefect.defect_detail[currentDetailIndex];
          const text = detail.defect_type;
          const key = `defect_type-${currentDefectIndex}-${currentDetailIndex}`;
          
          if (!text) {
            // 如果没有缺陷类型，直接进入下一阶段
            setTypingStage("description");
            setStageProgress(0);
            return;
          }
          
          typingIntervalRef.current = setInterval(() => {
            if (stageProgress < text.length) {
              setTypingTexts(prev => ({
                ...prev,
                [key]: text.substring(0, stageProgress + 1),
              }));
              setStageProgress(prev => prev + 1);
            } else {
              // 当前阶段完成，清理计时器并延迟进入下一阶段
              clearInterval(typingIntervalRef.current!);
              typingIntervalRef.current = null;
              
              setTimeout(() => {
                setTypingStage("description");
                setStageProgress(0);
              }, 300);
            }
          }, 30);
          break;
        }
        
        case "description": {
          // 描述阶段
          const detail = currentDefect.defect_detail[currentDetailIndex];
          const text = detail.defect_description;
          const key = `description-${currentDefectIndex}-${currentDetailIndex}`;
          
          if (!text) {
            // 如果没有描述，检查是否有下一个缺陷详情
            if (currentDetailIndex < currentDefect.defect_detail.length - 1) {
              // 移至下一个缺陷详情
              setTimeout(() => {
                setCurrentDetailIndex(prev => prev + 1);
                setTypingStage("defect_type");
                setStageProgress(0);
              }, 300);
            } else if (currentDefectIndex < frame.defects.length - 1) {
              // 移至下一个缺陷
              setTimeout(() => {
                setCurrentDefectIndex(prev => prev + 1);
                setCurrentDetailIndex(0);
                setTypingStage("facility");
                setStageProgress(0);
              }, 500);
            } else {
              // 所有缺陷都已处理完毕
              setTypingComplete(true);
            }
            return;
          }
          
          typingIntervalRef.current = setInterval(() => {
            if (stageProgress < text.length) {
              setTypingTexts(prev => ({
                ...prev,
                [key]: text.substring(0, stageProgress + 1),
              }));
              setStageProgress(prev => prev + 1);
            } else {
              // 当前描述完成，清理计时器
              clearInterval(typingIntervalRef.current!);
              typingIntervalRef.current = null;
              
              // 检查是否有更多的缺陷详情
              if (currentDetailIndex < currentDefect.defect_detail.length - 1) {
                // 移至下一个缺陷详情
                setTimeout(() => {
                  setCurrentDetailIndex(prev => prev + 1);
                  setTypingStage("defect_type");
                  setStageProgress(0);
                }, 500);
              } else if (currentDefectIndex < frame.defects.length - 1) {
                // 移至下一个缺陷
                setTimeout(() => {
                  setCurrentDefectIndex(prev => prev + 1);
                  setCurrentDetailIndex(0);
                  setTypingStage("facility");
                  setStageProgress(0);
                }, 700);
              } else {
                // 所有缺陷都已处理完毕
                setTimeout(() => {
                  setTypingComplete(true);
                }, 500);
              }
            }
          }, 30);
          break;
        }
        
        default:
          break;
      }
    };
    
    processCurrentStage();
    
    // 组件卸载时清理计时器
    return () => {
      if (typingIntervalRef.current) {
        clearInterval(typingIntervalRef.current);
        typingIntervalRef.current = null;
      }
    };
  }, [currentFrame, currentDefectIndex, currentDetailIndex, typingStage, stageProgress, typingComplete]);

  // 更新帧的函数
  const updateFrame = useCallback(() => {
    if (typingComplete || !currentFrame.isKeyFrame) {
      setCurrentFrameIndex((prev) => {
        const nextIndex = prev + 1
        // 如果到了最后一帧，循环播放
        if (nextIndex >= allFrames.length) {
          return 0
        }
        return nextIndex
      })
    }
  }, [allFrames.length, currentFrame.isKeyFrame, typingComplete])

  // 处理播放/暂停
  useEffect(() => {
    // 清理现有计时器
    if (frameIntervalRef.current) {
      clearInterval(frameIntervalRef.current)
      frameIntervalRef.current = null
    }

    // 如果正在播放，则设置计时器
    if (isPlaying) {
      frameIntervalRef.current = setInterval(updateFrame, 300) // 修改为300毫秒一帧，速度更快
    }

    return () => {
      if (frameIntervalRef.current) {
        clearInterval(frameIntervalRef.current)
        frameIntervalRef.current = null
      }
    }
  }, [isPlaying, updateFrame])

  // 当帧变化时，更新时间并开始打字动画
  useEffect(() => {
    // 更新视频时间
    setCurrentTime(currentFrame.timestamp)

    // 如果是关键帧，开始打字动画
    if (currentFrame.isKeyFrame) {
      startTypingAnimations(currentFrame)
    } else {
      setTypingComplete(true) // 非关键帧直接标记为完成
    }
  }, [currentFrame, startTypingAnimations])

  // 控制播放/暂停
  const togglePlayPause = useCallback(() => {
    setIsPlaying((prev) => !prev)
  }, [])

  // 跳转到下一个关键帧
  const jumpToNextKeyFrame = useCallback(() => {
    const nextKeyFrameIndex = allFrames.findIndex(
      (frame, index) => index > currentFrameIndex && frame.isKeyFrame
    )
    
    if (nextKeyFrameIndex !== -1) {
      setCurrentFrameIndex(nextKeyFrameIndex)
    }
  }, [allFrames, currentFrameIndex])

  // 跳转到上一个关键帧
  const jumpToPrevKeyFrame = useCallback(() => {
    // 从当前位置向前查找
    for (let i = currentFrameIndex - 1; i >= 0; i--) {
      if (allFrames[i].isKeyFrame) {
        setCurrentFrameIndex(i)
        return
      }
    }
    
    // 如果没找到，从末尾查找
    for (let i = allFrames.length - 1; i > currentFrameIndex; i--) {
      if (allFrames[i].isKeyFrame) {
        setCurrentFrameIndex(i)
        return
      }
    }
  }, [allFrames, currentFrameIndex])

  // 添加键盘控制
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        togglePlayPause()
      } else if (e.code === "ArrowRight") {
        // 前进一帧
        setCurrentFrameIndex((prev) => Math.min(prev + 1, allFrames.length - 1))
      } else if (e.code === "ArrowLeft") {
        // 后退一帧
        setCurrentFrameIndex((prev) => Math.max(prev - 1, 0))
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [allFrames.length, togglePlayPause])

  // 组件卸载时清理
  useEffect(() => {
    return cleanupTimers
  }, [cleanupTimers])

  // 调试用：打印当前帧信息
  useEffect(() => {
    console.log("当前帧:", currentFrame);
  }, [currentFrame]);

  return (
    <div className="w-full aspect-video bg-gray-900 flex flex-col max-w-[2018px] mx-auto">
      {/* 标题栏 */}
      <div className="bg-gray-800 text-white p-4 flex justify-between items-center">
        <h1 className="text-xl font-medium">全景视频缺陷检测系统</h1>
        <div className="flex items-center gap-4">
          <div className="text-sm bg-gray-700 px-3 py-1 rounded">
            视频: {videoName}
          </div>
          <div className="flex items-center gap-2 bg-gray-700 px-3 py-1 rounded-full">
            <div className={`w-2 h-2 rounded-full ${isPlaying ? "bg-green-500 animate-pulse" : "bg-red-500"}`}></div>
            <div className="text-sm">{isPlaying ? "正在检测" : "已暂停"}</div>
          </div>
          <div className="text-sm text-gray-300">
            {currentTime} / {allFrames[allFrames.length - 1].timestamp}
          </div>
        </div>
      </div>

      {/* 主内容区域 - 左右布局 */}
      <div className="flex-1 flex flex-row">
        {/* 左侧 - 视频区域 */}
        <div className="w-3/4 flex flex-col">
          <div className="flex-1">
            <FrameDisplay 
              frame={currentFrame} 
              isPlaying={isPlaying}
              togglePlayPause={togglePlayPause}
              jumpToNextKeyFrame={jumpToNextKeyFrame}
              jumpToPrevKeyFrame={jumpToPrevKeyFrame}
            />
          </div>
          
          {/* 进度条 */}
          <div className="h-2 bg-gray-700 relative">
            <div
              className="h-full bg-cyan-500 transition-all duration-200"
              style={{ width: `${(currentFrameIndex / (allFrames.length - 1)) * 100}%` }}
            ></div>

            {/* 关键帧标记 - 只显示已经播放过的关键帧 */}
            {allFrames.map((frame, index) => {
              // 只有当前帧索引大于等于该帧时才显示关键帧标记
              if (frame.isKeyFrame && index <= currentFrameIndex) {
                const positionPercent = (index / (allFrames.length - 1)) * 100
                return (
                  <div
                    key={index}
                    className="absolute top-0 w-1.5 h-4 bg-orange-500 -translate-y-1 rounded cursor-pointer hover:bg-orange-400 hover:scale-110 transition-all shadow-md"
                    style={{ left: `${positionPercent}%` }}
                    onClick={() => setCurrentFrameIndex(index)}
                    title={`关键帧 ${frame.timestamp}`}
                  ></div>
                )
              }
              return null
            })}
          </div>
        </div>

        {/* 右侧 - 检测结果区域 */}
        <div className="w-1/4 border-l border-gray-700 flex flex-col h-full">
          <DefectsList 
            frame={currentFrame} 
            typingTexts={typingTexts}
            currentFrameIndex={currentFrameIndex}
            totalFrames={allFrames.length}
          />
        </div>
      </div>

      {/* 自定义样式 */}
      <style jsx>{`
        .aspect-video {
          aspect-ratio: 16 / 9;
          // height: calc(100vh - 2rem);
          // max-height: 900px;
        }
      `}</style>
    </div>
  )
}

