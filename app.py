from flask import Flask, request, flash, json, jsonify
from uuid import uuid4
import os
import fitz

app = Flask(__name__)

@app.route('/api/upload', methods=['POST'])
def upload_file():
  if 'file' not in request.files:
    return jsonify(status='fail', message='No file uploaded')

  file = request.files['file']

  if file.filename == '':
    return jsonify(status='fail', message='No file uploaded')

  if file.filename.split('.').pop() != 'pdf':
    return jsonify(status='fail', message='File is not pdf')

  filename = uuid4()
  file.save(f'upload/{filename}.pdf')
  return jsonify(status='ok', message=f'{filename}.pdf')

@app.route('/api/summarize', methods=['POST'])
def summarize():
  if not request.is_json:
    return jsonify(status='fail', message='Not json request')
  data = request.get_json()

  if 'files' not in data:
    return jsonify(status='fail', message='File list not provided')

  files = data['files']

  if len(files) == 0 or type(files) != list:
    return jsonify(status='fail', message='File not provided')

  if len(files) > 5:
    return jsonify(status='fail', message='File maxium is 5')

  files = [file.replace('..', '').replace('/', '') for file in files]

  if 0 in [file.split('.').pop() == 'pdf' for file in files]:
    return jsonify(status='fail', message='File is not pdf')

  if 0 in [os.path.exists(f'upload/{file}') for file in files]:
    return jsonify(status='fail', message='File not exists')

  text = ''
  try:
    for file in files:
      with fitz.open(f'upload/{file}') as doc:
        for page in doc:
          text += page.get_text()
  except Exception as e:
    print(e)
  
  return ''

if __name__ == '__main__':
  app.run()