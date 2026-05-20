const request = require('supertest')
const app = require('../app')

jest.mock('../controllers/authController', () => ({
  register: (req, res) => res.status(201).json({ success: true, token: 'test-token' }),
  login: (req, res) => res.status(200).json({ success: true, token: 'test-token' })
}))

test('GET / returns static HTML', async () => {
  const res = await request(app).get('/')
  expect(res.statusCode).toBe(200)
  expect(res.text).toMatch(/<!DOCTYPE|<html/i)
})

test('POST /api/auth/register returns mocked token', async () => {
  const res = await request(app)
    .post('/api/auth/register')
    .send({ name: 'Test', email: 'test@example.com', password: 'pass1234' })

  expect(res.statusCode).toBe(201)
  expect(res.body.token).toBe('test-token')
})

test('POST /api/auth/login returns mocked token', async () => {
  const res = await request(app)
    .post('/api/auth/login')
    .send({ email: 'test@example.com', password: 'pass1234' })

  expect(res.statusCode).toBe(200)
  expect(res.body.token).toBe('test-token')
})
