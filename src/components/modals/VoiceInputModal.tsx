import React, { useState, useEffect } from 'react';
import { X, Mic, MicOff, Check, Sparkles, Volume2, ArrowRight } from 'lucide-react';
import { useTaskContext } from '../../context/TaskContext';

export const VoiceInputModal: React.FC = () => {
  const { 
    isVoiceInputModalOpen, 
    setIsVoiceInputModalOpen, 
    addTask, 
    user 
  } = useTaskContext();

  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('Finish the TaskPro website tomorrow at 5 PM.');
  const [interpretedTask, setInterpretedTask] = useState<{
    title: string;
    dueDate: string;
    priority: 'high' | 'medium' | 'low';
    tag: string;
  }>({
    title: 'Finish the TaskPro website',
    dueDate: 'Tomorrow, 5:00 PM',
    priority: 'high',
    tag: 'Website',
  });

  // Interpret speech text whenever transcript changes
  useEffect(() => {
    const raw = transcript.toLowerCase();
    let title = transcript.replace(/[.,!]/g, '').trim();
    let dueDate = 'Today, 5:00 PM';
    let priority: 'high' | 'medium' | 'low' = 'medium';
    let tag = 'General';

    if (raw.includes('tomorrow at 5 pm') || raw.includes('tomorrow 5 pm')) {
      dueDate = 'Tomorrow, 5:00 PM';
      title = title.replace(/tomorrow\s+(?:at\s+)?5\s*pm/gi, '').trim();
    } else if (raw.includes('tomorrow morning') || raw.includes('tomorrow 7 am')) {
      dueDate = 'Tomorrow, 7:00 AM';
      title = title.replace(/tomorrow\s+(?:morning|7\s*am)/gi, '').trim();
    } else if (raw.includes('today at 5 pm') || raw.includes('today 5 pm')) {
      dueDate = 'Today, 5:00 PM';
      title = title.replace(/today\s+(?:at\s+)?5\s*pm/gi, '').trim();
    }

    if (raw.includes('website') || raw.includes('taskpro')) {
      tag = 'Website';
      priority = 'high';
    } else if (raw.includes('presentation') || raw.includes('client')) {
      tag = 'Client';
      priority = 'high';
    } else if (raw.includes('gym') || raw.includes('workout')) {
      tag = 'Health';
      priority = 'low';
    }

    // Capitalize first letter of title
    title = title.charAt(0).toUpperCase() + title.slice(1);

    setInterpretedTask({
      title: title || 'Voice Created Task',
      dueDate,
      priority,
      tag,
    });
  }, [transcript]);

  if (!isVoiceInputModalOpen) return null;

  const startVoiceDictation = () => {
    // Check Web Speech API support
    const SpeechRecognition = (window as unknown as { SpeechRecognition?: any; webkitSpeechRecognition?: any }).SpeechRecognition ||
      (window as unknown as { webkitSpeechRecognition?: any }).webkitSpeechRecognition;

    if (SpeechRecognition) {
      try {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'en-US';

        recognition.onstart = () => {
          setIsListening(true);
        };

        recognition.onresult = (event: any) => {
          const spoken = event.results[0][0].transcript;
          setTranscript(spoken);
          setIsListening(false);
        };

        recognition.onerror = () => {
          setIsListening(false);
        };

        recognition.onend = () => {
          setIsListening(false);
        };

        recognition.start();
        return;
      } catch (err) {
        // Fallback simulation
      }
    }

    // Interactive fallback simulation with timer
    setIsListening(true);
    setTimeout(() => {
      setTranscript('Finish the TaskPro website tomorrow at 5 PM.');
      setIsListening(false);
    }, 1800);
  };

  const handleConfirmAndSave = () => {
    addTask({
      title: interpretedTask.title,
      description: `Dictated via voice: "${transcript}"`,
      completed: false,
      priority: interpretedTask.priority,
      dueDate: interpretedTask.dueDate,
      tags: [interpretedTask.tag, 'Voice'],
      subtasks: [],
      assignee: {
        name: user.name,
        avatar: user.avatar,
        email: user.email,
      },
    });

    setIsVoiceInputModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150">
      <div 
        className="w-full max-w-lg bg-[#0c1c1b] border border-[#285A48] rounded-2xl shadow-2xl overflow-hidden p-6 animate-in zoom-in-95 duration-150"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-3 border-b border-[#285A48]/40">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#285A48] text-[#B0E4CC] flex items-center justify-center">
              <Mic className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Voice Input</h3>
              <p className="text-xs text-neutral-400">Speak naturally to dictate tasks</p>
            </div>
          </div>
          <button
            onClick={() => setIsVoiceInputModalOpen(false)}
            className="p-1 rounded-lg text-neutral-400 hover:text-white hover:bg-[#285A48]/40"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Microphone Centerpiece */}
        <div className="flex flex-col items-center justify-center py-6 text-center">
          <button
            type="button"
            onClick={startVoiceDictation}
            className={`
              relative w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300
              ${
                isListening
                  ? 'bg-rose-600 text-white shadow-[0_0_30px_rgba(225,29,72,0.6)] animate-pulse scale-105'
                  : 'bg-[#285A48] text-[#B0E4CC] hover:bg-[#408A71] hover:scale-105 border-2 border-[#408A71] shadow-xl'
              }
            `}
            aria-label={isListening ? 'Stop listening' : 'Start listening'}
          >
            {isListening ? (
              <Mic className="w-8 h-8 animate-bounce" />
            ) : (
              <Mic className="w-8 h-8" />
            )}
          </button>
          
          <p className="text-xs font-medium text-neutral-300 mt-3">
            {isListening ? 'Listening... Speak your task now' : 'Click microphone to record voice'}
          </p>

          {/* Quick Voice Prompt presets for instant testing */}
          <div className="mt-3 flex flex-wrap justify-center gap-1.5 max-w-sm">
            {[
              'Finish the TaskPro website tomorrow at 5 PM.',
              'Prepare presentation for client today 5pm.',
              'Workout at gym tomorrow morning.',
            ].map((sample, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setTranscript(sample)}
                className="text-[11px] px-2.5 py-1 rounded-full bg-[#122822] text-[#B0E4CC] border border-[#285A48]/70 hover:border-[#408A71] transition-colors"
              >
                &ldquo;{sample}&rdquo;
              </button>
            ))}
          </div>
        </div>

        {/* Voice Transcript text input */}
        <div className="mb-4">
          <label className="text-[11px] font-semibold text-[#408A71] uppercase tracking-wider block mb-1">
            Speech Transcript
          </label>
          <input
            type="text"
            value={transcript}
            onChange={e => setTranscript(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl bg-[#122822] border border-[#285A48]/70 text-white text-xs sm:text-sm outline-none"
          />
        </div>

        {/* Confirmation Step (Interpreted Task Info) */}
        <div className="p-4 rounded-xl bg-[#122822]/90 border border-[#408A71]/50 space-y-2 mb-4">
          <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#B0E4CC] uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Interpreted Task (Confirmation Step)</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-1">
            <div>
              <span className="text-neutral-400 block text-[10px]">Task Title:</span>
              <strong className="text-white font-medium">{interpretedTask.title}</strong>
            </div>
            <div>
              <span className="text-neutral-400 block text-[10px]">Due Date:</span>
              <strong className="text-[#B0E4CC] font-mono">{interpretedTask.dueDate}</strong>
            </div>
          </div>
        </div>

        {/* Modal Buttons */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={() => setIsVoiceInputModalOpen(false)}
            className="px-4 py-2 rounded-xl text-neutral-300 hover:text-white hover:bg-[#285A48]/30 text-xs sm:text-sm"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirmAndSave}
            className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl font-bold bg-[#B0E4CC] text-[#091413] hover:bg-white transition-all text-xs sm:text-sm"
          >
            <Check className="w-4 h-4 stroke-[2.5]" />
            <span>Confirm & Create Task</span>
          </button>
        </div>
      </div>
    </div>
  );
};
