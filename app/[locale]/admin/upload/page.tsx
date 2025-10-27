'use client';

import { useState, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Upload, X, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { AIGeneratedProduct } from '@/lib/types';

interface UploadedImage {
  file: File;
  preview: string;
  status: 'pending' | 'processing' | 'success' | 'error';
  aiData?: AIGeneratedProduct;
  error?: string;
}

export default function AdminUploadPage({ params: { locale } }: { params: { locale: string } }) {
  const t = useTranslations();
  const [images, setImages] = useState<UploadedImage[]>([]);
  const [autoPublish, setAutoPublish] = useState(true);
  const [uploading, setUploading] = useState(false);

  // 处理文件选择
  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newImages: UploadedImage[] = Array.from(files).map((file) => ({
      file,
      preview: URL.createObjectURL(file),
      status: 'pending',
    }));

    setImages((prev) => [...prev, ...newImages]);
  }, []);

  // 拖拽上传
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const files = e.dataTransfer.files;

    const newImages: UploadedImage[] = Array.from(files)
      .filter((file) => file.type.startsWith('image/'))
      .map((file) => ({
        file,
        preview: URL.createObjectURL(file),
        status: 'pending',
      }));

    setImages((prev) => [...prev, ...newImages]);
  }, []);

  // 移除图片
  const removeImage = (index: number) => {
    setImages((prev) => {
      const newImages = [...prev];
      URL.revokeObjectURL(newImages[index].preview);
      newImages.splice(index, 1);
      return newImages;
    });
  };

  // 批量处理图片
  const handleBatchUpload = async () => {
    setUploading(true);

    for (let i = 0; i < images.length; i++) {
      if (images[i].status !== 'pending') continue;

      // 更新状态为处理中
      setImages((prev) => {
        const updated = [...prev];
        updated[i].status = 'processing';
        return updated;
      });

      try {
        // 1. 上传图片文件
        const formData = new FormData();
        formData.append('images', images[i].file);

        const uploadRes = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        if (!uploadRes.ok) throw new Error('Upload failed');

        const uploadData = await uploadRes.json();
        const imageUrl = uploadData.files[0];

        // 2. AI 生成产品信息
        const aiFormData = new FormData();
        aiFormData.append('image', images[i].file);
        aiFormData.append('autoPublish', autoPublish.toString());

        const aiRes = await fetch('/api/ai-generate', {
          method: 'POST',
          body: aiFormData,
        });

        if (!aiRes.ok) throw new Error('AI generation failed');

        const aiData = await aiRes.json();

        // 3. 如果启用自动发布，保存产品
        if (autoPublish) {
          const productData = {
            ...aiData.product,
            images: [imageUrl],
          };

          const saveRes = await fetch('/api/products', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(productData),
          });

          if (!saveRes.ok) throw new Error('Save product failed');
        }

        // 更新状态为成功
        setImages((prev) => {
          const updated = [...prev];
          updated[i].status = 'success';
          updated[i].aiData = aiData.product;
          return updated;
        });
      } catch (error) {
        console.error('Error processing image:', error);
        // 更新状态为失败
        setImages((prev) => {
          const updated = [...prev];
          updated[i].status = 'error';
          updated[i].error = error instanceof Error ? error.message : 'Unknown error';
          return updated;
        });
      }
    }

    setUploading(false);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">{t('admin.title')}</h1>
          <p className="text-zinc-600">
            {t('admin.uploadImage')} - AI {t('admin.generating')}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Upload Area */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>{t('admin.batchUpload')}</CardTitle>
                <CardDescription>
                  {t('admin.dragDrop')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* Drop Zone */}
                <div
                  onDrop={handleDrop}
                  onDragOver={(e) => e.preventDefault()}
                  className="border-2 border-dashed border-zinc-300 rounded-lg p-12 text-center hover:border-zinc-400 transition cursor-pointer"
                  onClick={() => document.getElementById('file-input')?.click()}
                >
                  <Upload className="w-12 h-12 mx-auto text-zinc-400 mb-4" />
                  <p className="text-zinc-600 mb-2">
                    {t('admin.dragDrop')}
                  </p>
                  <p className="text-sm text-zinc-500">
                    Support: JPG, PNG, WEBP (Max 10MB each)
                  </p>
                  <Input
                    id="file-input"
                    type="file"
                    multiple
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileSelect}
                  />
                </div>

                {/* Auto Publish Toggle */}
                <div className="mt-6 flex items-center justify-between">
                  <div>
                    <Label className="text-base font-medium">
                      Auto-publish products
                    </Label>
                    <p className="text-sm text-zinc-500 mt-1">
                      AI will generate and publish products immediately
                    </p>
                  </div>
                  <Button
                    variant={autoPublish ? 'default' : 'outline'}
                    onClick={() => setAutoPublish(!autoPublish)}
                  >
                    {autoPublish ? 'ON' : 'OFF'}
                  </Button>
                </div>

                {/* Upload Button */}
                {images.length > 0 && (
                  <div className="mt-6 flex gap-4">
                    <Button
                      onClick={handleBatchUpload}
                      disabled={uploading}
                      size="lg"
                      className="flex-1"
                    >
                      {uploading ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>Process {images.length} Images</>
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setImages([])}
                      disabled={uploading}
                      size="lg"
                    >
                      Clear All
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Image Grid */}
            {images.length > 0 && (
              <div className="mt-6 grid grid-cols-2 md:grid-cols-3 gap-4">
                {images.map((img, index) => (
                  <div key={index} className="relative group">
                    <div className="aspect-square rounded-lg overflow-hidden border-2 border-zinc-200">
                      <img
                        src={img.preview}
                        alt={`Upload ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Status Badge */}
                    <div className="absolute top-2 left-2">
                      {img.status === 'pending' && (
                        <Badge variant="secondary">Pending</Badge>
                      )}
                      {img.status === 'processing' && (
                        <Badge className="bg-blue-500">
                          <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                          Processing
                        </Badge>
                      )}
                      {img.status === 'success' && (
                        <Badge className="bg-green-500">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Success
                        </Badge>
                      )}
                      {img.status === 'error' && (
                        <Badge variant="destructive">
                          <AlertCircle className="w-3 h-3 mr-1" />
                          Error
                        </Badge>
                      )}
                    </div>

                    {/* Remove Button */}
                    {img.status === 'pending' && (
                      <button
                        onClick={() => removeImage(index)}
                        className="absolute top-2 right-2 bg-black/50 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Instructions */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>How it works</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm">
                <div>
                  <h4 className="font-medium mb-1">1. Upload Images</h4>
                  <p className="text-zinc-600">
                    Drag & drop or click to select multiple product images
                  </p>
                </div>
                <div>
                  <h4 className="font-medium mb-1">2. AI Processing</h4>
                  <p className="text-zinc-600">
                    AI analyzes each image and generates product information in 3 languages
                  </p>
                </div>
                <div>
                  <h4 className="font-medium mb-1">3. Auto Publish</h4>
                  <p className="text-zinc-600">
                    Products are published immediately (you can edit later)
                  </p>
                </div>
                <div>
                  <h4 className="font-medium mb-1">4. AI Learning</h4>
                  <p className="text-zinc-600">
                    AI learns from your edits to improve future generations
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Statistics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-zinc-600">Total:</span>
                  <span className="font-medium">{images.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-600">Pending:</span>
                  <span className="font-medium">
                    {images.filter((img) => img.status === 'pending').length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-600">Processing:</span>
                  <span className="font-medium text-blue-600">
                    {images.filter((img) => img.status === 'processing').length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-600">Success:</span>
                  <span className="font-medium text-green-600">
                    {images.filter((img) => img.status === 'success').length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-600">Failed:</span>
                  <span className="font-medium text-red-600">
                    {images.filter((img) => img.status === 'error').length}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
