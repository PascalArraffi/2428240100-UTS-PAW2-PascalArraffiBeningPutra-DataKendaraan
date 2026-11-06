export const requestTimeLogger = (req, res, next) => {
  const startTimestamp = Date.now()

  res.once('finish', () => {
    const endTimestamp = Date.now()

    console.log({
      timeStart: new Date(startTimestamp).toISOString(),
      timeEnd: new Date(endTimestamp).toISOString(),
      duration: endTimestamp - startTimestamp,
    })
  })

  next()
}