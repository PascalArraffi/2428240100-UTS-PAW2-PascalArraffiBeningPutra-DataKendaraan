export const logMiddleware = (req, res, next) => {
  const timeStart = Date.now()
  res.on('finish', () => {
    const timeEnd = Date.now()
    console.log({
      timeStart,
      timeEnd,
      duration: `${timeEnd - timeStart} ms`,
    })
  })
  next()
}