'use client';

import { Plus, X } from 'lucide-react';
import React, { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { canisterService } from '@/services/canisterService';

export default function CourseContributionPage() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    difficulty: '',
    introduction: '',
    learning_objectives: [''],
    prerequisites: [''],
    estimated_duration_hours: '',
    token_reward: '',
    price_tokens: '',
    creator_name: '',
    creator_bio: '',
    thumbnail_url: '',
    tags: [''],
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{ type: 'success' | 'error' | null; message: string }>({
    type: null,
    message: '',
  });

  const categories = [
    { value: 'motoko', label: 'MOTOKO' },
    { value: 'icp', label: 'ICP' },
    { value: 'blockchain', label: 'Blockchain' },
    { value: 'trading', label: 'Trading' },
    { value: 'ai', label: 'Artificial Intelligence' },
    { value: 'programming', label: 'Programming' },
    { value: 'defi', label: 'DeFi' },
    { value: 'nft', label: 'NFT' },
    { value: 'web3', label: 'Web3' },
  ];

  const difficulties = [
    { value: 'beginner', label: 'Beginner' },
    { value: 'intermediate', label: 'Intermediate' },
    { value: 'advanced', label: 'Advanced' },
    { value: 'expert', label: 'Expert' },
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleArrayChange = (field: string, index: number, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: (prev[field as keyof typeof prev] as string[]).map((item: string, i: number) =>
        i === index ? value : item,
      ),
    }));
  };

  const addArrayItem = (field: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: [...(prev[field as keyof typeof prev] as string[]), ''],
    }));
  };

  const removeArrayItem = (field: string, index: number) => {
    const currentArray = formData[field as keyof typeof formData] as string[];
    if (currentArray.length > 1) {
      setFormData((prev) => ({
        ...prev,
        [field]: (prev[field as keyof typeof prev] as string[]).filter((_: any, i: number) => i !== index),
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus({ type: null, message: '' });

    try {
      // Validate required fields
      if (!formData.title || !formData.description || !formData.category || !formData.difficulty) {
        throw new Error('Please fill in all required fields');
      }

      // Check if canister service is available
      if (!canisterService.isInitialized()) {
        throw new Error('Canister service not initialized. Please try refreshing the page.');
      }

      const coursesActor = canisterService.getActor('courses');

      // Map form values to correct Motoko types
      const categoryMap: Record<string, any> = {
        motoko: { motoko: null },
        blockchain: { blockchain: null },
        web3: { web3: null },
        defi: { defi: null },
        nft: { nft: null },
        trading: { trading: null },
        ai: { ai: null },
        icp: { icp: null },
        programming: { programming: null },
        other: { other: null },
      };

      const difficultyMap: Record<string, any> = {
        beginner: { beginner: null },
        intermediate: { intermediate: null },
        advanced: { advanced: null },
        expert: { expert: null },
      };

      // Prepare course submission data
      const courseSubmission = {
        title: formData.title,
        description: formData.description,
        category: categoryMap[formData.category] || { other: null },
        difficulty: difficultyMap[formData.difficulty] || { beginner: null },
        creator_info: {
          name: formData.creator_name || 'Anonymous',
          bio: formData.creator_bio ? [formData.creator_bio] : [],
          linkedin: [],
          github: [],
          website: [],
          portfolio: [],
        } as any,
        content: {
          introduction: formData.introduction,
          learning_objectives: formData.learning_objectives.filter((obj) => obj.trim() !== ''),
          prerequisites: formData.prerequisites.filter((prereq) => prereq.trim() !== ''),
          sections: [],
          estimated_duration_hours: BigInt(parseInt(formData.estimated_duration_hours) || 1),
        },
        token_reward: BigInt(parseInt(formData.token_reward) || 100),
        price_tokens: BigInt(parseInt(formData.price_tokens) || 0),
        thumbnail_url: (formData.thumbnail_url ? [formData.thumbnail_url] : []) as [] | [string],
        tags: formData.tags.filter((tag) => tag.trim() !== ''),
      };

      console.log('Submitting course:', courseSubmission);
      const result = await coursesActor.createCourse(courseSubmission);

      if ('ok' in result) {
        setSubmitStatus({
          type: 'success',
          message: `Course submitted successfully! Course ID: ${result.ok}. Your course is now pending approval.`,
        });

        // Reset form
        setFormData({
          title: '',
          description: '',
          category: '',
          difficulty: '',
          introduction: '',
          learning_objectives: [''],
          prerequisites: [''],
          estimated_duration_hours: '',
          token_reward: '',
          price_tokens: '',
          creator_name: '',
          creator_bio: '',
          thumbnail_url: '',
          tags: [''],
        });
      } else {
        throw new Error(result.err || 'Failed to submit course');
      }
    } catch (error) {
      console.error('Error submitting course:', error);
      setSubmitStatus({
        type: 'error',
        message: error instanceof Error ? error.message : 'An unexpected error occurred',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <div className="mb-8">
        <h1 className="mb-2 text-4xl font-bold">
          <span className="text-purple-700">CONTRIBUTE</span>
          <span className="text-black"> COURSE</span>
        </h1>
        <p className="text-gray-600">Share your knowledge with the Know Fi community by creating a course.</p>
      </div>

      <Card className="border-2 border-gray-200">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-gray-900">Course Submission Form</CardTitle>
          <CardDescription>Fill out the details below to submit your course for review.</CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Basic Information</h3>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="title">Course Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    placeholder="e.g., MOTOKO Fundamentals"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="creator_name">Your Name</Label>
                  <Input
                    id="creator_name"
                    value={formData.creator_name}
                    onChange={(e) => handleInputChange('creator_name', e.target.value)}
                    placeholder="e.g., John Doe"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="description">Course Description *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Describe what students will learn in this course..."
                  rows={3}
                  required
                />
              </div>

              <div>
                <Label htmlFor="creator_bio">Your Bio</Label>
                <Textarea
                  id="creator_bio"
                  value={formData.creator_bio}
                  onChange={(e) => handleInputChange('creator_bio', e.target.value)}
                  placeholder="Tell us about your background and expertise..."
                  rows={2}
                />
              </div>

              <div>
                <Label htmlFor="thumbnail_url">Course Thumbnail URL (optional)</Label>
                <Input
                  id="thumbnail_url"
                  type="url"
                  value={formData.thumbnail_url}
                  onChange={(e) => handleInputChange('thumbnail_url', e.target.value)}
                  placeholder="https://example.com/course-thumbnail.png"
                />
              </div>
            </div>

            {/* Course Details */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Course Details</h3>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <div>
                  <Label htmlFor="category">Category *</Label>
                  <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat.value} value={cat.value}>
                          {cat.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="difficulty">Difficulty *</Label>
                  <Select value={formData.difficulty} onValueChange={(value) => handleInputChange('difficulty', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select difficulty" />
                    </SelectTrigger>
                    <SelectContent>
                      {difficulties.map((diff) => (
                        <SelectItem key={diff.value} value={diff.value}>
                          {diff.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="estimated_duration_hours">Duration (hours)</Label>
                  <Input
                    id="estimated_duration_hours"
                    type="number"
                    value={formData.estimated_duration_hours}
                    onChange={(e) => handleInputChange('estimated_duration_hours', e.target.value)}
                    placeholder="e.g., 5"
                    min="1"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="introduction">Course Introduction</Label>
                <Textarea
                  id="introduction"
                  value={formData.introduction}
                  onChange={(e) => handleInputChange('introduction', e.target.value)}
                  placeholder="Write an engaging introduction to your course..."
                  rows={3}
                />
              </div>
            </div>

            {/* Learning Objectives */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Learning Objectives</Label>
                <Button type="button" variant="outline" size="sm" onClick={() => addArrayItem('learning_objectives')}>
                  <Plus className="mr-1 h-4 w-4" />
                  Add Objective
                </Button>
              </div>

              {formData.learning_objectives.map((objective, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    value={objective}
                    onChange={(e) => handleArrayChange('learning_objectives', index, e.target.value)}
                    placeholder={`Learning objective ${index + 1}`}
                  />
                  {formData.learning_objectives.length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeArrayItem('learning_objectives', index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>

            {/* Prerequisites */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Prerequisites</Label>
                <Button type="button" variant="outline" size="sm" onClick={() => addArrayItem('prerequisites')}>
                  <Plus className="mr-1 h-4 w-4" />
                  Add Prerequisite
                </Button>
              </div>

              {formData.prerequisites.map((prerequisite, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    value={prerequisite}
                    onChange={(e) => handleArrayChange('prerequisites', index, e.target.value)}
                    placeholder={`Prerequisite ${index + 1}`}
                  />
                  {formData.prerequisites.length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeArrayItem('prerequisites', index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>

            {/* Tags */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Tags</Label>
                <Button type="button" variant="outline" size="sm" onClick={() => addArrayItem('tags')}>
                  <Plus className="mr-1 h-4 w-4" />
                  Add Tag
                </Button>
              </div>

              {formData.tags.map((tag, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    value={tag}
                    onChange={(e) => handleArrayChange('tags', index, e.target.value)}
                    placeholder={`Tag ${index + 1}`}
                  />
                  {formData.tags.length > 1 && (
                    <Button type="button" variant="outline" size="sm" onClick={() => removeArrayItem('tags', index)}>
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>

            {/* Rewards */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Course Rewards</h3>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="token_reward">Token Reward for Students</Label>
                  <Input
                    id="token_reward"
                    type="number"
                    value={formData.token_reward}
                    onChange={(e) => handleInputChange('token_reward', e.target.value)}
                    placeholder="e.g., 100"
                    min="0"
                  />
                </div>

                <div>
                  <Label htmlFor="price_tokens">Course Price (Tokens)</Label>
                  <Input
                    id="price_tokens"
                    type="number"
                    value={formData.price_tokens}
                    onChange={(e) => handleInputChange('price_tokens', e.target.value)}
                    placeholder="0 for free"
                    min="0"
                  />
                </div>
              </div>
            </div>

            {/* Status Messages */}
            {submitStatus.type && (
              <div
                className={`rounded-lg p-4 ${
                  submitStatus.type === 'success'
                    ? 'border border-green-400 bg-green-100 text-green-700'
                    : 'border border-red-400 bg-red-100 text-red-700'
                }`}
              >
                {submitStatus.message}
              </div>
            )}
          </CardContent>

          <CardFooter className="flex justify-between">
            <Button type="button" variant="outline" onClick={() => window.history.back()}>
              Cancel
            </Button>
            <Button type="submit" className="bg-purple-700 hover:bg-purple-800" disabled={isSubmitting}>
              {isSubmitting ? 'Submitting...' : 'Submit Course for Review'}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
