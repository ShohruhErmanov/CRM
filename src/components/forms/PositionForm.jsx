import { useEffect, useState } from 'react'
import { useToast } from '../../hooks/useToast.js'
import { api } from '../../services/api.js'
import { validatePosition } from '../../utils/validators.js'
import Icon from '../common/Icon.jsx'
import Modal from '../common/Modal.jsx'

export default function PositionForm({ open, position, departments = [], onClose, onSaved }) {
  const toast = useToast()
  const [values, setValues] = useState({ name: '', departmentId: '', description: '' })
  const [errors, setErrors] = useState({})
  const [formError, setFormError] = useState('')
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    if (!open) return
    setValues({
      name: position?.name || '',
      departmentId: position?.departmentId || '',
      description: position?.description || '',
    })
    setErrors({})
    setFormError('')
  }, [open, position])

  const handleSubmit = async (event) => {
    event.preventDefault()
    const validationErrors = validatePosition(values)
    if (Object.keys(validationErrors).length) return setErrors(validationErrors)

    setBusy(true)
    setFormError('')
    try {
      if (position) await api.positions.update(position.id, values)
      else await api.positions.create(values)
      toast.success(position ? 'Lavozim maʼlumotlari saqlandi.' : 'Lavozim qo‘shildi.')
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
      title={position ? 'Lavozimni tahrirlash' : 'Yangi lavozim qo‘shish'}
      subtitle="Lavozimni tegishli bo‘limga biriktiring."
      onClose={onClose}
      size="small"
      footer={
        <>
          <button type="button" className="button button--ghost" onClick={onClose} disabled={busy}>Bekor qilish</button>
          <button type="submit" form="position-form" className="button button--primary" disabled={busy}>
            {busy ? 'Saqlanmoqda…' : 'Saqlash'}
          </button>
        </>
      }
    >
      <form id="position-form" className="form-grid" onSubmit={handleSubmit} noValidate>
        {formError && <div className="form-banner"><Icon name="alert" size={17} /> {formError}</div>}
        <label className="field">
          <span>Lavozim nomi <em>*</em></span>
          <input value={values.name} onChange={(event) => setValues({ ...values, name: event.target.value })} placeholder="Masalan: Dasturchi" className={errors.name ? 'is-invalid' : ''} />
          {errors.name && <small>{errors.name}</small>}
        </label>
        <label className="field">
          <span>Bo‘lim <em>*</em></span>
          <select value={values.departmentId} onChange={(event) => setValues({ ...values, departmentId: event.target.value })} className={errors.departmentId ? 'is-invalid' : ''}>
            <option value="">Bo‘lim tanlang</option>
            {departments.map((department) => <option value={department.id} key={department.id}>{department.name}</option>)}
          </select>
          {errors.departmentId && <small>{errors.departmentId}</small>}
        </label>
        <label className="field">
          <span>Tavsif</span>
          <textarea rows="3" value={values.description} onChange={(event) => setValues({ ...values, description: event.target.value })} placeholder="Lavozim haqida qisqacha maʼlumot" />
        </label>
      </form>
    </Modal>
  )
}
