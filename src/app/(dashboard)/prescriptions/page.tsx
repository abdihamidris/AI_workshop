/**
 * myAfya-AI — Prescription Scanner Page
 */
'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Scan, Upload, FileText, CheckCircle2, Loader2, X, Plus, AlertCircle, Eye } from 'lucide-react';
import { cn } from '@/lib/utils';
import toast from 'react-hot-toast';
import Link from 'next/link';

interface ParsedMedicine {
  name: string;
  dosage: string;
  frequency: string;
  duration?: string;
  instructions?: string;
}

interface ParsedPrescription {
  medicines: ParsedMedicine[];
  doctorName?: string;
  clinicName?: string;
  patientName?: string;
  issuedDate?: string;
}

export default function PrescriptionsPage() {
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [parsedData, setParsedData] = useState<ParsedPrescription | null>(null);
  const [selectedMedicines, setSelectedMedicines] = useState<Set<number>>(new Set());

  const handleFile = useCallback((file: File) => {
    if (!file.type.startsWith('image/') && file.type !== 'application/pdf') {
      toast.error('Please upload an image or PDF file');
      return;
    }

    setSelectedFile(file);
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => setPreview(e.target?.result as string);
      reader.readAsDataURL(file);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, [handleFile]);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const handleProcess = async () => {
    if (!selectedFile) return;
    setIsProcessing(true);

    try {
      // Simulate OCR + AI processing
      await new Promise((r) => setTimeout(r, 2500));

      // Mock parsed data (in production, this would call OCR + AI)
      const mockData: ParsedPrescription = {
        doctorName: 'Dr. James Carter, MD',
        clinicName: 'Nairobi Medical Centre',
        patientName: 'Alex Johnson',
        issuedDate: new Date().toLocaleDateString(),
        medicines: [
          {
            name: 'Amoxicillin',
            dosage: '500mg',
            frequency: 'Three times daily',
            duration: '7 days',
            instructions: 'Take with food',
          },
          {
            name: 'Ibuprofen',
            dosage: '400mg',
            frequency: 'As needed for pain',
            duration: '5 days',
            instructions: 'Do not exceed 3 doses per day',
          },
          {
            name: 'Omeprazole',
            dosage: '20mg',
            frequency: 'Once daily',
            duration: '14 days',
            instructions: 'Take 30 minutes before meals',
          },
        ],
      };

      setParsedData(mockData);
      setSelectedMedicines(new Set(mockData.medicines.map((_, i) => i)));
      toast.success('Prescription processed successfully!');
    } catch {
      toast.error('Failed to process prescription. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleAddMedicines = async () => {
    if (!parsedData) return;
    const medicines = parsedData.medicines.filter((_, i) => selectedMedicines.has(i));
    toast.success(`${medicines.length} medicine${medicines.length > 1 ? 's' : ''} added to your schedule!`);
    setParsedData(null);
    setSelectedFile(null);
    setPreview(null);
  };

  const toggleMedicine = (index: number) => {
    const newSelected = new Set(selectedMedicines);
    if (newSelected.has(index)) newSelected.delete(index);
    else newSelected.add(index);
    setSelectedMedicines(newSelected);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
      <div>
        <h2 className="text-2xl font-black text-[var(--text-primary)]">Prescription Scanner</h2>
        <p className="text-[var(--text-secondary)] text-sm mt-0.5">
          Upload your prescription to automatically extract and schedule medications
        </p>
      </div>

      <AnimatePresence mode="wait">
        {!parsedData ? (
          <motion.div
            key="upload"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-5"
          >
            {/* Upload area */}
            <div
              className={cn(
                'glass-card border-2 border-dashed p-12 text-center transition-all duration-200 cursor-pointer',
                isDragging
                  ? 'border-primary-400 bg-primary-500/10'
                  : 'border-[var(--border-color)] hover:border-primary-500/50'
              )}
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              onClick={() => document.getElementById('file-input')?.click()}
            >
              <input
                id="file-input"
                type="file"
                className="hidden"
                accept="image/*,.pdf"
                onChange={handleFileInput}
              />

              {selectedFile ? (
                <div className="space-y-4">
                  {preview && (
                    <img
                      src={preview}
                      alt="Prescription preview"
                      className="max-h-48 mx-auto rounded-xl object-contain"
                    />
                  )}
                  <div className="flex items-center justify-center gap-2">
                    <FileText className="w-5 h-5 text-primary-400" />
                    <span className="text-sm font-medium text-[var(--text-primary)]">{selectedFile.name}</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedFile(null);
                        setPreview(null);
                      }}
                      className="p-1 rounded hover:bg-red-500/10 text-[var(--text-muted)] hover:text-red-400"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="w-20 h-20 rounded-3xl bg-primary-500/15 flex items-center justify-center mx-auto mb-4">
                    <Scan className="w-10 h-10 text-primary-400" />
                  </div>
                  <h3 className="text-lg font-bold text-[var(--text-primary)] mb-2">
                    Drop your prescription here
                  </h3>
                  <p className="text-[var(--text-secondary)] text-sm mb-4">
                    Supports JPEG, PNG, PDF · Max 10MB
                  </p>
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary-500/15 text-primary-400 text-sm font-medium">
                    <Upload className="w-4 h-4" />
                    Choose file
                  </div>
                </>
              )}
            </div>

            {selectedFile && (
              <button
                onClick={handleProcess}
                disabled={isProcessing}
                className="btn-primary w-full py-4 text-base"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Processing prescription with AI...
                  </>
                ) : (
                  <>
                    <Scan className="w-5 h-5" />
                    Analyze Prescription
                  </>
                )}
              </button>
            )}

            {/* Tips */}
            <div className="glass-card p-5 border border-amber-500/20">
              <h4 className="text-sm font-semibold text-[var(--text-primary)] flex items-center gap-2 mb-3">
                <AlertCircle className="w-4 h-4 text-amber-400" />
                For best results
              </h4>
              <ul className="space-y-1.5">
                {[
                  'Ensure the prescription is well-lit and clearly legible',
                  'Include all prescription details in the image',
                  'Avoid shadows and blurry photos',
                  'Always verify extracted information with your original prescription',
                ].map((tip) => (
                  <li key={tip} className="flex items-start gap-2 text-sm text-[var(--text-secondary)]">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 flex-shrink-0" />
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="results"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-5"
          >
            {/* Success header */}
            <div className="flex items-center gap-3 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
              <CheckCircle2 className="w-6 h-6 text-emerald-400 flex-shrink-0" />
              <div>
                <p className="font-semibold text-emerald-400">Prescription analyzed successfully!</p>
                <p className="text-xs text-[var(--text-secondary)]">
                  {parsedData.medicines.length} medications extracted. Select which ones to add.
                </p>
              </div>
            </div>

            {/* Prescription details */}
            {(parsedData.doctorName || parsedData.clinicName) && (
              <div className="glass-card p-4">
                <h4 className="text-sm font-semibold text-[var(--text-secondary)] mb-3">Prescription Details</h4>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  {parsedData.doctorName && (
                    <div>
                      <p className="text-xs text-[var(--text-muted)]">Doctor</p>
                      <p className="font-medium text-[var(--text-primary)]">{parsedData.doctorName}</p>
                    </div>
                  )}
                  {parsedData.clinicName && (
                    <div>
                      <p className="text-xs text-[var(--text-muted)]">Clinic</p>
                      <p className="font-medium text-[var(--text-primary)]">{parsedData.clinicName}</p>
                    </div>
                  )}
                  {parsedData.issuedDate && (
                    <div>
                      <p className="text-xs text-[var(--text-muted)]">Date Issued</p>
                      <p className="font-medium text-[var(--text-primary)]">{parsedData.issuedDate}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Extracted medicines */}
            <div className="glass-card p-5">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-semibold text-[var(--text-primary)]">Extracted Medications</h4>
                <button
                  onClick={() => {
                    if (selectedMedicines.size === parsedData.medicines.length) {
                      setSelectedMedicines(new Set());
                    } else {
                      setSelectedMedicines(new Set(parsedData.medicines.map((_, i) => i)));
                    }
                  }}
                  className="text-xs text-primary-400 hover:text-primary-300"
                >
                  {selectedMedicines.size === parsedData.medicines.length ? 'Deselect all' : 'Select all'}
                </button>
              </div>

              <div className="space-y-3">
                {parsedData.medicines.map((med, i) => (
                  <div
                    key={i}
                    onClick={() => toggleMedicine(i)}
                    className={cn(
                      'flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-all',
                      selectedMedicines.has(i)
                        ? 'border-primary-500/50 bg-primary-500/10'
                        : 'border-[var(--border-color)] hover:border-primary-500/30'
                    )}
                  >
                    <div className={cn(
                      'w-5 h-5 rounded flex items-center justify-center mt-0.5 flex-shrink-0 transition-colors',
                      selectedMedicines.has(i)
                        ? 'bg-primary-500 text-white'
                        : 'border-2 border-[var(--border-color)]'
                    )}>
                      {selectedMedicines.has(i) && <CheckCircle2 className="w-3.5 h-3.5" />}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-semibold text-[var(--text-primary)]">{med.name}</p>
                        <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-primary-500/10 text-primary-400">
                          {med.dosage}
                        </span>
                      </div>
                      <p className="text-sm text-[var(--text-secondary)]">{med.frequency}</p>
                      {med.duration && (
                        <p className="text-xs text-[var(--text-muted)] mt-0.5">Duration: {med.duration}</p>
                      )}
                      {med.instructions && (
                        <p className="text-xs text-[var(--text-muted)] mt-0.5 italic">
                          💡 {med.instructions}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex gap-3">
              <button
                onClick={() => { setParsedData(null); setSelectedFile(null); setPreview(null); }}
                className="btn-secondary flex-1"
              >
                <X className="w-4 h-4" />
                Start Over
              </button>
              <button
                onClick={handleAddMedicines}
                disabled={selectedMedicines.size === 0}
                className="btn-primary flex-1"
              >
                <Plus className="w-4 h-4" />
                Add {selectedMedicines.size} Medicine{selectedMedicines.size !== 1 ? 's' : ''}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
