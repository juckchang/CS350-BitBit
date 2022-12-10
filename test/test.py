import unittest
import requests
import json
import re

class UnitTest(unittest.TestCase):
  def setUp(self):
    self.host = 'http://localhost'

  def test_upload(self):
    f = open('test.pdf', 'rb')
    res = requests.post(self.host + '/api/upload', files={'file': f})
    f.close()

    self.assertEqual(res.status_code, 200)
    try:
      result = json.loads(res.text)
    except:
      self.assertRaises(ValueError)
    
    self.assertEqual(result['status'], 'ok')

    res = re.fullmatch("^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}.pdf$", result['message'])
    self.assertEqual(res is not None, True)

    return result['message']

  def test_summarize(self):
    uploadFile = [self.test_upload(), self.test_upload()]
    res = requests.post(self.host + '/api/summarize', json={'files': uploadFile, 'option': 0})
    try:
      result = json.loads(res.text)
    except:
      self.assertRaises(ValueError)
    
    self.assertEqual(result['status'], 'ok')

    res = re.fullmatch("^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}.pdf$", result['message'])
    self.assertEqual(res is not None, True)

    return result['message']

  def test_view(self):
    result = self.test_summarize()
    res = requests.get(self.host + '/' + result)
    self.assertEqual(res.headers['Content-Type'], 'application/pdf')

  def test_delete(self):
    result = self.test_summarize()
    res = requests.get(self.host + '/api/delete/' + result)
    try:
      result = json.loads(res.text)
    except:
      self.assertRaises(ValueError)
    
    self.assertEqual(result['status'], 'ok')

  def test_email(self):
    result = self.test_summarize()
    data = {
      'file': result,
      'email': 'juchang0308@gmail.com'
    }
    res = requests.post(self.host + '/api/sendEmail', json=data)
    try:
      result = json.loads(res.text)
    except:
      self.assertRaises(ValueError)
    
    self.assertEqual(result['status'], 'ok')

if __name__ == '__main__':
  unittest.main()