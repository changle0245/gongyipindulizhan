'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { X, Upload, Loader2, CheckCircle } from 'lucide-react';
import Image from 'next/image';

interface QuoteItem {
  productId: string;
  productName: string;
  quantity: number;
  imageUrl?: string;
}

export default function QuotePage({ params: { locale } }: { params: { locale: string } }) {
  const t = useTranslations();
  const [quoteItems, setQuoteItems] = useState<QuoteItem[]>([]);
  const [customImages, setCustomImages] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    customerName: '',
    email: '',
    company: '',
    phone: '',
    message: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // 处理自定义图片上传
  const handleCustomImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const formData = new FormData();
    Array.from(files).forEach((file) => {
      formData.append('images', file);
    });

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) throw new Error('Upload failed');

      const data = await res.json();
      setCustomImages((prev) => [...prev, ...data.files]);
    } catch (error) {
      console.error('Error uploading images:', error);
      alert('Failed to upload images');
    }
  };

  // 移除自定义图片
  const removeCustomImage = (index: number) => {
    setCustomImages((prev) => prev.filter((_, i) => i !== index));
  };

  // 提交询价
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const res = await fetch('/api/quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          products: quoteItems,
          customImages,
        }),
      });

      if (!res.ok) throw new Error('Failed to send quote');

      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setQuoteItems([]);
        setCustomImages([]);
        setFormData({
          customerName: '',
          email: '',
          company: '',
          phone: '',
          message: '',
        });
      }, 3000);
    } catch (error) {
      console.error('Error submitting quote:', error);
      alert(t('quote.error'));
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="container mx-auto px-4 py-16">
        <Card className="max-w-md mx-auto text-center">
          <CardContent className="pt-12 pb-12">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">{t('quote.success')}</h2>
            <p className="text-zinc-600">
              We&apos;ll get back to you soon!
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">{t('quote.title')}</h1>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Quote Items */}
          <Card>
            <CardHeader>
              <CardTitle>{t('quote.yourQuoteList')}</CardTitle>
            </CardHeader>
            <CardContent>
              {quoteItems.length === 0 ? (
                <div className="text-center py-8 text-zinc-500">
                  <p>{t('quote.emptyQuoteList')}</p>
                  <p className="text-sm mt-2">{t('quote.addProducts')}</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {quoteItems.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div className="flex items-center gap-4 flex-1">
                        {item.imageUrl && (
                          <div className="w-16 h-16 rounded overflow-hidden">
                            <Image
                              src={item.imageUrl}
                              alt={item.productName}
                              width={64}
                              height={64}
                              className="object-cover"
                            />
                          </div>
                        )}
                        <div className="flex-1">
                          <h4 className="font-medium">{item.productName}</h4>
                          <p className="text-sm text-zinc-600">
                            {t('quote.quantity')}: {item.quantity}
                          </p>
                        </div>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() =>
                          setQuoteItems((prev) => prev.filter((_, i) => i !== index))
                        }
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Custom Images Upload */}
          <Card>
            <CardHeader>
              <CardTitle>{t('quote.uploadImage')}</CardTitle>
              <p className="text-sm text-zinc-600">
                {t('quote.uploadImageDesc')}
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border-2 border-dashed border-zinc-300 rounded-lg p-8 text-center">
                  <Upload className="w-10 h-10 mx-auto text-zinc-400 mb-2" />
                  <p className="text-sm text-zinc-600 mb-2">
                    Upload your product images
                  </p>
                  <Input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleCustomImageUpload}
                    className="hidden"
                    id="custom-upload"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => document.getElementById('custom-upload')?.click()}
                  >
                    Select Images
                  </Button>
                </div>

                {customImages.length > 0 && (
                  <div className="grid grid-cols-4 gap-2">
                    {customImages.map((img, index) => (
                      <div key={index} className="relative group aspect-square">
                        <Image
                          src={img}
                          alt={`Custom ${index + 1}`}
                          fill
                          className="object-cover rounded"
                        />
                        <button
                          type="button"
                          onClick={() => removeCustomImage(index)}
                          className="absolute top-1 right-1 bg-black/50 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Customer Info */}
          <Card>
            <CardHeader>
              <CardTitle>{t('quote.customerInfo')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">{t('quote.name')} *</Label>
                  <Input
                    id="name"
                    required
                    value={formData.customerName}
                    onChange={(e) =>
                      setFormData({ ...formData, customerName: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="email">{t('quote.email')} *</Label>
                  <Input
                    id="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="company">{t('quote.company')}</Label>
                  <Input
                    id="company"
                    value={formData.company}
                    onChange={(e) =>
                      setFormData({ ...formData, company: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="phone">{t('quote.phone')}</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="message">{t('quote.message')}</Label>
                <Textarea
                  id="message"
                  rows={4}
                  value={formData.message}
                  onChange={(e) =>
                    setFormData({ ...formData, message: e.target.value })
                  }
                />
              </div>
            </CardContent>
          </Card>

          {/* Submit Button */}
          <Button
            type="submit"
            size="lg"
            className="w-full"
            disabled={submitting || formData.customerName === '' || formData.email === ''}
          >
            {submitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                {t('quote.submit')}...
              </>
            ) : (
              t('quote.submit')
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}
