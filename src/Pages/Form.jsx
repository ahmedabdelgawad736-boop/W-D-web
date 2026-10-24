import React, { useRef, useState } from 'react';
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Briefcase,
  Building2,
  Check,
  Factory,
  HeartPulse,
  Home,
  LayoutGrid,
  Link as LinkIcon,
  Loader2,
  Lock,
  Mail,
  MessageCircle,
  Phone,
  Shirt,
  Store,
  UtensilsCrossed,
} from 'lucide-react';
import { useLanguage } from '../Translation/LanguageContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

import './Form.css';

/* Web3Forms handles receiving the submissions — no backend is needed. */
const WEB3FORMS_ENDPOINT = 'https://api.web3forms.com/submit';
const WEB3FORMS_ACCESS_KEY = '7e4a5ccc-d2f7-4d29-8458-19b05ed37705';
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/* Activity / channel icons resolved from the translation option lists. */
const ICON_MAP = {
  UtensilsCrossed,
  Store,
  Building2,
  Shirt,
  HeartPulse,
  Factory,
  Briefcase,
  LayoutGrid,
  MessageCircle,
  Phone,
  Mail,
};

/* Stable field names so Web3Forms submissions stay readable in email notifications. */
const FIELD_NAMES = {
  fullName: 'full_name',
  companyName: 'company_name',
  facilityStatus: 'facility_status',
  phone: 'phone',
  email: 'email',
  city: 'city',
  area: 'area',
  website: 'website',
  projectDetails: 'project_details',
  filesLink: 'project_files_link',
  hasDesign: 'has_design',
  activity: 'activity_type',
  goal: 'project_goal',
  stage: 'project_stage',
  location: 'location_address',
  budget: 'budget_range',
  deadline: 'deadline',
  hardDeadline: 'hard_deadline',
  deadlineDate: 'deadline_date',
  channel: 'contact_channel',
  callTime: 'best_call_time',
  notes: 'notes',
};

const INITIAL_VALUES = Object.keys(FIELD_NAMES).reduce((acc, key) => {
  acc[key] = '';
  return acc;
}, { scope: [] });

/* ==========================================================================
   Small presentational helpers
   ========================================================================== */

function SectionCard({ num, tag, title, children }) {
  return (
    <section className="form-section-card">
      <header className="form-section-head">
        <div className="form-section-title-row">
          <h2 className="form-section-title">{title}</h2>
          <span className="form-section-num font-mono">SECTION {num}</span>
        </div>
        {tag && <span className="form-section-tag font-mono">{tag}</span>}
      </header>
      <div className="form-section-body">{children}</div>
    </section>
  );
}

function FieldLabel({ htmlFor, text, required, optional }) {
  return (
    <label className="form-label" htmlFor={htmlFor}>
      <span>{text}</span>
      {required && (
        <span className="form-req" aria-hidden="true">
          *
        </span>
      )}
      {optional && <span className="form-opt">{optional}</span>}
    </label>
  );
}

function FieldError({ id, message }) {
  if (!message) return null;
  return (
    <p className="form-field-error" id={id} role="alert">
      {message}
    </p>
  );
}

function TextInput({ id, name, value, onChange, placeholder, invalid, required, type = 'text' }) {
  return (
    <input
      id={id}
      name={name}
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      aria-invalid={invalid ? 'true' : undefined}
      className={`form-input ${invalid ? 'is-invalid' : ''}`}
    />
  );
}

function TextArea({ id, name, value, onChange, placeholder, invalid, required, rows = 4 }) {
  return (
    <textarea
      id={id}
      name={name}
      rows={rows}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      aria-invalid={invalid ? 'true' : undefined}
      className={`form-textarea ${invalid ? 'is-invalid' : ''}`}
    />
  );
}

/* Single choice row: text first, radio control at the inline end
   (left in Arabic, right in English — matching the reference design). */
function OptionRow({ groupName, option, checked, onChange }) {
  const IconComponent = option.icon ? ICON_MAP[option.icon] : null;
  return (
    <label className={`form-option ${checked ? 'is-selected' : ''}`}>
      <span className="form-option-body">
        {IconComponent && (
          <IconComponent size={20} className="form-option-icon" aria-hidden="true" strokeWidth={1.8} />
        )}
        <span className="form-option-text">
          <span className="form-option-label">{option.label}</span>
          {option.desc && <span className="form-option-desc">{option.desc}</span>}
        </span>
      </span>
      <input
        type="radio"
        name={groupName}
        value={option.label}
        checked={checked}
        onChange={onChange}
        className="form-visually-hidden"
      />
      <span className="form-option-control" aria-hidden="true" />
    </label>
  );
}

/* Icon tile used for the "activity type" question. */
function ActivityCard({ groupName, option, checked, onChange }) {
  const IconComponent = ICON_MAP[option.icon] || Building2;
  return (
    <label className={`form-activity-card ${checked ? 'is-selected' : ''}`}>
      <input
        type="radio"
        name={groupName}
        value={option.label}
        checked={checked}
        onChange={onChange}
        className="form-visually-hidden"
      />
      <span className="form-activity-control" aria-hidden="true" />
      <IconComponent size={26} className="form-activity-icon" strokeWidth={1.6} />
      <span className="form-activity-label">{option.label}</span>
    </label>
  );
}

/* Multi-select row for the scope-of-work matrix. */
function CheckRow({ item, checked, onToggle }) {
  return (
    <label className={`form-check-row ${checked ? 'is-selected' : ''}`}>
      <span className="form-check-text">
        <span className="form-check-title">{item.title}</span>
        <span className="form-check-desc">{item.desc}</span>
      </span>
      <input
        type="checkbox"
        value={item.title}
        checked={checked}
        onChange={onToggle}
        className="form-visually-hidden"
      />
      <span className="form-check-control" aria-hidden="true">
        {checked && <Check size={13} strokeWidth={3} />}
      </span>
    </label>
  );
}

/* ==========================================================================
   Quote request form page
   ========================================================================== */
export default function Form() {
  const { lang, t } = useLanguage();
  const isAr = lang === 'ar';
  const f = t.form;

  const [values, setValues] = useState(INITIAL_VALUES);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle'); /* idle | submitting | success */
  const [submitError, setSubmitError] = useState('');
  const formRef = useRef(null);

  const setField = (key) => (event) => {
    const { value } = event.target;
    setValues((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => (prev[key] ? { ...prev, [key]: '' } : prev));
  };

  const toggleScope = (item) => () => {
    setValues((prev) => ({
      ...prev,
      scope: prev.scope.includes(item.title)
        ? prev.scope.filter((title) => title !== item.title)
        : [...prev.scope, item.title],
    }));
  };

  const validate = () => {
    const next = {};
    if (!values.fullName.trim()) next.fullName = f.validation.required;
    if (!values.phone.trim()) next.phone = f.validation.required;
    else if (values.phone.replace(/\D/g, '').length < 8) next.phone = f.validation.invalidPhone;
    if (!values.email.trim()) next.email = f.validation.required;
    else if (!EMAIL_RE.test(values.email.trim())) next.email = f.validation.invalidEmail;
    if (!values.projectDetails.trim()) next.projectDetails = f.validation.required;
    if (!values.location.trim()) next.location = f.validation.required;
    return next;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (status === 'submitting') return; /* no duplicate submissions */

    const nextErrors = validate();
    setErrors(nextErrors);

    const firstInvalid = Object.keys(nextErrors)[0];
    if (firstInvalid) {
      const node = formRef.current?.querySelector(`[name="${FIELD_NAMES[firstInvalid]}"]`);
      if (node) {
        node.scrollIntoView({ behavior: 'smooth', block: 'center' });
        node.focus({ preventScroll: true });
      }
      setSubmitError(
        isAr
          ? 'يرجى استكمال جميع الحقول المطلوبة المشار إليها بعلامة (*)'
          : 'Please complete all required fields marked with (*)'
      );
      return;
    }

    setStatus('submitting');
    setSubmitError('');

    try {
      const formData = new FormData();
      formData.append('access_key', WEB3FORMS_ACCESS_KEY);
      formData.append('subject', f.emailSubject || 'طلب عرض سعر جديد — WD Agency');
      formData.append('from_name', values.fullName ? `${values.fullName} (WD Agency Website)` : 'WD Agency Website');
      formData.append('botcheck', '');

      // Set standard name & email for Web3Forms Reply-To handling
      if (values.fullName) formData.append('name', values.fullName.trim());
      if (values.email) formData.append('email', values.email.trim());

      Object.entries(FIELD_NAMES).forEach(([key, name]) => {
        if (key !== 'email') {
          const value = (values[key] || '').trim();
          if (value) formData.append(name, value);
        }
      });

      if (values.scope && values.scope.length > 0) {
        formData.append('scope_of_work', values.scope.join(', '));
      }

      const response = await fetch(WEB3FORMS_ENDPOINT, {
        method: 'POST',
        body: formData,
        headers: { Accept: 'application/json' },
      });

      const data = await response.json();
      console.log('Web3Forms response:', data);

      if (response.ok && data.success) {
        setStatus('success');
        setValues(INITIAL_VALUES);
        setErrors({});
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        throw new Error(data.message || f.error.generic);
      }
    } catch (error) {
      console.error('Web3Forms submission error:', error);
      setSubmitError(error?.message || f.error.generic);
      setStatus('idle');
    }
  };

  const resetForm = () => {
    setValues(INITIAL_VALUES);
    setErrors({});
    setSubmitError('');
    setStatus('idle');
  };

  const ArrowIcon = isAr ? ArrowLeft : ArrowRight;
  const BackIcon = isAr ? ArrowRight : ArrowLeft;
  const F = f.fields;
  const err = (key) => errors[key] || '';

  return (
    <div className="wd-app-root">
      <Navbar />

      <main id="main-content" className={`wd-form-page ${isAr ? 'form-dir-ar' : 'form-dir-en'}`}>
        <div className="wd-container">
          {/* Page header */}
          <div className="form-page-header">
            <a href="#" className="form-back-btn">
              <BackIcon size={17} strokeWidth={2.4} aria-hidden="true" />
              <span>{f.backLink}</span>
            </a>
            <h1 className="form-page-title">{f.headerTitle}</h1>
            <p className="form-page-summary">{f.headerSummary}</p>
          </div>

          {status === 'success' ? (
            /* ------------------------- Success panel ------------------------- */
            <div className="form-success-panel" role="status">
              <span className="form-success-icon">
                <Check size={30} strokeWidth={3} />
              </span>
              <h2 className="form-success-title">{f.success.title}</h2>
              <p className="form-success-msg">{f.success.message}</p>
              <div className="form-success-actions">
                <button type="button" className="form-submit-btn" onClick={resetForm}>
                  <span>{f.success.btn}</span>
                </button>
                <a href="#" className="form-secondary-btn">
                  <Home size={17} strokeWidth={2.2} aria-hidden="true" />
                  <span>{f.success.home}</span>
                </a>
              </div>
            </div>
          ) : (
            <form ref={formRef} className="wd-quote-form" onSubmit={handleSubmit} noValidate>
              {/* ---------------------- SECTION 01 ---------------------- */}
              <SectionCard
                num={f.sections.client.num}
                tag={f.sections.client.tag}
                title={f.sections.client.title}
              >
                <div className="form-grid form-grid-2">
                  <div className="form-field">
                    <FieldLabel htmlFor="full_name" text={F.fullName.label} required />
                    <TextInput
                      id="full_name"
                      name="full_name"
                      value={values.fullName}
                      onChange={setField('fullName')}
                      placeholder={F.fullName.ph}
                      invalid={!!err('fullName')}
                      required
                    />
                    <FieldError id="full_name-error" message={err('fullName')} />
                  </div>

                  <div className="form-field">
                    <FieldLabel
                      htmlFor="company_name"
                      text={F.companyName.label}
                      optional={f.optionalTag}
                    />
                    <TextInput
                      id="company_name"
                      name="company_name"
                      value={values.companyName}
                      onChange={setField('companyName')}
                      placeholder={F.companyName.ph}
                    />
                  </div>
                </div>

                <fieldset className="form-field form-fieldset">
                  <legend className="form-label">{F.facilityStatus.label}</legend>
                  <div className="form-grid form-grid-3">
                    {F.facilityStatus.options.map((option) => (
                      <OptionRow
                        key={option.id}
                        groupName="facility_status"
                        option={option}
                        checked={values.facilityStatus === option.label}
                        onChange={setField('facilityStatus')}
                      />
                    ))}
                  </div>
                </fieldset>

                <div className="form-grid form-grid-2">
                  <div className="form-field">
                    <FieldLabel htmlFor="phone" text={F.phone.label} required />
                    <div className="form-phone-row">
                      {/* Country prefix is the FIRST flex child, so the
                          direction rule does all the work: LTR renders
                          "+20 [input]" (prefix on the left) and RTL renders
                          "[input] +20" (prefix on the right) — no hardcoded
                          left/right positioning. */}
                      <span className="form-phone-prefix font-mono" aria-hidden="true">
                        {F.phone.prefix}
                      </span>
                      <TextInput
                        id="phone"
                        name="phone"
                        type="tel"
                        value={values.phone}
                        onChange={setField('phone')}
                        placeholder={F.phone.ph}
                        invalid={!!err('phone')}
                        required
                      />
                    </div>
                    <FieldError id="phone-error" message={err('phone')} />
                  </div>

                  <div className="form-field">
                    <FieldLabel htmlFor="email" text={F.email.label} required />
                    <TextInput
                      id="email"
                      name="email"
                      type="email"
                      value={values.email}
                      onChange={setField('email')}
                      placeholder={F.email.ph}
                      invalid={!!err('email')}
                      required
                    />
                    <FieldError id="email-error" message={err('email')} />
                  </div>

                  <div className="form-field">
                    <FieldLabel htmlFor="city" text={F.city.label} />
                    <TextInput
                      id="city"
                      name="city"
                      value={values.city}
                      onChange={setField('city')}
                      placeholder={F.city.ph}
                    />
                  </div>

                  <div className="form-field">
                    <FieldLabel htmlFor="area" text={F.area.label} />
                    <TextInput
                      id="area"
                      name="area"
                      value={values.area}
                      onChange={setField('area')}
                      placeholder={F.area.ph}
                    />
                  </div>
                </div>

                <div className="form-field">
                  <FieldLabel
                    htmlFor="website"
                    text={F.website.label}
                    optional={f.optionalTag}
                  />
                  <div className="form-input-icon-row">
                    <TextInput
                      id="website"
                      name="website"
                      value={values.website}
                      onChange={setField('website')}
                      placeholder={F.website.ph}
                    />
                    <LinkIcon size={18} className="form-input-icon" aria-hidden="true" />
                  </div>
                </div>
              </SectionCard>

              {/* ---------------------- SECTION 02 ---------------------- */}
              <SectionCard
                num={f.sections.scope.num}
                title={f.sections.scope.title}
              >
                <fieldset className="form-field form-fieldset">
                  <span className="form-micro font-mono">{F.scope.micro}</span>
                  <legend className="form-label">{F.scope.label}</legend>
                  <div className="form-grid form-grid-2">
                    {F.scope.items.map((item) => (
                      <CheckRow
                        key={item.id}
                        item={item}
                        checked={values.scope.includes(item.title)}
                        onToggle={toggleScope(item)}
                      />
                    ))}
                  </div>
                </fieldset>

                <div className="form-field">
                  <span className="form-micro font-mono">{F.projectDetails.micro}</span>
                  <FieldLabel
                    htmlFor="project_details"
                    text={F.projectDetails.label}
                    required
                  />
                  <TextArea
                    id="project_details"
                    name="project_details"
                    value={values.projectDetails}
                    onChange={setField('projectDetails')}
                    placeholder={F.projectDetails.ph}
                    invalid={!!err('projectDetails')}
                    required
                  />
                  <FieldError id="project_details-error" message={err('projectDetails')} />
                </div>

                <fieldset className="form-field form-fieldset">
                  <legend className="form-label">{F.hasDesign.label}</legend>
                  {/* Same option-row convention as every other radio
                      question (default gap, no tight variant), so the
                      circle-to-label spacing matches the rest of the form
                      in both LTR and RTL. */}
                  <div className="form-grid form-grid-2">
                    {F.hasDesign.options.map((option) => (
                      <OptionRow
                        key={option.id}
                        groupName="has_design"
                        option={option}
                        checked={values.hasDesign === option.label}
                        onChange={setField('hasDesign')}
                      />
                    ))}
                  </div>
                </fieldset>

                <div className="form-field">
                  <FieldLabel
                    htmlFor="project_files_link"
                    text={F.filesLink.label}
                    optional={f.optionalTag}
                  />
                  <p className="form-helper">{F.filesLink.helper}</p>
                  <div className="form-input-icon-row">
                    <TextInput
                      id="project_files_link"
                      name="project_files_link"
                      type="url"
                      value={values.filesLink}
                      onChange={setField('filesLink')}
                      placeholder={F.filesLink.ph}
                    />
                    <LinkIcon size={18} className="form-input-icon" aria-hidden="true" />
                  </div>
                </div>
              </SectionCard>

              {/* ---------------------- SECTION 03 ---------------------- */}
              <SectionCard
                num={f.sections.project.num}
                title={f.sections.project.title}
              >
                <fieldset className="form-field form-fieldset">
                  <legend className="form-label">{F.activity.label}</legend>
                  <div className="form-grid form-grid-4 form-activity-grid">
                    {F.activity.options.map((option) => (
                      <ActivityCard
                        key={option.id}
                        groupName="activity_type"
                        option={option}
                        checked={values.activity === option.label}
                        onChange={setField('activity')}
                      />
                    ))}
                  </div>
                </fieldset>

                <fieldset className="form-field form-fieldset">
                  <legend className="form-label">{F.goal.label}</legend>
                  <div className="form-grid form-grid-3 form-options-tight">
                    {F.goal.options.map((option) => (
                      <OptionRow
                        key={option.id}
                        groupName="project_goal"
                        option={option}
                        checked={values.goal === option.label}
                        onChange={setField('goal')}
                      />
                    ))}
                  </div>
                </fieldset>

                <fieldset className="form-field form-fieldset">
                  <legend className="form-label">{F.stage.label}</legend>
                  <div className="form-grid form-grid-4 form-options-tight">
                    {F.stage.options.map((option) => (
                      <OptionRow
                        key={option.id}
                        groupName="project_stage"
                        option={option}
                        checked={values.stage === option.label}
                        onChange={setField('stage')}
                      />
                    ))}
                  </div>
                </fieldset>

                <div className="form-field">
                  <span className="form-micro font-mono">{F.location.micro}</span>
                  <FieldLabel htmlFor="location_address" text={F.location.label} required />
                  <TextArea
                    id="location_address"
                    name="location_address"
                    rows={2}
                    value={values.location}
                    onChange={setField('location')}
                    placeholder={F.location.ph}
                    invalid={!!err('location')}
                    required
                  />
                  <FieldError id="location_error-error" message={err('location')} />
                </div>
              </SectionCard>

              {/* ---------------------- SECTION 04 ---------------------- */}
              <SectionCard
                num={f.sections.budget.num}
                title={f.sections.budget.title}
              >
                <fieldset className="form-field form-fieldset">
                  <legend className="form-label">{F.budget.label}</legend>
                  <div className="form-grid form-grid-3 form-options-tight">
                    {F.budget.options.map((option) => (
                      <OptionRow
                        key={option.id}
                        groupName="budget_range"
                        option={option}
                        checked={values.budget === option.label}
                        onChange={setField('budget')}
                      />
                    ))}
                  </div>
                </fieldset>

                <fieldset className="form-field form-fieldset">
                  <legend className="form-label">{F.deadline.label}</legend>
                  <div className="form-grid form-grid-5">
                    {F.deadline.options.map((option) => (
                      <OptionRow
                        key={option.id}
                        groupName="deadline"
                        option={option}
                        checked={values.deadline === option.label}
                        onChange={setField('deadline')}
                      />
                    ))}
                  </div>
                </fieldset>

                <fieldset className="form-field form-fieldset">
                  <legend className="form-label">{F.hardDeadline.label}</legend>
                  <div className="form-grid form-grid-2">
                    {F.hardDeadline.options.map((option) => (
                      <OptionRow
                        key={option.id}
                        groupName="hard_deadline"
                        option={option}
                        checked={values.hardDeadline === option.label}
                        onChange={setField('hardDeadline')}
                      />
                    ))}
                  </div>
                  {values.hardDeadline === F.hardDeadline.options[0].label && (
                    <div className="form-field form-date-field">
                      <FieldLabel htmlFor="deadline_date" text={F.hardDeadline.dateLabel} />
                      <input
                        id="deadline_date"
                        name="deadline_date"
                        type="date"
                        value={values.deadlineDate}
                        onChange={setField('deadlineDate')}
                        placeholder={F.hardDeadline.datePh}
                        className="form-input form-date-input"
                      />
                    </div>
                  )}
                </fieldset>
              </SectionCard>

              {/* ---------------------- SECTION 05 ---------------------- */}
              <SectionCard
                num={f.sections.confirm.num}
                title={f.sections.confirm.title}
              >
                <fieldset className="form-field form-fieldset">
                  <legend className="form-label">{F.channel.label}</legend>
                  <div className="form-grid form-grid-3">
                    {F.channel.options.map((option) => (
                      <OptionRow
                        key={option.id}
                        groupName="contact_channel"
                        option={option}
                        checked={values.channel === option.label}
                        onChange={setField('channel')}
                      />
                    ))}
                  </div>
                </fieldset>

                <fieldset className="form-field form-fieldset">
                  <legend className="form-label">{F.callTime.label}</legend>
                  <div className="form-grid form-grid-3">
                    {F.callTime.options.map((option) => (
                      <OptionRow
                        key={option.id}
                        groupName="best_call_time"
                        option={option}
                        checked={values.callTime === option.label}
                        onChange={setField('callTime')}
                      />
                    ))}
                  </div>
                </fieldset>

                <div className="form-field">
                  <FieldLabel htmlFor="notes" text={F.notes.label} optional={f.optionalTag} />
                  <TextArea
                    id="notes"
                    name="notes"
                    value={values.notes}
                    onChange={setField('notes')}
                    placeholder={F.notes.ph}
                  />
                </div>
              </SectionCard>

              {/* ---------------------- Dispatch bar ---------------------- */}
              <div className="form-dispatch-bar">
                <p className="form-privacy-note">
                  <Lock size={15} className="form-privacy-icon" aria-hidden="true" />
                  <span>{f.privacy}</span>
                </p>

                <button
                  type="submit"
                  className="form-submit-btn"
                  disabled={status === 'submitting'}
                  aria-busy={status === 'submitting'}
                >
                  {status === 'submitting' ? (
                    <Loader2 size={18} className="form-spin" aria-hidden="true" />
                  ) : null}
                  <span>{status === 'submitting' ? f.submitting : f.submitBtn}</span>
                  {status === 'submitting' ? null : (
                    <ArrowIcon size={18} className="form-submit-arrow" aria-hidden="true" />
                  )}
                </button>
              </div>

              {submitError && (
                <div className="form-error-banner" role="alert">
                  <AlertCircle size={20} className="form-error-icon" aria-hidden="true" />
                  <div className="form-error-text">
                    <strong>{f.error.title}</strong>
                    <p>{submitError}</p>
                  </div>
                </div>
              )}
            </form>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
