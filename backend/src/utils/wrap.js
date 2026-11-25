export function wrap(handler) {
  return (req, res, next) => {
    try {
      const result = handler(req, res, next)
      if (result && typeof result.catch === 'function') result.catch(next)
    } catch (error) {
      next(error)
    }
  }
}
