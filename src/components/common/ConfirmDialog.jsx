import Icon from './Icon.jsx'
import Modal from './Modal.jsx'

export default function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = 'Tasdiqlash',
  cancelLabel = 'Bekor qilish',
  icon = 'alert',
  busy = false,
  error = '',
  onConfirm,
  onClose,
}) {
  return (
    <Modal
      open={open}
      title={title}
      onClose={onClose}
      size="small"
      footer={
        <>
          <button type="button" className="button button--ghost" onClick={onClose} disabled={busy}>
            {cancelLabel}
          </button>
          <button type="button" className="button button--primary" onClick={onConfirm} disabled={busy}>
            {busy ? 'Yuklanmoqda…' : confirmLabel}
          </button>
        </>
      }
    >
      <div className="confirm-dialog">
        <div className="confirm-dialog__icon"><Icon name={icon} size={24} /></div>
        <p>{message}</p>
        {error && <div className="inline-error"><Icon name="alert" size={16} /> {error}</div>}
      </div>
    </Modal>
  )
}
