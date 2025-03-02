import FrameByFrameDetector from "@/components/frame-by-frame-detector";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-8 text-center text-gray-800 dark:text-white">
          视频逐帧检测系统
        </h1>
        <div className="max-w-6xl mx-auto">
          <FrameByFrameDetector />
        </div>
      </div>
    </div>
  );
}
