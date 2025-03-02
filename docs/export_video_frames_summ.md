# 视频帧导出功能总结

## 问题描述

需要开发一个脚本，根据视频ID导出视频的所有帧信息，包括关键帧的ground truth数据，并以JSON格式保存。

## 数据库结构分析

通过分析MongoDB数据库结构，我们发现了以下关键集合和字段：

1. **videos集合**：存储视频基本信息
   - `_id`：视频唯一标识符
   - `name`：视频文件名
   - `status`：视频处理状态
   - `created_at`：创建时间

2. **video_frames集合**：存储视频的每一帧
   - `_id`：帧唯一标识符
   - `video_id`：关联的视频ID
   - `frame_number`：帧号（格式为"分钟:秒"）
   - `frame_type`：帧类型（如"panorama"全景图）
   - `is_key_frame`：是否为关键帧
   - `image_id`：关联的图像ID
   - `image_path`：图像URL路径

3. **images集合**：存储图像信息
   - `_id`：图像唯一标识符
   - `ground_truth`：标注的缺陷信息（仅关键帧有此字段）

## 解决方案

我们开发了一个Python脚本`export_video_frames.py`，实现以下功能：

1. 接受视频ID作为输入参数
2. 连接MongoDB数据库
3. 获取视频基本信息
4. 获取视频的所有帧
5. 对于关键帧，获取其ground truth信息
6. 将数据组织成预定义的JSON格式
7. 保存JSON输出到指定文件

### 关键技术点

1. **ID格式处理**：脚本支持多种ID格式，包括：
   - MongoDB ObjectId格式
   - 字符串格式的ID
   - 自定义ID字段

2. **数据关联**：
   - 视频 -> 视频帧 -> 图像 -> ground truth

3. **URL清理**：
   - 删除OSS图像URL中的鉴权信息（如`OSSAccessKeyId`、`Expires`和`Signature`参数）
   - 保留纯净的图像URL路径

4. **JSON格式**：
   ```json
   {
     "video_id": "视频ID",
     "video_name": "视频文件名",
     "total_frames": 帧总数,
     "export_time": "导出时间",
     "frames": [
       {
         "frame_id": "帧ID",
         "frame_number": "帧号",
         "timestamp": "时间戳",
         "timestamp_seconds": 秒数,
         "image_url": "图像URL",
         "is_key_frame": 是否为关键帧,
         "ground_truth": {  // 仅关键帧有此字段
           "detected_defects": [
             {
               "facility_type": "设施类型",
               "defect_detail": [
                 {
                   "defect_type": "缺陷类型",
                   "defect_description": "缺陷描述",
                   "confidence": 置信度,
                   "is_critical": 是否严重
                 }
               ]
             }
           ]
         }
       }
     ]
   }
   ```

## 使用方法

```bash
# 激活环境
conda activate defect_api

# 运行脚本
python scripts/export_video_frames.py <视频ID> -o <输出文件路径>

# 示例
python scripts/export_video_frames.py 676ade048a4c34f605eaf176 -o video_frames_export.json
```

## 测试结果

成功导出了视频ID为`6780bc09fa524e80aa2f1201`的视频帧信息，共233帧。导出的JSON文件包含了视频基本信息、所有帧的详细信息以及关键帧的ground truth数据。

### URL清理示例

原始URL:
```
http://virgin.oss-cn-shenzhen.aliyuncs.com/videos%2F676aad0b5bfbb960a09b1fca%2F676ade048a4c34f605eaf176%2Fframes%2F00%3A59%2Fpanorama.jpg?OSSAccessKeyId=LTAIPomcfXFraOqV&Expires=1735061253&Signature=SrgYvZK2v5gapXUJcQqFrxm1Mzo%3D
```

清理后URL:
```
http://virgin.oss-cn-shenzhen.aliyuncs.com/videos%2F676aad0b5bfbb960a09b1fca%2F676ade048a4c34f605eaf176%2Fframes%2F00%3A59%2Fpanorama.jpg
```

## 注意事项

1. 数据库名称为`defect_app`，而非`defect_api`
2. 视频ID可能有多种格式，脚本已做兼容处理
3. 只处理`frame_type`为`panorama`的帧
4. 时间戳基于帧号计算，格式为"分钟:秒"
5. 导出的图像URL已删除鉴权信息，便于后续处理和分享 