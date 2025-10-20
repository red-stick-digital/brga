import { useState } from 'react';
import emailService from '../services/emailService.js';

/**
 * React hook for email operations
 * Provides loading states and error handling for email functionality
 */
export const useEmailService = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    const resetState = () => {
        setError(null);
        setSuccess(false);
        setLoading(false);
    };

    const sendCustomEmail = async (emailData) => {
        setLoading(true);
        setError(null);
        setSuccess(false);

        try {
            const result = await emailService.sendCustomEmail(emailData);
            setSuccess(true);
            return result;
        } catch (err) {
            setError(err.message || 'Failed to send email');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const sendContactForm = async (formData) => {
        setLoading(true);
        setError(null);
        setSuccess(false);

        try {
            const result = await emailService.sendContactForm(formData);
            setSuccess(true);
            return result;
        } catch (err) {
            setError(err.message || 'Failed to send contact form');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const sendSpeakerRequest = async (requestData) => {
        setLoading(true);
        setError(null);
        setSuccess(false);

        try {
            const result = await emailService.sendSpeakerRequest(requestData);
            setSuccess(true);
            return result;
        } catch (err) {
            setError(err.message || 'Failed to send speaker request');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const sendWelcomeEmail = async (email, name) => {
        setLoading(true);
        setError(null);
        setSuccess(false);

        try {
            const result = await emailService.sendWelcomeEmail(email, name);
            setSuccess(true);
            return result;
        } catch (err) {
            setError(err.message || 'Failed to send welcome email');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const sendMeetingReminder = async (email, name, meetingInfo) => {
        setLoading(true);
        setError(null);
        setSuccess(false);

        try {
            const result = await emailService.sendMeetingReminder(email, name, meetingInfo);
            setSuccess(true);
            return result;
        } catch (err) {
            setError(err.message || 'Failed to send meeting reminder');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const sendEventAnnouncement = async (recipients, eventData) => {
        setLoading(true);
        setError(null);
        setSuccess(false);

        try {
            const results = await emailService.sendEventAnnouncement(recipients, eventData);

            // Check if all emails were sent successfully
            const failed = results.filter(result => result.status === 'rejected');
            if (failed.length > 0) {
                setError(`${failed.length} of ${results.length} emails failed to send`);
            } else {
                setSuccess(true);
            }

            return results;
        } catch (err) {
            setError(err.message || 'Failed to send event announcement');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const sendPasswordReset = async (email) => {
        setLoading(true);
        setError(null);
        setSuccess(false);

        try {
            const result = await emailService.sendPasswordReset(email);
            setSuccess(true);
            return result;
        } catch (err) {
            setError(err.message || 'Failed to send password reset email');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const sendEmailConfirmation = async (email) => {
        setLoading(true);
        setError(null);
        setSuccess(false);

        try {
            const result = await emailService.sendEmailConfirmation(email);
            setSuccess(true);
            return result;
        } catch (err) {
            setError(err.message || 'Failed to send email confirmation');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return {
        loading,
        error,
        success,
        resetState,
        sendCustomEmail,
        sendContactForm,
        sendSpeakerRequest,
        sendWelcomeEmail,
        sendMeetingReminder,
        sendEventAnnouncement,
        sendPasswordReset,
        sendEmailConfirmation,
    };
};