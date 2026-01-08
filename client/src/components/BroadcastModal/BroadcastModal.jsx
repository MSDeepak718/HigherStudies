import { useState } from 'react';
import broadcastService from '../../services/broadcastService';
import './BroadcastModal.css';

function BroadcastModal({ isOpen, onClose, filteredData }) {
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [feedbackType, setFeedbackType] = useState(''); // 'success' or 'error'

  const handleSend = async () => {
    if (!subject.trim()) {
      setFeedbackType('error');
      setFeedbackMessage('Subject is required');
      return;
    }
    if (!message.trim()) {
      setFeedbackType('error');
      setFeedbackMessage('Message is required');
      return;
    }
    if (filteredData.length === 0) {
      setFeedbackType('error');
      setFeedbackMessage('No students to send broadcast to');
      return;
    }

    setIsSending(true);
    setFeedbackMessage('');
    
    try {
      const result = await broadcastService.sendBroadcast(subject, message, filteredData);
      if (result.success) {
        setFeedbackType('success');
        setFeedbackMessage(`✓ ${result.data.message}`);
        setSubject('');
        setMessage('');
        
        // Close modal after 2 seconds on success
        setTimeout(() => {
          onClose();
          setFeedbackMessage('');
        }, 2000);
      } else {
        setFeedbackType('error');
        setFeedbackMessage(`✗ ${result.data.error || 'Failed to send broadcast'}`);
      }
    } catch (error) {
      setFeedbackType('error');
      setFeedbackMessage(`✗ Error: ${error.message}`);
    } finally {
      setIsSending(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Broadcast Message</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <div className="modal-body">
          <div className="recipient-info">
            <p>
              <strong>Recipients:</strong> {filteredData.length} student(s) will receive this message
            </p>
          </div>

          <div className="form-group">
            <label htmlFor="subject">Subject *</label>
            <input
              id="subject"
              type="text"
              placeholder="Enter email subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              disabled={isSending}
            />
          </div>

          <div className="form-group">
            <label htmlFor="message">Message *</label>
            <textarea
              id="message"
              placeholder="Enter your message here..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows="8"
              disabled={isSending}
            />
            <p className="char-count">{message.length} characters</p>
          </div>

          {feedbackMessage && (
            <div className={`feedback ${feedbackType}`}>
              {feedbackMessage}
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button
            className="btn-cancel"
            onClick={onClose}
            disabled={isSending}
          >
            Cancel
          </button>
          <button
            className="btn-send"
            onClick={handleSend}
            disabled={isSending || filteredData.length === 0}
          >
            {isSending ? 'Sending...' : 'Send Broadcast'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default BroadcastModal;
