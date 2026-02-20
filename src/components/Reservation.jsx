import { useRef, useState } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { User, Calendar, Clock, Users, ChevronDown, CheckCircle } from 'lucide-react';

/* ─── Time slots ─────────────────────────────────────────────────────────── */
const timeSlots = [
    '6:00 PM', '6:30 PM', '7:00 PM', '7:30 PM',
    '8:00 PM', '8:30 PM', '9:00 PM', '9:30 PM', '10:00 PM',
];

const guestOptions = ['1 Guest', '2 Guests', '3 Guests', '4 Guests', '5 Guests', '6+ Guests'];

/* ─── Animated Input Field ───────────────────────────────────────────────── */
function InputField({ icon: Icon, label, type = 'text', value, onChange, placeholder, delay }) {
    const [focused, setFocused] = useState(false);
    const hasValue = value && value.length > 0;
    // Date inputs always show browser's native "dd-mm-yyyy" hint, so keep label floated up always
    const active = focused || hasValue || type === 'date';

    return (
        <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
            className="relative group"
        >
            {/* Floating label */}
            <motion.label
                animate={{
                    y: active ? -22 : 0,
                    scale: active ? 0.78 : 1,
                    color: focused ? '#C8A96A' : active ? '#6F6F6F' : '#9A9080',
                }}
                transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                className="absolute left-10 top-4 text-sm font-light pointer-events-none origin-left z-10 tracking-wide"
            >
                {label}
            </motion.label>

            {/* Icon */}
            <div className="absolute left-0 top-0 h-full flex items-center pl-0 w-8 pointer-events-none">
                <motion.div
                    animate={{ color: focused ? '#C8A96A' : '#9A9080' }}
                    transition={{ duration: 0.25 }}
                >
                    <Icon size={15} />
                </motion.div>
            </div>

            {/* Input */}
            <input
                type={type}
                value={value}
                onChange={onChange}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                placeholder={active ? placeholder : ''}
                className="w-full bg-transparent border-0 border-b pt-6 pb-2 pl-10 pr-4 text-[#2B2B2B] text-sm font-light outline-none transition-none placeholder:text-[#9A9080]/50"
                style={{ borderBottomColor: focused ? '#C8A96A' : '#E5DED3' }}
            />

            {/* Animated bottom border glow */}
            <motion.div
                className="absolute bottom-0 left-0 h-px origin-left"
                style={{ background: '#C8A96A' }}
                animate={{ scaleX: focused ? 1 : 0 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            />
        </motion.div>
    );
}

/* ─── Select Field ───────────────────────────────────────────────────────── */
function SelectField({ icon: Icon, label, value, onChange, options, delay }) {
    const [focused, setFocused] = useState(false);
    const hasValue = value && value.length > 0;
    const active = focused || hasValue;

    return (
        <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
            className="relative group"
        >
            {/* Floating label */}
            <motion.label
                animate={{
                    y: active ? -22 : 0,
                    scale: active ? 0.78 : 1,
                    color: focused ? '#C8A96A' : active ? '#6F6F6F' : '#9A9080',
                }}
                transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                className="absolute left-10 top-4 text-sm font-light pointer-events-none origin-left z-10 tracking-wide"
            >
                {label}
            </motion.label>

            {/* Icon */}
            <div className="absolute left-0 top-0 h-full flex items-center w-8 pointer-events-none">
                <motion.div
                    animate={{ color: focused ? '#C8A96A' : '#9A9080' }}
                    transition={{ duration: 0.25 }}
                >
                    <Icon size={15} />
                </motion.div>
            </div>

            {/* Chevron */}
            <div className="absolute right-0 top-0 h-full flex items-center pr-1 pointer-events-none">
                <motion.div
                    animate={{ rotate: focused ? 180 : 0, color: focused ? '#C8A96A' : '#9A9080' }}
                    transition={{ duration: 0.25 }}
                >
                    <ChevronDown size={14} />
                </motion.div>
            </div>

            <select
                value={value}
                onChange={onChange}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                className="w-full bg-transparent border-0 border-b pt-6 pb-2 pl-10 pr-6 text-[#2B2B2B] text-sm font-light outline-none appearance-none"
                style={{ borderBottomColor: focused ? '#C8A96A' : '#E5DED3' }}
            >
                <option value="" disabled hidden />
                {options.map((opt) => (
                    <option key={opt} value={opt} style={{ background: '#EDE7DA', color: '#2B2B2B' }}>
                        {opt}
                    </option>
                ))}
            </select>

            {/* Animated bottom border */}
            <motion.div
                className="absolute bottom-0 left-0 h-px origin-left"
                style={{ background: '#C8A96A' }}
                animate={{ scaleX: focused ? 1 : 0 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            />
        </motion.div>
    );
}

/* ─── Success State ──────────────────────────────────────────────────────── */
function SuccessMessage({ name }) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="text-center py-12"
        >
            <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring', stiffness: 200, damping: 16 }}
                className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6"
                style={{ border: '1px solid rgba(200,169,106,0.4)' }}
            >
                <CheckCircle size={28} className="text-[#C8A96A]" />
            </motion.div>
            <h3 className="font-serif text-2xl text-[#2B2B2B] mb-3">
                Your table is reserved
            </h3>
            <p className="text-[#6F6F6F] text-sm font-light leading-relaxed max-w-xs mx-auto">
                Thank you{name ? `, ${name}` : ''}. A confirmation will be sent to you shortly.
                We look forward to welcoming you.
            </p>
            <div className="gold-divider mx-auto mt-8" />
        </motion.div>
    );
}

/* ─── Main Reservation Component ─────────────────────────────────────────── */
export default function Reservation() {
    const sectionRef = useRef(null);
    const isInView = useInView(sectionRef, { once: true, margin: '-80px' });

    const [form, setForm] = useState({ name: '', date: '', time: '', guests: '' });
    const [submitted, setSubmitted] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    const update = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!form.name || !form.date || !form.time || !form.guests) return;
        setSubmitting(true);
        setTimeout(() => {
            setSubmitting(false);
            setSubmitted(true);
        }, 1400);
    };

    const isValid = form.name && form.date && form.time && form.guests;

    return (
        <section id="reservation" ref={sectionRef} className="py-32 relative overflow-hidden" style={{ background: '#EEE8DF' }}>

            {/* ── Subtle ambient warm glow ── */}
            <div className="absolute inset-0 pointer-events-none">
                <motion.div
                    animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.55, 0.3] }}
                    transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full"
                    style={{ background: 'radial-gradient(circle, rgba(200,169,106,0.08) 0%, transparent 65%)' }}
                />
            </div>

            <div className="section-padding max-w-5xl mx-auto relative z-10">

                {/* ── Section Header ── */}
                <motion.div
                    initial={{ opacity: 0, y: 15 }} // reduced
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
                    className="text-center mb-16"
                >
                    <div className="flex items-center justify-center gap-4 mb-6">
                        <div className="gold-divider" />
                        <span className="eyebrow text-[#C8A96A]" style={{ letterSpacing: '0.5em' }}>
                            Reservations
                        </span>
                        <div className="gold-divider" />
                    </div>
                    <h2 className="font-serif text-display-md font-semibold text-[#2B2B2B] mb-4">
                        Reserve Your
                        <br />
                        <span className="gold-text">Evening</span>
                    </h2>
                    <p className="text-[#6F6F6F] text-sm font-light max-w-sm mx-auto leading-relaxed">
                        Secure your place at the table. We recommend booking at least two weeks in advance.
                    </p>
                </motion.div>

                {/* ── Cream Panel ── */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }} // reduced
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 1.6, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
                    className="relative"
                >
                    {/* Outer gold border accent */}
                    <div
                        className="absolute -inset-px pointer-events-none"
                        style={{ background: 'linear-gradient(135deg, rgba(200,169,106,0.18) 0%, transparent 40%, transparent 60%, rgba(200,169,106,0.12) 100%)' }}
                    />

                    {/* Panel */}
                    <div
                        className="relative p-6 sm:p-10 md:p-14"
                        style={{
                            background: 'rgba(250,247,243,0.94)',
                            backdropFilter: 'blur(20px)',
                            WebkitBackdropFilter: 'blur(20px)',
                            border: '1px solid rgba(224,216,204,0.7)',
                            boxShadow: '0 1px 3px rgba(46,43,40,0.03), 0 4px 20px rgba(46,43,40,0.05)',
                        }}
                    >
                        <AnimatePresence mode="wait">
                            {submitted ? (
                                <SuccessMessage key="success" name={form.name} />
                            ) : (
                                <motion.form
                                    key="form"
                                    onSubmit={handleSubmit}
                                    exit={{ opacity: 0, y: -10, transition: { duration: 0.3 } }}
                                >
                                    {/* Form grid */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10 mb-12">
                                        <InputField icon={User} label="Full Name" value={form.name} onChange={update('name')} placeholder="Your name" delay={0.3} />
                                        <InputField icon={Calendar} label="Date" type="date" value={form.date} onChange={update('date')} placeholder="" delay={0.4} />
                                        <SelectField icon={Clock} label="Preferred Time" value={form.time} onChange={update('time')} options={timeSlots} delay={0.5} />
                                        <SelectField icon={Users} label="Number of Guests" value={form.guests} onChange={update('guests')} options={guestOptions} delay={0.6} />
                                    </div>

                                    {/* Divider */}
                                    <div className="h-px mb-10" style={{ background: 'linear-gradient(to right, transparent, #E5DED3, transparent)' }} />

                                    {/* Submit row */}
                                    <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                                        <p className="text-[#6F6F6F] text-xs font-light tracking-wide text-center md:text-left">
                                            Tue – Sun &nbsp;·&nbsp; 6:00 PM – 11:00 PM &nbsp;·&nbsp; +1 (212) 555-0182
                                        </p>

                                        <motion.button
                                            type="submit"
                                            disabled={!isValid || submitting}
                                            whileHover={isValid ? { scale: 1.03, boxShadow: '0 0 32px rgba(200,169,106,0.25)' } : {}}
                                            whileTap={isValid ? { scale: 0.97 } : {}}
                                            transition={{ type: 'spring', stiffness: 150, damping: 30 }} // softer
                                            className="relative overflow-hidden px-10 py-4 text-xs tracking-[0.3em] uppercase font-medium transition-all duration-400 flex-shrink-0"
                                            style={{
                                                background: isValid ? 'linear-gradient(135deg, #C8A96A, #DEC08A)' : 'transparent',
                                                border: `1px solid ${isValid ? 'transparent' : '#E5DED3'}`,
                                                color: isValid ? '#F5F1EB' : '#9A9080',
                                                cursor: isValid ? 'none' : 'default',
                                            }}
                                        >
                                            <AnimatePresence mode="wait">
                                                {submitting ? (
                                                    <motion.span
                                                        key="loading"
                                                        initial={{ opacity: 0 }}
                                                        animate={{ opacity: 1 }}
                                                        exit={{ opacity: 0 }}
                                                        className="flex items-center gap-2"
                                                    >
                                                        <motion.span
                                                            animate={{ rotate: 360 }}
                                                            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                                                            className="inline-block w-3 h-3 border rounded-full"
                                                            style={{ borderColor: '#F5F1EB', borderTopColor: 'transparent' }}
                                                        />
                                                        Confirming
                                                    </motion.span>
                                                ) : (
                                                    <motion.span key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                                                        Confirm Reservation
                                                    </motion.span>
                                                )}
                                            </AnimatePresence>
                                        </motion.button>
                                    </div>
                                </motion.form>
                            )}
                        </AnimatePresence>
                    </div>
                </motion.div>

                {/* ── Tagline ── */}
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={isInView ? { opacity: 1 } : {}}
                    transition={{ duration: 1.8, delay: 1.0 }}
                    className="text-center font-display text-base italic mt-12 text-[#9A9080]"
                >
                    "The table is set. The candles are lit. We await your arrival."
                </motion.p>

            </div>
        </section>
    );
}
