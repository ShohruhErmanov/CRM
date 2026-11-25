import { useEffect, useState } from 'react'
import { useToast } from '../../contexts/ToastContext.jsx'
import { api } from '../../services/api.js'
import { validateDepartment } from '../../utils/validators.js'
import Icon from '../common/Icon.jsx'
import Modal from '../common/Modal.jsx'

export default function DepartmentForm({ open, department, onClose, onSaved }) {
  const toast = useToast()
  const [values, setValues] = useState({ name: '', description: '' })
  const [errors, setErrors] = useState({})
  const [formError, setFormError] = useState('')
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    if (!open) return
    setValues({ name: department?.name || '', description: department?.description || '' })
    setErrors({})
    setFormError('')
  }, [open, department])

  const handleSubmit = async (event) => {
    event.preventDefault()
    const validationErrors = validateDepartment(values)
    if (Object.keys(validationErrors).length) return setErrors(validationErrors)

    setBusy(true)
    setFormError('')
    try {
      if (department) await api.departments.update(department.id, values)
      else await api.departments.create(values)
      toast.success(department ? 'Bo‘lim maʼlumotlari saqlandi.' : 'Bo‘lim qo‘shildi.')
      onSaved()
      onClose()
    } catch (error) {
      setFormError(error.message)
      toast.error(error.message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <Modal
      open={open}
      title={department ? 'Bo‘limni tahrirlash' : 'Yangi bo‘lim qo‘shish'}
      subtitle="Bo‘lim nomi va qisqa tavsifini kiriting."
      onClose={onClose}
      size="small"
      footer={
        <>
          <button type="button" className="button button--ghost" onClick={onClose} disabled={busy}>Bekor qilish</button>
          <button type="submit" form="department-form" className="button button--primary" disabled={busy}>
            {busy ? 'Saqlanmoqda…' : 'Saqlash'}
          </button>
        </>
      }
    >
      <form id="department-form" className="form-grid" onSubmit={handleSubmit} noValidate>
        {formError && <div className="form-banner"><Icon name="alert" size={17} /> {formError}</div>}
        <label className="field">
          <span>Bo‘lim nomi <em>*</em></span>
          <input value={values.name} onChange={(event) => setValues({ ...values, name: event.target.value })} placeholder="Masalan: IT" className={errors.name ? 'is-invalid' : ''} />
          {errors.name && <small>{errors.name}</small>}
        </label>
        <label className="field">
          <span>Tavsif</span>
          <textarea rows="4" value={values.description} onChange={(event) => setValues({ ...values, description: event.target.value })} placeholder="Bo‘lim haqida qisqacha maʼlumot" className={errors.description ? 'is-invalid' : ''} />
          {errors.description && <small>{errors.description}</small>}
        </label>
      </form>
    </Modal>
  )
}
