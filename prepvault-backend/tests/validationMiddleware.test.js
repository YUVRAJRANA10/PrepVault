const validateExperience = require('../middleware/validationMiddleware')

function createRes() {
  return {
    statusCode: null,
    body: null,
    status(code) {
      this.statusCode = code
      return this
    },
    json(payload) {
      this.body = payload
      return this
    }
  }
}

test('rejects when company is missing', () => {
  const req = { body: { role: 'SDE', difficulty: '3', questions: ['q1'] } }
  const res = createRes()
  const next = jest.fn()

  validateExperience(req, res, next)

  expect(res.statusCode).toBe(400)
  expect(res.body.message).toMatch(/company and role are required/i)
  expect(next).not.toHaveBeenCalled()
})

test('rejects when difficulty is out of range', () => {
  const req = { body: { company: 'Google', role: 'SDE', difficulty: '9', questions: ['q1'] } }
  const res = createRes()
  const next = jest.fn()

  validateExperience(req, res, next)

  expect(res.statusCode).toBe(400)
  expect(res.body.message).toMatch(/difficulty must be a number between 1 and 5/i)
  expect(next).not.toHaveBeenCalled()
})

test('accepts valid payload and normalizes types', () => {
  const req = { body: { company: 'Google', role: 'SDE', difficulty: '4', rounds: '2', questions: '["q1","q2"]' } }
  const res = createRes()
  const next = jest.fn()

  validateExperience(req, res, next)

  expect(next).toHaveBeenCalled()
  expect(req.body.difficulty).toBe(4)
  expect(req.body.rounds).toBe(2)
  expect(req.body.questions).toEqual(['q1', 'q2'])
})
