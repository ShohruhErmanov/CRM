import { useEffect, useMemo, useState } from 'react'
import { api } from '../../services/api.js'
import { serverErrorsToFields, validateEmployee } from '../../utils/validators.js'
import { useToast } from '../../contexts/ToastContext.jsx'
import Icon from '../common/Icon.jsx'
import Modal from '../common/Modal.jsx'

const emptyValues = {
  firstName: '', lastName: '', phone: '', email: '',
  departmentId: '', positionId: '', hireDate: '', salary: '',
}

function toValues(employee) {
  if (!employee) return { ...emptyValues, hireDate: new Date().toISOString().slice(0, 10) }
  return {
    firstName: employee.firstName || '',
    lastName: employee.lastName || '',
    phone: employee.phone || '',
    email: employee.email || '',
    departmentId: employee.departmentId || '',
    positionId: employee.positionId || '',
    hireDate: employee.hireDate || '',
    salary: String(employee.salary ?? ''),
  }
}

export default function EmployeeForm({ open, employee, departments = [], positions = [], onClose, onSaved }) {
  const toast = useToast()
  const [values, setValues] = useState(() => toValues(employee))
  const [errors, setErrors] = useState({})
  const [formError, setFormError] = useState('')
  const [photoFile, setPhotoFile] = useState(null)
  const [photoPreview, setPhotoPreview] = useState('')
  const [removePhoto, setRemovePhoto] = useState(false)
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    if (!open) return
    setValues(toValues(employee))
    setErrors({})
    setFormError('')
    setPhotoFile(null)
    setPhotoPreview('')
    setRemovePhoto(false)
  }, [open, employee])

  useEffect(() => () => {
    if (photoPreview.startsWith('blob:')) URL.revokeObjectURL(photoPreview)
  }, [photoPreview])

  const availablePositions = useMemo(
    () => positions.filter((position) => !values.departmentId || String(position.departmentId) === String(values.departmentId)),
    [positions, values.departmentId],
  )

  const existingPhoto = employee?.photoPath && !removePhoto ? employee.photoPath : null
  const preview = photoPreview || existingPhoto

  const setField = (field, value) => {
    setValues((current) => ({
      ...current,
      [field]: value,
      ...(field === 'departmentId' ? { positionId: '' } : {}),
    }))
    setErrors((current) => ({ ...current, [field]: undefined }))
  }

  const handlePhoto = (event) => {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      setErrors((current) => ({ ...current, photo: 'Faqat JPG, PNG yoki WEBP rasmi tanlang.' }))
      return
    }
    if (file.size > 2 * 1024 * 1024) {
      setErrors((current) => ({ ...current, photo: 'Rasm hajmi 2 MB dan oshmasligi kerak.' }))
      return
    }
    if (photoPreview.startsWith('blob:')) URL.revokeObjectURL(photoPreview)
    setPhotoFile(file)
    setPhotoPreview(URL.createObjectURL(file))
    setRemovePhoto(false)
    setErrors((current) => ({ ...current, photo: undefined }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    const validationErrors = validateEmployee(values, availablePositions)
    if (Object.keys(validationErrors).length) {
      setErrors(validationErrors)
      return
    }

    const formData = new FormData()
    Object.entries(values).forEach(([key, value]) => formData.append(key, String(value).trim()))
    if (photoFile) formData.append('photo', photoFile)
    if (removePhoto) formData.append('removePhoto', 'true')

    setBusy(true)
    setFormError('')
    try {
      if (employee) await api.employees.update(employee.id, formData)
      else await api.employees.create(formData)
      toast.success(employee ? 'Xodim maʼlumotlari saqlandi.' : 'Yangi xodim qo‘shildi.')
      onSaved()
      onClose()
    } catch (error) {
      const fieldErrors = serverErrorsToFields(error.details)
      if (Object.keys(fieldErrors).length) setErrors((current) => ({ ...current, ...fieldErrors }))
      setFormError(error.message)
      toast.error(error.message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <Modal
      open={open}
      title={employee ? 'Xodim maʼlumotlarini tahrirlash' : 'Yangi xodim qo‘shish'}
      subtitle={employee ? `${employee.firstName} ${employee.lastName}` : 'Ishchi maʼlumotlarni to‘ldiring va saqlang.'}
      onClose={onClose}
      size="large"
      footer={
        <>
          <button type="button" className="button button--ghost" onClick={onClose} disabled={busy}>Bekor qilish</button>
          <button type="submit" form="employee-form" className="button button--primary" disabled={busy}>
            {busy ? 'Saqlanmoqda…' : 'Saqlash'}
          </button>
        </>
      }
    >
      <form id="employee-form" className="form-grid" onSubmit={handleSubmit} noValidate>
        {formError && <div className="form-banner"><Icon name="alert" size={17} /> {formError}</div>}

        <div className="form-section">
          <h3>Shaxsiy maʼlumotlar</h3>
          <div className="form-grid__columns">
            <label className="field">
              <span>Ism <em>*</em></span>
              <input value={values.firstName} onChange={(event) => setField('firstName', event.target.value)} placeholder="Masalan: Aziz" className={errors.firstName ? 'is-invalid' : ''} />
              {errors.firstName && <small>{errors.firstName}</small>}
            </label>
            <label className="field">
              <span>Familiya <em>*</em></span>
              <input value={values.lastName} onChange={(event) => setField('lastName', event.target.value)} placeholder="Masalan: Karimov" className={errors.lastName ? 'is-invalid' : ''} />
              {errors.lastName && <small>{errors.lastName}</small>}
            </label>
            <label className="field">
              <span>Telefon raqami <em>*</em></span>
              <input value={values.phone} onChange={(event) => setField('phone', event.target.value)} placeholder="+998901234567" className={errors.phone ? 'is-invalid' : ''} />
              {errors.phone && <small>{errors.phone}</small>}
            </label>
            <label className="field">
              <span>Elektron pochta <em>*</em></span>
              <input type="email" value={values.email} onChange={(event) => setField('email', event.target.value)} placeholder="ism@example.uz" className={errors.email ? 'is-invalid' : ''} />
              {errors.email && <small>{errors.email}</small>}
            </label>
          </div>
        </div>

        <div className="form-section">
          <h3>Ish maʼlumotlari</h3>
          <div className="form-grid__columns">
            <label className="field">
              <span>Bo‘lim <em>*</em></span>
              <select value={values.departmentId} onChange={(event) => setField('departmentId', event.target.value)} className={errors.departmentId ? 'is-invalid' : ''}>
                <option value="">Bo‘lim tanlang</option>
                {departments.map((department) => <option value={department.id} key={department.id}>{department.name}</option>)}
              </select>
              {errors.departmentId && <small>{errors.departmentId}</small>}
            </label>
            <label className="field">
              <span>Lavozim <em>*</em></span>
              <select value={values.positionId} onChange={(event) => setField('positionId', event.target.value)} className={errors.positionId ? 'is-invalid' : ''} disabled={!values.departmentId}>
                <option value="">{values.departmentId ? 'Lavozim tanlang' : 'Avval bo‘limni tanlang'}</option>
                {availablePositions.map((position) => <option value={position.id} key={position.id}>{position.name}</option>)}
              </select>
              {errors.positionId && <small>{errors.positionId}</small>}
            </label>
            <label className="field">
              <span>Ishga kirgan sana <em>*</em></span>
              <input type="date" value={values.hireDate} onChange={(event) => setField('hireDate', event.target.value)} className={errors.hireDate ? 'is-invalid' : ''} />
              {errors.hireDate && <small>{errors.hireDate}</small>}
            </label>
            <label className="field">
              <span>Maosh (UZS) <em>*</em></span>
              <input inputMode="numeric" value={values.salary} onChange={(event) => setField('salary', event.target.value)} placeholder="5000000" className={errors.salary ? 'is-invalid' : ''} />
              {errors.salary && <small>{errors.salary}</small>}
            </label>
          </div>
        </div>

        <div className="form-section">
          <h3>Xodim rasmi</h3>
          <div className="photo-upload">
            <div className="photo-upload__preview">
              {preview ? <img src={preview} alt="Tanlangan rasm" /> : <Icon name="image" size={26} />}
            </div>
            <div className="photo-upload__actions">
              <label className="button button--secondary photo-upload__button">
                <Icon name="upload" size={16} /> Rasm tanlash
                <input type="file" accept="image/jpeg,image/png,image/webp" onChange={handlePhoto} hidden />
              </label>
              <span className="hint-text">JPG, PNG yoki WEBP · eng ko‘p 2 MB</span>
              {(photoFile || existingPhoto) && (
                <button
                  type="button"
                  className="text-button"
                  onClick={() => {
                    if (photoPreview.startsWith('blob:')) URL.revokeObjectURL(photoPreview)
                    setPhotoFile(null)
                    setPhotoPreview('')
                    setRemovePhoto(true)
                  }}
                >
                  Rasmni o‘chirish
                </button>
              )}
              {errors.photo && <small className="field-error">{errors.photo}</small>}
            </div>
          </div>
        </div>
      </form>
    </Modal>
  )
}
