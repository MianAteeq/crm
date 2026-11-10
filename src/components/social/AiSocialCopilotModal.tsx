import React, { useState } from 'react';
import {
  Sparkles,
  X,
  Wand2,
  Copy,
  Check,
  Hash,
  RefreshCw,
  SlidersHorizontal,
  Flame,
  Rocket,
  Lightbulb,
  CheckCircle2,
  Languages,
  Facebook,
  Instagram,
  ArrowRight,
  Briefcase,
  Smile,
  GraduationCap,
  Megaphone,
  TrendingUp,
  Target,
  Share2,
} from 'lucide-react';
import { socialPlannerApi } from '../../services/socialPlannerApi';
import { toast } from '../ui/Toast';

interface AiSocialCopilotModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentCaption: string;
  onApplyCaption: (caption: string, firstComment?: string) => void;
  platform?: 'all' | 'facebook' | 'instagram';
}

export const AiSocialCopilotModal: React.FC<AiSocialCopilotModalProps> = ({
  isOpen,
  onClose,
  currentCaption,
  onApplyCaption,
  platform = 'all',
}) => {
  const [activeTab, setActiveTab] = useState<'generate' | 'rewrite' | 'hashtags'>('generate');

  // Generator State
  const [topic, setTopic] = useState('');
  const [selectedPlatform, setSelectedPlatform] = useState<'all' | 'facebook' | 'instagram'>(platform);
  const [tone, setTone] = useState('engaging');
  const [goal, setGoal] = useState('engagement');
  const [language, setLanguage] = useState<'en' | 'ar' | 'ur' | 'es' | 'fr' | 'de' | 'pt' | 'hi' | 'it'>('en');
  const [includeEmojis, setIncludeEmojis] = useState(true);
  const [includeHashtags, setIncludeHashtags] = useState(true);
  const [includeCta, setIncludeCta] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [regeneratingIdx, setRegeneratingIdx] = useState<number | null>(null);

  // Results
  const [generatedVariations, setGeneratedVariations] = useState<
    Array<{ type: string; hook: string; caption: string; first_comment?: string }>
  >([]);
  const [generatedHashtags, setGeneratedHashtags] = useState<string[]>([]);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  // Rewriter State
  const [rewriteText, setRewriteText] = useState(currentCaption);
  const [isRewriting, setIsRewriting] = useState(false);
  const [improvedResult, setImprovedResult] = useState<{ text: string; explanation: string } | null>(null);

  // Hashtag Finder State
  const [hashtagTopic, setHashtagTopic] = useState(currentCaption || '');
  const [hashtagIndustry, setHashtagIndustry] = useState('');
  const [hashtagPlatform, setHashtagPlatform] = useState<'all' | 'facebook' | 'instagram'>(platform);
  const [isFindingTags, setIsFindingTags] = useState(false);
  const [tagResults, setTagResults] = useState<{
    broad: string[];
    niche: string[];
    community: string[];
    allString: string;
  } | null>(null);

  if (!isOpen) return null;

  const quickIdeas = [
    { label: '🔥 Special Offer', text: 'Limited-time special offer with a 25% discount available this weekend only!' },
    { label: '🚀 Product Launch', text: 'Exciting announcement of our brand new service designed to streamline operations.' },
    { label: '💡 Pro Industry Tips', text: 'Share 3 actionable practical tips that professionals can immediately implement.' },
    { label: '🏆 Success Story', text: 'Highlighting a customer success milestone and how they grew their results by 150%.' },
    { label: '❓ Audience Discussion', text: 'Engaging open question asking our community about their biggest workflow challenge.' },
  ];

  const toneOptions = [
    { value: 'professional', label: 'Professional' },
    { value: 'engaging', label: 'Engaging & Friendly' },
    { value: 'promotional', label: 'Promotional' },
    { value: 'educational', label: 'Educational' },
    { value: 'inspirational', label: 'Inspirational' },
    { value: 'humorous', label: 'Humorous' },
  ];

  const goalOptions = [
    { value: 'engagement', label: 'Boost Engagement' },
    { value: 'leads', label: 'Generate Leads' },
    { value: 'awareness', label: 'Increase Brand Awareness' },
    { value: 'traffic', label: 'Drive Website Traffic' },
    { value: 'sales', label: 'Promote Products or Services' },
    { value: 'event', label: 'Event Promotion' },
  ];

  const languageOptions = [
    { value: 'en', label: 'English' },
    { value: 'ar', label: 'Arabic (العربية)' },
    { value: 'ur', label: 'Urdu (اردو)' },
    { value: 'es', label: 'Spanish (Español)' },
    { value: 'fr', label: 'French (Français)' },
    { value: 'de', label: 'German (Deutsch)' },
    { value: 'pt', label: 'Portuguese (Português)' },
    { value: 'hi', label: 'Hindi (हिन्दी)' },
    { value: 'it', label: 'Italian (Italiano)' },
  ];

  const handleGenerate = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!topic.trim()) {
      toast.error('Please describe what your post is about.');
      return;
    }

    setIsGenerating(true);
    try {
      const res = await socialPlannerApi.generateAiCaptions({
        topic: topic.trim(),
        platform: selectedPlatform,
        tone,
        goal,
        language,
        include_emojis: includeEmojis,
        include_hashtags: includeHashtags,
        include_cta: includeCta,
      });

      if (res.success && res.data) {
        setGeneratedVariations(res.data.variations || []);
        setGeneratedHashtags(res.data.hashtags || []);
        toast.success('Generated 3 unique post variations!');
      } else {
        toast.error(res.message || 'Failed to generate captions');
      }
    } catch (err: any) {
      console.error('AI generation error:', err);
      toast.error(err.response?.data?.message || 'Failed to generate captions.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleRegenerateVariation = async (index: number) => {
    if (!topic.trim()) return;
    setRegeneratingIdx(index);
    try {
      const res = await socialPlannerApi.generateAiCaptions({
        topic: `${topic.trim()} (Generate fresh alternative variation for option ${index + 1})`,
        platform: selectedPlatform,
        tone,
        goal,
        language,
        include_emojis: includeEmojis,
        include_hashtags: includeHashtags,
        include_cta: includeCta,
      });

      if (res.success && res.data?.variations?.length) {
        const newVar = res.data.variations[index % res.data.variations.length] || res.data.variations[0];
        setGeneratedVariations((prev) => {
          const updated = [...prev];
          updated[index] = newVar;
          return updated;
        });
        toast.success(`Variation #${index + 1} regenerated!`);
      }
    } catch (err: any) {
      toast.error('Failed to regenerate variation.');
    } finally {
      setRegeneratingIdx(null);
    }
  };

  const handleRewrite = async (
    action: 'shorter' | 'longer' | 'professional' | 'engaging' | 'cta' | 'fix_grammar' | 'rewrite' | 'emojis'
  ) => {
    const textToProcess = rewriteText.trim() || currentCaption.trim();
    if (!textToProcess) {
      toast.error('Please enter or paste caption text to refine.');
      return;
    }

    setIsRewriting(true);
    try {
      const res = await socialPlannerApi.rewriteWithAi({
        text: textToProcess,
        action,
        target_language: languageOptions.find((l) => l.value === language)?.label || 'English',
      });

      if (res.success && res.data) {
        setImprovedResult({
          text: res.data.improved_text,
          explanation: res.data.explanation,
        });
        toast.success('Caption updated!');
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to rewrite caption.');
    } finally {
      setIsRewriting(false);
    }
  };

  const handleFindHashtags = async () => {
    if (!hashtagTopic.trim()) {
      toast.error('Please enter a post topic or draft caption.');
      return;
    }

    setIsFindingTags(true);
    try {
      const res = await socialPlannerApi.suggestAiHashtags({
        content: hashtagTopic.trim(),
        niche: hashtagIndustry.trim() || undefined,
        platform: hashtagPlatform,
      });

      if (res.success && res.data) {
        setTagResults({
          broad: res.data.broad_reach || [],
          niche: res.data.niche_specific || [],
          community: res.data.community_tags || [],
          allString: res.data.all_hashtags_string || '',
        });
        toast.success('Discovered curated hashtags!');
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to find hashtags.');
    } finally {
      setIsFindingTags(false);
    }
  };

  const handleCopy = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIdx(idx);
    toast.success('Copied to clipboard!');
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header - No AI model branding */}
        <div className="px-6 py-4.5 bg-[#166534] text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-white/15 backdrop-blur-md flex items-center justify-center border border-white/20">
              <Sparkles size={18} className="text-amber-300" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white leading-tight">AI Social Media Copilot</h2>
              <p className="text-xs text-emerald-100 mt-0.5">
                Generate high-quality captions, discover hashtags, and improve your social media content.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-emerald-100 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center px-6 border-b border-slate-200 bg-slate-50/70 shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab('generate')}
            className={`py-3 px-3 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'generate'
                ? 'border-[#166534] text-[#166534]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Wand2 size={14} />
            <span>Generate Captions</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveTab('rewrite');
              if (!rewriteText && currentCaption) setRewriteText(currentCaption);
            }}
            className={`py-3 px-3 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'rewrite'
                ? 'border-[#166534] text-[#166534]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <SlidersHorizontal size={14} />
            <span>Refine & Rewrite</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveTab('hashtags');
              if (!hashtagTopic && currentCaption) setHashtagTopic(currentCaption);
            }}
            className={`py-3 px-3 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'hashtags'
                ? 'border-[#166534] text-[#166534]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Hash size={14} />
            <span>Hashtag Finder</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* TAB 1: GENERATE CAPTIONS */}
          {activeTab === 'generate' && (
            <div className="space-y-5">
              <form onSubmit={handleGenerate} className="space-y-4">
                {/* Large Post Description Input */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">
                    Post Description
                  </label>
                  <textarea
                    rows={4}
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder="Describe what your post is about in detail (e.g., launching our new summer menu this Friday, announcing our partnership with XYZ, offering 20% off all consultations...)"
                    className="w-full text-xs sm:text-sm p-3.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#166534]/30 focus:border-[#166534] transition-all resize-y shadow-2xs text-slate-800 placeholder-slate-400"
                  />
                </div>

                {/* Quick Inspiration Presets */}
                <div>
                  <p className="text-[11px] font-semibold text-slate-400 mb-1.5 flex items-center gap-1">
                    <Sparkles size={11} className="text-amber-500" />
                    Quick Prompt Inspiration:
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {quickIdeas.map((idea) => (
                      <button
                        key={idea.label}
                        type="button"
                        onClick={() => setTopic(idea.text)}
                        className="px-2.5 py-1 text-[11px] font-medium bg-slate-100 hover:bg-emerald-50 hover:text-[#166534] hover:border-emerald-200 border border-slate-200/80 rounded-lg transition-all text-slate-700"
                      >
                        {idea.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Configuration Controls Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 bg-slate-50/80 p-4 rounded-2xl border border-slate-200/80">
                  {/* Platform Selector */}
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Platform</label>
                    <select
                      value={selectedPlatform}
                      onChange={(e) => setSelectedPlatform(e.target.value as any)}
                      className="w-full text-xs py-1.5 px-2 bg-white rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-[#166534]"
                    >
                      <option value="all">Both (Facebook & Instagram)</option>
                      <option value="facebook">Facebook</option>
                      <option value="instagram">Instagram</option>
                    </select>
                  </div>

                  {/* Tone Options */}
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Tone</label>
                    <select
                      value={tone}
                      onChange={(e) => setTone(e.target.value)}
                      className="w-full text-xs py-1.5 px-2 bg-white rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-[#166534]"
                    >
                      {toneOptions.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Goal Options */}
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Goal</label>
                    <select
                      value={goal}
                      onChange={(e) => setGoal(e.target.value)}
                      className="w-full text-xs py-1.5 px-2 bg-white rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-[#166534]"
                    >
                      {goalOptions.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Language Options */}
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1 flex items-center gap-1">
                      <Languages size={11} />
                      Language
                    </label>
                    <select
                      value={language}
                      onChange={(e) => setLanguage(e.target.value as any)}
                      className="w-full text-xs py-1.5 px-2 bg-white rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-[#166534]"
                    >
                      {languageOptions.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Toggles: Emojis, Hashtags, CTA */}
                <div className="flex flex-wrap items-center gap-4 px-1 py-0.5 text-xs text-slate-700 font-medium">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Include:</span>
                  <label className="flex items-center gap-1.5 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={includeEmojis}
                      onChange={(e) => setIncludeEmojis(e.target.checked)}
                      className="rounded text-[#166534] focus:ring-[#166534]"
                    />
                    <span>Emojis</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={includeHashtags}
                      onChange={(e) => setIncludeHashtags(e.target.checked)}
                      className="rounded text-[#166534] focus:ring-[#166534]"
                    />
                    <span>Hashtags</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={includeCta}
                      onChange={(e) => setIncludeCta(e.target.checked)}
                      className="rounded text-[#166534] focus:ring-[#166534]"
                    />
                    <span>Call-to-Action (CTA)</span>
                  </label>
                </div>

                {/* Generate 3 Post Variations Button */}
                <button
                  type="submit"
                  disabled={isGenerating || !topic.trim()}
                  className="w-full py-3 px-4 rounded-xl bg-[#166534] hover:bg-[#14532d] text-white font-bold text-xs sm:text-sm shadow-xs hover:shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50 active:scale-[0.99]"
                >
                  {isGenerating ? (
                    <>
                      <RefreshCw size={16} className="animate-spin text-white" />
                      <span>Generating 3 Post Variations...</span>
                    </>
                  ) : (
                    <>
                      <Wand2 size={16} />
                      <span>Generate 3 Post Variations</span>
                    </>
                  )}
                </button>
              </form>

              {/* Generated Variations List */}
              {generatedVariations.length > 0 && (
                <div className="space-y-4 pt-4 border-t border-slate-100">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                      <Sparkles size={14} className="text-amber-500" />
                      Generated Post Variations ({generatedVariations.length})
                    </h3>
                    <span className="text-[11px] text-slate-400">Choose a variation to apply to your composer</span>
                  </div>

                  <div className="grid grid-cols-1 gap-4">
                    {generatedVariations.map((item, idx) => (
                      <div
                        key={idx}
                        className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-2xs hover:border-[#166534]/50 transition-all space-y-3"
                      >
                        <div className="flex items-center justify-between">
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wide bg-emerald-50 text-[#166534] border border-emerald-200/60">
                            {item.type || `Variation ${idx + 1}`}
                          </span>

                          <div className="flex items-center gap-1.5">
                            {/* Regenerate single variation */}
                            <button
                              type="button"
                              disabled={regeneratingIdx === idx}
                              onClick={() => handleRegenerateVariation(idx)}
                              title="Regenerate this variation"
                              className="px-2 py-1 text-[11px] font-semibold text-slate-500 hover:text-slate-800 bg-slate-50 hover:bg-slate-100 rounded-lg border border-slate-200 transition-colors flex items-center gap-1 disabled:opacity-50"
                            >
                              <RefreshCw size={11} className={regeneratingIdx === idx ? 'animate-spin' : ''} />
                              <span>{regeneratingIdx === idx ? 'Regenerating...' : 'Regenerate'}</span>
                            </button>

                            {/* Copy button */}
                            <button
                              type="button"
                              onClick={() => handleCopy(item.caption, idx)}
                              className="px-2.5 py-1 text-[11px] font-semibold text-slate-600 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 rounded-lg border border-slate-200 transition-colors flex items-center gap-1"
                            >
                              {copiedIdx === idx ? <Check size={12} className="text-emerald-600" /> : <Copy size={12} />}
                              <span>{copiedIdx === idx ? 'Copied' : 'Copy'}</span>
                            </button>

                            {/* Apply to Composer button */}
                            <button
                              type="button"
                              onClick={() => {
                                onApplyCaption(item.caption, item.first_comment);
                                onClose();
                                toast.success('Caption applied to composer!');
                              }}
                              className="px-3 py-1 text-[11px] font-bold text-white bg-[#166534] hover:bg-[#14532d] rounded-lg shadow-2xs transition-colors flex items-center gap-1"
                            >
                              <CheckCircle2 size={12} />
                              <span>Apply to Composer</span>
                            </button>
                          </div>
                        </div>

                        {/* Caption Preview Box */}
                        <div className="p-3 bg-slate-50/80 rounded-xl border border-slate-100 text-xs text-slate-800 leading-relaxed whitespace-pre-line">
                          {item.caption}
                        </div>

                        {/* First Comment / Hashtag Cluster */}
                        {item.first_comment && (
                          <div className="text-[11px] text-slate-600 bg-slate-50/50 p-2.5 rounded-lg border border-dashed border-slate-200 flex items-center justify-between gap-2">
                            <div className="truncate">
                              <span className="font-bold text-slate-700">First Comment: </span>
                              <span className="text-slate-500">{item.first_comment}</span>
                            </div>
                            <button
                              type="button"
                              onClick={() => {
                                onApplyCaption(item.caption, item.first_comment);
                                onClose();
                                toast.success('Caption & First Comment applied!');
                              }}
                              className="text-[10px] font-bold text-[#166534] hover:underline shrink-0"
                            >
                              Apply Both
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Curated Hashtags Cloud */}
                  {generatedHashtags.length > 0 && (
                    <div className="p-4 bg-emerald-50/40 rounded-2xl border border-emerald-100 space-y-2">
                      <p className="text-[11px] font-bold text-[#166534] uppercase tracking-wide flex items-center gap-1">
                        <Hash size={13} />
                        Discovered Hashtag Cluster:
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {generatedHashtags.map((tag, tIdx) => (
                          <span
                            key={tIdx}
                            className="px-2 py-0.5 text-xs font-semibold bg-white text-slate-700 border border-emerald-200/80 rounded-md shadow-2xs select-all cursor-pointer hover:bg-emerald-50 hover:text-[#166534]"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: REFINE & REWRITE */}
          {activeTab === 'rewrite' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">
                  Draft Caption to Refine:
                </label>
                <textarea
                  rows={4}
                  value={rewriteText}
                  onChange={(e) => setRewriteText(e.target.value)}
                  placeholder="Paste or write your draft caption here to polish, restructure, or translate with AI..."
                  className="w-full text-xs p-3.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#166534]/30 focus:border-[#166534] transition-all resize-y shadow-2xs text-slate-800 placeholder-slate-400"
                />
              </div>

              {/* Action Buttons as requested */}
              <div className="space-y-2">
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Select Refinement Action:
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                  {/* Make Shorter */}
                  <button
                    type="button"
                    disabled={isRewriting}
                    onClick={() => handleRewrite('shorter')}
                    className="p-2.5 rounded-xl border border-slate-200 bg-white hover:border-[#166534] hover:bg-emerald-50/40 text-left transition-all group disabled:opacity-50"
                  >
                    <p className="text-xs font-bold text-slate-800 group-hover:text-[#166534] flex items-center gap-1.5">
                      <Flame size={13} className="text-amber-500" />
                      Make Shorter
                    </p>
                    <p className="text-[10px] text-slate-400 mt-0.5">Punchy & concise</p>
                  </button>

                  {/* Make Longer */}
                  <button
                    type="button"
                    disabled={isRewriting}
                    onClick={() => handleRewrite('longer')}
                    className="p-2.5 rounded-xl border border-slate-200 bg-white hover:border-[#166534] hover:bg-emerald-50/40 text-left transition-all group disabled:opacity-50"
                  >
                    <p className="text-xs font-bold text-slate-800 group-hover:text-[#166534] flex items-center gap-1.5">
                      <ArrowRight size={13} className="text-blue-500" />
                      Make Longer
                    </p>
                    <p className="text-[10px] text-slate-400 mt-0.5">Deeper narrative</p>
                  </button>

                  {/* More Professional */}
                  <button
                    type="button"
                    disabled={isRewriting}
                    onClick={() => handleRewrite('professional')}
                    className="p-2.5 rounded-xl border border-slate-200 bg-white hover:border-[#166534] hover:bg-emerald-50/40 text-left transition-all group disabled:opacity-50"
                  >
                    <p className="text-xs font-bold text-slate-800 group-hover:text-[#166534] flex items-center gap-1.5">
                      <Briefcase size={13} className="text-slate-600" />
                      More Professional
                    </p>
                    <p className="text-[10px] text-slate-400 mt-0.5">Executive & corporate</p>
                  </button>

                  {/* More Engaging */}
                  <button
                    type="button"
                    disabled={isRewriting}
                    onClick={() => handleRewrite('engaging')}
                    className="p-2.5 rounded-xl border border-slate-200 bg-white hover:border-[#166534] hover:bg-emerald-50/40 text-left transition-all group disabled:opacity-50"
                  >
                    <p className="text-xs font-bold text-slate-800 group-hover:text-[#166534] flex items-center gap-1.5">
                      <Smile size={13} className="text-emerald-500" />
                      More Engaging
                    </p>
                    <p className="text-[10px] text-slate-400 mt-0.5">Friendly & warm</p>
                  </button>

                  {/* Stronger CTA */}
                  <button
                    type="button"
                    disabled={isRewriting}
                    onClick={() => handleRewrite('cta')}
                    className="p-2.5 rounded-xl border border-slate-200 bg-white hover:border-[#166534] hover:bg-emerald-50/40 text-left transition-all group disabled:opacity-50"
                  >
                    <p className="text-xs font-bold text-slate-800 group-hover:text-[#166534] flex items-center gap-1.5">
                      <Target size={13} className="text-rose-500" />
                      Stronger CTA
                    </p>
                    <p className="text-[10px] text-slate-400 mt-0.5">Conversion closing</p>
                  </button>

                  {/* Fix Grammar */}
                  <button
                    type="button"
                    disabled={isRewriting}
                    onClick={() => handleRewrite('fix_grammar')}
                    className="p-2.5 rounded-xl border border-slate-200 bg-white hover:border-[#166534] hover:bg-emerald-50/40 text-left transition-all group disabled:opacity-50"
                  >
                    <p className="text-xs font-bold text-slate-800 group-hover:text-[#166534] flex items-center gap-1.5">
                      <CheckCircle2 size={13} className="text-teal-500" />
                      Fix Grammar
                    </p>
                    <p className="text-[10px] text-slate-400 mt-0.5">Correct flow & typos</p>
                  </button>

                  {/* Rewrite Caption */}
                  <button
                    type="button"
                    disabled={isRewriting}
                    onClick={() => handleRewrite('rewrite')}
                    className="p-2.5 rounded-xl border border-slate-200 bg-white hover:border-[#166534] hover:bg-emerald-50/40 text-left transition-all group disabled:opacity-50"
                  >
                    <p className="text-xs font-bold text-slate-800 group-hover:text-[#166534] flex items-center gap-1.5">
                      <RefreshCw size={13} className="text-purple-500" />
                      Rewrite Caption
                    </p>
                    <p className="text-[10px] text-slate-400 mt-0.5">Fresh angle & hook</p>
                  </button>

                  {/* Add Emojis */}
                  <button
                    type="button"
                    disabled={isRewriting}
                    onClick={() => handleRewrite('emojis')}
                    className="p-2.5 rounded-xl border border-slate-200 bg-white hover:border-[#166534] hover:bg-emerald-50/40 text-left transition-all group disabled:opacity-50"
                  >
                    <p className="text-xs font-bold text-slate-800 group-hover:text-[#166534] flex items-center gap-1.5">
                      <Sparkles size={13} className="text-amber-500" />
                      Add Emojis
                    </p>
                    <p className="text-[10px] text-slate-400 mt-0.5">Visual accents</p>
                  </button>
                </div>
              </div>

              {/* Rewriting Loading State */}
              {isRewriting && (
                <div className="p-8 text-center bg-slate-50 rounded-2xl border border-slate-100 flex flex-col items-center justify-center">
                  <RefreshCw size={24} className="animate-spin text-[#166534] mb-2" />
                  <p className="text-xs font-semibold text-slate-600">Refining caption with AI...</p>
                </div>
              )}

              {/* Improved Output */}
              {improvedResult && !isRewriting && (
                <div className="bg-emerald-50/30 rounded-2xl border border-emerald-200 p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-slate-800 flex items-center gap-1">
                        <Sparkles size={13} className="text-emerald-600" />
                        Refined Caption
                      </p>
                      <p className="text-[10px] text-slate-500">{improvedResult.explanation}</p>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => handleCopy(improvedResult.text, 88)}
                        className="px-2.5 py-1 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-white rounded-lg border border-slate-200 transition-colors flex items-center gap-1"
                      >
                        {copiedIdx === 88 ? <Check size={12} className="text-emerald-600" /> : <Copy size={12} />}
                        <span>{copiedIdx === 88 ? 'Copied' : 'Copy'}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          onApplyCaption(improvedResult.text);
                          onClose();
                          toast.success('Refined caption applied to composer!');
                        }}
                        className="px-3 py-1 text-xs font-bold text-white bg-[#166534] hover:bg-[#14532d] rounded-lg shadow-2xs transition-colors flex items-center gap-1"
                      >
                        <CheckCircle2 size={13} />
                        <span>Apply to Composer</span>
                      </button>
                    </div>
                  </div>

                  <div className="p-3.5 bg-white rounded-xl border border-slate-200 text-xs text-slate-800 leading-relaxed whitespace-pre-line">
                    {improvedResult.text}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: HASHTAG FINDER */}
          {activeTab === 'hashtags' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* Topic / Keywords */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">
                    Post Topic or Content
                  </label>
                  <input
                    type="text"
                    value={hashtagTopic}
                    onChange={(e) => setHashtagTopic(e.target.value)}
                    placeholder="e.g. Special coffee roast release, real estate property, fitness motivation..."
                    className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 focus:ring-1 focus:ring-[#166534] focus:outline-none"
                  />
                </div>

                {/* Industry / Niche */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">
                    Industry / Niche
                  </label>
                  <input
                    type="text"
                    value={hashtagIndustry}
                    onChange={(e) => setHashtagIndustry(e.target.value)}
                    placeholder="e.g. Hospitality, Tech, Fitness"
                    className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 focus:ring-1 focus:ring-[#166534] focus:outline-none"
                  />
                </div>
              </div>

              {/* Platform Selector & Trigger Button */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                <div className="flex items-center gap-2 text-xs">
                  <span className="font-bold text-slate-500 uppercase text-[10px]">Target Platform:</span>
                  <div className="flex items-center bg-slate-100 p-0.5 rounded-lg">
                    <button
                      type="button"
                      onClick={() => setHashtagPlatform('all')}
                      className={`px-2.5 py-1 text-[11px] font-bold rounded-md transition-all ${
                        hashtagPlatform === 'all' ? 'bg-white text-slate-800 shadow-2xs' : 'text-slate-500'
                      }`}
                    >
                      Both
                    </button>
                    <button
                      type="button"
                      onClick={() => setHashtagPlatform('facebook')}
                      className={`px-2.5 py-1 text-[11px] font-bold rounded-md transition-all ${
                        hashtagPlatform === 'facebook' ? 'bg-white text-[#1877F2] shadow-2xs' : 'text-slate-500'
                      }`}
                    >
                      Facebook
                    </button>
                    <button
                      type="button"
                      onClick={() => setHashtagPlatform('instagram')}
                      className={`px-2.5 py-1 text-[11px] font-bold rounded-md transition-all ${
                        hashtagPlatform === 'instagram' ? 'bg-white text-[#E4405F] shadow-2xs' : 'text-slate-500'
                      }`}
                    >
                      Instagram
                    </button>
                  </div>
                </div>

                <button
                  type="button"
                  disabled={isFindingTags || !hashtagTopic.trim()}
                  onClick={handleFindHashtags}
                  className="px-5 py-2 bg-[#166534] hover:bg-[#14532d] text-white font-bold text-xs rounded-xl shadow-2xs transition-all flex items-center gap-1.5 disabled:opacity-50"
                >
                  {isFindingTags ? <RefreshCw size={14} className="animate-spin" /> : <Hash size={14} />}
                  <span>Discover Hashtags</span>
                </button>
              </div>

              {/* Hashtag Results Display */}
              {tagResults && (
                <div className="space-y-4 pt-3 border-t border-slate-100">
                  {/* Broad Reach */}
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-2">
                    <p className="text-[11px] font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                      <TrendingUp size={13} className="text-emerald-600" />
                      Broad Reach Hashtags (High Search Volume):
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {tagResults.broad.map((tag, i) => (
                        <span
                          key={i}
                          onClick={() => handleCopy(tag, 100 + i)}
                          title="Click to copy hashtag"
                          className="px-2.5 py-1 text-xs bg-white text-slate-700 border border-slate-200 rounded-md font-semibold cursor-pointer hover:bg-emerald-50 hover:text-[#166534] transition-colors"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Niche Specific */}
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-2">
                    <p className="text-[11px] font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                      <Target size={13} className="text-blue-600" />
                      Niche & Industry Specific:
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {tagResults.niche.map((tag, i) => (
                        <span
                          key={i}
                          onClick={() => handleCopy(tag, 200 + i)}
                          title="Click to copy hashtag"
                          className="px-2.5 py-1 text-xs bg-white text-[#166534] border border-emerald-200 rounded-md font-semibold cursor-pointer hover:bg-emerald-100 transition-colors"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Community / Context Tags */}
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-2">
                    <p className="text-[11px] font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                      <Share2 size={13} className="text-purple-600" />
                      Community & Engagement Tags:
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {tagResults.community.map((tag, i) => (
                        <span
                          key={i}
                          onClick={() => handleCopy(tag, 300 + i)}
                          title="Click to copy hashtag"
                          className="px-2.5 py-1 text-xs bg-white text-purple-700 border border-purple-200 rounded-md font-semibold cursor-pointer hover:bg-purple-50 transition-colors"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Action Bar */}
                  <div className="flex flex-wrap items-center justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => handleCopy(tagResults.allString, 99)}
                      className="px-3.5 py-2 text-xs font-semibold bg-white border border-slate-200 rounded-xl hover:bg-slate-50 text-slate-700 transition-colors flex items-center gap-1.5 shadow-2xs"
                    >
                      {copiedIdx === 99 ? <Check size={13} className="text-emerald-600" /> : <Copy size={13} />}
                      <span>Copy All Hashtags</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        onApplyCaption(currentCaption, tagResults.allString);
                        onClose();
                        toast.success('Hashtags set as Automated First Comment!');
                      }}
                      className="px-3.5 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors flex items-center gap-1.5"
                    >
                      <span>Apply as First Comment</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        const newCap = currentCaption
                          ? `${currentCaption}\n\n${tagResults.allString}`
                          : tagResults.allString;
                        onApplyCaption(newCap);
                        onClose();
                        toast.success('Hashtags appended to caption!');
                      }}
                      className="px-4 py-2 text-xs font-bold text-white bg-[#166534] hover:bg-[#14532d] rounded-xl shadow-2xs transition-colors flex items-center gap-1.5"
                    >
                      <CheckCircle2 size={13} />
                      <span>Append to Caption</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-400 shrink-0">
          <div className="flex items-center gap-1.5">
            <Sparkles size={12} className="text-amber-500" />
            <span>Content suggestions are tailored for social media virality and community engagement.</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1 text-slate-600 hover:text-slate-900 font-semibold"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
