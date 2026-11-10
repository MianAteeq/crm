import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import {
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Star,
  Send,
  ChevronRight,
  ChevronLeft,
  Check,
  Edit,
} from 'lucide-react';
import { pageBuilderApi } from '../../services/pageBuilderApi';
import { BuilderForm, FormField, FormStep } from '../../types/pageBuilder';

export default function PublicFormView() {
  const { slug } = useParams<{ slug: string }>();
  const [searchParams] = useSearchParams();
  const [form, setForm] = useState<BuilderForm | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Form Inputs & Multi-step State
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [ratings, setRatings] = useState<Record<string, number>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;

    const fetchForm = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await pageBuilderApi.getPublicForm(slug, true);
        if (res.success && res.data) {
          setForm(res.data);
          document.title = res.data.title;
        }
      } catch (err: any) {
        setError(err.response?.data?.message || 'Form not found or is currently unpublished.');
      } finally {
        setLoading(false);
      }
    };

    fetchForm();
  }, [slug]);

  const steps: FormStep[] = form?.schema?.steps || [];
  const currentStep = steps[activeStepIndex] || steps[0];
  const isMultiStep = Boolean(form?.schema?.is_multi_step) && steps.length > 1;
  const isLastStep = activeStepIndex === steps.length - 1;

  const handleInputChange = (name: string, val: any) => {
    setFormData((prev) => ({ ...prev, [name]: val }));
  };

  const handleRatingChange = (name: string, stars: number) => {
    setRatings((prev) => ({ ...prev, [name]: stars }));
    setFormData((prev) => ({ ...prev, [name]: stars }));
  };

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLastStep) {
      setActiveStepIndex((prev) => prev + 1);
    } else {
      handleSubmit();
    }
  };

  const handleSubmit = async () => {
    if (!slug) return;

    try {
      setIsSubmitting(true);
      setSubmitError(null);

      const payload = {
        ...formData,
        ...ratings,
      };

      const res = await pageBuilderApi.submitPublicForm(slug, payload);

      if (res.success) {
        setSubmitSuccess(res.data?.thank_you_message || form?.settings?.thank_you_message || 'Thank you for your response!');
        if (res.data?.redirect_url || form?.settings?.redirect_url) {
          const redirect = res.data?.redirect_url || form?.settings?.redirect_url;
          setTimeout(() => {
            window.location.href = redirect!;
          }, 1500);
        }
      }
    } catch (err: any) {
      setSubmitError(err.response?.data?.message || 'Failed to submit form. Please check your answers.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center space-y-2">
          <RefreshCw size={28} className="animate-spin text-[#166534] mx-auto" />
          <p className="text-xs font-bold text-slate-600">Loading form...</p>
        </div>
      </div>
    );
  }

  if (error || !form) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
        <div className="max-w-md w-full bg-white p-8 rounded-2xl border border-slate-200 shadow-md text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
            <AlertTriangle size={24} />
          </div>
          <h2 className="text-base font-bold text-slate-800">Form Not Available</h2>
          <p className="text-xs text-slate-500">{error || 'This form could not be found or is not active.'}</p>
          <a
            href="/page-builder/forms"
            className="inline-block mt-2 px-4 py-2 bg-[#166534] hover:bg-[#14532d] text-white rounded-xl text-xs font-bold transition-all"
          >
            Go to Forms & Surveys
          </a>
        </div>
      </div>
    );
  }

  const isDraft = form.status !== 'published';

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 sm:p-6 font-sans">
      {/* Draft Preview Banner */}
      {isDraft && (
        <div className="w-full max-w-xl mb-4 bg-amber-500 text-white px-4 py-2.5 rounded-2xl text-xs font-semibold flex flex-col sm:flex-row items-center justify-between gap-2 shadow-md">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-black/25 text-[10px] uppercase font-black tracking-wide">
              Draft Preview
            </span>
            <span>This form is currently unpublished. Visitors cannot submit until published.</span>
          </div>
          <a
            href={`/page-builder/forms/edit/${form.id}`}
            className="px-3 py-1 bg-white hover:bg-slate-100 text-slate-800 rounded-lg text-xs font-bold transition-colors shadow-2xs shrink-0 flex items-center gap-1.5"
          >
            <Edit size={12} />
            <span>Edit Form</span>
          </a>
        </div>
      )}

      <div className="max-w-xl w-full bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
        {/* Header */}
        <div className="p-6 sm:p-8 border-b border-slate-100 bg-slate-50/50">
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">{form.title}</h1>
          {currentStep?.description && (
            <p className="text-xs sm:text-sm text-slate-500 mt-1">{currentStep.description}</p>
          )}

          {/* Progress Bar for Multi-step */}
          {isMultiStep && (
            <div className="mt-4 space-y-1.5">
              <div className="flex items-center justify-between text-[11px] font-bold text-slate-500">
                <span>
                  Step {activeStepIndex + 1} of {steps.length}: {currentStep.title}
                </span>
                <span>{Math.round(((activeStepIndex + 1) / steps.length) * 100)}%</span>
              </div>
              <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#166534] transition-all duration-300 rounded-full"
                  style={{ width: `${((activeStepIndex + 1) / steps.length) * 100}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Body */}
        <div className="p-6 sm:p-8">
          {submitSuccess ? (
            <div className="py-8 text-center space-y-3">
              <div className="w-14 h-14 rounded-full bg-emerald-50 text-[#166534] flex items-center justify-center mx-auto shadow-xs">
                <CheckCircle2 size={32} />
              </div>
              <h2 className="text-lg font-black text-slate-800">Thank You!</h2>
              <p className="text-xs text-slate-600 max-w-sm mx-auto leading-relaxed">{submitSuccess}</p>
            </div>
          ) : (
            <form onSubmit={handleNextStep} className="space-y-5 text-xs">
              {submitError && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700">{submitError}</div>
              )}

              {/* Form Fields for Active Step */}
              <div className="space-y-4">
                {currentStep?.fields?.map((field: FormField) => {
                  return (
                    <div key={field.id} className="space-y-1.5">
                      <label className="font-bold text-slate-700 block">
                        {field.label} {field.required && <span className="text-rose-500">*</span>}
                      </label>

                      {/* Text / Email / Phone / Number */}
                      {['text', 'email', 'phone', 'number', 'date'].includes(field.type) && (
                        <input
                          type={field.type}
                          required={field.required}
                          placeholder={field.placeholder || `Enter ${field.label}...`}
                          value={formData[field.name] || ''}
                          onChange={(e) => handleInputChange(field.name, e.target.value)}
                          className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#166534] focus:bg-white text-xs"
                        />
                      )}

                      {/* Textarea */}
                      {field.type === 'textarea' && (
                        <textarea
                          rows={3}
                          required={field.required}
                          placeholder={field.placeholder || 'Type here...'}
                          value={formData[field.name] || ''}
                          onChange={(e) => handleInputChange(field.name, e.target.value)}
                          className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#166534] focus:bg-white text-xs"
                        />
                      )}

                      {/* Dropdown */}
                      {field.type === 'dropdown' && (
                        <select
                          required={field.required}
                          value={formData[field.name] || ''}
                          onChange={(e) => handleInputChange(field.name, e.target.value)}
                          className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#166534] focus:bg-white text-xs"
                        >
                          <option value="">Select an option...</option>
                          {field.options?.map((opt, i) => (
                            <option key={i} value={opt}>
                              {opt}
                            </option>
                          ))}
                        </select>
                      )}

                      {/* Radio */}
                      {field.type === 'radio' && (
                        <div className="space-y-1.5 pt-1">
                          {field.options?.map((opt, i) => (
                            <label
                              key={i}
                              className="flex items-center gap-2 p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer font-medium text-slate-700"
                            >
                              <input
                                type="radio"
                                name={field.name}
                                required={field.required}
                                checked={formData[field.name] === opt}
                                onChange={() => handleInputChange(field.name, opt)}
                                className="text-[#166534] focus:ring-[#166534]"
                              />
                              <span>{opt}</span>
                            </label>
                          ))}
                        </div>
                      )}

                      {/* Checkbox */}
                      {field.type === 'checkbox' && (
                        <div className="space-y-1.5 pt-1">
                          {field.options?.map((opt, i) => {
                            const currentArr = (formData[field.name] as string[]) || [];
                            const isChecked = currentArr.includes(opt);
                            return (
                              <label
                                key={i}
                                className="flex items-center gap-2 p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer font-medium text-slate-700"
                              >
                                <input
                                  type="checkbox"
                                  checked={isChecked}
                                  onChange={(e) => {
                                    if (e.target.checked) {
                                      handleInputChange(field.name, [...currentArr, opt]);
                                    } else {
                                      handleInputChange(
                                        field.name,
                                        currentArr.filter((item) => item !== opt)
                                      );
                                    }
                                  }}
                                  className="rounded text-[#166534] focus:ring-[#166534]"
                                />
                                <span>{opt}</span>
                              </label>
                            );
                          })}
                        </div>
                      )}

                      {/* Star Rating */}
                      {field.type === 'rating' && (
                        <div className="flex items-center gap-2 pt-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              type="button"
                              onClick={() => handleRatingChange(field.name, star)}
                              className="p-1 hover:scale-110 transition-transform cursor-pointer"
                            >
                              <Star
                                size={28}
                                className={
                                  star <= (ratings[field.name] || 0)
                                    ? 'fill-amber-400 text-amber-400'
                                    : 'text-slate-300'
                                }
                              />
                            </button>
                          ))}
                          <span className="text-xs font-bold text-slate-600 pl-2">
                            {ratings[field.name] ? `${ratings[field.name]} of 5 Stars` : 'Click to rate'}
                          </span>
                        </div>
                      )}

                      {/* Yes / No */}
                      {field.type === 'yes_no' && (
                        <div className="flex items-center gap-3 pt-1">
                          {['Yes', 'No'].map((choice) => (
                            <button
                              key={choice}
                              type="button"
                              onClick={() => handleInputChange(field.name, choice)}
                              className={`flex-1 py-2.5 rounded-xl font-bold border transition-all cursor-pointer ${
                                formData[field.name] === choice
                                  ? 'bg-emerald-50 border-[#166534] text-[#166534] shadow-xs'
                                  : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                              }`}
                            >
                              {choice}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Honeypot field for anti-spam */}
              <input
                type="text"
                name="_hp_name"
                value={formData._hp_name || ''}
                onChange={(e) => handleInputChange('_hp_name', e.target.value)}
                className="hidden"
                tabIndex={-1}
                autoComplete="off"
              />

              {/* Navigation buttons */}
              <div className="flex items-center justify-between gap-3 pt-4 border-t border-slate-100">
                {isMultiStep && activeStepIndex > 0 ? (
                  <button
                    type="button"
                    onClick={() => setActiveStepIndex((prev) => prev - 1)}
                    className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <ChevronLeft size={16} />
                    <span>Back</span>
                  </button>
                ) : (
                  <div />
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 bg-[#166534] hover:bg-[#14532d] text-white font-bold rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <RefreshCw size={14} className="animate-spin text-white" />
                      <span>Submitting...</span>
                    </>
                  ) : isLastStep ? (
                    <>
                      <Send size={14} />
                      <span>{form.settings?.submit_button_text || 'Submit'}</span>
                    </>
                  ) : (
                    <>
                      <span>Continue</span>
                      <ChevronRight size={16} />
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
