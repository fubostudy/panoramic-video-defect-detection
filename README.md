# 全景视频缺陷检测系统

一个基于React和Next.js开发的全景视频缺陷检测前端系统，用于展示视频分析过程并实时显示检测到的缺陷信息。

## 功能特点

- 逐帧播放全景视频，支持暂停/播放控制
- 关键帧自动检测并在进度条中高亮显示
- 实时展示检测结果，包括设施类型、缺陷类型和详细描述
- 打字机效果逐行展示检测结果，增强用户体验
- 支持键盘快捷键控制视频播放
- 自动滚动显示最新检测结果
- 响应式设计，适配不同屏幕尺寸

## 技术栈

- React 18
- Next.js 13+
- TypeScript
- TailwindCSS
- React Hooks
- Lucide React (图标库)

## 项目结构

```
components/
  ├── defects-list.tsx      # 缺陷列表组件
  ├── frame-by-frame-detector.tsx  # 主检测器组件
  └── frame-display.tsx     # 帧显示组件
data/
  └── mock-data.ts          # 模拟数据
```

## 主要组件

### FrameByFrameDetector

系统的主组件，负责:
- 管理视频帧的播放状态
- 控制帧之间的切换
- 协调缺陷检测结果的显示
- 管理打字机效果的实现

### DefectsList

负责展示检测到的缺陷信息，包括:
- 设施类型
- 缺陷类型
- 缺陷描述
- 置信度
- 自动滚动到最新结果

### FrameDisplay

负责显示当前视频帧，提供:
- 播放/暂停控制
- 跳转到上一个/下一个关键帧
- 全屏显示
- 帧信息显示

## 使用说明

1. 克隆仓库
```bash
git clone https://github.com/fubostudy/panoramic-video-defect-detection.git
```

2. 安装依赖
```bash
cd panoramic-video-defect-detection
npm install
```

3. 运行开发服务器
```bash
npm run dev
```

4. 在浏览器中访问 http://localhost:3000

## 快捷键

- 空格键: 播放/暂停
- 左箭头: 上一帧
- 右箭头: 下一帧

## 许可证

MIT