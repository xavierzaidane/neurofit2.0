'use client';

import { useState } from 'react';
import { motion } from 'motion/react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Field, FieldLabel, FieldError } from '@/components/ui/field';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { Gym } from '@/types/gym';
import { Smartphone, WandSparkles } from 'lucide-react';
import { SiGmail, SiInstagram, SiTelegram, SiWhatsapp } from "react-icons/si";
import GymDetailFormActions from './GymBookingFormActions';

interface GymDetailTabsProps {
  gym: Gym;
  form: any;
  inputClassName: string;
}

const getStringValue = (value: unknown) =>
  typeof value === 'string' ? value : '';

const toFieldErrors = (errors: Array<string | undefined> | undefined) =>
  errors?.map((message) => ({ message }));

const requiredValidator = (label: string) => ({
  onBlur: ({ value }: { value: unknown }) =>
    getStringValue(value).trim() ? undefined : `${label} is required`,
});

export default function GymDetailTabs({ gym, form, inputClassName }: GymDetailTabsProps) {
  const [activeTab, setActiveTab] = useState<'manual' | 'ai'>('manual');
  const [selectedPlatform, setSelectedPlatform] = useState<string | null>(null);
  const [platformAuth, setPlatformAuth] = useState({
    instagram: '',
    whatsapp: '',
    telegram: '',
    email: '',
  });



  const handleManualBooking = () => {
    form.handleSubmit();
  };

  const handleAIBooking = () => {
    if (!selectedPlatform) {
      alert('Please select a communication platform first!');
      return;
    }

    const authValue = platformAuth[selectedPlatform as keyof typeof platformAuth];
    if (!authValue.trim()) {
      alert('Please provide your platform information!');
      return;
    }

    console.log('AI booking initiated:', {
      gym: gym.name,
      platform: selectedPlatform,
      platformAuth: authValue,
    });
    alert('AI booking request sent. Our AI will process your request shortly!');
  };

  return (
    <div className="flex flex-col h-full">
      <Tabs defaultValue="manual" value={activeTab} onValueChange={(val) => setActiveTab(val as 'manual' | 'ai')} className="w-full flex-1 flex flex-col">
        <div className="mb-8">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="manual" className="font-mono text-sm">
              <Smartphone className="size-4 mr-2" />
              Manual Booking
            </TabsTrigger>
            <TabsTrigger value="ai" className="font-mono text-sm">
              <WandSparkles className="size-4 mr-2" />
              AI Booking
            </TabsTrigger>
          </TabsList>
        </div>

        <div className="flex-1 overflow-y-auto">

      <TabsContent value="manual" className="space-y-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="relative border border-white/10 bg-white/5 rounded-lg p-6 md:p-8"
        >
          <h2 className="text-2xl font-mono font-semibold text-white mb-6">Book Your Membership</h2>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              form.handleSubmit();
            }}
            className="space-y-6"
          >
            <div className="space-y-4">

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <form.Field
                  name="bookingName"
                  validators={requiredValidator("Full Name")}
                  children={(field: any) => {
                    const isInvalid =
                      field.state.meta.isTouched && !field.state.meta.isValid;

                    return (
                      <Field data-invalid={isInvalid} className="space-y-2">
                        <FieldLabel className="text-xs font-mono uppercase text-white/70">
                          Full Name
                        </FieldLabel>
                        <input
                          className={inputClassName}
                          placeholder="John Doe"
                          value={getStringValue(field.state.value)}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                        />
                        {isInvalid && (
                          <FieldError errors={toFieldErrors(field.state.meta.errors)} />
                        )}
                      </Field>
                    );
                  }}
                />

                <form.Field
                  name="bookingEmail"
                  validators={requiredValidator("Email Address")}
                  children={(field: any) => {
                    const isInvalid =
                      field.state.meta.isTouched && !field.state.meta.isValid;

                    return (
                      <Field data-invalid={isInvalid} className="space-y-2">
                        <FieldLabel className="text-xs font-mono uppercase text-white/70">
                          Email Address
                        </FieldLabel>
                        <input
                          className={inputClassName}
                          placeholder="john@example.com"
                          type="email"
                          value={getStringValue(field.state.value)}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                        />
                        {isInvalid && (
                          <FieldError errors={toFieldErrors(field.state.meta.errors)} />
                        )}
                      </Field>
                    );
                  }}
                />

                <form.Field
                  name="bookingPhone"
                  validators={requiredValidator("Phone Number")}
                  children={(field: any) => {
                    const isInvalid =
                      field.state.meta.isTouched && !field.state.meta.isValid;

                    return (
                      <Field data-invalid={isInvalid} className="space-y-2 md:col-span-2">
                        <FieldLabel className="text-xs font-mono uppercase text-white/70">
                          Phone Number
                        </FieldLabel>
                        <input
                          className={inputClassName}
                          placeholder="+1 (555) 123-4567"
                          value={getStringValue(field.state.value)}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                        />
                        {isInvalid && (
                          <FieldError errors={toFieldErrors(field.state.meta.errors)} />
                        )}
                      </Field>
                    );
                  }}
                />
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-mono font-semibold text-white">Membership Details</h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <form.Field
                  name="membershipType"
                  validators={requiredValidator("Membership Type")}
                  children={(field: any) => {
                    const isInvalid =
                      field.state.meta.isTouched && !field.state.meta.isValid;

                    return (
                      <Field data-invalid={isInvalid} className="space-y-2">
                        <FieldLabel className="text-xs font-mono uppercase text-white/70">
                          Membership Type
                        </FieldLabel>
                        <Select value={getStringValue(field.state.value)} onValueChange={(value) => field.handleChange(value)}>
                          <SelectTrigger className={inputClassName}>
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="basic">Basic</SelectItem>
                            <SelectItem value="premium">Premium</SelectItem>
                            <SelectItem value="vip">VIP</SelectItem>
                          </SelectContent>
                        </Select>
                        {isInvalid && (
                          <FieldError errors={toFieldErrors(field.state.meta.errors)} />
                        )}
                      </Field>
                    );
                  }}
                />

                <form.Field
                  name="duration"
                  validators={requiredValidator("Duration")}
                  children={(field: any) => {
                    const isInvalid =
                      field.state.meta.isTouched && !field.state.meta.isValid;

                    return (
                      <Field data-invalid={isInvalid} className="space-y-2">
                        <FieldLabel className="text-xs font-mono uppercase text-white/70">
                          Duration
                        </FieldLabel>
                        <Select value={getStringValue(field.state.value)} onValueChange={(value) => field.handleChange(value)}>
                          <SelectTrigger className={inputClassName}>
                            <SelectValue placeholder="Select duration" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1month">1 Month</SelectItem>
                            <SelectItem value="3months">3 Months</SelectItem>
                            <SelectItem value="6months">6 Months</SelectItem>
                            <SelectItem value="1year">1 Year</SelectItem>
                          </SelectContent>
                        </Select>
                        {isInvalid && (
                          <FieldError errors={toFieldErrors(field.state.meta.errors)} />
                        )}
                      </Field>
                    );
                  }}
                />

                <form.Field
                  name="startDate"
                  validators={requiredValidator("Start Date")}
                  children={(field: any) => {
                    const isInvalid =
                      field.state.meta.isTouched && !field.state.meta.isValid;

                    return (
                      <Field data-invalid={isInvalid} className="space-y-2">
                        <FieldLabel className="text-xs font-mono uppercase text-white/70">
                          Start Date
                        </FieldLabel>
                        <input
                          className={inputClassName}
                          type="date"
                          value={getStringValue(field.state.value)}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                        />
                        {isInvalid && (
                          <FieldError errors={toFieldErrors(field.state.meta.errors)} />
                        )}
                      </Field>
                    );
                  }}
                />
              </div>
            </div>

            <form.Field
              name="notes"
              children={(field: any) => {
                return (
                  <Field className="space-y-2">
                    <FieldLabel className="text-xs font-mono uppercase text-white/70">
                      Additional Notes
                    </FieldLabel>
                    <textarea
                      className={`${inputClassName} min-h-24 resize-none`}
                      placeholder="Any special requests or information..."
                      value={getStringValue(field.state.value)}
                      onChange={(e) => field.handleChange(e.target.value)}
                    />
                  </Field>
                );
              }}
            />
          </form>
        </motion.div>
      </TabsContent>

      <TabsContent value="ai" className="space-y-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="relative border border-white/10 bg-white/5 rounded-lg p-6 md:p-8"
        >
          <h2 className="text-2xl font-mono font-semibold text-white mb-6">AI-Powered Booking</h2>

          <div className="space-y-8">
            {/* Model & Platform Selection */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* AI Model Selection */}
              <div>
                <FieldLabel className="text-xs font-mono uppercase text-white/70 mb-3">
                  Select AI Model
                </FieldLabel>
                <Select defaultValue="gpt4">
                  <SelectTrigger className={inputClassName}>
                    <SelectValue placeholder="Choose AI model" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="gpt4">GPT-4 - 0.5x </SelectItem>
                    <SelectItem value="claude">Claude 3.5 - 0.6x </SelectItem>
                    <SelectItem value="gemini">Gemini Pro - 1x </SelectItem>
                    <SelectItem value="gpt4-turbo">GPT-4 Turbo - 0.8x </SelectItem>
                    <SelectItem value="gpt5">GPT-5 - 0.7x </SelectItem>
                    <SelectItem value="llama3">LLaMA 3 - 1x </SelectItem>
                    <SelectItem value="phi3">Phi-3 - 2x </SelectItem>
                    <SelectItem value="yi">Yi Large - 0.9x </SelectItem>
                    <SelectItem value="qwen">Qwen 2 - 1x </SelectItem>
                    <SelectItem value="perplexity">Perplexity AI - 1.2x </SelectItem>
                    <SelectItem value="grok">Grok - 1.1x </SelectItem>
                    <SelectItem value="openchat">OpenChat - 1.3x </SelectItem>
                    <SelectItem value="nous-hermes">Nous Hermes - 0.95x </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Platform Selection */}
              <div>
                <FieldLabel className="text-xs font-mono uppercase text-white/70 mb-3">
                  Select Communication Platform
                </FieldLabel>
                <div className="grid grid-cols-2 gap-3">
                {[
                  { id: 'whatsapp', name: 'WhatsApp' },
                  { id: 'instagram', name: 'Instagram DM' },
                  { id: 'telegram', name: 'Telegram' },
                  { id: 'email', name: 'Email' },
                ].map((platform) => {
                  const getIcon = () => {
                    switch (platform.id) {
                      case 'whatsapp':
                        return <SiWhatsapp className="text-lg" />;
                      case 'instagram':
                        return <SiInstagram className="text-lg" />;
                      case 'telegram':
                        return <SiTelegram className="text-lg" />;
                      case 'email':
                        return <SiGmail className="text-lg" />;
                      default:
                        return null;
                    }
                  };

                  const isSelected = selectedPlatform === platform.id;

                  return (
                    <button
                      type="button"
                      key={platform.id}
                      onClick={() => setSelectedPlatform(isSelected ? null : platform.id)}
                      className={`flex items-center gap-3 p-4 border rounded-lg transition-all duration-200 ${
                        isSelected
                          ? 'border-white/40 bg-white/10 text-white'
                          : 'border-white/10 bg-black/20 text-white/70 hover:border-white/20 hover:bg-white/5'
                      }`}
                    >
                      <div className={`text-lg transition-colors ${isSelected ? 'text-white' : 'text-white/60'}`}>
                        {getIcon()}
                      </div>
                      <span className="font-mono text-sm font-medium">{platform.name}</span>
                      {isSelected && (
                        <div className="ml-auto w-2 h-2 bg-white rounded-full" />
                      )}
                    </button>
                  );
                })}
                </div>
              </div>
            </div>

            {/* Separator */}
            <div className="border-t border-white/10" />

            {/* Platform Authentication Form */}
            {selectedPlatform && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
              >
                <div className="md:col-span-2">
                  <FieldLabel className="text-xs font-mono uppercase text-white/70 ">
                    {selectedPlatform === 'whatsapp' && 'WhatsApp Phone Number'}
                    {selectedPlatform === 'instagram' && 'Instagram Username'}
                    {selectedPlatform === 'telegram' && 'Telegram Username'}
                    {selectedPlatform === 'email' && 'Email Address'}
                  </FieldLabel>
                </div>

                <div className="md:col-span-2 space-y-3">
                  {selectedPlatform === 'whatsapp' && (
                    <div className="space-y-2">
                      <input
                        type="tel"
                        placeholder="+1 (555) 123-4567"
                        className={inputClassName}
                        value={platformAuth.whatsapp}
                        onChange={(e) =>
                          setPlatformAuth((prev) => ({
                            ...prev,
                            whatsapp: e.target.value,
                          }))
                        }
                      />
                      <p className="text-xs text-white/50 font-mono">
                        Include country code (e.g., +1 for USA)
                      </p>
                    </div>
                  )}

                  {selectedPlatform === 'instagram' && (
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <span className="text-white/60 font-mono mr-2">@</span>
                        <input
                          type="text"
                          placeholder="xavierzdn"
                          className={`${inputClassName} pl-0`}
                          value={platformAuth.instagram}
                          onChange={(e) =>
                            setPlatformAuth((prev) => ({
                              ...prev,
                              instagram: e.target.value,
                            }))
                          }
                        />
                      </div>
                      <p className="text-xs text-white/50 font-mono">
                        Your Instagram username (without @)
                      </p>
                    </div>
                  )}

                  {selectedPlatform === 'telegram' && (
                    <div className="space-y-2">
                      <input
                        type="text"
                        placeholder="your_telegram_username"
                        className={inputClassName}
                        value={platformAuth.telegram}
                        onChange={(e) =>
                          setPlatformAuth((prev) => ({
                            ...prev,
                            telegram: e.target.value,
                          }))
                        }
                      />
                      <p className="text-xs text-white/50 font-mono">
                        Your Telegram username or phone number
                      </p>
                    </div>
                  )}

                  {selectedPlatform === 'email' && (
                    <div className="space-y-2">
                      <input
                        type="email"
                        placeholder="your.email@example.com"
                        className={inputClassName}
                        value={platformAuth.email}
                        onChange={(e) =>
                          setPlatformAuth((prev) => ({
                            ...prev,
                            email: e.target.value,
                          }))
                        }
                      />
                      <p className="text-xs text-white/50 font-mono">
                        We'll send booking confirmation to this email
                      </p>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>
      </TabsContent>
    </div>
      </Tabs>

      <GymDetailFormActions
        gym={gym}
        form={form}
        activeTab={activeTab}
        onManualBooking={handleManualBooking}
        onAIBooking={handleAIBooking}
      />
    </div>
  );
}
